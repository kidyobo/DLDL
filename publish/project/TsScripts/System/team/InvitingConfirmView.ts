import { Global as G } from 'System/global'
import { UIPathData } from "System/data/UIPathData"
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { KeyWord } from "System/constants/KeyWord"
import { Macros } from "System/protocol/Macros"
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Color } from 'System/utils/ColorUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Constants } from 'System/constants/Constants'
import { TipFrom } from 'System/tip/view/TipsView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PinstanceData } from 'System/data/PinstanceData'



export class InvitingConfirmView extends CommonForm {

    /**10s后自动关闭*/
    private readonly DelayTime = 10; 

    private txtInfo: UnityEngine.UI.Text;
    private txtConfirm: UnityEngine.UI.Text;
    private noTipTog: UnityEngine.UI.ActiveToggle;
    private btnCancel: UnityEngine.GameObject;
    private btnConfirm: UnityEngine.GameObject;

    private info: Protocol.CSCross_RecruitTeam_Response;
    private leftTime = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.InvitingConfirmView;
    }

    protected initElements() {
        this.txtInfo = this.elems.getText("txtInfo");
        this.txtConfirm = this.elems.getText("txtConfirm");
        this.noTipTog = this.elems.getActiveToggle("noTipTog"); 
        this.btnCancel = this.elems.getElement("btnCancel");
        this.btnConfirm = this.elems.getElement("btnConfirm");

        this.noTipTog.isOn = false;
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
        this.addClickListener(this.btnCancel, this.close);
        this.addClickListener(this.btnConfirm, this.onClickConfirm);
    }

  
    open(info: Protocol.CSCross_RecruitTeam_Response) {
        this.info = info;
        super.open();
    }

    protected onOpen() {
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(this.info.m_uiPinstanceID);

        uts.log(this.info);

        if (pconfig) {
            this.txtInfo.text = uts.format("{0}正在组队挑战{1}，需要您的帮助，是否前往？",
                this.info.m_szRoleName,
                pconfig.m_szName
            );
        }
        this.leftTime = this.DelayTime;
        this.txtConfirm.text = uts.format("取消({0})", this.leftTime);
        this.addTimer("delay", 1000, this.DelayTime, this.onTickTimer);
    }

    protected onClose() {
        G.DataMgr.runtime.inviteNotTip = this.noTipTog.isOn;
    }

    private onTickTimer(timer: Game.Timer) {
        this.leftTime--
        if (this.leftTime > 0) {
            this.txtConfirm.text = uts.format("取消({0})", this.leftTime);
        } else {
            this.close();
        }
    }

    private onClickConfirm() {
        let info: Protocol.Cross_SimpleOneTeam = {} as Protocol.Cross_SimpleOneTeam;
        info.m_szPassword = this.info.m_szPassword;
        info.m_szRoleName = this.info.m_szRoleName;
        info.m_ucAutoStart = this.info.m_ucAutoStart;
        info.m_ucTeamMemNum = this.info.m_ucTeamMemNum;
        info.m_uiFight = this.info.m_uiFight;
        info.m_uiTeamID = this.info.m_uiTeamID;
        info.m_usWorldID = this.info.m_usWorldID;
        G.ModuleMgr.teamFbModule.joinSxtTeam(this.info.m_uiPinstanceID, info);
        this.close();
    }

}