import { KeyWord } from "System/constants/KeyWord";
import { PinstanceDiffCache } from "System/data/PinstanceDiffCache";
import { ShouHuNvShenItemData } from "System/data/ShouHuNvShenItemData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { MathUtil } from "System/utils/MathUtil";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { VipData } from 'System/data/VipData'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'
import { ConfirmCheck, MessageBoxConst } from "../tip/TipManager";
import { ProtocolUtil } from "../protocol/ProtocolUtil";

/**
 * 副本数据
 * @author jesse
 *
 */``
export class PinstanceData {
    /**开服前两天强制显示副本红点*/
    static MaxForcePinstanceDay = 2;

    public isReady = false;

    /**是否打开过VIPBoss面板*/
    isHasClickVipBossPanel: boolean = false;

    static RECOMMEND_ATTRS: number[] = [KeyWord.EQUIP_PROP_HP, KeyWord.EQUIP_PROP_PHYSIC_ATTACK, KeyWord.EQUIP_PROP_MAGIC_ATTACK, KeyWord.EQUIP_PROP_DEFENSE, KeyWord.EQUIP_PROP_MAGICRESIST,
    KeyWord.EQUIP_PROP_GOAL, KeyWord.EQUIP_PROP_DODGE];

    /**强化副本最大挑战层数*/
    static QiangHuaFuBenMaxLv = 0;

    /**伙伴副本最大挑战层数*/
    static WuYuanFuBenMaxLv = 0;

    /**天神殿每个副本10层*/
    static readonly FaShenDianLayersPerId = 10;

    /**经验副本每5波一层*/
    static readonly JingYanFuBenGroupSize = 5;

    /**守护女神每25关领宝箱。*/
    static readonly ShouHuNvShenGiftPerLv: number = 25;

    /**材料每个页签几个副本*/
    static readonly CaiLiaoFuBenCntPerCeng = 4;

    /**个人BOSS副本最多次数*/
    static readonly GeRenBossMaxCnt = 5;

    /**个人BOSS引导专用副本Id*/
    static readonly PersonBossGuidePinId = 300062;

    /**是否提示进入游戏*/
    static isCheckSelected: boolean;

    private static m_dataMap: { [pinstanceID: number]: GameConfig.PinstanceConfigM };

    /**副本难度奖励的配置Id映射表。*/
    private static m_diffConfigMap: { [pinstanceID: number]: GameConfig.PinstanceDiffBonusM[] };

    private static m_scene2pinstance: { [sceneID: number]: number[] };

    private m_pinstanceDiffCaches: { [pinstanceID: number]: PinstanceDiffCache };

    /**副本信息表。通天塔的最高纪录也在这里面 */
    private m_pinstanceInfoMap: { [pinstanceID: number]: Protocol.ListPinHomeRsp };

    /**当前副本的难度。*/
    crtPinstanceDiff: number = 0;

    /**当前副本层数，如果不是多层副本则为0。*/
    crtPinstanceLayer: number = 0;

    /**当前冲脉层数。*/
    crtChongmaiLayer: number = 0;

    private _rankInfo: Protocol.PinRankYMZCRsp;

    private _shnsListData: ShouHuNvShenItemData[];

    /**  副本排行信息字典 */
    private _pinstanceRankDic: { [pinstanceID: number]: Protocol.RankPinInfo };
    /** 奔跑吧,兄弟排行版本信息 */
    private m_jstzData: Protocol.PinTimeRankInfo;

    // fsdData: Protocol.FSDListRsp;

    /**个人挑战神力榜排行奖励预览配置*/
    tianMingBangRankPreviewConfigs: GameConfig.JJCRankRewardConfigM[];

    /**是否经验副本引导中*/
    isGuilder: boolean = false;

    /**天命榜最大排名奖励*/
    tianMingBangMaxRankRewardConfigs: GameConfig.ArenaMaxRankRewardCfgM[] = [];
    privateBossConfigs: GameConfig.PrivatBossCfgM[];
    rightInfo: Protocol.SceneInfoRightList;
    hurtInfo: Protocol.SceneInfoHurt;
    dblExpInfo: Protocol.SceneInfoDoubleExp;
    groupPinEnterAgain: Protocol.GroupPinEnterAgain;
    needAutoOpenRank = false;
    /**神选之路打完之后是否再打开面板*/
    isOpenSXZL_Panel: boolean = false;
    /**多人Boss的点数 */
    ismultipBossNum: boolean = false;

    /**落日森林回复数据*/
    m_stForestBossActOpenRsp: Protocol.ForestBossActOpenRsp;

    private m_enterRecords: { [pinstanceId: number]: number } = {};

    private _isSendQuitMsg: boolean;
    get notSendQuitMsg(): boolean { return this._isSendQuitMsg; }
    set notSendQuitMsg(value: boolean) { this._isSendQuitMsg = value; }


    everShowJqfb = false;
    everShowQhfb = false;
    everShowClfb = false;
    /**用来显示魂力试炼的副本名称*/
    pinstanceTitle: string = "";

    //个人boss引导对应的bossid（四次引导，数据写死的）
    private teachBossId: { [index: number]: number } = {};
    private setTeachBossId() {//679是多人boss
        this.teachBossId[1] = 31590001;
        this.teachBossId[2] = 31590002;
        this.teachBossId[3] = 31590003;
        this.teachBossId[4] = 31590004;
        this.teachBossId[5] = 31590004;
        this.teachBossId[6] = 31610001;
        this.teachBossId[7] = 31610001;
        this.teachBossId[8] = 31590005;
        this.teachBossId[9] = 31610005;
    }
    public getTeachBossIdForIndex(index: number): number {
        return this.teachBossId[index];
    }

    /**落日森林配置*/
    private m_ForestBossConfig: { [layer: number]: { [day: number]: GameConfig.ForestBossCfgM } };

    constructor() {
        PinstanceData.m_dataMap = {};
        this.m_pinstanceDiffCaches = {};
        PinstanceData.m_scene2pinstance = {};
        this.m_pinstanceInfoMap = {};
        this._pinstanceRankDic = {};
    }

    onCfgReady() {
        this.setConfigData();
        this.setDiffBonusData();
        this.setGroupPinLevelDropCfg();
        this.setTianMingBangConfig();
        this.setForestBossConfig();
        this.setTeachBossId();

        this.tianMingBangRankPreviewConfigs = G.Cfgmgr.getCfg('data/JJCRankRewardConfigM.json') as GameConfig.JJCRankRewardConfigM[];
        //this.tianMingBangMaxRankRewardConfigs = G.Cfgmgr.getCfg('data/ArenaMaxRankRewardCfgM.json') as GameConfig.ArenaMaxRankRewardCfgM[];
        //个人Boss
        this.privateBossConfigs = G.Cfgmgr.getCfg('data/PrivatBossCfgM.json') as GameConfig.PrivatBossCfgM[];
        for (let cfg of this.privateBossConfigs) {
            for (let i: number = cfg.m_iItemID.length - 1; i >= 0; i--) {
                if (cfg.m_iItemID[i] <= 0) {
                    cfg.m_iItemID.splice(i);
                }
            }
        }
        PinstanceData.QiangHuaFuBenMaxLv = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WST).length;
        PinstanceData.WuYuanFuBenMaxLv = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WYFB).length;
    }

    private setConfigData(): void {
        let configs: GameConfig.PinstanceConfigM[] = G.Cfgmgr.getCfg('data/PinstanceConfigM.json') as GameConfig.PinstanceConfigM[];
        for (let config of configs) {
            if (config.m_iPinstanceID == 0) // 过滤掉无用数据
                continue;

            PinstanceData.m_dataMap[config.m_iPinstanceID] = config;

            if (config.m_ucSceneNumber > 0) {
                let pList: number[];
                for (let sceneId of config.m_aiSceneID) {
                    if (sceneId > 0) {
                        pList = PinstanceData.m_scene2pinstance[sceneId];
                        if (null == pList) {
                            PinstanceData.m_scene2pinstance[sceneId] = pList = new Array<number>();
                        }
                        pList.push(config.m_iPinstanceID);
                    }
                }
            }
        }
    }

    static getPinstancesBySceneId(sceneID: number): number[] {
        return PinstanceData.m_scene2pinstance[sceneID];
    }

    static getConfigByID(id: number): GameConfig.PinstanceConfigM {
        return PinstanceData.m_dataMap[id];
    }
    private setTianMingBangConfig(): void {
        let cfgs: GameConfig.ArenaMaxRankRewardCfgM[] = G.Cfgmgr.getCfg("data/ArenaMaxRankRewardCfgM.json") as GameConfig.ArenaMaxRankRewardCfgM[];
        for (let cfg of cfgs) {
            this.tianMingBangMaxRankRewardConfigs.push(cfg);
        }
        this.tianMingBangMaxRankRewardConfigs.sort(this.sortTianMingBangConfig);
    }
    private sortTianMingBangConfig(a: GameConfig.ArenaMaxRankRewardCfgM, b: GameConfig.ArenaMaxRankRewardCfgM) {
        return a.m_iHighRank - b.m_iHighRank;
    }
    getTianMingBangConfigByIndex(index: number): GameConfig.ArenaMaxRankRewardCfgM {
        return this.tianMingBangMaxRankRewardConfigs[index];
    }
    /**
     * 获取所有限次副本的配置。
     * @param result 你可以提供用于存储结果的数组，该数组中的原有数据将全部清空。
     * @return
     *
     */
    static getAllLmittedPinstances(result: GameConfig.PinstanceConfigM[]): GameConfig.PinstanceConfigM[] {
        if (null == result) {
            result = new Array<GameConfig.PinstanceConfigM>();
        }
        else {
            result.length = 0;
        }

        for (let pidKey in PinstanceData.m_dataMap) {
            let pinstanceConfig = PinstanceData.m_dataMap[pidKey];
            if (pinstanceConfig.m_ucEnterTimes > 0) {
                result.push(pinstanceConfig);
            }
        }

        return result;
    }

    ///////////////////////////////////// 副本难度 /////////////////////////////////////

    private setDiffBonusData(): void {
        let configs: GameConfig.PinstanceDiffBonusM[] = G.Cfgmgr.getCfg('data/PinstanceDiffBonusM.json') as GameConfig.PinstanceDiffBonusM[];
        PinstanceData.m_diffConfigMap = {};
        let idList: GameConfig.PinstanceDiffBonusM[];
        for (let config of configs) {
            // 先过滤掉无效bonus
            for (let i: number = config.m_stDailyBonus.length - 1; i >= 0; i--) {
                if (config.m_stDailyBonus[i].m_iThingId <= 0) {
                    config.m_stDailyBonus.splice(i, 1);
                }
            }
            for (let i: number = config.m_stLifeBonus.length - 1; i >= 0; i--) {
                if (config.m_stLifeBonus[i].m_iThingId <= 0) {
                    config.m_stLifeBonus.splice(i, 1);
                }
            }
            idList = PinstanceData.m_diffConfigMap[config.m_iID];
            if (null == idList) {
                PinstanceData.m_diffConfigMap[config.m_iID] = idList = new Array<GameConfig.PinstanceDiffBonusM>();
            }
            idList.push(config);
        }
        // 再进行排序
        for (let pidKey in PinstanceData.m_diffConfigMap) {
            idList = PinstanceData.m_diffConfigMap[pidKey];
            idList.sort(this._sortDiffBonusConfig);
        }
    }

    private _sortDiffBonusConfig(a: GameConfig.PinstanceDiffBonusM, b: GameConfig.PinstanceDiffBonusM): number {
        return a.m_iDiff - b.m_iDiff;
    }

    /**
     * 获取指定副本的难度配置。
     * @param pinstanceID
     * @return
     *
     */
    static getDiffBonusConfigs(pinstanceID: number): GameConfig.PinstanceDiffBonusM[] {
        return PinstanceData.m_diffConfigMap[pinstanceID];
    }

    static getDiffBonusData(pinstanceID: number, difficulty: number): GameConfig.PinstanceDiffBonusM {
        let idList: GameConfig.PinstanceDiffBonusM[] = PinstanceData.m_diffConfigMap[pinstanceID];
        if (null == idList) {
            return null;
        }
        for (let config of idList) {
            if (config.m_iDiff == difficulty) {
                return config;
            }
        }

        return null;
    }

    /**
     * 确定指定副本是否有难度奖励。
     * @param pinstanceID
     * @return
     *
     */
    getCrtDiffBonus(): GameConfig.PinstanceDiffBonusM {
        let crtPid: number = G.DataMgr.sceneData.curPinstanceID;
        let pinstanceDiffConfig: GameConfig.PinstanceDiffBonusM;
        let layer: number = 0;
        if (crtPid > 0) {
            /* if (Macros.PINSTANCE_ID_QIJINGBAMAI == crtPid) {
                // 奇经八脉
                layer = this.crtChongmaiLayer;
            }
            else { */
            let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(crtPid);
            if (pinstanceConfig.m_ucDifficulty) {
                layer = this.crtPinstanceDiff;
            }
            else {
                // 镇妖塔等
                layer = this.crtPinstanceLayer;
            }
            // }
            pinstanceDiffConfig = PinstanceData.getDiffBonusData(crtPid, layer);
        }

        return pinstanceDiffConfig;
    }
    /**
     * 
     */
    private hasGuide(response: Protocol.PinstanceHomeResponse): void {
        if (response.m_iPinID == Macros.PINSTANCE_ID_SXZL) {
            let level = response.m_stValue.m_stListRsp.m_uiCurLevel;
            if (level == 5 || level == 15 || level == 30 || level == 45) {//这些层数有引导
                //不开界面
                this.isOpenSXZL_Panel = false;
            } else {
                this.isOpenSXZL_Panel = true;
            }
        } else if (response.m_iPinID == Macros.PINSTANCE_ID_SHNS) {
            if (response.m_stValue.m_stListRsp.m_uiCurLevel >= 10) {
                this.isGuilder = false;
            }
        }
    }

    /**
     * 更新副本信息。
     * @param response
     *
     */
    updatePinstanceHome(response: Protocol.PinstanceHomeResponse): void {
        let info: Protocol.ListPinHomeRsp;
        if (Macros.PINHOME_LIST == response.m_usType) {
            this.hasGuide(response);
            this.m_pinstanceInfoMap[response.m_iPinID] = response.m_stValue.m_stListRsp;
            this.checkPinstanceCanGetCount(response.m_iPinID);
            //多人boss需要弹提示
            if (response.m_iPinID == Macros.PINSTANCE_ID_PRIVATE_BOSS) {
                if (G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_MULTIPLAYER_BOSS) {
                    if (response.m_stValue.m_stListRsp.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount <= 0) {
                        let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, G.DataMgr.heroData.curVipLevel);
                        let leftTime = extraTime - response.m_stValue.m_stListRsp.m_stPinExtraInfo.m_stPrivateBossList.m_ucMultiBuyRefreshTimes;
                        let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_VALUE, G.DataMgr.heroData.curVipLevel);
                        G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, cost, leftTime, (state: MessageBoxConst = 0) => {
                            if (MessageBoxConst.yes == state) {
                                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_BUY_MUlTIBOSS_REFRESH_TIMES, Macros.PINSTANCE_ID_PRIVATE_BOSS, null, 0));
                            }
                        },null,true);
                    }
                }
            }
        }
        else if (Macros.PINHOME_LIST_ALL == response.m_usType) {
            this.updataAllPinstanceHome(response.m_stValue.m_stListAllRsp);
        }
        else if (Macros.PINHOME_RESET == response.m_usType) {
            info = this.getPinstanceInfo(response.m_iPinID);
            if (null != info) {
                info.m_ucResetNum = response.m_stValue.m_iResetRsp;
                info.m_uiCurLevel = 0;
                info.m_uiIsDayFinish = 0;
                if (Macros.PINSTANCE_ID_WYFB == response.m_iPinID) {
                    let ds = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucDayStatus;
                    for (let i = ds.length - 1; i >= 0; i--) {
                        ds[i] = 0;
                    }
                }
            }
            //剧情副本,2个副本组
            if (Macros.PINSTANCE_ID_JDYJ == response.m_iPinID) {
                let info2 = this.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ_2);
                if (info2 != null) {
                    info2.m_ucResetNum = response.m_stValue.m_iResetRsp;
                    info2.m_uiCurLevel = 0;
                    info2.m_uiIsDayFinish = 0;
                }
            }
            // 同时已重置次数就是已进入次数，同步更新一下
            G.DataMgr.systemData.updateOnePinstanceTime(response.m_iPinID, response.m_stValue.m_iResetRsp);
        }
        else if (Macros.PINHOME_GETGIFT == response.m_usType) {
            // 领完奖励
            info = this.getPinstanceInfo(response.m_iPinID);
            if (null != info) {
                // 使用life finish字段记录领取奖励标记
                let bitPos: number = 0;
                if (Macros.PINSTANCE_ID_SHNS == response.m_iPinID) {
                    // 守护女神
                    bitPos = 1 << Math.floor(response.m_stValue.m_iGetGiftLvRsp / PinstanceData.ShouHuNvShenGiftPerLv);
                }
                else {
                    if (defines.has('_DEBUG')) {
                        uts.assert(false, '不支持的副本：' + response.m_iPinID);
                    }
                }
                info.m_uiIsLifeFinish |= bitPos;
            }
            this.checkShncCount();
        }
        else if (Macros.PINHOME_GET_RANKINFO == response.m_usType) {
            this._pinstanceRankDic[response.m_iPinID] = response.m_stValue.m_stRankPinRsp;
            //Mgr.ins.dispatcher.this.dispatchEvent(Events.updatePinstanceRankInfo);
        }
        else if (Macros.PINHOME_GET_RANKTIMEINFO == response.m_usType) {
            this.m_jstzData = response.m_stValue.m_stPinTimeRankRsp;
            G.DataMgr.taskRecommendData.onJixiantiaozhanChange();
        }
        else if (Macros.PINHOME_RANKTIME_REFRESH == response.m_usType) {
            this.m_jstzData = response.m_stValue.m_stReFreshPinTimeRsp;
            G.DataMgr.taskRecommendData.onJixiantiaozhanChange();
        } else if (Macros.PINHOME_VIP_BUY_TIMES == response.m_usType) {
            uts.log('huiying===');
            this.updatePinstanceHomeVipBuyInfo(response.m_iPinID, response.m_stValue.m_stVIPBuyRsp);
        } else if (Macros.PINHOME_REFRESH_PRIVATE_BOSS == response.m_usType) {
            this.updatePinstanceHomeVipBuyInfo(response.m_iPinID, response.m_stValue.m_stFreshBossRsp);
        }
        else if (Macros.PINHOME_BUY_MUlTIBOSS_REFRESH_TIMES == response.m_usType) {
            let map = this.getPinstanceInfo(response.m_iPinID);
            if (map) {
                map.m_stPinExtraInfo.m_stPrivateBossList = response.m_stValue.m_stBuyMultiBossTimesRsp.m_stPinExtraInfo.m_stPrivateBossList;
            }
        }
        //else if (Macros.PINHOME_FSD_LIST == response.m_usType) {
        //    this.fsdData = response.m_stValue.m_stFSDListRsp;
        //}
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '不支持的类型：' + response.m_usType);
            }
        }
    }
    updatePinstanceHomeVipBuyInfo(pinID: number, info: Protocol.DBBossCountInfo) {
        let map = this.getPinstanceInfo(pinID);
        if (!map)
            return;
        let index = this.getBinarySerach(map.m_stPinExtraInfo.m_stPrivateBossList.m_ucCount,
            map.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo, info.m_iNandu);
        if (index >= 0) {
            let bossInfo = map.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo[index];
            bossInfo.m_iNandu = info.m_iNandu;
            bossInfo.m_ucFightCount = info.m_ucFightCount;
            bossInfo.m_ucVipBuyTimes = info.m_ucVipBuyTimes;
            bossInfo.m_uiBossRefreshTime = info.m_uiBossRefreshTime;
        }
    }
    getBinarySerach(count = 0, array: Protocol.DBBossCountInfo[], key: number) {
        let left = 0;
        let right = count;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (array[mid].m_iNandu == key) {
                return mid;
            }
            else if (array[mid].m_iNandu < key) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return -1;
    }
    /**检查副本可领取数量*/
    checkPinstanceCanGetCount(pinID: number): void {
        switch (pinID) {
            case Macros.PINSTANCE_ID_SHNS:
                this.checkShncCount();
                break;
            default:
        }
    }

    /**检查神凰秘境数量*/
    private checkShncCount(): void {
        //let shnsCanGetIndex: number = this.getShnsCanGetIndex();
        //let infomationById: KeyWordValue = KeyWord.getDesc(KeyWord.GROUP_OTHER_FUNCTION, KeyWord.OTHER_FUNCTION_SHMJ);
        //let response: InformResponse = InformResponse.getOneVo();
        //response.tipMsg = uts.format('点击后领取{0}终生奖励', infomationById.cname);
        //response.type = InformType.SHOU_HU_NV_SHEN_CAN_GET_REWARD;
        //response.clickMsg = EventTypes.OPEN_SHOU_HU_NV_SHEN_PANEL;
        //if (shnsCanGetIndex > -1) {
        //    response.num = 1;
        //}
        //else {
        //    response.num = 0;
        //}
        //response.repeat = false;
        //response.showOrClose();
    }

    updataAllPinstanceHome(rsp: Protocol.PinHomeListAllRsp): void {

        for (let pinfo of rsp.m_stPinInfo) {
            this.m_pinstanceInfoMap[pinfo.m_iPinId] = pinfo;
            this.checkPinstanceCanGetCount(pinfo.m_iPinId);
        }
    }

    /**
     * 获取副本信息。
     * @param id
     * @return
     *
     */
    getPinstanceInfo(id: number): Protocol.ListPinHomeRsp {
        return this.m_pinstanceInfoMap[id];
    }

    /**
     * 获取副本排行信息。
     * @param id
     * @return
     *
     */
    getPinstanceRankInfo(id: number): Protocol.RankPinInfo {
        return this._pinstanceRankDic[id];
    }

    /**
     * 更新副本难度缓存
     * @param pinstanceID
     * @param diff
     * @param score
     * @param maxScore
     *
     */
    updatePinstanceDiff(pinstanceID: number, diff: number, score: number, maxScore: number, finishCnt: number): void {
        let data: PinstanceDiffCache = this.m_pinstanceDiffCaches[pinstanceID];
        if (data == null) {
            this.m_pinstanceDiffCaches[pinstanceID] = data = new PinstanceDiffCache();
        }

        data.pid = pinstanceID;
        data.diff = diff;
        data.score = score;
        data.maxScore = maxScore;
        data.finishCnt = finishCnt;
    }

    /**
     * 获取副本难度缓存
     * @param pinstanceID
     * @return
     *
     */
    getPinstanceDiff(pinstanceID: number): PinstanceDiffCache {
        return this.m_pinstanceDiffCaches[pinstanceID];
    }

    /**
     * 检查副本静态条件，包括宗门、国家、等级、VIP等级等限制，不包含其他动态限制，比如副本剩余次数。
     * 此接口不可擅动，请示teppei先。
     * @param pinstanceID 副本ID。
     * @param needPromp 是否提示。
     * @return
     *
     */
    checkPinstanceStaticCondition(pinstanceID: number, diff: number, needPromp: boolean): boolean {
        let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pinstanceID);
        if (!pinstanceConfig) {
            return false;
        }
        // 检查宗门

        // 检查VIP
        //if (pinstanceConfig.m_ucVIPLevel > 0 && G.DataMgr.heroData.curVipMonthLevel < pinstanceConfig.m_ucVIPLevel)
        if (pinstanceConfig.m_ucVIPLevel > 0 && G.DataMgr.heroData.getPrivilegeState(pinstanceConfig.m_ucVIPLevel) < 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('达到{0}才能进入{1}', TextFieldUtil.getPrivilegeText(pinstanceConfig.m_ucVIPLevel), pinstanceConfig.m_szName));
            }
            return false;
        }

        // 检查等级下限
        let minLv: number = pinstanceConfig.m_iLevelLow;
        if (diff > 0 && pinstanceID != Macros.PINSTANCE_ID_DIBANG && pinstanceID != Macros.PINSTANCE_ID_TIANBANG && pinstanceID != Macros.PINSTANCE_ID_PRIVATE_BOSS
            && pinstanceID != PinstanceData.PersonBossGuidePinId && pinstanceID != Macros.PINSTANCE_ID_VIP) {
            // 指定了难度，从难度表检查等级
            let diffConf: GameConfig.PinstanceDiffBonusM = PinstanceData.getDiffBonusData(pinstanceID, diff);
            if (diffConf.m_iOpenLevel > minLv) {
                minLv = diffConf.m_iOpenLevel;
            }
        }
        if (minLv > 0 && minLv > G.DataMgr.heroData.level) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('达到{0}级才能进入{1}', minLv, pinstanceConfig.m_szName));
            }
            return false;
        }

        // 检查等级上限
        if (pinstanceConfig.m_iLevelHigh > 0 && G.DataMgr.heroData.level > pinstanceConfig.m_iLevelHigh) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('您已超过{0}级，不能进入{1}', pinstanceConfig.m_iLevelHigh, pinstanceConfig.m_szName));
            }
            return false;
        }

        return true;
    }

    /** 获取急速可挑战的次数 */
    getJstzCount(): number {
        let isOpen: boolean = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JSTZ);
        if (!isOpen) {
            return 0;
        }
        return this.jstzData ? this.jstzData.m_iMyPKCount : 0;
    }

    getFirstCanDoFaQiId(): number {
        //if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_FSD) && this.fsdData != null) {
        //    for (let i = 0; i < PinstanceIDUtil.FaShenDianNum; i++) {
        //        let maxProgress = this.fsdData.m_iMaxLevel;
        //        let progress = this.fsdData.m_stFSDPinInfo[i].m_ucLevel;
        //        let pid = Macros.PINSTANCE_ID_FSD_BASE + i;
        //        if (progress == 0) {
        //            if (i * PinstanceData.FaShenDianLayersPerId <= maxProgress) {
        //                let diffConfig = PinstanceData.getDiffBonusData(pid, PinstanceData.FaShenDianLayersPerId);
        //                if (diffConfig.m_iOpenLevel <= G.DataMgr.heroData.level) {
        //                    return pid;
        //                }
        //            }
        //        }
        //        else if (progress < PinstanceData.FaShenDianLayersPerId) {
        //            return pid;
        //        }
        //    }
        //}
        return 0;
    }

    getTeQuanFuBenSuggestDiff(): GameConfig.PinstanceDiffBonusM {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZRJT)) {
            return null;
        }
        let myLv = G.DataMgr.heroData.level;
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        let tabCnt = pids.length;
        for (let i = 0; i < tabCnt; i++) {
            // 先判断有没有对应的特权哦
            if (G.DataMgr.heroData.getPrivilegeState(i + 1) >= 0) {
                let pid = pids[i];
                let info = this.getPinstanceInfo(pid);
                if (null != info) {
                    let diffCfgs = PinstanceData.getDiffBonusConfigs(pid);
                    let len = diffCfgs.length;
                    let bitPos = 1;
                    for (let i = 0; i < len; i++) {
                        bitPos = bitPos << 1;
                        let cfg = diffCfgs[i];
                        if ((info.m_uiIsDayFinish & bitPos) == 0 && myLv >= cfg.m_iOpenLevel) {
                            // 当日没打过
                            return cfg;
                        }
                    }
                }
            }
        }

        return null;
    }


    /**获取组队副本,传承之路次数*/
    getCCZLCount(idList: number[]): number {
        let funName: number = 0;
        if (PinstanceIDUtil.ShenMuChuanChengIDs == idList) {
            funName = KeyWord.OTHER_FUNCTION_CCZL;
        }
        else if (PinstanceIDUtil.ZuDuiFuBenIDs == idList) {
            funName = KeyWord.OTHER_FUNCTION_ZDFB;
        }
        let isOpen: boolean = G.DataMgr.funcLimitData.isFuncEntranceVisible(funName);
        if (!isOpen) {
            return 0;
        }
        let times: number = 0;
        for (let i = 0; i < idList.length; i++) {
            let config = PinstanceData.getConfigByID(idList[i]);
            if (config.m_ucEnterTimes > 0 && config.m_iLevelLow <= G.DataMgr.heroData.level) {
                let leftTime = G.DataMgr.systemData.getPinstanceLeftTimes(config);
                if (leftTime > 0) {
                    times++;
                }
            }
        }
        return times;
    }


    /**经验副本是否可以挑战*/
    canDoJingYanFuBen(): boolean {
        return this.canDoTowerKindPinstance(Macros.PINSTANCE_ID_SHNS, KeyWord.OTHER_FUNCTION_SHMJ, KeyWord.VIP_PARA_WST_EXT_NUM, false);
    }

    /**
     * 获取经验副本第一个可以领取的阶段礼包的索引，-1表不可领取
     */
    getJingYanFuBenStepBoxIdx(): number {
        // 刷新副本列表
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return -1;
        }
        let diffCfgs: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);
        let len = diffCfgs.length / PinstanceData.ShouHuNvShenGiftPerLv;
        for (let i = 0; i < len; i++) {
            if (info.m_uiMaxLevel >= (i + 1) * PinstanceData.ShouHuNvShenGiftPerLv && !MathUtil.checkPosIsReach(i + 1, info.m_uiIsLifeFinish)) {
                return i;
            }
        }
        return -1;
    }

    /**强化副本是否可以挑战*/
    canDoQiangHuaFuBen(): boolean {
        return this.canDoTowerKindPinstance(Macros.PINSTANCE_ID_WST, KeyWord.OTHER_FUNCTION_DZZL, KeyWord.VIP_PARA_WST_EXT_NUM, false);
    }

    private canDoTowerKindPinstance(pinstanceId: number, funcId: number, vipPara: number, considerReset: boolean): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(funcId)) {
            return false;
        }
        let info: Protocol.ListPinHomeRsp = this.getPinstanceInfo(pinstanceId);
        if (null == info) {
            return false;
        }

        let diffCfgs = PinstanceData.getDiffBonusConfigs(pinstanceId);
        if (info.m_uiCurLevel < diffCfgs.length) {
            let diffCfg = diffCfgs[info.m_uiCurLevel];
            if (G.DataMgr.heroData.level >= diffCfg.m_iOpenLevel && (diffCfg.m_iOpenDay == 0 || G.SyncTime.getDateAfterStartServer() >= diffCfg.m_iOpenDay)) {
                return true;
            }
        }

        if (considerReset && info.m_uiCurLevel > 0) {
            // 检查是否可重置
            return this.getPinstanceLeftReset(pinstanceId, vipPara) > 0;
        }
        return false;
    }

    /**剧情副本是否可以挑战*/
    canDoJuQingFuBen(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JQFB)) {
            return false;
        }
        let info: Protocol.ListPinHomeRsp = this.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ);
        if (null == info) {
            return false;
        }
        let count: number = 0;
        let level: number = G.DataMgr.heroData.level;
        let dataList: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_JDYJ);
        let bitPos: number = 1;
        let canReset = false;
        for (let i: number = 0; i < dataList.length; i++) {
            let cfg: GameConfig.PinstanceDiffBonusM = dataList[i];
            bitPos = bitPos << 1;
            if (Boolean(info.m_uiIsDayFinish & bitPos)) {
                // 今日已打
                canReset = true;
            } else if (cfg.m_iOpenLevel <= level) {
                // 可以打
                return true;
            }
        }

        //return canReset && info.m_ucResetNum == 0;
        return false;
    }

    /** 排行信息列表 */
    get ymzcRankInfo(): Protocol.PinRankYMZCRsp {
        return this._rankInfo;
    }

    set ymzcRankInfo(value: Protocol.PinRankYMZCRsp) {
        this._rankInfo = value;
    }

    getYmzcHeroRankInfo(): number {
        let dataList: Protocol.PinRankYMZCOneInfo[] = this._rankInfo.m_stPinInfo;
        let roleID: Protocol.RoleID = G.DataMgr.heroData.roleID;
        for (let i: number = 0; i < dataList.length; i++) {
            let value: Protocol.PinRankYMZCOneInfo = dataList[i];
            if (value.m_stRoleID.m_uiUin == roleID.m_uiUin)
                return i + 1;
        }

        return -1;
    }

    /**
     * 是否完成副本的层数
     * @param id
     * @param layer		层数
     * @return 完成返回true
     *
     */
    isCompleteStage(id: number): number {
        let info: Protocol.ListPinHomeRsp = this.getPinstanceInfo(id);
        if (null == info)
            return 0;

        return info.m_uiCurLevel;
    }

    /**神凰秘境通关奖励列表*/
    get shnsListData(): ShouHuNvShenItemData[] {
        if (!this._shnsListData) {
            // 构造数据
            let m_diffConfigs: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);


            if (defines.has('DEVELOP')) {
                uts.assert(0 == m_diffConfigs.length % PinstanceData.ShouHuNvShenGiftPerLv, '守护女神难度数量必须是' + PinstanceData.ShouHuNvShenGiftPerLv + '的倍数！');
            }
            let len: number = m_diffConfigs.length / PinstanceData.ShouHuNvShenGiftPerLv;
            this._shnsListData = new Array<ShouHuNvShenItemData>(len);
            let itemData: ShouHuNvShenItemData;
            let diffIndex: number = 0;
            for (let i: number = 0; i < len; i++) {
                diffIndex = (i + 1) * PinstanceData.ShouHuNvShenGiftPerLv - 1;
                if (defines.has('_DEBUG')) {
                    uts.assert(m_diffConfigs[diffIndex].m_stLifeBonus.length > 0, '马勒戈壁好好检查婊！');
                }
                this._shnsListData[i] = itemData = new ShouHuNvShenItemData();
                itemData.diffConfig = m_diffConfigs[diffIndex];
            }
        }
        return this._shnsListData;
    }

    /**获取神凰秘境可领取INDEX*/
    getShnsCanGetIndex(): number {
        let gotoIndex: number = -1;
        // 刷新副本列表
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return gotoIndex;
        }
        let listData: ShouHuNvShenItemData[] = this.shnsListData as ShouHuNvShenItemData[];
        let len: number = listData.length;
        let itemData: ShouHuNvShenItemData;
        let layerPos: number, bitPos: number = 0;

        for (let i: number = 0; i < len; i++) {
            itemData = listData[i];
            layerPos = (i + 1) * PinstanceData.ShouHuNvShenGiftPerLv;
            itemData.isLifePassed = info.m_uiMaxLevel >= layerPos;
            itemData.isTodayPassed = info.m_uiCurLevel >= layerPos;
            itemData.isGiftDrawn = MathUtil.checkPosIsReach(i + 1, info.m_uiIsLifeFinish);
            if (!itemData.isGiftDrawn && itemData.isLifePassed && gotoIndex < 0) {
                gotoIndex = i;
            }
        }
        return gotoIndex;
    }

    /** 奔跑吧,兄弟 */
    get jstzData(): Protocol.PinTimeRankInfo {
        return this.m_jstzData;
    }

    recordPinstanceEnter(pinstanceId: number) {
        let oldCnt = this.m_enterRecords[pinstanceId];
        if (undefined == oldCnt) {
            oldCnt = 0;
        }
        this.m_enterRecords[pinstanceId] = oldCnt + 1;
    }

    /**
     * 获取本次登录后指定副本的进入次数。
     * @param pinstanceId
     */
    getPinstanceEnterCount(pinstanceId: number): number {
        let cnt = this.m_enterRecords[pinstanceId];
        if (undefined == cnt) {
            return 0;
        }
        return cnt;
    }



    /**
   *  获取剧情副本今日未通关的最低难度
   */
    getJuQingFuBenCanDoCfg(): GameConfig.PinstanceDiffBonusM {
        let cfg = this.getJuQingFuBenCanDoCfgInternal(Macros.PINSTANCE_ID_JDYJ);
        if (null == cfg) {
            cfg = this.getJuQingFuBenCanDoCfgInternal(Macros.PINSTANCE_ID_JDYJ_2);
        }
        return cfg;
    }


    private getJuQingFuBenCanDoCfgInternal(pid: number): GameConfig.PinstanceDiffBonusM {
        let info = this.getPinstanceInfo(pid);
        if (null != info) {
            let bonusConifgs = PinstanceData.getDiffBonusConfigs(pid);
            let len = bonusConifgs.length;

            let myLv = G.DataMgr.heroData.level;
            let bitPos = 1;
            for (let i = 0; i < len; i++) {
                bitPos = bitPos << 1;
                let cfg = bonusConifgs[i];
                if (myLv >= cfg.m_iOpenLevel && 0 == (info.m_uiIsDayFinish & bitPos)) {
                    return cfg;
                }
            }
        }
        return null;
    }



    /**获取强化副本可选择的层数*/
    getCurQiangHuaFuBenLv(): number {
        let info = this.getPinstanceInfo(Macros.PINSTANCE_ID_WST);
        if (null != info) {
            return info.m_uiCurLevel + 1 >= PinstanceData.QiangHuaFuBenMaxLv ? 0 : (info.m_uiCurLevel + 1);
        }
        return 0;
    }

    /**获取伙伴副本可选择的层数*/
    getWuYuanFuBenMinLv(): number {

        //let pinstanceData = G.DataMgr.pinstanceData;
        //let lift = pinstanceData.getWuYuanFuBenDiffState(this.diffConfigs[this.diffConfigs.length - 1].m_iDiff, false);
        //if (lift == 0) return false;

        //if (G.DataMgr.heroData.energy < this.diffConfigs[0].m_iConsumeValue) return false;

        let info = this.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);
        if (null != info) {
            let myLv = G.DataMgr.heroData.level;
            let petData = G.DataMgr.petData;
            let cfgs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WYFB);
            let len = cfgs.length;
            for (let i = 0; i < len; i++) {
                let cfg = cfgs[i];
                if ((0 == cfg.m_iOpenLevel || myLv >= cfg.m_iOpenLevel) &&
                    0 == this.getWuYuanFuBenDiffState(cfg.m_iDiff, true) &&
                    (0 == cfg.m_iPreDiff || this.getWuYuanFuBenDiffState(cfg.m_iPreDiff, true) > 0) &&
                    (0 == cfg.m_iConditionValue || petData.isPetActive(cfg.m_iConditionValue)) &&
                    G.DataMgr.heroData.energy >= cfg.m_iConsumeValue) {
                    return cfg.m_iDiff;
                }
            }
        }
        return 0;
    }

    getWuYuanFuBenResetNum(): number {
        return this.getPinstanceLeftReset(Macros.PINSTANCE_ID_WYFB, KeyWord.VIP_PARA_WYFB_EXT_NUM);
    }

    private getPinstanceLeftReset(pinstanceId: number, vipPara: number): number {
        let info = this.getPinstanceInfo(pinstanceId);
        if (null != info) {
            // 重置次数
            let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
            // 免费次数
            let pconfig = PinstanceData.getConfigByID(pinstanceId);
            let freeTimes = pconfig.m_ucEnterTimes;
            //能够购买次数
            let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(vipPara, curVipLevel);
            let totalTimes = freeTimes + canBuyTimes;
            let leftTimes: number = Math.max(0, totalTimes - info.m_ucResetNum);
            return leftTimes;
        }
        return 0;
    }

    getWuYuanFuBenTodayPassCnt(): number {
        let cnt = 0;
        let info = this.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);
        if (null != info) {
            let cfgs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WYFB);
            let len = cfgs.length;
            for (let i = 0; i < len; i++) {
                let cfg = cfgs[i];
                if (this.getWuYuanFuBenDiffState(cfg.m_iDiff, true) > 0) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    /**
     * 获取指定难度的伙伴副本通关状态，-1表示数据未知，0表示未通关，大于0表示已通关。
     * @param diff
     * @param isToday
     */
    getWuYuanFuBenDiffState(diff: number, isToday: boolean): number {
        let info = this.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);
        if (null != info) {
            let statusArr: number[];
            if (isToday) {
                statusArr = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucDayStatus;
            } else {
                statusArr = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucLifeStatus;
            }
            let index = Math.floor((diff - 1) / 8);
            if (index < statusArr.length) {
                return statusArr[index] & (1 << ((diff - 1) % 8));
            }
        }
        return -1;
    }


    /**
     * 获取玩家今日未首通的最低等级的组队副本id
     */
    getZuDuiFuBenMinID(): number {
        let myLv = G.DataMgr.heroData.level;
        let ids = PinstanceIDUtil.ZuDuiFuBenIDs;
        let cnt = ids.length;
        for (let i: number = 0; i < cnt; i++) {
            let id = ids[i];
            let config = PinstanceData.getConfigByID(id);
            // 等级是否符合
            if (myLv < config.m_iLevelLow) {
                continue;
            }

            let info = this.getPinstanceInfo(config.m_iPinstanceID) as Protocol.ListPinHomeRsp;
            if (null != info && 0 == (info.m_uiIsDayFinish & 2)) {
                return id;
            }
        }
        return 0;
    }

    /**
     * 获取玩家可挑战的最高层的发神殿副本id
     */
    getFaShenDianMaxLv(): number {
        //if (null != this.fsdData) {
        //    let myLv = G.DataMgr.heroData.level;
        //    for (let i = PinstanceIDUtil.FaShenDianNum - 1; i >= 0; i--) {
        //        let id = Macros.PINSTANCE_ID_FSD_BASE + i;

        //        let cfg = PinstanceData.getConfigByID(id);
        //        if (myLv < cfg.m_iLevelLow) {
        //            continue;
        //        }

        //        if (this.fsdData.m_iMaxLevel > i * PinstanceData.FaShenDianLayersPerId) {
        //            return id;
        //        }
        //    }
        //}

        return 0;
    }

    private getCaiLiaoFuBenCanDoCfgInternal(pid: number): GameConfig.PinstanceDiffBonusM {
        let myLv = G.DataMgr.heroData.level;
        let info = this.getPinstanceInfo(pid);
        if (null != info) {
            let diffCfgs = PinstanceData.getDiffBonusConfigs(pid);
            let len = diffCfgs.length;
            let bitPos = 1;
            for (let i = 0; i < len; i++) {
                let cfg = diffCfgs[i];
                if ((info.m_uiIsDayFinish & bitPos) == 0 && myLv >= cfg.m_iOpenLevel) {
                    // 当日没打过
                    return cfg;
                }
                bitPos = bitPos << 1;
            }
        }
        return null;
    }

    /**特权从3开始的*/
    private readonly StartIndex = 3;
    /**
     * 关联vip的 材料副本
     * @param pid
     */
    private getLinkVipCaiLiaoFuBenCanDoCfgInternal(pid: number): GameConfig.PinstanceDiffBonusM {
        let myLv = G.DataMgr.heroData.level;
        let info = this.getPinstanceInfo(pid);
        if (null != info) {
            let diffCfgs = PinstanceData.getDiffBonusConfigs(pid);
            let len = diffCfgs.length;
            let bitPos = 2;
            for (let i = 0; i < len; i++) {
                let cfg = diffCfgs[i];
                if ((info.m_uiIsDayFinish & bitPos) == 0 && myLv >= cfg.m_iOpenLevel && G.DataMgr.vipData.hasBuySpecialPri(VipData.SpecialPriKeys[i])) {
                    // 当日没打过
                    uts.log('i = ' + i + ', info = ' + JSON.stringify(info));
                    return cfg;
                }
                bitPos = bitPos << 1;
            }
        }
        return null;
    }


    /**
    *是否是材料副本
    */
    static isCaiLiaoFuBen(pinstanceId: number): boolean {
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            if (CaiLiaoFuBenPanel.CLFBPinstanceIds[i] == pinstanceId) return true;
        }
        return false;
    }

    /**
     *材料副本子页签是否可以显示
     * @param pinId 副本id
     */
    getCaiLiaoTabCanShow(pinId: number): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(CaiLiaoFuBenPanel.CLFBTypeListKeyWords[CaiLiaoFuBenPanel.CLFBPinstanceIds.indexOf(pinId)])) {
            return false;
        }
        let diffCfgs = PinstanceData.getDiffBonusConfigs(pinId);
        if (diffCfgs == null) return false;
        if (G.DataMgr.heroData.level >= diffCfgs[0].m_iOpenLevel) {
            return true;
        }
        return false;
    }

    /**
     *材料副本子页签是否可以显示
     * @param pinId 副本id
     * @param index 页签索引
     * @param layerCntPerTab 这个也签有多少个
     * @param isLinkVip 是否关联vip 的特殊 有5个
     */
    //getCaiLiaoTabIsAllLimited(pinId: number, index: number, isLinkVip: boolean = false): boolean {
    //    // 刷新副本列表
    //    let layerCntPerTab = PinstanceData.CaiLiaoFuBenCntPerCeng;
    //    if (isLinkVip) {
    //        layerCntPerTab = PinstanceData.CaiLiaoFuBenCntPerCeng + 1;
    //    }

    //    let diffCfgs = PinstanceData.getDiffBonusConfigs(pinId);
    //    let curCfgs: GameConfig.PinstanceDiffBonusM[] = [];

    //    for (let i = index * layerCntPerTab; i < (index + 1) * layerCntPerTab; i++) {
    //        curCfgs.push(diffCfgs[i]);
    //    }

    //    let info = this.getPinstanceInfo(pinId);
    //    let myLv = G.DataMgr.heroData.level;

    //    let allLimited = true;
    //    for (let i = 0; i < layerCntPerTab; i++) {
    //        let limitedLv = curCfgs[i].m_iOpenLevel > myLv ? curCfgs[i].m_iOpenLevel : 0;
    //        if (limitedLv == 0) {
    //            allLimited = false;
    //        }
    //    }
    //    return allLimited;
    //}

    /**神选之路是否可以挑战*/
    canDoShenXuanZhiLu(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SXZL)) {
            return false;
        }
        let info = this.getPinstanceInfo(Macros.PINSTANCE_ID_SXZL);
        if (null == info) {
            return false;
        }
        let nextCfg = PinstanceData.getDiffBonusData(Macros.PINSTANCE_ID_SXZL, info.m_uiCurLevel + 1);
        if (nextCfg) {
            let fight: number = G.DataMgr.heroData.fight;
            let level: number = G.DataMgr.heroData.level;
            if (level >= nextCfg.m_iOpenLevel && fight >= nextCfg.m_iFightPower) {
                return true;
            }
        }

        return false;
    }

    public getExperienceFBAllExp(): number {
        //每层经验=表格配置基础经验＋Round(角色等级/20)× 300000   一共十层
        let diffConfigs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);

        let all = 0;
        let count = diffConfigs.length;
        for (let i = 0; i < count; i++) {
            let item = diffConfigs[i];
            all += item.m_stDailyBonus[0].m_iThingNum;
        }
        all += Math.floor(G.DataMgr.heroData.level / 20) * 3000000 * count;
        return all;
    }

    /////////////组队副本奖励配置///////////////////////////

    private zuDuiFBDropMapCfgs: { [pinId: number]: { [lv: number]: GameConfig.GroupPinLevelDropCfgM } }
    private setGroupPinLevelDropCfg(): void {
        let configs: GameConfig.GroupPinLevelDropCfgM[] = G.Cfgmgr.getCfg('data/GroupPinLevelDropCfgM.json') as GameConfig.GroupPinLevelDropCfgM[];
        this.zuDuiFBDropMapCfgs = {};
        for (let cfg of configs) {
            if (this.zuDuiFBDropMapCfgs[cfg.m_iPinstanceID] == null) {
                this.zuDuiFBDropMapCfgs[cfg.m_iPinstanceID] = {};
            }
            this.zuDuiFBDropMapCfgs[cfg.m_iPinstanceID][cfg.m_iLevel] = cfg;
        }
    }

    getZuDuiGroupPinLevelDropCfg(pinId: number, lv: number): GameConfig.GroupPinLevelDropCfgM {
        if (this.zuDuiFBDropMapCfgs[pinId])
            return this.zuDuiFBDropMapCfgs[pinId][lv];
        return null;
    }
    /**vip技能体验技能图标是否显示*/
    isVipExperSkillActive(): boolean {
        let status1 = G.DataMgr.pinstanceData.isGuilder;
        let status2 = G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_SHNS;
        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        cfg.m_ucForbidden = (!status1 || !status2) ? 1 : 0;

        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return false;
        }
        let status3 = info.m_uiCurLevel < 10;

        let status4 = cfg.completed == 1;
        let status5 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        //let status6 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);

        let isActive: boolean = (status1 && status3 && status2 && status4 && !(status5 >= 0 /*|| status6 >= 0*/));
        //分两步判断是因为才登陆时可能没有经验副本信息
        cfg.m_ucForbidden = (cfg.m_ucForbidden == 1 || !status3) ? 1 : 0;

        return isActive;
    }


    private setForestBossConfig(): void {
        let data: GameConfig.ForestBossCfgM[] = G.Cfgmgr.getCfg('data/ForestBossCfgM.json') as GameConfig.ForestBossCfgM[];
        this.m_ForestBossConfig = {};
        for (let config of data) {
            if (this.m_ForestBossConfig[config.m_iID] == null) {
                this.m_ForestBossConfig[config.m_iID] = {};
            }

            this.m_ForestBossConfig[config.m_iID][config.m_iStartDay] = config;
        }
    }
    getForestBossConfig(layer: number, day: number): GameConfig.ForestBossCfgM {
        let data = this.m_ForestBossConfig[layer];
        if (data) {
            return data[day];
        }
        else {
            return null;
        }
    }

    updateForestBossData(m_stForestBossActOpenRsp: Protocol.ForestBossActOpenRsp) {
        this.m_stForestBossActOpenRsp = m_stForestBossActOpenRsp;
    }
}
