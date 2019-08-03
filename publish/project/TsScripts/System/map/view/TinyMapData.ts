import { MapSignType } from "System/map/view/MapSignType"
export class TinyMapData {
    public sceneID: number;
    public id: number;
    public name: string;
    public title: string;
    public mapType: number = MapSignType.Map_None;

    /**
     * 在小地图上的位置
     */
    public x: number;
    public y: number;

    public constructor(sceneID:number,id: number,
        name: string,
        title: string,
        questState: number,
        x: number, y: number) {
        this.sceneID = sceneID;
        this.id = id;
        this.name = name;
        this.title = title;
        this.mapType = questState;
        this.x = x;
        this.y = y;
    }
}
export default TinyMapData;