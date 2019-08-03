import { Global as G } from 'System/global'
import { SkillData } from 'System/data/SkillData'
import { EnumIconSize } from 'System/IconManger/EnumIconSize'
import { SkillTipData } from 'System/tip/tipData/SkillTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Color } from 'System/utils/ColorUtil'
import { ResUtil } from 'System/utils/ResUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { BuffData } from 'System/data/BuffData'

/**
 * 技能图标单元。
 * @author xiaojialin
 *
 */
export class SkillIconItem {
    /**是否需要在tip中显示下一级信息。*/
    needNextLv: boolean = true;

    /**是否需要在左上角显示等级。*/
    needShowLv: boolean;

    /**需要灰掉*/
    needGrey: boolean = true;

    /**是否是预览的*/
    isPreview: boolean = false;

    /**技能图标*/
    private m_iconImage: UnityEngine.UI.RawImage;
    private m_iconGrey: boolean = false;
    private set iconGrey(value: boolean) {
        if (this.m_iconGrey != value) {
            this.m_iconGrey = value;
            UIUtils.setRawImageGrey(this.m_iconImage, value);
        }
    }

    /**技能等级*/
    private m_lvText: UnityEngine.UI.Text;
    private m_skillLevel: number = 0;
    private set skillLevel(value: number) {
        if (null == this.m_lvText) {
            return;
        }
        if (this.m_skillLevel != value) {
            this.m_skillLevel = value;
            if (value <= 0) {
                this.m_lvText.text = "";
            }
            else {
                this.m_lvText.text = value + "级";
            }
        }
    }
    /**技能向上箭头*/
    private m_arrow: UnityEngine.GameObject;
    private m_showArrow: boolean = false;
    private set showArrow(value: boolean) {
        if (null == this.m_arrow) {
            return;
        }
        if (this.m_showArrow != value) {
            this.m_showArrow = value;
            this.m_arrow.SetActive(value);
        }
    }

    private m_cdImage: UnityEngine.UI.Image;
    private m_cdLeftTime = -1;
    private m_cdTime = -1;
    setCd(leftTime: number, cdTime: number) {
        if (null == this.m_cdImage) {
            return;
        }
        if (this.m_cdLeftTime != leftTime || this.m_cdTime != cdTime) {
            this.m_cdLeftTime = leftTime;
            this.m_cdTime = cdTime;
            if (cdTime > 0) {
                this.m_cdImage.enabled = true;
                this.m_cdImage.fillAmount = leftTime / cdTime;
                Tween.TweenImageFillAmount.Begin(this.m_cdImage.gameObject, leftTime / 1000, 0);
            } else {
                this.m_cdImage.enabled = false;
            }
        }
    }

    /** 图标大小 */
    private size: number = EnumIconSize.NORMAL;

    private skillId: number = 0;

    /**缓存的技能数据。*/
    private m_skillTipData: SkillTipData;
    /**文字tip数据*/
    private m_textTipData: TextTipData = new TextTipData();

    /**是否需要tip*/
    private needTip: boolean = false;

    /**是否需要箭头*/
    needArrow: boolean = false;

    gameObject: UnityEngine.GameObject;

    constructor(needTip: boolean) {
        this.needTip = needTip;
    }

    setUsuallyByPrefab(iconTemplate: UnityEngine.GameObject, iconRoot: UnityEngine.GameObject, resetFirstChild = false) {
        let iconPrefab = UnityEngine.GameObject.Instantiate(iconTemplate) as UnityEngine.GameObject;
        let iconT = iconPrefab.transform;
        let root = iconRoot.transform;
        iconT.SetParent(root, false);
        if (resetFirstChild) {
            iconT.SetAsFirstSibling();
        }
        iconT.localPosition = UnityEngine.Vector3.zero;
        let rectTransform = iconT as UnityEngine.RectTransform;
        rectTransform.sizeDelta = (root as UnityEngine.RectTransform).sizeDelta;
        iconPrefab.SetActive(true);
        this.setUsually(iconPrefab, iconRoot);
    }

    setUsually(container: UnityEngine.GameObject, tipHolder: UnityEngine.GameObject = null) {
        this.gameObject = container;

        let iconTransform = container.transform.Find('icon');
        if (null == iconTransform) {
            iconTransform = container.transform.Find('mask');
            if (null != iconTransform) {
                iconTransform = iconTransform.Find('icon');
            }
        }
        if (null == iconTransform) {
            iconTransform = container.transform;
        }
        let icon = iconTransform.GetComponent(UnityEngine.UI.RawImage.GetType()) as UnityEngine.UI.RawImage;

        let cdImage: UnityEngine.UI.Image;
        let cdTransform = container.transform.Find('cooldown');
        if (null != cdTransform) {
            cdImage = cdTransform.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        }

        let lvTextTR = container.transform.Find('lv');
        let lvText: UnityEngine.UI.Text;
        if (null != lvTextTR) {
            lvText = lvTextTR.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        }
        let arrow = ElemFinder.findObject(container, 'arrow');
        this.setComponents(icon, lvText, arrow, cdImage, null != tipHolder ? tipHolder : container);
    }

    private setComponents(iconImage: UnityEngine.UI.RawImage, lvText: UnityEngine.UI.Text, arrow: UnityEngine.GameObject, cdImage: UnityEngine.UI.Image, tipHolder: UnityEngine.GameObject): void {
        this.m_iconImage = iconImage;
        this.m_lvText = lvText;
        this.m_arrow = arrow;
        this.m_cdImage = cdImage;
        if (this.needTip) {
            //let listener = Game.UITouchListener.Get(tipHolder);
            //listener.touchingBeginDelta = 0.2;
            //listener.onTouching = delegate(this, this.onTouching);
            //listener.onTouchEnd = delegate(this, this.onTouchEnd);

            Game.UIClickListener.Get(tipHolder).onClick = delegate(this, this.onClick);
        }
    }

    updateBySkillID(id: number) {
        this.skillId = id;
    }

    updateIcon(): void {
        if (GameIDUtil.isBuffID(this.skillId)) {
            this.updateBuffIcon();
        } else {
            this.updateSkillIcon();
        }
    }

    private updateSkillIcon() {
        let skillConfig = SkillData.getSkillConfig(this.skillId);
        if (null == skillConfig) {
            this.reset();
            return;
        }

        let canUse = skillConfig.completed != 0 || KeyWord.SKILL_BRANCH_WYYZ == skillConfig.m_ucSkillBranch;
        //if (KeyWord.SKILL_BRANCH_ROLE_NQ == skillConfig.m_ucSkillBranch) {
        //    canUse = canUse && G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_VIP_PRI_SKILL);
        //}
        //uts.log("技能是否已学："+skillConfig.completed==1);
        // 技能图标
        let iconID: string = ResUtil.getIconID(skillConfig.m_iSkillIcon.toString(), this.size);
        if (canUse || this.isPreview || !this.needGrey) {
            this.iconGrey = false;
        }
        else {
            this.iconGrey = true;
        }
        this.m_iconImage.enabled = true;
        G.ResourceMgr.loadIcon(this.m_iconImage, iconID, -1);

        this.skillLevel = (canUse || this.isPreview) ? skillConfig.m_ushSkillLevel : 0;

        if (this.needArrow) {
            //是否是职业技能
            let isProfessSkill = SkillData.isProfessCanSkillUp(skillConfig.m_iSkillID);
            let isProfessNotSkill = SkillData.isProfessNotSkillUp(skillConfig.m_iSkillID);
            if (SkillData.isPetSkill(skillConfig)) {
                //伙伴技能
                this.showArrow = SkillData.isPetNuQiSkill(skillConfig) && ((canUse && SkillData.canStudySkill(skillConfig.m_iNextLevelID, false)) || (!canUse && SkillData.canStudySkill(skillConfig.m_iSkillID, false)));
            } else if (SkillData.isGuildSkill(skillConfig)) {
                this.showArrow = (canUse && SkillData.canStudySkill(skillConfig.m_iNextLevelID, false) || (!canUse && SkillData.canStudySkill(skillConfig.m_iSkillID, false)));
            }
            else if (isProfessSkill) {
                if (skillConfig.completed == 0) {
                    //职业技能
                    this.showArrow = SkillData.canStudySkill(skillConfig.m_iSkillID, false);
                }
                else {
                    this.showArrow = SkillData.canStudySkill(skillConfig.m_iNextLevelID, false);
                }

            } else if (isProfessNotSkill) {
                this.showArrow = false;
            }
            else {
                //其他必须学习过  才能提示升级
                if (canUse && SkillData.canStudySkill(skillConfig.m_iNextLevelID, false)) {
                    this.showArrow = true;
                } else {
                    this.showArrow = false;
                }
            }
        }
        else {
            this.showArrow = false;
        }
    }

    private updateBuffIcon() {
        let buffConfig = BuffData.getBuffByID(this.skillId);
        if (null == buffConfig) {
            this.reset();
            return;
        }

        this.iconGrey = false;
        this.m_iconImage.enabled = true;
        G.ResourceMgr.loadIcon(this.m_iconImage, buffConfig.m_uiBuffIconID.toString(), -1);
        this.skillLevel = 0;
        this.showArrow = false;
    }

    /**
     * 空显示
     *
     */
    reset(): void {
        this.m_iconImage.enabled = false;
        this.setCd(0, 0);
        this.skillLevel = 0;
        this.showArrow = false;
    }

    private onClick() {
        if (this.skillId > 0) {
            if (GameIDUtil.isBuffID(this.skillId)) {
                if (null == this.m_textTipData) {
                    this.m_textTipData = new TextTipData();
                }
                let buffCfg = BuffData.getBuffByID(this.skillId);
                let tipStr = buffCfg.m_szBuffIconName + '\n\n';
                tipStr += buffCfg.m_szBuffDescription;
                this.m_textTipData.setTipData(tipStr);
                G.ViewCacher.tipsView.open(this.m_textTipData, TipFrom.normal);

            } else {
                if (null == this.m_skillTipData) {
                    this.m_skillTipData = new SkillTipData();
                }

                let skillConfig = SkillData.getSkillConfig(this.skillId);
                this.m_skillTipData.setTipData(skillConfig, this.isPreview);
                G.ViewCacher.tipsView.open(this.m_skillTipData, TipFrom.normal);
            }
        }
    }

    get SkillId(): number {
        return this.skillId;
    }

    /**
     * 设置图标尺寸
     * @param size
     */
    setSize(size: number) {
        let rect = this.gameObject.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        rect.sizeDelta = new UnityEngine.Vector2(size, size);
    }

    closeLevelText() {
        this.m_lvText.gameObject.SetActive(false);
    }

    getSkillLevel(): number {
        let skillConfig = SkillData.getSkillConfig(this.skillId);
        let canUse = skillConfig.completed != 0 || KeyWord.SKILL_BRANCH_WYYZ == skillConfig.m_ucSkillBranch;
        return (canUse || this.isPreview) ? skillConfig.m_ushSkillLevel : 0;
    }

    setIconGrey(grey: boolean) {
        this.iconGrey = grey;
    }
    //private onTouching() {
    //    if (this.skillId > 0) {
    //        G.ViewCacher.tipsView.open(this.getTipData(), TipFrom.normal);
    //    }
    //}

    //private onTouchEnd() {
    //    G.ViewCacher.tipsView.close();
    //}
}
