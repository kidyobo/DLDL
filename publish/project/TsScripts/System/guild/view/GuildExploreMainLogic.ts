import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { GuildData } from 'System/data/GuildData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { GuildExploreBaseLogic } from 'System/guild/view/GuildExploreBaseLogic'

export class GuildExploreMainLogic extends GuildExploreBaseLogic {

    tabGroup: UnityEngine.UI.ActiveToggleGroup;
    conds: UnityEngine.GameObject[] = [];

    accRewardIcon: IconItem;
    no1RewardIcon: IconItem;

    textPrice: UnityEngine.UI.Text;
    textGxd: UnityEngine.UI.Text;

    btnGo: UnityEngine.GameObject;
    labelBtnGo: UnityEngine.UI.Text;

    initElements(elems: UiElements) {
        // tabgroup需要在active的情况下才能取得toggle
        this.tabGroup = elems.getToggleGroup('tabGroup');
        let guildData = G.DataMgr.guildData;
        for (let i = 0; i < GuildData.MaxExploreClass; i++) {
            let cfg = guildData.getExploreProgressCfg(i + 1);
            let textCond = ElemFinder.findText(this.tabGroup.GetToggle(i).gameObject, 'textCond');
            textCond.text = uts.format('宗门{0}级可探险', cfg.m_iOpenLevel);
            this.conds.push(textCond.gameObject);
        }

        this.accRewardIcon = new IconItem();
        this.accRewardIcon.setUsualIconByPrefab(this.panel.itemIcon_Normal, elems.getElement('accReward'));
        this.accRewardIcon.setTipFrom(TipFrom.normal);
        this.no1RewardIcon = new IconItem();
        this.no1RewardIcon.setUsualIconByPrefab(this.panel.itemIcon_Normal, elems.getElement('no1Reward'));
        this.no1RewardIcon.setTipFrom(TipFrom.normal);

        this.textPrice = elems.getText('textPrice');
        this.textGxd = elems.getText('textGxd');

        this.btnGo = elems.getElement('btnGo');
        this.labelBtnGo = elems.getText('labelBtnGo');
    }

    initListeners() {
        this.tabGroup.onValueChanged = delegate(this, this.onToggleGroup);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    onOpen() {
        super.onOpen();

        let guildData = G.DataMgr.guildData;
        let lv = guildData.guildLevel;
        for (let i = 0; i < GuildData.MaxExploreClass; i++) {
            let cfg = guildData.getExploreProgressCfg(i + 1);
            this.conds[i].SetActive(lv < cfg.m_iOpenLevel);
        }

        let autoIdx = 0;
        this.tabGroup.Selected = autoIdx;
        this.onToggleGroup(autoIdx);
    }

    onGuildExploreChanged() {
        super.onGuildExploreChanged();
    }

    onCurrencyChange(id: number) {
        if (KeyWord.GUILD_CONTRIBUTE_ID == id) {
            let guildData = G.DataMgr.guildData;
            let cfg = guildData.getExploreProgressCfg(this.tabGroup.Selected + 1);
            let gxd = G.DataMgr.heroData.guildDonateCur;
            let color = gxd >= cfg.m_iOpenCostNum ? Color.GREEN : Color.RED;
            this.textPrice.text = uts.format('开启探险所需贡献度：{0}', TextFieldUtil.getColorText(cfg.m_iOpenCostNum.toString(), color));
            this.textGxd.text = uts.format('我的贡献度：{0}', TextFieldUtil.getColorText(gxd.toString(), color));
            UIUtils.setButtonClickAble(this.btnGo, gxd >= cfg.m_iOpenCostNum);
        }
    }

    private onToggleGroup(index: number) {
        let guildData = G.DataMgr.guildData;
        let cfg = guildData.getExploreProgressCfg(index + 1);

        let b = cfg.m_astBonus[0];
        this.accRewardIcon.updateById(b.m_uiType, b.m_uiCount);
        this.accRewardIcon.updateIcon();

        this.no1RewardIcon.updateById(cfg.m_uiSBonusType, cfg.m_uiSBonusNum);
        this.no1RewardIcon.updateIcon();

        this.onCurrencyChange(KeyWord.GUILD_CONTRIBUTE_ID);

        UIUtils.setButtonClickAble(this.btnGo, guildData.guildLevel >= cfg.m_iOpenLevel);
    }

    onClickBtnGo() {
        let guildData = G.DataMgr.guildData;
        let cfg = guildData.getExploreProgressCfg(this.tabGroup.Selected + 1);
        if (guildData.isManager) {
            let str: string = uts.format('是否消耗{0}贡献度开启探险？', cfg.m_iOpenCostNum,);
            G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirm));
        } else {
            G.TipMgr.addMainFloatTip('仅宗主或副宗主可开启探险');
        }
    }

    private onConfirm(state: MessageBoxConst = 0, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            let guildData = G.DataMgr.guildData;
            let cfg = guildData.getExploreProgressCfg(this.tabGroup.Selected + 1);
            if (0 == G.ActionHandler.getLackNum(cfg.m_iOpenCostID, cfg.m_iOpenCostNum, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_START, 0, cfg.m_uiDifficluty));
            }
        }
    }

    onTickTimer(timer: Game.Timer) {
    }
}