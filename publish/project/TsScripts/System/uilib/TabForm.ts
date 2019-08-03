import { CommonForm, UILayer, GameObjectGetSet } from "System/uilib/CommonForm";

export abstract class TabSubForm extends CommonForm {
    layer(): UILayer {
        return UILayer.Normal;
    }

    constructor(id: number) {
        super(id);
        this.closeSound = null;
    }
}
/**
 * 具有切换子界面能力的切页抽象类，注意会默认寻找tabGroup子节点和panelRoot子节点（没有则使用根节点作为子界面的父节点）
 */
export abstract class TabForm extends CommonForm {
    private tabChildren: TabSubForm[] = [];
    private tabKeyMap: { [key: number]: number } = {};
    protected tabIds: number[] = [];
    private tabSize: number = 0;
    openedIndex: number = -1;

    protected tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private subOpenArgs: any[];

    constructor(id: number, ...args) {
        super(id);
        uts.assert(null != args);
        let size = args.length;
        uts.assert(size > 0);
        this.tabSize = size;
        for (let i = 0; i < size; i++) {
            if (args[i] != null) {
                let form = (new args[i]) as TabSubForm;
                form.setParentView(this);
                uts.assert(form.Id > 0, '请在KeyWord里定义一个唯一的id，或使用自定义的枚举id，index = ' + i);
                uts.assert(undefined == this.tabKeyMap[form.Id], 'tab页的id必须唯一：' + form.Id);
                this.tabChildren[i] = form;
                this.tabKeyMap[form.Id] = i;
                this.tabIds.push(form.Id);
            }
        }
        this.openSound = null;
    }

    get TabSize(): number {
        return this.tabSize;
    }

    get TabChindren(): TabSubForm[] {
        return this.tabChildren;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        let index = 0;
        while (true) {
            let toggle = this.tabGroup.GetToggle(index);
            if (null != toggle) {
                this.setTabTipMark(index, false);
                index++;
            } else {
                break;
            }
        }
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onTabGroupClick);
    }

    protected processOpenedAlready(args: any[]) {
        super.processOpenedAlready(args);
        if (args.length > 0) {
            let openId = args[0];
            uts.assert(undefined != this.tabKeyMap[openId], 'TabForm::open的第一个参数必须是子页面的id');
            this.switchTabFormById(openId);
        }
    }

    protected onClose() {
        if (this._cacheForm) {
            this.switchTabForm(-1);
            this.tabGroup.Selected = -1;
            this.tabGroup.SetAllTogglesOff();
        }
    }

    protected onDestroy() {
        for (let i of this.tabChildren) {
            i.destroy();
        }
    }

    protected onRelease() {
        this.tabChildren = null;
    }

    protected onTabGroupClick(index: number) {
        this.switchTabForm(index);
    }
    getCurrentTab(): TabSubForm {
        return this.tabChildren[this.openedIndex];
    }
    getTabFormByID(id: number): TabSubForm {
        return this.tabChildren[this.tabKeyMap[id]];
    }
    getTabCount(): number {
        return this.tabChildren.length;
    }
    protected getTabFormByIndex(index: number): TabSubForm {
        return this.tabChildren[index];
    }
    protected switchTabForm(index: number) {
        if (index == this.openedIndex) {
            return;
        }
        let oldForm = this.tabChildren[this.openedIndex];
        let newForm = this.tabChildren[index];
        this.openedIndex = index;
        if (oldForm != null) {
            oldForm.close();
        }
        if (newForm != null) {
            this.openNewForm(newForm);
        }
    }
    switchTabFormById(id: number, ...args) {
        let index = this.tabKeyMap[id];
        if (index == undefined) {
            index = this.getFirstOpenIdx();
        }
        this.subOpenArgs = args;
        if (this.openedIndex == index) {
            let form = this.getCurrentTab();
            this.openNewForm(form);
        } else {
            this.tabGroup.Selected = index;
        }
    }
    private openNewForm(newForm: CommonForm) {
        newForm.createForm(true);
        if (null != this.subOpenArgs && this.subOpenArgs.length > 0) {
            newForm.open.apply(newForm, this.subOpenArgs);
            this.subOpenArgs = null;
        } else {
            newForm.open();
        }
    }

    private getFirstOpenIdx(): number {
        let idx = 0;
        for (let i = 0; i < this.tabSize; i++) {
            if (this.tabGroup.GetToggle(i).gameObject.activeSelf) {
                idx = i;
                break;
            }
        }
        return idx;
    }

    /**
     * 设置页签提示。
     * @param index 页签序号
     * @param isShowTipMark 是否显示提示
     */
    protected setTabTipMark(index: number, isShowTipMark: boolean) {
        let toggle = this.tabGroup.GetToggle(index);
        if (null != toggle) {
            let toggleMark = toggle.transform.Find('tipMark');
            if (null != toggleMark) {
                toggleMark.gameObject.SetActive(isShowTipMark);
            }
        }
    }

    protected setTabTipMarkById(id: number, isShowTipMark: boolean) {
        let index = this.tabKeyMap[id];
        this.setTabTipMark(index, isShowTipMark);
    }

    private tabgetsets: GameObjectGetSet[] = [];
    /**
     * 设置页签提示。
     * @param index 页签序号
     * @param isShowTipMark 是否显示提示
     */
    protected setTabVisible(index: number, visible: boolean) {
        let tabgetset = this.tabgetsets[index];
        if (!tabgetset) {
            let toggle = this.tabGroup.GetToggle(index);
            if (null != toggle) {
                tabgetset = this.tabgetsets[index] = new GameObjectGetSet(toggle.gameObject);
            }
        }
        if (tabgetset) {
            tabgetset.SetActive(visible);
        }
    }

    get TabIds(): number[] {
        return this.tabIds;
    }
}
export default TabForm;