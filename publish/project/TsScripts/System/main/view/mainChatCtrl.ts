import { UiElements } from 'System/uilib/UiElements'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { FriendPanel } from 'System/friend/FriendPanel'
import { FriendAddView } from 'System/friend/FriendAddView'
import { Global as G } from "System/global"
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { Macros } from 'System/protocol/Macros'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { Color } from 'System/utils/ColorUtil'
import { IChatComm } from 'System/chat/IChatComm'
import { ChannelData } from 'System/chat/ChannelData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { ChannelSettingView } from 'System/chat/ChannelSettingView'
import { SystemSettingView } from 'System/setting/SystemSettingView'

/**主界面聊天相关*/
export class MainChatCtrl {

    ///////////////////////聊天面板//////////////////////////
    private chatRect: UnityEngine.GameObject;
    /**好友按钮*/
    btn_friend: UnityEngine.GameObject = null;
    private chatBack: UnityEngine.GameObject = null;
    /**有人找你私聊的提示*/
    private chatHitTip: UnityEngine.GameObject = null;
    private openAbstracts: RoleAbstract[] = null;
    private showDataChanelId: number = Macros.CHANNEL_WORLD;
    private chatText: UnityEngine.UI.UIText;
    private mailTipStartPos: UnityEngine.Transform;
    private mailTipEndPos: UnityEngine.Transform;
    private isHasFriendAdd: boolean = false;
    private bt_change: UnityEngine.GameObject = null;
    private bt_setting: UnityEngine.GameObject = null;
    lastSelectedChannelId: number = 0;
    private isChatUp: boolean = false;

    setView(uiElems: UiElements) {
        //好友相关
        let chatElems = uiElems.getUiElements('chatRect');
        this.chatRect = uiElems.getElement('chatRect');
        this.btn_friend = chatElems.getElement("btn_friend");
        this.chatHitTip = chatElems.getElement("chatTip").gameObject;
        this.chatBack = chatElems.getElement("chatBack");
        this.chatText = chatElems.getUIText('chatText');
        this.bt_change = chatElems.getElement("bt_change");
        this.bt_setting = chatElems.getElement("bt_setting");
        this.chatHitTip.SetActive(false);
        this.clearChatPanel();
        Game.UIClickListener.Get(this.btn_friend).onClick = delegate(this, this.onClickFriendBt);
        Game.UIClickListener.Get(this.chatBack).onClick = delegate(this, this.onClickChatBack);
        Game.UIClickListener.Get(this.bt_change).onClick = delegate(this, this.onClickChange);
        Game.UIClickListener.Get(this.bt_setting).onClick = delegate(this, this.onClickSetting);
        this.setTakerChange();
    }

    setChatPanelActive(isActive: boolean = true) {
        this.chatRect.SetActive(isActive);
    }


    //----------------------好友相关---------------------------//
    setAddFriendBtActive(active: boolean = false) {
        if (active) {
            this.chatHitTip.SetActive(true);
        } else {
            if (this.openAbstracts == null) {
                this.chatHitTip.SetActive(false);
            }
        }
        this.isHasFriendAdd = active;
    }


    private onClickFriendBt() {
        //点击好友按钮(判断有没有数据传过来)
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.SUBBAR_FUNCTION_HAOYOU)) {
            return;
        }
        if (this.isHasFriendAdd) {
            G.Uimgr.createForm<FriendAddView>(FriendAddView).open();
            return;
        }
        G.Uimgr.createForm<FriendView>(FriendView).open(FriendViewTab.FriendPanel, this.openAbstracts);
        this.chatHitTip.SetActive(false);
        this.openAbstracts = null;
    }

    friendChatHint(roleAbstract: RoleAbstract) {
        //有人找你聊天时的提示(弹出红点)
        this.chatHitTip.SetActive(true);
        if (this.openAbstracts == null) {
            this.openAbstracts = [];
        }
        this.openAbstracts.push(roleAbstract);
    }

    ///////////////////////聊天相关///////////////////////////////////

    getChatBack(): UnityEngine.GameObject {
        return this.chatBack;
    }

     onClickChatBack() {
        let showId = this.lastSelectedChannelId == 0 ? this.showDataChanelId : this.lastSelectedChannelId;
        G.ViewCacher.chatView.open(showId);
    }
    private onClickSetting() {
        G.Uimgr.createForm<SystemSettingView>(SystemSettingView).open();
    }
    private onClickChange() {
        if (this.isChatUp) {
            this.isChatUp = false;
            Game.Tools.SetGameObjectSizeDelta(this.chatBack, 392, 80);
            Game.Tools.SetGameObjectLocalRotation(this.bt_change, 0, 0, -90);
        }
        else {
            this.isChatUp = true;
            Game.Tools.SetGameObjectSizeDelta(this.chatBack, 392, 120);
            Game.Tools.SetGameObjectLocalRotation(this.bt_change, 0, 0, 90);
        }
    }

    private chatContainer: string[] = [];
    appendText(data: ChannelData, force: boolean, isOss: boolean = false): void {

        //系统消息不在主界面显示(现在看到的系统消息实际是传闻)
        if (data.id == Macros.CHANNEL_SYSTEM && isOss == false) {
            return;
        }
        if (!G.DataMgr.settingData.isChannelPass(data.id)) {
            return;
        }
        //队伍聊天只能自己和队友看见
        if (data.id == Macros.CHANNEL_TEAM && G.DataMgr.teamData.hasTeam && G.DataMgr.teamData.memberList.length == 1) {
            let target = G.DataMgr.teamData.memberList[0];
            let uin = data.roleAbstract.roleID.m_uiUin;
            if (uin != target.m_stRoleID.m_uiUin && uin != G.DataMgr.heroData.uin) {
                return;
            }
        }
        this.showDataChanelId = data.id;
        let talkerName: string = '';
        if (data.roleAbstract.roleID.m_uiUin > 0) {
            if (data.roleAbstract.vipLv > 0) {
                talkerName += RichTextUtil.getColorText(" VIP", Color.VIP) + RichTextUtil.getColorText(data.roleAbstract.vipLv.toString(), Color.VIP);
            }
            talkerName += "[" + RichTextUtil.getColorText(data.roleAbstract.nickName, Color.GREEN) + "]";
        }
        let newString = this.getTakerChange(data.id) + talkerName + data.toRichText();

        if (this.chatContainer.length >= 6) {
            this.chatContainer.splice(0, 1);
            this.chatContainer[5] = newString;
        }
        else {
            this.chatContainer.push(newString);
        }
        let showStr: string = '';
        for (let i = this.chatContainer.length - 1; i >= 0; i--) {
            let str = this.chatContainer[i];
            if (i == 0) {
                showStr = showStr + str
            }
            else {
                showStr = showStr + str + '\n';
            }
        }
        this.chatText.text = showStr;
    }
 
    private typeTalker: { [type: number]: string } = {};
    private setTakerChange() {
        this.typeTalker[Macros.CHANNEL_SYSTEM] = '/系统';
        this.typeTalker[Macros.CHANNEL_WORLD] = '/世界';
        this.typeTalker[Macros.CHANNEL_GUILD] = '/宗门';
        this.typeTalker[Macros.CHANNEL_SPEAKER] = '/喇叭';
        this.typeTalker[Macros.CHANNEL_TEAM_NOTIFY] = '/队伍';
        this.typeTalker[Macros.CHANNEL_NEARBY] = '/附近';
        this.typeTalker[Macros.CHANNEL_TEAM] = '/组队';
    }
    private getTakerChange(id: number): string {
        let takler: string = '';
        if (this.typeTalker[id] != null) {
            takler = this.typeTalker[id];
        }
        return takler;
    }


    clearChatPanel() {
        this.chatText.text = "";
    }

    ////////////////////////////邮件相关/////////////////////////////////////
    checkEmailTipActive() {
        let view = G.Uimgr.getForm<FriendView>(FriendView);
        if (view != null) {
            view.updateEmailTipMark();
        }
    }
}