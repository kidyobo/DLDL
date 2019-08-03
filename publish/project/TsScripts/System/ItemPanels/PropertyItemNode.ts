import { KeyWord } from 'System/constants/KeyWord';
import { ThingData } from "System/data/thing/ThingData";
import { Global as G } from "System/global";
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { GameObjectGetSet, TextGetSet } from '../uilib/CommonForm';
import { FightingStrengthUtil } from '../utils/FightingStrengthUtil';

/**
 * 单条属性 例如：生命 1235
 */
class PropertyItemNode {
    private txtName: TextGetSet;
    private txtValue: TextGetSet;

    private attId: number;
    private attValue: number;
    private nameColor: string = Color.WHITE;
    private firstColor: string = Color.GREEN;

    constructor(go: UnityEngine.GameObject) {
        this.txtName = new TextGetSet(ElemFinder.findText(go, "txtName"));
        this.txtValue = new TextGetSet(ElemFinder.findText(go, "txtValue"));
    }

    refreshProperty(name: number, val: number) {
        this.attId = name;
        this.attValue = val;
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, name), this.nameColor);
        this.txtValue.text = TextFieldUtil.getColorText(val.toString(), this.firstColor);
    }

    getFighting(): number {
        return FightingStrengthUtil.calStrengthByOneProp(this.attId, this.attValue);
    }

    setNameColor(color: string) {
        this.nameColor = color;
    }

    setFirstColor(color: string) {
        this.firstColor = color;
    }
}

/**
 * 单条属性+1   例如：生命 1235  +1358
 */
class PropertyItemDoubleNode extends PropertyItemNode {
    private txtSecondMsg: TextGetSet;
    private goLink: GameObjectGetSet;

    protected isOpenSecond: boolean = true;
    protected secondColor: string = Color.GREEN;

    constructor(go: UnityEngine.GameObject) {
        super(go);
        this.txtSecondMsg = new TextGetSet(ElemFinder.findText(go, "txtSecondMsg"));
        this.goLink = new GameObjectGetSet(ElemFinder.findObject(go, "goLink"));
    }

    refreshSecondProperty(val: number) {
        this.txtSecondMsg.gameObject.SetActive(this.isOpenSecond);
        this.goLink.gameObject.SetActive(this.isOpenSecond);
        this.txtSecondMsg.text = TextFieldUtil.getColorText(val.toString(), this.secondColor);
    }


    setSecondActive(active: boolean) {
        this.isOpenSecond = active;
    }

    setSecondColor(color: string) {
        this.secondColor = color;
    }

}

/**一组属性 属性列表 
        预制体位置：PetJinJie--PetJuexingPanel--attributeListPanel
 */
export class PropertyListNode {
    protected gameObject: UnityEngine.GameObject;

    protected list: List;
    protected items: PropertyItemNode[] = [];

    protected dicProperty: { [key: number]: number } = {};
    protected listPropertyKeys: number[] = [];
    protected propertyCount: number = 0;

    protected txtTitle: UnityEngine.UI.Text;

    private nameColor: string = Color.WHITE;
    private firstColor: string = Color.WHITE;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.txtTitle = ElemFinder.findText(go, "txtTitle");
        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, "list"));
    }

    setNameColor(color: string) {
        this.nameColor = color;
    }

    setFirstColor(color: string) {
        this.firstColor = color;
    }

    setTitle(str: string, color: string = Color.YELLOW) {
        this.txtTitle.text = TextFieldUtil.getColorText(str, color);
    }

    refreshPropertyForDatas(atts: GameConfig.BeautyPropAtt[]) {
        this.list.Count = atts.length;
        let len = atts.length;
        let itemcount = this.items.length;

        for (let i = 0; i < len; i++) {
            if (i >= itemcount) {
                this.items.push(new PropertyItemNode(this.list.GetItem(i).gameObject));
            }
            this.items[i].refreshProperty(atts[i].m_ucPropId, atts[i].m_iPropValue);
        }
    }

    clearProperty() {
        this.dicProperty = {};
        this.listPropertyKeys = [];
        this.propertyCount = 0;
    }

    addProperty(name: number, val: number) {
        if (this.dicProperty[name] == null) {
            this.dicProperty[name] = val;
            this.listPropertyKeys.push(name);
        }
        else {
            this.dicProperty[name] += val;
        }
    }

    refreshPropertyNode() {
        let itemcount = this.listPropertyKeys.length;
        this.list.Count = itemcount;
        for (let i = 0; i < itemcount; i++) {
            let key = this.listPropertyKeys[i];
            if (i >= this.items.length) {
                this.items.push(new PropertyItemNode(this.list.GetItem(i).gameObject));
            }
            this.items[i].refreshProperty(key, this.dicProperty[key])
            this.items[i].setNameColor(this.nameColor);
            this.items[i].setFirstColor(this.firstColor);
        }
    }

    getFighting(): number {
        let allFight = 0;
        for (let i = 0, con = this.items.length; i < con; i++) {
            allFight += this.items[i].getFighting();
        }
        return allFight;
    }

    showNode() {
        this.gameObject.SetActive(true);
    }

    hideNode() {
        this.gameObject.SetActive(false);
    }
}

/**套装属性 一组 */
export class PropertyWholeListNode {
    private gameObject: UnityEngine.GameObject;

    private txtTitle: TextGetSet;
    private txtNumber: TextGetSet;
    private propList: List;
    private attributeWholeItem: PropertyListNode[] = [];

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.txtTitle = new TextGetSet(ElemFinder.findText(go, "txtTitle"));
        this.txtNumber = new TextGetSet(ElemFinder.findText(go, "txtNumber"));
        this.propList = ElemFinder.getUIList(ElemFinder.findObject(go, "propList"));
    }

    refreshNode(att: GameConfig.HunGuTZConfigM[], curCount: number) {
        let count = att.length;
        this.propList.Count = count;
        for (let i = 0; i < count; i++) {
            let data = att[i];
            if (this.attributeWholeItem.length <= i) {
                let attitem = new PropertyListNode();
                attitem.setComponents(this.propList.GetItem(i).gameObject);
                this.attributeWholeItem.push(attitem);
            }

            let item = this.attributeWholeItem[i];
            let propCount = data.m_astProp.length;
            item.clearProperty();
            for (let j = 0; j < propCount; j++) {
                item.addProperty(data.m_astProp[j].m_ucPropId, data.m_astProp[j].m_iPropValue);
            }
            let isGreen = curCount >= data.m_iNumber;
            let str = uts.format("[收集{0}件]", data.m_iNumber);
            item.setTitle(TextFieldUtil.getColorText(str, isGreen ? Color.GREEN : Color.GREY))
            item.setFirstColor(isGreen ? Color.GREEN : Color.GREY);
            item.setNameColor(isGreen ? Color.GREEN : Color.GREY);
            item.refreshPropertyNode();
        }
    }

    setTitle(name: string) {
        this.txtTitle.text = name;
    }

    setNumber(number: string) {
        this.txtNumber.text = number;
    }

    showNode() {
        this.gameObject.SetActive(true);
    }

    hideNode() {
        this.gameObject.SetActive(false);
    }

    hideTitleAndAtt() {
        this.txtNumber.gameObject.SetActive(false);
        this.txtTitle.gameObject.SetActive(false);
        this.propList.gameObject.SetActive(false);
    }
    showTitleAndAtt() {
        this.txtNumber.gameObject.SetActive(true);
        this.txtTitle.gameObject.SetActive(true);
        this.propList.gameObject.SetActive(true);
    }
}

/**一组属性 有额外信息的 */
export class PropertyItemDoubleListNode {

    protected gameObject: UnityEngine.GameObject;

    protected list: List;
    protected items: PropertyItemDoubleNode[] = [];

    protected dicAttribute: { [key: number]: [number, number] } = {};
    protected listAttributeKeys: number[] = [];
    protected attributeCount: number = 0;

    protected txtTitle: UnityEngine.UI.Text;

    protected firstColor: string = Color.GREEN;
    protected secondColor: string = Color.GREEN;
    protected isOpenSecond: boolean = true;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.txtTitle = ElemFinder.findText(go, "txtTitle");
        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, "list"));
    }

    setFirstColor(color: string) {
        this.firstColor = color;
    }

    setSecondColor(color: string) {
        this.secondColor = color;
    }

    setSecondActive(active: boolean) {
        this.isOpenSecond = active;
    }

    clearAttribute() {
        this.dicAttribute = {};
        this.listAttributeKeys = [];
        this.attributeCount = 0;
    }

    addAttribute(name: number, val: number) {
        if (this.dicAttribute[name] == null) {
            this.dicAttribute[name] = [val, 0];
            this.listAttributeKeys.push(name);
        }
        else {
            this.dicAttribute[name][0] += val;
        }
    }

    addScendAttribute(name: number, val: number) {
        if (this.dicAttribute[name] == null) {
            this.dicAttribute[name] = [0, val];
            this.listAttributeKeys.push(name);
        }
        else {
            this.dicAttribute[name][1] += val;
        }
    }

    updateAttributeNodeShow() {
        let itemcount = this.listAttributeKeys.length;
        this.list.Count = itemcount;
        for (let i = 0; i < itemcount; i++) {
            let key = this.listAttributeKeys[i];
            if (i >= this.items.length) {
                this.items.push(new PropertyItemDoubleNode(this.list.GetItem(i).gameObject));
            }
            this.updateAttribute(this.items[i], key, this.dicAttribute[key][0], this.dicAttribute[key][1]);
        }
    }

    protected updateAttribute(item: PropertyItemDoubleNode, key: number, val: number, sval: number) {
        item.setFirstColor(this.firstColor);
        item.setSecondColor(this.secondColor);
        item.setSecondActive(this.isOpenSecond);
        item.refreshProperty(key, val)
        item.refreshSecondProperty(sval);
    }
}


/**材料 */
export class ItemMaterialInfo {
    protected thingId = 0;

    protected txtName: UnityEngine.UI.Text;
    protected imgIcon: UnityEngine.UI.RawImage;
    protected txtValue: UnityEngine.UI.Text;
    protected btnIcon: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtTitle");
        this.imgIcon = ElemFinder.findRawImage(go, "imgIcon");
        this.txtValue = ElemFinder.findText(go, "txtValue");
        this.btnIcon = ElemFinder.findObject(go, "imgIcon");
        Game.UIClickListener.Get(this.btnIcon).onClick = delegate(this, this.onClickIcon);
    }

    setName(name: string) {
        this.txtName.text = name;
    }

    /**
     * 设置图标
     * @param id 材料图标id
     */
    setIconForMat(id: number) {
        G.ResourceMgr.loadIcon(this.imgIcon, id.toString());
    }

    /**
    * 设置图标
    * @param id 物品id
    */
    setIconForObject(id: number) {
        let data = ThingData.getThingConfig(id);
        G.ResourceMgr.loadIcon(this.imgIcon, data.m_szIconID.toString());
        this.thingId = id;
    }

    setValue(number: number) {
        this.txtValue.text = number.toString();
    }

    setValueForString(str: string) {
        this.txtValue.text = str;
    }

    private onClickIcon() {
        if (this.thingId != 0) {
            let item = new IconItem();
            item.updateById(this.thingId);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }
}

export class ItemToggleInfo extends ItemMaterialInfo {
    private toggle: UnityEngine.UI.ActiveToggle;

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.toggle = go.GetComponent(UnityEngine.UI.ActiveToggle.GetType()) as UnityEngine.UI.ActiveToggle;
    }

    isOn(): boolean {
        return this.toggle.isOn;
    }
}