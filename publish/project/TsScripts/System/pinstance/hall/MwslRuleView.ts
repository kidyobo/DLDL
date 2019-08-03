import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIPathData } from "System/data/UIPathData"

export class MwslRuleView extends CommonForm {
    private mask: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.MwslRuleView;
    }

    protected onOpen() {
    }

    protected onClose() {
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
    }

    protected initListeners(): void{
        this.addClickListener(this.mask, this.onClickMask);
    }

    private onClickMask() {
        this.close();
    }
}