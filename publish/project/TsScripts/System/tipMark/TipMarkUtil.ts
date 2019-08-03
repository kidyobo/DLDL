import { HunLiData } from './../data/hunli/HunLiData';
import { DataManager } from './../data/datamanager';
import { WhjxPlayLogic } from "System/activity/whjx/WhjxPlayLogic";
import { Constants } from "System/constants/Constants";
import { EnumKfhdBossType, EnumThingID, EnumMingJiangState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { WhjxData } from "System/data/activities/WhjxData";
import { FabaoData } from "System/data/FabaoData";
import { PinstanceData } from "System/data/PinstanceData";
import { EnumEquipRule } from "System/data/thing/EnumEquipRule";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { MathUtil } from "System/utils/MathUtil"
import { MonsterData } from 'System/data/MonsterData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { HeroData } from 'System/data/RoleData'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'
import { VipData } from 'System/data/VipData'

export class TipMarkUtil {
    static digong(): boolean {
        let dataMgr = G.DataMgr;
        return dataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_DI_BOSS) &&
            dataMgr.fmtData.getFirstRecommandDiGongBoss() > 0 &&
            (G.DataMgr.thingData.getThingNum(EnumThingID.DiGongMiYao) > 0 || dataMgr.systemData.getPinstanceLeftTimes(PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG)) > 0);
    }


    static bossHome(): boolean {
        let has: boolean = false;
        let maxBossHomeFloor: number = 5;
        for (let i = 1; i <= maxBossHomeFloor; i++) {
            if (G.DataMgr.activityData.getHasBossRefreshByFloor(i)) {
                has = true;
                break;
            }
        }
        return has;
    }
    /**VIPBoss红点*/
    static vipBossTipMark(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_VIP_BOSS)) {
            let vipBossCfgs = G.DataMgr.monsterData.vipBossCfgs;
            let len = vipBossCfgs.length;
            let heroLevel = G.DataMgr.heroData.level;
            for (let i = 0; i < len; i++) {
                if (heroLevel >= vipBossCfgs[i].m_iLevelUp) {//有任一Boss可挑战等级小于等于主角等级
                    let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_VIP_BOSS_NUM, G.DataMgr.heroData.curVipLevel, VipData.getVipPriKeyWord()) + G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_VIP) - G.DataMgr.systemData.getFinishTime(Macros.PINSTANCE_ID_VIP);
                    if (extraTime > 0) {//总挑战次数大于0
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**落日森林红点*/
    static woodsBossTipMark(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WOODS_BOSS)) {
            let hour = G.SyncTime.getDateHour();
            if (hour >= 9 && hour < 23) {//在活动开启的时间段
                let m_stForestBossActOpenRsp = G.DataMgr.pinstanceData.m_stForestBossActOpenRsp;
                if (m_stForestBossActOpenRsp && m_stForestBossActOpenRsp.m_iCollectNumber < G.DataMgr.constData.getValueById(KeyWord.PARAM_FOREST_BOSS_COLLECT_COUNT)) {//有奖励
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 个人Boss小红点显示
     */
    static personalBoss(): boolean {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS)) {
            return false;
        }
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        if (info == null) {
            return;
        }
        let pinstanceData = G.DataMgr.pinstanceData;
        let level = G.DataMgr.heroData.level;
        if (info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount > 0) {
            let len = info.m_stPinExtraInfo.m_stPrivateBossList.m_ucCount;
            for (let i = 0; i < len; i++) {
                let data = pinstanceData.privateBossConfigs[info.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo[i].m_iNandu - 1];
                if ((level >= data.m_iLevel && level <= data.m_iLevelUp && data.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS)) {
                    if (info.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo[i].m_uiBossRefreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000) <= 0)
                        return true;
                }
            }
        } else {
            return false;
        }
    }

    /**
   * 多人Boss小红点显示
   */
    static multipleBoss(): boolean {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS)) {
            return false;
        }
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        if (info == null) {
            return;
        }
        let pinstanceData = G.DataMgr.pinstanceData;
        let level = G.DataMgr.heroData.level;
        if (info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount >= 9) {
            let len = info.m_stPinExtraInfo.m_stPrivateBossList.m_ucCount;
            for (let i = 0; i < len; i++) {
                let data = pinstanceData.privateBossConfigs[info.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo[i].m_iNandu - 1];
                if (data.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
                    if ((level >= data.m_iLevel && level <= data.m_iLevelUp && data.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS)) {
                        if (info.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo[i].m_uiBossRefreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000) <= 0)
                            return true;
                    }
                }
            }
        } else {
            return false;
        }
    }

    static kfhdBoss(): boolean {
        let dataMgr = G.DataMgr;
        let kfhdData = G.DataMgr.kfhdData;
        return dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_KFHD_SJBOSS) &&
            ((G.SyncTime.getDateAfterStartServer() <= Macros.MAX_BOSSACT_OPEN_DAYS && kfhdData.getBossRewardCount(EnumKfhdBossType.world) > 0) ||
                kfhdData.getBossRewardCount(EnumKfhdBossType.fengMoTa) > 0 || kfhdData.getBossRewardCount(EnumKfhdBossType.diGong) > 0);
    }

    static WorldBossTipMark(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDBOSS)) {
            return false;
        }
        let activityData = G.DataMgr.activityData;
        let bossList = activityData.bossList;
        if (bossList == null || bossList == undefined) return false;
        let heroData = G.DataMgr.heroData;
        let length = bossList.m_iBossNum;
        for (let i = 0; i < bossList.m_iBossNum; i++) {
            let info = activityData.getOneBossInfo(bossList.m_astBossList[i].m_iBossID);
            if (info && !info.m_ucIsDead && info.m_iGetScriptCnt == 0) {//有奖励
                let bossLevel: number = MonsterData.getMonsterConfig(bossList.m_astBossList[i].m_iBossID).m_usLevel;
                let heroLevel = heroData.level;
                if (bossLevel <= heroLevel) {
                    return true;
                }
            }
        }
        return false;
    }

    static ancientBoss(): boolean {
        let dataMgr = G.DataMgr;
        let maxnum = G.DataMgr.constData.getValueById(KeyWord.PARAM_XZFM_BOSS_PRIZE_COUNT);
        if (G.DataMgr.monsterData.ancientBossPanelInfo == null) return false;
        let resnum = Math.max(maxnum - G.DataMgr.monsterData.ancientBossPanelInfo.m_ucPrizeCount, 0);
        if (dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM)) {
            if (!MonsterData.isFirstOpenPanel) {
                return true;
            }
            else if (MonsterData.isHasBossRefresh && resnum > 0) {
                return true;
            }
            else if (dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDPAIMAI) && G.DataMgr.runtime.worldPaiMaiShouldTip) {
                return true;
            }
        }
        return false;
        // return (dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM) &&
        //     (!MonsterData.isFirstOpenPanel || (MonsterData.isHasBossRefresh ||
        //         (dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDPAIMAI) &&
        //             G.DataMgr.runtime.worldPaiMaiShouldTip))))
    }

    static mingJiang(): boolean {
        let mingjiangData = G.DataMgr.mingJiangData;
        return G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MINGJIANG) &&
            mingjiangData.getFuncState() == EnumMingJiangState.OPEN &&
            mingjiangData.actRemainTime > 0 &&
            !mingjiangData.isFirstDayJoinGuild() &&
            !mingjiangData.isInCloseTime() &&
            (mingjiangData.hasReward() ||
                mingjiangData.canEnter());
    }

    static tianMingBang(): boolean {
        let dataMgr = G.DataMgr;
        //(dataMgr.heroData.myPPkRemindTimes > 0 || dataMgr.heroData.ppkBuyTimes == 0) || dataMgr.activityData.allrankRewardCont > 0;
        return dataMgr.heroData.myPPkRemindTimes > 0 || dataMgr.activityData.everydayAndRankReward > 0;
    }

    static jiSuTiaoZhan(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JSTZ))
            return G.ActionHandler.isJiSuTiaoZhanTime() && G.DataMgr.pinstanceData.getJstzCount() > 0;
        else
            return false;
    }

    static kuaFuZongMenZhan(): boolean {
        return G.DataMgr.activityData.guildPvpData.isGetReward();
    }

    static KuaFu3V3Reward(): boolean {
        let info = G.DataMgr.kf3v3Data.pvpV3Info;
        let canGetReward = false;
        if (null != info) {
            canGetReward = 1 != info.m_ucSeasonGift;
        }
        return canGetReward;
    }

    static wangHouJiangXiang(): boolean {
        let activityData = G.DataMgr.activityData;
        let panelInfo = activityData.whjxData.panelInfo;
        if (null == panelInfo) {
            return false;
        }

        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG)) {
            return false;
        }

        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_WHJX)) {
            // 周日活动开了，有报名就红点
            if (panelInfo.m_iBuyItemID > 0) {
                let myType = activityData.whjxData.getMyType();
                if (myType == 0) {
                    let myFight = G.DataMgr.heroData.fight;
                    for (let i = 0; i < WhjxPlayLogic.AvatarCnt; i++) {
                        let cfg = activityData.whjxData.getCfgByType(WhjxData.Types[i]);
                        if (myFight >= cfg.m_iFight) {
                            return true;
                        }
                    }
                }
            }
        } else {
            let d = G.SyncTime.serverDate;
            let day = d.getDay();
            if (day == 6 && panelInfo.m_iBuyItemID <= 0) {
                // 周六显示报名截止倒计时
                return true;
            }
        }

        return false;
    }

    static guildDailyGift(): boolean {
        return G.DataMgr.guildData.isDayWelfareCanGet();
    }

    static guildSkillCanStudy(): boolean {
        let skills = G.DataMgr.skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_GUILD, 1);
        let len = skills.length;
        return len > 0;
    }

    static juQingFuBen(): boolean {
        let pinstanceData = G.DataMgr.pinstanceData;
        let d = G.SyncTime.getDateAfterStartServer();
        if (d <= PinstanceData.MaxForcePinstanceDay) {
            return pinstanceData.canDoJuQingFuBen();
        } else {
            return !pinstanceData.everShowJqfb && pinstanceData.canDoJuQingFuBen();
        }
    }

    static qiangHuaFuBen(): boolean {
        let pinstanceData = G.DataMgr.pinstanceData;
        let d = G.SyncTime.getDateAfterStartServer();
        if (d <= PinstanceData.MaxForcePinstanceDay) {
            return pinstanceData.canDoQiangHuaFuBen();
        } else {
            return !pinstanceData.everShowQhfb && pinstanceData.canDoQiangHuaFuBen();
        }
    }

    static jingYanFuBen(): boolean {
        let pinstanceData = G.DataMgr.pinstanceData;
        return /* pinstanceData.getJingYanFuBenStepBoxIdx() >= 0 || */ (/*pinstanceData.getPinstanceEnterCount(Macros.PINSTANCE_ID_SHNS) == 0 && */pinstanceData.canDoJingYanFuBen());
    }

    static zuDuiFuBen(): boolean {
        return G.DataMgr.pinstanceData.getCCZLCount(PinstanceIDUtil.ZuDuiFuBenIDs) > 0;
    }

    static caiLiaoFuBen(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_CLFB)) return false;
        let heroData = G.DataMgr.heroData;
        let heroFight = heroData.fight;
        let heroLv = heroData.level;
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            let pid = CaiLiaoFuBenPanel.CLFBPinstanceIds[i];
            if (!G.DataMgr.pinstanceData.getCaiLiaoTabCanShow(pid)) continue;
            let info = G.DataMgr.pinstanceData.getPinstanceInfo(pid);
            if (info) {
                if (info.m_uiCurLevel < 1) {
                    info.m_uiCurLevel = 1;
                }
                for (let j = 0; j < CaiLiaoFuBenPanel.CLFBFuBenSize; j++) {
                    let diffCfg = PinstanceData.getDiffBonusData(pid, info.m_uiCurLevel + j);
                    if (diffCfg) {
                        if (heroFight >= diffCfg.m_iFightPower && heroLv >= diffCfg.m_iOpenLevel && (info.m_uiIsLifeFinish < diffCfg.m_iDiff || info.m_uiIsDayFinish < diffCfg.m_iDiff)) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    /**神选之路 */
    static shenxuanzhilu(): boolean {
        let pinstanceData = G.DataMgr.pinstanceData;
        return pinstanceData.canDoShenXuanZhiLu();
    }

    static vipFuBen(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZRJT)) return false;

        if (G.DataMgr.pinstanceData.getTeQuanFuBenSuggestDiff() == null) {
            return false;
        }
        return !G.DataMgr.pinstanceData.isHasClickVipBossPanel;
    }

    static mingWenShiLian(): boolean {
        return G.DataMgr.mwslData.canDo();
    }

    static faShenDian(): boolean {
        return G.DataMgr.pinstanceData.getFirstCanDoFaQiId() > 0;
    }

    static wuYuanFuBen(): boolean {
        return G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WYFB) &&
            (G.DataMgr.pinstanceData.getWuYuanFuBenMinLv() > 0/* || G.DataMgr.pinstanceData.getWuYuanFuBenResetNum() > 0*/);
    }

    static sevenDayLogin(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_QTDLJ)) {
            return false;
        }
        let kaifuSignData = G.DataMgr.activityData.kaifuSignData;
        return kaifuSignData.canSign();
    }

    /**
     * 每日目标
     */
    static dailyGoal(day: number): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_DAILY)) {
            return false;
        }
        let kaifuActiveityData = G.DataMgr.kaifuActData;
        return kaifuActiveityData.canGetReward(day);
    }

    static vipReward(): boolean {
        let mainView = G.ViewCacher.mainView;
        //终身第一次，红点引导
        if (G.DataMgr.vipData.isFirstOpen()) {
            mainView.heroInfoCtrl.setVipTipMark(true);
            return true;
        }
        let levels: number[] = [KeyWord.VIPPRI_1, KeyWord.VIPPRI_2, KeyWord.VIPPRI_3];
        let thingIds = [10404011, 10404021, 10404031];
        let isShow: boolean;
        for (let i = 0; i < levels.length; i++) {
            //判断激活卡
            if (G.DataMgr.thingData.getThingNum(thingIds[i]) > 0) {
                isShow = true;
                break;
            }
            let state = G.DataMgr.heroData.getPrivilegeState(levels[i]);
            let isReward = !G.DataMgr.vipData.getVipDailyGiftHasGet(levels[i]);
            if (state >= 0 && isReward == true) {
                isShow = true;
                break;
            } else {
                isShow = false;
            }
        }
        if (isShow == false) {
            isShow = this.getTouziPanelTipMark();
        }
        mainView.heroInfoCtrl.setVipTipMark(isShow);
        return isShow;
    }
    static cjhdljcz(): boolean {
        let data = G.DataMgr.activityData.newYearData;
        return data.iscjhdShowLoginTipMark();

    }

    static dailySign(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_MRQD)) {
            return false;
        }
        let signData = G.DataMgr.activityData.dailySignData;
        //计算今天为该月的第几天
        let todayNumber = signData.getTodayTimeInThisMonth();
        return signData.canSignToday(todayNumber) || signData.canGetReward();
    }

    static onlineGift(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_ZXJL)) {
            return false;
        }
        let onlineData = G.DataMgr.activityData.onlineGiftData;
        return onlineData.canGet();
    }

    static levelGift(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_SJLB)) {
            return false;
        }
        let lvUpGiftData = G.DataMgr.activityData.levelGiftData;
        return lvUpGiftData.canGet();
    }

    static jiZiSongHaoLi(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_KFHD_JZSHL)) {
            return false;
        }
        return G.DataMgr.kfhdData.canGetJiZiSongHaoLi();
    }
    /**
        * 收集兑换
        */
    static collectExchange(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE)) {
            return false;
        }
        return G.DataMgr.activityData.canGetCollectExchange();
    }


    static shouChongTuanGou(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_KFHD_SCTG)) {
            return false;
        }
        return G.DataMgr.kfhdData.canGetShouChongTuanGou();
    }

    static ziYuanZhaoHui(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_ZYZH)) {
            return false;
        }
        let zyzhData = G.DataMgr.zyzhData;
        return zyzhData.canGet();
    }

    static jiHuoMa(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_JHMDH)) {
            return false;
        }
        if (!G.needShowCustomQQ) {
            return false;
        }
        return 0 == (G.DataMgr.systemData.dayOperateBits & Macros.DAY_QQ_SERVICE);
    }


    /**
     * 活跃 - 翅膀
     */
    static shengling(): boolean {
        let zhufuData = G.DataMgr.zhufuData;
        return (zhufuData.checkShengLingCanUp());
    }

    static leiChongFanLi(): boolean {
        return G.DataMgr.leiJiRechargeData.getLjczCount(false) > 0;
    }

    static dailyLeiJiChongZhi(): boolean {
        return G.DataMgr.leiJiRechargeData.getLjczCount(true) > 0;
    }

    static faQi(): boolean {
        return TipMarkUtil.faQiJinJie() || TipMarkUtil.siXiangJinJie() || TipMarkUtil.siXiangTuTeng() || TipMarkUtil.tianZhuCanShowTipMark();
    }

    /**星斗宝库 */
    static startTreasury(): boolean {
        //第一次必有点
        if (!G.DataMgr.starsData.isOpenenStarsPanel()) {
            return true;
        }
        //有免费次数 
        if (G.DataMgr.starsData.isFreeTime()) {
            return true;
        }
        //需要报名
        if (G.DataMgr.starsData.isNeedApply()) {
            return true;
        }
        //仓库
        if (G.DataMgr.starsData.isStoreHaveObj()) {
            return true;
        }
        return false;
    }

    static HunYin(): boolean {
        if (G.DataMgr.heroData.honeyUpCost == 0) {
            return false;
        }
        return G.DataMgr.heroData.honey >= G.DataMgr.heroData.honeyUpCost;
    }


    static faQiJinJie(): boolean {
        let fabaoData = G.DataMgr.fabaoData;
        let thingData = G.DataMgr.thingData

        //获得神器对应的激活卡id
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let faqiId = fabaoData.faqiIdArr[i];
            if (faqiId > 0) {
                let data = fabaoData.getFaqiData(faqiId);
                let id = thingData.getCardIdByShenQiId(faqiId);
                let count = thingData.getThingNumInsensitiveToBind(id);
                if (fabaoData.canFaqiActive(faqiId) || fabaoData.canStrengthOneFaqi(faqiId) || fabaoData.canSkillLevelUpOneFaqi(faqiId) || count > 0 && data.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
                    return true;
                }
            }
        }
        return false;
    }

    static siXiangDouShouChang(): boolean {
        return G.DataMgr.siXiangData.canDoSiXiangDouShouChang();
    }

    static siXiangJinJie(): boolean {
        let siXiangData = G.DataMgr.siXiangData;
        return siXiangData.getCanActivatedShenShouId() > 0 || siXiangData.getCanJinJieShenShouId() > 0;
    }

    static siXiangTuTeng(): boolean {
        return G.DataMgr.siXiangData.getCanDoFaQiPosition() > 0;
    }

    static biWuDaHui(): boolean {
        let kfjdcData = G.DataMgr.kfjdcData;
        return kfjdcData.canGetChampionSupportReward() || kfjdcData.canGetRankReward() || kfjdcData.canDoPri() || kfjdcData.canGetBetReward() || kfjdcData.canDoFnl();
    }
    static isDouHun(): boolean {
        let mobaiCount: boolean[] = [];
        let heroData = G.DataMgr.heroData;
        for (let i = 0; i < 3; i++) {
            let isMoBai: boolean = G.DataMgr.systemData.canMoBai(1 << HeroData.RankMacros[i]);
            if (!isMoBai == true) {
                mobaiCount.push(isMoBai);
            }
            isMoBai = heroData.OperateRecord;
        }
        return mobaiCount.length < 3 ? true : false;
    }
    static guildExplore(): boolean {
        return G.DataMgr.guildData.canDoGuildExplore();
    }

    static guildMonster(): boolean {
        return G.DataMgr.guildData.hasMonster2Feed() || G.DataMgr.guildData.hasReward();
    }
    static hasKfLingDiReward(): boolean {
        return G.DataMgr.kfLingDiData.hasReward();
    }

    static isMohuaZhanzhenOpen(): boolean {
        return G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_MHZZ);
    }

    static petExpedition(): boolean {
        let petExpeditionData = G.DataMgr.petExpeditionData;
        // uts.log(petExpeditionData.isFirstOpen + '  111  ' + petExpeditionData.canDo() + '  2222  ' + (G.DataMgr.pinstanceData.getPinstanceEnterCount(Macros.PINSTANCE_ID_WYYZ) <= 0) + '  33333  ' + petExpeditionData.isHaveGiftCanGet() + '  4444  ' + (G.DataMgr.petData.treasureHuntInfo.m_iBeautyID == 0)+'  5555  ');
        return (petExpeditionData.isFirstOpen && petExpeditionData.canDo() && petExpeditionData.isHavePetAlive() && G.DataMgr.pinstanceData.getPinstanceEnterCount(Macros.PINSTANCE_ID_WYYZ) <= 0) || petExpeditionData.isHaveGiftCanGet();
    }


    static readonly Day = 7;
    static sevenDayLeiChongReward(before7Day: boolean): boolean {
        let hasReward = G.DataMgr.kaifuActData.getCanGetRewardIndex() >= 0;
        //没有可领取的
        if (!hasReward) return false;
        let today = G.SyncTime.getDateAfterStartServer();
        if (before7Day) {
            return today <= this.Day;
        } else {
            return today > this.Day;
        }
    }

    /**单笔充值是否有可以领取的档位*/
    static DanBiChongZhiCanGet() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_DANBICHONGZHI)) return false;
        let infos = G.DataMgr.kaifuActData.danBiCzInfo;
        if (infos == null) return false;
        for (let i = 0; i < infos.m_ucListCnt; i++) {
            let info = infos.m_stList[i];
            let doneCount = info.m_ucDoneCnt > info.m_stCfg.m_ucMax ? info.m_stCfg.m_ucMax : info.m_ucDoneCnt;
            if (info.m_ucRewardCnt < info.m_stCfg.m_ucMax && doneCount > info.m_ucRewardCnt) {
                return true;
            }
        }
        return false;
    }

    /**循环充值是否又可以领取的档位*/
    static XunHuanChongZhiCanGet() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI)) return false;
        let infos = G.DataMgr.kaifuActData.xunHuanCzInfo;
        if (infos == null) return false;
        for (let i = 0; i < infos.m_ucListCnt; i++) {
            let info = infos.m_stList[i];
            let doneCount = Math.floor(infos.m_uiChargeValue / info.m_stCfg.m_uiCondition);
            doneCount = doneCount > info.m_stCfg.m_ucMax ? info.m_stCfg.m_ucMax : doneCount;
            if (info.m_ucRewardCnt < info.m_stCfg.m_ucMax && doneCount > info.m_ucRewardCnt) {
                return true;
            }
        }
        return false;
    }

    /*是否有每日直购礼包可以领取**/
    static MeiRiLiBaoCanGet() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_ZHIGOULIBAO)) return false;

        let info = G.DataMgr.kaifuActData.meiRiLiBaoInfo;
        if (info == null) return false;
        let freeLevel: number = 1;
        if (!MathUtil.checkPosIsReach(freeLevel, info.m_usGetFlag)) {
            return true;
        }
        let maxLevel = 4;
        for (let i = 2; i <= maxLevel; i++) {
            if (MathUtil.checkPosIsReach(i, info.m_usCanFlag) && !MathUtil.checkPosIsReach(i, info.m_usGetFlag)) {
                return true;
            }
        }
        return false;
    }

    static BossZhaoHuan(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_BOSS_SUMMON)) {
            let status = G.DataMgr.activityData.getTabStatue(Macros.ICON_START_ACTIVITY).m_stTabStatusList[Macros.TAB_STATUS_16];
            return status > 0 && G.DataMgr.activityData.BOSSZhanHuanData.isWarn();
        }

        return false;
    }


    static TaoZhuangTypes: number[] = [KeyWord.SLOT_SUIT_TYPE_1, KeyWord.SLOT_SUIT_TYPE_2];
    /**
     * 凡仙是否可以激活
     * @param type
     */
    static fanXianTaoCanActive(type: number) {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return false;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            if (G.DataMgr.equipStrengthenData.getOneEquipSlotSuitCanActive(dataList[i], type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 创世套装是否可以升级
     * @param type
     */
    static shengLianCanUpLv() {
        let canUp = false;
        for (let i = 0; i < TipMarkUtil.TaoZhuangTypes.length; i++) {
            canUp = G.DataMgr.equipStrengthenData.getEuipSlotSuitCanUpLv(TipMarkUtil.TaoZhuangTypes[i]);
            if (canUp) {
                break;
            }
        }
        return canUp;
    }

    /**称号是否可以培养 */
    static chengHao(): boolean {
        return G.DataMgr.titleData.canPeiYangTitles();
    }

    /**时装强化 */
    static shiZhuangQHTip() {
        let allDressId = G.DataMgr.thingData.getAllDressImgFullID();
        for (let i = 0; i < allDressId.length; i++) {
            let dressId = allDressId[i];
            if (TipMarkUtil.oneShiZhuangCanQH(dressId)) {
                return dressId;
            }
        }
        return 0;
    }

    /**
     * 时装变颜色
     * 一个时装是否可以强化
     * @param dressId
     */
    static oneShiZhuangCanQH(dressId) {
        let heroData = G.DataMgr.heroData;
        let thingData = G.DataMgr.thingData;
        if (heroData.getOneDressIsActive(dressId)) {
            let nextConfig = thingData.getDressImageQHCfgs(Math.floor(dressId / 100), heroData.getOneDressLv(dressId) + 1);
            if (nextConfig) {
                let has = G.DataMgr.thingData.getThingNum(nextConfig.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            }
            if (nextConfig && G.DataMgr.thingData.getThingNum(nextConfig.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= nextConfig.m_iConsumNum) {
                return true;
            }
        }
        return false;
    }

    /**
     * 一个特殊时装是否可以强化
     * @param cfg
     * @param id
     */
    static oneSpecialCanQH(cfg: GameConfig.DressImageConfigM): boolean {
        for (let i = 0; i < 4; i++) {
            let currModeId: number = (cfg.m_stModel.length > 0 && cfg.m_stModel[i].m_iID > 0 ? cfg.m_uiImageId : 0);
            let dressItem: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(currModeId);

            if (cfg != null && dressItem != null && dressItem.m_uiTimeOut <= 0 && cfg.m_uiAddNum != 0 && dressItem.m_uiAddNum < cfg.m_uiAddNum && G.DataMgr.thingData.getThingNum(cfg.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) > 0) {

                return true;
            } else {
                return false;
            }
        }
    }

    static basicSkill(): boolean {
        let skills = G.DataMgr.skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_NQ, 1);
        if (skills.length > 0) {
            return true;
        }
        skills = G.DataMgr.skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_BD, 1);
        return skills.length > 0;
    }

    static jiBanSkill(): boolean {
        let skills = G.DataMgr.skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_FETTER, 1);
        return skills.length > 0;
    }

    static yuanBaoFanBeiTipMark() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_YUANBAOFANBEI)) {
            return false;
        }
        return G.DataMgr.activityData.getYuanBaoFanBeiRewardValue > 0;
    }

    static shieldGod(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_SHIELDGOD)) {
            return false;
        }
        let data = G.DataMgr.shieldGodData;
        for (let id of data.ids) {
            if (data.canActivate(id) || data.canUpLevel(id)) {
                return true;
            }
        }
        return false;
    }


    static vipZhuanShuTipMark() {
        // return G.DataMgr.kaifuActData.vipZhuanShuCanGetReward();
        return false;
    }

    static isShowWingEquipMergeTipMark() {
        return G.DataMgr.equipStrengthenData.isShowWingEquipMergeTipMark();
    }

    static isShowWingEquipStrengthTipMark() {
        //KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN))
            return G.DataMgr.equipStrengthenData.isShowWingEquipStrengthTipMark() || G.DataMgr.thingData.checkThingForZhufu(KeyWord.HERO_SUB_TYPE_YUYI);
        return false;
    }

    static geRenBossTipMark() {
        if ((PinstanceData.GeRenBossMaxCnt - G.DataMgr.systemData.getFinishTime(Macros.PINSTANCE_ID_PERSONALBOSS) > 0) && G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_GRBOSS)) {
            return true;
        }
        else {
            return false;
        }
    }
    static ceremonyBoxTipMark() {
        let activityData = G.DataMgr.activityData;

        let isOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_SDBX);
        if (!isOpen)
            return false;
        let sdbxPanelInfo = activityData.sdbxPanelInfo;
        if (!sdbxPanelInfo)
            return false;
        let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SDBX);
        let now = G.SyncTime.getCurrentTime();
        //结算时间
        let endtime = Math.max(0, status.m_iEndTime - 86400);
        let canGet = Math.max(now / 1000) < endtime ? false : true;
        let cfgs = sdbxPanelInfo.m_stSDBXCfgList;
        for (let i = 0; i < cfgs.length; i++) {
            // uts.log(cfgs[i].m_iID + ' id  ' + sdbxPanelInfo.m_uiBuyTimes + '  购买次数  ' + MathUtil.checkPosIsReach(cfgs[i].m_iID - 1, sdbxPanelInfo.m_uiBitFlag) + '是否领取' + sdbxPanelInfo.m_uiBitFlag+'  存储标志  ' + sdbxPanelInfo.m_uiRank + '  排名  ' + sdbxPanelInfo.m_stSDBXCfgList[sdbxPanelInfo.m_stSDBXCfgList.length - 1].m_iCondition2 + '  条件  ' + canGet+'  canget');
            if (cfgs[i].m_iID == 1 && sdbxPanelInfo.m_uiBuyTimes >= 50 && !MathUtil.checkPosIsReach(cfgs[i].m_iID - 1, sdbxPanelInfo.m_uiBitFlag)) {
                // uts.log('AAAAAAAAA');
                return true;
            } else if (cfgs[i].m_iID != 1 && canGet == true && sdbxPanelInfo.m_uiRank <= cfgs[i].m_iCondition2 && sdbxPanelInfo.m_uiRank >= cfgs[i].m_iCondition1 && !MathUtil.checkPosIsReach(cfgs[i].m_iID - 1, sdbxPanelInfo.m_uiBitFlag)) {
                //uts.log('BBBBBBBBBB');

                return true;
            }
        }
        return false;
    }

    static kuaFuNianShouTipMark() {

        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let data = G.DataMgr.activityData.newYearData.kfnsInfo;
        if (data == null)
            return false;
        let endTime: number = data.m_uiActEndTime;
        let time = Math.max(0, endTime - now);
        let state: boolean = time > 0 ? true : false;
        if (state && G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_KFNS) && G.DataMgr.activityData.newYearData.kfnsInfo.m_bBossAlive == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    /**每日聚宝 */
    static jubaoTipmark() {
        if (G.DataMgr.activityData.jbpStatusValue != null) {
            let count = 0;
            let dataList = G.DataMgr.activityData.jbpStatusValue.m_stData;
            for (let item of dataList) {
                if (item.m_uiCfgID > 0 && item.m_ucStatus == 2) {
                    count++;
                    break;
                }
            }
            return count > 0 ? true : false;
        } else {
            return false;
        }
    }
    /**
     * 全民(｡･∀･)ﾉﾞ嗨起红点
     */
    static qmhqTipMark() {
        let activityData = G.DataMgr.activityData;
        let isOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_QMHD);
        if (!isOpen)
            return false;

        let qMHDActPanelInfo = activityData.qMHDActPanelInfo;
        if (!qMHDActPanelInfo)
            return false;

        let rewardCfgs = activityData.hiPointRewardCfgs;
        for (let i = 0; i < rewardCfgs.length; i++) {
            let cfg = rewardCfgs[i];
            let hasGet = MathUtil.checkPosIsReach(cfg.m_iID - 1, qMHDActPanelInfo.m_uiBitFlag);
            //没有领奖，且满足条件
            if (!hasGet && qMHDActPanelInfo.m_uiHDDegree >= cfg.m_icCondition) {
                return true;
            }
        }
        return false;
    }

    static equipLianTi() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI))
            return false;
        return G.DataMgr.equipStrengthenData.isLianTiCanLvUpOrActive();
    }

    //十二宫Tip显示
    static tianZhuCanShowTipMark() {
        return G.DataMgr.zhufuData.tianZhuCanShowTipMark() || G.DataMgr.zhufuData.tianYanCanShowTipMark();
    }

    /**
     * 转生精炼红点
     */
    static rebirthRefineTipMark() {
        return false /* G.DataMgr.equipStrengthenData.isShowRebirthRefineTipMark()*/;
    }

    /**
     * 魂环可激活
     */
    static isHunhuanActive() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNHUAN);
        if (!isfun)
            return false;
        let hunliData = G.DataMgr.hunliData;
        return hunliData.showHunHuanMark() || (hunliData.canLevelUp() > 0);
    }


    static isHunliShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.isShowMark();
    }

    static isHunguShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN);
        if (!isfun)
            return false;
        return G.DataMgr.thingData.isHunliPanelMark();
    }

    static isHunguFZShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
        if (!isfun)
            return false;
        return G.DataMgr.thingData.isHunguFZPanelMark();
    }

    static isHunguSJShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.isHunguSJPanelMark();
    }

    static isHunguStrengShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN_STRENG);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.hunguStrengeData.isHaveCanStreng();
    }

    static isHunguMergeShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.hunguMergeData.isEquipMerge();
    }

    static isHunguCreateShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN_CREATE);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.hunguCreateData.isEquipMerge();
    }

    static isHunguSkillShowTipMark() {
        let isfun = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGU_SKILL);
        if (!isfun)
            return false;
        return G.DataMgr.hunliData.hunguSkillData.isHunguSkillPanelTipMark();
    }

    static getLifeStatusPet(info: Protocol.ListPinHomeRsp, index: number) {
        let i1 = Math.floor(index / 8);
        let i2 = index % 8;
        return (info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucLifeStatus[i1] & (1 << i2)) > 0;
    }
    static qiFu(): boolean {
        let info = G.DataMgr.activityData.qiFuListInfo;
        if (info != null) {
            return info.m_ucFreeSliver > 0 || info.m_ucJingYan == 0;
        }
        return false;
    }

    static getTouziPanelTipMark() {
        let tzjhInfo = G.DataMgr.activityData.sevenDayFundData;
        if (tzjhInfo.m_ucNumber == 0) {
            return false;
        } else {
            return G.DataMgr.activityData.sevenDayHaveTipMarkCanShow();
        }
    }

    static saiJiViewTipMark() {
        return G.DataMgr.zhufuData.saijiViewTipMark();
    }
}