import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIPathData } from "System/data/UIPathData"

export class CommonRuleView extends CommonForm {
    private mask: UnityEngine.GameObject;
    private textRule: UnityEngine.UI.Text;
    private textSize: UnityEngine.UI.Text;

    private openRule: string;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.CommonRuleView;
    }

    protected onOpen() {
        this.textRule.text = this.openRule;
        this.textSize.text = this.openRule;
    }

    protected onClose() {
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.textRule = this.elems.getText('textRule');
        this.textSize = this.elems.getText('textSize');
    }

    protected initListeners(): void{
        this.addClickListener(this.mask, this.onClickMask);
    }

    open(rule: string) {
        this.openRule = rule;
        super.open();
    }

    private onClickMask() {
        this.close();
    }
}