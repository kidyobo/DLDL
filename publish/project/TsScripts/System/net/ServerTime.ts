/**
*保存当前服务器时间 
* @author leoqiu
* 
*/
export class ServerTime {
    high: number = 0;
    low: number = 0;

    private static INT32: number = 4294967296;

    static toNumber(high: number, low: number): number {
        let number: number = high * ServerTime.INT32 + low;

        return number;
    }

    static numberToServerTime(number: number): ServerTime {
        let time: ServerTime = new ServerTime();

        time.high = number / ServerTime.INT32;
        time.low = number % ServerTime.INT32;

        return time;
    }
}
