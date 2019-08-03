import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { PetView } from 'System/pet/PetView'
import { PetJinJiePanel } from 'System/pet/PetJinJiePanel'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { Constants } from 'System/constants/Constants'
import { PetData } from 'System/data/pet/PetData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { GetZhufuView } from 'System/guide/GetZhufuView'
import { GuideFlyIconView } from 'System/guide/GuideFlyIconView'

/**伙伴激活 */
export class PetActivateGuider extends FunctionGuider {
    private petId = 0;
    constructor(petId: number) {
        super(EnumGuide.PetActivate, petId, true);
        this.petId = petId;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PetView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.PetActivate_OpenGetZhufu, this._onStepOpenGetZhunfu);
        this._addStep(EnumGuide.PetActivate_ClickAction, this._onStepClickAction);
        this._addStep(EnumGuide.PetActivate_OpenPetView, this._onStepOpenPetView);
        this._addStep(EnumGuide.PetActivate_ClickActivate, this._onStepClickActivate);
        this._addStep(EnumGuide.PetActivate_ClickClose, this._onStepClickClose);
        this._addStep(EnumGuide.PetActivate_FlyIcon, this._onStepFlyIcon);
        this.m_activeFrame = EnumGuide.PetActivate_OpenPetView;
    }
    private _onStepOpenGetZhunfu() {
        // 直接弹开面板
        let petId = Constants.FirstPetId;
        let cfg = PetData.getPetConfigByPetID(petId);
       
        //let zdl = FightingStrengthUtil.calPetFight(cfg.m_astAttrList);
        let zhufu = G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(KeyWord.BAR_FUNCTION_BEAUTY, false, petId, cfg.m_szBeautyName);
    }

    private _onStepClickAction() {
        //点按钮
        let zhufu = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
        if (zhufu != null && zhufu.isOpened) {
            G.ViewCacher.functionGuideView.guideOn(zhufu.btnEquip, EnumGuideArrowRotation.right, { x: 50, y: 0 }, [], false);
        }
    }

    private _onStepOpenPetView(step: EnumGuide) {
        //开界面
        G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE);
    }

    private _onStepClickActivate(step: EnumGuide) {
        let parentView = G.Uimgr.createForm<PetView>(PetView);

        if (parentView != null) {
            parentView.open(KeyWord.OTHER_FUNCTION_PET_JINJIE);
            let jinjieView = parentView.getChildForm<PetJinJiePanel>(KeyWord.OTHER_FUNCTION_PET_JINJIE);
            if (jinjieView != null) {
                let selectedItem = jinjieView.getSelectedPetItem();
                let focusTargets: UnityEngine.GameObject[];
                if (null != selectedItem) {
                    focusTargets = [selectedItem];
                }
                G.ViewCacher.functionGuideView.guideOn(jinjieView.btnActivate, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
            }
        }
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<PetView>(PetView).btnReturn);
    }

    private _onStepFlyIcon(step: EnumGuide): void {
        G.Uimgr.createForm<GuideFlyIconView>(GuideFlyIconView).open(115, "伙伴", KeyWord.FUNC_LIMIT_BAR );
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.PetActivate_OpenGetZhufu || step == EnumGuide.PetActivate_ClickAction) {
            //祝福确定
            let zhufu = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
            if (zhufu != null)
                return zhufu.force(this.type, step);
        } else if (EnumGuide.PetActivate_FlyIcon == step) {
            G.Uimgr.createForm<GuideFlyIconView>(GuideFlyIconView).open(115, "伙伴", KeyWord.FUNC_LIMIT_BAR);
            return true;
        }
        else {
            let view = G.Uimgr.getForm<PetView>(PetView);
            if (EnumGuide.PetActivate_ClickActivate == step) {
                if (null != view) {
                    let jinjieView = view.getChildForm<PetJinJiePanel>(KeyWord.OTHER_FUNCTION_PET_JINJIE);
                    if (null != jinjieView && jinjieView.isOpened) {
                        return jinjieView.force(this.type, step);
                    }
                }
            }
                //关闭界面
            else if (EnumGuide.PetActivate_ClickClose == step) {
                if (null != view) {
                    return view.force(this.type, step);
                }
            }
        }
        return false;
    }
}