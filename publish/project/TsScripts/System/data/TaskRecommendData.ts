import { HunLiPanel } from './../hunli/HunLiPanel';
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { PinstanceData } from 'System/data/PinstanceData'
import { Constants } from "System/constants/Constants";
import { VipData } from 'System/data/VipData'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { MonsterData } from 'System/data/MonsterData'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { DataFormatter } from '../utils/DataFormatter';
import { RiChangView } from 'System/richang/RiChangView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { QuestData } from "System/data/QuestData"
import { TianMingBangPanel } from '../pinstance/selfChallenge/TianMingBangPanel';
export class TaskRecommendItem {
    id: number;
    count: number;
    contentStr: string;
    config: GameConfig.TaskRecommendCfgM;
    maxCount: number;
    nexttime: number;
    timeStr: string;
    toString(): string {
        let s = this.id + '|' + this.count + "|" + this.nexttime;
        return s;
    }
}
export class RCRecommendItem {
    id: number;
    count: number;
    contentStr: string;
    config: GameConfig.RCRecommendCfgM;
    maxCount: number;
    nexttime: number;
    timeStr: string;
    redTip: number = 0;
    toString(): string {
        let s = this.contentStr + "|" + this.id + '|' + this.count + "|" + this.nexttime;
        return s;
    }
}
export class TaskRecommendData {
    private _dic: { [id: number]: GameConfig.TaskRecommendCfgM } = {};
    private taskDic: { [id: number]: TaskRecommendItem } = {};

    private _rcdic: { [id: number]: GameConfig.RCRecommendCfgM } = {};
    private rctaskDic: { [id: number]: RCRecommendItem } = {};
    private redTipCount = 0;
    public get RedTipCount() {
        return this.redTipCount;
    }
    onCfgReady() {
        let datas: GameConfig.TaskRecommendCfgM[] = G.Cfgmgr.getCfg('data/TaskRecommendCfgM.json') as GameConfig.TaskRecommendCfgM[];
        for (let data of datas) {
            if (this._dic[data.m_ucID] == null) {
                this._dic[data.m_ucID] = {} as GameConfig.TaskRecommendCfgM;
            }
            this._dic[data.m_ucID] = data;
        }

        let rcdatas: GameConfig.RCRecommendCfgM[] = G.Cfgmgr.getCfg('data/RCRecommendCfgM.json') as GameConfig.RCRecommendCfgM[];
        for (let data of rcdatas) {
            if (this._rcdic[data.m_ucID] == null) {
                this._rcdic[data.m_ucID] = {} as GameConfig.RCRecommendCfgM;
            }
            this._rcdic[data.m_ucID] = data;
        }
    }
    public updateRecommand(id: number, count: number, contentStr: string, maxCount: number = 0, nexttime: number = 0, timeStr: string = null) {
        let data = this.taskDic[id];
        if (!data) {
            data = this.taskDic[id] = new TaskRecommendItem();
            data.id = id;
        }
        data.count = count;
        data.contentStr = contentStr;
        data.timeStr = timeStr;
        data.config = this._dic[id];
        if (!data.config) {
            uts.log("任务ID不存在：" + id);
        }
        data.nexttime = nexttime;
        data.maxCount = maxCount;
        G.ViewCacher.mainView.taskTrackList.updateView(false);

    }
    private updateRCRecommand(id: number, count: number, contentStr: string, maxCount: number = 0, nexttime: number = 0, timeStr: string = null) {
        let data = this.rctaskDic[id];
        if (!data) {
            data = this.rctaskDic[id] = new RCRecommendItem();
            data.id = id;
        }
        data.config = this._rcdic[id];
        if (!data.config) {
            uts.log("日常ID不存在：" + id);
        }
        data.count = count;
        data.contentStr = contentStr;
        data.timeStr = timeStr;
        data.nexttime = nexttime;
        data.maxCount = maxCount;
        if (data.config.m_bIsRedDot) {
            let oldvalue = data.redTip;
            let newvalue = data.count > 0 ? 1 : 0;
            if (oldvalue != newvalue) {
                data.redTip = newvalue;
                if (newvalue) {
                    this.redTipCount++;
                }
                else {
                    this.redTipCount--;
                }
            }
        }

        let view = G.Uimgr.getForm<RiChangView>(RiChangView);
        if (view != null) {
            view.updateRCStatus();
        }
    }

    public getRecommendArray() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_RECOMMEND_TIP)) {
            return [];
        }
        let array = [];
        for (let id in this.taskDic) {
            let data = this.taskDic[id];
            if (data.config && (data.count > 0 || data.nexttime > 0) && data.config.m_ucFunctionLevel <= G.DataMgr.heroData.level) {
                array.push(data);
            }
        }
        array.sort(this._sort);
        return array;
    }
    public getRCRecommendArray(t: number): RCRecommendItem[] {
        let array = [];
        for (let id in this.rctaskDic) {
            let data = this.rctaskDic[id];
            if (data.config && data.config.m_szType == t) {
                array.push(data);
            }
        }
        array.sort(this._sort2);
        return array;
    }
    private _sort2(a: RCRecommendItem, b: RCRecommendItem): number {
        if (a.redTip != b.redTip) {
            return b.redTip - a.redTip;
        }
        if (a.config.m_iRecommend != b.config.m_iRecommend) {
            return b.config.m_iRecommend - a.config.m_iRecommend;
        }
        return a.config.m_ucSortID - b.config.m_ucSortID;
    }

    private _sort(a: TaskRecommendItem, b: TaskRecommendItem): number {
        if (a.config.m_ucSortID == b.config.m_ucSortID) {
            return a.count - b.count;
        }
        return a.config.m_ucSortID - b.config.m_ucSortID;
    }
    /**单人副本数据变化 */
    public onPinstanceChange() {
        let heroLV = G.DataMgr.heroData.level;
        let heroFight = G.DataMgr.heroData.fight;
        let startDays = G.SyncTime.getDateAfterStartServer();
        let fight = -1;
        //更新经验，剧情，金币副本数据

        //剧情副本
        let isOpen = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JQFB);
        if (isOpen) {
            let info1: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ);
            let info2: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ_2);
            if (info1 != null && info2 != null) {
                let bonusConifgs1: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_JDYJ);
                let bonusConifgs2: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_JDYJ_2);
                let canSaoDang = false;
                for (let i: number = 0; i < bonusConifgs1.length; i++) {
                    let bonusConfig = bonusConifgs1[i];
                    if (heroLV >= bonusConfig.m_iOpenLevel) {
                        let isLifePassed = 0 != (info1.m_uiIsLifeFinish & 1 << (i + 1));
                        if (!isLifePassed) {
                            if (fight == -1) {
                                fight = bonusConfig.m_iFightPower;
                                canSaoDang = true;
                                break;
                            }
                        }
                    }
                }
                if (!canSaoDang) {
                    for (let i: number = 0; i < bonusConifgs2.length; i++) {
                        let bonusConfig = bonusConifgs2[i];
                        if (heroLV >= bonusConfig.m_iOpenLevel) {
                            let isLifePassed = 0 != (info2.m_uiIsLifeFinish & 1 << (i + 1));
                            if (!isLifePassed) {
                                if (fight == -1) {
                                    fight = bonusConfig.m_iFightPower;
                                    canSaoDang = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (fight > 0) {
                    this.updateRecommand(4, fight, uts.format("推荐战力:[{0}]{1}[-]", fight > G.DataMgr.heroData.fight ? "FF0000" : "00FF00", fight));
                }
                else {
                    this.updateRecommand(4, 0, null);
                }
            }
        }

        //刷新经验副本
        isOpen = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SHMJ);
        if (isOpen) {
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
            if (info) {
                let bonusConifgs: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);
                let operateCount = 0;
                for (let i: number = 0; i < bonusConifgs.length; i++) {
                    let bonusConfig = bonusConifgs[i];
                    if (heroLV >= bonusConfig.m_iOpenLevel && startDays >= bonusConfig.m_iOpenDay) {
                        let isTodayPassed = (info.m_uiCurLevel + 1) <= bonusConfig.m_iDiff;
                        if (isTodayPassed) {
                            operateCount++;
                        }
                    }
                }
                this.updateRecommand(1, operateCount, uts.format("剩余层数:[00FF00]{0}[-]", operateCount));
                this.updateRCRecommand(2, operateCount, uts.format('剩余层数:{0}', TextFieldUtil.getColorText(uts.format("{0}", operateCount), operateCount > 0 ? Color.GREEN : Color.RED)));
            }
        }

        //更新材料副本
        isOpen = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_CLFB);
        if (isOpen) {
            let cur = 0;
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
                            if (heroFight >= diffCfg.m_iFightPower && heroLV >= diffCfg.m_iOpenLevel && (info.m_uiIsLifeFinish < diffCfg.m_iDiff || info.m_uiIsDayFinish < diffCfg.m_iDiff)) {
                                cur++;
                            }
                        }
                    }
                }
            }
            this.updateRecommand(12, cur, uts.format("剩余次数:[00FF00]{0}[-]", cur));
            this.updateRCRecommand(10, cur, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cur), cur > 0 ? Color.GREEN : Color.RED)));
        }
        isOpen = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZDFB);
        if (isOpen) {
            //刷新组队副本
            let pinstanceIds = PinstanceIDUtil.ZuDuiFuBenIDs;
            let cnt = pinstanceIds.length;
            let allcount = 0;
            for (let i: number = 0; i < cnt; i++) {
                let config = PinstanceData.getConfigByID(pinstanceIds[i]);
                if (heroLV >= config.m_iLevelLow && config.m_ucEnterTimes > 0) {
                    allcount += G.DataMgr.systemData.getPinstanceLeftTimes(config);
                }
            }
            this.updateRecommand(18, allcount, uts.format("剩余次数:[00FF00]{0}[-]", allcount));
            this.updateRCRecommand(12, allcount, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", allcount), allcount > 0 ? Color.GREEN : Color.RED)));
        }

        this.updatePersonalBoss();
        this.onUpdateShenXuan();
        this.onPetPinstanceChange();
    }
    /**魂力条件变化时 */
    public updateHnliConditionChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZHUANSHENG)) {
            return;
        }
        if (G.DataMgr.hunliData.level > 0 && G.DataMgr.hunliData.level < 9) {
            let config = G.DataMgr.hunliData.getHunLiConfigByLevel(G.DataMgr.hunliData.level + 1, G.DataMgr.hunliData.hunliNode);
            if (config == null) return;
            if (config.m_iRequireLevel > G.DataMgr.heroData.level) {
                this.updateRecommand(19, 0, null);
                return;
            }
        }
        let currentTask = G.DataMgr.hunliData.getHunliCurrentTask();
        if (currentTask == null) {
            this.updateRecommand(19, 0, null);
            return;
        }

        //1.表示已完成 2.未达成  currentTask[0]表示条件一 currentTask[1]表示条件二
        if (currentTask[1] == 1 && currentTask[0] == 0) {
            this.contionLink(1);
        } else if (currentTask[0] == 1 && currentTask[1] == 0) {
            this.contionLink(2);
        } else if (currentTask[0] == 1 && currentTask[1] == 1) {
            this.contionLink(3);
        } else {
            this.contionLink(0);
        }
    }

    /**条件达成 */
    private contionLink(condition: number = 0) {
        let boss = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_DI_BOSS);
        let shenxuan = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SXZL);
        if (!boss || !shenxuan)
            return;
        let level = G.DataMgr.hunliData.level;
        let info = G.DataMgr.hunliData.conditionInfo[Math.min(G.DataMgr.hunliData.hunliNode - 1, 0)].m_astConditionFinish[1];
        if (level < 9) {
            let nextConfig = G.DataMgr.hunliData.getHunLiConfigByLevel(level + 1, G.DataMgr.hunliData.hunliNode);
            if (G.DataMgr.heroData.level < nextConfig.m_iRequireLevel) {
                this.updateRecommand(19, 0, null);
                return;
            }
            if (level > 0) {
                switch (condition) {
                    case 0:
                        this._dic[19].m_iOperationType = KeyWord.RECOMMEND_TYPE_OPENPANEL;
                        this._dic[19].m_iFunctionType = KeyWord.OTHER_FUNCTION_DI_BOSS;
                        this.updateRecommand(19, 1, uts.format('{0}\n1.试炼([00FF00]{1}[-])\n2.魂骨收集[00FF00]{2}/{3}[-]', nextConfig.m_szName/*,
                            MonsterData.getMonsterConfig(nextConfig.m_astConditionList[0].m_iValue1).m_szMonsterName nextConfig.m_astConditionList[1].m_iValue2),**/, '国家Boss', info.m_iFinishParam, nextConfig.m_astConditionList[1].m_iValue2));
                        break;
                    case 1:
                        this._dic[19].m_iOperationType = KeyWord.RECOMMEND_TYPE_OPENPANEL;
                        this._dic[19].m_iFunctionType = KeyWord.OTHER_FUNCTION_DI_BOSS;
                        this.updateRecommand(19, 2, uts.format('{0}\n1.试炼([00FF00]{1}[-])\n2.魂骨收集([00FF00]已达成[-])', nextConfig.m_szName, '国家Boss'/** MonsterData.getMonsterConfig(nextConfig.m_astConditionList[0].m_iValue1).m_szMonsterName*/));
                        break;
                    case 2:
                        this._dic[19].m_iOperationType = KeyWord.RECOMMEND_TYPE_OPENPANEL;
                        this._dic[19].m_iFunctionType = KeyWord.OTHER_FUNCTION_SXZL;
                        this.updateRecommand(19, 3, uts.format('{0}\n1.试炼([00FF00]已达成[-])\n2.魂骨收集[00FF00]{1}/{2}[-]', nextConfig.m_szName, info.m_iFinishParam, nextConfig.m_astConditionList[1].m_iValue2));
                        break;
                    case 3:
                        this._dic[19].m_iOperationType = KeyWord.RECOMMEND_TYPE_OPENPANEL;
                        this._dic[19].m_iFunctionType = KeyWord.OTHER_FUNCTION_ZHUANSHENG;
                        this.updateRecommand(19, 4, uts.format('{0}\n前往进阶', nextConfig.m_szName));
                        break;
                    default:
                        break;
                }
            }

        }
    }

    /**
     * 魂骨boss 多人boss
     */
    private updatePersonalBoss() {
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        let funcLimitData = G.DataMgr.funcLimitData;
        if (funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS)) {
            //刷新个人BOSS副本
            if (info) {
                this.updateRecommand(11, info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount,
                    uts.format("剩余次数:[00FF00]{0}[-]", info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount),
                    G.DataMgr.constData.getValueById(KeyWord.PARAM_PRIVATE_BOSS_LIMIT_COUNT), info.m_stPinExtraInfo.m_stPrivateBossList.m_uiNextRefreshTime);
                this.updateRCRecommand(6, info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount), info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount > 0 ? Color.GREEN : Color.RED)));
            }
        }

        if (funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS)) {
            if (info) {
                this.updateRecommand(20, info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount,
                    uts.format("剩余点数:[00FF00]{0}[-]", info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount),
                    G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT), info.m_stPinExtraInfo.m_stPrivateBossList.m_uiMultiNextRefreshTime);

                this.updateRCRecommand(7, info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount,
                    uts.format('剩余点数:{0}', TextFieldUtil.getColorText(uts.format("{0}", info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount),
                        info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount > 9 ? Color.GREEN : Color.RED)));
            }
        }
    }

    public onPetPinstanceChange() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WYFB)) {
            return false;
        }
        let heroData = G.DataMgr.heroData;
        let current = heroData.energy;
        let petData = G.DataMgr.petData;
        let max = G.DataMgr.constData.getValueById(KeyWord.PARAM_AUTO_ENERGY_WY_NUM);
        let minfight = -1;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);
        let fight = heroData.fight;
        if (info != null) {
            let configs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WYFB);
            for (let i = configs.length - 1; i >= 0; i--) {
                let config = configs[i];
                let valid = 0;
                if (config.m_iConditionValue > 0 && !petData.isPetActive(config.m_iConditionValue)) {
                    continue;
                }
                if (config.m_iPreDiff > 0) {
                    if (!TipMarkUtil.getLifeStatusPet(info, config.m_iPreDiff - 1)) {
                        valid = 2;
                    }
                }
                if (valid != 2) {
                    valid = heroData.level >= config.m_iOpenLevel ? 0 : 1;
                }
                if (valid == 0) {
                    let lifefight = TipMarkUtil.getLifeStatusPet(info, i);
                    if (!lifefight) {
                        if (minfight == -1 || minfight < config.m_iFightPower) {
                            minfight = config.m_iFightPower;
                        }
                    }
                }
            }
        }
        if (minfight > -1) {
            let showfight = "";
            if (minfight > 10000) {
                showfight = uts.format("{0}万", (Math.floor(minfight / 1000) / 10).toString());
            }
            else {
                showfight = minfight.toString();
            }
            this.updateRecommand(13, minfight, uts.format("推荐战力:[{0}]{1}[-]", minfight > fight ? "FF0000" : "00FF00", showfight), 0, fight);
        }
        else {
            this.updateRecommand(13, current, uts.format("剩余活力:[00FF00]{0}/{1}[-]", current, max));
        }
        this.updateRCRecommand(13, current >= 120 ? 1 : 0, null);
    }

    /**世界BOSS数据变化 */
    public onWorldBossChange() {
        //let funcLimitData = G.DataMgr.funcLimitData;
        //if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDBOSS)) {
        //    return false;
        //}
        //let bossList = G.DataMgr.activityData.bossList;
        //if (null == bossList) {
        //    return;
        //}
        //let cnt = 0;
        //let length = bossList.m_iBossNum;
        //for (let i: number = 0; i < length; i++) {
        //    let bossInfo = bossList.m_astBossList[i];
        //    let bossCfg = MonsterData.getBossConfigById(bossInfo.m_iBossID);
        //    if (bossInfo.m_iGetScriptCnt < bossCfg.m_iScriptTimeLimit) {
        //        cnt++;
        //    }
        //}
        //this.updateRecommand(5, cnt, "[00FF00]可挑战[-]", 0);
    }
    /**地宫BOSS数据变化 */
    public onDiGongBossChange() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_DI_BOSS)) {
            return;
        }
        let systemData = G.DataMgr.systemData;
        let pinCfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG);
        let total = systemData.getPinstanceTotalTimes(pinCfg);// + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_DIGONG_NUM, G.DataMgr.heroData.curVipLevel);
        let finish = systemData.getFinishTime(Macros.PINSTANCE_ID_DIGONG);

        let maxNum = total;
        let curNum = Math.max(0, total - finish);
        this.updateRecommand(8, curNum, uts.format("剩余次数:[00FF00]{0}[-]", curNum));
        this.updateRCRecommand(11, curNum, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", curNum), curNum > 0 ? Color.GREEN : Color.RED)));
    }


    /**护送数据变化 */
    public onQuestChange() {
        let dataMgr = G.DataMgr;
        let level = G.DataMgr.heroData.level;
        let questData = G.DataMgr.questData;
        if (level >= this._rcdic[3].m_iFunctionLevel) {
            let cnt: number = questData.maxGuoyunQuestNum - questData.guoYunDayCompletedTimes;
            this.updateRecommand(10, cnt, uts.format("剩余次数:[00FF00]{0}[-]", cnt));
            this.updateRCRecommand(3, cnt, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cnt), cnt > 0 ? Color.GREEN : Color.RED)));
        }

        //日常任务
        if (level >= this._rcdic[1].m_iFunctionLevel) {
            let cnt = QuestData.DAILY_QUEST_MAX_TIME - questData.dailyCompleteTime;
            this.updateRCRecommand(1, cnt, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cnt), cnt > 0 ? Color.GREEN : Color.RED), cnt));
        }

        //悬赏任务
        if (level >= this._rcdic[4].m_iFunctionLevel) {
            let cnt = questData.jzTotalCnt - questData.juanzhouNum;
            this.updateRCRecommand(4, cnt, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cnt), cnt > 0 ? Color.GREEN : Color.RED), cnt));
        }

        //宗门任务
        if (level >= this._rcdic[14].m_iFunctionLevel) {
            if (G.DataMgr.heroData.guildId <= 0) {
                this.updateRCRecommand(14, 0, null);
            }
            else {
                let cnt2 = questData.maxGuildQuestNum - questData.guildDailyCompletedNumer;
                this.updateRCRecommand(14, cnt2, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cnt2), cnt2 > 0 ? Color.GREEN : Color.RED), cnt2));
            }
        }
    }

    public onTianMingChange() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_TIANMINGBANG)) {
            return false;
        }
        let cnt: number = G.DataMgr.heroData.myPPkRemindTimes;
        this.updateRecommand(7, cnt, uts.format("剩余次数:[00FF00]{0}[-]", cnt));
        this.updateRCRecommand(22, cnt, uts.format('剩余次数:{0}', TextFieldUtil.getColorText(uts.format("{0}", cnt), cnt > 0 ? Color.GREEN : Color.RED)));
    }
    public onTaoFaChange() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_FMT)) {
            return false;
        }
        let num = 20 - G.DataMgr.fmtData.m_iKillBossNumber;
        let desL = uts.format("剩余Boss：[{0}]{1}[-]", num > 0 ? "00FF00" : "FF0000", num);
        let desR = uts.format("剩余Boss：{0}", TextFieldUtil.getColorText(uts.format("{0}", num), num > 0 ? Color.GREEN : Color.RED));
        this.updateRecommand(6, num, desL);
        this.updateRCRecommand(8, 0, desR);
    }

    public onUpdateShenXuan() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SXZL)) {
            return false;
        }
        let pinstanceId = Macros.PINSTANCE_ID_SXZL;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(pinstanceId);
        if (info == null) {
            return;
        }
        let diffConfigs = PinstanceData.getDiffBonusConfigs(pinstanceId);
        if (diffConfigs == null) {
            return;
        }
        let curLevel = info.m_uiCurLevel;
        //判断按钮状态
        let nextCfg = PinstanceData.getDiffBonusData(pinstanceId, curLevel + 1);//下级配置
        if (nextCfg && G.DataMgr.heroData.level >= nextCfg.m_iOpenLevel) {
            let herofight = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
            let nextFight: string;
            if (nextCfg.m_iFightPower > 10000) {
                nextFight = DataFormatter.toFixed((nextCfg.m_iFightPower / 10000), 1) + '万';
            } else {
                nextFight = nextCfg.m_iFightPower.toString();
            }
            this.updateRecommand(16, nextCfg.m_iFightPower, uts.format("推荐战力:[{0}]{1}[-]", nextCfg.m_iFightPower > herofight ? "FF0000" : "00FF00", nextFight), 0, herofight);
        } else {
            this.updateRecommand(16, 0, "");
        }
        this.updateRCRecommand(21, TipMarkUtil.shenxuanzhilu() ? 1 : 0, null);
    }
    /**答题活动数据变化 */
    public onDaTiChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_DATI)) {
            return false;
        }
        this.updateRCRecommand(16, 0, null, 0);
    }

    /**福神宝箱数据变化 */
    public onFuShenBaoXiangChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_BXZB)) {
            return false;
        }
        this.updateRCRecommand(15, 0, null, 0);
    }

    onQiFuChange() {
        let dataMgr = G.DataMgr;
        if (!dataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_QIFU)) {
            return false;
        }
        this.updateRCRecommand(5, TipMarkUtil.qiFu() ? 1 : 0, null);
    }
    onGuildPVPBattle() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZPQYH)) {
            return false;
        }
        this.updateRCRecommand(17, 0, null, 0);
    }

    onYMZCChange() {
        let level = G.DataMgr.heroData.level;
        if (level < this._rcdic[18].m_iFunctionLevel) {
            return false;
        }
        this.updateRCRecommand(18, 0, null, 0);
    }

    onSouthAttackChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_NANMANRUQIN)) {
            return false;
        }
        this.updateRCRecommand(19, 0, null, 0);
    }

    onStarBossChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM)) {
            return false;
        }
        this.updateRCRecommand(9, 0, null, 0);
    }

    onJixiantiaozhanChange() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JSTZ)) {
            return false;
        }
        let data = G.DataMgr.pinstanceData.jstzData;
        if (data == null) return;
        let num = data.m_iMyPKCount;
        this.updateRCRecommand(23, num, uts.format("挑战次数：{0}/2", TextFieldUtil.getColorText(num.toString(), num > 0 ? Color.GREEN : Color.RED)), 2);
    }

    onLieHuZuoChange() {
        //猎户座
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JZXG)) {
            return;
        }
        this.updateRCRecommand(24, 0, null, 0);
    }

    onSiWangZhanChangChange() {
        // OTHER_死亡战场
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SWZC)) {
            return;
        }
        this.updateRCRecommand(20, 0, null, 0);
    }

    public update() {
        this.onSouthAttackChange();
        this.onYMZCChange();
        this.onGuildPVPBattle();
        this.onFuShenBaoXiangChange();
        this.onDaTiChange();
        this.onQuestChange();
        this.onPinstanceChange();
        this.onDiGongBossChange();
        this.onTaoFaChange();
        this.onQiFuChange();
        this.onStarBossChange();
        this.onLieHuZuoChange();
        this.onSiWangZhanChangChange();
    }

    public onLogin() {
        //仅仅更新一次，不会动态变化
        this.onWorldBossChange();
        this.onTianMingChange();
        this.onDaTiChange();
        this.onFuShenBaoXiangChange();
        this.onGuildPVPBattle();
        this.onYMZCChange();
        this.onSouthAttackChange();
        this.onStarBossChange();
        this.onJixiantiaozhanChange();
        this.onLieHuZuoChange();
        this.onSiWangZhanChangChange();
    }
}