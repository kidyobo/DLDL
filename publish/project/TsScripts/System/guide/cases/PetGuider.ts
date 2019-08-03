import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumPetId } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { PetView } from 'System/pet/PetView'
import { PetJinJiePanel } from 'System/pet/PetJinJiePanel'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { GetZhufuView } from 'System/guide/GetZhufuView'
import { Constants } from 'System/constants/Constants'
import { PetData } from 'System/data/pet/PetData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'

/**伙伴进阶 */
export class PetGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.Pet, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PetView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        //this._addStep(EnumGuide.Pet_OpenGetZhufuView, this._onStepGetZhufuView);
        //this._addStep(EnumGuide.Pet_ClickGet, this._onStepClickGet);
        this._addStep(EnumGuide.Pet_OpenPetView, this._onStepOpenPetView);
        this._addStep(EnumGuide.Pet_ClickJinJie, this._onStepClickJinJie);
        this._addStep(EnumGuide.Pet_ClickClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.Pet_OpenGetZhufuView;
    }

    //private _onStepGetZhufuView(step: EnumGuide) {
    //    G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, EnumPetId.ALi);

    //    //let petId = Constants.FirstPetId;
    //    //let cfg = PetData.getEnhanceConfig(petId, 1);
    //    //let zdl = FightingStrengthUtil.calPetFight(cfg.m_astAttrList);
    //    //G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(KeyWord.BAR_FUNCTION_BEAUTY, false, petId, zdl);
    //}

    //private _onStepClickGet(step: EnumGuide) {
    //    let getZhufuView = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
    //    if (null != getZhufuView) {
    //        G.ViewCacher.functionGuideView.guideOn(getZhufuView.content, EnumGuideArrowRotation.right, { x: 82, y: -260 }, [getZhufuView.btnEquip], false);
    //    } else {
    //        this.onGuideStepFinished(step);
    //    }
    //}

    private _onStepOpenPetView(step: EnumGuide) {
        // 直接弹开面板
        G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE);
    }

    private _onStepClickJinJie(step: EnumGuide) {
        let jinjieView = G.Uimgr.getChildForm<PetJinJiePanel>(PetView, KeyWord.OTHER_FUNCTION_PET_JINJIE);
        let selectedItem = jinjieView.getSelectedPetItem();
        let focusTargets: UnityEngine.GameObject[];
        if (null != selectedItem) {
            focusTargets = [selectedItem];
        }
        G.ViewCacher.functionGuideView.guideOn(jinjieView.btnAutoEnhance, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<PetView>(PetView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.Pet_ClickGet == step) {
            let view = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
            if (null != view) {
                return view.force(this.type, step);
            }
        } else {
            let view = G.Uimgr.getForm<PetView>(PetView);
            if (null != view) {
                if (EnumGuide.Pet_ClickJinJie == step) {
                    let jinjieView = view.getChildForm<PetJinJiePanel>(KeyWord.OTHER_FUNCTION_PET_JINJIE);
                    if (null != jinjieView && jinjieView.isOpened) {
                        return jinjieView.force(this.type, step);
                    }
                } else if (EnumGuide.Pet_ClickClose == step) {
                    return view.force(this.type, step);
                }
            }
        }
        return false;
    }
}