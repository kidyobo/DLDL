import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { GuildView } from 'System/guild/view/GuildView';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';

export class GuildCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_GUILD);
        this.data.setDisplayName('宗门');
    }

    onStatusChange() {
        this.data.tipCount = (G.DataMgr.guildData.isShowGuildRankTipMark() ||
            G.GuideMgr.tipMarkCtrl.guildTipMark.ShowTip || (G.DataMgr.guildData.getGuildApplyCount() > 0 && G.DataMgr.guildData.isHasPos) ||
            TipMarkUtil.guildDailyGift() || TipMarkUtil.guildSkillCanStudy()
            /**TipMarkUtil.guildMonster() || G.DataMgr.runtime.paiMaiNeedTip*/) ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<GuildView>(GuildView).open();
    }
}