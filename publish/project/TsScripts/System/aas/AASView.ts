import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { UnitUtil } from 'System/utils/UnitUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

export class AASView extends CommonForm {
    private mask: UnityEngine.GameObject;

    private inputName: UnityEngine.UI.InputField;
    private inputID: UnityEngine.UI.InputField;

    private btnOk: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.AAS;
    }

    protected resPath(): string {
        return UIPathData.AASView;
    }

    protected onOpen() {
        
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.inputName = this.elems.getInputField('inputName');
        this.inputID = this.elems.getInputField('inputID');
        this.btnOk = this.elems.getElement('btnOk');
        this.btnClose = this.elems.getElement('btnClose');
    }

    protected initListeners(): void {
        this.addClickListener(this.btnOk, this.onClickBtnOk);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
    }

    private onClickBtnOk() {
        let name: string = this.inputName.text;
        let id: string = this.inputID.text;
        if (id.length == 15) {
            let r: string = id.substr(0, 6) + '19';
            let f: string = id.substr(6, 8) + '1' + id.substr(id.length - 1, 1);
            id = r + f;
        }

        if (name.length == 0 || name.length >= 5 || !this._checkNames(name)) {
            G.TipMgr.addMainFloatTip('姓名须为2-4个字');
            return;
        }

        if (id.length != 18 || !this._checkNums(id) ) {
            G.TipMgr.addMainFloatTip('身份证号码须为15或18位数字');
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAASIdentityRecordRequest(name, id));
    }

    private _checkNums(nums: string): boolean {
        let str: string;
        for (let i: number = 0; i < nums.length; i++) {
            str = nums.charAt(i);
            if (str > '9' || str < '0') {
                if (i == nums.length - 1 && (str == 'x' || str == 'X')) {

                }
                else {
                    return false;
                }
            }
        }

        return true;
    }

    private _checkNames(name: string): boolean {
        let str: number = 0;
        for (let i: number = 0; i < name.length; i++) {
            str = name.charCodeAt(i);
            if (str < 19968 || str > 40869) {
                return false;
            }
        }

        return true;
    }

    private onClickBtnClose() {
        this.close();
    }
}