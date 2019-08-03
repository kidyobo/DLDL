import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { GetZhufuView } from 'System/guide/GetZhufuView'
import { GuidUtil } from 'System/utils/GuidUtil'
import { Macros } from 'System/protocol/Macros'
import { GameIDUtil } from 'System/utils/GameIDUtil'

export class GetZhufuVar {
    subType = 0;
    thingInfo: Protocol.ContainerThingInfo;

    reset() {
        this.subType = 0;
        this.thingInfo = null;
    }
}

/**
 * 获得祝福系统的引导。
 * @author teppei
 * 
 */
export class GetZhufuGuider extends BaseGuider {
    private funcVars: GetZhufuVar[] = [];

    constructor() {
        super(EnumGuide.GetZhufu, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(funcID: number, thingInfo: Protocol.ContainerThingInfo) {
        let subType = GameIDUtil.getHeroSubTypeByFuncID(funcID);
        for (let oneVar of this.funcVars) {
            if (oneVar.subType == subType) {
                return;
            }
        }
        let oneVar = new GetZhufuVar();
        oneVar.subType = subType;
        oneVar.thingInfo = thingInfo;
        this.funcVars.push(oneVar);
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.GetZhufu_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.GetZhufu_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 打开面板
        G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(0,true);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            let view = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
            if (null != view) {
                return view.force(this.type, step);
            }
        }
        return false;
    }

    end(): void {
        G.Uimgr.closeForm(GetZhufuView);
    }

    getNextFuncVar(): GetZhufuVar {
        if (this.funcVars.length > 0) {
            return this.funcVars.shift();
        }

        return null;
    }
}