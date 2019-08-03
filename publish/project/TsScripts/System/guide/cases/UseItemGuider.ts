import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { BagView, EnumBagTab } from 'System/bag/view/BagView'
import { BagPanel } from 'System/bag/view/BagPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { QuestData } from 'System/data/QuestData'
import { GameIDUtil } from 'System/utils/GameIDUtil'

export class UseItemGuider extends FunctionGuider {
    itemId = 0;

    constructor() {
        super(EnumGuide.UseItem, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(BagView)];
    }

    processRequiredParams(funcId: number) {
        let itemId = 0;
        let cfg = G.DataMgr.funcLimitData.getFuncLimitConfig(funcId);
        if (cfg.m_ucCompleteQuest > 0) {
            let questCfg = QuestData.getConfigByQuestID(cfg.m_ucCompleteQuest);
            for (let i = questCfg.m_ucRewardThingNumber - 1; i >= 0; i--) {
                if (GameIDUtil.isBagThingID(questCfg.m_astRewardThingConfig[i].m_iThingID)) {
                    itemId = questCfg.m_astRewardThingConfig[i].m_iThingID;
                }
            }
        } else {
            uts.assert(false, 'unknown func: ' + funcId);
        }
        this.itemId = itemId;
    }

    protected fillSteps() {
        this._addStep(EnumGuide.UseItem_ClickBag, this._onStepClickBag);
        this._addStep(EnumGuide.UseItem_ClickItem, this._onStepClickItem);
        this._addStep(EnumGuide.UseItem_ClickUse, this._onStepClickUse);
        this._addStep(EnumGuide.UseItem_ClickClose, this._onStepClickClose);
    }

    private _onStepClickBag(step: EnumGuide): void {
        // 先检查是否已打开BagView
        let bagView = G.Uimgr.getForm<BagView>(BagView);
        if (bagView!=null) {
            bagView.switchTabFormById(EnumBagTab.bag, this.itemId);
        } else {
            //// 没有打开则引导点击背包按钮
            //if (G.MainBtnCtrl.IsOpened) {
            //    G.MainBtnCtrl.onClickBtnSwitcher();
            //}
            //G.ViewCacher.functionGuideView.guideOn(G.MainBtnCtrl.btnBag, EnumGuideArrowRotation.left, { x: -50, y: 0 });
            G.Uimgr.createForm<BagView>(BagView).open();
        }
    }

    private _onStepClickItem(step: EnumGuide): void {
        let bagItem = G.Uimgr.getForm<BagView>(BagView).getFirstBagItem(this.itemId);
        if (null != bagItem) {
            G.ViewCacher.functionGuideView.guideOn(bagItem, EnumGuideArrowRotation.left, { x: -10, y: -40 });
        } else {
            this.onGuideStepFinished(step);
        }
    }

    private _onStepClickUse(step: EnumGuide): void {
        G.ViewCacher.functionGuideView.guideOn(G.Uimgr.getSubFormByID<BagPanel>(BagView, EnumBagTab.bag).btnUse, EnumGuideArrowRotation.right, { x: 90, y: 0 });

    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<BagView>(BagView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<BagView>(BagView);
        if (null != view) {
            if (EnumGuide.UseItem_ClickItem == step || EnumGuide.UseItem_ClickUse == step) {
                let bagPanel = view.getTabFormByID(EnumBagTab.bag) as BagPanel;
                if (null != bagPanel && bagPanel.isOpened) {
                    return bagPanel.force(this.type, step, this.itemId);
                }
            } else if (EnumGuide.UseItem_ClickClose == step) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}