import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { GuidUtil } from 'System/utils/GuidUtil'
import { Macros } from 'System/protocol/Macros'
import { QuestData } from 'System/data/QuestData'


export class DisplaySaiJiGuider extends BaseGuider {
    private ids: number[] = [];

    constructor() {
        super(EnumGuide.DisplaySaiJi, 0, EnumGuiderQuestRule.NoPause, false);
        // 环任务不阻塞
        this.pauseQuestTypeExcludes = QuestData.LOOP_DAILY_TYPES;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(id: number) {
        let displaySaiJiView = G.ViewCacher.displaySaiJiView;
        if (displaySaiJiView.isOpened && displaySaiJiView.checkCurrentId(id)) {
            return;
        }

        if (this.ids.indexOf(id) >= 0) {
            return;
        }
        this.ids.push(id);
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.DisplaySaiJi_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.DisplaySaiJi_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 打开面板
        G.ViewCacher.displaySaiJiView.open(this.ids[0]);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return G.ViewCacher.displaySaiJiView.force(this.type, step);
    }

    end(): void {
        G.ViewCacher.displaySaiJiView.close();
        this.ids.length = 0;
    }

    getNextThing(): number {
        if (this.ids.length > 0) {
            return this.ids.shift();
        }
        return null;
    }
}
