/**
* 跨服数据。
* @author teppei
* 
*/
export class KfData {
    /**是否正在等待同步好数据。*/
    waitSyncRole: boolean = false;

    /**准备跨服的活动ID。*/
    actID: number = 0;

    /**参数2。*/
    para2: number = 0;

    /**
     * 保存参数。
     * @param this.actID
     * @param this.para2
     * 
     */
    saveParas(actID: number, para2: number): void {
        this.actID = actID;
        this.para2 = para2;
    }
}
