import { Constants } from 'System/constants/Constants'
import { Global as G } from 'System/global'

export class WybqData {
    /**战力档次数据*/
    private static m_staticisConfig: GameConfig.WYBQConfigM[];

    /**提升途径数据*/
    private static m_methodConfig: GameConfig.WYBQTuJingConfigM[];

    private static m_tempList: GameConfig.WYBQTuJingConfigM[];



    onCfgReady(): void {    
        this.setStaticsConfig();
        this.setMethodConfig();
    }

    /**
     * 战力变强档次配置
     * @param data
     *
     */
    setStaticsConfig(): void {
        let data: GameConfig.WYBQConfigM[] = G.Cfgmgr.getCfg('data/WYBQConfigM.json') as GameConfig.WYBQConfigM[];
        WybqData.m_staticisConfig = data;
    }

    /**
     * 战力提升途径配置
     * @param data
     *
     */
    setMethodConfig(): void {
        let data: GameConfig.WYBQTuJingConfigM[] = G.Cfgmgr.getCfg('data/WYBQTuJingConfigM.json') as GameConfig.WYBQTuJingConfigM[];
        WybqData.m_methodConfig = data;
    }

    /**
     * 获得某类战力的提升途径配置
     * @param type
     * @return
     *
     */
    static getMethodListData(type: number): GameConfig.WYBQTuJingConfigM[] {
        let count: number = WybqData.m_methodConfig.length;
        let config: GameConfig.WYBQTuJingConfigM;

        if (WybqData.m_tempList == null) {
            WybqData.m_tempList = new Array<GameConfig.WYBQTuJingConfigM>();
        }

        WybqData.m_tempList.length = 0;

        for (let i: number = 0; i < count; i++) {
            config = WybqData.m_methodConfig[i];

            if (config.m_iSystem == type) {
                WybqData.m_tempList.push(config);
            }
        }

        return WybqData.m_tempList;
    }

    /**
     * 获得某类战力档次配置
     * @param type
     * @return
     *
     */
    static getStaticsConfig(type: number, level: number): GameConfig.WYBQConfigM {
        let count: number = WybqData.m_staticisConfig.length;
        let lastLevel: number = 0;
        let lastConfig: GameConfig.WYBQConfigM;
        let config: GameConfig.WYBQConfigM;

        for (let i: number = 0; i < count; i++) {
            config = WybqData.m_staticisConfig[i];

            if (config.m_iLevel > level) {
                if (config.m_iSystem == type) {
                    if (lastLevel == 0 || config.m_iLevel < lastLevel) {
                        lastLevel = config.m_iLevel;
                        lastConfig = config;
                    }
                }
            }
            //目前满级100级，避免满级后lastConfig返回为空
            if (level == Constants.MAX_HERO_LEVEL && config.m_iLevel == Constants.MAX_HERO_LEVEL) {
                if (config.m_iSystem == type) {
                    lastLevel = config.m_iLevel;
                    lastConfig = config;
                }
            }

        }

        return lastConfig;
    }
}
