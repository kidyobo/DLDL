import { Global as G } from 'System/global'
import { TabSubForm } from 'System/uilib/TabForm'
import { SkillData } from 'System/data/SkillData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'

export abstract class SkillBasePanel extends TabSubForm {
    protected textName: UnityEngine.UI.Text;
    protected textDesc: UnityEngine.UI.Text;
    protected textCd: UnityEngine.UI.Text;
    protected textLv: UnityEngine.UI.Text;

    protected m_selectSkillConfig: GameConfig.SkillConfigM;

    protected initElements() {
        this.textName = this.elems.getText("textName");
        this.textDesc = this.elems.getText("textDesc");
        this.textCd = this.elems.getText("textCd");
        this.textLv = this.elems.getText("textLv");
    }

    protected updateSelectedSkill() {
        let level: number = G.DataMgr.heroData.level;
        let showSkill: GameConfig.SkillConfigM;
        if (this.m_selectSkillConfig.completed) {
            showSkill = this.m_selectSkillConfig;
        } else {
            showSkill = SkillData.getLastSkill(this.m_selectSkillConfig.m_iSkillID);
        }

        let s = showSkill.m_szSkillName;
        if (showSkill.completed) {
            s += uts.format("  {0}级", showSkill.m_ushSkillLevel);
        }
        else {
            s += "（未学习）";
        }
        this.textName.text = s;
        this.textCd.text = uts.format("冷却时间：{0}秒", TextFieldUtil.getColorText((showSkill.m_stSkillCollDown.m_uiSelfCoolDown / 1000).toString(), Color.PropGreen));
        this.textLv.text = uts.format("等级：{0}级", TextFieldUtil.getColorText(showSkill.m_ushSkillLevel.toString(), Color.PropGreen));
        let desc = RegExpUtil.xlsDesc2Html(showSkill.m_szDescription);
        if (showSkill.completed) {
            desc += '\n\n';
            if (showSkill.m_iNextLevelID > 0) {
                desc += TextFieldUtil.getColorText('下一级效果', Color.PropYellow);
                desc += '\n';
                desc += RegExpUtil.xlsDesc2Html(showSkill.nextLevel.m_szDescription);
            }
            else {
                //没有下一等级说明满级了
                desc += TextFieldUtil.getColorText('该技能已升至最高级别', Color.GREEN);
            }
        }
        this.textDesc.text = desc;
    }

    abstract onSkillChange();
}