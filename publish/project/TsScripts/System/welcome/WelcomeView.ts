import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { EnumGuide } from 'System/constants/GameEnum'

/**
 * 首次进入欢迎对话框
 *
 */
export class WelcomeView extends CommonForm {

    private readonly AutoTimerKey = 'auto';

    private btnGame: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.WelcomeView;
    }

    protected initElements(): void {
        this.btnGame = this.elems.getElement("btnGame");
        this.mask = this.elems.getElement("mask");
    }

    protected initListeners(): void {
        this.addClickListener(this.btnGame, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
    }

    protected onOpen() {
        this.addTimer(this.AutoTimerKey, 5000, 1, this.onAutoGuideDelayTimer);
        G.GuideMgr.processGuideNext(EnumGuide.Welcome, EnumGuide.Welcome_OpenView);
    }

    protected onClose() {
        this.removeTimer(this.AutoTimerKey);
        G.GuideMgr.processGuideNext(EnumGuide.Welcome, EnumGuide.GuideCommon_None);
        G.ModuleMgr.questModule.tryAutoDoQuest(G.DataMgr.questData.firstTrunkId);
    }

    private onBtnClose() {
        G.AudioMgr.playBtnClickSound();
        this.close();
    }

    private onAutoGuideDelayTimer(timer: Game.Timer): void {
        this.close();
    }
}
