import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { GameObjectGetSet } from 'System/uilib/CommonForm';
import { FixedList } from 'System/uilib/FixedList';
import { HunguIntensifyData } from '../data/hunli/HunguIntensifyData';
import ThingData from '../data/thing/ThingData';
import { ThingItemData } from '../data/thing/ThingItemData';
import { ConsumeMaterialItem } from '../ItemPanels/ConsumeMaterialItem';
import { CircleIconType, IconModelItem } from '../ItemPanels/IconModelItem';
import { PropertyListNode, PropertyWholeListNode } from '../ItemPanels/PropertyItemNode';
import { TitleItemStarNode } from '../ItemPanels/TitleItemNode';
import { Macros } from '../protocol/Macros';
import { ProtocolUtil } from '../protocol/ProtocolUtil';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { ElemFinder } from '../uilib/UiUtility';
import { Color } from '../utils/ColorUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';

/**
 * 魂骨封装
 */
export class HunguIntensifyPanel extends TabSubFormCommon {
    private hunguIntesifyData: HunguIntensifyData = null;
    
    private rightNode: UnityEngine.GameObject;

    /**九个魂骨 */
    private equipList: FixedList;
    /**右侧节点标题 （名字+战斗力） */
    private itemNodeTitle: TitleItemStarNode;
    /**右侧节点上边的属性节点 */
    private NodeAttribute: PropertyListNode;
    /**右侧节点下边的成套属性节点 */
    private nodeAttWholeList: PropertyWholeListNode;
    /**右侧节点下边的消耗封装 */
    private itemConsumeMaterial: ConsumeMaterialItem;

    private iconModelItems: IconModelItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Model: UnityEngine.GameObject;
    private curSelected: number = -1;

    //特效相关
    private flyRoot: GameObjectGetSet;
    private startPoint: GameObjectGetSet;
    private starObjs: GameObjectGetSet[] = [];
    private randomPos: GameObjectGetSet;
    private startPos: UnityEngine.Vector2 = new UnityEngine.Vector2(0, 0);
    private flySpeed: number = 10;
    private angle: number = 20;
    private maxCount: number = 10;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
    }

    protected resPath(): string {
        return UIPathData.HunguIntensifyPanel;
    }

    protected initElements() {
        super.initElements();
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");
        this.rightNode = this.elems.getElement("rightNode");

        this.equipList = this.elems.getUIFixedList("equipList");

        this.itemNodeTitle = new TitleItemStarNode();
        this.itemNodeTitle.setComponents(this.elems.getElement("titleItemStarNode"));

        this.NodeAttribute = new PropertyListNode();
        this.NodeAttribute.setComponents(this.elems.getElement("attributeListItem"));

        this.nodeAttWholeList = new PropertyWholeListNode();
        this.nodeAttWholeList.setComponents(this.elems.getElement("wholeAttributeItem"));

        this.flyRoot = new GameObjectGetSet(this.elems.getElement('flyRoot'));
        this.startPoint = new GameObjectGetSet(this.elems.getElement('startPoint'));
        this.randomPos = new GameObjectGetSet(this.elems.getElement('randomPos'));

        this.itemConsumeMaterial = new ConsumeMaterialItem();
        this.itemConsumeMaterial.setComponents(this.elems.getElement("consumeMaterialItem"), this.itemIcon_Normal);

        let count = this.equipList.Count;
        this.iconModelItems = [];
        for (let i = 0; i < count; i++) {
            let item = new IconModelItem();
            let goitem = this.equipList.GetItem(i).gameObject;
            let icon = ElemFinder.findObject(goitem, "icon");
            item.setIconByPrefab(this.itemIcon_Model, icon)
            item.setIconType(CircleIconType.HunguFZ);
            item.selectedClose();
            this.iconModelItems.push(item);
        }

        this.hunguIntesifyData = G.DataMgr.hunliData.hunguIntensifyData;
    }

    protected initListeners() {
        super.initListeners();
        this.itemConsumeMaterial.onClick = delegate(this, this.onClickConsume);
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

    updatePanel() {
        //刷新左侧装备
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        this.updateEquipIcon(equipDatas);

        //刷新右侧属性
        if (this.curSelected == -1) {
            //没有装备魂骨 右侧面板关闭
            this.rightNode.SetActive(false);
            return;
        }
        let equipData = equipDatas[this.curSelected];
        if (equipData != null) {
            this.rightNode.SetActive(true);
            let isintensify = equipData.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
            let data = this.hunguIntesifyData.getHunGuFZCfg(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel);
            let propdata = this.hunguIntesifyData.getHunguPropMultiplyRandomProp(data.m_astProp);
            let specialPropdata = this.hunguIntesifyData.getSpecialHunguPropMultiplyRandomProp(data.m_astProp);

            this.uptateEquipIconSelected();
            if (this.curSelected < this.hunguIntesifyData.HUNGU_COUNT_NORMAL) {
                //基础魂骨
                this.updateTitleAndStars(equipData, propdata[1]);
                this.updateBaseAttribute(propdata[0], isintensify);
            }
            else {
                //外附魂骨
                this.updateTitleAndStars(equipData, specialPropdata[1]);
                this.updateBaseAttribute(specialPropdata[0], isintensify);
            }
            if (isintensify) {
                //显示套装（已封装）
                this.nodeAttWholeList.showNode();
                this.nodeAttWholeList.hideTitleAndAtt();
                this.itemConsumeMaterial.close();
                this.updateSuitAttribute(isintensify, equipData.config.m_iDropLevel);
            }
            else {
                //显示材料
                this.nodeAttWholeList.hideNode();
                this.itemConsumeMaterial.open();
                this.updateMaterals(data);
            }
        }

        this.setTitleFight(this.hunguIntesifyData.getHunguFZAllFighting());
    }

    private onClickFixedList(index: number) {
        this.curSelected = index;
        this.updatePanel();
        this.iconModelItems[index].playButtonEffect(this.sortingOrder);
    }

    /**标记 是否需要提示*/
    private isOnClickTip = false;
    /**
     * 点击“封装按钮”
     */
    private onClickConsume() {
        if (this.itemConsumeMaterial.getMaterialSatisfy()) {
            this.sendHunguIntensify(this.curSelected);
        }
        else {
            let nums = this.itemConsumeMaterial.getMaterialNumber();
            let num = nums[1] - nums[0];
            G.ActionHandler.autoBuyMaterials(this.itemConsumeMaterial.getMaterialId(), num, () => {
                this.sendHunguIntensify(this.curSelected);
            });
        }
    }

    private setDefaultSeletend() {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            if (equipDatas[i] != null) {
                this.curSelected = i;
                break;
            }
        }
    }

    /**
     * 设置装备选中态（选中一个，同套的要一起显示）
     */
    private uptateEquipIconSelected() {
        //前六个是成套的 外附魂骨不考虑
        let countMax = this.equipList.Count;
        for (let i = 0; i < countMax; i++) {
            this.iconModelItems[i].selectedClose();
        }
        this.iconModelItems[this.curSelected].selectedOpen();
    }

    /**刷新图标显示 */
    private updateEquipIcon(equipDatas: { [position: number]: ThingItemData }) {
        //装备id 是否封装
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
    private updateTitleAndStars(equipData: ThingItemData, fight: number) {
        this.itemNodeTitle.setTitleName(equipData.config.m_szName);
        this.itemNodeTitle.setFighting(fight);
        this.itemNodeTitle.setStarNumber(equipData.config.m_ucStage);
    }

    /**刷新基础属性 */
    private updateBaseAttribute(equipData: GameConfig.HunGuFZAbility[], isintensify: boolean) {
        //装备位 年份（与星级无关）
        if (isintensify) {
            let str = TextFieldUtil.getColorText("封装属性", Color.YELLOW);
            this.NodeAttribute.setTitle(str);
        }
        else {
            let str = uts.format("{0}{1}", TextFieldUtil.getColorText("封装属性", Color.YELLOW), TextFieldUtil.getColorText("(未封装)", Color.GREY));
            this.NodeAttribute.setTitle(str);
        }

        this.NodeAttribute.clearProperty();
        let count = equipData.length;
        for (let i = 0; i < count; i++) {
            let item = equipData[i];
            this.NodeAttribute.addProperty(item.m_ucPropId, item.m_iPropValue);
        }
        this.NodeAttribute.refreshPropertyNode();
    }

    /**刷新套装属性 */
    private updateSuitAttribute(isintensify: boolean, drop: number) {
        if (!isintensify) return;
        if (this.curSelected < G.DataMgr.hunliData.HUNGU_COUNT_NORMAL) {
            this.nodeAttWholeList.showNode();
            this.nodeAttWholeList.showTitleAndAtt();
            let list = this.hunguIntesifyData.getSuitIndexFormDrop(drop);
            let curNumber = list == null ? 0 : list.length;
            let data = this.hunguIntesifyData.getHunGuTZCfg(drop);
            this.nodeAttWholeList.refreshNode(data, curNumber);

            let num = TextFieldUtil.getColorText(curNumber.toString(), curNumber == 0 ? Color.GREY : Color.GREEN);
            this.nodeAttWholeList.setNumber(uts.format("({0}/6)", num));
            this.nodeAttWholeList.setTitle(TextFieldUtil.getColorText(data[0].m_szName, Color.YELLOW));
        }
        else {
            this.nodeAttWholeList.showNode();
            this.nodeAttWholeList.hideTitleAndAtt();
        }
    }

    /**刷新材料属性 */
    private updateMaterals(equipData: GameConfig.HunGuFZConfigM) {
        //装备位 年份（与星级无关）
        this.itemConsumeMaterial.setTitle(TextFieldUtil.getColorText("封装消耗", Color.YELLOW));
        // this.itemConsumeMaterial.updateIconById(equipData.m_iItemID);
        this.itemConsumeMaterial.updateByMaterialItemData(equipData.m_iItemID, equipData.m_iItemNumber);
        let thingData = ThingData.getThingConfig(equipData.m_iItemID);
        this.itemConsumeMaterial.setIconName(thingData.m_szName);
        let has = G.DataMgr.thingData.getThingNum(equipData.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        //判断颜色
        if (!G.DataMgr.hunliData.isOnceHunguColor(equipData.m_iEquipPart)) {
            this.itemConsumeMaterial.setFirstButtonAction(false);
            this.itemConsumeMaterial.setDescribeActive(true);
            this.itemConsumeMaterial.setDescribe(TextFieldUtil.getColorText("仅红色以上魂骨可封装", Color.GREY));
        }
        else if (equipData.m_iItemNumber > has) {
            //数量不够
            this.itemConsumeMaterial.setFirstButtonAction(true);
            this.itemConsumeMaterial.setDescribeActive(false);
            // let str = TextFieldUtil.getColorText(uts.format("封装需要消耗{0}/{1}", has.toString(), equipData.m_iItemNumber.toString()), Color.GREY);
            // this.itemConsumeMaterial.setDescribe(str);
        }
        else {
            //可以封装
            this.itemConsumeMaterial.setFirstButtonAction(true);
            this.itemConsumeMaterial.setDescribeActive(false);
        }
    }

    private sendHunguIntensify(part: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguFZRequest(part, Macros.EQUIP_HUNGU_FZ));
        this.flyEffect();
    }


    private flyEffect() {
        for (let i = 0; i < this.maxCount; i++) {
            let obj: GameObjectGetSet;
            if (this.starObjs[i] == null) {
                obj = new GameObjectGetSet(UnityEngine.UnityObject.Instantiate(this.flyRoot.gameObject, this.startPoint.transform, true) as UnityEngine.GameObject);
                this.starObjs.push(obj);
            }
            else {
                obj = this.starObjs[i];
                obj.rectTransform.anchoredPosition = this.startPos;
            }
            obj.SetActive(true);
            let x = 150 - Math.random() * 300;
            let y = 200 - Math.random() * 300;
            this.randomPos.rectTransform.anchoredPosition = new UnityEngine.Vector2(x, y);
            let tween1 = Tween.TweenPosition.Begin(obj.gameObject, 0.6, this.randomPos.transform.position, true);
            tween1.onFinished = delegate(this, this.onTweenOneOver, obj);
        }
    }
    private onTweenOneOver(obj: GameObjectGetSet) {
        let endX = this.equipList.GetItem(this.curSelected).rectTransform.anchoredPosition.x;
        let angele: number = 0;
        if (obj.rectTransform.anchoredPosition.x < endX) {
            angele = -this.angle;
        } else {
            angele = this.angle;
        }
        //经过实验,每次速度增加0.2效果较好
        this.flySpeed = this.flySpeed + 0.2;
        Game.Tools.AddBesizer(obj.gameObject, this.flySpeed, angele, this.equipList.GetItem(this.curSelected).gameObject, delegate(this, this.onTweenBesizerOver, obj));
    }
    private onTweenBesizerOver(obj: GameObjectGetSet) {
        obj.SetActive(false);
    }
}