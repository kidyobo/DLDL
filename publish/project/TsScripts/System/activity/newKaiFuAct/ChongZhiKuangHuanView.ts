import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { LeiChongFanLiView } from 'System/activity/kfhd/LeiChongFanLiView'
import { LeiJiChongZhiView } from 'System/activity/fanLiDaTing/LeiJiChongZhiView'
import { KfhdTeHuiLiBaoPanel } from 'System/activity/kfhd/KfhdTeHuiLiBaoPanel'
import { JjrMrxgPanel } from 'System/jinjieri/JjrMrxgPanel'
import { WzsdPanel } from 'System/activity/fanLiDaTing/WzsdPanel'
import { JjrRewardsPanel } from 'System/jinjieri/JjrRewardsPanel'
import { KfhdData } from 'System/data/KfhdData'
import { VipDailyRewardPanel } from 'System/vip/VipDailyRewardPanel'
import { VipData } from 'System/data/VipData'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { NewChongZhiZKPanel } from 'System/activity/newKaiFuAct/NewChongZhiZKPanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


//该面板为其他子面板的父面板
export class ChongZhiKuangHuanView extends TabForm {

    private openTabId: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_CHONGZHIKUANGHUAN, NewChongZhiZKPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ChongZhiKuangHuanView;
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);
    }


    open(openTabId = KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU, subValue: number = 0) {
        this.openTabId = openTabId;
        super.open();
    }


    protected onOpen() {
        //打开指定tab页
        this.updateTabLabels();
        this.switchTabFormById(this.openTabId);
    }
    protected onClose() {

    }

    private updateTabLabels() {
        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen = this.tabIds.length;
        for (let i = 0; i < idLen; i++) {
            let funId = this.tabIds[i];
            // 先判断页签功能是否开启
            let isShow = funcLimitData.isFuncEntranceVisible(funId);
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }
        this.switchTabFormById(this.openTabId);
    }

    /**
     * 更新充值折扣
     */
    updateNewChongZhiZkPanel() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU) as NewChongZhiZKPanel
        if (panel && panel.isOpened) {
            panel.updatePanel();
        }
    }

    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateNewChongZhiZkPanel();
        }
    }

}
export default ChongZhiKuangHuanView;