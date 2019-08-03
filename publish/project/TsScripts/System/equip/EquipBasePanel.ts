import { TabSubForm } from 'System/uilib/TabForm'
import { FixedList } from 'System/uilib/FixedList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { ThingData } from 'System/data/thing/ThingData'
import { EnumEffectRule } from 'System/constants/GameEnum'

export abstract class EquipBasePanel extends TabSubForm {
    /**左侧显示可选择的进阶装备list*/
    protected equipList: FixedList = null;
    protected equipIcons: IconItem[] = [];

    //protected oldSelectedIdx = -1;

    protected itemIcon_Normal: UnityEngine.GameObject;

    //protected itemSelected: UnityEngine.GameObject;

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        //this.itemSelected = this.elems.getElement('itemSelected');
        //属性对比
        this.equipList = ElemFinder.getUIFixedList(this.elems.getElement('equipList'));
    }

    protected initEquipList(arrowType: ArrowType, needFinalColor: boolean = true, showRebirthLv: boolean = false) {
        let cnt = ThingData.All_EQUIP_NUM - 2;
        for (let i = 0; i < cnt; i++) {
            let itemobj = this.equipList.GetItem(i);
            let itemGo = itemobj.findObject('equip');
            let iconItem = new IconItem();
            iconItem.arrowType = arrowType;
            iconItem.needWuCaiColor = needFinalColor;
            iconItem.showRebirthLv = showRebirthLv;
            iconItem.showBg = true;
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, itemGo);
            this.equipIcons[i] = iconItem;
        }
    }

    protected initListeners() {
        this.equipList.onClickItem = delegate(this, this.onClickEquipList);
        this.equipList.onValueChange = delegate(this, this.onEquipListValueChange);
    }

    getSelectedItem(index = -1): UnityEngine.GameObject {
        let selected = this.equipList.Selected;
        if (index >= 0 && selected != index) {
            selected = index;
            this.equipList.Selected = index;
            this.onClickEquipList(index);
        }
        if (selected >= 0) {
            return this.equipList.GetItem(selected).gameObject;
        }
        return null;
    }

    protected onEquipListValueChange(index: number) {
        //if (index >= 0) {
        //    let iconRoot = this.equipIcons[index].iconRoot;
        //    if (this.itemSelected.transform.parent != this.itemSelected.transform) {
        //        this.itemSelected.transform.SetParent(iconRoot.transform, false);
        //    }
        //    this.itemSelected.SetActive(true);
        //} else {
        //    let iconRoot = this.equipIcons[this.oldSelectedIdx].iconRoot;
        //    if (this.itemSelected.transform.parent == this.itemSelected.transform) {
        //        this.itemSelected.SetActive(false);
        //    }
        //}
        //this.oldSelectedIdx = index;
    }

    protected abstract onClickEquipList(index: number);
}