export class int {
    static MAX_VALUE: number = 2147483647;
}

export class uint {
    static MAX_VALUE: number = 4294967295;
}

export class MathUtil {

    static getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    /**
     * 比较两个Vector2是否在容差内相等。
     * @param v1
     * @param v2
     * @param tolerance
     */
    static vector2Equals(v1: UnityEngine.Vector2, v2: UnityEngine.Vector2, tolerance: number = 0): boolean {
        if (UnityEngine.Vector2.op_Equality(v1, v2)) {
            return true;
        } else if (tolerance > 0 && Math.abs(v1.x - v2.x) < tolerance && Math.abs(v1.y - v2.y) < tolerance) {
            return true;
        }

        return false;
    }

    /**
	* 检查按位存储值是否达成
	* @param	pos
	* @param	posValue
	* @return
	*/
    static checkPosIsReach(pos: number, posValue: number): boolean {
        let tmpPosValue: number = 1 << pos;
        let isReach: boolean = (posValue & tmpPosValue) > 0;
        return isReach;
    }
    /**
 *  生成一个介于 参数1 和 参数2 之间的随机数，精度为参数3
 *  @param  minimum 	最小值
 *  @param  maximum     最大值，如果缺少默认为0
 *  @param  精度          默认值为自然数
 *  @return             一个随机数
 *  RandomBetweenTwoNumbers(0,100)//0-100的随机数
 *  RandomBetweenTwoNumbers(0,100，5)//0-100的5的倍数随机数
 *  RandomBetweenTwoNumbers(-1,1，.05)//-1至1的随机数，精确到百分之5
 */
    public static randomBetweenTwoNumbers(nMinimum: number, nMaximum: number = 0, nRoundToInterval: number = 1): number {
        if (nMinimum > nMaximum) {
            var nTemp: number = nMinimum;
            nMinimum = nMaximum;
            nMaximum = nTemp;
        }
        var nDeltaRange: number = nMaximum - nMinimum + 1 * nRoundToInterval;
        var nRandomNumber: number = Math.random() * nDeltaRange;
        nRandomNumber += nMinimum;
        return Math.floor(nRandomNumber / nRoundToInterval) * nRoundToInterval;
    }

    /**
     * 比较ver1和ver2大小，ver1<ver2 返回 -1 ver1 == ver2 返回 0， ver1>ver2 返回 1
     * ver的格式为 xxx.xxx.xxx.xxx
     */
    public static compareVersion(ver1: string, ver2: string): number {
        return this.getVersion(ver1) - this.getVersion(ver2);
    }
    private static getVersion(ver: string): number {
        let arr = ver.split('.');
        return Number(arr[0]) * 100000 * 1000 * 1000 + Number(arr[1]) * 100000 * 1000 + Number(arr[2]) * 100000 + Number(arr[3]);
    }
}