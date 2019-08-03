import { Global as G } from "System/global"
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from 'System/data/UIPathData'
import { VipData } from "System/data/VipData"

export class SuperVipView extends TabSubForm {

    private name: UnityEngine.UI.Text;
    private qq: UnityEngine.UI.Text;
    private completeDes: UnityEngine.GameObject;
    private notCompleteDes: UnityEngine.GameObject;
    private btnContact: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private qqTipText: UnityEngine.UI.Text;
    private completeTipText: UnityEngine.UI.Text;
    private notCompleteTipText: UnityEngine.UI.Text;
    private contactTip: UnityEngine.GameObject;

    private QQ:number = 2997253306;



    constructor() {
        super(KeyWord.OTHER_FUNCTION_CJVIP);
    }

    protected resPath(): string {
        return UIPathData.SuperVipView;
    }

    protected initElements() {
       
        this.name = this.elems.getText("name");
        this.qq = this.elems.getText("qq");
        this.completeDes = this.elems.getElement('completeDes');
        this.notCompleteDes = this.elems.getElement('notCompleteDes');
        this.btnContact = this.elems.getElement('btnContact');
        this.qqTipText = this.elems.getText('qqTipText');
        this.completeTipText = this.elems.getText('completeTipText');
        this.notCompleteTipText = this.elems.getText('notCompleteTipText');
        this.btnClose = this.elems.getElement('btnClose');
        this.contactTip = this.elems.getElement('contactTip');
    }

    protected initListeners()
    {
        this.addClickListener(this.btnContact, this.onClickBtnContact);
        this.addClickListener(this.btnClose,this.onClickBtnClose);
    }

    protected onOpen() {
        this.setQQShow();
    }

    protected onClose() {

    }

    private setQQShow()
    {
        this.qq.text = '专属美女 QQ：' + this.QQ.toString();
        this.qqTipText.text = '专属美女 QQ：' + this.QQ.toString();
      
        if (VipData.isOldSvip)
        {
            this.qq.gameObject.SetActive(true);
            this.completeDes.gameObject.SetActive(true);
            this.notCompleteDes.gameObject.SetActive(false );
        }
        else 
        {
            this.qq.gameObject.SetActive(false );
            this.completeDes.gameObject.SetActive(false );
            this.notCompleteDes.gameObject.SetActive(true );
        }

    }

    private onClickBtnContact()
    {
        let isSvip:boolean  = VipData.isOldSvip;
        this.qqTipText.gameObject.SetActive(isSvip);
        this.completeTipText.gameObject.SetActive(isSvip);
        this.notCompleteTipText.gameObject.SetActive(!isSvip);
        this.contactTip.SetActive(true);
    }

    private onClickBtnClose()
    {
        this.contactTip.SetActive(false );
    }


}