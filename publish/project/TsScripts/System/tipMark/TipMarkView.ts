import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'

class TipMarkItem {
    private textName: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        go.gameObject.transform.localScale =  UnityEngine.Vector3.one;
    }
    
    update(tipName: string) {
        this.textName.text = tipName;
    }
}

export class TipMarkView extends NestedSubForm {
    private mask: UnityEngine.GameObject;
    private list: List;
    private listItems: TipMarkItem[] = [];

    public static tipMarks: BaseTipMark[];

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
        this.rootPath = 'root';
    }

    protected resPath(): string {
        return UIPathData.TipMarkView;
    }

    protected initElements() {
        this.mask = this.elems.getElement('mask');
        this.list = this.elems.getUIList('list');
    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickMask);
        this.addListClickListener(this.list, this.onClickList);
    }
    protected onClose() {
    }
    protected onOpen() {
        this.doUpdateView();
    }

    open() {     
        super.open();
    }

    updateView(): void {
        this.doUpdateView();
    }

    private doUpdateView() {
        let count = 0;
        if (null != TipMarkView.tipMarks) {
            count = TipMarkView.tipMarks.length;
        }
        let oldItemCnt: number = this.listItems.length;
        this.list.Count = count;
        let item: TipMarkItem;
        for (let i: number = 0; i < count; i++) {
            if (i < oldItemCnt) {
                item = this.listItems[i];
            } else {
                this.listItems.push(item = new TipMarkItem());
            }
            item.setComponents(this.list.GetItem(i).gameObject);
            item.update(TipMarkView.tipMarks[i].TipName);
        }
    }

    private onClickList(index: number) {
        TipMarkView.tipMarks[index].action();
        this.close();
    }

    private onClickMask() {
        this.close();
    }
}