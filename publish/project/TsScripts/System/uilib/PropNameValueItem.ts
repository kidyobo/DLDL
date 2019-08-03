import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { KeyWord } from 'System/constants/KeyWord'
import { GameObjectGetSet, TextGetSet } from '../uilib/CommonForm';
import { List, ListItem } from 'System/uilib/List'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';


/**
 * 关于属性的显示
 */
export class PropNameValueItem {

    private txtName: TextGetSet;
    private txtValue: TextGetSet;
    private txtNext: TextGetSet;

    setComponents(go: UnityEngine.GameObject) {
        this.txtName = new TextGetSet( ElemFinder.findText(go, "txtName"));
        this.txtValue = new TextGetSet( ElemFinder.findText(go, "txtValue"));
        let tmpNext = ElemFinder.findText(go, "txtNext");
        if (tmpNext) {
            this.txtNext = new TextGetSet(tmpNext);
        }
    }

    /**
     * 显示名字+属性值
     * @param data
     * @param needGrey
     */
    update(data: GameConfig.EquipPropAtt, needGrey: boolean = false) {
        let nameColor = needGrey ? Color.GREY : "CACBCCFF";
        let valueColor = needGrey ? Color.GREY : "40CC9CFF";
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId), nameColor);
        this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", valueColor);
    }

    update2PropAtt(curProp: GameConfig.EquipPropAtt, nextProp: GameConfig.EquipPropAtt) {
        let tmpProp = curProp ? curProp : nextProp;
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, tmpProp.m_ucPropId), "DFFFFF");
        this.txtValue.text = TextFieldUtil.getColorText((curProp ? curProp.m_ucPropValue : 0) + "", "FFF000");
        if (this.txtNext != null) {
            let nextValue = nextProp ? ("+" + (nextProp.m_ucPropValue - curProp.m_ucPropValue)) : "";
            this.txtNext.text = TextFieldUtil.getColorText(nextValue, Color.GREEN);
        }
    }
}



export class PropItemList {

    private list: List;
    private txtFight: TextGetSet;

    private propItems: PropNameValueItem[] = [];

    constructor(list: List, txtFight: TextGetSet = null) {
        this.list = list;
        this.txtFight = txtFight;
    }
    
    update(cfgs: GameConfig.EquipPropAtt[]) {
        let oldLen = this.propItems.length;
        this.list.Count = cfgs.length;
        let propItem: PropNameValueItem;
        for (let i = 0; i < cfgs.length; i++) {
            if (i < oldLen) {
                propItem = this.propItems[i];
            } else {
                propItem = new PropNameValueItem();
                propItem.setComponents(this.list.GetItem(i).gameObject);
                this.propItems.push(propItem);
            }
            propItem.update(cfgs[i]);
        }

        if (this.txtFight) {
            this.txtFight.text = FightingStrengthUtil.calStrength(cfgs) + "";
        }
    }

}
