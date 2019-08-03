import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ElemFinder } from 'System/uilib/UiUtility'

/**
 * 数字输入框 
 * @author teppei
 * 
 */
export class NumInput {
    /**横线式。*/
    static LINE: number = 1;

    /**内合式。*/
    static INNER: number = 2;

    /**赠送鲜花上的红色样式*/
    static FLOWER: number = 3;

    /**用于清除开头的0的表达式。*/
    private static _START_ZERO_REG: RegExp = new RegExp(/^0*/);

    /**数量*/
    private inputNum: UnityEngine.UI.InputField;

    /**不可用时的提示文字。*/
    private m_disableMsg: string;

    /**最小值*/
    private m_min: number = 1;

    /**最大值*/
    private m_max: number = 1;

    /**步长。*/
    private m_step: number = 1;

    /**当数值发生变化时的回调*/
    onValueChanged: (value: number) => void;

    /**默认显示*/
    private m_defaultNum: number = 0;

    private _enabled: boolean = true;

    constructor(defaultNum: number = 1) {
        this.m_defaultNum = defaultNum;
    }

    setComponents(go: UnityEngine.GameObject): void {
        this.inputNum = ElemFinder.findInputField(go, 'inputNum');
        this.inputNum.characterValidation = UnityEngine.UI.InputField.CharacterValidation.Integer;
        this.inputNum.text = this.m_defaultNum + '';

        let add = go.transform.Find("btnAdd");
        let dec = go.transform.Find("btnDec");

        if (add != null) {
            Game.UIClickListener.Get(add.gameObject).onClick = delegate(this, this.onClickBtnAdd);
        }

        if (dec != null) {
            Game.UIClickListener.Get(dec.gameObject).onClick = delegate(this, this.onClickBtnDec);
        }

        this.inputNum.onValueChanged = delegate(this, this.onInputNumValueChanged);
    }

    dispose() {
        this.inputNum.onValueChanged = null;
        this.onValueChanged = null;
    }

    private onInputNumValueChanged(value: string): void {
        if (value == '') {
            this.inputNum.text = this.m_min + '';
        }
        else {
            // 去掉开通的0
            if (this.inputNum.text.length > 1 && '0' == this.inputNum.text.charAt(0)) {
                this.inputNum.text = this.inputNum.text.replace(NumInput._START_ZERO_REG, '');
            }

            // 检查数值有效性
            let num = parseInt(value);
            if (num < this.m_min) {
                this.inputNum.text = this.m_min + '';
            }
            else if (num > this.m_max) {
                this.inputNum.text = this.m_max + '';
            }
            else if (num > this.m_step) {
                // 检查是否符合步长
                let t: number = (num - this.m_min) % this.m_step;
                if (0 != t) {
                    this.inputNum.text = (num - t) + '';
                }
            }
        }

        // 检查按钮可用性
        let num = parseInt(this.inputNum.text);
        if (this.onValueChanged != null) {
            this.onValueChanged(num);
        }
    }

    /**
     * 设置范围 
     * @param min
     * @param max
     * 
     */
    setRange(min: number = 1, max: number = 1, step: number = 1, value: number = -1): void {
        this.m_min = min <= max ? min : max;
        this.m_max = max >= min ? max : min;
        this.m_step = step;
        if (this.inputNum != null) {
            if (value > 0) {
                this.inputNum.text = value + '';
                this.onInputNumValueChanged(this.inputNum.text);
            }
            else {
                let tfValue: number = parseInt(this.inputNum.text);
                if (tfValue < this.m_min || tfValue > this.m_max) {
                    this.onInputNumValueChanged(this.inputNum.text);
                }
            }
        }
    }

    private onClickBtnAdd(go: UnityEngine.GameObject): void {
        let num = parseInt(this.inputNum.text);
        if (num < this.m_max) {
            this.onInputNumValueChanged(this.inputNum.text = (num + this.m_step) + '');
        }
    }

    private onClickBtnDec(go: UnityEngine.GameObject): void {
        let num = parseInt(this.inputNum.text);
        if (num > this.m_min) {
            this.onInputNumValueChanged(this.inputNum.text = (num - this.m_step) + '');
        }
    }

    /**
     * 获取当前数量。
     * @return 当前数量。
     * 
     */
    get num(): number {
        let str: string = this.inputNum.text;
        return parseInt(str);
    }

    set num(value: number) {
        if (value < this.m_min) {
            value = this.m_min;
        }
        else if (value > this.m_max) {
            value = this.m_max;
        }

        this.inputNum.text = value + '';
        this.onInputNumValueChanged(null);
    }

    get maxNum(): number {
        return this.m_max;
    }

    set disableMsg(value: string) {
        this.m_disableMsg = value;
    }

    set enabled(value: boolean) {
        if (this._enabled != value) {
            this.inputNum.enabled = value;
            if (!value) {
                if (null != this.m_disableMsg) {
                    this.inputNum.text = this.m_disableMsg;
                }
                else {
                    this.inputNum.text = 0 + '';
                }
            }
        }
    }
}
