import { CustomBehaviour } from "System/uilib/CustomBehaviour";
import { ListItem, List } from "System/uilib/List";

export class FixedList extends CustomBehaviour {
    public static udname = "__list";
    public onClickItem: (index: number) => void = null;
    public onValueChange: (index: number) => void = null;

    private selectedIndex = -1;
    private count: number = 0;
    private items: Array<ListItem> = [];

    constructor(go: UnityEngine.GameObject) {
        super(go);
        this.count = this.cb.GetNumber('count');
        for (let i = 0; i < this.count; i++) {
            let item = new ListItem(this.cb.GetGameObject(i));
            item.OnClick = delegate(this, this.OnClick);
            this.items.push(item);
        }
    }
    get Count(): number {
        return this.count;
    }
    get Selected(): number {
        for (let i = 0; i < this.count; i++) {
            let item = this.items[i];
            if (item.Selected) return i;
        }
        return -1;
    }
    set Selected(val: number) {
        this.singleSelect(val);
    }
    GetItem(index: number): ListItem {
        return this.items[index];
    }
    private OnClick(item: ListItem) {
        if (!item.Selectable) {
            return;
        }
        let index = this.items.indexOf(item);
        this.singleSelect(index);
        if (this.onClickItem != null)
            this.onClickItem(index);
    }
    private singleSelect(index: number) {
        for (let i = 0; i < this.count; i++) {
            let item = this.items[i];
            if (item == null) continue;
            item.Selected = (i == index);
        }

        let valid = index >= 0 && index < this.count;
        if (this.selectedIndex != index) {
            this.selectedIndex = index;
            if (this.onValueChange != null) {
                this.onValueChange(valid ? index : -1);
            }
        }
    }
    public dispose() {
        for (let i = 0; i < this.count; i++) {
            let item = this.items[i];
            if (item) {
                item.dispose();
            }
        }
        this.items = null;
        this._gameObject = null;
        this._transform = null;
        this.onClickItem = null;
        this.onValueChange = null;
        this.cb = null;
    }
}