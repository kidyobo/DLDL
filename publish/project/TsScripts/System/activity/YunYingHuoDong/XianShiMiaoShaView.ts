import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { Macros } from "System/protocol/Macros"
import { UIPathData } from 'System/data/UIPathData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from "System/utils/DataFormatter"
import { ActivityRuleView } from "System/diandeng/ActivityRuleView"

class MiaoShaItem extends ListItemCtrl {

    private icon: UnityEngine.GameObject;
    private name: UnityEngine.UI.Text;
    private yuanJiatext: UnityEngine.UI.Text;
    private xianJiaText: UnityEngine.UI.Text;
    private keGouText: UnityEngine.UI.Text;
    private shenYuText: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private iconItem: IconItem;

    private miaoShaId: number = 0;
    

    setComponents(go: UnityEngine.GameObject,itemIcon_Normal:UnityEngine .GameObject ) {
        this.icon = ElemFinder.findObject(go, 'icon');
        this.name = ElemFinder.findText(go, 'nameBg/name');
        this.yuanJiatext = ElemFinder.findText(go, 'yuanjia/yuanJiatext');
        this.xianJiaText = ElemFinder.findText(go, 'xianjia/xianJiaText');
        this.keGouText = ElemFinder.findText(go, 'kegou/keGouText');
        this.shenYuText = ElemFinder.findText(go, 'shengyu/shenYuText');
        this.btnBuy = ElemFinder.findObject(go,'btnBuy');
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(cfg: Protocol.RushPurchaseItem, statue: number) {
        this.miaoShaId = cfg.m_uiID;
        this.iconItem.updateById(cfg.m_uiItemID);
        this.iconItem.updateIcon();
        let thingData = ThingData.getThingConfig(cfg .m_uiItemID );
        this.name.text = thingData.m_szName;
        this.yuanJiatext.text = cfg.m_uiShowPrice.toString();
        this.xianJiaText.text = cfg.m_uiPrice.toString();
        this.keGouText.text = cfg.m_ucLimitCount.toString();
        this.shenYuText.text = cfg.m_ucTotalCount.toString();

        if (statue == 0 || cfg.m_ucLimitCount==0||cfg.m_ucTotalCount==0) {
            UIUtils.setButtonClickAble(this.btnBuy ,false);
        }
        else
        {
            UIUtils.setButtonClickAble(this.btnBuy, true);
        }
       
    }

    private onClickBtnBuy()
    {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE , Macros.ACT_RUSH_PURCHASE_BUY ,this .miaoShaId ));
    }
}

export class XianShiMiaoShaView extends CommonForm {
    private btnReturn: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;
    private btnRefresh: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private time: UnityEngine.UI.Text;
    private actTime: UnityEngine.UI.Text;
    private rewardList: List;


    private MiaoShaItems: MiaoShaItem[] = [];
    private openStatus: number = 0;
    private endTime: number = 0;
    constructor() {
        super(Macros.ACTIVITY_ID_RUSH_PURCHASE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.XianShiMiaoShaView;
    }

    open() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
        super.open();
    }

    protected initElements() {
        this.btnReturn = this.elems.getElement('btnReturn');
        this.btnRule = this.elems.getElement('btnRule');
        this.btnRefresh = this.elems.getElement('btnRefresh');
        this.rewardList = this.elems.getUIList('rewardList');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.time = this.elems.getText('time');
        this.actTime = this.elems.getText('actTime');
    }

    protected initListeners() {
        this.addClickListener(this.btnReturn, this.onClickBtnReturn);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnRefresh, this.onClickBtnRefresh);

    }

    protected onOpen() {
        this.updateView();
    }

    updateView() {
        let data = G.DataMgr.activityData.xsmsData;
        if (data == null)
            return;
        this.openStatus = data.m_ucOpenStatus;
        this.endTime = data.m_uiLeafTime;
        let letOldItemCnt = this.MiaoShaItems.length;
        let count = data.m_ucCount;
        for (let cfg of data.m_stRushPurchaseList) {
            if (cfg.m_uiItemID == 0) {
                count--;
            }
        }

        this.rewardList.Count = count;
        let item: MiaoShaItem;
        for (let i = 0; i < count; i++) {
            if (i < letOldItemCnt) {
                item = this.MiaoShaItems[i];

            }
            else {
                item = new MiaoShaItem();
                item.setComponents(this.rewardList.GetItem(i).gameObject, this.itemIcon_Normal);
                this.MiaoShaItems.push(item);
            }

            item.update(data.m_stRushPurchaseList[i], data.m_ucOpenStatus);

        }
        UIUtils.setButtonClickAble(this.btnRefresh, data.m_ucOpenStatus != 0);


        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
        this.onCountDownTimer2();
        this.addTimer("2", 1000, 0, this.onCountDownTimer2);
    }


    private onCountDownTimer() {
        this.endTime--;
        if (this.endTime <= 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
        }

        if (this.openStatus == 0) {
            this.time.text = uts.format('下轮秒杀开启倒计时：{0}', DataFormatter.second2day(this.endTime));
        }
        else if (this.openStatus == 1) {
            this.time.text = uts.format('本轮秒杀倒计时：{0}', DataFormatter.second2day(this.endTime));
        }
    }

    private onCountDownTimer2() {
        let activityData = G.DataMgr.activityData;
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_RUSH_PURCHASE)) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_RUSH_PURCHASE);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.actTime.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        } else {
            this.actTime.text = '活动剩余时间：已结束';
        }
    }

    private onClickBtnReturn() {
        this.close();
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(464), '限时秒杀');
    }

    private onClickBtnRefresh() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
    }
}