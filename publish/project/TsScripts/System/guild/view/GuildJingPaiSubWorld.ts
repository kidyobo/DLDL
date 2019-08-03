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


export class GuildJingPaiSubWorld extends GuildJingPaiSubBasePanel {


    constructor() {
        super(EnumGuildJingPaiSubTab.world);
    }

   

    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_OPEN_WORLD));
    }

    protected onClose() {
        super.onClose();
    }


    //protected onClickRule() {
    //    G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(413), '玩法说明');
    //}


    protected onClickJK() {

    }


    protected onClickYKJ() {

    }
   
}