import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'

export class GuildPvpData {
    data: Protocol.GuildPVPBattleInfoRes;

    battleInfos: Protocol.GuildPVPBattleInfo[] = [];

    setData(info: Protocol.GuildPVPBattleInfoRes): void {
        this.data = info;
        let items: Protocol.GuildPVPBattleInfo[] = info.m_stGuildLeaderList;
        this.battleInfos.length = 0;
        if (items != null) {
            for (let item of items) {
                if (item == null)
                    continue;
                if (item.m_ucGrade == Macros.GUILD_GRADE_CHAIRMAN)
                    this.battleInfos[0] = item;
                else if (this.battleInfos[1] == null)
                    this.battleInfos[1] = item;
                else
                    this.battleInfos[2] = item;
            }
        }
       
        if (this.battleInfos[1] && this.battleInfos[2]) {
            if (this.battleInfos[1].m_stRoleID.m_uiUin > this.battleInfos[2].m_stRoleID.m_uiUin) {
                let tempItem: Protocol.GuildPVPBattleInfo = this.battleInfos[1];
                this.battleInfos[1] = this.battleInfos[2];
                this.battleInfos[2] = tempItem;
            }
        }  
    }

    afterGetReward() {
        if (null != this.data) {
            this.data.m_ucRewardState = 0;
        }
    }

    /** 是否可以领取奖励 */
    isGetReward(): boolean {
        let guildId: number = G.DataMgr.heroData.guildId;
        if (this.data == null) {          
            return false;
        }          
        if (guildId <= 0 || guildId != this.data.m_uiGuildID) {            
            return false;
        }       
        return this.data.m_ucRewardState == 1;
    }
}
