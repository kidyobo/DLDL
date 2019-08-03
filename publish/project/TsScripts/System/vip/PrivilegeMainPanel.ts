import { FirstRechargeView } from 'System/activity/view/FirstRechargeView';
import { UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { DropPlanData } from 'System/data/DropPlanData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { PetAvatar } from 'System/unit/avatar/PetAvatar';
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar';
import { DataFormatter } from 'System/utils/DataFormatter';
import { VipTab, VipView } from 'System/vip/VipView';
import { ConfirmCheck, MessageBoxConst } from '../tip/TipManager';
import { GameObjectGetSet, TextGetSet } from '../uilib/CommonForm';
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { ElemFinder } from '../uilib/UiUtility';

export class PrivilegeMainPanel extends TabSubForm {
    private privilegeNode: GameObjectGetSet;
    private btnPrivileges: GameObjectGetSet[] = [];
    private buttonTipMarks: GameObjectGetSet[] = [];
    private dailys: GameObjectGetSet[] = [];
    private btnGetVIP: GameObjectGetSet;
    private txtButtonName: TextGetSet;
    private getTipMark: GameObjectGetSet;
    private buttonTip: GameObjectGetSet;
    private btnRule: GameObjectGetSet;
    private timeTip: GameObjectGetSet;
    private txtTime: TextGetSet;

    private awardList: List;
    private iconItems: IconItem[] = [];
    private normal_iconitem: UnityEngine.GameObject;

    private distance: number = 1500;
    private iconPositionY = -28;
    private iconTargetPositionX = -305;
    private tweenTime = 0.2;
    private iconPositionsX: number[] = [-277, 73, 423];
    private levels: number[] = [KeyWord.VIPPRI_1, KeyWord.VIPPRI_2, KeyWord.VIPPRI_3];
    private thingIds = [10404011, 10404021, 10404031];
    private isOpenSubPanel = false;
    private curSelecendVipLevel = -1;
    private isCanGetAward: boolean = false;
    private leftSecond: number = 0;

    constructor() {
        super(VipTab.ZunXiang);
    }

    protected resPath(): string {
        return UIPathData.PrivilegeMainView;
    }

    protected initElements() {
        for (let i = 0, con = this.levels.length; i < con; i++) {
            this.btnPrivileges[i] = new GameObjectGetSet(this.elems.getElement("btnPrivilege" + i.toString()));
            this.buttonTipMarks[i] = new GameObjectGetSet(ElemFinder.findObject(this.btnPrivileges[i].gameObject, "tipMark"));
            this.dailys[i] = new GameObjectGetSet(this.elems.getElement("daily" + i.toString()));
            this.modelRoots[i] = new GameObjectGetSet(this.elems.getElement("model" + i.toString()));
        }
        this.privilegeNode = new GameObjectGetSet(this.elems.getElement("privilegeNode"));
        this.btnGetVIP = new GameObjectGetSet(this.elems.getElement("btnGetVIP"));
        this.txtButtonName = new TextGetSet(this.elems.getText("txtButtonName"));
        this.getTipMark = new GameObjectGetSet(this.elems.getElement("getTipMark"));
        this.buttonTip = new GameObjectGetSet(this.elems.getElement("buttonTip"));
        this.awardList = this.elems.getUIList("awardList");
        this.normal_iconitem = this.elems.getElement("itemIcon_Normal");
        this.btnRule = new GameObjectGetSet(this.elems.getElement("btnRule"));
        this.timeTip = new GameObjectGetSet(this.elems.getElement("timeTip"));
        this.txtTime = new TextGetSet(this.elems.getText("txtTime"));

        //加载模型
        this.loadingModel();
    }

    protected initListeners() {
        super.initListeners();
        for (let i = 0, con = this.levels.length; i < con; i++) {
            this.addClickListener(this.btnPrivileges[i].gameObject, delegate(this, this.onclickPrivilege, i));
        }
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickCloseSubPanel);
        this.addClickListener(this.btnGetVIP.gameObject, this.onClickGetVip);
        this.addClickListener(this.btnRule.gameObject, this.onClickRule);
    }

    protected onOpen() {
        super.onOpen();
        this.onClickCloseSubPanel();
        this.refreshSubPanel();
    }

    protected onClose() {
        for (let i = 0; i < PrivilegeMainPanel.timers.length; i++) {
            let timer = PrivilegeMainPanel.timers[i];
            if (timer != null) {
                timer.Stop();
            }
        }
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        if (null != this.petAvatar) {
            this.petAvatar.destroy();
            this.petAvatar = null;
        }
    }

    private onclickPrivilege(index: number) {
        if (!this.isOpenSubPanel) {
            this.playOpenTween(index);
            this.openSubPanel(index);
        }
        else {
            this.onClickCloseSubPanel();
        }
    }

    private onClickCloseSubPanel() {
        for (let i = 0, con = this.levels.length; i < con; i++) {
            Tween.TweenPosition.Begin(this.btnPrivileges[i].gameObject, this.tweenTime, new UnityEngine.Vector3(this.iconPositionsX[i], this.iconPositionY, 0), false);
        }
        this.isOpenSubPanel = false;
        this.privilegeNode.SetActive(false);
        this.curSelecendVipLevel = -1;
    }

    private onClickGetVip() {
        if (this.isCanGetAward) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_GET_GIFT, Macros.VIP_MONTH_GET_TYPE_DAILY, this.curSelecendVipLevel));
        }
        else {
            let isHasJiHuoKa = G.DataMgr.thingData.getThingNum(this.thingIds[this.curSelecendVipLevel - 1]) > 0;
            if (isHasJiHuoKa) {
                let itemList = G.DataMgr.thingData.getBagItemById(this.thingIds[this.curSelecendVipLevel - 1], false, 1);
                if (itemList != null && itemList.length > 0) {
                    let itemData = itemList[0];
                    G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_LIST, 0));
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_GET_GIFT, Macros.VIP_MONTH_GET_TYPE_DAILY, this.curSelecendVipLevel));
                }
                return;
            }
            if (KeyWord.VIPPRI_1 == this.curSelecendVipLevel) {
                let vipview = G.Uimgr.getForm<VipView>(VipView);
                if (vipview != null && vipview.isOpened)
                    vipview.close();
                G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
            } else {
                let des = uts.format("是否确定消耗{0}钻石购买{1}", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MONTHBUY_MONEY, this.curSelecendVipLevel, KeyWord.VIPPRI_NONE), TextFieldUtil.getPrivilegeText(this.curSelecendVipLevel));
                G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', (status: MessageBoxConst) => {
                    if (status == MessageBoxConst.yes) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_BUY, this.curSelecendVipLevel));
                    }
                });
            }
        }
    }

    private onClickRule() {
        this.timeTip.SetActive(!this.timeTip.activeSelf);
    }

    private openSubPanel(index: number) {
        //第一次开启的标记（终身第一次）
        G.DataMgr.vipData.openVipPrivilege();
        this.isOpenSubPanel = true;
        this.privilegeNode.SetActive(true);
        this.curSelecendVipLevel = this.levels[index];
        for (let i = 0, con = this.levels.length; i < con; i++) {
            this.dailys[i].SetActive(i == index);
            this.modelRoots[i].SetActive(i == index);
        }
        this.refreshSubPanel();
    }

    private playOpenTween(index: number) {
        for (let i = 0, con = this.levels.length; i < con; i++) {
            if (index == i) {
                Tween.TweenPosition.Begin(this.btnPrivileges[i].gameObject, this.tweenTime / (3 - index), new UnityEngine.Vector3(this.iconTargetPositionX, this.iconPositionY, 0), false);
            }
            else {
                let dir = (i - index) / Math.abs(i - index);
                Tween.TweenPosition.Begin(this.btnPrivileges[i].gameObject, this.tweenTime, new UnityEngine.Vector3(this.iconPositionsX[i] + this.distance * dir, this.iconPositionY, 0), false);
            }
        }
    }


    public updateByBuyResp() {
        this.refreshSubPanel();
    }

    private refreshSubPanel() {
        //刷新红点
        for (let i = 0, con = this.levels.length; i < con; i++) {
            if (G.DataMgr.vipData.isFirstOpen()) {
                this.buttonTipMarks[i].SetActive(true);
            }
            else {
                this.buttonTipMarks[i].SetActive(G.DataMgr.vipData.isVipTipMarkForLevel(i + 1));
            }
        }
        //刷新按钮状态 提示状态
        this.isCanGetAward = false;
        this.btnGetVIP.SetActive(true);
        this.buttonTip.SetActive(false);
        this.getTipMark.SetActive(false);
        this.txtTime.text = '激活可拥有指定特权功能';
        let state = G.DataMgr.heroData.getPrivilegeState(this.curSelecendVipLevel);
        let hasGet = G.DataMgr.vipData.getVipDailyGiftHasGet(this.curSelecendVipLevel)
        this.leftSecond = state;
        if (state == -2) {
            //过期
            this.txtButtonName.text = uts.format("已过期");
        }
        else if (state == -1) {
            //未激活
            let thingNum = G.DataMgr.thingData.getThingNum(this.thingIds[this.curSelecendVipLevel - 1]);
            if (thingNum > 0) {
                //说明有激活卡
                this.txtButtonName.text = uts.format("点击激活");
                this.getTipMark.SetActive(true);
            } else {
                //没激活卡
                let name = "首充即送";
                if (this.curSelecendVipLevel != 1)
                    name = uts.format("{0}钻石购买", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MONTHBUY_MONEY, this.curSelecendVipLevel, KeyWord.VIPPRI_NONE));
                this.txtButtonName.text = name;
            }
        }
        else if (state >= 0) {
            //永久激活状态 已激活未过期
            let name = '已激活';
            if (hasGet == true) {
                name = '已领取';
                this.btnGetVIP.SetActive(false);
                this.buttonTip.SetActive(true);
            }
            else {
                name = "点击领取";
                this.getTipMark.SetActive(true);
                this.isCanGetAward = true;
            }
            this.txtButtonName.text = name;
            if (KeyWord.VIPPRI_1 == this.curSelecendVipLevel) {
                this.txtTime.text = '已激活白银VIP' + '\n' + '剩余时间:永久';
            }

            this.addTimer("vipTimer", 1000, 0, delegate(this, this.onTickTimer));
        }

        //刷新奖励
        let datas = G.DataMgr.vipData.getVipParaMaps(KeyWord.VIP_PARA_DAY_LOGIN_GIFT);
        let data: GameConfig.VIPParameterConfigM = null;
        for (let i = 0, count = datas.length; i < count; i++) {
            if (datas[i].m_ucPriType == this.curSelecendVipLevel) {
                data = datas[i];
                break;
            }
        }
        if (data != null) {
            //掉落方案数据
            let viplevel = G.DataMgr.heroData.curVipLevel;
            let config: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(data.m_aiValue[Math.max(0, viplevel - 1)]);
            if (config != null) {
                let count = config.m_astDropThing.length;
                this.awardList.Count = count;
                for (let i = 0; i < count; i++) {
                    if (this.iconItems[i] == null) {
                        let item = this.awardList.GetItem(i).transform.Find("icon");
                        this.iconItems[i] = new IconItem();
                        this.iconItems[i].setUsualIconByPrefab(this.normal_iconitem, item.gameObject);
                        this.iconItems[i].setTipFrom(TipFrom.normal);
                    }
                    this.iconItems[i].updateById(config.m_astDropThing[i].m_iDropID, config.m_astDropThing[i].m_uiDropNumber);
                    this.iconItems[i].updateIcon();
                }
            }
        }

        this.loadingModel();
    }

    private onTickTimer(timer: Game.Timer) {
        if (this.leftSecond <= 0) return;
        let curtime = G.SyncTime.getCurrentTime() / 1000;
        let time = this.leftSecond - curtime;
        // this.leftSecond -= timer.CallCountDelta;
        if (this.leftSecond == -2) {
            this.txtButtonName.text = '已过期';
        }
        else if (time > 0) {
            if (KeyWord.VIPPRI_2 == this.curSelecendVipLevel) {
                this.txtTime.text = '已激活黄金VIP' + '\n' + '剩余时间:\n' + DataFormatter.second2day(time);
            } else if (KeyWord.VIPPRI_3 == this.curSelecendVipLevel) {
                this.txtTime.text = '已激活钻石VIP' + '\n' + '剩余时间:\n' + DataFormatter.second2day(time);
            }
        }
    }

    private modelRoots: GameObjectGetSet[] = [];
    private readonly ModelTypes = [UnitCtrlType.chenghao, UnitCtrlType.ride, UnitCtrlType.hero];
    private ModelNames = ['1080', '540049', uts.format('{0}{1}{2}', 110, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender)];
    static timers: Game.Timer[] = [];
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;
    private petAvatar: PetAvatar;

    private loadingModel() {
        for (let i = 0, con = this.levels.length; i < con; i++) {
            let type = this.ModelTypes[i];
            if (type == UnitCtrlType.hero) {
                this.m_avatarList = uts.deepcopy(G.DataMgr.heroData.avatarList, this.m_avatarList, true);
                this.m_avatarList.m_uiDressImageID = Number(this.ModelNames[i]);
                if (this.roleAvatar != null) {
                    this.roleAvatar.destroy();
                }
                let t = this.modelRoots[i].transform;
                this.roleAvatar = new UIRoleAvatar(t, t);
                this.roleAvatar.hasWing = true;
                this.roleAvatar.setAvataByList(this.m_avatarList, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
                this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
                this.roleAvatar.setSortingOrder(this.sortingOrder);
                this.setModlePosTransform(360, -234, 0, 0, 180, 0, 70, i);
                return;
            } else if (type == UnitCtrlType.pet) {
                if (this.petAvatar == null) {
                    let t = this.modelRoots[i].transform;
                    this.petAvatar = new PetAvatar(t, t);
                    this.petAvatar.setSortingOrder(this.sortingOrder);
                }
                this.petAvatar.onLoadBodyCallbackOnce = delegate(this, this.onLoadPlayAnim, this.ModelNames[i]);
                this.setModlePosTransform(360, -234, 0, 0, 180, 0, 70, i);
                this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, this.ModelNames[i], true, false);
            } else if (type == UnitCtrlType.ride) {
                this.setModlePosTransform(358, -207, 0, 0, 135, 0, 50, i);
                G.ResourceMgr.loadModel(this.modelRoots[i].gameObject, type, this.ModelNames[i], this.sortingOrder);
            }
            else if (type == UnitCtrlType.chenghao) {
                this.setModlePosTransform(350, -150, 0, 0, 0, 0, 2, i);
                G.ResourceMgr.loadModel(this.modelRoots[i].gameObject, type, this.ModelNames[i], this.sortingOrder);
            }
        }
    }

    private onLoadPlayAnim(model: string) {
        if (model == "200009" || model == "200012") {
            this.petAvatar.defaultAvatar.playAnimation("show");
        }
        else {
            this.petAvatar.defaultAvatar.playAnimation("show", 0.5);
        }
    }

    /**设置不同模型显示位置的大小,角度等*/
    private setModlePosTransform(posX: number, posY: number, posZ: number, rotateX: number, rotateY: number, rotateZ: number, scale: number, index: number) {
        let pos = this.modelRoots[index].gameObject.GetComponent(UnityEngine.Transform.GetType()) as UnityEngine.Transform;
        pos.localPosition = new UnityEngine.Vector3(posX, posY, posZ);
        pos.rotation = UnityEngine.Quaternion.Euler(rotateX, rotateY, rotateZ);
        pos.localScale = new UnityEngine.Vector3(scale, scale, scale);
    }
}