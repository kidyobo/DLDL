import { Global as G } from 'System/global'

/**
 * 格式化工具。
 * @author xiaojialin
 *
 */
export class DataFormatter {
    static days: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    static chineseNum: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    private static m_tmpDate: Date = new Date();

    private static _TRIM_TAIL_ZERO_REG: RegExp = /\.*0+$/g;

    static toFixed(value: number, fractionDigits: number): string {
        let raw = value.toFixed(fractionDigits);
        return raw.replace(/\.0+$/, '');
    }

    /**使用千位分隔符*/
    static thousandFormat(value: number): string {
        if (value < 1000) {
            return value.toString();
        }
        return value.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
    }

    /**
     * 将数字转换为汉数字，比如12转为十二，10014转为一万零一十四。
     * @param value
     */
    static toHanNumStr(value: number): string {
        let s: string = '';
        if (value < 0) {
            s += '负';
            value = -value;
        }
        if (value <= 10) {
            s += DataFormatter.chineseNum[value];
            return s;
        }
        let d: string[] = ['十', '百', '千', '万', '亿'];
        let n: number[] = [10, 100, 1000, 10000, 100000000];
        let l: number = d.length;
        let lastFlag: boolean = false;
        let continuousSkipCnt: number = 0;
        let gotCnt: number = 0;
        for (let i: number = l - 1; i >= 0; i--) {
            if (value >= n[i]) {
                let o = Math.floor(value / n[i]);
                if (gotCnt > 0 && !lastFlag && continuousSkipCnt > 0) {
                    s += '零';
                }
                if (!(n[i] == 10 && 1 == o && gotCnt == 0)) {
                    // 处理一十和十
                    s += DataFormatter.toHanNumStr(o);
                }
                s += d[i];
                value = value % n[i];
                lastFlag = true;
                continuousSkipCnt = 0;
                gotCnt++;
            } else {
                lastFlag = false;
                continuousSkipCnt++;
            }
        }
        if (value > 0) {
            s += DataFormatter.chineseNum[value];
        }

        return s;
    }

    static cutWan(num: number, fractionDigit = 2): string {
        let out: string;
        if (num < 10000) {
            out = num.toString();
        } else {
            out = DataFormatter.toFixed(num / 10000, fractionDigit) + '万';
        }
        return out;
    }

    /**
     * 格式化数字，比如指定max为1000，可以将1000转化为“1千”，10000转化为“1万”等（需要指定autoCarry为true）。
     * @param value 需要格式化的数字
     * @param max 最高位数。
     * @param autoCarry 是否自动进位。比如value为1000，max为100，若autoCarry为true则得到1千，否则得到10百。数字代表保留精度
     * @param precise 是否精确。默认为false，省略零头。
     * @return
     *
     */
    static formatNumber(value: number, max: number, autoCarry: boolean = false, precise: boolean = false): string {
        let str: string;
        if (value < max) {
            str = value + '';
        }
        else {
            let d: string[] = ['百', '千', '万', '亿'];
            let n: number[] = [100, 1000, 10000, 100000000];
            let i: number = n.indexOf(max);
            if (defines.has('_DEBUG')) {
                uts.assert(i >= 0, '不受支持的最高位数！');
            }

            if (autoCarry) {
                // 需要自动进位
                str = '';
                let value2: number = value;
                let r: number = 0;
                for (let t: number = n.length - 1; t >= i; t--) {
                    r = value2 / n[t];
                    if (r >= 1) {
                        if (r > 1000) {
                            str = Math.floor(r) + d[t];
                        }
                        else {
                            str = Math.floor(r * 10) / 10 + d[t];
                        }
                        break;
                    }
                }
            }
            else {
                str = Math.floor(value / max) + d[i];
            }

            if (precise) {
                let lingtou: number = value % max;
                if (lingtou > 0) {
                    if (i > 0) {
                        str += this.formatNumber(lingtou, n[i - 1], autoCarry, precise);
                    }
                    else {
                        str += lingtou;
                    }
                }
            }
        }

        return str;
    }

    /**
     * 清除指定数字字符串尾部的0（包括可能的小数点）。比如将
     * 100.00转化为100，把95.70转化为95.7。
     * @param str
     * @return
     *
     */
    static trimTailZero(str: string): string {
        return str.replace(DataFormatter._TRIM_TAIL_ZERO_REG, '');
    }

    /**
     * 将数字按照三位断开的格式（如1,111,111）转化为字符串。
     * @param value 原数字。
     * @return 格式化后的字符串。
     *
     */
    static formatThousands(value: number): string {
        let str: string = value.toString();
        let numLen: number = str.length;

        if (numLen > 3) {
            let numSep: number = Math.floor(Math.floor(numLen / 3));

            if ((numLen % 3) == 0)
                numSep--;

            let b: number = numLen;
            let a: number = b - 3;

            let arr: string[] = [];
            for (let i: number = 0; i <= numSep; i++) {
                arr[i] = str.slice(a, b);
                a = Math.floor(Math.max(a - 3, 0));
                b = Math.floor(Math.max(b - 3, 1));
            }

            arr.reverse();

            str = arr.join(',');
        }

        return str;
    }

    /**
     * 返回输入的时间串表示的毫秒数。
     * @param timeStr 时间串的格式为“yyyy-mm-dd hh:mm:ss”，比如“2014-06-05 11:00:00”，其中时分秒可省略，默认为0点整。
     * @return
     *
     */
    static getTimeByTimeStr(timeStr: string): number {
        let arr: string[] = timeStr.split(/\s+/);
        let len: number = arr.length;
        if (len == 0) {
            return 0;
        }

        let dateRegExp = /(\d{4})-(\d{2})-(\d{2})/;
        let dateArr = dateRegExp.exec(arr[0]);
        if (null == dateArr) {
            return 0;
        }

        DataFormatter.m_tmpDate.setFullYear(parseInt(dateArr[1]), parseInt(dateArr[2]) - 1, parseInt(dateArr[3]));

        // 设置时分秒
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        if (len >= 1) {
            let timeRegExp = /(\d{2}):(\d{2}):(\d{2})/;
            let timeArr = timeRegExp.exec(arr[1]);
            if (null != timeArr) {
                hours = parseInt(timeArr[1]);
                minutes = parseInt(timeArr[2]);
                seconds = parseInt(timeArr[3]);
            }
        }
        DataFormatter.m_tmpDate.setHours(hours, minutes, seconds);

        return DataFormatter.m_tmpDate.getTime();
    }

    /**
     * 将秒数转化为“天-小时-分-秒”格式的字符串。
     * @param second 秒数。
     * @param simple 是否简化，若为<CODE>true</CODE>，则超出1天仅显示天数，如1天13小时仅显示1天。
     * @return “天-小时-分-秒”格式的字符串。
     *
     */
    static second2day(second: number, simple: boolean = false, superSimple: boolean = false): string {
        let day: number = Math.floor(second / 86400);
        let hour: number = Math.floor(second / 3600) % 24;
        let min: number = Math.floor(second / 60) % 60;
        let sec: number = Math.floor(second % 60);
        let str: string = '';
        if (day > 0) {
            str += (uts.format('{0}天', day));
            if (simple) {
                return str;
            }
        }

        if (!superSimple) {
            if (day > 0) {
                str += ' ';
            }
            str += DataFormatter.second2hhmmss(second % 86400);
        }
        else {
            if (hour > 0) {
                str += (uts.format('{0}小时', hour));
            }
            else if (min > 0) {
                str += (uts.format('{0}分', min));
            }
            else if (sec > 0) {
                str += (uts.format('{0}秒', sec));
            }
            else if ('' == str) {
                str = '0秒';
            }
        }
        return str;
    }


    /**
   *转化成 双格式的短时间，如ddhh/hhmm/mmss
   * @param second
   * @return
   *
   */
    static second2DayDoubleShort2(second: number): string {
        let day: number = Math.floor(second / 86400);
        let hour: number = Math.floor(second / 3600) % 24;
        let min: number = Math.floor(second / 60) % 60;
        let sec: number = Math.floor(second % 60 + 1);
        let str: string = '';
        if (day > 0) {
            str += (uts.format('{0}天', day));
        }

        if (hour > 0) {
            str += (uts.format('{0}小时', hour));
        }
        if (min > 0) {
            str += (uts.format('{0}分', min));
        }

        return str;
    }


    /**
     *转化成 双格式的短时间，如ddhh/hhmm/mmss
     * @param second
     * @return
     *
     */
    static second2DayDoubleShort(second: number): string {
        let day: number = Math.floor(second / 86400);
        let hour: number = Math.floor(second / 3600) % 24;
        let min: number = Math.floor(second / 60) % 60;
        let sec: number = Math.floor(second % 60);
        let str: string = '';
        if (day > 0) {
            str = (uts.format('{0}天', day));
        }

        if (hour > 0) {
            str += (uts.format('{0}小时', hour));
            if (day > 0) {
                return str;
            }

        }
        if (min > 0) {
            str += (uts.format('{0}分', min));
            if (hour > 0) {
                return str;
            }
        }
        if (sec > 0) {
            str += (uts.format('{0}秒', sec));
        }

        return str;
    }

    /**
     * 将秒转为 xx:xx:xx 如 3661秒—— 1:01:01
     * @param second 秒数
     * @param cutDown24 是否只显示24小时
     * @return xx:xx:xx
     *
     */
    static second2hhmmss(second: number, cutDown24: boolean = false): string {
        second = Math.round(second);
        if (cutDown24) {
            // 再计算今天0点的时间
            second += G.SyncTime.timezoneOffset * 60;
            let t0: number = Math.floor(G.SyncTime.getTodayZeroTime() / 1000);
            if (second < t0) {
                // 说明是昨天的
                return uts.format('{0}天前', Math.ceil((t0 - second) / 86400));
            }
            else {
                second = second % 86400;
            }
        }
        let hour: number = Math.floor(second / 3600);
        let minute: number = Math.floor(second / 60) % 60;
        let sec: number = second % 60;
        return String(hour > 9 ? hour : '0' + hour) + ':' + String('0' + minute).substr(-2) + ':' + String('0' + sec).substr(-2);
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“mm月dd日hh:mm”格式的字符串，如“10月30日10:30”。
     * @param second 秒数。
     * @param 格式，0表示“mm月dd日hh:mm”，1表示“mm.dd hh:mm”
     * @return “mm月dd日hh:mm”格式的字符串。
     *
     */
    static second2mmddmm(second: number, format: number = 0): string {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        let hours = DataFormatter.m_tmpDate.getHours();
        let hoursStr = hours.toString();
        if (Math.floor( hours / 10) == 0) {
            hoursStr = uts.format("0{0}", hoursStr);
        }
        return (uts.format('{0}月{1}日{2}:{3}{4}', DataFormatter.m_tmpDate.getMonth() + 1, DataFormatter.m_tmpDate.getDate(), hoursStr, DataFormatter.m_tmpDate.getMinutes() > 9 ? DataFormatter.m_tmpDate.getMinutes() : '0', DataFormatter.m_tmpDate.getMinutes() <= 9 ? DataFormatter.m_tmpDate.getMinutes() : ''));
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“yyyy年mm月dd日”格式的字符串，如“2014年10月30日”。
     * @param second 秒数。
     * @param ignoreY 是否忽略yyyy年。
     * @return “mm月dd日hh:mm”格式的字符串。
     *
     */
    static second2yyyymmdd(second: number, format = '{0}年{1}月{2}日'): string {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        let str: string = uts.format(format, DataFormatter.m_tmpDate.getFullYear(), DataFormatter.m_tmpDate.getMonth() + 1, DataFormatter.m_tmpDate.getDate());
        return str;
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“hh:mm”格式的字符串，如“10:30”。
     * @param second 秒数。
     * @return “hh:mm”格式的字符串。
     *
     */
    static second2hhmm(second: number): string {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        let hours = DataFormatter.m_tmpDate.getHours();
        let minutes = DataFormatter.m_tmpDate.getMinutes();
        let str = '';
        str += hours > 9 ? hours : '0' + hours;
        str += ':' + (minutes > 9 ? minutes : '0' + minutes);
        return str;
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“mm:ss”格式的字符串，如“10:30”。
     * @param second 秒数。
     * @return “mm:ss”格式的字符串。
     *
     */
    static second2mmss(second: number): string {
        let hour = Math.floor(second / 3600);
        if (hour > 0) {
            return uts.format('{0}小时', hour);
        } else {
            let minutes = Math.floor(second / 60);
            let s = second % 60;
            return (minutes > 9 ? minutes : '0' + minutes) + ':' + (s > 9 ? s : '0' + s);
        }
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为星期几
     * @param second
     * @return
     *
     */
    static second2week(second: number): string {
        if (defines.has('_DEBUG')) {
            uts.assert(second >= 0, '参数必须不能小于0');
        }

        DataFormatter.m_tmpDate.setTime(second * 1000);

        return DataFormatter.days[DataFormatter.m_tmpDate.getDay()];
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“yyyy-mm-dd hh:mm”格式的字符串，如“2013-10-31 10:30”。
     * @param second
     * @return
     *
     */
    static second2yyyymmddhhmm(second: number): string {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        return uts.format('{0}年{1}月{2}日{3}', DataFormatter.m_tmpDate.getFullYear(), DataFormatter.m_tmpDate.getMonth() + 1, DataFormatter.m_tmpDate.getDate(), DataFormatter.second2hhmm(second));
    }

    /**
     * 将自1970 年 1 月 1 日午夜（通用时间）以来的秒数转化为“mm-dd hh:mm”格式的字符串，如“10-31 10:30”。
     * @param second
     * @return
     *
     */
    static second2mmddhhmm(second: number): string {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        let str = '';
        let month = DataFormatter.m_tmpDate.getMonth() + 1;
        if (month > 9) {
            str += month;
        } else {
            str += '0' + month;
        }
        str += '-';
        let date = DataFormatter.m_tmpDate.getDate();
        if (date > 9) {
            str += date;
        } else {
            str += '0' + date;
        }
        str += ' ' + DataFormatter.second2hhmm(second);
        return str;
    }

    /**
    *把字符串时间转换成标准时间 
    * @param timeStr（00:00:00类型）
    * @return 时、分、秒数组
    * 
    */
    static translateTime2Time(timeStr: string): string[] {
        let result = timeStr.split(":", timeStr.length);
        return result;
    }

    static getHour(second: number) {
        DataFormatter.m_tmpDate.setTime(second * 1000);
        return DataFormatter.m_tmpDate.getHours();
    }
}
