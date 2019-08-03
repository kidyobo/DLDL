import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'

export class ShieldGodData {
    /**每次进阶+10点祝福值*/
    static readonly StepPerEnhance = 10;

    /**属性最大条数*/
    static readonly MaxPropCnt: number = 8;

    ids: number[] = [];
    maxLv = 1;

    private id2cfgs: { [id: number]: GameConfig.ShieldGodCfgM[] } = {};

    private crtShieldId = 0;
    private id2info: { [id: number]: Protocol.ShieldGodInfo } = {};

    onCfgReady() {
        let cfgs = G.Cfgmgr.getCfg('data/ShieldGodCfgM.json') as GameConfig.ShieldGodCfgM[];
        for (let config of cfgs) {
            let arr = this.id2cfgs[config.m_iType];
            if (!arr) {
                this.ids.push(config.m_iType);
                this.id2cfgs[config.m_iType] = arr = [];
            }
            arr.push(config);
            if (config.m_shLv > this.maxLv) {
                this.maxLv = config.m_shLv;
            }
        }
    }

    getCfg(type: number, lv: number): GameConfig.ShieldGodCfgM {
        if (lv > 0) {
            let arr = this.id2cfgs[type];
            if (arr) {
                return arr[lv - 1];
            }
        }
        return null;
    }

    updateShieldData(info: Protocol.ShieldGodInfoList) {
        this.crtShieldId = info.m_iShowID;
        for (let i = 0; i < info.m_ucNum; i++) {
            let oneInfo = info.m_astShieldGodList[i];
            this.id2info[oneInfo.m_iID] = oneInfo;
        }
    }

    updateFightShield(crtId: number) {
        this.crtShieldId = crtId;
    }

    updateOneShield(oneInfo: Protocol.ShieldGodInfo) {
        this.id2info[oneInfo.m_iID] = oneInfo;
    }

    get CrtShieldId(): number {
        return this.crtShieldId;
    }

    getShieldInfo(id: number): Protocol.ShieldGodInfo {
        return this.id2info[id];
    }

    /**
     * 一个法器是否可以激活
     * @param id
     */
    canActivate(id: number): boolean {
        let oneInfo = this.getShieldInfo(id);
        return null != oneInfo && oneInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET;
    }

    getCanActivateId(): number {
        for (let id of this.ids) {
            if (this.canActivate(id)) {
                return id;
            }
        }
        return 0;
    }

    /**
     * 是否可以升阶
     * @param faqiId
     */
    canUpLevel(id: number): boolean {
        let info = this.getShieldInfo(id);
        if (null != info) {
            //没激活的直接false
            if (info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) return false;
            let nextConfig = this.getCfg(id, info.m_shLv + 1);
            if (nextConfig != null) {
                let has = G.DataMgr.thingData.getThingNum(nextConfig.m_iUpItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                return has >= nextConfig.m_iUpItemNum && has != 0;
            }
        }

        return false;
    }
}