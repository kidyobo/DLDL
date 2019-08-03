import { Global as G } from "System/global"
import { Constants } from "System/constants/Constants"
import { VersionUtil } from "../System/utils/VersionUtil";
export class SceneLoader {
    private asset: Game.Asset;
    private waitCount = 0;

    private oldId = 0;
    load(id: number) {
        if(id == this.oldId) {
            this.onEnter();
            return;
        }
        this.oldId = id;

        if (this.asset != null) {
            this.asset.autoCollect = true;
        }
        this.asset = Game.ResLoader.LoadAsset(uts.format("scene/{0}.unity", id));
        this.asset.autoCollect = false;
        this.waitCount++;
        Game.SceneData.onAwake = delegate(this, this.onAwake);
        UnityEngine.SceneManager.LoadScene(id.toString(), UnityEngine.LoadSceneMode.Single);
    }

    private onAwake() {
        if (this.waitCount > 1) {
            this.waitCount--;
            return;
        }
        this.waitCount--;
        let camera = G.getMainCamera();
        let sceneCamera = UnityEngine.GameObject.Find("looker").GetComponentInChildren(UnityEngine.Camera.GetType(), true) as UnityEngine.Camera;
        if (sceneCamera == null) {
            uts.logError("场景中的looker或者摄像机不存在");
        }
        else {
            camera.transform.localRotation = UnityEngine.Quaternion.Euler(G.getCacheV3(37, 0, 0));
            camera.transform.localPosition = G.getCacheV3(0, 16.1, -20.5);
            camera.backgroundColor = sceneCamera.backgroundColor;
            camera.fieldOfView = 40;
            camera.nearClipPlane = sceneCamera.nearClipPlane;
            camera.farClipPlane = sceneCamera.farClipPlane;
            camera.clearFlags = sceneCamera.clearFlags;
            if (Game.SceneData.instance.enableDepth) {
                camera.depthTextureMode = UnityEngine.DepthTextureMode.Depth;
            }
            else {
                camera.depthTextureMode = UnityEngine.DepthTextureMode.None;
            }

            this.onEnter();
        }
    }
    private onEnter() {
        G.LoadingAnimPlayer.setJumpAble(true);
        if (G.LoadingAnimPlayer.isRunning) {
            Game.Invoker.BeginInvoke(G.Root, "waitenter", 0.1, delegate(this, this.onEnter));
        }
        else {
            G.ModuleMgr.SceneModule.enterScene();
        }
        UnityEngine.Application.backgroundLoadingPriority = UnityEngine.ThreadPriority.Low;
    }

    unload() {
    }
    getSceneRes(id: number): string[] {
        let array: string[] = [];
        array.push(uts.format("scene/{0}.unity", id));
        return array;
    }
    setEffectActive(value: boolean) {
    }
    getSceneSmallMap(id: number): string {
        return null;
    }
    getSceneDownloadRes(id: number): string[] {
        return [];
    }
    setHeroTransform(value: UnityEngine.Transform) {
    }
}