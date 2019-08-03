import { QuestData } from "System/data/QuestData"
import { KeyWord } from 'System/constants/KeyWord'

export class DoingQuests {
    private mains: Protocol.QuestProgress[] = [];
    private childs: Protocol.QuestProgress[] = [];
    private doingTrunkId: number = 0;
    has(questId: number): boolean {
        let quests = this.getQuests(questId);
        return this.getIndex(questId, quests) != -1;
    }
    get(questId: number): Protocol.QuestProgress {
        let quests = this.getQuests(questId);
        let inx: number = this.getIndex(questId, quests);
        if (inx == -1)
            return null;
        return quests[inx];
    }
    get doingTrunk(): number {
        return this.doingTrunkId;
    }
    update(progressList: Protocol.QuestProgressList) {
        this.mains.length = 0;
        this.childs.length = 0;
        for (let i: number = 0, n = progressList.m_ucQuestNumber; i < n; ++i) {
            let progress = progressList.m_stQuestProgress[i];
            if (null == QuestData.getConfigMap()[progress.m_iQuestID]) {
                continue;
            }
            this.mains.push(progress);
        }
    }
    add(quest: Protocol.QuestProgress) {
        let cfg = QuestData.getConfigMap()[quest.m_iQuestID];
        if (cfg.m_ucQuestType == KeyWord.QUEST_TYPE_TRUNK) {
            this.doingTrunkId = quest.m_iQuestID;
        }
        this.mains.push(quest);
    }
    addChild(quest: Protocol.QuestProgress) {
        this.childs.push(quest);
    }
    remove(questId: number) {
        let quests = this.getQuests(questId);
        let inx: number = this.getIndex(questId, quests);
        if (inx != -1) {
            quests.splice(inx, 1);
        }
        if (questId == this.doingTrunkId) {
            this.doingTrunkId = 0;
        }
    }
    get mainQuests(): Protocol.QuestProgress[] {
        return this.mains;
    }
    private getQuests(questId: number): Protocol.QuestProgress[] {
        return this.mains;
    }
    private getIndex(questID: number, list: Protocol.QuestProgress[]): number {
        for (let i: number = 0, n = list.length; i < n; ++i) {
            let item = list[i];
            if (item != null && item.m_iQuestID == questID)
                return i;
        }
        return -1;
    }
}