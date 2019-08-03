import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumGuideStartResult } from 'System/constants/GameEnum'
import { UILayer } from 'System/uilib/CommonForm'
import { QuestData } from 'System/data/QuestData'

class GuideStepInfo {
    step: EnumGuide;
    func: (step: EnumGuide) => void;
}

/**
 * 引导组件的基类。
 * @author teppei
 * 
 */
export abstract class BaseGuider {
    /**引导类型。*/
    type: EnumGuide = 0;

    group: EnumGuide = 0;

    index = 0;

    /**关联的任务ID。*/
    questID: number = 0;

    needTransport = false;

    /**节点索引。*/
    nodeIndex: number = -1;

    /**是否阻止继续做任务。*/
    questRule: EnumGuiderQuestRule = 0;
    /**不被阻塞的任务类型*/
    pauseQuestTypeExcludes: number[];

    get isOpenFunction(): boolean {
        return this.checkFunction();
    }

    /**检查功能是否开启 （没有写成抽象方法，因为引导有削减，全加太麻烦） */
    protected checkFunction(): boolean {
        return true;
    }

    /**引导步骤。*/
    protected m_steps: GuideStepInfo[] = [];

    protected m_activeFrame: EnumGuide;

    /**当前的步骤。*/
    protected m_crtStepIdx: number = -1;

    /**
     * 表示当前指引是否处于活动状态。比如某个指引需要打开某个UI，UI加载过程就属于非活动状态。
     * 非活动状态的指引不会中断任务流程。
     */
    protected m_isActive: boolean = false;

    /**引导步骤开始时间点。*/
    protected m_crtStepStartedAt: number = 0;

    protected m_needCheckView = false;
    protected m_checkViewsIncludeLayers = [UILayer.Normal, UILayer.Second, UILayer.Result, UILayer.Pay];

    protected m_isWaitingViewClosed = false;

    /**父指引*/
    parentGuider: BaseGuider;

    constructor(group: EnumGuide, index: number, questRule: EnumGuiderQuestRule, needCheckView: boolean) {
        this.questRule = questRule;
        this.type = group + index;
        this.group = group;
        this.index = index;
        this.m_needCheckView = needCheckView;
        this._initSteps();
    }

    /**
     * 预处理参数。
     * @param args
     */
    abstract processRequiredParams(...args);

    /**结束引导。*/
    abstract end();

    /**初始化指引步骤。*/
    protected abstract _initSteps();
    protected abstract _onStepFinished(step: EnumGuide);
    protected abstract _forceStep(step: EnumGuide): boolean;
    protected abstract getCheckViewsExcludeForms(): any[];

    protected _addStep(step: EnumGuide, func: (step: EnumGuide) => void): void {
        let stepInfo = new GuideStepInfo();
        stepInfo.step = step;
        if (null != func) {
            stepInfo.func = delegate(this, func);
        }
        this.m_steps.push(stepInfo);
    }

    /**开始引导。*/
    start(): EnumGuideStartResult {
        uts.assert(null != this.m_steps && this.m_steps.length > 0 && this.m_activeFrame > 0);
        this.m_crtStepIdx = -1;
        let result = EnumGuideStartResult.failed;
        if (null != this.m_needCheckView) {
            if (G.Uimgr.isAnyFormOpenedBut(this.getCheckViewsExcludeForms(), this.m_checkViewsIncludeLayers)) {
                this.m_isWaitingViewClosed = true;
                result = EnumGuideStartResult.waitViewClosed;
            } else {
                this.m_isWaitingViewClosed = false;
            }
        }

        if (!this.m_isWaitingViewClosed && this.next(0)) {
            result = EnumGuideStartResult.success;
        }
        //uts.log('start guider: ' + this.type + ', result = ' + result);
        return result;
    }

    /**
     * 执行下一步引导步骤。
     * @param step 这次完成的步骤。
     * @return 如果引导结束则返回true。
     * 
     */
    next(step: EnumGuide): boolean {
        let crtStepInfo = this.getCrtStepInfo();
        if (null != crtStepInfo && crtStepInfo.step == this.m_activeFrame) {
            this.m_isActive = true;
        }
        if (null != crtStepInfo) {
            this._onStepFinished(crtStepInfo.step);
        }

        if (step <= 0) {
            // 顺序执行
            this.m_crtStepIdx++;
        } else {
            // 没有
            let specifiedIdx = -1;
            let len = this.m_steps.length;
            for (let i = 0; i < len; i++) {
                if (this.m_steps[i].step == step) {
                    specifiedIdx = i;
                    break;
                }
            }
            this.m_crtStepIdx = specifiedIdx + 1;
        }

        let nextStepInfo = this.getCrtStepInfo();
        //uts.log('guide next: type = ' + this.type + ', crtStepIdx = ' + this.m_crtStepIdx + ', step = ' + (null != nextStepInfo ? nextStepInfo.step : 0));
        if (null != nextStepInfo) {
            // 有下一步
            this.m_crtStepStartedAt = UnityEngine.Time.realtimeSinceStartup;
            if (null != nextStepInfo.func) {
                nextStepInfo.func(nextStepInfo.step);
            }
            return true;
        }

        this.end();
        return false;
    }

    /**
     * 强制执行当前引导节点动作。
     * 
     */
    force() {
        let stepInfo = this.getCrtStepInfo();
        if (null != stepInfo) {
            if (!this._forceStep(stepInfo.step)) {
                // 强制执行失败则取消引导
                G.GuideMgr.cancelGuide(this.type);
                return;
            }
        }
    }

    onGuideStepFinished(step: EnumGuide) {
        G.GuideMgr.processGuideNext(this.group, step);
    }

    /**
     * 当前指引步骤。
     * @return 
     * 
     */
    private getCrtStepInfo(): GuideStepInfo {
        if (this.m_crtStepIdx >= 0 && this.m_crtStepIdx < this.m_steps.length) {
            return this.m_steps[this.m_crtStepIdx];
        }
        return null;
    }

    getCrtStep(): EnumGuide {
        let stepInfo = this.getCrtStepInfo();
        if (null != stepInfo) {
            return stepInfo.step;
        }

        return 0;
    }

    get isActive(): boolean {
        return this.m_isActive;
    }

    get isEnd(): boolean {
        return this.m_crtStepIdx >= this.m_steps.length;
    }

    canNext(step: EnumGuide): boolean {
        // 允许跳步骤，比如指引需要打开某个TabForm，在里面的页签尚未打开前就关闭了TabForm，这样可以允许终止指引
        // 因此step >= 当前step
        let crtStep = this.getCrtStep();
        if (step == crtStep) {
            return true;
        }

        let stepIdx = -1;
        let len = this.m_steps.length;
        for (let i = 0; i < len; i++) {
            if (this.m_steps[i].step == step) {
                return this.m_crtStepIdx < i;
            }
        }
        return false;
    }

    get crtStepStartedAt(): number {
        return this.m_crtStepStartedAt;
    }

    needPauseQuest(questID: number): boolean {
        return EnumGuiderQuestRule.PauseAbsolutely == this.questRule || (EnumGuiderQuestRule.PauseIfActive == this.questRule && this.m_isActive) &&
            (null == this.pauseQuestTypeExcludes || this.pauseQuestTypeExcludes.indexOf(QuestData.getConfigByQuestID(questID).m_ucQuestType) < 0);
    }

    get IsWaitingViewClosed(): boolean {
        return this.m_isWaitingViewClosed;
    }

    toString(): string {
        return uts.format('[Guider]group={0} index={1} isActive={2} crtStepIdx={3} isWaitingViewClosed={4} questID={5}', this.group, this.index, this.m_isActive, this.m_crtStepIdx, this.m_isWaitingViewClosed, this.questID);
    }
}
