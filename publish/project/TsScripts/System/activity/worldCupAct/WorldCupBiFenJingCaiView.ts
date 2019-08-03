import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { Macros } from "System/protocol/Macros"
import { UIPathData } from 'System/data/UIPathData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { BiFenInfoItem } from 'System/activity/worldCupAct/WorldCupJingCaiPanel'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst } from "System/tip/TipManager"
import { ConfirmCheck } from "System/tip/TipManager"
import { Constants } from 'System/constants/Constants'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'

class BiFenJingCaiItem extends ListItemCtrl {
    private score: UnityEngine.UI.Text;
    private peiLv: UnityEngine.UI.Text;
    private betNum: UnityEngine.UI.Text;
    private reduceBtn: UnityEngine.GameObject;
    private addBtn: UnityEngine.GameObject;
    private bg: UnityEngine.GameObject;
    private curBetNum: number = 0;
    private curIndex: number = 0;

    setComponents(go:UnityEngine.GameObject) {
        this.score = ElemFinder.findText(go, 'score');
        this.peiLv = ElemFinder.findText(go, 'peiLv');
        this.betNum = ElemFinder.findText(go, 'betNum');
        this.reduceBtn = ElemFinder.findObject(go, 'reduceBtn');
        this.addBtn = ElemFinder.findObject(go, 'addBtn');
        this.bg = ElemFinder.findObject(go,'bg');
        Game.UIClickListener.Get(this.reduceBtn).onClick = delegate(this, this.onClickReduceBtn);
        Game.UIClickListener.Get(this.addBtn).onClick = delegate(this, this.onClickAddBtn);
    }

    update(biFen: string, peiLv: number, index: number, roleBetNum:number) {

        let isTipColor: boolean = roleBetNum > 0 ? true : false;
        this.curIndex = index;
        this.curBetNum = 0;
        this.betNum.text = TextFieldUtil.getColorText('x' + this.curBetNum.toString(), isTipColor ? Color.YELLOW : Color.WHITE);
        this.score.text = TextFieldUtil.getColorText(biFen, isTipColor ? Color.YELLOW : Color.WHITE);
        this.peiLv.text = TextFieldUtil.getColorText(uts.format('返利{0}倍', Math.floor(peiLv / 100)), isTipColor ? Color.YELLOW : Color.WHITE);
        this.bg.SetActive(index %2!=0);
    }

   

    private onClickReduceBtn() {
        this.curBetNum--;
        if (this.curBetNum < 0){
            this.curBetNum = 0;
        }
        this.betNum.text = 'x'+ this.curBetNum.toString();
        WorldCupBiFenJingCaiView.betNums[this.curIndex] = this.curBetNum;
    }

    private onClickAddBtn() {
        this.curBetNum++;
        this.betNum.text = 'x'+this.curBetNum.toString();
        WorldCupBiFenJingCaiView.betNums[this.curIndex] = this.curBetNum;
    }
}

export class WorldCupBiFenJingCaiView extends CommonForm {
    private vsCountry: UnityEngine.UI.Text;
    private confirmBtn: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private List: List;
    private countryLeft: UnityEngine.UI.Image;
    private countryRight: UnityEngine.UI.Image;
    private BiFenJingCaiItems: BiFenJingCaiItem[] = [];
    private WCupOneGameInfo: Protocol.WCupOneGameInfo;
    static betNums:number[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WorldCupBiFenJingCaiView;
    }

    protected initElements() {
        this.confirmBtn = this.elems.getElement('confirmBtn');
        this.btnClose = this.elems.getElement('btnClose');
        this.mask = this.elems.getElement('mask');
        this.List = this.elems.getUIList('List');
        this.countryLeft = this.elems.getImage('countryLeft');
        this.countryRight = this.elems.getImage('countryRight');
        this.vsCountry = this.elems.getText('vsCountry');

    }

    protected initListeners() {
        this.addClickListener(this.confirmBtn, this.onClickConfirmBtn);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
    }

    open(WCupOneGameInfo: Protocol.WCupOneGameInfo) {
        this.WCupOneGameInfo = WCupOneGameInfo;
        super.open();
    }

    protected onOpen() {
        let activityData = G.DataMgr.activityData;
        let PeiLvInfo: Protocol.WCupOnePeiLv[] = this.WCupOneGameInfo.m_astPeiLvInfo;
        let length = PeiLvInfo.length; 
        for (let i = 0; i < length;i++){
            WorldCupBiFenJingCaiView.betNums[i] = 0;
        }
        let CountryName1: string = activityData.countryIndexId2CfgMap[this.WCupOneGameInfo.m_iMainTeamID].m_szDesc;
        let CountryName2: string = activityData.countryIndexId2CfgMap[this.WCupOneGameInfo.m_iVisitTeamID].m_szDesc;
        this.countryLeft.sprite = WorldCupActView.CountryAltas.Get(CountryName1);
        this.countryRight.sprite = WorldCupActView.CountryAltas.Get(CountryName2);
        this.vsCountry.text = CountryName1 + " VS " + CountryName2;

        let oldItemCnt = this.BiFenJingCaiItems.length;
        let item: BiFenJingCaiItem;
        
       
        this.List.Count = length;
        for (let i = 0; i < length; i++) {
            if (i < oldItemCnt) {
                item = this.BiFenJingCaiItems[i];
            } else {
                this.BiFenJingCaiItems.push(item = new BiFenJingCaiItem());
                item.setComponents(this.List.GetItem(i).gameObject);
            }
            let m: number = i == length - 1 ? 0 : i + 1;
            let bifenIndexData = G.DataMgr.activityData.scoreIndexId2CfgMap[m];
            item.update(bifenIndexData.m_szDesc, PeiLvInfo[m].m_iPeiLv, m, PeiLvInfo[m].m_iRoleBetNum );
        }
    }

    private onClickConfirmBtn() {
        let titleBetNum: number = 0;
        let oneScoreTitleNum: number = 0;
        for (let i = 0; i < Macros.MAX_WCUP_BETSCOR_COUNT; i++) {
            let curBetNum: number = WorldCupBiFenJingCaiView.betNums[i];
            oneScoreTitleNum = this.WCupOneGameInfo.m_astPeiLvInfo[i].m_iRoleBetNum + curBetNum;
            if (oneScoreTitleNum >= Constants.WorldCupOneScoreMaxBet)
            {
                G.TipMgr.addMainFloatTip('有单个比分超过了做大投注数');
                return;
            }
            titleBetNum += curBetNum;
        }

        if (titleBetNum == 0) {
            G.TipMgr.addMainFloatTip('请选择您支持的比分');
            return;
        }

        let needScore: number = G.DataMgr.constData.getValueById(KeyWord.PARAM_WORLDCUP_BET_SCORE_PIRCE) * titleBetNum;
        let des = uts.format('您当前支持需要花费{0}钻石，是否支持？\n可获得返利{1}绑钻', TextFieldUtil.getColorText(needScore.toString(), Color.YELLOW), TextFieldUtil.getColorText((needScore * 5).toString(), Color.YELLOW));
        G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGotoHomeBossConfirm));
    }

    onGotoHomeBossConfirm(stage: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_BET_SCORE, this.WCupOneGameInfo.m_iGameID, WorldCupBiFenJingCaiView.betNums, Macros.MAX_WCUP_BETSCOR_COUNT));
            this.close();
        }
    }


    private onClickBtnClose(){
        this.close();
    }

}
