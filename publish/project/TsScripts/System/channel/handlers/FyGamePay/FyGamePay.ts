import { StringUtil } from "../../../utils/StringUtil";
import { SelectPayTypeView, PayType } from "./SelectPayTypeView";
import { Global } from "../../../global";
import { TimeoutFlag } from "../../../utils/TimeoutUtil";
import { ZXingView } from "../../../login/view/ZXingView";

export class FyGamePay {
    private static ins: FyGamePay = null;
    static get Ins(): FyGamePay {
        if (this.ins == null) {
            this.ins = new FyGamePay();
        }
        return this.ins;
    }

    private paying: TimeoutFlag;
    private payType: PayType = PayType.NONE;
    private payCallback: (productId: number, payType: string, orderId: string, is2dcode: boolean) => void = null;

    private constructor() {
    }

    doPay(orderjson: any, cfg: GameConfig.ChargeGiftConfigM, params: string, paying: TimeoutFlag, payCallback: (productId: number, payType: string, orderId: string, is2dcode: boolean) => void) {
        this.paying = paying;
        this.payCallback = payCallback;
        if (Global.IsIOSPlatForm) {
            //ios要先获取是苹果支付还是贝付宝支付
            let fy_paytype = orderjson.fy_paytype == null ? "-1" : orderjson.fy_paytype;
            if (fy_paytype == "0" || orderjson.payinfo != null) {
                //苹果支付或者第二次getorder支付
                Global.SdkCaller.doPay(params, orderjson.payinfo);
            } else if (fy_paytype == "1") {
                //贝付宝支付选择支付的类型
                Global.Uimgr.createForm<SelectPayTypeView>(SelectPayTypeView).open(cfg.m_iProductID, orderjson.orderid, uts.delegate(this, this.onSelectPayType));
            }
        } else {
            if (StringUtil.isEmpty(orderjson.code_url) && StringUtil.isEmpty(orderjson.payinfo)) { // 选择支付类型（微信、支付宝）
                Global.Uimgr.createForm<SelectPayTypeView>(SelectPayTypeView).open(cfg.m_iProductID, orderjson.orderid, uts.delegate(this, this.onSelectPayType));
            }
            else if (!StringUtil.isEmpty(orderjson.code_url)) {
                let title = (this.payType == PayType.WX) ? '微信扫码支付' : '支付宝扫码支付';
                Global.Uimgr.createForm<ZXingView>(ZXingView).open(orderjson.code_url, false, title, cfg.m_szProductName, uts.delegate(this, this.onClose2DPayCode));
            }
            else {
                Global.SdkCaller.doPay(null, orderjson.payinfo);
            }
        }
    }


    private onSelectPayType(productId: number, orderId: string, payType: PayType, is2dcode: boolean) {
        this.payType = payType;
        this.paying.stop();
        if (payType != PayType.NONE) {
            this.payCallback(productId, payType.toString(), orderId, is2dcode);
        }
    }

    private onClose2DPayCode() {
        this.paying.stop();
    }
}