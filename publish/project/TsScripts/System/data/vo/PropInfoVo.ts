import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
/**
* 属性信息
*
*/
export class PropInfoVo {
    private _add: number = 0;
    private _id: number = 0;
    private _value: number = 0;
    /** 标题的颜色 */
    private _titleColor: number = 0;

    constructor(titleColor: number = 0xfff5cb) {
        this._titleColor = titleColor;
    }

    get add(): number {
        return this._add;
    }

    get id(): number {
        return this._id;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    set id(value: number) {
        this._id = value;
    }

    set add(value: number) {
        this._add = value;
    }

    static getPropName(id: number, profession: number): string {
        if (id == KeyWord.EQUIP_PROP_MAGIC_ATTACK) {
            if (profession == KeyWord.PROFTYPE_WARRIOR)
                return '属攻';
            else if (profession == KeyWord.PROFTYPE_HUNTER)
                return '属攻';
            else if (profession == KeyWord.PROFTYPE_WIZARD)
                return '属攻';
            else
                return '属攻';
        }
        else {
            return KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, id)
        }
    }

    toName(profession: number): string {
        let name: string = PropInfoVo.getPropName(this.id, profession);
        let stringh: string;
        if (this._value == 0) {
            stringh = name + '   ';
            stringh += TextFieldUtil.getColorText('0', Color.PropGreen);
        }
        else {
            if (this.value != null) {
                stringh = name + '   ';
                stringh += TextFieldUtil.getColorText(this.value.toString(), Color.PropGreen);
            }
        }
        return stringh;
    }

    addName(profession: number): string {
        let stringh: string;
        if (this._add != 0) {
            stringh = TextFieldUtil.getColorText(("+" + this._add.toString()), Color.GREEN);
        }
        else {
            stringh = "";
        }
        return stringh;
    }

}
