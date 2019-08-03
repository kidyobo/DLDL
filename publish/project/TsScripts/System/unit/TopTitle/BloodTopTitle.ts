import { TypeCacher } from "System/TypeCacher"
import { Global as G } from "System/global";
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumBloodType } from 'System/constants/GameEnum'
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
export class BloodTopTitle {
    public container: TopTitleContainer;
    private gameObject: UnityEngine.GameObject;

    private blood: UnityEngine.GameObject;
    private bloodImage: UnityEngine.UI.Image;
    private type: EnumBloodType = EnumBloodType.red;
    static red = UnityEngine.Color.red;
    static green = UnityEngine.Color.green;
    private hpValue = -1;
    get width(): number {
        return 76;
    }
    get height(): number {
        return 8;
    }
    setBloodType(value: EnumBloodType) {
        if (this.type != value) {
            this.type = value;
            this.bloodImage.color = EnumBloodType.red ? BloodTopTitle.red : BloodTopTitle.green;
        }
    }
    private _active: boolean = false;
    private _setActive(value: boolean) {
        if (value != this._active) {
            this._active = value;
            this.gameObject.SetActive(value);
        }
    }
    set value(v: number) {
        if (this.hpValue != v) {
            this.hpValue = v;
            if (v < 0) {
                this._setActive(false);
            }
            else {
                this._setActive(true);
                this.bloodImage.fillAmount = v;
                //Game.Tools.SetGameObjectLocalScale(this.blood, v, 1, 1);
            }
        }
    }
    get value(): number {
        return this.hpValue;
    }

    init(container: TopTitleContainer) {
        this.container = container;
        this.gameObject = G.ViewCacher.worldUIElementView.createBloodTopTitle(container);
        this.bloodImage = ElemFinder.findImage(this.gameObject, 'blood');
        this.blood = this.bloodImage.gameObject;
    }
    private _cacheX: number = 0;
    private _cacheY: number = 0;
    setPosition(x: number, y: number) {
        if (this._cacheX != x || this._cacheY != y) {
            this._cacheX = x;
            this._cacheY = y;
            Game.Tools.SetGameObjectLocalPosition(this.gameObject, x, y, 0);
        }
    }
}
export default BloodTopTitle;
