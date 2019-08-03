import { EnumGuide, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { MainView } from 'System/main/view/MainView';
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { CommonForm, GameObjectGetSet, TextGetSet, UILayer } from "System/uilib/CommonForm";
import { List } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

export class LuckyCatView extends CommonForm {

    private btnClose: GameObjectGetSet;
    private btnRule: GameObjectGetSet;
    private awardInfoList: List;
    private wheel: GameObjectGetSet;
    private wheelInfoList: GameObjectGetSet;
    private btnDraw: GameObjectGetSet;
    private condition: UnityEngine.UI.Text;
    private countDown: UnityEngine.UI.Text;
    private drawIndex: number = -1;
    private activityEndTime: number = 0;
    private effectRoot: GameObjectGetSet;
    private rateTxt: TextGetSet;
    private maxRate: number = 5;
    // private point: GameObjectGetSet;
    private txtDiamond: TextGetSet;
    //vip限制
    private vipLimtImg:GameObjectGetSet;
    private vipLimtText:TextGetSet;
    private tableImg:GameObjectGetSet;
    constructor() {
        super(KeyWord.ACT_FUNCTION_KF_ZHAOCAIMAO);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.LuckyCatView;
    }

    protected initElements() {
        this.btnClose = new GameObjectGetSet(this.elems.getElement("btnClose"));
        this.btnRule = new GameObjectGetSet(this.elems.getElement("btnRule"));
        this.awardInfoList = this.elems.getUIList("awardInfoList");
        this.wheel = new GameObjectGetSet(this.elems.getElement("wheel"));
        this.wheelInfoList = new GameObjectGetSet(this.elems.getElement("wheelInfoList"));
        this.countDown = this.elems.getText("countDown");
        this.btnDraw = new GameObjectGetSet(this.elems.getElement("btnDraw"));
        this.condition = this.elems.getText("condition");
        this.effectRoot = new GameObjectGetSet(this.elems.getElement("effectRoot"));
        this.effectRoot.SetActive(false);
        this.txtDiamond = new TextGetSet(this.elems.getText("txtDiamond"));
        this.vipLimtImg = new GameObjectGetSet(this.elems.getElement('vipLimtImg'));
        this.vipLimtText = new TextGetSet(ElemFinder.findText(this.vipLimtImg.gameObject, 'vipLimtText'));
        this.tableImg = new GameObjectGetSet(this.elems.getElement("table"));
        Game.UIClickListener.Get(this.btnDraw.gameObject).onClick = delegate(this, this.onStart);
    }

    protected initListeners() {
        this.addClickListener(this.btnClose.gameObject, this.close);
        this.addClickListener(this.btnRule.gameObject, this.onRule);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.effectRoot.gameObject, UnitCtrlType.other, "effect/uitx/zuanshi/zuanshiyu.prefab", this.sortingOrder);
        this.effectRoot.SetActive(false);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LUCKYCAT_OPEN_PANNEL));
        this.activityEndTime = G.SyncTime.getServerZeroLeftTime();
        this.addTimer("countDown", 1000, 0, this.onTimer);
        this.onTimer();
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);

        this.onMoneyChange();
    }

    private onTimer() {
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        let time = Math.floor(this.activityEndTime -= 1);
        let color = Color.GREEN; 
        if (time<=86400) {
            color = Color.RED;
        }
        this.countDown.text = "活动剩余时间:" + TextFieldUtil.getColorText(DataFormatter.second2day(time), color);
        if (time == 0) {
            this.close();
        }
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        this.removeTimer("startDraw");
        this.removeTimer("countDown");
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
    }

    updatePanel() {
         //增加vip限制
         let curLevel = G.DataMgr.heroData.curVipLevel;
         let needLevel = G.DataMgr.luckyCatData.drawInfo[0].m_uiVipLvel;
        if (curLevel >= needLevel) {
            this.vipLimtImg.SetActive(false);
            this.condition.gameObject.SetActive(true);
            this.tableImg.gameObject.SetActive(true);
         }else if (curLevel<needLevel) {
            this.vipLimtImg.SetActive(true);
            this.vipLimtText.text = uts.format('VIP{0}即可投入',needLevel);
            this.condition.gameObject.SetActive(false);
            this.tableImg.gameObject.SetActive(false);
        }
        let luckyCatData = G.DataMgr.luckyCatData;
        for (let i = 0; i < luckyCatData.itemCount; i++) {
            let item: UnityEngine.UI.Text = ElemFinder.findText(this.wheelInfoList.gameObject, uts.format("{0}/times", i));
            let m_ucMultiple = luckyCatData.drawInfo[i].m_ucMultiple / 10;
            item.text = uts.format("{0}倍", m_ucMultiple);
            let itemBg = ElemFinder.findImage(this.wheelInfoList.gameObject, i.toString());
        }
        this.awardInfoList.Count = luckyCatData.drawRecordCount;
        for (let i = 0; i < luckyCatData.drawRecordCount; i++) {
            let item: UnityEngine.UI.Text = this.awardInfoList.GetItem(i).transform.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            item.text = uts.format("{0}获得{1}倍奖励", luckyCatData.drawRecord[i].m_szName, luckyCatData.drawRecord[i].m_ucMultiple / 10);
        }
        this.awardInfoList.ScrollByAxialRow(this.awardInfoList.Count);
        this.drawIndex = luckyCatData.drawIndex % luckyCatData.itemCount;
        if (luckyCatData.drawNeedPay < 0) {
            this.condition.text = uts.format("{0}", TextFieldUtil.getColorText("已抽完", Color.RED));
            this.btnDraw.grey = true;
            return;
        }
        this.condition.text = uts.format("{0}", TextFieldUtil.getColorText(luckyCatData.drawNeedPay.toString(), G.DataMgr.heroData.gold >= luckyCatData.drawNeedPay ? Color.GREEN : Color.RED));
        if (G.DataMgr.heroData.gold >= luckyCatData.drawNeedPay) {
            this.btnDraw.grey = false;
        }
        else {
            this.btnDraw.grey = true;
        }
    }


    private callTimes: number = -1;
    private deltaRotate: number = 45;
    private rotateSize: number = 0;
    private onStart(): void {
        let zhaoCaiMaoData = G.DataMgr.luckyCatData;
        let needLevel = G.DataMgr.luckyCatData.drawInfo[0].m_uiVipLvel;
        let curLevel = G.DataMgr.heroData.curVipLevel;
        if (curLevel>=needLevel) {
            if (this.btnDraw.grey) {
                if (G.DataMgr.heroData.gold < zhaoCaiMaoData.drawNeedPay) {
                    G.TipMgr.addMainFloatTip('钻石不足，请充值后再抽奖！');
                }
                else {
                    return;
                }
            }
            if (G.DataMgr.heroData.gold >= zhaoCaiMaoData.drawNeedPay&&curLevel>=needLevel) {
                this.callTimes = 0;
                this.drawIndex = -1;
                this.rotateSize = 0;
                this.addTimer("startDraw", 50, 0, this.onRotateTimer);
                this.btnDraw.grey = true;
            }
        }else{
            G.TipMgr.addMainFloatTip('VIP等级不足！');
        }
       
    }

    private onRotateTimer(): void {
        this.rotateSize += this.deltaRotate;
        this.rotateSize %= 360;
        this.callTimes++;
        if (this.callTimes > 40) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LUCKYCAT_DRAW));
            this.callTimes = -9999;
        }
        if (this.drawIndex >= 0) {
            if (this.rotateSize == this.deltaRotate * this.drawIndex) {
                this.removeTimer("startDraw");
            }
            Game.Invoker.BeginInvoke(this.wheel.gameObject, "dely", 0.1, delegate(this, this.onPlayEffect));
        }
        this.wheel.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, this.rotateSize + this.deltaRotate / 2);
    }

    private onPlayEffect() {
        this.effectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.effectRoot.gameObject, "stop", 2.5, delegate(this, this.onStopEffect));
    }

    private onStopEffect() {
        this.effectRoot.SetActive(false);
    }

    private onRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(479), '规则介绍');
    }

    onMoneyChange() {
        this.txtDiamond.text = G.DataMgr.heroData.gold.toString();
    }
}