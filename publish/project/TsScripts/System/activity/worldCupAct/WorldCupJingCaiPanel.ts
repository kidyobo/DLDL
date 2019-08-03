import { UILayer } from 'System/uilib/CommonForm'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from 'System/uilib/List'
import { Global as G } from 'System/global'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from "System/protocol/Macros"
import { UIUtils } from 'System/utils/UIUtils'
import { KeyWord } from 'System/constants/KeyWord'
import { DataFormatter } from "System/utils/DataFormatter"
import { ActivityRuleView } from "System/diandeng/ActivityRuleView"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MathUtil } from "System/utils/MathUtil"
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { WorldCupJingCaiView } from "System/activity/worldCupAct/WorldCupJingCaiView"
import { WorldCupBiFenJingCaiView } from "System/activity/worldCupAct/WorldCupBiFenJingCaiView"
import { WorldCupRankView } from "System/activity/worldCupAct/WorldCupRankView"
import { Constants } from 'System/constants/Constants'

class ProgressItem extends ListItemCtrl {
    private des: UnityEngine.UI.Text;
    private slider: UnityEngine.UI.Slider;
    private m_luckySliderValue: number;
    private set luckySliderValue(value: number) {
        if (this.m_luckySliderValue != value) {
            this.m_luckySliderValue = value;
            this.slider.value = value;
        }
    }

    setComponents(go: UnityEngine.GameObject) {
        this.slider = ElemFinder.findSlider(go, 'slider');
        this.des = ElemFinder.findText(go, 'slider/des');
    }

    update(curBet: number, titleBet: number, country: string) {
        let value: number = 0;
        if (titleBet != 0) {
            value = curBet / titleBet;
        }

        this.luckySliderValue = value;
        this.des.text = country + Math.floor(value * 100).toString() + "%";
    }
}


class ShengfuItem extends ListItemCtrl {
    private Country1: UnityEngine.UI.Image;
    private Country2: UnityEngine.UI.Image;
    private CountryName1: UnityEngine.UI.Text;
    private CountryName2: UnityEngine.UI.Text;
    private score1: UnityEngine.UI.Text;
    private score2: UnityEngine.UI.Text;
    private SupportDes: UnityEngine.UI.Text;
    private rewPool: UnityEngine.UI.Text;
    private SupportProgressList: List;
    private WCupOneGameInfo: Protocol.WCupOneGameInfo;
    private ProgressItems: ProgressItem[] = [];
    private ProgressObjItems: UnityEngine.GameObject[] = [];
    private betTypes: number[] = [1, 3, 2];
    private resultCountrys: string[] = [];
    private readonly gameResultNum: number = 3;

    setComponents(go: UnityEngine.GameObject) {
        this.Country1 = ElemFinder.findImage(go, 'Country1');
        this.Country2 = ElemFinder.findImage(go, 'Country2');
        this.CountryName1 = ElemFinder.findText(go, 'CountryName1');
        this.CountryName2 = ElemFinder.findText(go, "CountryName2");
        this.SupportDes = ElemFinder.findText(go, "SupportDes");
        this.score1 = ElemFinder.findText(go, 'score1');
        this.score2 = ElemFinder.findText(go, "score2");
        this.rewPool = ElemFinder.findText(go, "rewPool");

        for (let i = 0; i < this.gameResultNum; i++) {
            this.ProgressObjItems[i] = ElemFinder.findObject(go, 'SupportProgressList/' + i.toString());
            Game.UIClickListener.Get(this.ProgressObjItems[i]).onClick = delegate(this, this.onClickProgressItem, i);
        }
    }

    update(data: Protocol.WCupOneGameInfo) {
        this.WCupOneGameInfo = data;
        let activityData = G.DataMgr.activityData;
        let CountryName1: string = activityData.countryIndexId2CfgMap[data.m_iMainTeamID].m_szDesc;
        let CountryName2: string = activityData.countryIndexId2CfgMap[data.m_iVisitTeamID].m_szDesc;
        this.CountryName1.text = CountryName1;
        this.CountryName2.text = CountryName2;
        this.Country1.sprite = WorldCupActView.CountryAltas.Get(CountryName1);
        this.Country2.sprite = WorldCupActView.CountryAltas.Get(CountryName2);


        let countrys: string[] = [CountryName1 + '胜', '平局', CountryName2 + '胜'];
        this.resultCountrys = [CountryName1 + '胜', CountryName2 + '胜', '平局'];

        //已过期和进行中要显示比分
        this.score1.gameObject.SetActive(data.m_ucState == KeyWord.WORLDCPU_STATE_EXPIRED || data.m_ucState == KeyWord.WORLDCPU_STATE_WAIT);
        this.score2.gameObject.SetActive(data.m_ucState == KeyWord.WORLDCPU_STATE_EXPIRED || data.m_ucState == KeyWord.WORLDCPU_STATE_WAIT);
        this.score1.text = data.m_iMainGoal.toString();
        this.score2.text = data.m_iVisitGoal.toString();

        if (data.m_iRoleBetType == 0) {
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let endTime = this.WCupOneGameInfo.m_uiBetEndTime;
            let startTime = this.WCupOneGameInfo.m_uiBetStartTime;

            if (now > startTime && now < endTime) {
                this.SupportDes.text = '未支持：点击选择您支持的赛果';
            }
            else {
                this.SupportDes.text = '未支持：您未选择支持任何赛果';
            }
        }
        else {
            this.SupportDes.text = uts.format('已支持：您选择支持了{0}，支持了：{1}次', this.resultCountrys[data.m_iRoleBetType - 1], data.m_iRoleBetNum);
        }


        let oldItemCnt = this.ProgressItems.length;
        let item: ProgressItem;
        let betData: number[] = [data.m_iWinBet, data.m_iTieBet, data.m_iLoseBet];
        let titleBet: number = data.m_iWinBet + data.m_iTieBet + data.m_iLoseBet;

        let needScore: number = G.DataMgr.constData.getValueById(KeyWord.PARAM_WORLDCUP_BET_WIN_PIRCE);
        let titleNum: number = needScore * 5 * titleBet + Constants.WorldCupMinRewPoolNum;
        this.rewPool.text = uts.format('奖池:{0}绑钻', titleNum);

        for (let i = 0; i < this.gameResultNum; i++) {
            if (i < oldItemCnt) {
                item = this.ProgressItems[i];
            } else {
                this.ProgressItems.push(item = new ProgressItem());
                item.setComponents(this.ProgressObjItems[i]);
            }
            item.update(betData[i], titleBet, countrys[i]);
        }
    }


    private onClickProgressItem(index: number) {
        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let endTime = this.WCupOneGameInfo.m_uiBetEndTime;
        let startTime = this.WCupOneGameInfo.m_uiBetStartTime;

        if (this.WCupOneGameInfo.m_ucState != KeyWord.WORLDCPU_STATE_EXPIRED) {
            if (endTime < now || startTime > now) {
                G.TipMgr.addMainFloatTip('不在支持时间段');
                return;
            }

            if (this.WCupOneGameInfo.m_iRoleBetType == 0 || this.WCupOneGameInfo.m_iRoleBetType == this.betTypes[index]) {
                G.Uimgr.createForm<WorldCupJingCaiView>(WorldCupJingCaiView).open(this.WCupOneGameInfo, this.betTypes[index]);
            }
            else {
                G.TipMgr.addMainFloatTip(uts.format('您已经选择了支持{0}', this.resultCountrys[this.WCupOneGameInfo.m_iRoleBetType - 1]));
            }
        }
    }

}



export class BiFenInfoItem extends ListItemCtrl {
    private score: UnityEngine.UI.Text;
    private peiLv: UnityEngine.UI.Text;
    private betNum: UnityEngine.UI.Text;
    private bg: UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject) {
        this.score = ElemFinder.findText(go, "score");
        this.peiLv = ElemFinder.findText(go, "peiLv");
        this.betNum = ElemFinder.findText(go, "betNum");
        this.bg = ElemFinder.findObject(go, 'bg');
    }

    update(biFen: string, peiLv: number, betNum: number, index: number) {

        let isTipColor: boolean = betNum > 0 ? true : false;
        this.score.text = TextFieldUtil.getColorText(biFen, isTipColor ? Color.YELLOW : Color.WHITE);
        this.peiLv.text = TextFieldUtil.getColorText(Math.floor(peiLv / 100).toString(), isTipColor ? Color.YELLOW : Color.WHITE);
        this.betNum.text = TextFieldUtil.getColorText(betNum.toString(), isTipColor ? Color.YELLOW : Color.WHITE);
        this.bg.SetActive(index % 2 != 0);

    }

}

class BiFenItem extends ListItemCtrl {
    private confirmBtn: UnityEngine.GameObject;
    private vsCountry: UnityEngine.UI.Text;
    private biFenList: List;
    private WCupOneGameInfo: Protocol.WCupOneGameInfo;
    private BiFenInfoItems: BiFenInfoItem[] = [];

    setComponents(go: UnityEngine.GameObject) {
        this.biFenList = ElemFinder.getUIList((ElemFinder.findObject(go, 'resultList')));
        this.vsCountry = ElemFinder.findText(go, "vsCountry");
        this.confirmBtn = ElemFinder.findObject(go, "confirmBtn");
        Game.UIClickListener.Get(this.confirmBtn).onClick = delegate(this, this.onClickConfirmBtn);
    }

    update(data: Protocol.WCupOneGameInfo, isLookHistory: boolean) {

        this.WCupOneGameInfo = data;
        let activityData = G.DataMgr.activityData;

        let CountryName1: string = activityData.countryIndexId2CfgMap[data.m_iMainTeamID].m_szDesc;
        let CountryName2: string = activityData.countryIndexId2CfgMap[data.m_iVisitTeamID].m_szDesc;
        this.vsCountry.text = CountryName1 + " VS " + CountryName2;
        this.biFenList.Count = Macros.MAX_WCUP_BETSCOR_COUNT;
        let oldItemCnt = this.BiFenInfoItems.length;
        let item: BiFenInfoItem;
        let PeiLvInfo: Protocol.WCupOnePeiLv[] = data.m_astPeiLvInfo;
        for (let i = 0; i < Macros.MAX_WCUP_BETSCOR_COUNT; i++) {
            if (i < oldItemCnt) {
                item = this.BiFenInfoItems[i];
            } else {
                this.BiFenInfoItems.push(item = new BiFenInfoItem());
                item.setComponents(this.biFenList.GetItem(i).gameObject);
            }

            let m: number = i == Macros.MAX_WCUP_BETSCOR_COUNT - 1 ? 0 : i + 1;
            let bifenIndexData = G.DataMgr.activityData.scoreIndexId2CfgMap[m];
            item.update(bifenIndexData.m_szDesc, PeiLvInfo[m].m_iPeiLv, PeiLvInfo[m].m_iRoleBetNum, i);
        }

        UIUtils.setButtonClickAble(this.confirmBtn, !isLookHistory);
    }

    private onClickConfirmBtn() {

        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let endTime = this.WCupOneGameInfo.m_uiBetEndTime;
        let startTime = this.WCupOneGameInfo.m_uiBetStartTime;
        if (endTime < now || startTime > now) {
            G.TipMgr.addMainFloatTip('不在支持时间段');
        } else {
            //弹比分投注面板
            G.Uimgr.createForm<WorldCupBiFenJingCaiView>(WorldCupBiFenJingCaiView).open(this.WCupOneGameInfo);
        }

    }
}


export class WorldCupJingCaiPanel extends TabSubForm {
    private lookHistoryBtn: UnityEngine.GameObject;
    private lookHistoryReturnBtn: UnityEngine.GameObject;
    private closeBtn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;
    private btnRank: UnityEngine.GameObject;
    private benLunJingCaiTitle: UnityEngine.GameObject;
    private shangLunJingCaiTitle: UnityEngine.GameObject;
    private betTime: UnityEngine.UI.Text;

    private shengFuList: List;
    private biFenList: List;

    private ShengfuItems: ShengfuItem[] = [];
    private BiFenItems: BiFenItem[] = [];
    private isLookHistory: boolean = false;

    constructor() {
        super(Macros.ACTIVITY_ID_WORLDCUP);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.WorldCupJingCaiPanel;
    }

    protected initElements() {
        super.initElements();
        this.lookHistoryBtn = this.elems.getElement('lookHistoryBtn');
        this.lookHistoryReturnBtn = this.elems.getElement('lookHistoryReturnBtn');
        this.btnRule = this.elems.getElement('btnRule');
        this.btnRank = this.elems.getElement('btnRank');
        this.shengFuList = this.elems.getUIList('shengFuList');
        this.biFenList = this.elems.getUIList('biFenList');
        this.benLunJingCaiTitle = this.elems.getElement('benLunJingCaiTitle');
        this.shangLunJingCaiTitle = this.elems.getElement('shangLunJingCaiTitle');
        this.betTime = this.elems.getText('betTime');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.lookHistoryBtn, this.onClicklookHistoryBtn);
        this.addClickListener(this.lookHistoryReturnBtn, this.onClicklookHistoryReturnBtn);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnRank, this.onClickBtnRank);

    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_PANEL));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_RANK));
        this.updateView();
    }

    updateView() {
        this.lookHistoryBtn.SetActive(!this.isLookHistory);
        this.lookHistoryReturnBtn.SetActive(this.isLookHistory);
        this.benLunJingCaiTitle.SetActive(!this.isLookHistory);
        this.shangLunJingCaiTitle.SetActive(this.isLookHistory);
        let panelData = G.DataMgr.activityData.worldCupPanelData;
        if (panelData == null || panelData.m_ucNum == 0) return;
        let GameInfo: Protocol.WCupOneGameInfo[];
        let length: number = 0;
        if (this.isLookHistory) {
            GameInfo = panelData.m_astLastGameInfo;
            length = panelData.m_ucLastNum;
        }
        else {
            GameInfo = panelData.m_astGameInfo;
            length = panelData.m_ucNum;
        }
        this.shengFuList.Count = length;
        this.biFenList.Count = length;
        UIUtils.setButtonClickAble(this.lookHistoryBtn, panelData.m_ucLastNum != 0);
        this.updateShengfuJingCaiView(GameInfo, length);
        this.updateBiFenJingCaiView(GameInfo, length);

        let nowGameInfo = panelData.m_astGameInfo;
        this.betTime.text = TextFieldUtil.getColorText(uts.format('支持时间：{0}—{1}', DataFormatter.second2mmddmm(nowGameInfo[0].m_uiBetStartTime), DataFormatter.second2mmddmm(nowGameInfo[0].m_uiBetEndTime)), Color.GREEN);
    }

    //胜负竞猜面板
    updateShengfuJingCaiView(data: Protocol.WCupOneGameInfo[], gameNum: number) {
        this.shengFuList.Count = gameNum;
        let oldItemCnt = this.ShengfuItems.length;
        let item: ShengfuItem;
        for (let i = 0; i < gameNum; i++) {
            if (i < oldItemCnt) {
                item = this.ShengfuItems[i];
            } else {
                this.ShengfuItems.push(item = new ShengfuItem());
                item.setComponents(this.shengFuList.GetItem(i).gameObject);
            }
            item.update(data[i]);
        }

    }

    //比分竞猜面板
    updateBiFenJingCaiView(data: Protocol.WCupOneGameInfo[], gameNum: number) {
        this.biFenList.Count = gameNum;
        let oldItemCnt = this.BiFenItems.length;
        let item: BiFenItem;
        for (let i = 0; i < gameNum; i++) {
            if (i < oldItemCnt) {
                item = this.BiFenItems[i];
            } else {
                this.BiFenItems.push(item = new BiFenItem());
                item.setComponents(this.biFenList.GetItem(i).gameObject);
            }
            item.update(data[i], this.isLookHistory);
        }
    }

    private onClicklookHistoryBtn() {
        this.isLookHistory = true;
        this.updateView();
    }

    private onClicklookHistoryReturnBtn() {
        this.isLookHistory = false;
        this.updateView();
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(453), '火热世界杯');
    }

    private onClickBtnRank() {
        G.Uimgr.createForm<WorldCupRankView>(WorldCupRankView).open();
    }
    private onClickCloseBtn() {
        this.close();
    }
}