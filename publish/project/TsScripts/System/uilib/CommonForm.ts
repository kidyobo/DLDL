import { Global as G } from "System/global";
import { TypeCacher } from "System/TypeCacher";
import { FixedList } from "System/uilib/FixedList";
import { GroupList } from "System/uilib/GroupList";
import { List } from "System/uilib/List";
import { UiElements } from "System/uilib/UiElements";
export enum UILayer {
    /**主界面及相关的Form设置在Base层*/
    Base = 0,
    /**仅ChatView设置在Chat层，不要将其他任何Form设置在Chat层*/
    Chat,
    /**专门给MainUIEffectView使用的层*/
    MainUIEffect,
    /**所有一级界面设置在Normal层*/
    Normal,
    /**所有一级界面调出的二级几面设置在Second层*/
    Second,
    /**仅结算Form设置在Result层，不要将其他任何Form设置在Result层*/
    Result,
    /**仅提示相关界面设置在OnlyTip层，不要将其他任何Form设置在OnlyTip层*/
    OnlyTip,
    /**仅指引相关的Form设置在Guide层，不要将其他任何Form设置在Guide层*/
    Guide,
    /**仅复活Form设置在Relive层，不要将其他任何Form设置在Relive层*/
    Relive,
    /**特效、飘字等*/
    Effect,
    /**仅结算Form设置在Result层，不要将其他任何Form设置在Pay层*/
    Pay,
    /**仅确认框Form设置在MessageBox层，不要将其他任何Form设置在MessageBox层*/
    MessageBox,
    /**仅防沉迷Form设置在AAS层，不要将其他任何Form设置在AAS层*/
    AAS,
    /**仅AboveFloatTipForm设置在FloatTip层，不要将其他任何Form设置在FloatTip层*/
    FloatTip,
    /**仅锁屏Form设置在Top层，不要将其他任何Form设置在Top层*/
    Top,
    /**不要将任何Form设置在Max层*/
    Max
}

export abstract class CommonForm {
    private released: boolean = false;
    protected form: UnityEngine.GameObject = null;
    protected parent: UnityEngine.Transform = null;
    private timerList: { [index: string]: Game.Timer } = {};

    protected elems: UiElements = null;
    protected _opened: boolean = false;
    protected openSound: string = 'uisound_openAndclose';
    protected closeSound: string = 'uisound_openAndclose';
    protected needCheckScreenScale: boolean = false;
    private uiRequest: Game.AssetRequest = null;
    private parentView: CommonForm = null;
    protected rootPath = 'panelRoot';
    private _sortingOrder: number = -1;
    public get sortingOrder() {
        return this._sortingOrder + 1;
    }
    private _canvas: UnityEngine.Canvas = null;
    private _rayCaster: UnityEngine.Component = null;
    public get canvas() {
        return this._canvas;
    }
    protected _cacheForm: boolean = false;
    get CacheForm(): boolean {
        return this._cacheForm;
    }

    private ansycOpen: boolean = false;
    private _3dcamera: UnityEngine.Camera;
    private _3dcamera_image: UnityEngine.UI.RawImage;
    private _3dcamera_renderTexture: UnityEngine.RenderTexture;
    /**面板关键字*/
    protected id: number = 0;
    get Id(): number {
        return this.id;
    }

    constructor(id: number) {
        if (id != null)
            this.id = id;
    }

    public createForm(_cacheForm: boolean) {
        if (this.released) {
            return;
        }
        if (this.uiRequest != null || this.form != null) {
            return;
        }
        this._cacheForm = _cacheForm || this._cacheForm;
        this.uiRequest = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.Low2, [this.resPath()]);
        Game.ResLoader.BeginAssetRequest(this.uiRequest, delegate(this, this._onLoadForm));
    }

    private _onLoadForm(assetRequest: Game.AssetRequest) {
        this.uiRequest = null;
        //parentView如果没有手动设置，就是空的
        if (this.ansycOpen) {
            this.ansycOpen = false;
            if (this.parentView == null) {
                G.Uimgr.onFormAnsycLoad(this);
            }
        }
        if (assetRequest.error != null) {
            uts.logWarning("CommonForm加载失败:" + "  error:" + assetRequest.error);
            return;
        }

        //parentView如果没有手动设置，就是空的
        if (this.parentView == null) {
            //this.parent在创建时会设置成layer()返回的物体
            this.form = assetRequest.mainAsset.Instantiate(this.parent, false);
        }
        else {
            let panelRoot: UnityEngine.GameObject = null;
            if (null != this.rootPath) {
                panelRoot = this.parentView.elems.getElement(this.rootPath);
            }
            if (panelRoot == null) {
                panelRoot = this.parentView.form;
            }
            this.form = assetRequest.mainAsset.Instantiate(panelRoot.transform, false);
        }
        let elems = this.form.GetComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper;
        if (elems == null) {
            elems = this.form.AddComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper;
        }
        this.elems = new UiElements(elems);
        this._3dcamera = this.elems.getCamera("3dcamera");
        if (this._3dcamera) {
            this._3dcamera_image = this.elems.getRawImage("3dcamera_image");
        }

        this.initElements();
        this.initListeners();

        if (this._opened) {
            this.form.SetActive(true);
            this.notifyOpen(true);
        }
        else {
            this.form.SetActive(false);
        }
    }

    /**
    * caller不需要使用delegate来封装，在函数内部已实现
    * @param element
    * @param caller
    */
    protected addClickListener(element: UnityEngine.GameObject, caller: (...args) => void) {
        Game.UIClickListener.Get(element).onClick = delegate(this, caller);
    }

    /**
     * 监听按钮按下事件
     * @param element
     * @param caller
     */
    protected addPointerDownListener(element: UnityEngine.GameObject, caller: () => void) {
        Game.UIPointerDownListener.Get(element).onClick = delegate(this, caller);
    }

    /**
     * 监听按钮按起事件
     * @param element
     * @param caller
     */
    protected addPointerUpListener(element: UnityEngine.GameObject, caller: () => void) {
        Game.UIPointerUpListener.Get(element).onClick = delegate(this, caller);
    }

    /**
     * 监听移开按钮，失去焦点事件
     * @param element
     * @param caller
     */
    protected addPointerExitListener(element: UnityEngine.GameObject, caller: () => void) {
        Game.UIPointerExitListener.Get(element).onClick = delegate(this, caller);
    }

    /**
     * caller不需要使用delegate来封装，在函数内部已实现
     * @param element
     * @param caller
     */
    protected addToggleGroupListener(element: UnityEngine.UI.ActiveToggleGroup, caller: (index: number) => void) {
        element.onValueChanged = delegate(this, caller);
    }

    /**
 * caller不需要使用delegate来封装，在函数内部已实现
 * @param element
 * @param caller
 */
    protected addToggleListenerWithValue(element: UnityEngine.UI.ActiveToggle, caller: (isOn: boolean) => void, isOn: boolean) {
        element.onValueChanged = delegate(this, caller);
        element.isOn = isOn;
    }

    /**
     * caller不需要使用delegate来封装，在函数内部已实现
     * @param element
     * @param caller
     */
    protected addListClickListener(element: GroupList | FixedList | List, caller: (index: number) => void) {
        element.onClickItem = delegate(this, caller);
    }

    /**
    * caller不需要使用delegate来封装，在函数内部已实现
    * @param element
    * @param caller
    */
    protected addListValueChangeListener(element: GroupList | FixedList | List, caller: (index: number) => void) {
        element.onValueChange = delegate(this, caller);
    }

    protected addTimer(key: string, time: number, loop: number, callback: (timer: Game.Timer) => void, intervalTime: number = -1, intervalCallback: (timer: Game.Timer) => void = null, triggerInternalImm: boolean = false): void {
        //uts.assert(this.isOpened);
        let oldTimer = this.timerList[key];
        if (oldTimer != null) {
            oldTimer.ResetTimer(time, loop, delegate(this, callback));
            if (intervalTime >= 0) {
                oldTimer.SetIntervalCall(intervalTime, delegate(this, intervalCallback));
                if (triggerInternalImm) {
                    intervalCallback.apply(this, [oldTimer]);
                }
            }
        }
        else {
            let timer = new Game.Timer(key, time, loop, delegate(this, callback));
            if (intervalTime >= 0) {
                timer.SetIntervalCall(intervalTime, delegate(this, intervalCallback));
                if (triggerInternalImm) {
                    intervalCallback.apply(this, [timer]);
                }
            }
            this.timerList[key] = timer;
        }
    }
    protected removeTimer(key: string) {
        let timer = this.timerList[key];
        if (timer != null) {
            delete this.timerList[key];
            timer.Stop();
        }
        else {
            //uts.logWarning("要移除的计时器不存在" + key);
        }
    }
    protected hasTimer(key: string): boolean {
        let timer = this.timerList[key];
        return timer != null;
    }

    setParent(parent: UnityEngine.Transform) {
        this.parent = parent;
    }
    open(...args) {
        if (this._opened == true) {
            this.processOpenedAlready(args);
            return;
        }
        this._opened = true;
        this.ansycOpen = this.uiRequest != null;

        if (this.parentView == null) {
            this._sortingOrder = G.Uimgr.onFormOpen(this, this.ansycOpen);
        }
        else {
            this._sortingOrder = this.parentView._sortingOrder;
            if (!this.parentView.form == null) {
                uts.assert(false, "界面在父界面没有打开时，无法调用open函数");
                return;
            }
        }

        if (this.form != null) {
            this.form.SetActive(true);
            this.notifyOpen(false);
        }
    }

    protected processOpenedAlready(args: any[]) {
        if (this.form != null) {
            this.form.SetActive(true);
            this.onOpen();
        }
    }
    close() {
        if (this._opened == false) {
            return;
        }
        this._opened = false;

        if (this.ansycOpen) {
            if (this.parentView == null) {
                G.Uimgr.onFormAnsycLoad(this);
            }
            this.ansycOpen = false;
        }

        this._sortingOrder = -1;
        for (let key in this.timerList) {
            this.timerList[key].Stop();
        }
        this.timerList = {};
        if (null != this.closeSound) {
            //uts.log('关闭界面播放:= ' + this.form.gameObject.name);
            G.AudioMgr.playSound(uts.format('sound/ui/{0}.mp3', this.closeSound));
        }
        if (this.uiRequest != null) {
            this.uiRequest.Abort();
            this.uiRequest = null;
        }
        if (null != this.form) {
            this.onClose();
            this.form.SetActive(false);
            if (this._3dcamera && this._3dcamera_image) {
                this._3dcamera.targetTexture = null;
                this._3dcamera_image.texture = null;
                UnityEngine.RenderTexture.ReleaseTemporary(this._3dcamera_renderTexture);
                this._3dcamera_renderTexture = null;
            }
        }
        if (this._cacheForm == true) {
            if (null != this.elems) {
                // 存在一种情况，即调用了open，但加载失败了，故elems为null
                let count = this.elems.getPanelCount();
                for (let i = 0; i < count; i++) {
                    let obj = this.elems.getPanel(i);

                    let com2 = Game.Tools.GetGraphicRaycaster(obj);
                    UnityEngine.UnityObject.DestroyImmediate(com2);

                    let com = obj.GetComponent(UnityEngine.Canvas.GetType());
                    UnityEngine.UnityObject.DestroyImmediate(com);
                }
            }
            UnityEngine.UnityObject.DestroyImmediate(this._rayCaster);
            this._rayCaster = null;
            UnityEngine.UnityObject.DestroyImmediate(this._canvas);
            this._canvas = null;
        }
        else {
            this.destroy();
        }
        if (this.parentView == null) {
            G.Uimgr.onFormClose(this, this._cacheForm);
        }
        // 界面关闭了，通知引导模块可以继续引导了
        G.GuideMgr.onFormClosed();
    }

    public destroy() {
        if (this._opened) {
            this.close();
        }
        if (this.form != null) {
            this.onDestroy();
            UnityEngine.GameObject.DestroyImmediate(this.form);
            this.form = null;
        }
        if (!this.released) {
            this.released = true;
            this.onRelease();
            uts.releaseObject(this);
        }
    }

    get isOpened(): boolean {
        return this._opened && this.form != null;
    }

    private notifyOpen(ansyc: boolean) {
        if (this._canvas == null) {
            let com = this.form.AddComponent(UnityEngine.Canvas.GetType());
            this._rayCaster = Game.Tools.AddGraphicRaycaster(this.form);
            this._canvas = com as UnityEngine.Canvas;
            if (this.parentView == null) {
                this._canvas.overrideSorting = true;
                this._canvas.sortingOrder = this._sortingOrder;
            }
            let count = this.elems.getPanelCount();
            for (let i = 0; i < count; i++) {
                let obj = this.elems.getPanel(i);
                com = obj.AddComponent(UnityEngine.Canvas.GetType());
                Game.Tools.AddGraphicRaycaster(obj);

                let canvas = com as UnityEngine.Canvas;
                canvas.overrideSorting = true;
                canvas.sortingOrder = this._sortingOrder + 2;
            }
        }
        if (null != this.openSound) {
            //uts.log('打开播放界面:= ' + this.form.gameObject.name);
            G.AudioMgr.playSound(uts.format('sound/ui/{0}.mp3', this.openSound));
        }
        if (this.parentView == null) {
            G.Uimgr.afterFormOpened(this);
        }
        //打开界面之前处理下3D摄像机在UI上显示画布逻辑，另外一个onopen不用处理因为已经打开了，只处理一次不然会重复open出BUG
        if (this._3dcamera && this._3dcamera_image) {
            this._3dcamera_renderTexture = UnityEngine.RenderTexture.GetTemporary(G.protectedWidth, G.protectedHeight, 16, UnityEngine.RenderTextureFormat.ARGB32, UnityEngine.RenderTextureReadWrite.Default, 2);
            this._3dcamera.targetTexture = this._3dcamera_renderTexture;
            this._3dcamera_image.texture = this._3dcamera_renderTexture;
        }

        this.onOpen();
        if (this.needCheckScreenScale) {
            G.ScreenScaleMgr.checkAndSetUIScreenRect(this.form);
        }
    }
    setParentView(parent: CommonForm) {
        this.parentView = parent;
    }

    get Name(): string {
        let name = (this as any).constructor.name;
        return name;
    }

    abstract layer(): UILayer;
    protected abstract resPath(): string;
    protected initElements() { }
    protected initListeners() { }
    protected onOpen() { }
    protected onClose() { }
    protected onDestroy() { }
    protected onRelease() { }
    public getElement(name: string) {
        return this.elems.getElement(name);
    }
    /**
 * 设置页签提示。
 * @param index 页签序号
 * @param isShowTipMark 是否显示提示
 */
    protected setTabGroupTipMark(tabGroup: UnityEngine.UI.ActiveToggleGroup, index: number, isShowTipMark: boolean) {
        let toggle = tabGroup.GetToggle(index);
        if (null != toggle) {
            let toggleMark = toggle.transform.Find('tipMark');
            if (null != toggleMark) {
                toggleMark.gameObject.SetActive(isShowTipMark);
            }
        }
    }
}
export default CommonForm;

export class TextGetSet {
    private _uitext: UnityEngine.UI.Text;
    private _text: string;
    public set text(value: string) {
        if (this._text != value) {
            this._text = value;
            this._uitext.text = value;
        }
    }
    public get text(): string {
        return this._text;
    }
    constructor(_uitext: UnityEngine.UI.Text) {
        this._uitext = _uitext;
    }
    private _gameObject: GameObjectGetSet;
    public get gameObject() {
        if (!this._gameObject) {
            this._gameObject = new GameObjectGetSet(this._uitext.gameObject);
        }
        return this._gameObject;
    }
}
export class GameObjectGetSet {
    private _uiobj: UnityEngine.GameObject;
    private _active: boolean;
    public SetActive(value: boolean) {
        if (this._active != value) {
            this._active = value;
            this._uiobj.SetActive(value);
        }
    }
    public get activeSelf(): boolean {
        return this._active;
    }
    private _grey: boolean = false;
    public set grey(value: boolean) {
        if (this._grey != value) {
            this._grey = value;
            GameObjectGetSet.setGrey(this._uiobj, value);
        }
    }
    public get grey(): boolean {
        return this._grey;
    }
    public get gameObject() {
        return this._uiobj;
    }
    constructor(_uiobj: UnityEngine.GameObject) {
        this._uiobj = _uiobj;
        this._active = _uiobj.activeSelf;
    }
    /**
 * 将GameObject设置或取消灰色材质。
 * @param go
 * @param isGrey
 * @param includeInactive
 */
    static setGrey(go: UnityEngine.GameObject, isGrey: boolean) {
        let material: UnityEngine.Material = null;

        if (isGrey) {
            material = G.MaterialMgr.greyMat;
        }

        let images: UnityEngine.UI.Image[] = go.GetComponentsInChildren(UnityEngine.UI.Image.GetType(), true) as UnityEngine.UI.Image[];
        let len = Game.ArrayHelper.GetArrayLength(images);
        for (let i: number = 0; i < len; i++) {
            let img = Game.ArrayHelper.GetArrayValue(images, i) as UnityEngine.UI.Image;
            img.material = material;
        }

        let rawImgs: UnityEngine.UI.RawImage[] = go.GetComponentsInChildren(UnityEngine.UI.RawImage.GetType(), true) as UnityEngine.UI.RawImage[];
        len = Game.ArrayHelper.GetArrayLength(rawImgs);
        for (let i: number = 0; i < len; i++) {
            let rawImg = Game.ArrayHelper.GetArrayValue(rawImgs, i) as UnityEngine.UI.RawImage;
            rawImg.material = material;
        }
    }
    private interPosition: UnityEngine.Vector3;
    GetPosition(): UnityEngine.Vector3 {
        if (!this.interPosition) {
            this.interPosition = new UnityEngine.Vector3(0, 0, 0);
        }
        Game.Tools.GetGameObjectPosition(this.gameObject, this.interPosition);
        return this.interPosition;
    }
    SetPosition(x, y, z) {
        Game.Tools.SetGameObjectPosition(this.gameObject, x, y, z);
    }
    SetPositionV3(v3: UnityEngine.Vector3) {
        Game.Tools.SetGameObjectPosition(this.gameObject, v3);
    }
    private _transform: UnityEngine.Transform;
    public get transform() {
        if (!this._transform) {
            this._transform = this.gameObject.transform;
        }
        return this._transform;
    }
    public get rectTransform() {
        if (!this._transform) {
            this._transform = this.gameObject.transform;
        }
        return this._transform as UnityEngine.RectTransform;
    }
}