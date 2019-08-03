﻿import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MagicCubeData } from 'System/data/MagicCubeData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ErrorId } from 'System/protocol/ErrorId'
import { HeroView } from 'System/hero/view/HeroView'
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'

/**
 * <在此键入模块的中文名称>模块。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumModuleName）才能正常使用。
 * Code generated by Bat&Perl.
 *
 * @author Administrator
 *
 */
export class MagicCubeModule extends EventDispatcher {

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_OpenMagicCubePannel_Response, this.onOpenMagicCubePannelResponse);
        this.addNetListener(Macros.MsgID_MagicCubeLevelUp_Response, this.onMagicCubeLevelUpResponse);
        this.addNetListener(Macros.MsgID_MagicCubePannel_Response, this.onMagicCubePannelResponse);
    }

    private onMagicCubeInfoChaned(isComplete: boolean) {
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.onUpdateMagicCubeInfo();
        }
        G.GuideMgr.tipMarkCtrl.onMagicCudeChange();
    }

    /**保留找回祝福  星环*/
    private onMagicCubePannelResponse(msg: Protocol.MagicCubePannel_Response): void {
        let response: Protocol.MagicCubePannel_Response = msg;

        G.DataMgr.magicCubeData.magicCubeInfo.m_uiLucky = response.m_stValue.m_stFillRsp.m_uiLucky;
        G.DataMgr.magicCubeData.magicCubeInfo.m_uiSaveLucky = response.m_stValue.m_stFillRsp.m_uiSaveLucky;
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
        else {
            let heroView = G.Uimgr.getForm<HeroView>(HeroView);
            if (heroView != null) {
                //保留时，需要再次打开界面才能的到数据
                heroView.needSendOpenPanelMsg();
            }
            let zhuFuZhaoHuiView = G.Uimgr.getForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView);
            if (zhuFuZhaoHuiView != null && zhuFuZhaoHuiView.isOpened) {
                zhuFuZhaoHuiView.updateView(G.DataMgr.magicCubeData.magicCubeInfo.m_uiSaveLucky,G.DataMgr.magicCubeData.magicCubeInfo.m_uiLucky);
            }
        }
    }

    /**星环面板响应*/
    private onOpenMagicCubePannelResponse(msg: Protocol.OpenMagicCubePannel_Response): void {
        let response: Protocol.OpenMagicCubePannel_Response = msg;
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
        else {
            this.magicCubeData.updateMagicCubeInfo(response.m_stMagicCubeInfo);
            this.onMagicCubeInfoChaned(false);

            let heroView = G.Uimgr.getForm<HeroView>(HeroView);
            if (heroView != null) {
                heroView.onUpdateMagicCubeInfo();
            }

        }
    }

    /**星环升级响应*/
    private onMagicCubeLevelUpResponse(msg: Protocol.MagicCubeLevelUp_Response): void {
        this.magicCubeData.isReqestingLevelUp = false;
        let response: Protocol.MagicCubeLevelUp_Response = msg;
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
        else {
            this.magicCubeData.updateMagicCubeInfo(response.m_stMagicCubeInfo);
            this.onMagicCubeInfoChaned(true);

            let heroView = G.Uimgr.getForm<HeroView>(HeroView);
            if (heroView != null) {
                heroView.onLevelUpMagicCubeCompelete();
            }
        }
    }

    ///////////////////////////////////////// 对话框管理 /////////////////////////////////////////

    get magicCubeData(): MagicCubeData {
        return G.DataMgr.magicCubeData;
    }
}
