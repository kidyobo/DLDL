import { Constants } from 'System/constants/Constants';
import { EnumEffectRule, GameIDType, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from "System/constants/KeyWord";
import { OtherPlayerData } from 'System/data/OtherPlayerData';
import { HeroData } from 'System/data/RoleData';
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { Global as G } from "System/global";
import { HeroAttItemData } from 'System/hero/HeroAttItemData';
import { HeroRule } from 'System/hero/HeroRule';
import { RoleEquipList } from "System/hero/RoleEquipList";
import { HeroView } from 'System/hero/view/HeroView';
import { JuYuanView } from 'System/juyuan/JuYuanView';
import { LingBaoAlertView } from 'System/lingbaoalert/LingBaoAlertView';
import { Macros } from 'System/protocol/Macros';
import { TipFrom } from 'System/tip/view/TipsView';
import { FixedList } from 'System/uilib/FixedList';
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { GameObjectGetSet } from '../../uilib/CommonForm';

class PropertyItem {
    private readonly zeroProperty: string = "0";

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
    }

    update(data: HeroAttItemData) {
        let propColor: string = "";
        let valueStr: string;
        let name: string = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.propId);
        if (data.propId == KeyWord.EQUIP_PROP_ATTACK_PRESS || data.propId == KeyWord.EQUIP_PROP_DEFENSE_PRESS) {
            this.txtName.text = name;
            this.txtValue.text = data.addVal > 0 ? uts.format("{0}%", (data.addVal / 100).toFixed(2)) : this.zeroProperty;
            return;
        }
        if (name.length == 2) {
            this.txtName.text = uts.format('{0}{1}', name.charAt(0), name.charAt(1));
            valueStr = data.addVal > 0 ? data.addVal.toString() : this.zeroProperty;
            this.txtValue.text = valueStr;
        }
        else if (name.length > 2) {
            this.txtName.text = uts.format('{0}', name);
            valueStr = data.addVal > 0 ? data.addVal.toString() : this.zeroProperty;
            this.txtValue.text = valueStr;
        }
        else {
            this.txtName.text = uts.format('{0}', name);
            valueStr = data.addVal > 0 ? data.addVal + "%" : this.zeroProperty;
            this.txtValue.text = valueStr;
        }
    }
}


export class PropertyView extends TabSubForm {
    /**基础属性*/
    private readonly baseProsNum = 4;
    /**特殊属性*/
    private readonly specialProsNum = 12;

    /**角色模型*/
    private roleAvatar: UIRoleAvatar;

    private listDataEquip: RoleEquipList[];
    private m_attListData: HeroAttItemData[] = [];

    /**模型父物体*/
    private rolePosition: UnityEngine.Transform = null;
    //魂环模型
    private hunhuanRoot: UnityEngine.Transform = null;
    private readonly hunhuanNum = 9;
    private txtLv: UnityEngine.UI.Text = null;
    private txtName: UnityEngine.UI.Text;
    /**魂力等级*/
    // private txtHunliLevel: UnityEngine.UI.Text = null;
    /**战斗力*/
    //private txtFight: UnityEngine.UI.Text = null;
    /**宗门*/
    private txtGuild: UnityEngine.UI.Text = null;

    private baselist: List;
    private speciallist: List;
    /**装备栏所有装备的集合*/
    private equipList: FixedList = null;
    /**装备栏所有魂骨的集合*/
    private hunguList: FixedList = null;

    private btnLingBao: UnityEngine.GameObject;
    private imageWjh: UnityEngine.GameObject;
    private imageYgq: UnityEngine.GameObject;

    //private btnBianQiang: UnityEngine.GameObject;
    private btnJuYuan: UnityEngine.GameObject;
    private juYuanMark: UnityEngine.GameObject;
    private equipIcons: IconItem[] = [];
    private iconItems: IconItem[] = [];
    private materialItemicon: IconItem;
    private materialData: MaterialItemData = new MaterialItemData();
    private baseItems: PropertyItem[] = [];
    private specialItems: PropertyItem[] = [];
    private equipSlotIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private heroView: HeroView;
    private isEquipDirty = false;
    private isPropertiesDirty = false;
    private equipItemDatas: ThingItemData[] = [];
    static readonly Hungu_Index2Part: { [index: number]: number[] } = {};

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HEROPROPERTY);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.PropertyView;
    }
    get SelfForm(): UnityEngine.GameObject {
        return this.equipList.gameObject.transform.parent.gameObject;
    }
    protected initElements(): void {
        this.equipSlotIcon_Normal = this.elems.getElement("equipSlotIcon_Normal");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //基础信息
        this.txtName = this.elems.getText("txtName");
        this.txtLv = this.elems.getText('txtLv');
        // this.txtHunliLevel = this.elems.getText('txtRebirth');
        this.txtGuild = this.elems.getText('txtGuild');
        //this.txtFight = this.elems.getText('txtFight');

        this.imageWjh = this.elems.getElement("imagewjh");
        this.imageWjh.SetActive(false);
        this.imageYgq = this.elems.getElement('imageygq');
        this.imageYgq.SetActive(false);
        //装备和魂骨按钮
        // this.btnEquip = this.elems.getElement('btnEquip');
        // this.btnEquipSelect = ElemFinder.findObject(this.btnEquip, 'selected');
        //基础属性
        this.baselist = this.elems.getUIList("baselist");
        this.baselist.Count = this.baseProsNum;
        for (let i = 0; i < this.baseProsNum; i++) {
            let item = this.baselist.GetItem(i);
            this.baseItems[i] = new PropertyItem();
            this.baseItems[i].setComponents(item.gameObject);
        }

        //特殊属性
        this.speciallist = this.elems.getUIList("speciallist");
        this.speciallist.Count = this.specialProsNum;
        for (let i = 0; i < this.specialProsNum; i++) {
            let item = this.speciallist.GetItem(i);
            this.specialItems[i] = new PropertyItem();
            this.specialItems[i].setComponents(item.gameObject);
        }

        //装备
        this.listDataEquip = new Array<RoleEquipList>(ThingData.All_EQUIP_NUM + 1);
        for (let i = 0; i < ThingData.All_EQUIP_NUM + 1; i++) {
            this.listDataEquip[i] = new RoleEquipList();
            this.listDataEquip[i].containerID = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        }
        this.equipList = this.elems.getUIFixedList("equipList");
        this.hunguList = this.elems.getUIFixedList("hunguList");

        //初始装备icon
        for (let i = 0; i < ThingData.All_EQUIP_NUM + 1; i++) {
            let key = Constants.EquipParts[i];
            let item = this.equipList.GetItem(i).findObject("icon");
            if (this.iconItems[i] == null) {

                this.iconItems[i] = new IconItem();
                this.iconItems[i].effectRule = EnumEffectRule.none;
                this.iconItems[i].setUsualEquipSlotByPrefab(this.equipSlotIcon_Normal, item);
            }

            this.iconItems[i].closeEquipText();
            if (key == KeyWord.EQUIP_PARTCLASS_WING) {
                this.iconItems[i].setTipFrom(TipFrom.takeOff);
            } else {
                this.iconItems[i].setTipFrom(TipFrom.lucency);
            }

            this.iconItems[i].showBg = false;
            this.iconItems[i].needWuCaiColor = true;
            this.listDataEquip[i].iconItem = this.iconItems[i];
        }

        //人物旋转
        this.rolePosition = this.elems.getTransform("rolePosition");
        this.hunhuanRoot = this.elems.getTransform("hunhuanRoot");

        this.btnLingBao = this.elems.getElement("btnLingBao");

        //this.btnBianQiang = this.elems.getElement("btnBianQiang");
        this.btnJuYuan = this.elems.getElement("btnJuYuan");
        this.juYuanMark = this.elems.getElement('juYuanTipMark');
    }

    protected initListeners(): void {
        //this.addClickListener(this.btnBianQiang, this.onClickBianQiang);
        this.addClickListener(this.btnJuYuan, this.onClickJuYuan);
        this.addClickListener(this.btnLingBao, this.onClickLingBao);
        // this.addClickListener(this.btnEquip, this.onClickEquip);
    }


    protected onOpen() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(true);
        }
        this.onClickHunGu();
        //角色Avatar
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);

        }
        this.doUpdateProperties();
        this.addTimer('updateTimer', 500, 0, this.onUpdateTimer);
        this.addTimer('lateModel', 250, 1, this.lateSendMsg);

        // 神力按钮 
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JU_YUAN)) {
            this.btnJuYuan.SetActive(true);
            this.juYuanMark.SetActive(G.GuideMgr.tipMarkCtrl.juYuanTipMark.getJuYuanTip());
        } else {
            this.btnJuYuan.SetActive(false);
        }
        //time：每多少毫秒后执行，第一次等待time毫秒后执行
        //loop :1代表重复执行  0代表重复执行

        this.addTimer('idleDelay', 5000, 0, delegate(this, this.onIdleDelayTimer));

        this.updateEquip();
    }

    private onIdleDelayTimer(timer: Game.Timer) {
        if (this.roleAvatar) {
            if (this.roleAvatar.defaultAvatar.isPlaying("stand"))
                this.roleAvatar.defaultAvatar.playAnimation("show_idle", 0.2);
        }
    }

    private lateSendMsg() {
        this.onAvatarChange();
    }

    protected onClose() {
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    //private onClickBianQiang() {
    //    G.Uimgr.createForm<WybqView>(WybqView).open();
    //}

    private onClickJuYuan() {
        G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
    }
    private onClickHunGu() {
        this.hunguList.gameObject.SetActive(true);
        this.equipList.gameObject.SetActive(false);
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            let itemObj = this.hunguList.GetItem(i);
            let hunguData = this.equipItemDatas[i];
            if (this.equipIcons[i] == null) {
                this.equipIcons[i] = new IconItem();
                this.equipIcons[i].arrowType = ArrowType.wearRebirthEquip;
                this.equipIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, itemObj.findObject("icon"));
            }
            this.equipIcons[i].setTipFrom(TipFrom.lucency);
            if (hunguData == null) {
                if (G.DataMgr.thingData.isShowHunguArrowAtPanelNone(KeyWord.HUNGU_EQUIP_PARTCLASS_MIN + i))
                    this.equipIcons[i].openArrow();
            }
        }
        this.doUpdateHunGu();
    }
    private onClickLingBao() {
        if (G.DataMgr.otherPlayerData.isOtherPlayer) return;
        let itemData: ThingItemData = this.listDataEquip[KeyWord.EQUIP_PARTCLASS_LINGBAO - 100].thingData;
        if (itemData) {
            G.Uimgr.createForm<LingBaoAlertView>(LingBaoAlertView).open(itemData, itemData.config.m_iID);
        }
        else {
            let config: GameConfig.ThingConfigM = ThingData.getThingConfig(201501001);
            itemData = new ThingItemData();
            itemData.config = config;
            G.Uimgr.createForm<LingBaoAlertView>(LingBaoAlertView).open(itemData, config.m_iID);
        }
    }

    /**
     * 滑动屏幕人物旋转
     * @param x
     * @param y
     */
    public onDrag() {
        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        this.roleAvatar.m_bodyMesh.setRotation(0, -roatespeed * delta.x + this.roleAvatar.m_bodyMesh.rotationY, 0);
    }

    onHeroDataChange() {
        this.isPropertiesDirty = true;
    }

    private doUpdateProperties() {
        let pkVal: number = 0;
        let jobStr: string;
        let playerName: string;
        let rebirthTimes: number;
        let guildName: string;
        let profession: number = 0;
        let level: number = 0;
        let hunhuanId: number = 0;
        let hunliLevel: number = 0
        let otherPlayerData: OtherPlayerData = G.DataMgr.otherPlayerData;
        let fight: number = 0;
        if (G.DataMgr.otherPlayerData.isOtherPlayer) {
            let roleInfo: Protocol.RoleInfo = otherPlayerData.roleBaseInfo;
            hunhuanId = roleInfo.m_stAvatarList.m_uiHunHuanID;
            playerName = roleInfo.m_stBaseProfile.m_szNickName;
            //rebirthTimes = roleInfo.m_stAvatarList.m_ucHunLiLevel;
            jobStr = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, roleInfo.m_stBaseProfile.m_cProfession);
            guildName = otherPlayerData.guildInfo.m_szGuildName;
            pkVal = otherPlayerData.pkInfo.m_cPKVal;
            level = otherPlayerData.roleBaseInfo.m_stBaseProfile.m_usLevel;
            hunliLevel = roleInfo.m_stAvatarList.m_ucHunLiLevel;
            //this.btnBianQiang.SetActive(false);
            fight = otherPlayerData.otherFight;
        }
        else {
            let heroData: HeroData = G.DataMgr.heroData;
            playerName = heroData.name;
            //rebirthTimes = G.DataMgr.rebirthData.rebirthTimes;
            jobStr = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, heroData.profession);
            guildName = G.DataMgr.guildData.guildName;
            pkVal = heroData.pkValue;
            level = heroData.level;
            //this.btnBianQiang.SetActive(true);
            hunhuanId = G.DataMgr.hunliData.hunhuanId;
            hunliLevel = G.DataMgr.hunliData.level;
            fight = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        }
        if (hunhuanId > 0) {
            let config = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
            let url = config.m_iModelID.toString();
            G.ResourceMgr.loadModel(this.hunhuanRoot.gameObject, UnitCtrlType.reactive, uts.format("model/hunhuan/{0}/{1}.prefab", url, url), this.sortingOrder);
        }
        //基础信息
        let titleStr = "";
        if (hunliLevel > 0) {
            titleStr = G.DataMgr.hunliData.getHunLiConfigByLevel(hunliLevel, 1).m_szName;
            this.txtName.text = uts.format("{0}[{1}]", playerName, titleStr.replace("试炼", ""));
        } else {
            this.txtName.text = playerName;
        }
        // this.txtHunliLevel.text = titleStr.replace("试炼", "");
        this.txtLv.text = uts.format("{0}级", level);

        //this.txtFight.text = this.getAttributeValue(Macros.EUAI_FIGHT).toString();
        if (this.heroView != null) {
            //总战力
            this.heroView.setTxtFight(fight);
        }
        if (guildName == "" || guildName == null) {
            guildName = "未加入宗门";
        }
        this.txtGuild.text = guildName;

        this.m_attListData.length = 0;
        for (let macroId of HeroRule.HERO_PANEL_ATT_MACRO_ID_ARR) {
            let itemVo: HeroAttItemData = new HeroAttItemData();
            itemVo.macroId = macroId;
            itemVo.addVal = this.getAttributeValue(macroId);
            this.m_attListData.push(itemVo);
        }
        let cnt = HeroRule.HERO_PANEL_ATT_MACRO_ID_ARR.length;
        for (let i = 0; i < cnt; i++) {
            if (i < 4) {
                this.baseItems[i].update(this.m_attListData[i]);
            } else {
                this.specialItems[i - this.baseProsNum].update(this.m_attListData[i]);
            }
        }
    }

    /**
   * 更新装备UI显示
   */
    private updateEquipUI(equipList: RoleEquipList[]) {
        for (let i = 0; i < this.equipList.Count; i++) {
            this.iconItems[i].updateByThingItemData(equipList[i].thingData);
            this.iconItems[i].updateEquipIcon(GameIDType.ROLE_EQUIP, 0, i);
        }

        //判断灵宝是否已经过期
        let nowInSecond = Math.ceil(G.SyncTime.getCurrentTime() / 1000);
        let itemData: ThingItemData = this.listDataEquip[KeyWord.EQUIP_PARTCLASS_LINGBAO - 100].thingData;
        if (itemData) {
            let thingInfo = itemData.data
            if (thingInfo != null) {
                let dynamicInfo = thingInfo.m_stThingProperty;
                if (dynamicInfo.m_iPersistTime > 0) {
                    if (nowInSecond >= dynamicInfo.m_iPersistTime) {
                        this.imageYgq.SetActive(true);
                        this.imageWjh.SetActive(false);
                    } else {
                        this.imageYgq.SetActive(false);
                        this.imageWjh.SetActive(false);
                    }
                }
                else {
                    this.imageYgq.SetActive(false);
                    this.imageWjh.SetActive(false);
                }
            }
            else {
                this.imageYgq.SetActive(false);
                this.imageWjh.SetActive(true);
            }
        }
        else {
            this.imageYgq.SetActive(false);
            this.imageWjh.SetActive(true);
        }
    }

    /**获取单个属性值*/
    private getAttributeValue(type: number): number {

        if (G.DataMgr.otherPlayerData.isOtherPlayer) {
            return (G.DataMgr.otherPlayerData.attributeList.m_allValue[type]);
        }
        else {
            return (G.DataMgr.heroData.getProperty(type));
        }
    }

    onUpdateTimer(timer: Game.Timer) {
        if (this.isEquipDirty) {
            this.doUpdateEquip();
            this.isEquipDirty = false;
        }
        if (this.isPropertiesDirty) {
            this.doUpdateProperties();
            this.isPropertiesDirty = false;
        }
    }

    /**
    *
    * @param isOpen
    * @param updatePos 是否刷新位置，只更新强化信息的时候，此参数填false（注：因为m_iconCnt 不清零，调用这个函数，位置会累加上去。是不对的）
    *
    */
    updateEquip(): void {
        this.isEquipDirty = true;
    }

    private doUpdateEquip() {
        let equipObject: { [position: number]: ThingItemData };
        if (G.DataMgr.otherPlayerData.isOtherPlayer) {
            equipObject = G.DataMgr.otherPlayerData.equipData;
        }
        else {
            equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        }
        // 先重置所有格子，锁定
        for (let i = 0; i < ThingData.All_EQUIP_NUM + 1; i++) {
            this.listDataEquip[i].reset(); // reset之后可以显示一个锁，用于数据未初始化的情况
            this.listDataEquip[i].itemIndex = i;
        }
        let rawObj: ThingItemData;
        for (let i = 0; i < ThingData.All_EQUIP_NUM + 1; i++) {
            rawObj = equipObject[i];
            if (null != rawObj) {
                this.listDataEquip[i].thingData = rawObj;
                this.listDataEquip[i].thingData.containerID = Macros.CONTAINER_TYPE_ROLE_EQUIP;
            }
        }
        this.updateEquipUI(this.listDataEquip);
    }

    private doUpdateHunGu() {
        let hunguObject: { [position: number]: ThingItemData };
        if (G.DataMgr.otherPlayerData.isOtherPlayer) {
            hunguObject = G.DataMgr.otherPlayerData.hunguData;
        }
        else {
            hunguObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        }

        // 先重置所有格子，锁定
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            this.listDataEquip[i].reset(); // reset之后可以显示一个锁，用于数据未初始化的情况
            this.listDataEquip[i].itemIndex = i;
        }
        let rawObj: ThingItemData;
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            rawObj = hunguObject[i];
            if (null != rawObj) {
                this.listDataEquip[i].thingData = rawObj;
                this.listDataEquip[i].thingData.containerID = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
            }
        }
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            this.equipIcons[i].updateByThingItemData(this.listDataEquip[i].thingData);
            this.equipIcons[i].updateIcon();
        }
    }

    onAvatarChange(): void {
        if (G.DataMgr.otherPlayerData.isOtherPlayer) {
            let roleInfo: Protocol.RoleInfo = G.DataMgr.otherPlayerData.roleBaseInfo;
            this.roleAvatar.setAvataByList(roleInfo.m_stAvatarList, roleInfo.m_stBaseProfile.m_cProfession, roleInfo.m_stBaseProfile.m_cGender);
            //this.roleAvatar.m_bodyMesh.playAnimation('stand');
        }
        else {
            let heroData: HeroData = G.DataMgr.heroData;
            this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
            //this.roleAvatar.m_bodyMesh.playAnimation('stand');
        }
    }
}