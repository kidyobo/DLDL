import { KeyWord } from 'System/constants/KeyWord';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { BeautyEquipListItemData } from 'System/data/vo/BeautyEquipListItemData';
import { Global as G } from 'System/global';
import { HunguEquipItem } from 'System/hunli/HunguSelectView';
import { ItemTipData } from 'System/tip/tipData/ItemTipData';
import { ItemTipBase } from 'System/tip/view/ItemTipBase';
import { CommonForm, UILayer } from 'System/uilib/CommonForm';
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';


export class BagEquipView extends CommonForm {
    private readonly MinDisplayCnt = 5;

    /**穿装备列表*/
    private bagEquipList: List;
    //private bagEquipItems: IconItem[] = [];
    private bagEquipItems: HunguEquipItem[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;
    //private btnReturn: UnityEngine.GameObject;
    private txtTitle: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;

    private openPetOrZhufuId = 0;
    private openWearedItemData: ThingItemData;
    private equipDatas: BeautyEquipListItemData[];

    private wearedTip: ItemTipBase = new ItemTipBase();
    private bagTip: ItemTipBase = new ItemTipBase();
    private wearedIconItem: IconItem = new IconItem();

    private tipPanelOwn: UnityEngine.GameObject;
    private tipPanel: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.BagEquipView;
    }
    protected initElements(): void {
        this.mask = this.elems.getElement("mask");
        this.txtTitle = this.elems.getText('txtTitle');
        this.bagEquipList = this.elems.getUIList('equipList');

        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        // 当前身上的穿的装备
        this.tipPanelOwn = this.elems.getElement('tipPanelOwn');
        let wearedElems = this.elems.getUiElements('tipPanelOwn');
        this.wearedTip.setBaseInfoComponents(wearedElems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.wearedTip.setEquipInfoComponents(wearedElems.getElement('equipInfo'), wearedElems.getUiElements('equipInfo'));

        // 当前选中的装备
        this.tipPanel = this.elems.getElement('tipPanel');
        let bagElems = this.elems.getUiElements('tipPanel');
        this.bagTip.setBaseInfoComponents(bagElems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.bagTip.setEquipInfoComponents(bagElems.getElement('equipInfo'), bagElems.getUiElements('equipInfo'));
    }
    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickReturnBtn);
        this.addListClickListener(this.bagEquipList, this.onClickBagEquipIcon);
    }

    open(petOrZhufuId: number, wearedItemData: ThingItemData, equipDatas: BeautyEquipListItemData[]) {
        this.openPetOrZhufuId = petOrZhufuId;
        this.openWearedItemData = wearedItemData;
        this.equipDatas = equipDatas;
        super.open();
    }

    protected onOpen() {
        this.updateBagEquip();
    }

    protected onClose() {
    }


    private updateBagEquip() {
        this.txtTitle.text = this.getTitleStr(this.openPetOrZhufuId);
        this.equipDatas.sort(delegate(this, this.sortEquipItem));
        let equipCnt = this.equipDatas.length;
        // 显示完整的行数
        let showEquipCnt = equipCnt;
        this.bagEquipList.Count = showEquipCnt;

        let oldIconCnt = this.bagEquipItems.length;
        for (let i: number = 0; i < showEquipCnt; i++) {
            let item = this.bagEquipList.GetItem(i);
            let iconItem: HunguEquipItem;
            if (i < oldIconCnt) {
                iconItem = this.bagEquipItems[i];
            } else {
                iconItem = new HunguEquipItem();
                iconItem.setComponents(this.bagEquipList.GetItem(i).gameObject, this.itemIcon_Normal, i, this.openPetOrZhufuId);
                iconItem.iconItem.arrowType = ArrowType.bag;
                this.bagEquipItems.push(iconItem);
            }
            let itemData: BeautyEquipListItemData;
            if (i < equipCnt) {
                itemData = this.equipDatas[i];
                itemData.petOrZhufuId = this.openPetOrZhufuId;
            } else {
                itemData = null;
            }
            iconItem.update(itemData.thingItemData);
            iconItem.iconItem.updateByBeautyEquipListItemData(itemData);
            iconItem.iconItem.updateIcon();
            iconItem.onClickButton = delegate(this, this.onClickListButton);
        }
        if (equipCnt > 0) {
            // 有装备就默认选中第一件
            this.bagEquipList.Selected = 0;
            this.onClickBagEquipIcon(0);
        } else {
            // 没装备则显示提示
            this.bagEquipList.Selected = -1;
            this.tipPanel.SetActive(false);
        }

        if (null != this.openWearedItemData && null != this.openWearedItemData.config) {
            this.wearedIconItem.updateByThingItemData(this.openWearedItemData);
            let wearedItemTipData = this.wearedIconItem.getTipData() as ItemTipData;
            wearedItemTipData.isWearing = true;
            this.wearedTip.updateInfo(wearedItemTipData);
            this.tipPanelOwn.SetActive(true);
        } else {
            this.tipPanelOwn.SetActive(false);
        }
    }

    private onClickListButton(index: number) {
        //魂骨界面打开
        G.ActionHandler.takeOnEquip(this.equipDatas[index].thingItemData, this.openPetOrZhufuId);
    }

    private onClickBagEquipIcon(index: number) {
        let len = this.equipDatas.length;
        if (index < 0 || index >= len) {
            return;
        }
        let itemData = this.equipDatas[index];

        this.tipPanel.SetActive(true);

        //物品信息
        let item = this.bagEquipItems[index];
        let itemdata = item.iconItem.getTipData() as ItemTipData;
        //伙伴信息
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.openPetOrZhufuId);
        if (pet != null) {
            if (itemData.thingItemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || itemData.thingItemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
       
            }
            else {
                let awakeLevel = pet.m_stAwake.m_ucLevel;
                if (awakeLevel >= itemdata.configData.m_ucRequiredLevel)
                    this.bagTip.setPetCanUse();
                else
                    this.bagTip.setPetCannotUse();
            }
        }
        else {
            this.bagTip.setPetCanUse();
        }
        this.bagTip.updateInfo(item.iconItem.getTipData() as ItemTipData);
    }

    private onClickReturnBtn() {
        this.close();
    }

    /**排序装备列表*/
    private sortEquipItem(a: BeautyEquipListItemData, b: BeautyEquipListItemData): number {
        let aShowUp = a.showUp ? 1 : 0;
        let bShowUp = b.showUp ? 1 : 0;
        if (aShowUp != bShowUp) {
            return bShowUp - aShowUp;
        }
        return b.thingItemData.zdl - a.thingItemData.zdl;
    }

    /**
     * 根据类型得到要显示的标题
     * @param key 伙伴ID/祝福类关键字
     */
    private getTitleStr(key: number): string {
        if (key == KeyWord.HERO_SUB_TYPE_ZUOQI) {
            return "坐骑装备";
        }

        if (key == KeyWord.HERO_SUB_TYPE_WUHUN) {
            return "神器装备";
        }

        if (key == KeyWord.HERO_SUB_TYPE_FAZHEN) {
            return "魔瞳境界";
        }

        if (key == KeyWord.HERO_SUB_TYPE_YUYI) {
            return "翅膀装备";
        }
        if (key == KeyWord.HERO_SUB_TYPE_LEILING) {
            return "迷踪境界";
        }

        if (key == KeyWord.BAR_FUNCTION_REBIRTH) {
            return "魂骨装备";
        }

        return "伙伴装备";
    }
}