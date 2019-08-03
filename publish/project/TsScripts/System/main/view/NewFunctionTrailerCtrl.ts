import { UiElements } from 'System/uilib/UiElements'
import { Global as G } from 'System/global'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UnitCtrlType, GameIDType } from 'System/constants/GameEnum'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { PetData } from 'System/data/pet/PetData'
import { PetView } from 'System/pet/PetView'
import { JuYuanView } from 'System/juyuan/JuYuanView'
import { HeroView } from 'System/hero/view/HeroView'
import { UIUtils } from 'System/utils/UIUtils'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { GameObjectGetSet } from '../../uilib/CommonForm';

/**新功能预告*/
export class NewFunctionTrailerCtrl {

    private m_config: GameConfig.NewFeatPreConfigM;
    /**时装avatarList*/
    private m_avatarList: Protocol.AvatarList = null;
    private tfProgress: UnityEngine.UI.Text;
    private m_showTips: boolean = false;
    private m_maxW: number = 0;
    private altas: Game.UGUIAltas;
    private area: UnityEngine.GameObject;
    private modlePos: UnityEngine.GameObject;
    private modleTransForm: UnityEngine.Transform;
    /**角色模型*/
    private roleAvatar: UIRoleAvatar;
    private nameText: UnityEngine.UI.Text;
    private btn_switcher: UnityEngine.GameObject;
    private isActive: boolean = true;
    private panel: UnityEngine.GameObject;
    private taskCtrl: GameObjectGetSet;
    //技能提升指引
    private m_btnGo: UnityEngine.GameObject;
    private guideIcon: UnityEngine.GameObject;
    private openIcon: UnityEngine.GameObject;
    private closeIcon: UnityEngine.GameObject;
    private enabled = true;
    /**是否需要更新*/
    private isDirty = false;

    /**当存在其他指引箭头时，隐藏翅膀升级的箭头*/
    private isGuideArrowEnabled = true;

    setView(uiElems: UiElements) {
        this.area = uiElems.getElement('newFunctionArea');
        let elems = uiElems.getUiElements('newFunctionArea');

        this.panel = elems.getElement('content');
        this.taskCtrl = new GameObjectGetSet(elems.getElement("taskCtrl"));
        this.modlePos = elems.getElement('rolePosition');
        this.tfProgress = elems.getText('Progress');
        this.nameText = elems.getText('nameText');
        this.btn_switcher = elems.getElement('switcherBtn');
        this.m_btnGo = elems.getElement('btn_Up');
        this.guideIcon = elems.getElement('guide');
        Game.UIClickListener.Get(this.btn_switcher).onClick = delegate(this, this.onClickSwitcherBt);

        G.addUIRaycaster(this.m_btnGo);
        Game.UIClickListener.Get(this.m_btnGo).onClick = delegate(this, this.onBtnGoClick);
        this.openIcon = elems.getElement('openIcon');
        this.closeIcon = elems.getElement('closeIcon');
        this.modleTransForm = this.modlePos.GetComponent(UnityEngine.Transform.GetType()) as UnityEngine.Transform;
        this.area.SetActive(false);
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (enabled) {
            this.updateView();
        } else {
            this.area.SetActive(false);
        }
    }

    private onClickSwitcherBt() {
        if (this.isActive) {
            this.setIconActive(false);
        } else {
            this.setIconActive(true);
        }
    }

    private setIconActive(isHidePanel: boolean) {
        this.panel.SetActive(isHidePanel);
        this.openIcon.SetActive(!isHidePanel);
        this.closeIcon.SetActive(isHidePanel);
        this.isActive = isHidePanel;
    }

    taskViewClose() {
        this.taskCtrl.SetActive(true);
    }

    taskViewOpen() {
        this.taskCtrl.SetActive(false);
    }
    onChangeBagThingData(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateView();
        }
    }

    updateView() {
        this.isDirty = true;
    }

    cheakUpdate() {
        if (!this.isDirty) {
            return;
        }
        let canShow = this.enabled;
        if (canShow) {
            let data = G.DataMgr.mainData;
            let config = data.getCurrentXgn();
            canShow = (config != null && data.isShowXgnPanel(config));
        }
        if (canShow) {
            this.area.SetActive(true);
            this.updatePanel();
        } else {
            this.area.SetActive(false);
        }
        this.isDirty = false;
    }



    private updatePanel(): void {
        let mainData = G.DataMgr.mainData;
        this.m_config = mainData.xgnConfig;
        let xgnProgress: number = mainData.xgnProgress;
        this.tfProgress.text = this.m_config.m_szCondition;
        this.nameText.text = this.m_config.m_uiNameIcon;
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
        }
        if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_JU_YUAN) {
            //神力
            let heroData = G.DataMgr.heroData;
            this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
            this.m_avatarList.m_uiDressImageID = this.m_config.m_uiModelId;
            let t = this.modlePos.transform;
            this.roleAvatar = new UIRoleAvatar(t, t);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender);
            this.roleAvatar.m_bodyMesh.playAnimation('stand');
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
            this.roleAvatar.setSortingOrder(0);
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_WHJH) {
            //神器激活
            this.setModlePosTransform(53, 70, 0, -132, 90, 0);
            let zhufuConfig: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(KeyWord.HERO_SUB_TYPE_WUHUN, 1);
            let weaponId = uts.format('{0}_{1}', zhufuConfig.m_iModelID, G.DataMgr.heroData.profession);
            this.showModle(UnitCtrlType.weapon, weaponId);


        }
        else if (this.m_config.m_uiType == KeyWord.BAR_FUNCTION_BEAUTY) {
            //伙伴   
            this.setModlePosTransform(-2, 10, -200, 0, -180, 0);
            let petConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(this.m_config.m_uiModelId, 1);
            this.showModle(UnitCtrlType.pet, petConfig.m_iModelID.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.ACT_FUNCTION_MRBZ || this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_SLQH) {
            //圣灵
            this.setModlePosTransform(0, 0, -200, 0, 145, 0, 150);
            this.showModle(UnitCtrlType.shengling, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_YYQH) {
            //翅膀
            this.setModlePosTransform(0, 50, -200, 0, 180, 0);
            this.showModle(UnitCtrlType.wing, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_ZQJH) {
            //坐骑
            this.setModlePosTransform(-3, 10, -200, 0, -151, 0);
            this.showModle(UnitCtrlType.ride, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_FZJH) {
            //圣印
            this.setModlePosTransform(0, 35, -200, 90, 0, 0);
            this.showModle(UnitCtrlType.zhenfa, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
            //星环
            //this.m_panel3d.setMonsterMode(3, this.m_config.m_uiModelId.toString(), null);
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) {
            //强化
            //this.m_panel3d.setMonsterMode(3, this.m_config.m_uiModelId.toString(), null);
        } else if (this.m_config.m_uiType == KeyWord.HERO_SUB_TYPE_LEILING || this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_LLJH) {
            //真迹
            this.setModlePosTransform(0, 35, -200, 90, 0, 0);
            this.showModle(UnitCtrlType.shenji, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_PERSONAL_BOSS) {
            //个人boss
            this.setModlePosTransform(0, 12, -200, 0, 180, 0, 20);
            this.showModle(UnitCtrlType.boss, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_PET_JINJIE) {
            //伙伴
            this.setModlePosTransform(-2, 10, -215, 0, -180, 0);
            this.showModle(UnitCtrlType.pet, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_HUNHUAN) {
            //魂环
            this.setModlePosTransform(0, 60, 0, -45, 0, 0);
            this.showModle(UnitCtrlType.other, "effect/hunhuan/bainian.prefab");
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_ZHUANSHENG) {
            //魂力
            let prof = G.DataMgr.heroData.profession;
            if (prof == 1) {
                //女号 按逻辑
                this.setModlePosTransform(-50, 110, 0, -215, -270, 0);
                let zhufuConfig: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(KeyWord.HERO_SUB_TYPE_WUHUN, 1);
                let weaponId = uts.format('{0}_{1}', zhufuConfig.m_iModelID, prof);
                this.showModle(UnitCtrlType.weapon, weaponId);
            } else {
                //男号 按逻辑
                this.setModlePosTransform(-21, 80, 0, 45, -125, 175, 80);
                let zhufuConfig: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(KeyWord.HERO_SUB_TYPE_WUHUN, 1);
                let weaponId = uts.format('{0}_{1}', zhufuConfig.m_iModelID, prof);
                this.showModle(UnitCtrlType.weapon, weaponId);
                //男号 自定义加载
                // this.setModlePosTransform(-21, 80, 0, -30, -0, 123, 70);
                // let modelUrl = 'model/hero/1501/zhua.prefab';
                // G.ResourceMgr.loadModel(this.modlePos, UnitCtrlType.other, modelUrl, G.ViewCacher.mainView.sortingOrder, true);
            }
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_HUNGUN_FZ) {
            //魂骨封装
            this.setModlePosTransform(0, 35, 0, -45, 0, 0, 45);
            this.showModle(UnitCtrlType.collection, this.m_config.m_uiModelId.toString());
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) {
            //翅膀
            this.setModlePosTransform(0, 50, 0, 45, 0, 0, 25);
            this.showModle(UnitCtrlType.wing, this.m_config.m_uiModelId.toString());
        }
        this.updateGuildeIcon();
    }


    /**模型显示*/
    private showModle(type: UnitCtrlType, modleId: string) {
        G.ResourceMgr.loadModel(this.modlePos, type, modleId, G.ViewCacher.mainView.sortingOrder, true);
    }

    private setModlePosTransform(posX: number, posY: number, posZ: number, rotateX: number, rotateY: number, rotateZ: number, scale: number = 30) {
        this.modleTransForm.localPosition = G.getCacheV3(posX, posY, posZ);
        this.modleTransForm.rotation = UnityEngine.Quaternion.Euler(rotateX, rotateY, rotateZ);
        this.modleTransForm.localScale = G.getCacheV3(scale, scale, scale);
    }


    private onBtnGoClick(): void {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(this.m_config.m_uiType))
            return;
        if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_YYQH) {
            //G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_YUYI);
            G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
        }
        else if (this.m_config.m_uiType == KeyWord.BAR_FUNCTION_BEAUTY) {
            G.Uimgr.createForm<PetView>(PetView).open();
        }
        else if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_JU_YUAN) {
            G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
        }
    }

    enableGuideArrow(isEnabled: boolean) {
        this.isGuideArrowEnabled = isEnabled;
        this.updateGuildeIcon();
    }

    private updateGuildeIcon() {
        let showArrow = false;
        if (this.enabled && this.isGuideArrowEnabled && this.m_config) {
            if (this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_YYQH) {
                showArrow = G.DataMgr.zhufuData.canStrengthZhufuSystem(KeyWord.HERO_SUB_TYPE_YUYI);
            } else if (this.m_config.m_uiType == KeyWord.ACT_FUNCTION_MRBZ || this.m_config.m_uiType == KeyWord.OTHER_FUNCTION_SLQH) {
                showArrow = G.DataMgr.zhufuData.checkShengLingCanUp();
            }
        }
        this.guideIcon.SetActive(showArrow);
    }
}