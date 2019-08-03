import { Global as G } from "System/global"
export class DefaultValue {
    private list: { [id: string]: string } = {};
    onCfgReady() {
        let data: GameConfig.ClientDefaultM[] = G.Cfgmgr.getCfg('data/ClientDefaultM.json') as GameConfig.ClientDefaultM[];
        for (let d of data) {
            this.list[d.m_szName] = d.m_szValue;
        }
    }
    public getValue(key: string): string {
        let v = this.list[key];
        if (v) {
            return v;
        }
        else {
            uts.logError("can not find default value,key name:" + key);
            return null;
        }
    }
}