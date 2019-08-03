import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
import { UnitModel } from "System/unit/UnitModel"
export abstract class BaseAvatar {
    protected _visible = true;
    public model: UnitModel;
    public get cacheModel() {
        return this.model ? true : false;
    }
    public avatarRoot: UnityEngine.Transform;
    public avatarRoot2: UnityEngine.Transform;

    constructor(root: UnityEngine.Transform, root2: UnityEngine.Transform, model: UnitModel=null) {
        if (root != null) {
            this.create(root, root2, model);
        }
    }

    public create(root: UnityEngine.Transform, root2: UnityEngine.Transform, model: UnitModel) {
        if (this.avatarRoot != null) {
            return;
        }
        this.avatarRoot = root;
        this.avatarRoot2 = root2;
        this.model = model;
        this.onCreate();
    }

    public destroy() {
        if (this.avatarRoot == null) {
            return;
        }
        this.onDestroy();
        this.avatarRoot = null;
        this.avatarRoot2 = null;
        this.model = null;
        this._visible = true;
    }

    public abstract get defaultAvatar(): AvatarMesh;
    public abstract onCreate();
    public abstract setSortingOrder(order: number);
    public abstract setRenderLayer(layer: number);
    public abstract setVisible(value: boolean);
    public abstract updateNameboardPosition();
    public abstract setClickAble(value: boolean);
    public abstract updateAnimation();
    public abstract onDestroy();
}
export default BaseAvatar;