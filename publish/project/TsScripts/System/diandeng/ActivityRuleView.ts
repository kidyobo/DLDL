import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'

/**
 * 日常活动玩法说明
 *
 */
export class ActivityRuleView extends CommonForm {

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private ruleContentText: UnityEngine.UI.Text;
    private content: string;

    private ruleTitleText: UnityEngine.UI.Text;
    private ruleTitle: string;
    private btnHaiShen:UnityEngine.GameObject;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.ActivityRuleView;
    }


    protected initElements(): void {//
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.ruleContentText = this.elems.getText("txtRule");
        this.ruleTitleText = this.elems.getText('txtTitle');
        this.btnHaiShen = this.elems.getElement('btnHaiShen');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onCLickMask);
        this.addClickListener(this.btnClose, this.onCLickMask);
        this.addClickListener(this.btnHaiShen,this.onClickHaiShen);
    }

    open(content: string, title: string = '规则介绍',isActiveHaiShen:boolean = false) {
        this.ruleTitle = title;
        this.content = content;
        if(isActiveHaiShen){
            this.btnHaiShen.SetActive(true);
        }
        super.open();
    }

    protected onOpen() {
        this.ruleTitleText.text = this.ruleTitle;
        this.ruleContentText.text = this.content;
    }

    protected onClose() {

    }

    private onCLickMask() {
        this.close();
    }

    private onClickHaiShen(){
        uts.log('打开海神试炼面板');
    }

}