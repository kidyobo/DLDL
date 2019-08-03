import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DropPlanData } from 'System/data/DropPlanData'
import { BossView } from 'System/pinstance/boss/BossView'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TipFrom } from 'System/tip/view/TipsView'
import { MonsterData } from 'System/data/MonsterData'
import { BossBasePanel, BossBaseItemData, CtrlBossBtnGoStrategy } from 'System/pinstance/boss/BossBasePanel'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { KuaFuBossRuleView } from 'System/pinstance/boss/KuaFuBossRuleView'

export class KuaFuBossPanel extends BossBasePanel {

    private readonly BigBossRewards: number[] = [10018270, 10016250, 10017260];

    private textTime: UnityEngine.UI.Text;

    private textShengji: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS, true, false, Macros.ACTIVITY_CROSS_BOSS_REWARD, Macros.ACTIVITY_ID_SHENMOZHETIAN, CtrlBossBtnGoStrategy.ActAndSceneLv);
    }

    protected resPath(): string {
        return UIPathData.KuaFuBossView;
    }

    protected initElements() {
        super.initElements();

        this.textTime = this.elems.getText('textTime');
        this.textShengji = this.elems.getText('textShengji');
    }

    onOpen() {
        super.onOpen();

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SHENMOZHETIAN, Macros.ACTIVITY_CROSS_BOSS_LIST));
    }

    protected updateSelected() {
        super.updateSelected();
        let activityData = G.DataMgr.activityData;
        let info = activityData.kuafuBossData;
        let startTime = 0;
        let cnt = 0;
        if (null != info) {
            startTime = info.m_uiNextStartTime;
            cnt = info.m_ucNumber;
        }
        //更新时间
        let status: Protocol.ActivityStatus = activityData.getActivityStatus(Macros.ACTIVITY_ID_SHENMOZHETIAN);
        if (null != status && status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
            this.textTime.text = '火爆进行中';
        }
        else {
            this.textTime.text = G.DataMgr.langData.getLang(10042, DataFormatter.second2mmddmm(startTime));
        }
    }


    updateView(): void {
        let activityData = G.DataMgr.activityData;
        let info = activityData.kuafuBossData;
        let cnt = 0;
        if (null != info) {
            cnt = info.m_ucNumber;
        }

        let day = G.SyncTime.getDateAfterStartServer();

        if (day > 14) {
            this.textShengji.gameObject.SetActive(false);
        }
        else {
            this.textShengji.gameObject.SetActive(true);
            let mod = day % 7;
            let str = '';
            let left = 0;
            if (mod == 0) {
                left = G.SyncTime.getServerZeroLeftTime();
                left = Math.floor(left / 3600);
                str = left + '小时';
            }
            else {
                left = 7 - mod;
                str = left + '天';
            }
            this.textShengji.text = uts.format('距离boss升级剩余：{0}\n等级提高后奖励更加丰厚', str);
        }

        let realCnt = 0;
        //BOSS列表
        let oldBossCnt = this.bossListDatas.length;
        let itemData: BossBaseItemData;
        for (let i: number = 0; i < cnt; i++) {
            let bossInfo = info.m_stBossStatusList[i];
            let bossCfg = MonsterData.getBossConfigById(bossInfo.m_iBossID);
            //根据天数过滤一下
            uts.logs(bossCfg.m_iID + '|' + bossCfg.m_iWeek);

            if (i < oldBossCnt) {
                itemData = this.bossListDatas[i];
            } else {
                this.bossListDatas[i] = itemData = new BossBaseItemData();
            }

            itemData.bossId = bossInfo.m_iBossID;
            itemData.isDead = bossInfo.m_ucDead != 0;
            itemData.refreshTime = 0;
            itemData.dropIds = bossCfg.m_iItemID;
            itemData.killerName = '' == bossInfo.m_szKillerName ? '无' : bossInfo.m_szKillerName;
            itemData.getRewardCnt = bossInfo.m_iGetRewardCnt;
            itemData.sceneId = 0;
            itemData.canWaBao = (itemData.isDead && itemData.getRewardCnt == 0);

            realCnt++;
        }

        this.bossListDatas.sort(delegate(this, this.sortBoss));
        this.updateBossList();
    }

    private sortBoss(a: BossBaseItemData, b: BossBaseItemData) {
        let cfgA = MonsterData.getMonsterConfig(a.bossId);
        let cfgB = MonsterData.getMonsterConfig(b.bossId);
        return cfgA.m_usLevel - cfgB.m_usLevel;
    }

    protected onBtnGoClick() {
        let status: Protocol.ActivityStatus = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_SHENMOZHETIAN);
        if (G.DataMgr.heroData.guildId <= 0) {
            G.TipMgr.addMainFloatTip('加入宗门后方可参与此活动');
            return;
        }
        if (status && status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_SHENMOZHETIAN, Macros.ACTIVITY_ID_SHENMOZHETIAN, 0);
        }
        else {
            G.TipMgr.addMainFloatTip('活动暂未开始');
        }
    }

    protected onBtnRecordClick() {
        G.Uimgr.createForm<KuaFuBossRuleView>(KuaFuBossRuleView).open();
    }
}