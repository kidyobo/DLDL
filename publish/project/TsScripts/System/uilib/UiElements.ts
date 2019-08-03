import { List } from "System/uilib/List";
import { FixedList } from "System/uilib/FixedList";
import { GroupList } from "System/uilib/GroupList";
import { ElemFinder } from "System/uilib/UiUtility";
import { TypeCacher } from "System/TypeCacher";
export class UiElements {
    private elems: Game.ElementsMapper = null;
    constructor(elems: Game.ElementsMapper) {
        this.elems = elems;
    }
    getUiElements(name: string): UiElements {
        let elems = this.elems.GetElement(TypeCacher.ElementsMapper, name) as Game.ElementsMapper;
        return new UiElements(elems);
    }
    getElement(name: string): UnityEngine.GameObject {
        return this.elems.GetElement(name);
    }
    getText(name: string): UnityEngine.UI.Text {
        return this.elems.GetElement(TypeCacher.Text, name) as UnityEngine.UI.Text;
    }
    getUIText(name: string): UnityEngine.UI.UIText {
        return this.elems.GetElement(TypeCacher.UIText, name) as UnityEngine.UI.UIText;
    }
    getInputField(name: string): UnityEngine.UI.InputField {
        let i = this.elems.GetElement(TypeCacher.InputField, name) as UnityEngine.UI.InputField;
        if (UnityEngine.Application.platform != UnityEngine.RuntimePlatform.Android) {
            let obj = Game.UIClickListener.Get(i.gameObject);
            obj.onClick = delegate(this, this.onClickInput);
        }
        return i;
    }
    private onClickInput() {
        Game.IosSdk.IosCallUIActiveInit();
    }
    getActiveToggle(name: string): UnityEngine.UI.ActiveToggle {
        return this.elems.GetElement(TypeCacher.ActiveToggle, name) as UnityEngine.UI.ActiveToggle;
    }
    getAnimator(name: string): UnityEngine.Animator {
        return this.elems.GetElement(TypeCacher.Animator, name) as UnityEngine.Animator;
    }
    getImage(name: string): UnityEngine.UI.Image {
        return this.elems.GetElement(TypeCacher.Image, name) as UnityEngine.UI.Image;
    }
    getToggleGroup(name: string): UnityEngine.UI.ActiveToggleGroup {
        return this.elems.GetElement(TypeCacher.ActiveToggleGroup, name) as UnityEngine.UI.ActiveToggleGroup;
    }
    getRawImage(name: string): UnityEngine.UI.RawImage {
        return this.elems.GetElement(TypeCacher.RawImage, name) as UnityEngine.UI.RawImage;
    }
    getRectTransform(name: string): UnityEngine.RectTransform {
        return this.elems.GetElement(TypeCacher.RectTransform, name) as UnityEngine.RectTransform;
    }
    getTransform(name: string): UnityEngine.Transform {
        return this.elems.GetElement(TypeCacher.Transform, name) as UnityEngine.Transform;
    }
    getSlider(name: string): UnityEngine.UI.Slider {
        return this.elems.GetElement(TypeCacher.Slider, name) as UnityEngine.UI.Slider;
    }
    getScrollbar(name: string): UnityEngine.UI.Scrollbar {
        return this.elems.GetElement(TypeCacher.Scrollbar, name) as UnityEngine.UI.Scrollbar;
    }
    getDropdown(name: string): UnityEngine.UI.Dropdown {
        let dropdown = this.elems.GetElement(TypeCacher.Dropdown, name) as UnityEngine.UI.Dropdown;
        //dropdown.Show();
        //dropdown.Hide();
        return dropdown;
    }
    setDropdownSortingOrder(dropdown: UnityEngine.UI.Dropdown, sortingOrder: number) {
        let canvas = dropdown.template.GetComponent(TypeCacher.Canvas) as UnityEngine.Canvas;
        canvas.sortingOrder = sortingOrder;
    }
    getUIGroupList(name: string): GroupList {
        let obj = this.elems.GetElement(name);
        return ElemFinder.getUIGroupList(obj);
    }
    getUIList(name: string): List {
        let obj = this.elems.GetElement(name);
        return ElemFinder.getUIList(obj);
    }
    getUIFixedList(name: string): FixedList {
        let obj = this.elems.GetElement(name);
        return ElemFinder.getUIFixedList(obj);
    }
    getUIPolygon(name: string): Game.UIPolygon {
        return this.elems.GetElement(TypeCacher.UIPolygon, name) as Game.UIPolygon;
    }
    getPanelCount(): number {
        return this.elems.panelCount;
    }
    getPanel(index: number): UnityEngine.GameObject {
        return this.elems.GetPanel(index);
    }

    getUGUIAtals(name: string): Game.UGUIAltas {
        return this.elems.GetElement(TypeCacher.UGUIAltas, name) as Game.UGUIAltas;
    }
    getCamera(name: string): UnityEngine.Camera {
        return this.elems.GetElement(TypeCacher.Camera, name) as UnityEngine.Camera;
    }
}