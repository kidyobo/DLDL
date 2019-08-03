import { BatBuyView } from "System/business/view/BatBuyView";
import { MallBaseItem } from "System/business/view/MallBaseItem";
import { PriceBar } from "System/business/view/PriceBar";
import { EnumGuide, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { NPCSellData } from "System/data/NPCSellData";
import { UIPathData } from "System/data/UIPathData";
import { MarketItemData } from "System/data/vo/MarketItemData";
import { Global as G } from "System/global";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { ElemFinder, ElemFinderMySelf } from "System/uilib/UiUtility";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { ThingUtil } from "System/utils/ThingUtil";
import { UIUtils } from "System/utils/UIUtils";
import { Macros } from 'System/protocol/Macros'
import { DataFormatter } from 'System/utils/DataFormatter'
import { EnumStoreID, EnumAutoUse } from 'System/constants/GameEnum'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { CeremonyBoxRewardView } from 'System/activity/view/CeremonyBoxRewardView';
import { EnumDurationType, FuncBtnState } from "System/constants/GameEnum";
import { RankListItemData, SelfChallengeRankView } from 'System/pinstance/selfChallenge/SelfChallengeRankView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

export class CeremonyBoxView extends CommonForm {

    private txtActivityTime: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private text: UnityEngine.UI.Text;

    private btnReward: UnityEngine.GameObject;
    private btnRank: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;
    protected itemData: MarketItemData;
    private myRewardListData: RewardIconItemData[] = [];
    private iconItems: IconItem[] = [];
    private _allRankListData: RankListItemData[] = new Array<RankListItemData>();

    private list: List;
    private icons: IconItem[] = [];

    private isActivityOpen = false;

    private cnt: number = 12;

    private canGet: boolean = false;


    private rewardItemData: RewardIconItemData;
    private icon: IconItem;
    private dropIds: number[] = [60150011, 60150012, 60150013, 60150014];



    constructor() {
        super(KeyWord.OTHER_FUNCTION_MEREONYBOX);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.CeremonyBoxView;
    }

    protected initElements() {
        this.txtActivityTime = this.elems.getText('txtTime');
        this.btnBuy = this.elems.getElement('btnBuy');
        this.text = this.elems.getText('Text');

        //UIUtils.setButtonClickAble(this.btnBuy, false);
        //this.text.text = '已结算';

        this.btnReward = this.elems.getElement('btnReward');
        this.btnRank = this.elems.getElement('btnRank');
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList('list');

    }



    protected onOpen() {
        this.isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_SDBX);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_OPEN_PANEL));

        this.list.Count = this.cnt;
        let activityData = G.DataMgr.activityData;
        let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SDBX);
        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let endtime = Math.max(0, status.m_iEndTime - 86400);
        this.canGet = now < endtime ? true : false;
        if (this.canGet == true) {
            UIUtils.setButtonClickAble(this.btnBuy, true);
            this.text.text = '购买';
        } else {
            UIUtils.setButtonClickAble(this.btnBuy, false);
            this.text.text = '已结算';
        }
        for (let i = 0; i < this.cnt; i++) {
            if (this.iconItems[i] == null) {
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsualIconByPrefab(this.itemIcon_Normal, this.list.GetItem(i).gameObject);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
        }
        this.addTimer("1", 1000, 0, this.onTimer);

        this.update();

    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("btnBuy"), this.onClickBtnBuy);
        this.addClickListener(this.btnReward, this.onClickBtnReward);
        this.addClickListener(this.btnRank, this.onClickBtnRank);


    }


    protected onTimer() {
        let activityData = G.DataMgr.activityData;
        let oldActivityOpen = this.isActivityOpen;
        this.isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_SDBX);
        if (oldActivityOpen != this.isActivityOpen) {
            this.update();
        }
        if (this.isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SDBX);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.txtActivityTime.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));

            let endtime = Math.max(0, status.m_iEndTime - 86400);
            this.canGet = now < endtime ? true : false;
            if (this.canGet == true) {
                UIUtils.setButtonClickAble(this.btnBuy, true);
                this.text.text = '购买';
            } else {
                UIUtils.setButtonClickAble(this.btnBuy, false);
                this.text.text = '已结算';
            }
        } else {
            this.txtActivityTime.text = '活动剩余时间：已结束';
        }
    }

    update() {


        let today = G.SyncTime.getDateAfterStartServer();
        let boxIdIndex = 0;
        if (today < 8) {
            boxIdIndex = 0;
        }
        else if (today >= 8 && today < 15) {
            boxIdIndex = 1;

        }
        else if (today >= 15 && today < 22) {
            boxIdIndex = 2;

        }
        else {
            boxIdIndex = 3;

        }

        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        let pageData: MarketItemData[] = npcSellData.getMallListByType(EnumStoreID.Ceremony);

        if (pageData != null) {
            for (let i = 0; i < pageData.length; i++) {
                if (pageData[i].sellConfig.m_iSaleCondVal == boxIdIndex + 1) {
                    this.itemData = pageData[i];
                }
            }
        }

        this.list.Count = this.cnt;
        let dropCfg = DropPlanData.getDropPlanConfig(this.dropIds[boxIdIndex]);
        if (dropCfg == null) return;
        for (let i = 0; i < this.cnt; i++) {
            this.iconItems[i].updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            this.iconItems[i].updateIcon();
        }
    }

    protected onClickBtnBuy(): void {
        if (this.itemData != null) {
            this.itemData.needRemind = false;
            let sellConfig = this.itemData.sellConfig;
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(sellConfig.m_iItemID, 1, sellConfig.m_iStoreID, sellConfig.m_astExchange[0].m_iExchangeID, sellConfig.m_ucAmount, EnumAutoUse.none);
        }
    }
    protected onClickBtnReward(): void {

        G.Uimgr.createForm<CeremonyBoxRewardView>(CeremonyBoxRewardView).open();
    }
    protected onClickBtnRank(): void {
        let info = G.DataMgr.activityData.sdbxPanelInfo;
        if (!info) {
            return;
        }
        this.updateAllRankList();
        let str = info.m_uiRank > 50 ? ('我的排名:未上榜') : ('我的排名:' + info.m_uiRank.toString());
        G.Uimgr.createForm<SelfChallengeRankView>(SelfChallengeRankView).open('盛典宝箱排行榜', '购买个数', this._allRankListData, str);
    }
    private updateAllRankList(): void {
        let info = G.DataMgr.activityData.sdbxPanelInfo;
        if (!info) {
            return;
        }
        let list = info.m_stSDBXRankInfo.m_stRankInfoList
        let len: number = info.m_stSDBXRankInfo.m_iCount;
        this._allRankListData.length = 0;
        for (let i: number = 0; i < len; i++) {
            if (this._allRankListData.length < len) {
                let itemVo: RankListItemData = new RankListItemData();
                itemVo.roleName = list[i].m_stRoleInfo.m_stBaseProfile.m_szNickName;
                itemVo.value = list[i].m_iCountNum;
                itemVo.rank = i + 1;
                this._allRankListData.push(itemVo);
            }
        }
    }
}