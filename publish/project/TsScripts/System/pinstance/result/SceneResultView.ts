import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { SceneResultFailPanel } from "System/pinstance/result/SceneResultFailPanel";
import { SceneResultMultiPvPPanel } from "System/pinstance/result/SceneResultMultiPvPPanel";
import { SceneResultPassPanel } from "System/pinstance/result/SceneResultPassPanel";
import { SceneResultPvpPanel } from "System/pinstance/result/SceneResultPvpPanel";
import { SceneResultSuccessPanel } from "System/pinstance/result/SceneResultSuccessPanel";
import { Macros } from "System/protocol/Macros";
import { UILayer } from "System/uilib/CommonForm";
import { NestedForm } from "System/uilib/NestedForm";
import { UIUtils } from "System/utils/UIUtils";

export enum EnumSceneResultId {
    pass = 1,
    success,
    fail,
    pvp,
    multiPvP,
}

export class SceneResultView extends NestedForm {

    private panelBack: UnityEngine.GameObject;
    private animSuccess: UnityEngine.GameObject;

    private passPanel: SceneResultPassPanel;
    private successPanel: SceneResultSuccessPanel;
    private failPanel: SceneResultFailPanel;
    private pvpPanel: SceneResultPvpPanel;
    private multiPvPPanel: SceneResultMultiPvPPanel;

    private resultInfo: Protocol.SceneInfoResult;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.MainUIEffect;
    }

    protected resPath(): string {
        return UIPathData.SceneResultView;
    }

    protected initElements() {
        this.panelBack = this.elems.getElement('bgLight');
        this.animSuccess = this.elems.getElement('animSuccess');
    }

    protected initListeners() {
    }
    protected onClose() {
        this.closeAllButThis(null);
    }
    protected onOpen() {
        let needBackGrey = false;
        let showAnim = -1;
        if (this.resultInfo.m_ucResult == Macros.SCENERESULT_PASS) {
            // 通关
            this.closeAllButThis(this.passPanel);
            needBackGrey = false;
            if (this.passPanel == null) {
                this.passPanel = this.createChildForm<SceneResultPassPanel>(SceneResultPassPanel, EnumSceneResultId.pass);
            }
            this.passPanel.open(this.resultInfo.m_stData.m_stPass);
            showAnim = 1;
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_SUCCESS) {
            // 胜利
            this.closeAllButThis(this.successPanel);
            needBackGrey = false;
            if (this.successPanel == null) {
                this.successPanel = this.createChildForm<SceneResultSuccessPanel>(SceneResultSuccessPanel, EnumSceneResultId.success);
            }
            this.successPanel.open(this.resultInfo.m_stData.m_stSuccess, true);
            showAnim = 1;
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_ACT_FAIL) {
            // 活动失败
            this.closeAllButThis(this.successPanel);
            needBackGrey = true;
            if (this.successPanel == null) {
                this.successPanel = this.createChildForm<SceneResultSuccessPanel>(SceneResultSuccessPanel, EnumSceneResultId.success);
            }
            this.successPanel.open(this.resultInfo.m_stData.m_stActFail as Protocol.SceneResultSuccess, false);
            showAnim = 0;
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_FAIL) {
            // 失败
            this.closeAllButThis(this.failPanel);
            needBackGrey = false;
            if (this.failPanel == null) {
                this.failPanel = this.createChildForm<SceneResultFailPanel>(SceneResultFailPanel, EnumSceneResultId.fail);
            }
            this.failPanel.open(this.resultInfo.m_stData.m_stFail);
            showAnim = 0;
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_SINGLEPVP_REWARD) {
            // pvp
            this.closeAllButThis(this.pvpPanel);
            needBackGrey = false;
            if (this.pvpPanel == null) {
                this.pvpPanel = this.createChildForm<SceneResultPvpPanel>(SceneResultPvpPanel, EnumSceneResultId.pvp);
            }
            //this.pvpPanel.open(this.resultInfo.m_stData.m_stSinlePVPReward);
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_MULTIPVP_REWARD) {
            // 跨服3v3
            this.closeAllButThis(this.multiPvPPanel);
            needBackGrey = false;
            if (this.multiPvPPanel == null) {
                this.multiPvPPanel = this.createChildForm<SceneResultMultiPvPPanel>(SceneResultMultiPvPPanel, EnumSceneResultId.multiPvP);
            }
            let info = this.resultInfo.m_stData.m_stMultiPVPReward;
            this.multiPvPPanel.open(info, this.resultInfo.m_ucResult);
            showAnim = info.m_ucResult;
        }
        else if (this.resultInfo.m_ucResult == Macros.SCENERESULT_COLOSSEUM_REWARD) {
            // 斗兽斗兽场
            this.closeAllButThis(this.multiPvPPanel);
            needBackGrey = false;
            if (this.multiPvPPanel == null) {
                this.multiPvPPanel = this.createChildForm<SceneResultMultiPvPPanel>(SceneResultMultiPvPPanel, EnumSceneResultId.multiPvP);
            }
            let info = this.resultInfo.m_stData.m_stColosseumPKReward;
            this.multiPvPPanel.open(info, this.resultInfo.m_ucResult);
            showAnim = info.m_ucResult;
        }
        UIUtils.setGrey(this.panelBack, needBackGrey);
        if (showAnim < 0) {
            this.animSuccess.SetActive(false);
        } else {
            this.animSuccess.SetActive(true);
        }
    }

    open(result: Protocol.SceneInfoResult) {
        this.resultInfo = result;
        super.open();
    }

    private closeAllButThis(butWho: any) {
        if (null == butWho || butWho != this.passPanel) {
            if (this.passPanel) {
                this.passPanel.close();
            }
        }
        if (null == butWho || butWho != this.successPanel) {
            if (this.successPanel) {
                this.successPanel.close();
            }
        }
        if (null == butWho || butWho != this.failPanel) {
            if (this.failPanel) {
                this.failPanel.close();
            }
        }
        if (null == butWho || butWho != this.pvpPanel) {
            if (this.pvpPanel) {
                this.pvpPanel.close();
            }
        }
    }
}