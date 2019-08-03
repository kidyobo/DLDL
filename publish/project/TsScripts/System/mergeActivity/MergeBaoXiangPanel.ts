import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { HfhdData } from 'System/mergeActivity/HfhdData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MergeShopView } from 'System/mergeActivity/MergeShopView'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { MergeView } from 'System/mergeActivity/MergeView'

//合服宝箱有礼
export class MergeBaoXiangPanel extends TabSubForm {
    private readonly ModelId = 11003;
    private readonly BaoXiangBuyCount1 = 1;
    private readonly BaoXiangBuyCount5 = 5;
    private readonly EveryDayFreeCanBuyCount = 2;


    private list: List;
    private btnBuy1: UnityEngine.GameObject;
    private btnBuy5: UnityEngine.GameObject;
    private btnShop: UnityEngine.GameObject; 
    private txtNum: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    private txtBuy1: UnityEngine.UI.Text;
    private txtBuy5: UnityEngine.UI.Text;
    private iconItems: IconItem[] = [];
    private modelRoot: UnityEngine.GameObject;
    private txtFreeCount: UnityEngine.UI.Text;
    private moneybg: UnityEngine.GameObject;



    private zeroTime: number = 0; 
    private mergeDay: number = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_BAOXIANGYOULI);
    }

    protected resPath(): string {
        return UIPathData.MergeBaoXiangPanel;
    }

    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.btnBuy1 = this.elems.getElement("btnBuy1");
        this.btnBuy5 = this.elems.getElement("btnBuy5");
        this.btnShop = this.elems.getElement("btnShop"); 
        this.txtNum = this.elems.getText("txtNum");
        this.txtTime = this.elems.getText("txtTime");
        this.txtBuy1 = this.elems.getText("txtBuy1");
        this.txtBuy5 = this.elems.getText("txtBuy5");
        this.modelRoot = this.elems.getElement("modelRoot");
        this.moneybg = this.elems.getElement("moneybg");
        this.txtFreeCount = this.elems.getText("txtFreeCount");
    }

    protected initListeners() {
        this.addClickListener(this.btnBuy1, this.onClickBtn1);
        this.addClickListener(this.btnBuy5, this.onClickBtn5);
        this.addClickListener(this.btnShop, this.onClickBtnShop);
    }

    protected onOpen() {
        this.mergeDay = G.SyncTime.getDateAfterMergeServer();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_BXYL_OPEN_PANNEL));
        this.addTimer("1", 1000, 0, this.onTimerZero);
        this.updateZeroTime();
        this.updateModel();
    }

    protected onClose() {

    }

    private onClickBtn1() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_BXYL_BUY_CHEST, this.BaoXiangBuyCount1));
    }

    private onClickBtn5() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_BXYL_BUY_CHEST, this.BaoXiangBuyCount5));
    }

    private onClickBtnShop() {
        G.Uimgr.createForm<MergeShopView>(MergeShopView).open();
    }

    updatePanel(): void {
        let hfData = G.DataMgr.hfhdData;
        let configs = hfData.getHFBaoXiangAllConfigs();
        this.txtNum.text = "当前积分：" + TextFieldUtil.getColorText( hfData.hfBaoxiangInfo.m_iCurScore.toString(),'fff000');
        this.list.Count = configs.length;
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.list.GetItem(i);
            if (this.iconItems[i] == null) {
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsuallyIcon(item.gameObject);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(configs[i].m_iItemID, configs[i].m_iItemCount);
            this.iconItems[i].updateIcon();
        }

        let freeCount = this.EveryDayFreeCanBuyCount - hfData.hfBaoxiangInfo.m_iBuyCount;
        if (freeCount > 0) {
            this.txtBuy1.text = "";
            this.txtFreeCount.text = "免费" + freeCount + "次";
            this.moneybg.SetActive(false);
        } else {
            let needMoney = G.DataMgr.constData.getValueById(KeyWord.PARAM_HFHD_BXYL_1_PRICE);
            this.txtBuy1.text = needMoney + "";
            this.txtFreeCount.text = "";
            this.moneybg.SetActive(true);
        }
        this.txtBuy5.text =G.DataMgr.constData.getValueById(KeyWord.PARAM_HFHD_BXYL_5_PRICE)+"";
    }


    private updateModel() {
        //加载宝物模型
        G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.other, uts.format('model/misc/{0}.prefab', "flIma2"), this.sortingOrder);
    }


    private updateZeroTime(): void {
        this.zeroTime = G.SyncTime.getServerZeroLeftTime() + (MergeView.MaxActDay - this.mergeDay) * MergeView.ONEDAYSECOND;
        //this.zeroTime = G.SyncTime.getServerZeroLeftTime();
        this.onTimerZero();
    }

    private onTimerZero(): void {
        this.zeroTime--;
        if (this.zeroTime > 0) {
            this.txtTime .text = "活动结束倒计时：" + TextFieldUtil.getColorText(DataFormatter.second2day(this.zeroTime), Color.GREEN);
        }
        else {
            this.txtTime.text = "";
        }
    }

}