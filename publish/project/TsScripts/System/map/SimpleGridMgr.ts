import { MapSceneConfig } from 'System/data/scene/MapSceneConfig'

export class SimpleGridMgr {
    private static readonly MIN_SCENE_BLOCK_SIZE: number = 20;

    sceneID: number = 0;

    private m_blockData: number[][] = [];
    /**每行的块数*/
    private m_iWidthBlocks: number = 0;

    /**地图的行数*/
    private m_iHeightBlocks: number = 0;

    updateData(config: MapSceneConfig): void {
        //this.sceneID = config.sceneID;
        //this.m_iWidthBlocks = Math.ceil(config.curMapWidth / config.tileWidth);
        //this.m_iHeightBlocks = Math.ceil(config.curMapHeight / config.tileHeight);

        //this.m_blockData.length = this.m_iHeightBlocks;
        //let index = 0;
        //for (let i = 0; i < this.m_iHeightBlocks; i++) {
        //    let lineArr = this.m_blockData[i];
        //    if (null == lineArr) {
        //        this.m_blockData[i] = lineArr = [];
        //    }
        //    lineArr.length = this.m_iWidthBlocks;
        //    for (let j = 0; j < this.m_iWidthBlocks; j++) {
        //        this.m_blockData[i][j] = config.pathArray[index++];
        //    }
        //}
    }

    isValidXYGrid(gridX: number, gridY: number): boolean {
        if (this.m_blockData == null || gridX < 0 || gridY < 0)
            return false;

        if (gridY >= this.m_iHeightBlocks)
            return false;

        if (gridX >= this.m_iWidthBlocks)
            return false;

        return this.m_blockData[gridY][gridX] > 0;
    }

    /**
     * 寻找从开始点走向目标点最合适的一点 
     * @param endX
     * @param endY
     * @return 
     * 
     */
    searchValidGrid(endX: number, endY: number): UnityEngine.Vector2 {
        // 寻找周围可走点
        let gx: number = Math.floor(endX / SimpleGridMgr.MIN_SCENE_BLOCK_SIZE);
        let gy: number = Math.floor(endY / SimpleGridMgr.MIN_SCENE_BLOCK_SIZE);
        if (this.isValidXYGrid(gx, gy)) {
            return new UnityEngine.Vector2(endX, endY);
        }

        // 找到最大边界
        let max: number = Math.max(Math.max(gx, this.m_iWidthBlocks - gx), Math.max(gy, this.m_iHeightBlocks - gy));

        let targetX: number = 0, targetY: number = 0;
        let found: boolean = false;

        // 下面代码 一会儿优化。。。。
        for (let i: number = 0; i < max; i++) {
            for (let j: number = 0; j <= i; j++) {
                targetX = gx - j;
                targetY = gy - i;

                if (this.isValidXYGrid(targetX, targetY)) {
                    found = true;
                }
                else {
                    targetX = gx + j;
                    targetY = gy - i;

                    if (this.isValidXYGrid(targetX, targetY)) {
                        found = true;
                    }
                    else {
                        targetX = gx - j;
                        targetY = gy + i;

                        if (this.isValidXYGrid(targetX, targetY)) {
                            found = true;
                        }
                        else {
                            targetX = gx + j;
                            targetY = gy + i;

                            if (this.isValidXYGrid(targetX, targetY)) {
                                found = true;
                            }
                            else {
                                targetX = gx - i;
                                targetY = gy - j;

                                if (this.isValidXYGrid(targetX, targetY)) {
                                    found = true;
                                }
                                else {
                                    targetX = gx + i;
                                    targetY = gy - j;

                                    if (this.isValidXYGrid(targetX, targetY)) {
                                        found = true;
                                    }
                                    else {
                                        targetX = gx - i;
                                        targetY = gy + j;

                                        if (this.isValidXYGrid(targetX, targetY)) {
                                            found = true;
                                        }
                                        else {
                                            targetX = gx + i;
                                            targetY = gy + j;

                                            if (this.isValidXYGrid(targetX, targetY)) {
                                                found = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (found) {
                    if (targetX == gx && targetY == gy) {
                        return new UnityEngine.Vector2(endX, endY);
                    }
                    else {
                        return new UnityEngine.Vector2(targetX * SimpleGridMgr.MIN_SCENE_BLOCK_SIZE, targetY * SimpleGridMgr.MIN_SCENE_BLOCK_SIZE);
                    }
                }
            }

        }

        return null;
    }
}