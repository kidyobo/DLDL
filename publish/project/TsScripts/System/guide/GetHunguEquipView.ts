import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { CommonForm, GameObjectGetSet, UILayer } from 'System/uilib/CommonForm';
import { IconModelItem } from '../ItemPanels/IconModelItem';
import { Macros } from '../protocol/Macros';
import { FixedList } from '../uilib/FixedList';
import { ElemFinder } from '../uilib/UiUtility';
import { ThingItemData } from '../data/thing/ThingItemData';
import { KeyWord } from '../constants/KeyWord';


export class GetHunguEquipView extends CommonForm {

    private mask: GameObjectGetSet;
    private equipList: FixedList;
    private itemIcon_Model: UnityEngine.GameObject;
    private tweenIcon: UnityEngine.GameObject;

    private curEquipId: number = 0;
    private curEquipPartIndex: number = 0;
    private iconModelItems: IconModelItem[] = [];
    private tweenIconItem: IconModelItem = null;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GetHunguEquipView;
    }

    protected initElements(): void {
        this.mask = new GameObjectGetSet(this.elems.getElement("mask"));
        this.equipList = this.elems.getUIFixedList("equipList");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");
        this.tweenIcon = this.elems.getElement("tweenIcon");

        let count = this.equipList.Count;
        this.iconModelItems = [];
        for (let i = 0; i < count; i++) {
            let item = new IconModelItem();
            let goitem = this.equipList.GetItem(i).gameObject;
            let icon = ElemFinder.findObject(goitem, "icon");
            item.setIconByPrefab(this.itemIcon_Model, icon)
            item.selectedClose();
            this.iconModelItems.push(item);
        }

        this.tweenIconItem = new IconModelItem();
        this.tweenIconItem.setIconByPrefab(this.itemIcon_Model, ElemFinder.findObject(this.tweenIcon, "icon"));
        this.tweenIconItem.selectedClose();
    }

    protected initListeners(): void {
        this.addClickListener(this.mask.gameObject, this.close);
    }

    open(id: number, part: number) {
        this.curEquipId = id;
        this.curEquipPartIndex = part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
        super.open(id, part);
    }

    protected onOpen() {
        //开始动画
        this.refreshPanel();
        this.playTween();

        this.addTimer("closePanel", 3000, 1, () => {
            this.close();
        })
    }

    protected onClose() {

    }

    private refreshPanel() {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let hunliData = G.DataMgr.hunliData;
        this.updateEquipIcon(equipDatas);
    }

    /**刷新图标显示 */
    private updateEquipIcon(equipDatas: { [position: number]: ThingItemData }) {
        //装备id 是否封装
        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            let itemdata = equipDatas[i];
            let bgicon = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "map");
            bgicon.SetActive(itemdata == null);
            if (itemdata == null || itemdata.config.m_iID == this.curEquipId) {
                this.iconModelItems[i].setIconModelNull();
            }
            else {
                this.iconModelItems[i].setHunguEquipIcon(itemdata);
            }
            this.iconModelItems[i].updateIconShow();
        }

        this.tweenIconItem.setHunguEquipIconById(this.curEquipId);
        this.tweenIconItem.updateIconShow();
        // this.iconModelItems[this.curEquipPartIndex].setHunguEquipIconById(this.curEquipId);
        // this.iconModelItems[this.curEquipPartIndex].updateIconShow();
    }

    private playTween() {
        let pos = this.equipList.GetItem(this.curEquipPartIndex).gameObject.transform.position;
        //模型消失
        let tween = Tween.TweenPosition.Begin(this.tweenIcon, 2, pos, true);
    }

}