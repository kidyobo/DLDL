import { Global as G } from "System/global";

export class MapCameraSetting {
    private screenFitHeight: number = 900;

    constructor() {
        this.initCamera();
    }

    get xMeterScale(): number {
        return 20;
    }

    get yMeterScale(): number {
        return 20;
    }

    get ScreenFitHeight(): number {
        return this.screenFitHeight;
    }

    private initCamera() {
        G.MapCamera.transform.position = UnityEngine.Vector3.op_Multiply(G.MapCamera.transform.forward, -5000 / this.xMeterScale);
        G.MapCamera.setSize(this.screenFitHeight / this.xMeterScale/2);
    }
}