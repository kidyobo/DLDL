import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { UnitUtil } from 'System/utils/UnitUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { RCRecommendItem } from 'System/data/TaskRecommendData'
import { DataFormatter } from "System/utils/DataFormatter";
import { TabSubForm } from 'System/uilib/TabForm'
import { RiChangView } from 'System/richang/RiChangView'
class RiChangListItem {
    private textName: TextGetSet;
    private textReward: TextGetSet;
    private textTimes: TextGetSet;
    private recommend: GameObjectGetSet;
    private btnGo: GameObjectGetSet;
    private tipMark: GameObjectGetSet;
    private icon: UnityEngine.UI.Image;
    private time: GameObjectGetSet;
    private textTime: TextGetSet;
    data: RCRecommendItem;
    setComponent(obj: UnityEngine.GameObject) {
        this.textName = new TextGetSet(ElemFinder.findText(obj, "textName"));
        this.textReward = new TextGetSet(ElemFinder.findText(obj, "textReward"));
        this.textTimes = new TextGetSet(ElemFinder.findText(obj, "textTimes"));
        this.recommend = new GameObjectGetSet(ElemFinder.findObject(obj, "recommend"));
        this.btnGo = new GameObjectGetSet(ElemFinder.findObject(obj, "btnGo"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(obj, "btnGo/tipMark"));
        this.time = new GameObjectGetSet(ElemFinder.findObject(obj, "time"));
        this.textTime = new TextGetSet(ElemFinder.findText(obj, "time/textTime"));
        this.icon = ElemFinder.findImage(obj, "icon");
        Game.UIClickListener.Get(this.btnGo.gameObject).onClick = delegate(this, this.onClick);
    }

    update(data: RCRecommendItem) {
        this.data = data;
        this.icon.sprite = G.AltasManager.getRichangIcon(data.id.toString());
        this.textName.text = data.config.m_szName;
        this.textReward.text = uts.format('获取:{0}', TextFieldUtil.getColorText(data.config.m_szRewardDesc, Color.YELLOW));
        this.recommend.SetActive(data.config.m_iRecommend == KeyWord.GENERAL_YES);
        let contentstr: string;
        if (data.contentStr) {
            contentstr = data.contentStr;
        }
        else {
            contentstr = "";
        }
        this.tipMark.SetActive(data.redTip > 0);

        if (data.config.m_iOperationType == KeyWord.RECOMMEND_TYPE_ACTIVITY) {
            let status: Protocol.ActivityStatus;
            let actid = -1;
            if (data.config.m_iFunctionType == Macros.ACTIVITY_ID_GUILDPVPBATTLE) {
                //宗门战判断开服天数 前七天是宗门战 之后是跨服宗门战
                let startServerDay: number = G.SyncTime.getDateAfterStartServer();
                actid = startServerDay <= 7 ? Macros.ACTIVITY_ID_GUILDPVPBATTLE : Macros.ACTIVITY_ID_CROSS_GUILDPVPBATTLE;
            }
            else {
                actid = data.config.m_iFunctionType;
            }
            status = G.DataMgr.activityData.getActivityStatus(actid);

            if (null != status && Macros.ACTIVITY_STATUS_RUNNING == status.m_ucStatus) {
                this.btnGo.SetActive(true);
                this.time.SetActive(false);
                contentstr = TextFieldUtil.getColorText("火热进行中", Color.YELLOW);
            } else {
                this.btnGo.SetActive(false);
                if (null != status && status.m_iNextTime < Math.round(G.SyncTime.getNextTime(0, 0, 0) / 1000)) {
                    this.time.SetActive(true);
                    this.textTime.text = DataFormatter.second2hhmm(status.m_iNextTime);
                } else {
                    this.time.SetActive(false);
                }
            }
        }
        else {
            this.btnGo.SetActive(true);
            this.time.SetActive(false);
        }
        this.textTimes.text = contentstr;
    }
    private onClick() {
        G.Uimgr.closeForm(RiChangView);
        //面板自定义类型
        let data = this.data;
        switch (data.config.m_iOperationType) {
            case KeyWord.RECOMMEND_TYPE_OPENPANEL:
                G.ActionHandler.executeFunction(data.config.m_iFunctionType);
                break;
            case KeyWord.RECOMMEND_TYPE_GOTONPC:
                G.ModuleMgr.questModule.doQuestByType(data.config.m_iFunctionType, false);
                break;
            case KeyWord.RECOMMEND_TYPE_PINSTANCE:
                if (data.config.m_iFunctionType == KeyWord.OTHER_FUNCTION_DYZSPIN) {
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
                }
                break;
            case KeyWord.RECOMMEND_TYPE_ACTIVITY:
                G.ActionHandler.handleDailyAct(data.config.m_iFunctionType);
                break;
        }
    }
}
export class RiChangBaseView extends TabSubForm {
    private alldata: RCRecommendItem[];
    private list: List;
    private openid: number = 0;

    private txtName: TextGetSet;
    private textLv: TextGetSet;
    private textCondition: TextGetSet;
    private textDesc: TextGetSet;
    private rewardList: List;

    public type = 0;

    constructor(id: number, type: number) {
        super(id);
        this.type = type;
    }
    protected resPath(): string {
        return UIPathData.RiChangBaseView;
    }
    public open(openid: number = 0) {
        this.openid = openid;
        super.open();
    }
    protected onOpen() {
        this.updateView();
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.list.onVirtualItemChange = delegate(this, this.onUpdateItem);
        this.txtName = new TextGetSet(this.elems.getText("txtName"));
        this.textLv = new TextGetSet(this.elems.getText("textLv"));
        this.textCondition = new TextGetSet(this.elems.getText("textCondition"));
        this.textDesc = new TextGetSet(this.elems.getText("textDesc"));
        this.rewardList = this.elems.getUIList("rewardList");
    }

    protected initListeners(): void {
        this.addListClickListener(this.list, this.onUpdateSelected);
    }

    private onClickBtnClose() {
        this.close();
    }
    private onUpdateItem(item: ListItem) {
        let data = this.alldata[item._index];
        let itemdata = item.data.itemdata as RiChangListItem;
        if (!itemdata) {
            itemdata = item.data.itemdata = new RiChangListItem();
            itemdata.setComponent(item.gameObject);
        }
        itemdata.update(data);
    }
    public updateView() {
        this.alldata = G.DataMgr.taskRecommendData.getRCRecommendArray(this.type);
        this.list.Count = this.alldata.length;
        this.list.Refresh();
        let index = 0;
        if (this.openid > 0) {
            for (let i = 0, len = this.alldata.length; i < len; i++) {
                let data = this.alldata[i];
                if (data.id == this.openid) {
                    index = i;
                    break;
                }
            }
            this.openid = -1;
        }
        this.list.Selected = index;
        this.onUpdateSelected(index);
        this.list.ScrollByAxialRow(Math.floor(index / 4));
    }
    private onUpdateSelected(index: number) {
        let data = this.alldata[index];
        if (!data) {
            return;
        }
        this.txtName.text = data.config.m_szName;
        this.textLv.text = TextFieldUtil.getColorText(data.config.m_iFunctionLevel.toString(), G.DataMgr.heroData.level >= data.config.m_iFunctionLevel ? Color.GREEN : Color.RED);
        this.textCondition.text = data.config.m_szJoinDesc;
        this.textDesc.text = data.config.m_szRuleDesc;
        let gifts = data.config.m_stShowList;
        let giftCnt = 0;
        if (null != gifts) {
            giftCnt = gifts.length;
        }
        this.rewardList.Count = giftCnt;
        for (let i = 0; i < giftCnt; i++) {
            let giftdata = gifts[i];
            let item = this.rewardList.GetItem(i);
            let iconitem: IconItem = item.data.iconitem;
            if (!iconitem) {
                iconitem = item.data.iconitem = new IconItem();
                iconitem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
                iconitem.setTipFrom(TipFrom.normal);
            }
            iconitem.updateById(giftdata.m_uiThingId, giftdata.m_uiThingNum);
            iconitem.updateIcon();
        }
    }
}