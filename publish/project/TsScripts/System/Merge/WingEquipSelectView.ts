import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { Macros } from "System/protocol/Macros";
import { KeyWord } from "System/constants/KeyWord";
import { GuidUtil } from "System/utils/GuidUtil";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from "System/uilib/IconItem"
import { EquipUtils } from "System/utils/EquipUtils"
import { GameIDUtil } from "System/utils/GameIDUtil"
import { ThingData } from "System/data/thing/ThingData"
import { EquipStrengthenData } from "System/data/EquipStrengthenData"
import { InsertDiamondItemData } from "System/equip/InsertDiamondItemData"
import { Color } from "System/utils/ColorUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { List } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { WingEquipMergePanel } from 'System/Merge/WingEquipMergePanel'
import { ItemMergeView } from 'System/Merge/ItemMergeView'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TipFrom } from 'System/tip/view/TipsView'


class WingEquipSelectItem {
    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;
    private icon: UnityEngine.GameObject;
    private iconItem: IconItem;
    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
        this.icon = ElemFinder.findObject(go, "icon");

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
    }

    update(data: ThingItemData) {
        this.iconItem.updateByThingItemData(data);
        this.iconItem.updateIcon();
        let color = 0;
        if (data && data.data) {
            color = G.DataMgr.equipStrengthenData.getWingEquipColor(data.config, data.data);
        }
        this.txtName.text = TextFieldUtil.getColorText(data.config.m_szName, Color.getColorById(color));
        this.txtValue.text = "";
    }

}

export class WingEquipSelectView extends CommonForm {

    /**背包中的宝石*/
    private bagDatas: ThingItemData[];
    private pos: number = 0;

    private itemListCtrl: List = null;
    private btnTakeOff: UnityEngine.GameObject = null;
    private btnClose: UnityEngine.GameObject = null;
    private mask: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    private WingEquipSelectItem: WingEquipSelectItem[] = [];

    constructor() {
        super(0);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.WingEquipSelectView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemListCtrl = this.elems.getUIList("itemListCtrl");
        this.btnTakeOff = this.elems.getElement("btnTakeOff");
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");

    }
    protected initListeners(): void {
        this.addListClickListener(this.itemListCtrl, this.onItemClick);
        this.addClickListener(this.btnClose, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
        this.addClickListener(this.btnTakeOff, this.onBtnTakeOff);
    }

    open(pos: number, bagDatas: ThingItemData[]) {
        this.pos = pos;
        this.bagDatas = bagDatas;
        super.open();
    }


    protected onOpen() {
        this.updatePanel();
    }

    protected onClose() {
        this.itemListCtrl.Count = 0;
    }

    private updatePanel(): void {
        if (!this.bagDatas)
            return;

        if (GameIDUtil.isEquipmentID(this.bagDatas[0].config.m_iID)) {
            this.bagDatas.sort(this.sortByFight);
        }

        this.itemListCtrl.Count = this.bagDatas.length;
        for (let i = 0; i < this.itemListCtrl.Count; i++) {
            let data = this.bagDatas[i];
            let obj = this.itemListCtrl.GetItem(i).gameObject;
          
            if (this.WingEquipSelectItem[i] == null) {
                this.WingEquipSelectItem[i] = new WingEquipSelectItem();
                this.WingEquipSelectItem[i].setComponents(obj, this.itemIcon_Normal);
            }
            this.WingEquipSelectItem[i].update(data)
        }
    }

    private sortByFight(a: ThingItemData, b: ThingItemData) {
        let fightA = 0;
        let fightB = 0;
        if (a && a.data && a.data.m_stThingProperty) {
            let wingStrengthCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(a.config.m_iID, a.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress);
            if (wingStrengthCfg)
                fightA = FightingStrengthUtil.calStrength(wingStrengthCfg.m_astPropAtt);
        }
        if (b && b.data && b.data.m_stThingProperty) {
            let wingStrengthCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(b.config.m_iID, b.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress);
            if (wingStrengthCfg)
                fightB = FightingStrengthUtil.calStrength(wingStrengthCfg.m_astPropAtt);
        }
        return fightA - fightB;
    }

    /**
     * 物品点击
     * @param index
     */
    private onItemClick(index: number): void {
        let data = this.bagDatas[index];
        if (data) {
            let panel = G.Uimgr.getSubFormByID<WingEquipMergePanel>(ItemMergeView, KeyWord.OTHER_FUNCTION_MERGE_WING);
            if (panel) {
                panel.replacePutInData(this.pos, data)
            }
            this.close();
        }
    }




    /**
     * 关闭按钮
     */
    private onBtnClose() {
        this.close();
    }

    /**
    * 卸下按钮
    */
    private onBtnTakeOff() {
        this.close();
    }
}