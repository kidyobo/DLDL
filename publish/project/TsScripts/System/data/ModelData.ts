import { Global as G } from 'System/global'
import { KeyWord } from "System/constants/KeyWord"

export class ModelData {
    private static m_dataMap: { [modelID: string]: GameConfig.ModelUIScaleM } = {};
    public m_nameMap: GameConfig.PlayerNameM[] = [];
    onCfgReady() {
        this.setModelConfig();
        this.setPlayerNameConfig();
    }

    private setModelConfig(): void {
        let configs: GameConfig.ModelUIScaleM[] = G.Cfgmgr.getCfg('data/ModelUIScaleM.json') as GameConfig.ModelUIScaleM[];

        for (let cfg of configs) {
            ModelData.m_dataMap[cfg.m_modelID] = cfg;
        }
    }
    static getModelConfig(key: string): GameConfig.ModelUIScaleM {
        return ModelData.m_dataMap[key];
    }

    private setPlayerNameConfig(): void {
        this.m_nameMap = G.Cfgmgr.getCfg('data/PlayerNameM.json') as GameConfig.PlayerNameM[];
    }
}