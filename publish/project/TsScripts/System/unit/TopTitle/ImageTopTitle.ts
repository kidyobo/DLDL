import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
import { Global as G } from 'System/global'
export class ImageTopTitle {
    public container: TopTitleContainer;
    public id: number;
    public align: number;
    private gameObject: UnityEngine.GameObject;
    private _path: string = null;
    public get path(): string {
        return this._path;
    }
    private assetRequest: Game.AssetRequest;
    public get loaded() {
        return this.gameObject != null;
    }
    private _width: number = 0;
    private _height: number = 0;
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    load(value: string): void {
        if (this._path != value) {
            this._path = value;
            if (value) {
                if (this.assetRequest != null) {
                    this.assetRequest.Abort();
                    this.assetRequest = null;
                }
                this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, value);
                if (!this.assetRequest.isDone) {
                    if (this.gameObject != null) {
                        UnityEngine.GameObject.DestroyImmediate(this.gameObject);
                        this.gameObject = null;
                        this._cacheX = 0;
                        this._cacheY = 0;
                        this._width = 0;
                        this._height = 0;
                        this.container.refreshPosition();
                    }
                }
                Game.ResLoader.BeginAssetRequest(this.assetRequest, delegate(this, this.onLoad));
            }
            else {
                if (this.assetRequest != null) {
                    this.assetRequest.Abort();
                    this.assetRequest = null;
                }
                if (this.gameObject != null) {
                    UnityEngine.GameObject.DestroyImmediate(this.gameObject);
                    this.gameObject = null;
                    this._cacheX = 0;
                    this._cacheY = 0;
                    this._width = 0;
                    this._height = 0;
                }
            }
        }
    }
    private onLoad(assetRequest: Game.AssetRequest) {
        this.assetRequest = null;
        if (this.gameObject != null) {
            UnityEngine.GameObject.DestroyImmediate(this.gameObject);
            this.gameObject = null;
            this._cacheX = 0;
            this._cacheY = 0;
        }
        if (assetRequest.error != null) {
            uts.logWarning("TopTitle加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        this.gameObject = assetRequest.mainAsset.Instantiate(this.container.transform, false);
        let v2 = G.cacheVec2;
        Game.Tools.GetGameObjectRectSize(this.gameObject, v2);
        this._width = v2.x;
        this._height = v2.y;
        this.container.refreshPosition();
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
export default ImageTopTitle;