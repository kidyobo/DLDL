import { Global as G } from "System/global"
import { WeatherSystem } from 'System/WeatherSystem'
export class GMRecordManager {
    private static isEnabled: boolean = false;
    private static target: UnityEngine.GameObject;
    private static cameraRec: Game.CameraRec;
    private static locked: boolean = true;
    private static follower: Game.TransformFollower;
    public static toggleManager() {
        if (this.isEnabled) {
            G.DataMgr.runtime.__adVideo = false;
            WeatherSystem.setActive(true);
            Game.DonotDestroyManager.Remove(this.target);
            UnityEngine.GameObject.DestroyImmediate(this.cameraRec);
            this.cameraRec = null;
            G.UnitMgr.heroFollower.enabled = true;
            G.MapCamera.transform.localPosition = G.getCacheV3(0, 16.1, -20.5);
            G.MapCamera.transform.localRotation = UnityEngine.Quaternion.Euler(37, 0, 0);
            G.MoveRoot.transform.localRotation = UnityEngine.Quaternion.Euler(0, 0, 0);
            this.locked = false;
        }
        else {
            WeatherSystem.setActive(false);
            G.DataMgr.runtime.__adVideo = true;
            G.UnitMgr.heroFollower.enabled = false;
            this.target = new UnityEngine.GameObject("target");
            Game.DonotDestroyManager.Add(this.target);
            this.cameraRec = G.MoveRoot.AddComponent(Game.CameraRec.GetType()) as Game.CameraRec;
            this.cameraRec.target = this.target.transform;
            let pos = G.MapCamera.transform.position;
            G.MapCamera.transform.position = G.getCacheV3(0, 0, 0);
            G.MapCamera.transform.localRotation = UnityEngine.Quaternion.Euler(0,0,0);
            this.cameraRec.cam = G.MapCamera.transform;
            this.cameraRec.sensitivity = 6;
            this.cameraRec.wsadsensitivity = 0.1;
            this.target.transform.position = G.UnitMgr.hero.model.rotateTransform.position;
            this.follower = this.target.AddComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
            this.follower.target = G.UnitMgr.hero.model.transform;
        }
        this.isEnabled = !this.isEnabled;
    }
    public static toggleLookAt() {
        if (this.isEnabled) {
            if (!this.locked) {
                this.cameraRec.LockTarget(G.UnitMgr.hero.model.rotateGameObject);
            }
            else {
                this.cameraRec.LockTarget(null);
            }
            this.locked = !this.locked;
            this.follower.enabled = this.locked;
        }
    }
}