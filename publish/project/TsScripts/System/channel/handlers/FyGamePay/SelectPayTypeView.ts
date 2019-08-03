import { CommonForm, UILayer, GameObjectGetSet } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { List } from "../../../uilib/List";
import { Compatible } from "../../../Compatible";

export enum PayType {
    NONE = -1,
    WX = 0,
    ZFB = 1,
}

export class SelectPayTypeView extends CommonForm {
    private list: List;
    private productId: number = 0;
    private orderId: string = '';
    private listitems: Array<{ name: string, paytype: PayType, qrcode: boolean }> = null;
    private selectCallback: (productId: number, orderId: string, selecttype: PayType, qrcode: boolean) => void = null;

    layer(): UILayer {
        return UILayer.MessageBox;
    }

    open(productId: number, orderId: string, selectCallback: (productId: number, orderId: string, selecttype: PayType, qrcode: boolean) => void) {
        super.open();
        this.productId = productId;
        this.orderId = orderId;
        this.selectCallback = selectCallback;
    }

    protected resPath(): string {
        return UIPathData.SelectPayTypeView;
    }

    protected initElements() {
        let abi = Compatible.getDeviceInfo().cpu_abi;
        if (abi.toLowerCase() == 'x86') { // 模拟器
            this.listitems = [
                { name: '微信扫码支付', paytype: PayType.WX, qrcode: true },
                { name: '支付宝扫码支付', paytype: PayType.ZFB, qrcode: true },
                { name: '微信支付', paytype: PayType.WX, qrcode: false },
                { name: '支付宝支付', paytype: PayType.ZFB, qrcode: false },
            ];
        } else if (abi == 'pc') { // pc端
            this.listitems = [
                { name: '微信扫码支付', paytype: PayType.WX, qrcode: true },
                { name: '支付宝扫码支付', paytype: PayType.ZFB, qrcode: true },
            ];
        }
        else if (abi == "arm64-v8a") {//ios
            this.listitems = [
                { name: '微信支付', paytype: PayType.WX, qrcode: false },
                { name: '支付宝支付', paytype: PayType.ZFB, qrcode: false },
            ];
        }
        else { // 手机
            this.listitems = [
                { name: '微信支付', paytype: PayType.WX, qrcode: false },
                { name: '支付宝支付', paytype: PayType.ZFB, qrcode: false },
                { name: '微信扫码支付', paytype: PayType.WX, qrcode: true },
                { name: '支付宝扫码支付', paytype: PayType.ZFB, qrcode: true },
            ];
        }

        this.list = this.elems.getUIList('list');
        this.list.hasItemAppearEffect = false;
        this.list.Count = this.listitems.length;
        for (let i = 0, n = this.list.Count; i < n; i++) {
            let uiitem = this.list.GetItem(i);
            let item = this.listitems[i];
            uiitem.findText('name').text = item.name;
            uiitem.findObject('wxicon').SetActive(item.paytype == PayType.WX);
            uiitem.findObject('zfbicon').SetActive(item.paytype == PayType.ZFB);
            uiitem.findObject('qrcode').SetActive(item.qrcode);
        }

        let back = this.elems.getElement('back');
        let trans = back.transform as UnityEngine.RectTransform;
        let size = trans.sizeDelta;
        trans.sizeDelta = new UnityEngine.Vector2(size.x, this.list.Count == 4 ? 400 : 280);
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickClose);
        this.addListClickListener(this.list, this.onSelectPayType);
    }

    private onClickClose() {
        this.notify(PayType.NONE, false);
        this.close();
    }

    private onSelectPayType(index: number) {
        let item = this.listitems[index];
        this.notify(item.paytype, item.qrcode);
        this.close();
    }

    private notify(type: PayType, qrcode: boolean) {
        this.selectCallback(this.productId, this.orderId, type, qrcode);
    }
}