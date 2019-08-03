
export class InsertDiamondList {
    constructor(sepW: number = 0, sepH: number = 0) {
        //super(sepW, sepH);
    }

    static DIAMOND_NUM: number = 6;
    protected  itemPosition:Array<any>;

    protected initPosition(): void {
        this.itemPosition = new Array<any>(InsertDiamondList.DIAMOND_NUM);
        this.itemPosition[0] = [141, 40];
        this.itemPosition[1] = [269, 122];
        this.itemPosition[2] = [269, 239];
        this.itemPosition[3] = [141, 311];
        this.itemPosition[4] = [15, 239];
        this.itemPosition[5] = [15, 122];
    }
}
