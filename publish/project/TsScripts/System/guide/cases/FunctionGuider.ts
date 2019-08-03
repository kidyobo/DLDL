import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { CommonForm } from 'System/uilib/CommonForm'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { HeroView } from 'System/hero/view/HeroView'

export abstract class FunctionGuider extends BaseGuider {

    static SelectViewAnimTime = 500;

    protected delayTimer: Game.Timer;

    constructor(group: EnumGuide, index: number, needCheckView: boolean) {
        super(group, index, EnumGuiderQuestRule.PauseAbsolutely, needCheckView);
    }

    processRequiredParams(...args) {

    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.FunctionGuide_OpenView, this._onStepOpenView);
        this.fillSteps();
        this.m_activeFrame = EnumGuide.FunctionGuide_OpenView;
    }

    protected abstract fillSteps();

    next(step: EnumGuide): boolean {
        G.ViewCacher.functionGuideView.guideOffTarget(null);
        return super.next(step);
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 直接弹开面板
        G.ViewCacher.functionGuideView.open();
    }

    protected guideOnClickHeroHead(type: number) {
        // 先检查是否已打开HeroView
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            // 已经打开HeroView了，确保打开坐骑页签
            heroView.switchTabFormById(type);
        } else {
            // 没有打开则引导点击人物头像
            G.ViewCacher.functionGuideView.guideOn(G.ViewCacher.mainView.heroInfoCtrl.headIcon.gameObject, EnumGuideArrowRotation.right, { x: 100, y: 0 });
        }
    }

    protected guideOnActBtn(id: number): boolean {
        let btn = G.ActBtnCtrl.getFuncBtn(id);
        if (null == btn && !G.ActBtnCtrl.IsOpened) {
            // 折叠起来了，自动打开
            G.ActBtnCtrl.onClickBtnSwitcher();
            btn = G.ActBtnCtrl.getFuncBtn(id);
        }

        if (null != btn) {
            G.ViewCacher.functionGuideView.guideOn(btn, EnumGuideArrowRotation.bottom, { x: 0, y: -60 }, [], true, { x: 0, y: -0.7 });
            return true;
        }
        return false;
    }

    protected doGuideOpenMainFuncBar(step: EnumGuide, viewClass: any) {
        // 先检查是否已打开WingView
        if (G.Uimgr.getForm<CommonForm>(viewClass) != null || G.MainBtnCtrl.IsOpened) {
            // 已经打开了，跳过
            this.onGuideStepFinished(step);
        } else {
            G.ViewCacher.functionGuideView.guideOn(G.MainBtnCtrl.switcher, EnumGuideArrowRotation.left, { x: -100, y: -31.5 });
        }
    }

    protected guideOnMainFuncBtn(id: number): boolean {
        let btn = G.MainBtnCtrl.getFuncBtn(id);
        if (null == btn && !G.MainBtnCtrl.IsOpened) {
            // 折叠起来了，自动打开
            G.MainBtnCtrl.onClickBtnSwitcher();
            btn = G.ActBtnCtrl.getFuncBtn(id);
        }

        if (null != btn) {
            let isH = G.MainBtnCtrl.isInHorizonList(id);
            if (isH) {
                G.ViewCacher.functionGuideView.guideOn(btn, EnumGuideArrowRotation.top, { x: 38, y: 3 });
            } else {
                G.ViewCacher.functionGuideView.guideOn(btn, EnumGuideArrowRotation.left, { x: -40, y: 0 });
            }
        }
        return false;
    }

    /**
     * 指引界面右上角的返回按钮。
     * @param btn
     */
    protected guideOnBtnReturn(btn: UnityEngine.GameObject): void {
        // 由于return按钮本身scaleX做了翻转，因此本来箭头要rotate -90的，现在是rotate 180
        G.ViewCacher.functionGuideView.guideOn(btn, EnumGuideArrowRotation.left, { x: -30, y: 0 });

    }

    end(): void {
        G.ViewCacher.functionGuideView.close();
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }
}