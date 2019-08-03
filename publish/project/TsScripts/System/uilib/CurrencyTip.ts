import { TanBaoView } from 'System/tanbao/TanBaoView';
import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
import { VipView, VipTab } from 'System/vip/VipView'
import { PayView } from "System/pay/PayView";
import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { KuaiSuShengJiView } from "System/activity/view/KuaiSuShengJiView";
import { KeyWord } from "System/constants/KeyWord";
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { BagView, EnumBagTab } from "System/bag/view/BagView"
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { XXDDMainView } from 'System/diandeng/XXDDMainView'
import { DataFormatter } from 'System/utils/DataFormatter'
/**
 * 右上角货币显示
 */
export class CurrencyTip {
    private btnAddDiamond: UnityEngine.GameObject;
    private txtDiamond: UnityEngine.UI.Text;
    private btnAddBindDiamond: UnityEngine.GameObject;
    private txtBindDiamond: UnityEngine.UI.Text;
    private btnAddMoney: UnityEngine.GameObject;
    private txtMoney: UnityEngine.UI.Text;

    setComponents(containers: UnityEngine.GameObject) {
        this.btnAddDiamond = ElemFinder.findObject(containers, "diamond/btnAdd");
        this.btnAddBindDiamond = ElemFinder.findObject(containers, "bindDiamond/btnAdd");
        this.btnAddMoney = ElemFinder.findObject(containers, "money/btnAdd");
        this.txtDiamond = ElemFinder.findText(containers, "diamond/txtCount");
        this.txtBindDiamond = ElemFinder.findText(containers, "bindDiamond/txtCount");
        this.txtMoney = ElemFinder.findText(containers, "money/txtCount");

        Game.UIClickListener.Get(this.btnAddDiamond).onClick = delegate(this, this.onAddDiamond);
        Game.UIClickListener.Get(this.btnAddBindDiamond).onClick = delegate(this, this.onAddBindDiamond);
        Game.UIClickListener.Get(this.btnAddMoney).onClick = delegate(this, this.onAddMoney);
    }

    updateMoney() {
       // DataFormatter.cutWan(num);
        this.txtDiamond.text = DataFormatter.cutWan(G.DataMgr.heroData.gold);
        this.txtBindDiamond.text = DataFormatter.cutWan(G.DataMgr.heroData.gold_bind);
        this.txtMoney.text = DataFormatter.cutWan(G.DataMgr.heroData.tongqian);
        //this.txtDiamond.text = G.DataMgr.heroData.gold.toString();
        //this.txtBindDiamond.text = G.DataMgr.heroData.gold_bind.toString();
        //this.txtMoney.text = G.DataMgr.heroData.tongqian.toString();
    }
   
    /**钻石 */
    private onAddDiamond() {
        let bagView = G.Uimgr.getForm<BagView>(BagView);
        let fanliView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
        let kssjView = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        let kfhd = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        let fldt = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
        let xxdd = G.Uimgr.getForm<XXDDMainView>(XXDDMainView);
        let tanbaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
        if (bagView != null) {
            bagView.close();
        } else if (fanliView != null) {
            fanliView.close();
        } else if (kssjView != null) {
            kssjView.close();
        } else if (kfhd != null) {
            kfhd.close();
        } else if (fldt != null) {
            fldt.close();
        } else if (xxdd != null) {
            xxdd.close();
        }else if(tanbaoView!=null){
            tanbaoView.close();
        }
        //if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNC_FLDT))
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
        //else 
        //    G.TipMgr.addMainFloatTip("功能暂未开启，敬请期待...");
    }

    /**绑钻 */
    private onAddBindDiamond() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_TIANMINGBANG))
            G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
    }

    /**魂币 */
    private onAddMoney() {
        let payView = G.Uimgr.getForm<VipView>(VipView);
        if (payView != null) {
            payView.close();
        }
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_QIFU))
            G.Uimgr.createForm<KuaiSuShengJiView>(KuaiSuShengJiView).open();
    }

}
