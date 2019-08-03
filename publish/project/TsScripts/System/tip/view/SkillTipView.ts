import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { SkillTipData } from 'System/tip/tipData/SkillTipData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { SkillData } from 'System/data/SkillData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { UIUtils } from "System/utils/UIUtils"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumTipChid } from 'System/tip/view/TipsView'
import { ZhufuData } from 'System/data/ZhufuData'
import { PetData } from 'System/data/pet/PetData'
import { GameIDUtil } from "System/utils/GameIDUtil";
import { CurrencyIcon } from "System/uilib/CurrencyIcon";

export class SkillTipView extends NestedSubForm {

    /**技能数据*/
    private tipData: SkillTipData;

    /**技能图标*/
    private iconItem: SkillIconItem;

    /**技能名字*/
    private txtName: UnityEngine.UI.Text;
    /**技能等级 */
    private txtLevel: UnityEngine.UI.Text;
    /**技能类型*/
    private txtType: UnityEngine.UI.Text;

    /**技能cd*/
    private txtCd: UnityEngine.UI.Text;

    /**技能效果*/
    private txtDesc: UnityEngine.UI.Text;

    /**下级效果*/
    private txtNextDesc: UnityEngine.UI.Text;
    /**学习条件*/
    private txtStudy: UnityEngine.UI.Text;
    /**技能效果*/
    private descTitle: UnityEngine.GameObject;
    /**下级效果*/
    private nextDescTitle: UnityEngine.GameObject;
    /**学习条件*/
    private studyTitle: UnityEngine.GameObject;

    private BT_UP: UnityEngine.GameObject;
    constructor() {
        super(EnumTipChid.skill);
    }

    protected resPath(): string {
        return UIPathData.SkillTipView;
    }

    protected initElements() {
        let skillIcon_Normal = this.elems.getElement('skillIcon_Normal');
        this.iconItem = new SkillIconItem(false);
        this.iconItem.needGrey = false;
        this.iconItem.needShowLv = true;
        this.iconItem.setUsuallyByPrefab(skillIcon_Normal, this.elems.getElement('icon'));

        this.txtName = this.elems.getText('txtName');
        this.txtType = this.elems.getText('txtType');
        this.txtLevel = this.elems.getText('txtLevel');

        this.txtCd = this.elems.getText('txtCd');


        this.txtDesc = this.elems.getText('txtDesc');

        this.txtNextDesc = this.elems.getText('txtNextDesc');
        this.txtStudy = this.elems.getText('txtStudy');

        this.descTitle = this.elems.getElement('descTitle');
        this.nextDescTitle = this.elems.getElement('nextDescTitle');
        this.studyTitle = this.elems.getElement('studyTitle');

        this.BT_UP = this.elems.getElement('BT_UP');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('BT_Close'), this.onClickClose);
    }
    private onClickClose() {
        G.ViewCacher.tipsView.close();
    }

    open(tipData: SkillTipData) {
        this.tipData = tipData;
        super.open();
    }

    protected onClose() {

    }

    protected onOpen() {
        this.updateView();
    }

    onSkillChange(id: number) {
        let skillConfig: GameConfig.SkillConfigM = this.tipData.skillConfig;
        if (SkillData.isSameClassSkill(skillConfig.m_iSkillID, id)) {
            // 说明升级了
            this.tipData.skillConfig = SkillData.getSkillConfig(id);
            this.updateView();
        }
    }

    private updateView() {
        let skillConfig: GameConfig.SkillConfigM = this.tipData.skillConfig;

        // 更新图标
        this.iconItem.updateBySkillID(skillConfig.m_iSkillID);
        this.iconItem.updateIcon();

        // 技能名字
        this.txtName.text = TextFieldUtil.getColorText(skillConfig.m_szSkillName, Color.getColorById(skillConfig.m_ucSkillColor));
        this.txtLevel.text = TextFieldUtil.getColorText(uts.format("{0}级", skillConfig.m_ushSkillLevel), Color.getColorById(skillConfig.m_ucSkillColor));

        // 技能类型
        if (skillConfig.m_ucSkillType == KeyWord.SKILL_ACTIVE_TYPE) {
            this.txtType.text = '主动技能';
            this.txtType.gameObject.SetActive(true);
        } else if (skillConfig.m_ucSkillType == KeyWord.SKILL_PASSIVE_TYPE) {
            this.txtType.text = '被动技能';
            this.txtType.gameObject.SetActive(true);
        } else {
            this.txtType.gameObject.SetActive(false);
        }

        // cd
        let str: string;
        if (skillConfig.m_stConsumable.length > 0 && skillConfig.m_stConsumable[0].m_iConsumeID == KeyWord.SKILL_CONSUMABLE_TYPE_RAGE) {
            str = TextFieldUtil.getColorText(skillConfig.m_stConsumable[0].m_iConsumeValue.toString(), Color.GREEN);
            this.txtCd.text = uts.format('消耗怒气：{0}', str);
        }
        else if (skillConfig.m_stConsumable.length > 0 && skillConfig.m_stConsumable[0].m_iConsumeID == KeyWord.SKILL_CONSUMABLE_TYPE_BLOOD) {
            let current: string = TextFieldUtil.getColorText(G.DataMgr.heroData.getProperty(Macros.EUAI_BLOOD).toString(), Color.GREEN);
            str = TextFieldUtil.getColorText(skillConfig.m_stConsumable[0].m_iConsumeValue.toString(), Color.GREEN);
            this.txtCd.text = uts.format('消耗精血：{0}/{1}', str, current);
        }
        else if (skillConfig.m_stSkillCollDown.m_uiSelfCoolDown > 0) {
            str = TextFieldUtil.getColorText(Math.round(skillConfig.m_stSkillCollDown.m_uiSelfCoolDown / 1000).toString(), Color.GREEN);
            this.txtCd.text = uts.format('冷却时间：{0}秒', str);
        }
        else {
            this.txtCd.text = '';
        }

        let nextskillConfig: GameConfig.SkillConfigM;
        let jihuo = true;
        if (skillConfig.completed || this.tipData.isPreview || KeyWord.SKILL_BRANCH_WYYZ == skillConfig.m_ucSkillBranch) {
            this.txtDesc.text = RegExpUtil.xlsDesc2Html(skillConfig.m_szDescription);
        }
        else {
            this.txtDesc.text = TextFieldUtil.getColorText('未激活', Color.RED);
            this.txtNextDesc.text = RegExpUtil.xlsDesc2Html(skillConfig.m_szDescription);
            jihuo = false;
        }

        nextskillConfig = jihuo ? SkillData.getSkillConfig(skillConfig.m_iNextLevelID) : skillConfig;
        if (nextskillConfig /**&& nextskillConfig.m_ucSkillBranch != KeyWord.SKILL_BRANCH_FABAO */ && skillConfig.m_ucSkillBranch != KeyWord.SKILL_BRANCH_ROLE_ZY && skillConfig.m_ucSkillBranch != KeyWord.SKILL_BRANCH_ROLE_NQ) {
            let canSkillUp = false;

            this.txtNextDesc.text = RegExpUtil.xlsDesc2Html(nextskillConfig.m_szDescription);
            this.txtNextDesc.gameObject.SetActive(true);
            this.nextDescTitle.SetActive(true);

            let costId = 0;
            let costNum = 0;
            let showStudyBtn = true;
            if (SkillData.isPetNuQiSkill(nextskillConfig)) {
                let yuanFenCfg = PetData.getYuanFenCfgByNuQiSkillId(nextskillConfig.m_iSkillID);
                if (yuanFenCfg == null) {

                }
                else {
                    costId = yuanFenCfg.m_iCondition;
                    costNum = yuanFenCfg.m_iConditionValue;
                }
            } else {
                // 其他技能的升级条件在技能描述里已经写了
                costId = nextskillConfig.m_stSkillStudy.m_iStudyItem;
                costNum = nextskillConfig.m_stSkillStudy.m_iStudyItemNum;
                let skillBra = nextskillConfig.m_ucSkillBranch;
                showStudyBtn = (skillBra == KeyWord.SKILL_BRANCH_WH ||
                    skillBra == KeyWord.SKILL_BRANCH_YY ||
                    skillBra == KeyWord.SKILL_BRANCH_LY ||
                    skillBra == KeyWord.SKILL_BRANCH_ZQ ||
                    skillBra == KeyWord.SKILL_BRANCH_LL) ||
                    skillBra == KeyWord.SKILL_BRANCH_GUILD;
            }
            if (costId > 0) {
                uts.log('//additem ' + costId + ' ' + costNum);


                let thingCfg = ThingData.getThingConfig(costId);
                let costName: string;
                let desc: string = '';
                let costFromDesc: string;
                let hasNum = G.DataMgr.getOwnValueByID(costId);
                if (GameIDUtil.isBagThingID(costId)) {
                    let thingCfg = ThingData.getThingConfig(costId);
                    costName = TextFieldUtil.getItemText(thingCfg);
                    costFromDesc = RegExpUtil.xlsDesc2Html(thingCfg.m_szSpecDesc);
                    desc = uts.format('消耗：{0}({1})', costName, TextFieldUtil.getColorText(hasNum + '/' + costNum, hasNum >= costNum ? Color.GREEN : Color.RED));
                }
                else if (GameIDUtil.isSpecialID(costId)) {
                    costName = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, costId), Color.getCurrencyColor(costId));
                    desc = uts.format('消耗：{0}*{1}', costName, costNum);

                } else {
                    costName = uts.format('[物品{0}]', costId);
                    desc = uts.format('消耗：{0}({1})', costName, TextFieldUtil.getColorText(hasNum + '/' + costNum, hasNum >= costNum ? Color.GREEN : Color.RED));
                }


                if (costFromDesc) {
                    desc += uts.format('\n来源：{0}', costFromDesc);
                }


                this.txtStudy.text = desc;
                this.txtStudy.gameObject.SetActive(true);
                this.studyTitle.SetActive(true);
                canSkillUp = SkillData.canStudySkill(nextskillConfig.m_iSkillID, false);

            } else {
                if (nextskillConfig.m_stSkillStudy.m_iStudyLevel > 0) {
                    this.txtStudy.gameObject.SetActive(true);
                    this.studyTitle.SetActive(true);
                    let stage = nextskillConfig.m_stSkillStudy.m_iStudyLevel;
                    if (nextskillConfig.m_ucSkillBranch == KeyWord.SKILL_BRANCH_XM) {
                        //神力技能特殊处理
                        let config: GameConfig.BloodCfgM = {} as GameConfig.BloodCfgM;
                        let maxBoodLevel = 12;
                        let nextSkillId = nextskillConfig.m_iSkillID;
                        for (let i = 1; i <= maxBoodLevel; i++) {
                            let data = ZhufuData.getXuemaiConfig(i);
                            if (nextSkillId == data.m_iActiveSkillID1 || nextSkillId == data.m_iActiveSkillID2) {
                                config = data;
                                break;
                            }
                        }
                        stage = config.m_iID;
                    } else {
                        stage = Math.floor((nextskillConfig.m_stSkillStudy.m_iStudyLevel - 1) / 10) + 1;
                    }
                    this.txtStudy.text = uts.format("{0}阶可激活", TextFieldUtil.getColorText(stage.toString(), Color.RED));
                }
                else {
                    this.txtStudy.gameObject.SetActive(false);
                    this.studyTitle.SetActive(false);
                }
            }

            if (showStudyBtn) {
                this.BT_UP.SetActive(true);
                if (canSkillUp) {
                    UIUtils.setButtonClickAble(this.BT_UP, true);
                    Game.UIClickListener.Get(this.BT_UP).onClick = delegate(this, this.onClickUpgrade, nextskillConfig);
                }
                else {
                    if (skillConfig.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD) {
                        UIUtils.setButtonClickAble(this.BT_UP, true);
                        Game.UIClickListener.Get(this.BT_UP).onClick = delegate(this, this.onClickUpgrade, nextskillConfig);
                    }
                    else {
                        UIUtils.setButtonClickAble(this.BT_UP, false);
                    }

                }
            }
            else {
                this.BT_UP.SetActive(false);
            }
        } else {
            this.txtNextDesc.gameObject.SetActive(false);
            this.nextDescTitle.SetActive(false);
            this.txtStudy.gameObject.SetActive(false);
            this.studyTitle.SetActive(false);
            this.BT_UP.SetActive(false);
        }
    }
    private onClickUpgrade(skillCfg: GameConfig.SkillConfigM) {

        if (skillCfg.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD) {
            if (!SkillData.canStudySkill(skillCfg.m_iSkillID, false)) {
                G.TipMgr.addMainFloatTip('宗门贡献不足或大于其它宗门技能5级');
                return;
            }
        }
        if (SkillData.isPetNuQiSkill(skillCfg)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetGongfaReequest(PetData.getYuanFenCfgByNuQiSkillId(skillCfg.m_iSkillID).m_iID));
        } else {

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(skillCfg.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0));

        }
    }
}