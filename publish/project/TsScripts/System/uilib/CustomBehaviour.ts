export class CustomBehaviour {
    protected _gameObject: UnityEngine.GameObject = null;
    protected _transform: UnityEngine.Transform = null;
    protected cb: Game.CustomBehaviour = null;
    constructor(go: UnityEngine.GameObject) {
        this._gameObject = go;
        this._transform = go.transform;
        this.cb = go.GetComponent(Game.CustomBehaviour.GetType()) as Game.CustomBehaviour;
        if (this.cb == null) {
            uts.logError("can not find CustomBehaviour in " + go.name);
            return;
        }
        (go as any)._list = this;
    }
    get gameObject(): UnityEngine.GameObject {
        return this._gameObject;
    }
    get rectTransform(): UnityEngine.RectTransform {
        return this._transform as UnityEngine.RectTransform;
    }
    get transform(): UnityEngine.Transform {
        return this._transform;
    }
}