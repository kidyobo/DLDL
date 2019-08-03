﻿import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from "System/constants/KeyWord"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { EnumTeamTab } from "System/team/TeamView"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { MenuNodeData, MenuView } from 'System/uilib/MenuView'
import { InvitingPlayerItemBase } from "System/team/InvitingPlayerItemBase"


export class InvitingMyFriendPlayerPanel extends InvitingPlayerItemBase {


    constructor() {
        super(KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYFRIEND);
    }

  

    protected initElements(): void {
        super.initElements();

    }

    protected initListeners(): void {
        super.initListeners();

    }

   

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFetchGameFriendRequest());
    }

    protected onClose() {

    }


    protected OnShuaXinClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFetchGameFriendRequest());
    }




}


