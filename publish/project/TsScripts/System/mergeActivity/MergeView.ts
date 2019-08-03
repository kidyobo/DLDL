import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { MergeThreeDayLoginPanel } from 'System/mergeActivity/MergeThreeDayLoginPanel'
import { MergeThreeDayLeiChongPanel } from 'System/mergeActivity/MergeThreeDayLeiChongPanel'
import { MergeLeiJiXiaoFeiPanel } from 'System/mergeActivity/MergeLeiJiXiaoFeiPanel'
import { MergeZhiZunDuoBaoPanel } from 'System/mergeActivity/MergeZhiZunDuoBaoPanel'
import { MergeTeHuiLiBaoPanel } from 'System/mergeActivity/MergeTeHuiLiBaoPanel'
import { MergeZCMPanel } from 'System/mergeActivity/MergeZCMPanel'
import { MergeBaoXiangPanel } from 'System/mergeActivity/MergeBaoXiangPanel'



//该面板为其他子面板的父面板
export class MergeView extends TabForm {
    /**合服活动存在天数*/
    static readonly MaxActDay = 3;
    static readonly ONEDAYSECOND = 3600 * 24;

    private readonly NeedHideIndex = 5;

    private openTabId: number = 0;
    constructor() {
        super(KeyWord.ACT_FUNCTION_MREGE, MergeThreeDayLoginPanel, MergeZCMPanel, MergeBaoXiangPanel,MergeThreeDayLeiChongPanel, MergeLeiJiXiaoFeiPanel,
            MergeZhiZunDuoBaoPanel, MergeTeHuiLiBaoPanel );
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.MergeView;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
    }


    /**
     * 
     * @param openTab 即各个panel的id
     */
    open(openTabId: number = KeyWord.OTHER_FUNCTION_HFHD_3DAYSIGN) {
        this.openTabId = openTabId;
        super.open();
    }

    protected onOpen() {
        this.tabGroup.GetToggle(this.NeedHideIndex).gameObject.SetActive(G.SyncTime.getDateAfterMergeServer()==1);
        this.switchTabFormById(this.openTabId);
        this.updateTabAngle()
    }


    /**更新小原点显示*/
    public updateTabAngle(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYSIGN, G.DataMgr.hfhdData.isShow3DaySignTipMark());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYLEICHONG, G.DataMgr.hfhdData.isShow3DayLeiChongTipMark()); 
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYXIAOFEI, G.DataMgr.hfhdData.isShow3DayXiaoFeiTipMark());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_ZHAOCAIMAO, G.DataMgr.hfhdData.isShowZhaoCaiMaoTipMark());
    }


    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }


    onServerOverDay() {

        ////累计充值
        //let leiChongView = this.getTabFormByID(1002) as MergeThreeDayLeiChongPanel;
        //if (leiChongView.isOpened) {
        //    leiChongView.onServerOverDay();
        //}
    }


    /**
     *更新合服3天登陆
     */
    updateMergerThreeDayLoginPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_3DAYSIGN) as MergeThreeDayLoginPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYSIGN, G.DataMgr.hfhdData.isShow3DaySignTipMark());
    }

    /**
   *更新合服累计充值
   */
    updateMergerThreeDayLeiChongPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_3DAYLEICHONG) as MergeThreeDayLeiChongPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYLEICHONG, G.DataMgr.hfhdData.isShow3DayLeiChongTipMark());
    }

    /**
     *累计消费
     */
    updateMergerLJXFPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_3DAYXIAOFEI) as MergeLeiJiXiaoFeiPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_3DAYXIAOFEI, G.DataMgr.hfhdData.isShow3DayXiaoFeiTipMark());
    }


    updateListData(response: Protocol.CrossZZZD_Flash) {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_ZHIZUNDUOBAO) as MergeZhiZunDuoBaoPanel;
        if (view.isOpened) {
            view.updateListData(response);
        }
    }

    updatePanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_ZHIZUNDUOBAO) as MergeZhiZunDuoBaoPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
    }

    /**
     * 合服限购
     */
    onSellLimitDataChange() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_TEHUI) as MergeTeHuiLiBaoPanel;
        if (view.isOpened) {
            view.onSellLimitDataChange();
        }
    }

    /**
     *招财猫
     */
    updateMergerZCMPanel(getMoney: number) {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_ZHAOCAIMAO) as MergeZCMPanel;
        if (view.isOpened) {
            view.updatePanel(getMoney);
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HFHD_ZHAOCAIMAO, G.DataMgr.hfhdData.isShowZhaoCaiMaoTipMark());
    }

    /**
     * 宝箱有礼
     */
    updateMergerBaoXiangPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HFHD_BAOXIANGYOULI) as MergeBaoXiangPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
    }


}
