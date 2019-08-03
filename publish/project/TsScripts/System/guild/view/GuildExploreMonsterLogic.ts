import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildData } from 'System/data/GuildData'
import { TipFrom } from 'System/tip/view/TipsView'
import { MonsterData } from 'System/data/MonsterData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { QuestData } from 'System/data/QuestData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { GuildExploreBaseLogic } from 'System/guild/view/GuildExploreBaseLogic'
import { PinstanceData } from 'System/data/PinstanceData'
import { GuildView } from 'System/guild/view/GuildView'
import { UnitUtil } from 'System/utils/UnitUtil'

export class GuildExploreMonsterLogic extends GuildExploreBaseLogic {
    private modelRoot: UnityEngine.GameObject;
    private jianying: UnityEngine.GameObject;

    initElements(elems: UiElements) {
        this.modelRoot = elems.getElement('modelRoot');
        this.jianying = elems.getElement('jianying');
    }

    initListeners() {
    }

    onOpen() {
        super.onOpen();

        this.panel.fork.SetActive(false);

        this.panel.monster.SetActive(true);
        this.panel.beauty.SetActive(false);
        this.panel.oldMan.SetActive(false);
        this.panel.master.SetActive(false);

        this.panel.btnGo.SetActive(true);
        this.panel.btnReward.SetActive(false);
        this.panel.btnRank.SetActive(true);

        this.onGuildExploreChanged();
    }

    onGuildExploreChanged() {
        super.onGuildExploreChanged();

        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let config = this.panel.config;
        if (exploreInfo.m_stCommonData.m_uiEventType == Macros.GUILD_TREASURE_HUNT_EVENT_BOSS) {
            this.jianying.SetActive(false);
            let bossData = exploreInfo.m_stCommonData.m_stEventData.m_stEventBossData;
            let bossConfig = MonsterData.getMonsterConfig(config.m_uiTarget);
            G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.boss, bossConfig.m_szModelID, this.panel.sortingOrder, true);
            this.panel.labelBtnGo.text = '进入副本';
            this.panel.textContent.text = '进入副本击杀BOSS，获得宗门贡献';

            this.panel.cost.SetActive(true);
            for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
                this.panel.costEnergies[i].SetActive(i < config.m_astDonation[0].m_uiCost);
            }
            this.panel.textDesc.text = 'Boss血量';
            this.panel.textSlider.text = uts.format('{0}/{1}', bossData.m_uiBossHp, config.m_uiTargetNum);
            this.panel.slider.value = bossData.m_uiBossHp / config.m_uiTargetNum;
        }
        else if (exploreInfo.m_stCommonData.m_uiEventType == Macros.GUILD_TREASURE_HUNT_EVENT_TASK) {
            let taskData = exploreInfo.m_stCommonData.m_stEventData.m_stEventTaskData;
            let questProgress = G.DataMgr.questData.getDoingQuestByType(KeyWord.QUEST_TYPE_TREASURE_HUNT, false, false);
            if (questProgress != null) {
                this.jianying.SetActive(false);

                if (G.DataMgr.questData.isQuestCompleting(questProgress)) {
                    this.panel.labelBtnGo.text = '领取奖励';
                } else {
                    this.panel.labelBtnGo.text = '前往';
                }
                let questConfig = QuestData.getConfigByQuestID(questProgress.m_iQuestID);
                let monsterCfg = MonsterData.getMonsterConfig(questConfig.m_astQuestNodeConfig[0].m_iThingID);
                G.ResourceMgr.loadModel(this.modelRoot, UnitUtil.getRealMonsterType(monsterCfg.m_ucModelFolder), monsterCfg.m_szModelID, this.panel.sortingOrder, true);

                let nodePgs = questProgress.m_astNodeProgress[0].m_shProgressValue;
                let nodeTarget = questConfig.m_astQuestNodeConfig[0].m_shValue;
                this.panel.textContent.text = uts.format('击杀{0}个{1}为探险准备物资', TextFieldUtil.getColorText(nodeTarget.toString(), Color.GREEN), TextFieldUtil.getColorText(monsterCfg.m_szMonsterName, Color.RED));

                this.panel.cost.SetActive(false);
            }
            else {
                this.jianying.SetActive(true);

                this.panel.labelBtnGo.text = '领取任务';
                this.panel.textContent.text = uts.format('点击{0}接取任务', TextFieldUtil.getColorText('领取任务', Color.GREEN));
                G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.boss, null, this.panel.sortingOrder, true);

                this.panel.cost.SetActive(true);
                for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
                    this.panel.costEnergies[i].SetActive(i < config.m_astDonation[0].m_uiCost);
                }
            }

            this.panel.textDesc.text = '任务进度';
            this.panel.textSlider.text = uts.format('{0}/{1}',
                taskData.m_uiTaskCompletedTimes * GuildData.ExploreMonsterCnt,
                config.m_uiTargetNum * GuildData.ExploreMonsterCnt);
            this.panel.slider.value = taskData.m_uiTaskCompletedTimes / config.m_uiTargetNum;
        }
    }

    onClickBtnGo() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let config = guildData.getExploreEventCfg(exploreInfo.m_stCommonData.m_uiEventID);
        if (exploreInfo.m_stCommonData.m_uiEventType == Macros.GUILD_TREASURE_HUNT_EVENT_BOSS) {
            let pinCfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_GUILD_TREASURE_HUNT);
            if (exploreInfo.m_stPersonalData.m_uiPower < config.m_astDonation[0].m_uiCost) {
                G.TipMgr.addMainFloatTip(uts.format('当前体力低于{0}', config.m_astDonation[0].m_uiCost));
                return;
            }
            if (!G.ActionHandler.canEnterPinstance(Macros.PINSTANCE_ID_GUILD_TREASURE_HUNT, 0, true, true)) {
                // 无法进入
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_BOSSPK, exploreInfo.m_stCommonData.m_uiEventID, config.m_uiDifficulty, config.m_uiTarget));
            G.Uimgr.closeForm(GuildView);
        }
        else if (exploreInfo.m_stCommonData.m_uiEventType == Macros.GUILD_TREASURE_HUNT_EVENT_TASK) {
            let questProgress = G.DataMgr.questData.getDoingQuestByType(KeyWord.QUEST_TYPE_TREASURE_HUNT, false, false);
            if (null == questProgress) {
                if (exploreInfo.m_stPersonalData.m_uiPower < config.m_astDonation[0].m_uiCost) {
                    G.TipMgr.addMainFloatTip(uts.format('当前体力低于{0}', config.m_astDonation[0].m_uiCost));
                    return;
                }
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_QUESTACCEPT, exploreInfo.m_stCommonData.m_uiEventID, config.m_uiDifficulty));
            } else {
                G.ModuleMgr.questModule.tryAutoDoQuest(questProgress.m_iQuestID, false);
                if (!G.DataMgr.questData.isQuestCompleting(questProgress)) {
                    G.Uimgr.closeForm(GuildView);
                }
            }
        }
    }

    onCurrencyChange(id: number) {
    }
}