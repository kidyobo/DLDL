import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KfhdData } from 'System/data/KfhdData'
import { EnumKfhdRule } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { NetModule } from 'System/net/NetModule'
import { JjrTabItemData } from 'System/data/JjrTabItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { Color } from 'System/utils/ColorUtil'
import { JjrRewardsItemData } from 'System/data/JjrRewardsItemData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { JJRRewardItem } from 'System/jinjieri/JjrRewardItem'

//class JJRRewardItem {

//    private txtneed1: UnityEngine.UI.Text;
//    private txtneed2: UnityEngine.UI.Text;
//    private txtGet: UnityEngine.UI.Text;
//    private btnGet: UnityEngine.GameObject;
//    private btnGo: UnityEngine.GameObject;
//    private iconRoot: UnityEngine.GameObject;
//    private rewardList: List;
//    private iconItems: IconItem[] = [];
//    private iconPrefab: UnityEngine.GameObject;
//    private vo: JjrRewardsItemData;

//    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
//        this.txtneed1 = ElemFinder.findText(go, "needBg1/txtneed1");
//        this.txtneed2 = ElemFinder.findText(go, "needBg2/txtneed2");
//        this.txtGet = ElemFinder.findText(go, "btnGet/txtGetLabel");
//        this.btnGet = ElemFinder.findObject(go, "btnGet");
//        this.btnGo = ElemFinder.findObject(go, "btnGo");
//        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
//        this.iconPrefab = prefab;
//        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
//        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickGo);
//    }

//    updata(vo: JjrRewardsItemData) {
//        this.vo = vo;

//        //按钮
//        if (this.vo.m_ucStatus == 1) {
//            this.updataBtnStatus(true);
//        }
//        else if (this.vo.m_ucStatus == 2) {
//            this.updataBtnStatus(false,false);

//        }
//        else if (this.vo.m_ucStatus == 3) {
//            this.updataBtnStatus(false, true);
//        }
//        //描述
//        let cfg = this.vo.cfg;
//        let strType: string = KeyWord.getDesc(KeyWord.GROUP_STAGEDAY_TYPE, cfg.m_ucType);
//        if (cfg.m_ucType == KeyWord.STAGEDAY_STRENG) {
//            this.txtneed1.text = uts.format('全身{0}', strType);
//            this.txtneed2.text = uts.format('+{0}可领取', cfg.m_uiCondition);
//        }
//        else if (cfg.m_ucType == KeyWord.STAGEDAY_BEAUTY) {
//            this.txtneed1.text = uts.format('任一{0}达到', strType);
//            this.txtneed2.text = uts.format('{0}阶可领取', cfg.m_uiCondition);
//        }
//        else {
//            this.txtneed1.text = uts.format('今日{0}达到', strType);
//            this.txtneed2.text = uts.format('{0}阶可领取', cfg.m_uiCondition);
//        }
//        //物品图标，数量的显示
//        let rcnt = cfg.m_stItemList.length;
//        let oldIconCnt = this.iconItems.length;
//        this.rewardList.Count = rcnt;
//        for (let i = 0; i < rcnt; i++) {
//            let iconItem: IconItem;
//            if (i < oldIconCnt) {
//                iconItem = this.iconItems[i];
//            } else {
//                this.iconItems.push(iconItem = new IconItem());
//                iconItem.setUsualIconByPrefab(this.iconPrefab, this.rewardList.GetItem(i).gameObject);
//                iconItem.setTipFrom(TipFrom.normal);
//            }
//            let rcfg = cfg.m_stItemList[i];
//            iconItem.updateById(rcfg.m_uiOne, rcfg.m_uiTwo);
//            iconItem.updateIcon();
//        }
//    }

//    private onClickGet() {
//        if (!this.vo) {
//            return;
//        }
//        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.GET_STAGEDAY_REWARD, this.vo.cfg.m_iID));
//    }

//    private onClickGo() {
//        if (G.ActionHandler.executeFunction(this.vo.cfg.m_iFunction)) {
//            G.Uimgr.closeForm(FanLiDaTingView);
//        }
//    }

//    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
//        this.btnGo.SetActive(isGo);
//        this.btnGet.SetActive(!isGo);
//        this.txtGet.text = hasGet ? "已领取" : "可领取";
//        UIUtils.setButtonClickAble(this.btnGet, !hasGet);
//    }

//}

/**
 *进阶返还
 */
export class JjrRewardsPanel extends TabSubForm {
    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;

    private rewardItems: JJRRewardItem[] = [];

    private txtTime: UnityEngine.UI.Text;

  

    protected resPath(): string {
        return UIPathData.JjrRewardsPanel;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.txtTime = this.elems.getText("txtTime");
    }

    protected initListeners(): void {


    }


    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAY_OPEN_PANEL));
        this.addTimer("1", 1000, 0, this._onTimerZero);
    }

    protected onClose() {
    }

    private _onTimerZero(): void {
        let time: number = G.SyncTime.getServerZeroLeftTime();
        this.txtTime.text = G.DataMgr.langData.getLang(199, DataFormatter.second2day(time));
    }


    updataView(): void {
        if (!this.kfhdData.JJRPanelInfo) {
            return;
        }
        let m_rewardData: Protocol.StageDayInfo = this.kfhdData.JJRPanelInfo;
       // let today = 0;
        //let serverMergeTime = G.SyncTime.getDateAfterMergeServer();
        //if (serverMergeTime > 0) {
        //    today = serverMergeTime;
        //} else {
        let   today = G.SyncTime.getDateAfterStartServer();
        // }
        let curDay = (today - 1) % KeyWord.STAGEDAY_TYPE_MAX + 1;
        uts.log('rewardsPanel: day = ' + curDay);
        let typeDatas: GameConfig.StageDayCfgM[] = G.DataMgr.activityData.getJjrDayConfig(curDay);
        let activityDate: number = 0;
        if (this.kfhdData.JJRPanelInfo) {
            //活动页签
            activityDate = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAMETER_JJR_OPEN_DAY));
        }

        //typeDatas[0].m_ucType

        let iteamDate: JjrRewardsItemData;
        let iteamDateList: JjrRewardsItemData[] = new Array<JjrRewardsItemData>();
        for (let i: number = 0; i < typeDatas.length; i++) {
            let cfg: GameConfig.StageDayCfgM = typeDatas[i];
            if (cfg.m_iShow == 0 || cfg.m_iShow >= today) {
                iteamDate = new JjrRewardsItemData();
                iteamDate.cfg = cfg;
                for (let j of m_rewardData.m_stOneStatusList) {
                    if (j.m_iCfgID == iteamDate.cfg.m_iID) {
                        iteamDate.m_ucStatus = j.m_ucStatus;
                        break;
                    }
                }
                iteamDateList.push(iteamDate);
            }
        }
        this.showUI(iteamDateList);
    }


    private showUI(data: JjrRewardsItemData[]) {
        if (data == null) return;
        let index = 0;
        this.list.Count = data.length;
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.list.GetItem(i);
            if (this.rewardItems[i] == null) {
                this.rewardItems[i] = new JJRRewardItem();
                this.rewardItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            if (data[i].m_ucStatus == 2) {
                index = i;
            }
            this.rewardItems[i].updata(data[i]);
        }
        this.list.ScrollByAxialRow(index > 0 ? index : 0);


    }
  
    updataViewReward(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAY_OPEN_PANEL));
    }

    get kfhdData(): KfhdData {
        return G.DataMgr.kfhdData;
    }
}
