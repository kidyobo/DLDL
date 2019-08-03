import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { MyTeamView } from "System/team/MyTeamView"
import { NearTeamView } from "System/team/NearTeamView"
import { KeyWord } from 'System/constants/KeyWord'
import { ErrorId } from 'System/protocol/ErrorId'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TeamData } from 'System/data/TeamData'


export enum EnumTeamTab {
    MyTeam = 1,
    NearTeam = 2,
}


//该面板为其他子面板的父面板
export class TeamView extends TabForm {

    private openTab: EnumTeamTab;
  
    constructor() {
        super(KeyWord.SUBBAR_FUNCTION_TEAM, MyTeamView, NearTeamView);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.TeamView;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
    }

    protected onOpen() {
        super.onOpen();
        // 更新页签
  
        this.switchTabFormById(this.openTab);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }

    open(openTab: EnumTeamTab = EnumTeamTab.MyTeam, openParam: any = null) {

        this.openTab = openTab;
        super.open();
    }
    
    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    onTeamChanged(isJoinTeam: boolean): void {
        let myTeamPanel = this.getTabFormByID(EnumTeamTab.MyTeam) as MyTeamView;
        let nearTeamPanel = this.getTabFormByID(EnumTeamTab.NearTeam) as NearTeamView;
        if (isJoinTeam) {        
            this.switchTabFormById(EnumTeamTab.MyTeam);
            if (myTeamPanel.isOpened) {
                myTeamPanel.updateView();
            }
        } else {         
            if (myTeamPanel.isOpened) {
                myTeamPanel.updateView();
            }         
            if (nearTeamPanel.isOpened) {
                nearTeamPanel.updateView();
            }
        }
    }


    public refresh(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }
}
export default TeamView;