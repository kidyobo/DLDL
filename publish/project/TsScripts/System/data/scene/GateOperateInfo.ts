export class GateOperateInfo {
    sceneID: number = 0;

    gateID: number = 0;

    isEnable: boolean;

    constructor(sceneID: number, gateID: number, isEnable: boolean) {
        this.sceneID = sceneID;
        this.gateID = gateID;
        this.isEnable = isEnable;
    }
}
