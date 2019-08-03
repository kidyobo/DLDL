import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from "./CurrencyTip";
import TabForm, { TabSubForm } from "./TabForm";
import { ElemFinder } from "./UiUtility";
import { Global as G } from 'System/global';
import { TypeCacher } from 'System/TypeCacher'

export abstract class TabSubFormCommon extends TabSubForm {
    layer(): UILayer {
        return UILayer.Normal;
    }

    constructor(id: number) {
        super(id);
    }

    private tabFormCommom: TabFormCommom;
    setTabFormCommon(tabform: TabFormCommom) {
        this.tabFormCommom = tabform;
    }

    protected setTitleFight(val: number) {
        let form = this.tabFormCommom;
        if (form != null) {
            form.setFightActive(true);
            form.setFightNumber(val);
        }
    }

    protected closeTitleFight() {
        let form = this.tabFormCommom;
        if (form != null)
            form.setFightActive(false);
    }

}

/**
 * 具有切换子界面能力的切页抽象类，注意会默认寻找tabGroup子节点和panelRoot子节点（没有则使用根节点作为子界面的父节点）
 */
export abstract class TabFormCommom extends TabForm {

    private readonly TAB_NUMBER_MAX = 11;

    //新添加的 统一化东西 底部：tabs 上边：标题 战斗力 货币 关闭按钮
    /**tabContent节点 */
    private tabContentBase: UnityEngine.GameObject;
    /**页面名字*/
    private txtTitleNameBase: UnityEngine.UI.Text;
    /**战斗力节点 */
    private nodeFightBase: UnityEngine.GameObject;
    /**战斗力数值 */
    private txtFightBase: UnityEngine.UI.Text;
    /**货币预制体 */
    private currencyObj: UnityEngine.GameObject;
    /**关闭按钮 */
    private btnClose: UnityEngine.GameObject;
    private tabChildrenObjs: UnityEngine.GameObject[];
    constructor(id: number, ...args) {
        super(id, ...args);

        let size = args.length;
        for (let i = 0; i < size; i++) {
            if (args[i] != null) {
                let form = this.TabChindren[i] as TabSubFormCommon;
                if (form instanceof TabSubFormCommon) {
                    form.setTabFormCommon(this);
                }
            }
        }
    }

    protected initElements() {
        //创建tabContent,并格式化位置等信息
        this.tabContentBase = UnityEngine.GameObject.Instantiate(this.elems.getElement("tabContent"), this.elems.getTransform("content"), false) as UnityEngine.GameObject;
        let element = this.tabContentBase.GetComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper;
        //let tabContentRect = this.tabContentBase.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        //tabContentRect.SetAsLastSibling();
        let tabGroup = ElemFinder.findObject(this.tabContentBase, "tabNode/tabGroup");
        let tabItem = ElemFinder.findObject(this.tabContentBase, "tabNode/tabGroup/tabItem");
        this.tabGroup = tabGroup.GetComponent(TypeCacher.ActiveToggleGroup) as UnityEngine.UI.ActiveToggleGroup;
        //这里因为tabItem自己就是孩子，所以从1开始
        this.tabChildrenObjs = [];
        this.tabChildrenObjs.push(tabItem);
        for (let i = 1; i < this.TabSize; i++) {
            this.tabChildrenObjs.push(Game.Tools.Instantiate(tabItem, tabGroup, false));
        }

        this.txtTitleNameBase = ElemFinder.findText(this.tabContentBase, "topNode/title/titleName");
        this.nodeFightBase = ElemFinder.findObject(this.tabContentBase, "topNode/title/titleName/finght");
        this.txtFightBase = ElemFinder.findText(this.nodeFightBase, "txtNumber");
        this.currencyObj = ElemFinder.findObject(this.tabContentBase, "topNode/currencyTip");
        this.btnClose = ElemFinder.findObject(this.tabContentBase, "topNode/btnClose");
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onTabGroupClick);
    }

    protected onTabGroupClick(index: number) {
        this.switchTabForm(index);
    }


    protected setTitleName(titleName: string) {
        this.txtTitleNameBase.text = titleName;
    }

    public setFightNumber(val: number) {
        this.txtFightBase.text = Math.floor(val).toString();
    }

    public setFightActive(active: boolean) {
        this.nodeFightBase.SetActive(active);
    }

    /**
    * 设置名字 设置小红点位置
    * @param names
    */
    protected setTabGroupNanme(names: string[]) {
        let len = names.length;
        for (let i = 0; i < len; i++) {
            let toggle = this.tabGroup.GetToggle(i);
            if (null != toggle) {
                //设置文字
                let t = toggle.transform.Find('name').GetComponent(TypeCacher.Text) as UnityEngine.UI.Text;
                if (t != null) {
                    t.text = names[i];
                }
            }
        }
    }

    protected getCurrencyTip(): UnityEngine.GameObject {
        return this.currencyObj;
    }

    protected getCloseButton(): UnityEngine.GameObject {
        return this.btnClose;
    }

    protected getTitleFight(): UnityEngine.UI.Text {
        return this.txtFightBase;
    }

    protected getTitleFightingNode(): UnityEngine.GameObject {
        return this.nodeFightBase;
    }

}
export default TabFormCommom;