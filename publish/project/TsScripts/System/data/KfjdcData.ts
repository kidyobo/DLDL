import { EnumKuafuPvpStatus } from "System/constants/GameEnum";
import { Global as G } from "System/global";
import { CompareUtil } from "System/utils/CompareUtil";
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'

/**
 * 跨服角斗场数据。
 * @author teppei
 *
 */
export class KfjdcData {
    static readonly RANK_DESC_LIST: string[] = [
        '青铜下品', '青铜上品', '白银下品', '白银上品', '黄金下品', '黄金上品', '铂金下品', '铂金上品', '钻石下品', '钻石上品', '最强王者'
    ];

    /**星星总数*/
    static readonly STAR_COUNT = [3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5];

    static readonly ProgressSeq = [KeyWord.KFJDC_FINAL_PROGRESS_32TO16, KeyWord.KFJDC_FINAL_PROGRESS_16TO8, KeyWord.KFJDC_FINAL_PROGRESS_8TO4, KeyWord.KFJDC_FINAL_PROGRESS_4TO2, KeyWord.KFJDC_FINAL_PROGRESS_3VS4, KeyWord.KFJDC_FINAL_PROGRESS_1VS2];
    static readonly ProgressDesc = ['16强晋级赛', '8强晋级赛', '4强晋级赛', '半决赛', '季军争夺赛', '冠军争夺赛'];
    static readonly ProgressTime = ['21:00 开启', '21:10 开启', '21:20 开启'];
    static readonly ProgressStart = [0, 16, 24, 28, 30, 31];
    static readonly ProgressEnd = [16, 24, 28, 30, 31, 32];
    static readonly ProgressGameCnt = [16, 8, 4, 2, 1, 1];

    /**面板所需数据。*/
    uiData: Protocol.CSSingleOpen_Response;

    /**32强所需数据。*/
    rankData: Protocol.CSSingleRank_Response;

    /**我的状态。*/
    myStatus: EnumKuafuPvpStatus = 0;

    /**围观模式*/
    watchMode = false;

    /**队长信息，缓存了最近一次组队的队长信息，不管队伍是否还存在。*/
    captain: Protocol.Cross_OneTeamMem;

    /**即将开打的副本ID。*/
    pistanceId: number = 0;

    /**是否正在等待同步好数据。*/
    waitSyncRole: boolean = false;

    private cfgMap: { [type: number]: { [rank: number]: GameConfig.KFJDCCfgM } } = {};
    private finalCfgMap: { [progress: number]: GameConfig.KFJDCFinalCfgM } = {};

    onCfgReady() {
        this.cfgMap[KeyWord.KFJDC_REWARD_RANK] = {};
        this.cfgMap[KeyWord.KFJDC_REWARD_GRADE] = {};
        let configs = G.Cfgmgr.getCfg('data/KFJDCCfgM.json') as GameConfig.KFJDCCfgM[];
        for (let cfg of configs) {
            this.cfgMap[cfg.m_iType][cfg.m_iPaiming] = cfg;
        }

        let finalConfigs = G.Cfgmgr.getCfg('data/KFJDCFinalCfgM.json') as GameConfig.KFJDCFinalCfgM[];
        for (let cfg of finalConfigs) {
            this.finalCfgMap[cfg.m_iRound] = cfg;
        }
    }

    getCfg(type: number, rank: number): GameConfig.KFJDCCfgM {
        return this.cfgMap[type][rank];
    }

    getFinalCfg(progress: number): GameConfig.KFJDCFinalCfgM {
        return this.finalCfgMap[progress];
    }

    updateUiData(data: Protocol.CSSingleOpen_Response): void {
        //uts.log(data);
        this.uiData = data;
    }

    updateRankData(data: Protocol.CSSingleRank_Response): void {
        this.rankData = data;
    }

    /**
     * 是否队长。
     * @return
     *
     */
    amICaptain(): boolean {
        if (null == this.captain) {
            return false;
        }
        return CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, this.captain.m_stRoleID);
    }

    updateByStart(startRes: Protocol.CSCross_StartPin_Response): void {
        this.pistanceId = startRes.m_stTeam.m_uiPinstanceID;
        this.captain = uts.deepcopy(startRes.m_stTeam.m_astTeamInfo[0], this.captain, true);
    }

    /**
     * 收到周比赛通知后调用。
     * @param resp
     *
     */
    /* updateByNotify(resp: Protocol.CSSingleNotify_Response): void {
        this.myStatus = EnumKuafuPvpStatus.notify;
        this.battleflag = resp.m_ucFinalTag;
    } */

    updateByBuy(resp: Protocol.CSSingleBuy_Response): void {
        if (null != this.uiData) {
            this.uiData.m_ucBuyTimes = resp.m_ucBuyTimes;
            this.uiData.m_ucTimes = resp.m_ucTimes;
        }
    }

    updateByGetSingleReward(resp: Protocol.CSSingleReward_Response) {
        this.uiData = resp;
    }

    canDoPri(): boolean {
        return this.getPriTimes() > 0 && G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_BASE);
    }

    /**
     * 是否可参加决赛。
     */
    canDoFnl(): boolean {
        if (this.m_finalData && G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_FINAL)) {
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let gameInfo = this.m_finalData.m_stGameInfo;
            if (gameInfo.m_iProgress > 0 && now >= gameInfo.m_uiStartTime && gameInfo.m_uiEndTime > now) {
                let myUIN = G.DataMgr.heroData.roleID.m_uiUin;
                let progressSeq = KfjdcData.ProgressSeq.indexOf(gameInfo.m_iProgress);
                let start = KfjdcData.ProgressStart[progressSeq];
                let end = KfjdcData.ProgressEnd[progressSeq];
                for (let i = start; i < end; i++) {
                    let g = gameInfo.m_stGameList[i];
                    if (g.m_ucLeftStatus == Macros.KFJDC_FINAL_PLAYER_NONE && g.m_ucRightStatus == Macros.KFJDC_FINAL_PLAYER_NONE &&
                        (myUIN == g.m_stLeftRole.m_stRoleId.m_uiUin || myUIN == g.m_stRightRole.m_stRoleId.m_uiUin)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 是否可领取押中奖励
     */
    canGetBetReward(): boolean {
        if (this.m_finalData) {
            let betInfo = this.m_finalData.m_stBetInfo;
            for (let i = 0; i < betInfo.m_ucBetCount; i++) {
                let b = betInfo.m_stBetList[i];
                if (0 == b.m_bGet && b.m_bWinStatus == 1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 是否可以领冠军押注奖励
     */
    canGetChampionSupportReward(): boolean {
        if (this.m_finalData) {
            let betInfo = this.m_finalData.m_stWinBetInfo;
            return betInfo.m_iRewardMoney > 0 && betInfo.m_ucWinBetBit == 0;
        }
        return false;
    }

    /**
     * 获取初赛剩余次数。
     * @return
     *
     */
    getPriTimes(): number {
        if (null != this.uiData) {
            return G.DataMgr.constData.getValueById(KeyWord.PARAMETER_CROSS_TIMES) + this.uiData.m_ucBuyTimes - this.uiData.m_ucTimes;
        }
        return 0;
    }

    /**
     * 是否可领取排行奖励。
     */
    canGetRankReward(): boolean {
        if (this.uiData) {
            return this.uiData.m_uiRewardGrade > 0 && this.uiData.m_bRewardGet == 0;
        }
        return false;
    }

    static getRankDesc(grade: number, score: number): string {
        let maxGrade = KfjdcData.RANK_DESC_LIST.length;
        let s = KfjdcData.RANK_DESC_LIST[Math.min(grade, maxGrade) - 1];
        if (grade >= maxGrade) {
            s += uts.format(' {0}分', score);
        }
        return s;
    }

    m_oldChampionData: Protocol.CSSessionFirstList;
    m_finalData: Protocol.CSKFJDCFinalPannelRsp;
    private gameId2betInfo: { [gameId: number]: Protocol.CSKFJDCBetInfo } = {};

    finalPlayerData: Protocol.KFJDCFinalPlayer;

    /**
     * 跨服决斗场决赛 倒计时
     */
    jjtzKfjdcTime: Protocol.KFJDCFinalTime;

    /**
     * 跨服决斗场决赛 胜负情况
     */
    jjtzKfjdcFinalResult: Protocol.KFJDCFinalResult;

    updateByFinalPanelRsp(rsp: Protocol.CSKFJDCFinalPannelRsp) {
        //uts.log('m_iGameCount = ' + rsp.m_stGameInfo.m_iGameCount + ', m_iProgress = ' + rsp.m_stGameInfo.m_iProgress + ', m_uiStartTime = ' + rsp.m_stGameInfo.m_uiStartTime + ', m_uiEndTime = ' + rsp.m_stGameInfo.m_uiEndTime + ', betInfo = ' + JSON.stringify(rsp.m_stBetInfo));
        this.m_finalData = rsp;
        this.rebuildBetInfo();
    }

    updateByFinalBetRsp(rsp: Protocol.SingleFinalBetRsp) {
        this.m_finalData.m_stBetInfo = rsp.m_stBetInfo;
        this.m_finalData.m_stGameInfo = rsp.m_stGameInfo;
        this.rebuildBetInfo();
    }

    updateByBetGetRsp(rsp: Protocol.SingleFinalBetGetRsp) {
        this.m_finalData.m_stBetInfo = rsp.m_stBetInfo;
        this.rebuildBetInfo();
    }

    updateByChampionBetRsp(rsp: Protocol.SingleFinalWinBetRsp) {
        this.m_finalData.m_stWinBetInfo = rsp.m_stWinBetInfo;
        this.m_finalData.m_stGameInfo = rsp.m_stGameInfo;
    }

    updateByChampionBetGetRsp(rsp: Protocol.SingleFinalWinBetGetRsp) {
        this.m_finalData.m_stWinBetInfo.m_ucWinBetBit = 1;
    }

    private rebuildBetInfo() {
        this.gameId2betInfo = {};
        let betInfo = this.m_finalData.m_stBetInfo;
        for (let i = 0; i < betInfo.m_ucBetCount; i++) {
            let b = betInfo.m_stBetList[i];
            this.gameId2betInfo[b.m_iGameID] = b;
        }
    }

    getBetInfoByGameId(gameId: number): Protocol.CSKFJDCBetInfo {
        return this.gameId2betInfo[gameId];
    }

    /**是否正在匹配中*/
    get isMathing(): boolean {
        return this.myStatus == EnumKuafuPvpStatus.queue;
    }
}
