/**
	 * 镶嵌宝石的数据
	 * @author Zheng
	 *
	 */
export class InsertDiamondItemData {
    isLock: boolean;
    containerID: number = 0;
    pos: number = 0;
    slot: number = 0;
    id: number = 0;
    equipPart: number = 0;
    equipID: number = 0;
    openLevel: number = 0;
    /** 宝石所在的位置 */
    index: number = 0;
    /**宝石等级*/
    level: number = 0;
    /**宝石进度*/
    process: number = 0;
    /**可镶嵌或者可替换*/
    canInsertOrReplace: boolean = false;
    /**可升级*/
    canLvUp: boolean = false;
}
