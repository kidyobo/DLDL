import {Macros} from 'System/protocol/Macros';
import {newLoginServer_Request} from 'System/protocol/new/NLoginServer_Request';
import {newLogoutServer_Request} from 'System/protocol/new/NLogoutServer_Request';
import {newUpdateSystemSetting_Request} from 'System/protocol/new/NUpdateSystemSetting_Request';
import {newAutoBattleSetting_Request} from 'System/protocol/new/NAutoBattleSetting_Request';
import {newListProgress_Request} from 'System/protocol/new/NListProgress_Request';
import {newOperateQuest_Request} from 'System/protocol/new/NOperateQuest_Request';
import {newQuestPanel_Request} from 'System/protocol/new/NQuestPanel_Request';
import {newAchiGet_Request} from 'System/protocol/new/NAchiGet_Request';
import {newJuYuan_Request} from 'System/protocol/new/NJuYuan_Request';
import {newJuYuanUpgrade_Request} from 'System/protocol/new/NJuYuanUpgrade_Request';
import {newJiuXing_Request} from 'System/protocol/new/NJiuXing_Request';
import {newNPCBehaviour_Request} from 'System/protocol/new/NNPCBehaviour_Request';
import {newMovePosition_Request} from 'System/protocol/new/NMovePosition_Request';
import {newFaQiOperate_Request} from 'System/protocol/new/NFaQiOperate_Request';
import {newShenShouOperate_Request} from 'System/protocol/new/NShenShouOperate_Request';
import {newShieldGodOperate_Request} from 'System/protocol/new/NShieldGodOperate_Request';
import {newTransport_Request} from 'System/protocol/new/NTransport_Request';
import {newItemTransport_Request} from 'System/protocol/new/NItemTransport_Request';
import {newNPCTransport_Request} from 'System/protocol/new/NNPCTransport_Request';
import {newCastSkill_Request} from 'System/protocol/new/NCastSkill_Request';
import {newListMenu_Request} from 'System/protocol/new/NListMenu_Request';
import {newClickMenu_Request} from 'System/protocol/new/NClickMenu_Request';
import {newPinstanceQuit_Request} from 'System/protocol/new/NPinstanceQuit_Request';
import {newPinstanceRank_Request} from 'System/protocol/new/NPinstanceRank_Request';
import {newMarriage_Request} from 'System/protocol/new/NMarriage_Request';
import {newCrazyBlood_Request} from 'System/protocol/new/NCrazyBlood_Request';
import {newListActivityLimit_Request} from 'System/protocol/new/NListActivityLimit_Request';
import {newHeroSub_List_Request} from 'System/protocol/new/NHeroSub_List_Request';
import {newHeroSub_Wish_Request} from 'System/protocol/new/NHeroSub_Wish_Request';
import {newHeroSub_Show_Request} from 'System/protocol/new/NHeroSub_Show_Request';
import {newHeroSub_Drug_Request} from 'System/protocol/new/NHeroSub_Drug_Request';
import {newHeroSub_Lucky_Request} from 'System/protocol/new/NHeroSub_Lucky_Request';
import {newHeroSub_ImageLevel_Request} from 'System/protocol/new/NHeroSub_ImageLevel_Request';
import {newHeroSub_Spec_Request} from 'System/protocol/new/NHeroSub_Spec_Request';
import {newSkyLottery_Request} from 'System/protocol/new/NSkyLottery_Request';
import {newStarLottery_Request} from 'System/protocol/new/NStarLottery_Request';
import {newOperateTeam_Request} from 'System/protocol/new/NOperateTeam_Request';
import {newListNearTeamInfo_Request} from 'System/protocol/new/NListNearTeamInfo_Request';
import {newClientPanelSet_Request} from 'System/protocol/new/NClientPanelSet_Request';
import {newOperateContainer_Request} from 'System/protocol/new/NOperateContainer_Request';
import {newSwapContainer_Request} from 'System/protocol/new/NSwapContainer_Request';
import {newContainerBuySpace_Request} from 'System/protocol/new/NContainerBuySpace_Request';
import {newBagPassword_Request} from 'System/protocol/new/NBagPassword_Request';
import {newFaBaoPannel_Request} from 'System/protocol/new/NFaBaoPannel_Request';
import {newFaBaoLevelUp_Request} from 'System/protocol/new/NFaBaoLevelUp_Request';
import {newFaBaoActive_Request} from 'System/protocol/new/NFaBaoActive_Request';
import {newFaBaoShow_Request} from 'System/protocol/new/NFaBaoShow_Request';
import {newFaBaoXiangQian_Request} from 'System/protocol/new/NFaBaoXiangQian_Request';
import {newZYZHPannel_Request} from 'System/protocol/new/NZYZHPannel_Request';
import {newZYZHReward_Request} from 'System/protocol/new/NZYZHReward_Request';
import {newCreateRole_Account_Request} from 'System/protocol/new/NCreateRole_Account_Request';
import {newDeleteRole_Account_Request} from 'System/protocol/new/NDeleteRole_Account_Request';
import {newListRole_Account_Request} from 'System/protocol/new/NListRole_Account_Request';
import {newModifyRole_Account_Request} from 'System/protocol/new/NModifyRole_Account_Request';
import {newPVPRank_CS_Request} from 'System/protocol/new/NPVPRank_CS_Request';
import {newCross_CS_Request} from 'System/protocol/new/NCross_CS_Request';
import {newGuild_CS_Request} from 'System/protocol/new/NGuild_CS_Request';
import {newGuild_CROSSPVP_CS_Request} from 'System/protocol/new/NGuild_CROSSPVP_CS_Request';
import {newGuild_PVP_CS_Request} from 'System/protocol/new/NGuild_PVP_CS_Request';
import {newGameMaster_Request} from 'System/protocol/new/NGameMaster_Request';
import {newGetDroppedThing_Request} from 'System/protocol/new/NGetDroppedThing_Request';
import {newOperateSkill_Request} from 'System/protocol/new/NOperateSkill_Request';
import {newOperateShortcut_Request} from 'System/protocol/new/NOperateShortcut_Request';
import {newChat_Request} from 'System/protocol/new/NChat_Request';
import {newEnterRegion_Request} from 'System/protocol/new/NEnterRegion_Request';
import {newBuff_Request} from 'System/protocol/new/NBuff_Request';
import {newRevival_Request} from 'System/protocol/new/NRevival_Request';
import {newBuyBigHpMp_Request} from 'System/protocol/new/NBuyBigHpMp_Request';
import {newSyncTime_Request} from 'System/protocol/new/NSyncTime_Request';
import {newSyncTime_Client_Request} from 'System/protocol/new/NSyncTime_Client_Request';
import {newPPStoreSell_Request} from 'System/protocol/new/NPPStoreSell_Request';
import {newPPStoreBuy_Request} from 'System/protocol/new/NPPStoreBuy_Request';
import {newPPStoreSort_Request} from 'System/protocol/new/NPPStoreSort_Request';
import {newPPStoreQuery_Request} from 'System/protocol/new/NPPStoreQuery_Request';
import {newPPStoreDispMy_Request} from 'System/protocol/new/NPPStoreDispMy_Request';
import {newPPStoreCancelMy_Request} from 'System/protocol/new/NPPStoreCancelMy_Request';
import {newPPStoreCall_Request} from 'System/protocol/new/NPPStoreCall_Request';
import {newPPStoreGetAllThingNum_Request} from 'System/protocol/new/NPPStoreGetAllThingNum_Request';
import {newTitle_ActiveChange_Request} from 'System/protocol/new/NTitle_ActiveChange_Request';
import {newMail_FetchList_Request} from 'System/protocol/new/NMail_FetchList_Request';
import {newMail_FetchMail_Request} from 'System/protocol/new/NMail_FetchMail_Request';
import {newMail_PickAccessory_Request} from 'System/protocol/new/NMail_PickAccessory_Request';
import {newFriend_FetchGameFriend_Request} from 'System/protocol/new/NFriend_FetchGameFriend_Request';
import {newFriend_Apply_Request} from 'System/protocol/new/NFriend_Apply_Request';
import {newFriend_Add_Request} from 'System/protocol/new/NFriend_Add_Request';
import {newFriend_Delete_Request} from 'System/protocol/new/NFriend_Delete_Request';
import {newFriend_RoleInfo_Request} from 'System/protocol/new/NFriend_RoleInfo_Request';
import {newFriend_Search_Request} from 'System/protocol/new/NFriend_Search_Request';
import {newFriend_Contact_Request} from 'System/protocol/new/NFriend_Contact_Request';
import {newFriend_PetInfo_Request} from 'System/protocol/new/NFriend_PetInfo_Request';
import {newHYDOperate_Request} from 'System/protocol/new/NHYDOperate_Request';
import {newEquipProp_Request} from 'System/protocol/new/NEquipProp_Request';
import {newDress_Request} from 'System/protocol/new/NDress_Request';
import {newDiBang_Request} from 'System/protocol/new/NDiBang_Request';
import {newPinstanceEnter_Request} from 'System/protocol/new/NPinstanceEnter_Request';
import {newAASSetStatus_Request} from 'System/protocol/new/NAASSetStatus_Request';
import {newAASIdentityRecord_Request} from 'System/protocol/new/NAASIdentityRecord_Request';
import {newNPCStoreLimitList_Request} from 'System/protocol/new/NNPCStoreLimitList_Request';
import {newRefreshRankInfo_Request} from 'System/protocol/new/NRefreshRankInfo_Request';
import {newGuildPVPRank_Request} from 'System/protocol/new/NGuildPVPRank_Request';
import {newWYBQ_Get_Request} from 'System/protocol/new/NWYBQ_Get_Request';
import {newBaoDian_Request} from 'System/protocol/new/NBaoDian_Request';
import {newListActivity_Request} from 'System/protocol/new/NListActivity_Request';
import {newDoActivity_Request} from 'System/protocol/new/NDoActivity_Request';
import {newVIPOperate_Request} from 'System/protocol/new/NVIPOperate_Request';
import {newMountRideChange_Request} from 'System/protocol/new/NMountRideChange_Request';
import {newInterruptSkill_Request} from 'System/protocol/new/NInterruptSkill_Request';
import {newRefreshRewardQuest_Request} from 'System/protocol/new/NRefreshRewardQuest_Request';
import {newCompleteRewardQuest_Request} from 'System/protocol/new/NCompleteRewardQuest_Request';
import {newRecruitAlchemist_Request} from 'System/protocol/new/NRecruitAlchemist_Request';
import {newOpCrystal_Request} from 'System/protocol/new/NOpCrystal_Request';
import {newListCrystal_Request} from 'System/protocol/new/NListCrystal_Request';
import {newSwapCrystal_Request} from 'System/protocol/new/NSwapCrystal_Request';
import {newHideSightRole_Request} from 'System/protocol/new/NHideSightRole_Request';
import {newChangeCDKey_Request} from 'System/protocol/new/NChangeCDKey_Request';
import {newChangeMountImage_Request} from 'System/protocol/new/NChangeMountImage_Request';
import {newGetThingProperty_Request} from 'System/protocol/new/NGetThingProperty_Request';
import {newSevenDayFund_Request} from 'System/protocol/new/NSevenDayFund_Request';
import {newSCGetInfoRequest} from 'System/protocol/new/NSCGetInfoRequest';
import {newSCGetRewardRequest} from 'System/protocol/new/NSCGetRewardRequest';
import {newZazenRequest} from 'System/protocol/new/NZazenRequest';
import {newSpecialTransport_Request} from 'System/protocol/new/NSpecialTransport_Request';
import {newGetNpcPostionList_Request} from 'System/protocol/new/NGetNpcPostionList_Request';
import {newGetPlayerPosRequest} from 'System/protocol/new/NGetPlayerPosRequest';
import {newCSGetSceneMonsterRequest} from 'System/protocol/new/NCSGetSceneMonsterRequest';
import {newCSGetIconMonsterRequest} from 'System/protocol/new/NCSGetIconMonsterRequest';
import {newPinstanceHomeRequest} from 'System/protocol/new/NPinstanceHomeRequest';
import {newCSListGMQA_Request} from 'System/protocol/new/NCSListGMQA_Request';
import {newCSAddGMQA_Request} from 'System/protocol/new/NCSAddGMQA_Request';
import {newOpenBeautyPannel_Request} from 'System/protocol/new/NOpenBeautyPannel_Request';
import {newBeautyStageUp_Request} from 'System/protocol/new/NBeautyStageUp_Request';
import {newBeautyBattle_Request} from 'System/protocol/new/NBeautyBattle_Request';
import {newBeautyActive_Request} from 'System/protocol/new/NBeautyActive_Request';
import {newBeautyDrug_Request} from 'System/protocol/new/NBeautyDrug_Request';
import {newBeautyKF_Request} from 'System/protocol/new/NBeautyKF_Request';
import {newBeautyJuShen_Request} from 'System/protocol/new/NBeautyJuShen_Request';
import {newBeautyZhenTu_Request} from 'System/protocol/new/NBeautyZhenTu_Request';
import {newBeautyAwake_Request} from 'System/protocol/new/NBeautyAwake_Request';
import {newSaiJiPannel_Request} from 'System/protocol/new/NSaiJiPannel_Request';
import {newSaiJiActive_Request} from 'System/protocol/new/NSaiJiActive_Request';
import {newOpenMagicCubePannel_Request} from 'System/protocol/new/NOpenMagicCubePannel_Request';
import {newMagicCubeLevelUp_Request} from 'System/protocol/new/NMagicCubeLevelUp_Request';
import {newMagicCubePannel_Request} from 'System/protocol/new/NMagicCubePannel_Request';
import {newFaZe_Request} from 'System/protocol/new/NFaZe_Request';
import {newRoleReturn_Request} from 'System/protocol/new/NRoleReturn_Request';
import {newFunctionAct_Request} from 'System/protocol/new/NFunctionAct_Request';
import {newVIPOneKeyOpen_Request} from 'System/protocol/new/NVIPOneKeyOpen_Request';
import {newVIPOneKeyGet_Request} from 'System/protocol/new/NVIPOneKeyGet_Request';
import {newItemMerge_Request} from 'System/protocol/new/NItemMerge_Request';
import {newZFEquipUpColor_Request} from 'System/protocol/new/NZFEquipUpColor_Request';
import {newHunGuMerge_Request} from 'System/protocol/new/NHunGuMerge_Request';
import {newDigBoss_Request} from 'System/protocol/new/NDigBoss_Request';
import {newFirstOpen_Request} from 'System/protocol/new/NFirstOpen_Request';
import {newDayOperate_Request} from 'System/protocol/new/NDayOperate_Request';
import {newGroupBuy_Request} from 'System/protocol/new/NGroupBuy_Request';
import {newOpenSuperVIP_Request} from 'System/protocol/new/NOpenSuperVIP_Request';
import {newCSPKStatus_Request} from 'System/protocol/new/NCSPKStatus_Request';
import {newGetLevelBag_Request} from 'System/protocol/new/NGetLevelBag_Request';
import {newMonthCard_Request} from 'System/protocol/new/NMonthCard_Request';
import {newKFSCTGGetInfo_Request} from 'System/protocol/new/NKFSCTGGetInfo_Request';
import {newKFSCTGGetReward_Request} from 'System/protocol/new/NKFSCTGGetReward_Request';
import {newKFSCTGSendMsg_Request} from 'System/protocol/new/NKFSCTGSendMsg_Request';
import {newKFQMCBGetInfo_Request} from 'System/protocol/new/NKFQMCBGetInfo_Request';
import {newKFQMCBGetReward_Request} from 'System/protocol/new/NKFQMCBGetReward_Request';
import {newKFQMCBGetRoleInfo_Request} from 'System/protocol/new/NKFQMCBGetRoleInfo_Request';
import {newKFMRMBGetInfo_Request} from 'System/protocol/new/NKFMRMBGetInfo_Request';
import {newKFMRMBGetReward_Request} from 'System/protocol/new/NKFMRMBGetReward_Request';
import {newKFActInfo_Request} from 'System/protocol/new/NKFActInfo_Request';
import {newHFActInfo_Request} from 'System/protocol/new/NHFActInfo_Request';
import {newFaZhen_Request} from 'System/protocol/new/NFaZhen_Request';
import {newQiFu_Request} from 'System/protocol/new/NQiFu_Request';
import {newQianKunLu_Request} from 'System/protocol/new/NQianKunLu_Request';
import {newRoleWing_Request} from 'System/protocol/new/NRoleWing_Request';
import {newXZFM_Request} from 'System/protocol/new/NXZFM_Request';
import {newZZHC_Pannel_Request} from 'System/protocol/new/NZZHC_Pannel_Request';
import {newZZHC_Reward_Request} from 'System/protocol/new/NZZHC_Reward_Request';
import {newZZHC_Recommond_Request} from 'System/protocol/new/NZZHC_Recommond_Request';
import {newMHZZ_Pannel_Request} from 'System/protocol/new/NMHZZ_Pannel_Request';
import {newWYYZ_Pannel_Request} from 'System/protocol/new/NWYYZ_Pannel_Request';
import {newWYYZ_PK_Request} from 'System/protocol/new/NWYYZ_PK_Request';
import {newWYYZ_BuyBuff_Request} from 'System/protocol/new/NWYYZ_BuyBuff_Request';
import {newWYYZ_GetReward_Request} from 'System/protocol/new/NWYYZ_GetReward_Request';
import {newWYYZ_Skill_Request} from 'System/protocol/new/NWYYZ_Skill_Request';
import {newWYYZ_FightSet_Request} from 'System/protocol/new/NWYYZ_FightSet_Request';
import {newSet_Charge_Rebate_Request} from 'System/protocol/new/NSet_Charge_Rebate_Request';
import {newCharge_Rebate_Panel_Request} from 'System/protocol/new/NCharge_Rebate_Panel_Request';
import {newCharge_Rebate_Request} from 'System/protocol/new/NCharge_Rebate_Request';
import {newWorldPaiMai_Pannel_Request} from 'System/protocol/new/NWorldPaiMai_Pannel_Request';
import {newWorldPaiMai_Buy_Request} from 'System/protocol/new/NWorldPaiMai_Buy_Request';
import {newWYTreasureHunt_Request} from 'System/protocol/new/NWYTreasureHunt_Request';
import {newHunLi_Request} from 'System/protocol/new/NHunLi_Request';
import {newSurvey_Request} from 'System/protocol/new/NSurvey_Request';
import {newPreviewReward_Request} from 'System/protocol/new/NPreviewReward_Request';

/**
 * Request类协议工具(工具生成，请勿手动修改)
 * @author TsClassMaker
 * @exports
 */
export class SendMsgUtil {
    private static _msg: Protocol.FyMsg = {m_stMsgHead:{m_shMsgVersion:700, m_uiTimeStamp_Low:0, m_uiTimeStamp_High:0, m_uiMsgID:0, m_uiUin:0, m_iFeedback:0, m_uiBodyLength:0}} as Protocol.FyMsg;
    private static _bodyObjects = {};
    
    static getLoginServer_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_LoginServer_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.LoginServer_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newLoginServer_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getLogoutServer_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_LogoutServer_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.LogoutServer_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newLogoutServer_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getUpdateSystemSetting_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_UpdateSystemSetting_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.UpdateSystemSetting_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newUpdateSystemSetting_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getAutoBattleSetting_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_AutoBattleSetting_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.AutoBattleSetting_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newAutoBattleSetting_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListProgress_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListQuestProgress_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListProgress_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListProgress_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOperateQuest_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OperateOneQuest_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OperateQuest_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOperateQuest_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getQuestPanel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_QuestPanel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.QuestPanel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newQuestPanel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getAchiGet_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_AchiGet_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.AchiGet_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newAchiGet_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getJuYuan_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_JuYuan_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.JuYuan_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newJuYuan_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getJuYuanUpgrade_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_JuYuanUpgrade_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.JuYuanUpgrade_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newJuYuanUpgrade_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getJiuXing_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_JiuXing_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.JiuXing_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newJiuXing_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getNPCBehaviour_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_NPCBehaviour_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.NPCBehaviour_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newNPCBehaviour_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMovePosition_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_MovePosition_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MovePosition_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMovePosition_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaQiOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaQiOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaQiOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaQiOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getShenShouOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ShenShouOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ShenShouOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newShenShouOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getShieldGodOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ShieldGodOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ShieldGodOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newShieldGodOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getTransport_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Transport_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Transport_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newTransport_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getItemTransport_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ItemTransport_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ItemTransport_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newItemTransport_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getNPCTransport_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_NPCTransport_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.NPCTransport_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newNPCTransport_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCastSkill_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_CastSkill_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CastSkill_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCastSkill_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListMenu_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListMenu_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListMenu_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListMenu_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getClickMenu_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ClickMenu_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ClickMenu_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newClickMenu_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPinstanceQuit_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PinstanceQuit_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PinstanceQuit_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPinstanceQuit_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPinstanceRank_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PinstanceRank_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PinstanceRank_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPinstanceRank_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMarriage_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Marriage_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Marriage_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMarriage_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCrazyBlood_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_CrazyBlood_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CrazyBlood_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCrazyBlood_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListActivityLimit_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListActivityLimit_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListActivityLimit_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListActivityLimit_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_List_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_List_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_List_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_List_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_Wish_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_Wish_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_Wish_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_Wish_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_Show_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_Show_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_Show_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_Show_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_Drug_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_Drug_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_Drug_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_Drug_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_Lucky_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_Lucky_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_Lucky_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_Lucky_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_ImageLevel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_ImageLevel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_ImageLevel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_ImageLevel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHeroSub_Spec_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HeroSub_Spec_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HeroSub_Spec_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHeroSub_Spec_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSkyLottery_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SkyLottery_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SkyLottery_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSkyLottery_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getStarLottery_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_StarLottery_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.StarLottery_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newStarLottery_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOperateTeam_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OperateTeam_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OperateTeam_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOperateTeam_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListNearTeamInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListNearTeamInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListNearTeamInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListNearTeamInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getClientPanelSet_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ClientPanelSet_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ClientPanelSet_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newClientPanelSet_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOperateContainer_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OperateContainer_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OperateContainer_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOperateContainer_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSwapContainer_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SwapContainer_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SwapContainer_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSwapContainer_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getContainerBuySpace_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ContainerBuySpace_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ContainerBuySpace_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newContainerBuySpace_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBagPassword_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_BagPassword_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BagPassword_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBagPassword_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaBaoPannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaBaoPannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaBaoPannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaBaoPannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaBaoLevelUp_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaBaoLevelUp_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaBaoLevelUp_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaBaoLevelUp_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaBaoActive_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaBaoActive_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaBaoActive_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaBaoActive_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaBaoShow_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaBaoShow_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaBaoShow_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaBaoShow_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaBaoXiangQian_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaBaoXiangQian_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaBaoXiangQian_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaBaoXiangQian_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZYZHPannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZYZHPannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZYZHPannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZYZHPannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZYZHReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZYZHReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZYZHReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZYZHReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCreateRole_Account_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Account_CreateRole_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CreateRole_Account_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCreateRole_Account_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDeleteRole_Account_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Account_DeleteRole_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.DeleteRole_Account_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDeleteRole_Account_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListRole_Account_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Account_ListRole_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListRole_Account_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListRole_Account_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getModifyRole_Account_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Account_ModifyRole_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ModifyRole_Account_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newModifyRole_Account_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPVPRank_CS_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PVPRank_CS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PVPRank_CS_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPVPRank_CS_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCross_CS_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_CROSS_CS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Cross_CS_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCross_CS_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGuild_CS_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Guild_CS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Guild_CS_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGuild_CS_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGuild_CROSSPVP_CS_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Guild_CROSSPVP_CS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Guild_CROSSPVP_CS_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGuild_CROSSPVP_CS_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGuild_PVP_CS_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Guild_PVP_CS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Guild_PVP_CS_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGuild_PVP_CS_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGameMaster_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GameMaster_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GameMaster_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGameMaster_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGetDroppedThing_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetDroppedThing_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GetDroppedThing_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGetDroppedThing_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOperateSkill_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OperateSkill_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OperateSkill_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOperateSkill_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOperateShortcut_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OperateShortcut_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OperateShortcut_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOperateShortcut_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getChat_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Chat_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Chat_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newChat_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getEnterRegion_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_EnterRegion_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.EnterRegion_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newEnterRegion_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBuff_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Buff_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Buff_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBuff_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRevival_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Revival_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Revival_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRevival_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBuyBigHpMp_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Buy_BigHPMp_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BuyBigHpMp_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBuyBigHpMp_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSyncTime_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SyncTime_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SyncTime_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSyncTime_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSyncTime_Client_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SyncTime_Client_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SyncTime_Client_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSyncTime_Client_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreSell_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreSell_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreSell_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreSell_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreBuy_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreBuy_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreBuy_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreBuy_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreSort_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreSort_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreSort_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreSort_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreQuery_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreQuery_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreQuery_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreQuery_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreDispMy_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreDispMy_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreDispMy_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreDispMy_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreCancelMy_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreCancelMy_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreCancelMy_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreCancelMy_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreCall_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreCall_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreCall_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreCall_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPPStoreGetAllThingNum_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PPStoreGetAllThingNum_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PPStoreGetAllThingNum_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPPStoreGetAllThingNum_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getTitle_ActiveChange_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Title_ActiveChange_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Title_ActiveChange_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newTitle_ActiveChange_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMail_FetchList_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Mail_FetchList_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Mail_FetchList_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMail_FetchList_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMail_FetchMail_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Mail_FetchMail_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Mail_FetchMail_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMail_FetchMail_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMail_PickAccessory_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Mail_PickAccessory_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Mail_PickAccessory_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMail_PickAccessory_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_FetchGameFriend_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_FetchGameFriend_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_FetchGameFriend_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_FetchGameFriend_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_Apply_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_Apply_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_Apply_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_Apply_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_Add_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_Add_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_Add_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_Add_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_Delete_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_Delete_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_Delete_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_Delete_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_RoleInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_RoleInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_RoleInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_RoleInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_Search_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_Search_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_Search_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_Search_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_Contact_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_Contact_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_Contact_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_Contact_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFriend_PetInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Friend_PetInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Friend_PetInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFriend_PetInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHYDOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HYDOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HYDOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHYDOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getEquipProp_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_EquipProp_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.EquipProp_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newEquipProp_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDress_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_DRESS_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Dress_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDress_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDiBang_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_DiBang_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.DiBang_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDiBang_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPinstanceEnter_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PinstanceEnter_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PinstanceEnter_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPinstanceEnter_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getAASSetStatus_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_AASSetStatus_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.AASSetStatus_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newAASSetStatus_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getAASIdentityRecord_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_AASIdentity_Record_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.AASIdentityRecord_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newAASIdentityRecord_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getNPCStoreLimitList_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_NPCStoreLimitList_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.NPCStoreLimitList_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newNPCStoreLimitList_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRefreshRankInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_RefreshRankInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.RefreshRankInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRefreshRankInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGuildPVPRank_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Guild_PVP_Rank_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GuildPVPRank_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGuildPVPRank_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYBQ_Get_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYBQ_Get_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYBQ_Get_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYBQ_Get_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBaoDian_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_BaoDian_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BaoDian_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBaoDian_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListActivity_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListActivity_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListActivity_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListActivity_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDoActivity_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_DoActivity_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.DoActivity_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDoActivity_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getVIPOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_VIPOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.VIPOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newVIPOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMountRideChange_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_MountRideChange_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MountRideChange_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMountRideChange_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getInterruptSkill_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_InterruptSkill_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.InterruptSkill_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newInterruptSkill_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRefreshRewardQuest_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_RefreshRewardQuest_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.RefreshRewardQuest_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRefreshRewardQuest_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCompleteRewardQuest_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_CompleteRewardQuest_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CompleteRewardQuest_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCompleteRewardQuest_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRecruitAlchemist_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_RecruitAlchemist_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.RecruitAlchemist_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRecruitAlchemist_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOpCrystal_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OpCrystal_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OpCrystal_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOpCrystal_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getListCrystal_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListCrystal_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ListCrystal_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newListCrystal_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSwapCrystal_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SwapCrystal_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SwapCrystal_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSwapCrystal_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHideSightRole_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HideSightRole_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HideSightRole_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHideSightRole_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getChangeCDKey_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ChangeCDKey_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ChangeCDKey_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newChangeCDKey_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getChangeMountImage_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ChangeMountImage_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ChangeMountImage_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newChangeMountImage_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGetThingProperty_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetThingPropertyByGuid_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GetThingProperty_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGetThingProperty_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSevenDayFund_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SevenDay_Fund_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SevenDayFund_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSevenDayFund_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSCGetInfoRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SCGetInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SCGetInfoRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSCGetInfoRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSCGetRewardRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SCGetReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SCGetRewardRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSCGetRewardRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZazenRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Zazen_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZazenRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZazenRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSpecialTransport_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SpecialTransport_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SpecialTransport_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSpecialTransport_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGetNpcPostionList_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetNpcPostionList_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GetNpcPostionList_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGetNpcPostionList_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGetPlayerPosRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetPlayerPos_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GetPlayerPosRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGetPlayerPosRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCSGetSceneMonsterRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetSceneMonster_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CSGetSceneMonsterRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCSGetSceneMonsterRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCSGetIconMonsterRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetIconMonster_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CSGetIconMonsterRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCSGetIconMonsterRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPinstanceHomeRequest(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PinstanceHome_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PinstanceHomeRequest = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPinstanceHomeRequest();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCSListGMQA_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ListGMQA_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CSListGMQA_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCSListGMQA_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCSAddGMQA_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_AddGMQA_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CSAddGMQA_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCSAddGMQA_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOpenBeautyPannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OpenBeautyPannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OpenBeautyPannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOpenBeautyPannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyStageUp_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_BeautyStageUp_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyStageUp_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyStageUp_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyBattle_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_BeautyBattle_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyBattle_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyBattle_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyActive_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_BeautyActive_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyActive_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyActive_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyDrug_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Beauty_Drug_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyDrug_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyDrug_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyKF_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Beauty_KF_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyKF_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyKF_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyJuShen_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Beauty_JuShen_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyJuShen_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyJuShen_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyZhenTu_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Beauty_ZhenTu_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyZhenTu_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyZhenTu_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getBeautyAwake_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Beauty_Awake_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.BeautyAwake_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newBeautyAwake_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSaiJiPannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SaiJiPannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SaiJiPannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSaiJiPannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSaiJiActive_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_SaiJiActive_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.SaiJiActive_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSaiJiActive_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOpenMagicCubePannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OpenMagicCubePannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OpenMagicCubePannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOpenMagicCubePannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMagicCubeLevelUp_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_MagicCubeLevelUp_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MagicCubeLevelUp_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMagicCubeLevelUp_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMagicCubePannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_MagicCubePannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MagicCubePannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMagicCubePannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaZe_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaZe_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaZe_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaZe_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRoleReturn_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_RoleReturnOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.RoleReturn_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRoleReturn_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFunctionAct_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FunctionAct_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FunctionAct_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFunctionAct_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getVIPOneKeyOpen_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OneKeyOpen_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.VIPOneKeyOpen_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newVIPOneKeyOpen_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getVIPOneKeyGet_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OneKeyGet_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.VIPOneKeyGet_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newVIPOneKeyGet_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getItemMerge_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ItemMerge_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ItemMerge_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newItemMerge_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZFEquipUpColor_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZFEquipUpColor_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZFEquipUpColor_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZFEquipUpColor_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHunGuMerge_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HunGuMerge_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HunGuMerge_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHunGuMerge_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDigBoss_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_DigBoss_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.DigBoss_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDigBoss_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFirstOpen_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FirstOpenChange_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FirstOpen_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFirstOpen_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getDayOperate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_DayOperate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.DayOperate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newDayOperate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGroupBuy_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GroupBuy_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GroupBuy_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGroupBuy_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getOpenSuperVIP_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_OpenSuperVIP_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.OpenSuperVIP_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newOpenSuperVIP_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCSPKStatus_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_PKStatus_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.CSPKStatus_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCSPKStatus_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getGetLevelBag_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetLevelBag_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.GetLevelBag_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newGetLevelBag_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMonthCard_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_GetMonthCard_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MonthCard_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMonthCard_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFSCTGGetInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFSCTGGetInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFSCTGGetInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFSCTGGetInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFSCTGGetReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFSCTGGetReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFSCTGGetReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFSCTGGetReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFSCTGSendMsg_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFSCTGSendMsg_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFSCTGSendMsg_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFSCTGSendMsg_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFQMCBGetInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFQMCBGetInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFQMCBGetInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFQMCBGetInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFQMCBGetReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFQMCBGetReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFQMCBGetReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFQMCBGetReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFQMCBGetRoleInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFQMCBGetRoleInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFQMCBGetRoleInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFQMCBGetRoleInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFMRMBGetInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFMRMBGetInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFMRMBGetInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFMRMBGetInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFMRMBGetReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFMRMBGetReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFMRMBGetReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFMRMBGetReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getKFActInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_KFActInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.KFActInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newKFActInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHFActInfo_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HFActInfo_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HFActInfo_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHFActInfo_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getFaZhen_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_FaZhen_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.FaZhen_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newFaZhen_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getQiFu_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_QiFu_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.QiFu_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newQiFu_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getQianKunLu_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Qiankunlu_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.QianKunLu_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newQianKunLu_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getRoleWing_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_RoleWing_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.RoleWing_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newRoleWing_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getXZFM_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_XZFM_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.XZFM_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newXZFM_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZZHC_Pannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZZHC_Pannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZZHC_Pannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZZHC_Pannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZZHC_Reward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZZHC_Reward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZZHC_Reward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZZHC_Reward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getZZHC_Recommond_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_ZZHC_Recommond_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.ZZHC_Recommond_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newZZHC_Recommond_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getMHZZ_Pannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_MHZZ_Pannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.MHZZ_Pannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newMHZZ_Pannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_Pannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_Pannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_Pannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_Pannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_PK_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_PK_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_PK_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_PK_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_BuyBuff_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_BuyBuff_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_BuyBuff_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_BuyBuff_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_GetReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_GetReward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_GetReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_GetReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_Skill_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_Skill_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_Skill_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_Skill_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYYZ_FightSet_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WYYZ_FightSet_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYYZ_FightSet_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYYZ_FightSet_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSet_Charge_Rebate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Set_Charge_Rebate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Set_Charge_Rebate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSet_Charge_Rebate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCharge_Rebate_Panel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Charge_Rebate_Panel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Charge_Rebate_Panel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCharge_Rebate_Panel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getCharge_Rebate_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Charge_Rebate_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Charge_Rebate_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newCharge_Rebate_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWorldPaiMai_Pannel_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WorldPaiMai_Pannel_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WorldPaiMai_Pannel_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWorldPaiMai_Pannel_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWorldPaiMai_Buy_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WorldPaiMai_Buy_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WorldPaiMai_Buy_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWorldPaiMai_Buy_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getWYTreasureHunt_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_WY_TreasureHunt_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.WYTreasureHunt_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newWYTreasureHunt_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getHunLi_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_HunLi_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.HunLi_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newHunLi_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getSurvey_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Survey_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.Survey_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newSurvey_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    static getPreviewReward_Request(): Protocol.FyMsg {
        let msgid = Macros.MsgID_Preview_Reward_Request;
        SendMsgUtil._msg.m_stMsgHead.m_uiMsgID = msgid;
        let body: Protocol.PreviewReward_Request = SendMsgUtil._bodyObjects[msgid];
        if (null == body) {
            body = newPreviewReward_Request();
            SendMsgUtil._bodyObjects[msgid] = body;
        }
        SendMsgUtil._msg.m_msgBody = body;
        return SendMsgUtil._msg;
    }
    
}
