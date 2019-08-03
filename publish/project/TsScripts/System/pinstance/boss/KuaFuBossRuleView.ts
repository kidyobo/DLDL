import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'

export class KuaFuBossRuleView extends CommonForm {
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KuaFuBossRuleView;
    }

    protected initElements() {
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");

        let langData = G.DataMgr.langData;
        this.elems.getText('textRule').text = langData.getLang(215);
        this.elems.getText('textWaBao').text = langData.getLang(204);

    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
    }

    protected onOpen() {
    }

    protected onClose() {
    }

    private onBtnClose() {
        this.close();
    }
}
