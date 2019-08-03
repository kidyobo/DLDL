import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { ThingItemData } from "System/data/thing/ThingItemData"
import { TipFrom } from 'System/tip/view/TipsView'
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from "System/global"
import { List, ListItem } from 'System/uilib/List'
import { ChatView } from 'System/chat/ChatView'
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { FriendPanel } from 'System/friend/FriendPanel'
import { EnumEffectRule } from 'System/constants/GameEnum'

export enum ChatType {
    ChatView = 0,
    FriendView = 1,
}


/**聊天表情面板*/
export class EmoijPanel extends CommonForm {

    ///////////////////////聊天工具面板相关(表情,背包,装备,历史聊天)////////////////////////
    /**聊天工具面板*/
    chatToolPanel: UnityEngine.GameObject = null;
    chatToolPanelAnimator: UnityEngine.Animator = null;
    chatToolPanelRect: UnityEngine.RectTransform;
    /**表情面板*/
    private biaoQingPanel: UnityEngine.GameObject = null;
    /**表情list*/
    private biaoQingList: List = null;
    /**历史聊天面板*/
    private liShiPanel: UnityEngine.GameObject = null;
    /**历史聊天List*/
    private liShiList: List = null;
    /**装备面板*/
    private equipPanel: UnityEngine.GameObject = null;
    /**装备显示List*/
    private equipList: List = null;
    /**背包全部页（默认显示全部物品的页面）*/
    private bagItemDatas: ThingItemData[] = [];
    /**表情图集*/
    private faceAltas: Game.UGUIAltas;
    private records: string[] = [];
    private chatType: ChatType = ChatType.ChatView;
    private max_recordNum: number = 8;
    private iconItems: IconItem[] = [];
    private toggleGroup: UnityEngine.UI.ActiveToggleGroup;

    private itemIcon_Normal: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.EmoijPanel;
    }
    protected initElements() {
        //聊天工具面板
        this.chatToolPanel = this.elems.getElement("chatToolPanel");
        this.chatToolPanelRect = ElemFinderMySelf.findRectTransForm(this.chatToolPanel);
        this.chatToolPanelAnimator = this.chatToolPanel.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        this.biaoQingPanel = this.elems.getElement("biaoqingPanel");
        this.biaoQingList = ElemFinder.getUIList(this.biaoQingPanel);
        this.liShiPanel = this.elems.getElement("lishiPanel");
        this.liShiList = ElemFinder.getUIList(this.elems.getElement("lishiList"));
        this.equipPanel = this.elems.getElement("equipPanel");
        this.equipList = ElemFinder.getUIList(this.elems.getElement("equipList"));
        //表情图集
        this.faceAltas = this.elems.getElement("altas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        //初始化表情聊天图片(共有39个表情目前)
        this.biaoQingList.Count = 39;
        for (let i = 0; i < 39; i++) {
            let biaoQingItem = this.biaoQingList.GetItem(i);
            let biaoQingImage = biaoQingItem.gameObject.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
            biaoQingImage.sprite = this.faceAltas.Get(i.toString());
            let obj = biaoQingItem.gameObject;
            obj.name = "/0" + (i + 1).toString();
            if (i >= 9) {
                obj.name = "/" + (i + 1).toString();
            }
            if (obj.name == '/08') {
                obj.name = '/0a';
            } else if (obj.name == '/18') {
                obj.name = '/1a';
            } else if (obj.name == '/28') {
                obj.name = '/2a';
            } else if (obj.name == '/38') {
                obj.name = '/3a';
            }
        }

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.toggleGroup = this.elems.getToggleGroup("toggleGroup");
    }
    protected initListeners() {
        this.addClickListener(this.elems.getElement("btn_close"), this.onClickBqCancelBt);
        this.toggleGroup.onValueChanged = delegate(this, this.onToggleGroupChanged);
        this.addListClickListener(this.biaoQingList, this.onClickBqList);
        this.addListClickListener(this.liShiList, this.selectedHistroyContent);

        this.equipList.onVirtualItemChange = delegate(this, this.showAllBagIcon);
    }

    open(records: string[] = null, chatType: ChatType) {
        this.chatType = chatType;
        this.records = records;
        super.open();
    }


    protected onOpen() {
        this.liShiList.Count = 0;
        this.toggleGroup.Selected = 0;
        this.recordLsChatMessage();
    }

    protected onClose() {

    }

    private onToggleGroupChanged(index: number) {
        this.setPanelActive(index == 1, index == 0, (index == 2 || index == 3)); 
        switch (index) {
            case 0:
                G.ViewCacher.tipsView.close();
                break;
            case 1:
                G.ViewCacher.tipsView.close();
                this.biaoQingList.SetSlideAppearRefresh();
                this.biaoQingList.Refresh();
                break;
            case 2:
                let rawDatas1 = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
                this.bagItemDatas.length = 0;
                let rawObj1: ThingItemData;
                for (let i = 0; i < G.DataMgr.thingData.bagCapacity; i++) {
                    rawObj1 = rawDatas1[i];
                    if (null != rawObj1 && null != rawObj1.data) {
                        this.bagItemDatas.push(rawObj1);
                    }
                }
                this.equipList.Count = this.bagItemDatas.length;
                this.equipList.SetSlideAppearRefresh();
                this.equipList.Refresh();
                break;
            case 3:
                let rawDatas2 = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
                this.bagItemDatas.length = 0;
                let rawObj2: ThingItemData;
                for (let i = 0; i < ThingData.All_EQUIP_NUM + 1; i++) {
                    rawObj2 = rawDatas2[i];
                    if (null != rawObj2 && null != rawObj2.data) {
                        this.bagItemDatas.push(rawObj2);
                    }
                }
                this.equipList.Count = this.bagItemDatas.length;
                this.equipList.SetSlideAppearRefresh();
                this.equipList.Refresh();
                break;
        }
    }
    
    private setPanelActive(activeBq: boolean, activeLiShi: boolean, activeEquip: boolean) {
        this.biaoQingPanel.SetActive(activeBq);
        this.liShiPanel.SetActive(activeLiShi);
        this.equipPanel.SetActive(activeEquip);
    }

    private showAllBagIcon(item: ListItem) {
        // 展示所有背包物品
        let iconItem = item.data.iconItem as IconItem;
        if (!item.data.iconItem) {
            iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal,item.gameObject);
            iconItem.setTipFrom(TipFrom.chat);
            item.data.iconItem = iconItem;
        }
        iconItem.updateByThingItemData(this.bagItemDatas[item.Index]);
        iconItem.updateIcon();
    }

    private onClickBqList(index: number) {
        //选择表情
        let selectedObj = this.biaoQingList.GetItem(index).gameObject;
        if (this.chatType == ChatType.ChatView) {
            let chatView = G.Uimgr.getForm<ChatView>(ChatView);
            if (chatView != null) {
                chatView.chatInput.text = chatView.chatInput.text + selectedObj.name;
            }
        } else if (this.chatType == ChatType.FriendView) {
            let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
            if (friendPanel != null) {
                friendPanel.chatInput.text = friendPanel.chatInput.text + selectedObj.name;
            }
        }
        this.chatToolPanelAnimator.Play("BQdown");
        this.timeOut();
    }


    private recordLsChatMessage() {
        //刷出记录的历史聊天(规则为取数组最后面的值同时最多记录八条)
        if (this.records == null) {
            return;
        }
        let length = this.records.length;
        if (length > 0) {
            let from: number = 0;
            if (length <= this.max_recordNum) {
                from = 0;
            } else {
                from = length - this.max_recordNum;
            }
            this.liShiList.Count = length - from;
            for (let i = length; i > from; i--) {
                //拿到数组中最新的记录并刷新出来
                let obj = this.liShiList.GetItem(length - i);
                let text = obj.findText("Text");
                text.text = this.records[i - 1];
            }
        }
    }


    private selectedHistroyContent(index: number) {
        let obj = this.liShiList.GetItem(index);
        let clickRecord = obj.findText("Text");
        if (this.chatType == ChatType.ChatView) {
            let chatView = G.Uimgr.getForm<ChatView>(ChatView);
            if (chatView != null) {
                chatView.chatInput.text = chatView.chatInput.text + clickRecord.text;
            }
        } else if (this.chatType == ChatType.FriendView) {
            let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
            if (friendPanel != null) {
                friendPanel.chatInput.text = friendPanel.chatInput.text + clickRecord.text;
            }
        }
        this.chatToolPanelAnimator.Play("BQdown");
        this.timeOut();
    }


    private onClickBqCancelBt() {

        uts.log("close");
        //表情面板取消按钮
        this.chatToolPanelAnimator.Play("BQdown");
        this.timeOut();
        //this.close();
    }
    
    timeOut() {
        Game.Invoker.BeginInvoke(this.form, '1', 0.5 / 3, delegate(this, this.onFloatGetRewardAnimExit));
    }

    private onFloatGetRewardAnimExit() {
        this.close();
    }

}