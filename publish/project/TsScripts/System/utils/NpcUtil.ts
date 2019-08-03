import { RegExpUtil } from "System/utils/RegExpUtil"
import { KeyWord } from "System/constants/KeyWord"
import { Global as G } from 'System/global'

export class NpcUtil {

    static  talkingList: Array<any> = [];

    public  NPCUtil()
    {

    }

     /**
     * 随机取得npc的对话内容
     * 这个函数应该放到 NPCConfig的类中
     * @param data
     * @return 
     * 
     */
    static getNPCTalking(data: GameConfig.NPCConfigM): string {

        this.talkingList.length = 0;

        if (data.m_szTalking1 != "") {
            this.talkingList.push(data.m_szTalking1);
        }

        if (data.m_szTalking2 != "") {
            this.talkingList.push(data.m_szTalking2);
        }
        if (data.m_szTalking3 != "") {
            this.talkingList.push(data.m_szTalking3);
        }

        if (this.talkingList.length == 0) {
            return "";
        }

        let random: number = Math.floor(Number(Math.random() * this.talkingList.length));
        return this.talkingList[random];
    }
	        
}