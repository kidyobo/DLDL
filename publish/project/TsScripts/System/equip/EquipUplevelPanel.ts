import { UIPathData } from 'System/data/UIPathData'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { Global as G } from 'System/global'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { ThingData } from 'System/data/thing/ThingData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType, EnumGuide } from 'System/constants/GameEnum'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { List } from "System/uilib/List"
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EquipView } from 'System/equip/EquipView'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { EquipCollectPropItem } from 'System/equip/EquipCollectPanel'
import { EquipFinalUpPanel } from 'System/equip/EquipFinalUpPanel'
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView'



/**装备进阶面板*/
export class EquipUpLevelPanel extends EquipBasePanel implements IGuideExecutor {

    static EQUIP_PART = [KeyWord.EQUIP_PARTCLASS_WEAPON, KeyWord.EQUIP_PARTCLASS_NECKCHAIN, KeyWord.EQUIP_PARTCLASS_RING, KeyWord.EQUIP_PARTCLASS_CHAIN,
    KeyWord.EQUIP_PARTCLASS_HAT, KeyWord.EQUIP_PARTCLASS_CLOTH, KeyWord.EQUIP_PARTCLASS_TROUSER, KeyWord.EQUIP_PARTCLASS_SHOE];

    private equipView: EquipView;
    /**当前升阶按钮*/
    m_btnEnhance: UnityEngine.GameObject = null;
    /** 装备列表的数据源 */
    private m_equipListData: ThingItemData[] = new Array<ThingItemData>();
    private m_attListData: EquipEnhanceAttItemData[] = new Array<EquipEnhanceAttItemData>();
    /**当前选中的那一件 */
    private m_selectedEquipData: ThingItemData;
    /**升阶条件*/
    private upConditionText: UnityEngine.UI.Text;
    /**选中特效 */
    private m_attListDic: any;
    private m_selectLevel: number = -1;
    private m_selectColor: number = -1;
    /**背包全部页（默认显示全部物品的页面）*/
    private EquipItemDatas: ThingItemData[] = [];
    /**装备升阶对比显示*/
    private upPropFront1: UnityEngine.UI.Text;
    private upPropMiddle1: UnityEngine.UI.Text;
    private upPropLast1: UnityEngine.UI.Text;
    private upPropFront2: UnityEngine.UI.Text;
    private upPropMiddle2: UnityEngine.UI.Text;
    private upPropLast2: UnityEngine.UI.Text;
    private upPropFront3: UnityEngine.UI.Text;
    private upPropMiddle3: UnityEngine.UI.Text;
    private upPropLast3: UnityEngine.UI.Text;

    /**右侧材料*/
    private materialIcon1: UnityEngine.GameObject = null;
    private materialIcon2: UnityEngine.GameObject = null;
    private materialIcon3: UnityEngine.GameObject = null;
    /**进阶按钮状态*/
    private ok: boolean = true;
    /**套装加成显示*/
    private suitProp1: UnityEngine.UI.Text = null;
    private suitProp2: UnityEngine.UI.Text = null;
    private suitProp3: UnityEngine.GameObject = null;
    private fightText: UnityEngine.UI.Text = null;
    /**右侧三个材料图标对应的数据和图标管理*/
    private materialData1: ThingItemData = null;
    private materialData2: MaterialItemData = null;
    private materialData3: ThingItemData = null;
    private iconItem1: IconItem;
    private iconItem2: IconItem;
    private iconItem3: IconItem;
    private nowClickItemIndex: number = 0;
    private arrowIcon: UnityEngine.GameObject;
    //特效
    //private equipEffectPrefab: UnityEngine.GameObject;
    //private equipEffect: UIEffect;
    //private advancedSucceedPrefab: UnityEngine.GameObject;
    //private advancedSucceed: UIEffect;

    private equipColorUpPrefab: UnityEngine.GameObject;
    private equipColorUp: UIEffect;

    private effectRoot: UnityEngine.GameObject;
    //private upLevelMergeEffectPrefab: UnityEngine.GameObject;
    //private upLevelMergeEffect: UIEffect;
    //private upLevelMergeEffectRoot: UnityEngine.GameObject;
    private propList: List;
    private propItems: EquipCollectPropItem[] = [];

    private newSucceedEffect: UIEffect;
    private newSucceedEffectObj: UnityEngine.GameObject;

    //装备通用特效
    private equipCommonEffect: UnityEngine.GameObject;
    private equipCommonEffectRoot: UnityEngine.GameObject;
    private commonUIEffect: UIEffect;

    /**终极进阶按钮*/
    private btnFinal: UnityEngine.GameObject;
    //private uiEffectList: UIEffect[] = [];
    //private bkts: UnityEngine.GameObject;

    private isShow: boolean;

    private TextTitleNum: UnityEngine.UI.Text;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
    }

    protected resPath(): string {
        return UIPathData.EquipUpLevelPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipUp, true);
        //属性对比
        this.upPropFront1 = this.elems.getText("shuxing1");
        this.upPropMiddle1 = this.elems.getText('before1');
        this.upPropLast1 = this.elems.getText('later1');
        this.upPropFront2 = this.elems.getText("shuxing2");
        this.upPropMiddle2 = this.elems.getText('before2');
        this.upPropLast2 = this.elems.getText('later2');
        this.upPropFront3 = this.elems.getText("shuxing3");
        this.upPropMiddle3 = this.elems.getText('before3');
        this.upPropLast3 = this.elems.getText('later3');
        //进阶条件
        this.upConditionText = this.elems.getText("equipLevelText");
        //升阶按钮
        this.m_btnEnhance = this.elems.getElement("btn_shengjie");
        this.arrowIcon = this.elems.getElement('jiantouManger');
        //进阶材料图标相关 
        this.materialIcon1 = this.elems.getElement("icon1");
        this.materialIcon2 = this.elems.getElement("icon2");
        this.materialIcon3 = this.elems.getElement("icon3");

        this.iconItem1 = new IconItem();
        this.iconItem1.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIcon1);
        this.iconItem1.setTipFrom(TipFrom.normal);
        this.iconItem1.arrowType = ArrowType.equipUp;
        this.iconItem1.isNeedShowArrow = false;
        this.iconItem1.needWuCaiColor = true;
        this.iconItem1.needForceShowWuCaiColor = true;

        this.iconItem2 = new IconItem();
        this.iconItem2.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIcon2);
        this.iconItem2.setTipFrom(TipFrom.normal);

        this.iconItem3 = new IconItem();
        this.iconItem3.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIcon3);
        this.iconItem3.setTipFrom(TipFrom.normal);
        this.iconItem3.arrowType = ArrowType.equipUp;
        this.iconItem3.isNeedShowArrow = false;
        this.iconItem3.needWuCaiColor = true;
        this.iconItem3.needForceShowWuCaiColor = true;
        //套装显示相关
        this.suitProp1 = this.elems.getText("toptext");
        this.suitProp2 = this.elems.getText("middleText");
        this.suitProp3 = this.elems.getElement("downPanel");
        this.fightText = this.elems.getText("fightText");
        //添加特效
        this.effectRoot = this.elems.getElement('effectRoot');
        //this.equipEffectPrefab = this.elems.getElement("equipEffect");
        //this.equipEffect = new UIEffect();
        //this.equipEffect.setEffectPrefab(this.equipEffectPrefab, this.effectRoot);
        //this.advancedSucceedPrefab = this.elems.getElement("jinjieSucceed");

        this.equipColorUpPrefab = this.elems.getElement("equipColorUp");
        this.equipColorUp = new UIEffect();
        this.equipColorUp.setEffectPrefab(this.equipColorUpPrefab, this.effectRoot, 1, -9);

        //this.advancedSucceed = new UIEffect();
        //this.advancedSucceed.setEffectPrefab(this.advancedSucceedPrefab, this.effectRoot);

        this.equipCommonEffect = this.elems.getElement("equipCommonEffect");
        this.equipCommonEffectRoot = this.elems.getElement("equipCommonEffectRoot");
        this.commonUIEffect = new UIEffect();
        this.commonUIEffect.setEffectPrefab(this.equipCommonEffect, this.equipCommonEffectRoot);

        this.clearPropText();
        this.propList = this.elems.getUIList("propList");

        this.newSucceedEffectObj = this.elems.getElement("newSucceedEffect");
        this.newSucceedEffect = new UIEffect();
        this.newSucceedEffect.setEffectPrefab(this.newSucceedEffectObj, this.effectRoot);

        this.btnFinal = this.elems.getElement("btnFinal");

        //this.bkts = this.elems.getElement("bkts");

        this.TextTitleNum = this.elems.getText("TextTitleNum");
    }


    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.m_btnEnhance, this.onBtnEnhanceClick);
        this.addClickListener(this.btnFinal, this.onBtnFinalClick);
    }


    protected onOpen() {
        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            this.equipView.showFight(true);
        }

        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);
        //选择第一个可强化，没有默认第一个
        let shouldSelectIndex = this.getFirstCanUpLevelEquip();
        this.equipList.Selected = shouldSelectIndex;
        this.onClickEquipList(shouldSelectIndex);
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipUpLevel, EnumGuide.EquipUpLevel_ClickEquip);
        this.isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) && G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage();
    }

    protected onClose() {
        //this.equipEffect.stopEffect();
        //this.advancedSucceed.stopEffect();
        if (this.equipView != null) {
            this.equipView.showFight(false);
        }
        this.commonUIEffect.stopEffect();
        this.equipColorUp.stopEffect();
        this.newSucceedEffect.stopEffect();
    }


    private getFirstCanUpLevelEquip(): number {
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let equipData = this.EquipItemDatas[i];
            if (G.DataMgr.equipStrengthenData.getOneEquipCanUpLevel(equipData) > 0) {
                return i;
            }
        }
        return 0;
    }

    /**
     * 终极进阶
     */
    private onBtnFinalClick() {
        if (this.m_selectedEquipData != null) {
            let equipPos = this.m_selectedEquipData.data.m_usPosition;
            let oneSlotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(equipPos);
            G.DataMgr.runtime.equipPos = equipPos;
            G.DataMgr.runtime.oneSlotInfo = oneSlotInfo;
            G.Uimgr.createForm<EquipFinalUpPanel>(EquipFinalUpPanel).open(this.m_selectedEquipData);
        }
    }

    /**属性升阶*/
    updateUpLevelPanel() {
        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);
        this.onClickEquipList(this.nowClickItemIndex);
        this.updateLevels();
    }

    /**进阶特效*/
    playJinJieEffect() {
        this.addTimer("playEffect", 500, 1, this.playSucceed);
    }

    private playSucceed() {
        G.AudioMgr.playJinJieSucessSound();
        //this.equipEffect.playEffect(EffectType.Effect_Normal);
        //this.advancedSucceed.playEffect(EffectType.Effect_Normal);
        this.equipColorUp.playEffect(EffectType.Effect_Normal)
        this.newSucceedEffect.playEffect(EffectType.Effect_Normal);
    }

    protected onClickEquipList(index: number) {
        if (this.equipList.Count > 0) {
            this.onSelectEquip(this.EquipItemDatas[index]);
            this.nowClickItemIndex = index;
        }
    }

    private updateRewardIcon(data1: ThingItemData, data2: MaterialItemData, data3: ThingItemData) {
        this.iconItem1.updateByThingItemData(data1);
        this.iconItem1.updateIcon();
        this.iconItem2.updateByMaterialItemData(data2);
        this.iconItem2.updateIcon();
        this.iconItem3.updateByThingItemData(data3);
        this.iconItem3.updateIcon();
    }

    private clearPanel() {
        this.clearPropText();
        this.fightText.text = '0';
        this.upConditionText.text = '';
        this.arrowIcon.SetActive(false);
    }

    private clearPropText() {
        this.upPropFront1.text = '';
        this.upPropMiddle1.text = '';
        this.upPropLast1.text = '';
        this.upPropFront2.text = '';
        this.upPropMiddle2.text = '';
        this.upPropLast2.text = '';
        this.upPropFront3.text = '';
        this.upPropMiddle3.text = '';
        this.upPropLast3.text = '';


    }


    private updateEquipList(ctnType: number, ctnSize: number) {
        //更新可选升级装备列表
        let rawDatas = G.DataMgr.thingData.getContainer(ctnType);
        this.EquipItemDatas.length = 0;
        let data: ThingItemData;
        let equipCount: number = 0;
        for (let i = 0; i < ctnSize; i++) {
            data = rawDatas[i];
            this.EquipItemDatas.push(data);
            if (null != data && null != data.data) {
                equipCount++;
            }
        }
        if (equipCount == 0) {
            //没有装备时      
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            this.clearPanel();
            return;
        }
        this.arrowIcon.SetActive(true);
        UIUtils.setButtonClickAble(this.m_btnEnhance, true);
        for (let i = 0; i < ctnSize; i++) {
            let itemObj = this.equipList.GetItem(i);
            let txtLv = itemObj.findText("lvbg/txtLv");
            let txtName = itemObj.findText("lvbg/txtName");
            let txtType = itemObj.findText("lvbg/txtType");
            txtType.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_MAIN, EquipUpLevelPanel.EQUIP_PART[i]).replace("角色", "");
            if (null == rawDatas[i]) continue;
            this.equipIcons[i].updateByThingItemData(this.EquipItemDatas[i]);
            this.equipIcons[i].updateIcon();

            txtLv.text = rawDatas[i].config.m_ucStage + "阶";
            txtName.text = TextFieldUtil.getColorText(rawDatas[i].config.m_szName, Color.getColorById(rawDatas[i].config.m_ucColor));
        }
    }


    private onSelectEquip(selectedEquipdata: ThingItemData): void {
        if (selectedEquipdata == null) {
            this.clearPropText();
            this.upConditionText.text = '';
            this.updateRewardIcon(null, null, null);
            UIUtils.setButtonClickAble(this.btnFinal, false);
            return;
        }
        let m_ucPropId: number = 0;
        //当前选择的装备,需要重新设置
        this.m_selectedEquipData = selectedEquipdata;
        this.m_attListData.length = 0;
        this.m_attListDic = {};
        let heroLv: number = G.DataMgr.heroData.level;
        if (this.m_selectedEquipData.config != null) {
            //当前强化属性
            let equipConfig = this.m_selectedEquipData.config;
            //let strengthenConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(equipConfig.m_iEquipPart);
            let equipEnhanceAttItemData: EquipEnhanceAttItemData;
            for (let i = 0; i < equipConfig.m_astBaseProp.length; i++) {
                m_ucPropId = equipConfig.m_astBaseProp[i].m_ucPropId;
                //强化属性的ID
                if (m_ucPropId > 0) {
                    equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(m_ucPropId);
                    let attName: string = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                    let attVal: number = Math.round(equipConfig.m_astBaseProp[i].m_ucPropValue / EquipStrengthenData.EQUIP_BASEPROP_LEVEL);
                    this.upPropFront1.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_astBaseProp[0].m_ucPropId);
                    this.upPropFront2.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_astBaseProp[1].m_ucPropId);
                    //this.upPropMiddle1.text = (equipConfig.m_astBaseProp[0].m_ucPropValue + EquipUtils.getAddStrentPorpValue(equipConfig, 0)).toString();
                    //this.upPropMiddle2.text = (equipConfig.m_astBaseProp[1].m_ucPropValue + EquipUtils.getAddStrentPorpValue(equipConfig, 1)).toString();
                    this.upPropMiddle1.text = equipConfig.m_astBaseProp[0].m_ucPropValue.toString();
                    this.upPropMiddle2.text = equipConfig.m_astBaseProp[1].m_ucPropValue.toString();

                    if (equipEnhanceAttItemData != null) {
                        equipEnhanceAttItemData.beforeVal = attVal;
                        equipEnhanceAttItemData.propStr = attName;
                    }
                }
            }
            //计算额外属性
            let attName: string;
            let attVal: number;
            equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(equipConfig.m_stExtProp.m_ucPropId);
            attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_stExtProp.m_ucPropId);
            attVal = equipConfig.m_stExtProp.m_ucPropValue;
            this.upPropFront3.text = "";
            this.upPropMiddle3.text = "";
            if (equipEnhanceAttItemData != null) {
                equipEnhanceAttItemData.beforeVal = attVal;
                equipEnhanceAttItemData.propStr = attName;
            }
        }
        this.updateLevels();

        let upColorConfig: GameConfig.EquipUpColorM = null;
        if (this.m_selectedEquipData.config != null) {
            if (this.m_selectedEquipData.config.m_ucStage == KeyWord.EQUIP_STAGE_12) {
                this.upConditionText.text = "装备已达到最大阶级";
                this.upPropLast1.text = '';
                this.upPropLast2.text = '';
                this.upPropLast3.text = '';
                this.updateRewardIcon(null, null, null);
                upColorConfig = null;
            }
            else {//if (this.m_selectedEquipData.config.m_ucStage >= KeyWord.EQUIP_STAGE_3) {
                upColorConfig = G.DataMgr.equipStrengthenData.getUpColorConfig(this.m_selectedEquipData.config.m_iID);
            }
            //else {

            //    if (this.m_selectedEquipData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WEAPON) {
            //        this.upConditionText.text = "三阶可进阶,首充可获得";
            //    } else {
            //        this.upConditionText.text = "三阶可进阶";
            //    }

            //    this.upPropLast1.text = '';
            //    this.upPropLast2.text = '';
            //    this.upPropLast3.text = '';
            //    this.updateRewardIcon(null, null, null);
            //    upColorConfig = null;
            //}
        }
        else {
            upColorConfig = null;
        }

        if (upColorConfig != null) {
            this.setUpdateMaterial(upColorConfig);
            //下级强化属性
            let nextConfig = ThingData.getThingConfig(upColorConfig.m_iLevelUpID);
            let nextStrengthConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(nextConfig.m_iEquipPart);
            let equipEnhanceAttItemData: EquipEnhanceAttItemData;
            let attName: string;
            let attVal: number;
            for (let i = 0; i < nextConfig.m_astBaseProp.length; i++) {
                //if (nextStrengthConfig == null) continue;
                m_ucPropId = nextConfig.m_astBaseProp[i].m_ucPropId;
                equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(m_ucPropId);
                attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                attVal = Math.round(nextConfig.m_astBaseProp[i].m_ucPropValue + nextConfig.m_astBaseProp[i].m_ucPropValue / EquipStrengthenData.EQUIP_BASEPROP_LEVEL);
                //this.upPropLast1.text = (nextConfig.m_astProp[0].m_ucPropValue + EquipUtils.getAddStrentPorpValue(nextConfig, 0)).toString();
                //this.upPropLast2.text = (nextConfig.m_astProp[1].m_ucPropValue + EquipUtils.getAddStrentPorpValue(nextConfig, 1)).toString();
                this.upPropLast1.text = nextConfig.m_astBaseProp[0].m_ucPropValue.toString();
                this.upPropLast2.text = nextConfig.m_astBaseProp[1].m_ucPropValue.toString();
                if (equipEnhanceAttItemData) {
                    equipEnhanceAttItemData.afterVal = attVal;
                    equipEnhanceAttItemData.propStr = attName;
                }
            }
            equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(nextConfig.m_stExtProp.m_ucPropId);
            attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, nextConfig.m_stExtProp.m_ucPropId);
            attVal = nextConfig.m_stExtProp.m_ucPropValue;
            this.upPropLast3.text = "";
            if (equipEnhanceAttItemData) {
                equipEnhanceAttItemData.afterVal = attVal;
                equipEnhanceAttItemData.propStr = attName;
            }
            this.arrowIcon.SetActive(true);
        }
        else {
            //无升阶颜色配置
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            this.materialData1 = null;
            this.materialData2 = null;
            this.materialData3 = null;
            this.arrowIcon.SetActive(false);
        }

        //终极进阶按钮显示
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        //let config = G.DataMgr.equipStrengthenData.getEquipFinalPropConfigByEquipPart(equipPart);
        //let has = G.DataMgr.thingData.getBagItemById(config.m_iConsumID, false, 0).length;
        UIUtils.setButtonClickAble(this.btnFinal, /*(this.m_selectedEquipData.config.m_ucStage >= KeyWord.EQUIP_STAGE_3) &&**/
            !equipStrengthenData.isEquipHadFinalUpLv(EquipUtils.getEquipIdxByPart(selectedEquipdata.config.m_iEquipPart)));
    }


    private updateLevels(): void {
        if (this.m_selectedEquipData.config == null) return;
        let thingData = G.DataMgr.thingData;

        //套装属性的显示
        let curEquipCollectStage = thingData.curEquipCollectStage;
        let numComplete = thingData.getEquipSuitsCount(curEquipCollectStage);
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(curEquipCollectStage);
        this.propList.Count = colorList.length;

        let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(KeyWord.SPECPRI_EQUIPSUIT_ADD);

        for (let i = 0; i < this.propList.Count; i++) {
            if (this.propItems[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.propItems[i] = new EquipCollectPropItem();
                this.propItems[i].setComponent(item);
            }
            this.propItems[i].update(colorList[i], numComplete, i, specialPriAddPct);
        }

        //激活数量显示
        let color = numComplete == colorList[this.propList.Count - 1].m_ucNum ? Color.GREEN : Color.GREY;
        this.TextTitleNum.text = TextFieldUtil.getColorText("(", color)
            + TextFieldUtil.getColorText(numComplete.toString(), numComplete == 0 ? Color.GREY : Color.GREEN)
            + TextFieldUtil.getColorText("/", color)
            + TextFieldUtil.getColorText(colorList[this.propList.Count - 1].m_ucNum.toString(), color)
            + TextFieldUtil.getColorText(")", color);

        //for (let i = 0; i < this.propList.Count; i++) {
        //    let config = colorList[i];
        //    let item = this.propList.GetItem(i).gameObject;
        //    let txtNum = ElemFinder.findText(item, "txtNum");
        //    let txtValue = ElemFinder.findText(item, "txtValue");
        //    txtNum.text = TextFieldUtil.getColorText(uts.format("[{0}]", colorList[i].m_ucNum), config.m_ucNum > numComplete ? Color.GREY : Color.GREEN);
        //    let str = uts.format("{0}  {1}", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_astPropAtt[0].m_ucPropId), config.m_astPropAtt[0].m_ucPropValue);
        //    txtValue.text = TextFieldUtil.getColorText(str, config.m_ucNum > numComplete ? Color.GREY : Color.GREEN);
        //}

        //战力显示
        //this.fightText.text = EquipUtils.getUpLevelFight(numComplete, curEquipCollectStage).toString();
        if (this.equipView != null) {
            //总战力
            this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        }
        this.suitProp1.text = TextFieldUtil.getColorText(EquipUtils.getOpenLvName(curEquipCollectStage), Color.getColorById(EquipUtils.getEquipCollectColorByType(curEquipCollectStage)));
        let names = [];
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let data: ThingItemData = new ThingItemData();
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            data = dataList[i];
            if (data) {
                names.push(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PART, i + 100),
                    false, data.config.m_ucStage >= curEquipCollectStage ? Color.PropGreen2 : Color.PropWHITE);
            }
            else {
                names.push(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PART, i + 100),
                    false, Color.WHITE);
            }
        }

        let propName: string = "";
        let index = 0;
        for (let i = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            propName += "  " + TextFieldUtil.getColorText(names[index], names[index + 2]);
            index = 3 * (i + 1);
            if (i == 3) {
                propName += "\n";
            }
        }
        this.suitProp2.text = propName;
    }


    private setUpdateMaterial(upColorConfig: GameConfig.EquipUpColorM): void {

        if (upColorConfig == null) return;

        //我的装备
        if (this.materialData1 == null) {
            this.materialData1 = new ThingItemData();
        }
        if (this.materialData2 == null) {
            this.materialData2 = new MaterialItemData();
        }
        if (this.materialData3 == null) {
            this.materialData3 = new ThingItemData();
        }

        //当前装备
        this.iconItem1.updateByThingItemData(this.m_selectedEquipData);
        this.iconItem1.updateIcon();
        //升级材料
        this.materialData2.id = upColorConfig.m_iConsumableID;
        this.materialData2.need = upColorConfig.m_iConsumableNumber;
        this.materialData2.has = G.DataMgr.thingData.getThingNum(this.materialData2.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.iconItem2.updateByMaterialItemData(this.materialData2);
        this.iconItem2.updateIcon();
        //目标装备
        this.iconItem3.updateById(upColorConfig.m_iLevelUpID);
        this.iconItem3.updateIcon();

        let thingCfg: GameConfig.ThingConfigM = ThingData.getThingConfig(upColorConfig.m_iConsumableID);
        if (this.materialData2.has >= this.materialData2.need) {
            UIUtils.setButtonClickAble(this.m_btnEnhance, true);
            this.upConditionText.text = TextFieldUtil.getColorText(uts.format('该装备进阶需要{0}', thingCfg.m_szName), Color.GREEN);
        } else {
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            this.upConditionText.text = TextFieldUtil.getColorText(uts.format('该装备进阶需要{0}', thingCfg.m_szName), Color.RED);
        }
    }


    private onBtnEnhanceClick(): void {
        //点击进阶按钮
        if (this.m_selectedEquipData.config == null)
            return;
        let upColorConfig: GameConfig.EquipUpColorM = G.DataMgr.equipStrengthenData.getUpColorConfig(this.m_selectedEquipData.config.m_iID);
        let cfg: GameConfig.ThingConfigM = ThingData.getThingConfig(upColorConfig.m_iConsumableID);
        if (cfg.m_ucRequiredLevel > G.DataMgr.heroData.level) {
            G.TipMgr.addMainFloatTip(uts.format('您的角色等级不足，无法使用{0}', TextFieldUtil.getItemText(cfg)));
            return;
        }
        if (G.DataMgr.thingData.getBagItemById(cfg.m_iID, false, 1).length > 0 || G.DataMgr.thingData.getBagItemById(cfg.m_iID + 1, false, 1).length > 0) {
            //let index = this.equipList.Selected;
            //let effect = this.uiEffectList[index];
            //if (!effect) {
            //    effect = this.uiEffectList[index] = new UIEffect();
            //    effect.setEffectPrefab(this.bkts, this.itemSelected, 1, -80);
            //}
            //effect.playEffect(EffectType.Effect_Normal, true, 0.7);
            this.commonUIEffect.stopEffect();
            this.commonUIEffect.playEffect(EffectType.Effect_Normal, true, 1);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(this.m_selectedEquipData.data.m_usPosition, Macros.EQUIP_UPCOLOR));
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
        }
        else {
            G.TipMgr.addMainFloatTip(uts.format('您的{0}数量不足', TextFieldUtil.getItemText(cfg)), -1, 0);
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipUpLevel, EnumGuide.EquipUpLevel_ClickAutoUpLevel);
    }



    /**
    * 获取属性列表ITEM数据
    * @param	m_ucPropId
    * @return
    */
    private getEquipEnhanceAttItemData(m_ucPropId: number): EquipEnhanceAttItemData {
        let equipEnhanceAttItemData: EquipEnhanceAttItemData = this.m_attListDic[m_ucPropId] as EquipEnhanceAttItemData;
        if (!equipEnhanceAttItemData && m_ucPropId > 0) {
            equipEnhanceAttItemData = new EquipEnhanceAttItemData();
            equipEnhanceAttItemData.propId = m_ucPropId;
            this.m_attListData.push(equipEnhanceAttItemData);
            this.m_attListDic[m_ucPropId] = equipEnhanceAttItemData;
        }
        return this.m_attListDic[m_ucPropId];
    }



    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.EquipUpLevel_ClickAutoUpLevel == step) {
            this.onBtnEnhanceClick();
            return true;
        }
        return false;
    }
}