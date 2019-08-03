import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { PetData } from 'System/data/pet/PetData'
import { PetView } from 'System/pet/PetView'
import { Color } from 'System/utils/ColorUtil'
import { Macros } from 'System/protocol/Macros'
import { DisplayPetView } from 'System/guide/DisplayPetView'
import { PetExpeditionPanel } from 'System/pet/PetExpeditionPanel'
import { SkillData } from 'System/data/SkillData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Events } from 'System/Events'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { GuildView } from 'System/guild/view/GuildView'

export class PetModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_OpenBeautyPannel_Response, this._onOpenBeautyPanelResponse);
        this.addNetListener(Macros.MsgID_BeautyActive_Response, this._onBeautyActiveResponse);
        this.addNetListener(Macros.MsgID_BeautyBattle_Response, this._onBeautyBattleResponse);
        this.addNetListener(Macros.MsgID_BeautyStageUp_Response, this._onBeautyStageUpResponse);  // enhance
        this.addNetListener(Macros.MsgID_Beauty_KF_Response, this._onBeautyKFResponse);  // gong fa
        this.addNetListener(Macros.MsgID_Beauty_JuShen_Response, this._onBeautyJushenResponse);  // ju shen
        this.addNetListener(Macros.MsgID_Beauty_ZhenTu_Response, this.onBeautyZhentuResponse);  // 光印回复
        this.addNetListener(Macros.MsgID_WY_TreasureHunt_Response, this.OnBeautyXunBaoResponse);    //寻宝

        // 伙伴远征
        this.addNetListener(Macros.MsgID_WYYZ_Pannel_Response, this.onWyyzPanelResponse);
        this.addNetListener(Macros.MsgID_WYYZ_BuyBuff_Response, this.onWyyzBuyBuffResponse);
        this.addNetListener(Macros.MsgID_WYYZ_FightSet_Response, this.onWyyzFightSetResponse);
        this.addNetListener(Macros.MsgID_WYYZ_GetReward_Response, this.onWyyzGetRewardResponse);
        this.addNetListener(Macros.MsgID_WYYZ_PK_Response, this.onWyyzPKResponse);
        this.addNetListener(Macros.MsgID_WYYZ_Skill_Response, this.onWyyzSkillResponse);
        this.addNetListener(Macros.MsgID_Beauty_Awake_Response, this.onPetAwakenStageUpResponse);
        this.addEvent(Events.roleBagChange, this.onRoleBagChange);
    }

    private _onOpenBeautyPanelResponse(response: Protocol.OpenBeautyPannel_Response): void {
        G.DataMgr.petData.updatePets(response.m_stBeautyList.m_astBeautyInfo);
        G.DataMgr.petData.setFollowPetByID(response.m_iBattleBeautyID);
        this.processPetChange(true);
    }

    private _onBeautyActiveResponse(response: Protocol.BeautyActive_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.petData.updatePet(response.m_stBeautyInfo);
            this.processPetChange(true, true);
        }
    }

    private _onBeautyBattleResponse(response: Protocol.BeautyBattle_Response): void {
        if (response.m_iResult == 0) {
            //做个特殊处理，第一次激活直接就会出战了
            G.DataMgr.petData.setFollowPetByID(response.m_iBeautyID);
            this.processPetChange(true);
        }
    }

    private _onBeautyKFResponse(response: Protocol.BeautyKF_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.petData.updatePet(response.m_stBeautyInfo);
            this.processPetChange(false);
        }
        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.updateByGongFaResp(response);
        }
        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView != null) {
            guildView.onDailyGiftChanged();
        }
        if (G.ViewCacher.tipsView.skillTip.isOpened) {
            G.ViewCacher.tipsView.skillTip.onSkillChange(G.DataMgr.petData.getNqSkill(response.m_stBeautyInfo.m_iBeautyID));
        }
    }

    private _onBeautyJushenResponse(response: Protocol.BeautyJuShen_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.petData.updatePet(response.m_stBeautyInfo);
            this.processPetChange(false);
            let star: number = PetData.getJushenStar(response.m_stBeautyInfo.m_stJuShen.m_uiLevel);
            if (star == 0) {
                G.ModuleMgr.unitModule.onMyPetFeiShengChange(response.m_stBeautyInfo.m_iBeautyID, response.m_stBeautyInfo.m_stFeiSheng.m_ucNum);
            }
        }
        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.updateByJuShenResp(response);
        }
    }

    private _onBeautyStageUpResponse(response: Protocol.BeautyStageUp_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.petData.updatePet(response.m_stBeautyInfo);
            this.processPetChange(true);
        }
        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.updateByStageUpResp(response);
        }
    }

    private processPetChange(updateView: boolean, isActivePet: boolean = false) {
        if (updateView) {
            let petView = G.Uimgr.getForm<PetView>(PetView);
            if (petView != null) {
                petView.updateByPetChange(isActivePet);
            }
        }
        G.GuideMgr.tipMarkCtrl.onPetChange();
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.updateView();
        G.MainBtnCtrl.onFightPetChange();
        //伙伴收集进度面板
        let displayPetView = G.Uimgr.getForm<DisplayPetView>(DisplayPetView);
        if (displayPetView != null && displayPetView) {
            displayPetView.updateDisplayPetView();
        }

    }

    /**
     * 光印回复
     * @param response
     */
    private onBeautyZhentuResponse(response: Protocol.BeautyZhenTu_Response) {
        if (response.m_iResult == 0) {
            let petView = G.Uimgr.getForm<PetView>(PetView);
            if (response.m_iType == Macros.BEAUTY_ZT_LIST) {
                //打开面板，拉取列表
                G.DataMgr.petData.updatePetZhenTuInfo(response.m_stValue);
                this.updateZhenTuPanel(Macros.BEAUTY_ZT_LIST);
            } else if (response.m_iType == Macros.BEAUTY_ZT_ACT) {
                //激活
                G.DataMgr.petData.updatePetZhenTuInfoById(response.m_ucID, response.m_stValue.m_stActInfo.m_ucLevel, response.m_stValue.m_stActInfo.m_ucLucky);
                this.updateZhenTuPanel(Macros.BEAUTY_ZT_ACT, response.m_ucID);
            } else if (response.m_iType == Macros.BEAUTY_ZT_UPLV) {
                //强化升级
                G.DataMgr.petData.updatePetZhenTuInfoById(response.m_ucID, response.m_stValue.m_stUpLvInfo.m_ucLevel, response.m_stValue.m_stUpLvInfo.m_ucLucky);
                this.updateZhenTuPanel(Macros.BEAUTY_ZT_UPLV, response.m_ucID);
            }
            G.NoticeCtrl.checkPetZhenTu();
            G.GuideMgr.tipMarkCtrl.onPetZhenTuChange();
        }

    }


    private updateZhenTuPanel(type: number, zhenTuId: number = 0) {
        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.updateZhenTuPanel(type, zhenTuId);
        }
    }

    private onRoleBagChange() {
        G.DataMgr.petData.clearCheckCache();
    }

    private onWyyzPanelResponse(resp: Protocol.WYYZ_Pannel_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            //uts.log(resp);
            let expeditionData = G.DataMgr.petExpeditionData;
            expeditionData.updateByPanel(resp);
            let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (actHomeView != null) {
                actHomeView.onPetExpeditionChange();
            }

            // 检查死亡伙伴自动下阵
            let n = expeditionData.checkAutoNotFight();
            if (n) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzFightSetRequest(n));
            }
        }
    }

    private onWyyzBuyBuffResponse(resp: Protocol.WYYZ_BuyBuff_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            G.DataMgr.petExpeditionData.updateByBuyBuff(resp);
            let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (actHomeView != null) {
                actHomeView.onPetExpeditionChange();
            }
        }
    }

    private onWyyzFightSetResponse(resp: Protocol.WYYZ_FightSet_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            G.DataMgr.petExpeditionData.updateBySetFight(resp);
            let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (actHomeView != null) {
                actHomeView.onPetExpeditionChange();
            }
        }
    }

    private onWyyzGetRewardResponse(resp: Protocol.WYYZ_GetReward_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            G.DataMgr.petExpeditionData.updateByGetReward(resp);
            let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (actHomeView != null) {
                actHomeView.onPetExpeditionChange();
            }
        }
    }

    private onWyyzPKResponse(resp: Protocol.WYYZ_PK_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            G.Uimgr.closeForm(PetView);
        }
    }

    private onWyyzSkillResponse(resp: Protocol.WYYZ_Skill_Response) {
        if (resp.m_uiResult != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(resp.m_uiResult));
        } else {
            let yzPetCfg = G.DataMgr.petExpeditionData.getWyyzPetConfig(resp.m_iPetID);
            G.DataMgr.cdData.addNewCd(SkillData.getSkillConfig(yzPetCfg.m_iTSSkill));
        }
    }

    private onPetAwakenStageUpResponse(resp: Protocol.BeautyAwake_Response) {
        if (resp.m_iResult == 0) {
            G.DataMgr.petData.updatePetAwakenData(resp.m_stValue.m_stAwakeStrengthenRsp);
        }

        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.updateByJueXingResp(resp);
        }
        
    }
    /*
    *寻宝回复
    */
    private OnBeautyXunBaoResponse(response: Protocol.WYTreasureHunt_Response) {
        if (response.m_iResult == 0) {          
            let petView = G.Uimgr.getForm<PetView>(PetView);           
            let xunBaoData = response.m_stValue;
            if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_LIST) {
                
            } else if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_START) {

            } else if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_END) {

            }
            if (petView != null) {
                petView.onPetXunBaoDataChange(response);
            }
        }
    }

}