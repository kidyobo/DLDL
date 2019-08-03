import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { EnumGuildJingPaiSubTab } from 'System/guild/view/GuildJingPaiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildJingPaiSubBasePanel } from 'System/guild/view/GuildJingPaiSubBasePanel'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


export class GuildJingPaiSubMine extends GuildJingPaiSubBasePanel {


    constructor() {
        super(EnumGuildJingPaiSubTab.mine);
    }

    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
    }

    protected onOpen() {
        super.onOpen();
        //this.btnJinPai.SetActive(false);
        //this.btnYiKouJia.SetActive(false);
        this.isMineList = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_SELF));
    }

    protected onClose() {
        super.onClose();
    }


    //protected onClickRule() {
    //    G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(415), '玩法说明');
    //}


    protected onClickJK() {

    }


    protected onClickYKJ() {

    }
   
}