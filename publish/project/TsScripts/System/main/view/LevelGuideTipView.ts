import { LevelGiftData } from './../../data/activities/LevelGiftData';
import { BossBaseItemData } from 'System/pinstance/boss/BossBasePanel';
import { Global as G } from 'System/global'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Color } from 'System/utils/ColorUtil'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { PinstanceData } from 'System/data/PinstanceData'
import { QuestData } from 'System/data/QuestData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { VipView, VipTab } from 'System/vip/VipView'
import { Constants } from "System/constants/Constants";
import { EnumThingID } from '../../constants/GameEnum';

class FightGuideItem {
    name: TextGetSet;
    icon: UnityEngine.UI.Image;
    BT_GO: GameObjectGetSet;
    BT_TQ: GameObjectGetSet;
    btnLabel: TextGetSet;
    altas: Game.UGUIAltas;
    fightData: FightPointGuideData;
    setComponents(go: UnityEngine.GameObject, altas: Game.UGUIAltas) {
        this.name = new TextGetSet(ElemFinder.findText(go, "name"));
        this.icon = ElemFinder.findImage(go, "icon");
        this.BT_GO = new GameObjectGetSet(ElemFinder.findObject(go, "BT_GO"));
        this.BT_TQ = new GameObjectGetSet(ElemFinder.findObject(go, "BT_TQ"));
        this.btnLabel = new TextGetSet(ElemFinder.findText(this.BT_TQ.gameObject, "Text"));
        this.altas = altas;
        Game.UIClickListener.Get(this.BT_GO.gameObject).onClick = delegate(this, this.onClick);
        Game.UIClickListener.Get(this.BT_TQ.gameObject).onClick = delegate(this, this.onClickTQ);
    }
    update(data: FightPointGuideData) {
        this.fightData = data;
        this.icon.sprite = this.altas.Get(data.config.m_ucID.toString());
        let max = this.fightData.maxTimes;
        let cur = this.fightData.needSubMax ? (max - this.fightData.times) : this.fightData.times;
        if (this.fightData.needSubMax) {
            this.name.text = uts.format("{0}({1})", data.config.m_szName, TextFieldUtil.getColorText('无限', Color.GREEN));
        }
        else if (this.fightData.isGoButton) {
            this.name.text = data.config.m_szName;
        }
        else {
            this.name.text = uts.format("{0}{1}", data.config.m_szName, TextFieldUtil.getColorText(uts.format("({0}/{1})", cur, max), cur == 0 ? Color.RED : Color.GREEN));
        }
        if (data.config.m_iIsRecommend == KeyWord.VIP_PARA_LOOP_QUEST_REWARD) {
            let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_LOOP_QUEST_REWARD);
            this.BT_TQ.SetActive(!hasActive && data.times == 0);
            this.BT_GO.SetActive(data.times > 0);
            this.btnLabel.text = "额外奖励";
        }
        else if (this.fightData.isGoButton) {
            this.BT_TQ.SetActive(false);
            this.BT_GO.SetActive(true);
        }
        else {
            this.btnLabel.text = "额外次数";
            let canShowVipBtn = data.config.m_iIsRecommend != 0;
            if (canShowVipBtn) {
                if (this.fightData.needSubMax) {
                    canShowVipBtn = cur >= max;
                }
                else {
                    canShowVipBtn = data.times == 0;
                }
            }
            if (this.fightData.config.m_ucID == 54 || this.fightData.config.m_ucID == 51 || this.fightData.config.m_ucID == 5) {
                this.BT_TQ.SetActive(false);
                this.BT_GO.SetActive(true);
            } else {
                this.BT_TQ.SetActive(canShowVipBtn);
                this.BT_GO.SetActive(!canShowVipBtn && data.times > 0);
            }
        }
    }

    private onClick() {
        //战力卡点
        let fightCfg = this.fightData.config;
        if (fightCfg.m_iOperationType == KeyWord.RECOMMEND_TYPE_FIGHT_OPENPANEL) {
            G.ActionHandler.executeFunction(fightCfg.m_iFunctionType);
        }
        G.Uimgr.closeForm(LevelGuideTipView);
    }

    private onClickTQ() {
        let config = this.fightData.config;
        let vipParam = config.m_iIsRecommend;
        if (vipParam == 0)
            return;
    }

    private onLoopQuest(status: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            G.Uimgr.createForm<VipView>(VipView).open();
        } else {
            this.onClick();
        }
    }


}
//战力卡点
class FightPointGuideData {
    config: GameConfig.LevelRecommendCfgM;
    times: number = 0;
    extraTime: number = 0;
    maxTimes: number = 0;
    needSubMax: boolean = false;
    leftVipCount: number = 0;
    isOpen: boolean = true;
    isGoButton: boolean = false;
    //当前进入国家Boss需要的密钥
    private curPrice: number = 0;
    private KeyPrices: number[] = [1, 1, 2, 2, 4, 7, 10, 15, 25];
    constructor(config: GameConfig.LevelRecommendCfgM, heroLV: number, startDays: number) {
        this.config = config;
        let id = this.config.m_ucID;
        if (id == 51) {
            //个人Boss
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            this.needSubMax = false;
            //个人Boss的总次数
            let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
            if (info) {
                let curTimes = info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount;
                let total = G.DataMgr.constData.getValueById(KeyWord.PARAM_PRIVATE_BOSS_LIMIT_COUNT);
                this.maxTimes = total;
                this.times = curTimes;
            } else {
                this.maxTimes = 0;
                this.times = 0;
            }
        } else if (id == 52) {
            //地宫Boss
            let dataMgr = G.DataMgr;
            if (!dataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_DI_BOSS)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            this.needSubMax = false;
            let systemData = G.DataMgr.systemData;
            let pinCfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG);
            //总次数加上密钥的次数 每次进入国家Boss需要的密钥不一样
            let total = systemData.getPinstanceTotalTimes(pinCfg);//+ G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_DIGONG_NUM, G.DataMgr.heroData.curVipLevel);
            let finish = systemData.getFinishTime(Macros.PINSTANCE_ID_DIGONG);
            //目前拥有的密钥个数
            let myMiYao = G.DataMgr.thingData.getThingNum(EnumThingID.DiGongMiYao);
            let paidTimes = finish - total;
            let maxCnt = this.KeyPrices.length;
            if (finish >= total) {
                if (paidTimes + 1 > maxCnt) {
                    this.curPrice = this.KeyPrices[maxCnt - 1];
                    total += Math.floor(myMiYao / this.curPrice);
                } else {
                    this.curPrice = this.KeyPrices[paidTimes];
                    let cnt: number = 0;
                    //[1, 1, 2, 2, 4, 7, 10, 15, 25];
                    let sum: number = 0;
                    for (let i = paidTimes; i < maxCnt; i++) {
                        sum += this.KeyPrices[i];
                        if (sum > myMiYao) {
                            cnt = i - paidTimes;
                            total += cnt;
                            break;
                        }
                    }
                }
                let maxNum = total;
                this.maxTimes = maxNum;
                this.times = total - 5;
            } else {
                let curNum = Math.max(0, finish);
                this.maxTimes = total;
                this.times = this.maxTimes - curNum;
            }

        } else if (id == 53) {
            //神选之路
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SXZL)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            this.needSubMax = false;
            this.isGoButton = true;
            // let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SXZL);
            // let bonusConifgs: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SXZL);
            // for (let i: number = 0; i < bonusConifgs.length; i++) {
            //     let bonusConfig = bonusConifgs[i];
            //     if (heroLV >= bonusConfig.m_iOpenLevel && startDays >= bonusConfig.m_iOpenDay) {
            //         let isTodayPassed = (info.m_uiCurLevel + 1) <= bonusConfig.m_iDiff;
            //         if (isTodayPassed) {
            //             this.times++;
            //         }
            //         this.maxTimes++;
            //     }
            // }
        } else if (id == 54) {
            let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS)
            //多人Boss
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS) || info == undefined || info == null) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            this.needSubMax = false;
            this.maxTimes = G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT);
            this.times = info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount;
        }
    }
}
class LevelGuideItem {
    name: UnityEngine.UI.Text;
    icon: UnityEngine.UI.Image;
    BT_GO: GameObjectGetSet;
    BT_TQ: GameObjectGetSet;
    btnLabel: TextGetSet;
    altas: Game.UGUIAltas;
    data: LevelGuideData;
    private scenesId: number[] = [];
    setComponents(go: UnityEngine.GameObject, altas: Game.UGUIAltas) {
        this.name = ElemFinder.findText(go, "name");
        this.icon = ElemFinder.findImage(go, "icon");
        this.BT_GO = new GameObjectGetSet(ElemFinder.findObject(go, "BT_GO"));
        this.BT_TQ = new GameObjectGetSet(ElemFinder.findObject(go, "BT_TQ"));
        this.btnLabel = new TextGetSet(ElemFinder.findText(this.BT_TQ.gameObject, "Text"));
        this.altas = altas;
        Game.UIClickListener.Get(this.BT_GO.gameObject).onClick = delegate(this, this.onClick);
        Game.UIClickListener.Get(this.BT_TQ.gameObject).onClick = delegate(this, this.onClickTQ);
    }
    update(data: LevelGuideData) {
        this.data = data;
        this.icon.sprite = this.altas.Get(data.config.m_ucID.toString());
        let max = this.data.maxTimes;
        let cur = this.data.needSubMax ? (max - this.data.times) : this.data.times;
        if (this.data.needSubMax) {
            this.name.text = uts.format("{0}", data.config.m_szName);
        }
        else {
            let str1: string;
            let str2: string;
            if (data.config.m_ucID == 5) {
                //落日森林做单独处理，加挂机二字
                str1 = uts.format('{0}挂机\n', data.config.m_szName);
                str2 = TextFieldUtil.getColorText(uts.format("(剩余怪物{0}只)", this.data.times), this.data.times == 0 ? Color.RED : Color.GREEN);
                this.updateData();
            } else {
                str1 = data.config.m_szName;
                str2 = TextFieldUtil.getColorText(uts.format("({0}/{1})", cur, max), cur == 0 ? Color.RED : Color.GREEN);
            }
            this.name.text = uts.format("{0}{1}", str1, str2);
        }
        if (data.config.m_iIsRecommend == KeyWord.VIP_PARA_LOOP_QUEST_REWARD) {
            let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_LOOP_QUEST_REWARD);
            this.BT_TQ.SetActive(!hasActive && data.times == 0);
            this.BT_GO.SetActive(data.times > 0);
            this.btnLabel.text = "额外奖励";
        }
        else {
            this.btnLabel.text = "额外次数";
            let canShowVipBtn = data.config.m_iIsRecommend != 0;
            if (canShowVipBtn) {
                if (this.data.needSubMax) {
                    canShowVipBtn = cur >= max;
                }
                else {
                    canShowVipBtn = data.times == 0;
                }
            }
            this.BT_TQ.SetActive(canShowVipBtn);
            this.BT_GO.SetActive(!canShowVipBtn && data.times > 0);
        }
    }

    private onClick() {
        let config = this.data.config;
        switch (config.m_iOperationType) {
            case KeyWord.RECOMMEND_TYPE_OPENPANEL:
                G.ActionHandler.executeFunction(config.m_iFunctionType);
                break;
            case KeyWord.RECOMMEND_TYPE_GOTONPC:
                G.ModuleMgr.questModule.doQuestByType(config.m_iFunctionType, false);
                break;
            case KeyWord.RECOMMEND_TYPE_PINSTANCE:
                // if (config.m_iFunctionType == KeyWord.OTHER_FUNCTION_DYZSPIN) {
                //     G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
                // }
                //左侧面板----落日森林（直接进入后开启挂机）
                let sceneID = this.scenesId[this.scenesId.length - 1];
                if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_JDY_FREE_NUM) || G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_FLIGHTOPERATOR).length > 0) {
                    G.Mapmgr.goToPos(sceneID, 3770, 3150, true);
                } else {//262 263 264 123 135 a%26 -2-1
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUAJI, (sceneID % 26) * 2 - 3, 0, 0, false);
                }
                break;
        }
        G.Uimgr.closeForm(LevelGuideTipView);
    }

    /**更新落日森林的数据 */
    private updateData() {
        let fmtArr = G.DataMgr.fmtData.fmtArr;
        for (let i: number = 0; i < fmtArr.length; i++) {
            let config = fmtArr[i];
            for (let dropInfo of config.m_astBossDropList) {
                if (dropInfo.m_iBossID) {
                    let cfg = G.DataMgr.sceneData.getSceneInfo(config.m_iSceneID).config;
                    let sceneLv: number = cfg.m_ucRequiredLevel;
                    if (G.DataMgr.hunliData.level >= config.m_iHunliLimit && G.DataMgr.heroData.level >= sceneLv ? sceneLv : 0) {
                        this.scenesId.push(config.m_iSceneID);
                    }
                }
            }
        }
    }

    private onClickTQ() {
        let config = this.data.config;
        let vipParam = config.m_iIsRecommend;
        if (vipParam == 0)
            return;

        //if (vipParam == KeyWord.VIP_PARA_LOOP_QUEST_REWARD) {
        //    let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(vipParam);
        //    if (!hasActive) {
        //        let str = "激活{0}经验任务可获得1.5倍奖励";
        //        let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(vipParam);
        //        let privilegeStrs = TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs);
        //        G.TipMgr.showConfirm(uts.format(str, TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '激活特权|取消', delegate(this, this.onLoopQuest));
        //        return;
        //    }
        //} else {
        //    let leftTimes = this.data.extraTime - G.DataMgr.vipData.getTaskBuyTimes(config.m_iFunctionType);
        //    let cost = G.DataMgr.vipData.getVipParaValue(config.m_iCostParam, G.DataMgr.heroData.curVipLevel);
        //    G.ActionHandler.privilegePrompt(vipParam, cost, leftTimes, delegate(this, this.onGoToBuy, config.m_iFunctionType));
        //}
    }

    private onLoopQuest(status: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            G.Uimgr.createForm<VipView>(VipView).open();
        } else {
            this.onClick();
        }
    }

    private onGoToBuy(functionType: number): void {
        //if (functionType == KeyWord.OTHER_FUNCTION_DI_BOSS) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_DG_BUY_TIRED));
        //}
        //else {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_BUY_QUEST, functionType));
        //}
        //let form = G.ViewCacher.LevelGuideTipView;
        //if (form && form.isOpened)
        //    form.close();
    }

}
class LevelGuideData {
    config: GameConfig.LevelRecommendCfgM;
    times: number = 0;
    extraTime: number = 0;
    maxTimes: number = 0;
    needSubMax: boolean = false;
    leftVipCount: number = 0;
    isOpen: boolean = true;
    constructor(config: GameConfig.LevelRecommendCfgM, heroLV: number, startDays: number) {
        this.config = config;
        let id = this.config.m_ucID;
        let vip: number = G.DataMgr.heroData.curVipLevel;

        if (config.m_iIsRecommend > 0 && config.m_iIsRecommend != KeyWord.VIP_PARA_LOOP_QUEST_REWARD) {
            this.extraTime = G.DataMgr.vipData.getVipParaValue(config.m_iIsRecommend, vip);
        }
        if (id == 1) {
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SHMJ)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            //刷新经验副本
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
            if (info) {
                let bonusConifgs: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);
                for (let i: number = 0; i < bonusConifgs.length; i++) {
                    let bonusConfig = bonusConifgs[i];
                    if (heroLV >= bonusConfig.m_iOpenLevel && startDays >= bonusConfig.m_iOpenDay) {
                        let isTodayPassed = (info.m_uiCurLevel + 1) <= bonusConfig.m_iDiff;
                        if (isTodayPassed) {
                            this.times++;
                        }
                        this.maxTimes++;
                    }
                }
            }
        }
        else if (id == 2) {
            this.maxTimes = QuestData.DAILY_QUEST_MAX_TIME;
            this.times = this.maxTimes - G.DataMgr.questData.dailyCompleteTime;
        }
        else if (id == 3) {
            this.maxTimes = G.DataMgr.questData.jzTotalCnt;
            this.times = this.maxTimes - G.DataMgr.questData.juanzhouNum;
            this.leftVipCount = 0;
            //this.leftVipCount = this.extraTime - G.DataMgr.vipData.getTaskBuyTimes(KeyWord.QUEST_TYPE_JUANZHOU);
        }
        else if (id == 4) {
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_GUOYUN)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            this.maxTimes = G.DataMgr.questData.maxGuoyunQuestNum;
            this.times = this.maxTimes - G.DataMgr.questData.guoYunDayCompletedTimes;
            this.leftVipCount = this.extraTime - G.DataMgr.vipData.getReserveTime(KeyWord.QUEST_TYPE_GUO_YUN);
        }
        else if (id == 5) {
            //落日森林
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_FMT)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            // this.needSubMax = false;

            //可击杀的小怪数量
            this.maxTimes = G.DataMgr.constData.getValueById(KeyWord.PARAM_FMT_MONSTER_PRIZE_COUNT);
            this.times = G.DataMgr.constData.getValueById(KeyWord.PARAM_FMT_MONSTER_PRIZE_COUNT) - G.DataMgr.fmtData.m_iKillMonsterNumber;
        }

        else if (id == 6) {
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_QIFU)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            let expConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_JINGYAN, heroLV);
            let panelData = G.DataMgr.activityData.qiFuListInfo;
            let freeNum = G.DataMgr.activityData.isGetQiFuExp ? 1 : 0;
            this.maxTimes = expConfig.m_uiTime + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_QIFU_COUNT, vip) + freeNum;
            this.times = this.maxTimes - (panelData == null ? 0 : panelData.m_astQiFuList[0].m_ucNumber);
        }
        else if (id == 7) {
            let dataMgr = G.DataMgr;
            if (!dataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_DI_BOSS)) {
                this.isOpen = false;
                return;
            }
            this.isOpen = true;
            let systemData = G.DataMgr.systemData;
            let pinCfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG);
            let total = systemData.getPinstanceTotalTimes(pinCfg) + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_DIGONG_NUM, G.DataMgr.heroData.curVipLevel);
            let finish = systemData.getFinishTime(Macros.PINSTANCE_ID_DIGONG);

            let maxNum = total;
            let curNum = Math.max(0, total - finish);
            this.maxTimes = maxNum;
            this.times = maxNum - curNum;
        }
    }
    static sortFunc(a: LevelGuideData, b: LevelGuideData) {
        let statusA = 0;
        if (a.times > 0) {
            statusA = -1;
        }
        else if (a.extraTime > 0) {
            statusA = 1;
        }
        else if (a.times == 0) {
            statusA = 2;
        }

        let statusB = 0;
        if (b.times > 0) {
            statusB = -1;
        }
        else if (b.extraTime > 0) {
            statusB = 1;
        }
        else if (b.times == 0) {
            statusB = 2;
        }

        if (statusA != statusB)
            return statusA - statusB;
        return a.config.m_ucSortID - b.config.m_ucSortID;
    }
}
export class LevelGuideTipView extends CommonForm {
    private altas: Game.UGUIAltas;
    //战力卡点
    private fightlist: List;
    //等级卡点
    private levelList: List;
    private openIndex: number;
    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    constructor() {
        super(0);
        this.needCheckScreenScale = true;
    }

    layer(): UILayer {
        return UILayer.Base;
    }
    open(param: number) {
        if (param == KeyWord.QUEST_GUILD_OPEN_LEVELGUIDE) {
            this.openIndex = 0;
        } else if (param == KeyWord.QUEST_GUILD_OPEN_FIGHT_GUIDE) {
            this.openIndex = 1;
        }
        super.open();
    }
    protected resPath(): string {
        return UIPathData.LevelGuideTipView;
    }

    protected initElements() {
        this.altas = this.elems.getUGUIAtals("altas");
        //升级
        this.levelList = this.elems.getUIList('levelList');
        //战力
        this.fightlist = this.elems.getUIList('fightList');
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        G.addUIRaycaster(this.form);
    }

    protected initListeners() {
        this.addClickListener(this.form, delegate(this, this.onClickClose));
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
    }

    protected onOpen() {
        this.tabGroup.Selected = this.openIndex;
        this.onClickTabGroup(this.openIndex);
        let levelRecommendData = G.DataMgr.levelRecommendData;

        let lvArray = levelRecommendData.lvCfgArray;
        //对这个array做一个过滤并生成一个新的
        let heroLV = G.DataMgr.heroData.level;
        let startDays = G.SyncTime.getDateAfterStartServer();
        let newarr: LevelGuideData[] = [];
        for (let data of lvArray) {
            let item = new LevelGuideData(data, heroLV, startDays);
            if (item.isOpen) {
                newarr.push(item);
            }
        }
        newarr.sort(LevelGuideData.sortFunc);

        let arraylen = newarr.length;
        this.levelList.Count = arraylen;
        for (let i = 0; i < arraylen; i++) {
            let data = newarr[i];
            let item = this.levelList.GetItem(i);
            let leveldata = item.data.leveldata as LevelGuideItem;
            if (!leveldata) {
                leveldata = item.data.leveldata = new LevelGuideItem();
                leveldata.setComponents(item.gameObject, this.altas);
            }
            leveldata.update(data);
        }
        this.levelList.ScrollTop();

        //战力推荐
        let fightArray = levelRecommendData.fightCfgArray;
        let newFightArray: FightPointGuideData[] = [];
        for (let cfg of fightArray) {
            let item = new FightPointGuideData(cfg, heroLV, startDays);
            if (item.isOpen) {
                newFightArray.push(item);
            }
        }
        newFightArray.sort(delegate(this, this.sortByCfgSortId))
        let fightlen = newFightArray.length;
        this.fightlist.Count = fightlen;
        for (let i = 0; i < fightlen; i++) {
            let data = newFightArray[i];
            let item = this.fightlist.GetItem(i);
            let fightdata = item.data.leveldata as FightGuideItem;
            if (!fightdata) {
                fightdata = item.data.fightdata = new FightGuideItem();
                fightdata.setComponents(item.gameObject, this.altas);
            }
            fightdata.update(data);
        }


    }

    protected onClose() {
        this.openIndex = -1;
    }
    private onClickClose() {
        this.close();
    }
    private onClickTabGroup(index: number) {
        let enabelLv = index == 0;
        this.levelList.SetActive(enabelLv);
        this.fightlist.SetActive(!enabelLv);
    }
    private sortByCfgSortId(a: GameConfig.LevelRecommendCfgM, b: GameConfig.LevelRecommendCfgM) {
        return a.m_ucSortID - b.m_ucSortID;
    }
}