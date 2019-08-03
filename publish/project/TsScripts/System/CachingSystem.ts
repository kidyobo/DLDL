import { Global as G } from "System/global";
import { TypeCacher } from 'System/TypeCacher'
export class CachingSystem {
    public static root: UnityEngine.Transform;
    private static cachingMaxSize: Array<number> = [];
    private static cachingSize: Array<number> = [];
    private static cachingList: Array<{ [index: string]: CachingModel[] }> = [];
    static init() {
        this.cachingList[CachingLayer.None] = {};
        this.cachingList[CachingLayer.Monster] = {};
        this.cachingList[CachingLayer.Npc] = {};
        this.cachingList[CachingLayer.HeroGroup] = {};
        this.cachingList[CachingLayer.Effect] = {};

        this.cachingSize[CachingLayer.Monster] = 0;
        this.cachingSize[CachingLayer.Npc] = 0;
        this.cachingSize[CachingLayer.HeroGroup] = 0;
        this.cachingSize[CachingLayer.Effect] = 0;

        this.cachingMaxSize[CachingLayer.Monster] = 0;
        this.cachingMaxSize[CachingLayer.Npc] = 0;
        this.cachingMaxSize[CachingLayer.HeroGroup] = 0;
        this.cachingMaxSize[CachingLayer.Effect] = 0;

        let obj = new UnityEngine.GameObject("CacheSystemRoot");
        this.root = obj.transform;
        obj.SetActive(false);

        //预先缓存对象
    }
    private static removeAllIfOverflow(layer: CachingLayer) {
        //怪物和NPC删除模型为，超过最大上限将会清空所有
        let cachingList = this.cachingList[layer];
        let maxSize = this.cachingMaxSize[layer];
        let currentSize = this.cachingSize[layer];
        if (currentSize > maxSize) {
            for (let key in cachingList) {
                let list = cachingList[key];
                for (let obj of list) {
                    obj.destroy();
                }
            }
            this.cachingList[layer] = {};
            this.cachingSize[layer] = 0;
            //uts.log("clear " + CachingLayer[layer]);
        }
    }
    static onChangeScene() {
        //将多余的删除
        this.removeAllIfOverflow(CachingLayer.Monster);
        this.removeAllIfOverflow(CachingLayer.Npc);
        this.removeAllIfOverflow(CachingLayer.HeroGroup);
        this.removeAllIfOverflow(CachingLayer.Effect);
    }
    static pushModel(layer: CachingLayer, path: string, obj: CachingModel) {
        if (layer == CachingLayer.None) {
            obj.destroy();
        }
        else {
            let group = this.cachingList[layer][path];
            if (group == null) {
                group = [];
                this.cachingList[layer][path] = group;
            }
            obj.setParent(this.root);
            group.push(obj);
            this.cachingSize[layer]++;
        }
    }
    //从缓存中获取一个资源，如果没有，返回null
    static popModel(layer: CachingLayer, path: string): CachingModel {
        let group = this.cachingList[layer][path];
        if (group == null || group.length == 0) {
            return null;
        }
        let obj = group.pop() as CachingModel;
        this.cachingSize[layer]--;
        return obj;
    }
}
export enum CachingLayer {
    Monster = 0,
    Npc,
    HeroGroup,
    Effect,
    None,
}
class CachingModelInfo {
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    colliderTag: number = 0;
}

export class CachingModel {
    name: string;
    cachingLayer: CachingLayer;
    gameObject: UnityEngine.GameObject;
    transform: UnityEngine.Transform;
    animator: UnityEngine.Animator;
    collider: UnityEngine.BoxCollider = null;
    boundWidth: number = 0;
    boundHeight: number = 0;
    order: number = 0;
    layer: number = 0;
    clickAble: boolean = true;
    private childs: { [index: string]: UnityEngine.Transform } = {};
    private parent: UnityEngine.Transform;
    private _rotationX: number = 0;
    private _rotationY: number = 0;
    private _rotationZ: number = 0;
    private _positionX: number = 0;
    private _positionY: number = 0;
    private _positionZ: number = 0;

    //缓存了所有模型的缓存信息
    private static allModelInfoDic: { [id: string]: CachingModelInfo } = {};
    private info: CachingModelInfo;

    constructor(name: string, cachingLayer: CachingLayer, model: UnityEngine.GameObject, parent: UnityEngine.Transform, hasAnimator: boolean, hasCollider: boolean, hasNameBoard: boolean, scale: number) {
        this.name = name;
        this.cachingLayer = cachingLayer;
        this.gameObject = model;
        this.transform = model.transform;
        this.parent = parent;
        let size = G.cacheVec3;

        if (hasAnimator) {
            this.animator = model.GetComponent(TypeCacher.Animator) as UnityEngine.Animator;
        }
        if (hasNameBoard) {
            this.info = CachingModel.allModelInfoDic[name];
            if (!this.info) {
                let value = new CachingModelInfo();
                CachingModel.allModelInfoDic[name] = value;
                this.info = value;
                let renderer = this.gameObject.GetComponentInChildren(TypeCacher.SkinnedMeshRenderer) as UnityEngine.Renderer;
                if (!renderer) {
                    renderer = this.gameObject.GetComponentInChildren(TypeCacher.MeshRenderer) as UnityEngine.Renderer;
                }

                if (renderer) {
                    Game.Tools.GetRenderBoundsSize(renderer, size);
                    value.sizeX = size.x / scale;
                    value.sizeY = size.y / scale;
                    value.sizeZ = size.z / scale;
                }
                else {
                    uts.logWarning(model.name + " 无法生成碰撞盒,没有蒙皮信息");
                }
            }
            this.calcBounds(scale);

            if (hasCollider) {
                let colliderTag = this.info.colliderTag;
                if (colliderTag == 0) {
                    this.collider = this.gameObject.GetComponent(TypeCacher.BoxCollider) as UnityEngine.BoxCollider;
                    if (this.collider) {
                        this.info.colliderTag = 1;
                    }
                    else {
                        this.info.colliderTag = 2;
                        this.collider = this.gameObject.AddComponent(TypeCacher.BoxCollider) as UnityEngine.BoxCollider;
                    }
                }
                else if (colliderTag == 1) {
                    this.collider = this.gameObject.GetComponent(TypeCacher.BoxCollider) as UnityEngine.BoxCollider;
                }
                else {
                    this.collider = this.gameObject.AddComponent(TypeCacher.BoxCollider) as UnityEngine.BoxCollider;
                }
                size.Set(this.info.sizeX / 3 * 2, this.info.sizeY / 3 * 2, this.info.sizeZ / 3 * 2);
                this.collider.size = size;
                size.Set(0, this.info.sizeY / 3, 0);
                this.collider.center = size;
            }
        }
    }
    public destroy() {
        UnityEngine.GameObject.Destroy(this.gameObject);
        this.gameObject = null;
        this.animator = null;
        this.collider = null;
        this.childs = null;
        this.parent = null;
        this.transform = null;
    }
    /**
     * 重新计算包围盒大小，比如设置scale后。
     */
    public calcBounds(scale: number) {
        if (this.info) {
            this.boundWidth = this.info.sizeX * scale;
            this.boundHeight = this.info.sizeY * scale;
        }
    }
    public createChildTransform(name: string, needFixer: boolean, fixerRotationX: number, fixerRotationY: number, fixerRotationZ: number,
        fixerPostionX = 0, fixerPostionY = 0, fixerPostionZ = 0): UnityEngine.Transform {
        let target = this.childs[name];
        if (target == null) {
            if (name == "" || name == null) {
                target = this.transform;
            }
            else {
                target = this.transform.Find(name);
                if (target == null) {
                    uts.logWarning("节点不存在：" + name);
                    return null;
                }
            }
            if (needFixer) {
                let obj = new UnityEngine.GameObject("fixer");
                let t = obj.transform;
                t.SetParent(target, false);
                t.Translate(G.getCacheV3(fixerPostionX, fixerPostionY, fixerPostionZ));
                t.Rotate(G.getCacheV3(fixerRotationX, fixerRotationY, fixerRotationZ));
                target = t;
            }
            this.childs[name] = target;
        }
        return target;
    }
    public getChildTransform(name: string): UnityEngine.Transform {
        let target = this.childs[name];
        if (target == null) {
            let obj = Game.Tools.GetChild(this.gameObject, name);
            if (obj == null) {
                uts.logWarning("节点不存在：" + name);
                return null;
            }
            target = obj.transform;
            this.childs[name] = target;
        }
        return target;
    }
    public setSortingOrder(value: number) {
        if (this.order != value) {
            this.order = value;
            Game.Tools.SetSortingOrder(this.gameObject, value);
        }
    }
    public setRenderLayer(value: number) {
        if (this.layer != value) {
            this.layer = value;
            Game.Tools.SetRendererLayer(this.gameObject, value);
        }
    }
    public setClickAble(value: boolean) {
        if (this.clickAble != value) {
            this.clickAble = value;
            let collider = this.collider;
            if (collider != null) {
                collider.enabled = value;
            }
        }
    }
    public setParent(parent: UnityEngine.Transform) {
        if (parent != this.parent) {
            this.parent = parent;
            this.transform.SetParent(parent, false);
        }
    }
    public setRotation(x: number, y: number, z: number) {
        if (this._rotationX != x ||
            this._rotationY != y ||
            this._rotationZ != z) {
            this._rotationX = x;
            this._rotationY = y;
            this._rotationZ = z;
            Game.Tools.SetGameObjectLocalRotation(this.gameObject, x, y, z);
        }
    }
    public setPosition(x: number, y: number, z: number) {
        if (this._positionX != x ||
            this._positionY != y ||
            this._positionZ != z) {
            this._positionX = x;
            this._positionY = y;
            this._positionZ = z;
            Game.Tools.SetGameObjectLocalPosition(this.gameObject, x, y, z);
        }
    }
}