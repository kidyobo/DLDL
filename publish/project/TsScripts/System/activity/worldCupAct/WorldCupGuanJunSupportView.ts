import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { Macros } from "System/protocol/Macros"
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { UIUtils } from 'System/utils/UIUtils'
import { SyncTime } from 'System/net/SyncTime'
import { KeyWord } from 'System/constants/KeyWord'
import { DataFormatter } from "System/utils/DataFormatter"
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { WorldCupGuanJunPanel } from 'System/activity/worldCupAct/WorldCupGuanJunPanel'

export class WorldCupGuanJunSupportView extends CommonForm {
    private titleText: UnityEngine.UI.Text;
    private countryIcon: UnityEngine.UI.Image;
    private supportCountry: UnityEngine.UI.Text;
    private confirmBtn: UnityEngine.GameObject;
    private xiaohaoText: UnityEngine.UI.Text;
    private currencyText: UnityEngine.UI.Text;
    private desText: UnityEngine.UI.Text;
    private des2Text: UnityEngine.UI.Text;

    private isMainTeam: boolean = false;
    private configData: Protocol.WorldCupChampionConfig_Server;
    private gameInfo: Protocol.DBWCupChampionRoleOneBetInfo;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WorldCupGuanJunSupportView;
    }

    open(config: Protocol.WorldCupChampionConfig_Server, isMainTeam: boolean) {
        this.configData = config;
        this.isMainTeam = isMainTeam;
        super.open();
    }

    protected initElements() {
        super.initElements();
        this.titleText = this.elems.getText('Text');
        this.countryIcon = this.elems.getImage('countryIcon');
        this.supportCountry = this.elems.getText('supportCountry');
        this.confirmBtn = this.elems.getElement('confirmBtn');
        this.xiaohaoText = this.elems.getText('yuandiTimeText');
        this.currencyText = this.elems.getText('currencyText');
        this.desText = this.elems.getText('des');
        this.des2Text = this.elems.getText('des2');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.confirmBtn, this.onClickConfirmBtn);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickBtnClose);
        this.addClickListener(this.elems.getElement("mask"), this.onClickBtnClose);
    }

    protected onOpen() {
        super.onOpen();
        this.updateView();
    }

    updateView() {
        let activityData = G.DataMgr.activityData;

        this.titleText.text = this.getTitleStr();
        let teamName = activityData.countryIndexId2CfgMap[this.isMainTeam ? this.configData.m_iMainTeamID : this.configData.m_iVisitTeamID].m_szDesc;
        this.countryIcon.sprite = WorldCupActView.CountryAltas.Get(teamName);
        this.supportCountry.text = uts.format("支持：{0}", teamName);
        this.desText.text = uts.format("若你支持的球队晋级\n即可获得{0}的充值返利", (this.configData.m_iPeiLv + "%"));

        let currencyValue = G.DataMgr.constData.getValueById(KeyWord.PARAM_WORLDCUP_CHAMPION_GUESS_PIRCE);
        this.xiaohaoText.text = uts.format("消耗{0}钻石", currencyValue);
        this.currencyText.text = uts.format("{0}", currencyValue);

        let chargeNum = activityData.worldCupChampionPanelData.m_astChargeInfo[this.configData.m_bLunci - 1];
        this.des2Text.text = uts.format("你本轮已充值：{0}钻石", chargeNum);

        this.gameInfo = WorldCupGuanJunPanel.gameInfoIdMap[this.configData.m_iID];
        if (this.gameInfo != null) {
            UIUtils.setButtonClickAble(this.confirmBtn, false);
            let btnText = this.confirmBtn.transform.Find("btName").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            if (this.gameInfo.m_iRoleBetTeamID == (this.isMainTeam ? this.configData.m_iMainTeamID : this.configData.m_iVisitTeamID)) {
                btnText.text = "已支持";
            } else {
                btnText.text = "未支持";
            }
        }
    }

    private getTitleStr() {
        let titleStr = "";
        switch (this.configData.m_bLunci) {
            case KeyWord.WORLDCPU_CHAMPION_ROUND_1:
                titleStr = "十六强竞猜";
                break;
            case KeyWord.WORLDCPU_CHAMPION_ROUND_2:
                titleStr = "八强竞猜";
                break;
            case KeyWord.WORLDCPU_CHAMPION_ROUND_3:
                titleStr = "四强竞猜";
                break;
            case KeyWord.WORLDCPU_CHAMPION_ROUND_4:
                titleStr = "决赛竞猜";
                break;
            default:
                break;
        }
        return titleStr;
    }

    private onClickConfirmBtn() {
        /**玩家元宝数量不足 */
        if (G.DataMgr.heroData.gold < G.DataMgr.constData.getValueById(KeyWord.PARAM_WORLDCUP_CHAMPION_GUESS_PIRCE)) {
            G.TipMgr.addMainFloatTip("钻石数量不足！");
            return;
        }
        /**奖励未领取 */
        let hasRewardValue = WorldCupGuanJunPanel.judgeRewardGet();
        if (hasRewardValue[0] == false) {
            G.TipMgr.addMainFloatTip("请先领取奖励！");
            return;
        }
        /**未在投注时间段 */
        let currentTime: number = G.SyncTime.getCurrentTime() / 1000;
        if (currentTime < this.configData.m_uiTouzhuStartTime || currentTime > this.configData.m_uiTouzhuEndTime) {
            let startTime = DataFormatter.second2mmddmm(this.configData.m_uiTouzhuStartTime);
            let endTime = DataFormatter.second2mmddmm(this.configData.m_uiTouzhuEndTime);
            G.TipMgr.addMainFloatTip(uts.format("投注时间段：{0}-{1}!", startTime, endTime));
            return;
        }
        /**投注 */
        let teamID = this.isMainTeam ? this.configData.m_iMainTeamID : this.configData.m_iVisitTeamID;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUPCHAMPION, Macros.ACTIVITY_WORLDCUP_CHAMPION_GUESS, this.configData.m_iID, teamID));
        this.close();
    }

    private onClickBtnClose() {
        this.close();
    }
}