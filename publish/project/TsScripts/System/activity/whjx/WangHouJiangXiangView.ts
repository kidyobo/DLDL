import { Global as G } from 'System/global'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UiElements } from 'System/uilib/UiElements'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { WhjxPlayLogic } from 'System/activity/whjx/WhjxPlayLogic'
import { WhjxSignUpLogic } from 'System/activity/whjx/WhjxSignUpLogic'

/**
 * 能力叛乱
 */
export class WangHouJiangXiangView extends TabSubForm {
    private readonly TickKey = '1';

    private playLogic: WhjxPlayLogic;
    private sighUpLogic: WhjxSignUpLogic;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG);
    }

    protected resPath(): string {
        return UIPathData.WangHouJiangXiangView;
    }

    protected onOpen() {
        this.checkPlayOrSignUp();
        this.addTimer(this.TickKey, 1000, 0, this.onTickTimer);
    }

    protected onClose() {
        if (null != this.playLogic) {
            this.playLogic.destroyAvatar();
        }
    }

    private checkPlayOrSignUp() {
        // 每周六为报名时段
        let d = G.SyncTime.serverDate;
        let day = d.getDay();
        if (day == 6) {
            this.playLogic.close();
            this.sighUpLogic.open();
        } else {
            this.sighUpLogic.close();
            this.playLogic.open();
        }
    }

    protected initElements(): void {
        this.playLogic = new WhjxPlayLogic(this);
        this.playLogic.initElements(this.elems.getElement('play'), this.elems.getUiElements('play'));
        this.sighUpLogic = new WhjxSignUpLogic(this);
        this.sighUpLogic.initElements(this.elems.getElement('signUp'), this.elems.getUiElements('signUp'));
    }

    protected initListeners(): void {
        this.playLogic.initListeners();
        this.sighUpLogic.initListeners();
    }

    private onTickTimer(timer: Game.Timer) {
        if (this.playLogic.IsOpened) {
            this.playLogic.onTickTimer(timer);
        } else {
            this.sighUpLogic.onTickTimer(timer);
        }
    }

    onPanelResponse() {
        if (this.sighUpLogic.IsOpened) {
            this.sighUpLogic.onPanelResponse();
        } else {
            this.playLogic.onPanelResponse();
        }
    }

    onSignUpResponse() {
        if (this.sighUpLogic.IsOpened) {
            this.sighUpLogic.onSignUpResponse();
        }
    }

    onApplyResultResponse(result: number) {
        if (this.playLogic.IsOpened) {
            this.playLogic.onApplyResultResponse(result);
        }
    }

    onApplyDealResponse(opVal: number) {
        if (this.playLogic.IsOpened) {
            this.playLogic.onApplyDealResponse(opVal);
        }
    }

    onCleanCdResponse() {
        if (this.playLogic.IsOpened) {
            this.playLogic.onCleanCdResponse();
        }
    }

    onclickBtnRule() {
        let content = G.DataMgr.langData.getLang(10043);
        content = RegExpUtil.xlsDesc2Html(content);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }

    onActDataChange(id: number) {
        if (Macros.ACTIVITY_ID_WHJX == id) {
            this.checkPlayOrSignUp();
        }
    }
}