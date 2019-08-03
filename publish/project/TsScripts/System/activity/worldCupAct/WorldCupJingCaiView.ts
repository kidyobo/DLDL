import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { Macros } from "System/protocol/Macros"
import { UIPathData } from 'System/data/UIPathData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { DropPlanData } from 'System/data/DropPlanData'
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { MessageBoxConst } from "System/tip/TipManager"
import { ConfirmCheck } from "System/tip/TipManager"


export class WorldCupJingCaiView extends CommonForm {

    private countryIcon: UnityEngine.UI.Image;
    private supportCountry: UnityEngine.UI.Text;
    private supportNum: UnityEngine.UI.Text;
    private betNumLabel: UnityEngine.UI.Text;
    private reduceBtn: UnityEngine.GameObject;
    private addBtn: UnityEngine.GameObject;
    private confirmBtn: UnityEngine.GameObject;
    private WCupOneGameInfo: Protocol.WCupOneGameInfo;
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private rewList: List;
    private countryName: string = '';
    private supportType: number = -1;
    private betNum: number = 1;
    private rewDropId: number = 60623014;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WorldCupJingCaiView;
    }

    open(WCupOneGameInfo: Protocol.WCupOneGameInfo, supportType: number) {
       
        this.WCupOneGameInfo = WCupOneGameInfo;
        this.supportType = supportType;
        super.open();
    }

    protected initElements() {
        this.countryIcon = this.elems.getImage('countryIcon');
        this.supportCountry = this.elems.getText('supportCountry');
        this.supportNum = this.elems.getText('supportNum');
        this.betNumLabel = this.elems.getText('betNum');
        this.reduceBtn = this.elems.getElement('reduceBtn');
        this.addBtn = this.elems.getElement('addBtn');
        this.confirmBtn = this.elems.getElement('confirmBtn');
        this.btnClose = this.elems.getElement('btnClose');
        this.mask = this.elems.getElement('mask');
        this.rewList = this.elems.getUIList('rewList');
    }

    protected initListeners() {
        this.addClickListener(this.reduceBtn, this.onClickReduceBtn);
        this.addClickListener(this.addBtn, this.onClickAddBtn);
        this.addClickListener(this.confirmBtn, this.onClickConfirmBtn);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
    }

    protected onOpen() {
        let dropCfg = DropPlanData.getDropPlanConfig(this.rewDropId);
        let dropCnt = dropCfg.m_ucDropThingNumber;
        this.rewList.Count = dropCnt;
        for (let i = 0; i < dropCfg.m_astDropThing.length; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.rewList.GetItem(i).gameObject);
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }

        let activityData = G.DataMgr.activityData;
        let data = G.DataMgr.activityData.worldCupPanelData.m_astGameInfo;
        let zhiChiLv: number = 0;
        let titleBet = this.WCupOneGameInfo.m_iWinBet + this.WCupOneGameInfo.m_iLoseBet + this.WCupOneGameInfo.m_iTieBet;
        if (this.supportType == KeyWord.WORLDCPU_RESULT_WIN) {
            //显示LOGO
            this.countryName = activityData.countryIndexId2CfgMap[this.WCupOneGameInfo.m_iMainTeamID].m_szDesc;
           
            zhiChiLv = titleBet == 0 ? 0 : Math.floor(this.WCupOneGameInfo.m_iWinBet*100 / titleBet);
        }
        else if (this.supportType == KeyWord.WORLDCPU_RESULT_TIE) {
            this.countryName = '平局';
            zhiChiLv = titleBet == 0 ? 0 : Math.floor(this.WCupOneGameInfo.m_iTieBet*100 / titleBet);
        }
        else if (this.supportType == KeyWord.WORLDCPU_RESULT_LOSE) {
            this.countryName = activityData.countryIndexId2CfgMap[this.WCupOneGameInfo.m_iVisitTeamID].m_szDesc;
            zhiChiLv = titleBet == 0 ? 0 : Math.floor(this.WCupOneGameInfo.m_iLoseBet*100 / titleBet);
        }

        this.supportCountry.text = '支持：' + this.countryName;
        this.countryIcon.sprite = WorldCupActView.CountryAltas.Get(this.countryName);
        //G.ResourceMgr.loadImage(this.countryIcon, 'ui/altas/specialize/worldCupAltas/' + countryName + '.png');

        this.supportNum.text = uts.format('支持率：{0}%',zhiChiLv.toString()); 
        this.betNumLabel.text = '1';
    }

    private updateBetNum(){
        this.betNumLabel.text = this.betNum.toString();
    }

   

    private onClickReduceBtn() {
        this.betNum--;
        if (this.betNum <= 0){
            this.betNum = 1;
        }
        this.updateBetNum();
    }

    private onClickAddBtn() {
        this.betNum++;
        this.updateBetNum();
    }

    private onClickConfirmBtn() {
        let needScore: number = G.DataMgr.constData.getValueById(KeyWord.PARAM_WORLDCUP_BET_WIN_PIRCE) * this.betNum;
        let des = uts.format('您当前支持了{0}{1}次，需要花费{2}钻石，是否确定？', this.countryName, this.betNum, TextFieldUtil.getColorText(needScore.toString(), Color.YELLOW));
        G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGotoHomeBossConfirm));
    }

    onGotoHomeBossConfirm(stage: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_BET_WIN, this.WCupOneGameInfo.m_iGameID, this.betNum, this.supportType));
            this.close();
        }
    }

    private onClickBtnClose(){
        this.close();
    }

}