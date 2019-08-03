import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ErrorId } from 'System/protocol/ErrorId'
import { AASView } from 'System/aas/AASView'

/**
 * 防沉迷模块 
 * 
 */
export class AASModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_AASAddict_Notify, this.onAASAddictNotify);
        this.addNetListener(Macros.MsgID_AASIdentity_Notify, this.onAASIdentityNotify);
        this.addNetListener(Macros.MsgID_AASIdentity_Record_Response, this.onAASIdentityRecordResponse);
    }

    private onAASAddictNotify(notify: Protocol.AASAddict_Notify) {
        let gameParas = G.DataMgr.gameParas;
        if (notify.m_uiUin == G.DataMgr.heroData.roleID.m_uiUin && G.DataMgr.gameParas.isAdult != 1) {
            let hour = Math.floor(notify.m_usOnlineHour / 4);
            let info: string;
            if (hour >= 5) {
                info = uts.format('您累计在线时间{0}，进入不健康游戏时间，游戏收益已{1}。请您立即下线休息，做适当健身运动。',
                    TextFieldUtil.getColorText('已满5小时', Color.RED), TextFieldUtil.getColorText('降为零', Color.RED));
            }
            else if (hour >= 3) {
                info = uts.format('您累计在线时间{0}，进入疲劳时间，游戏收益已{1}。请您尽快下线休息，做适当健身运动。',
                    TextFieldUtil.getColorText('已满3小时', Color.RED), TextFieldUtil.getColorText('减半', Color.RED));
            }
            else if (hour >= 1) {
                info = uts.format('您累计在线时间{0}，请注意休息，健康游戏。', TextFieldUtil.getColorText('已满1小时', Color.YELLOW));
            }

            if (info) {
                G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定');
            }
        }
    }

    private onAASIdentityNotify(notify: Protocol.AASIdentity_Notify) {
        if (notify.m_ucNeedIdentify == 0) {
            G.Uimgr.closeForm(AASView);
        }
        else {
            G.Uimgr.createForm<AASView>(AASView).open();
        }
    }

    private onAASIdentityRecordResponse(response: Protocol.AASIdentityRecord_Response): void {
        if (response.m_ushResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
        else {
            G.Uimgr.closeForm(AASView);
            G.TipMgr.addMainFloatTip('验证成功，祝您游戏愉快!');
        }
    }
}
