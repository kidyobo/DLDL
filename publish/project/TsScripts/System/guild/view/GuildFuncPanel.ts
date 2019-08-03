import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabForm } from 'System/uilib/TabForm'
import { UILayer } from 'System/uilib/CommonForm'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildDonateSubPanel } from 'System/guild/view/GuildDonateSubPanel'
import { GuildStoreSubPanel } from 'System/guild/view/GuildStoreSubPanel'
import { GuildGiftSubPanel } from 'System/guild/view/GuildGiftSubPanel'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'


export enum EnumGuildFuncSubTab {
    /**捐献*/
    donate = 1,
    /**仓库*/
    store,
    /**福利*/
    gift,
}

export class GuildFuncPanel extends TabForm {
    private openTab: EnumGuildFuncSubTab;
    
    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION, GuildDonateSubPanel, GuildStoreSubPanel, GuildGiftSubPanel);
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildFuncView;
    }

    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
    }

    protected onOpen() {
        super.onOpen();
        this.checkGiftStatus();
        this.switchTabFormById(this.openTab);
    }

    protected onClose() {
    }

    open(openTab: EnumGuildFuncSubTab = 0) {
        this.openTab = openTab;
        super.open();
    }
    
    private checkGiftStatus() {
        // 检查是否有礼包可领，在宗门礼包按钮上显示红点
        this.setTabTipMarkById(EnumGuildFuncSubTab.donate, TipMarkUtil.guildDailyGift());
        this.setTabTipMarkById(EnumGuildFuncSubTab.gift, TipMarkUtil.guildSkillCanStudy());
    }




    onDonateSuccess() {
        this.checkGiftStatus();
        let donatePanel = this.getTabFormByID(EnumGuildFuncSubTab.donate) as GuildDonateSubPanel;
        if (donatePanel.isOpened) {
            donatePanel.onDonateSuccess();
        }
    }

    updateDonateView() {
        let donatePanel = this.getTabFormByID(EnumGuildFuncSubTab.donate) as GuildDonateSubPanel;
        if (donatePanel.isOpened) {
            donatePanel.updateView();
        }
    }

    onGuildMembersChanged() {
        let donatePanel = this.getTabFormByID(EnumGuildFuncSubTab.donate) as GuildDonateSubPanel;
        if (donatePanel.isOpened) {
            donatePanel.updateDonateList();
        }
    }

    onStoreChanged() {
        this.checkGiftStatus();
        let storePanel = this.getTabFormByID(EnumGuildFuncSubTab.store) as GuildStoreSubPanel;
        if (storePanel.isOpened) {
            storePanel.onGuildStoreChanged();
        }
    }

    onStoreLogChanged() {
        let storePanel = this.getTabFormByID(EnumGuildFuncSubTab.store) as GuildStoreSubPanel;
        if (storePanel.isOpened) {
            storePanel.updateLogList();
        }
    }

    onGiftChanged() {
        this.checkGiftStatus();
        let giftPanel = this.getTabFormByID(EnumGuildFuncSubTab.gift) as GuildGiftSubPanel;
        if (giftPanel.isOpened) {
            giftPanel.updateView();
        }
        let donatePanel = this.getTabFormByID(EnumGuildFuncSubTab.donate) as GuildDonateSubPanel;
        if (donatePanel.isOpened) {
            donatePanel.updateGiftView();
        }
    }

    
}