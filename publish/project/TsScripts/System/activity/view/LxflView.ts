import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List } from "System/uilib/List"
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { KeyWord } from "System/constants/KeyWord"
import { UIUtils } from 'System/utils/UIUtils'
import { TextGetSet } from 'System/uilib/CommonForm'
import { PayView } from 'System/pay/PayView'
import { VipTab, VipView } from "System/vip/VipView"


class AccAwardItem {
    private jewelTxt: UnityEngine.UI.Text;
    private sumDayTxt: UnityEngine.UI.Text;
    private getBtn: UnityEngine.GameObject;
    private getTxt: UnityEngine.UI.Text;
    private rewardList: List;
    private iconItems: Array<IconItem> = [];

    //data
    private accOneDatas: Array<Protocol.CSLXFLAccOne> = [];

    setComponents(go: UnityEngine.GameObject) {
        this.jewelTxt = ElemFinder.findText(go, 'show/jewelTxt');
        this.sumDayTxt = ElemFinder.findText(go, 'show/sumDayTxt');
        this.getBtn = ElemFinder.findObject(go, 'BT_Get');
        this.getTxt = ElemFinder.findText(go, 'BT_Get/Text');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        //显示的奖励物品
        this.rewardList.Count = 3;
        for (let i = 0; i < this.rewardList.Count; i++) {
            let iconItem = new IconItem();
            let rewardItem = this.rewardList.GetItem(i);
            iconItem.setUsuallyIcon(rewardItem.gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);
        }

        Game.UIClickListener.Get(this.getBtn).onClick = delegate(this, this.onClickGet);
    }

    update(configs: Array<GameConfig.LXFLActCfgM>, accOneDatas: Array<Protocol.CSLXFLAccOne>, jewel: number) {
        this.accOneDatas = accOneDatas;
         //钻石
        this.jewelTxt.text = jewel.toString();
        //显示的奖励物品
        for (let i = 0; i < this.rewardList.Count; i++) {  
            this.iconItems[i].updateById(configs[i].m_stItemList[0].m_uiID, configs[i].m_stItemList[0].m_uiCount);
            this.iconItems[i].updateIcon();
        }
        //累计天数,取数组最后一位
        this.sumDayTxt.text = TextFieldUtil.getColorText('已累计', Color.WHITE) + TextFieldUtil.getColorText(this.accOneDatas[this.accOneDatas.length-1].m_ucChargeDays.toString(), Color.GREEN) + TextFieldUtil.getColorText('天', Color.WHITE);

        //按钮设置
        this.setGetBtn();
    }

    private setGetBtn() {
        //按钮显示状态
        UIUtils.setGrey(this.getBtn, this.getAccOneIDs().length == 0);

        //检测是否都已领取完
        let bAllGet: boolean = false
        for (let accOneData of this.accOneDatas) {
            if (accOneData.m_ucGetStatus != Macros.CHARGE_AWARD_DONE_GET) {
                bAllGet = true;
                break;
            }
        }
        if (bAllGet) {
            this.getTxt.text = '领取';
        }
        else {
            this.getTxt.text = '已领取完';
        }

    }

    private onClickGet() {
        let idDatas: Array<number> = this.getAccOneIDs();
        if (idDatas.length == 0) return;

        for (let i = 0; i < idDatas.length; i++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_LXFL, Macros.ACTIVITY_LXFL_GET, KeyWord.LXFL_TYPE_ACC, idDatas[i]));
        }    
    }

    private getAccOneIDs(): Array<number> {
        let idList: number[] = [];
        for (let accOneData of this.accOneDatas) {
            if (accOneData.m_ucGetStatus == Macros.CHARGE_AWARD_WAIT_GET) {
                idList.push(accOneData.m_ucID);
            }
        }
        return idList;
    }
}

class DayAwardItem {
    private jewelTxt: UnityEngine.UI.Text;
    private getBtn: UnityEngine.GameObject;
    private getTxt: UnityEngine.UI.Text;
    private rewardList: List;
    private iconItem: IconItem;

    //data
    private data: Protocol.CSLXFLDayOne;

    setComponents(go: UnityEngine.GameObject) {
        this.jewelTxt = ElemFinder.findText(go, 'show/jewelTxt');
        this.getBtn = ElemFinder.findObject(go, 'BT_Get');
        this.getTxt = ElemFinder.findText(go, 'BT_Get/Text');

        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        this.rewardList.Count = 1;
        this.iconItem = new IconItem();

        Game.UIClickListener.Get(this.getBtn).onClick = delegate(this, this.onClickGet);
    }

    update(config: GameConfig.LXFLActCfgM, data: Protocol.CSLXFLDayOne, jewel: number) {
        this.data = data;
        
        let rewardItem = this.rewardList.GetItem(0);
        this.iconItem.setUsuallyIcon(rewardItem.gameObject);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.iconItem.updateById(config.m_stItemList[0].m_uiID, config.m_stItemList[0].m_uiCount);
        this.iconItem.updateIcon();
        this.jewelTxt.text = jewel.toString();

        //按钮设置
        this.setGetBtn();
    }

    private setGetBtn() {
        UIUtils.setGrey(this.getBtn, this.data.m_ucGetStatus != Macros.CHARGE_AWARD_WAIT_GET);
        if (this.data.m_ucGetStatus == Macros.CHARGE_AWARD_CANT_GET) {
            this.getTxt.text = '不可领取';
        }
        else if (this.data.m_ucGetStatus == Macros.CHARGE_AWARD_WAIT_GET) {
            this.getTxt.text = '领取奖励';
        }
        else if (this.data.m_ucGetStatus == Macros.CHARGE_AWARD_DONE_GET) {
            this.getTxt.text = '已领取';
        }
    }

    private onClickGet() {
        if (this.data.m_ucGetStatus == 0) return;

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_LXFL, Macros.ACTIVITY_LXFL_GET, KeyWord.LXFL_TYPE_DAY, this.data.m_ucID));
    }
}


export class LxflView extends CommonForm 
{
    private btn_return: UnityEngine.GameObject;
    private btn_pay: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private accAwardList: List;
    private dayAwardList: List;
    private leftTime: UnityEngine.UI.Text;
    private jewelsTxt: TextGetSet;

    //data
    //Item数
    private awradNum = 3;
    //钻石充值数
    private jewels: number[] = [500, 1000, 2000];
    //累积天数
    private days: number[] = [2, 3, 5];
    //累积Item
    private accAwardItems: Array<AccAwardItem> = [];
    //今日Item
    private dayAwardItems: Array<DayAwardItem> = [];

    constructor()
    {
        super(0);
    }

    layer():UILayer 
    {
        return UILayer.Normal;
    }

    protected resPath(): string 
    {
        return UIPathData.LxflView;
    }

    protected initElements()
    {
        this.btn_return = this.elems.getElement('btnReturn');
        this.btn_pay = this.elems.getElement('BT_Pay');
        this.mask = this.elems.getElement('mask');
        this.accAwardList = this.elems.getUIList('accAwardList');
        this.dayAwardList = this.elems.getUIList('dayAwardList');
        this.leftTime = this.elems.getText('Txt_LeftTime');
        this.jewelsTxt = new TextGetSet(this.elems.getText('Txt_jewel'));
    }

    protected initListeners()
    {
        this.addClickListener(this.btn_return, this.onClickBtnReturn);
        this.addClickListener(this.mask, this.onClickBtnReturn);
        this.addClickListener(this.btn_pay, this.onClickBtnGoPay);
    }

    public updateAwardList() {
        let data = G.DataMgr.activityData.lxflData;      
        //累积奖励
        for (let i = 0; i < this.accAwardList.Count; i++) {
            let item = this.accAwardList.GetItem(i);
            if (this.accAwardItems[i] == null) {
                this.accAwardItems[i] = new AccAwardItem();
                this.accAwardItems[i].setComponents(item.gameObject);
            }
            //累积奖励Icon
            let jewel = this.jewels[i];
            let configs: Array<GameConfig.LXFLActCfgM> = [];
            for (let j = 0; j < this.jewels.length; j++) {
                let date = this.days[j];           
                let config = G.DataMgr.activityData.getLxflByCondition1AndCondition2(KeyWord.LXFL_TYPE_ACC, jewel, date);
                configs.push(config)
            }
            let accOneDatas: Array<Protocol.CSLXFLAccOne> = [];
            for (let k = 0; k < data.m_stAccList.length; k++) {
                let config = G.DataMgr.activityData.getLxflByID(KeyWord.LXFL_TYPE_ACC, data.m_stAccList[k].m_ucID);
                if (config.m_iCondition1 == jewel) {
                    accOneDatas.push(data.m_stAccList[k]);
                }
            }
            this.accAwardItems[i].update(configs, accOneDatas, jewel);         
        }

        //今日充值奖励
        for (let i = 0; i < this.dayAwardList.Count; i++) {
            let item = this.dayAwardList.GetItem(i);
            if (this.dayAwardItems[i] == null) {
                this.dayAwardItems[i] = new DayAwardItem();
                this.dayAwardItems[i].setComponents(item.gameObject);
            }
            let config = G.DataMgr.activityData.getLxflByID(KeyWord.LXFL_TYPE_DAY, data.m_stDayList[i].m_ucID);
            this.dayAwardItems[i].update(config, data.m_stDayList[i], this.jewels[i]);            
        }

        //钻石累积
        this.jewelsTxt.text = TextFieldUtil.getColorText('今日已累积充值  ', Color.GREEN) + TextFieldUtil.getColorText(data.m_iDayCharge.toString(), Color.WHITE) + TextFieldUtil.getColorText('  钻石', Color.GREEN);

        //计时器
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    private stopTimer() {
        if (this.hasTimer('1')) {
            this.removeTimer('1');
        }
    }

    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_LXFL)) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_LXFL);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.leftTime.text = uts.format('活动倒计时：{0}', DataFormatter.second2day(time));
        } else {
            this.leftTime.text = '活动倒计时：已结束';
        }
    }

    private onBtnRecordClick() {
        //G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(456), '玩法说明');
    }

    protected onOpen()
    {
        this.accAwardList.Count = this.awradNum;
        this.dayAwardList.Count = this.awradNum;
 
        this.updateAwardList();
    }

    private onClickBtnGoPay() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
    }

    protected onClose() {
        this.stopTimer();
    }

    private onClickBtnReturn()
    {
        this.close();
    }
}