import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export class ZyzhData {

    /**时间限制配置表。*/
    private m_cfgMap: { [id: number]: GameConfig.ZYZHCfgM } = {};

    data: Protocol.CSZYZHList;

    onCfgReady() {
        let configs: GameConfig.ZYZHCfgM[] = G.Cfgmgr.getCfg('data/ZYZHCfgM.json') as GameConfig.ZYZHCfgM[];
        for (let cfg of configs) {
            this.m_cfgMap[cfg.m_iID] = cfg;
        }
    }

    getCfgById(id: number): GameConfig.ZYZHCfgM {
        return this.m_cfgMap[id];
    }

    canGet(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_ZYZH))
            return false;

        return null != this.data && this.data.m_ucNumber > 0;
    }
}
