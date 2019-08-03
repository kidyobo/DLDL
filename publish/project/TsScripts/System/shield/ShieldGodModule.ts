import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { Macros } from 'System/protocol/Macros'
import { ErrorId } from 'System/protocol/ErrorId'
import { ShieldGodView } from 'System/shield/ShieldGodView'
import { ShieldGodData } from 'System/data/ShieldGodData'

export class ShieldGodModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_ShieldGodOperate_Response, this.onShieldGodOperateResponse); //任务列表请求回复
    }

    private onShieldGodOperateResponse(resp: Protocol.ShieldGodOperate_Response) {
        if (ErrorId.EQEC_Success != resp.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_iResult));
        }
        let data = G.DataMgr.shieldGodData;
        if (Macros.SHIELDGOD_OP_LIST == resp.m_iType) {
            // 拉取信息
            data.updateShieldData(resp.m_stValue.m_stListRsp);
        } else if (Macros.SHIELDGOD_OP_CHANGE == resp.m_iType) {
            // 出战
            data.updateFightShield(resp.m_stValue.m_iShowID);
            G.UnitMgr.hero.checkShield();
        } else if (Macros.SHIELDGOD_OP_UPLEVEL == resp.m_iType) {
            // 进阶
            data.updateOneShield(resp.m_stValue.m_stUpLvRsp);
        } else if (Macros.SHIELDGOD_OP_ACT == resp.m_iType) {
            // 激活
            data.updateOneShield(resp.m_stValue.m_stActRsp);
        }

        let view = G.Uimgr.getForm<ShieldGodView>(ShieldGodView);
        if (view) {
            view.onShieldGodResp(resp);
        }

        G.ViewCacher.mainView.onShieldChaned();
        G.MainBtnCtrl.update(false);
    }
}