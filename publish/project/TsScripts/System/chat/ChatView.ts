import { PinstanceData } from './../data/PinstanceData';
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
import { ChannelSettingView } from 'System/chat/ChannelSettingView';
import { UiElements } from "System/uilib/UiElements";
import { SettingData } from "System/data/SettingData";
import { KeyWord } from 'System/constants/KeyWord'
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { EnumGuide } from 'System/constants/GameEnum';

enum ChatChannelTag {
    system = 0,
    zudui = 1,
    world = 2,
    team = 3,
    zongmen = 4,
    near = 5,
    setting = 6
}

class SystemChatGroup {
    static offsetY: number = 10;
    private item: ChatItem;
    gameObject: UnityEngine.GameObject;
    rectTransform: UnityEngine.RectTransform;
    private icon: UnityEngine.GameObject;
    private iconText: UnityEngine.UI.Text;
    private text: UnityEngine.UI.UIText;
    setComponents(item: ChatItem, go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.rectTransform = go.transform as UnityEngine.RectTransform;
        this.item = item;
        this.icon = ElemFinder.findObject(go, 'icon');
        this.iconText = ElemFinder.findText(go, 'icon/text');
        this.text = ElemFinder.findUIText(go, 'text');
        //超链接
        let textUrl = this.text.GetComponentInChildren(UnityEngine.UI.UITextUrl.GetType()) as UnityEngine.UI.UITextUrl;
        if (textUrl != null) {
            textUrl.onUrlClick = delegate(this, this.onUrlClick);
        }
    }
    private onUrlClick(value: string) {
        this.item.chatView.onUrlClick(value);
    }
    setIconText(text: string) {
        this.iconText.text = text;
    }
    public update(channelText: string) {
        let data = this.item.data;
        this.iconText.text = channelText;
        this.text.text = data.toRichText();
        this.text.ProcessText();
        let hightContent: number = this.text.renderHeight;
        this.item.itemHeight = hightContent + SystemChatGroup.offsetY;
        this.rectTransform.sizeDelta = G.getCacheV2(0, this.item.itemHeight);
    }
}
class PlayerChatGroup {
    static offsetY: number = 45;
    static readonly BubbleLRMagin = 15;
    /**气泡上下外边距*/
    static readonly BubbleTBMagin = 18;
    static readonly chatTextDefaultY = -4.2;
    static readonly chatTextDefaultX = 10;
    private isSelf: boolean = false;
    private item: ChatItem;
    gameObject: UnityEngine.GameObject;
    rectTransform: UnityEngine.RectTransform;
    private headIcon: UnityEngine.UI.Image;
    private palyerName: UnityEngine.UI.Text;
    private vipIcon: UnityEngine.GameObject;
    private vipLevel: UnityEngine.UI.Text;
    private iconText: UnityEngine.UI.Text;
    private bubbleImage: UnityEngine.GameObject;
    private bubbleImageRT: UnityEngine.RectTransform;
    private chatUiText: UnityEngine.UI.UIText;
    private chatUiTextRT: UnityEngine.RectTransform;

    setComponents(item: ChatItem, go: UnityEngine.GameObject, isself: boolean = false) {
        this.isSelf = isself;
        this.gameObject = go;
        this.rectTransform = go.transform as UnityEngine.RectTransform;
        this.item = item;
        this.headIcon = ElemFinder.findImage(go, 'head/icon');
        this.vipIcon = ElemFinder.findObject(go, 'vip');
        this.vipLevel = ElemFinder.findText(go, 'vip/level');
        this.palyerName = ElemFinder.findText(go, 'playername');
        this.bubbleImage = ElemFinder.findObject(go, 'wordchat');
        this.iconText = ElemFinder.findText(go, 'icon/Text');
        this.bubbleImageRT = this.bubbleImage.transform as UnityEngine.RectTransform;

        this.chatUiText = ElemFinder.findUIText(go, 'wordchat/text');
        this.chatUiTextRT = this.chatUiText.transform as UnityEngine.RectTransform;
        Game.UIClickListener.Get(this.headIcon.gameObject).onClick = delegate(this, this.onClickTalkerHead);
        //超链接
        let textUrl = this.chatUiText.GetComponentInChildren(UnityEngine.UI.UITextUrl.GetType()) as UnityEngine.UI.UITextUrl;
        if (textUrl != null) {
            textUrl.onUrlClick = delegate(this, this.onUrlClick);
        }
    }
    private onUrlClick(value: string) {
        this.item.chatView.onUrlClick(value);
    }
    private onClickTalkerHead() {
        //点击头像获取人物信息
        let roleAbstract = this.item.data.roleAbstract;
        if (CompareUtil.isRoleIDEqual(roleAbstract.roleID, G.DataMgr.heroData.roleID)) {
            return;
        }
        this.item.chatView.onClickTalkerHead(this.item, roleAbstract);
    }
    public update(channelText: string) {
        let data = this.item.data;


        //头像
        this.headIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', data.roleAbstract.prof, data.roleAbstract.gender));
        this.iconText.text = channelText;
        //vip
        let playerNameRect = this.palyerName.transform as UnityEngine.RectTransform;
        if (data.roleAbstract.vipLv > 0) {
            this.vipLevel.text = data.roleAbstract.vipLv.toString();
            this.vipIcon.SetActive(true);
            playerNameRect.anchoredPosition = G.getCacheV2(252, playerNameRect.anchoredPosition.y);
        } else {
            this.vipIcon.SetActive(false);
            playerNameRect.anchoredPosition = this.isSelf ? G.getCacheV2(-140, playerNameRect.anchoredPosition.y) : G.getCacheV2(160, playerNameRect.anchoredPosition.y);
        }
        // 玩家名字
        this.palyerName.text = data.roleAbstract.nickName;
        this.chatUiText.text = data.toRichText();
        this.chatUiText.ProcessText();
        // 排版聊天气泡
        let widthContent: number = this.chatUiText.renderWidth;
        let hightContent: number = this.chatUiText.renderHeight;
        this.chatUiTextRT.anchoredPosition = G.getCacheV2(PlayerChatGroup.chatTextDefaultX, PlayerChatGroup.chatTextDefaultY);
        let width = widthContent + PlayerChatGroup.BubbleLRMagin;
        let height = hightContent + PlayerChatGroup.BubbleTBMagin;
        this.bubbleImageRT.sizeDelta = G.getCacheV2(width, height);
        // 记录底部坐标
        this.item.itemHeight = height + PlayerChatGroup.offsetY;
        this.rectTransform.sizeDelta = G.getCacheV2(0, this.item.itemHeight);
    }
}


class ChatItem {
    gameObject: UnityEngine.GameObject;
    rectTransform: UnityEngine.RectTransform;
    chatView: ChatView;
    data: ChannelData;
    /**底部y坐标*/
    itemHeight = 0;
    systemGroup: SystemChatGroup;
    playerGroup: PlayerChatGroup;
    selfGroup: PlayerChatGroup;
    constructor(chatView: ChatView) {
        this.chatView = chatView;
        this.systemGroup = new SystemChatGroup();
        this.playerGroup = new PlayerChatGroup();
        this.selfGroup = new PlayerChatGroup();
    }
    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.rectTransform = (go.transform as UnityEngine.RectTransform);
        this.systemGroup.setComponents(this, ElemFinder.findObject(go, 'system'));
        this.playerGroup.setComponents(this, ElemFinder.findObject(go, 'player'));
        this.selfGroup.setComponents(this, ElemFinder.findObject(go, 'self'), true);
    }

    update(data: ChannelData, channelName: string, curChannelId: number) {
        this.data = data;
        //使头像可以进行点击获得任务详细信息
        let isSystem = false;
        if (data.id == Macros.CHANNEL_SYSTEM || data.id == Macros.CHANNEL_TEAM_NOTIFY || 0 == data.roleAbstract.roleID.m_uiUin) {
            // 系统消息
            isSystem = true;
            this.playerGroup.gameObject.SetActive(false);
            this.selfGroup.gameObject.SetActive(false);
            this.systemGroup.gameObject.SetActive(true);
            if (curChannelId == Macros.CHANNEL_TEAM_NOTIFY) {
                this.systemGroup.setIconText('组队');
            } else {
                this.systemGroup.setIconText('系统');
            }
            this.systemGroup.update(channelName);
        } else {
            let isMySelf: boolean = data.roleAbstract.roleID.m_uiUin == G.DataMgr.heroData.roleID.m_uiUin;
            if (isMySelf) {
                this.selfGroup.gameObject.SetActive(true);
                this.playerGroup.gameObject.SetActive(false);
                this.selfGroup.update(channelName);
            }
            else {
                this.selfGroup.gameObject.SetActive(false);
                this.playerGroup.gameObject.SetActive(true);
                this.playerGroup.update(channelName);
            }
            this.systemGroup.gameObject.SetActive(false);
        }
    }

    get ItemHeight(): number {
        return this.itemHeight;
    }
}

/**设置界面 */
class ChannelSettingPanel {
    settingData: SettingData;
    private gameonject: UnityEngine.GameObject;

    private world: UnityEngine.UI.ActiveToggle;
    private around: UnityEngine.UI.ActiveToggle;
    private team: UnityEngine.UI.ActiveToggle;
    private club: UnityEngine.UI.ActiveToggle;
    private system: UnityEngine.UI.ActiveToggle;


    setComponents(elems: UiElements, go: UnityEngine.GameObject) {
        this.gameonject = go;

        let settingData = G.DataMgr.settingData;
        this.settingData = settingData;
        this.world = elems.getActiveToggle("C_WORLD");
        this.around = elems.getActiveToggle("C_AROUND");
        this.team = elems.getActiveToggle("C_TEAM");
        this.club = elems.getActiveToggle("C_CLUB");
        this.system = elems.getActiveToggle("C_SYSTEM");

        this.addToggleListenerWithValue(elems.getActiveToggle("C_WORLD"), this.onChangeWorld, settingData.isChannelPass(Macros.CHANNEL_WORLD));
        this.addToggleListenerWithValue(elems.getActiveToggle("C_AROUND"), this.onChangeAround, settingData.isChannelPass(Macros.CHANNEL_NEARBY));
        this.addToggleListenerWithValue(elems.getActiveToggle("C_TEAM"), this.onChangeTeam, settingData.isChannelPass(Macros.CHANNEL_TEAM_NOTIFY));
        this.addToggleListenerWithValue(elems.getActiveToggle("C_CLUB"), this.onChangeClub, settingData.isChannelPass(Macros.CHANNEL_GUILD));
        this.addToggleListenerWithValue(elems.getActiveToggle("C_SYSTEM"), this.onChangeSystem, settingData.isChannelPass(Macros.CHANNEL_SYSTEM));
    }
    onOpen() {
        this.gameonject.SetActive(true);
        this.world.isOn = this.settingData.isChannelPass(Macros.CHANNEL_WORLD);
        this.around.isOn = this.settingData.isChannelPass(Macros.CHANNEL_NEARBY);
        this.team.isOn = this.settingData.isChannelPass(Macros.CHANNEL_TEAM_NOTIFY);
        this.club.isOn = this.settingData.isChannelPass(Macros.CHANNEL_GUILD);
        this.system.isOn = this.settingData.isChannelPass(Macros.CHANNEL_SYSTEM);
    }
    onClose() {
        this.gameonject.SetActive(false);
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

    private addToggleListenerWithValue(element: UnityEngine.UI.ActiveToggle, caller: (isOn: boolean) => void, isOn: boolean) {
        element.onValueChanged = delegate(this, caller);
        // element.isOn = isOn;
    }
}

export class ChatView extends CommonForm implements IChatComm {
    private btnSetting: UnityEngine.GameObject;
    ///////////////////////聊天面板//////////////////////////////////////////////////
    /**聊天面板上的所有频道*/
    private readonly panelChannels: number[] = [Macros.CHANNEL_SYSTEM, Macros.CHANNEL_TEAM_NOTIFY,
    Macros.CHANNEL_WORLD, Macros.CHANNEL_TEAM, Macros.CHANNEL_GUILD/**, Macros.CHANNEL_SPEAKER*/, Macros.CHANNEL_NEARBY];
    private readonly channelNames: string[] = ['系统', '组队', '世界', '组队', '宗门'/**, '喇叭'*/, '附近'];
    private readonly guideTextIdInNews: number[] = [485,486,487,488,489 ];
    chatInput: UnityEngine.UI.InputField = null;
    /**聊天频道ID*/
    private m_openChannelId: number = 0;
    private m_openDefaultMsg: string;
    m_curChannelId: number = 0;
    private m_curInputData: ChannelData;
    private m_curVoiceData: ChannelData;
    private chatPanel: UnityEngine.GameObject = null;
    private chatPanelAnimator: UnityEngine.Animator = null;
    /**聊天 scroll Rrect(其为chatList的父节点)*/
    private chatScrollRect: UnityEngine.UI.ScrollRect = null;
    /**ChatList高度(原始高度1290)chatMask高度563*/
    private chatListRect: UnityEngine.RectTransform = null;
    private chatList: UnityEngine.GameObject = null;
    private chatPrefab: UnityEngine.GameObject = null;
    /**聊天频道group(系统,组队,世界,队伍,宗门)*/
    private chatGroup: UnityEngine.UI.ActiveToggleGroup = null;
    private chatInputGroup: UnityEngine.GameObject = null;
    private chatMask: UnityEngine.GameObject = null;
    private mask: UnityEngine.GameObject = null;
    ///////////////////////刷新聊天气泡位置相关//////////////////////////////////////////
    /**聊天item数组*/
    private m_chatItems: ChatItem[] = [];
    /**本次使用的聊天item索引*/
    private m_curChatItemIdx: number = 0;
    /**第一个气泡和最后一个气泡的高差(用来动态改变scrollRect的高度)*/
    private firstToLastHight: number = 0;
    ////////////////////其他////////////////////////////////////////////////////////
    /**聊天信息*/
    private records: string[] = [];
    private scrollRectSize: UnityEngine.Vector2;
    private activeItems: ChatItem[] = [];
    /**向上滚动添加新item时的坐标*/
    private nextPosY = 0;

    /**最底部item的序号*/
    private bottomIndex = -1;
    /**最顶部item的序号*/
    private topIndex = -1;

    private channelSettingPanel: ChannelSettingPanel;

    public btn_send: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
        this.m_curInputData = new ChannelData();
        this.m_curVoiceData = new ChannelData();
        this.needCheckScreenScale = true;
    }

    layer(): UILayer {
        return UILayer.Chat;
    }

    protected resPath(): string {
        return UIPathData.ChatView;
    }

    protected initElements() {
        this.btnSetting = this.elems.getElement("btnSetting");
        //聊天面板
        this.chatPanel = this.elems.getElement("chatPanel");
        this.chatPanelAnimator = this.chatPanel.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        this.chatList = this.elems.getElement("chatList");
        this.chatListRect = this.chatList.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        let scrollRect = this.elems.getElement('chatScrollRect');
        this.chatScrollRect = scrollRect.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        this.scrollRectSize = (this.chatScrollRect.transform as UnityEngine.RectTransform).rect.size;
        this.chatScrollRect.onValueChanged = delegate(this, this.onScrollValueChanged);
        this.chatPrefab = this.elems.getElement("chatPrefab");
        this.chatPrefab.SetActive(false);
        let chatItem = new ChatItem(this);
        chatItem.setComponents(this.chatPrefab);
        this.m_chatItems.push(chatItem);
        this.chatGroup = this.elems.getToggleGroup("chatGroup");
        this.chatInputGroup = this.elems.getElement("chatInputGroup");
        this.chatInput = this.elems.getInputField("inputfield_chat");
        this.chatMask = this.elems.getElement("chatMask");
        this.mask = this.elems.getElement("mask");
        this.btn_send = this.elems.getElement("btn_send");
        this.channelSettingPanel = new ChannelSettingPanel();
        this.channelSettingPanel.setComponents(this.elems.getUiElements("channelSettingPanel"), this.elems.getElement("channelSettingPanel"));
    }

    protected initListeners() {
        //this.addClickListener(this.btnSetting, this.openSetting);
        this.addToggleGroupListener(this.chatGroup, this.onClickChatGroup);
        this.addClickListener(this.elems.getElement("btn_close"), this.onClickCloselBt);
        this.addClickListener(this.elems.getElement("btn_biaoqing"), this.onClickBqBt);
        this.addClickListener(this.btn_send, this.onClickSendMessageBt);
        this.addClickListener(this.elems.getElement("btnTitle"), this.onClickTitle);
        this.addClickListener(this.mask, this.onClickCloselBt);

    }

    open(openChannel: number = 0, defaultMsg: string = null) {
        if (openChannel <= 0) {
            // 没有指定打开哪一个频道，则默认保留当前的频道
            openChannel = this.m_curChannelId;
        }
        if (openChannel <= 0) {
            // 既没有指定打开哪一个频道，当前也没有打开任一个频道，则默认打开世界聊天
            openChannel = Macros.CHANNEL_WORLD;
        }
        this.m_openChannelId = openChannel;
        this.m_openDefaultMsg = defaultMsg;
        super.open();

        if (G.GuideMgr.isGuiding(EnumGuide.ChatWorld)) {
            this.guideSetting();
        }
    }

    //引导相关设置
    guideSetting() {
        this.chatGroup.Selected = 2;
        this.onClickChatGroup(2);
        this.chatInput.text = G.DataMgr.langData.getLang(this.guideTextIdInNews[Math.floor(Math.random() * this.guideTextIdInNews.length)]);
        G.GuideMgr.processGuideNext(EnumGuide.ChatWorld, EnumGuide.ChatWorldClickOpenView);
    }

    protected onOpen() {
        let isAllFuncLocked = G.DataMgr.runtime.isAllFuncLocked;
        // 跨服只能使用宗门和系统
        let firstOpenedIdx = -1;
        let cnt = this.panelChannels.length;
        for (let i = 0; i < cnt; i++) {
            let id = this.panelChannels[i];
            //是否是非跨服
            //当前副本ID
            let pinstanceId = G.DataMgr.sceneData.curPinstanceID;
            let isKF = 0;
            if (pinstanceId>0) {
                let pinstanceCfg = PinstanceData.getConfigByID(pinstanceId);
                isKF =  pinstanceCfg.m_ucIsKF;
            }
            if (!isAllFuncLocked || (Macros.CHANNEL_SYSTEM == id || Macros.CHANNEL_GUILD == id || Macros.CHANNEL_NEARBY == id||Macros.CHANNEL_WORLD == id)) {
                this.chatGroup.GetToggle(i).gameObject.SetActive(true);
                if (firstOpenedIdx < 0) {
                    firstOpenedIdx = i;
                }
            } else {
                this.chatGroup.GetToggle(i).gameObject.SetActive(false);
                if (this.m_openChannelId == id) {
                    this.m_openChannelId = 0;
                }
            }
        }

        let tabIdx = this.panelChannels.indexOf(this.m_openChannelId);
        if (tabIdx < 0) {
            tabIdx = firstOpenedIdx;
        }
        if (tabIdx < 0) {
            tabIdx = 0;
        }

        if (this.chatGroup.Selected != tabIdx) {
            this.chatGroup.Selected = tabIdx;
        } else {
            this.onClickChatGroup(tabIdx);
        }
        G.DataMgr.runtime.hasNewGuildChatMsg = false;
        if (null != this.m_openDefaultMsg) {
            this.chatInput.text = this.m_openDefaultMsg;
        }

        this.mask.transform.SetParent(this.form.transform.parent.parent);
        this.mask.transform.SetAsFirstSibling();
    }

    protected onClose() {
        this.m_curChannelId = 0;

        G.MainBtnCtrl.setGuildChatTipMark();

        this.mask.transform.SetParent(this.form.transform);
        this.mask.transform.SetAsFirstSibling();
        //表情面板关闭
        if (G.ViewCacher.emoijPanel.isOpened)
            G.ViewCacher.emoijPanel.close();

        this.closeSetting();
    }

    /**点击设置按钮 */
    private openSetting() {
        //改动 原来是一个新的界面，现在融合到聊天界面内部
        //打开界面
        this.channelSettingPanel.onOpen();

        //清空聊天数据
        this.clearChatItems();

        //关闭输入框
        this.chatInputGroup.SetActive(false);
    }

    /**关闭设置界面 */
    private closeSetting() {
        this.chatInputGroup.SetActive(true);
        this.channelSettingPanel.onClose();
    }

    /**点击标题“频道”按钮 */
    private onClickTitle() {
        //点击好友按钮(判断有没有数据传过来)
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.SUBBAR_FUNCTION_HAOYOU)) {
            return;
        }

        G.Uimgr.createForm<FriendView>(FriendView).open(FriendViewTab.FriendPanel);

        this.close();
    }

    /**点击聊天group,切换聊天频道*/
    private onClickChatGroup(index: number) {
        G.AudioMgr.playBtnClickSound();
        let newChannelId: number = this.panelChannels[index];
        if (this.m_curChannelId == newChannelId) {
            return;
        }
        let recttransform = (this.chatScrollRect.transform as UnityEngine.RectTransform);
        this.scrollRectSize = recttransform.rect.size;

        if (index == ChatChannelTag.setting) {
            this.openSetting();
        }
        else {
            this.closeSetting();
            if (index == ChatChannelTag.system || index == ChatChannelTag.zudui) {
                this.chatInputGroup.SetActive(false);
                this.chatMask.SetActive(true);
            }  
            else {
                this.chatInputGroup.SetActive(true);
                this.chatMask.SetActive(false);
            }
        }

        this.m_curChannelId = newChannelId;
        G.ViewCacher.mainView.mainChatCtrl.lastSelectedChannelId = newChannelId;
        // 先清空
        this.clearChatItems();
        let recordList: ChannelData[] = G.DataMgr.chatData.dicChannel[newChannelId];
        let checkY = this.scrollRectSize.y;
        if (null != recordList) {
            let recordCnt: number = recordList.length;
            // 从底部开始填放item，先放最近的消息
            let fullCnt = 0;
            if (recordCnt > 0) {
                this.bottomIndex = 0;
                for (let i = recordCnt - 1; i >= 0; i--) {
                    let itemData = recordList[i];
                    let item = this.doAppendText(itemData, true);
                    if (null != item) {
                        this.activeItems.push(item);
                        item.rectTransform.anchoredPosition = G.getCacheV2(0, this.nextPosY);
                        this.nextPosY += item.ItemHeight;
                        // 如果已经满屏达到2次则停止填充
                        if (this.nextPosY >= checkY) {
                            if (++fullCnt > 1) {
                                this.topIndex = i;
                                break;
                            }
                        }
                    }
                }
                if (this.topIndex < 0) {
                    this.topIndex = 0;
                }
            }
            // 更新滚动区域大小，并滚至最底部
            this.chatListRect.sizeDelta = G.getCacheV2(this.scrollRectSize.x, this.nextPosY);
            this.chatScrollRect.verticalNormalizedPosition = 0;
        }
    }

    clearChatItems() {
        let len: number = Math.min(this.m_curChatItemIdx, this.m_chatItems.length);
        for (let i: number = 0; i < len; i++) {
            let chatItem = this.m_chatItems[i];
            chatItem.gameObject.SetActive(false);
        }
        this.m_curChatItemIdx = 0;
        this.activeItems.length = 0;
        this.nextPosY = 0;
        this.bottomIndex = -1;
        this.topIndex = -1;
    }

    appendText(data: ChannelData, force: boolean) {
        if (!this.isOpened) {
            return;
        }
        let item = this.doAppendText(data, force);
        if (null != item) {
            let cnt = this.activeItems.length;
            // 将此前的item全部上抬
            for (let i = 0; i < cnt; i++) {
                let oItem = this.activeItems[i];
                oItem.rectTransform.anchoredPosition = G.getCacheV2(0, oItem.rectTransform.anchoredPosition.y + item.ItemHeight);
            }
            item.rectTransform.anchoredPosition = G.getCacheV2(0, 0);
            this.activeItems.unshift(item);
            // 更新滚动区域大小
            this.nextPosY += item.ItemHeight;
            this.chatListRect.sizeDelta = G.getCacheV2(this.scrollRectSize.x, this.nextPosY);
        }
    }

    private doAppendText(data: ChannelData, force: boolean): ChatItem {
        if (force || this.m_curChannelId == data.id) {
            let chatItem = this.getVacantChatItem();
            chatItem.update(data, this.channelNames[this.panelChannels.indexOf(this.m_curChannelId)], this.m_curChannelId);
            chatItem.gameObject.SetActive(true);
            return chatItem;
        }
        return null;
    }

    private onScrollValueChanged() {
        let recordList: ChannelData[] = G.DataMgr.chatData.dicChannel[this.m_curChannelId];
        if (recordList == null) {
            uts.logError("charview error,this.m_curChannelId:" + this.m_curChannelId);
            return;
        }
        let cnt = recordList.length;
        if (0 == cnt) {
            return;
        }

        let scrollY = this.chatListRect.anchoredPosition.y;
        // 检查上方是否需要继续添加
        if (this.topIndex > 0) {
            let oldCnt = this.activeItems.length;
            let toppestItem = this.activeItems[oldCnt - 1];
            if (scrollY < -toppestItem.ItemHeight) {
                // 最顶上那个已经露出来了，需要继续添加
                let itemData = recordList[this.topIndex - 1];
                let item = this.doAppendText(itemData, true);
                if (null != item) {
                    // 扩展滚动区域
                    let newScrollSizeY = this.chatListRect.sizeDelta.y + item.ItemHeight;
                    this.chatListRect.sizeDelta = G.getCacheV2(this.scrollRectSize.x, newScrollSizeY);

                    this.activeItems.push(item);
                    item.rectTransform.anchoredPosition = G.getCacheV2(0, this.nextPosY);
                    this.nextPosY += item.ItemHeight;
                    this.topIndex--;
                }
            }
        }
    }

    private getVacantChatItem(): ChatItem {
        let chatItem: ChatItem;
        let len: number = this.m_chatItems.length;
        if (this.m_curChatItemIdx < len) {
            chatItem = this.m_chatItems[this.m_curChatItemIdx];
        } else {
            let itemGo = UnityEngine.UnityObject.Instantiate(this.chatPrefab, this.chatList.transform, false) as UnityEngine.GameObject;
            chatItem = new ChatItem(this);
            chatItem.setComponents(itemGo);
            this.m_chatItems.push(chatItem);
        }
        this.m_curChatItemIdx++;
        return chatItem;
    }

    /**
    * 添加一个道具
    * @param itemName 名称
    * @param guid 唯一id
    * @param textColor 文本颜色
    *
    */
    appendItem(itemConfig: GameConfig.ThingConfigM, guid: Protocol.ThingGUID, closePanel: boolean): void {
        G.ModuleMgr.chatModule.processInputText(this.m_curInputData);
        let data = G.ActionHandler.getChatLinkData(this.m_curInputData, itemConfig, guid, closePanel);
        this.m_curInputData.listMsgData.push(data);
        this.chatInput.text = this.chatInput.text + data.msg;
    }

    /**
    * boss传闻在宗门和世界频道也要显示
    * @param data
    * @return
    *
    */
    private isBossNews(data: ChannelData): boolean {
        if (this.m_curChannelId != Macros.CHANNEL_GUILD && this.m_curChannelId != Macros.CHANNEL_WORLD && this.m_curChannelId != Macros.CHANNEL_TEAM) {
            return false;
        }
        for (let msg of data.listMsgData) {
            if (msg.type == Macros.MSGDATATYPE_FENGMOTA_PANEL) {
                return true;
            }
        }
        return false;
    }

    clearInput(): void {
        this.chatInput.text = "";
        this.m_curInputData.reset();
    }

    onClickSendMessageBt() {
        //发送按钮
        G.AudioMgr.playBtnClickSound();
        let inputInformation = this.chatInput.text;
        this.m_curInputData.displayMsg = inputInformation;
        G.ModuleMgr.chatModule.processInputText(this.m_curInputData);
        this.chatInput.text = this.m_curInputData.displayMsg;
        if (this.m_curInputData.displayMsg.length == 0) {
            return;
        }
        this.m_curInputData.id = this.m_curChannelId;
        //记录自己历史聊天
        G.ModuleMgr.chatModule.sendChat(this.m_curInputData, this);
        this.records.push(inputInformation);
        G.GuideMgr.processGuideNext(EnumGuide.ChatWorld, EnumGuide.ChatWorldClickSendBtn);
    }

    /**点击关闭按钮*/
    private onClickCloselBt() {
        let view = G.ViewCacher.roleMenuView;
        //如果人物信息面板打开的话
        if (view.isOpened) {
            view.close();
            return;
        }
        let emoijPanel = G.ViewCacher.emoijPanel;
        if (emoijPanel.isOpened && emoijPanel.chatToolPanelRect.anchoredPosition.y == 0) {
            emoijPanel.chatToolPanelAnimator.Play("BQdown");
            emoijPanel.timeOut();
            return;
        }
        this.close();
    }

    /**点击表情按钮打开表情面板*/
    private onClickBqBt() {
        G.AudioMgr.playBtnClickSound();
        G.ViewCacher.emoijPanel.open(this.records, ChatType.ChatView);
    }


    onClickTalkerHead(item: ChatItem, roleAbstract: RoleAbstract) {
        G.ViewCacher.roleMenuView.open(roleAbstract, MenuPanelType.fromChat);
    }




    ////////////////////// 点击超链接 ////////////////////////////

    onUrlClick(value: string) {
        if (G.ActionHandler.checkCrossSvrUsable(true)) {
            let msgData = RichTextUtil.getEventData(value);
            if (null != msgData) {
                G.ModuleMgr.chatModule.doLinkAction(msgData);
            }
        }
    }
}