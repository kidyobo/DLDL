import { TipType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { SkillData } from 'System/data/SkillData';
import { ThingData } from 'System/data/thing/ThingData';
import { ITipData } from 'System/tip/tipData/ITipData';
import { Color } from 'System/utils/ColorUtil';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { RegExpUtil } from 'System/utils/RegExpUtil';
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';

/**
 * 纯文本类型Tip的数据结构。
 * @author teppei
 *
 */
export class TextTipData implements ITipData {
    /**用于清除开头的换行符的表达式。*/
    private static readonly _TRIM_START_NEWLINE: RegExp = /^[\n|\r]+/;

    /**用于清除结尾的换行符的表达式。*/
    private static readonly _TRIM_END_NEWLINE: RegExp = /[\n|\r]+$/;

    private static readonly _SPLIT_NEWLINE_REG: RegExp = /#N|[\n|\r]{1,1}/;

    private static readonly idExp: RegExp = /I=(\d+)/;

    private static readonly propExp: RegExp = /P=(\d+)/;

    private static readonly propArrowExp: RegExp = /PA=([0|1])/;

    private static readonly colorExp: RegExp = /C=(\b0[xX][0-9a-fA-F]+\b|\d+)/;

    private static readonly sizeExp: RegExp = /S=(\d+)/;

    private static readonly boldExp: RegExp = /B=([0|1])/;

    private static readonly xOffsetExp: RegExp = /X=(\d+)/;

    private static readonly noBreakExp: RegExp = /NB=([0|1])/;

    private static readonly regExp: RegExp = /#((?:I=\d+|P=\d+|CC=\d+|PA=[0|1]|C=(?:\b0[xX][0-9a-fA-F]+\b|\d+)|S=\d+|B=[0|1]|X=\d+|NB=[0|1]|XQ=\d+)(?:,(?:I=\d+|P=\d+|PA=[0|1]|C=(?:\b0[xX][0-9a-fA-F]+\b|\d+)|S=\d+|B=[0|1]|X=\d+|NB=[0|1]))*)(?:;([^#]*))?#/;

    readonly tipDataType: TipType = TipType.TEXT_TIP;

    /**默认宽度。*/
    width: number = 0;

    displayText: string;

    private isLastLineEnd: boolean = false;

    //constructor(text: string = null, defaultColor: number = 0xffffff, width: number = 0)
    //{
    //    this.textInfos = new Array<TextFormatInfo>();
    //    if (!StringUtil.isEmpty(text)) {
    //        this.setTipData(text, defaultColor, width);
    //    }
    //}

    /**
     * 存入tip显示数据
     * @param text - 要显示的文字。
     * @param defaultColor - 默认颜色。
     * @param width - 指定的Tip宽度。
     *
     */
    setTipData(text: string, defaultColor: string = null, width: number = 0): void {
        this.width = width;
        this.displayText = '';
        this.isLastLineEnd = false;

        // 解析文字
        // 文字的格式是：文字文字#C=ff0000;文字#文字文字\n文字文字...

        // 先清除前后的换行
        text = text.replace(TextTipData._TRIM_START_NEWLINE, '');
        text = text.replace(TextTipData._TRIM_END_NEWLINE, '');

        // 再拆成每一行
        let lineStrArr: string[] = text.split(TextTipData._SPLIT_NEWLINE_REG);
        let tmpStr: string;
        let result: RegExpExecArray; // 模式匹配结果
        let formatResult: RegExpExecArray; // 格式匹配结果
        let textStr: string; // 用于显示的文本
        let formattedStr: string;
        let loopFlag: boolean; // 循环标记
        let subIndex: number = 0;
        let formatStr: string;
        let id: number = 0;
        let day: number = 0;
        let propId: number = 0;
        let propValue: number = 0;
        let propArrow: number = 0;
        let thingConfig: GameConfig.ThingConfigM;
        let skillConfig: GameConfig.SkillConfigM;
        let color: string = null;
        let fontSize: number = 0;
        let isBold: number = 0;
        let xOffset: number = 0;
        let noBreak: boolean;
        for (let lineStr of lineStrArr) {
            tmpStr = lineStr;
            loopFlag = true;
            while (loopFlag) {
                id = 0;
                day = 0;
                propId = 0;
                propValue = 0;
                result = TextTipData.regExp.exec(tmpStr);
                if (null == result) {
                    // 没有匹配到模式
                    loopFlag = false;
                    this._addTextInfo(tmpStr, 0, 0, 0, true, defaultColor);
                }
                else {
                    // 匹配到模式
                    // 解析格式
                    formatStr = result[1];
                    formattedStr = result[2];
                    // 优先解析物品ID
                    formatResult = TextTipData.idExp.exec(formatStr);
                    if (null != formatResult) {
                        // 匹配到物品ID
                        id = parseInt(formatResult[1]);
                        if (GameIDUtil.isBagThingID(id)) {
                            thingConfig = ThingData.getThingConfig(id);
                            color = Color.getColorById(thingConfig.m_ucColor);
                            textStr = thingConfig.m_szName;

                            // 分号后面可以携带货币数量，也可以不携带
                            if (null != formattedStr) {
                                // 有分号，那么最后1个括号匹配的就是货币数量
                                textStr = textStr + ' ×' + formattedStr;
                            }
                        }
                        else if (GameIDUtil.isSkillID(id)) {
                            skillConfig = SkillData.getSkillConfig(id);
                            color = Color.getColorById(skillConfig.m_ucSkillColor);
                            textStr = skillConfig.m_szSkillName;
                        }
                        else if (GameIDUtil.isSpecialID(id)) {
                            // 这是货币
                            textStr = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, id);
                            color = Color.getCurrencyColor(id);

                            // 分号后面可以携带货币数量，也可以不携带
                            if (null != formattedStr) {
                                // 有分号，那么最后1个括号匹配的就是货币数量
                                textStr = textStr + ' ×' + formattedStr;
                            }
                        }
                        else {
                            if (defines.has('_DEBUG')) {
                                uts.assert(false, '不受支持的ID：' + id);
                            }
                        }
                    }
                    else {
                        // 检查是否匹配星期值
                        formatResult = RegExpUtil.weekExp.exec(formatStr);
                        if (null != formatResult) {
                            // 匹配到星期值
                            day = parseInt(formatResult[1]);
                            // day = G.DataMgr.activityData.getMappedDay(day);
                            textStr = SpecialCharUtil.getWeekName([day]);
                        }
                        else {
                            textStr = result[result.length - 1];

                            // 检查是否能解析到属性
                            formatResult = TextTipData.propExp.exec(formatStr);
                            if (null != formatResult) {
                                // 解析到属性
                                propId = parseInt(formatResult[1]);
                                // 文本内容就是属性值
                                propValue = parseInt(textStr);
                                // 清除普通文本
                                textStr = null;

                                // 继续匹配属性箭头标记
                                formatResult = TextTipData.propArrowExp.exec(formatStr);
                                if (null != formatResult) {
                                    propArrow = parseInt(formatResult[1]);
                                }
                                else {
                                    propArrow = 0;
                                }
                            }

                            // 匹配其他普通文本格式
                            // 先匹配颜色
                            formatResult = RegExpUtil.fixedColorExp.exec(formatStr);
                            if (null != formatResult) {
                                // 匹配到预定颜色
                                let fixedColor: number = parseInt(formatResult[1]);
                                color = RegExpUtil.getColorByFixedColor(fixedColor);
                            }
                            else {
                                // 匹配其他普通文本格式
                                // 先匹配颜色
                                formatResult = TextTipData.colorExp.exec(formatStr);
                                if (null != formatResult) {
                                    // 匹配到颜色
                                    color = formatResult[1];
                                }
                                else {
                                    color = defaultColor;
                                }
                            }
                        }
                    }

                    // 接着匹配字体大小
                    formatResult = TextTipData.sizeExp.exec(formatStr);
                    if (null != formatResult) {
                        // 匹配到字体大小
                        fontSize = parseInt(formatResult[1]);
                    }
                    else {
                        fontSize = 0;
                    }
                    // 接着匹配粗体
                    formatResult = TextTipData.boldExp.exec(formatStr);
                    if (null != formatResult) {
                        // 匹配到粗体
                        isBold = parseInt(formatResult[1]);
                    }
                    else {
                        isBold = 0;
                    }
                    // 接着匹配水平偏移量
                    formatResult = TextTipData.xOffsetExp.exec(formatStr);
                    if (null != formatResult) {
                        // 匹配到水平偏移量
                        xOffset = parseInt(formatResult[1]);
                    }
                    else {
                        xOffset = 0;
                    }
                    // 接着匹配是否不断行
                    formatResult = TextTipData.noBreakExp.exec(formatStr);
                    if (null != formatResult) {
                        // 匹配到水平偏移量
                        noBreak = null != formatResult[1];
                    }
                    else {
                        noBreak = false;
                    }

                    if (tmpStr.length == result[0].length) {
                        // 整行都被匹配
                        this._addTextInfo(textStr, propId, propValue, propArrow, true, color, fontSize, isBold, xOffset, noBreak);
                        loopFlag = false;
                    }
                    else {
                        // 只是一部分
                        if (result.index > 0) {
                            // 放入前面的，没有模式描述，不需要格式化
                            this._addTextInfo(tmpStr.substring(0, result.index), 0, 0, 0, false, defaultColor);
                        }

                        subIndex = result.index + result[0].length;
                        if (subIndex < tmpStr.length) {
                            // 放入被匹配中的
                            this._addTextInfo(textStr, propId, propValue, propArrow, false, color, fontSize, isBold, xOffset, noBreak);
                            // 继续匹配剩下的
                            tmpStr = tmpStr.substr(subIndex);
                        }
                        else {
                            // 已经到行尾了，直接解析下一行
                            // 放入被匹配中的
                            this._addTextInfo(textStr, propId, propValue, propArrow, true, color, fontSize, isBold, xOffset, noBreak);
                            loopFlag = false;
                        }
                    }
                }
            }
        }
    }

    private _addTextInfo(text: string, propId: number, propValue: number, propArrow: number, lineEnd: boolean, color: string = null, size: number = 0, isBold: number = 0, xOffset: number = 0, noBreak: boolean = false): void {
        if (this.isLastLineEnd) {
            this.displayText += '\n';
        }

        if ('' != text) {
            if (propId > 0) {
                // 属性行
                let str = uts.format('{0}  +{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propId), propValue);
                if (propArrow > 0) {
                    str += ' ↑';
                } else if (propArrow < 0) {
                    str += ' ↓';
                }
                this.displayText += TextFieldUtil.getColorText(str, color, size, 0 != isBold);
            } else {
                this.displayText += TextFieldUtil.getColorText(text, color, size, 0 != isBold);
            }
        }

        this.isLastLineEnd = lineEnd;
    }
}
