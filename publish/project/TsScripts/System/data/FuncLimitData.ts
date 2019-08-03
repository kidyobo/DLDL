import { Global as G } from 'System/global'
import { HeroData } from 'System/data/RoleData'
import { QuestData } from 'System/data/QuestData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { Constants } from 'System/constants/Constants'
import { ZhufuData } from 'System/data/ZhufuData'

enum FuncState {
    locked = 0,
    forbid,
    unlocked,
}

/**
 * 功能等级限制数据代理。
 * 请注意，虽然配置的数据结构名字以NPC开头，但却不仅限于NPC功能，
 * 右下角系统功能、M地图周边功能。
 * @author xiaojialin
 *
 */
export class FuncLimitData {
    /**功能限制配置数据映射表。*/
    private m_funcLimitDataMap: { [funcName: number]: GameConfig.NPCFunctionLimitM } = {};

    /**受限的功能。*/
    private m_limittedFuncs: GameConfig.NPCFunctionLimitM[] = [];

    /**当前预告的玩法坐标*/
    private m_currentWanfa: number = 0;

    /**新功能预告*/
    private m_predictConfigs: GameConfig.NewFeatPreConfigM[];
    private maxPredictLv = 0;

    private funcId2Platforms: { [id: number]: string[] } = {};

    /**图标大类型字典*/
    private _iconBigTypeDic: { [bigType: number]: number[] } = {};
    /**图标查空字典*/
    private _iconTmpDic: { [funcId: number]: GameConfig.ActIconOrderM } = {};

    private subFuncMap: { [parentId: number]: number[] } = {};

    /**标记功能是否已解锁*/
    private funcUnlockMap: { [funcId: number]: FuncState } = {};

    /**已开放的时间功能*/
    openTimeFunc: Protocol.FunctionActList;

    private isStateInited = false;
    isFiltered = false;

    wingPredictLv = 0;
    /**灵翼强化激活后，需要引导玩家点击一次强化*/
    needGuildWing = false;

    onCfgReady() {
        this.setActIconOrderConfig();
        this.setConfigData();
        this.setFuncPredictDate();
    }

    /**设置图标位置表*/
    private setActIconOrderConfig(): void {
        let configs: GameConfig.ActIconOrderM[] = G.Cfgmgr.getCfg('data/ActIconOrderM.json') as GameConfig.ActIconOrderM[];

        let key: string;
        let platformType: number = G.DataMgr.gameParas.platformType;
        for (let config of configs) {
            this._iconTmpDic[config.m_iID] = config;
            if (config.m_szPlatformNames != '') {
                this.funcId2Platforms[config.m_iID] = config.m_szPlatformNames.split(',');
            }

            if (config.m_iType == KeyWord.ICON_ORDER2) {
                if (!this._iconBigTypeDic[config.m_iArea]) {
                    this._iconBigTypeDic[config.m_iArea] = [];
                }
                this._iconBigTypeDic[config.m_iArea].push(config.m_iID);
            }
        }
    }

    /**获取图标位置配置表(可以用来判断是否显示)*/
    getActIconCfg(funId: number): GameConfig.ActIconOrderM {
        let config: GameConfig.ActIconOrderM;
        let platforms = this.funcId2Platforms[funId];
        if (platforms && funId != KeyWord.OTHER_FUNCTION_VPLUSPOWER) {
            let platId = G.AppCfg.Plat;
            let cusTomChannel = G.ChannelSDK.ChannelID;
            let platName = G.DataMgr.systemData.getPlatName(platId, cusTomChannel);
            if (platforms.indexOf(platName) < 0) {
                return null;
            }
        }

        return this._iconTmpDic[funId];
    }

    /**
     * 获取图标位置大类型数组
     * @param	funId
     * @return
     */
    getIconBigTypeVec(funId: number): number[] {
        return this._iconBigTypeDic[funId];
    }

    /**
     * 设置功能限制配置数据。
     * @param configList 功能限制配置数据。
     *
     */
    private setConfigData() {
        let configList: GameConfig.NPCFunctionLimitM[] = G.Cfgmgr.getCfg('data/NPCFunctionLimitM.json') as GameConfig.NPCFunctionLimitM[];
        
        for (let funcLimitConf of configList) {
            this.m_funcLimitDataMap[funcLimitConf.m_iName] = funcLimitConf;
            if (funcLimitConf.m_ucLevel > 0 || funcLimitConf.m_ucCompleteQuest > 0 || funcLimitConf.m_ucAcceptQuest > 0 || funcLimitConf.m_iPinstanceID > 0) {
                this.m_limittedFuncs.push(funcLimitConf);
            }

            if (funcLimitConf.m_iParentName > 0) {
                uts.assert(KeyWord.FUNC_LIMIT_OTHER == funcLimitConf.m_ucFunctionClass || KeyWord.FUNC_LIMIT_NPC == funcLimitConf.m_ucFunctionClass);
                let subList = this.subFuncMap[funcLimitConf.m_iParentName];
                if (null == subList) {
                    this.subFuncMap[funcLimitConf.m_iParentName] = subList = [];
                }
                subList.push(funcLimitConf.m_iName);
            }
        }
    }

    getSubFuncIds(id: number): number[] {
        return this.subFuncMap[id];
    }

    initFuncState() {
        if (this.isStateInited) {
            return;
        }
        for (let funcIdKey in this.m_funcLimitDataMap) {
            let funcLimitConf = this.m_funcLimitDataMap[funcIdKey];
            if (KeyWord.FUNC_LIMIT_ACT == funcLimitConf.m_ucFunctionClass && null == this.getActIconCfg(funcLimitConf.m_iName)) {
                this.funcUnlockMap[funcLimitConf.m_iName] = FuncState.forbid;
            } else if (funcLimitConf.m_ucAcceptQuest > 0 || funcLimitConf.m_ucCompleteQuest > 0 || funcLimitConf.m_ucLevel > 0 || funcLimitConf.m_iPinstanceID > 0) {
                this.funcUnlockMap[funcLimitConf.m_iName] = FuncState.locked;
            }
        }
        this.isStateInited = true;
    }

    /**
     * 过滤掉所有已经开启的功能。
     *
     */
    filterLimits() {
        this.updateFuncStates();

        this.isFiltered = true;
        let config: GameConfig.NPCFunctionLimitM;
        let index: number;
        for (let i: number = this.m_limittedFuncs.length - 1; i >= 0; i--) {
            config = this.m_limittedFuncs[i];
            if (this.isFuncAvailable(config.m_iName, false)) {

                this.m_limittedFuncs.splice(i, 1);
            }
            else {
                config.m_szDisableMsg = !StringUtil.isEmpty(config.m_szDisableMsg) ? RegExpUtil.xlsDesc2Html(config.m_szDisableMsg) : config.m_szDisableMsg;
            }
        }

        if (!this.isFuncAvailable(KeyWord.OTHER_FUNCTION_YYQH)) {
            this.needGuildWing = true;
        }
    }

    /**
     * 检查并返回新启用的功能。
     * @return
     *
     */
    checkNewFunc(): GameConfig.NPCFunctionLimitM[] {
        let configs: GameConfig.NPCFunctionLimitM[] = new Array<GameConfig.NPCFunctionLimitM>();
        let config: GameConfig.NPCFunctionLimitM;
        for (let i: number = this.m_limittedFuncs.length - 1; i >= 0; i--) {
            config = this.m_limittedFuncs[i];
            if (this.isFuncAvailable(config.m_iName, false)) {
                this.m_limittedFuncs.splice(i, 1);
                configs.push(config);
            }
        }

        return configs;
    }

    updateFuncStates() {
        let myLv = G.DataMgr.heroData.level;
        let questData = G.DataMgr.questData;
        for (let idKey in this.funcUnlockMap) {
            let id = parseInt(idKey);
            if (FuncState.locked == this.funcUnlockMap[id]) {
                let funcLimitConf = this.getFuncLimitConfig(id);
                // 达到指定等级或完成关联任务均可开放功能
                // 配置了开放等级且达到该等级则开放功能，否则检查关联任务是否完成
                let state = FuncState.locked;
                if (0 != funcLimitConf.m_ucLevel && funcLimitConf.m_ucLevel <= myLv) {
                    state = FuncState.unlocked;
                }
                // 检查指定等级是否完成
                // 走到这里只有两种情况：
                // 1. 没有配置开放等级，同时配置了关联任务
                // 2. 配置了开放等级但没有达到开放等级
                else if (0 != funcLimitConf.m_ucCompleteQuest && questData.isQuestCompleted(funcLimitConf.m_ucCompleteQuest)) {
                    state = FuncState.unlocked;
                }
                else if (0 != funcLimitConf.m_ucAcceptQuest && (questData.isQuestInDoingList(funcLimitConf.m_ucAcceptQuest) || (questData.isQuestCompleted(funcLimitConf.m_ucAcceptQuest)))) {
                    state = FuncState.unlocked;
                }
                else if (funcLimitConf.m_iPinstanceID > 0) {
                    let info = G.DataMgr.pinstanceData.getPinstanceInfo(funcLimitConf.m_iPinstanceID);
                    if (info && info.m_uiCurLevel >= funcLimitConf.m_iPinstanceDiff) {
                        state = FuncState.unlocked;
                    }
                }
                this.funcUnlockMap[id] = state;
            }
        }
    }

    /**
     * 还没开启的功能列表。
     * @return
     *
     */
    get limitFuncs(): GameConfig.NPCFunctionLimitM[] {
        return this.m_limittedFuncs;
    }

    /**
     * 检查指定的功能是否可用。
     * @param funcName 指定的功能名称ID。
     * @param needPrompt 是否打印提示信息
     * @return 若指定的功能受等级限制则返回<CODE>true</CODE>，否则返回<CODE>false</CODE>。
     *
     */
    isFuncAvailable(funcName: number, needPrompt: boolean = false): boolean {
        let ret = true;
        let msg: string;
        let funcLimitConf: GameConfig.NPCFunctionLimitM = this.m_funcLimitDataMap[funcName];
        if (null == funcLimitConf) {
            ret = true;
        } else {
            msg = funcLimitConf.m_szDisableMsg;
            if (funcLimitConf.m_ucNeedAct > 0) {
                if ((this.openTimeFunc == null || this.openTimeFunc.m_usFuncID.indexOf(funcLimitConf.m_iName) < 0)) {
                    ret = false;
                }
                else {
                    ret = true;
                }
            } else {
                let state = this.funcUnlockMap[funcName];
                ret = undefined == state || FuncState.unlocked == state;
            }
        }
        if (needPrompt && !ret) {
            G.TipMgr.addMainFloatTip(!StringUtil.isEmpty(msg) ? msg : '本功能尚未开启！');
        }
        return ret;
    }

    /**
     * 查询指定的功能入口是否可以显示。
     * @param funcClass
     * @param funcName
     * @return
     *
     */
    isFuncEntranceVisible(funcName: number, needPrompt = false): boolean {
        let limitCfg = this.m_funcLimitDataMap[funcName];

        if (null != limitCfg) {
            // 自身有配置，先检查自身的开服日期限制
            let d = G.SyncTime.getDateAfterStartServer();
            if (limitCfg.m_ucStartDate > 0 && d < limitCfg.m_ucStartDate) {
                if (needPrompt) {
                    G.TipMgr.addMainFloatTip('本功能尚未开启！');
                }
                return false;
            }

            if (limitCfg.m_ucEndDate > 0 && d > limitCfg.m_ucEndDate) {
                if (needPrompt) {
                    G.TipMgr.addMainFloatTip('本功能尚未开启！');
                }
                return false;
            }
            // 再检查父功能的开服日期限制
            if (limitCfg.m_iParentName > 0) {
                let parentLimitCfg = this.m_funcLimitDataMap[limitCfg.m_iParentName];
                if (null != parentLimitCfg) {
                    // 父功能有配置则检查父功能的日期限制，没有配置的话就不用检查了
                    if (parentLimitCfg.m_ucStartDate > 0 && d < parentLimitCfg.m_ucStartDate) {
                        if (needPrompt) {
                            G.TipMgr.addMainFloatTip('本功能尚未开启！');
                        }
                        return false;
                    }

                    if (parentLimitCfg.m_ucEndDate > 0 && d > parentLimitCfg.m_ucEndDate) {
                        if (needPrompt) {
                            G.TipMgr.addMainFloatTip('本功能尚未开启！');
                        }
                        return false;
                    }
                }
            }
        } else {
            // 如果自身没有配置，看看挂靠的功能有没有开的
            let subIds = this.getSubFuncIds(funcName);
            if (null != subIds) {
                for (let subId of subIds) {
                    if (this.isFuncEntranceVisible(subId)) {
                        return true;
                    }
                }
                // 挂靠的功能都没开，那就不可显示
                if (needPrompt) {
                    G.TipMgr.addMainFloatTip('本功能尚未开启！');
                }
                return false;
            }

            return true;
        }

        if (limitCfg.m_ucAlwaysShow) {
            // 一直显示，不管是否可用
            return true;
        }
        return this.isFuncAvailable(funcName, false);
    }

    /**功能是否符合平台*/
    isFuncMatchPlatform(funcName: number): boolean {
        let actIconCfg: GameConfig.ActIconOrderM = this.getActIconCfg(funcName);
        return null != actIconCfg;//我的信息
    }

    /**
     * 获取指定的功能的限制配置。
     * @param funcClass 功能类型ID。
     * @param funcName 指定的功能名称ID。
     * @return 指定的功能的限制配置。
     *
     */
    getFuncLimitConfig(funcName: number): GameConfig.NPCFunctionLimitM {
        return this.m_funcLimitDataMap[funcName];
    }

    getFuncRoot(cfg: GameConfig.NPCFunctionLimitM): GameConfig.NPCFunctionLimitM {
        if (KeyWord.FUNC_LIMIT_OTHER == cfg.m_ucFunctionClass) {
            let parentCfg = this.getFuncLimitConfig(cfg.m_iParentName);
            if (null != parentCfg) {
                cfg = parentCfg;
            }
        }
        return cfg;
    }

    /**
     * 获取指定副本对应的功能ID。
     * @param pid
     * @return
     *
     */
    static getFuncIdByPinstanceID(pid: number): number {
        let ret = 0;
        if (Macros.PINSTANCE_ID_FMT == pid) {
            ret = KeyWord.ACT_FUNCTION_FMT;
        }
        //  else if (PinstanceIDUtil.isGrjjPins(pid)) {
        //     ret = KeyWord.OTHER_FUNCTION_DZZL;
        // }
        else if (Macros.PINSTANCE_ID_SHNS == pid) {
            ret = KeyWord.OTHER_FUNCTION_SHMJ;
        }
        else if (Macros.PINSTANCE_ID_WST == pid) {
            ret = KeyWord.OTHER_FUNCTION_DZZL;
        }
        return ret;
    }

    private setFuncPredictDate(): void {
        this.m_predictConfigs = G.Cfgmgr.getCfg('data/NewFeatPreConfigM.json') as GameConfig.NewFeatPreConfigM[];
        for (let cfg of this.m_predictConfigs) {
            if (cfg.m_uiType == KeyWord.OTHER_FUNCTION_YYQH) {
                this.wingPredictLv = cfg.m_uiConditionValue;
            }
            if (cfg.m_uiLevel > this.maxPredictLv) {
                this.maxPredictLv = cfg.m_uiLevel;
            }
        }
    }

    getFuncPreData(): GameConfig.NewFeatPreConfigM[] {
        return this.m_predictConfigs;
    }

    needTrail(): boolean {
        let myLv = G.DataMgr.heroData.level;
        if (myLv < Constants.FmtBossGuideLv) {
            return true;
        }
        return myLv < this.maxPredictLv && myLv >= this.wingPredictLv && this.needGuildWing;
    }
}
