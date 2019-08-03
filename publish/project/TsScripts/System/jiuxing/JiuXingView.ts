import { UILayer, GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm"
import { TabSubForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { Global as G } from "System/global"
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { JiuXingData } from 'System/data/JiuXingData'
import { SkillData } from 'System/data/SkillData'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { PropInfoVo } from 'System/data/vo/PropInfoVo'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { DataFormatter } from 'System/utils/DataFormatter'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { FixedList } from 'System/uilib/FixedList'
import { HeroView } from 'System/hero/view/HeroView'
import { EnumGuide } from 'System/constants/GameEnum';

class JiuxingItem {
    private txtName: TextGetSet;
    private tipMark: GameObjectGetSet;
    private background: GameObjectGetSet;
    setComponents(go: UnityEngine.GameObject) {
        this.txtName = new TextGetSet(ElemFinder.findText(go, "txtName"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));
        this.background = new GameObjectGetSet(ElemFinder.findObject(go, "background"));
    }

    updataItem(name: string, grey: boolean, tip: boolean) {
        this.txtName.text = name;
        UIUtils.setGrey(this.background.gameObject, grey);
        this.tipMark.SetActive(tip)
    }
}

export class JiuXingView extends TabSubForm {
    //private fightText: UnityEngine.UI.Text;
    private heroView: HeroView;
    private m_data: JiuXingData = G.DataMgr.jiuXingData;
    private m_selectIndex: number = 0;
    //左侧面板
    private nameText: UnityEngine.UI.Text;
    private btnUpSkill: UnityEngine.GameObject;
    private effectText: UnityEngine.UI.Text;
    private conditionText: UnityEngine.UI.Text;
    private conditionTitleText: UnityEngine.UI.Text;
    private battleText: UnityEngine.UI.Text;
    private ballList: FixedList;
    private ballItems: JiuxingItem[] = [];
    //右侧面板
    private max_xingCount = 9;
    private propPanel: UnityEngine.GameObject;
    private luckyNumText: UnityEngine.UI.Text;
    private luckyBar: UnityEngine.UI.Slider;
    private levelText: UnityEngine.UI.Text;
    m_btnEnhance: UnityEngine.GameObject;
    private m_btnAutoEnhance: UnityEngine.GameObject;
    private materialCostText: UnityEngine.UI.Text;
    private materialHasText: UnityEngine.UI.Text;
    private imgHasIcon: UnityEngine.UI.RawImage;
    private imgCostIcon: UnityEngine.UI.RawImage;
    private btn_baoLiu: UnityEngine.GameObject;
    private btn_zhuihui: UnityEngine.GameObject;
    private m_btnAutoText: UnityEngine.UI.Text;
    /**当阶最大祝福值*/
    private stageMaxLuckyNum: number = 0;
    /**衰减的祝福值*/
    private shuiJianLuckyNum: number = 0;
    /**现在的祝福值*/
    private nowLuckyNum: number = 0;
    /**衰减倒计时文本*/
    private leftShuaiJianTimeText: UnityEngine.UI.Text;

    private m_costData: MaterialItemData = new MaterialItemData();

    private m_isAuto: boolean = false;
    private m_autoTime: number = 0;
    private m_oldLevel: number = -1;
    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;

    private m_currentConfig: GameConfig.JiuXingConfigM;

    private zhufuRuleText: UnityEngine.UI.Text;

    private readonly max_ZhuFuLv: number = 18;

    //进阶丹信息提示的按钮
    private BtnJInjieDan: UnityEngine.GameObject;
    /**技能那里的消耗物品**/
    private btnCostTip: UnityEngine.GameObject;
    private skillCostItemID: number = 0;

    //技能图标
    private skillIcon_Normal: UnityEngine.GameObject;
    private iconImage: UnityEngine.GameObject;
    private m_skillIconItem: SkillIconItem;

    private skillTipMark: GameObjectGetSet;

    constructor() {
        super(KeyWord.BAR_FUNCTION_JIUXING);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.JiuXingView;
    }

    protected initElements() {
        this.btnUpSkill = this.elems.getElement("btn_jihuo");
        this.skillTipMark = new GameObjectGetSet(this.elems.getElement("skillTipMark"));
        this.ballList = this.elems.getUIFixedList("BallList");
        let len = this.ballList.Count;
        for (let i = 0; i < len; i++) {
            let item = new JiuxingItem();
            item.setComponents(this.ballList.GetItem(i).gameObject);
            this.ballItems.push(item);
        }
        this.effectText = this.elems.getText("effect");
        this.conditionText = this.elems.getText("condition");
        this.conditionTitleText = this.elems.getText("conditionTitle");
        this.propPanel = this.elems.getElement("propPanel");
        //this.fightText = this.elems.getText('fightText');
        this.luckyNumText = this.elems.getText("xinghunNum");
        this.luckyBar = this.elems.getSlider("bar");
        this.levelText = this.elems.getText("levelText");
        this.nameText = this.elems.getText('nameText');
        ////////////////祝福相关规则////////////////////////////
        this.m_btnEnhance = this.elems.getElement("btn_upLv");
        this.m_btnAutoEnhance = this.elems.getElement("btn_autoUpLv");
        this.m_btnAutoText = ElemFinder.findText(this.m_btnAutoEnhance, "Text");
        this.btn_baoLiu = this.elems.getElement("btn_baoLiu");
        this.btn_zhuihui = this.elems.getElement("btn_zhuihui");
        this.materialHasText = this.elems.getText("materialHas");
        this.materialCostText = this.elems.getText("materialText");
        this.imgHasIcon = this.elems.getRawImage("imgHasIcon");
        this.imgCostIcon = this.elems.getRawImage("imgCostIcon");

        this.BtnJInjieDan = this.elems.getElement("BtnJInjieDan");
        this.leftShuaiJianTimeText = this.elems.getText("leftShuaiJianTime");
        this.zhufuRuleText = this.elems.getText("zhufuRuleText");
        this.btnCostTip = this.elems.getElement('tipMark');
        this.skillIcon_Normal = this.elems.getElement('skillIcon_Normal');

        this.iconImage = this.elems.getElement('icon');
        this.m_skillIconItem = new SkillIconItem(true);
        this.m_skillIconItem.setUsuallyByPrefab(this.skillIcon_Normal, this.iconImage);

        this.battleText = this.elems.getText('battleText');

    }

    protected initListeners() {
        this.ballList.onClickItem = delegate(this, this.onClickBallList);
        this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
        this.addClickListener(this.btnUpSkill, this.onClickUpSkillBt);
        this.addClickListener(this.m_btnEnhance, this.onBtnEnhanceClick);
        this.addClickListener(this.m_btnAutoEnhance, this.onClickBtnAutoUpLv);
        this.addClickListener(this.btn_baoLiu, this.onClickBaoLiuZhuFu);
        this.addClickListener(this.btn_zhuihui, this.onClickZhuiHuiZhuFu);
        this.addClickListener(this.btnCostTip, this.onClickCostOpenTip);
    }

    protected onOpen() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(true);
        }
        this.addTimer("1", 1000, 0, this.refreshZfValueTip);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJiuXingRequest(Macros.JIUXING_OPEN_PANEL));

        this.ballList.Selected = 0;
        this.onClickBallList(0);
        G.GuideMgr.processGuideNext(EnumGuide.XuanTianGongActive, EnumGuide.XuanTianGongActive_OpenView);
    }
    protected onClose() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
    }
    //----------------------点击事件--------------------------//
    private onClickBallList(index: number) {
        this.m_selectIndex = index;
        this.selectSkill(index);
    }

    private selectSkill(index: number): void {
        let studied: boolean = false;
        let skillId: number = this.m_data.skillList[index];
        let skillConfig: GameConfig.SkillConfigM = G.DataMgr.skillData.getStudiedSkillBySerial(skillId);
        if (skillConfig == null) {
            skillConfig = SkillData.getSkillConfig(skillId);
        }
        if (skillConfig == null) return;

        if (skillConfig.completed) {
            studied = true;
        }
        let skillStudy: GameConfig.SkillStudy;
        let nextLevelSkill: GameConfig.SkillConfigM = skillConfig.nextLevel;
        let conditionInfo: string = "";
        if (nextLevelSkill != null && nextLevelSkill.m_stSkillStudy != null) {
            skillStudy = studied ? nextLevelSkill.m_stSkillStudy : skillConfig.m_stSkillStudy;
            let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(skillStudy.m_iStudyItem);
            let thingNum: number = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, 0, false);
            this.conditionTitleText.text = studied ? "升级条件:" : "激活条件:";
            if (!studied) {
                let level: number = this.m_data.activateLevels[skillId];
                let needJieJi = Math.floor(level / 10 + 1);
                conditionInfo = '玄天功修炼值' + TextFieldUtil.getColorText(needJieJi.toString(), needJieJi <= this.m_data.m_ucLayer ? Color.GREEN : Color.RED) + '阶';
            }
            conditionInfo += "\n";
            conditionInfo += thingConfig.m_szName;
            conditionInfo += TextFieldUtil.getColorText('(' + thingNum + '/' + skillStudy.m_iStudyItemNum + ')', thingNum >= skillStudy.m_iStudyItemNum ? Color.GREEN : Color.RED);
            // let iscanactive = G.DataMgr.jiuXingData.activateSkills.indexOf(skillConfig.m_iSkillID) != -1;
            let iscanactive = this.m_data.isSkillUp(skillConfig.m_iSkillID);
            this.btnUpSkill.SetActive(thingNum >= skillStudy.m_iStudyItemNum && iscanactive);
            this.skillCostItemID = thingConfig.m_iID;
        }
        else {
            conditionInfo = '(技能等级已满)';
            this.btnUpSkill.SetActive(false);
            this.skillCostItemID = 0;
        }
        this.nameText.text = skillConfig.m_szSkillName;
        this.battleText.text = skillConfig.m_iBattleEffect.toString();
        this.effectText.text = RegExpUtil.xlsDesc2Html(skillConfig.m_szDescription);;
        this.conditionText.text = conditionInfo;
        this.m_skillIconItem.updateBySkillID(skillConfig.m_iSkillID);
        this.m_skillIconItem.needShowLv = true;
        this.m_skillIconItem.updateIcon();

        let btnSkillText = ElemFinder.findText(this.btnUpSkill, 'Text');
        btnSkillText.text = skillConfig.completed ? "升级技能" : "激活技能";
    }

    private onClickUpSkillBt(): void {
        //激活技能按钮
        let skillId: number = this.m_data.skillList[this.m_selectIndex];
        let skillConfig: GameConfig.SkillConfigM = G.DataMgr.skillData.getStudiedSkillBySerial(skillId);
        if (skillConfig == null) {
            skillConfig = SkillData.getSkillConfig(skillId);
        }
        if (skillConfig == null) return;
        if (skillConfig.completed && skillConfig.nextLevel == null) {
            G.TipMgr.addMainFloatTip('技能等级已满,不能提升等级');
        }

        let skillStudy = skillConfig.completed ? skillConfig.nextLevel.m_stSkillStudy : skillConfig.m_stSkillStudy;
        let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(skillStudy.m_iStudyItem);
        let thingNum: number = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, 0, false);
        if (thingNum >= skillStudy.m_iStudyItemNum) {
            if (skillConfig.completed) {
                let nextLevel: GameConfig.SkillConfigM = skillConfig.nextLevel;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(nextLevel.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0, 0, nextLevel.m_stSkillStudy.m_ucAllowStep));
            }
            else {
                if (G.DataMgr.jiuXingData.activateSkills.indexOf(skillConfig.m_iSkillID) != -1) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(skillConfig.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0, 0, skillStudy.m_ucAllowStep));
                }
                else {
                    G.TipMgr.addMainFloatTip('玄天功等阶不足,无法激活技能');
                }
            }
        }
        else {
            if (skillConfig.completed) {
                G.TipMgr.addMainFloatTip('道具数量不足,无法学习技能');
            }
            else {
                G.TipMgr.addMainFloatTip('道具数量不足,无法激活技能');
            }
        }
    }

    //--------------------------更新面板---------------------------------//
    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updatePanel();
        }
    }

    onMoneyChange() {
        this.updatePanel();
    }

    updatePanel(): void {
        this.selectSkill(this.ballList.Selected);
        let nowIdx = this.m_data.getNowIndex();
        let m_selectId = this.m_data.jiuXingIdArr[nowIdx];
        let cfg: GameConfig.JiuXingConfigM = this.m_data.getCfg(m_selectId);
        //重新设置属性
        let nextCfg: GameConfig.JiuXingConfigM = this.m_data.getCfg(this.m_data.jiuXingIdArr[nowIdx + 1]);
        this.m_currentConfig = cfg;
        //刷新材料
        let txtlv: string = DataFormatter.toHanNumStr(this.m_data.m_ucLayer)
        this.levelText.text = txtlv + '阶';
        let addProps: GameConfig.JiuXingPropAttr[];
        if (nextCfg != null) {
            addProps = this.getZhuFuProp(cfg.m_astAttr, nextCfg.m_astAttr, this.m_data.currentLuckyValue, nextCfg.m_uiLuckUp);
        } else {
            addProps = cfg.m_astAttr;
        }

        this.getPropList(addProps);

        //this.fightText.text = this.getFight(addProps).toString();
        if (this.heroView != null) {
            this.heroView.setTxtFight(this.getFight(addProps));
        }

        this.refreshZfValueTip(null);

        this.updateZhuFuData();

        this.updateCurrentSelect();
        this.m_oldLevel = this.m_data.m_ucLayer;

        let skillConfig: GameConfig.SkillConfigM;
        let activateSkills = this.m_data.skillList;
        for (let i: number = 0; i < this.ballList.Count; i++) {
            skillConfig = G.DataMgr.skillData.getStudiedSkillBySerial(activateSkills[i]);
            if (skillConfig == null) {
                skillConfig = SkillData.getSkillConfig(activateSkills[i]);
            }
            if (skillConfig == null) return;
            // let iscanactive = G.DataMgr.jiuXingData.activateSkills.indexOf(skillConfig.m_iSkillID) != -1;
            let iscanactive = this.m_data.isSkillUp(skillConfig.m_iSkillID);
            let skillStudy = skillConfig.completed ? skillConfig.nextLevel.m_stSkillStudy : skillConfig.m_stSkillStudy;
            if (skillStudy == null) {
                //满级
                this.ballItems[i].updataItem(skillConfig.m_szSkillName, skillConfig.completed == 0, false)
            }
            else {
                let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(skillStudy.m_iStudyItem);
                let thingNum: number = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, 0, false);
                let ishavemater = thingNum >= skillStudy.m_iStudyItemNum;
                this.ballItems[i].updataItem(skillConfig.m_szSkillName, skillConfig.completed == 0, iscanactive && ishavemater)
            }
        }
        this.onClickBallList(Math.max(0, this.m_selectIndex));
    }

    private get nextIndex() {
        let index: number = -1;
        for (let i = 0; i < JiuXingData.stageLvs.length; i++) {
            if (this.m_data.level < JiuXingData.stageLvs[i]) {
                index = i;
                break;
            }
        }
        return index;
    }


    private updateZhuFuData() {
        let nextId = this.m_data.jiuXingIdArr[this.nextIndex];
        let nextCfg: GameConfig.JiuXingConfigM = this.m_data.getCfg(nextId);
        if (nextCfg == null) {
            //满阶段了
            this.luckyNumText.text = "已满阶";
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            UIUtils.setButtonClickAble(this.m_btnAutoEnhance, false);
            this.materialCostText.text = "";
            this.materialHasText.text = "";
        } else {
            this.m_costData.id = nextCfg.m_iConsumableID;
            this.m_costData.need = nextCfg.m_iConsumableNumber;
            this.updateBagInfo(Macros.CONTAINER_TYPE_ROLE_BAG);

            let consumableConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(nextCfg.m_iConsumableID);
            let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this.m_currentConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)
            let upLevelName = '';
            // if (this.m_costData.has > 0 || universalJinjieDanNum <= 0) {
            //     //upLevelName = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), this.m_costData.need);
            //     upLevelName = this.m_costData.need.toString();
            //     this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
            // }
            // else {
            //     //upLevelName = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_currentConfig.m_iUniversalItem)), this.m_costData.need);
            //     upLevelName = this.m_costData.need.toString();
            //     this.addClickListener(this.BtnJInjieDan, this.onClickWanyongTextOpenTip);
            // }

            //let upLevelName = uts.format("{0}或{1}({2}/{3})", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_currentConfig.m_iUniversalItem)),this.m_costData.need);
            this.materialCostText.text = nextCfg.m_iConsumableNumber.toString();
            G.ResourceMgr.loadIcon(this.imgCostIcon, ThingData.getThingConfig(this.m_costData.id).m_szIconID);
            this.luckyNumText.text = "祝 福 值: " + this.m_data.currentLuckyValue + "/" + nextCfg.m_uiLuckUp;
            this.luckyBar.value = this.m_data.currentLuckyValue / nextCfg.m_uiLuckUp;
            this.stageMaxLuckyNum = nextCfg.m_uiLuckUp;
            this.nowLuckyNum = this.m_data.currentLuckyValue;
            this.shuiJianLuckyNum = this.m_data.shuaiJianValue;
        }

    }



    /**新规则计算*/
    private getZhuFuProp(beforConfig: GameConfig.JiuXingPropAttr[], nextConfig: GameConfig.JiuXingPropAttr[], currentLuckyValue: number, nextLuckyUp: number): GameConfig.JiuXingPropAttr[] {
        let config = new Array<GameConfig.JiuXingPropAttr>(beforConfig.length);
        for (let i = 0; i < beforConfig.length; i++) {
            config[i] = {} as GameConfig.JiuXingPropAttr;
        }
        for (let i = 0; i < beforConfig.length; i++) {
            let jichuValue = beforConfig[i].m_iPropValue;
            let addValue = Math.floor((nextConfig[i].m_iPropValue - beforConfig[i].m_iPropValue) * currentLuckyValue / nextLuckyUp / 2);
            config[i].m_iPropValue = Math.floor(jichuValue + addValue);
            config[i].m_iPropName = beforConfig[i].m_iPropName
        }
        return config;
    }



    private getFight(cfg: GameConfig.JiuXingPropAttr[]): number {
        //获取战斗力
        if (cfg == null)
            return 0;
        let strength: number = 0;
        for (let prop of cfg) {
            if (prop.m_iPropName <= 0 || prop.m_iPropValue <= 0)
                continue;
            strength += FightingStrengthUtil.calStrengthByOneProp(prop.m_iPropName, prop.m_iPropValue);
        }
        return strength;
    }

    private getPropList(list: GameConfig.JiuXingPropAttr[]) {
        //更新属性列表
        let datas: PropInfoVo[] = [];
        let prof: number = G.DataMgr.heroData.profession;
        for (let i = 0; i < list.length; i++) {
            let att: GameConfig.JiuXingPropAttr = list[i];
            if (att.m_iPropName <= 0)
                continue;
            let vo: PropInfoVo = new PropInfoVo(parseInt(Color.WHITE));
            vo.id = att.m_iPropName;
            vo.value = att.m_iPropValue;
            datas.push(vo);
        }
        for (let i = 0; i < this.max_xingCount; i++) {
            let propText = ElemFinder.findText(this.propPanel, i.toString());
            let propValue = ElemFinder.findText(propText.gameObject, "txtValue");
            if (i < datas.length) {
                let propName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, datas[i].id);
                let value: string = "";
                if (datas[i].value > 0) {
                    value = datas[i].value.toString();
                } else {
                    value = "-------";
                }
                propText.text = propName;
                propValue.text = value;
            } else {
                propText.text = "";
                propValue.text = "";
            }
        }
    }

    private getPropListNext(curList: GameConfig.JiuXingPropAttr[], nextList: GameConfig.JiuXingPropAttr[]) {
        //获取加成属性
        let datas = [];
        for (let i = 0; i < nextList.length; i++) {
            let curAtt: GameConfig.JiuXingPropAttr = curList[i];
            let nextAtt: GameConfig.JiuXingPropAttr = nextList[i];
            if (nextAtt.m_iPropName <= 0)
                continue;
            let data: PropInfoVo = new PropInfoVo((nextAtt.m_iPropValue - curAtt.m_iPropValue));
            datas.push(data);
        }
    }



    ///////////////////////////////////////////祝福规则////////////////////////////////////////////////////////
    private updateCurrentSelect() {
        if (this.m_isAuto) {
            if (this.m_oldLevel != this.m_data.m_ucLayer) {
                this.stopAuto();
            }
            else if (this.m_costData.id == 0) {
                this.stopAuto();
            }
            else {
                let time: number = G.SyncTime.getCurrentTime();
                if (time - this.m_autoTime > this.deltaTime) {
                    this.m_autoTime = time;
                    this.onBtnEnhanceClick();
                }
                else {
                    this.addTimer("temp", this.deltaTime, 1, this.onTimer);
                }
            }
        } else {
            UIUtils.setButtonClickAble(this.m_btnEnhance, this.m_costData.id > 0);
            UIUtils.setButtonClickAble(this.m_btnAutoEnhance, this.m_costData.id > 0);
        }
    }


    private onTimer(time: Game.Timer): void {
        this.m_autoTime = G.SyncTime.getCurrentTime();
        this.onBtnEnhanceClick();
    }

    //是否提示使用万用进阶丹
    private static isNotTip: boolean = false;
    private static isNotTipAgain: boolean = false;
    private static isNotTipThirdConfirm: boolean = false;
    /**点击升阶按钮*/
    onBtnEnhanceClick() {
        G.GuideMgr.processGuideNext(EnumGuide.XuanTianGongActive, EnumGuide.XuanTianGongActive_ClickPanelBtn);
        if (this.m_currentConfig == null) {
            return;
        }
        let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this.m_currentConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        if (this.m_data.m_ucLayer == this.max_ZhuFuLv) {
            G.TipMgr.addMainFloatTip("已经达到最高阶级");
            this.stopAuto();
            return;
        }
        if (this.m_costData.id == 0) {
            return;
        }

        //资源充足，开始进阶
        if (this.m_costData.has + universalJinjieDanNum >= this.m_costData.need) {
            if (this.m_costData.has < this.m_costData.need) {
                if (!JiuXingView.isNotTip) {
                    G.TipMgr.showConfirm(uts.format('当前您的{0}已经不足，是否消耗{1}继续升阶？', TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_currentConfig.m_iUniversalItem))),
                        ConfirmCheck.withCheck, '确定|取消', delegate(this, (stage: MessageBoxConst, isCheckSelected: boolean) => {
                            if (MessageBoxConst.yes == stage) {
                                JiuXingView.isNotTip = isCheckSelected;
                                this.sendJiuXingLevelUp();
                            }
                            else {
                                this.stopAuto();
                            }
                        }));
                }
                else {
                    this.sendJiuXingLevelUp();
                }
            }
            else {
                this.sendJiuXingLevelUp();
                return;
            }
        }
        //资源不足，也没开启自动购买
        else {
            this.stopAuto();
            let num = this.m_costData.need - (this.m_costData.has + universalJinjieDanNum);
            let morelv = this.getZhufuNumber();
            let morenum = this.m_costData.need * morelv;
            num += morenum;
            G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, delegate(this, this.requestMoreLevelUp, morelv + 1));
        }
    }

    private sendJiuXingLevelUp() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJiuXingRequest(Macros.JIUXING_UPGRADE_LEVEL));
    }

    /**请求多次升级*/
    private requestMoreLevelUp(num: number): void {
        for (let i = 0; i < num; i++) {
            this.sendJiuXingLevelUp();
        }
    }

    getZhufuNumber(): number {
        let nextId = this.m_data.jiuXingIdArr[this.nextIndex];
        let nextCfg: GameConfig.JiuXingConfigM = this.m_data.getCfg(nextId);
        if (nextCfg) {
            let luck = nextCfg.m_uiLuckUp - this.m_data.currentLuckyValue;
            let num = Math.ceil(luck / 10) - 1;
            return num;
        }
        return 0;
    }


    private stopAuto(): void {
        if (this.m_isAuto) {
            this.removeTimer('temp');
            this.m_isAuto = false;
            let btStage: boolean = (this.m_costData.id != 0);
            UIUtils.setButtonClickAble(this.m_btnEnhance, btStage);
            UIUtils.setButtonClickAble(this.m_btnAutoEnhance, btStage);
            this.m_btnAutoText.text = '自动进阶';
            this.m_autoTime = 0;
        }
    }

    /**点击自动升阶按钮*/
    private onClickBtnAutoUpLv() {
        if (this.m_isAuto) {
            this.stopAuto();
        }
        else {
            this.startAuto();
        }
    }


    private startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            this.m_btnAutoText.text = '停止进阶';
            this.onBtnEnhanceClick();
        }
    }


    /**点击保留祝福值按钮*/
    private onClickBaoLiuZhuFu() {
        if (this.m_data.luckyQingKongTime == 0) {
            G.TipMgr.addMainFloatTip("祝福值还没开始衰减,不需要保留");
            return;
        }
        G.TipMgr.showConfirm('是否花费50元宝将祝福值衰减时间延长24小时？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmBaoLiuZhuFu));
    }


    private onConfirmBaoLiuZhuFu(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJiuXingRequest(Macros.JIUXING_LUCKY_KEEP));
        }
    }

    /**点击追回祝福值按钮*/
    private onClickZhuiHuiZhuFu() {
        if (this.m_data.shuaiJianValue == 0) {
            G.TipMgr.addMainFloatTip("当前还没有衰减祝福值,不需要找回");
            return;
        }
        G.Uimgr.createForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView).open(KeyWord.BAR_FUNCTION_JIUXING, this.stageMaxLuckyNum, this.shuiJianLuckyNum, this.nowLuckyNum);
    }


    /**刷新祝福值倒计时*/
    private refreshZfValueTip(timer: Game.Timer): void {

        if (this.m_data == null) {
            return;
        }
        let str: string = TextFieldUtil.getColorText('祝福值衰减倒计时:', Color.BLUE);
        let current = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.m_data.m_ucLayer >= 5 && this.m_data.currentLuckyValue > 0) {
            str += DataFormatter.second2hhmmss(Math.max(0, this.m_data.luckyQingKongTime - current));
        }
        else {
            str += '不限时';
        }
        this.leftShuaiJianTimeText.text = str;
        if (this.m_data.m_ucLayer >= 5) {
            this.zhufuRuleText.text = G.DataMgr.langData.getLang(350);
        } else {
            this.zhufuRuleText.text = G.DataMgr.langData.getLang(349);
        }
    }


    /**刷新现有材料*/
    private updateBagInfo(type: number): void {
        let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this.m_currentConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            if (this.m_costData.id > 0) {
                this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let color: string = this.m_costData.has + universalJinjieDanNum < this.m_costData.need ? Color.RED : Color.GREEN;
                this.materialHasText.text = TextFieldUtil.getColorText((this.m_costData.has /* + universalJinjieDanNum */).toString(), color);
                G.ResourceMgr.loadIcon(this.imgHasIcon, ThingData.getThingConfig(this.m_costData.id).m_szIconID);
            }
            else {
                this.materialHasText.text = "";
            }
        }
    }


    private onClickTextOpenTip() {
        if (this.m_costData.id > 0) {
            let item = new IconItem();
            item.updateById(this.m_costData.id);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    private onClickWanyongTextOpenTip() {
        if (this.m_currentConfig.m_iUniversalItem > 0) {
            let item = new IconItem();
            item.updateById(this.m_currentConfig.m_iUniversalItem);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    private onClickCostOpenTip() {
        if (this.skillCostItemID > 0) {
            let item = new IconItem();
            item.updateById(this.skillCostItemID);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }
}