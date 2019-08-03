import { ListType, ListBase, List, ListItem, ListAxis } from "System/uilib/List";

export class GroupListItem extends ListItem {
    public onContentSizeChange = null;

    private catalogItem: UnityEngine.GameObject = null;
    private children: List = null;

    private axis: ListAxis = null;
    private virtualSubList = false;

    constructor(go: UnityEngine.GameObject, type: ListType, virtualSubList: boolean) {
        super(go, type);
        this.virtualSubList = virtualSubList;
        this.axis = new ListAxis(this.type);
        this.catalogItem = this.cb.GetGameObject('catalogItem');
        if (this.catalogItem != null) {
            let rect = this.catalogItem.transform as UnityEngine.RectTransform;
            let pivot = rect.pivot;
            pivot[this.axis.col] = 0.5;
            pivot[this.axis.row] = this.axis.row == 'x' ? 0 : 1;
            rect.pivot = pivot;
            rect.anchorMin = new UnityEngine.Vector2(0, 1);
            rect.anchorMax = new UnityEngine.Vector2(0, 1);
            let pos = rect.anchoredPosition;
            pos[this.axis.col] = this.axis.itemColDir * rect.rect.size[this.axis.col] / 2;
            pos[this.axis.row] = 0;
            rect.anchoredPosition = pos;
        }

        let children = this.cb.GetGameObject('children');
        if (children != null) {
            this.children = new List(children, this.virtualSubList);
            this.children.onContentSizeChange = delegate(this, this.onChildContentSizeChange);
        }

        if (children != null && this.catalogItem != null) {
            let catalogrect = this.catalogItem.transform as UnityEngine.RectTransform;
            let rect = children.transform as UnityEngine.RectTransform;
            rect.pivot = new UnityEngine.Vector2(0, 1);
            rect.anchorMin = new UnityEngine.Vector2(0, 1);
            rect.anchorMax = new UnityEngine.Vector2(0, 1);
            let pos = rect.anchoredPosition;
            pos[this.axis.col] = 0;
            pos[this.axis.row] = this.axis.itemRowDir * catalogrect.rect.size[this.axis.row];
            rect.anchoredPosition = pos;
        }
        if (this.catalogItem != null) {
            Game.UIClickListener.Get(this.catalogItem).onClick = delegate(this, this.onSelfClick);
        }
    }
    get Selected(): boolean {
        return this.selected;
    }
    set Selected(val: boolean) {
        this.selected = val;
        if (this.selectedState != null) this.selectedState.SetActive(this.selected);
        if (this.children != null) this.children.SetActive(this.selected);
        this.recalcContentSize();
    }
    get Children(): List {
        return this.children;
    }
    setChildrenSize(axisRowSize: number) {
        let size = this.children.Size;
        size[this.axis.row] = axisRowSize;
        this.children.Size = size;
        this.recalcContentSize();
    }
    private onChildContentSizeChange(size: UnityEngine.Vector2) {
        this.recalcContentSize();
    }
    protected recalcContentSize() {
        let rect = this.gameObject.transform as UnityEngine.RectTransform;
        let lastSize = rect.sizeDelta;
        rect.sizeDelta = this.itemSize;
        if (this.selected && this.children != null && this.children.Count > 0) {
            let size = this.children.Size;
            size[this.axis.row] = this.itemSize[this.axis.row] + this.children.Size[this.axis.row];
            rect.sizeDelta = size;
        }

        if (this.onContentSizeChange != null && UnityEngine.Vector2.op_Inequality(lastSize, rect.sizeDelta)) {
            this.onContentSizeChange(this, rect.sizeDelta);
        }
    }
    public dispose() {
        super.dispose();
        this.onContentSizeChange = null;
        if (this.children) {
            this.children.dispose();
            this.children = null;
        }
    }
}

class GroupListBase extends ListBase {
    private tmpVec2 = UnityEngine.Vector2.zero;
    private offsetVec2 = UnityEngine.Vector2.zero;
    private sizeVec2 = UnityEngine.Vector2.zero;
    private openItem: GroupListItem = null;
    private needScrollChange = false;
    constructor(cfg: GroupList) {
        super(cfg);
        this.needScrollChange = (this.cfg as GroupList).virtualSubList && cfg.canScroll;
        if (this.needScrollChange) {
            let scroll: UnityEngine.UI.ScrollRect;
            if(Game.FyScrollRect) {
                scroll = cfg.gameObject.GetComponent(Game.FyScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
            }            
            if(!scroll) {
                scroll = cfg.gameObject.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
            }
            scroll.onValueChanged = delegate(this, this.onScrollValueChange);
        }
    }

    refresh() {
        super.refresh();
        if (this.openItem) {
            if (this.needScrollChange) {
                this.sizeVec2.Set(0, 0);
                this.openItem.Children.scroll(this.offsetVec2, this.sizeVec2);
            }
            this.onScrollValueChange(null);
        }
    }

    getSubList(index: number): List {
        let item = this.getItem(index) as GroupListItem;
        if (item == null)
            return null;
        return item.Children;
    }

    get Selected(): number {
        return this.selects.length > 0 ? this.selects[0] : -1;
    }

    set Selected(val: number) {
        let validRange = val >= 0 && val < this.count;
        let item = this.items[val] as GroupListItem;
        let valid = validRange;
        this.singleSelect(valid ? val : -1);
        if (this.needScrollChange&&this.openItem) {
            this.sizeVec2.Set(0, 0);
            this.openItem.Children.scroll(this.offsetVec2, this.sizeVec2);
        }
        if (valid) {
            this.openItem = item;
            this.refreshSubList();
        }
        else {
            // clear last open sublist
            if (this.openItem) {
                this.openItem = null;
            }
        }
    }

    protected onClick(item: GroupListItem) {
        let index = this.items.indexOf(item);
        if (item != null) {
            this.Selected = item.Selected ? -1 : index; // toggle item select
        }
        if (this.cfg.onClickItem != null) {
            this.cfg.onClickItem(index);
        }
    }

    protected onCreatedItem(item: UnityEngine.GameObject): ListItem {
        let cfg = this.cfg as GroupList;
        let t = new GroupListItem(item, this.cfg.type, (this.cfg as GroupList).virtualSubList);
        t.onContentSizeChange = delegate(this, this.onItemSizeChange);
        return t;
    }

    private onItemSizeChange(item: GroupListItem, size: UnityEngine.Vector2) {
        if (!this.cfg.canScroll) { // fill mode
            this.setChildrenSize(item, this.Count);
        }

        if (item != null && item.Children.Count == 0 && item.Selected) {
            item.Selected = false;
        }

        this.reLayoutItems();
    }

    private setChildrenSize(item: GroupListItem, count: number) {
        let gridSize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        let prect = this.cfg.gameObject.transform as UnityEngine.RectTransform;
        let subsize = prect.sizeDelta[this.axis.row] - gridSize[this.axis.row] * count;
        if (subsize <= 0)
            return;
        item.setChildrenSize(subsize);
    }

    adjustContentSize(contentRect: UnityEngine.RectTransform, axisRowSize: number): UnityEngine.Vector2 {
        let size = super.adjustContentSize(contentRect, axisRowSize);
        if (!this.cfg.canScroll) {
            let parentTrs = this.cfg.gameObject.transform as UnityEngine.RectTransform;
            size[this.axis.row] = parentTrs.sizeDelta[this.axis.row];
        }
        return size;
    }

    private refreshSubList() {
        if (this.needScrollChange) {
            this.onScrollValueChange(null);
        }
        else {
            if (this.openItem == null) return;
            this.openItem.Children.Refresh();
        }
    }

    private onScrollValueChange(v: UnityEngine.Vector2) {
        if (this.openItem == null) return;

        Game.Tools.GetAnchoredPosition(this.contentRect, this.tmpVec2);
        let scrollOffsetRow = this.axis.scrollDir * this.tmpVec2[this.axis.row];
        let scrollOffsetCol = this.tmpVec2[this.axis.col];

        Game.Tools.GetGameObjectAnchoredPosition(this.openItem.gameObject, this.tmpVec2);
        let itemOffsetRow = this.axis.scrollDir * this.tmpVec2[this.axis.row];
        let itemOffsetCol = this.tmpVec2[this.axis.col];

        Game.Tools.GetGameObjectAnchoredPosition(this.openItem.Children.gameObject, this.tmpVec2);
        let subListOffsetRow = this.axis.scrollDir * this.tmpVec2[this.axis.row];
        let subListOffsetCol = this.tmpVec2[this.axis.col];

        Game.Tools.GetGameObjectRectSize(this.cfg.gameObject, this.sizeVec2);

        let offsetCol = scrollOffsetCol + itemOffsetCol + subListOffsetCol;
        let offsetRow = scrollOffsetRow + itemOffsetRow + subListOffsetRow;
        this.offsetVec2[this.axis.col] = offsetCol;
        this.offsetVec2[this.axis.row] = offsetRow;

        this.openItem.Children.scroll(this.offsetVec2, this.sizeVec2);
    }

    public dispose() {
        super.dispose();
        this.openItem = null;
    }
}

export class GroupList extends List {
    protected InitBaseList() {
        this.isGroupList = true;
        this.baseList = new GroupListBase(this);
    }

    public GetSubList(index: number): List {
        return (this.baseList as GroupListBase).getSubList(index);
    }
}