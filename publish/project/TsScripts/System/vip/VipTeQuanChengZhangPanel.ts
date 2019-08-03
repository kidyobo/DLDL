// import { UIPathData } from "System/data/UIPathData"
// import { Global as G } from "System/global"
// import { TabSubForm } from "System/uilib/TabForm"
// import { ElemFinder } from "System/uilib/UiUtility"
// import { VipTab } from "System/vip/VipView"
// import { VipView } from 'System/vip/VipView'
// import { List, ListItem } from 'System/uilib/List'
// import { VipData } from 'System/data/VipData'
// import { KeyWord } from 'System/constants/KeyWord'
// import { Color } from "System/utils/ColorUtil"
// import { TextFieldUtil } from "System/utils/TextFieldUtil"
// import { VipPrivilegeListItem } from 'System/vip/VipPrivilegeView'


// export class VipTeQuanChengZhangPanel extends TabSubForm {

//     private tabGroup: UnityEngine.UI.ActiveToggleGroup;
//     private m_vipParaMap: { [vipType: number]: GameConfig.VIPPriHYParamM[] } = {};
//     private listItems: VipPrivilegeListItem[] = [];
//     private list: List;

//     constructor() {
//         super(VipTab.yuekaJinJie);
//     }

//     protected resPath(): string {
//         return UIPathData.VipTeQuanChengZhangPanel;
//     }

//     open() {
//         super.open();
//     }

//     protected initElements() {
//         this.tabGroup = this.elems.getToggleGroup('tabGroup');
//         this.list = this.elems.getUIList('list');

//     }

//     protected initListeners() {
//         this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
//     }

//     protected onOpen() {
//         //let vipView = G.Uimgr.getForm<VipView>(VipView);
//         //if (vipView != null) {
//         //    vipView.setTopPanelActive(false);
//         //}
//         this.initListData();
//         let selectedIndex = G.DataMgr.vipData.getVIPTeQuanShowType() - 1;
//         this.tabGroup.Selected = selectedIndex;
//         this.onClickTabGroup(selectedIndex);
//     }

//     protected onClose() {
//         //let vipView = G.Uimgr.getForm<VipView>(VipView);
//         //if (vipView != null) {
//         //    vipView.setTopPanelActive(true);
//         //}
//     }


//     private onClickTabGroup(index: number) {
//         let listData = this.m_vipParaMap[index + 1];
//         this.list.Count = listData.length;
//         for (let i = 0; i < listData.length; i++) {
//             let obj = this.list.GetItem(i).gameObject;
//             let item = this.getListItem(i, obj);
//             item.update(i, null, listData[i]);
//         }
//         let vipView = G.Uimgr.getForm<VipView>(VipView);
//         if (vipView != null) {
//             vipView.updateJinjiePanel(index + 1);
//         }
//     }


//     private getListItem(index: number, obj: UnityEngine.GameObject): VipPrivilegeListItem {
//         if (index < this.listItems.length) {
//             return this.listItems[index];
//         } else {
//             let item = new VipPrivilegeListItem();
//             item.setComponents(obj, VipData.Max_VIPJinJieLv);
//             this.listItems.push(item);
//             return item;
//         }
//     }


//     private initListData() {
//         this.m_vipParaMap = {};
//         let rawData: GameConfig.VIPPriHYParamM[] = G.DataMgr.vipData.VipFanLiParaConfig;
//         for (let config of rawData) {
//             if (config.m_szDesc != '') {
//                 if (this.m_vipParaMap[config.m_ucPriType] == null) {
//                     this.m_vipParaMap[config.m_ucPriType] = [];
//                 }
//                 this.m_vipParaMap[config.m_ucPriType].push(config);
//             }
//         }
//         for (let i = 1; i <= VipData.PrivilegeCnt; i++) {
//             this.m_vipParaMap[i].sort(this.sortVipParaMap);
//         }
//     }


//     private sortVipParaMap(a: GameConfig.VIPPriHYParamM, b: GameConfig.VIPPriHYParamM) {
//         return a.m_iOrder - b.m_iOrder;
//     }

// }