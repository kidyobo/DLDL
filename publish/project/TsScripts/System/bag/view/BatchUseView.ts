import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { ThingItemData } from "System/data/thing/ThingItemData"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from "System/uilib/IconItem"
import { NumInput } from 'System/uilib/NumInput'
import { EnumEffectRule } from 'System/constants/GameEnum'

/**
 * 批量使用
 */
export class BatchUseView extends CommonForm {

    private selectData: ThingItemData;
    /**要显示的物品*/
    private icon: UnityEngine.GameObject = null;
    private txtName: UnityEngine.UI.Text = null;
    private txtAllCount: UnityEngine.UI.Text = null;
    private btnUse: UnityEngine.GameObject = null;
    /**数量输入*/
    private numInput: NumInput;
    private btnMax: UnityEngine.GameObject = null;
    private btnCancel: UnityEngine.GameObject = null;

    private itemIcon_Normal: UnityEngine.GameObject;
    private thingIcon: IconItem;

    private mask: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.BatchUseView;
    }

    open(item: ThingItemData) {
        this.selectData = item;
        super.open();
    }
    protected onOpen() {
        this.updateView();
    }
    protected onClose() {

    }

    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.icon = this.elems.getElement("icon");
        this.txtName = this.elems.getText("txtName");
        this.txtAllCount = this.elems.getText("txtAllCount");
        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.btnUse = this.elems.getElement('btnUse');
        this.btnMax = this.elems.getElement('btnMax');
        this.btnCancel = this.elems.getElement('btnCancel');
        this.mask = this.elems.getElement("mask");
        this.thingIcon = new IconItem();
        this.thingIcon.effectRule = EnumEffectRule.none;
        this.thingIcon.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);

    }
    protected initListeners(): void {
        this.addClickListener(this.btnMax, this.onBtnMax);
        this.addClickListener(this.btnUse, this.onBtnUse);
        this.addClickListener(this.btnCancel, this.onBtnCancel);
        this.addClickListener(this.mask, this.onBtnClose);
    }

    /**
    * 最大
    */
    private onBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }

    /**
     * 使用
     */
    private onBtnUse(): void {
        G.ModuleMgr.bagModule.useThing(this.selectData.config, this.selectData.data, this.numInput.num);
        this.close();
    }
    /**
     * 取消
     */
    private onBtnCancel(): void {
        this.close();
    }
    /**
     * 关闭
     */
    private onBtnClose(): void {
        this.close();
    }
    private updateView() {
        if (this.selectData != null) {
            this.thingIcon.updateByThingItemData(this.selectData);
            this.thingIcon.updateIcon();
            let num = this.selectData.data.m_iNumber;
            this.txtAllCount.text = num.toString();
            this.txtName.text = this.selectData.config.m_szName.toString();
            this.numInput.setRange(1, num, 1, num);
        }
    }
}