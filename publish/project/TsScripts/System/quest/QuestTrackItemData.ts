import { EnumQuestState } from 'System/constants/GameEnum'

/**
* 任务追踪栏Item的绑定数据。
* @author teppei
* 
*/
export class QuestTrackItemData {
    title: string;
    desc: string;
    id: number = 0;
    questType: number = 0;

    /**
     *任务完成状态
     */
    state: EnumQuestState = 0;

    progress: Protocol.QuestProgress;

    constructor(id: number, title: string, questType: number, state: number, desc: string) {
        this.id = id;
        this.title = title;
        this.questType = questType;
        this.state = state;
        this.desc = desc;
    }

    toString(): string {
        let s = this.questType + '|' + this.id + '|' + this.state + '|';
        if (EnumQuestState.Doing == this.state) {
            s += this.progress.m_astNodeProgress[0].m_shProgressValue + '|';
        }
        s += this.title + '|' + this.desc;
        return s;
    }
}
