import { Global as G } from "System/global";
import { UnitCtrlType } from 'System/constants/GameEnum'
import { CachingModel,CachingLayer, CachingSystem } from 'System/CachingSystem'
import { TypeCacher } from 'System/TypeCacher'
import { BaseAvatar } from "System/unit/avatar/BaseAvatar"
export class AvatarMesh {
    protected avatar: BaseAvatar;
    private loadCallback: ()=>void;
    /**模型对象*/
    private modelName: string = null;
    private _model: CachingModel;
    public get model() {
        return this._model;
    }
    private cacheAnimationName: string = null;
    private _rotationX: number = 0;
    private _rotationY: number = 0;
    private _rotationZ: number = 0;
    private _positionX: number = 0;
    private _positionY: number = 0;
    private _positionZ: number = 0;
    public get rotationY() {
        return this._rotationY;
    }

    protected order: number = 0;
    protected layer: number = 0;
    //处于inactive的物体不会加载
    protected _visible = true;

    private cullMode: UnityEngine.AnimatorCullingMode = null;
    private assetRequest: Game.AssetRequest;
    private cacheType: UnitCtrlType;
    private cacheID: string;
    private hasAnimator: boolean;
    private hasCollider: boolean;
    private hasNameBoard: boolean;
    public fordisplay: boolean = false;

    constructor(avatar: BaseAvatar, hasNameBoard: boolean, loadCallback: () => void) {
        this.avatar = avatar;
        this.loadCallback = loadCallback;
        this.hasNameBoard = hasNameBoard;

    }

    public create(avatar: BaseAvatar, hasNameBoard: boolean, loadCallback: () => void) {
        this.avatar = avatar;
        this.loadCallback = loadCallback;
        this.hasNameBoard = hasNameBoard;

    }

    loadModel(type: UnitCtrlType, id: string, hasAnimator: boolean, hasCollider: boolean): boolean {
        this.cacheType = type;
        this.cacheID = id;
        this.hasAnimator = hasAnimator;
        this.hasCollider = hasCollider;
        let name = G.ResourceMgr.getUnitUrlByID(type, id, this.fordisplay);
        if (this.modelName != name) {
            this.modelName = name;
            if (!this._visible) {
                //隐藏的物体不再加载
                return;
            }

            if (this.assetRequest != null) {
                this.assetRequest.Abort();
                this.assetRequest = null;
            }
            let obj: CachingModel = null;
            let newCachingLayer = CachingLayer.None;
            if (this.avatar.cacheModel) {
                switch (type) {
                    case UnitCtrlType.npc:
                        newCachingLayer = CachingLayer.Npc;
                        obj = CachingSystem.popModel(CachingLayer.Npc, name);
                        break;
                    case UnitCtrlType.monster:
                    case UnitCtrlType.collection:
                    case UnitCtrlType.boss:
                    case UnitCtrlType.dropThing:
                        newCachingLayer = CachingLayer.Monster;
                        obj = CachingSystem.popModel(CachingLayer.Monster, name);
                        break;
                    case UnitCtrlType.other:
                        //other不缓存
                        break;
                    default:
                        newCachingLayer = CachingLayer.HeroGroup;
                        obj = CachingSystem.popModel(CachingLayer.HeroGroup, name);
                        break;
                }
            }
          
            if (obj != null) {
                this._onLoadModel(obj);
            }
            else {
                this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low3, name);
                Game.ResLoader.BeginAssetRequest(this.assetRequest, delegate(this, this.onLoadModelPre, name, newCachingLayer));
            }
            return true;
        }
        else {
            return false;
        }
    }
    private onLoadModelPre(assetRequest: Game.AssetRequest, name, newCachingLayer){
        if (assetRequest.error != null) {
            uts.logWarning("avatarmesh error：" + assetRequest.error);
            return;
        }
        let parent = this.avatar.avatarRoot;
        let gameObject = assetRequest.mainAsset.Instantiate(parent, false);
        this.assetRequest = null;
        let model = new CachingModel(name, newCachingLayer, gameObject, parent, this.hasAnimator, this.hasCollider, this.hasNameBoard, this.avatar.model ? this.avatar.model.scale : 1);
        this._onLoadModel(model);
    }

    private _onLoadModel(model: CachingModel) {
        //去除旧的模型
        //this.destroyModel();
        let oldmodel = this.model;
        this._model = model;
        model.setSortingOrder(this.order);
        model.setRenderLayer(this.layer);
        model.setRotation(this._rotationX, this._rotationY, this._rotationZ);
        model.setPosition(this._positionX, this._positionY, this._positionZ);
        if (this.cullMode != null && this._model.animator) {
            this._model.animator.cullingMode = this.cullMode;
        }
        if (this.cacheAnimationName != null) {
            this.playAnimation(this.cacheAnimationName);
            this.cacheAnimationName = null;
        }

        this.onLoadModel(model);

        this.loadCallback.apply(this.avatar);


        if (oldmodel != null) {
            this.onDestroyModel(oldmodel);
            if (this.avatar.cacheModel) {
                CachingSystem.pushModel(oldmodel.cachingLayer, oldmodel.name, oldmodel);
            }
            else {
                oldmodel.destroy();
            }
        }
    }
    private destroyModel() {
        if (this._model != null) {
            let model = this._model;
            this._model = null;
            this.onDestroyModel(model);
            if (this.avatar.cacheModel) {
                CachingSystem.pushModel(model.cachingLayer, model.name, model);
            }
            else {
                model.destroy();
            }
        }
    }

    public destroy(remainLink: boolean = true) {
        this.modelName = null;
        //还原模型到初始状态
        if (this.assetRequest != null) {
            this.assetRequest.Abort();
            this.assetRequest = null;
        }
        this.cacheAnimationName = null;
        if (this._model != null) {
            this.destroyModel();
        }
        if (!remainLink) {
            this.order = 0;
            this.layer = 0;
            this._visible = true;
            this.loadCallback = null;
            this.avatar = null;
        }
    }
    public isPlaying(name: string): boolean {
        if (this._model == null) {
            return false;
        }
        return Game.Tools.isAnimatorPlaying(this._model.animator, 0, name);
    }
    public setParent(root: UnityEngine.Transform) {
        if (this._model == null || root == null) {
            uts.logWarning("模型还没有创建呢 setParent" + (root == null));
            return false;
        }
        this._model.setParent(root);
    }
    hasAnimation(name: string): boolean {
        if (this._model == null) {
            return false;
        }
        return this._model.animator.HasState(0, UnityEngine.Animator.StringToHash(name));
    }
    public setRotation(x: number, y: number, z: number) {
        this._rotationX = x;
        this._rotationY = y;
        this._rotationZ = z;
        if (null != this._model) {
            this._model.setRotation(x, y, z);
        }
    }
    public setPosition(x: number, y: number, z: number) {
        this._positionX = x;
        this._positionY = y;
        this._positionZ = z;
        if (null != this._model) {
            this._model.setPosition(x, y, z);
        }
    }
    public setSortingOrder(order: number) {
        this.order = order;
        if (null == this._model) {
            return;
        }
        this._model.setSortingOrder(order);
    }
    public setRenderLayer(layer: number) {
        this.layer = layer;
        if (null == this._model) {
            return;
        }
        this._model.setRenderLayer(layer);
    }
    public setVisible(value: boolean) {
        if (this._visible != value) {
            this._visible = value;
            if (value) {
                if (this.modelName != null) {
                    this.modelName = null;
                    this.loadModel(this.cacheType, this.cacheID, this.hasAnimator, this.hasCollider);
                }
            }
            else {
                if (this.assetRequest != null) {
                    this.assetRequest.Abort();
                    this.assetRequest = null;
                }
                this.destroyModel();
            }
        }
    }
    get boundWidthPixel(): number {
        if (this._model == null) {
            return 20;
        }
        return G.localPositionUnitToServerPixelUnit(this._model.boundWidth);
    }
    get boundHeightPixel(): number {
        if (this._model == null) {
            return 64;
        }
        return G.localPositionUnitToServerPixelUnit(this._model.boundHeight);
    }
    public setClickAble(value: boolean) {
        if (this._model == null) {
            return;
        }
        this._model.setClickAble(value);
    }
    public setCullingMode(cullMode: UnityEngine.AnimatorCullingMode ) {
        if (this.cullMode != cullMode) {
            this.cullMode = cullMode;
            if (this._model != null && this._model.animator!=null) {
                this._model.animator.cullingMode = cullMode;
            }
        }
    }

    public playAnimation(name: string, fadeTime: number = 0) {
        if (this._model != null) {
            let animator = this._model.animator;
            if (animator != null && animator.isActiveAndEnabled) {
                if (fadeTime == 0) {
                    animator.Play(name, 0, 0);
                }
                else {
                    animator.CrossFade(name, fadeTime, 0,0);
                }
            }
        }
        else {
            this.cacheAnimationName = name;
        }
    }
    public getAnimationLength(name: string) {
        if (this._model == null) {
            return 0;
        }
        return Game.Tools.GetAnimLength(this._model.animator, name);
    }
    protected onLoadModel(model: CachingModel) { }
    protected onDestroyModel(model: CachingModel) { }
}
export default AvatarMesh;