import { KeyWord } from "System/constants/KeyWord";
import { DropPlanData } from "System/data/DropPlanData";
import { ThingData } from "System/data/thing/ThingData";
import { Color } from "System/utils/ColorUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";

export class TextFieldUtil {

    static NUMBER_LIST: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    /**用于匹配换行标志的表达式。*/
    private static _XLS_NEWLINE_REG: RegExp = /#N/g;

    /**用于匹配数字或者百分比的表达式。*/
    private static _NUM_OR_PER_REG: RegExp = /([\d|%]+)/g;

    private static readonly PrivilegeName = ['白银', '黄金', '钻石'];

    /**
     * 获取格式化文本。
     * @param str 待格式化文本。
     * @param color 颜色码，如ff0000
     * @param size 字号，0表示不设置
     * @param bold 是否粗体
     * @param paragraph 是否分段
     */
    static getColorText(str: string, color: string, size: number = 0, bold: boolean = false, paragraph: boolean = false): string {
        if (size > 0) {
            str = uts.format('<size={0}>{1}</size>', size, str);
        }
        if (bold) {
            str = uts.format('<b>{0}</b>', str);
        }
        if (null != color) {
            str = uts.format('<color=#{0}>{1}</color>', color, str);
        }
        if (paragraph) {
            str = uts.format('<p>{0}</p>', str);
        }
        return str;
    }

    static getItemText(itemConfig: GameConfig.ThingConfigM, size: number = 0, bold: boolean = false, paragraph: boolean = false): string {
        return TextFieldUtil.getColorText(itemConfig.m_szName, Color.getColorById(itemConfig.m_ucColor), size, bold, paragraph);
    }

    /**
     * 获取钻石文本
     * @param num
     * @return
     *
     */
    static getYuanBaoText(num: number): string {
        return TextFieldUtil.getColorText(uts.format('{0}钻石', num), Color.YUANBAO);
    }
    /**
     * 获取绑定钻石文本
     * @param num
     * @return
     *
     */
    static getGoldBindText(num: number): string {
        return TextFieldUtil.getColorText(uts.format('{0}绑定钻石', num), Color.YUANBAO);
    }

    /**
     * 获取铜钱文本。
     * @param num 铜钱数量，可以是数字，如1000，也可以是字符串，比如“一千”。
     * @return
     *
     */
    static getTongqianText(num: any): string {
        return TextFieldUtil.getColorText(uts.format('{0}魂币', num), Color.YUANBAO);
    }

    /**
     * 获取VIP文本。
     * @param lv
     * @return
     *
     */
    static getVipText(lv: number, privilege: number): string {
        let rawStr = 'VIP' + lv;
        if (privilege > 0) {
            rawStr = TextFieldUtil.PrivilegeName[privilege - 1] + rawStr;
        }
        return TextFieldUtil.getColorText(rawStr, Color.YUANBAO);
    }

    /**
     *获取vip月卡文版
     * @param lv
     * @return
     *
     */
    static getPrivilegeText(lv: number): string {
        return uts.format('{0}VIP', TextFieldUtil.PrivilegeName[lv - 1]);
    }

    static getMultiVipMonthTexts(levels: number[]): string {
        let cnt = levels.length;
        if (1 == cnt) {
            return TextFieldUtil.getPrivilegeText(levels[0]);
        }

        let str = '';
        for (let i = 0; i < cnt; i++) {
            if (i > 0) {
                str += '、';
            }
            str += TextFieldUtil.PrivilegeName[levels[i] - 1];
        }
        str += 'VIP';
        return str;
    }


}
