import { UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { DropPlanData } from 'System/data/DropPlanData';
import { PetData } from 'System/data/pet/PetData';
import { UIPathData } from 'System/data/UIPathData';
import { VipData } from 'System/data/VipData';
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar';
import { VipTab, VipView } from 'System/vip/VipView';
import { GameObjectGetSet, TextGetSet } from '../uilib/CommonForm';
import { List, ListItem } from '../uilib/List';
import { Color } from '../utils/ColorUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { PayView } from '../pay/PayView';

class VipRewardItem {
    private vipLevel: number;
    private sortingOrder: number;

    private txtTitleName: TextGetSet;
    private modelRoot: UnityEngine.GameObject;
    private imgTitleIcon: UnityEngine.UI.Image;
    private btnEverydayGift: GameObjectGetSet;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    private btnLifeGift: GameObjectGetSet;
    private txtButtonName: TextGetSet;
    private buttonTipMark: GameObjectGetSet;
    private noActive: GameObjectGetSet;
    private itemIcon_Normal: UnityEngine.GameObject;

    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;

    onClickLifeGirtCall: (level: number) => void;
    onClickEverydayGirtCall: (level: number) => void;

    setComponents(go: UnityEngine.GameObject, itemicon: UnityEngine.GameObject, level: number) {
        this.vipLevel = level;
        this.itemIcon_Normal = itemicon;

        this.txtTitleName = new TextGetSet(ElemFinder.findText(go, "txtTitleName"));
        this.modelRoot = ElemFinder.findObject(go, "modelRoot");
        this.imgTitleIcon = ElemFinder.findImage(go, "imgTitleIcon");
        this.btnEverydayGift = new GameObjectGetSet(ElemFinder.findObject(go, "btnEverydayGift"));
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.btnLifeGift = new GameObjectGetSet(ElemFinder.findObject(go, "btnLifeGift"));
        this.txtButtonName = new TextGetSet(ElemFinder.findText(go, "btnLifeGift/txtButtonName"));
        this.buttonTipMark = new GameObjectGetSet(ElemFinder.findObject(go, "btnLifeGift/tipMark"));
        this.noActive = new GameObjectGetSet(ElemFinder.findObject(go, "noActive"));

        Game.UIClickListener.Get(this.btnLifeGift.gameObject).onClick = delegate(this, this.onClickLifeGirt);
        Game.UIClickListener.Get(this.btnEverydayGift.gameObject).onClick = delegate(this, this.onClickEverydayGirt);
    }

    private onClickLifeGirt() {
        if (this.onClickLifeGirtCall != null)
            this.onClickLifeGirtCall(this.vipLevel);
    }

    private onClickEverydayGirt() {
        if (this.onClickEverydayGirtCall != null)
            this.onClickEverydayGirtCall(this.vipLevel);
    }

    refreshItem(level: number, sprite: UnityEngine.Sprite, sortingOrder: number) {
        this.vipLevel = level;
        this.sortingOrder = sortingOrder;
        //标题
        this.txtTitleName.text = uts.format("VIP{0}专属礼包", this.vipLevel);
        //达成礼包        
        let dropID = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_LIFELONG_GIFT_REWARD_ID, this.vipLevel, KeyWord.VIPPRI_NONE);
        let cnt = 0;
        if (dropID > 0) {
            // 有礼包
            let config: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropID);
            cnt = config.m_ucDropThingNumber;
            this.rewardList.Count = cnt;
            let dropThing: GameConfig.DropThingM;
            for (let i = 0; i < cnt; i++) {
                dropThing = config.m_astDropThing[i];
                if (defines.has('_DEBUG')) {
                    uts.assert(dropThing.m_iDropID > 0, '艹，起码填点东西：' + config.m_uiDropID);
                }
                if (this.iconItems[i] == null) {
                    this.iconItems[i] = new IconItem();
                    this.iconItems[i].setUsualIconByPrefab(this.itemIcon_Normal, this.rewardList.GetItem(i).gameObject);
                    this.iconItems[i].setTipFrom(TipFrom.normal);
                }
                this.iconItems[i].updateByDropThingCfg(dropThing);
                this.iconItems[i].updateIcon();
            }
        }

        //终生礼包领取状态
        let status: number = G.DataMgr.vipData.getAchiGiftStatus(this.vipLevel);
        this.buttonTipMark.SetActive(false);
        if (VipData.ACHI_GIFT_STATUS_CAN_GET == status) {
            this.txtButtonName.text = "领取奖励";
            this.buttonTipMark.SetActive(true);
        }
        else if (VipData.ACHI_GIFT_STATUS_GOT == status) {
            this.txtButtonName.text = "已领取";
        }
        this.btnLifeGift.SetActive(G.DataMgr.heroData.curVipLevel >= this.vipLevel);
        this.noActive.SetActive(G.DataMgr.heroData.curVipLevel < this.vipLevel);

        //每日礼包状态
        if (G.DataMgr.heroData.curVipLevel == this.vipLevel) {
            this.btnEverydayGift.SetActive(true);
            if (G.DataMgr.vipData.listInfo != null) {
                let noneGet = ElemFinder.findObject(this.btnEverydayGift.gameObject, "noneGet");
                let alreadyGet = ElemFinder.findObject(this.btnEverydayGift.gameObject, "alreadyGet");
                if (!G.DataMgr.vipData.hasGetVipDailyGift) {
                    // 未领取(可以领)
                    noneGet.SetActive(true);
                    alreadyGet.SetActive(false);
                }
                else {
                    //已领取
                    noneGet.SetActive(false);
                    alreadyGet.SetActive(true);
                }
            }
        }
        else {
            this.btnEverydayGift.SetActive(false);
        }

        //改成加载图片了
        // this.refresh3dModel();
        this.imgTitleIcon.sprite = sprite;
    }

    /**更新3D模型*/
    private refresh3dModel(): void {
        let imageConfig: GameConfig.ZhuFuImageConfigM;
        let vipAdCfg = G.DataMgr.vipData.getAdConfigByLv(this.vipLevel);
        let showType: number = vipAdCfg.m_iModelType;
        if (showType > 0) {
            let modelId: number = vipAdCfg.m_iModeID;
            switch (showType) {
                case KeyWord.OTHER_FUNCTION_WHJH:
                    //神器
                    imageConfig = G.DataMgr.zhufuData.getImageConfig(G.DataMgr.zhufuData.getImageLevelID(modelId, 1));
                    let id: string = '';
                    if (imageConfig != null) {
                        id = uts.format('{0}_{1}', imageConfig.m_iModelID, G.DataMgr.heroData.profession);
                        this.setModlePosTransform(0, 50, -300, -130, 90, 0, 50);
                        this.showModle(UnitCtrlType.weapon, id);
                    } else {
                        this.setModlePosTransform(0, -5, -300, 90, 0, 0, 50);
                        this.showModle(UnitCtrlType.weapon, modelId.toString());
                    }
                    break;
                case KeyWord.BAR_FUNCTION_BEAUTY:
                    //伍缘
                    let petConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(modelId, 1);
                    if (petConfig != null) {
                        this.setModlePosTransform(150, -190, -200, 0, 180, 0, 50);
                        this.showModle(UnitCtrlType.pet, petConfig.m_iModelID.toString());
                    }
                    break;
                case KeyWord.OTHER_FUNCTION_YYQH:
                    //翅膀
                    imageConfig = G.DataMgr.zhufuData.getImageConfig(G.DataMgr.zhufuData.getImageLevelID(modelId, 1));
                    if (imageConfig != null) {
                        this.setModlePosTransform(0, -50, -300, -180, 0, 180, 50);
                        this.showModle(UnitCtrlType.wing, imageConfig.m_iModelID.toString());
                    }
                    break;
                case KeyWord.OTHER_FUNCTION_ZQJH:
                    //坐骑 
                    imageConfig = G.DataMgr.zhufuData.getImageConfig(G.DataMgr.zhufuData.getImageLevelID(modelId, 1));
                    if (imageConfig != null) {
                        this.setModlePosTransform(150, -97.2, -220, 0, -125, 0, 35);
                        this.showModle(UnitCtrlType.ride, imageConfig.m_iModelID.toString());
                    }
                    break;
                case KeyWord.OTHER_FUNCTION_FZJH:
                    //圣印
                    imageConfig = G.DataMgr.zhufuData.getImageConfig(G.DataMgr.zhufuData.getImageLevelID(modelId, 1));
                    if (imageConfig != null) {
                        this.setModlePosTransform(0, -32, -100, 90, 0, 0, 50);
                        this.showModle(UnitCtrlType.zhenfa, imageConfig.m_iModelID.toString());
                    }
                    break;
                case KeyWord.BAR_FUNCTION_ANQI:
                    //宝物
                    this.setModlePosTransform(0, -50, -300, 0, 0, 0, 50);
                    this.showModle(UnitCtrlType.shengqi, modelId.toString());
                    break;
                case KeyWord.OTHER_FUNCTION_DRESS:
                    //时装
                    this.m_avatarList = uts.deepcopy(G.DataMgr.heroData.avatarList, this.m_avatarList, true);
                    this.m_avatarList.m_uiDressImageID = modelId;
                    if (this.roleAvatar != null) {
                        this.roleAvatar.destroy();
                    }
                    this.roleAvatar = new UIRoleAvatar(this.modelRoot.transform, this.modelRoot.transform);
                    this.roleAvatar.hasWing = false;
                    this.roleAvatar.setAvataByList(this.m_avatarList, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
                    this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
                    this.roleAvatar.setSortingOrder(this.sortingOrder);
                    break;
                default:
            }
        }
        else {
            //加载(vip1,2,3,4模型)
            let modleId = this.vipLevel.toString();
            this.setModlePosTransform(160, -140, -300, 0, 180, 0, 50);
            this.showModle(UnitCtrlType.other, uts.format('model/misc/{0}.prefab', modleId));
        }
    }

    /**设置不同模型显示位置的大小,角度等*/
    private setModlePosTransform(posX: number, posY: number, posZ: number, rotateX: number, rotateY: number, rotateZ: number, scale: number) {
        let pos = this.modelRoot.GetComponent(UnityEngine.Transform.GetType()) as UnityEngine.Transform;
        pos.transform.localPosition = new UnityEngine.Vector3(posX, posY, posZ);
        pos.transform.rotation = UnityEngine.Quaternion.Euler(rotateX, rotateY, rotateZ);
        pos.transform.localScale = new UnityEngine.Vector3(scale, scale, scale);
    }

    /**模型显示*/
    private showModle(unitType: number, modleId: string) {
        G.ResourceMgr.loadModel(this.modelRoot, unitType, modleId, this.sortingOrder, true);
    }

    private onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }
}


/**vip奖励面板*/
export class VipRewardPanel extends TabSubForm {
    private itemIcon_Normal: UnityEngine.GameObject;
    //vip等级相关
    private imgVipLevel: UnityEngine.UI.Image;
    private txtVipTip: TextGetSet;
    private imgSlider: UnityEngine.UI.Image;
    private btnVipUpgrade: UnityEngine.GameObject;
    private altasVipLevel: Game.UGUIAltas;
    private altasIcon: Game.UGUIAltas;

    //奖励相关
    private rewardNode: List;
    private rewardItems: VipRewardItem[] = [];

    private openLevel: number;
    private altasPrefixName: string = "VIP_Grade_";
    private altasArticleName: string = "VIP_article_";

    constructor() {
        super(VipTab.Reward);
    }

    protected resPath(): string {
        return UIPathData.VipRewardPanel;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        this.imgVipLevel = this.elems.getImage("imgVipLevel");
        this.txtVipTip = new TextGetSet(this.elems.getText("txtVipTip"));
        this.imgSlider = this.elems.getImage("imgSlider");
        this.btnVipUpgrade = this.elems.getElement("btnVipUpgrade");
        this.altasVipLevel = this.elems.getUGUIAtals("altasVipLevel");
        this.altasIcon = this.elems.getUGUIAtals("altasIcon");

        this.rewardNode = this.elems.getUIList("rewardNode");
        this.rewardNode.Count = Macros.MAX_VIP_LEVEL;
        // for (let i = 0; i < Macros.MAX_VIP_LEVEL - 1; i++) {
        //     let item = new VipRewardItem();
        //     item.setComponents(this.rewardNode.GetItem(i).gameObject, this.itemIcon_Normal, i + 1, this.sortingOrder);
        //     item.onClickEverydayGirtCall = delegate(this, this.onClickEverydayGirt);
        //     item.onClickLifeGirtCall = delegate(this, this.onClickLifeGirt);
        //     this.rewardItems[i] = item;
        // }
        this.rewardNode.onVirtualItemChange = delegate(this, this.OnRewardListChange);
    }

    protected initListeners() {
        this.addClickListener(this.btnVipUpgrade, this.onClickVipUpgrade);
    }

    open(openLevel: number = -1) {
        this.openLevel = openLevel;
        super.open();
    }

    protected onOpen() {
        if (this.openLevel >= 0) {
            //存在指定打开页签
            this.rewardNode.ScrollByAxialRow(this.openLevel - 1);
            this.openLevel = -1;
        } else {
            this.onFindAchiVip();
        }
        this.refreshPanel();
    }

    protected onClose() {

    }


    private onClickVipUpgrade() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
    }

    private OnRewardListChange(listitem: ListItem) {
        let index = listitem._index;
        let data = listitem.data.data as VipRewardItem;
        if (!data) {
            data = new VipRewardItem();
            data.setComponents(listitem.gameObject, this.itemIcon_Normal, index + 1);
            listitem.data.data = data;
            this.rewardItems.push(data);
        }
        let sprite = this.altasIcon.Get(uts.format("{0}{1}", this.altasArticleName, (index + 1).toString()))
        data.onClickEverydayGirtCall = delegate(this, this.onClickEverydayGirt);
        data.onClickLifeGirtCall = delegate(this, this.onClickLifeGirt);
        data.refreshItem(index + 1, sprite, this.sortingOrder);
    }

    private onClickEverydayGirt(level: number) {
        G.AudioMgr.playBtnClickSound();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_GET_GIFT, Macros.VIP_MONTH_GET_TYPE_DAILY));
    }

    private onClickLifeGirt(level: number) {
        G.AudioMgr.playBtnClickSound();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_GET_LIFELONG_GIFT, level));
    }

    public refreshPanel() {
        this.refreshVipLevel();
        this.refreshReward();
    }

    private refreshVipLevel() {
        let heroData = G.DataMgr.heroData;
        let vipData = G.DataMgr.vipData;
        let myLv: number = heroData.curVipLevel;
        let myCharge: number = heroData.lifeConsume;
        this.imgVipLevel.sprite = this.altasVipLevel.Get(uts.format("{0}{1}", this.altasPrefixName, myLv));
        //刷新我的充值进度
        if (myLv < Macros.MAX_VIP_LEVEL) {
            let nextVipMoney: number = vipData.getNextChargeValue(myLv);
            //this.vipBar.value = myCharge / nextVipMoney;
            //0.1--0.9
            this.imgSlider.fillAmount = myCharge / nextVipMoney;
            //黄金和钻石特权 有一个经验翻倍，两个都有经验三倍
            let pri2: boolean = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2) >= 0;
            let pri3: boolean = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0;
            let mul = 1;
            if (pri2) mul++;
            if (pri3) mul++;
            let bas = nextVipMoney - myCharge;
            let num = Math.ceil(bas / mul);
            this.txtVipTip.text = uts.format("再消费{0}钻石即可升级到贵族{1}",
                TextFieldUtil.getColorText(num.toString(), Color.ITEM_ORANGE), myLv + 1);
        }
        else {
            this.imgSlider.fillAmount = 1;
            this.txtVipTip.text = uts.format('您已消费{0}，达到最高等级贵族。', TextFieldUtil.getColorText(myCharge.toString(), Color.ITEM_ORANGE));
        }
    }

    private refreshReward() {
        this.rewardNode.Refresh();
    }

    private onFindAchiVip() {
        //没有可以领取的则打开自己VIP等级对应的页签
        let vipData = G.DataMgr.vipData;
        let curVipLv = G.DataMgr.heroData.curVipLevel;
        let achiLevel = vipData.getCanGetAchiGiftMinLevel();
        let dailyLevel = vipData.canGetDailyGift() ? curVipLv : 0;
        let getLevel = 0;
        if (achiLevel > 0 && dailyLevel > 0) {
            getLevel = Math.min(achiLevel, dailyLevel);
        } else if (achiLevel > 0) {
            getLevel = achiLevel;
        } else {
            getLevel = dailyLevel;
        }

        let index = 0;
        if (getLevel > 0) {
            index = getLevel - 1;
        } else {
            index = curVipLv > 0 ? curVipLv - 1 : 0;
        }
        this.rewardNode.ScrollByAxialRow(index - 1);
    }

}
