import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 存放系统常量信息 
 * @author fygame
 * 
 */
export class ConstantParameterData {
    /**数据列表*/
    private m_dataList: { [id: number]: number };

    /**背景音乐音量百分比*/
    static VOL_BG_MUSIC: number = 1.0;
    /**自己放技能音量百分比*/
    static VOL_SELF_SKILL: number = 1.0;
    /**散仙放技能音量百分比*/
    static VOL_PET_SKILL: number = 1.0;
    /**其他角色放技能音量百分比*/
    static VOL_OTHER_SKILL: number = 1.0;

    onCfgReady(): void {
        let dataList: GameConfig.SystemParameterConfigM[] = G.Cfgmgr.getCfg('data/SystemParameterConfigM.json') as GameConfig.SystemParameterConfigM[];
        this.m_dataList = {};

        let count: number = dataList.length;
        let config: GameConfig.SystemParameterConfigM;

        for (let i: number = 0; i < count; ++i) {
            config = dataList[i];
            this.m_dataList[config.m_iID] = config.m_iValue;
        }

        if (this.m_dataList[KeyWord.SYSTEM_PARAMETER_MUSIC_VOL] != null) {
            ConstantParameterData.VOL_BG_MUSIC = this.m_dataList[KeyWord.SYSTEM_PARAMETER_MUSIC_VOL] * 0.01;
        }

        if (this.m_dataList[KeyWord.SYSTEM_PARAMETER_ENEMY_CAST_VOL] != null) {
            ConstantParameterData.VOL_OTHER_SKILL = this.m_dataList[KeyWord.SYSTEM_PARAMETER_ENEMY_CAST_VOL] * 0.01;
        }

        if (this.m_dataList[KeyWord.SYSTEM_PARAMETER_PET_CAST_VOL] != null) {
            ConstantParameterData.VOL_PET_SKILL = this.m_dataList[KeyWord.SYSTEM_PARAMETER_PET_CAST_VOL] * 0.01;
        }

        if (this.m_dataList[KeyWord.SYSTEM_PARAMETER_SELF_CAST_VOL] != null) {
            ConstantParameterData.VOL_SELF_SKILL = this.m_dataList[KeyWord.SYSTEM_PARAMETER_SELF_CAST_VOL] * 0.01;
        }
    }

    /**
     * 通过参数id获取对应的值 
     * @param id - 参数id
     * @return 
     * 
     */
    getValueById(id: number): number {
        if (id < 0 || this.m_dataList[id] == undefined) {
            return null;
        }
        return this.m_dataList[id];
    }
}
