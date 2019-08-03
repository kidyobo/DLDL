import { QuestTrackUserData } from 'System/quest/QuestTrackUserData'
import { QuestData } from 'System/data/QuestData'
import { KeyWord } from 'System/constants/KeyWord'

export class QuestUtil {
    static canUseXiaofeixie(questConfig: GameConfig.QuestConfigM, nodeIdx: number): boolean {
        let questNodeClient = questConfig.m_astQuestNodeConfig[nodeIdx];
        return KeyWord.QUEST_NODE_ENMITY_MONSTER != questNodeClient.m_ucType && KeyWord.QUEST_NODE_ENMITY_MONSTER_SHARE != questNodeClient.m_ucType && KeyWord.QUEST_NODE_LEVELUP != questNodeClient.m_ucType;
    }
}