import { KeyWord } from "System/constants/KeyWord";
import { PetData } from "System/data/pet/PetData";
import { SkillData } from 'System/data/SkillData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { EnumGuildFuncSubTab } from 'System/guild/view/GuildFuncPanel';
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UILayer } from 'System/uilib/CommonForm';
import { List } from "System/uilib/List";
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

class GuildSkillItem extends ListItemCtrl {
    private icon: UnityEngine.GameObject;
    private textName: UnityEngine.UI.Text;
    private prop: UnityEngine.UI.Text;
    private guuildCtritValue: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.icon = ElemFinder.findObject(go, 'icon');
        this.textName = ElemFinder.findText(go, 'textName');
        this.prop = ElemFinder.findText(go, 'prop');
        this.guuildCtritValue = ElemFinder.findText(go, 'guildCtritValue');
    }

    update(cfg: GameConfig.SkillConfigM) {
        this.textName.text = cfg.m_szSkillName;
        this.prop.text = RegExpUtil.xlsDesc2Html(cfg.m_szDescription)/*cfg.m_szSkillName + "+" + cfg.m_astSkillEffect[0].m_iEffectValue*/;
        if (cfg.completed == 0) {
            this.guuildCtritValue.text = "升级需要贡献：" + cfg.m_stSkillStudy.m_iStudyItemNum;
        }
        else {
            if (cfg.m_iNextLevelID != 0) {
                this.guuildCtritValue.text = "升级需要贡献：" + SkillData.getSkillConfig(cfg.m_iNextLevelID).m_stSkillStudy.m_iStudyItemNum;
            }
            else {
                this.guuildCtritValue.text = '已满级';
            }
        }
    }
}

export class GuildGiftSubPanel extends TabSubForm {

    private guildSkillList: List;
    private guildSkillItems: SkillIconItem[] = [];
    private skillIcon_Normal: UnityEngine.GameObject;
    private MaxGuildSkillItems: GuildSkillItem[] = [];

    private textName: UnityEngine.UI.Text;
    private textType: UnityEngine.UI.Text;
    private textLv: UnityEngine.UI.Text;
    private textDesc: UnityEngine.UI.Text;
    private textCost: UnityEngine.UI.Text;
    private textHas: UnityEngine.UI.Text;
    private btnUpGrade: UnityEngine.GameObject;

    constructor() {
        super(EnumGuildFuncSubTab.gift);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildGiftView;
    }

    protected initElements() {
        super.initElements();
        this.guildSkillList = this.elems.getUIList('list');
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        this.textName = this.elems.getText("textName");
        this.textType = this.elems.getText("textType");
        this.textLv = this.elems.getText("textLv");
        this.textDesc = this.elems.getText("textDesc");
        this.textCost = this.elems.getText("textCost");
        this.textHas = this.elems.getText("textHas");
        this.btnUpGrade = this.elems.getElement("btnUpGrade");
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnUpGrade, this.onUpGradeClick);
        this.guildSkillList.onClickItem = delegate(this, this.onClickListItem);
    }

    protected onOpen() {
        super.onOpen();

        this.updateView();

        this.guildSkillList.Selected = 0;
        this.onClickListItem(0);
    }

    updateView() {
        this.guildSkillList.Count = G.DataMgr.skillData.getGuildSkills().length;
        for (let i = 0; i < this.guildSkillList.Count; i++) {
            if (this.guildSkillItems[i] == null) {
                let item = this.guildSkillList.GetItem(i).findObject("icon");
                let guildSkillItem = new SkillIconItem(false);

                guildSkillItem.setUsuallyByPrefab(this.skillIcon_Normal, item)
                guildSkillItem.needShowLv = true;
                guildSkillItem.needArrow = true;
                this.guildSkillItems.push(guildSkillItem);
            }
            let data = G.DataMgr.skillData.getGuildSkills();
            this.guildSkillItems[i].updateBySkillID(data[i].m_iSkillID);
            this.guildSkillItems[i].updateIcon();

            if (this.MaxGuildSkillItems[i] == null) {
                let item = this.guildSkillList.GetItem(i);
                this.MaxGuildSkillItems[i] = new GuildSkillItem();
                this.MaxGuildSkillItems[i].setComponents(item.gameObject);
            }
            this.MaxGuildSkillItems[i].update(data[i]);
        }
        this.updateRightView();
    }

    private updateRightView() {
        let skillData = G.DataMgr.skillData.getGuildSkills()[this.guildSkillList.Selected];
        if (skillData != null) {
            this.textName.text = skillData.m_szSkillName;
            this.textType.text = skillData.m_ucSkillType == 1 ? "主动技能" : "被动技能";
            this.textLv.text = uts.format("等级： {0}级", skillData.m_ushSkillLevel);
            let desc = RegExpUtil.xlsDesc2Html(skillData.m_szDescription);
            if (skillData.completed) {
                desc += '\n\n';
                if (skillData.m_iNextLevelID > 0) {
                    desc += TextFieldUtil.getColorText('下一级效果', Color.PropYellow);
                    desc += '\n';
                    desc += RegExpUtil.xlsDesc2Html(skillData.nextLevel.m_szDescription);
                    this.btnUpGrade.SetActive(true);
                }
                else {
                    //没有下一等级说明满级了
                    desc += TextFieldUtil.getColorText('该技能已升至最高级别', Color.GREEN);
                    this.btnUpGrade.SetActive(false);
                }
            }
            this.textDesc.text = desc;

            this.textCost.text = skillData.m_stSkillStudy.m_iStudyItemNum.toString();
            this.textHas.text = G.DataMgr.getOwnValueByID(skillData.m_stSkillStudy.m_iStudyItem).toString();
        }
    }

    private onClickListItem(index: number) {
        this.updateRightView();
    }

    private onUpGradeClick() {
        let skillCfg = G.DataMgr.skillData.getGuildSkills()[this.guildSkillList.Selected];
        let nextskillCfg = skillCfg.completed ? SkillData.getSkillConfig(skillCfg.m_iNextLevelID) : skillCfg;
        if (nextskillCfg.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD) {
            if (!SkillData.canStudySkill(nextskillCfg.m_iSkillID, false)) {
                G.TipMgr.addMainFloatTip('魂币不足或大于其它宗门技能5级');
                return;
            }
        }

        if (SkillData.isPetNuQiSkill(nextskillCfg)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetGongfaReequest(PetData.getYuanFenCfgByNuQiSkillId(nextskillCfg.m_iSkillID).m_iID));
        } else {

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(nextskillCfg.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0));
        }
    }
}