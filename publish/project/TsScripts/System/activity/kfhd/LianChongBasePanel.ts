import { UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { MathUtil } from "System/utils/MathUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { KaifuActivityData } from 'System/data/KaifuActivityData'


export class LianChongItem {

    private btnGo: UnityEngine.GameObject;
    private btnGet: UnityEngine.GameObject;
    private txtGetLabel: UnityEngine.UI.Text;
    private txtGoLabel: UnityEngine.UI.Text;
    private txtCondition: UnityEngine.UI.Text;
    private rewardList: List;
    private iconItems: IconItem[] = [];

    private id: number = 0;

    setCommponents(go: UnityEngine.GameObject) {
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        this.txtGetLabel = ElemFinder.findText(go, "btnGet/txtBtnLabel");
        this.txtGoLabel = ElemFinder.findText(go, "btnGo/txtBtnLabel");
        this.txtCondition = ElemFinder.findText(go, "txtCondition");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "reward/rewardList"));

        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickGo);
    }

    update(data: Protocol.KFLCFLCfg_Server, today: number, week: number) {
        this.id = data.m_iType * 10000 + data.m_iID;

        this.txtCondition.text = uts.format("活动期间，累计{0}天每天充值{1}钻石", data.m_iCondition2, data.m_iCondition1);
        let kfLCFLData = G.DataMgr.kaifuActData.kfLCFLInfo;
        let bitMap = kfLCFLData.m_aiRewardBit[data.m_iType - 1];
        let isGet: boolean = MathUtil.checkPosIsReach(data.m_iID - 1, bitMap);

        this.rewardList.Count = data.m_iItemCount;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i).gameObject;
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsuallyIcon(item);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(data.m_stItemList[i].m_iID, data.m_stItemList[i].m_iCount);
            this.iconItems[i].updateIcon();
        }

        if (isGet) {
            this.updataBtnStatus(false, true);
        }
        else {
            let canGetCount = G.DataMgr.kaifuActData.getStartToEndCZCount(week,data.m_iType);
            if (canGetCount >= data.m_iCondition2) {
                //可领取
                this.updataBtnStatus(false, false);
            } else {
                //前往
                this.updataBtnStatus(true);
            }
        }
    }

    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LCFL_GET, this.id));
    }

    private onClickGo() {
        G.ActionHandler.go2Pay();
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.btnGo.SetActive(isGo);
        this.btnGet.SetActive(!isGo);
        this.txtGetLabel.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.btnGet, !hasGet);
    }

}
//   OTHER_FUNCTION_KFLIANCHONGCHU   OTHER_FUNCTION_KFLIANCHONGZHONG  OTHER_FUNCTION_KFLIANCHONGGAO

export abstract class LianChongBasePanel extends TabSubForm {

    

    public static readonly panelKeyWords = [KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU, KeyWord.OTHER_FUNCTION_KFLIANCHONGZHONG, KeyWord.OTHER_FUNCTION_KFLIANCHONGGAO];
    protected readonly timeNum = 24 * 60 * 60;

    protected txtTime: UnityEngine.UI.Text;
    protected txtNum: UnityEngine.UI.Text;
    protected txtTodayHas: UnityEngine.UI.Text;
    protected list: List;


    protected lianChongItems: LianChongItem[] = [];

    protected today: number = 0;
    protected week: number = 0;
    protected type: number = 0;

    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;

    private m_restTime: number = 0;

    /**类型对应模型父节点*/
    private keyword2Root: { [key: number]: UnityEngine.GameObject } = {};

    private keyword2UnitCtrlType: { [key: number]: UnitCtrlType } = {};

    

    protected initElements() {
        this.txtTime = this.elems.getText("txtTime");
        this.txtNum = this.elems.getText("txtNum");
        this.txtTodayHas = this.elems.getText("txtTodayHas");
        this.list = this.elems.getUIList("list");
       

        this.keyword2Root[KeyWord.HERO_SUB_TYPE_WUHUN] = this.elems.getElement("weaponRoot");
        this.keyword2Root[KeyWord.HERO_SUB_TYPE_ZUOQI] = this.elems.getElement("rideRoot");
        this.keyword2Root[KeyWord.HERO_SUB_TYPE_FAZHEN] = this.elems.getElement("zhenfaRoot");
        this.keyword2Root[KeyWord.HERO_SUB_TYPE_LEILING] = this.elems.getElement("shenjiRoot");
        this.keyword2Root[KeyWord.HERO_SUB_TYPE_YUYI] = this.elems.getElement("wingRoot");

        this.keyword2UnitCtrlType[KeyWord.HERO_SUB_TYPE_WUHUN] = UnitCtrlType.weapon;
        this.keyword2UnitCtrlType[KeyWord.HERO_SUB_TYPE_ZUOQI] = UnitCtrlType.ride;
        this.keyword2UnitCtrlType[KeyWord.HERO_SUB_TYPE_FAZHEN] = UnitCtrlType.zhenfa;
        this.keyword2UnitCtrlType[KeyWord.HERO_SUB_TYPE_LEILING] = UnitCtrlType.shenji;
        this.keyword2UnitCtrlType[KeyWord.HERO_SUB_TYPE_YUYI] = UnitCtrlType.wing;

        let day = G.SyncTime.getDateAfterStartServer();
        this.today = day%7;
        this.type = LianChongBasePanel.panelKeyWords.indexOf(this.id) + 1;
      
    }

    protected initListeners() {

    }

    protected resPath(): string {
        return UIPathData.LianChongItemPanel;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LCFL_OPEN));
        this.addTimer("1", 1000, 0, this.onTimer);

    }

    protected onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    updateView() {
        let kfLCFLData = G.DataMgr.kaifuActData.kfLCFLInfo;
        this.week = kfLCFLData.m_iWeek;

        this.week = this.week > KaifuActivityData.MaxWeekLianChongFanLi ? 0 : this.week;

        let startEndTime = G.DataMgr.kaifuActData.getStartAndEndTime(this.week, this.type);
        let tmpToday = this.today == 0 ? KaifuActivityData.WeekDayCount : this.today;
        this.m_restTime = G.SyncTime.getServerZeroLeftTime();
        this.m_restTime += (startEndTime[1] - tmpToday) * 86400;

        let configs = G.DataMgr.kaifuActData.getConfigByType(this.week, this.type);
     
        if (kfLCFLData != null && configs != null) {
            this.list.Count = configs.length;

            for (let i = 0; i < this.list.Count; i++) {
                let item = this.list.GetItem(i);
                if (this.lianChongItems[i] == null) {
                    this.lianChongItems[i] = new LianChongItem();
                    this.lianChongItems[i].setCommponents(item.gameObject);
                }
                this.lianChongItems[i].update(configs[i], tmpToday, this.week);
            }
        }

        this.txtNum.text = "累计天数：" + TextFieldUtil.getColorText(G.DataMgr.kaifuActData.getStartToEndCZCount(this.week, this.type) + "天", Color.GREEN);
        this.txtTodayHas.text = "今日已充值：" + TextFieldUtil.getColorText(G.DataMgr.kaifuActData.getTodayHasPay(tmpToday) + "钻石", Color.GREEN);
        this.lateLoadModel(configs[0].m_iModelType, configs[0].m_iModelID)
    }

    private lateLoadModel(modelType: number, modelId: number) {
        let modelUrl = "";
        let unitType = this.keyword2UnitCtrlType[modelType];
        if (unitType == UnitCtrlType.weapon) {
            modelUrl = modelId.toString() + "_" + G.DataMgr.heroData.profession;
        } else {
            modelUrl = modelId.toString();
        }
        if (unitType != undefined && unitType != UnitCtrlType.none) {
            G.ResourceMgr.loadModel(this.keyword2Root[modelType], unitType, modelUrl, this.sortingOrder);
        } //else {
        // this.setRoleAvaterStage(modelUrl);
        //}
    }

    private onTimer(): void {
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.txtTime.text = "活动已经结束";
            this.removeTimer("1");
        }
        else {
            this.txtTime.text = "活动剩余时间：" + TextFieldUtil.getColorText(DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }

    /**
     * 显示模型的
     * @param dressId
     */
    private setRoleAvaterStage(dressId: string): void {
        //let heroData = G.DataMgr.heroData;
        ////时装显示
        //this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        //this.m_avatarList.m_uiDressImageID = parseInt(dressId);
        //if (this.roleAvatar != null) {
        //    this.roleAvatar.destroy();
        //}
        //this.modelRoot.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
        //this.roleAvatar = new UIRoleAvatar(this.modelRoot, this.modelRoot);
        //this.roleAvatar.hasWing = true;
        //this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender);
        //this.roleAvatar.m_zhenfaMesh.setRotation(12, 0, 0);
        //this.roleAvatar.setSortingOrder(this.sortingOrder);

    }

}