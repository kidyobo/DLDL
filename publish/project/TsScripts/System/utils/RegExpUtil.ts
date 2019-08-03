import { Global as G } from 'System/global'
import { Constants } from 'System/constants/Constants'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { Color } from 'System/utils/ColorUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { QuestData } from 'System/data/QuestData'
import { SkillData } from 'System/data/SkillData'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { MonsterData } from 'System/data/MonsterData'

/**
 * 任务对话格式化工具。
 * @author teppei
 *
 */
export class RegExpUtil {

    private static readonly _TRIM_START_BLANKS: RegExp = /^\s+/;

    private static readonly _TRIM_END_BLANKS: RegExp = /\s+$/;

    private static readonly _TRIM_ALL_BLANKS: RegExp = /\s+/g;

    private static readonly _SPLIT_NEWLINE_REG: RegExp = /#N/;

    /**ID规则（XS/CS）。*/
    static readonly idExp: RegExp = /[Ii]=(\d+)/;

    /**神器规则（XS/CS）*/
    static readonly sqExp: RegExp = /SQ=(\d+)/;

    /**属性规则（XS/CS）。*/
    static readonly propExp: RegExp = /P=(\d+)/;

    /**技能规则（XS/CS）。*/
    static readonly skillExp: RegExp = /K=(\d+)/;

    /**颜色规则（XS/CS）。*/
    static readonly colorExp: RegExp = /C=(\b0[xX][0-9a-fA-F]+\b|\d+)/;  // 似乎ts的正则不支持?<! by teppei, 2016/12/12
    //static readonly colorExp: RegExp = /(?<!C)C=(\b0[xX][0-9a-fA-F]+\b|\d+)/;

    /**预定义颜色规则（XS/CS）。*/
    static readonly fixedColorExp: RegExp = /CC=(\d+)/;

    /**字号规则（XS）。*/
    static readonly sizeExp: RegExp = /S=(\d+)/;

    /**粗体规则（XS）。*/
    static readonly boldExp: RegExp = /[Bb]/;

    /**下划线规则（XS）。*/
    static readonly underlineExp: RegExp = /U/;

    /**宗门规则（XS/CS）。*/
    static readonly guildExp: RegExp = /ZP/;

    /**国家规则（XS/CS）。*/
    static readonly countryExp: RegExp = /GJ=(\d+)/;

    /** 精灵*/
    static readonly lingBaoExp: RegExp = /LB/;

    /**男玩家规则（XS/CS）。*/
    static readonly menExp: string = 'M';

    /**女玩家规则（XS/CS）。*/
    static readonly femaleExp: string = 'F';

    /**怪物规则（XS/CS）。*/
    static readonly monsterExp: RegExp = /GW/;

    /**系统规则（XS/CS）。*/
    static readonly systemExp: RegExp = /XT/;

    /**场景规则（XS/CS）。*/
    static readonly sceneExp: RegExp = /CJ/;

    /**职位规则（XS/CS）。*/
    static readonly jobExp: RegExp = /ZW/;

    /**活动规则（XS/CS）。*/
    static readonly activityExp: RegExp = /HD/;

    /**渡劫规则（XS/CS）。*/
    static readonly dujieExp: RegExp = /DJ=(\d+)/;

    /**翅膀等级规则（XS/CS）。*/
    static readonly wingLvExp: RegExp = /WL=(\d+)/;

    /**时装等级规则*/
    static readonly dressLvExp: RegExp = /DL=(\d+)/;

    /**翅膀模型名称规则（XS/CS）。*/
    static readonly wingNameExp: RegExp = /WN=(\d+)/;

    /**坐骑模型名称规则（XS/CS）。*/
    static readonly mountNameExp: RegExp = /MN=(\d+)/;

    /**称号名称规则（XS/CS）。*/
    static readonly titleNameExp: RegExp = /TN=(\d+)/;

    /**时装名称规则*/
    static readonly dressNameExp: RegExp = /DN=(\d+)/;

    /**幻化名称规则（XS/CS）。*/
    static readonly imageExp: RegExp = /IN=(\d+)/;

    /**CDkey礼包规则（XS/CS）。*/
    static readonly cdkeyExp: RegExp = /CK=(\d+)/;

    /**URL超链接规则（CS）。*/
    static readonly urlExp: RegExp = /URL=([^;#]+)/;

    /**其他规则（XS/CS）。*/
    static readonly otherExp: RegExp = /O/;

    /**星期值规则（XS/CS）。*/
    static readonly weekExp: RegExp = /XQ=(\d+)/;

    /**XS协议格式。*/
    static readonly xsRegExp: RegExp = /#((?:C=(?:\b0[xX][0-9a-fA-F]+\b|\d+)|CC=\d+|I=\d+|SQ=\d+|P=\d+|K=\d+|S=\d+|U|[Bb]|ZP|GJ=\d+|M|F|GW|XT|CJ|ZW|HD|DJ=\d+|WL=\d+|DL=\d+|WN=\d+|IN=\d+|MN=\d+|DN=\d+|TN=\d+|CK=\d+|URL=[^;#]+|O|XQ=\d+)(?:,(?:C=(?:\b0[xX][0-9a-fA-F]+\b|\d+)|I=\d+|P=\d+|K=\d+|S=\d+|U|[Bb]))*)(?:;([^#]*))?#/;

    private static readonly _XLS_HERONAME_REG: RegExp = /s%/g;

    private static readonly _XLS_NEWLINE_REG: RegExp = /\$br\$/g;

    private static readonly _XLS_NPC_START_REG: RegExp = /\$npcstart\$/g;

    private static readonly _XLS_NPC_END_REG: RegExp = /\$npcend\$/g;

    private static readonly _XLS_QUESTZONE_REG: RegExp = /\$questZone\$/g;

    /**
     * 按照风月富文本标准将表格文本转化为html文本。
     * @param input
     * @return
     *
     */
    static xlsDesc2Html(input: string, useUIText = false): string {
        let output: string = '';

        // 先按照换行标记拆行
        let lineStrArr: string[] = input.split(RegExpUtil._SPLIT_NEWLINE_REG);

        let tmpStr: string;
        let result: RegExpExecArray; // 模式匹配结果
        let formatResult: RegExpExecArray; // 格式匹配结果
        let formatMatchedStr: string;
        let formattedStr: string;
        let textStr: string; // 用于显示的文本
        let loopFlag: boolean; // 循环标记
        let subIndex: number;
        let id: number;
        let sqId: number;
        let propId: number;
        let propValue: number;
        let thingConfig: GameConfig.ThingConfigM;
        let color: string;
        let fixedColor: number;
        let fontSize: number;
        let isBold: number;
        let isUnderline: number;
        let url: string;

        let subColor: string; // 是否有字体、颜色等格式
        let subSize: number;
        let subFormatStr: string;
        for (let lineStr of lineStrArr) {
            //语言包一行的时候会多了一行，导致二次确认框会显示成2行。
            if ('' != output) {
                output += '\n';
            }

            tmpStr = lineStr;
            loopFlag = true;
            while (loopFlag) {
                color = null;
                fontSize = 0;
                isBold = 0;
                isUnderline = 0;
                id = 0;
                sqId = 0;
                propId = 0;
                propValue = 0;
                subColor = null;
                subSize = 0;
                subFormatStr = '';
                url = null;

                result = RegExpUtil.xsRegExp.exec(tmpStr);
                if (null == result) {
                    // 没有匹配到模式
                    loopFlag = false;
                    output += tmpStr;
                }
                else {
                    // 匹配到模式
                    // 解析格式
                    formatMatchedStr = result[1];
                    formattedStr = result[2];
                    // 优先解析物品ID
                    formatResult = RegExpUtil.idExp.exec(formatMatchedStr);
                    if (null != formatResult) {
                        // 匹配到物品ID
                        id = parseInt(formatResult[1]);
                        if (GameIDUtil.isSpecialID(id)) {
                            // 这是货币
                            textStr = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, id);
                            color = Color.getCurrencyColor(id);

                            // 分号后面可以携带货币数量，也可以不携带
                            if (null != formattedStr) {
                                // 有分号，那么最后1个括号匹配的就是货币数量
                                textStr = formattedStr + textStr;
                            }
                        }
                        else if (GameIDUtil.isBagThingID(id)) {
                            // 背包物品
                            thingConfig = ThingData.getThingConfig(id);
                            if (null != thingConfig) {
                                color = Color.getColorById(thingConfig.m_ucColor);
                                textStr = thingConfig.m_szName;
                            } else {
                                textStr = '[' + id + ']';
                            }

                            // 分号后面可以携带货币数量，也可以不携带
                            if (null != formattedStr) {
                                // 有分号，那么最后1个括号匹配的就是物品数量
                                textStr += '×' + formattedStr;
                            }
                        }
                        else if (GameIDUtil.isMonsterID(id)) {
                            // 怪物ID
                            textStr = MonsterData.getMonsterConfig(id).m_szMonsterName;
                            color = Color.MONSTER;
                        }
                        else if (GameIDUtil.isSkillID(id)) {
                            // 技能ID
                            let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(id);
                            textStr = skillConfig.m_szSkillName;
                            color = Color.getColorById(skillConfig.m_ucSkillColor);
                        }
                        else if (GameIDUtil.isQuestID(id)) {
                            // 任务ID
                            let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(id);
                            textStr = questConfig.m_szQuestTitle;
                            color = Color.GREEN;
                        }
                        else if (GameIDUtil.isLhID(id)) {
                            //// 猎魂ID
                            //let lhCfg: GameConfig.CrystalConfigM = G.DataMgr.lhData.getCfgById(id);
                            //textStr = lhCfg.m_szCrystalName + SpecialCharUtil.getHanNum(EnumLhRule.getStageByColor(lhCfg.m_iCrystalColor)) + '阶';
                            //color = Color.getColorById(lhCfg.m_iCrystalColor);
                        }
                        else {
                            if (defines.has('_DEBUG')) {
                                uts.assert(false, '不受支持的ID：' + id);
                            }
                        }
                    }
                    else {
                        // 检查是否能解析到国家
                        formatResult = RegExpUtil.countryExp.exec(formatMatchedStr);
                        if (null != formatResult) {
                            id = parseInt(formatResult[1]);
                            textStr = G.DataMgr.activityData.countryIndexId2CfgMap[id].m_szDesc;
                            color = Color.YELLOW;
                        }
                        else {
                            textStr = formattedStr;

                            // 检查是否能解析到属性
                            formatResult = RegExpUtil.propExp.exec(formatMatchedStr);
                            if (null != formatResult) {
                                // 解析到属性
                                propId = parseInt(formatResult[1]);
                                if (null != textStr) {
                                    textStr += KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propId);
                                }
                                else {
                                    textStr = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propId);
                                }
                            }

                            // 再匹配预定义颜色
                            // 似乎ts的正则不支持?<!，故先匹配CC，再匹配C by teppei, 2016/12/12
                            formatResult = RegExpUtil.fixedColorExp.exec(formatMatchedStr);
                            if (null != formatResult) {
                                color = RegExpUtil.getColor(formatResult);
                            }
                            else {
                                // 匹配其他普通文本格式
                                // 先匹配颜色
                                formatResult = RegExpUtil.colorExp.exec(formatMatchedStr);
                                if (null != formatResult) {
                                    // 匹配到颜色
                                    color = formatResult[0];
                                }
                                else {
                                    // 匹配几个预设规则
                                    // 先匹配宗门
                                    formatResult = RegExpUtil.guildExp.exec(formatMatchedStr);
                                    if (null != formatResult) {
                                        color = Color.GUILD;
                                        isBold = 1;
                                    }
                                    else {
                                        // 精灵
                                        formatResult = RegExpUtil.lingBaoExp.exec(formatMatchedStr);
                                        if (null != formatResult) {
                                            color = Color.RED;
                                            isBold = 1;
                                            textStr = ThingData.getThingConfig(parseInt(formatResult.input.split('=')[1])).m_szName;
                                        }
                                        else {
                                            // 再匹配国家名
                                            formatResult = RegExpUtil.countryExp.exec(formatMatchedStr);
                                            if (null != formatResult) {
                                                color = Color.COUNTRY;
                                                isBold = 1;
                                            }
                                            else {
                                                // 再匹配男玩家
                                                if (formatMatchedStr == RegExpUtil.menExp) // 单字符特殊处理
                                                {
                                                    color = Color.BOY;
                                                    isBold = 1;
                                                }
                                                else {
                                                    // 再匹配女玩家
                                                    if (formatMatchedStr == RegExpUtil.femaleExp) {
                                                        color = Color.GIRL;
                                                        isBold = 1;
                                                    }
                                                    else {
                                                        // 再匹配怪物
                                                        formatResult = RegExpUtil.monsterExp.exec(formatMatchedStr);
                                                        if (null != formatResult) {
                                                            color = Color.MONSTER;
                                                            isBold = 1;
                                                        }
                                                        else {
                                                            // 再匹配场景
                                                            formatResult = RegExpUtil.sceneExp.exec(formatMatchedStr);
                                                            if (null != formatResult) {
                                                                color = Color.SCENE;
                                                                isBold = 1;
                                                            }
                                                            else {
                                                                // 再匹配职位
                                                                formatResult = RegExpUtil.jobExp.exec(formatMatchedStr);
                                                                if (null != formatResult) {
                                                                    color = Color.JOB;
                                                                    isBold = 1;
                                                                }
                                                                else {
                                                                    // 再匹配系统
                                                                    formatResult = RegExpUtil.systemExp.exec(formatMatchedStr);
                                                                    if (null != formatResult) {
                                                                        color = Color.SYSTEM;
                                                                        isBold = 1;
                                                                    }
                                                                    else {
                                                                        // 再匹配活动
                                                                        formatResult = RegExpUtil.activityExp.exec(formatMatchedStr);
                                                                        if (null != formatResult) {
                                                                            color = Color.ACTIVITY;
                                                                            isBold = 1;
                                                                        }
                                                                        else {
                                                                            // 再匹配其它
                                                                            formatResult = RegExpUtil.otherExp.exec(formatMatchedStr);
                                                                            if (null != formatResult) {
                                                                                color = Color.OTHER;
                                                                                isBold = 1;
                                                                            }
                                                                            else {
                                                                                // 再匹配翅膀等级
                                                                                formatResult = RegExpUtil.wingLvExp.exec(formatMatchedStr);
                                                                                if (null != formatResult) {
                                                                                    let wingLv: number = parseInt(formatResult[1]);
                                                                                    textStr = SpecialCharUtil.getMountJieDeng(wingLv);
                                                                                }
                                                                                else {
                                                                                    // 再匹配翅膀模型
                                                                                    formatResult = RegExpUtil.wingNameExp.exec(formatMatchedStr);
                                                                                    if (null != formatResult) {
                                                                                        let wingImageID: number = parseInt(formatResult[1]);
                                                                                        //                                                                                    let wingCfg: WingImageConfigM = G.DataMgr.equipStrengthenData.getWingImageConfigById(wingImageID);
                                                                                        textStr = '未知翅膀' + wingImageID;
                                                                                        color = Color.PURE_YELLOW;
                                                                                    }
                                                                                    else {
                                                                                        // 再匹配CDKEY礼包
                                                                                        formatResult = RegExpUtil.cdkeyExp.exec(formatMatchedStr);
                                                                                        if (null != formatResult) {
                                                                                            let cdkeyGiftId: number = parseInt(formatResult[1]);
                                                                                            let cdkeyGiftCofig: GameConfig.CDKeyGiftConfigM = G.DataMgr.activityData.getCDKeyGiftConfig(cdkeyGiftId);
                                                                                            textStr = cdkeyGiftCofig.m_szName;
                                                                                        }
                                                                                        else {
                                                                                            // 再匹配URL超链
                                                                                            formatResult = RegExpUtil.urlExp.exec(formatMatchedStr);
                                                                                            if (null != formatResult) {
                                                                                                url = formatResult[1];
                                                                                                if (defines.has('_DEBUG')) {
                                                                                                    uts.assert('' != url && '' != formattedStr, '超链规则：#URL=链接地址;链接描述#');
                                                                                                }
                                                                                                color = Color.GREEN;
                                                                                            }
                                                                                            else {
                                                                                                // 再匹配时装等级
                                                                                                formatResult = RegExpUtil.dressLvExp.exec(formatMatchedStr);
                                                                                                if (null != formatResult) {
                                                                                                    let dressLv: number = parseInt(formatResult[1]);
                                                                                                    textStr = SpecialCharUtil.getDressJieDeng(dressLv);
                                                                                                }
                                                                                                else {
                                                                                                    // 再匹配星期值
                                                                                                    formatResult = RegExpUtil.weekExp.exec(formatMatchedStr);
                                                                                                    if (null != formatResult) {
                                                                                                        //let weekValue = parseInt(formatResult[1]);
                                                                                                        //weekValue = G.DataMgr.activityData.getMappedDay(weekValue);
                                                                                                        //textStr = SpecialCharUtil.getWeekName(weekValue);
                                                                                                    }
                                                                                                    else {
                                                                                                        // 再匹配称号值
                                                                                                        formatResult = RegExpUtil.titleNameExp.exec(formatMatchedStr);
                                                                                                        if (null != formatResult) {
                                                                                                            let titleID = parseInt(formatResult[1]);
                                                                                                            let titleCfg: GameConfig.TitleListConfigM = G.DataMgr.titleData.getDataConfig(titleID);

                                                                                                            textStr = (titleCfg != null) ? titleCfg.m_ucTitleName : ('未知称号' + titleID);
                                                                                                            color = Color.PURE_YELLOW;
                                                                                                        }
                                                                                                        else {
                                                                                                            // 再匹配坐骑名称
                                                                                                            formatResult = RegExpUtil.mountNameExp.exec(formatMatchedStr);
                                                                                                            if (null != formatResult) {
                                                                                                                textStr = '未知坐骑';
                                                                                                                color = Color.PURE_YELLOW;
                                                                                                            }
                                                                                                            else {
                                                                                                                // 再匹配时装名称
                                                                                                                formatResult = RegExpUtil.dressNameExp.exec(formatMatchedStr);
                                                                                                                if (null != formatResult) {
                                                                                                                    let dressImgID: number = parseInt(formatResult[1]);
                                                                                                                    let dressImgCfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(dressImgID);
                                                                                                                    textStr = dressImgCfg ? dressImgCfg.m_szModelName : '未知时装' + dressImgID;
                                                                                                                    color = Color.PURE_YELLOW;
                                                                                                                }
                                                                                                                else {
                                                                                                                    // 再幻化名称
                                                                                                                    formatResult = RegExpUtil.imageExp.exec(formatMatchedStr);
                                                                                                                    if (null != formatResult) {
                                                                                                                        let imgID = parseInt(formatResult[1]);
                                                                                                                        let zhufuData = G.DataMgr.zhufuData;
                                                                                                                        let imageConfig = zhufuData.getImageConfig(zhufuData.getImageLevelID(imgID, 1));
                                                                                                                        textStr = imageConfig ? imageConfig.m_szModelName : '未知幻化' + imgID;
                                                                                                                        color = Color.PURE_YELLOW;
                                                                                                                    }
                                                                                                                }
                                                                                                            }

                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // 接着匹配字体大小
                    formatResult = RegExpUtil.sizeExp.exec(formatMatchedStr);
                    if (null != formatResult) {
                        // 匹配到字体大小
                        fontSize = parseInt(formatResult[1]);
                    }

                    if (!StringUtil.isEmpty(color)) {
                        subColor = color;
                    }
                    if (0 != fontSize) {
                        subSize = fontSize;
                    }

                    // 手机不支持加粗
                    //// 接着匹配粗体
                    //formatResult = RegExpUtil.boldExp.exec(formatMatchedStr);
                    //if (null != formatResult) {
                    //    // 匹配到粗体，大写B表示使用粗体，小写b表示禁用粗体
                    //    isBold = 'B' == formatResult[0] ? 1 : 0;
                    //}

                    // 接着匹配下划线
                    formatResult = RegExpUtil.underlineExp.exec(formatMatchedStr);
                    if (null != formatResult) {
                        // 匹配到下划线
                        isUnderline = 1;
                    }

                    if (tmpStr.length == result[0].length) {
                        // 正行都被匹配
                        loopFlag = false;
                    }
                    else {
                        // 只是一部分
                        if (result.index > 0) {
                            // 放入前面的，没有模式描述，不需要格式化
                            output += tmpStr.substring(0, result.index);
                        }

                        subIndex = result.index + result[0].length;
                        if (subIndex < tmpStr.length) {
                            // 继续匹配剩下的
                            tmpStr = tmpStr.substr(subIndex);
                        }
                        else {
                            // 已经到行尾了，直接解析下一行
                            loopFlag = false;
                        }
                    }

                    // 放入被匹配的
                    subFormatStr = '';

                    if (useUIText) {
                        if (null != subColor) {
                            subFormatStr += '[' + subColor + ']';
                        }
                        if (null != url) {
                            subFormatStr += '[url=' + url + '][u]';
                        } else if (isUnderline) {
                            subFormatStr += '[u]';
                        }
                        subFormatStr += textStr;
                        if (null != url) {
                            subFormatStr += '[/u][/url]';
                        } else if (isUnderline) {
                            subFormatStr += '[/u]';
                        }
                        if (null != subColor) {
                            subFormatStr += '[-]';
                        }
                    } else {
                        if (null != subColor) {
                            subFormatStr += '<color=#' + subColor + '>';
                        }
                        if (0 != subSize) {
                            subFormatStr += '<size=' + subSize + '>';
                        }
                        // 手机上不支持加粗
                        //if (isBold) {
                        //    subFormatStr += '<b>';
                        //}
                        if (isUnderline || null != url) {
                            subFormatStr += '<a href=\'event: ';
                            if (null != url) {
                                subFormatStr += url;
                            }
                            subFormatStr += '\' > <u>';
                        }
                        subFormatStr += textStr;
                        if (isUnderline || null != url) {
                            subFormatStr += '</u></a>';
                        }
                        //if (isBold) {
                        //    subFormatStr += '</b>';
                        //}
                        if (0 != subSize) {
                            subFormatStr += '</size>';
                        }
                        if (null != subColor) {
                            subFormatStr += '</color>';
                        }
                    }
                    output += subFormatStr;
                }
            }
        }

        return output;
    }

    static getColor(formatResult: RegExpExecArray): string {
        // 匹配到预定颜色
        let fixedColor: number = parseInt(formatResult[1]);
        let colorByFixedColor: string = RegExpUtil.getColorByFixedColor(fixedColor);
        return colorByFixedColor;
    }

    /**根据配置表定义颜色ID获取颜色*/
    static getColorByFixedColor(fixedColor: number): string {
        let color: string;
        if (1 == fixedColor) {
            // 1表示淡黄色：255,247,153
            color = Color.DAN_YELLOW;
        }
        else if (2 == fixedColor) {
            // 2表示湖蓝色：0,210,255
            color = Color.BLUE;
        }
        else if (3 == fixedColor) {
            // 3表示紫色：255,0,255
            color = Color.PURPLE;
        }
        else if (4 == fixedColor) {
            // 4表示橙色：255,138,0
            color = Color.ORANGE;
        }
        else if (5 == fixedColor) {
            // 5表示金色：255,241,0
            color = Color.GOLD;
        }
        else if (6 == fixedColor) {
            // 6表示绿色：0,255,0
            color = Color.GREEN;
        }
        else if (7 == fixedColor) {
            // 7表示红色：255,0,0
            color = Color.RED;
        }
        else if (8 == fixedColor) {
            // 8表示白色：
            color = Color.DEFAULT_WHITE;
        }
        else if (9 == fixedColor) {
            color = Color.ITEM_PINK;
        }
        return color;
    }

    static replaceSign(str: string): string {
        let result: string = str.replace(RegExpUtil._XLS_HERONAME_REG, G.DataMgr.heroData.name);
        result = result.replace(RegExpUtil._XLS_NEWLINE_REG, '\r' + '　　');
        result = result.replace(RegExpUtil._SPLIT_NEWLINE_REG, '\n');
        result = result.replace(RegExpUtil._XLS_NPC_START_REG, '<color=\'#aaa111\'>');
        result = result.replace(RegExpUtil._XLS_NPC_END_REG, '</color>');
        return result;
    }

    /**
	* 去掉字串前后的空白格。
	* @param input
	* @return 
	* 
	*/
    static trimBlanks(input: string): string {
        let result: string = input.replace(RegExpUtil._TRIM_START_BLANKS, '');
        result = result.replace(RegExpUtil._TRIM_END_BLANKS, '');
        return result;
    }

    static removeAllBlanks(input: string): string {
        return input.replace(RegExpUtil._TRIM_ALL_BLANKS, '');
    }


    /**获取键盘输入过滤后的字符*/
    static getKeyBoardEnterStr(richText: string): string {
        let reg = /[^\u4e00-\u9fa5|\u0000-\u00ff|\u3002|\uFF1F|\uFF01|\uff0c|\u3001|\uff1b|\uff1a|\u3008-\u300f|\u2018|\u2019|\u201c|\u201d|\uff08|\uff09|\u2014|\u2026|\u2013|\uff0e]/g;
        let r = richText.replace(reg, '');
        return r;
    }


}
