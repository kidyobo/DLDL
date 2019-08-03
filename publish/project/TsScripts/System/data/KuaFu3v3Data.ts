import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { EnumKuafuPvpStatus } from 'System/constants/GameEnum'

export class KuaFu3v3Data {
    private _seasonArr: GameConfig.Cross3V3SeasonM[];
    private _winArr: GameConfig.Cross3V3WinM[];
    private _stageArr: GameConfig.Cross3V3GradeM[];
    private _stageIdDic: { [id: number]: GameConfig.Cross3V3GradeM } = {};
    private _bigTypeDic: { [stage: number]: GameConfig.Cross3V3GradeM[] } = {};
    public rankData: Protocol.CSMultiRank_Response;
    /**最高阶级*/
    public maxStage = 0;
    public pvpV3Info: Protocol.Cross3V3ListRsp;
    /**
     * 我的状态。
     */
    public myStatus = 0;

    /**更新数据*/
    updatePvpV3Data(response: Protocol.DoActivity_Response) {
        if (Macros.ACTIVITY_CROSS3V3_LIST == response.m_ucCommand) {
            this.pvpV3Info = response.m_unResultData.m_stCROSS3V3ListRsp;
        }
        else if (Macros.ACTIVITY_CROSS3V3_GET_REWARD == response.m_ucCommand) {
            this.pvpV3Info = response.m_unResultData.m_stCROSS3V3GetRewardRsp;
        }
    }

    onCfgReady() {
        this.setCross3V3SeasonCfg();
        this.setCross3V3WinCfg();
        this.setCross3V3GradeCfg();
    }

    /**3V3赛季排行奖励配置表*/
    private setCross3V3SeasonCfg() {
        this._seasonArr = G.Cfgmgr.getCfg('data/Cross3V3SeasonM.json') as GameConfig.Cross3V3SeasonM[];
        this._seasonArr.sort(delegate(this, this.sortSeasonCfgs));
    }

    private sortSeasonCfgs(a: GameConfig.Cross3V3SeasonM, b: GameConfig.Cross3V3SeasonM): number {
        return a.m_iID - b.m_iID;
    }

    /**3V3胜场奖励*/
    private setCross3V3WinCfg() {
        this._winArr = G.Cfgmgr.getCfg('data/Cross3V3WinM.json') as GameConfig.Cross3V3WinM[];
    }

    /**3V3段位奖励*/
    private setCross3V3GradeCfg() {
        this._stageArr = G.Cfgmgr.getCfg('data/Cross3V3GradeM.json') as GameConfig.Cross3V3GradeM[];

        for (let cfg of this._stageArr)
        {
            if (!this._bigTypeDic[cfg.m_iStage]) {
                this._bigTypeDic[cfg.m_iStage] = [];
            }
            this._stageIdDic[cfg.m_iID] = cfg;

            this._bigTypeDic[cfg.m_iStage].push(cfg);

            this.maxStage = Math.max(cfg.m_iID, this.maxStage);
        }
    }

    /**
     * 获取3V3战场阶级配置表
     * @param	level 等级
     * @return
     */
    getConfByLevel(level: number): GameConfig.Cross3V3GradeM {
        return this._stageIdDic[level];
    }

    /**
     * 获取每个大类型数据
     * @param	level
     * @return
     */
    getConfArrByLevel(bigType: number): GameConfig.Cross3V3GradeM[] {
        return this._bigTypeDic[bigType];
    }

    getDailyWinCfg(m_uiDayWinTime: number): GameConfig.Cross3V3WinM {
        var crtCfg: GameConfig.Cross3V3WinM;
        if (this._winArr) {
            for (let tmpCfg of this._winArr) {
                if (this.pvpV3Info && this.pvpV3Info.m_uiDayWinTime >= tmpCfg.m_iWinCount) {
                    crtCfg = tmpCfg;
                }
            }
        }
        return crtCfg;
    }

    updateRankData(m_stCSMultiRankRes: Protocol.CSMultiRank_Response) {
        this.rankData = m_stCSMultiRankRes;
    }

    /**是否正在匹配中*/
    get isMathing(): boolean {
        return this.myStatus == EnumKuafuPvpStatus.queue;
    }

    /**前三奖励配置表*/
    get seasonArr(): GameConfig.Cross3V3SeasonM[] {
        return this._seasonArr;
    }

    /**获取段位总名称*/
    getStageName(level: number): string {
        let config = this.getConfByLevel(level);
        if (null != config) {
            return config.m_szName;
        }
        return null;
    }
}