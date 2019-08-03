import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { ErrorId } from 'System/protocol/ErrorId'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { SettingData } from "System/data/SettingData";
import { Macros } from 'System/protocol/Macros'
import { DeputySetting } from "System/skill/DeputySetting";
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { EnumThingID, EnumStoreID, EnumGuide, EnumAutoUse } from 'System/constants/GameEnum'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { LockView } from 'System/main/view/LockView'
import { ElemFinder } from 'System/uilib/UiUtility';
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { MainView } from "System/main/view/MainView";

export class SystemSettingView extends CommonForm implements IGuideExecutor {
    settingData: SettingData;
    deputySetting: DeputySetting;
    private txtLeftTime: UnityEngine.UI.Text;
    private P_HIDE: UnityEngine.GameObject;
    private P_SKILL: UnityEngine.GameObject;
    private hidearrow: UnityEngine.Transform;
    private skillarrow: UnityEngine.Transform;
    private hidepanel: UnityEngine.GameObject;
    private skillpanel: UnityEngine.GameObject;
    private skillgroup: UnityEngine.GameObject[];
    private skillIcon_Normal: UnityEngine.GameObject;
    private maxCountTip: UnityEngine.UI.Text;
    private playerSlider: UnityEngine.UI.Slider;
    private skillToggles: UnityEngine.UI.ActiveToggle[];
    private btn_qiehuan: UnityEngine.GameObject;

    private HideSkillEffects: UnityEngine.UI.ActiveToggle;
    private HideSelfSkillEffect: UnityEngine.UI.ActiveToggle;
    private HideMonsters: UnityEngine.UI.ActiveToggle;
    private HideFollowers: UnityEngine.UI.ActiveToggle;
    private HidePlayerEffect: UnityEngine.UI.ActiveToggle;
    private HidePlayerModel: UnityEngine.UI.ActiveToggle;
    private HideSkillShake: UnityEngine.UI.ActiveToggle;

    constructor() {
        super(KeyWord.BAR_FUNCTION_SETTING);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.SystemSettingView;
    }

    protected initElements(): void {
        this.txtLeftTime = this.elems.getText('txtLeftTime');
        this.skillIcon_Normal = this.elems.getElement('skillIcon_Normal');
        //右侧区域的特殊设置
        this.P_HIDE = this.elems.getElement('P_HIDE');
        this.P_SKILL = this.elems.getElement('P_SKILL');
        this.hidearrow = this.elems.getTransform('hidearrow');
        this.skillarrow = this.elems.getTransform('skillarrow');
        this.hidepanel = this.elems.getElement('hidepanel');
        this.skillpanel = this.elems.getElement('skillpanel');
        this.skillgroup = [];
        for (let i = 0; i < 5; i++) {
            this.skillgroup[i] = this.elems.getElement(uts.format("skill{0}",i));
        }

        this.maxCountTip = this.elems.getText("maxCountTip");
        this.playerSlider = this.elems.getSlider("playerSlider");
        this.btn_qiehuan = this.elems.getElement('btn_qiehuan');

        this.HideSkillEffects = this.elems.getActiveToggle("C_SKILL");
        this.HideSelfSkillEffect = this.elems.getActiveToggle("C_SELFSKILL");
        this.HideMonsters = this.elems.getActiveToggle("C_MONSTER");
        this.HideFollowers = this.elems.getActiveToggle("C_FOLLOW");
        this.HidePlayerEffect = this.elems.getActiveToggle("C_PLAYEREFFECT");
        this.HidePlayerModel = this.elems.getActiveToggle("C_PLAYERMODEL");
        this.HideSkillShake = this.elems.getActiveToggle("C_SHAKE");
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("btnClose"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement('mask'), this.onBtnReturn);
        this.addClickListener(this.elems.getElement('btnBuyTime') , this.onClickBuyTime);
        let settingData = G.DataMgr.settingData;
        let deputySetting = G.DataMgr.deputySetting;
        this.settingData = settingData;
        this.deputySetting = deputySetting;
        //基础显示
        this.addClickListener(this.btn_qiehuan , this.onSwitchAccount);
        this.addClickListener(this.elems.getElement("btn_suoping"), this.onLockScreen);
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_MUSIC"), this.onChangeMusic, settingData.IsBgmOn);
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_SOUND"), this.onChangeSound, settingData.IsSndOn);
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_AUTOTEAM"), this.onChangeAutoTeam, G.DataMgr.systemData.systemSettingList[Macros.SYSTEM_SETTING_TEAM_INVITE] == 0 ? true : false);
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_AUTOBUYHP"), this.onChangeBuyHP, deputySetting.isAutoBuyMedicine);
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_AUTOBUYREVIVE"), this.onChangeBuyRevive, deputySetting.isRoleReviveEnabled);
        let fps = this.elems.getToggleGroup("C_FPS");
        this.addToggleGroupListener(fps, this.onChangeFrameLevel);
        fps.Selected = settingData.FrameLevel;
        this.playerSlider.onValueChanged = delegate(this, this.onSliderValueChange);
        //隐藏设置

        this.addToggleListenerWithValue(this.HideSkillEffects, this.onChangeHideSkill, settingData.HideSkillEffects);
        this.addToggleListenerWithValue(this.HideSelfSkillEffect, this.onChangeHideSelfSkill, settingData.HideSelfSkillEffect);
        this.addToggleListenerWithValue(this.HideMonsters, this.onChangeHideMonster, settingData.HideMonsters);
        this.addToggleListenerWithValue(this.HideFollowers, this.onChangeHideFollower, settingData.HideFollowers);
        this.addToggleListenerWithValue(this.HidePlayerEffect, this.onChangeHidePlayerEffect, settingData.HidePlayerEffect);
        this.addToggleListenerWithValue(this.HidePlayerModel, this.onChangeHidePlayerModel, settingData.HidePlayerModel);
        this.addToggleListenerWithValue(this.HideSkillShake, this.onChangeSkillShake, settingData.HideSkillShake);

        //右侧位置设置
        this.addClickListener(this.P_HIDE, this.onClickHideP);
        this.addClickListener(this.P_SKILL, this.onClickSkillP);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        let count = this.settingData.MaxPlayerCount;
        this.playerSlider.value = count;
        this.maxCountTip.text = uts.format("最大显示玩家数量{0}", count);

        this.updateGuaJiInfo();
        //刷新技能
        let setting = G.DataMgr.deputySetting;
        let autoSkillIDList = setting.autoSkillIDList;
        let profSkills = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession);
        //职业技能
        let normalSkills = profSkills[KeyWord.SKILL_BRANCH_ROLE_ZY];
        //怒气技能
        let nvqiSkill = profSkills[KeyWord.SKILL_BRANCH_ROLE_NQ][0];
        let skills = [];
        for (let i = 0; i < 4; i++) {
            skills[i] = normalSkills[i];
        }
        skills[4] = nvqiSkill;
        this.skillToggles = [];
        for (let i = 0; i < 5; i++) {
            let skill = skills[i];
            let skillSerialId = Math.floor(skill.m_iSkillID / 100);
            let obj = this.skillgroup[i];
            let toggle = ElemFinder.findActiveToggle(obj, "toggle");
            let name = ElemFinder.findText(obj, "txtName");
            let icon = ElemFinder.findObject(obj, "icon");
            if (i != 4) {
                toggle.isOn = autoSkillIDList.indexOf(skillSerialId) >= 0;
            }
            else {
                toggle.isOn = setting.isAutoUseNuqi;
            }
            name.text = skill.m_szSkillName;
            let skillIcon = new SkillIconItem(true);
            skillIcon.setUsuallyByPrefab(this.skillIcon_Normal, icon);
            skillIcon.updateBySkillID(skill.m_iSkillID);
            skillIcon.updateIcon();
            this.skillToggles[i] = toggle;
            toggle.onValueChanged = delegate(this, this.onSkillValueChange, i, skill);
        }

        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.LiXianGuaJi, EnumGuide.LiXianGuaJi_OpenSystemSetting);
        G.GuideMgr.processGuideNext(EnumGuide.GetLiXianGuaJiKa, EnumGuide.GetLiXianGuaJiKa_OpenSystemSetting);

        this.btn_qiehuan.SetActive(G.ChannelSDK.canSwitchLogin());
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSystemSettingChangeRequest());
        let settingData = G.DataMgr.settingData;
        settingData.writeSetting();
        G.ModuleMgr.deputyModule.save();
        G.GuideMgr.processGuideNext(EnumGuide.LiXianGuaJi, EnumGuide.GuideCommon_None);
        G.GuideMgr.processGuideNext(EnumGuide.GetLiXianGuaJiKa, EnumGuide.GetLiXianGuaJiKa_ClickClose);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    private onSliderValueChange(value: number) {
        this.maxCountTip.text = uts.format("最大显示玩家数量{0}", value);
        this.settingData.MaxPlayerCount = value;
    }

    private onSkillValueChange(value: boolean, index: number, skillConfig: GameConfig.SkillConfigM) {
        if (index == 4 && value) {
            if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2) < 0) {
                let openLevels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_VIP_PRI_SKILL);
                G.TipMgr.addMainFloatTip(uts.format('成为{0}即可独享超强至尊技能', TextFieldUtil.getMultiVipMonthTexts(openLevels)));
                this.skillToggles[index].isOn = false;
                return;
            }
        }
        this.deputySetting.isDefault = false;
        let skillSerialId = Math.floor(skillConfig.m_iSkillID / 100);
        let idx = G.DataMgr.deputySetting.autoSkillIDList.indexOf(skillSerialId);
        if (index<4) {
            if (value) {
                if (idx < 0) {
                    G.DataMgr.deputySetting.autoSkillIDList.push(skillSerialId);
                }
            } else {
                if (idx >= 0) {
                    G.DataMgr.deputySetting.autoSkillIDList.splice(idx, 1);
                }
            }
        } else {
            G.DataMgr.deputySetting.isAutoUseNuqi = value;
        }
    }

    private onClickBuyTime() {
        // 先使用物品
        let itemDatas = G.DataMgr.thingData.getBagItemById(EnumThingID.TJWGK, false, 1);
        if (null != itemDatas && itemDatas.length > 0) {
            let itemData = itemDatas[0];
            G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
        } else {
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(EnumThingID.TJWGK, 1, 0, 0, 0, EnumAutoUse.NormalUse);
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.GetLiXianGuaJiKa, EnumGuide.GetLiXianGuaJiKa_ClickAddTime);
    }

    private onSwitchAccount() {
        G.ChannelSDK.switchLogin();
    }

    private onLockScreen() {
        this.close();
        G.Uimgr.createForm<LockView>(LockView).open();
    }

    private onClickHideP() {
        this.setHidePActive(true);
        this.setSkillPActive(false);
    }
    private onClickSkillP() {
        this.setHidePActive(false);
        this.setSkillPActive(true);
    }

    private setHidePActive(value: boolean) {
        if (value) {
            this.hidepanel.SetActive(true);
            this.hidearrow.localScale = G.getCacheV3(1, -1, 1);
        }
        else {
            this.hidepanel.SetActive(false);
            this.hidearrow.localScale = G.getCacheV3(1, 1, 1);
        }
    }


    private setSkillPActive(value: boolean) {
        if (value) {
            this.skillpanel.SetActive(true);
            this.skillarrow.localScale = G.getCacheV3(1, -1, 1);
            Game.Tools.SetGameObjectLocalPosition(this.P_SKILL, 270, 183, 0);
        }
        else {
            this.skillpanel.SetActive(false);
            this.skillarrow.localScale = G.getCacheV3(1, 1, 1);
            Game.Tools.SetGameObjectLocalPosition(this.P_SKILL, 270, -177, 0);
        }
    }

    updateGuaJiInfo() {
        this.txtLeftTime.text = DataFormatter.second2day(Math.floor(G.DataMgr.systemData.GuajiLeftTime / 60) * 60);
    }

    private onChangeMusic(value: boolean) {
        this.settingData.IsBgmOn = value;
    }
    private onChangeSound(value: boolean) {
        this.settingData.IsSndOn = value;
    }
    private onChangeAutoTeam(value: boolean) {
        G.DataMgr.systemData.systemSettingList[Macros.SYSTEM_SETTING_TEAM_INVITE] = value ? 0 : 1;
    }
    private onChangeBuyHP(value: boolean) {
        this.deputySetting.isDefault = false;
        this.deputySetting.isAutoBuyMedicine = value;
    }
    private onChangeBuyRevive(value: boolean) {
        this.deputySetting.isDefault = false;
        this.deputySetting.isRoleReviveEnabled = value;
    }
    private onChangeFrameLevel(value: number) {
        this.settingData.FrameLevel = value;
        if (value == 0) {
            this.HideSkillEffects.isOn = true;
            this.HideSelfSkillEffect.isOn = true;
            this.HideMonsters.isOn = true;
            this.HideFollowers.isOn = true;
            this.HidePlayerEffect.isOn = true;
            this.HidePlayerModel.isOn = true;
            this.playerSlider.value = 5;
        }
        else if (value == 1) {
            this.HideSkillEffects.isOn = true;
            this.HideSelfSkillEffect.isOn = false;
            this.HideMonsters.isOn = false;
            this.HideFollowers.isOn = true;
            this.HidePlayerEffect.isOn = false;
            this.HidePlayerModel.isOn = false;
            this.playerSlider.value = 10;
        }
        else {
            this.HideSkillEffects.isOn = false;
            this.HideSelfSkillEffect.isOn = false;
            this.HideMonsters.isOn = false;
            this.HideFollowers.isOn = false;
            this.HidePlayerEffect.isOn = false;
            this.HidePlayerModel.isOn = false;
            this.playerSlider.value = 30;
        }
    }

    private onChangeHideSkill(value: boolean) {
        this.settingData.HideSkillEffects = value;
    }
    private onChangeHideSelfSkill(value: boolean) {
        this.settingData.HideSelfSkillEffect = value;
    }
    private onChangeHideMonster(value: boolean) {
        this.settingData.HideMonsters = value;
    }
    private onChangeHideFollower(value: boolean) {
        this.settingData.HideFollowers = value;
    }
    private onChangeHidePlayerEffect(value: boolean) {
        this.settingData.HidePlayerEffect = value;
    }
    private onChangeHidePlayerModel(value: boolean) {
        this.settingData.HidePlayerModel = value;
    }
    private onChangeSkillShake(value: boolean) {
        this.settingData.HideSkillShake = value;
    }
    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.GetLiXianGuaJiKa_ClickAddTime == step) {
            this.onClickBuyTime();
            return true;
        } else if (EnumGuide.GetLiXianGuaJiKa_ClickClose == step) {
            this.onBtnReturn();
            return true;
        }
        return false;
    }
}
export default SystemSettingView;