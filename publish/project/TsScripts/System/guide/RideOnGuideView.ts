import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuide } from 'System/constants/GameEnum'
import { RideOnGuider } from 'System/guide/cases/RideOnGuider'
import { UnitStatus } from 'System/utils/UnitStatus'

export class RideOnGuideView extends CommonForm {
    private readonly AutoTimerKey = '1';

    private uiDrag: Game.UIDragListener;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Guide;
    }

    protected resPath(): string {
        return UIPathData.RideOnGuideView;
    }

    protected initElements() {
        this.uiDrag = Game.UIDragListener.Get(this.form);
        this.uiDrag.onDrag = delegate(this, this.onDrag);
    }

    protected onOpen() {
        G.GuideMgr.processGuideNext(EnumGuide.RideOn, EnumGuide.RideOn_OpenView);
    }

    protected onClose() {
        this.removeTimer(this.AutoTimerKey);
        G.GuideMgr.processGuideNext(EnumGuide.RideOn, EnumGuide.GuideCommon_None);
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('mask'), this.onClickMask);
        this.addTimer(this.AutoTimerKey, 5000, 1, this.onTimer);
    }

    private onTimer(timer: Game.Timer) {
        this.close();
    }

    private onClickMask() {
        this.close();
    }

    private onDrag() {
        let eventData = Game.UIDragListener.eventData;
        if (eventData.position.y - eventData.pressPosition.y > 90) {
            if (!UnitStatus.isInRide(G.DataMgr.heroData.unitStatus)) {
                // 当前下马状态，滑屏上马
                G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_RIDE, 0, 0, 1);
            }
            this.close();
        }
    }
}