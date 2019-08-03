
/**
* 文本工具。
* @author teppei
*
*/
export class SpecialCharUtil {
    private static m_hans: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    private static JIE_NUM_CN: string[] = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];

    private static DENG_NUM_CN: string[] = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    /**
     * 将指定的阿拉伯数字转换为罗马数字。
     * @param num 阿拉伯数字。
     * @return
     *
     */
    static getRomanNum(num: number): string {
        let result: string;

        switch (num) {
            case 1:
                result = 'Ⅰ';
                break;
            case 2:
                result = 'Ⅱ';
                break;
            case 3:
                result = 'Ⅲ';
                break;
            case 4:
                result = 'Ⅳ';
                break;
            case 5:
                result = 'Ⅴ';
                break;
            case 6:
                result = 'Ⅵ';
                break;
            case 7:
                result = 'Ⅶ';
                break;
            case 8:
                result = 'Ⅷ';
                break;
            case 9:
                result = 'Ⅸ';
                break;
            case 10:
                result = 'Ⅹ';
                break;
            case 11:
                result = 'XI';
                break;
            case 12:
                result = 'XII';
                break;
            default:
                result = num.toString();
                break;
        }

        return result;
    }

    /**
     * 将阿拉伯数字转化为汉字，如90458转化为“九万四百五十八”。
     * @param num
     * @return
     *
     */
    static getHanNum(num: number): string {
        // 万
        let t: number = Math.floor(num / 10000);
        if (t > 0) {
            return uts.format('{0}万', SpecialCharUtil.getHanNum(t));
        }

        // 千
        t = Math.floor(num / 1000);
        if (t > 0) {
            return uts.format('{0}千', SpecialCharUtil.getHanNum(t));
        }

        // 百
        t = Math.floor(num / 100);
        if (t > 0) {
            return uts.format('{0}百', SpecialCharUtil.getHanNum(t));
        }

        // 十
        if (10 == num) {
            return '十';
        }
        else {
            t = Math.floor(num / 10);
            if (t > 0) {
                let ret: string = '十';
                if (t > 1) {
                    ret = SpecialCharUtil.m_hans[t] + ret;
                }
                t = num % 10;
                if (t > 0) {
                    ret += SpecialCharUtil.m_hans[t];
                }
                return ret;
            }
            else {
                return SpecialCharUtil.m_hans[num];
            }
        }
    }

    static getWeekName(day: number[]): string {
        let str = '周';
        for (let i = 0; i < day.length; i++) {
            if (i > 0) str += '、';
            str += (day[i] == 0 ? '日' : SpecialCharUtil.getHanNum(day[i]));
        }
        return str;
    }

    /**
     * 坐骑等级转换为中文 x阶x等
     * @param level
     * @return
     *
     */
    static getMountJieDeng(level: number): string {
        let jie: number = Math.floor(level / 10);
        let deng: number = level % 10;

        if (deng == 0) {
            jie = jie - 1;
        }

        return uts.format('{0}阶{1}等', SpecialCharUtil.JIE_NUM_CN[jie], SpecialCharUtil.DENG_NUM_CN[deng]);
    }

    static getDressJieDeng(dressLevel: number): string {
        let level: number = Math.floor((dressLevel - 1) / 6) % 10 + 1;
        let stage: number = Math.floor((dressLevel - 1) / 60) + 1;

        return uts.format('{0}阶{1}等', SpecialCharUtil.m_hans[stage], level);
    }

    static getJieNumberCN(num: number) {
        return this.JIE_NUM_CN[num];
    }

    static getAnqiLevel(num: number) {
        let level: number = Math.floor(num / 10) + 1;
        let stage: number = Math.round(num % 10);
        if (num == 10) {
            level = 10;
            stage = 10;
        }
        if (stage == 0)
            return uts.format('{0}阶', level);
        else
            return uts.format('{0}阶{1}星', level, stage);

    }
}
