import { Global as G } from "System/global";
import ThingData from "../data/thing/ThingData";
import { Macros } from "../protocol/Macros";
import { TipFrom } from "../tip/view/TipsView";
import { GameObjectGetSet, TextGetSet } from "../uilib/CommonForm";
import { IconItem } from "../uilib/IconItem";
import { ElemFinder } from "../uilib/UiUtility";
import { Color } from "../utils/ColorUtil";
import { TextFieldUtil } from "../utils/TextFieldUtil";
import { UIUtils } from "../utils/UIUtils";



/**消耗材料节点
 *      预制体位置：HunguIntensifyPanel--consumeMaterialItem
 *      标题 + 材料 + 一个按钮
 */
export class ConsumeMaterialItem {

    protected gameObject: UnityEngine.GameObject;

    protected txtTitle: UnityEngine.UI.Text;
    protected iconItemNode: GameObjectGetSet;
    protected iconItem: IconItem;
    protected txtIconName: UnityEngine.UI.Text;
    protected txtNumber: UnityEngine.UI.Text;

    protected buttonDescribe: UnityEngine.GameObject;
    protected txtDescribe: UnityEngine.UI.Text;
    public btnFirst: UnityEngine.GameObject;
    protected txtFirstButtonName: TextGetSet;

    private materialId: number = 0;
    private materialHas: number = 0;
    private materialNeed: number = 0;

    onClick: () => void;

    setComponents(go: UnityEngine.GameObject, iconitem: UnityEngine.GameObject) {
        this.gameObject = go;

        this.txtTitle = ElemFinder.findText(go, "txtTitle");
        this.iconItemNode = new GameObjectGetSet(ElemFinder.findObject(go, "iconItemNode"));
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(iconitem, ElemFinder.findObject(go, "iconItemNode/iconItem"))
        this.iconItem.setTipFrom(TipFrom.normal);
        this.txtIconName = ElemFinder.findText(go, "iconItemNode/txtIconName");
        this.txtNumber = ElemFinder.findText(go, "iconItemNode/txtNumber");

        this.buttonDescribe = ElemFinder.findObject(go, "buttonDescribe");
        this.txtDescribe = ElemFinder.findText(go, "buttonDescribe/txtDescribe");
        this.btnFirst = ElemFinder.findObject(go, "btnConfirm");
        this.txtFirstButtonName = new TextGetSet(ElemFinder.findText(go, "btnConfirm/name"));

        Game.UIClickListener.Get(this.btnFirst).onClick = delegate(this, this.onClickConfirm);
    }

    setTitle(name: string) {
        this.txtTitle.text = name;
    }

    setIconName(name: string) {
        this.txtIconName.text = name;
    }

    setDescribe(des: string) {
        this.txtDescribe.text = des;
    }

    setDescribeActive(isOpen: boolean) {
        this.buttonDescribe.gameObject.SetActive(isOpen);
    }

    setFirstButtonAction(isOpen: boolean) {
        this.btnFirst.SetActive(isOpen);
    }

    setFirstButtonGrey(grey: boolean) {
        UIUtils.setGrey(this.btnFirst, grey);
    }

    setFirstButtonName(name: string) {
        this.txtFirstButtonName.text = name;
    }

    updateIconById(id: number, count: number = 1) {
        this.iconItem.updateById(id, count);
        this.iconItem.updateIcon();
    }

    updateByMaterialItemData(id: number, need: number) {
        this.materialId = id;
        this.materialHas = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.materialNeed = need;
        this.txtNumber.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", this.materialHas.toString(), need.toString()), this.materialHas < need ? Color.RED : Color.GREEN);
        let data = ThingData.getThingConfig(id);
        if (data != null)
            this.txtIconName.text = ThingData.getThingConfig(id).m_szName;
        this.iconItem.updateById(id);
        this.iconItem.updateIcon();
    }

    getMaterialSatisfy(): boolean {
        return this.materialHas >= this.materialNeed;
    }

    getMaterialNumber(): [number, number] {
        return [this.materialHas, this.materialNeed];
    }

    getMaterialId(): number {
        return this.materialId;
    }

    close() {
        this.gameObject.SetActive(false);
    }

    open() {
        this.gameObject.SetActive(true);
    }

    private onClickConfirm() {
        if (this.onClick != null)
            this.onClick();
    }
}

/**
 *  两个按钮
 */
export class ConsumeMaterialItemOneKey extends ConsumeMaterialItem {
    onClickSecondLeft: () => void;
    onClickSecondRight: () => void;

    private btnSecondLeft: GameObjectGetSet;
    private btnSecondRight: GameObjectGetSet;
    private txtSecondLeftButtonName: TextGetSet;
    private txtSecondRightButtonName: TextGetSet;


    setComponents(go: UnityEngine.GameObject, iconitem: UnityEngine.GameObject) {
        super.setComponents(go, iconitem);

        this.btnSecondLeft = new GameObjectGetSet(ElemFinder.findObject(go, "btnSecondLeft"));
        this.btnSecondRight = new GameObjectGetSet(ElemFinder.findObject(go, "btnSecondRight"));

        Game.UIClickListener.Get(this.btnSecondLeft.gameObject).onClick = delegate(this, this.invokeClickSecondLeft);
        Game.UIClickListener.Get(this.btnSecondRight.gameObject).onClick = delegate(this, this.invokeClickSecondRight);

        this.txtSecondLeftButtonName = new TextGetSet(ElemFinder.findText(go, "btnSecondLeft/name"));
        this.txtSecondRightButtonName = new TextGetSet(ElemFinder.findText(go, "btnSecondRight/name"));
    }

    private invokeClickSecondLeft() {
        if (this.onClickSecondLeft != null)
            this.onClickSecondLeft();
    }

    private invokeClickSecondRight() {
        if (this.onClickSecondRight != null)
            this.onClickSecondRight();
    }

    setSecondLeftButtonGray(gray: boolean) {
        this.btnSecondLeft.grey = gray;
    }

    setSecondRightButtonGray(gray: boolean) {
        this.btnSecondRight.grey = gray;
    }

    setSecondLeftButtonName(name: string) {
        this.txtSecondLeftButtonName.text = name;
    }

    setSecondRightButtonName(name: string) {
        this.txtSecondRightButtonName.text = name;
    }

    setSecondButtonActive(active: boolean) {
        this.btnSecondLeft.SetActive(active);
        this.btnSecondRight.SetActive(active);
    }
}

/**
 *  两个按钮 + 一个toggle
 */
export class ConsumeMaterialItemOneToggle extends ConsumeMaterialItemOneKey {
    private toggle: UnityEngine.UI.ActiveToggle;
    private txtToggleDescribe: TextGetSet;
    private txtActivateTip: TextGetSet;

    setComponents(go: UnityEngine.GameObject, iconitem: UnityEngine.GameObject) {
        super.setComponents(go, iconitem);
        this.toggle = ElemFinder.findActiveToggle(go, "toggle");
        this.txtToggleDescribe = new TextGetSet(ElemFinder.findText(go, "toggle/txtToggleDescribe"));
        this.txtActivateTip = new TextGetSet(ElemFinder.findText(go, "txtActivateTip"));
    }

    get toogleIsOn() {
        return this.toggle.isOn;
    }

    setToggleDescribe(des: string) {
        this.txtToggleDescribe.text = des;
    }

    setActivateTipAction(open: boolean) {
        this.txtActivateTip.gameObject.SetActive(open);
        this.toggle.gameObject.SetActive(!open);
        this.iconItemNode.SetActive(!open);
    }

    setActivateTip(des: string) {
        this.txtActivateTip.text = des;
    }
}