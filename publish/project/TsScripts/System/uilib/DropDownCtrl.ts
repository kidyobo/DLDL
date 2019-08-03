import { Global as G } from 'System/global'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { TypeCacher } from 'System/TypeCacher'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'

class DropDownListItem extends ListItemCtrl {
    private textLabel: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    index = -1;
    label: string;

    private ctrl: DropDownCtrl;

    constructor(ctrl: DropDownCtrl) {
        super();
        this.ctrl = ctrl;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.textLabel = ElemFinder.findText(go, 'bg/textLabel');
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClick);
    }

    update(index: number, label: string) {
        this.index = index;
        this.label = label;
        this.textLabel.text = label;
    }

    private onClick() {
        this.ctrl.onClickItem(this.index);
    }
}

export class DropDownCtrl {
    private mask: UnityEngine.GameObject;

    private list: UnityEngine.GameObject;
    private itemTemplate: UnityEngine.GameObject;
    private items: DropDownListItem[] = [];

    private textValue: UnityEngine.UI.Text;
    gameObject: UnityEngine.GameObject;

    onValueChanged: (index: number) => void;
    private selectedIdx = -1;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;

        let mapper = go.GetComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper;
        let elems = new UiElements(mapper);

        let com = elems.getElement('com');

        this.mask = elems.getElement('mask');
        this.list = elems.getElement('list');
        this.itemTemplate = elems.getElement('itemTemplate');
        let item = new DropDownListItem(this);
        item.setComponents(this.itemTemplate);
        this.items.push(item);

        this.textValue = elems.getText('textValue');

        this.showHideOptions(false);

        Game.UIClickListener.Get(com).onClick = delegate(this, this.onClickGameObject);
        Game.UIClickListener.Get(this.mask).onClick = delegate(this, this.onClickMask);
    }

    addOptions(labels: string[]) {
        let cnt = labels.length;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: DropDownListItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new DropDownListItem(this));
                item.setComponents(UnityEngine.GameObject.Instantiate(this.itemTemplate, this.list.transform, true) as UnityEngine.GameObject);
            }
            item.update(i, labels[i]);
            this.items[i].gameObject.SetActive(true);
        }
        for (let i = cnt; i < oldItemCnt; i++) {
            this.items[i].gameObject.SetActive(false);
        }
        this.OptionIndex = 0;
    }

    set OptionIndex(index: number) {
        if (this.selectedIdx != index) {
            this.selectedIdx = index;
            this.updateValue(index);
        }
    }

    get OptionIndex(): number {
        return this.selectedIdx;
    }

    private onClickGameObject() {
        this.showHideOptions(true);
    }

    onClickItem(index: number) {
        this.OptionIndex = index;
        this.updateValue(index);
        if (null != this.onValueChanged) {
            this.onValueChanged(index);
        }
    }

    private updateValue(index: number) {
        this.textValue.text = this.items[index].label;
        this.showHideOptions(false);
    }

    private onClickMask() {
        this.showHideOptions(false);
    }

    private showHideOptions(isShow: boolean) {
        this.mask.SetActive(isShow);
        this.list.gameObject.SetActive(isShow);
    }
}