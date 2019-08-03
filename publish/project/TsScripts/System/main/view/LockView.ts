import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

export class LockView extends CommonForm {
    private lockScrollBar: UnityEngine.UI.Scrollbar;

    private valueCount: number = 0;
    private lastValue: number = 0;
    private oldFrame = 0;
    private oldHideMonster = false;
    private oldHideSkillEffect = false;
    private oldHideSelfSkillEffect = false;
    private oldHidePlayerModel = false;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Top;
    }

    protected resPath(): string {
        return UIPathData.LockView;
    }

    protected initElements() {
        this.lockScrollBar = this.elems.getScrollbar('lock');
    }

    protected initListeners() {
        this.lockScrollBar.onValueChanged = delegate(this, this.onLockScrollbarChange);
    }

    protected onOpen() {
        this.reset();
        this.oldFrame = UnityEngine.Application.targetFrameRate;
        UnityEngine.Application.targetFrameRate = 25;

        this.oldHideMonster = G.DataMgr.settingData.HideMonsters;
        G.DataMgr.settingData.HideMonsters = true;
        this.oldHideSelfSkillEffect = G.DataMgr.settingData.HideSelfSkillEffect;
        G.DataMgr.settingData.HideSelfSkillEffect = true;
        this.oldHideSkillEffect = G.DataMgr.settingData.HideSkillEffects;
        G.DataMgr.settingData.HideSkillEffects = true;
        this.oldHidePlayerModel = G.DataMgr.settingData.HidePlayerModel;
        G.DataMgr.settingData.HidePlayerModel = true;
    }

    protected onClose() {
        UnityEngine.Application.targetFrameRate = this.oldFrame;
        G.DataMgr.settingData.HideMonsters = this.oldHideMonster;
        G.DataMgr.settingData.HideSelfSkillEffect = this.oldHideSelfSkillEffect;
        G.DataMgr.settingData.HideSkillEffects = this.oldHideSkillEffect;
        G.DataMgr.settingData.HidePlayerModel = this.oldHidePlayerModel;
    }

    private reset() {
        this.lockScrollBar.value = 0;
        this.valueCount = 0;
        this.lastValue = 0;
    }

    private onLockScrollbarChange(value: number) {
        let lastValue = this.lastValue;
        this.lastValue = value;
        if (value > lastValue) {
            // 只有向右滑的才算数
            this.valueCount++;
            if (value >= 0.85) {
                this.close();
            } 
        }
    }
}