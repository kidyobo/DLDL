import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { FixedList } from 'System/uilib/FixedList';
import { BatBuyView } from '../business/view/BatBuyView';
import { AutoBuyInfo } from '../data/business/AutoBuyInfo';
import ThingData from '../data/thing/ThingData';
import { ThingItemData } from '../data/thing/ThingItemData';
import { ConsumeMaterialItemOneKey } from '../ItemPanels/ConsumeMaterialItem';
import { CircleIconType, IconModelItem } from '../ItemPanels/IconModelItem';
import { PropertyListNode } from '../ItemPanels/PropertyItemNode';
import { TitleItemStarNode } from '../ItemPanels/TitleItemNode';
import { Macros } from '../protocol/Macros';
import { ProtocolUtil } from '../protocol/ProtocolUtil';
import { GameObjectGetSet } from '../uilib/CommonForm';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { ElemFinder } from '../uilib/UiUtility';
import { Color } from '../utils/ColorUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';


/**
 * 魂骨强化
 */
export class HunguStrengPanel extends TabSubFormCommon {
    private rightNode: UnityEngine.GameObject;

    /**九个魂骨 */
    private equipList: FixedList;
    /**右侧节点标题 （名字+战斗力） */
    private itemNodeTitle: TitleItemStarNode;
    /**右侧节点上边的属性节点 */
    private NodeAttribute: PropertyListNode;
    private NodeStrengAttribute: PropertyListNode;
    /**右侧节点下边的消耗强化 */
    private itemConsumeMaterial: ConsumeMaterialItemOneKey;
    private txtMaxLevel: GameObjectGetSet;
    private toggleAutoBuy: UnityEngine.UI.ActiveToggle;

    private iconModelItems: IconModelItem[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Model: UnityEngine.GameObject;

    private curSelected: number = -1;
    private curEquipCfg: ThingItemData;
    private curStrengCfg: GameConfig.HunGuSlotStrengthenM;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGUN_STRENG);
    }

    protected resPath(): string {
        return UIPathData.HunguStrengPanel;
    }

    protected initElements() {
        super.initElements();
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");
        this.rightNode = this.elems.getElement("rightNode");

        this.equipList = this.elems.getUIFixedList("equipList");

        this.itemNodeTitle = new TitleItemStarNode();
        this.itemNodeTitle.setComponents(this.elems.getElement("nodeTitleItem"));

        this.NodeAttribute = new PropertyListNode();
        this.NodeAttribute.setComponents(this.elems.getElement("attributeListItem"));

        this.NodeStrengAttribute = new PropertyListNode();
        this.NodeStrengAttribute.setComponents(this.elems.getElement("strengAttributeListItem"));

        this.itemConsumeMaterial = new ConsumeMaterialItemOneKey();
        this.itemConsumeMaterial.setComponents(this.elems.getElement("consumeMaterialItem"), this.itemIcon_Normal);

        this.txtMaxLevel = new GameObjectGetSet(this.elems.getElement("txtMaxLevel"));
        this.toggleAutoBuy = this.elems.getActiveToggle("toggleAutoBuy");

        let count = this.equipList.Count;
        this.iconModelItems = [];
        for (let i = 0; i < count; i++) {
            let item = new IconModelItem();
            let goitem = this.equipList.GetItem(i).gameObject;
            let icon = ElemFinder.findObject(goitem, "icon");
            // item.setComponents(goitem);
            item.setIconByPrefab(this.itemIcon_Model, icon)
            item.setIconType(CircleIconType.HunguStreng);
            item.selectedClose();
            this.iconModelItems.push(item);
        }

    }

    protected initListeners() {
        super.initListeners();
        this.itemConsumeMaterial.onClick = delegate(this, this.onClickConsume);
        // this.itemConsumeMaterial.onClickOneKeyAction = delegate(this, this.onClickOneKey);
        this.addListClickListener(this.equipList, delegate(this, this.onClickFixedList))
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
        this.updateEquipIcon(equipDatas);
        //刷新右侧属性
        if (this.curSelected == -1) {
            //没有装备魂骨 右侧面板关闭
            this.rightNode.SetActive(false);
            return;
        }
        this.curEquipCfg = equipDatas[this.curSelected];
        if (this.curEquipCfg != null) {
            this.rightNode.SetActive(true);
            let strengDataCtrl = G.DataMgr.hunliData.hunguStrengeData;
            let curData = strengDataCtrl.getConfigByIndex(this.curSelected);
            let nextData = strengDataCtrl.getConfigByIndex(this.curSelected, true);
            this.curStrengCfg = nextData;

            this.uptateEquipIconSelected(this.curSelected);
            this.updateTitleAndStars(equipDatas[this.curSelected], curData);
            this.updateBaseAttribute(curData);
            this.updateNextAttribute(nextData);
            this.updateMaterals(nextData);
        }
        this.setTitleFight(this.calculateAllFight());
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
     * 点击“强化”
     */
    private onClickConsume() {
        let has = G.DataMgr.thingData.getThingNum(this.curStrengCfg.m_uiConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.consumeForIndex(this.curSelected, has);
    }

    /**点击“一键强化” */
    private onClickOneKey() {
        //找等级最低的
        let strengDataCtrl = G.DataMgr.hunliData.hunguStrengeData;
        let minLevel = strengDataCtrl.getHunguMinLevel();

        //强化材料数量前台限制
        let has = G.DataMgr.thingData.getThingNum(this.curStrengCfg.m_uiConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let id = this.curStrengCfg.m_uiConsumableID;

        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let item = dataList[i];
            if (item == null) continue;

            let lv = strengDataCtrl.getEquipLevelByIndex(i);
            if (minLevel == lv) {
                let cfg = strengDataCtrl.getConfigByIndex(i, true);
                let need = cfg.m_uiConsumableNumber;

                let issucceed = this.consumeForIndex(i, has);
                has -= need;
                if (!issucceed) break;
            }
        }
    }

    private consumeForIndex(index: number, has: number): boolean {
        let hunguData = G.DataMgr.hunliData.hunguStrengeData;
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let strengCfg = hunguData.getConfigByIndex(index, true);
        let equipCfg = equipDatas[index];

        if (equipCfg == null) {
            return false;
        }

        let need = strengCfg.m_uiConsumableNumber;

        if (has >= need) {
            this.sendStreng(index);
            return true;
        }
        else if (this.toggleAutoBuy.isOn) {
            if (hunguData.getEquipLevelByIndex(index) >= hunguData.STRENG_LEVEL_CAHNGE) {
                G.TipMgr.addMainFloatTip("道具不足(此道具不能购买)无法继续强化");
                return false;
            }
            let num: number = need - has;
            let info: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(strengCfg.m_uiConsumableID, num, true);
            if (info.isAffordable) {
                this.sendStreng(index);
                return true;
            }
        }
        else {
            if (hunguData.getEquipLevelByIndex(index) >= hunguData.STRENG_LEVEL_CAHNGE) {
                G.TipMgr.addMainFloatTip("道具不足(此道具不能购买)无法继续强化");
                return false;
            }
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(strengCfg.m_uiConsumableID, 1);
        }
        return false;
    }

    /**设置默认选择 */
    private setDefaultSeletend() {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let count = this.equipList.Count;
        let minlv = 999;
        for (let i = 0; i < count; i++) {
            let data = equipDatas[i];
            if (data == null) continue;
            let lv = G.DataMgr.hunliData.hunguStrengeData.getEquipLevelByIndex(i);
            if (minlv > lv) {
                minlv = lv;
                this.curSelected = i;
            }
        }
    }

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
        //装备id 是否强化
        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            let itemdata = equipDatas[i];
            let bgicon = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "map");
            bgicon.SetActive(itemdata == null);
            if (itemdata == null) {
                this.iconModelItems[i].setIconModelNull();
            }
            else {
                this.iconModelItems[i].setHunguEquipIcon(itemdata);
            }
            this.iconModelItems[i].updateIconShow();
        }
    }

    /**
     * 刷新标题和星星
     * @param equipData 
     */
    private updateTitleAndStars(equipData: ThingItemData, strengData: GameConfig.HunGuSlotStrengthenM) {
        this.itemNodeTitle.setTitleName(equipData.config.m_szName);
        if (strengData == null)
            this.itemNodeTitle.setSubtitle("0级");
        else
            this.itemNodeTitle.setSubtitle(uts.format("{0}级", strengData.m_iID));
        let level = equipData.config.m_ucStage;
        this.itemNodeTitle.setStarNumber(level);
    }

    /**刷新基础属性 */
    private updateBaseAttribute(equipData: GameConfig.HunGuSlotStrengthenM) {
        this.NodeAttribute.clearProperty();
        let count = equipData == null ? 0 : equipData.m_astProp.length;
        for (let i = 0; i < count; i++) {
            let item = equipData.m_astProp[i];
            this.NodeAttribute.addProperty(item.m_ucPropId, item.m_ucPropValue);
        }
        this.NodeAttribute.refreshPropertyNode();
    }

    /**刷新下一级属性 */
    private updateNextAttribute(equipData: GameConfig.HunGuSlotStrengthenM) {
        this.NodeStrengAttribute.clearProperty();
        let count = equipData == null ? 0 : equipData.m_astProp.length;
        for (let i = 0; i < count; i++) {
            let item = equipData.m_astProp[i];
            this.NodeStrengAttribute.addProperty(item.m_ucPropId, item.m_ucPropValue);
        }
        this.NodeStrengAttribute.refreshPropertyNode();
    }

    /**刷新材料属性 */
    private updateMaterals(equipData: GameConfig.HunGuSlotStrengthenM) {
        if (equipData == null) {
            //满级啦
            this.txtMaxLevel.SetActive(true);
            this.itemConsumeMaterial.close();
            this.toggleAutoBuy.gameObject.SetActive(false);
            this.NodeStrengAttribute.hideNode();
        }
        else {
            this.txtMaxLevel.SetActive(false);
            this.itemConsumeMaterial.open();
            this.toggleAutoBuy.gameObject.SetActive(true);
            this.NodeStrengAttribute.showNode();
            //装备位 年份（与星级无关）
            this.itemConsumeMaterial.setTitle(TextFieldUtil.getColorText("强化消耗", Color.YELLOW));
            // this.itemConsumeMaterial.updateIconById(equipData.m_iItemID);
            this.itemConsumeMaterial.updateByMaterialItemData(equipData.m_uiConsumableID, equipData.m_uiConsumableNumber);
            let thingData = ThingData.getThingConfig(equipData.m_uiConsumableID);
            this.itemConsumeMaterial.setIconName(thingData.m_szName);
            let has = G.DataMgr.thingData.getThingNum(equipData.m_uiConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (equipData.m_uiConsumableNumber > has) {
                //数量不够
                //this.itemConsumeMaterial.setButtonGray(true);
                //this.itemConsumeMaterial.setButtonAction(false);
                let str = TextFieldUtil.getColorText(uts.format("强化需要消耗{0}/{1}", has.toString(), equipData.m_uiConsumableNumber.toString()), Color.GREY);
                // this.itemConsumeMaterial.setDescribe("已强化");
                this.itemConsumeMaterial.setDescribe(str);
            }
            else {
                //可以强化
                //this.itemConsumeMaterial.setButtonGray(false);
                //this.itemConsumeMaterial.setButtonAction(true);
            }

            //控制按钮 可以一键就显示 否则关闭
            // let nums = G.DataMgr.hunliData.hunguStrengeData.isHaveCanStreng();
            // this.itemConsumeMaterial.setButtonOneKeyActive(nums)
        }

    }

    /**
     * 计算总战力
     */
    private calculateAllFight(): number {
        return G.DataMgr.hunliData.hunguStrengeData.calHunguStrengFighting();
    }

    private sendStreng(index: number): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguFZRequest(index, Macros.EQUIP_HUNGU_STRENG));
    }
}