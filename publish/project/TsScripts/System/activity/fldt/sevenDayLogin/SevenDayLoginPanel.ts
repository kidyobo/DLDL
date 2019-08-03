import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { KaifuSignItemData } from 'System/data/vo/KaifuSignItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar';
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";

class SevenDaySignItemData {
    day: number = 0;
    /**礼包配置表*/
    giftBagConfig: GameConfig.GiftBagConfigM;
    /**3D模型ID*/
    modeId: number = 0;
}




class SevenDayRewardItem {
    private icon: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
    private iconItem: IconItem;

    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.icon = ElemFinder.findObject(go, "icon");
        this.txtName = ElemFinder.findText(go, "txtName");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(prefab, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
    }

    update(data: GameConfig.GiftItemInfo) {
        this.iconItem.updateById(data.m_iThingID, data.m_iThingNumber);
        this.iconItem.updateIcon();
        if (GameIDUtil.isBagThingID(data.m_iThingID)) {
            let thingConfig = ThingData.getThingConfig(data.m_iThingID);
            this.txtName.text = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
        } else {
            let name = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, data.m_iThingID);
            this.txtName.text = TextFieldUtil.getColorText(name, Color.getCurrencyColor(data.m_iThingID));
        }

    }

}



export class SevenDayLoginPanel extends TabSubForm {

    //private readonly modelTypes: UnitCtrlType[] = [UnitCtrlType.none, UnitCtrlType.shengqi, UnitCtrlType.wing,
    //UnitCtrlType.chenghao, UnitCtrlType.other, UnitCtrlType.shengqi, UnitCtrlType.weapon];

    private readonly modelTypes: UnitCtrlType[] = [UnitCtrlType.none, UnitCtrlType.pet, UnitCtrlType.none,
    UnitCtrlType.none, UnitCtrlType.none, UnitCtrlType.none, UnitCtrlType.ride];

    /**可签到数量7*/
    private MAX_CARD_NUM: number = 7;
    /**七天登陆List*/
    private sevenDayList: UnityEngine.GameObject;
    private currentItemVo: SevenDaySignItemData;
    private iconParent: UnityEngine.GameObject = null;
    /**领取奖励按钮*/
    private btn_get: UnityEngine.GameObject = null;
    private txtGet: UnityEngine.UI.Text;
    private listDayData: SevenDaySignItemData[] = [];
    private openDay: number = 0;
    private itemIcon_Normal: UnityEngine.GameObject = null;
    private max_reward: number = 5;
    private dayObjsManger: UnityEngine.GameObject[] = [];
    private lastSelectedStage: UnityEngine.GameObject = null;
    private selectedIndex: number = -1;


    private selectDay: number = 0;
    private roots: UnityEngine.GameObject[] = [];
    private rewardList: List;
    private sevenDayRewardItems: SevenDayRewardItem[] = [];

    private imgText: UnityEngine.UI.Image;
    private imgAtlas: Game.UGUIAltas;

    private rideCtn: UnityEngine.GameObject;
    private petCtn: UnityEngine.GameObject;
    private boxCtn: UnityEngine.GameObject;
    private diamondCtn: UnityEngine.GameObject;
    private imageCtn: UnityEngine.GameObject;

    /**时装avatarList*/
    private m_avatarList: Protocol.AvatarList = null;
    private roleAvatar: UIRoleAvatar;

    private tabDays: UnityEngine.UI.ActiveToggleGroup;
    private dayTipMarks: UnityEngine.GameObject[] = [];
    private tabDayObjs: UnityEngine.GameObject[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_QTDLJ);
    }

    protected resPath(): string {
        return UIPathData.SevenDayLoginView;
    }


    protected initElements() {
        this.sevenDayList = this.elems.getElement("sevenDayList");
        this.iconParent = this.elems.getElement("icons");
        this.btn_get = this.elems.getElement("btn_get");
        this.txtGet = this.elems.getText("txtGet");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        this.rideCtn = this.elems.getElement('rideCtn');
        this.petCtn = this.elems.getElement('petCtn');
        this.boxCtn = this.elems.getElement('boxCtn');
        this.diamondCtn = this.elems.getElement('diamondCtn');
        this.imageCtn = this.elems.getElement('imageCtn');
        this.roots.push(this.rideCtn, this.petCtn, this.boxCtn, this.diamondCtn, this.imageCtn);

        this.rewardList = this.elems.getUIList("rewardList");
        this.imgText = this.elems.getImage("imgText");
        this.imgAtlas = this.elems.getElement("imgAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.tabDays = this.elems.getToggleGroup("tabDays");
        //天数tab
        for (let i = 0; i < this.MAX_CARD_NUM; i++) {
            let dayTipMark = ElemFinder.findObject(this.tabDays.gameObject, i + "/tipMark");
            let obj = ElemFinder.findObject(this.tabDays.gameObject, i.toString());
            this.tabDayObjs.push(obj);
            this.dayTipMarks.push(dayTipMark);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btn_get, this.onBtnGet);
        this.addToggleGroupListener(this.tabDays, this.onTabDayClick);
    }

    open(selectDay: number) {
        this.selectDay = selectDay;
        super.open();
    }


    protected onOpen() {
        if (this.selectDay != 0) {
            let afterOpenDay = G.SyncTime.getDateAfterStartServer();
            this.selectDay = afterOpenDay;
            // 最大登陆时间
            if (this.selectDay > 7) {
                this.selectDay = 7;
            }
        }
        for (let i = 0; i < 7; i++) {
            this.tabDays.GetToggle(i).isOn = false;
        }
        this.getListDayData();
        //let data = this.listDayData[this.selectDay - 1];
        this.onTabDayClick(this.selectDay - 1);
        this.updateDaysTipMark();
    }

    protected onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    private onTabDayClick(index: number) {
        this.tabDays.GetToggle(index).isOn = true;
        this.selectDay = index + 1;
        //this.getListDayData();
        this.updateSevenDayLoginPanel();
    }

    private updateSevenDayLoginPanel() {
        this.currentItemVo = this.listDayData[this.selectDay - 1];
        this.updateRewardList();
        this.refreshButtonState();

        if (!this.currentItemVo)
            return;

        //第二天，模型改成宁荣荣
// 第七天，模型改成1540074，是个坐骑模型(玄翼天马)
// 第六天，模型改成个宝石，随便从VIP9-12中展示模型换就行
        if (this.selectDay == 2) {
            G.ResourceMgr.loadModel(this.petCtn, UnitCtrlType.pet, '200007', this.sortingOrder);
            this.showTheRoot(this.petCtn);
        } else if (this.selectDay == 3) {
            let heroData = G.DataMgr.heroData;
            //时装显示
            this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
            //化妆舞会时装
            this.m_avatarList.m_uiDressImageID = heroData.profession == 1 ?  11412:11411;
            this.imageCtn.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            if (null == this.roleAvatar) {
                this.roleAvatar = new UIRoleAvatar(this.imageCtn.transform, this.imageCtn.transform);
                //this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
                this.roleAvatar.setSortingOrder(this.sortingOrder);
            }
            this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender, true);
            this.showTheRoot(this.imageCtn);
        }
        else if (this.selectDay == 7) {
            G.ResourceMgr.loadModel(this.rideCtn, UnitCtrlType.ride, '1540074', this.sortingOrder);
            this.showTheRoot(this.rideCtn);
        } else if(this.selectDay == 6) {
            this.showTheRoot(this.diamondCtn);
        } else {
            this.showTheRoot(this.boxCtn);
        }
        this.imgText.sprite = this.imgAtlas.Get(this.selectDay.toString());
    }

    private showTheRoot(ctn: UnityEngine.GameObject) {
        for(let i = 0, len = this.roots.length; i < len; i++) {
            let tmpCtn = this.roots[i];
            tmpCtn.SetActive(tmpCtn == ctn);
        }
    }

    /**领取七天登陆奖励成功*/
    onGetSevenDaySignGift(): void {
        this.updateView();
    }

    private updateDaysTipMark() {
        for (let i = 0; i < this.MAX_CARD_NUM; i++) {
            let status: number = G.DataMgr.activityData.kaifuSignData.getStatusByIndex(i);
            this.dayTipMarks[i].SetActive(status == KaifuSignItemData.CAN_DRAW);
        }
    }

    updateView(): void {
        this.refreshButtonState();
    }

    private updateRewardList(): void {

        if (!this.currentItemVo) {
            return;
        }
        let m_astGiftThing: GameConfig.GiftItemInfo[] = this.currentItemVo.giftBagConfig.m_astGiftThing;
        let len: number = m_astGiftThing.length;
        this.rewardList.Count = len;

        for (let i = 0; i < this.rewardList.Count; i++) {
            let item = this.rewardList.GetItem(i);
            if (this.sevenDayRewardItems[i] == null) {
                this.sevenDayRewardItems[i] = new SevenDayRewardItem();
                this.sevenDayRewardItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.sevenDayRewardItems[i].update(m_astGiftThing[i]);
        }
    }


    /**
    * 刷新按钮状态
    *
    */
    private refreshButtonState(): void {
        this.updateDaysTipMark();
        let status: number = G.DataMgr.activityData.kaifuSignData.getStatusByIndex(this.selectDay - 1);
        if (status == KaifuSignItemData.DRAWN) {
            UIUtils.setButtonClickAble(this.btn_get, false);
            this.txtGet.text = "已领取"
        } else if (status == KaifuSignItemData.CANNOT_DRAW) {
            UIUtils.setButtonClickAble(this.btn_get, false);
            this.txtGet.text = "未达成"
        } else if (status == KaifuSignItemData.CAN_DRAW) {
            UIUtils.setButtonClickAble(this.btn_get, true);
            this.txtGet.text = "可领取";
        }
    }


    /**领取奖励*/
    private onBtnGet(): void {
        if (this.currentItemVo != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_OPENSIGN, Macros.ACTIVITY_OPENSVR_SIGN_GET, this.currentItemVo.giftBagConfig.m_iParameter));
        }
    }


    /**请求七天数据*/
    private requestData(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_OPENSIGN, Macros.ACTIVITY_OPENSVR_SIGN_LIST));
    }



    private getListDayData(): SevenDaySignItemData[] {
        this.listDayData = new Array<SevenDaySignItemData>();
        let listDataByType: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_OPEN_SRV_SIGN);
        let sevenDayArr: GameConfig.SevenDayCfgM[] = G.DataMgr.activityData.sevenDayArr();
        for (let i = 0; i < this.MAX_CARD_NUM; i++) {
            let itemVo: SevenDaySignItemData = new SevenDaySignItemData()
            itemVo.day = i;
            let giftBagConfig: GameConfig.GiftBagConfigM = listDataByType[i];
            let sevenDayConfig: GameConfig.SevenDayCfgM = sevenDayArr[i];
            itemVo.giftBagConfig = giftBagConfig;
            itemVo.modeId = sevenDayConfig.m_iModeID;
            this.listDayData.push(itemVo);
        }
        return this.listDayData;
    }






}