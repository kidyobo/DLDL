import { Global as G } from 'System/global'
import { EnumActivateState } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'

export class SiXiangJinJieItemData {
    stage = 0;
    exp = 0;
    activateState: EnumActivateState;
    canUpgrade = false;
    oneKeyNeed = 0;
    cfg: GameConfig.ShenShouCfgM;
}

export class SiXiangData {

    /////////////////////// 斗兽神兽 ///////////////////////

    static readonly TotalCnt = 4;
    static readonly PositionDesc = ['前锋', '中坚', '后阵', '援军'];
    static readonly Names = ['青龙', '朱雀', '白虎', '玄武'];
    static readonly Colors = [Color.GREEN, Color.RED, Color.WHITE, Color.YELLOW];
    static readonly Heads = [0, 0, 0, 0];
    static readonly MonsterId = [31430001, 31430002];
    static readonly MyMonsterIndex = 0;
    static readonly OpponentMonsterIndex = 1;
    static readonly MaxPropCnt = 7;
    static readonly HaloPropCnt = 2;
    static readonly StageSize = 5;
    //static readonly FaQiFuncIds = [KeyWord.OTHER_FUNCTION_SHENSHOU1, KeyWord.OTHER_FUNCTION_SHENSHOU2, KeyWord.OTHER_FUNCTION_SHENSHOU3, KeyWord.OTHER_FUNCTION_SHENSHOU4];

    private shenShouList: Protocol.ShenShouList;

    private id2lvCfgMap: { [id: number]: GameConfig.ShenShouCfgM[] } = {};

    /////////////////////// 斗兽斗兽场 ///////////////////////

    static readonly ClearCdPrice = 10;

    /**最大免费挑战次数*/
    static _MAX_CHALLENGE_TIME = 0;

    /**每次购买所花费的钻石*/
    static _YUANBAO_COST_PERTIME = 0;

    private id2gradeCfgMap: { [id: number]: GameConfig.ColosseumGradeM } = {};
    private stage2gradeCfgsMap: { [stage: number]: GameConfig.ColosseumGradeM[] } = {};
    private rankCfgMap: { [rank: number]: GameConfig.ColosseumRankM } = {};

    sxPkInfo: Protocol.CSColosseumPanel_Response;
    sxRankInfo: Protocol.CSColosseumRank_Response;
    sxRewardInfo: Protocol.CSColosseumReward_Response;
    sxStartInfo: Protocol.CSColosseumStartPK_Response;
    sxActInfo: Protocol.ColosseumActRsp;

    /**可以领的斗兽币*/
    canGetSxb = 0;

    onCfgReady() {
        this.setShenShouCfgs();
        this.setDouShouChangeCfgs();
        SiXiangData._MAX_CHALLENGE_TIME = G.DataMgr.constData.getValueById(KeyWord.PARAM_COLOSSEUM_FREE_TIMES);
        SiXiangData._YUANBAO_COST_PERTIME = G.DataMgr.constData.getValueById(KeyWord.PARAM_COLOSSEUM_BUY_PRICE);
    }

    /////////////////////// 斗兽神兽 ///////////////////////

    private setShenShouCfgs() {
        let ssCfgs = G.Cfgmgr.getCfg('data/ShenShouCfgM.json') as GameConfig.ShenShouCfgM[];
        for (let cfg of ssCfgs) {
            let lvArr = this.id2lvCfgMap[cfg.m_uiSeasonID];
            if (null == lvArr) {
                this.id2lvCfgMap[cfg.m_uiSeasonID] = lvArr = [];
            }
            lvArr.push(cfg);
        }
        for (let idKey in this.id2lvCfgMap) {
            let lvArr = this.id2lvCfgMap[idKey];
            lvArr.sort(delegate(this, this.sortShenShouCfg));
        }
    }

    private sortShenShouCfg(a: GameConfig.ShenShouCfgM, b: GameConfig.ShenShouCfgM): number {
        return a.m_iSeasonLevel - b.m_iSeasonLevel;
    }

    getCfg(id: number, lv: number): GameConfig.ShenShouCfgM {
        let lvArr = this.id2lvCfgMap[id];
        if (null != lvArr) {
            return lvArr[lv > 0 ? lv - 1 : 0];
        }
        return null;
    }

    updateShenShouList(shenShouList: Protocol.ShenShouList) {
        this.shenShouList = shenShouList;
    }

    getShenShouInfo(id: number) {
        if (null != this.shenShouList && null != this.shenShouList.m_stShenShouInfo) {
            return this.shenShouList.m_stShenShouInfo[id - 1];
        }
        return null;
    }

    getActivatedShenShouIds(): number[] {
        let out: number[] = [];
        if (null != this.shenShouList && null != this.shenShouList.m_stShenShouInfo) {
            for (let i = 0; i < SiXiangData.TotalCnt; i++) {
                let info = this.shenShouList.m_stShenShouInfo[i];
                if (info.m_ucLevel > 0) {
                    out.push(i + 1);
                }
            }
        }
        return out;
    }

    getFaQiIdAtPosition(position: number): number {
        if (null != this.shenShouList && null != this.shenShouList.m_astSetFaQiList) {
            return this.shenShouList.m_astSetFaQiList[position - 1];
        }
        return 0;
    }

    /**
     * 获取指定id的宝物的镶嵌位置，0表示未镶嵌。
     * @param id
     */
    getFaQiPositionById(id: number): number {
        if (null != this.shenShouList && null != this.shenShouList.m_astSetFaQiList) {
            return this.shenShouList.m_astSetFaQiList.indexOf(id) + 1;
        }
        return 0;
    }

    getCanJinJieShenShouId(): number {
        if (null != this.shenShouList && null != this.shenShouList.m_stShenShouInfo) {
            for (let i = 0; i < SiXiangData.TotalCnt; i++) {
                let id = i + 1;
                let info = this.shenShouList.m_stShenShouInfo[i];
                let cfg = this.getCfg(id, info.m_ucLevel);
                if (info.m_ucLevel > 0) {
                    // 已激活，检查是否可升阶
                    if (info.m_uiLayer < cfg.m_iLvXP) {
                        let left = cfg.m_iLvXP - info.m_uiLayer;
                        let times = Math.ceil(left / cfg.m_iLuckyUp);
                        let need = times * cfg.m_iLuckyUp;
                        if (0 == G.ActionHandler.getLackNum(cfg.m_iConsumableID, need, false)) {
                            return id;
                        }
                    } else {
                        if (0 == G.ActionHandler.getLackNum(cfg.m_iByondID, cfg.m_iByondNumber, false)) {
                            return id;
                        }
                    }
                } 
            }
        }

        return 0;
    }

    getCanActivatedShenShouId(): number {
        if (null != this.shenShouList && null != this.shenShouList.m_stShenShouInfo) {
            for (let i = 0; i < SiXiangData.TotalCnt; i++) {
                let id = i + 1;
                let info = this.shenShouList.m_stShenShouInfo[i];
                let cfg = this.getCfg(id, info.m_ucLevel);
                if (info.m_ucLevel == 0) {
                    // 未激活，检查是否可激活
                    if (0 == G.ActionHandler.getLackNum(cfg.m_iActID, cfg.m_iActNumber, false)) {
                        return id;
                    }
                }
            }
        }

        return 0;
    }

    getSetFaQiCnt(): number {
        let cnt = 0;
        for (let s of this.shenShouList.m_astSetFaQiList) {
            if (s > 0) {
                cnt++;
            } 
        }
        return cnt;
    }

    getCanDoFaQiPosition(): number {
        if (null != this.shenShouList && null != this.shenShouList.m_astSetFaQiList && this.getSetFaQiCnt() < G.DataMgr.fabaoData.getActivatedFaQiIds().length) {
            // 4个宝物孔
            let funcLimitData = G.DataMgr.funcLimitData;
            for (let i = 0; i < SiXiangData.TotalCnt; i++) {
                let position = i + 1;
                let faQiId = this.getFaQiIdAtPosition(position);
                if (faQiId == 0) {
                    // 没有镶嵌宝物，且左右神兽都激活了就提示红点
                    let ss1 = this.getShenShouInfo(SiXiangData.getShenShouId1ByFaQiPosition(position));
                    let ss2 = this.getShenShouInfo(SiXiangData.getShenShouId2ByFaQiPosition(position));
                    if ((null != ss1 && ss1.m_ucLevel > 0) || (null != ss2 && ss2.m_ucLevel > 0)) {
                        return position;
                    }
                }
            }
        }
        return 0;
    }

    canDoSiXiangDouShouChang(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG)) return false;
        if (this.canGetSxbReward()) {
            // 有斗兽币可以领
            return true;
        }

        if (null != this.sxActInfo) {
            if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_COLOSSEUM) && this.getActivatedShenShouIds().length > 0 && this.getRemainTimes() > 0) {
                // 还有次数
                return true;
            }
        }

        return false;
    }

    canGetSxbReward(): boolean {
        if (this.canGetSxb > 0) {
            // 有斗兽币可以领
            return true;
        }

        if (null != this.sxActInfo) {
            if (0 == this.sxActInfo.m_ucGiftStatu && this.sxActInfo.m_uiPreGrade > 0) {
                // 有段位奖励可以领
                return true;
            }
        }

        return false;
    }

    getShenShouBattleIndex(id: number): number {
        if (null == this.sxActInfo || 0 == this.sxActInfo.m_ucSSCout) {
            return -1;
        }

        let battleList = this.sxActInfo.m_astBattleSSList;
        for (let i = 0; i < this.sxActInfo.m_ucSSCout; i++) {
            if (battleList[i].m_ucType == id) {
                return i;
            }
        }

        return -1;
    }

    get ShenShouList(): Protocol.ShenShouList {
        return this.shenShouList;
    }

    static getShenShouId1ByFaQiPosition(position: number): number {
        return ((position - 1) % SiXiangData.TotalCnt) + 1;
    }

    static getShenShouId2ByFaQiPosition(position: number): number {
        return (position % SiXiangData.TotalCnt) + 1;
    }

    static getFight(cfg: GameConfig.ShenShouCfgM, exp: number): number {
        let fight = 0;
        fight += FightingStrengthUtil.calStrength(cfg.m_astFixProp) * (exp / cfg.m_iLuckyUp);
        fight += FightingStrengthUtil.calStrength(cfg.m_astProp);
        return fight;
    }

    /////////////////////// 斗兽斗兽场 ///////////////////////

    private setDouShouChangeCfgs() {
        let cgCfgs = G.Cfgmgr.getCfg('data/ColosseumGradeM.json') as GameConfig.ColosseumGradeM[];
        for (let cfg of cgCfgs) {
            let arr = this.stage2gradeCfgsMap[cfg.m_iStage];
            if (null == arr) {
                this.stage2gradeCfgsMap[cfg.m_iStage] = arr = [];
            }
            arr.push(cfg);
            this.id2gradeCfgMap[cfg.m_iID] = cfg;
        }

        let crCfgs = G.Cfgmgr.getCfg('data/ColosseumRankM.json') as GameConfig.ColosseumRankM[];
        for (let cfg of crCfgs) {
            this.rankCfgMap[cfg.m_iID] = cfg;
        }
    }

    getGradeCfg(id: number): GameConfig.ColosseumGradeM {
        return this.id2gradeCfgMap[id];
    }

    getRankCfg(rank: number): GameConfig.ColosseumRankM {
        return this.rankCfgMap[rank];
    }

    updateByActResp(resp: Protocol.ColosseumActRsp) {
        this.sxActInfo = resp;
    }

    updateByPanelResp(resp: Protocol.CSColosseumPanel_Response) {
        this.sxPkInfo = resp;
        this.canGetSxb = resp.m_uiSSCoin;
    }

    updateByRankResp(resp: Protocol.CSColosseumRank_Response) {
        this.sxRankInfo = resp;
    }

    updateByRewardResp(resp: Protocol.CSColosseumReward_Response) {
        this.sxRewardInfo = resp;
        this.canGetSxb = 0;
        if (null != this.sxPkInfo) {
            this.canGetSxb = 0;
        }
    }

    updateByStartPkResp(resp: Protocol.CSColosseumStartPK_Response) {
        this.sxStartInfo = resp;
    }

    updateByMoneyResp(money: number) {
        this.canGetSxb = money;
    }

    getRemainTimes(): number {
        if (null == this.sxActInfo) {
            return 0;
        }
        let buyTimes = this.sxActInfo.m_uiBuyCount;
        let tickTime = this.sxActInfo.m_iCDTime;

        let curTotalBuyTimes = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT, G.DataMgr.heroData.curVipLevel);

        let remainTime = 0;
        if (buyTimes <= curTotalBuyTimes) {
            remainTime = SiXiangData._MAX_CHALLENGE_TIME - (this.sxActInfo.m_uiDayCount - this.sxActInfo.m_uiRevengeCount) + buyTimes;
        }
        else {
            remainTime = SiXiangData._MAX_CHALLENGE_TIME - (this.sxActInfo.m_uiDayCount - this.sxActInfo.m_uiRevengeCount);
        }
        return Math.max(0, remainTime);
    }
}