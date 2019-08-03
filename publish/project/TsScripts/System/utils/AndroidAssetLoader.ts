import { Global } from "../global";

export class AndroidAssetLoader {
    static readonly loadingPageAssetPath: string = "loadingpage.jpg";
    static readonly loginPageAssetPath: string = "loginpage.jpg";
    static readonly logoAssetPath: string = "logo.png";
    static exists(assetName: string) {
        if (!Game.Tools.AndroidAssetIsExists) return false;
        return Game.Tools.AndroidAssetIsExists(assetName);
    }
    static loadImage(assetName: string, img: { texture: UnityEngine.Texture }, bindobj: UnityEngine.GameObject, callback:(img: { texture: UnityEngine.Texture })=>void = null) {
        let req = Game.ResLoader.CreateUrlAssetRequest(Game.UrlAssetType.Texture, this.streamingAssetPath + '/' + assetName, false);
        bindobj.SetActive(false);
        Game.ResLoader.BeginUrlAssetRequest(req, delegate(this, this.onLoadAsset, img, bindobj, callback));
    }

    private static onLoadAsset(assetRequest: Game.UrlAssetRequest, img: { texture: UnityEngine.Texture }, bindobj: UnityEngine.GameObject, callback:(img: { texture: UnityEngine.Texture })=>void) {
        bindobj.SetActive(true);
        if (assetRequest.error != null) {
            return;
        }
        let asset = assetRequest.mainAsset;
        asset.AddLinkObject(bindobj);
        img.texture = asset.texture;
        if (callback) callback(img);
    }

    private static get streamingAssetPath(): string {
        if (Global.IsAndroidPlatForm) {
            return UnityEngine.Application.streamingAssetsPath;
        }
        else if (Global.IsIOSPlatForm) {
            return 'file://' + UnityEngine.Application.streamingAssetsPath;
        }
        else {
            return 'file:///' + UnityEngine.Application.streamingAssetsPath;
        }
    }
}