import { Global as G } from 'System/global'
import { BossBasePanel, BossBaseItemData, CtrlBossBtnGoStrategy } from 'System/pinstance/boss/BossBasePanel'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { MonsterData } from 'System/data/MonsterData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { BossRecordView } from 'System/pinstance/boss/BossRecordView'
import { StrategyView } from 'System/activity/view/StrategyView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { ThingData } from 'System/data/thing/ThingData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';
import { DataFormatter } from 'System/utils/DataFormatter'
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { DropPlanData } from 'System/data/DropPlanData'

class WorldBossRoleItem extends ListItemCtrl {
    private textInfo: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.textInfo = ElemFinderMySelf.findText(go);
    }

    update(info: Protocol.CSBossRoleReward) {
        let s = '';
        if (info.m_stRoleID.m_uiUin > 0) {
            let itemCfg = ThingData.getThingConfig(info.m_iItemID);
            s = uts.format('{0}获得了{1}', info.m_szRoleName, itemCfg ? TextFieldUtil.getItemText(itemCfg) : '');
        }
        this.textInfo.text = s;
    }
}

export class BossListItem {
    private data: BossBaseItemData;
    private obj: UnityEngine.GameObject;


    private lockNode: GameObjectGetSet;
    private unlockNode: GameObjectGetSet;

    private bossHead: UnityEngine.UI.RawImage;
    private txtLv: TextGetSet;
    private txtStatus: TextGetSet;
    private txtCount: TextGetSet;
    private flagDeath: GameObjectGetSet;

    setComponent(obj: UnityEngine.GameObject) {
        this.obj = obj;

        this.lockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "lockNode"));
        this.unlockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "unlockNode"));

        this.bossHead = ElemFinder.findRawImage(obj, 'bossHead');
        this.txtLv = new TextGetSet(ElemFinder.findText(obj, 'lockNode/txtLv'));
        this.txtStatus = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtStatus'));
        this.txtCount = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtCount'));
        this.flagDeath = new GameObjectGetSet(ElemFinder.findObject(obj, "unlockNode/flagDeath"));
    }
    update(data: BossBaseItemData) {
        let cfg = MonsterData.getMonsterConfig(data.bossId); 
        // 加载头像
        G.ResourceMgr.loadImage(this.bossHead, uts.format('images/head/{0}.png', cfg.m_iHeadID));
        let heroLv = G.DataMgr.heroData.level;
        let islock: boolean = cfg.m_usLevel > heroLv;
        this.lockNode.SetActive(islock);
        this.unlockNode.SetActive(!islock);
        if (islock) {
            this.txtLv.text = TextFieldUtil.getColorText(uts.format("{0}级开启", cfg.m_usLevel), Color.RED);
        } else {
            let leftSecond = data.refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
            if (leftSecond > 0) {
                this.flagDeath.SetActive(true);
                if (leftSecond < 0) {
                    leftSecond = 0;
                }
                this.txtStatus.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(leftSecond), 'FF4444');
            } else {
               
                this.flagDeath.SetActive(false);
                this.txtStatus.text = TextFieldUtil.getColorText('已刷新', '40CC9C');
            }
            //0代表有奖励,>0就是没奖励
            let num = data.eachBossRewardNum;
            this.txtCount.text = uts.format("奖励次数: {0}", TextFieldUtil.getColorText((num > 0 ? 0 : 1).toString(), num > 0 ?'CB1A1F' : Color.GREEN));
        }
    }
}

export class WorldBossPanel extends BossBasePanel {

    private canUpdateRewardList: boolean = false;

    private textKiller: UnityEngine.UI.Text;
    //private textTip: UnityEngine.UI.Text;
    //private adList: List;
    private adItems: WorldBossRoleItem[] = [];

    private textZdl: UnityEngine.UI.Text;
    //private timeText: UnityEngine.UI.Text;
    //protected btnBuyTimes: UnityEngine.GameObject;

    private bossListItems: BossListItem[] = [];
    private godPower: UnityEngine.UI.Text;

    private textRewardName: TextGetSet;

    private textRewardTime: TextGetSet;
    private m_restTime: number = 0;
    private textRewardChangeDes: TextGetSet;
    /**周期天数*/
    private loopDay: number = 0;
    private loopType: number = 0;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_WORLDBOSS, true, true, Macros.ACTIVITY_WORLD_BOSS_REWARD, Macros.ACTIVITY_ID_WORLDBOSS, CtrlBossBtnGoStrategy.ActAndBossLv);
    }

    protected resPath(): string {
        return UIPathData.WorldBossView;
    }

    protected initElements() {
        super.initElements();
        this.textKiller = this.elems.getText('textKiller');

        //this.textTip = this.elems.getText('textTip');
        //this.textTip.text = '每只boss每天仅可获取一次奖励';

        //this.adList = this.elems.getUIList('adList');

        this.textZdl = this.elems.getText('textZdl');

        this.godPower = this.elems.getText('godPower');

        //this.timeText = this.elems.getText('timeText');
        let timeBalls = this.elems.getElement('timeBalls');
        //this.btnBuyTimes = this.elems.getElement('btnBuyTimes');
        this.textRewardName = new TextGetSet(this.elems.getText("textRewardName"));

        this.textRewardTime = new TextGetSet(this.elems.getText("textRewardTime"));

        this.textRewardChangeDes = new TextGetSet(this.elems.getText("textRewardChangeDes"));

      
    }

    protected onOpen() {
        super.onOpen();
        //在BossView已经发过一次
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_LIST));
        this.startRewardTimer();
    }

    protected onClose() {
        super.onClose();
        this.removeTimer("startRewardTimer");
    }

    protected initListeners() {
        super.initListeners();
        //this.addClickListener(this.btnBuyTimes, this.onBtnBuyTimesClick);
    }

    private startRewardTimer() {
        let day = G.SyncTime.getDateAfterStartServer();
        //uts.log("kingsly 世界boss相关时间,开服第 " + (day) + " 天");
        let monsterData = G.DataMgr.monsterData;
        let startServerRewardDay = monsterData.startServerRewardOverDay;
        let loopRewardDay = monsterData.loopRewardDay;
        //uts.log("kingsly 世界boss相关时间,开服奖励天数: " + startServerRewardDay);
        //uts.log("kingsly 世界boss相关时间,周期奖励天数: " + loopRewardDay);
        if (day < startServerRewardDay+1) {
            this.loopDay = day;
            this.loopType = KeyWord.DAY_LOOP_TYPE_1;
        } else {
            this.loopType = KeyWord.DAY_LOOP_TYPE_2;
            this.loopDay = (day - startServerRewardDay) % loopRewardDay;
            if (this.loopDay == 0) {
                this.loopDay = loopRewardDay;
            }
        }
        //uts.log("kingsly 世界boss相关时间,周期日,第 " + (this.loopDay) + " 天");

        let cfg: GameConfig.WorldBossRewardCfgM = G.DataMgr.monsterData.getWorldRewardCfg(monsterData.getOneWorldRewardCfg().m_iBossID, this.loopType, this.loopDay);
        //uts.log("kingsly 世界boss相关时间,奖励变更天数,第 " + cfg.m_iSwitchDay+" 天");
        this.m_restTime = G.SyncTime.getServerZeroLeftTime();
        this.m_restTime += (cfg.m_iSwitchDay - this.loopDay - 1) * 86400;
        this.textRewardTime.text = TextFieldUtil.getColorText(DataFormatter.second2day(this.m_restTime), Color.GREEN);
        if (this.canUpdateRewardList) {
            this.updateRewardList();
            this.canUpdateRewardList = false;
        }
        this.addTimer("startRewardTimer", 1000, 0, this.onTimer);
    }

    private onTimer(): void {
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.startRewardTimer();
            this.canUpdateRewardList = true;
        }
        else {
            this.textRewardTime.text = TextFieldUtil.getColorText(DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }

    updateView() {

        // boss列表
        let bossList = G.DataMgr.activityData.bossList;
        if (null == bossList) {
            return;
        }

        let allNum = G.DataMgr.activityData.todayWaBaoAllCount;
        let vipParm = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_BOSS_DIG_NUM, G.DataMgr.heroData.curVipLevel);
        let cnt = bossList.m_iBossNum;
        let oldBossCnt = this.bossListDatas.length;
        this.bossListDatas.length = cnt;
        let bossInfo: Protocol.CSBossOneInfo;
        let bossCfg: GameConfig.ZYCMCfgM;
        let itemData: BossBaseItemData;
        for (let i: number = 0; i < cnt; i++) {
            if (i < oldBossCnt) {
                itemData = this.bossListDatas[i];
            } else {
                this.bossListDatas[i] = itemData = new BossBaseItemData();
            }
            bossInfo = bossList.m_astBossList[i];
            bossCfg = MonsterData.getBossConfigById(bossInfo.m_iBossID);
            itemData.bossId = bossInfo.m_iBossID;
            itemData.isDead = bossInfo.m_ucIsDead != 0;
            itemData.refreshTime = bossInfo.m_uiFreshTime;
            itemData.getRewardCnt = bossInfo.m_iGetRewardCnt;
            itemData.eachBossRewardNum = bossInfo.m_iGetScriptCnt;
            itemData.dropIds = bossCfg.m_iItemID;
            let monsterNav: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getZycmNav(bossInfo.m_iBossID);
            // itemData.sceneId = monsterNav.m_iSceneID;
            itemData.canWaBao = (itemData.isDead && vipParm != 0 &&
                (G.DataMgr.activityData.todayWaBaoAllCount <= vipParm) &&
                itemData.getRewardCnt == 0);
            itemData.pinType = KeyWord.OTHER_FUNCTION_WORLDBOSS;
        }

        this.updateBossList();

    }

    protected updateBossList() {
        if (this.openBossId > 0) {
            let bossCnt = this.bossListDatas.length;
            for (let i: number = 0; i < bossCnt; i++) {
                if (this.bossListDatas[i].bossId == this.openBossId) {
                    this.handChoice = i;
                }
            }
            this.openBossId = 0;
        }

        let selectIndex: number = this.handChoice;

        let cnt = this.bossListDatas.length;
        this.list.Count = cnt;
        let oldBossItemCnt = this.bossItems.length;
        let bossItem: BossListItem;
        let hasDead: boolean = false;
        for (let i: number = 0; i < cnt; i++) {
            let itemData = this.bossListDatas[i];
            if (i < oldBossItemCnt) {
                bossItem = this.bossListItems[i];
            } else {
                this.bossListItems[i] = bossItem = new BossListItem();
                bossItem.setComponent(this.list.GetItem(i).gameObject);
            }
            bossItem.update(itemData);
            //this.updateBossItemExt(bossItem, itemData);
            if (selectIndex < 0 && !itemData.isDead) {
                // 自动选中已刷新的
                selectIndex = i;
            }
            if (itemData.isDead && itemData.refreshTime > 0) {
                hasDead = true;
            }
        }

        if (selectIndex < 0) {
            selectIndex = this.list.Selected;
        }
        if (selectIndex < 0) {
            selectIndex = 0;
        }

        if (this.list.Selected != selectIndex) {
            this.list.Selected = selectIndex;
            this.list.ScrollByAxialRow(selectIndex);
        }
        this.updateSelected();

        if (this.needCountDown && hasDead) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }

    private updateRewardList() {
        let cfg: GameConfig.WorldBossRewardCfgM = G.DataMgr.monsterData.getWorldRewardCfg(this.oldBossId, this.loopType, this.loopDay);
        //uts.log("kingsly 世界boss,当前显示掉落方案id:" + cfg.m_iShowDrop);
        let dropCfg = DropPlanData.getDropPlanConfig(cfg.m_iShowDrop);
        // 奖励列表
        let cnt = dropCfg.m_astDropThing.length;
        this.rewardList.Count = this.awardCount;
        let oldIconCnt = this.rewardIcons.length;
        let iconItem: IconItem;
        for (let i: number = 0; i < this.awardCount; i++) {
            if (i < oldIconCnt) {
                iconItem = this.rewardIcons[i];
            } else {
                this.rewardIcons.push(iconItem = new IconItem());
                iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            if (i < cnt) {
                iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                iconItem.updateIcon();
            }
            else {
                iconItem.updateByItemConfig(null);
                iconItem.updateIcon();
            }
        }
    }


    protected updateSelected() {

        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];

        let cfg = MonsterData.getMonsterConfig(itemData.bossId);
        if (this.oldBossId != itemData.bossId) {
            this.oldBossId = itemData.bossId;
            // 更新模型
            this.updateSelectedModel(cfg);
            this.updateRewardList();
            // 更新是否已关注
            //this.updateFollowed();
        }

        this.updateBtnGo();


        // 显示上一轮击杀者
        let activityData = G.DataMgr.activityData;
        let bossList = activityData.bossList;
        let bossInfo = bossList.m_astBossList[index];
        let bossCfg = MonsterData.getMonsterConfig(bossInfo.m_iBossID);

        let killerName: string;

        this.godPower.text = TextFieldUtil.getColorText(bossCfg.m_iGodPower.toString(), Color.GREEN);

        if (bossInfo.m_stRoleID.m_uiUin > 0) {
            killerName = bossInfo.m_szKillerName;
        } else {
            killerName = '无';
        }
        this.textKiller.text = uts.format('上轮击杀者：{0}', killerName);

        // 显示获得奖励的人
        //let oldItemCnt = this.adItems.length;
        //this.adList.Count = bossInfo.m_iRoleRewardCnt;
        //for (let i = 0; i < bossInfo.m_iRoleRewardCnt; i++) {
        //    let item: WorldBossRoleItem;
        //    if (i < oldItemCnt) {
        //        item = this.adItems[i];
        //    } else {
        //        this.adItems.push(item = new WorldBossRoleItem());
        //        item.setComponents(this.adList.GetItem(i).gameObject);
        //    }
        //    item.update(bossInfo.m_stRoleRewardList[i]);
        //}

        ////世界boss次数上限
        //let reserveCnt = G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS);
        //let maxCnt = Macros.MAX_BOSS_DAY_SCRIPT_CNT + reserveCnt+ G.DataMgr.activityData.leftCnt;
        //let leftCnt = maxCnt - activityData.allScriptCnt;
        //leftCnt = leftCnt < 0 ? 0 : leftCnt;
        //this.timeText.text = uts.format("{0}/{1}", TextFieldUtil.getColorText(leftCnt.toString(), leftCnt == 0 ? Color.WHITE : Color.GREEN), maxCnt);

        ////世界boss能购买的额外次数
        //let buyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUYTIMES, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3);
        //let leftTimes: number = buyTimes - reserveCnt;
        //if (leftTimes > 0 && leftCnt < maxCnt) {
        //    this.btnBuyTimes.SetActive(true);
        //} else {
        //    this.btnBuyTimes.SetActive(false);
        //}
    }

    protected updateSelectedModel(cfg: GameConfig.MonsterConfigM) {
        super.updateSelectedModel(cfg);
        //let bossCfg = MonsterData.getBossConfigById(cfg.m_iMonsterID);
        //let thingCfg = ThingData.getThingConfig(bossCfg.m_iItemID[0]);
        ////装备名字
        ////this.textName.text = thingCfg.m_szName;
        ////boss 名字
        //this.textName.text = cfg.m_szMonsterName;
        //let zhufuData = G.DataMgr.zhufuData;
        ////let dataZhanLi = zhufuData.getImageConfig(zhufuData.getImageLevelID(thingCfg.m_iFunctionID, Constants.ShengQiMaxLevel));
        ////this.textZdl.text = FightingStrengthUtil.calStrength(dataZhanLi.m_astProp).toString();
        //Game.Tools.SetGameObjectLocalScale(this.modelRoot, cfg.m_ucUnitScale, cfg.m_ucUnitScale, cfg.m_ucUnitScale);
        //G.ResourceMgr.loadModel(this.modelCtn, UnitUtil.getRealMonsterType(cfg.m_ucModelFolder), cfg.m_szModelID, this.sortingOrder, true);
    }

    //protected onBtnBuyTimesClick() {
    //    //是钻石特权时
    //    if (this.getPrivilegeState()) {
    //        //世界boss购买次数价格
    //        let price: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3);
    //        //世界boss能购买的额外次数
    //        let times: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUYTIMES, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3);
    //        //世界boss剩余购买次数
    //        let shengYu: number = times - G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS);
    //        if (shengYu > 0) {
    //            G.TipMgr.showConfirm(uts.format("是否使用{0}购买额外奖励次数.\n\n今日剩余购买次数{1}次",
    //                TextFieldUtil.getYuanBaoText(price), shengYu), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.doBuyTimes));
    //        } else {
    //            G.TipMgr.addMainFloatTip(uts.format("可购买奖励次数已经用完"));
    //        }
    //    } else {//不是钻石特权
    //        G.TipMgr.addMainFloatTip(uts.format("钻石特权可购买奖励次数"));
    //        G.TipMgr.addMainFloatTip(uts.format("每日累充可获得BOSS奖励券"));
    //    }


    //}
    //是否钻石特权
    private getPrivilegeState(): boolean {
        return G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0;
    }
    //获取当前特权
    private getHeroCurPrivilege(): number {
        if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0) return KeyWord.VIPPRI_3;
        if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2) >= 0) return KeyWord.VIPPRI_2;
        if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_1) >= 0) return KeyWord.VIPPRI_1;
        return -1;
    }

    //private judgeHeroInPriType(priTypes: number[]): boolean {
    //    if (priTypes == null || priTypes.length == 0) return false;
    //    for (let i = 0; i < priTypes.length; i++) {
    //        let priType = priTypes[i];
    //        if (G.DataMgr.heroData.getPrivilegeState(priType) >= 0) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}

    private doBuyTimes(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage)
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WYFB_BUY_PIRCE, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3), true)) {
                //发送购买协议
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_BUY_PINSTANCE, Macros.PINSTANCE_ID_WORLDBOSS));
                //uts.log("发送了购买协议");
            }
    }
    protected onBtnGoClick() {
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }
        let bossList = G.DataMgr.activityData.bossList;
        let bossInfo = bossList.m_astBossList[index];
        let teamDate = G.DataMgr.teamData;
        if (teamDate.hasTeam) {
            G.TipMgr.addMainFloatTip("本副本只允许单人进入！");
        }
        else {
            G.ActionHandler.gotoWorldBoss(bossInfo.m_iBossID, this.getHeroCurPrivilege());

        }
    }

    protected onBtnRecordClick() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(372), '玩法说明');
        //let index = this.list.Selected;
        //if (index < 0) {
        //    return;
        //}

        //let bossList = G.DataMgr.activityData.bossList;
        //let bossInfo = bossList.m_astBossList[index];
        //if (bossInfo.m_stRoleID.m_uiUin > 0) {
        //    let killerInfo: Protocol.CSFMTKillerOneInfo = { m_stRoleID: bossInfo.m_stRoleID, m_szKillerName: bossInfo.m_szKillerName, m_uiTime: 0 };
        //    G.Uimgr.createForm<BossRecordView>(BossRecordView).open([killerInfo]);
        //} else {
        //    G.Uimgr.createForm<BossRecordView>(BossRecordView).open(null);
        //}
    }
}