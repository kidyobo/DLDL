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

export class GuildExploreMoveLogic extends GuildExploreBaseLogic {

    initElements(elems: UiElements) {
    }

    initListeners() {
    }

    onOpen() {
        super.onOpen();

        this.panel.textOldManTalk.text = '最终探索到什么，让我们拭目以待！';
        this.panel.textDesc.text = '探索剩余时间';
        this.panel.fork.SetActive(false);
        this.panel.cost.SetActive(false);

        this.panel.monster.SetActive(false);
        this.panel.beauty.SetActive(false);
        this.panel.oldMan.SetActive(true);
        this.panel.master.SetActive(false);

        this.panel.btnGo.SetActive(false);
        this.panel.btnReward.SetActive(false);
        this.panel.btnRank.SetActive(true);

        this.onGuildExploreChanged();
    }

    onGuildExploreChanged() {
        super.onGuildExploreChanged();

        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;

        let c: string;
        if (exploreInfo.m_stCommonData.m_ucStep == this.panel.processCfg.m_uiPointCount - 1) {
            let pct = Math.floor(Math.abs(exploreInfo.m_stCommonData.m_iRewardChangeRate - exploreInfo.m_stCommonData.m_iLastRewardChangeRate) / 10);
            if (exploreInfo.m_stCommonData.m_iRewardChangeRate - exploreInfo.m_stCommonData.m_iLastRewardChangeRate > 0) {
                c = uts.format('发财啦，奖励增加{0}%!', TextFieldUtil.getColorText(pct.toString(), Color.GOLD));
            }
            else {
                c = uts.format('奖励损失{0}%，认栽吧少年。', TextFieldUtil.getColorText(pct.toString(), Color.RED));
            }
        } else {
            c = '探索队伍正在前往宝藏深处，请耐心等候';
        }
        this.panel.textContent.text = c;
    }

    private onClickBtnChoice(choice: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_SELECT, this.panel.config.m_iID, this.panel.config.m_uiDifficulty, choice));
    }

    onClickBtnGo() {
    }

    onCurrencyChange(id: number) {
    }
}