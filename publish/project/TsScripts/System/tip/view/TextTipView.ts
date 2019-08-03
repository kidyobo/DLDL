import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { EnumTipChid } from 'System/tip/view/TipsView'

/**
 * 文字tip
 */
export class TextTipView extends NestedSubForm {

    private textSize: UnityEngine.UI.Text;
    private textContent: UnityEngine.UI.Text;

    private tipData: TextTipData;

    constructor() {
        super(EnumTipChid.text);
    }

    protected resPath(): string {
        return UIPathData.TextTipView;
    }

    protected initElements() {
        this.textSize = this.elems.getText('textSize');
        this.textContent = this.elems.getText('textContent');
    }

    protected initListeners() {

    }

    open(tipData: TextTipData) {
        this.tipData = tipData;
        super.open();
    }

    protected onOpen() {
        this.textContent.text = this.tipData.displayText;
        this.textSize.text = this.tipData.displayText;
    }

    protected onClose() {

    }
}