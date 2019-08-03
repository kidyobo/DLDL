import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { SkillBasePanel } from 'System/skill/view/SkillBasePanel'
import { UiElements } from 'System/uilib/UiElements'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { EnumGuide } from 'System/constants/GameEnum'
import { SkillData } from 'System/data/SkillData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ThingData } from "System/data/thing/ThingData"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MaterialItemData } from "System/data/vo/MaterialItemData"
import { Color } from 'System/utils/ColorUtil'
import { PetData } from 'System/data/pet/PetData'
import { DataFormatter } from 'System/utils/DataFormatter'

class JiBanSkillItem extends ListItemCtrl {
    private icon: SkillIconItem;
    private ing: UnityEngine.GameObject;
    private canUnlock: UnityEngine.GameObject;
    private tipMark: UnityEngine.GameObject;

    skill: GameConfig.SkillConfigM;
    private isUsing = false;

    setComponents(go: UnityEngine.GameObject, iconTemplate: UnityEngine.GameObject) {
        this.icon = new SkillIconItem(false);
        this.icon.needArrow = true;
        this.icon.setUsuallyByPrefab(iconTemplate, ElemFinder.findObject(go, 'icon'));

        this.ing = ElemFinder.findObject(go, 'ing');
        this.canUnlock = ElemFinder.findObject(go, 'canUnlock');
        this.tipMark = ElemFinder.findObject(go, 'tipMark');
    }

    update(skill: GameConfig.SkillConfigM, isUsing: boolean, canUnlock: boolean) {
        this.skill = skill;
        this.isUsing = isUsing;
        this.icon.updateBySkillID(skill.m_iSkillID);
        this.icon.updateIcon();
        this.ing.SetActive(isUsing);
        this.canUnlock.SetActive(canUnlock);
    }

    get IsUsing(): boolean {
        return this.isUsing;
    }
}

class JiBanUnlockItem extends ListItemCtrl {
    private c: UnityEngine.GameObject;
    private head: UnityEngine.UI.RawImage;
    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.c = ElemFinder.findObject(go, 'c');
        this.head = ElemFinder.findRawImage(this.c, 'headImg');

        this.textName = ElemFinder.findText(go, 'textName');
        this.textStage = ElemFinder.findText(go, 'textStage');
    }

    update(cfg: GameConfig.SkillFetterPetPosInfo, petStage: number) {
        G.ResourceMgr.loadImage(this.head, uts.format('images/head/{0}.png', cfg.m_iBeautyID));
        this.textName.text = PetData.getPetConfigByPetID(cfg.m_iBeautyID).m_szBeautyName;
        let showStage = PetData.getPetStage(cfg.m_iBeautyLv, cfg.m_iBeautyID);
        uts.assert(0 != showStage, cfg.m_iBeautyID + ', ' + cfg.m_iBeautyLv);
        this.textStage.text = TextFieldUtil.getColorText(uts.format('{0}阶', DataFormatter.toHanNumStr(showStage)), petStage >= cfg.m_iBeautyLv ? Color.GREEN : Color.RED);
        UIUtils.setGrey(this.c, petStage < cfg.m_iBeautyLv);
    }
}

export class JiBanSkillPanel extends SkillBasePanel {
    private readonly ListCnt = 4;
    private readonly skillListCnt = 3;
    private readonly MaxPetCnt = 4;

    private skillIcon_Normal: UnityEngine.GameObject;

    private list: List;
    private items: SkillIconItem[] = [];
    private itemTipMarks: UnityEngine.GameObject[] = [];
    private zySkills: GameConfig.SkillConfigM[] = [];
    private repleacedSkills: GameConfig.SkillConfigM[] = [];

    private skillList: List;
    private skillItems: JiBanSkillItem[] = [];

    private i1: UnityEngine.GameObject;
    private textProps: UnityEngine.UI.Text;

    private unlock: UnityEngine.GameObject;
    private unlockItems: JiBanUnlockItem[] = [];
    private btnUnlock: UnityEngine.GameObject;
    private labelBtnUnlock: UnityEngine.UI.Text;

    private levelUp: UnityEngine.GameObject;
    private progress: UnityEngine.GameObject;
    private textMax: UnityEngine.GameObject;
    private slider: UnityEngine.UI.Slider;
    private textSlider: UnityEngine.UI.Text;
    private materialIcon: IconItem;
    private m_materialIconData: MaterialItemData = new MaterialItemData();
    private btnUpLevel: UnityEngine.GameObject;
    private labelBtnUpLevel: UnityEngine.UI.Text;
    private btnChange: UnityEngine.GameObject;
    private labelBtnChange: UnityEngine.UI.Text;
    private prop0: UnityEngine.UI.Text;
    private prop1: UnityEngine.UI.Text;

    private auto: UnityEngine.GameObject;

    private oldIdx = -1;
    private gotoPetId = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SKILL_JIBAN);
    }

    protected resPath(): string {
        return UIPathData.JiBanSkillView;
    }

    protected initElements() {
        super.initElements();
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        this.list = this.elems.getUIList('list');
        this.list.Count = this.ListCnt;
        for (let i = 0; i < this.ListCnt; i++) {
            let itemGo = this.list.GetItem(i).gameObject;
            let tipMark = ElemFinder.findObject(itemGo, 'tipMark');
            this.itemTipMarks.push(tipMark);
            let item = new SkillIconItem(false);
            item.needArrow = true;
            item.setUsuallyByPrefab(this.skillIcon_Normal, ElemFinder.findObject(itemGo, 'icon'));
            this.items.push(item);
        }

        this.skillList = this.elems.getUIList('skillList');
        this.skillList.Count = this.skillListCnt;
        for (let i = 0; i < this.skillListCnt; i++) {
            let item = new JiBanSkillItem();
            item.setComponents(this.skillList.GetItem(i).gameObject, this.skillIcon_Normal);
            this.skillItems.push(item);
        }

        this.i1 = this.elems.getElement('i1');
        this.textProps = this.elems.getText('textProps');

        this.unlock = this.elems.getElement('unlock');
        let petList = this.elems.getElement('petList');
        for (let i = 0; i < this.MaxPetCnt; i++) {
            let item = new JiBanUnlockItem();
            item.setComponents(ElemFinder.findObject(petList, i.toString()));
            this.unlockItems.push(item);
        }
        this.btnUnlock = this.elems.getElement('btnUnlock');
        this.labelBtnUnlock = this.elems.getText('labelBtnUnlock');

        this.levelUp = this.elems.getElement('levelUp');
        this.progress = this.elems.getElement('progress');
        this.textMax = this.elems.getElement('textMax');
        this.slider = this.elems.getSlider('slider');
        this.textSlider = this.elems.getText('textSlider');
        this.materialIcon = new IconItem();
        this.materialIcon.setTipFrom(TipFrom.normal);
        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.materialIcon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('materialIcon'));
        this.btnUpLevel = this.elems.getElement('btnUpLevel');
        this.labelBtnUpLevel = this.elems.getText('labelBtnUpLevel');
        this.btnChange = this.elems.getElement('btnChange');
        this.labelBtnChange = this.elems.getText('labelBtnChange');
        this.prop0 = this.elems.getText('prop0');
        this.prop1 = this.elems.getText('prop1');

        this.auto = this.elems.getElement('auto');
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickList);
        this.addListClickListener(this.skillList, this.onClickSkillList);

        this.addClickListener(this.btnUnlock, this.onClickBtnUnlock);
        this.addClickListener(this.btnUpLevel, this.onClickBtnUpLevel);
        this.addClickListener(this.btnChange, this.onClickBtnChange);
    }

    protected onOpen() {
        super.onOpen();
        this.onSkillChange();
    }

    protected onClose() {
        this.oldIdx = -1;
    }

    onSkillChange() {
        let skillData = G.DataMgr.skillData;
        let rawSkills = skillData.getSkillsByProf(G.DataMgr.heroData.profession)[KeyWord.SKILL_BRANCH_ROLE_ZY];

        let autoIdx = -1;
        for (let i = 0; i < this.ListCnt; i++) {
            let skill = rawSkills[i];
            this.zySkills[i] = skill;
            let replacedSkill = skillData.getJiBanSkillReplaced(skill);
            this.repleacedSkills[i] = replacedSkill;
            if (null != replacedSkill) {
                skill = replacedSkill;
            }
            let item = this.items[i];
            item.updateBySkillID(skill.m_iSkillID);
            item.updateIcon();

            let t = false;
            let jiBanSkills = SkillData.getJiBanSkills(skill.m_ucRequireProf, i + 1);
            for (let j = 1; j < this.skillListCnt; j++) {
                let jiBanCfg = jiBanSkills[j - 1];
                let jiBanSkill = skillData.getStudiedSkillBySerial(jiBanCfg.m_iID);

                let showSkill: GameConfig.SkillConfigM;
                if (null != jiBanSkill) {
                    showSkill = jiBanSkill;
                } else {
                    showSkill = SkillData.getSkillConfig(jiBanCfg.m_iID);
                }
                if (SkillData.canStudyOrUpgrade(showSkill, false)) {
                    t = true;
                    if (autoIdx < 0) {
                        autoIdx = i;
                    }
                    break;
                }
            }
            this.itemTipMarks[i].SetActive(t);
        }

        if (this.list.Selected < 0) {
            this.list.Selected = Math.max(0, autoIdx);
        }
        this.onClickList(this.list.Selected);
    }

    onClickList(index: number) {
        let skillData = G.DataMgr.skillData;

        let skill = this.zySkills[index];
        let replacedSkill = this.repleacedSkills[index];

        let item = this.skillItems[0];
        item.update(skill, null == replacedSkill, false);

        let autoIdx = 0;
        let firstCanUnlockIdx = -1;
        let jiBanSkills = SkillData.getJiBanSkills(skill.m_ucRequireProf, index + 1);
        for (let i = 1; i < this.skillListCnt; i++) {
            let jiBanCfg = jiBanSkills[i - 1];
            let jiBanSkill = skillData.getStudiedSkillBySerial(jiBanCfg.m_iID);

            let showSkill: GameConfig.SkillConfigM;
            if (null != jiBanSkill) {
                showSkill = jiBanSkill;
            } else {
                showSkill = SkillData.getSkillConfig(jiBanCfg.m_iID);
            }
            item = this.skillItems[i];
            let canUnlock = !showSkill.completed && 1 == showSkill.m_ushSkillLevel && SkillData.canStudySkill(showSkill.m_iSkillID, false);
            item.update(showSkill, showSkill == replacedSkill, canUnlock);
            if (firstCanUnlockIdx < 0 && canUnlock) {
                firstCanUnlockIdx = i;
            }
            if (showSkill == replacedSkill) {
                autoIdx = i;
            }
        }

        let diffIdx = this.oldIdx != index;
        this.oldIdx = index;

        if (diffIdx || this.skillList.Selected < 0) {
            if (firstCanUnlockIdx >= 0) {
                // 优先选中可以激活的，没有的话就选中当前装配中的
                autoIdx = firstCanUnlockIdx;
            }
            this.skillList.Selected = autoIdx;
        }
        this.onClickSkillList(this.skillList.Selected);
    }

    onClickSkillList(index: number) {
        let skillItem = this.skillItems[index];
        let config = skillItem.skill;

        this.m_selectSkillConfig = config;
        this.updateSelectedSkill();

        UIUtils.setButtonClickAble(this.btnChange, !skillItem.IsUsing);
        this.labelBtnChange.text = skillItem.IsUsing ? '已装配' : '装配';
        if (KeyWord.SKILL_BRANCH_ROLE_FETTER == config.m_ucSkillBranch) {
            // 羁绊技能
            this.i1.SetActive(true);
            this.auto.SetActive(false);

            let showPropSkill: GameConfig.SkillConfigM;
            if (config.completed) {
                // 已激活显示当前属性
                showPropSkill = config;
            } else {
                // 否则显示最高级的属性
                showPropSkill = SkillData.getLastSkill(config.m_iSkillID);
            }
            let props = showPropSkill.m_astPropAtt;
            let stepProps = showPropSkill.m_astStepProp;
            let p0 = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, props[0].m_ucPropId) + '+' + (props[0].m_ucPropValue + config.progress * stepProps[0].m_ucPropValue);
            let p1 = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, props[1].m_ucPropId) + '+' + (props[1].m_ucPropValue + config.progress * stepProps[1].m_ucPropValue);
            this.textProps.text = p0 + '      ' + p1;

            if (config.completed) {
                // 已激活
                this.unlock.SetActive(false);
                this.levelUp.SetActive(true);
                if (config.m_iNextLevelID > 0) {
                    this.labelBtnUpLevel.text = '升级';
                    let nextConfig = SkillData.getSkillConfig(config.m_iNextLevelID);
                    this.textMax.SetActive(false);
                    this.progress.SetActive(true);
                    let level: number = G.DataMgr.heroData.level;

                    let thingConfig = ThingData.getThingConfig(nextConfig.m_stSkillStudy.m_iStudyItem);
                    this.m_materialIconData.id = nextConfig.m_stSkillStudy.m_iStudyItem;
                    this.m_materialIconData.need = nextConfig.m_stSkillStudy.m_ucAllowStep;
                    this.m_materialIconData.has = G.DataMgr.thingData.getThingNum(this.m_materialIconData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    this.materialIcon.updateByMaterialItemData(this.m_materialIconData)
                    this.materialIcon.updateIcon();
                    this.textSlider.text = uts.format('升级进度: {0}/{1}', config.progress, nextConfig.m_stSkillStudy.m_iStudyItemNum);
                    this.slider.value = config.progress / nextConfig.m_stSkillStudy.m_iStudyItemNum;
                    if (this.m_materialIconData.has >= this.m_materialIconData.need) {
                        UIUtils.setButtonClickAble(this.btnUpLevel, true);
                    }
                    else {
                        UIUtils.setButtonClickAble(this.btnUpLevel, false);
                    }

                    this.prop0.text = p0;
                    this.prop1.text = p1;
                }
                else {
                    //没有下一等级说明满级了
                    this.labelBtnUpLevel.text = '已满级';
                    UIUtils.setButtonClickAble(this.btnUpLevel, false);

                    this.textMax.SetActive(true);
                    this.progress.SetActive(false);
                }
                this.btnUpLevel.SetActive(true);
            } else {
                // 未激活
                this.unlock.SetActive(true);
                this.levelUp.SetActive(false);

                let petData = G.DataMgr.petData;
                let jiBanCfg = SkillData.getJiBanConfig(config.m_iSkillID);

                let canUnlock = true;
                for (let i = 0; i < this.MaxPetCnt; i++) {
                    let petItem = this.unlockItems[i];
                    if (i < jiBanCfg.m_iPosCnt) {
                        let p = jiBanCfg.m_astPosInfo[i];
                        let petStage = 0;
                        let petInfo = petData.getPetInfo(p.m_iBeautyID);
                        if (Macros.GOD_LOAD_AWARD_DONE_GET == petInfo.m_ucStatus) {
                            petStage = petInfo.m_uiStage;
                        }
                        petItem.update(p, petStage);
                        petItem.gameObject.SetActive(true);

                        if (canUnlock && petStage < p.m_iBeautyLv) {
                            canUnlock = false;
                            this.gotoPetId = p.m_iBeautyID;
                        }
                    } else {
                        petItem.gameObject.SetActive(false);
                    }
                }

                if (canUnlock) {
                    this.labelBtnUnlock.text = '激活';
                    this.gotoPetId = 0;
                } else {
                    this.labelBtnUnlock.text = '前往升阶';
                }
            }
        } else {
            // 普通技能
            this.i1.SetActive(false);
            this.levelUp.SetActive(true);
            this.auto.SetActive(true);
            this.textMax.SetActive(false);
            this.progress.SetActive(false);
            this.btnUpLevel.SetActive(false);
            this.unlock.SetActive(false);
        }
    }

    onClickBtnUnlock() {
        if (this.gotoPetId > 0) {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, 0, this.gotoPetId);
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(this.m_selectSkillConfig.m_iSkillID, Macros.OPERATE_SKILL_STUDY));
        }
    }

    onClickBtnUpLevel() {
        let nextLevel = this.m_selectSkillConfig.nextLevel;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(nextLevel.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0, 0, nextLevel.m_stSkillStudy.m_ucAllowStep));
    }

    onClickBtnChange() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSetSkillRequest(KeyWord.SKILL_BRANCH_ROLE_FETTER == this.m_selectSkillConfig.m_ucSkillBranch ? this.m_selectSkillConfig.m_iSkillID : 0, this.list.Selected + 1));
    }
}