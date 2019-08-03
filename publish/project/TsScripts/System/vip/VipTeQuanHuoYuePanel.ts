// import { UIPathData } from "System/data/UIPathData";
// import { Global as G } from "System/global";
// import { TabSubForm } from "System/uilib/TabForm";
// import { ElemFinder, ElemFinderMySelf } from "System/uilib/UiUtility";
// import { VipTab } from "System/vip/VipView";
// import { VipView } from 'System/vip/VipView'
// import { List, ListItem } from 'System/uilib/List'
// import { VipData } from 'System/data/VipData'
// import { KeyWord } from 'System/constants/KeyWord'
// import { Color } from "System/utils/ColorUtil";
// import { TextFieldUtil } from "System/utils/TextFieldUtil";
// import { Macros } from 'System/protocol/Macros'
// import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
// import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
// import { ActHomeView } from 'System/activity/actHome/ActHomeView'
// import { BossView } from 'System/pinstance/boss/BossView'
// import { MallView } from 'System/business/view/MallView'
// import { TanBaoView, EnumTanBaoType } from 'System/tanbao/TanBaoView'
// import { UIUtils } from 'System/utils/UIUtils'


// class TeQuanHuoYueListItem {

//     private textName: UnityEngine.UI.Text;
//     private icon: UnityEngine.UI.Image;
//     private textReward: UnityEngine.UI.Text;
//     private textValue: UnityEngine.UI.Text;
//     private textTime: UnityEngine.UI.Text;
//     private btn_go: UnityEngine.GameObject;
//     private actId: number = 0;
//     private cfg: GameConfig.VIPPriHYFuncM;

//     setCommonpents(obj: UnityEngine.GameObject) {
//         this.textName = ElemFinder.findText(obj, 'textName');
//         this.icon = ElemFinder.findImage(obj, 'icon');
//         this.textReward = ElemFinder.findText(obj, 'reward');
//         this.textValue = ElemFinder.findText(obj, 'textValue');
//         this.btn_go = ElemFinder.findObject(obj, 'btnGo');
//         this.textTime = ElemFinder.findText(obj, 'textTimes');
//         Game.UIClickListener.Get(this.btn_go).onClick = delegate(this, this.onClickBtnGo);
//     }

//     update(data: GameConfig.VIPPriHYFuncM, type: number) {
//         this.cfg = data;
//         this.textName.text = data.m_szTitle;
//         this.icon.sprite = VipTeQuanHuoYuePanel.nameAltas.Get(data.m_szTitle);
//         this.textValue.text = '成长值:' + data.m_ucGiveExp;
//         let progress = G.DataMgr.vipData.getVipHuoYueFinshTimesByTypeIndex(type, data.m_ucID);
//         this.textTime.text = uts.format('{0}:{1}', KeyWord.ACT_FUNCTION_CHARGE == this.cfg.m_iFuncID ? '充值' : '次数',
//             TextFieldUtil.getColorText(progress + '/' + data.m_uiTimes, progress >= data.m_uiTimes ? Color.UIGreen : Color.RED));
//         UIUtils.setButtonClickAble(this.btn_go, G.DataMgr.vipData.getVipTeQuanCanJoinAct(type));
//     }


//     private onClickBtnGo() {
//         let processed = false;
//         if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_PINSTANCE_FIRST) {
//             // 副本首通
//             if (Macros.PINSTANCE_ID_JDYJ == this.cfg.m_uiTypeIndex) {
//                 // 剧情副本进当日未通关的最低难度
//                 let config = G.DataMgr.pinstanceData.getJuQingFuBenCanDoCfg();
//                 if (config != null) {
//                     G.ModuleMgr.pinstanceModule.tryEnterJuQingFuBtn(config.m_iID, config.m_iDiff);
//                     processed = true;
//                 }
//             } else if (Macros.PINSTANCE_ID_WST == this.cfg.m_uiTypeIndex) {
//                 // 强化副本直接挑战当前层
//                 let crtLv = G.DataMgr.pinstanceData.getCurQiangHuaFuBenLv();
//                 if (crtLv > 0) {
//                     G.ModuleMgr.pinstanceModule.tryEnterQiangHuaFuBen(crtLv);
//                     processed = true;
//                 }
//             } else if (Macros.PINSTANCE_ID_SHNS == this.cfg.m_uiTypeIndex) {
//                 // 经验副本直接挑战当前层
//                 G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing();
//                 processed = true;
//             }
//             //else if (Macros.PINSTANCE_ID_CAILIAO == this.cfg.m_uiTypeIndex) {
//             //    // 材料副本
//             //    let cfg = G.DataMgr.pinstanceData.getCaiLiaoFuBenCanDoCfg();
//             //    if (null != cfg) {
//             //        G.ModuleMgr.pinstanceModule.tryEnterPinstance(cfg.m_iID, cfg.m_iDiff);
//             //        processed = true;
//             //    }
//             //}
//             else if (Macros.PINSTANCE_ID_WYFB == this.cfg.m_uiTypeIndex) {
//                 // 伙伴副本
//                 let lv = G.DataMgr.pinstanceData.getWuYuanFuBenMinLv();
//                 if (lv > 0) {
//                     G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_WYFB, lv);
//                     processed = true;
//                 }
//             }
//             else if (KeyWord.ACT_FUNCTION_CHARGE == this.cfg.m_iFuncID) {
//                 //充值
//                 G.ActionHandler.go2Pay();
//                 processed = true;
//             }
//             else {
//                 // 极速挑战等
//                 G.ModuleMgr.pinstanceModule.tryEnterPinstance(this.cfg.m_uiTypeIndex);
//                 processed = true;
//             }
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_GROUPPIN_FIRST) {
//             // 副本组首通
//             let id = 0;
//             if (KeyWord.OTHER_FUNCTION_ZDFB == this.cfg.m_iFuncID) {
//                 // 组队副本
//                 id = G.DataMgr.pinstanceData.getZuDuiFuBenMinID();
//             } else if (KeyWord.OTHER_FUNCTION_FSD == this.cfg.m_iFuncID) {
//                 // 天神殿
//                 id = G.DataMgr.pinstanceData.getFaShenDianMaxLv();
//             }

//             if (id > 0) {
//                 let myTeam = G.DataMgr.sxtData.myTeam;
//                 if (null != myTeam && myTeam.m_uiPinstanceID != id) {
//                     G.ActionHandler.leaveTeam();
//                 }
//                 let gameParas = G.DataMgr.gameParas;
//                 G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossCreateTeamRequest(id, '', true, 0,
//                     gameParas.domain, gameParas.serverIp, gameParas.serverPort));
//             }
//             G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(this.cfg.m_iFuncID, id);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_MWSLTZ_NUM) {
//             // 宝石试炼投掷次数
//             G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_MWSL);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_ENTERPINSTANCE_NUM) {
//             // 副本进入次数
//             if (Macros.PINSTANCE_ID_DIGONG == this.cfg.m_uiTypeIndex) {
//                 // 地宫随便进
//                 let bossCfg = G.DataMgr.fmtData.getDiGongSugguestBoss();
//                 G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUAJI, bossCfg.m_iLayer, bossCfg.m_iBigBossId);
//                 processed = true;
//             } else if (KeyWord.OTHER_FUNCTION_CROSS3V3 == this.cfg.m_iFuncID) {
//                 // 跨服3v3
//                 G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_CROSS3V3);
//                 // 自动排队
//                 if (G.DataMgr.sxtData.myTeam || G.DataMgr.teamData.hasTeam) {
//                     G.ActionHandler.leaveTeam();
//                     let gameParas = G.DataMgr.gameParas;
//                     G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCross3v3JoinRequest(gameParas.domain, gameParas.serverIp, gameParas.serverPort));
//                     processed = true;
//                 }
//             } else if (KeyWord.OTHER_FUNC_KFZMZ == this.cfg.m_iFuncID) {
//                 // 跨服宗门
//                 G.ActionHandler.joinGuildPVP();
//                 processed = true;
//             } else if (KeyWord.OTHER_FUNCTION_ZLQJ == this.cfg.m_iFuncID) {
//                 // 西洋棋
//                 G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_ZLQJ);
//                 // 自动排队
//                 G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhenLongQiJuRequest(Macros.CROSS_ZLQJ_SIGNUP));
//                 processed = true;
//             } else if (KeyWord.OTHER_FUNCTION_DYZSPIN == this.cfg.m_iFuncID) {
//                 //小鸡小鸡
//                 if (!G.DataMgr.activityData.isActivityOpen(this.cfg.m_iActID)) {
//                     G.TipMgr.addMainFloatTip('活动还没有开启');
//                     return;
//                 }
//                 G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
//                 processed = true;
//             }
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_COMPLETEQUEST_NUM) {
//             // 任务完成次数
//             G.ModuleMgr.questModule.doQuestByType(this.cfg.m_uiTypeIndex, false);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_FMTBOSS_NUM) {
//             // 黑洞塔boss参与次数
//             let id = G.DataMgr.fmtData.getFmtSugguestBoss();;
//             if (id > 0) {
//                 let bossCfg = G.DataMgr.fmtData.getFmtCfgByBossId(id);
//                 G.ActionHandler.goToFmtLayer(bossCfg.m_iLayer, id);
//             } else {
//                 G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_FMT);
//             }
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_PVPRANK_NUM) {
//             // 个人竞技次数
//             G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_STORE_CONSUME) {
//             // 商城消费
//             G.Uimgr.createForm<MallView>(MallView).open(this.cfg.m_iFuncID);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_MODIBAOKU) {
//             // 魔帝宝库
//             let tab = EnumTanBaoType.BaoKu;
//             if (KeyWord.LOTTERY_TYPE_MJ == this.cfg.m_uiTypeIndex) {
//                 tab = EnumTanBaoType.MiCang;
//             }
//             G.Uimgr.createForm<TanBaoView>(TanBaoView).open(tab);
//             processed = true;
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_GETTHING_NUM) {
//             // 获得物品
//             if (KeyWord.OTHER_FUNCTION_BXZB == this.cfg.m_iFuncID) {
//                 // 宝箱争霸直接进
//                 G.ActionHandler.handleDailyAct(this.cfg.m_iActID);
//                 processed = true;
//             }
//         }
//         else if (this.cfg.m_ucType == KeyWord.ACTIVEDEGREE_WORLDBOSS_NUM) {
//             // 世界boss
//             let id = G.DataMgr.activityData.getWorldBossSugguestId();
//             G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WORLDBOSS, id);
//             return;
//         }
//         if (!processed) {
//             // 祈福次数等
//             if (this.cfg.m_iActID > 0) {
//                 G.ActionHandler.handleDailyAct(this.cfg.m_iActID);
//             } else {
//                 G.ActionHandler.executeFunction(this.cfg.m_iFuncID, KeyWord.FUNC_LIMIT_ACT);
//             }
//         }
//     }

// }




// export class VipTeQuanHuoYuePanel extends TabSubForm {

//     private tabGroup: UnityEngine.UI.ActiveToggleGroup;
//     private list: List;
//     private listItems: TeQuanHuoYueListItem[] = [];
//     private textLv: UnityEngine.UI.Text;
//     private textCondition: UnityEngine.UI.Text;
//     private textDesc: UnityEngine.UI.Text;
//     private showConfig: GameConfig.VIPPriHYFuncM[] = [];
//     static nameAltas: Game.UGUIAltas;
//     private titleAltas: Game.UGUIAltas;
//     private titleIcon: UnityEngine.UI.Image;

//     constructor() {
//         super(VipTab.yuekahuoyue);
//     }

//     protected resPath(): string {
//         return UIPathData.VipTeQuanHuoYuePanel;
//     }

//     open() {
//         super.open();
//     }

//     protected initElements() {
//         this.tabGroup = this.elems.getToggleGroup('tabGroup');
//         this.list = this.elems.getUIList('list');
//         this.textLv = this.elems.getText('textLv');
//         this.textCondition = this.elems.getText('textCondition');
//         this.textDesc = this.elems.getText('textDesc');
//         VipTeQuanHuoYuePanel.nameAltas = ElemFinderMySelf.findAltas(this.elems.getElement('nameAltas'));
//         this.titleAltas = ElemFinderMySelf.findAltas(this.elems.getElement('titleAltas'));
//         this.titleIcon = this.elems.getImage('imgName');
//     }

//     protected initListeners() {
//         this.addListClickListener(this.list, this.onClickList);
//         this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
//     }

//     protected onOpen() {
//         G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_PRIHY_LIST, 0));
//         let vipView = G.Uimgr.getForm<VipView>(VipView);
//         //if (vipView != null) {
//         //    vipView.setTopPanelActive(false);
//         //}
//     }

//     protected onClose() {
//         //let vipView = G.Uimgr.getForm<VipView>(VipView);
//         //if (vipView != null) {
//         //    vipView.setTopPanelActive(true);
//         //}
//     }


//     updateView() {
//         let selectedIndex = G.DataMgr.vipData.getVIPTeQuanShowType() - 1;
//         this.tabGroup.Selected = selectedIndex;
//         this.onClickTabGroup(selectedIndex);
//     }

//     private onClickList(index: number) {
//         let data = this.showConfig[index];
//         this.textLv.text = data.m_iFuncIDLevel.toString();
//         this.textCondition.text = data.m_szJoinDesc;
//         this.textDesc.text = data.m_szRuleDesc;
//         this.titleIcon.sprite = this.titleAltas.Get(data.m_szTitle);
//     }


//     private onClickTabGroup(index: number) {
//         let type = index + 1;
//         let data = G.DataMgr.vipData.getVipTeQuanHuoYueConfigByType(type);
//         this.showConfig = data;
//         this.list.Count = data.length;
//         for (let i = 0; i < data.length; i++) {
//             let obj = this.list.GetItem(i).gameObject;
//             let item = this.getListItem(i, obj);
//             item.update(data[i], type);
//         }
//         this.list.Selected = 0;
//         this.onClickList(0);
//         let vipView = G.Uimgr.getForm<VipView>(VipView);
//         if (vipView != null) {
//             vipView.updateJinjiePanel(index + 1);
//         }
//     }


//     private getListItem(index: number, obj: UnityEngine.GameObject): TeQuanHuoYueListItem {
//         if (index < this.listItems.length) {
//             return this.listItems[index];
//         } else {
//             let item = new TeQuanHuoYueListItem();
//             item.setCommonpents(obj);
//             this.listItems.push(item);
//             return item;
//         }
//     }


// }

