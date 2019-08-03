import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { GuildExploreBaseLogic } from 'System/guild/view/GuildExploreBaseLogic'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from 'System/utils/DataFormatter'

export class GuildExploreRewardLogic extends GuildExploreBaseLogic {

    private accRewardIcon: IconItem;
    private no1RewardIcon: IconItem;

    initElements(elems: UiElements) {
        this.accRewardIcon = new IconItem();
        this.accRewardIcon.setUsualIconByPrefab(this.panel.itemIcon_Normal, elems.getElement('accReward'));
        this.accRewardIcon.setTipFrom(TipFrom.normal);
        this.no1RewardIcon = new IconItem();
        this.no1RewardIcon.setUsualIconByPrefab(this.panel.itemIcon_Normal, elems.getElement('no1Reward'));
        this.no1RewardIcon.setTipFrom(TipFrom.normal);
    }

    initListeners() {
        Game.UIClickListener.Get(this.panel.btnReward).onClick = delegate(this, this.onClickBtnReward);
    }

    onOpen() {
        super.onOpen();

        this.panel.textDesc.text = '领奖剩余时间';
        this.panel.fork.SetActive(false);
        this.panel.cost.SetActive(false);

        this.panel.monster.SetActive(false);
        this.panel.beauty.SetActive(true);
        this.panel.oldMan.SetActive(false);
        this.panel.master.SetActive(false);

        this.panel.btnGo.SetActive(false);
        this.panel.btnReward.SetActive(true);
        this.panel.btnRank.SetActive(true);

        this.onGuildExploreChanged();
    }

    onGuildExploreChanged() {
        super.onGuildExploreChanged();

        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let processCfg = this.panel.processCfg;

        let b = processCfg.m_astBonus[0];
        let myAcc = Math.floor(b.m_uiCount * exploreInfo.m_stPersonalData.m_uiContribution * (1 + exploreInfo.m_stPersonalData.m_iPersonalRewardChangeRate / 1000) / 10000);

        let cStr = TextFieldUtil.getColorText(uts.format('{0}/10000', exploreInfo.m_stPersonalData.m_uiContribution), Color.GREEN);
        let accStr = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, b.m_uiType) + '×' + TextFieldUtil.getColorText(DataFormatter.cutWan(myAcc), Color.BLUE);
        let str = uts.format('您的宗门贡献为{0}，获得以下奖励：\n累积奖励：{1}', cStr, accStr);
        if (exploreInfo.m_stPersonalData.m_ucSpecialRewardStatus != Macros.KF_ACT_STATUS_NONE) {
            str += '\n';
            str += TextFieldUtil.getColorText('桂冠奖励', Color.GOLD);
        }
        this.panel.textContent.text = str;

        if (exploreInfo.m_stPersonalData.m_ucRewardStatus == Macros.KF_ACT_STATUS_ARIVE ||
            exploreInfo.m_stPersonalData.m_ucSpecialRewardStatus == Macros.KF_ACT_STATUS_ARIVE) {
            UIUtils.setButtonClickAble(this.panel.btnReward, true);
            this.panel.labelBtnReward.text = '领取奖励';
        }
        else if (exploreInfo.m_stPersonalData.m_ucRewardStatus == Macros.KF_ACT_STATUS_NONE &&
            exploreInfo.m_stPersonalData.m_ucSpecialRewardStatus == Macros.KF_ACT_STATUS_NONE) {
            UIUtils.setButtonClickAble(this.panel.btnReward, false);
            this.panel.labelBtnReward.text = '未达成';
        } else {
            UIUtils.setButtonClickAble(this.panel.btnReward, false);
            this.panel.labelBtnReward.text = '已领取';
        }

        this.panel.textBeautyTalk.text = '大家辛苦了，是时候分配奖励了！';

        this.accRewardIcon.updateById(b.m_uiType, myAcc);
        this.accRewardIcon.updateIcon();

        this.no1RewardIcon.updateById(processCfg.m_uiSBonusType, processCfg.m_uiSBonusNum);
        this.no1RewardIcon.updateIcon();
    }

    onClickBtnReward() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;

        if (exploreInfo.m_stPersonalData.m_ucRewardStatus == Macros.KF_ACT_STATUS_ARIVE) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRewardRequest(Macros.GUILD_TREASURE_HUNT_REWARD_TYPE_NORMAL));
        }

        if (exploreInfo.m_stPersonalData.m_ucSpecialRewardStatus == Macros.KF_ACT_STATUS_ARIVE) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRewardRequest(Macros.GUILD_TREASURE_HUNT_REWARD_TYPE_SPECIAL));
        }
    }

    onClickBtnGo() {
    }

    onCurrencyChange(id: number) {
    }
}