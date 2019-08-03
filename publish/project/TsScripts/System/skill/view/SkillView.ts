import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { SkillData } from 'System/data/SkillData';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { BasicSkillPanel } from 'System/skill/view/BasicSkillPanel';
import { JiBanSkillPanel } from 'System/skill/view/JiBanSkillPanel';
import { SkillBasePanel } from 'System/skill/view/SkillBasePanel';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from '../../uilib/CurrencyTip';
import { TabFormCommom } from '../../uilib/TabFormCommom';

export class SkillView extends TabFormCommom {
    private currencyTip: CurrencyTip;

    private openTabId = 0;
    private openSkillId = 0;

    btnReturn: UnityEngine.GameObject = null;

    private mask: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.BAR_FUNCTION_SKILL, BasicSkillPanel, JiBanSkillPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.SkillView;
    }

    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["基础", "羁绊"]);
        this.setTitleName("技能");
        this.setFightActive(false);
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.btnReturn = this.getCloseButton();
        this.mask = this.elems.getElement('mask');
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        this.addClickListener(this.mask, this.onBtnReturn);
    }

    open(tabId: number = 0, skillId: number = 0) {
        this.openTabId = tabId;
        this.openSkillId = skillId;
        super.open();
    }

    protected onOpen() {
        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen: number = this.getTabCount();
        let funIds: number[] = [];
        let firstShowIdx = -1;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.getTabFormByIndex(i).Id;
            funIds.push(funId);
            let isShow = funcLimitData.isFuncEntranceVisible(funId);
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
            if (firstShowIdx < 0 && isShow) {
                firstShowIdx = i;
            }
        }

        if (G.GuideMgr.isGuiding(EnumGuide.SkillUp)) {
            // 自动选中怒气技能
            this.openTabId = KeyWord.OTHER_FUNCTION_SKILL_BASIC;
        } else if (this.openSkillId > 0) {
            let skill = SkillData.getSkillConfig(this.openSkillId);
            if (KeyWord.SKILL_BRANCH_ROLE_FETTER == skill.m_ucSkillBranch) {
                this.openTabId = KeyWord.OTHER_FUNCTION_SKILL_JIBAN;
            }
        }

        let idx = funIds.indexOf(this.openTabId);
        if (idx < 0) {
            idx = Math.max(0, firstShowIdx);
        }

        this.switchTabFormById(funIds[idx], this.openSkillId);
        this.updateTipMarks();
        this.onMoneyChange();
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.SkillUp, EnumGuide.SkillUp_ClickClose);
    }

    onSkillChange() {
        let p = this.getCurrentTab() as SkillBasePanel;
        if (null != p && p.isOpened) {
            p.onSkillChange();
        }
        this.updateTipMarks();
    }

    private updateTipMarks() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SKILL_BASIC, TipMarkUtil.basicSkill());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SKILL_JIBAN, TipMarkUtil.jiBanSkill());
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.SkillUp_ClickClose == step) {
            this.onBtnReturn();
            return true;
        }
        return false;
    }
}
export default SkillView;