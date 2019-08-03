import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildData } from 'System/data/GuildData'
import { TipFrom } from 'System/tip/view/TipsView'
import { GuildExploreBaseLogic } from 'System/guild/view/GuildExploreBaseLogic'
import { PriceBar } from 'System/business/view/PriceBar'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { DataFormatter } from 'System/utils/DataFormatter'

class ExploreDonateItem {
    private costs: UnityEngine.GameObject[] = [];
    private priceBar: PriceBar;

    gameObject: UnityEngine.GameObject;

    private id = 0;
    private cfg: GameConfig.GuildTreasureHuntDonationCost;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        let costs = ElemFinder.findObject(go, 'costs');
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            this.costs.push(ElemFinder.findObject(costs, i.toString()));
        }
        this.priceBar = new PriceBar();
        this.priceBar.setComponents(ElemFinder.findObject(go, 'priceBar'));
    }

    update(id: number, cfg: GameConfig.GuildTreasureHuntDonationCost, isEnough: boolean) {
        this.id = id;
        this.cfg = cfg;
        this.priceBar.setCurrencyID(id, true, true);
        this.priceBar.setPrice(cfg.m_uiNum, isEnough ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH);
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            this.costs[i].SetActive(i < cfg.m_uiCost);
        }
    }

    get Id(): number {
        return this.id;
    }

    get Cfg(): GameConfig.GuildTreasureHuntDonationCost {
        return this.cfg;
    }
}

export class GuildExploreDonateLogic extends GuildExploreBaseLogic {

    private readonly DonateKindCnt = 4;

    private static NoPromp = false;

    private donateGroup: UnityEngine.UI.ActiveToggleGroup;
    private items: ExploreDonateItem[] = [];

    private priceBar: PriceBar;

    initElements(elems: UiElements) {
        // tabgroup需要在active的情况下才能取得toggle
        this.panel.master.SetActive(true);
        this.donateGroup = elems.getToggleGroup('donateGroup');
        for (let i = 0; i < this.DonateKindCnt; i++) {
            let item = new ExploreDonateItem();
            item.setComponents(this.donateGroup.GetToggle(i).gameObject);
            this.items.push(item);
        }

        this.priceBar = new PriceBar();
        this.priceBar.setComponents(elems.getElement('priceBar'));
    }

    initListeners() {
        this.donateGroup.onValueChanged = delegate(this, this.onToggleGroup);
    }

    onOpen() {
        super.onOpen();

        this.panel.labelBtnGo.text = '捐献';
        this.panel.textContent.text = '宗门探险需要您的捐赠，请在左侧选择任一额度，然后点击捐赠按钮';
        this.panel.fork.SetActive(false);
        this.panel.cost.SetActive(true);

        this.panel.monster.SetActive(false);
        this.panel.beauty.SetActive(false);
        this.panel.oldMan.SetActive(false);
        this.panel.master.SetActive(true);

        this.panel.btnGo.SetActive(true);
        this.panel.btnReward.SetActive(false);
        this.panel.btnRank.SetActive(true);

        this.onGuildExploreChanged();
    }

    onGuildExploreChanged() {
        super.onGuildExploreChanged();

        this.onCurrencyChange(0);

        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let config = guildData.getExploreEventCfg(exploreInfo.m_stCommonData.m_uiEventID);

        this.panel.textSlider.text = uts.format('总进度：{0}/{1}', exploreInfo.m_stCommonData.m_stEventData.m_stEventDonationData.m_uiDonationNumber, config.m_uiTargetNum);
        this.panel.slider.value = exploreInfo.m_stCommonData.m_stEventData.m_stEventDonationData.m_uiDonationNumber / config.m_uiTargetNum;

        this.donateGroup.Selected = 0;
    }

    onCurrencyChange(id: number) {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let config = this.panel.config;
        let myOwn = G.DataMgr.getOwnValueByID(config.m_uiTarget);
        for (let i = 0; i < this.DonateKindCnt; i++) {
            let item = this.items[i];
            if (config.m_astDonation[i].m_uiNum > 0) {
                item.update(config.m_uiTarget, config.m_astDonation[i], myOwn >= config.m_astDonation[i].m_uiNum);
                item.gameObject.SetActive(true);
            } else {
                item.gameObject.SetActive(false);
            }
        }

        this.priceBar.setCurrencyID(config.m_uiTarget, true, true);
        this.priceBar.setPrice(myOwn);
    }

    private onToggleGroup(index: number) {
        let item = this.items[index];
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            this.panel.costEnergies[i].SetActive(i < item.Cfg.m_uiCost);
        }
    }

    onClickBtnGo() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let config = guildData.getExploreEventCfg(exploreInfo.m_stCommonData.m_uiEventID);

        let idx = this.donateGroup.Selected;
        let item = this.items[idx];
        if (exploreInfo.m_stPersonalData.m_uiPower < item.Cfg.m_uiCost) {
            G.TipMgr.addMainFloatTip('体力不足，无法捐献');
        }
        else if (G.DataMgr.getOwnValueByID(item.Id) < item.Cfg.m_uiNum) {
            G.TipMgr.addMainFloatTip(uts.format('{0}不足，无法捐献', KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, item.Id)));
        }
        else {
            if (GuildExploreDonateLogic.NoPromp) {
                this.onConfirm(MessageBoxConst.yes, true, config, idx);
            }
            else {
                let str = uts.format('是否消耗{0}体力捐献{1}{2}?', TextFieldUtil.getColorText(item.Cfg.m_uiCost.toString(), Color.GOLD), TextFieldUtil.getColorText(DataFormatter.cutWan(item.Cfg.m_uiNum), Color.GREEN),
                    KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, item.Id));
                G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirm, config, idx));
            }
        }
    }

    private onConfirm(state: MessageBoxConst = 0, isCheckSelected: boolean, config: GameConfig.GuildTreasureHuntEventM, idx: number): void {
        if (MessageBoxConst.yes == state) {
            GuildExploreDonateLogic.NoPromp = isCheckSelected;
            if (0 == G.ActionHandler.getLackNum(config.m_uiTarget, config.m_astDonation[idx].m_uiNum, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_DONATE, config.m_iID, config.m_uiDifficulty, idx, 1));
            }
        }
    }
}