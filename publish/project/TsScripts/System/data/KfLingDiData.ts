import { EnumRewardState } from 'System/constants/GameEnum';
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';

export class KfLingDiData {

    //写死开服第六天开启
    static readonly ACTIVITY_FIRST_OPEN_DAY: number = 6;
    static readonly CITY_COUNT: number = 7;
    static readonly REWARD_SCORE_GROUP: number[] = [Macros.ZZHC_ROLE_REWARD_SCORE_1, Macros.ZZHC_ROLE_REWARD_SCORE_2,
    Macros.ZZHC_ROLE_REWARD_SCORE_3];
    static readonly REWARD_ID_GROUP: number[] = [Macros.ZZHC_ROLE_REWARD_ITEM_1, Macros.ZZHC_ROLE_REWARD_ITEM_2,
    Macros.ZZHC_ROLE_REWARD_ITEM_3];
    static readonly REWARD_TYPE_GROUP: number[] = [Macros.ZZHC_ROLE_REWARD_TYPE_1, Macros.ZZHC_ROLE_REWARD_TYPE_2,
    Macros.ZZHC_ROLE_REWARD_TYPE_3];
    static readonly GUILD_MONSTER_REWARD_ID_GROUP: number[] = [Macros.ZZHC_GUILD_REWARD_ITEM_1,
    Macros.ZZHC_GUILD_REWARD_ITEM_2, Macros.ZZHC_GUILD_REWARD_ITEM_3, Macros.ZZHC_GUILD_REWARD_ITEM_4];
    static readonly PREVIEW_REWARD_NAME_GROUP: string[] = [
        'reward_mainCity_leader', 'reward_mainCity_member',
        'reward_middleCity_leader', 'reward_middleCity_member',
        'reward_subCity_leader', 'reward_subCity_member',
        'reward_mainCity_day', 'reward_middleCity_day',
        'reward_subCity_day', 'reward_day'
    ];
    static readonly PREVIEW_REWARD_ID_GROUP: number[] = [
        60009029, 60009030, 60009031,
        60009032, 60009033, 60009034,
        60009035, 60009036, 60009037,
        60009038];
    static readonly VICTORY_REWARD_ID_GROUP: number[] = [
        60009039, 60009040, 60009040,
        60009041, 60009041, 60009041,
        60009041, 60009041, 60009041,
        60009041];
    static readonly TREASURE_BOX_COUNT: number = 3;
    static readonly RULE_ID: number = 404;
    static readonly MAIN_CITY_ID: number = 1;
    private _panelInfo: Protocol.CSZZHCPannelInfo;

    private _rewardStatus: number[] = [-1, -1, -1];

    get PanelInfo(): Protocol.CSZZHCPannelInfo {
        return this._panelInfo;
    }

    set PanelInfo(value: Protocol.CSZZHCPannelInfo) {
        this._panelInfo = value;
        this.updateRewardStatus();
    }

    get RewardStatus(): number[] {
        return this._rewardStatus;
    }

    updateRewardStatus(type?: number) {
        //领取后刷新状态
        if (type > 0) {
            this._rewardStatus[type - 1] = EnumRewardState.HasGot;
            return;
        }

        //打开面板刷新状态
        let gotStaus = [this._panelInfo.m_b1stReward, this._panelInfo.m_b2ndReward,
        this._panelInfo.m_b3rdReward];

        for (let i = 0; i < KfLingDiData.TREASURE_BOX_COUNT; i++) {
            if (gotStaus[i]) {
                this._rewardStatus[i] = EnumRewardState.HasGot;
                continue;
            }

            if (this._panelInfo.m_iScore >= KfLingDiData.REWARD_SCORE_GROUP[i]) {
                this._rewardStatus[i] = EnumRewardState.NotGot;
                continue;
            }

            this._rewardStatus[i] = EnumRewardState.NotReach;
        }
    }

    hasReward(): boolean {
        for (let value of this._rewardStatus) {
            if (value == EnumRewardState.NotGot) return true;
        }
        return false;
    }

    isTakeUpSubCity(): boolean {
        let cityInfo = this._panelInfo.m_stCityData.m_stRankList;
        for (let i = 1; i < cityInfo.length; i++) {
            if (G.DataMgr.heroData.guildId == cityInfo[i].m_uiGuildID) return true;
        }
        return false;
    }

    getCurTakeUpCityIndex(): number {
        if (!this._panelInfo || !this._panelInfo.m_stCityData) return -1;
        let cityInfos = this._panelInfo.m_stCityData.m_stRankList;
        for (let i = 0; i < cityInfos.length; i++) {
            let info = cityInfos[i];
            if (G.DataMgr.heroData.guildId == info.m_uiGuildID) return i;
        }

        return -1;
    }
}