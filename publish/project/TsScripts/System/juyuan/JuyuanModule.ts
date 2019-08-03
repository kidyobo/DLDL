import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { JuYuanView } from 'System/juyuan/JuYuanView'
import { JuyuanData } from 'System/data/JuyuanData'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'
import { ErrorId } from 'System/protocol/ErrorId'
import { JiuXingView } from 'System/jiuxing/JiuXingView'
import { Events } from 'System/Events'
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'
import { HeroView } from 'System/hero/view/HeroView'

export class JuyuanModule extends EventDispatcher {

     /**
     * 初始化
     * @param manager
     * @return
     *
     */
    constructor() {
        super();
        //事件监听
        this.addNetListener(Macros.MsgID_JiuXing_Response, this.onJiuXingResponse);
        this.addNetListener(Macros.MsgID_JuYuan_Response, this.getJuyuanInfo);
        this.addNetListener(Macros.MsgID_JuYuanUpgrade_Response, this.upgrade);
        this.addNetListener(Macros.MsgID_JuYuanNotify, this.pinstanceCompleteNotify);
        
    }

    /**
    * 副本完成服务器主动推送
    * @param msg
    *
    */
    private pinstanceCompleteNotify(response: Protocol.JuYuanNotify): void {        
        G.DataMgr.juyuanData.update(response.m_stData);
        this.updateJuYuanPanel();
    }

    /**
     * 神力面板详情拉取响应
     * @param msg
     *
     */
    private getJuyuanInfo(response: Protocol.JuYuan_Response): void {
        if (CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, response.m_stRoleID)) {
            G.DataMgr.juyuanData.update(response.m_stData);
            this.dispatchEvent(Events.updateJuYanInfo);
            this.updateJuYuanPanel();
        }
    }

    /**
     * 神力升级响应
     * @param msg
     *
     */
    private upgrade(response: Protocol.JuYuanUpgrade_Response): void {
        if (response.m_iResultID == ErrorId.EQEC_Success) {
            G.DataMgr.juyuanData.update(response.m_stData);
            this.dispatchEvent(Events.updateJuYanInfo);
            this.updateJuYuanPanel();
            this.upgradeSucceed();
        }
        else {
            //升级失败
            uts.log("升级失败");
        }
    }
    /**
     * 神力突破成功
     */
    private upgradeSucceed() {
        let juYuanView = G.Uimgr.getForm<JuYuanView>(JuYuanView);
        if (juYuanView != null) {
            juYuanView.upgradeSucceed();
        }
    }

    private updateJuYuanPanel() {
        let juYuanView = G.Uimgr.getForm<JuYuanView>(JuYuanView);
        if (juYuanView != null) {
            juYuanView.updatePanel();
        }
        G.GuideMgr.tipMarkCtrl.onJuYuanChange();
    }

    /**
    * 圣光的请求返回
    * @param	msg
    */
    private onJiuXingResponse(response: Protocol.JiuXing_Response): void {
        if (response.m_usType == Macros.JIUXING_OPEN_PANEL) {
            G.DataMgr.jiuXingData.setDataPanel(response.m_stValue.m_stOpenPanelResponse);
        } else if (response.m_usType == Macros.JIUXING_LUCKY_FILL) {
            G.DataMgr.jiuXingData.setLuckyData(response.m_stValue.m_stFillRsp);
            let view = G.Uimgr.getForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView);
            if (view != null) {
                view.updateView(response.m_stValue.m_stFillRsp.m_uiSaveLucky, response.m_stValue.m_stFillRsp.m_uiLucky);
            }
        } else if (response.m_usType == Macros.JIUXING_LUCKY_KEEP) {
            G.DataMgr.jiuXingData.setLuckyData(response.m_stValue.m_stKeepRsp);
        }
        else if (response.m_usType == Macros.JIUXING_UPGRADE_LEVEL) {
            G.DataMgr.jiuXingData.setDataUpgrade(response.m_stValue.m_stUpgradeLevelResponse);
        }
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.onJiuXingChanged();
        }
        G.GuideMgr.tipMarkCtrl.onDaoGongChange();
    }


}

