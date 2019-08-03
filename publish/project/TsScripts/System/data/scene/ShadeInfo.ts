/**
* 遮挡配置 
* @author fygame
* 
*/
export class ShadeInfo {
    x: number = 0;

    y: number = 0;

    width: number = 0;

    height: number = 0;

    url: string;

    rect: UnityEngine.Rect;

    show: boolean;

    //private _bitmap: Bitmap;

    isLoading: boolean;

    constructor(x: number, y: number, width: number, height: number, picPath: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.url = picPath;
        this.rect = new UnityEngine.Rect(x, y, width, height);
    }

    //get bitMap(): Bitmap {
    //    return this._bitmap;
    //}

    //set bitMap(value: Bitmap): void {
    //    this._bitmap = value;
    //}
}
