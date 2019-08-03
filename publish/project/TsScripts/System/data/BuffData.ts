import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export class BuffData {
    private static m_buffDict: { [index: number]: GameConfig.BuffConfigM } = {}; // 通过Buff ID来检索Buff对象

    private static checkBuffCache: { [key: string]: boolean } = {};
    private static buffValueCache: { [key: string]: number } = {};

    onCfgReady() {
        let configList: GameConfig.BuffConfigM[] = G.Cfgmgr.getCfg('data/BuffConfigM.json') as GameConfig.BuffConfigM[];

        let len: number = configList.length;
        let config: GameConfig.BuffConfigM = null;
        for (let index: number = 0; index < len; ++index) {
            config = configList[index];
            if (config.m_uiBuffID == 0)// 过滤掉无用数据
            {
                continue;
            }
            BuffData.m_buffDict[config.m_uiBuffID] = config;

            if (defines.has('_DEBUG')) {
                if (config.m_szChangeAvatar != '') {
                    uts.assert(config.m_uiHeadAvata == 0 &&
                        config.m_uiBodyAvata == 0 &&
                        config.m_uiEquipAvata == 0, '表格数据必须合法');
                }

                if (config.m_uiHeadAvata != 0 ||
                    config.m_uiBodyAvata != 0 ||
                    config.m_uiEquipAvata != 0) {
                    uts.assert(config.m_szChangeAvatar == '', '表格数据必须合法');
                }
            }
        }
    }

    /**
     * 获取某一个索引的 ID 获得 Buff 对象。
     * 
     * */
    static getBuffByID(buffID: number): GameConfig.BuffConfigM {
        return BuffData.m_buffDict[buffID];
    }

    /**
     * 判断某个buff是否有沉默效果 
     * @param config
     * @return 
     * 
     */
    static isBuffHaveSilence(config: GameConfig.BuffConfigM): boolean {
        let result: boolean = BuffData.isBuffHasEffect(config, KeyWord.BUFF_EFFECT_SKILL_SILENCE);

        return result;
    }

    /**
     * 判断某个buff是否有昏迷效果  
     * @param config
     * @return 
     * 
     */
    static isBuffHaveComa(config: GameConfig.BuffConfigM): boolean {
        let result: boolean = BuffData.isBuffHasEffect(config, KeyWord.BUFF_EFFECT_COMA);

        return result;
    }

    /**
     * 判断某个buff是否有定身效果  
     * @param config
     * @return 
     * 
     */
    static isBuffHaveFreze(config: GameConfig.BuffConfigM): boolean {
        let result: boolean = BuffData.isBuffHasEffect(config, KeyWord.BUFF_EFFECT_SKILLFREEZE);

        return result;
    }

    /**
     * 判断某个buff是否有boss吟唱效果 
     * @param config
     * @return 
     * 
     */
    static isBuffHaveBossSing(config: GameConfig.BuffConfigM): boolean {
        let result: boolean = BuffData.isBuffHasEffect(config, KeyWord.BUFF_EFFECT_BOSS_SING);

        return result;
    }

    /**
     * 是否有石化状态 
     * @param config
     * @return 
     * 
     */
    static haveStoneEffect(config: GameConfig.BuffConfigM): boolean {
        if (config == null)
            return false;

        return config.m_ucType == KeyWord.TB_BUFF_TYPE_STONE;
    }

    /**
     * 判断指定的buff是否具有某种效果。
     * @param config 指定的buff配置。
     * @param effectType 效果类型。
     * @param value 效果数值，-1表示不需要检查数值，只检查类型。
     * @param valueRule 数值比较规则，默认为0，表示与指定的value相当，-1表示不超过指定的value，
     * -2表示比指定的value小，1表示不小于指定的value，2表示比指定的value大。
     * 
     * @return 
     * 
     */
    static isBuffHasEffect(config: GameConfig.BuffConfigM, effectType: number, value: number = -1, valueRule: number = 0): boolean {
        let key = config.m_uiBuffID + '|' + effectType + '|' + value + '|' + valueRule;

        let result: boolean = BuffData.checkBuffCache[key];
        if (undefined != result) {
            return result;
        }

        result = false;

        let len: number = config.m_astBuffEffect.length;
        for (let i = 0; i < len; i++) {
            let buffEffect = config.m_astBuffEffect[i];
            if (buffEffect.m_iBuffEffectType == effectType) {
                if (-1 == value) {
                    // 只检查类型，不检查数值
                    result = true;
                    break;
                }

                if (0 == valueRule) {
                    result = buffEffect.m_iBuffEffectValue == value;
                }
                else if (1 == valueRule) {
                    result = buffEffect.m_iBuffEffectValue >= value;
                }
                else if (valueRule > 1) {
                    result = buffEffect.m_iBuffEffectValue > value;
                }
                else if (-1 == valueRule) {
                    result = buffEffect.m_iBuffEffectValue <= value;
                }
                else if (valueRule < -1) {
                    result = buffEffect.m_iBuffEffectValue < value;
                }

                if (result) {
                    break;
                }
            }
        }

        BuffData.checkBuffCache[key] = result;
        return result;
    }

    /**
     * 返回相应的效果值 
     * @param config
     * @param effectType
     * @return 
     * 
     */
    getBuffEffectValue(config: GameConfig.BuffConfigM, effectType: number): number {
        let key = config.m_uiBuffID + '|' + effectType;
        let result: number = BuffData.buffValueCache[key];
        if (undefined != result) {
            return result;
        }

        result = 0;

        let len: number = config.m_astBuffEffect.length;
        for (let i = 0; i < len; i++) {
            let buffEffect = config.m_astBuffEffect[i];
            if (buffEffect.m_iBuffEffectType == effectType) {
                result += buffEffect.m_iBuffEffectValue;
            }
        }

        BuffData.buffValueCache[key] = result;
        return result;
    }

    static isNeedChangeAvata(config: GameConfig.BuffConfigM): boolean {
        if (config.m_szChangeAvatar != '') {
            return true;
        }

        if (config.m_uiHeadAvata != 0 ||
            config.m_uiBodyAvata != 0 ||
            config.m_uiEquipAvata != 0) {
            return true;
        }

        return false;
    }

    static isBuff(config: GameConfig.BuffConfigM): boolean {
        return config.m_ucDisplayPosition == KeyWord.BUFF_BENIFIT_INC;
    }

    static isDeBuff(config: GameConfig.BuffConfigM): boolean {
        return config.m_ucDisplayPosition == KeyWord.BUFF_BENIFIT_DEC;
    }
}
