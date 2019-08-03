import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { GameIDUtil } from "System/utils/GameIDUtil";
import { IconItem } from "System/uilib/IconItem";

export class FlyIconView extends CommonForm {

    /**飞图标动画持续时间*/
    private readonly flydelayTime: number = 1.5;
    /**飞图标结束点*/
    private flyEndPoint: UnityEngine.GameObject;
    /**飞图标结束大小*/
    private endPointScale: UnityEngine.Vector3 = new UnityEngine.Vector3(0.3, 0.3, 0.3);
    //缓存的物品
    private ids: Array<IdAndNum> = new Array<IdAndNum>();
    private iconRoot: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private angle: number = 30;
    private besizerSpeed: number = 7;
    //放大缩小比例
    private bigScale: UnityEngine.Vector3 = new UnityEngine.Vector3(1.2, 1.2, 1.2);
    private nomalScale: UnityEngine.Vector3 = new UnityEngine.Vector3(1, 1, 1);

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    protected onOpen() {
    }

    protected onClose() {
    }

    layer(): UILayer {
        return UILayer.Effect;
    }

    protected resPath(): string {
        return UIPathData.FlyIconView;
    }

    protected initElements(): void {
        this.flyEndPoint = this.elems.getElement('btnBag');
        this.flyEndPoint.SetActive(false);
        this.iconRoot = this.elems.getElement('icon');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
    }

    /**
     * 来了新的需要飞图标的id了
     * @param id
     */
    pushIcon(id: number, num: number = 1) {
        if (GameIDUtil.isRoleEquipID(id)) {
            return;
        }
        let dic = new IdAndNum(id, num);
        this.ids.push(dic);
        if (!this.hasTimer('flyIcon')) {
            this.addTimer("flyIcon", 200, 0, this.onTimer);
        }
    }

    private onTimer() {
        let temp: IdAndNum = this.ids.splice(0, 1)[0];
        if (this.ids.length <= 0) {
            this.removeTimer("flyIcon");
        }
        let iconItem = new IconItem();
        iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.iconRoot);
        iconItem.updateById(temp.id, temp.num);
        iconItem.updateIcon();
        //直线
        //let tween1 = Tween.TweenPosition.Begin(iconItem.gameObject, 1.2, this.flyEndPoint.transform.position, true);
        //tween1.onFinished = delegate(this, this.onTweenOneOver, iconItem.gameObject);
        this.onTweenOneOver(iconItem.gameObject);
        //缩放
        let scaleAni = Tween.TweenScale.Begin(iconItem.gameObject, this.flydelayTime, this.endPointScale);
        scaleAni.onFinished = delegate(this, this.onFlyOver, iconItem.gameObject);
    }
    /**
     * 曲线运动
     * @param obj
     */
    private onTweenOneOver(obj: UnityEngine.GameObject) {
        let rect = obj.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        let endX = this.flyEndPoint.transform.position.x;
        this.angle = 60; 
        Game.Tools.AddBesizer(obj, this.besizerSpeed, this.angle, this.flyEndPoint, delegate(this, this.onTweenBesizerOver, obj));
    }
    /**
     * 曲线运动完了，显示并放大背包图片
     * @param obj
     */
    private onTweenBesizerOver(obj: UnityEngine.GameObject) {
        UnityEngine.GameObject.Destroy(obj);

        this.flyEndPoint.SetActive(true);
        let scaleAni = Tween.TweenScale.Begin(this.flyEndPoint, 0.3, this.bigScale);
        scaleAni.onFinished = delegate(this, this.onBigScale, this.flyEndPoint, true);
    }
    /**
     * 放大缩小
     * @param obj
     * @param isbigger
     */
    private onBigScale(obj: UnityEngine.GameObject, isbigger: boolean) {
        if (isbigger) {
            let scaleAni = Tween.TweenScale.Begin(this.flyEndPoint, 0.3, this.nomalScale);
            scaleAni.onFinished = delegate(this, this.onBigScale, this.flyEndPoint, false);
        }
        else {
            this.flyEndPoint.SetActive(false);
        }
    }

    private onFlyOver(obj) {
    }
}

class IdAndNum {
    public id: number = 0;
    public num: number = 0;

    constructor(id: number, num: number = 1) {
        this.id = id;
        this.num = num;
    }
}