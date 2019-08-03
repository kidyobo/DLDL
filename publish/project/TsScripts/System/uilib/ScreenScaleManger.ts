import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'

/**屏幕比列管理器*/
export class ScreenScaleManger {

    private mobilePhones: string[] = ['iPhone10,3'];

    private rateScreen: number = 0;

    /**齐刘海手机屏幕比*/
    private bangRateScreens: number[];

    private nowDeviceModel: string;

    /**缩进总像素*/
    readonly indentWidth: number = 110;

    constructor() {
        this.rateScreen = UnityEngine.Screen.width / UnityEngine.Screen.height;
        this.nowDeviceModel = UnityEngine.SystemInfo.deviceModel;
        this.bangRateScreens = [2436 / 1125, 2280 / 1080, 2240 / 1080];
    }

    checkAndSetUIScreenRect(form: UnityEngine.GameObject) {
        if (!this.NeedAgainSetScreenScale) return;
        let formRect = ElemFinderMySelf.findRectTransForm(form);
        if (formRect != null) {
            formRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Left, this.indentWidth / 2, -this.indentWidth);
            formRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Top, 0, 0);
            formRect.anchorMin = UnityEngine.Vector2.zero;
            formRect.anchorMax = UnityEngine.Vector2.one;
        }
    }

    get NeedAgainSetScreenScale() {
        for (let i = 0; i < this.bangRateScreens.length; i++) {
            if (this.rateScreen == this.bangRateScreens[i]) {
                return true;
            }
        }
        return false;
    }

    /**根据机型判断是否需要拉伸Ui界面*/
    getNeedScaleByMobilePhone() {
        for (let i = 0; i < this.mobilePhones.length; i++) {
            if (this.nowDeviceModel == this.mobilePhones[i]) {
                return true;
            }
        }
        return false;
    }


}