import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { GuidUtil } from 'System/utils/GuidUtil'
import { Macros } from 'System/protocol/Macros'
import { QuestData } from 'System/data/QuestData'
import { DisplayPetView } from 'System/guide/DisplayPetView'

/**
 * 展示伙伴收集。
 * @author teppei
 * 
 */
export class DisplayPetGuider extends BaseGuider {
    private ids: number[] = [];

    constructor() {
        super(EnumGuide.DisplayPet, 0, EnumGuiderQuestRule.NoPause, false);
        // 环任务不阻塞
        this.pauseQuestTypeExcludes = QuestData.LOOP_DAILY_TYPES;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(id: number) {
        let displayPetView = G.ViewCacher.displayPetView;
        if (displayPetView.isOpened && displayPetView.checkCurrentId(id)) {
            return;
        }

        if (this.ids.indexOf(id) >= 0) {
            return;
        }
        this.ids.push(id);
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.DisplayPet_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.DisplayPet_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 打开面板
        G.ViewCacher.displayPetView.open(this.ids[0]);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return G.ViewCacher.displayPetView.force(this.type, step);
    }

    end(): void {
        G.ViewCacher.displayPetView.close();
        this.ids.length = 0;
    }

    getNextThing(): number {
        if (this.ids.length > 0) {
            return this.ids.shift();
        }
        return null;
    }
}
