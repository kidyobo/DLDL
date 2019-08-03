import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ThingData } from 'System/data/thing/ThingData'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { VipView, VipTab } from 'System/vip/VipView'
import { UnitCtrlType, GameIDType, EnumProductID } from 'System/constants/GameEnum'
import { EnumGuide } from 'System/constants/GameEnum'
import { ElemFinder } from "../uilib/UiUtility";
import { List } from "../uilib/List";
import { ProtocolUtil } from "../protocol/ProtocolUtil";
import { Macros } from "../protocol/Macros";
import { TextFieldUtil } from "../utils/TextFieldUtil";

export enum TeQuanBuyPanelType {
    HuangJin = 0,
    ZuanShi = 1,
}


export class BigSkillShowView extends CommonForm {

    private huangjin_Panel: UnityEngine.GameObject;
    private zuanShi_Panel: UnityEngine.GameObject;
    private openPanelType: number = -1;
    private modelRoot: UnityEngine.GameObject;
    private btn_Buy: UnityEngine.GameObject;
    private txtButtonName: UnityEngine.UI.Text;
    private rolePosition: UnityEngine.GameObject;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;

    private readonly MODULE_ID_HUANGJIN = "540049";
    private readonly MODULE_ID_ZUANSHI = "200009";

    private modelFashionMan: UnityEngine.GameObject;
    private modelFashionWoman: UnityEngine.GameObject;



    constructor() {
        super(0);
    }

    open(type: number = -1) {
        this.openPanelType = type;
        this.checkPanel();
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.BigSkillShowView;
    }

    protected initElements() {
        this.modelRoot = this.elems.getElement("skillModelRoot");
        this.btn_Buy = this.elems.getElement("btn_Buy");
        this.txtButtonName = ElemFinder.findText(this.btn_Buy, "Text");
        this.rolePosition = this.elems.getElement("roleroot");
        this.huangjin_Panel = this.elems.getElement('huangjin');
        this.zuanShi_Panel = this.elems.getElement('zuanshi');

        this.modelFashionMan = this.elems.getElement('modelFashionMan');
        this.modelFashionWoman = this.elems.getElement('modelFashionWoman');

    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btn_return"), this.close);
        this.addClickListener(this.btn_Buy, this.onClickBtnBuy);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        if (this.openPanelType == TeQuanBuyPanelType.HuangJin) {
            //黄金面板
            this.huangjin_Panel.SetActive(true);
            this.zuanShi_Panel.SetActive(false);
            let name = uts.format("{0}钻石购买", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MONTHBUY_MONEY, KeyWord.CHARGE_GIFT_HJTQ + 1, KeyWord.VIPPRI_NONE));
            this.txtButtonName.text = name;
            G.ResourceMgr.loadModel(this.rolePosition, UnitCtrlType.ride, this.MODULE_ID_HUANGJIN, this.sortingOrder);
            //换成摩托了...
            //加载太慢，直接放里边了，改动的时候要注意...
            //G.ResourceMgr.loadModel(this.rolePosition, UnitCtrlType.ride, this.MODULE_ID_HUANGJIN, this.sortingOrder);
            //Game.Tools.SetGameObjectLocalRotation(this.rolePosition, 0, 135, 0);
            //Game.Tools.SetGameObjectLocalScale(this.rolePosition, 50, 50, 50);
            //Game.Tools.SetGameObjectLocalPosition(this.rolePosition, 0, 20, -400);

            //let heroData = G.DataMgr.heroData;
            //if (heroData.profession == KeyWord.PROFTYPE_WARRIOR) {
            //    G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.other, "effect/skill/dazhaoShow_Dao.prefab", this.sortingOrder);
            //} else {
            //    G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.other, "effect/skill/dazhaoShow_Jian.prefab", this.sortingOrder);
            //}
            //if (this.roleAvatar == null) {
            //    this.rolePosition.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            //    this.roleAvatar = new UIRoleAvatar(this.rolePosition.transform, this.rolePosition.transform);
            //    this.roleAvatar.hasWing = false;
            //    this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            //    this.roleAvatar.setSortingOrder(this.sortingOrder);
            //}
            // 这里不会对avatarlist进行修改，所以不需要deepcopy
            //this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
        }
        else if (this.openPanelType == TeQuanBuyPanelType.ZuanShi) {
            //钻石面板
            this.huangjin_Panel.SetActive(false);
            this.zuanShi_Panel.SetActive(true);
            let name = uts.format("{0}钻石购买", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MONTHBUY_MONEY, KeyWord.CHARGE_GIFT_ZSTQ + 1, KeyWord.VIPPRI_NONE));
            this.txtButtonName.text = name;
            this.modelFashionMan.SetActive(G.DataMgr.heroData.profession == 2);
            this.modelFashionWoman.SetActive(G.DataMgr.heroData.profession == 1);

            //换成 弗兰德 了
            //加载太慢，直接放里边了，改动的时候要注意...
            //G.ResourceMgr.loadModel(this.rolePosition, UnitCtrlType.pet, this.MODULE_ID_ZUANSHI, this.sortingOrder);
            //Game.Tools.SetGameObjectLocalRotation(this.rolePosition, 0, 180, 0);
            //Game.Tools.SetGameObjectLocalScale(this.rolePosition, 80, 80, 80);
            //Game.Tools.SetGameObjectLocalPosition(this.rolePosition, 0, -43, -400);

            //let modelNames = uts.format('{0}{1}{2}', 109, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
            //this.m_avatarList = uts.deepcopy(G.DataMgr.heroData.avatarList, this.m_avatarList, true);
            //this.m_avatarList.m_uiDressImageID = Number(modelNames);
            //if (this.roleAvatar != null) {
            //    this.roleAvatar.destroy();
            //}
            //this.roleAvatar = new UIRoleAvatar(this.rolePosition.transform, this.rolePosition.transform);
            //this.roleAvatar.hasWing = false;
            //this.roleAvatar.setAvataByList(this.m_avatarList, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
            //this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            //this.roleAvatar.setSortingOrder(this.sortingOrder);
        }

        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);
    }

    private checkPanel() {
        if (this.openPanelType == -1) {
            let heroData = G.DataMgr.heroData;
            let stageHuangJin = heroData.getPrivilegeState(KeyWord.VIPPRI_2);
            let stageZuanShi = heroData.getPrivilegeState(KeyWord.VIPPRI_3);
            if (stageHuangJin < 0) {
                this.openPanelType = TeQuanBuyPanelType.HuangJin;
            }
            else if (stageHuangJin >= 0 && stageZuanShi < 0) {
                this.openPanelType = TeQuanBuyPanelType.ZuanShi;
            }
        }
    }

    protected onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        G.ViewCacher.mainView.setViewEnable(true);
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
    }

    private onClickBtnBuy() {
        let level = 0;
        if (this.openPanelType == TeQuanBuyPanelType.HuangJin) {
            level = KeyWord.CHARGE_GIFT_HJTQ;
        }
        else if (this.openPanelType == TeQuanBuyPanelType.ZuanShi) {
            level = KeyWord.CHARGE_GIFT_ZSTQ;
        }

        let des = uts.format("是否确定消耗{0}钻石购买{1}", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MONTHBUY_MONEY, level + 1, KeyWord.VIPPRI_NONE), TextFieldUtil.getPrivilegeText(level + 1));
        G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', (status: MessageBoxConst) => {
            if (status == MessageBoxConst.yes) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_BUY, level + 1));
            }
        });


        // let payId: number = 0;
        // if (this.openPanelType == TeQuanBuyPanelType.HuangJin) {
        //     payId = EnumProductID.GoldPrivilege;
        // }
        // else if (this.openPanelType == TeQuanBuyPanelType.ZuanShi) {
        //     payId = EnumProductID.DiamondPrivilege;
        // }
        // G.ChannelSDK.pay(payId);
        // uts.log("payId:= " + payId);
    }


}