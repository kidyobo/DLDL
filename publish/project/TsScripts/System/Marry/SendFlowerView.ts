import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { NumInput } from 'System/uilib/NumInput'
import { Global as G } from 'System/global'
import { List } from 'System/uilib/List'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { EnumMarriage } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { Color } from 'System/utils/ColorUtil'


export class SendFlowerView extends CommonForm {

    /**下拉框*/
    private list: List;
    /**数量输入控件。*/
    private m_numInput: NumInput;
    private m_btnOk: UnityEngine.GameObject;
    /**赠送对象名字*/
    private m_roleName: string;
    private m_roleID: Protocol.RoleID;
    /**选中的鲜花*/
    private m_flowerID: number = EnumMarriage.FLOWER_1;
    /**自动购买按钮*/
    private m_btnAuto: UnityEngine.UI.ActiveToggle;
    private _noPrompSendFlower: boolean = false;
    private flowerIds: number[] = [EnumMarriage.FLOWER_1, EnumMarriage.FLOWER_2, EnumMarriage.FLOWER_3, EnumMarriage.FLOWER_4];
    private sendRoleNameText: UnityEngine.UI.Text;
    private sendFlowerNameText: UnityEngine.UI.Text;
    private flowerNames: string[] = [];

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open(roleName: string = '', roleId: Protocol.RoleID = null) {
        this.m_roleName = roleName;
        this.m_roleID = roleId;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SendFlowerView;
    }

    protected initElements() {
        this.m_numInput = new NumInput();
        this.m_numInput.setComponents(this.elems.getElement('numInput'));
        this.m_numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.m_numInput.setRange(1, 99);
        this.m_btnAuto = this.elems.getActiveToggle('autoBuyToggle');
        this.m_btnOk = this.elems.getElement('btn_buy');
        this.list = this.elems.getUIList('list');
        this.sendRoleNameText = this.elems.getText('sendRoleText');
        this.sendFlowerNameText = this.elems.getText('selectedFlowerText');
    }

    protected initListeners() {
        this.addClickListener(this.m_btnOk, this._onBtnOkClick);
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.elems.getElement('btn_flowerGroup'), this.onClickBtnFlowerGroup);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_close'), this.close);
    }

    protected onOpen() {
        this.updateView();
        this.sendRoleNameText.text = this.m_roleName; 
    }

    protected onClose() {

    }



    /**背包变化*/
    onBagModuleChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateView();
        }
    }


    updateView() {
        this.flowerNames = [];
        for (let i = 0; i < this.flowerIds.length; i++) {
            let str = ThingData.getThingConfig(this.flowerIds[i]).m_szName
                + TextFieldUtil.getColorText("(" + G.DataMgr.thingData.getThingNumInsensitiveToBind(this.flowerIds[i]) + "个)", Color.GREEN);
            this.flowerNames.push(str);
        }
        this.list.Count = this.flowerNames.length;
        for (let i = 0; i < this.flowerNames.length; i++) {
            let text = this.list.GetItem(i).findText('Text');
            text.text = this.flowerNames[i];
        }
        if (this.list.Selected == -1) {
            this.sendFlowerNameText.text = this.flowerNames[0];
        } else {
            this.sendFlowerNameText.text = this.flowerNames[this.list.Selected];
        }     
    }



    private onClickBtnFlowerGroup() {
        if (this.list.gameObject.activeSelf) {
            this.list.gameObject.SetActive(false);
        } else {
            this.list.gameObject.SetActive(true);
        }
    }


    private onClickList(index: number) {
        this.sendFlowerNameText.text = this.flowerNames[index];
        this.m_flowerID = this.flowerIds[index];
        this.list.gameObject.SetActive(false);
    }


    private onNumInputValueChanged(num: number): void {
        // 更新总价 
    }


    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private _onBtnOkClick(): void {
        if (this.m_flowerID == 0) {
            G.TipMgr.addMainFloatTip('请选择鲜花类型');
        }
        else {
            let number: number = this.m_numInput.num - G.DataMgr.thingData.getThingNumInsensitiveToBind(this.m_flowerID);
            if (number > 0) {
                if (this.m_btnAuto.isOn) {
                    let info = G.ActionHandler.checkAutoBuyInfo(this.m_flowerID, number, true);
                    if (info.isAffordable) {
                        this._sendMsg();
                    }
                }
                else {
                    G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_flowerID, number);
                }
            }
            else {
                this._sendMsg();
            }
        }
    }


    private _sendMsg(): void {
        if (!this._noPrompSendFlower) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(271), ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmSend));
        }
        else {
            this.requestSendFlower();
        }
    }

    private onConfirmSend(status: MessageBoxConst, isCheckSelected: boolean) {
        this._noPrompSendFlower = isCheckSelected;
        if (MessageBoxConst.yes == status) {
            this.requestSendFlower();
        }
    }

    /**请求送花*/
    private requestSendFlower(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_GIVEFLOWER, this.m_roleID, this.m_flowerID, this.m_numInput.num));
    }


}
