import { QuestData } from "System/data/QuestData"
import { KeyWord } from 'System/constants/KeyWord'

/**性能优化增加的查表映射*/
export class CompletedQuests {
    private list: Protocol.CompletedQuestList;
    private questStatusMap: { [questId: number]: number } = {};
    private nextTrunkId: number = KeyWord.TRUNK_QUEST_CONFIG_BASE_ID;

    constructor() {
        this.list = { m_iQuestNumber: 0, m_astQuestStatus: [], m_iGroupNumber: 0, m_astGroupStatus: [] };
    }
    get nextTrunk():number {
        return this.nextTrunkId;
    }
    update(list: Protocol.CompletedQuestList) {
        this.list = uts.deepcopy(list, this.list, true);
        for (let i = 0, n = this.list.m_astQuestStatus.length; i < n; i++) {
            let quest = this.list.m_astQuestStatus[i];
            this.questStatusMap[quest.m_iQuestID] = i;
        }
        this.setNextTrunkTasks();
    }
    isQuestCompleted(questId: number): boolean {
        let index = this.questStatusMap[questId];
        return index != null;
    }
    isMainQuestCompleteState(questId: number): boolean {
        let index = this.questStatusMap[questId];
        if (index == null) return false;

        let quest = this.list.m_astQuestStatus[index];
        return quest.m_iTimes >= 1;
    }
    setQuestCompleted(id: number, isCompleted: boolean, isGroup: boolean = false): void {
        if (isGroup) {
            return;
        }

        let index: number = this.questStatusMap[id];
        let cfg = QuestData.getConfigMap()[id];
        if (isCompleted && index == null) { // add new completed
            let quest: Protocol.CompletedQuest = { m_iQuestID: id, m_iTimes: 0 };
            this.list.m_astQuestStatus.push(quest);
            this.questStatusMap[id] = this.list.m_astQuestStatus.length - 1;
            this.setNextTrunkTask(cfg);
        }
        else if (!isCompleted && index != null) { // remove uncompleted
            this.list.m_astQuestStatus.splice(index, 1);
            delete this.questStatusMap[id];
            if (cfg != null && cfg.m_ucQuestType == KeyWord.QUEST_TYPE_TRUNK) {
                this.setNextTrunkTasks();
            }
        }
    }
    private setNextTrunkTasks() {
        this.nextTrunkId = KeyWord.TRUNK_QUEST_CONFIG_BASE_ID;
        let cfgs = QuestData.getConfigMap();
        let completedMap = this.questStatusMap;
        let trunkType = KeyWord.QUEST_TYPE_TRUNK;
        let nextId = 0;

        let completedQuests = this.list.m_astQuestStatus;
        for (let i = completedQuests.length - 1; i >= 0; i--) {
            let quest = completedQuests[i];
            let cfg = cfgs[quest.m_iQuestID];
            if (this.setNextTrunkTask(cfg)) break;
        }
    }
    private setNextTrunkTask(cfg: GameConfig.QuestConfigM) {
        if (cfg == null) return false;
        if (cfg.m_ucQuestType != KeyWord.QUEST_TYPE_TRUNK) return false;
        let nextId = cfg.m_iNextQuestID;
        if (nextId <= 0) return false;
        if (this.questStatusMap[nextId] != null) return false;

        this.nextTrunkId = Number(nextId);
        return true;
    }
}