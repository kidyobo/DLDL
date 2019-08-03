import { ElemFinder } from "System/uilib/UiUtility";
import { CustomBehaviour } from "System/uilib/CustomBehaviour";
import { PoolArray } from "Common/pool/pool";
import { Global as G } from "System/global";

export class ListItem extends CustomBehaviour {
    public data: any = null;
    public _index: number;
    protected selectedState: UnityEngine.GameObject;
    protected selected = false;
    protected itemSize = UnityEngine.Vector2.zero;
    protected type: ListType = ListType.Vertical;
    protected call: (item: ListItem) => void = null;

    protected _selectable = true;

    private clickDelay = -1;

    constructor(go: UnityEngine.GameObject, type: ListType = ListType.Vertical, clickDelay = -1) {
        super(go);
        this.type = type;
        this.selectedState = this.cb.GetGameObject('selectedState');
        this.Selected = this.selected;
        this.data = {};
        this.clickDelay = clickDelay;
        let listener = Game.UIClickListener.Get(this.gameObject);
        listener.onClick = delegate(this, this.onSelfClick);
        if (this.clickDelay >= 0) {
            listener.delay = this.clickDelay;
        }
    }
    protected onSelfClick() {
        if (this.call) {
            this.call(this);
        }
    }
    get Index(): number {
        return this._index;
    }
    set OnClick(call: (item: ListItem) => void) {
        this.call = call;
    }
    get Selected(): boolean {
        return this.selected;
    }
    set Selected(val: boolean) {
        this.selected = val;
        if (this.selectedState != null) this.selectedState.SetActive(this.selected);
    }
    get Selectable(): boolean {
        return this._selectable;
    }
    set Selectable(value: boolean) {
        this._selectable = value;
    }
    get ItemSize(): UnityEngine.Vector2 {
        var rect = this.transform as UnityEngine.RectTransform;
        return rect.sizeDelta;
    }
    set ItemSize(val: UnityEngine.Vector2) {
        this.itemSize = val;
        this.recalcContentSize();
    }
    set Type(val: ListType) {
        this.type = val;
    }
    findText(path: string): UnityEngine.UI.Text {
        return ElemFinder.findText(this.gameObject, path);
    }
    findUIText(path: string): UnityEngine.UI.UIText {
        return ElemFinder.findUIText(this.gameObject, path);
    }
    findUIList(path: string): List {
        let obj = ElemFinder.findObject(this.gameObject, path);
        return ElemFinder.getUIList(obj);
    }
    findRawImage(path: string): UnityEngine.UI.RawImage {
        return ElemFinder.findRawImage(this.gameObject, path);
    }
    findRectTransform(path: string): UnityEngine.RectTransform {
        return ElemFinder.findRectTransform(this.gameObject, path);
    }
    findImage(path: string): UnityEngine.UI.Image {
        return ElemFinder.findImage(this.gameObject, path);
    }
    findInputField(path: string): UnityEngine.UI.InputField {
        return ElemFinder.findInputField(this.gameObject, path);
    }
    findActiveToggle(path: string): UnityEngine.UI.ActiveToggle {
        return ElemFinder.findActiveToggle(this.gameObject, path);
    }
    findSlider(path: string): UnityEngine.UI.Slider {
        return ElemFinder.findSlider(this.gameObject, path);
    }
    findDropdown(path: string): UnityEngine.UI.Dropdown {
        return ElemFinder.findDropdown(this.gameObject, path);
    }
    findObject(path: string): UnityEngine.GameObject {
        return ElemFinder.findObject(this.gameObject, path);
    }
    protected recalcContentSize() {
        var rect = this.transform as UnityEngine.RectTransform;
        rect.sizeDelta = this.itemSize;
    }
    public dispose() {
        this._gameObject = null;
        this._transform = null;
        this.cb = null;
        this.data = null;
        this.call = null;
    }
}

export enum ListType {
    Horizontal = 0,
    Vertical,
}

export class ListAxis {
    private type: ListType = null;
    constructor(type: ListType) {
        this.type = type;
    }
    get row(): string {
        return (this.type == ListType.Vertical) ? 'y' : 'x';
    }
    get col(): string {
        return this.row == 'x' ? 'y' : 'x';
    }
    get scrollDir(): number {
        return this.row == 'x' ? -1 : 1;
    }
    get itemRowDir(): number {
        return this.row == 'x' ? 1 : -1;
    }
    get itemColDir(): number {
        return this.row == 'x' ? -1 : 1;
    }
    get rowDir(): string {
        return (this.type == ListType.Vertical) ? 'vertical' : 'horizontal';
    }
    get colDir(): string {
        return (this.type == ListType.Vertical) ? 'horizontal' : 'vertical';
    }
    get left(): string {
        return (this.type == ListType.Vertical) ? 'left' : 'top';
    }
    get top(): string {
        return (this.type == ListType.Vertical) ? 'top' : 'left';
    }
}

class ItemAppearEffect {
    private static on = true; // 是否开启滑动效果的开关
    static get On(): boolean {
        return Game.ItemAppearEffect != null && this.on;
    }
    private static configs = {
        "0": { axis: 0, axisname: 'x', elasticity: 0.13, delaylevels: [{ count: 10, delay: 0.04 }, { count: 15, delay: 0.03 }, { count: 20, delay: 0.02 }, { count: 30, delay: 0.015 }, { count: 10000, delay: 0.005 }] }
        , "1": { axis: 1, axisname: 'y', elasticity: 0.13, delaylevels: [{ count: 10, delay: 0.03 }, { count: 15, delay: 0.025 }, { count: 20, delay: 0.02 }, { count: 30, delay: 0.015 }, { count: 10000, delay: 0.005 }] }
    }

    static startEffect(item: ListItem, listType: ListType, gridsize: UnityEngine.Vector2, cols: number, rows: number, curStartIndex: number) {
        if (!this.On)
            return;

        let effect = item.gameObject.GetComponent(Game.ItemAppearEffect.GetType()) as Game.ItemAppearEffect;
        if (effect == null) {
            effect = item.gameObject.AddComponent(Game.ItemAppearEffect.GetType()) as Game.ItemAppearEffect;
        }

        let cfg = this.configs[listType];
        let count = cols * rows;
        let delay = 0.01;
        for (let delaylevel of cfg.delaylevels) {
            if (count <= delaylevel.count) {
                delay = delaylevel.delay;
                break;
            }
        }

        effect.Set((item.Index - curStartIndex) * delay, cfg.axis, cfg.elasticity, gridsize[cfg.axisname] / 2, new UnityEngine.Vector2(-1, 1));
    }

    static stopEffect(item: ListItem) {
        if (!this.On)
            return;

        let effect = item.gameObject.GetComponent(Game.ItemAppearEffect.GetType()) as Game.ItemAppearEffect;
        if (effect != null) {
            effect.Stop();
        }
    }
}

class ListItemMgrStrategy {
    protected cfg: List = null;
    protected listbase: ListBase = null;
    protected axis: ListAxis = null;
    protected cols: number = 0;
    protected rows: number = 0;
    constructor(cfg: List, listbase: ListBase) {
        this.cfg = cfg;
        this.listbase = listbase;
        this.axis = new ListAxis(this.cfg.type);
    }
    refresh(slideAppear: boolean) { }
    reallocItems(count: number, onCreatedItem: (elem: UnityEngine.GameObject) => ListItem, onClick: () => void) { }
    setColsAndRows(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
    }
    repositionItems() { }
    recalcContentSize() { }
    getItem(index: number): ListItem { return null; }
    protected get items(): Array<ListItem> {
        return this.listbase.RawItems;
    }
    scroll(offset: UnityEngine.Vector2, size: UnityEngine.Vector2) {
    }
    dispose() {
        this.cfg = null;
        this.listbase = null;
    }
    get FirstShowIndex(): number {
        return 0;
    }
}

class CommonListItemStrategy extends ListItemMgrStrategy {
    refresh(slideAppear: boolean) {
        if (slideAppear)
            this.repositionItems();
    }

    reallocItems(count: number, onCreatedItem: (elem: UnityEngine.GameObject) => ListItem, onClick: (item: ListItem) => void) {
        let contentRect = this.listbase.ContentRect;
        let selects = this.listbase.RawSelecteds;
        let seleted = selects.length == 0 ? -1 : selects[0];
        // when count > Items.Count, create new item
        this.cfg.itemTempl.SetActive(true);
        for (let i = this.items.length; i < count; i++) {
            let item = UnityEngine.GameObject.Instantiate(this.cfg.itemTempl, contentRect.gameObject.transform, true) as UnityEngine.GameObject;
            item.name = "item" + i;

            let rect = item.transform as UnityEngine.RectTransform;
            rect.pivot = new UnityEngine.Vector2(0, 1);
            rect.anchorMin = new UnityEngine.Vector2(0, 1);
            rect.anchorMax = new UnityEngine.Vector2(0, 1);
            rect.localPosition = UnityEngine.Vector3.zero;
            rect.localScale = UnityEngine.Vector3.one;
            let t = onCreatedItem(item);
            t._index = i;
            if (this.cfg.canSelect)
                t.OnClick = onClick;
            t.ItemSize = this.cfg.itemSize;

            this.items.push(t);
        }
        this.cfg.itemTempl.SetActive(false);

        // when count < Items.Count, hide the excess item
        for (let i = count; i < this.items.length; i++) {
            this.items[i].gameObject.SetActive(false);
        }

        // show current all items
        for (let i = 0; i < count; i++) {
            let item = this.items[i];
            item.gameObject.SetActive(true);
            item.Selected = (seleted == i);
        }
    }
    repositionItems() {
        let itemPos = new UnityEngine.Vector2(0, 0);
        let gridsize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        for (let row = 0, r = 0; row < this.rows; row++) {
            let rindex = row * this.cols;
            let ritem = this.items[rindex];
            let rrect = ritem.transform as UnityEngine.RectTransform;

            for (let col = 0, c = 0; col < this.cols; col++) {
                let index = rindex + col;
                if (index >= this.items.length) break;

                let item = this.items[index];
                let rect = item.transform as UnityEngine.RectTransform;
                itemPos[this.axis.col] = this.axis.itemColDir * (this.cfg.padding[this.axis.left] + c);
                itemPos[this.axis.row] = this.axis.itemRowDir * (this.cfg.padding[this.axis.top] + r);
                rect.anchoredPosition = itemPos;
                if (!this.cfg.isGroupList && this.cfg.hasItemAppearEffect)
                    ItemAppearEffect.startEffect(item, this.cfg.type, gridsize, this.cols, this.rows, 0);

                c += gridsize[this.axis.col];
            }

            r += (rrect.sizeDelta[this.axis.row] + this.cfg.spacing[this.axis.row]);
        }
    }
    recalcContentSize() {
        let contentRect = this.listbase.ContentRect;
        let lastSize = contentRect.sizeDelta;
        let axisRowSize = 0;
        for (let row = 0; row < this.rows; row++) {
            let index = row * this.cols;
            let item = this.items[index];
            let rect = item.transform as UnityEngine.RectTransform;
            axisRowSize += rect.sizeDelta[this.axis.row];
            if (row > 0) {
                axisRowSize += this.cfg.spacing[this.axis.row];
            }
        }
        axisRowSize += this.cfg.padding[this.axis.rowDir];
        contentRect.sizeDelta = this.listbase.adjustContentSize(contentRect, axisRowSize);
        if (this.cfg.onContentSizeChange != null && UnityEngine.Vector2.op_Inequality(lastSize, contentRect.sizeDelta)) {
            this.cfg.onContentSizeChange(contentRect.sizeDelta);
        }
    }
    getItem(index: number): ListItem {
        return this.items[index];
    }
    get FirstShowIndex(): number {
        let tmpVec2 = UnityEngine.Vector2.zero;
        Game.Tools.GetAnchoredPosition(this.listbase.ContentRect, tmpVec2);
        let scrollOffset = this.axis.scrollDir * tmpVec2[this.axis.row];
        let gridsize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        let startRow = Math.round(scrollOffset / gridsize[this.axis.row]);
        let startIndex = Math.min(this.listbase.Count, startRow * this.cols);
        startIndex = startIndex < 0 ? 0 : startIndex;
        return startIndex;
    }
}

class VitualListItemStrategy extends ListItemMgrStrategy {
    private lastStartIndex: number = -1;
    private lastEndIndex: number = -1;
    private newIndexs: PoolArray<number> = new PoolArray<number>();
    private hideIndexs: PoolArray<number> = new PoolArray<number>();
    private hideItems: PoolArray<ListItem> = new PoolArray<ListItem>();

    private creatingItems: { [index: number]: boolean } = {};
    private onCreatedItem: (elem: UnityEngine.GameObject) => ListItem = null;
    private onClick: (item: ListItem) => void = null;
    private cacheV2: UnityEngine.Vector2 = null;

    private tmpVec2 = UnityEngine.Vector2.zero;
    private gridsize: UnityEngine.Vector2 = null;

    constructor(cfg: List, listbase: ListBase) {
        super(cfg, listbase);
        if (cfg.canScroll) {
            let scroll: UnityEngine.UI.ScrollRect;
            if (Game.FyScrollRect) {
                scroll = cfg.gameObject.GetComponent(Game.FyScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
            }
            if (!scroll) {
                scroll = cfg.gameObject.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
            }
            scroll.onValueChanged = delegate(this, this.onScrollValueChange);
        }
        this.removeItemTemplOffScreen();
        this.gridsize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
    }
    refresh(slideAppear: boolean) {
        if (slideAppear) {
            let count = this.listbase.Count;
            this.clear();
            this.listbase.Count = count;
            this.listbase.scrollTop();
        } else {
            for (let item of this.items) {
                if (this.hideItems.indexOf(item) > -1) continue;
                if (this.cfg.onVirtualItemChange != null)
                    this.cfg.onVirtualItemChange(item);
            }
        }
    }
    getItem(index: number): ListItem {
        for (let item of this.items) {
            if (item.Index == index)
                return item;
        }
        return null;
    }
    dispose() {
        super.dispose();
        this.onCreatedItem = null;
        this.onClick = null;
    }
    reallocItems(count: number, onCreatedItem: (elem: UnityEngine.GameObject) => ListItem, onClick: (item: ListItem) => void) {
        this.onCreatedItem = onCreatedItem;
        this.onClick = onClick;
        if (count == 0) this.clear();
    }
    recalcContentSize() {
        let contentRect = this.listbase.ContentRect;
        let lastSize = contentRect.sizeDelta;

        let axisRowSize = this.rows * (this.cfg.itemSize[this.axis.row] + this.cfg.spacing[this.axis.row]);
        axisRowSize += this.cfg.padding[this.axis.rowDir];
        contentRect.sizeDelta = this.listbase.adjustContentSize(contentRect, axisRowSize);
        if (this.cfg.onContentSizeChange != null && UnityEngine.Vector2.op_Inequality(lastSize, contentRect.sizeDelta)) {
            this.cfg.onContentSizeChange(contentRect.sizeDelta);
        }
    }
    scroll(offset: UnityEngine.Vector2, size: UnityEngine.Vector2) {
        this.repositionItemsInner(offset[this.axis.row], size[this.axis.row]);
    }
    repositionItems() {
        if (this.cfg.canScroll) {
            Game.Tools.GetAnchoredPosition(this.listbase.ContentRect, this.tmpVec2);
            let scrollOffset = this.axis.scrollDir * this.tmpVec2[this.axis.row];

            Game.Tools.GetRectSize(this.cfg.rectTransform, this.tmpVec2);
            let rectHeight = this.tmpVec2[this.axis.row];

            this.repositionItemsInner(scrollOffset, rectHeight);
        }
    }
    private repositionItemsInner(scrollOffset: number, rectHeight: number) {
        let gridsize = this.gridsize;
        let startRow = Math.floor(scrollOffset / gridsize[this.axis.row]);
        let endRow = Math.floor((scrollOffset + rectHeight) / gridsize[this.axis.row]);
        let startIndex = Math.min(this.listbase.Count, startRow * this.cols);
        let endIndex = Math.min(this.listbase.Count, (endRow + 1) * this.cols);
        startIndex = startIndex < 0 ? 0 : startIndex;
        endIndex = endIndex < 0 ? 0 : endIndex;

        let curStartIndex = 0;
        if (startIndex >= this.lastStartIndex) {
            curStartIndex = Math.max(this.lastEndIndex, startIndex);
        } else {
            curStartIndex = startIndex;
        }

        this.newIndexs.length = 0;
        for (let i = startIndex; i < endIndex; i++) {
            if (i < this.lastStartIndex || i >= this.lastEndIndex) {
                this.newIndexs.push(i);
            }
        }
        this.hideIndexs.length = 0;
        for (let i = this.lastStartIndex; i < this.lastEndIndex; i++) {
            if (i < startIndex || i >= endIndex) {
                this.hideIndexs.push(i);
                if (this.creatingItems[i]) {
                    delete this.creatingItems[i];
                    Game.Invoker.EndInvoke(this.cfg.gameObject, i.toString());
                }
            }
        }
        // collect hide items
        for (let item of this.items) {
            if (this.hideIndexs.indexOf(item.Index) < 0)
                continue;
            if (this.hideItems.indexOf(item) >= 0)
                continue;
            this.hideItems.push(item);
        }
        // new add
        let length = this.newIndexs.length;
        if (length > 0) {
            if (this.cacheV2 == null) {
                this.cacheV2 = new UnityEngine.Vector2(0, 0);
            }
            this.cacheV2.Set(0, 0);
            for (let i = 0; i < length; i++) {
                let index = this.newIndexs.at(i);
                if (this.hideItems.length > 0) {
                    this.onLateCreate(false, index, gridsize, curStartIndex);
                }
                else {
                    if (!this.creatingItems[index]) {
                        this.creatingItems[index] = true;
                        Game.Invoker.BeginInvoke(this.cfg.gameObject, index.toString()
                            , 0.01 * i, delegate(this, this.onLateCreate, true, index, gridsize, curStartIndex));
                    }
                }
            }
        }

        // hide left items
        for (let i = 0, n = this.hideItems.length; i < n; i++) {
            let item = this.hideItems.at(i);
            if (!this.cfg.isGroupList && this.cfg.hasItemAppearEffect) {
                ItemAppearEffect.stopEffect(item);
            }
            this.hideItem(item.gameObject);
        }
        this.lastStartIndex = startIndex;
        this.lastEndIndex = endIndex;
    }
    private onLateCreate(async: boolean, index: number, gridsize: UnityEngine.Vector2, curStartIndex: number) {
        if (async) {
            delete this.creatingItems[index];
        }
        let item = this.createItem();
        item._index = index;
        let rect = item.transform as UnityEngine.RectTransform;
        this.cacheV2[this.axis.col] = this.axis.itemColDir * (this.cfg.padding[this.axis.left] + (item.Index % this.cols) * gridsize[this.axis.col]);
        this.cacheV2[this.axis.row] = this.axis.itemRowDir * (this.cfg.padding[this.axis.top] + (Math.floor(item.Index / this.cols) * gridsize[this.axis.row]));
        rect.anchoredPosition = this.cacheV2;
        let selects = this.listbase.RawSelecteds;
        item.Selected = selects.indexOf(item.Index) >= 0;
        if (this.cfg.onVirtualItemChange != null)
            this.cfg.onVirtualItemChange(item);
        if (!this.cfg.isGroupList && this.cfg.hasItemAppearEffect) {
            ItemAppearEffect.startEffect(item, this.cfg.type, this.gridsize, this.cols, this.rows, curStartIndex);
        }
    }
    private createItem(): ListItem {
        let contentRect = this.listbase.ContentRect;
        let item = this.hideItems.pop();
        if (item != null) return item;

        let itemobj = UnityEngine.GameObject.Instantiate(this.cfg.itemTempl, contentRect, true) as UnityEngine.GameObject;
        itemobj.name = "item";

        item = this.onCreatedItem(itemobj);

        if (this.cfg.canSelect)
            item.OnClick = this.onClick;

        item.ItemSize = this.cfg.itemSize;

        this.items.push(item);
        return item;
    }
    private removeItemTemplOffScreen() {
        let rect = this.cfg.itemTempl.transform as UnityEngine.RectTransform;
        this.hideItem(this.cfg.itemTempl);
        rect.pivot = G.getCacheV2(0, 1);
        rect.anchorMin = G.getCacheV2(0, 1);
        rect.anchorMax = G.getCacheV2(0, 1);
        rect.localScale = G.getCacheV3(1, 1, 1);
        this.cfg.itemTempl.SetActive(true);
    }
    //not use setActive(false) for performance
    private hideItem(go: UnityEngine.GameObject) {
        let rect = go.transform as UnityEngine.RectTransform;
        let pos = rect.anchoredPosition;
        pos.x += 10000;
        pos.y += 10000;
        rect.anchoredPosition = pos;
    }
    private onScrollValueChange(v: UnityEngine.Vector2) {
        this.repositionItems();
    }
    private clear() {
        this.lastStartIndex = 0;
        this.lastEndIndex = 0;
        this.hideItems.length = 0;
        for (let item of this.items) {
            this.hideItems.push(item);
            this.hideItem(item.gameObject);
        }
    }
    get FirstShowIndex(): number {
        return this.lastStartIndex;
    }
}

export class ListBase {
    protected count: number = -1;
    protected items: Array<ListItem> = [];
    protected contentRect: UnityEngine.RectTransform;
    protected itemMgr: ListItemMgrStrategy;
    protected cfg: List = null;
    protected selects: Array<number> = [];
    protected axis: ListAxis = null;
    scrollRect: UnityEngine.UI.ScrollRect = null;
    protected isFyScrollRect = false;
    public clickDelay = -1;
    public slideAppearRefresh: boolean = false;


    constructor(cfg) {
        this.cfg = cfg;
        this.axis = new ListAxis(this.cfg.type);
        this.contentRect = this.createContent();
        this.createScrollable();
        this.initItemMgrStrategy();
    }
    protected initItemMgrStrategy() {
        if (this.cfg.virtualItem)
            this.itemMgr = new VitualListItemStrategy(this.cfg, this);
        else
            this.itemMgr = new CommonListItemStrategy(this.cfg, this);
    }
    set MovementType(type: Game.FyScrollRect.MovementType) {
        if (this.scrollRect) {
            (this.scrollRect as Game.FyScrollRect).movementType = type;
        }
    }
    get FirstShowIndex(): number {
        return this.itemMgr.FirstShowIndex;
    }
    get MultipleChoice(): boolean {
        return this.cfg._multipleChoice;
    }
    set MultipleChoice(val: boolean) {
        this.Selected = -1;
        this.cfg._multipleChoice = val;
    }
    get Count(): number {
        return this.count;
    }
    set Count(val: number) {
        if (this.cfg.itemTempl == null) {
            uts.bugReport("must set itemTempl in list:" + this.cfg.gameObject.name);
        }
        if (this.scrollRect)
            if (this.scrollRect && this.isFyScrollRect && (this.scrollRect as Game.FyScrollRect).movementType == Game.FyScrollRect.MovementType.NoCross) {
                if (ListType.Vertical == this.cfg.type) {
                    (this.scrollRect as Game.FyScrollRect).sliceSize = new UnityEngine.Vector2(0, 1 / val);
                } else {
                    uts.log('sliceSize = ' + 1 / val);
                    (this.scrollRect as Game.FyScrollRect).sliceSize = new UnityEngine.Vector2(1 / val, 0);
                }
            }
        this.reallocItems(val);
    }
    get Selected(): number {
        return this.selects.length > 0 ? this.selects[0] : -1;
    }
    set Selected(val: number) {
        let valid = val >= 0 && val < this.count;
        this.singleSelect(valid ? val : -1);
    }
    get Selecteds(): Array<number> {
        return this.selects;
    }
    set Selecteds(vals: Array<number>) {
        uts.assert(this.MultipleChoice);

        let valid = null != vals && vals.length > 0;
        this.selects = valid ? vals : [];
        for (let item of this.items) {
            item.Selected = this.selects.indexOf(item.Index) >= 0;
        }
    }
    set BeginDragCallback(callback: () => {}) {
        if (this.isFyScrollRect) {
            (this.scrollRect as Game.FyScrollRect).BeginDragCallback = callback;
        }
    }
    set EndDragCallback(callback: () => {}) {
        (this.scrollRect as Game.FyScrollRect).EndDragCallback = callback;
    }
    set OnScrollValueChange(callback: (pos: UnityEngine.Vector2) => void) {
        if (this.scrollRect) {
            this.scrollRect.onValueChanged = callback;
        }
    }
    getItem(index: number): ListItem {
        return this.itemMgr.getItem(index);
    }
    scrollTop() {
        if (!this.cfg.canScroll) return;
        let pos = this.contentRect.anchoredPosition;
        pos[this.axis.row] = 0;
        this.contentRect.anchoredPosition = pos;
        this.itemMgr.repositionItems();
    }
    scrollByAxialRow(axialRow: number) {
        if (!this.cfg.canScroll) return;
        let gridSize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        let pos = this.contentRect.anchoredPosition;
        pos[this.axis.row] = this.axis.scrollDir * gridSize[this.axis.row] * axialRow;
        this.contentRect.anchoredPosition = pos;
        this.itemMgr.repositionItems();
    }
    scrollByAxialTween(axialRow: number, time: number = 0.5) {
        if (!this.cfg.canScroll) return;
        let gridSize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        let v3Pos = this.contentRect.transform.localPosition;
        let listSize = (this.scrollRect.transform as UnityEngine.RectTransform).sizeDelta;
        v3Pos[this.axis.row] = this.axis.scrollDir * gridSize[this.axis.row] * axialRow - listSize[this.axis.row] * 0.5;
        Tween.TweenPosition.Begin(this.contentRect.gameObject, time, v3Pos, false);
    }
    get Size(): UnityEngine.Vector2 {
        return (this.cfg.transform as UnityEngine.RectTransform).sizeDelta;
    }
    set Size(val: UnityEngine.Vector2) {
        let rect = this.cfg.transform as UnityEngine.RectTransform;
        if (UnityEngine.Vector2.op_Inequality(rect.sizeDelta, val)) {
            rect.sizeDelta = val;
            this.reLayoutItems();
        }
    }
    refresh() {
        this.itemMgr.repositionItems();
        this.itemMgr.refresh(this.slideAppearRefresh);
        this.slideAppearRefresh = false;
    }
    private createContent(): UnityEngine.RectTransform {
        if (!this.cfg.canScroll)
            return this.cfg.gameObject.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;

        let content = this.cfg.transform.Find("content");
        if (content != null)
            return content as UnityEngine.RectTransform;

        let contentobj = new UnityEngine.GameObject("content");
        let contentRect = contentobj.AddComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;

        // 为在点击空区域也可拖动，查找有替代方法没
        if (this.cfg.canScroll) {
            G.addUIRaycaster(contentobj);
        }

        contentRect.pivot = new UnityEngine.Vector2(0, 1);
        contentRect.anchorMin = new UnityEngine.Vector2(0, 1);
        contentRect.anchorMax = new UnityEngine.Vector2(0, 1);

        let sizeDelta = (this.cfg.transform as UnityEngine.RectTransform).rect.size;
        sizeDelta[this.axis.row] = 0;
        contentRect.sizeDelta = sizeDelta;

        contentRect.SetParent(this.cfg.transform, false);
        return contentRect;
    }
    private createScrollable() {
        if (!this.cfg.canScroll)
            return;

        let scroll = this.cfg.gameObject.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        if (scroll != null) // is created
            return;

        if (Game.FyScrollRect) {
            scroll = this.cfg.gameObject.AddComponent(Game.FyScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
            this.isFyScrollRect = true;
        } else {
            scroll = this.cfg.gameObject.AddComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        }
        scroll.decelerationRate = 0.01;
        scroll.content = this.contentRect;
        scroll.horizontal = (this.cfg.type == ListType.Horizontal);
        scroll.vertical = !scroll.horizontal;
        this.scrollRect = scroll;
        Game.Tools.Add2DRectMask(this.cfg.gameObject);
    }
    private calcColsAndRows(outval: { cols: number, rows: number }) {
        let gridSize = UnityEngine.Vector2.op_Addition(this.cfg.itemSize, this.cfg.spacing);
        outval.cols = Math.max(1, Math.floor((this.contentRect.sizeDelta[this.axis.col] - this.cfg.padding[this.axis.colDir]) / gridSize[this.axis.col]));
        outval.rows = Math.ceil(this.cfg.Count / outval.cols);
    }
    protected onCreatedItem(item: UnityEngine.GameObject): ListItem {
        return new ListItem(item, this.cfg.type, this.clickDelay);
    }
    protected onClick(item: ListItem) {
        if (!item || !item.Selectable) {
            return;
        }

        if (this.MultipleChoice) {
            this.multiSelect(item, !item.Selected);
        }
        else {
            this.singleSelect(item.Index);
        }

        if (this.cfg.onClickItem != null)
            this.cfg.onClickItem(item.Index);
    }
    protected multiSelect(item: ListItem, isSelected: boolean) {
        item.Selected = isSelected;
        if (item.Selected) {
            if (this.selects.indexOf(item.Index) < 0) {
                this.selects.push(item.Index);
            }
        }
        else {
            let idx = this.selects.indexOf(item.Index);
            if (idx >= 0) {
                this.selects.splice(idx, 1);
            }
        }
    }
    protected singleSelect(index: number) {
        for (let item of this.items) {
            if (!item) continue;
            item.Selected = (item.Index == index);
        }

        let lastSelect = this.selects[0];
        this.selects = index < 0 ? [] : [index];
        if (lastSelect != index && this.cfg.onValueChange != null) {
            this.cfg.onValueChange(index);
        }
    }
    private reallocItems(count: number) {
        if (this.count != count) {
            this.itemMgr.reallocItems(count, delegate(this, this.onCreatedItem), delegate(this, this.onClick));
            this.count = count;
            this.reLayoutItems();
        }
    }
    protected reLayoutItems() {
        let outval = { cols: 0, rows: 0 };
        this.calcColsAndRows(outval);
        this.itemMgr.setColsAndRows(outval.cols, outval.rows);
        this.itemMgr.recalcContentSize();
        this.itemMgr.repositionItems();
    }
    adjustContentSize(contentRect: UnityEngine.RectTransform, axisRowSize: number): UnityEngine.Vector2 {
        let size = contentRect.sizeDelta;
        size[this.axis.row] = axisRowSize;
        let parentTrs = this.cfg.transform as UnityEngine.RectTransform;
        if (this.cfg.canScroll && size[this.axis.row] < parentTrs.sizeDelta[this.axis.row])
            size[this.axis.row] = parentTrs.sizeDelta[this.axis.row];
        return size;
    }
    get RawItems(): Array<ListItem> {
        return this.items;
    }
    get RawSelecteds(): Array<number> {
        return this.selects;
    }
    get ContentRect(): UnityEngine.RectTransform {
        return this.contentRect;
    }
    scroll(offset: UnityEngine.Vector2, size: UnityEngine.Vector2) {
        this.itemMgr.scroll(offset, size);
    }

    public dispose() {
        this.scrollRect = null;
        if (this.itemMgr) {
            this.itemMgr.dispose();
            this.itemMgr = null;
        }
        this.contentRect = null;
        if (this.items) {
            for (let i of this.items) {
                i.dispose();
            }
            this.items = null;
        }

        this.cfg = null;
    }
}

export class List extends CustomBehaviour {
    public onClickItem: (index: number) => void = null;
    public onValueChange: (index: number) => void = null;
    public onVirtualItemChange: (item: ListItem) => void = null;
    public onContentSizeChange = null;

    public itemTempl: UnityEngine.GameObject = null;
    public type: ListType = ListType.Vertical;
    public padding: UnityEngine.RectOffset = new UnityEngine.RectOffset();
    public itemSize: UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    public spacing: UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    public canScroll: boolean = true;
    public _multipleChoice: boolean = false;
    public virtualItem: boolean = false;
    public canSelect: boolean = true;
    public virtualSubList: boolean = false; // just for GroupList
    public isGroupList: boolean = false;
    public hasItemAppearEffect: boolean = true;

    protected baseList: ListBase;

    constructor(go: UnityEngine.GameObject, virtualItem: boolean = false) {
        super(go);
        this.itemTempl = this.cb.GetGameObject('itemTempl');
        this.itemTempl.SetActive(false);
        this.type = this.cb.GetNumber('type');
        if (this.type == 2)  // 兼容老的，将老的{ "None", "Vertical", "VerticalGrid", "Horizontal", "HorizontalGrid" } 映射为新的{"Horizontal", "Vertical"}
            this.type = ListType.Vertical;
        else if (this.type == 3 || this.type == 4)
            this.type = ListType.Horizontal;
        this.padding = this.cb.GetRectOffset('padding');
        this.itemSize = this.cb.GetVector2('itemSize');
        this.spacing = this.cb.GetVector2('spacing');
        this.canScroll = this.cb.GetBool('canScroll');
        this._multipleChoice = this.cb.GetBool('multipleChoice');
        this.virtualItem = this.cb.GetBool('virtualItem') || virtualItem;
        this.canSelect = !this.cb.GetBool('cannotSelect');
        this.virtualSubList = this.cb.GetBool('virtualSubList');
        this.InitBaseList();
    }
    protected InitBaseList() {
        this.baseList = new ListBase(this);
    }
    get MultipleChoice(): boolean {
        return this.baseList.MultipleChoice;
    }
    set MultipleChoice(val: boolean) {
        this.baseList.MultipleChoice = val;
    }
    set MovementType(type: Game.FyScrollRect.MovementType) {
        this.baseList.MovementType = type;
    }
    get FirstShowIndex(): number {
        return this.baseList.FirstShowIndex;
    }
    get Count(): number {
        return this.baseList.Count;
    }
    set Count(val: number) {
        this.baseList.Count = val;
    }
    get Selected(): number {
        return this.baseList.Selected;
    }
    set Selected(val: number) {
        this.baseList.Selected = val;
    }
    get Selecteds(): Array<number> {
        return this.baseList.Selecteds;
    }
    set Selecteds(vals: Array<number>) {
        this.baseList.Selecteds = vals;
    }
    set BeginDragCallback(callback: () => {}) {
        this.baseList.BeginDragCallback = callback;
    }
    set EndDragCallback(callback: () => {}) {
        this.baseList.EndDragCallback = callback;
    }
    set OnScrollValueChange(callback: (pos: UnityEngine.Vector2) => void) {
        this.baseList.OnScrollValueChange = callback;
    }
    set clickDelay(val: number) {
        this.baseList.clickDelay = val;
    }
    Clear() {
        this.baseList.Count = 0;
    }
    SetSlideAppearRefresh() {
        this.baseList.slideAppearRefresh = (true && ItemAppearEffect.On);
    }
    Refresh() {
        this.baseList.refresh();
    }
    GetItem(index: number): ListItem {
        return this.baseList.getItem(index);
    }
    ScrollTop() {
        this.baseList.scrollTop();
    }
    ScrollBottom() {
        this.baseList.scrollRect.verticalNormalizedPosition = 0;
    }
    ScrollByAxialRow(axialRow: number) {
        if (axialRow < 0) {
            axialRow = 0;
        }
        this.baseList.scrollByAxialRow(axialRow);
    }
    scrollByAxialTween(axialRow: number, time: number = 0.5) {
        if (axialRow < 0) {
            axialRow = 0;
        }
        this.baseList.scrollByAxialTween(axialRow, time);
    }
    get Size(): UnityEngine.Vector2 {
        return this.baseList.Size;
    }
    set Size(val: UnityEngine.Vector2) {
        this.baseList.Size = val;
    }
    SetActive(active: boolean) {
        this.gameObject.SetActive(active);
    }
    public dispose() {
        if (this.baseList != null) {
            this.baseList.dispose();
            this.baseList = null;
        }
        this._gameObject = null;
        this._transform = null;
        this.onClickItem = null;
        this.onValueChange = null;
        this.onVirtualItemChange = null;
        this.onContentSizeChange = null;
        this.cb = null;
    }
    // 为了给grouplist调用增加的
    scroll(offset: UnityEngine.Vector2, size: UnityEngine.Vector2) {
        this.baseList.scroll(offset, size);
    }
}

