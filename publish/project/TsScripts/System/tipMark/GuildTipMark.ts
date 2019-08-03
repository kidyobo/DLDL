import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class GuildTipMark extends BaseTipMark {

    constructor() {
        super(false);
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_GUILD];
        this.concernedCurrencys = [KeyWord.GUILD_CONTRIBUTE_ID];
        this.sensitiveToGuildApply = true;
        this.sensitiveToGuildGift = true;
        this.sensitiveToGuildPaiMai = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_GUILD;
    }

    protected doCheck(): boolean {
        return ((G.DataMgr.guildData.getGuildApplyCount() > 0 && G.DataMgr.guildData.isHasPos) ||
            TipMarkUtil.guildDailyGift() || TipMarkUtil.guildSkillCanStudy()/** || TipMarkUtil.guildExplore() || G.DataMgr.runtime.paiMaiNeedTip*/);
    }

    get TipName(): string {
        return '宗门提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_GUILD);
    }
}