import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { List } from 'System/uilib/List'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumGuide, GameIDType } from 'System/constants/GameEnum'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { EquipUtils } from 'System/utils/EquipUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { Color } from 'System/utils/ColorUtil'



class WUXiaHuanXingItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;
    private txtValueAdd: UnityEngine.UI.Text;

    setCommpents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName"); 
        this.txtValue = ElemFinder.findText(go, "txtValue");
        this.txtValueAdd = ElemFinder.findText(go, "txtValueAdd");
    }

    update(data: GameConfig.EquipPropAtt, nextData: GameConfig.EquipPropAtt) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId);
        this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", Color.PropGreen);

        if (nextData) {
            this.txtValueAdd.text ="+"+ (nextData.m_ucPropValue - data.m_ucPropValue).toString();
        } else {
            this.txtValueAdd.text = "";
        }
    }



}

/**
 * 无暇幻形|时装强化
 */
export class WuXiaHuanXingView extends CommonForm {

    private readonly MaxBtnColorCount = 4;
    private readonly MaxLevel = 5;

    private readonly MAX_PROP_NUM = 7;

    private txtFight: UnityEngine.UI.Text;
    private propList: List;
    private icon: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private btnUp: UnityEngine.GameObject;
    private atals: Game.UGUIAltas;
    private txtTip: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;
    private upEffect: UnityEngine.GameObject;

    private iconItem: IconItem;
    private materialItemData: MaterialItemData = new MaterialItemData();
    private WUXiaHuanXingItem: WUXiaHuanXingItem[] = [];

    private dressId: number = 0;

    /**时装avatarList*/
    private rolePosition: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;


    /**按钮的颜色*/
    private imgBtnColors: UnityEngine.UI.Image[] = [];
    private btnGrid: UnityEngine.GameObject;
    private txtBtnLabel: UnityEngine.UI.Text[] = [];
    private dressImageCfg: GameConfig.DressImageConfigM;

    private colorIndex: number = 0;

    private propAttrs: { [propId: number]: number } = {};

    private firstSelectDressId: number = 0;

    private oldHasStrengthLv: number = -1;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SHIZHUANG_HUANXIN);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WuXiaHuanXingView;
    }


    protected initElements(): void {
        this.txtFight = this.elems.getText("txtFight");
        this.propList = this.elems.getUIList("propList");
        this.icon = this.elems.getElement("icon");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnUp = this.elems.getElement("btnUp");
        this.atals = this.elems.getElement("atals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.txtTip = this.elems.getText("txtTip");
        this.txtLv = this.elems.getText("txtLv");

        this.upEffect = this.elems.getElement('upEffect');
        this.upEffect.SetActive(false);

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

        this.rolePosition = this.elems.getTransform("rolePosition");

        this.btnGrid = this.elems.getElement("btnGrid");
        for (let i = 0; i < this.MaxBtnColorCount; i++) {
            let img = ElemFinder.findImage(this.btnGrid, "btnType" + i + "/img");
            this.imgBtnColors.push(img);
            let txt = ElemFinder.findText(this.btnGrid, "btnType" + i + "/txtLv");
            this.txtBtnLabel.push(txt);
            Game.UIClickListener.Get(img.gameObject).onClick = delegate(this, this.onClickColorBtn, i);
        }
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("mask"), this.onClickClose);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickClose);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickClose);
        this.addClickListener(this.btnUp, this.onClickUp);
    }

    /**
     * @param dressId
     * @param firstSelectDressId 优先显示时装id
     */
    open(dressId: number, firstSelectDressId: number = 0) {
        this.firstSelectDressId = firstSelectDressId;
        if (this.firstSelectDressId > 0) {
            this.dressId = this.firstSelectDressId;
        } else {
            this.dressId = dressId;
        }

        super.open();
    }

    protected onOpen() {
        this.updateView();
        //模型显示
        this.setRoleAvaterStage();
    }

    protected onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    private onClickClose() {
        this.close();
    }


    private onClickUp() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShiZhuangQHRequest(Macros.DRESS_STRENG, this.dressId));
    }


    private onClickColorBtn(index: number) {
        this.colorIndex = index;
        this.setRoleAvaterStage();
    }

    updateView() {
        let heroData = G.DataMgr.heroData;
        let dressList = heroData.dressList;
        let hasStrengthLv = heroData.getOneDressLv(this.dressId);
        if (this.oldHasStrengthLv>=0&&this.oldHasStrengthLv != hasStrengthLv) {
            this.playUpEffect();
        }
        this.oldHasStrengthLv = hasStrengthLv;
        //图标按钮显示
        let nextConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressId / 100), hasStrengthLv + 1);
        if (nextConfig) {
            this.materialItemData.id = nextConfig.m_iConsumID;
            this.materialItemData.need = nextConfig.m_iConsumNum;
            this.materialItemData.has = G.DataMgr.thingData.getThingNum(this.materialItemData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            this.iconItem.updateByMaterialItemData(this.materialItemData);
            this.iconItem.updateIcon();
            let hasActive = heroData.getOneDressIsActive(this.dressId);

            let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(this.dressId);
            let desStr = cfg.m_szSpecDesc;

            this.txtTip.text = hasActive ? "" : "时装未激活\n" + desStr;
            this.icon.SetActive(hasActive);
            UIUtils.setButtonClickAble(this.btnUp, hasActive && this.materialItemData.need != 0 && this.materialItemData.has >= this.materialItemData.need);
        } else {
            UIUtils.setButtonClickAble(this.btnUp, false);
            this.txtTip.text = "已满阶";
            this.icon.SetActive(false);
        }

        if (hasStrengthLv == 0) {
            this.txtLv.text = "";
        } else {
            this.txtLv.text = DataFormatter.toHanNumStr(hasStrengthLv) + "阶";
        }

        //强化属性
        let qhConfig: GameConfig.DressQHM;
        let nextQHConfig: GameConfig.DressQHM;
        let hasNextCfg = false;
        if (hasStrengthLv > 0) {
            qhConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressId / 100), hasStrengthLv);
            nextQHConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressId / 100), hasStrengthLv+1);
            if (qhConfig) {
                this.txtFight.text = (FightingStrengthUtil.calStrength(qhConfig.m_astPropAtt)).toString();
            }
            //有下一级配置
            if (nextQHConfig) {
                hasNextCfg = true;
            }

        } else {
            qhConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressId / 100), this.MaxLevel);
            this.txtFight.text = (FightingStrengthUtil.calStrength(qhConfig.m_astPropAtt)).toString();
        }

        this.propList.Count = qhConfig.m_astPropAtt.length;
        for (let i = 0; i < this.propList.Count; i++) {
            if (this.WUXiaHuanXingItem[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.WUXiaHuanXingItem[i] = new WUXiaHuanXingItem();
                this.WUXiaHuanXingItem[i].setCommpents(item);
            }
            this.WUXiaHuanXingItem[i].update(qhConfig.m_astPropAtt[i], hasNextCfg ? nextQHConfig.m_astPropAtt[i] : null);
        }
        //按钮颜色
        this.updateBtnColorStatus(this.dressId);
    }



    private setRoleAvaterStage(): void {
        let heroData = G.DataMgr.heroData;
        //时装显示
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        this.m_avatarList.m_uiDressImageID = this.dressId;
        // this.m_avatarList.m_ucColorLevel = EquipUtils.getEquipCollectColorByType(this.curSelectStage);
        if (this.roleAvatar == null) {
            this.rolePosition.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender, true, this.colorIndex);
    }


    private updateBtnColorStatus(dressId: number) {
        let hasActive = G.DataMgr.heroData.getOneDressIsActive(dressId);
        let hasStrengthLv = G.DataMgr.heroData.getOneDressLv(dressId);
        let dressImageCfg = ThingData.getDressImageConfig(dressId);
        let modelData = dressImageCfg.m_stModel;
        for (let i = 0; i < this.MaxBtnColorCount; i++) {
            this.imgBtnColors[i].sprite = this.atals.Get(modelData[i].m_iColor + "");
            let str = "";
            if (hasStrengthLv < modelData[i].m_iGrade) {
                str += DataFormatter.toHanNumStr(modelData[i].m_iGrade) + "阶" + "开启";
            }
            this.txtBtnLabel[i].text = str;
        }
    }
    private playUpEffect() {
        this.upEffect.SetActive(false);
        this.upEffect.SetActive(true);
        Game.Invoker.BeginInvoke(this.upEffect, "effect", 0.9, delegate(this, this.onEndUpEffect));
    }

    private onEndUpEffect() {
        this.upEffect.SetActive(false);
    }

}