import { Global as G } from "System/global";
import { EnumDurationType } from "System/constants/GameEnum";
import { ServerTime } from "System/net/ServerTime";
import { DataFormatter } from "System/utils/DataFormatter";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";

/**
 * 时间同步：存放包括服务器时间，延迟时间。
 * @author fygame
 *
 */
export class SyncTime {
    /**一个临时计算使用的Date结构，注意不要保存其引用。*/
    tmpDate: Date;

    /**
     *  当前的服务器时间
     */
    private _serverTime: number = 0;

    /**当前服务器的Data*/
    private m_serverDate: Date;

    /**当同步服务器时间时的当前客户端时间，是相对于程序启动的时间*/
    private _lastGetSvrAt = 0;

    /**是否可用。*/
    private m_isReady: boolean;

    /**服务器时区*/
    timeZone: number = 8;

    /**LoginServerResponse传来的服务器开始时间。*/
    m_uiServerStartTime: number = 0;

    /**LoginServerResponse传来的和服时间。*/
    m_uiServerMergeTime: number = 0;

    private timeStr2Stamp: { [timeStr: string]: number } = {};

    private oldDate = 0;

    /**
     * 构造函数
     *
     */
    constructor() {
        this.tmpDate = new Date();
        this.m_serverDate = new Date();
    }

    get serverDate(): Date {
        this.m_serverDate.setTime(this.getCurrentTime());
        return this.m_serverDate;
    }

    /**
     * 记录当前服务器时间
     * @param high
     * @param low
     *
     */
    setServerTime(high: number, low: number): boolean {
        //转为Number类型
        this._serverTime = ServerTime.toNumber(high, low);//当前服务器时间
        this._lastGetSvrAt = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);//当前客户端时钟

        this.m_serverDate.setTime(this._serverTime);

        //统一修改为每天凌晨6点为新 的一天刷新点
        let theDate = this.serverDate.getFullYear() * 10000 + this.serverDate.getMonth() * 100 + this.serverDate.getDay();
        let isOverDay = this.oldDate > 0 && this.oldDate != theDate;
        this.oldDate = theDate;

        this.m_isReady = true;
        return isOverDay;
    }

    /**
     * 当前的服务器时间（单位毫秒）
     * @return
     *
     */
    getCurrentTime(): number {
        let currentTime: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);//当前时钟
        let timeDifference: number = currentTime - this._lastGetSvrAt;//时钟差
        //新的服务时间：时钟差加到旧服务器时间
        return this._serverTime + timeDifference;
    }

    /**
     * 获取时间段类型，包括之前、之中、之后。
     * @param start 时间段起点，单位秒，仅含时分秒。
     * @param end 时间段终点，单位秒，仅含时分秒。
     * @param timeStamp 用于比对的时间戳，单位毫秒。
     * @return
     *
     */
    getDurationType(startTime: number, endTime: number, timeStamp: number): EnumDurationType {
        let t = Math.floor(((timeStamp + this.timeZone * 3600000) % 86400000) / 1000);
        if (t < startTime)
            return EnumDurationType.Before;
        else if (t > endTime)
            return EnumDurationType.After;
        return EnumDurationType.InDuration;
    }

    /**
     * 获取下一个指定时间点（单位毫秒），如果当前时间正好符合指定时间，则返回当前时间。
     * @param hour 小时。
     * @param minute 分钟。
     * @param second 秒。
     * @param startAt 时间起点，默认为当前时间（单位毫秒）。
     * @param force 是否强制延长开服第一天的时间。
     * @return
     *
     */
    getNextTime(hour: number, minute: number, second: number): number {
        let startAt = this.getCurrentTime();
        let s = this.m_uiServerStartTime * 1000;
        if (startAt < s) {
            startAt = s;
        }
        let t = startAt - ((startAt + this.timeZone * 3600000) % 86400000) + hour * 3600000 + minute * 60000 + second * 1000;
        if (t < startAt) {
            t += 86400000;
        }
        return t;
    }

    /**
     * 获取上一个指定时间点（单位毫秒），如果当前时间正好符合指定时间，则返回当前时间。
     * @param hour 小时。
     * @param minute 分钟。
     * @param second 秒。
     * @param startAt 时间起点，默认为当前时间（单位毫秒）。
     * @return
     *
     */
    getLastTime(hour: number, minute: number, second: number, startAt: number = 0): number {
        if (0 == startAt) {
            startAt = this.getCurrentTime();
        }
        this.tmpDate.setTime(startAt);
        this.tmpDate.setHours(hour);
        this.tmpDate.setMinutes(minute);
        this.tmpDate.setSeconds(second);
        let last: number = this.tmpDate.getTime();
        if (last > startAt) {
            last -= 86400000;
        }

        return last;
    }

    /**
     * 获得指定日期的毫秒数
     * @param year
     * @param month
     * @param day
     * @param hour
     * @return
     *
     */
    getFixedTime(year: number, month: number, day: number, hour: number, minustes: number = 0, second: number = 0): number {
        if (defines.has('_DEBUG')) { uts.assert(month > 0, '月数不能传0'); }
        this.tmpDate.setFullYear(year, month - 1, day);
        this.tmpDate.setHours(hour);
        this.tmpDate.setMinutes(minustes);
        this.tmpDate.setSeconds(second);
        return this.tmpDate.getTime();
    }

    getTodayZeroTime(): number {
        let now: number = this.getCurrentTime();
        return this.getTheZeroTime(now);
    }
    /**
     * 获取零点  参数:毫秒
     * @param time
     */
    getOneZeroTime(time: number): number {
        return this.getTheZeroTime(time);
    }
    private getTheZeroTime(time: number) {
        // 先计算超出一天的余数 60s * 60m * 24 * 1000
        return time - ((time + this.timeZone * 3600000) % 86400000);
    }

    /**单位分钟*/
    get timezoneOffset(): number {
        return this.timeZone * 60;
    }

    /**
     * 获取指定周指定星期值当天的0点，比如获取本周周三的0点。
     * @param day 指定的星期值（0 代表星期日，1 代表星期一，依此类推）。
     * @param 时间起点，默认值0，表示当前时间（单位毫秒），即以本周时间进行计算，否则以指定起点所在周进行计算。
     * @return
     *
     */
    getThisWeekDayZero(day: number, startAt: number = 0): number {
        // 先获取当天0点的时间
        let lastZero: number = this.getLastTime(0, 0, 0, startAt);
        this.tmpDate.setTime(lastZero);
        let today: number = this.tmpDate.getDay();
        if (today == day) {
            return lastZero;
        }

        // 为方便计算，将0转为7
        if (0 == day) {
            day = 7;
        }
        if (0 == today) {
            today = 7;
        }
        return lastZero - (today - day) * 86400000;
    }

    /**
     * 获取当前时间是开服后第几天。
     * @return
     *
     */
    getDateAfterStartServer(): number {
        // 先获取第二天的所在时间
        return this.getDateAfterSpecifiedTime(this.m_uiServerStartTime * 1000);
    }

    /**赛季功能开启起始时间点 2019-07-23 00:00:00*/
    getSaiJiDateAfterStartServer(): number {
        let c_StartTime = 1563811200*1000;
        let max = Math.max(this.m_uiServerStartTime * 1000, c_StartTime);
        return this.getDateAfterSpecifiedTime(max);
    }

    /**
     * 获得当前时间是合服后的第几天
     */
    getDateAfterMergeServer(): number {
        if (this.m_uiServerMergeTime == 0) return 0;
        return this.getDateAfterSpecifiedTime(this.m_uiServerMergeTime * 1000);
    }

    /**
    * 获得当前时间是几时
    */
    getDateHour(): number {
        return DataFormatter.getHour(this.getCurrentTime() / 1000);
    }

    /**
     * 获取当前时间是指定时间后的第几天。
     * @return
     *
     */
    private getDateAfterSpecifiedTime(time: number): number {
        //开服天数增加了0天情况,前台处理算出小于1天的按一天处理即可
        let now = this.getCurrentTime();
        let t = Math.ceil((now - this.getTheZeroTime(time)) / 86400000);
        return Math.max(t, 1);
    }


    /**
     * 获得当前时间是开服后的第几周
     */
    getWeekAfterSatrtServer(): number {
        let date = this.getDateAfterStartServer();
        return Math.ceil(date / 7);
    }

    /**
     * 判断两个时间是否在同一天 <br>
     * 暂定北京时间 8 ； 下次后台会在登陆成功下发服务器时区来，供客户端各种计算使用
     * @param time1 单位秒
     * @param time2
     * @return
     *
     */
    isSameDay(time1: number, time2: number): boolean {
        return Math.floor((time1 + this.timeZone * 3600) / 86400) == Math.floor((time2 + this.timeZone * 3600) / 86400);
    }

    /**
     * 服务器时间是否可用，在同步心跳包之前不可用。
     * @return
     *
     */
    get isReady(): boolean {
        return this.m_isReady;
    }

    /**获取服务器0点剩余秒数 (秒)*/
    getServerZeroLeftTime(): number {
        return (this.getNextTime(0, 0, 0) - this.getCurrentTime()) / 1000;
    }

    toString(): string {
        // 更新时间
        this.tmpDate.setTime(this.m_uiServerStartTime * 1000);
        let openWeekDay: string;
        if (0 == this.tmpDate.getDay()) {
            openWeekDay = '日';
        }
        else {
            openWeekDay = SpecialCharUtil.getHanNum(this.tmpDate.getDay());
        }
        // 当前周几
        this.tmpDate.setTime(this.getCurrentTime());
        let nowWeekDay: string;
        if (0 == this.tmpDate.getDay()) {
            nowWeekDay = '日';
        }
        else {
            nowWeekDay = SpecialCharUtil.getHanNum(this.tmpDate.getDay());
        }
        let mergeInfo: string;
        if (this.m_uiServerMergeTime > 0) {
            // 合服周几
            this.tmpDate.setTime(this.m_uiServerMergeTime * 1000);
            let mergeWeekDay: string;
            if (0 == this.tmpDate.getDay()) {
                mergeWeekDay = '日';
            }
            else {
                mergeWeekDay = SpecialCharUtil.getHanNum(this.tmpDate.getDay());
            }
            mergeInfo = uts.format('{0}（周{1}，合服第{2}天）',
                DataFormatter.second2yyyymmddhhmm(this.m_uiServerMergeTime), mergeWeekDay, this.getDateAfterMergeServer());
        } else {
            mergeInfo = '无';
        }

        return uts.format('开服：{0}(周{1})，当前：{2}（周{3}，开服第{4}天），合服：{5}，上次离线：{6}',
            DataFormatter.second2yyyymmddhhmm(this.m_uiServerStartTime), openWeekDay,
            DataFormatter.second2yyyymmddhhmm(Math.round(this.getCurrentTime() / 1000)), nowWeekDay, this.getDateAfterStartServer(),
            mergeInfo, DataFormatter.second2yyyymmddhhmm(G.DataMgr.systemData.m_uiLastLogoutTime));
    }
}
