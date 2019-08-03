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

export class GuildExploreForkLogic extends GuildExploreBaseLogic {

    private readonly TickTimerKey = 'TickTimerKey';

    private btnLeft: UnityEngine.GameObject;
    private btnRight: UnityEngine.GameObject;

    private left: UnityEngine.GameObject;
    private right: UnityEngine.GameObject;

    initElements(elems: UiElements) {
        this.btnLeft = elems.getElement('btnLeft');
        this.btnRight = elems.getElement('btnRight');

        this.left = elems.getElement('left');
        this.right = elems.getElement('right');
    }

    initListeners() {
        Game.UIClickListener.Get(this.btnLeft).onClick = delegate(this, this.onClickBtnChoice, 1);
        Game.UIClickListener.Get(this.btnRight).onClick = delegate(this, this.onClickBtnChoice, 2);
    }

    onOpen() {
        super.onOpen();

        this.panel.textOldManTalk.text = '人生总是面临选择，谁都无法例外。';
        this.panel.textDesc.text = '选择剩余时间';
        this.panel.fork.SetActive(true);
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
        let config = this.panel.config;

        let c = config.m_szName;
        c += '\n';
        c += '←' + config.m_szSelectDes1;
        c += '\n';
        c += '        ' + config.m_szSelectDes2 + '→';
        this.panel.textContent.text = c;

        let selectNo = exploreInfo.m_stPersonalData.m_stEventData.m_ucSelectNo;
        this.left.SetActive(selectNo == Macros.GUILD_TREASURE_HUNT_SELECT_NO1);
        this.right.SetActive(selectNo == Macros.GUILD_TREASURE_HUNT_SELECT_NO2);
        UIUtils.setButtonClickAble(this.btnLeft, selectNo == 0);
        UIUtils.setButtonClickAble(this.btnRight, selectNo == 0);
    }

    private onClickBtnChoice(choice: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreEventRequest(Macros.GUILD_TREASURE_HUNT_EVENT_OP_SELECT, this.panel.config.m_iID, this.panel.config.m_uiDifficulty, choice));
    }

    onClickBtnGo() {
    }

    onCurrencyChange(id: number) {
    }
}