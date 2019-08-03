import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GuildDonateSubPanel } from 'System/guild/view/GuildDonateSubPanel'
import { GuildStoreSubPanel } from 'System/guild/view/GuildStoreSubPanel'
import { GuildGiftSubPanel } from 'System/guild/view/GuildGiftSubPanel'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { ChannelClean } from 'System/chat/ChannelClean'
import { CharLenUtil } from 'System/utils/CharLenUtil'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildJingPaiSubGuild } from 'System/guild/view/GuildJingPaiSubGuild'
import { GuildJingPaiSubWorld } from 'System/guild/view/GuildJingPaiSubWorld'
import { GuildJingPaiSubMine } from 'System/guild/view/GuildJingPaiSubMine'
import { GuildJingPaiSubSource } from 'System/guild/view/GuildJingPaiSubSource'
import { GuildView } from 'System/guild/view/GuildView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'

export enum EnumGuildJingPaiSubTab {
    /**宗门竞拍*/
    guild = 1,
    /**世界竞拍*/
    world,
    /**我的竞拍*/
    mine,
    /**竞拍来源*/
    source,
}

export class GuildJingPaiPanel extends TabForm {

    private openTab: EnumGuildJingPaiSubTab = EnumGuildJingPaiSubTab.guild;
    private btnRule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, GuildJingPaiSubGuild, GuildJingPaiSubWorld, GuildJingPaiSubMine, GuildJingPaiSubSource);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildJingPaiPanel;
    }

    protected initElements() {
        super.initElements();
        this.btnRule = this.elems.getElement("btnRule");
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnRule, this.onClickRule);
    }

    open(openTab: EnumGuildJingPaiSubTab = EnumGuildJingPaiSubTab.guild) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        super.onOpen();
        // 选中指定的页签
        this.switchTabFormById(this.openTab);

        //打开竞拍面板，就取消红点
        G.DataMgr.runtime.paiMaiNeedTip = false;
        G.Uimgr.getForm<GuildView>(GuildView).updateGuildPaiMaiTipMark();
        G.NoticeCtrl.checkPaiMai();
        G.GuideMgr.tipMarkCtrl.onGuildPaiMaiChange();
    }


    onGuildPaiMaiInfoChanged(type: number) {
        switch (type) {
            case Macros.GUILD_PAIMAI_OPEN_GUILD:
            case Macros.GUILD_PAIMAI_BUY_GUILD:
                this.onPaiMaiGuildChanged();
                break;
            case Macros.GUILD_PAIMAI_OPEN_WORLD:
            case Macros.GUILD_PAIMAI_BUY_WORLD:
                this.onPaiMaiWorldChanged();
                break;
            case Macros.GUILD_PAIMAI_SELF:
            case Macros.GUILD_PAIMAI_INGORE:
                this.onPaiMaiMineChanged();
                break;
        }

    }

    onPaiMaiGuildChanged() {
        let subPanel = this.getTabFormByID(EnumGuildJingPaiSubTab.guild) as GuildJingPaiSubGuild;
        if (subPanel.isOpened) {
            subPanel.updatePanel();
        }
        //在我的竞拍界面购买的，需要刷新
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_SELF));
    }

    onPaiMaiWorldChanged() {
        let subPanel = this.getTabFormByID(EnumGuildJingPaiSubTab.world) as GuildJingPaiSubWorld;
        if (subPanel.isOpened) {
            subPanel.updatePanel();
        }
        //在我的竞拍界面购买的，需要刷新
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_SELF));
    }

    onPaiMaiMineChanged() {
        let subPanel = this.getTabFormByID(EnumGuildJingPaiSubTab.mine) as GuildJingPaiSubMine;
        if (subPanel.isOpened) {
            subPanel.updatePanel();
        }
    }


    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(415), '玩法说明');
    }

}