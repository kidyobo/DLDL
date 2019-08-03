// import { TabSubForm } from 'System/uilib/TabForm'
// import { VipTab } from 'System/vip/VipView'
// import { UIPathData } from "System/data/UIPathData"
// import { List, ListItem } from 'System/uilib/List'
// import { ElemFinder } from 'System/uilib/UiUtility'
// import { KeyWord } from 'System/constants/KeyWord'
// import { Global as G } from 'System/global'
// import { Macros } from 'System/protocol/Macros'
// import { ProtocolUtil } from 'System/protocol/ProtocolUtil'



// class FanLiListItem {

//     private vipLevelText: UnityEngine.UI.Text;
//     private shuangbeiText: UnityEngine.UI.Text;
//     private fanliyuanbaoText: UnityEngine.UI.Text;
//     private hasGetObj: UnityEngine.GameObject;
//     private ouShuBack: UnityEngine.GameObject;
//     private jishuBack: UnityEngine.GameObject;


//     setCommonpents(obj: UnityEngine.GameObject) {
//         this.vipLevelText = ElemFinder.findText(obj, 'Text1');
//         this.shuangbeiText = ElemFinder.findText(obj, 'Text2');
//         this.fanliyuanbaoText = ElemFinder.findText(obj, 'Text3');
//         this.hasGetObj = ElemFinder.findObject(obj, 'hasget');
//         this.ouShuBack = ElemFinder.findObject(obj, 'oushuBack');
//         this.jishuBack = ElemFinder.findObject(obj, 'jishuBack');
//     }



//     update(data: GameConfig.VIPRebateM, index: number, hasGetGift: boolean) {
//         this.vipLevelText.text = 'VIP' + data.m_iVIPLv;
//         this.shuangbeiText.text = data.m_iExtVal.toString();
//         this.fanliyuanbaoText.text = data.m_iReabtePre / 100 + '%';
//         let active = index % 2 == 0;
//         this.ouShuBack.SetActive(active);
//         this.jishuBack.SetActive(!active);
//         this.hasGetObj.SetActive(hasGetGift);
//     }


// }




// export class VipFanLiPanel extends TabSubForm {

//     private list: List;
//     private leftEdText: UnityEngine.UI.Text;
//     private ruleText: UnityEngine.UI.Text;

//     constructor() {
//         super(VipTab.FanLi);
//     }

//     protected resPath(): string {
//         return UIPathData.VipFanLiPanel;
//     }

//     open() {
//         super.open();
//     }

//     protected initElements() {
//         this.list = this.elems.getUIList('list');
//         this.ruleText = this.elems.getText('des1');
//         this.leftEdText = this.elems.getText('leftText');
//     }

//     protected initListeners() {

//     }

//     protected onOpen() {
//         G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_LIST, 0));
//     }

//     protected onClose() {

//     }


//     updateView() {
//         let maxLevel = Macros.MAX_VIP_LEVEL;
//         if (G.DataMgr.heroData.curVipLevel < 12) {
//             maxLevel = 12;
//         }
//         this.list.Count = maxLevel;
//         for (let i = 0; i < maxLevel; i++) {
//             let item = new FanLiListItem();
//             item.setCommonpents(this.list.GetItem(i).gameObject);
//             item.update(G.DataMgr.vipData.getVipFanLiConfigByVipLevel(i + 1), i, G.DataMgr.vipData.getVipFanLiStatus(i + 1));
//         }
//         this.leftEdText.text = G.DataMgr.vipData.vipFanLiLeftNum.toString();
//     }


// }
