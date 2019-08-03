import { List } from "System/uilib/List";
import { FixedList } from "System/uilib/FixedList";
import { GroupList } from "System/uilib/GroupList";
import { TypeCacher } from "System/TypeCacher";
export class ElemFinder {
    static findText(go: UnityEngine.GameObject, path: string): UnityEngine.UI.Text {
        return Game.Tools.GetChildElement(go, TypeCacher.Text, path) as UnityEngine.UI.Text;
    }
    static findUIText(go: UnityEngine.GameObject, path: string): UnityEngine.UI.UIText {
        return Game.Tools.GetChildElement(go, TypeCacher.UIText, path) as UnityEngine.UI.UIText;
    }
    static findRawImage(go: UnityEngine.GameObject, path: string): UnityEngine.UI.RawImage {
        return Game.Tools.GetChildElement(go, TypeCacher.RawImage, path) as UnityEngine.UI.RawImage;
    }
    static findImage(go: UnityEngine.GameObject, path: string): UnityEngine.UI.Image {
        return Game.Tools.GetChildElement(go, TypeCacher.Image, path) as UnityEngine.UI.Image;
    }
    static findInputField(go: UnityEngine.GameObject, path: string): UnityEngine.UI.InputField {
        return Game.Tools.GetChildElement(go, TypeCacher.InputField, path) as UnityEngine.UI.InputField;
    }
    static findActiveToggle(go: UnityEngine.GameObject, path: string): UnityEngine.UI.ActiveToggle {
        return Game.Tools.GetChildElement(go, TypeCacher.ActiveToggle, path) as UnityEngine.UI.ActiveToggle;
    }
    static findActiveToggleGroup(go: UnityEngine.GameObject, path: string): UnityEngine.UI.ActiveToggleGroup {
        return Game.Tools.GetChildElement(go, TypeCacher.ActiveToggleGroup, path) as UnityEngine.UI.ActiveToggleGroup;
    }
    static findSlider(go: UnityEngine.GameObject, path: string): UnityEngine.UI.Slider {
        return Game.Tools.GetChildElement(go, TypeCacher.Slider, path) as UnityEngine.UI.Slider;
    }
    static findDropdown(go: UnityEngine.GameObject, path: string): UnityEngine.UI.Dropdown {
        return Game.Tools.GetChildElement(go, TypeCacher.Dropdown, path) as UnityEngine.UI.Dropdown;
    }
    static findObject(go: UnityEngine.GameObject, path: string): UnityEngine.GameObject {
        return Game.Tools.GetChild(go, path);
    }
    static findRectTransform(go: UnityEngine.GameObject, path: string): UnityEngine.RectTransform {
        return Game.Tools.GetChildElement(go, TypeCacher.RectTransform, path) as UnityEngine.RectTransform;
    }
    static findTransform(go: UnityEngine.GameObject, path: string): UnityEngine.Transform {
        return Game.Tools.GetChildElement(go, TypeCacher.Transform, path) as UnityEngine.Transform;
    }
    static getUIGroupList(go: UnityEngine.GameObject): GroupList {
        let list = (go as any)._list as GroupList;
        if (list == null) {
            list = new GroupList(go);
        }
        return list;
    }
    static getUIList(go: UnityEngine.GameObject): List {
        let list = (go as any)._list as List;
        if (list == null) {
            list = new List(go);
        }
        return list;
    }
    static getUIFixedList(go: UnityEngine.GameObject): FixedList {
        let list = (go as any)._list as FixedList;
        if (list == null) {
            list = new FixedList(go);
        }
        return list;
    }
}


export class ElemFinderMySelf {

    static findAltas(go: UnityEngine.GameObject): Game.UGUIAltas {
        return go.GetComponent(TypeCacher.UGUIAltas) as Game.UGUIAltas;
    }

    static findImage(go: UnityEngine.GameObject): UnityEngine.UI.Image {
        return go.GetComponent(TypeCacher.Image) as UnityEngine.UI.Image;
    }

    static findRectTransForm(go: UnityEngine.GameObject): UnityEngine.RectTransform {
        return go.GetComponent(TypeCacher.RectTransform) as UnityEngine.RectTransform;
    }

    static findText(go: UnityEngine.GameObject): UnityEngine.UI.Text {
        return go.GetComponent(TypeCacher.Text) as UnityEngine.UI.Text;
    }

    static findAnimator(go: UnityEngine.GameObject): UnityEngine.Animator {
        return go.GetComponent(TypeCacher.Animator) as UnityEngine.Animator;
    }

    static findAudioSource(go: UnityEngine.GameObject): UnityEngine.AudioSource {
        return go.GetComponent(UnityEngine.AudioSource.GetType()) as UnityEngine.AudioSource;
    }
}