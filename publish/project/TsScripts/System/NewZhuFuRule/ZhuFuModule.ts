import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'
import { ErrorId } from 'System/protocol/ErrorId'
import { Events } from 'System/Events'
import { FaQiView } from "System/faqi/FaQiiView"
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'
import { JinjieView } from 'System/jinjie/view/JinjieView'

export class ZhuFuModule extends EventDispatcher {

    /**
    * 初始化
    * @param manager
    * @return
    *
    */
    constructor() {
        super();
        //事件监听
        this.addNetListener(Macros.MsgID_HeroSub_One_Notify, this._onHeroSubOneNotify);
    }


    private _onHeroSubOneNotify(notify: Protocol.HeroSub_One_Notify) {
        G.DataMgr.zhufuData.updateData(notify.m_stData);
        G.ModuleMgr.heroModule.onZhufuDataChange(notify.m_stData.m_ucType, notify.m_iReqMsgID);

        let view = G.Uimgr.getForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView);
        if (view != null) {
            view.updateView(notify.m_stData.m_stSuperInfo.m_uiSaveLucky, notify.m_stData.m_stSuperInfo.m_uiLucky);
        }

        let jinjieView = G.Uimgr.getForm<JinjieView>(JinjieView);
        if (jinjieView != null && jinjieView.isOpened) {
            jinjieView.updateWingHuanHua();
            jinjieView.updateRideHuanHua();
        }
    }


}