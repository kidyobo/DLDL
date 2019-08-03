import { Global as G } from 'System/global'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ZhufuData } from 'System/data/ZhufuData'
import { JJRRewardItem } from 'System/jinjieri/JjrRewardItem'
import { JjrRewardsItemData } from 'System/data/JjrRewardsItemData'
import { KfhdData } from 'System/data/KfhdData'

class JinJieRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;

    private bg1: UnityEngine.UI.Image;
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');

        this.bg1 = ElemFinderMySelf.findImage(go);
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(rank: number, info: Protocol.StageDayRankOne) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szName;

            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
        }

        this.bg1.enabled = rank % 2 == 0
        this.bg2.SetActive(rank % 2 == 1);
    }
}

export class JinJieRankPanel extends TabSubForm {

    private readonly TickKey = 'tick';
    private displayCnt = 5;

    private list: List;
    private items: JinJieRankItem[] = [];
    private textTitle: UnityEngine.UI.Text;
    private textInfo: UnityEngine.UI.Text;
    private textRule: UnityEngine.UI.Text;
    private textSum: UnityEngine.UI.Text;
    private textCountDown: UnityEngine.UI.Text;

    private textTip1: UnityEngine.UI.Text;
    private icon1 = new IconItem();
    private textTip2: UnityEngine.UI.Text;
    private icon2 = new IconItem();

    private tipBg1: UnityEngine.GameObject;
    private tipBg2: UnityEngine.GameObject;

    private type2modelRoot: { [type: number]: UnityEngine.GameObject } = {}

    private cfgId = 0;

    private listDisplayFlag: boolean = false;

    private rewardItems: JJRRewardItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    private rewardItem1: UnityEngine.GameObject;
    private rewardItem2: UnityEngine.GameObject;

    protected resPath(): string {
        return UIPathData.JinJieRankPanel;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList('list');
        this.textTitle = this.elems.getText('textTitle');
        this.textInfo = this.elems.getText('textInfo');
        this.textRule = this.elems.getText('textRule');
        this.textSum = this.elems.getText('textSum');
        this.textCountDown = this.elems.getText('textCountDown');
        this.rewardItem1 = this.elems.getElement('item1');
        this.rewardItem2 = this.elems.getElement('item2');

        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.textTip1 = this.elems.getText('textTip1');
        this.icon1.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('icon1'));
        this.icon1.setTipFrom(TipFrom.normal);
        this.textTip2 = this.elems.getText('textTip2');
        this.icon2.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('icon2'));
        this.icon2.setTipFrom(TipFrom.normal);

        this.tipBg1 = this.elems.getElement('tipBg1');
        this.tipBg2 = this.elems.getElement('tipBg2');

        this.type2modelRoot[KeyWord.HERO_SUB_TYPE_ZUOQI] = this.elems.getElement('modelRoot1');
        this.type2modelRoot[KeyWord.HERO_SUB_TYPE_WUHUN] = this.elems.getElement('modelRoot2');
        this.type2modelRoot[KeyWord.HERO_SUB_TYPE_FAZHEN] = this.elems.getElement('modelRoot3');
        this.type2modelRoot[KeyWord.HERO_SUB_TYPE_LEILING] = this.elems.getElement('modelRoot4');
        this.type2modelRoot[KeyWord.HERO_SUB_TYPE_YUYI] = this.elems.getElement('modelRoot5');
    }

    protected initListeners(): void {
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAT_RANK_OPEN_PANEL));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAY_OPEN_PANEL));
        this.addTimer(this.TickKey, 1000, 0, this.onTickTimer);
    }

    protected onClose() {
    }

    private onTickTimer(timer: Game.Timer): void {
        let time = G.SyncTime.getServerZeroLeftTime();
        this.textCountDown.text = G.DataMgr.langData.getLang(199, DataFormatter.second2day(time));
    }

    onJinJieRankChange() {
        let kfhdData = G.DataMgr.kfhdData;
        let jinJieRankInfo = kfhdData.jinJieRankInfo;
        if (!jinJieRankInfo) {
            return;
        }
        let cfg = jinJieRankInfo.m_stCfgInfo;
        let thingCfg = ThingData.getThingConfig(cfg.m_iCostItemID);

        let sysName = TextFieldUtil.getColorText(thingCfg.m_szName, Color.getColorById(thingCfg.m_ucColor)); 
        this.textSum.text = uts.format('今日已消耗{0}个{1}', TextFieldUtil.getColorText(jinJieRankInfo.m_iUsedCount.toString(), Color.GREEN), sysName);

        if (cfg.m_iID != this.cfgId) {
            this.cfgId = cfg.m_iID;

            this.textRule.text = uts.format(G.DataMgr.langData.getLang(0 != cfg.m_bLoop ? 447 : 446), cfg.m_iNumber, cfg.m_iConsume, sysName);
            let championCfg: Protocol.TwoIntElement;
            if (cfg.m_stFirstItem.length > 0) {
                let c = cfg.m_stFirstItem[0];
                if (c.m_uiOne > 0) {
                    championCfg = c;
                }
            }

            if (championCfg) {
                this.textTip1.text = uts.format('{0}消耗第1名获得{1}*{2}，完成外形终极进化',
                    sysName, TextFieldUtil.getItemText(ThingData.getThingConfig(championCfg.m_uiOne)), championCfg.m_uiTwo);
                this.textTip1.gameObject.SetActive(true);
                this.icon1.updateById(championCfg.m_uiOne, championCfg.m_uiTwo);
                this.icon1.updateIcon();
                this.icon1.gameObject.SetActive(true);

                this.tipBg1.SetActive(true);
                //this.tipBg2.SetActive(false);
                this.displayCnt = 5;
            } else {
                this.textTip1.gameObject.SetActive(false);
                this.icon1.gameObject.SetActive(false);

                this.tipBg1.SetActive(false);
                this.tipBg2.SetActive(true);
                this.displayCnt = 7;
            }

            let shareCfg = cfg.m_stOtherItem[0];
            this.textTip2.text = uts.format('{0}消耗前{1}名获得{2}*{3}', sysName, cfg.m_iNumber,
                TextFieldUtil.getItemText(ThingData.getThingConfig(shareCfg.m_uiOne)), shareCfg.m_uiTwo);
            this.icon2.updateById(shareCfg.m_uiOne, shareCfg.m_uiTwo);
            this.icon2.updateIcon();

            for (let typeKey in this.type2modelRoot) {
                let modelRoot = this.type2modelRoot[typeKey];
                if (parseInt(typeKey) == cfg.m_ucModelType) {
                    modelRoot.gameObject.SetActive(true);
                    G.ResourceMgr.loadModel(modelRoot, ZhufuData.getUnitTypeByZFType(cfg.m_ucModelType), cfg.m_iModelID.toString(), this.sortingOrder); 
                } else {
                    modelRoot.gameObject.SetActive(false);
                }
            }

            this.textTitle.text = uts.format('今日{0}消耗前{1}名', sysName, this.displayCnt);
        }

        if (!this.listDisplayFlag) {
            this.list.Count = this.displayCnt;
            for (let i = 0; i < this.displayCnt; i++) {
                let item = new JinJieRankItem();
                this.items.push(item);
                item.setComponents(this.list.GetItem(i).gameObject);

                if (!this.listDisplayFlag)
                    this.listDisplayFlag = true;
            }
        }

        this.displayCnt = this.list.Count;
        for (let i = 0; i < this.displayCnt; i++) {
            let item = this.items[i];
            item.update(i + 1, i < jinJieRankInfo.m_iRankCount ? jinJieRankInfo.m_stRankList[i] : null);
        }

        if (jinJieRankInfo.m_iMyRank > 0) {
            if (jinJieRankInfo.m_iMyRank == 1) {
                this.textInfo.text = uts.format('我的今日排名：{0}', TextFieldUtil.getColorText(jinJieRankInfo.m_iMyRank.toString(), Color.GREEN));
            } else {
                this.textInfo.text = uts.format('我的今日排名：{0}\n再消耗{1}个{2}\n可提升排名', TextFieldUtil.getColorText(jinJieRankInfo.m_iMyRank.toString(), Color.RED),
                    TextFieldUtil.getColorText(jinJieRankInfo.m_iNeedCost.toString(), Color.GREEN), sysName);
            }
        } else {
            this.textInfo.text = uts.format('我的今日排名：{0}\n再消耗{1}个{2}可上榜', TextFieldUtil.getColorText('未上榜', Color.RED),
                TextFieldUtil.getColorText(jinJieRankInfo.m_iNeedCost.toString(), Color.GREEN), sysName);
        }
    }

    updateRewardList() {
        //更新两个奖励领取
        if (!this.kfhdData.JJRPanelInfo) {
            return;
        }
        let m_rewardData: Protocol.StageDayInfo = this.kfhdData.JJRPanelInfo;
        let today = G.SyncTime.getDateAfterStartServer();
        let curDay = (today - 1) % KeyWord.STAGEDAY_TYPE_MAX + 1;
        let typeDatas: GameConfig.StageDayCfgM[] = G.DataMgr.activityData.getJjrDayConfig(curDay);

        let itemDate: JjrRewardsItemData;
        let iteamDateList: JjrRewardsItemData[] = new Array<JjrRewardsItemData>();
        for (let i: number = 0; i < typeDatas.length; i++) {
            let cfg: GameConfig.StageDayCfgM = typeDatas[i];
            if (cfg.m_iShow == 0 || cfg.m_iShow >= today) {
                itemDate = new JjrRewardsItemData();
                itemDate.cfg = cfg;
                for (let j of m_rewardData.m_stOneStatusList) {
                    if (j.m_iCfgID == itemDate.cfg.m_iID) {
                        itemDate.m_ucStatus = j.m_ucStatus;
                        break;
                    }
                }
                iteamDateList.push(itemDate);
            }
        }
        this.showUI(iteamDateList);
    }

    private showUI(data: JjrRewardsItemData[]) {
        if (data == null) return;
        if (this.rewardItems[0] == null) {
            this.rewardItems[0] = new JJRRewardItem();
            this.rewardItems[0].setComponents(this.rewardItem1, this.itemIcon_Normal);
        }
        this.rewardItems[0].updata(data[0]);


        let len: number = data.length; 
        let showIndex: number = len - 1;
        for (let i = 1; i < len; i++){
            if (data[i].m_ucStatus != 3) {
                showIndex = i;
                break;
            }
        }

        if (this.rewardItems[1] == null) {
            this.rewardItems[1] = new JJRRewardItem();
            this.rewardItems[1].setComponents(this.rewardItem2, this.itemIcon_Normal);
        }
        this.rewardItems[1].updata(data[showIndex]);
    }

    updataViewReward(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAY_OPEN_PANEL));
    }

    get kfhdData(): KfhdData {
        return G.DataMgr.kfhdData;
    }
}