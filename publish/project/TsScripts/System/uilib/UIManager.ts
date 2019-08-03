import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { NestedForm } from "System/uilib/NestedForm"
import { TabForm } from "System/uilib/TabForm"

//class CloseParams {
//    formToOpen: any;
//    params: any[];
//}

export class UIManager {
    private uiCamera: UnityEngine.Camera = null;
    public get UICamera() {
        return this.uiCamera;
    };
    public gameObject: UnityEngine.GameObject = null;
    private transform: UnityEngine.Transform = null;

    public canvas: UnityEngine.Canvas = null;
    public canvasTransform: UnityEngine.Transform = null;
    private regforms = {};
    private openstacks: { [index: number]: Array<CommonForm> } = {};
    private mask: UnityEngine.GameObject = null;
    private delayCount: number = 0;
    private locker: UnityEngine.GameObject = null;
    //private closeCallbackMap: { [name: string]: CloseParams } = {};

    constructor() {

    }
    init() {
        let asset = Game.ResLoader.LoadAsset("ui/UiManager.prefab");
        this.gameObject = asset.Instantiate(null, false) as UnityEngine.GameObject;
        this.transform = this.gameObject.transform;
        this.canvas = this.gameObject.GetComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
        this.canvasTransform = this.canvas.transform;
        this.uiCamera = this.transform.Find("Camera").GetComponent(UnityEngine.Camera.GetType()) as UnityEngine.Camera;
        this.mask = Game.Tools.GetChild(this.gameObject, "mask");
        this.locker = Game.Tools.GetChild(this.gameObject, "locker");
        G.addUIRaycaster(this.mask);
        G.addUIRaycaster(this.locker);
        this.mask.SetActive(false);
        this.transform.Translate(-300, 0, 0);
        this.createUILayers();
    }
    createForm<T>(formclass, cacheForm: boolean = false): T {
        let name = formclass.name;
        let form = this.regforms[name] as CommonForm;
        if (form == null) {
            form = new formclass;
            let layerContainer = this.transform.Find(this.layerName(form.layer()));
            form.setParent(layerContainer);
            this.regforms[name] = form;
            form.createForm(cacheForm);
        }
        return form as any;
    }
    public setLockerActive(value: boolean) {
        this.locker.SetActive(value);
    }
    private onLateActiveMask() {
        this.mask.SetActive(true);
    }
    onFormOpen(form: CommonForm, ansyc: boolean): number {
        if (ansyc) {
            if (this.delayCount == 0) {
                Game.Invoker.BeginInvoke(this.gameObject, "lateActive", 0.15, delegate(this, this.onLateActiveMask));
            }
            this.delayCount++;
            //uts.log("add form:" + form.Name);
        }

        let layer = form.layer();
        let group = this.openstacks[layer];
        group.push(form);
        return layer * 100 + group.length * 10;
    }
    onFormAnsycLoad(form: CommonForm) {
        this.delayCount--;
        if (this.delayCount == 0) {
            Game.Invoker.EndInvoke(this.gameObject, "lateActive");
            this.mask.SetActive(false);
        }
        //uts.log("remove form:" + form.Name);
    }
    afterFormOpened(form: CommonForm) {
        let layer = form.layer();
        if (UILayer.Normal == layer) {
            // 一级互斥
            let group = this.openstacks[layer];
            for (let i = group.length - 1; i >= 0; i--) {
                let tmpForm = group[i];
                if (tmpForm != form) {
                    // close会将其从openstacks移除
                    tmpForm.close();
                }
            }
        }
    }
    onFormClose(form: CommonForm, cache: boolean): void {
        let layer = form.layer();
        let group = this.openstacks[layer];

        let index = group.indexOf(form);
        if (index >= 0) {
            group.splice(index, 1);
        }

        if (!cache) {
            let name = (form as any).constructor.name;
            delete this.regforms[name];
            //if (!Game.ResLoader.isPublish) {
            //    uts.finalizer(form, this.onFinalize);
            //    Game.ResLoader.ClearMemoryInternal(false);
            //}
        }
        //let p = this.closeCallbackMap[name];
        //delete this.closeCallbackMap[name];
        //if (p) {
        //    let f = this.createForm(p.formToOpen, false) as CommonForm;
        //    f.open.apply(f, p.params);
        //}
    }
    onFinalize(o) {
        //uts.log("delete:"+o.constructor.name);
    }
    getTopView(layer: number): CommonForm {
        let group = this.openstacks[layer];
        if (group.length > 0) {
            return group[group.length - 1];
        }
        return null;
    }
    private createUILayers() {
        for (let i = 0; i < UILayer.Max; i++) {
            let go = new UnityEngine.GameObject();
            go.transform.parent = this.transform;
            go.name = this.layerName(i as UILayer);
            let rtrs = go.AddComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
            rtrs.anchoredPosition3D = new UnityEngine.Vector3(0, 0, -i * 2000);
            rtrs.anchorMin = new UnityEngine.Vector2(0, 0);
            rtrs.anchorMax = new UnityEngine.Vector2(1, 1);
            rtrs.offsetMin = new UnityEngine.Vector2(0, 0);
            rtrs.offsetMax = new UnityEngine.Vector2(0, 0);
            rtrs.pivot = new UnityEngine.Vector2(0.5, 0.5);
            rtrs.localScale = new UnityEngine.Vector3(1, 1, 1);
            this.openstacks[i] = [];
        }
    }

    public getForm<T>(formclass: any): T {
        let form = this.regforms[formclass.name] as CommonForm;
        if (form == null) {
            return null;
        }
        if (form.isOpened) {
            return form as any;
        }
        return null;
    }

    public getChildForm<T>(father: any, id: number): T {
        let form = this.regforms[father.name] as CommonForm;
        if (form == null) {
            return null;
        }
        if (form.isOpened) {
            let nestedForm = form as NestedForm;
            let c = nestedForm.getChildForm<CommonForm>(id);
            if (c == null) {
                return null;
            }
            if (c.isOpened) {
                return c as any;
            }
        }
        return null;
    }

    public getSubFormByID<T>(father: any, id: number): T {
        let form = this.regforms[father.name] as CommonForm;
        if (form == null) {
            return null;
        }
        if (form.isOpened) {
            let tabForm = form as TabForm;
            let c = tabForm.getTabFormByID(id);
            if (c && c.isOpened) {
                return c as any;
            }
        }
        return null;
    }

    public bindCloseCallback(formclass: any, formToOpen: any, id: any = 0) {
        //let form = this.regforms[formclass.name] as CommonForm;
        //if (form == null) {
        //    return;
        //}

        //let p = new CloseParams();
        //p.formToOpen = formToOpen;
        //p.params = params;

        //this.closeCallbackMap[formclass.name] = p;
    }

    public closeForm(formclass: any) {
        let form = this.regforms[formclass.name] as CommonForm;
        if (form != null) {
            form.close();
        }
    }

    /**
     * 是否有任意一个form正打开
     * @param excludedForm
     * @param excludedLayers
     */
    isAnyFormOpenedBut(excludedForms: CommonForm[], includedLayers: UILayer[]): boolean {
        for (let layer of includedLayers) {
            let forms = this.openstacks[layer];
            for (let form of forms) {
                if (!form.isOpened || (null != excludedForms && excludedForms.indexOf(form) >= 0)) {
                    continue;
                }
                return true;
            }
        }
        return false;
    }

    closeAllForKuaFu() {
        for (let indexKey in this.openstacks) {
            let layer = parseInt(indexKey);
            if (UILayer.Base == layer || UILayer.MainUIEffect == layer || UILayer.Effect == layer) {
                continue;
            }
            let forms = this.openstacks[indexKey];
            for (let form of forms) {
                form.close();
            }
        }
    }

    private layerName(layer: UILayer) {
        return 'UILayer.' + UILayer[layer];
    }

    /**
     * 关闭主界面
     */
    closeMainView() {
        G.ViewCacher.mainView.canvas.enabled = false;
    }

    /**
     * 打开主界面
     */
    openMainView() {
        G.ViewCacher.mainView.canvas.enabled = true;
    }

    public toStringAllViews() {
        let str = [];
        for (let key in this.openstacks) {
            let view = this.getTopView((Number)(key));
            str.push(UILayer[key] + ":" + ((view != null) ? view.Name:"null"));
        }
        return str.join('\n');
    }
}