import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { HunLiView } from 'System/hunli/HunLiView'
import { HunLiPanel } from 'System/hunli/HunLiPanel'
import { PetJinJiePanel } from 'System/pet/PetJinJiePanel'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { Constants } from 'System/constants/Constants'
import { PetData } from 'System/data/pet/PetData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { GetZhufuView } from 'System/guide/GetZhufuView'
import { GuideFlyIconView } from 'System/guide/GuideFlyIconView'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'

/**武魂激活引导 */
export class WuHunActivateGuider extends FunctionGuider {

    private readonly FirstWeapon_Man: number = 230102001;
    private readonly FirstWeapon_Wommon: number = 210102001;
    constructor() {
        super(EnumGuide.WuHunActivate, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HunLiView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.WuHunActivate_OpenHunLiView, this._onStepOpenHunLiView);
        this._addStep(EnumGuide.WuHunActivate_ClickActivate1, this._onStepClickActivate1);
        this._addStep(EnumGuide.WuHunActivate_ClickActivate2, this._onStepClickActivate2);
        this._addStep(EnumGuide.WuHunActivate_ClickClose, this._onStepClickClose);
        this._addStep(EnumGuide.WuHunActivate_OpenGetZhufu, this._onStepOpenGetZhunfu);
        this._addStep(EnumGuide.WuHunActivate_ClickAction, this._onStepClickAction);//点击getZhuFuView的按钮
        //this._addStep(EnumGuide.WuHunActivate_FlyIcon, this._onStepFlyIcon);
        //this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.WuHunActivate_OpenHunLiView;
    }
    private _onStepOpenGetZhunfu(step: EnumGuide) {
        // 直接弹开面板
        let weaponId = 0;
        //女
        if (G.DataMgr.heroData.profession == 1) {
            weaponId = this.FirstWeapon_Wommon;
        } else {//男
            weaponId = this.FirstWeapon_Man;
        }
        let config = ThingData.getThingConfig(weaponId);
        if (config) {
            let zhufu = G.Uimgr.createForm<GetZhufuView>(GetZhufuView);
            if (zhufu != null) {
                zhufu.open(KeyWord.HERO_SUB_TYPE_WUHUN, false, weaponId, config.m_szName);
            }
        } else {
            //这里的装备id是写死的
            uts.logError("拿不到装备数据:" + weaponId);
        }
        
    }

    
    private _onStepClickAction(step: EnumGuide) {
        //点按钮
        let zhufu = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
        if (zhufu != null && zhufu.isOpened) {
            G.ViewCacher.functionGuideView.guideOn(zhufu.btnEquip, EnumGuideArrowRotation.right, { x: 50, y: 0 }, [], false);
        }
    }


    private _onStepOpenHunLiView(step: EnumGuide) {
        //开界面
        //G.Uimgr.createForm<HunLiView>(HunLiView).open(KeyWord.OTHER_FUNCTION_ZHUANSHENG);

        let view = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
        } else {
            G.ViewCacher.functionGuideView.guideOn(G.MainBtnCtrl.btnPet, EnumGuideArrowRotation.left, { x: -10, y: -8 }, [], true, { x: 0, y: -0.1 });
        }
    }

    private _onStepClickActivate1(step: EnumGuide) {
        let hunLiView = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (hunLiView != null) {
            let hunLiPanel = hunLiView.getTabFormByID(KeyWord.OTHER_FUNCTION_ZHUANSHENG) as HunLiPanel;
            if (hunLiPanel != null && hunLiPanel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(hunLiPanel.btnGuide1, EnumGuideArrowRotation.left, { x: -30, y: 0 }, [], true, { x: 0, y: 0 }, { x: 0, y: 0 }, true);
            }
        }
    }

    private _onStepClickActivate2(step: EnumGuide) {
        let hunLiView = G.Uimgr.getForm<HunLiView>(HunLiView) as HunLiView;
        if (hunLiView != null) {
            let hunLiPanel = hunLiView.getTabFormByID(KeyWord.OTHER_FUNCTION_ZHUANSHENG) as HunLiPanel;
            if (hunLiPanel != null) {
                G.ViewCacher.functionGuideView.guideOn(hunLiPanel.btnGuide2, EnumGuideArrowRotation.left, { x: -160, y: 0 });
            }
        }
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<HunLiView>(HunLiView).btnReturn);
    }

    private _onStepFlyIcon(step: EnumGuide): void {
        this.end();
        G.Uimgr.createForm<GuideFlyIconView>(GuideFlyIconView).open(125, "魂力", KeyWord.BAR_FUNCTION_REBIRTH );
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.WuHunActivate_OpenGetZhufu || step == EnumGuide.WuHunActivate_ClickAction) {
            //祝福确定
            let zhufu = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
            if (zhufu != null)
                return zhufu.force(this.type, step);
        } else if (step == EnumGuide.WuHunActivate_OpenHunLiView) {
            G.Uimgr.createForm<HunLiView>(HunLiView).open();
            return true;
        }
        else {
            let view = G.Uimgr.getForm<HunLiView>(HunLiView);
            if (null != view) {
                let hunLiPanel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_ZHUANSHENG) as HunLiPanel;
                //伙伴激活
                if (EnumGuide.WuHunActivate_ClickActivate1 == step || EnumGuide.WuHunActivate_ClickActivate2 == step) {
                    if (null != hunLiPanel && hunLiPanel.isOpened) {
                        return hunLiPanel.force(this.type, step);
                    }
                }
                //关闭界面
                else if (EnumGuide.WuHunActivate_ClickClose == step) {
                    return view.force(this.type, step);
                }
            }
        }
        return false;
    }
}