import { KeyWord } from 'System/constants/KeyWord';
import { GameIDUtil } from 'System/utils/GameIDUtil';

/**
 * 该类用于对文本显示的颜色统一管理
 * @author fygame
 *
 */
export class Color {
    /** 默认的白色 */
    static readonly DEFAULT_WHITE: string = 'fff5cb';

    /**GM聊天颜色*/
    static readonly CHAT_GM_COLOR: string = 'ff0099';

    /** 默认的页签 */
    static readonly TAB_DEFAULT: string = 'f4e394';
    /** 页签选择颜色 */
    static readonly TAB_SELECT: string = 'ffffff';

    /** 滤镜描边默认的颜色 */
    static readonly STROKE_DEFAULT: string = '070707';
    /** 滤镜描边标题的颜色 */
    static readonly STROKE_TITLE: string = '200900';

    /** 标签颜色 */
    static readonly TITLE_DEFAULT: string = 'CACBCC';

    /** 按钮的颜色 */
    static readonly BUTTON: string = 'CACBCC';

    /** 米白 */
    static readonly BEIGE: string = 'fff8bb';

    ////////////////////////////////////////////////////
    /**平常白色*/
    static readonly WHITE: string = 'CACBCC';

    /**平常绿色*/
    static readonly GREEN: string = '40CC9C';

    /**平常蓝色*/
    static readonly BLUE: string = '4CA6FF';

    /**平常橙色*/
    static readonly ORANGE: string = 'F5923A';
    /**平常黄色*/
    static readonly YELLOW: string = 'ECD660';

    /**平常紫色*/
    static readonly PURPLE: string = 'ed48fc';

    ////////////////////////////////////////// 物品颜色 //////////////////////////////////////////
    /**物品绿色。*/
    static readonly ITEM_GREEN: string = '72E25C';

    /**物品蓝色。*/
    static readonly ITEM_BLUE: string = '7EC3FC';

    /**物品紫色。*/
    static readonly ITEM_PURPLE: string = 'C26AF5';

    /**物品橙色。*/
    static readonly ITEM_ORANGE: string = 'EC8F2B';

    /**物品金色。*/
    static readonly ITEM_GOLD: string = 'F4DC57';

    /**物品红色。*/
    static readonly ITEM_RED: string = 'ED4D4D';

    /**物品粉色*/
    static readonly ITEM_PINK: string = '73e5b4';


    //以下旧版本颜色
    ///**物品蓝色。*/
    //static readonly ITEM_BLUE: string = '15aaff';

    ///**物品紫色。*/
    //static readonly ITEM_PURPLE: string = 'ba00ff';

    ///**物品橙色。*/
    //static readonly ITEM_ORANGE: string = 'ff9000';

    ///**物品金色。*/
    //static readonly ITEM_GOLD: string = 'fff600';

    ///**物品红色。*/
    //static readonly ITEM_RED: string = 'd60000';

    ///**物品粉色*/
    //static readonly ITEM_PINK: string = 'fb05ad';

    ////////////////////////////////////////// 系统颜色 //////////////////////////////////////////

    /**增益buff。*/
    static readonly BUFF: string = '00B0F0';

    /**减益buff。*/
    static readonly DEBUFF: string = 'F10000';

    /**文本框不可用。*/
    static readonly DISABLED: string = '858694';

    /**文本框可用。*/
    static readonly ENABLED: string = 'FAF6ED';

    /**铜钱的颜色。*/
    static readonly TONGQIAN: string = 'b89b00';

    /**钻石的颜色。*/
    static readonly YUANBAO: string = 'fff000';

    /**VIP的颜色。*/
    static readonly VIP: string = 'fff000';

    /**历练的颜色。*/
    static readonly LILIAN: string = '00fffc';

    /**男性。*/
    static readonly BOY: string = '16c7fa';

    /**女性。*/
    static readonly GIRL: string = 'fb3cba';

    /**宗门。*/
    static readonly GUILD: string = '9b66fc';

    /**国家。*/
    static readonly COUNTRY: string = 'ffe400';

    /**怪物。*/
    static readonly MONSTER: string = '16c7fa';

    /**系统。*/
    static readonly SYSTEM: string = 'e6363e';

    /**场景。*/
    static readonly SCENE: string = 'ff9c00';

    /**其他。*/
    static readonly OTHER: string = 'ffe400';

    /**职位。*/
    static readonly JOB: string = '9b66fc';

    /**活动。*/
    static readonly ACTIVITY: string = 'e6363e';

    ////////////////////////////////////////// 其它颜色 //////////////////////////////////////////

    /**淡黄色*/
    static readonly DAN_YELLOW: string = 'FFF799';

    /**纯黄*/
    static readonly PURE_YELLOW: string = 'FFFF00';

    /**红色*/
    static readonly RED: string = 'CB1A1F';

    /**灰色*/
    static readonly GREY: string = '808080';

    /**金色*/
    static readonly GOLD: string = 'FFF100';

    /**银色。*/
    static readonly SILVER: string = 'c0c0c0';

    /**橙黄色*/
    static readonly ORANGR_YELLOW: string = 'ffc24d';

    /**黑色*/
    static readonly BLACK: string = '000000';
    ////////////////////////////////// 用于头顶名字 //////////////////////////////////

    /**红色，用于主动攻击敌对怪、进入攻击状态的被动攻击敌对怪和敌对玩家及其散仙。*/
    static readonly NAME_RED: string = 'ff0000';
    /**黄色，用于非攻击状态的被动攻击敌对怪。*/
    static readonly NAME_YELLOW: string = 'FFFF00';
    /**白色，用于采集物、任务NPC、商人NPC、装饰性NPC、不攻击的敌对怪物和中立怪物。*/
    static readonly NAME_WHITE: string = 'ffffff';
    /**绿色，用于友方怪物、友好NPC和队友及其散仙。*/
    static readonly NAME_GREEN: string = '00FF00';
    /**蓝色，用于好友和同一宗门成员及其散仙。*/
    static readonly NAME_BLUE: string = '00A2FF';

    /**国王专属颜色。*/
    static readonly NAME_KING: string = 'FFCC00';

    /**粉色，用于自己和自己的散仙。*/
    static readonly NAME_PINK: string = 'FF9999';

    /**玩家称号的颜色。*/
    static readonly COLOR_TITLE: string = '2EBAFC';

    /**渡劫称号的颜色。*/
    static readonly COLOR_DUJIE: string = 'cd6600';

    /**NPC的头衔。*/
    static readonly COLOR_NPC_TITLE: string = 'e6b303';

    static readonly OUTLINE_COLOR_ENEMY: string = 'FF0000';

    static readonly OUTLINE_COLOR_NOT_ENEMY: string = '99FFFF';

    static readonly OUTLINE_COLOR_NPC: string = Color.COLOR_NPC_TITLE;

    /**对话框标题文字颜色*/
    static readonly DIALOG_TITLE_COLOR: string = 'FFFFCC';

    ////////////////////////////////////Tip文字颜色/////////////////////////////////

    /**白色*/
    static readonly TIP_WHITE_COLOR: string = 'fffbeb';
    /**蓝色*/
    static readonly TIP_BULE_COLOR: string = '40CC9C';
    /**绿色*/
    static readonly TIP_GREEN_COLOR: string = '51D34F';
    /**浅黄*/
    static readonly TIP_YELLOW1_COLOR: string = 'ECD660';
    /**深黄*/
    static readonly TIP_YELLOW2_COLOR: string = 'ECD660';
    /**灰色*/
    static readonly TIP_GREY_COLOR: string = '808080';

    static readonly UIGreen = '51D34F';


    /**普通属性*/
    static readonly PropWHITE: string = 'CACBCC';
    /**属性标题*/
    static readonly PropYellow: string = 'ECD660';
    /**强化属性*/
    static readonly PropGreen: string = '40CC9C';
    /**激活提示*/
    static readonly PropGreen2: string = '51D34F';
    /**强化提示*/
    static readonly PropYellow2: string = 'F5923A';
    /**灰态*/
    static readonly PropGray: string = '808080';
    /**不可用*/
    static readonly PropRed: string = 'CB1A1F';
    /**来源提示*/
    static readonly PropBlue: string = '4CA6FF';

    private static m_colorTable: { [color: number]: string };

    /**颜色列表。*/
    private static COLOR_LIST: number[] = [KeyWord.COLOR_WHITE, KeyWord.COLOR_GREEN, KeyWord.COLOR_BLUE, KeyWord.COLOR_PURPLE, KeyWord.COLOR_ORANGE, KeyWord.COLOR_GOLD, KeyWord.COLOR_RED, KeyWord.COLOR_PINK];

    private static m_colorNameTable: { [color: number]: string };

    private static m_code2rgbMap: { [color: string]: UnityEngine.Color } = {};

    constructor() {
    }

    /**
     * 将ff0000格式的颜色码转为UnityEngine.Color。
     * @param color
     */
    static toUnityColor(color: string): UnityEngine.Color {
        let rgbColor: UnityEngine.Color = Color.m_code2rgbMap[color];
        if (null == rgbColor) {
            let alpha = 1;
            if (color.length > 6) {
                alpha = parseInt(color.substring(6), 16) / 255;
            }
            Color.m_code2rgbMap[color] = rgbColor = new UnityEngine.Color(parseInt(color.substr(0, 2), 16) / 255, parseInt(color.substr(2, 2), 16) / 255, parseInt(color.substr(4, 2), 16) / 255, alpha);
        }
        return rgbColor;
    }

    /**
     * 表格中填的物品颜色
     * @param id
     * @return
     *
     */
    static getColorById(id: number): string {
        if (0 == id) {
            return Color.WHITE;
        }

        if (Color.m_colorTable == null) {
            Color.m_colorTable = {};

            Color.m_colorTable[KeyWord.COLOR_WHITE] = Color.WHITE;
            Color.m_colorTable[KeyWord.COLOR_GREEN] = Color.ITEM_GREEN;
            Color.m_colorTable[KeyWord.COLOR_BLUE] = Color.ITEM_BLUE;
            Color.m_colorTable[KeyWord.COLOR_PURPLE] = Color.ITEM_PURPLE;
            Color.m_colorTable[KeyWord.COLOR_ORANGE] = Color.ITEM_ORANGE;
            Color.m_colorTable[KeyWord.COLOR_GOLD] = Color.ITEM_GOLD;
            Color.m_colorTable[KeyWord.COLOR_RED] = Color.ITEM_RED;
            Color.m_colorTable[KeyWord.COLOR_PINK] = Color.ITEM_PINK;
        }

        return Color.m_colorTable[id];
    }

    /**
     * 按照索引位获取颜色值。
     * @param index 指定的索引位，0为白色。
     * @param startColor 起始颜色偏移，0表示从白色开始。
     * @return
     *
     */
    static getColorByIndex(index: number, startColor: number = 0): string {
        if (0 == startColor) {
            startColor = KeyWord.COLOR_WHITE;
        }

        let startIndex: number = Color.COLOR_LIST.indexOf(startColor);
        if (startIndex >= 0) {
            index += startIndex;
        }

        if (index >= Color.COLOR_LIST.length) {
            index = Color.COLOR_LIST.length - 1;
        }
        return Color.getColorById(Color.COLOR_LIST[index]);
    }

    /**
     * 比较两个颜色，越高级的颜色比值越大。例如a为KeyWord.COLOR_WHITE，b为KeyWord.COLOR_PURPLE，则结果为3。
     * @param a
     * @param b
     * @return 0表示两个颜色相同。
     *
     */
    static compare(a: number, b: number): number {
        if (a == b) {
            return 0;
        }
        else {
            return Color.COLOR_LIST.indexOf(a) - Color.COLOR_LIST.indexOf(b);
        }
    }

    /**
     * 获取默认状态
     * @return
     *
     */
    static getDeafultColorName(): string {
        return 'white';
    }

    static getColorNameById(id: number): string {
        if (Color.m_colorNameTable == null) {
            Color.m_colorNameTable = {};

            Color.m_colorNameTable[KeyWord.COLOR_WHITE] = 'white';
            Color.m_colorNameTable[KeyWord.COLOR_GREEN] = 'green';
            Color.m_colorNameTable[KeyWord.COLOR_BLUE] = 'blue';
            Color.m_colorNameTable[KeyWord.COLOR_PURPLE] = 'purple';
            Color.m_colorNameTable[KeyWord.COLOR_ORANGE] = 'orange';
            Color.m_colorNameTable[KeyWord.COLOR_GOLD] = 'gold';
            Color.m_colorNameTable[KeyWord.COLOR_RED] = 'red';
            Color.m_colorNameTable[KeyWord.COLOR_PINK] = 'pink';
        }

        if (0 == id) {
            id = KeyWord.COLOR_WHITE;
        }

        if (null == Color.m_colorNameTable[id]) {
            return Color.getDeafultColorName();
        }

        return Color.m_colorNameTable[id];
    }

    /**
     * 获知指定货币的颜色。
     * @param id
     * @return
     *
     */
    static getCurrencyColor(id: number): string {
        return Color.getColorById(Color.getCurrencyColorId(id));
    }

    static getCurrencyColorId(id: number): number {
        if (GameIDUtil.isYuanbaoID(id)) {
            return KeyWord.COLOR_GOLD;
        }
        //功勋值
        else if (id == KeyWord.PVP_EXPLOIT_ID || id == KeyWord.SKY_BONUS_ID) {
            return KeyWord.COLOR_PURPLE;
        }

        return KeyWord.COLOR_WHITE;
    }

    /**是：绿色  否：红色，*/
    static getReachColor(boo: boolean, yesColor: string = null, noColor: string = null): string {
        let color: string;
        if (yesColor == null) {
            yesColor = Color.GREEN;
        }
        if (noColor == null) {
            noColor = Color.RED;
        }
        color = !boo ? noColor : yesColor;
        return color;
    }
}