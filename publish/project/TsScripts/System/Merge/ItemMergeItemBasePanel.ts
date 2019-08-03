import { EnumEffectRule } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { EquipStrengthenData } from 'System/data/EquipStrengthenData';
import { ThingData } from 'System/data/thing/ThingData';
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { MergeTreeData } from 'System/data/vo/MergeTreeData';
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { ItemTipData } from 'System/tip/tipData/ItemTipData';
import { ItemTipBase } from 'System/tip/view/ItemTipBase';
import { TipFrom } from 'System/tip/view/TipsView';
import { EffectType, UIEffect } from "System/uiEffect/UIEffect";
import { TextGetSet, UILayer } from 'System/uilib/CommonForm';
import { FixedList } from "System/uilib/FixedList";
import { GroupList } from 'System/uilib/GroupList';
import { IconItem } from 'System/uilib/IconItem';
import { ListItem } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
class ItemMergaData {
    config: GameConfig.ItemMergeM;
    name: string;
}
export abstract class ItemMergeItemBasePanel extends TabSubForm {
    protected curTab = 0;

    /**强化石id，10002020*/
    private readonly QHSID = 10002020;
    /**斩石id 10379020*/
    private readonly ZSID = 10379020;

    private readonly scale = 1.2;


    /**一级索引（斩石）*/
    private firstLevelIndex: number = 0;
    /**二级索引（N级斩石）*/
    private secondLevelIndex: number = 0;
    /**当前选择物品ID*/
    private curSelectDataID: number = 0;
    /**合成列表*/
    private mergeGroupList: GroupList;
    /**选择合成的物品*/
    private mergeFixedList: FixedList;
    private m_type: number = 0;
    private treeData: MergeTreeData[];
    /**合成的宝石*/
    private m_compoundGem: IconItem;
    /**合成材料的数量*/
    private readonly MATERIAL_NUM: number = 4;
    /**物品合成锁*/
    private lockImgArray: UnityEngine.GameObject[] = [];
    /**中间合成后物品*/
    private centerMaterial: MaterialItemData = new MaterialItemData();
    private centerIconItem: IconItem;
    /**4个合成材料*/
    private m_materialData: MaterialItemData[] = [];
    private materialIconItem: IconItem[] = [];
    private textHasAndNeed: TextGetSet[] = [];
    /**可合成，默认为false*/
    private canMerge: boolean = false;
    /**过滤*/
    private m_btnFilter: UnityEngine.UI.ActiveToggle = null;
    /**升级按钮*/
    private btnUp: UnityEngine.GameObject = null;
    /**一键升级按钮*/
    private oneBtnUp: UnityEngine.GameObject = null;
    /**config数组*/
    private m_config: GameConfig.ItemMergeM = {} as GameConfig.ItemMergeM;
    private itemIcon_Normal: UnityEngine.GameObject;

    //特效
    private itemMergeEffectPrefab: UnityEngine.GameObject;
    private itemEffect: UIEffect;
    private successEffect: UIEffect;

    private secondType: { [first: number]: ItemMergaData[] } = {};
    private txtTips: UnityEngine.UI.Text;
    //一键合成的数量
    private oneBtnMergeNum = 0;

    //新增右侧合成物品信息
    private thingInfo: UnityEngine.GameObject;
    private equipInfo: UnityEngine.GameObject;
    private itemTipBase: ItemTipBase;
    private firstOpen: boolean = true;

    private arrowLs: UnityEngine.GameObject[] = [];

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.ItemMergeItemPanel;
    }
    protected initElements(): void {
        this.itemMergeEffectPrefab = this.elems.getElement("itemMergeEffect");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //this.returnBtn = this.elems.getElement('btnReturn');
        // this.tabGroup = this.elems.getToggleGroup('tabGroup');
        this.mergeGroupList = this.elems.getUIGroupList("mergeGroupList");
        this.m_btnFilter = this.elems.getActiveToggle("toggleFilter");
        this.btnUp = this.elems.getElement("btnUp");
        this.oneBtnUp = this.elems.getElement("oneBtnUp");
        this.mergeFixedList = this.elems.getUIFixedList("mergeFixedList");
        //4个可合成的物品
        for (let i = 0; i < this.MATERIAL_NUM; i++) {
            let item = this.mergeFixedList.GetItem(i + 1);
            this.textHasAndNeed.push(new TextGetSet(item.findText("textHasAndNeed")));
            let lock = item.findObject("lockRamImg");
            lock.SetActive(false);
            this.lockImgArray.push(lock);
            this.arrowLs.push(item.findObject("arrowL"));
            let parent = item.findObject("icon");
            let iconItem = new IconItem();

            iconItem.isMergePanelEquipNeedShowNum = true;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.showBg = false;
            iconItem.needColor = false;
            iconItem.showNumText = false;
            iconItem.showLvTextAndBg = false;
            this.materialIconItem[i] = iconItem;
        }
        this.itemEffect = new UIEffect();
        let item = this.mergeFixedList.GetItem(0);
        this.itemEffect.setEffectPrefab(this.itemMergeEffectPrefab, item.gameObject, this.scale);
        this.txtTips = this.elems.getText("txtTips");

        this.thingInfo = this.elems.getElement("thingInfo");
        this.equipInfo = this.elems.getElement("equipInfo");
        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.itemTipBase.setThingInfoComponents(this.thingInfo);
        this.itemTipBase.setEquipInfoComponents(this.equipInfo, this.elems.getUiElements('equipInfo'));

        this.successEffect = new UIEffect();
        this.successEffect.setEffectPrefab(this.elems.getElement("hccgtx"), item.gameObject);
    }
    protected initListeners(): void {
        //this.addClickListener(this.returnBtn, this.onClickReturnBtn);
        //this.addToggleGroupListener(this.tabGroup, this.onToggleTabGroup);
        this.mergeGroupList.onClickItem = delegate(this, this.onClickMergeGroupItem);
        this.m_btnFilter.onValueChanged = delegate(this, this.onFilterClick);

        this.addClickListener(this.btnUp.gameObject, this.onClickUp);
        this.addClickListener(this.oneBtnUp.gameObject, this.onClickOneBtnUp);
        this.addListClickListener(this.mergeFixedList, this.onMergeListClick);

    }



    protected onOpen() {
        this.firstOpen = true;
        this.onToggleTabGroup();
    }

    protected onClose() {
        this.itemEffect.stopEffect();
        this.successEffect.stopEffect();
    }


    onItemMergeResponse() {
        this.addEffect();
    }

    private addEffect(): void {
        G.AudioMgr.playStarBombSucessSound();
        this.itemEffect.playEffect(EffectType.Effect_Normal, true, 0.8);
        this.successEffect.playEffect(EffectType.Effect_Normal, true, 0.8);
    }


    private onToggleTabGroup() {
        //tab切换时，重置
        this.mergeGroupList.ScrollTop();
        this.firstLevelIndex = 0;
        this.secondLevelIndex = 0;
        this.processOpenParam(this.curTab);
        ////切换tab是默认选择第1个
        this.onClickMergeItem(0);
    }

    private onClickReturnBtn() {
        this.close();
    }

    /**
     * 升级按钮
     */
    private onClickUp() {
        this.onBtnGo();
    }

    /**
     * 一键升级按钮
     */
    private onClickOneBtnUp() {
        this.onOneBtnGo();
    }




    /**
     * 材料的点击
     */
    private onMergeListClick(index: number) {
        if (index == 0) {
            G.ViewCacher.tipsView.open(this.centerIconItem.getTipData(), TipFrom.equip);
        } else {
            //放在同一个List下，合成材料下标需要-1
            index -= 1;
            //材料id==0，表示锁着，没有Tip显示
            if (this.m_materialData[index].id == 0) return;
            G.ViewCacher.tipsView.open(this.materialIconItem[index].getTipData(), TipFrom.equip);
        }
    }

    /**
     * 合成1级选择
     */
    private onClickMergeGroupItem(index: number) {
        this.firstLevelIndex = index;
    }
    /**
     * 合成2级选择
     * @param index
     */
    private onClickMergeItem(index: number) {
        this.secondLevelIndex = index;
        this.getMaterialData();
    }



    private autoSelectItem() {
        this.mergeGroupList.Selected = this.firstLevelIndex;
        let subList = this.mergeGroupList.GetSubList(this.firstLevelIndex);
        let oldSelected = subList.Selected;
        subList.Selected = this.secondLevelIndex;
    }


    /**
     *  得到选择的物品的数据
     */
    private getMaterialData() {

        let firstData = this.treeData[this.firstLevelIndex];
        if (firstData == null) return;
        let seconedData = firstData.items[this.secondLevelIndex];
        if (seconedData == null) return;
        let id: number = seconedData.classID;
        let itemTxt = this.secondType[this.firstLevelIndex][this.secondLevelIndex];
        // let config = G.DataMgr.equipStrengthenData.getItemMergeConfig(id);
        let config = itemTxt.config;
        let thingID = ThingData.getThingConfig(itemTxt.config.m_iProductId).m_iID;
        this.curSelectDataID = thingID;
        //中间合成后物品的Id
        this.centerMaterial.id = thingID;
        this.m_config = config;



        //大类是合成材料，小类是图纸（进阶石）
        if (config.m_iMainClass == KeyWord.MERGER_CLASS1_STRONG_ITEM && config.m_iLevelLimit > 1 &&
            (config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_JZTZ ||
                config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_HZTZ ||
                config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_FZTZ
            )) {
            if (EquipStrengthenData.isArmorSJS(config.m_iProductId)) {
                this.txtTips.text = "装备升阶石需防具类都达到对应阶级";
            }
            else if (EquipStrengthenData.isOrnamentsSJS(config.m_iProductId)) {
                this.txtTips.text = "饰品升阶石需饰品类都达到对应阶级";
            }

            else {
                this.txtTips.text = G.DataMgr.langData.getLang(412);
            }
        } else {
            if (config.m_iProductId == this.QHSID) {
                //强化石
                this.txtTips.text = G.DataMgr.langData.getLang(436);
            } else if (config.m_iProductId == this.ZSID) {
                //斩石
                this.txtTips.text = G.DataMgr.langData.getLang(437);
            }

            else {
                this.txtTips.text = "";
            }
        }





        //控制升级按钮是否可点击
        let cnt: number = G.DataMgr.equipStrengthenData.getCanItemMergeNum(id);
        this.oneBtnMergeNum = cnt;

        if (cnt > 0) {
            UIUtils.setButtonClickAble(this.btnUp, true);
            UIUtils.setButtonClickAble(this.oneBtnUp, true);
        } else {
            UIUtils.setButtonClickAble(this.btnUp, false);
            UIUtils.setButtonClickAble(this.oneBtnUp, false);
        }
        let num: number = 0;
        let isEnough: boolean = true;
        for (let i: number = 0; i < this.MATERIAL_NUM; i++) {
            this.m_materialData[i] = new MaterialItemData();
            if (i > this.m_config.m_astSuffData.length || this.m_config.m_astSuffData[i] == null) {
                this.lockImgArray[i].SetActive(true);
                this.arrowLs[i].SetActive(false);
                this.m_materialData[i].id = 0;
            }
            else {
                this.lockImgArray[i].SetActive(false);
                this.m_materialData[i].id = this.m_config.m_astSuffData[i].m_iSuffID;
                this.m_materialData[i].need = this.m_config.m_astSuffData[i].m_iSuffNumber;
                if (i > 0 && this.m_config.m_astSuffData[i].m_iSuffID == this.m_config.m_astSuffData[i - 1].m_iSuffID) {
                    num += this.m_config.m_astSuffData[i].m_iSuffNumber;
                }
                else {
                    num = this.m_config.m_astSuffData[i].m_iSuffNumber;
                }
                if (G.DataMgr.thingData.getThingNum(this.m_materialData[i].id, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= num) {
                    this.m_materialData[i].has = this.m_materialData[i].need;
                    if (this.m_materialData[i].need == 0) this.arrowLs[i].SetActive(false);
                    this.arrowLs[i].SetActive(true);
                }
                else {
                    this.arrowLs[i].SetActive(false);
                    this.m_materialData[i].has = 0;
                    isEnough = false;
                }
            }
        }
        this.showRightUI();

    }

    /**
     * 合成列表的显示
     * @param firstType  1级选择名字
     * @param secondType 2级选择名字  
     */
    private createMergeItem(firstType: string[], secondType: { [first: number]: ItemMergaData[] }) {
        this.mergeGroupList.Count = firstType.length;
        for (let i: number = 0; i < firstType.length; i++) {
            let labelItem = this.mergeGroupList.GetItem(i);
            let labelText = labelItem.findText('catalog/normal/text');
            labelText.text = firstType[i];
            labelText = labelItem.findText('catalog/selected/text');
            labelText.text = firstType[i];
            let subList = this.mergeGroupList.GetSubList(i);
            subList.Clear(); // 虚拟列表被重用后，必须执行clear
            subList.Count = secondType[i].length;
            if (!subList.onClickItem) {
                subList.onClickItem = delegate(this, this.onClickMergeItem);
            }
            if (!subList.onVirtualItemChange) {
                subList.onVirtualItemChange = delegate(this, this.onVirtualItemChange);
            }

        }

        this.autoSelectItem();

    }

    processOpenParam(index: number): void {
        this.m_type = index;
        this.m_config = null;
        this.getItemMergeTreeData();
        this.getTitleStr();
    }

    /**获得数据*/
    private getItemMergeTreeData(): void {
        let data: MergeTreeData[] = G.DataMgr.equipStrengthenData.getMergeTreeDate(this.m_type, this.m_btnFilter.isOn);
        if (data.length == 0) {
            data = G.DataMgr.equipStrengthenData.getMergeTreeDate(this.m_type, false);
        }
        this.treeData = data;
    }


    /**
     * 勾选toggle是否过滤筛选
     */
    private onFilterClick(): void {
        this.getItemMergeTreeData();
        this.getTitleStr();
        if (!this.canMerge && this.m_btnFilter.isOn) {//没有可合成
            G.TipMgr.addMainFloatTip('没有可合成物品！');
            this.m_btnFilter.isOn = false;
        }
    }

    private getTitleStr(): void {
        let firsrStr: string[] = [];
        this.secondType = {};
        //是否显示绿色，即可升级
        let isGreen: boolean = false;
        for (let i = 0; i < this.treeData.length; i++) {
            firsrStr.push(this.treeData[i].self);

            //二级 分支 
            if (this.treeData[i].items.length > 0) {
                for (let j = 0; j < this.treeData[i].items.length; j++) {
                    let mergaItemData = new ItemMergaData();
                    let id: number = this.treeData[i].items[j].classID;
                    mergaItemData.config = G.DataMgr.equipStrengthenData.getItemMergeConfig(id);
                    mergaItemData.name = ThingData.getThingConfig(mergaItemData.config.m_iProductId).m_szName;
                    let cnt: number = G.DataMgr.equipStrengthenData.getCanItemMergeNum(id);
                    mergaItemData.name += uts.format("({0})", cnt);
                    if (cnt > 0) {
                        mergaItemData.name = TextFieldUtil.getColorText(mergaItemData.name, Color.GREEN);
                    }
                    if (this.secondType[i] == null) {
                        this.secondType[i] = new Array<ItemMergaData>();
                    }
                    this.secondType[i].push(mergaItemData);
                }
                this.secondType[i].sort(this.sortFunc);
                // this.itemMergaList.sort(this.sortFunc);
            }
        }
        this.createMergeItem(firsrStr, this.secondType);
    }
    /**合成排序 */
    private sortFunc(a: ItemMergaData, b: ItemMergaData) {
        if (a.config.m_iArray > b.config.m_iArray) {
            return 1;
        }
        else if (a.config.m_iArray == b.config.m_iArray) {
            return 0;
        }
        else {
            return -1;
        }
    }
    /**
     *显示右侧合成UI
     */
    private showRightUI() {
        this.canMerge = G.DataMgr.equipStrengthenData.canItemMergeByType(this.curTab);
        //中间合成的物品
        let item0 = this.mergeFixedList.GetItem(0);
        if (this.centerIconItem == null) {
            this.centerIconItem = new IconItem();
            this.centerIconItem.setUsualIconByPrefab(this.itemIcon_Normal, item0.gameObject.transform.Find("icon").gameObject);
        }

        this.centerIconItem.updateByMaterialItemData(this.centerMaterial);
        this.centerIconItem.updateIcon();
        //4个可合成的物品
        for (let i = 0; i < this.MATERIAL_NUM; i++) {
            this.materialIconItem[i].updateByMaterialItemData(this.m_materialData[i]);
            this.materialIconItem[i].updateIcon();
            let has = this.m_materialData[i].has;
            let need = this.m_materialData[i].need;
            if (has == need && need == 0) {
                this.textHasAndNeed[i].text = "未开启";
            } else {
                this.textHasAndNeed[i].text = TextFieldUtil.getColorText(uts.format("{0}/{1}", has, need), has >= need ? Color.GREEN : Color.RED);
            }
        }
        let tipData = this.centerIconItem.getTipData() as ItemTipData;
        this.itemTipBase.updateInfo(tipData);

        if (this.m_btnFilter.isOn) {//勾选 只显示可合成
            if (!this.canMerge) {
                this.m_btnFilter.isOn = false;
            }
        }
    }

    private onBtnGo(): void {
        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.addMainFloatTip('背包已满', -1, 1)
            return;
        }
        if (this.m_config != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getItemMergeRequest(this.m_config.m_iProductId, 1));
        }
    }

    private onOneBtnGo(): void {
        let mergeNum = 0;
        let BagRemainNum = G.DataMgr.thingData.getBagRemainNum();
        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.addMainFloatTip('背包已满', -1, 1)
            return;
        }

        if (this.m_config == null) {
            return;
        }
        if (this.curTab == KeyWord.MERGER_CLASS1_PET) {
            if (this.oneBtnMergeNum >= BagRemainNum) {
                mergeNum = BagRemainNum;
            }
            else {
                mergeNum = this.oneBtnMergeNum;
            }
        }
        else {
            mergeNum = this.oneBtnMergeNum;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getItemMergeRequest(this.m_config.m_iProductId, mergeNum));

    }

    onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {

            this.getItemMergeTreeData();
            this.getTitleStr();
            this.getMaterialData();
        }
    }


    private onVirtualItemChange(item: ListItem): void {
        let itemIndex = item.Index;
        let itemTxt;
        // if (this.firstOpen) {
        //      itemTxt = this.secondType[this.firstLevelIndex][0];
        //      this.firstOpen = false;
        // }else{
        //     itemTxt = this.secondType[this.firstLevelIndex][itemIndex];
        // }
        itemTxt = this.secondType[this.firstLevelIndex][itemIndex];
        if (!itemTxt) return;
        item.findText('txtItem').text = itemTxt.name;
        let normalFlag = itemIndex % 2;
        item.findObject("normal1").SetActive(normalFlag == 0);
        item.findObject("normal2").SetActive(normalFlag == 1);
    }
}