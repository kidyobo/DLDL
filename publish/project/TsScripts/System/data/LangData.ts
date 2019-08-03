import { Global as G } from 'System/global'
import { RegExpUtil } from 'System/utils/RegExpUtil'
export class LangData {

    private m_langMap: { [id: number]: string } = {};

    onCfgReady() {
        let dataList: GameConfig.LangCfgM[] = G.Cfgmgr.getCfg('data/LangCfgM.json') as GameConfig.LangCfgM[];
        for (let cfg of dataList) {
            this.m_langMap[cfg.m_iID] = RegExpUtil.xlsDesc2Html(cfg.m_astContent);
        }
    }

    getLang(id: number, ...args) {
        let str = this.m_langMap[id];
        if (null != str && null != args && args.length > 0) {
            str = uts.format.apply(this, [str].concat(args));
        }
        return str ? str : '';
    }
}