import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ActionHandler } from 'System/ActionHandler'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { EquipView } from 'System/equip/EquipView'
import { ErrorId } from 'System/protocol/ErrorId'
import { EquipFuHunPanel } from 'System/equip/EquipFuHunPanel'
import { DecomposeView } from 'System/bag/view/DecomposeView'
import { Events } from 'System/Events'
import { ThingData } from 'System/data/thing/ThingData'
import { DiamondUpPanel } from 'System/equip/DiamondUpPanel'
import { FanXianTaoView } from 'System/equip/FanXianTaoView'
import { FanXianBasePanel } from 'System/equip/FanXianBasePanel'
import { ShengLingPanel } from 'System/equip/ShengLingPanel'
import { EquipLianTiPanel } from 'System/equip/EquipLianTiPanel'
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView'
import { ItemMergeView } from 'System/Merge/ItemMergeView'
import { HunLiView } from 'System/hunli/HunLiView'
import { HunGuView } from 'System/hungu/HunGuView'
import { JinjieView } from 'System/jinjie/view/JinjieView'


export class EquipModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_EquipProp_Response, this._onEquipEnhanceResponse); //显示或关闭对话框 
        this.addNetListener(Macros.MsgID_RoleWing_Response, this.onRoleWingResponse);
    }

    private _onEquipEnhanceResponse(response: Protocol.EquipProp_Response): void {
        if (response.m_iResultID == ErrorId.EQEC_Success) {
            let equipView = G.Uimgr.getForm<EquipView>(EquipView);
            if (response.m_usType == Macros.EQUIP_STRENG) {
                let oneData: Protocol.ContainerSlotInfo = {} as Protocol.ContainerSlotInfo;
                oneData.m_usStrengthenLv = response.m_stValue.m_stEquipStreng.m_usStrengthenLv;
                G.DataMgr.equipStrengthenData.setEquipStrengthenLv(response.m_ucEquipPart, oneData);
                if (equipView != null) {
                    equipView.setStrengProgressValue(response.m_stValue.m_stEquipStreng);
                }
            }
            else if (response.m_usType == Macros.EQUIP_DIAMOND_MOUNT) //宝石镶嵌
            {
                G.TipMgr.addMainFloatTip('宝石镶嵌成功', Macros.PROMPTMSG_TYPE_MIDDLE);
                if (equipView != null) {
                    G.AudioMgr.playStarBombSucessSound();
                }
            } else if (response.m_usType == Macros.EQUIP_DIAMOND_UNMOUNT) {
                G.TipMgr.addMainFloatTip('宝石卸下成功', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            else if (response.m_usType == Macros.EQUIP_LQ_UPLEVEL) {
                //装备斩魔
                if (defines.has('_DEBUG')) {
                    uts.log(uts.format('斩魔等级{0}', response.m_stValue.m_stEquipLQ.m_ucLQLevel));
                }
                if (response.m_stValue.m_stEquipLQ.m_ucUpLevel) {
                    if (equipView != null) {
                        equipView.onPlayEffect(true);
                    }
                    if (defines.has('_DEBUG')) {
                        uts.log(uts.format('斩魔成功'));
                    }
                }
                else {
                    if (equipView != null) {
                        equipView.onPlayEffect(false);
                    }
                    if (defines.has('_DEBUG')) {
                        uts.log(uts.format('斩魔失败'));
                    }
                }
                //  this.dispatchEvent(Events.zm_level_up_success, response.m_stValue.m_stEquipLQ.m_ucUpLevel);
                //分解
                if (equipView != null) {
                    equipView.onZmLevelUpSuccess();
                }
            } else if (response.m_usType == Macros.EQUIP_WASH_BUY) {
                G.TipMgr.addMainFloatTip('成功激活');
            } else if (response.m_usType == Macros.EQUIP_WASH) {
                G.DataMgr.equipStrengthenData.updateWashStage(response.m_stValue.m_stEquipWash.m_stStageInfo);
            }
            else if (response.m_usType == Macros.EQUIP_SLOT_UPLEVEL) {
                let oneData: Protocol.ContainerSlotInfo = {} as Protocol.ContainerSlotInfo;
                oneData.m_iSlotLv = response.m_stValue.m_iEquipSlotUpLv;
                G.DataMgr.equipStrengthenData.setEquipSlotOneData(response.m_ucEquipPart, oneData);

                if (equipView != null) {
                    equipView.onEquipPartLevelUpUpdateEquip();
                    equipView.onEquipPartLevelUpPlayEffect();
                    equipView.updateEquipPartTipMark();
                }
            }
            else if (response.m_usType == Macros.EQUIP_SLOT_ONE_UPLV) {
                G.DataMgr.equipStrengthenData.setEquipSlotLevelData(response.m_stValue.m_stEquipSlotInfoList);
                if (equipView != null) {
                    equipView.onEquipPartLevelUpUpdateEquip(true);
                    equipView.onPlayOneKeyEffect();
                    equipView.updateEquipPartTipMark();
                }
            }
            else if (response.m_usType == Macros.EQUIP_UPCOLOR) //升阶成功
            {
                if (equipView != null) {
                    equipView.playJinJieEffect();
                }
            }
            else if (response.m_usType == Macros.EQUIP_DIAMOND_UPLEVEL) //宝石成功
            {
                let hunLiView = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (hunLiView != null) {
                    hunLiView.onDiamondUpSuccess();
                }
            }
            else if (response.m_usType == Macros.EQUIP_HUNGU_SLOT_ONE_UPLV) {
                //魂骨装备位升级
                G.DataMgr.equipStrengthenData.setSlotRefineLevel(response.m_stValue.m_stHunGuSlotInfoList);
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuShengJiPanel();
                }
            }
            else if (response.m_usType == Macros.EQUIP_HUNGU_SLOT_UPLEVEL) {
                //魂骨装备位升级
                G.DataMgr.equipStrengthenData.updateSlotRefineLevel(response.m_ucEquipPart, response.m_stValue.m_iHunGuSlotUpLv);
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuShengJiPanel();
                }
            }
            else if (response.m_usType == Macros.EQUIP_SUIT_ACT) //装备收集
            {
                G.DataMgr.equipStrengthenData.activeSuitInfo = response.m_stValue.m_stSuitAct;
                G.DataMgr.equipStrengthenData.equipSuitInfo.m_ucNum = response.m_stValue.m_stSuitAct.m_ucNum;
                G.DataMgr.equipStrengthenData.equipSuitInfo.m_ucStage = response.m_stValue.m_stSuitAct.m_ucStage;
                //if (equipView != null) {
                //    equipView.updateByEquipCollectResp();
                //}
                let hunLiView = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (hunLiView != null) {
                    hunLiView.updateByHunGuExhibitionResp();
                }
                //G.ActBtnCtrl.update(false);
                //G.NoticeCtrl.checkEquipCollect();
                G.ViewCacher.mainView.updateEquipCollectProgress();
                G.GuideMgr.tipMarkCtrl.onEquipCollectChange();

            } else if (response.m_usType == Macros.EQUIP_SLOTSUIT_ACT) {
                //装备位套装激活
                //uts.log(" equipModule  装备位套装激活  " + response.m_stValue.m_ucSlotSuitAct);
                if (G.DataMgr.runtime.slotSuitPart >= 0) {
                    G.DataMgr.equipStrengthenData.setEquipSlotSuitType(G.DataMgr.runtime.slotSuitPart, response.m_stValue.m_ucSlotSuitAct);
                }
                let fanXianView = G.Uimgr.createForm<FanXianTaoView>(FanXianTaoView);
                if (fanXianView != null) {
                    let child = fanXianView.getCurrentTab() as FanXianBasePanel;
                    if (child && child.isOpened) {
                        uts.log("   开始刷新界面  ");
                        child.updatePanel();
                    }
                    fanXianView.updataTipMark();
                }

            } else if (response.m_usType == Macros.EQUIP_SLOTSUIT_UP) {
                //装备位套装升级
                let type = response.m_stValue.m_stSlotSuitUpRsp.m_ucType;
                let lv = response.m_stValue.m_stSlotSuitUpRsp.m_ucLv
                G.DataMgr.equipStrengthenData.slotSuitInfo.m_ucSuitLv[type - 1] = lv;

                let fanXianView = G.Uimgr.createForm<FanXianTaoView>(FanXianTaoView);
                if (fanXianView != null) {
                    let child = fanXianView.getCurrentTab() as ShengLingPanel;
                    if (child && child.isOpened) {
                        child.updatePanel(true);
                    }
                    fanXianView.updataTipMark();
                }

            }

            else if (response.m_usType == Macros.EQUIP_SLOTLIANTI_UP) {
                //装备位炼体升级
                //uts.log(" 部位    " + response.m_ucEquipPart+"   装备位炼体升级   " + JSON.stringify(response.m_stValue.m_stSlotLianTiUpRsp));
                let info = response.m_stValue.m_stSlotLianTiUpRsp;
                //更新新各类型消耗次数
                if (info.m_ucType == 1) {
                    G.DataMgr.equipStrengthenData.slotLTUpCostInfo.m_ucTongQian = info.m_ucHaveNum;
                } else if (info.m_ucType == 2) {
                    G.DataMgr.equipStrengthenData.slotLTUpCostInfo.m_ucBindYB = info.m_ucHaveNum;
                }
                G.DataMgr.equipStrengthenData.setEquipLianTiLv(response.m_ucEquipPart, info.m_ucLv, info.m_uiLuck);

                let equipView = G.Uimgr.createForm<EquipView>(EquipView);
                if (equipView != null) {
                    equipView.updateLianTiPanel();
                }
            }

            else if (response.m_usType == Macros.EQUIP_SLOTLTSB_ACT) {
                //装备位炼体激活神宝
                //uts.log("   装备位炼体激活神宝   " + JSON.stringify(response.m_stValue.m_stSlotLTSBActRsp));
                let info = response.m_stValue.m_stSlotLTSBActRsp;
                G.DataMgr.equipStrengthenData.setEquipLianTiSBNum(response.m_ucEquipPart, info.m_ucPos - 1, info.m_ucNum);

                let equipViewView = G.Uimgr.createForm<EquipView>(EquipView);
                if (equipViewView != null) {
                    equipViewView.updateLianTiPanel();
                }
            }
            else if (response.m_usType == Macros.EQUIP_HUNGU_STRENG) {
                //魂骨强化
                G.DataMgr.hunliData.hunguStrengeData.updateSeverConfig(response.m_ucEquipPart, response.m_stValue.m_stHunGuStreng)
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuStrengPanel();
                }
            } else if (response.m_usType == Macros.EQUIP_HUNGU_SLOT_WASH) {
                //魂骨洗炼
                let hunGuXiLianData = G.DataMgr.hunliData.hunGuXiLianData;
                hunGuXiLianData.updataHunGuXiLianConfig(response.m_ucEquipPart, response.m_stValue.m_stHunGuSlotWash.m_astWashPropArry);
                hunGuXiLianData.updateXiLianStageInfo(response.m_stValue.m_stHunGuSlotWash.m_stStageInfo);
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuXiLianPanel();
                }
                //G.DataMgr.hunliData.hunguStrengeData.updateSeverConfig(response.m_ucEquipPart, response.m_stValue.m_stHunGuStreng)
                //let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                //if (hunGuView != null) {
                //    hunGuView.updateHunGuStrengPanel();
                //}
            } else if (response.m_usType == Macros.EQUIP_HUNGU_WASH_LOCK) {
                let hunGuXiLianData = G.DataMgr.hunliData.hunGuXiLianData;
                hunGuXiLianData.updataHunGuXiLianLockConfig(response.m_ucEquipPart, response.m_stValue.m_ucHunGuSlotWashLockRsp);
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuXiLianPanel();
                }
            } else if (response.m_usType == Macros.EQUIP_HUNGU_SLOT_WASH_BUY) {
                let hunGuXiLianData = G.DataMgr.hunliData.hunGuXiLianData;
                hunGuXiLianData.updataHunGuXiLianBuyNumConfig(response.m_ucEquipPart, response.m_stValue.m_ucHunGuSlotWashBuy);
                let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
                if (hunGuView != null) {
                    hunGuView.updateHunGuXiLianPanel();
                }
            }

            // else if (response.m_usType == Macros.EQUIP_HUNGU_FZ) {
            //     //魂骨封装
            //     let part = response.m_ucEquipPart;
            //     uts.log("魂骨封装 part  " + part + "是否封装" + response.m_stValue.m_iHunGuFZLevel);
            //     let hunliView = G.Uimgr.createForm<HunLiView>(HunLiView);
            //     if (hunliView != null) {
            //         if (hunliView.isOpened)
            //             hunliView.hunguIntensifyResponse();
            //     }
            // }

            //分解
            let decomposeView = G.Uimgr.getForm<DecomposeView>(DecomposeView);
            if (decomposeView != null) {
                decomposeView.onResponse(response);
            }
        }
    }


    private onRoleWingResponse(response: Protocol.RoleWing_Response) {
        if (response.m_iResultID == ErrorId.EQEC_Success) {
            if (response.m_ucType == Macros.ROLE_WING_CREATE) {
                let view = G.Uimgr.getForm<ItemMergeView>(ItemMergeView);
                let info = response.m_stValue.m_stWingCreateRsp;
                G.DataMgr.equipStrengthenData.updateRoleWingCreateRsp(info);
                if (view) {
                    view.onRoleWingResponse(info);
                }
            }
            else if (response.m_ucType == Macros.ROLE_WING_STRENGTHEN) {
                let equipView = G.Uimgr.getForm<JinjieView>(JinjieView);
                if (equipView != null) {
                    equipView.updateWingEquipPanel();
                }
            }
        }
    }


}
