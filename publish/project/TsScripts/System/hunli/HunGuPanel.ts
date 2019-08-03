import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { HunguSelectView } from 'System/hunli/HunguSelectView';
import { Macros } from 'System/protocol/Macros';
import { FixedList } from 'System/uilib/FixedList';
import { ElemFinder } from 'System/uilib/UiUtility';
import { PropertyListNode } from '../ItemPanels/PropertyItemNode';
import { CircleIconType, IconModelItem } from '../ItemPanels/IconModelItem';
import { TabSubFormCommon } from '../uilib/TabFormCommom';

export class HunGuPanel extends TabSubFormCommon implements IGuideExecutor {

    private itemiconModelPrefab: UnityEngine.GameObject;

    /**普通基础属性 */
    private normalAttributeNode: PropertyListNode;
    /**外附魂骨属性 */
    private spaceAttributeNode: PropertyListNode;

    /**当前选择索引*/
    private curSelected: number = 0;
    equipList: FixedList;
    private hunguItems: IconModelItem[] = [];
    private equipItemDatas: { [part: number]: ThingItemData };

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGUN);
    }

    protected resPath(): string {
        return UIPathData.HunGuPanel;
    }

    protected initElements() {
        super.initElements();
        this.equipList = this.elems.getUIFixedList("equipList");
        this.itemiconModelPrefab = this.elems.getElement("itemIcon_Model");

        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            if (this.hunguItems[i] == null) {
                let item = new IconModelItem();
                let root = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "icon");
                item.setIconByPrefab(this.itemiconModelPrefab, root);
                item.setIconType(CircleIconType.HunguContainer);
                item.setEquipPart(i + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
                item.selectedClose();
                this.hunguItems.push(item);
            }
        }

        this.normalAttributeNode = new PropertyListNode();
        this.normalAttributeNode.setComponents(this.elems.getElement("normalAttributeNode"));
        this.normalAttributeNode.setTitle("魂骨属性");
        this.spaceAttributeNode = new PropertyListNode();
        this.spaceAttributeNode.setComponents(this.elems.getElement("spaceAttributeNode"));
        this.spaceAttributeNode.setTitle("外附魂骨属性");
    }

    protected initListeners() {
        super.initListeners();
        this.addListClickListener(this.equipList, this.onEquipListClick);
    }

    protected onOpen() {
        super.onOpen();
        this.updatePanel();
        G.GuideMgr.processGuideNext(EnumGuide.HunGuActive, EnumGuide.HunGuActive_ClickAction);
    }

    protected onClose() {
        for (let i = 0, con = this.equipList.Count; i < con; i++) {
            this.hunguItems[i].stopButtonEffect();
        }
    }

    onEquipListClick(index: number) {
        let equipData = this.equipItemDatas[index];
        this.curSelected = index;
        //设置选中效果
        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            this.hunguItems[i].selectedClose();
        }
        this.hunguItems[index].selectedOpen();
        this.hunguItems[index].playButtonEffect(this.sortingOrder);

        G.Uimgr.createForm<HunguSelectView>(HunguSelectView).open(index, equipData, this.id);
    }

    /**设置选中态（没有装备的情况下取消选中） */
    setEquipSelected() {
        let equipData = this.equipItemDatas[this.curSelected];
        if (equipData == null) {
            let count = this.equipList.Count;
            for (let i = 0; i < count; i++) {
                this.hunguItems[i].selectedClose();
            }
        }
    }

    /**刷新界面 */
    updatePanel() {
        //刷图标
        this.updateEquipIcon();
        //刷属性
        this.updateProp();
    }

    /**
     * 背包容器变换
     * @param type
     */
    onContainerChange(type: number) {
        this.updatePanel();
    }

    private updateEquipIcon() {
        this.equipItemDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let hunliData = G.DataMgr.hunliData;

        for (let i = 0; i < hunliData.HUNGU_COUNT; i++) {
            let itemdata = this.equipItemDatas[i];
            let itemObj = this.hunguItems[i];
            let bgicon = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "map");
            bgicon.SetActive(itemdata == null);
            if (itemdata == null) {
                itemObj.setIconModelNull();
            }
            else {
                itemObj.setHunguEquipIcon(itemdata);
            }
            itemObj.updateIconShow();

        }
    }

    private updateProp() {
        let hunliData = G.DataMgr.hunliData;
        let allFight = 0;

        //刷属性
        let normalData = hunliData.getNormalHunguAllPropAndFighting();
        let normalPropCount = normalData[0].length;
        this.normalAttributeNode.clearProperty();
        for (let i = 0; i < normalPropCount; i++) {
            let item = normalData[0][i];
            this.normalAttributeNode.addProperty(item.m_ucPropId, item.m_ucPropValue);
        }
        this.normalAttributeNode.refreshPropertyNode();
        allFight += normalData[1];

        let spaceData = hunliData.getSpaceHunguAllPropAndFighting();
        let spacePropCount = spaceData[0].length;
        this.spaceAttributeNode.clearProperty();
        for (let i = 0; i < spacePropCount; i++) {
            let item = spaceData[0][i];
            this.spaceAttributeNode.addProperty(item.m_ucPropId, item.m_ucPropValue);
        }
        this.spaceAttributeNode.refreshPropertyNode();
        allFight += spaceData[1];

        this.setTitleFight(allFight);
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.WuHunActivate_ClickActivate1 == step) {

            return true;
        } else if (EnumGuide.WuHunActivate_ClickActivate2 == step) {

            return true;
        }
        return false;
    }
}