import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { DiamondUpItemData } from 'System/equip/DiamondUpItemData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { UiElements } from 'System/uilib/UiElements'
import { InsertDiamondItemData } from 'System/equip/InsertDiamondItemData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { DiamondView } from 'System/equip/DiamondView'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType, EnumEffectRule } from 'System/constants/GameEnum'
import { List } from "System/uilib/List"
import { FixedList } from "System/uilib/FixedList"
import { EquipView } from 'System/equip/EquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIEffect, EffectType } from 'System/uiEffect/UIEffect'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { DiamondUpPanel } from 'System/equip/DiamondUpPanel'
import { ItemTipBase } from 'System/tip/view/ItemTipBase'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { DiamondUpMaterialItemData } from 'System/equip/DiamondUpMaterialItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { HunLiView } from '../hunli/HunLiView';

class InsertEquipItem {

    private readonly maxCount = 6;
    private readonly scale = 0.5;

    private objEquip: UnityEngine.GameObject;
    //private txtName: UnityEngine.UI.Text;
    private lockImgs: UnityEngine.GameObject[] = [];

    equipIconItem: IconItem;

    private damondRamImgs: UnityEngine.UI.RawImage[] = [];

    //特效
    private smallAddEffects: UIEffect[] = [];

    setCommponents(go: UnityEngine.GameObject, iconPrefab: UnityEngine.GameObject, effectPrefab: UnityEngine.GameObject) {
        this.objEquip = ElemFinder.findObject(go, "equip");
        this.equipIconItem = new IconItem();
        this.equipIconItem.effectRule = EnumEffectRule.none;
        this.equipIconItem.setUsualIconByPrefab(iconPrefab, this.objEquip);
        this.equipIconItem.showBg = false;
        this.equipIconItem.showIconImage(false);
        this.equipIconItem.showLvTextAndBg = false;
        //this.txtName = ElemFinder.findText(go, "txtName");

        for (let i = 0; i < this.maxCount; i++) {
            let objInsertIcon = ElemFinder.findObject(go, "diaList/diaIcon" + i);

            let ramImg = ElemFinder.findRawImage(go, "diaList/diaIcon" + i + "/icon");
            ramImg.enabled = false;
            this.damondRamImgs.push(ramImg);

            let lockImg = ElemFinder.findObject(go, "diaList/diaIcon" + i + "/lockImg");
            this.lockImgs.push(lockImg);
            //特效
            this.smallAddEffects[i] = new UIEffect();
            this.smallAddEffects[i].setEffectPrefab(effectPrefab, objInsertIcon, this.scale);
        }
    }

    update(equipData: ThingItemData) {
        if (equipData == null) {
            for (let i: number = 0; i < this.maxCount; i++) {
                this.damondRamImgs[i].enabled = true;
            }
            //装备图标显示
            this.equipIconItem.updateByThingItemData(null);
            this.equipIconItem.updateIcon();
            return;
        }
        //this.txtName.text = TextFieldUtil.getColorText(equipData.config.m_szName, Color.getColorById(equipData.config.m_ucColor));
        for (let i: number = 0; i < this.maxCount; i++) {
            let m_stSpecThingProperty = equipData.data.m_stThingProperty.m_stSpecThingProperty
            if (m_stSpecThingProperty) {
                if (!m_stSpecThingProperty.m_stEquipInfo) continue;
                //孔显示
                let id = equipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
                let itemConfig = null;
                if (GameIDUtil.isBagThingID(id)) {
                    itemConfig = ThingData.getThingConfig(id);
                }
                if (itemConfig != null && itemConfig.m_szIconID > 0) {
                    this.damondRamImgs[i].enabled = true;
                    // 物品图标
                    G.ResourceMgr.loadIcon(this.damondRamImgs[i], itemConfig.m_szIconID.toString(), -1);
                } else {
                    this.damondRamImgs[i].enabled = false;
                }

                //是否开启槽
                this.lockImgs[i].SetActive(true);
                let isLock = G.DataMgr.hunliData.level < EquipUtils.SLOT_OPEN_LEVEL[i] && (id == 0);
                this.lockImgs[i].SetActive(isLock);
                //特效显示
                let oneEquipCanInsert = G.DataMgr.equipStrengthenData.oneSlotCanInsert(equipData, i);
                let showEffect = oneEquipCanInsert && !isLock && (id <= 0);
                this.smallAddEffects[i].playEffect(EffectType.Effect_None, showEffect);
                //装备图标显示
                this.equipIconItem.updateByThingItemData(equipData);
                this.equipIconItem.updateIcon();
                this.equipIconItem.showLock = false;
                this.equipIconItem.frameColor = 0;
            }
        }
    }
}

/**
 * 宝石系统
 * @author jesse
 *
 */
export class InsertDiamondPanel extends EquipBasePanel {

    /**宝石的数量*/
    private DIAMOND_NUM: number = 6;

    private equipView: EquipView;

    /**当前选中的那一件*/
    private m_selectedEquipData: ThingItemData;
    /**宝石属性*/
    private m_diamondDataList: InsertDiamondItemData[];
    /**可镶嵌的宝石列表*/
    private m_diamondStoreList: ThingItemData;
    /**选择镶嵌的那个孔*/
    private m_selectedSlot: number = 0;
    private _allAttData: GameConfig.EquipPropAtt[];
    private _allAttDic: { [propId: number]: GameConfig.EquipPropAtt };

    ///////////////////////////////////////////////////////////

    /**宝石镶嵌*/
    private diamondList: FixedList = null;
    private objInsert: UnityEngine.GameObject = null;
    /**默认icon显示*/
    private defaultIcons: UnityEngine.UI.RawImage[] = [];

    /**icon显示*/
    private objIcons: UnityEngine.GameObject[] = [];
    private insertIconItems: IconItem[] = [];
    /**是否开放，锁*/
    private lockImgs: UnityEngine.GameObject[] = [];
    /**开放条件*/
    private txtLimit: UnityEngine.UI.Text[] = [];
    /**箭头提示*/
    private iconArrows: UnityEngine.GameObject[] = [];
    /**+号*/
    private bigAddUIEffects: UnityEngine.GameObject[] = [];
    /**进度背景*/
    private fillBgs: UnityEngine.GameObject[] = [];
    /**进度*/
    private fills: UnityEngine.UI.Image[] = [];
    /**用来显示默认没镶嵌的宝石图片*/
    private diamondType: { [propId: number]: number } = {};

    /**装备数据*/
    private EquipItemDatas: ThingItemData[] = [];


    /**当前选择的左侧装备列表索引*/
    private currIndex: number = 0;
    //private equipIconItem = new IconItem();
    private selectIconItemData: ThingItemData = new ThingItemData();

    private equipIcon: UnityEngine.UI.Image;
    private txtZDL: UnityEngine.UI.Text = null;
    private txtTianXiaTao: UnityEngine.UI.Text = null;
    //处理点击装备列表，弹Tip
    private numberText: UnityEngine.UI.Text = null;

    private iconAtlas: Game.UGUIAltas;

    private smallAddPrefab: UnityEngine.GameObject;
    private insertEquipItems: InsertEquipItem[] = [];

    /**选中的宝石孔位置,每件装备6个宝石，下标0-5*/
    private selectDiamondSlot: number = 0;
    /**控制右侧镶嵌和升级两个按钮的显示，true为镶嵌，false为升级*/
    private isXiangQian: boolean = true;

    //右侧-->
    //1)魔石镶嵌相关---
    //下面三个是右侧页面签按钮
    private btnXiangQian: UnityEngine.GameObject;
    private btnXQSelect: UnityEngine.GameObject;
    private btnXQTipMark: UnityEngine.GameObject;
    ////下面三个是右侧页面签按钮
    private btnUpLevel: UnityEngine.GameObject;
    private btnULSelect: UnityEngine.GameObject;
    private btnULTipMark: UnityEngine.GameObject;

    private xiangQianPanel: UnityEngine.GameObject;
    private upLevelPanel: UnityEngine.GameObject;

    private curEquipItemGo: UnityEngine.GameObject;
    private yiXiangQian: UnityEngine.GameObject;
    private yxq_icon: UnityEngine.GameObject;
    private curEquipItem: IconItem;
    private yxq_txtName: UnityEngine.UI.Text;
    private yxq_txtValue: UnityEngine.UI.Text;

    private weiXiangQian: UnityEngine.UI.Text;

    private rightDiamondList: List;
    private rightDLIconItem: IconItem[] = new Array<IconItem>();

    private showDiamonList: ThingItemData[] = new Array<ThingItemData>();
    private btnTakeOff: UnityEngine.GameObject;

    //2)魔石升级相关
    private _materialListData: DiamondUpMaterialItemData[];
    private upListData: DiamondUpItemData[];
    private upListDic: { [pos: number]: DiamondUpItemData };
    private iconItems: IconItem[] = [];
    private fixedIconItems: IconItem[] = [];
    private txtFixedValues: UnityEngine.UI.Text[] = [];

    private _equipPos: number = 0;
    private _gemPos: number = 0;

    private _gemType: number = 0;
    private _gemId: number = 0;

    private materialVoArr: number[] = [];
    /**宝石升级选择的数量*/
    private _matercialCount: number = 0;
    private _gemLevel: number = 0;
    private _nextGemCfg: GameConfig.ThingConfigM;
    private _maxVal: number = 0;
    private _crtVal: number = 0;

    private _equipData: ThingItemData;

    private costList: FixedList;
    //当前宝石图标
    private curSelectIcon: UnityEngine.GameObject;
    private curIconItem: IconItem;

    //进度
    private txtCurProgress: UnityEngine.UI.Text;
    private fill1: UnityEngine.UI.Image;
    private fill2: UnityEngine.UI.Image;

    //特效
    private isCheckEffect: boolean = false;//是否检查特效播不播放
    private curDiamondLv: number = -1;//当前宝石等级，升一级才出特效
    private oldDiamondLv: number = -1;
    private shengjiEffect: UnityEngine.GameObject;
    private equipEffect: UnityEngine.GameObject;
    private shengjiRoot: UnityEngine.GameObject;
    private objTip: UnityEngine.GameObject;
    private shengJiUiEffect: UIEffect;
    private equipUiEffect: UIEffect;
    private btnLvUp: UnityEngine.GameObject;
    //一键填充按钮
    private btnPut: UnityEngine.GameObject;
    private upLevelList: List;
    private upLevelListBg: UnityEngine.GameObject;
    private btnUpLevelListClose: UnityEngine.GameObject;
    //右侧<--
    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT);
    }

    protected resPath(): string {
        return UIPathData.InsertDiamondPanel;
    }

    protected initElements() {
        super.initElements();
        this.smallAddPrefab = this.elems.getElement("smallAddEffect");

        this.iconAtlas = this.elems.getElement("iconAtlas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let item = new InsertEquipItem();
            this.insertEquipItems[i] = item;
            item.setCommponents(this.equipList.GetItem(i).gameObject, this.itemIcon_Normal, this.smallAddPrefab);
            item.equipIconItem.arrowType = ArrowType.equipMingWen;
            item.equipIconItem.needWuCaiColor = true;
            item.equipIconItem.showEquipStrengNumber = false;
            this.equipIcons[i] = item.equipIconItem;
        }

        this.m_diamondDataList = new Array<InsertDiamondItemData>(this.DIAMOND_NUM);
        for (let i = 0; i < this.DIAMOND_NUM; i++) {
            this.m_diamondDataList[i] = new InsertDiamondItemData();
            this.m_diamondDataList[i].slot = i + 1;
        }

        this.diamondList = ElemFinder.getUIFixedList(this.elems.getElement("objInsert"));

        //选择装备，宝石镶嵌
        this.objInsert = this.elems.getElement("objInsert");
        for (let i = 0; i < this.DIAMOND_NUM; i++) {
            let obj = this.objInsert.transform.Find("iconItem" + i + "/icon").gameObject;
            let txtLimit = ElemFinder.findText(this.objInsert.transform.Find("iconItem" + i).gameObject, "txtLimit");
            let lockImg = ElemFinder.findObject(this.objInsert.transform.Find("iconItem" + i).gameObject, "lockImg");
            let arrow = ElemFinder.findObject(this.objInsert.transform.Find("iconItem" + i).gameObject, "iconArrow");
            let add = ElemFinder.findObject(this.objInsert.transform.Find("iconItem" + i).gameObject, "add");
            let fillBg = ElemFinder.findObject(this.objInsert.transform.Find("iconItem" + i).gameObject, "fillBg");
            let fill = ElemFinder.findImage(this.objInsert.transform.Find("iconItem" + i).gameObject, "fillBg/fill");
            let defaultIcon = ElemFinder.findRawImage(this.objInsert.transform.Find("iconItem" + i).gameObject, "defaultIcon");
            arrow.SetActive(false);
            let iconItem = new IconItem();
            this.objIcons.push(obj);
            this.bigAddUIEffects.push(add);
            this.fillBgs.push(fillBg);
            this.txtLimit.push(txtLimit);
            this.fills.push(fill);
            this.defaultIcons.push(defaultIcon);
            this.lockImgs.push(lockImg);
            //this.bars.push(bar);
            //this.btnUps.push(btnUp);
            this.iconArrows.push(arrow);
            //this.txtTypes.push(txtType);
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, obj);
            iconItem.showBg = false;
            iconItem.showLvTextAndBg = false;
            iconItem.needColor = false;
            iconItem.m_effectRule = EnumEffectRule.none;
            this.insertIconItems.push(iconItem);

            //Game.UIClickListener.Get(btnUp).onClick = delegate(this, this.OnClickBtnUp, i);

        }
        this.diamondType[KeyWord.EQUIP_PROP_PHYSIC_ATTACK] = 10047101;
        this.diamondType[KeyWord.EQUIP_PROP_HP] = 10049101;
        this.diamondType[KeyWord.EQUIP_PROP_DEFENSE] = 10050101;
        this.diamondType[KeyWord.EQUIP_PROP_GOAL] = 10052101;
        this.diamondType[KeyWord.EQUIP_PROP_DODGE] = 10053101;
        this.diamondType[KeyWord.EQUIP_PROP_CRITICAL] = 10054101;
        this.diamondType[KeyWord.EQUIP_PROP_TOUGHNESS] = 10055101;

        this.equipIcon = this.elems.getImage("equipIcon");
        //this.equipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.equipIcon);
        //this.equipIconItem.setTipFrom(TipFrom.equip);
        //this.equipIconItem.arrowType = ArrowType.equipMingWen;
        //this.equipIconItem.isNeedShowArrow = false;
        //this.equipIconItem.needWuCaiColor = true;
        //this.equipIconItem.needForceShowWuCaiColor = true;

        this.txtZDL = this.elems.getText("txtZDL");
        this.txtTianXiaTao = this.elems.getText("txtTianXiaTao");

        //右侧-->
        //1）魔石镶嵌
        this.btnXiangQian = this.elems.getElement("btnXiangQian");
        this.btnXQSelect = ElemFinder.findObject(this.btnXiangQian, "selected");
        this.btnXQTipMark = ElemFinder.findObject(this.btnXiangQian, "tipMark");
        this.btnXQTipMark.SetActive(false);

        this.btnUpLevel = this.elems.getElement("btnUpLevel");
        this.btnULSelect = ElemFinder.findObject(this.btnUpLevel, "selected");
        this.btnULTipMark = ElemFinder.findObject(this.btnUpLevel, "tipMark");
        this.btnXQTipMark.SetActive(false);

        this.xiangQianPanel = this.elems.getElement("xiangQianPanel");
        this.upLevelPanel = this.elems.getElement("upLevelPanel");

        this.curEquipItemGo = this.elems.getElement("curEquipItem");
        this.yiXiangQian = this.elems.getElement("yiXiangQian");
        this.yxq_icon = ElemFinder.findObject(this.yiXiangQian, "icon");
        this.curEquipItem = new IconItem();
        this.curEquipItem.setUsualIconByPrefab(this.itemIcon_Normal, this.yxq_icon);
        this.curEquipItem.setTipFrom(TipFrom.normal);
        this.yxq_txtName = ElemFinder.findText(this.yiXiangQian, "txtName");
        this.yxq_txtValue = ElemFinder.findText(this.yiXiangQian, "txtValue");
        this.weiXiangQian = this.elems.getText("weiXiangQian");

        this.rightDiamondList = this.elems.getUIList("rightDiamondList");

        this.btnTakeOff = this.elems.getElement("btnTakeOff");
        //2）魔石升级
        this.costList = this.elems.getUIFixedList("costList");
        //中间宝石图标显示
        this.curSelectIcon = this.elems.getElement("curSelectIcon");
        this.curIconItem = new IconItem();
        this.curIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.curSelectIcon);
        this.curIconItem.setTipFrom(TipFrom.normal);


        //进度
        this.txtCurProgress = this.elems.getText("txtCurProgress");
        this.fill1 = this.elems.getImage("fill1");
        this.fill2 = this.elems.getImage("fill2");

        //特效
        this.shengjiEffect = this.elems.getElement("shengjiEffect");
        this.equipEffect = this.elems.getElement("equipEffect");
        this.shengjiRoot = this.elems.getElement("shengjiRoot");
        this.shengJiUiEffect = new UIEffect();
        this.equipUiEffect = new UIEffect();
        this.shengJiUiEffect.setEffectPrefab(this.shengjiEffect, this.shengjiRoot);
        this.equipUiEffect.setEffectPrefab(this.equipEffect, this.curSelectIcon);

        this.btnLvUp = this.elems.getElement("btnLvUp");
        this.objTip = this.elems.getElement("objTip");
        this.btnPut = this.elems.getElement("btnPut");

        this.upLevelList = this.elems.getUIList("upLevelList");
        this.upLevelListBg = this.elems.getElement("upLevelListBg");
        this.btnUpLevelListClose = this.elems.getElement("btnUpLevelListClose");
        //右侧<--

    }

    protected initListeners() {
        super.initListeners();
        this.diamondList.onClickItem = delegate(this, this.onClickInsert);
        this.addClickListener(this.elems.getElement("btnRule"), this.onClickRule);
        this.addClickListener(this.btnXiangQian, this.OnBtnXiangQianClick);
        this.addClickListener(this.btnUpLevel, this.onBtnUpLevelClick);
        this.addClickListener(this.btnTakeOff, this.onBtnTakeOff);

        this.addListClickListener(this.costList, this.onClickCostListItem);
        this.addClickListener(this.btnLvUp, this.onBtnLvUp);
        this.addClickListener(this.btnPut, this.onBtnPut);
        this.addListClickListener(this.upLevelList, this.onClickListItem);
        this.addClickListener(this.btnUpLevelListClose, this.onUpLevelListClose);
    }

    protected onOpen() {
        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            //this.equipView.showModelBg(true);
            this.equipView.showFight(true);
        }
        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);
        this.equipList.Selected = 0;
        this.onClickEquipList(0);

        this.closeTitleFighting();
    }

    protected onClose() {
        if (this.equipView != null) {
            //this.equipView.showModelBg(false);
            this.equipView.showFight(false);
        }
    }

    private onUpLevelListClose() {
        this.upLevelListBg.SetActive(false);
    }
    private onUpLevelListOpen() {
        this.upLevelListBg.SetActive(true);
    }

    private OnBtnXiangQianClick() {
        this.isXiangQian = true;
        this.btnXQSelect.SetActive(true);
        this.btnULSelect.SetActive(false);
        let selectDiamondData = this.m_diamondDataList[this.selectDiamondSlot];
        this.xiangQianPanel.SetActive(true);
        this.upLevelPanel.SetActive(false);
        let isLock: boolean = selectDiamondData.isLock;
        this.showDiamonList = [];
        this.curEquipItemGo.SetActive(!isLock);
        if (isLock) {
            this.objTip.SetActive(false);
            this.rightDiamondList.Count = 0;
            this.weiXiangQian.text = uts.format("{0} 可镶嵌", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, EquipUtils.SLOT_OPEN_LEVEL[this.selectDiamondSlot]));
        } else {
            let flag = selectDiamondData.id <= 0;
            this.yiXiangQian.SetActive(!flag);
            if (!flag) {
                this.curEquipItem.updateById(selectDiamondData.id);
                this.curEquipItem.updateIcon();
                let cfg = ThingData.getThingConfig(selectDiamondData.id);
                let color = Color.getColorById(cfg.m_ucColor);
                this.yxq_txtName.text = TextFieldUtil.getColorText(cfg.m_szName, color);
                let diamondCfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(selectDiamondData.id);
                let str = uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, diamondCfg.m_ucPropId), diamondCfg.m_iPropValue);
                this.yxq_txtValue.text = TextFieldUtil.getColorText(str, color);
                this.weiXiangQian.text = "";
            } else {
                this.weiXiangQian.text = "未镶嵌魔石";
            }
            let diamondList: ThingItemData[] = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_EQUIP_JEWEL);
            //点击位置宝石类型
            let propId = G.DataMgr.equipStrengthenData.getEquipDiamondMount(this.m_selectedEquipData.config.m_iEquipPart).m_ucPropId[this.selectDiamondSlot];
            EquipUtils.diamondListSort(diamondList);
            for (let thingVo of diamondList) {
                let cfg = G.DataMgr.equipStrengthenData.getDiamondConfig(thingVo.config.m_iID);
                if (cfg.m_ucPropId == propId) {
                    this.showDiamonList.push(thingVo);
                }
            }
            let len = this.showDiamonList.length;
            this.objTip.SetActive(len == 0);
            this.rightDiamondList.Count = len;

            for (let i = 0; i < len; i++) {
                let item = this.rightDiamondList.GetItem(i);
                let txtName = item.findText("txtName");
                let txtValue = item.findText("txtValue");
                let btnXiangQian = item.findObject("btnXiangQian");
                Game.UIClickListener.Get(btnXiangQian).onClick = delegate(this, this.onItemClick, i);
                let iconItem = this.rightDLIconItem[i];
                if (!iconItem) {
                    iconItem = new IconItem();
                    iconItem.effectRule = EnumEffectRule.none;
                    iconItem.setUsualIconByPrefab(this.itemIcon_Normal, item.findObject("icon"));
                    this.rightDLIconItem[i] = iconItem;
                }
                iconItem.updateByThingItemData(this.showDiamonList[i]);
                iconItem.updateIcon();

                //宝石等级
                if (this.showDiamonList[i] != null) {
                    let diamondID: number = this.showDiamonList[i].config.m_iID;
                    if (diamondID > 0) {
                        let color = Color.getColorById(this.showDiamonList[i].config.m_ucColor);
                        txtName.text = TextFieldUtil.getColorText(this.showDiamonList[i].config.m_szName, color);
                        let cfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(diamondID);
                        let str = uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId), cfg.m_iPropValue);
                        txtValue.text = TextFieldUtil.getColorText(str, color);
                    }
                } else {
                    txtName.text = "";
                }
            }
        }
    }

    private onBtnUpLevelClick() {
        this.isXiangQian = false;
        this.btnXQSelect.SetActive(false);
        this.btnULSelect.SetActive(true);
        this.xiangQianPanel.SetActive(false);
        this.upLevelPanel.SetActive(true);
        let insertDiamondData = this.m_diamondDataList[this.selectDiamondSlot];
        if (insertDiamondData.isLock) {
            this.upLevelPanel.SetActive(false);
            this.weiXiangQian.text = uts.format("{0} 可镶嵌", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, EquipUtils.SLOT_OPEN_LEVEL[this.selectDiamondSlot]));
        } else if (insertDiamondData.id <= 0) {
            this.upLevelPanel.SetActive(false);
            this.weiXiangQian.text = "未镶嵌魔石";
        } else {
            this.weiXiangQian.text = "";
            //if (insertDiamondData.canLvUp) {//可升级
            if (insertDiamondData.level == 19) {
                G.TipMgr.addMainFloatTip("魔石已满级，不可升级");
            } else {//升级操作
                this.updateUpLevelPanel();
            }
            // }
        }
    }

    /**合成*/
    private onBtnLvUp(): void {
        if (this._nextGemCfg == null) {
            G.TipMgr.addMainFloatTip('已升级到顶阶');
            return;
        }
        let i: number = 0;
        let count: number = 0;
        let things: Protocol.ContainerThing[] = [];
        for (i = 0; i < this.materialVoArr.length; i++) {
            let materialPos: number = this.materialVoArr[i];
            if (materialPos >= 0) {
                let upItemData: DiamondUpItemData = this.getUpItemData(materialPos);
                let thingVo: ThingItemData = upItemData ? upItemData.thingVo : null;
                ;
                let thing: Protocol.ContainerThing = {} as Protocol.ContainerThing;
                if (thingVo) {
                    thing.m_iThingID = thingVo.config.m_iID;
                    thing.m_usPosition = thingVo.data.m_usPosition;
                    thing.m_iNumber = 1;
                }
                things.push(thing);
                count++;
            }
        }
        if (count) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDiamondUplevelRequest(Macros.CONTAINER_TYPE_ROLE_EQUIP, this._equipPos, things, count, this._gemPos));
        }
    }

    /**选中宝石*/
    private onClickListItem(index: number): void {

        //  let i: number = 0
        if (this._matercialCount >= EnumEquipRule.DIAMOND_UP_MATERIAL_MAX_COUNT) {
            G.TipMgr.addMainFloatTip("镶嵌槽内魔石已满，不能在添加了");
            return;
        }
        let itemVo: DiamondUpItemData = this.upListData[index];
        if (itemVo && itemVo.thingVo) {
            if (itemVo.num) {
                let isPush: boolean = false;
                for (let i = 0; i < this.materialVoArr.length; i++) {
                    if (this.materialVoArr[i] < 0) {
                        this.materialVoArr[i] = itemVo.thingVo.data.m_usPosition;
                        isPush = true;
                        break;
                    }
                }
                if (!isPush) {
                    this.materialVoArr.push(itemVo.thingVo.data.m_usPosition);
                }
            }
            else {
                G.TipMgr.addMainFloatTip("该类型魔石已全部使用完");
            }
        }
        this.updateUpLevelPanel();
    }

    /**刷新右侧升级宝石面板 */
    private updateUpLevelPanel(): void {
        let insertDiamondData = this.m_diamondDataList[this.selectDiamondSlot];
        this._equipPos = insertDiamondData.pos;
        this._gemPos = insertDiamondData.slot;
        this.curDiamondLv = insertDiamondData.level;
        this.oldDiamondLv = insertDiamondData.level;
        this._maxVal = 0;
        this._crtVal = 0;
        let equipDic: { [pos: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let equipVo: ThingItemData = equipDic[this._equipPos];
        if (equipVo && equipVo.data && this._gemPos > 0) {
            this._equipData = equipVo;
            this._gemId = equipVo.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[this._gemPos - 1];
            this._gemType = this.getGameType(this._gemId);
            this._gemLevel = this.getGameLevel(this._gemId);
            if (this._gemId > 0) {

                //合成图标显示
                this.curIconItem.updateById(this._gemId);
                this.curIconItem.updateIcon();
            }

            //升了1级，特效
            this.curDiamondLv = EquipUtils.getDiamondLevel(this._gemId);
            if (this.isCheckEffect && this.oldDiamondLv > 0 && this.oldDiamondLv != this.curDiamondLv) {
                this.oldDiamondLv = this.curDiamondLv;
                this.shengJiUiEffect.playEffect(EffectType.Effect_Normal);
                this.equipUiEffect.playEffect(EffectType.Effect_Normal);
                G.AudioMgr.playJinJieSucessSound();
                this.isCheckEffect = false;
            }

            let gemPropCfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(this._gemId);
            this._nextGemCfg = ThingData.getThingConfigMayNull(this._gemId + 10);
            this._crtVal = equipVo.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondIDProcess[this._gemPos - 1];
            this._maxVal = EnumEquipRule.getDiamondMaxExp(this._gemId);
            if (this._nextGemCfg) {
                this.txtCurProgress.text = uts.format('{0}/{1}', this._crtVal, this._maxVal);
                let value = this._crtVal / this._maxVal;
                this.fill1.fillAmount = value;
                this.fill2.fillAmount = value;
            }
            else {
                this.txtCurProgress.text = '已满级';
                this.fill1.fillAmount = 1;
                this.fill2.fillAmount = 1;
            }
        }

        let itemVo: DiamondUpItemData;

        let bagGemType: number = 0;
        let bagGemLevel: number = 0;
        this.upListDic = {};
        this.upListData = [];

        let diamondList: ThingItemData[] = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_EQUIP_JEWEL);

        for (let thingVo of diamondList) {
            if (thingVo.config) {
                bagGemType = this.getGameType(thingVo.config.m_iID);
                bagGemLevel = this.getGameLevel(thingVo.config.m_iID);
            }

            if (this._gemType == bagGemType && this._gemLevel >= bagGemLevel) {
                itemVo = new DiamondUpItemData();
                itemVo.thingVo = uts.deepcopy(thingVo, itemVo.thingVo, true);
                itemVo.num = thingVo.data.m_iNumber;
                this.upListDic[thingVo.data.m_usPosition] = itemVo;
                this.upListData.push(itemVo);
            }
        }

        for (let materialPos of this.materialVoArr) {
            if (materialPos >= 0) {
                itemVo = this.getUpItemData(materialPos);
                if (itemVo) {
                    itemVo.num--;
                }
            }
        }
        let length = this.upListData.length;
        this.upLevelListBg.SetActive(length > 0);
        this.upLevelList.Count = length;
        for (let i = 0; i < length; i++) {
            let iconRoot = this.upLevelList.GetItem(i).findObject("icon");
            if (this.iconItems[i] == null) {
                let iconItem = new IconItem();
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, iconRoot);
                iconItem.needEffectGrey = true;
                this.iconItems.push(iconItem);
            }
            this.iconItems[i].updateById(this.upListData[i].thingVo.config.m_iID, this.upListData[i].num);
            this.iconItems[i].filterType = this.upListData[i].num > 0 ? IconItem.NoNeedFILTER_GRAY : IconItem.FILTER_GRAY;
            this.iconItems[i].effectRule = this.upListData[i].num > 0 ? EnumEffectRule.normal : EnumEffectRule.none;
            this.iconItems[i].updateIcon();

            let diamondID = this.upListData[i].thingVo.config.m_iID;
            if (diamondID > 0) {
                let txtName = this.upLevelList.GetItem(i).findText("txtName");
                let color = Color.getColorById(this.upListData[i].thingVo.config.m_ucColor);
                txtName.text = TextFieldUtil.getColorText(this.upListData[i].thingVo.config.m_szName, color);
                let txtValue = this.upLevelList.GetItem(i).findText("txtValue");
                let gemCfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(this.upListData[i].thingVo.config.m_iID);
                txtValue.text = "经验 + " + (gemCfg.m_uiProp1process + this.upListData[i].thingVo.data.m_stThingProperty.m_stSpecThingProperty.m_stDiamondProcessInfo.m_uiProcess);

            }
        }

        this.updateMaterialData();
    }
    /**宝石升级成功调用 */
    onDiamondUpSuccess(): void {
        this.isCheckEffect = true;
        G.AudioMgr.playStarBombSucessSound();
        this.materialVoArr.length = 0;
        this.updateUpLevelPanel();

    }

    private updateMaterialData(): void {
        this._matercialCount = 0;
        let addVal: number = 0;
        for (let i: number = 0; i < EnumEquipRule.DIAMOND_UP_MATERIAL_MAX_COUNT; i++) {
            let itemVo: DiamondUpMaterialItemData = this.materialListData[i];
            if (i < this.materialVoArr.length) {
                let materialPos: number = this.materialVoArr[i];
                let upItemData: DiamondUpItemData = this.getUpItemData(materialPos);
                let thingVo: ThingItemData = upItemData ? upItemData.thingVo : null;
                itemVo.thingVo = thingVo;
                if (thingVo) {
                    addVal += EnumEquipRule.getDiamondUpAllExp(thingVo);
                    this._matercialCount++;
                }
            }
            else {
                itemVo.thingVo = null;
            }


            let item = this.costList.GetItem(i);
            let iconRoot = this.costList.GetItem(i).findObject("icon");
            let txtValue = this.costList.GetItem(i).findText("txtValue");
            if (this.fixedIconItems[i] == null) {
                let iconItem = new IconItem();
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, iconRoot);
                iconItem.showBg = false;
                this.fixedIconItems.push(iconItem);
                this.txtFixedValues.push(txtValue);
            }
            if (itemVo.thingVo == null) {
                this.fixedIconItems[i].updateByThingItemData(itemVo.thingVo);
                this.txtFixedValues[i].text = "";
            } else {
                this.fixedIconItems[i].updateById(itemVo.thingVo.config.m_iID, 1);
                let gemCfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(itemVo.thingVo.config.m_iID);
                this.txtFixedValues[i].text = "+ " + (gemCfg.m_uiProp1process + itemVo.thingVo.data.m_stThingProperty.m_stSpecThingProperty.m_stDiamondProcessInfo.m_uiProcess);
            }

            this.fixedIconItems[i].updateIcon();

        }

        this.btnLvUp.SetActive(this._matercialCount != 0);

        if (this._maxVal <= 0) {
            this.fill1.fillAmount = 1;
            this.txtCurProgress.text = "已满级";
            this.btnULTipMark.SetActive(false);
        } else {
            let value = (this._crtVal + addVal) / this._maxVal;
            if (this._gemId > 0) {
                if (this._crtVal + addVal >= this._maxVal) {
                    this.onUpLevelListClose();
                }
            }
            this.fill1.fillAmount = value;
            this.txtCurProgress.text = uts.format('{0}/{1}', this._crtVal + addVal, this._maxVal);
        }
    }

    get materialListData(): DiamondUpMaterialItemData[] {
        if (!this._materialListData) {
            this._materialListData = new Array<DiamondUpMaterialItemData>();
            for (let i: number = 0; i < EnumEquipRule.DIAMOND_UP_MATERIAL_MAX_COUNT; i++) {
                let itemVo: DiamondUpMaterialItemData = new DiamondUpMaterialItemData();
                this._materialListData.push(itemVo);
            }
        }
        return this._materialListData;
    }


    /**一键填充*/
    private onBtnPut(): void {
        let i: number = 0
        let needCount: number = EnumEquipRule.DIAMOND_UP_MATERIAL_MAX_COUNT - this._matercialCount;
        //if (this.materialVoArr.length == 0) {
        //    G.TipMgr.addMainFloatTip("背包中没有同类的魔石");
        //}
        if (needCount <= 0) {
            //G.TipMgr.addMainFloatTip("镶嵌槽内宝石已满，不能在添加了");
            return;
        }

        let len: number = this.upListData.length;
        for (let j: number = 0; j < len; j++) {
            let itemVo: DiamondUpItemData = this.upListData[j];
            if (needCount == 0) {
                break;
            }
            if (itemVo && itemVo.thingVo) {
                if (itemVo.num) {
                    let isPush: boolean = false;
                    let pushCount: number = Math.min(itemVo.num, needCount);
                    for (let k: number = 0; k < pushCount; k++) {
                        isPush = false;
                        if (needCount == 0) {
                            break;
                        }
                        for (i = 0; i < this.materialVoArr.length; i++) {
                            if (this.materialVoArr[i] < 0) {
                                this.materialVoArr[i] = itemVo.thingVo.data.m_usPosition;
                                isPush = true;
                                needCount--;
                                break;
                            }
                        }
                        if (this._gemId > 0) {//这个判断证明选中宝石数据正常
                            if (this._gemLevel + 1 >= Macros.MAX_DIAMOND_UPLEVEL_LIMIT) {//再升一级就满级了
                                let addVal: number = 0;
                                //下面的操作时要保护让用户升宝石到满级时不多消耗宝石
                                for (let i: number = 0; i < EnumEquipRule.DIAMOND_UP_MATERIAL_MAX_COUNT; i++) {
                                    if (i < this.materialVoArr.length) {
                                        let materialPos: number = this.materialVoArr[i];
                                        let upItemData: DiamondUpItemData = this.getUpItemData(materialPos);
                                        let thingVo: ThingItemData = upItemData ? upItemData.thingVo : null;
                                        if (thingVo) {
                                            addVal += EnumEquipRule.getDiamondUpAllExp(thingVo);
                                        }
                                    }
                                }
                                if (this._crtVal + addVal >= this._maxVal) {
                                    break;
                                }
                            }
                        }
                        if (!isPush) {
                            this.materialVoArr.push(itemVo.thingVo.data.m_usPosition);
                            needCount--;
                        }

                    }
                }
            }
        }

        this.updateUpLevelPanel();
    }

    /**获取宝石列表数据*/
    private getUpItemData(materialPos: number): DiamondUpItemData {
        return this.upListDic[materialPos];
    }
    /**获取宝石类型*/
    private getGameType(id: number): number {
        return Math.floor(id / 1000);
    }

    /**获取宝石等级*/
    private getGameLevel(id: number): number {
        return (Math.floor(id / 10)) % 100;
    }

    /**
    * 卸下按钮
    */
    private onBtnTakeOff() {
        EquipUtils.diamondPullout(this.m_diamondDataList[this.selectDiamondSlot]);
    }

    /**
     * 镶嵌按钮点击
     * @param index
     */
    private onItemClick(index: number): void {
        if (this.showDiamonList[index] != null) {
            let diamond: ThingItemData = this.showDiamonList[index];
            let selectEquip = this.m_selectedEquipData;
            if (diamond != null && selectEquip.config != null) {
                this.materialVoArr = [];
                EquipUtils.diamondPullout(this.m_diamondDataList[this.selectDiamondSlot]);
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDiamondInsertRequest(selectEquip.containerID,
                    selectEquip.data.m_usPosition,
                    this.m_diamondDataList[this.selectDiamondSlot].slot,
                    diamond.config.m_iID, diamond.data.m_usPosition));
            }
        }
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(366), '魔石规则');
    }

    /**
     * 点击中间的装备宝石孔
     * @param index
     */
    private onClickInsert(index: number) {
        if (this.m_selectedEquipData == null) return;
        this.materialVoArr = [];
        let diamondID: number = this.m_diamondDataList[index].id;
        let isLock: boolean = this.m_diamondDataList[index].isLock;
        this.selectDiamondSlot = index;
        let data = this.m_diamondDataList[index];
        //可镶嵌或可替换
        this.btnXQTipMark.SetActive(data.canInsertOrReplace);
        //可升级
        this.btnULTipMark.SetActive(data.canLvUp);

        if (this.isXiangQian) {//镶嵌
            this.OnBtnXiangQianClick();
        } else {//升级
            this.onBtnUpLevelClick();
        }
    }

    /**取消升级宝石*/
    private onClickCostListItem(index: number): void {
        if (this.materialVoArr[index] >= 0) {
            this.materialVoArr[index] = -1;
            this.updateUpLevelPanel();
        } else {
            this.onUpLevelListOpen();
        }
    }

    protected onClickEquipList(index: number) {
        //切换装备，全部隐藏箭头
        for (let i = 0; i < this.iconArrows.length; i++) {
            this.iconArrows[i].SetActive(false);
        }

        if (this.equipList.Count > 0) {
            this.selectEquipList(index);
        }
    }

    public selectEquipLastItem() {
        this.selectEquipList(this.currIndex);
    }

    public selectEquipList(index: number) {
        if (this.equipList.Count > 0) {

            this.m_selectedEquipData = this.EquipItemDatas[index];
            this._onSelectEquip();

            if (this.currIndex != index) {
                this.diamondList.Selected = 0;
                this.onClickInsert(0);
            } else {
                this.diamondList.Selected = this.selectDiamondSlot;
                this.onClickInsert(this.selectDiamondSlot);
            }
            this.currIndex = index;
        }
    }

    public updateEquipList(ctnType: number, ctnSize: number) {
        //更新可选升级装备列表
        let rawDatas = G.DataMgr.thingData.getContainer(ctnType);
        let minLevel: number = 0;
        this.EquipItemDatas.length = 0;
        let rawObj: ThingItemData;
        let diamondNums: number[] = new Array<number>(EquipStrengthenData.MAX_DIAMOND_LEVEL + 1);
        let diamondID: number = 0;
        for (let i = 0; i < ctnSize; i++) {
            rawObj = rawDatas[i];
            this.EquipItemDatas.push(rawObj);
            if (null != rawObj && null != rawObj.data) {
                //把各个等级的宝石数目记下来
                for (let j: number = 0; j < this.DIAMOND_NUM; j++) {
                    let m_stSpecThingProperty = rawObj.data.m_stThingProperty.m_stSpecThingProperty
                    if (m_stSpecThingProperty && m_stSpecThingProperty.m_stEquipInfo) {
                        diamondID = m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[j];
                        diamondNums[EquipStrengthenData.getEquipLevel(rawObj.config.m_iEquipPart)]++;
                    }
                }
            }
        }

        //算一下哪个等级的宝石达到了全身数
        let cnt: number = 0;
        for (let i = EquipStrengthenData.MAX_DIAMOND_LEVEL; i > 0; i--) {
            if (diamondNums[i] >= EquipStrengthenData.BODY_DIAMOND_NUM) {
                minLevel = i;
                break;
            }
            diamondNums[i - 1] += diamondNums[i];
        }

        //装备列表一个ITEM显示
        let itemCount: number = this.EquipItemDatas.length;
        for (let i = 0; i < ctnSize; i++) {
            this.insertEquipItems[i].update(this.EquipItemDatas[i]);
        }

        this.m_selectedEquipData = this.EquipItemDatas[this.currIndex];

        this._onSelectEquip();

        if (this.currIndex != this.equipList.Selected) {
            this.onClickInsert(0);
            this.diamondList.Selected = 0;
        } else {
            this.onClickInsert(this.selectDiamondSlot);
            this.diamondList.Selected = this.selectDiamondSlot;
        }
        let num: number = 0;
        let txtzNum: number = G.DataMgr.thingData.getEquipSuitsCount(KeyWord.COLOR_RED);
        if (txtzNum >= EnumEquipRule.EQUIP_ENHANCE_COUNT) {
            this.txtTianXiaTao.transform.parent.gameObject.SetActive(true);
            txtzNum = G.DataMgr.thingData.getEquipSuitsCount(KeyWord.COLOR_PINK);
            this.txtTianXiaTao.text = num.toString();
        }
        else {
            this.txtTianXiaTao.transform.parent.gameObject.SetActive(false);
        }
    }

    _onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);
        }
        if (id == Macros.CONTAINER_TYPE_ROLE_EQUIP || id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateUpLevelPanel();
        }
    }

    private _onSelectEquip(): void {
        //没有选中的装备显示
        if (this.m_selectedEquipData == null) {
            this.txtZDL.text = "0";
            this.txtTianXiaTao.text = "0"
            //this.equipIconItem.updateByThingItemData(null);
            //this.equipIconItem.updateIcon();
            for (let i = 0; i < this.DIAMOND_NUM; i++) {
                this.lockImgs[i].SetActive(true);
                this.iconArrows[i].SetActive(false);
                this.bigAddUIEffects[i].SetActive(false);
                this.insertIconItems[i].updateByThingItemData(null);
                this.insertIconItems[i].showBg = false;
                this.insertIconItems[i].updateIcon();
                this.defaultIcons[i].gameObject.SetActive(false);
            }
            return;
        }
        //this.equipIconItem.updateByThingItemData(this.m_selectedEquipData);
        //this.equipIconItem.updateIcon();
        this.equipIcon.sprite = this.iconAtlas.Get("Magic_" + (this.equipList.Selected + 1));
        let fight: number = 0;
        let cfg: GameConfig.DiamondPropM;

        if (this.m_selectedEquipData.data != null) {
            let color: number = this.m_selectedEquipData.config.m_ucColor;
            let part: number = this.m_selectedEquipData.config.m_iEquipPart;
            let equipPos = EquipUtils.getEquipIdxByPart(part);

            //1个装备孔的处理
            for (let i: number = 0; i < this.DIAMOND_NUM; i++) {
                this.m_diamondDataList[i].equipPart = part;
                this.m_diamondDataList[i].containerID = this.m_selectedEquipData.containerID;
                this.m_diamondDataList[i].pos = this.m_selectedEquipData.data.m_usPosition;
                this.m_diamondDataList[i].id = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
                this.m_diamondDataList[i].isLock = G.DataMgr.hunliData.level < EquipUtils.SLOT_OPEN_LEVEL[i] && (this.m_diamondDataList[i].id == 0);
                this.m_diamondDataList[i].openLevel = EquipUtils.SLOT_OPEN_LEVEL[i];
                this.m_diamondDataList[i].index = i;
                this.m_diamondDataList[i].equipID = this.m_selectedEquipData.config.m_iID;
                this.m_diamondDataList[i].process = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondIDProcess[i];

                this.lockImgs[i].gameObject.SetActive(true);
                this.lockImgs[i].gameObject.SetActive(this.m_diamondDataList[i].isLock);
                if (G.DataMgr.hunliData.level >= EquipUtils.SLOT_OPEN_LEVEL[i]) {
                    this.txtLimit[i].text = "";
                } else {
                    this.txtLimit[i].text = uts.format("{0} 可镶嵌", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, EquipUtils.SLOT_OPEN_LEVEL[i]));
                }
              
                //一个孔可以镶嵌或者替换
                let oneSlotCanInsert = G.DataMgr.equipStrengthenData.oneSlotCanInsert(this.m_selectedEquipData, i, true);
                //空孔，可以镶嵌
                let canInsert = oneSlotCanInsert && !this.m_diamondDataList[i].isLock && (this.m_diamondDataList[i].id <= 0);
                //镶嵌了，有可以替换的
                let canReplace = oneSlotCanInsert && !this.m_diamondDataList[i].isLock && (this.m_diamondDataList[i].id > 0);
                this.m_diamondDataList[i].canInsertOrReplace = canInsert || canReplace;
                //可以升级
                let canLvUp = G.DataMgr.thingData.isOneDaimondCanLvUp(this.m_diamondDataList[i].id, this.m_selectedEquipData);
                this.m_diamondDataList[i].canLvUp = canLvUp;
                this.iconArrows[i].SetActive(canReplace || canLvUp);
                this.bigAddUIEffects[i].SetActive(canInsert);

                this.insertIconItems[i].updateById(this.m_diamondDataList[i].id);
                this.insertIconItems[i].showBg = false;
                this.insertIconItems[i].needColor = false
                this.insertIconItems[i].updateIcon();
                this.insertIconItems[i].showLock = false;
                this.defaultIcons[i].gameObject.SetActive(false);
                let diamondID: number = this.m_diamondDataList[i].id;
                if (diamondID > 0) {
                    this.fillBgs[i].SetActive(true);
                    //宝石等级
                    let lv = EquipUtils.getDiamondLevel(this.m_diamondDataList[i].id);
                    this.m_diamondDataList[i].level = lv;

                    let maxVal: number = 0;
                    let nextGemCfg: GameConfig.ThingConfigM = ThingData.getThingConfigMayNull(diamondID + 10);
                    if (nextGemCfg) {
                        maxVal = EnumEquipRule.getDiamondMaxExp(diamondID);
                    }
                    if (maxVal <= 0) {
                        this.btnXQTipMark.SetActive(false);
                        this.btnULTipMark.SetActive(false);
                        this.iconArrows[i].SetActive(false);
                        this.fills[i].fillAmount = 1;
                    } else {
                        this.fills[i].fillAmount = this.m_diamondDataList[i].process / maxVal;
                    }

                } else {
                    this.fills[i].fillAmount = 0;
                    this.fillBgs[i].SetActive(false);
                    if (!this.m_diamondDataList[i].isLock) {
                        this.defaultIcons[i].gameObject.SetActive(true);
                        let showId = this.diamondType[G.DataMgr.equipStrengthenData.getEquipDiamondMount(part).m_ucPropId[i]];
                        let iconId = ThingData.getThingConfig(showId).m_szIconID;
                        G.ResourceMgr.loadIcon(this.defaultIcons[i], uts.format("{0}", iconId));
                    }

                }

                //计算战斗力
                if (this.m_diamondDataList[i].id > 0) {
                    cfg = G.DataMgr.equipStrengthenData.getDiamondConfig(this.m_diamondDataList[i].id);
                    fight += FightingStrengthUtil.calStrengthByOneProp(cfg.m_ucPropId, cfg.m_iPropValue);
                }
            }
        }
        //let tipData = this.equipIconItem.getTipData() as ItemTipData;
        this.txtZDL.text = "战斗力" + fight;
        if (this.equipView != null) {
            //总战力
            this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        }
    }

    /**
     * 获取属性列表ITEM数据
     * @param	m_ucPropId
     * @return
     */
    private getEquipEnhanceAttItemData(m_ucPropId: number): GameConfig.EquipPropAtt {
        let equipEnhanceAttItemData: GameConfig.EquipPropAtt = this._allAttDic[m_ucPropId] as GameConfig.EquipPropAtt;
        if (!equipEnhanceAttItemData && m_ucPropId > 0) {
            equipEnhanceAttItemData = {} as GameConfig.EquipPropAtt;
            equipEnhanceAttItemData.m_ucPropId = m_ucPropId;
            this.allAttData.push(equipEnhanceAttItemData);
            this._allAttDic[m_ucPropId] = equipEnhanceAttItemData;
        }
        return this._allAttDic[m_ucPropId];
    }

    /**
     * 设置属性列表ITEM数据
     * @param	m_ucPropId
     * @return
     */
    private setEquipEnhanceAttItemData(attData1: GameConfig.EquipPropAtt): void {
        this._allAttDic[attData1.m_ucPropId] = attData1;
        this.allAttData.push(attData1);
    }

    get allAttData(): GameConfig.EquipPropAtt[] {
        if (!this._allAttData) {
            this._allAttData = new Array<GameConfig.EquipPropAtt>();
        }
        return this._allAttData;
    }

    private closeTitleFighting() {
        let hunliview = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (hunliview != null && hunliview.isOpened) {
            hunliview.setFightActive(false);
        }
    }

}
