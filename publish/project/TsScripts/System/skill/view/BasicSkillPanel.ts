import { Global as G } from 'System/global'
import { SkillBasePanel } from 'System/skill/view/SkillBasePanel'
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { FixedList } from "System/uilib/FixedList"
import { RegExpUtil } from "System/utils/RegExpUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { SkillData } from "System/data/SkillData"
import { Color } from "System/utils/ColorUtil"
import { IconItem } from "System/uilib/IconItem"
import { ThingData } from "System/data/thing/ThingData"
import { MaterialItemData } from "System/data/vo/MaterialItemData"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { TipFrom } from "System/tip/view/TipsView"
import { UIUtils } from 'System/utils/UIUtils'
import { EnumGuide } from 'System/constants/GameEnum'
import { ElemFinder } from 'System/uilib/UiUtility'


export class BasicSkillPanel extends SkillBasePanel {
    private readonly ZYLen = 4;

    private m_nextSkillID: number;
    private skillList: FixedList;
    private skillItems: SkillIconItem[] = null;
    private skillConfigs: GameConfig.SkillConfigM[] = [];
    private textStudyLv: UnityEngine.UI.Text = null;
    private auto: UnityEngine.GameObject = null;
    private levelUp: UnityEngine.GameObject = null;
    private materialIcon: IconItem = null;
    private m_materialIconData: MaterialItemData = new MaterialItemData();
    private textAutoLv: UnityEngine.UI.Text;

    private openSkillId = 0;

    private BT_Upgrade: UnityEngine.GameObject = null;
    private BT_UpgradeRect: UnityEngine.RectTransform = null;

    BT_UpgradeAll: UnityEngine.GameObject = null;
    private skillIcon_Normal: UnityEngine.GameObject;

    /**用于引导*/
    rightGo: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SKILL_BASIC);
    }

    protected resPath(): string {
        return UIPathData.BasicSkillView;
    }

    protected initElements() {
        super.initElements();
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        this.skillList = this.elems.getUIFixedList("skillList");

        this.auto = this.elems.getElement("auto");
        this.textAutoLv = this.elems.getText('textAutoLv');

        this.levelUp = this.elems.getElement("levelUp");
        this.textStudyLv = this.elems.getText("textStudyLv");
        this.materialIcon = new IconItem();
        this.materialIcon.setUsualIconByPrefab(this.elems.getElement("itemIcon_Normal"), this.elems.getElement("materialIcon"));
        this.materialIcon.forceShowNum = true;
        this.materialIcon.setTipFrom(TipFrom.material);
        this.BT_Upgrade = this.elems.getElement("BT_Upgrade");
        this.BT_UpgradeRect = this.elems.getRectTransform("BT_Upgrade");
        this.BT_UpgradeAll = this.elems.getElement("BT_UpgradeAll");

        this.rightGo = this.elems.getElement('right');
    }

    protected initListeners(): void {
        this.addClickListener(this.BT_Upgrade, this.onClickBtnStudy);
        this.addClickListener(this.BT_UpgradeAll, this.onClickBtnUpgradeAll);

        this.skillList.onValueChange = delegate(this, this.onValueChange);
    }

    open(skillId: number = 0) {
        this.openSkillId = skillId;
        super.open();
    }

    protected onOpen() {
        this.onSkillChange();
        // 自动选中
        if (G.GuideMgr.isGuiding(EnumGuide.SkillUp)) {
            // 自动选中怒气技能
            this.openSkillId = this.skillConfigs[this.ZYLen + 1].m_iSkillID;
        }

        let autoIdx = -1;

        let cnt = this.skillConfigs.length;
        //在“我要变强”进入这里，会指定一个技能，把被动技能相关的砍掉，用下边的那个弄
        if (this.openSkillId > 0) {
            for (let i = 0; i < cnt; i++) {
                if (SkillData.isSameClassSkill(this.skillConfigs[i].m_iSkillID, this.openSkillId)) {
                    if (i >= 5)
                        autoIdx = -1;
                    else
                        autoIdx = i;
                    break;
                }
            }
        }
        if (autoIdx < 0) {
            // 自动选中第一个可以升级的
            //for (let i = 0; i < cnt; i++) {
            //    if (SkillData.canStudyOrUpgrade(this.skillConfigs[i], false)) {
            //        autoIdx = i;
            //        break;
            //    }
            //}

            if (SkillData.canStudySkill(this.skillConfigs[4].m_iSkillID, false))
                autoIdx = 4;
            else {
                //自动选择级别低的（可升级）
                autoIdx = SkillData.canStudyMinLevel(this.skillConfigs);
            }

        }
        if (autoIdx < 0) {
            autoIdx = 0;
        }

        this.skillList.Selected = autoIdx;
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.SkillUp, EnumGuide.SkillUp_ClickSkill);
    }

    protected onClose() {
    }

    private onValueChange(index: number) {
        let config = this.skillConfigs[index];
        this.m_selectSkillConfig = config;
        this.updateSelectedSkill();

        if (config.completed) {
            this.m_nextSkillID = config.m_iNextLevelID;
        }
        else {
            this.m_nextSkillID = config.m_iSkillID;
        }
        let nextConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(this.m_nextSkillID);
        if (nextConfig != null) {
            let level: number = G.DataMgr.heroData.level;
            if (nextConfig.m_stSkillStudy.m_iStudyItem > 0) {
                this.auto.SetActive(false);
                this.levelUp.SetActive(true);
                //被动技能设置为消耗魂币了，就是金币 额外设置吧
                if (index > this.ZYLen) {
                    this.materialIcon.updateById(nextConfig.m_stSkillStudy.m_iStudyItem, nextConfig.m_stSkillStudy.m_iStudyItemNum)
                    this.materialIcon.updateIcon();
                }
                else {
                    this.m_materialIconData.id = nextConfig.m_stSkillStudy.m_iStudyItem;
                    this.m_materialIconData.need = nextConfig.m_stSkillStudy.m_iStudyItemNum;
                    this.m_materialIconData.has = G.DataMgr.thingData.getThingNum(this.m_materialIconData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    this.materialIcon.updateByMaterialItemData(this.m_materialIconData)
                    this.materialIcon.updateIcon();
                }
                let ispassive = SkillData.isPassiveSkill(config.m_iSkillID);
                this.BT_UpgradeAll.SetActive(ispassive);
                if (ispassive) {
                    //开
                    this.BT_UpgradeRect.anchoredPosition = new UnityEngine.Vector2(94.5, -33);
                }
                else {
                    this.BT_UpgradeRect.anchoredPosition = new UnityEngine.Vector2(189, -33);
                }
                this.BT_Upgrade.SetActive(true);

                if (SkillData.canStudySkill(this.m_nextSkillID, false)) {
                    UIUtils.setButtonClickAble(this.BT_Upgrade, true);
                    UIUtils.setButtonClickAble(this.BT_UpgradeAll, ispassive);
                }
                else {
                    UIUtils.setButtonClickAble(this.BT_Upgrade, false);
                    UIUtils.setButtonClickAble(this.BT_UpgradeAll, false);
                }
            }
            else {
                this.auto.SetActive(true);
                this.textAutoLv.text = uts.format('角色{0}级后自动开放', nextConfig.m_stSkillStudy.m_iStudyLevel);
                this.levelUp.SetActive(false);
            }
            this.textStudyLv.text = uts.format('角色达到：{0}级', TextFieldUtil.getColorText(nextConfig.m_stSkillStudy.m_iStudyLevel.toString(), level >= nextConfig.m_stSkillStudy.m_iStudyLevel ? Color.GREEN : Color.RED));
            this.textStudyLv.gameObject.SetActive(true);
        }
        else {
            //没有下一等级说明满级了
            ////非职业技能去掉描述
            this.textStudyLv.gameObject.SetActive(false);
            this.auto.SetActive(false);
            this.levelUp.SetActive(false);
        }
    }

    private onClickBtnStudy(): void {
        if (this.m_selectSkillConfig == null) {
            return;
        }

        let skillID: number = 0;
        if (this.m_selectSkillConfig.completed)  // 已经学过
        {
            skillID = this.m_selectSkillConfig.m_iNextLevelID;
        }
        else {
            skillID = this.m_selectSkillConfig.m_iSkillID;
        }

        if (SkillData.canStudySkill(skillID, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(skillID, Macros.OPERATE_SKILL_STUDY, 0));
        }
    }
    /**
     * 点击一键升级按钮事件的响应函数。
     * @param event
     * 
     */
    private onClickBtnUpgradeAll(): void {
        if (this.m_selectSkillConfig == null) {
            return;
        }
        let min = SkillData.canStudyMinLevel(this.skillConfigs);
        if (min == -1) {
            return;
        }
        let upskills: number[] = [];
        //当前选中的是最低等级的
        for (let i = 0; i < this.ZYLen + 1; i++) {
            if (this.skillConfigs[min].completed == 0) {
                //未学的
                if (this.skillConfigs[this.ZYLen + 1 + i].completed == 0)
                    upskills.push(i);
            }
            else {
                if (this.skillConfigs[this.ZYLen + 1 + i].m_ushSkillLevel <= this.skillConfigs[min].m_ushSkillLevel)
                    upskills.push(i);
            }

        }
        let uplen = upskills.length;
        let upskillid: number;
        for (let i = 0; i < uplen; i++) {
            let skill = this.skillConfigs[this.ZYLen + 1 + upskills[i]];
            if (skill.completed)  // 已经学过
            {
                upskillid = skill.m_iNextLevelID;
            }
            else {
                upskillid = skill.m_iSkillID;
            }
            if (SkillData.canStudySkill(upskillid, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(upskillid, Macros.OPERATE_SKILL_STUDY, 0));
            }
            else {
                break;
            }
        }

        G.GuideMgr.processGuideNext(EnumGuide.SkillUp, EnumGuide.SkillUp_ClickUp);
    }

    /**
     * 职业技能变化事件的响应函数。
     * @param newSkillID
     * 
     */
    public onSkillChange(): void {
        let prof = G.DataMgr.heroData.profession;
        let allSkills = G.DataMgr.skillData.getSkillsByProf(prof);
        let ZY = allSkills[KeyWord.SKILL_BRANCH_ROLE_ZY];
        let NQ = allSkills[KeyWord.SKILL_BRANCH_ROLE_NQ];
        for (let i = 0, count = NQ.length; i < count; i++) {
            if (NQ[i].m_iSkillID == Macros.PROF_TYPE_HUNTER_VIP_SKILL_ID || NQ[i].m_iSkillID == Macros.PROF_TYPE_WARRIOR_VIP_SKILL_ID) {
                NQ.splice(i, 1);
                break;
            }
        }

        let BD = G.DataMgr.skillData.getPassiveSkill();
        let NQLen = NQ.length;
        let BDLen = BD.length;
        this.skillItems = [];
        this.skillConfigs = [];
        for (let i = 0; i < this.ZYLen; i++) {
            let item = this.skillList.GetItem(i);
            let txtName = item.findText("txtName");
            txtName.text = ZY[i].m_szSkillName;
            let iconRoot = item.transform.Find("icon").gameObject;
            let txtLv = ElemFinder.findText(item.gameObject, "txtLv");
            let iconItem = item.data.iconItem as SkillIconItem;
            if (iconItem == null) {
                iconItem = item.data.iconItem = new SkillIconItem(false);
                iconItem.setUsuallyByPrefab(this.skillIcon_Normal, iconRoot);
                iconItem.needShowLv = true;
            }
            this.skillItems.push(iconItem);
            this.skillConfigs.push(ZY[i]);
            iconItem.updateBySkillID(ZY[i].m_iSkillID);
            iconItem.updateIcon();
            iconItem.closeLevelText();
            // iconItem.setSize(80);
            let num = iconItem.getSkillLevel();
            txtLv.text = num != 0 ? num.toString() + "级" : "";

        }
        for (let i = 0; i < NQLen; i++) {
            let item = this.skillList.GetItem(i + this.ZYLen);
            let iconRoot = item.transform.Find("icon").gameObject;
            let txtLv = ElemFinder.findText(item.gameObject, "txtLv");

            let iconItem = item.data.iconItem as SkillIconItem;
            if (iconItem == null) {
                iconItem = item.data.iconItem = new SkillIconItem(false);
                iconItem.setUsuallyByPrefab(this.skillIcon_Normal, iconRoot);
                iconItem.needShowLv = true;
                iconItem.needArrow = true;
            }
            this.skillItems.push(iconItem);
            this.skillConfigs.push(NQ[i]);
            iconItem.updateBySkillID(NQ[i].m_iSkillID);
            iconItem.updateIcon();
            // iconItem.setSize(80);
            iconItem.closeLevelText();
            let num = iconItem.getSkillLevel();
            txtLv.text = num != 0 ? num.toString() + "级" : "";
        }
        for (let i = 0; i < BDLen; i++) {
            let item = this.skillList.GetItem(i + this.ZYLen + NQLen);
            let iconRoot = item.transform.Find("icon").gameObject;
            let txtLv = ElemFinder.findText(item.gameObject, "txtLv");
            let iconItem = item.data.iconItem as SkillIconItem;
            if (iconItem == null) {
                iconItem = item.data.iconItem = new SkillIconItem(false);
                iconItem.setUsuallyByPrefab(this.skillIcon_Normal, iconRoot);
                iconItem.needShowLv = true;
                iconItem.needArrow = true;
            }
            this.skillItems.push(iconItem);
            this.skillConfigs.push(BD[i]);
            iconItem.updateBySkillID(BD[i].m_iSkillID);
            iconItem.updateIcon();
            iconItem.closeLevelText();
            let num = iconItem.getSkillLevel();
            txtLv.text = num != 0 ? num.toString() + "级" : "";
        }
        if (this.skillList.Selected >= 0) {
            this.onValueChange(this.skillList.Selected);
        }
    }
    public _onContainerChange() {
        if (this.m_materialIconData.id > 0) {
            this.m_materialIconData.has = G.DataMgr.thingData.getThingNum(this.m_materialIconData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            let ispassive = SkillData.isPassiveSkill(this.m_nextSkillID);

            this.BT_UpgradeAll.SetActive(ispassive);
            if (ispassive) {
                //开
                this.BT_UpgradeRect.anchoredPosition = new UnityEngine.Vector2(94.5, -33);
            }
            else {
                this.BT_UpgradeRect.anchoredPosition = new UnityEngine.Vector2(189, -33);
            }
            if (SkillData.canStudySkill(this.m_nextSkillID, false)) {
                UIUtils.setButtonClickAble(this.BT_Upgrade, true);
                UIUtils.setButtonClickAble(this.BT_UpgradeAll, true);
            }
            else {
                UIUtils.setButtonClickAble(this.BT_Upgrade, false);
                UIUtils.setButtonClickAble(this.BT_UpgradeAll, false);
            }
        }
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    getSelectedIcon(): UnityEngine.GameObject {
        let selected = this.skillList.Selected;
        if (selected >= 0) {
            return this.skillList.GetItem(selected).gameObject;
        }
        return null;
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.SkillUp_ClickUp == step) {
            this.onClickBtnUpgradeAll();
            return true;
        }
        return false;
    }
}