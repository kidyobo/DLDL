import { Global as G } from 'System/global'
import { QuestData } from "System/data/QuestData"
import { HeroData } from 'System/data/RoleData'
import { KeyWord } from 'System/constants/KeyWord'

export class AcceptableNormalQuests {
    private initedConstQuests: boolean = false;
    private constQuests: number[] = [];
    getAllQuests(heroData: HeroData): number[] {
        let questId = 0;
        let result: number[] = [];
        let quests = this.getConstIds();
        let configs = QuestData.getConfigMap();
        let questData = G.DataMgr.questData;
        for (let i = 0, n = quests.length; i < n; i++) {
            questId = quests[i];
            if (questData.canQuestAccept(configs[questId], heroData)) {
                result.push(questId);
            }
        }
        return result;
    }
    /** 静态的可以接受的questid列表 */
    private getConstIds(): number[] {
        let result = this.constQuests;
        if (!this.initedConstQuests) {
            this.initedConstQuests = true;
            let configMap = QuestData.getConfigMap();
            let questID: number = 0;
            let config: GameConfig.QuestConfigM = null;
            for (let id in configMap) {
                questID = Number(id);
                config = configMap[questID];
                if (KeyWord.QUEST_TYPE_BRANCH == config.m_ucQuestType || KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType ||
                    QuestData.isDailyQuestByType(config.m_ucQuestType) || QuestData.isSpecialQuestByType(config.m_ucQuestType)) {
                    continue;
                }
                else if (KeyWord.QUEST_TYPE_GUILD_DAILY == config.m_ucQuestType) { // 宗门任务
                    continue;
                }
                else if (KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType) { // 国运任务
                    continue;
                }
                else if (KeyWord.QUEST_TYPE_DAILY == config.m_ucQuestType) { // 日常任务
                    continue;
                }
                else if (KeyWord.QUEST_TYPE_TRUNK == config.m_ucQuestType) { // 主线任务
                    continue;
                }
                result.push(questID);
            }

            uts.assert(result.length == 0);
        }

        let newret = result.slice();
        let questData = G.DataMgr.questData;
        if (questData.nextGuildQuestID > 0) newret.push(questData.nextGuildQuestID); // 可接的宗门任务
        //if (questData.nextGuoYunQuestID > 0) newret.push(questData.nextGuoYunQuestID); // 可接的国运任务
        if (questData.nextDailyQuestId > 0) newret.push(questData.nextDailyQuestId); // 可接的日常任务
        let doingTrunk = questData.doingTrunk;
        let nextTrunk = questData.nextTrunk;
        if (doingTrunk > 0) newret.push(doingTrunk); // 正在进行的主线任务
        if (nextTrunk > 0 && nextTrunk != doingTrunk) newret.push(nextTrunk); // 下个可接的主线任务
        return newret;
    }
}