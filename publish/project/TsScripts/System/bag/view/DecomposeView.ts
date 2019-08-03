import { EnumEffectRule, EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { DropPlanData } from 'System/data/DropPlanData';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from "System/data/UIPathData";
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData';
import { Global as G } from 'System/global';
import { OpenChestView } from "System/guide/OpenChestView";
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { MessageBoxConst } from 'System/tip/TipManager';
import { EffectType, UIEffect } from 'System/uiEffect/UIEffect';
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { List, ListItem } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility';
import { GameIDUtil } from "System/utils/GameIDUtil";


class DecomposeItemData {
    thingData: ThingItemData;
    num: number;
    pos: number;
}

/*
 * 分解面板
 */
export class DecomposeView extends CommonForm {

    /**一次最大分解30个*/
    private readonly Max_FENJJE_NUN = 30;
    private readonly HUNGU_LEVEL = 20;
    private readonly PET_LEVEL = 5;
    private colorName: string[] = ["蓝色", "紫色", "橙色", "金色", "红色"];

    private itemIcon_Normal: UnityEngine.GameObject;
    //按钮
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    btnConfirm: UnityEngine.GameObject;
    private btnMore: UnityEngine.GameObject;
    private selToggleColors: UnityEngine.GameObject;
    private selToggleNum: number = 2;
    private selToggles: UnityEngine.UI.ActiveToggle[] = [];
    private decomposeUIEffects: UIEffect[] = [];
    private colors: number[] = [KeyWord.COLOR_BLUE, KeyWord.COLOR_PURPLE, KeyWord.COLOR_ORANGE, KeyWord.COLOR_GOLD, KeyWord.COLOR_RED];


    //list
    private bagList: List;
    private willGetList: List;

    //背包数据，按位子存
    private bagThingDic: { [pos: number]: DecomposeItemData } = {};
    private bagThingDatas: DecomposeItemData[];

    private fenJieDatas: DecomposeItemData[] = [];
    private fjIndex2PosArr: number[] = [];

    //icon数据
    private bagIcons: IconItem[] = [];
    private willGetIcons: IconItem[] = [];

    private _sendRonglianData: Protocol.ContainerThing[] = [];
    private m_rewardData: RewardIconItemData[] = [];
    private m_showData: RewardIconItemData[] = [];

    private selectTabIndex: number = 0;
    /**已经选择要分解的数量*/
    private hasSelectThingNum = 0;

    private isOncesTip = false;
    private isOnceTipMaxNum = false;

    /**更多界面 */
    private decomposeSelectedPanel: DecomposeSelectedPanel;

    constructor() {
        super(1);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.DecomposeView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
        this.btnConfirm = this.elems.getElement("btnConfirm");
        this.btnMore = this.elems.getElement("btnMore");

        this.bagList = this.elems.getUIList("bagList");
        this.willGetList = this.elems.getUIList("willGetList");

        this.selToggleColors = this.getElement("selColors");

        for (let i = 0; i < this.selToggleNum; i++) {
            let toggle: UnityEngine.UI.ActiveToggle = ElemFinder.findActiveToggle(this.selToggleColors, i.toString());
            this.selToggles.push(toggle);
        }

        this.decomposeSelectedPanel = new DecomposeSelectedPanel();
        this.decomposeSelectedPanel.setComponents(this.elems.getElement("selectedPanel "));
        this.decomposeSelectedPanel.setHungList(this.HUNGU_LEVEL);
        this.decomposeSelectedPanel.setPetList(this.PET_LEVEL, this.colorName);
        this.decomposeSelectedPanel.onClose();
        this.decomposeSelectedPanel.onClickCall = delegate(this, this.onClickSelConfirm);
    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
        this.addClickListener(this.btnConfirm, this.onBtnConfirm);
        this.addClickListener(this.btnMore, this.onClickMore);
        this.addListClickListener(this.bagList, this.onBagListItem);

        for (let i = 0; i < this.selToggleNum; i++) {
            this.selToggles[i].onValueChanged = delegate(this, this.toggleChange);
        }
    }

    protected onOpen() {
        this.onClickTabGroup(this.selectTabIndex);
        this.updateWillList();
        if (G.GuideMgr.isGuiding(EnumGuide.HunGuDecompose)) {
            this.selToggles[0].isOn = false;
            G.GuideMgr.processGuideNext(EnumGuide.HunGuDecompose, EnumGuide.HunGuDecClickDecBtn);
        } else {
            this.selToggles[0].isOn = true;
        }
        this.selToggles[1].isOn = false;
    }

    protected onClose() {
        this.selToggles[0].isOn = false;
        this.selToggles[1].isOn = false;
        this.fenJieDatas = [];
        this.hasSelectThingNum = 0;
        this.cleraWillList();
        this.fjIndex2PosArr = [];
        this.m_showData = [];
    }

    private onClickClose() {
        this.close();
    }

    public getListItemByThingId(id: number): ListItem {
        let item: ListItem = null;
        let cnt = this.bagThingDatas.length;
        for (let i = 0; i < cnt; i++) {
            if (null != this.bagThingDatas[i].thingData && this.bagThingDatas[i].thingData.config.m_iID == id) {
                if (i > 19)
                    this.bagList.ScrollByAxialRow(i / 5);
                item = this.bagList.GetItem(i);
            }
        }
        return item;
    }

    /**更多 */
    private onClickMore() {
        this.decomposeSelectedPanel.onOpen();
    }

    private toggleChange() {
        this.selToggleLimit(this.selToggles[0].isOn, this.selToggles[1].isOn);
    }

    /**
     * 点击选择要分解的物品
     * @param index
     */
    onBagListItem(index: number, data?: DecomposeItemData, isOneBtnSel?: boolean) {
        if (G.GuideMgr.isGuiding(EnumGuide.HunGuDecompose)) {
            G.GuideMgr.processGuideNext(EnumGuide.HunGuDecompose, EnumGuide.HunGuDecClickListItem);
        }

        let itemVo: DecomposeItemData = null;
        if (data != null) {
            itemVo = data;
        }
        else {
            itemVo = this.bagThingDatas[index];
        }

        if (itemVo && itemVo.thingData) {
            if (itemVo.num) {
                this.hasSelectThingNum++;

                if (this.hasSelectThingNum > this.Max_FENJJE_NUN) {
                    this.hasSelectThingNum--;
                    if (isOneBtnSel) {
                        if (this.isOnceTipMaxNum == true) {
                            G.TipMgr.addMainFloatTip(uts.format("每次最大可分解{0}个物品", this.Max_FENJJE_NUN));
                            this.isOnceTipMaxNum = false;
                        }
                    }
                    else {
                        G.TipMgr.addMainFloatTip(uts.format("每次最大可分解{0}个物品", this.Max_FENJJE_NUN));
                    }

                    return;

                }

                let isPush: boolean = false;
                for (let i = 0; i < this.fjIndex2PosArr.length; i++) {
                    if (this.fjIndex2PosArr[i] < 0) {
                        this.fjIndex2PosArr[i] = itemVo.thingData.data.m_usPosition;
                        isPush = true;
                        break;
                    }
                }
                if (!isPush) {
                    this.fjIndex2PosArr.push(itemVo.thingData.data.m_usPosition);
                }
            }
            else {

                if (isOneBtnSel) {
                    if (this.isOncesTip) {
                        //G.TipMgr.addMainFloatTip("该物品已全部使用完");
                        this.isOncesTip = false;
                    }
                }
                else {
                    // G.TipMgr.addMainFloatTip("该物品已放入");
                    this.onFenjieListItemForData(itemVo.thingData.data.m_usPosition);
                }

                return;
            }
        }
        this.onAddThing(itemVo);
        this.getBagListData(this.selectTabIndex);
    }

    /**
    * 添加分解物
    * @param thing
    */
    private onAddThing(thing: DecomposeItemData): void {
        let emptyIndex = -1;
        let length = this.fenJieDatas.length;
        for (let i = 0; i < length; i++) {
            if (this.fenJieDatas[i] == null) {
                emptyIndex = i;
                break;
            }
        }
        if (emptyIndex >= 0 && emptyIndex < this.Max_FENJJE_NUN) {
            this.fenJieDatas[emptyIndex] = thing;
        } else {
            this.fenJieDatas.push(thing);
        }
        this.updateWillGetThing();
        for (let i = 0; i < this.fenJieDatas.length; i++) {
            if (this.decomposeUIEffects[i] == null) {
                this.decomposeUIEffects[i] = new UIEffect();
            }
        }
    }
    private onFenjieListItemForData(pos: number) {
        for (let i = 0, count = this.fenJieDatas.length; i < count; i++) {
            let data = this.fenJieDatas[i];
            if (data == null) continue;
            if (data.thingData.data.m_usPosition == pos)
                this.onFenJieListItem(i);
        }
    }

    /**
     * 取消要分解的物品
     * @param index
     */
    private onFenJieListItem(index: number) {
        if (this.fenJieDatas[index] != null) {
            if (this.fjIndex2PosArr[index] >= 0) {
                this.fjIndex2PosArr[index] = -1;
            }
            this.hasSelectThingNum--;
            this.onRemoveThing(index);
            this.getBagListData(this.selectTabIndex);
        }
    }

    /**
    * 移除分解物
    * @param index
    */
    private onRemoveThing(index: number): void {
        if (index >= 0) {
            this.fenJieDatas[index] = null;
            this.updateWillGetThing();
        }
    }


    private onClickTabGroup(index: number) {
        this.selectTabIndex = index;
        this.getBagListData(index);
        //清除选中状态
        this.bagList.Selected = -1;
    }

    /**选择界面确定 回调 */
    private onClickSelConfirm(hungu: number, pet: number) {
        //清理选中
        this.selToggles[0].isOn = false;
        this.selToggles[1].isOn = false;
        this.removeAll();

        for (let t of this.bagThingDatas) {
            if (!GameIDUtil.isPetEquipID(t.thingData.config.m_iID) && !GameIDUtil.isHunguEquipID(t.thingData.config.m_iID))
                continue;

            //魂骨筛选
            if (GameIDUtil.isHunguEquipID(t.thingData.config.m_iID)) {
                if (hungu == -1) continue;
                if (t.thingData.config.m_iDropLevel <= hungu)
                    this.onBagListItem(-1, t, true);
                continue;
            }
            else {
                if (pet == -1) continue;
                if (t.thingData.config.m_ucColor <= this.colors[pet])
                    this.onBagListItem(-1, t, true);
                continue;
            }
        }
    }


    onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.onClickTabGroup(this.selectTabIndex);
            this.selToggles[0].isOn = false;
            this.selToggles[1].isOn = false;
        }
    }

    onResponse(response: Protocol.EquipProp_Response): void {
        if (response.m_usType == Macros.EQUIP_MELT && response.m_iResultID == 0) {
            G.Uimgr.createForm<OpenChestView>(OpenChestView).open('恭喜获得', this.m_showData);
            this.onClickTabGroup(this.selectTabIndex);
            //分解后清空显示
            this.fenJieDatas = [];
            this.hasSelectThingNum = 0;
            this.cleraWillList();
            this.fjIndex2PosArr = [];
        }
    }

    /**
  * 背包数据处理  
  */
    private getBagListData(tabIndex: number) {
        //每次切换的时候清下
        this.bagThingDatas = [];
        this.bagThingDic = {};
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let rawObj: ThingItemData;
        let itemVo: DecomposeItemData;
        //表示默认的全部显示tabKey == 0
        if (tabIndex == 0) {
            for (let i = 0; i < G.DataMgr.thingData.bagCapacity; i++) {
                rawObj = rawDatas[i];
                //可以分解
                if (null != rawObj && rawObj.config.m_uiMeltInfo > 0) {
                    itemVo = new DecomposeItemData();
                    itemVo.thingData = uts.deepcopy(rawObj, itemVo.thingData, true);
                    itemVo.num = itemVo.thingData.data.m_iNumber;
                    itemVo.pos = itemVo.thingData.data.m_usPosition;
                    this.bagThingDatas.push(itemVo);
                    this.bagThingDic[itemVo.pos] = itemVo;
                }
            }
        }
        else {
            for (let posStr in rawDatas) {
                // 进行过滤
                rawObj = rawDatas[posStr];
                //物品类型
                if (tabIndex == rawObj.config.m_iBagClass && rawObj.config.m_uiMeltInfo > 0) {
                    itemVo = new DecomposeItemData();
                    itemVo.thingData = uts.deepcopy(rawObj, itemVo.thingData, true);
                    itemVo.num = itemVo.thingData.data.m_iNumber;
                    itemVo.pos = itemVo.thingData.data.m_usPosition;
                    this.bagThingDatas.push(itemVo);
                    this.bagThingDic[itemVo.pos] = itemVo;
                }
            }
        }
        //放入分解中的灰调
        for (let pos of this.fjIndex2PosArr) {
            if (pos >= 0) {
                itemVo = this.bagThingDic[pos];
                if (itemVo) {
                    itemVo.num = 0;
                }
            }
        }
        //背包图标显示
        this.updateBagList();
    }

    onBtnConfirm(): void {
        this.selAllSameColor([103, 104, 105]);
        if (G.GuideMgr.isGuiding(EnumGuide.HunGuDecompose)) {
            G.GuideMgr.processGuideNext(EnumGuide.HunGuDecompose, EnumGuide.HunGuDecClickConfirmBtn);
        }

        let iscan = false;
        if (this.fenJieDatas != null && this.fenJieDatas.length > 0) {
            for (let i = 0, count = this.fenJieDatas.length; i < count; i++) {
                let item = this.fenJieDatas[i];
                if (item != null) {
                    iscan = true;
                    break;
                }
            }
        }
        if (iscan) {
            this._onConfirm(MessageBoxConst.yes, true)
        }
        else {
            G.TipMgr.addMainFloatTip('请先选择需要分解的物品');
        }
    }

    private _onConfirm(status: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes != status) {
            return;
        }

        let ronglianList: Protocol.ContainerThing[] = new Array<Protocol.ContainerThing>();
        let containerThing: Protocol.ContainerThing;

        for (let i: number = 0; i < this.fenJieDatas.length; i++) {
            if (this.fenJieDatas[i] != null && this.fenJieDatas[i].thingData != null && this.fenJieDatas[i].thingData.data != null) {
                if (this._sendRonglianData[i] == null) {
                    this._sendRonglianData[i] = {} as Protocol.ContainerThing;
                }
                containerThing = this._sendRonglianData[i];
                ronglianList.push(containerThing);
                containerThing.m_iNumber = this.fenJieDatas[i].thingData.data.m_iNumber;
                containerThing.m_usPosition = this.fenJieDatas[i].thingData.data.m_usPosition;
                containerThing.m_iThingID = this.fenJieDatas[i].thingData.data.m_iThingID;

                this.decomposeUIEffects[i].playEffect(EffectType.Effect_Normal, true, 0.75);
            }

        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRonglianEquipRequest(ronglianList));
    }


    private updateWillGetThing(): void {
        let dropConfig: GameConfig.DropConfigM;
        let cnt: number = 0;
        let isNew: boolean = false;
        for (let thingData of this.fenJieDatas) {
            if (thingData == null) continue;
            dropConfig = DropPlanData.getDropPlanConfig(thingData.thingData.config.m_uiMeltInfo);
            for (let dropthing of dropConfig.m_astDropThing) {
                isNew = true;
                for (let i: number = 0; i < cnt; i++) {
                    if (this.m_rewardData[i].id == dropthing.m_iDropID) {
                        this.m_rewardData[i].number += dropthing.m_uiDropNumber * thingData.thingData.data.m_iNumber;
                        isNew = false;
                        break;
                    }
                }

                if (isNew && dropthing.m_iDropID > 0) {
                    if (cnt >= this.m_rewardData.length) {
                        this.m_rewardData.push(new RewardIconItemData());
                    }
                    this.m_rewardData[cnt].id = dropthing.m_iDropID;
                    this.m_rewardData[cnt].number = dropthing.m_uiDropNumber * thingData.thingData.data.m_iNumber;

                    cnt++;
                }
            }
        }

        for (let i = cnt; i < this.m_rewardData.length; i++) {
            this.m_rewardData[i].id = 0;
        }

        this.m_showData.length = 0;

        for (let i = 0; i < cnt; i++) {
            this.m_showData.push(this.m_rewardData[i]);
        }
        this.updateWillList();
    }

    private selAllSameColor(colorTypes: number[]) {
        this.isOncesTip = true;
        this.isOnceTipMaxNum = true;
        for (let i = 0; i < colorTypes.length; i++) {
            for (let t of this.bagThingDatas) {
                if (t.thingData.config.m_ucColor == this.colors[colorTypes[i]]) {
                    //加入到分解包
                    this.onBagListItem(-1, t, true);
                }
            }
        }
    }

    /**计算所有低战斗力的魂骨 */
    private selToggleLimit(low: boolean, other: boolean) {
        this.removeAll();
        //添加
        for (let t of this.bagThingDatas) {
            if (!GameIDUtil.isHunguEquipID(t.thingData.config.m_iID)) continue;
            if (other) {
                let isOther = G.DataMgr.thingData.isOtherHunguEquip(t.thingData);
                if (isOther) {
                    //加入到分解包
                    this.onBagListItem(-1, t, true);
                    continue;
                }
            }
            if (low) {
                //默认不选择金色魂骨，用于升华
                if (t.thingData.config.m_ucColor == KeyWord.COLOR_GOLD || t.thingData.config.m_ucColor == KeyWord.COLOR_RED) continue;
                let isLow = G.DataMgr.thingData.isLowFightingHunguEquip(t.thingData, Macros.CONTAINER_TYPE_HUNGU_EQUIP);
                if (isLow) {
                    //加入到分解包
                    this.onBagListItem(-1, t, true);
                }
            }
        }
    }

    private removeAll() {
        for (let j = 0, count = this.fenJieDatas.length; j < count; j++) {
            let data = this.fenJieDatas[j];
            if (data != null) {
                this.onFenJieListItem(j);
            }
        }
    }

    private readonly willNumber = 5;

    /**清除 可获得 格子图标 */
    private cleraWillList() {
        //每行5个 list里边没有给，就直接定吧，后续优化...
        //默认显示两行
        this.willGetList.Count = this.calculateGridCount(this.willNumber, 1);

        for (let i = 0; i < this.willGetList.Count; i++) {
            let item = this.willGetList.GetItem(i);
            if (this.willGetIcons[i] == null) {
                this.willGetIcons[i] = new IconItem();
                this.willGetIcons[i].effectRule = EnumEffectRule.none;
                this.willGetIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, ElemFinder.findObject(item.gameObject, "icon"));
            }
            this.willGetIcons[i].updateByRewardIconData(null);
            this.willGetIcons[i].updateIcon();
        }
    }

    /**刷新 可获得 格子显示 */
    private updateWillList() {
        let count = this.calculateGridCount(this.m_showData.length, 1);
        this.willGetList.Count = count;

        for (let i = 0; i < count; i++) {
            let item = this.willGetList.GetItem(i);
            if (this.willGetIcons[i] == null) {
                this.willGetIcons[i] = new IconItem();
                this.willGetIcons[i].effectRule = EnumEffectRule.none;
                this.willGetIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, ElemFinder.findObject(item.gameObject, "icon"));
            }
            this.willGetIcons[i].updateByRewardIconData(this.m_showData[i]);
            this.willGetIcons[i].updateIcon();
        }
    }

    /**刷新 背包 格子显示 */
    private updateBagList() {
        let count = this.calculateGridCount(this.bagThingDatas.length, this.willNumber);
        this.bagList.Count = count;

        for (let i = 0; i < count; i++) {
            if (this.bagIcons[i] == null) {
                //背包中
                let bagRoot = this.bagList.GetItem(i).findObject("bagBg");
                this.bagIcons[i] = new IconItem();
                // this.bagIcons[i].needEffectGrey = true;
                this.bagIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, bagRoot);
                this.bagIcons[i].effectRule = EnumEffectRule.none;
                this.bagIcons[i].arrowType = ArrowType.bag;
                this.bagIcons[i].isCompareAllPetEquip = true;
            }
            let check = this.bagList.GetItem(i).findObject("check");
            let thing = this.bagThingDatas[i];
            if (thing == null) {
                this.bagIcons[i].updateByRewardIconData(null);
                check.SetActive(false);
            }
            else {
                this.bagIcons[i].updateByThingItemData(thing.thingData);
                check.SetActive(thing.num == 0);
            }
            this.bagIcons[i].updateIcon();
        }
    }

    /**
     * 计算格子的数量
     * @param count 当前使用中的格子数
     * @param showLine 默认显示的行
     */
    private calculateGridCount(count: number, showLine: number, addShow: number = 0): number {
        let len = Math.max(count, this.willNumber);
        let line = Math.max(len / this.willNumber, showLine) + addShow;
        line = Math.ceil(line);
        let newCount = line * this.willNumber;
        return newCount;

    }
}

class DecomposeSelectedPanel {
    private gameObject: UnityEngine.GameObject;

    private hunguList: List;
    private petList: List;
    private btnCancel: UnityEngine.GameObject;
    private btnConfirm: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private lastHunguSele = -1;
    private lastPetSele = -1;

    onClickCall: (hungu: number, pet: number) => {};

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;

        this.hunguList = ElemFinder.getUIList(ElemFinder.findObject(go, "hunguEquip/list"));
        this.petList = ElemFinder.getUIList(ElemFinder.findObject(go, "petEquip/list"));
        this.btnCancel = ElemFinder.findObject(go, "buttonNode/btnCancel");
        this.btnConfirm = ElemFinder.findObject(go, "buttonNode/btnConfirm");
        this.mask = ElemFinder.findObject(go, "mask");

        Game.UIClickListener.Get(this.btnCancel).onClick = delegate(this, this.onClickCancel);
        Game.UIClickListener.Get(this.btnConfirm).onClick = delegate(this, this.onClickConfirm);
        Game.UIClickListener.Get(this.mask).onClick = delegate(this, this.onClose);
        this.hunguList.onClickItem = delegate(this, this.onClickHunguListItem);
        this.petList.onClickItem = delegate(this, this.onClickPetListItem);

    }

    setHungList(count: number) {
        this.hunguList.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.hunguList.GetItem(i);
            let name = ElemFinder.findText(item.gameObject, "txtName");
            let str = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, i + 1);
            name.text = str.replace("魂骨", "以下");
        }
    }

    setPetList(count: number, names: string[]) {
        this.petList.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.petList.GetItem(i);
            let name = ElemFinder.findText(item.gameObject, "txtName");
            name.text = uts.format("{0}以下", names[i]);
        }
    }

    private onClickCancel() {
        this.onClose();
    }

    private onClickConfirm() {
        this.onClose();
        this.invokeClickConfirm();
    }

    private onClickHunguListItem(index: number) {
        if (this.lastHunguSele == index) {
            this.hunguList.Selected = -1;
        }
        this.lastHunguSele = this.hunguList.Selected;
    }

    private onClickPetListItem(index: number) {
        if (this.lastPetSele == index)
            this.petList.Selected = -1;
        this.lastPetSele = this.petList.Selected;
    }

    onClose() {
        this.gameObject.SetActive(false);
    }

    onOpen() {
        this.gameObject.SetActive(true);
    }

    private invokeClickConfirm() {
        if (this.onClickCall != null)
            this.onClickCall(this.hunguList.Selected + 1, this.petList.Selected);
    }
}

