import { ChannelData } from "System/chat/ChannelData";
import { ChannelMsgData } from "System/chat/ChannelMsgData";
import { ChatType } from "System/chat/EmoijPanel";
import { IChatComm } from "System/chat/IChatComm";
import { Constants } from "System/constants/Constants";
import { UIPathData } from "System/data/UIPathData";
import { RoleAbstract } from "System/data/vo/RoleAbstract";
import { Global as G } from "System/global";
import { MenuPanelType } from "System/main/view/RoleMenuView";
import { Macros } from "System/protocol/Macros";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { CompareUtil } from "System/utils/CompareUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { RichTextUtil } from "System/utils/RichTextUtil";
import { SettingData } from "System/data/SettingData";
export class ChannelSettingView extends CommonForm {
    settingData: SettingData;
    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.ChannelSettingView;
    }

    protected initElements() {

    }
    protected initListeners() {
        this.addClickListener(this.elems.getElement("btnClose"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement('mask'), this.onBtnReturn);
        let settingData = G.DataMgr.settingData;
        this.settingData = settingData;
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_WORLD"), this.onChangeWorld, settingData.isChannelPass(Macros.CHANNEL_WORLD));
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_AROUND"), this.onChangeAround, settingData.isChannelPass(Macros.CHANNEL_NEARBY));
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_TEAM"), this.onChangeTeam, settingData.isChannelPass(Macros.CHANNEL_TEAM_NOTIFY));
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_CLUB"), this.onChangeClub, settingData.isChannelPass(Macros.CHANNEL_GUILD));
        this.addToggleListenerWithValue(this.elems.getActiveToggle("C_SYSTEM"), this.onChangeSystem, settingData.isChannelPass(Macros.CHANNEL_SYSTEM));
    }
    protected onOpen() {

    }
    protected onClose() {
        this.settingData.writeSetting();
    }
    private onChangeWorld(value: boolean) {
        this.settingData.setChannelPass(Macros.CHANNEL_WORLD, value);
    }
    private onChangeAround(value: boolean) {
        this.settingData.setChannelPass(Macros.CHANNEL_NEARBY, value);
    }
    private onChangeTeam(value: boolean) {
        this.settingData.setChannelPass(Macros.CHANNEL_TEAM_NOTIFY, value);
    }
    private onChangeClub(value: boolean) {
        this.settingData.setChannelPass(Macros.CHANNEL_GUILD, value);
    }
    private onChangeSystem(value: boolean) {
        this.settingData.setChannelPass(Macros.CHANNEL_SYSTEM, value);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }
}