import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export class BossZhaoHuanData {

    BossSummonPanelInfo: Protocol.BossSummonPanelInfo;
    private readonly KFBOSS_SUMMON_NEED: number[] = [1, 5, 10];

    updateBossZhaoHuanInfo(m_stOpenBossZHPanelRsp:Protocol.BossSummonPanelInfo)
    {
        this.BossSummonPanelInfo = m_stOpenBossZHPanelRsp;
    }

    isHasZhaoHuanBoss() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_BOSS_SUMMON)) {
            return false;
        }
        if (!this.BossSummonPanelInfo || !this.BossSummonPanelInfo.m_SummonBossList)
            return false;
        for (let i = 0; i < this.BossSummonPanelInfo.m_SummonBossList.m_iBossTypeNum; i++) {
            let info = this.BossSummonPanelInfo.m_SummonBossList.m_astBossList[i];
            if (info.m_iBossNumber > 0) {
                return true;
            }
        }
        return false;
    }

    isWarn() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_BOSS_SUMMON)) {
            return false;
        }
        if (!this.BossSummonPanelInfo)
            return false;
        for (let i = 0; i < this.BossSummonPanelInfo.m_SummonBossList.m_iBossTypeNum; i++) {

            if (this.KFBOSS_SUMMON_NEED[i] <= this.BossSummonPanelInfo.m_uiLeftValue && 0 == (this.BossSummonPanelInfo.m_usWarnSelect & 1 << i)) {
                return true;
            }
        }
        return false;
    }
}
