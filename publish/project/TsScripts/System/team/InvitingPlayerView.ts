import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { ErrorId } from 'System/protocol/ErrorId'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TeamData } from 'System/data/TeamData'
import { InvitingNearPlayerPanel } from "System/team/InvitingNearPlayerPanel"
import { InvitingMyGuildPlayerPanel } from "System/team/InvitingMyGuildPlayerPanel"
import { InvitingMyFriendPlayerPanel } from "System/team/InvitingMyFriendPlayerPanel"


export enum EnumTeamPlayerTab {
    nearPlayer = 1,
    myGuild ,
    myFriend
}

/**队伍邀请父亲界面*/
export class InvitingPlayerView extends TabForm {

    private openTab: number = 0;
    private isOpenFromFuBen: boolean = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_TEAM_INVITING, InvitingNearPlayerPanel, InvitingMyGuildPlayerPanel, InvitingMyFriendPlayerPanel);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.InvitingPlayerView;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);
    }

    protected onOpen() {
        super.onOpen();
        this.tabGroup.GetToggle(0).gameObject.SetActive(!this.isOpenFromFuBen);
        // 更新页签
        this.switchTabFormById(this.openTab, this.isOpenFromFuBen);
      
    }

    open(openTab: number = KeyWord.OTHER_FUNCTION_TEAM_INVITING_NEARPLAYER, isOpenFromFuBen: boolean) {
        this.openTab = openTab;
        this.isOpenFromFuBen = isOpenFromFuBen;
        super.open();
    }

    getOpenFromType() {
        return this.isOpenFromFuBen;
    }

    /**更新附近的玩家*/
    updataNearPlayerData() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_TEAM_INVITING_NEARPLAYER) as InvitingNearPlayerPanel;
        if (panel && panel.isOpened) {
            panel.updataTeamData();
        }
    }

    onRefreshMyFriendData() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYFRIEND) as InvitingMyFriendPlayerPanel;
        if (panel && panel.isOpened) {
            panel.onRefreshData();
        }
    }

    onRefreshMyGuildData() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYGUILD) as InvitingMyGuildPlayerPanel;
        if (panel && panel.isOpened) {
            panel.updateList();
        }
    }
 
}
export default InvitingPlayerView;