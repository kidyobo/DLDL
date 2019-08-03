import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { Global as G } from 'System/global';
import { TipFrom } from 'System/tip/view/TipsView';
import { FixedList } from 'System/uilib/FixedList';
import { IconItem } from 'System/uilib/IconItem';
import { DataFormatter } from 'System/utils/DataFormatter';
import { UIUtils } from 'System/utils/UIUtils';
import { ThingItemData } from '../data/thing/ThingItemData';
import { CircleIconType, IconModelItem } from '../ItemPanels/IconModelItem';
import { TitleItemStarNode } from '../ItemPanels/TitleItemNode';
import { Macros } from '../protocol/Macros';
import { ProtocolUtil } from '../protocol/ProtocolUtil';
import { List } from '../uilib/List';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { ElemFinder } from '../uilib/UiUtility';
import { FightingStrengthUtil } from '../utils/FightingStrengthUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';

/**
 * 魂骨升级
 */
export class HunGuShengJiPanel extends TabSubFormCommon {
    static readonly MaxLevel = 10;
    private rightNode: UnityEngine.GameObject;

    /**九个魂骨 */
    private equipList: FixedList;
    /**右侧节点标题 （名字+战斗力） */
    private itemNodeTitle: TitleItemStarNode;
    /**右侧节点上边的属性节点 */
    private curProplist: List;
    private nextProplist: List;

    /**材料图标 */
    private materialIconRoot: UnityEngine.GameObject = null;
    private txtMaterialHas: UnityEngine.UI.Text;
    private txtMaterialNeed: UnityEngine.UI.Text;
    private materialIconRoot1: UnityEngine.GameObject = null;
    private txtMaterialHas1: UnityEngine.UI.Text;
    private txtMaterialNeed1: UnityEngine.UI.Text;
    private materialItem: IconItem;
    private materialItem1: IconItem;
    private materialData: MaterialItemData = null;
    private materialData1: MaterialItemData = null;

    private isMaxLvGo: UnityEngine.GameObject = null;
    private txtTips: UnityEngine.UI.Text;
    private notMaxLvGo: UnityEngine.GameObject = null;

    private txtCurLevel: UnityEngine.UI.Text;
    private txtNextLevel: UnityEngine.UI.Text;

    /**升级按钮*/
    private btnShengJi: UnityEngine.GameObject;

    /**自动升级*/
    private btnAutoShengJi: UnityEngine.GameObject;

    private iconModelItems: IconModelItem[] = [];
    private txtLvArr: UnityEngine.UI.Text[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Model: UnityEngine.GameObject;

    /** 当前选中的那一件 */
    private m_selectedHuGuData: ThingItemData;
    private curSelected: number = -1;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP);
    }

    protected resPath(): string {
        return UIPathData.HunGuShengJiPanel;
    }

    protected initElements() {
        super.initElements();
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");
        this.rightNode = this.elems.getElement("rightNode");

        this.equipList = this.elems.getUIFixedList("equipList");

        this.itemNodeTitle = new TitleItemStarNode();
        this.itemNodeTitle.setComponents(this.elems.getElement("nodeTitleItem"));

        this.curProplist = this.elems.getUIList("curProplist");
        this.nextProplist = this.elems.getUIList("nextProplist");

        this.materialIconRoot = this.elems.getElement("materialIconRoot");
        this.txtMaterialHas = this.elems.getText("txtMaterialHas");
        this.txtMaterialNeed = this.elems.getText("txtMateralNeed");
        this.materialIconRoot1 = this.elems.getElement("materialIconRoot1");
        this.txtMaterialHas1 = this.elems.getText("txtMaterialHas1");
        this.txtMaterialNeed1 = this.elems.getText("txtMateralNeed1");

        this.isMaxLvGo = this.elems.getElement("isMaxLvGo");
        this.txtTips = ElemFinder.findText(this.isMaxLvGo, "Text");
        this.notMaxLvGo = this.elems.getElement("notMaxLvGo");

        this.txtCurLevel = this.elems.getText("txtCurLevel");
        this.txtNextLevel = this.elems.getText("txtNextLevel");

        this.materialItem = new IconItem();
        this.materialItem.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIconRoot);
        this.materialItem.setTipFrom(TipFrom.normal);
        if (this.materialData == null) {
            this.materialData = new MaterialItemData();
        }
        this.materialItem1 = new IconItem();
        this.materialItem1.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIconRoot1);
        this.materialItem1.setTipFrom(TipFrom.normal);
        if (this.materialData1 == null) {
            this.materialData1 = new MaterialItemData();
        }

        this.btnShengJi = this.elems.getElement("btnShengJi");
        this.btnAutoShengJi = this.elems.getElement("btnAutoShengJi");

        let count = this.equipList.Count;
        this.iconModelItems = [];
        this.txtLvArr = [];
        for (let i = 0; i < count; i++) {
            let item = new IconModelItem();
            let goitem = this.equipList.GetItem(i).gameObject;
            let icon = ElemFinder.findObject(goitem, "icon");
            let txtLv = ElemFinder.findText(goitem, "txtLv");
            this.txtLvArr.push(txtLv);
            // item.setComponents(goitem);
            item.setIconByPrefab(this.itemIcon_Model, icon)
            item.setIconType(CircleIconType.HunGuSJ);
            item.selectedClose();
            this.iconModelItems.push(item);
        }
    }

    protected initListeners() {
        super.initListeners();
        this.addListClickListener(this.equipList, delegate(this, this.onClickFixedList));
        this.addClickListener(this.btnShengJi, this.onClickShengJi);
        this.addClickListener(this.btnAutoShengJi, this.onClickAutoShengJi);
    }

    protected onOpen() {
        super.onOpen();
        this.setDefaultSeletend();
        this.updatePanel();
    }

    protected onClose() {
        for (let i = 0, con = this.equipList.Count; i < con; i++) {
            this.iconModelItems[i].stopButtonEffect();
        }
    }

    private updatePanel() {
        //刷新左侧装备
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let hunliData = G.DataMgr.hunliData;
        this.updateEquipIcon(equipDatas);

        //刷新右侧属性
        if (this.curSelected == -1) {
            //没有装备魂骨 右侧面板关闭
            this.rightNode.SetActive(false);
            return;
        }
        this.m_selectedHuGuData = equipDatas[this.curSelected];
        if (this.m_selectedHuGuData != null) {
            this.rightNode.SetActive(true);
            //let drop = this.m_selectedHuGuData.config.m_iDropLevel;
            let part = this.m_selectedHuGuData.config.m_iEquipPart;
            let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(this.curSelected);
            //设置选中态
            this.uptateEquipIconSelected(this.curSelected);

            this.updateTitleAndStars(this.m_selectedHuGuData, lv);
            let cfg: GameConfig.HunGuSlotUpLvM;
            cfg = hunliData.getHunGuEquipSlotConfigByPartAndLv(part, lv == 0 ? 1 : lv);
            this.updateBaseAttribute(cfg.m_astPropAtt, lv == 0 ? true : false);
            this.txtCurLevel.text = "当前等级: " + (lv == 0 ? 0 : cfg.m_usLevel);
            if (G.DataMgr.heroData.level <= cfg.m_usLevel) {
                if (!this.isMaxLvGo.activeInHierarchy)
                    this.isMaxLvGo.SetActive(true);
                if (this.notMaxLvGo.activeInHierarchy)
                    this.notMaxLvGo.SetActive(false);
                this.txtTips.text = "魂骨等级不能超过角色等级";
                if (cfg.m_usLevel == 500) {
                    this.txtTips.text = "该魂骨已升到满级";
                }
            } else {
                if (cfg) {
                    //uts.log("kingsly 配置:" + JSON.stringify(cfg));
                    let dropLevel = this.m_selectedHuGuData.config.m_iDropLevel;
                    if (dropLevel > hunliData.HUNGU_SJ_MAXDROPLEVEL) dropLevel = hunliData.HUNGU_SJ_MAXDROPLEVEL;
                    cfg = hunliData.getHunGuEquipSlotConfigByPartAndDropLevel(part, dropLevel);
                    if (lv < 499 && lv >= cfg.m_iOneKeyMaxLv - 1) {
                        if (!this.isMaxLvGo.activeInHierarchy)
                            this.isMaxLvGo.SetActive(true);
                        if (this.notMaxLvGo.activeInHierarchy)
                            this.notMaxLvGo.SetActive(false);
                        cfg = G.DataMgr.hunliData.getHunGuEquipSlotConfigByPartAndLv(part, lv + 1);
                        //uts.log("kingsly 等级：" + lv);
                        //uts.log("kingsly 表格配置:" + JSON.stringify(cfg));
                        if (cfg) {
                            this.txtTips.text = "穿戴" + KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, cfg.m_ucLimitDropLevel) + "才能继续升级";
                        }
                    } else {
                        //当前档次的装备没有到达表格配的最大等级限制
                        if (this.isMaxLvGo.activeInHierarchy)
                            this.isMaxLvGo.SetActive(false);
                        if (!this.notMaxLvGo.activeInHierarchy)
                            this.notMaxLvGo.SetActive(true);
                        cfg = hunliData.getHunGuEquipSlotConfigByPartAndLv(part, lv + 1);
                        if (cfg) {
                            this.txtNextLevel.text = "下一等级: " + cfg.m_usLevel;
                            this.updateNextAttribute(cfg.m_astPropAtt);
                            //刷新材料
                            this.updateMaterals(cfg);
                        } else {//升级到满级
                            if (this.isMaxLvGo.activeInHierarchy)
                                this.isMaxLvGo.SetActive(true);
                            if (!this.notMaxLvGo.activeInHierarchy)
                                this.notMaxLvGo.SetActive(false);
                            this.txtTips.text = "该魂骨已升到满级";
                        }
                        if (this.notMaxLvGo.activeInHierarchy) {
                            UIUtils.setButtonClickAble(this.btnShengJi, hunliData.isOnceHunguSJ(part));
                            UIUtils.setButtonClickAble(this.btnAutoShengJi, hunliData.isHunguSJPanelMark());
                        }
                    }
                }
            }
        }
        this.setTitleFight(this.calculateAllFight());
        //this.setTitleFight();
    }

    /**更新魂骨选择 和 更新面板 */
    UpdateListSelectAndPanel() {
        this.setDefaultSeletend();
        this.updatePanel();
    }

    private onClickFixedList(index: number) {
        this.curSelected = index;
        this.updatePanel();
        this.iconModelItems[index].playButtonEffect(this.sortingOrder);
    }
    /**
     * 点击升级按钮
     */
    private onClickShengJi() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguFZRequest(this.curSelected, Macros.EQUIP_HUNGU_SLOT_UPLEVEL));
    }
    /**点击一键升级 */
    private onClickAutoShengJi() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguFZRequest(this.curSelected, Macros.EQUIP_HUNGU_SLOT_ONE_UPLV));
    }
    private setDefaultSeletend() {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let count = this.equipList.Count;
        let minlv = 999;
        for (let i = 0; i < count; i++) {
            let data = equipDatas[i];
            if (data == null) continue;
            let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(i);
            if (minlv > lv) {
                minlv = lv;
                this.curSelected = i;
            }
        }

        // let lvArr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        // let count = this.equipList.Count;
        // let isSelected: boolean = false;
        // for (let i = 0; i < count; i++) {
        //     if (equipDatas[i] == null) {
        //         //因为要取数组最小值,所以当没有装备时,放一个大一点的值,取最小值时,就不会取到
        //         lvArr[i] = 10000;
        //     }
        //     else {
        //         lvArr[i] = G.DataMgr.equipStrengthenData.getSlotRegineLv(i);
        //         if (lvArr[i] == 0) {
        //             this.curSelected = i;
        //             isSelected = true;
        //             break;
        //         } 
        //     }
        // }
        // if (!isSelected) {
        //     this.curSelected = this.getMinIndexInArrary(lvArr);
        // }

    }

    // private getMinIndexInArrary(array: number[]): number {
    //     if (array && array.length > 0) {
    //         let value: number = 0;
    //         let hasValue: boolean = false;
    //         let length = array.length;
    //         for (let i = 0; i < length;i++)
    //         {
    //             if (hasValue) {
    //                 if (array[i] < value) value = array[i];
    //             }
    //             else {
    //                 value = array[i];
    //                 hasValue = true;
    //             }
    //         }
    //         if (hasValue) {
    //             return array.indexOf(value)
    //         } 
    //     }

    //     return -1;
    // }

    /**
     * 设置装备选中态
     * @param drop 
     */
    private uptateEquipIconSelected(index: number) {

        let countMax = this.equipList.Count;
        for (let i = 0; i < countMax; i++) {
            this.iconModelItems[i].selectedClose();
        }
        this.iconModelItems[index].selectedOpen();
    }

    /**刷新图标显示 */
    private updateEquipIcon(equipDatas: { [position: number]: ThingItemData }) {

        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            let itemdata: ThingItemData = equipDatas[i];
            let bgicon = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "map");
            bgicon.SetActive(itemdata == null);
            if (itemdata == null) {
                this.iconModelItems[i].setIconModelNull();
            }
            else {
                this.iconModelItems[i].setHunguEquipIcon(itemdata);
                let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(i);
                this.txtLvArr[i].text = "Lv: " + lv;
            }
            this.iconModelItems[i].updateIconShow();
        }
    }

    private calculateFight(data: GameConfig.HunGuSlotUpLvM): number {
        let fight = 0;
        if (data) {
            let att: GameConfig.EquipPropAtt[] = [];
            let count = data.m_astPropAtt.length;
            for (let i = 0; i < count; i++) {
                let item = {
                    "m_ucPropId": data.m_astPropAtt[i].m_ucPropId,
                    "m_ucPropValue": data.m_astPropAtt[i].m_ucPropValue
                }
                att.push(item);
            }
            fight = FightingStrengthUtil.calStrength(att);
        }
        return fight;
    }

    /**
     * 刷新标题和星星
     * @param equipData 
     */
    private updateTitleAndStars(equipData: ThingItemData, lv: number) {
        this.itemNodeTitle.setTitleName(equipData.config.m_szName);
        //战斗力 
        let data = G.DataMgr.hunliData.getHunGuEquipSlotConfigByPartAndLv(equipData.config.m_iEquipPart, lv);

        this.itemNodeTitle.setFighting(this.calculateFight(data));

        let level = equipData.config.m_ucStage;
        this.itemNodeTitle.setStarNumber(level);
    }

    /**刷新当前属性 */
    private updateBaseAttribute(propArr: GameConfig.EquipPropAtt[], isnotLevel = false) {
        let count = propArr.length;
        this.curProplist.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.curProplist.GetItem(i);
            let txtName = item.findText("txtName");
            let txtValue = item.findText("txtValue");
            txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propArr[i].m_ucPropId);
            txtValue.text = (isnotLevel ? 0 : propArr[i].m_ucPropValue).toString();
        }
    }
    /** 刷新下一级属性*/
    private updateNextAttribute(propArr: GameConfig.EquipPropAtt[]) {
        let count = propArr.length;
        this.nextProplist.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.nextProplist.GetItem(i);
            let txtName = item.findText("txtName");
            let txtValue = item.findText("txtValue");
            txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propArr[i].m_ucPropId);
            txtValue.text = (propArr[i].m_ucPropValue).toString();
        }
    }

    /**刷新材料属性 */
    private updateMaterals(cfg: GameConfig.HunGuSlotUpLvM) {
        this.materialData.id = cfg.m_astCost[0].m_iItemID;
        this.materialData.need = cfg.m_astCost[0].m_iNumber;
        this.materialData.has = G.DataMgr.heroData.tongqian;
        this.materialItem.updateById(this.materialData.id);
        this.materialItem.updateIcon();
        let str = "";
        if (this.materialData.has >= this.materialData.need) {
            str = uts.format("现有: {0}", DataFormatter.formatNumber(this.materialData.has, 10000, false));
        } else {
            str = uts.format("现有: {0}", TextFieldUtil.getColorText(DataFormatter.formatNumber(this.materialData.has, 10000, false), "FF0000FF"));
        }
        this.txtMaterialHas.text = str;
        this.txtMaterialNeed.text = "消耗: " + this.materialData.need;

        this.materialData1.id = cfg.m_astCost[1].m_iItemID;
        this.materialData1.need = cfg.m_astCost[1].m_iNumber;
        this.materialData1.has = G.DataMgr.thingData.getThingNum(this.materialData1.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.materialItem1.updateById(this.materialData1.id);
        this.materialItem1.updateIcon();

        if (this.materialData1.has >= this.materialData1.need) {
            str = uts.format("现有: {0}", this.materialData1.has);
        } else {
            str = uts.format("现有: {0}", TextFieldUtil.getColorText(this.materialData1.has + "", "FF0000FF"));
        }
        this.txtMaterialHas1.text = str;
        this.txtMaterialNeed1.text = "消耗: " + this.materialData1.need;
    }

    /**
     * 计算总战力
     */
    private calculateAllFight(): number {
        let hunliData = G.DataMgr.hunliData;
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let fight = 0;
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let data = equipDatas[i];
            if (data == null) continue;
            let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(i);
            let cfg = hunliData.getHunGuEquipSlotConfigByPartAndLv(data.config.m_iEquipPart, lv);
            if (cfg == null) continue;
            fight += this.calculateFight(cfg);
        }
        return fight;
    }

    //private setTitleFight() {
    //    let hunliview = G.Uimgr.getForm<HunLiView>(HunLiView);
    //    if (hunliview != null && hunliview.isOpened) {
    //        let val = this.calculateAllFight();
    //        hunliview.openTitleFight();
    //        hunliview.setTitleFight(val);
    //    }
    //}
}