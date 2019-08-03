import { EnumGuide } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { IGuideExecutor } from "System/guide/IGuideExecutor";
import { GuildEnterPanel } from "System/guild/view/GuildEnterPanel";
import { GuildExplorePanel } from "System/guild/view/GuildExplorePanel";
import { GuildFuncPanel } from "System/guild/view/GuildFuncPanel";
import { GuildInfoPanel } from "System/guild/view/GuildInfoPanel";
import { GuildJingPaiPanel } from "System/guild/view/GuildJingPaiPanel";
import { GuildListPanel } from "System/guild/view/GuildListPanel";
import { GuildRankPanel } from "System/guild/view/GuildRankPanel";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipMarkUtil } from "System/tipMark/TipMarkUtil";
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from "../../uilib/CurrencyTip";
import { TabFormCommom } from "../../uilib/TabFormCommom";
import { GuildMonsterPanel } from "./GuildMonsterPanel";


export class GuildView extends TabFormCommom implements IGuideExecutor {

    private openTab: number;
    private subClass: number;

    btnReturn: UnityEngine.GameObject;
    private currencyTip: CurrencyTip;


    constructor() {
        super(KeyWord.BAR_FUNCTION_GUILD, GuildEnterPanel, GuildInfoPanel, GuildFuncPanel, GuildListPanel,
            GuildRankPanel, GuildMonsterPanel, GuildExplorePanel, GuildJingPaiPanel);
        this.openSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildView;
    }

    protected initElements() {
        super.initElements();
        this.setTabGroupNanme(["宗门", "信息", "功能", "列表", "排行", "守护", "训练", "拍卖"]);
        this.setTitleName("宗门");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.btnReturn = this.getCloseButton();
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
    }


    open(openTab: number = 0, subClass: number = 0) {
        this.openTab = openTab;
        this.subClass = subClass;
        super.open();
    }

    onOpen() {
        super.onOpen();
        this.autoOpenTab();
        this.onMoneyChange();

        // 拉取宗门排行 红点，不拉没有
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_MONEY_RANK_LIST));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreOpenRequest());
    }

    private autoOpenTab() {
        // 如果没有宗门，只显示宗门列表
        let funcLimitData = G.DataMgr.funcLimitData;

        for (let i = 0; i < this.TabSize; i++) {
            let funcId = this.tabIds[i];
            let toggle = this.tabGroup.GetToggle(i);
            let isShow = false;
            if (G.DataMgr.heroData.guildId <= 0) {
                isShow = KeyWord.OTHER_FUNCTION_GUILD_ENTER == funcId;
            } else {
                isShow = KeyWord.OTHER_FUNCTION_GUILD_ENTER != funcId && funcLimitData.isFuncEntranceVisible(funcId);
            }
            toggle.gameObject.SetActive(isShow);
            if (!isShow && funcId == this.openTab) {
                this.openTab = 0;
            }
        }

        if (G.DataMgr.heroData.guildId <= 0) {
            this.openTab = KeyWord.OTHER_FUNCTION_GUILD_ENTER;
        }

        // 选中指定的页签
        this.switchTabFormById(this.openTab, this.subClass);
        this._updateTabTipMaker();
        this.updateGuildPaiMaiTipMark();
    }

    private _updateTabTipMaker() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, TipMarkUtil.guildMonster());
    }

    updateGuildPaiMaiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, G.DataMgr.runtime.paiMaiNeedTip);
    }

    protected onClose() {
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.Guild, EnumGuide.Guild_ClickClose);
    }

    /**
     * 创建宗门成功
     */
    onGuildEnterSuccess() {
        // 自动显示宗门信息
        this.openTab = KeyWord.OTHER_FUNCTION_GUILD_INFO;
        this.autoOpenTab();
    }

    /**
     * 宗门信息变化
     */
    onGuildInfoChanged() {
        this.checkGiftStatus();
        let infoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_INFO) as GuildInfoPanel;
        if (infoPanel.isOpened) {
            infoPanel.onGuildInfoChanged();
        }
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.updateDonateView();
        }
    }

    onGuildDonateChanged() {
        this.checkGiftStatus();
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.onDonateSuccess();
        }
    }

    /**
     * 每日礼包变化。
     */
    onDailyGiftChanged() {
        this.checkGiftStatus();
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.onGiftChanged();
        }
    }

    /**
     * 宗门成员变化
     */
    onGuildMembersChanged() {
        let infoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_INFO) as GuildInfoPanel;
        if (infoPanel.isOpened) {
            infoPanel.onGuildMembersChanged();
        } else {
            let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
            if (funcPanel.isOpened) {
                funcPanel.onGuildMembersChanged();
            }
        }
    }

    /**
     * 申请数据变化
     */
    onApplicationChanged() {
        // 成员页签上显示红点
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_INFO, G.DataMgr.guildData.getGuildApplyCount() > 0);
        let infoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_INFO) as GuildInfoPanel;
        if (infoPanel.isOpened) {
            infoPanel.onGuildMembersChanged();
        }
    }

    /**
     * 捐献成功
     */
    onDonateSuccess() {
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.onDonateSuccess();
        }
    }

    /**
     * 宗门仓库数据变化
     */
    onGuildStoreChanged() {
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.onStoreChanged();
        }
    }

    /**
     * 工会仓库日志数据变化
     */
    onGuildStoreLogChanged() {
        let funcPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION) as GuildFuncPanel;
        if (funcPanel.isOpened) {
            funcPanel.onStoreLogChanged();
        }
    }

    /**
     * 宗门列表数据变化
     */
    onGuildListChanged() {
        let enterPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_ENTER) as GuildEnterPanel;
        if (enterPanel.isOpened) {
            enterPanel.updateView();
        }
        let listPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_LIST) as GuildListPanel;
        if (listPanel.isOpened) {
            listPanel.updateView();
        }
    }

    /**
     * 自己的宗门职位变化
     */
    onGuildGradeChanged() {
        let infoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_INFO) as GuildInfoPanel;
        if (infoPanel.isOpened) {
            infoPanel.onGuildMembersChanged();
        }
    }

    /**
     * 货币变化
     */
    onCurrencyChange(id: number) {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, TipMarkUtil.guildMonster());

        let infoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_INFO) as GuildInfoPanel;
        if (infoPanel.isOpened) {
            infoPanel.onGuildInfoChanged();
            return;
        }

        let explorePanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_EXPLORE) as GuildExplorePanel;
        if (explorePanel.isOpened) {
            explorePanel.onCurrencyChange(id);
            return;
        }

        let monsterPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU) as GuildMonsterPanel;
        if (monsterPanel.isOpened) {
            monsterPanel.updateJingPoPart();
            return;
        }
    }

    /**
     * 宗门资金列表，获取奖励
     */
    onGuildRankChanged() {
        let rankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_RANK) as GuildRankPanel;
        if (rankPanel.isOpened) {
            rankPanel.updataPanel();
        }
        this.checkGuildRankStatus();
    }

    /**
     * 宗门探险变化
     */
    onGuildExploreChanged() {
        if (G.DataMgr.heroData.guildId <= 0) {
            return;
        }

        let explorePanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_EXPLORE) as GuildExplorePanel;
        if (explorePanel.isOpened) {
            explorePanel.onGuildExploreChanged();
        }

        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_EXPLORE, TipMarkUtil.guildExplore());
    }

    /**
     * 宗门神兽面板刷新
     */
    onGuildMonsterPanelUpdate() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, TipMarkUtil.guildMonster());

        let monsterPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU) as GuildMonsterPanel;
        if (!monsterPanel.isOpened) return;
        monsterPanel.updataPanel();
    }

    /**
     * 宗门神兽面板刷新
     */
    onGuildMonsterFeedUpdate() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, TipMarkUtil.guildMonster());

        let monsterPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU) as GuildMonsterPanel;
        if (!monsterPanel.isOpened) return;
        monsterPanel.updateFeedPanel();
    }

    /**
     * 宗门神兽面板刷新
     */
    onGuildMonsterRewardUpdate() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, TipMarkUtil.guildMonster());

        let monsterPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU) as GuildMonsterPanel;
        if (!monsterPanel.isOpened) return;
        monsterPanel.updateTreasureBox();
    }

    private checkGiftStatus() {
        // 检查是否可以领礼包，在信息页签上显示红点
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_FUNCTION, TipMarkUtil.guildDailyGift() || TipMarkUtil.guildSkillCanStudy());
    }

    /**
     * 宗门资金红点
     */
    private checkGuildRankStatus() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GUILD_RANK, G.DataMgr.guildData.isShowGuildRankTipMark());
    }

    private onClickReturnBtn() {
        this.close();
    }


    /**
     * 宗门拍卖信息
     */
    onGuildPaiMaiInfoChanged(type: number) {
        let paiMaiPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI) as GuildJingPaiPanel;
        if (paiMaiPanel.isOpened) {
            paiMaiPanel.onGuildPaiMaiInfoChanged(type);
        }
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }



    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.Guild_ClickClose == step) {
            this.onClickReturnBtn();
            return true;
        }
        return false;
    }
}