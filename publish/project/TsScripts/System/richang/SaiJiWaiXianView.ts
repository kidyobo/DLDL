import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { FixedList } from 'System/uilib/FixedList'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { EquipUtils } from "System/utils/EquipUtils";
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { PropNameValueItem, PropItemList } from 'System/uilib/PropNameValueItem';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { MaterialItemData } from "System/data/vo/MaterialItemData";
import { DataFormatter } from "System/utils/DataFormatter";
import AvatarMesh from '../unit/avatar/AvatarMesh';
import { UnitUtil } from 'System/utils/UnitUtil'

class WXTuJingItem {

    private icon: UnityEngine.UI.Image;
    private txtName: TextGetSet;
    private atals: Game.UGUIAltas;
    private data: GameConfig.SaiJiGather;

    setComponents(go: UnityEngine.GameObject, atals: Game.UGUIAltas) {
        this.atals = atals;
        this.icon = ElemFinder.findImage(go, "icon");
        this.txtName = new TextGetSet(ElemFinder.findText(go, "txtName"));

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickGoto);
    }

    update(data: GameConfig.SaiJiGather) {
        this.data = data;
        this.txtName.text = data.m_szDes;
        this.icon.sprite = this.atals.Get(data.m_iIcon + "");
    }

    private onClickGoto() {
        if (!this.data)
            return;
        G.ActionHandler.executeFunction(this.data.m_iJump);
    }
}

class WaiXianItem {

    private txtName: TextGetSet;
    private txtProgress: TextGetSet
    private icon: UnityEngine.UI.RawImage;
    private tipMark: GameObjectGetSet;
    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {

        this.icon = ElemFinder.findRawImage(go, "icon");
        this.txtName = new TextGetSet(ElemFinder.findText(go, "txtName"));
        this.txtProgress = new TextGetSet(ElemFinder.findText(go, "txtProgress"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));
    }

    update(cfg: GameConfig.SaiJiConfigM, saiJiId: number) {
        let thingCfg = ThingData.getThingConfig(cfg.m_iSutffID);
        if (!thingCfg) {
            uts.log("no thingCfg , id = " + cfg.m_iSutffID + "  " + cfg.m_szSeasonname);
            return;
        }
        let zhufuData = G.DataMgr.zhufuData;

        let has = G.DataMgr.thingData.getThingNum(cfg.m_iSutffID, 0, false);
        let hasActive = zhufuData.hasActiveThisWaiXian(cfg, saiJiId);
        if (hasActive) {
            this.txtProgress.text = TextFieldUtil.getColorText("已激活", Color.GREEN);
        } else {
            let maxSaiJi = G.DataMgr.zhufuData.getSaiJiMax();
            let need = cfg.m_iSeasonID < maxSaiJi ? cfg.m_iSutffCount2 : cfg.m_iSutffCount;
            this.txtProgress.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", has, need), has >= need ? Color.GREEN : Color.RED);
        }
        this.txtName.text = cfg.m_szStuffName;
        let iconStr: string;
        let heroData = G.DataMgr.heroData;
        if (cfg.m_iZhuFuID == KeyWord.HERO_TYPE_SAIJISZ) {
            iconStr = uts.format("{0}{1}{2}", cfg.m_iImageID, heroData.profession, heroData.gender);
        } else if (cfg.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN) {
            iconStr = uts.format("{0}{1}", cfg.m_iImageID, heroData.profession == 2 ? "a" : "b");
        }
        else {
            iconStr = cfg.m_iImageID + "";
        }
        G.ResourceMgr.loadIcon(this.icon, iconStr, -1);

        this.tipMark.SetActive(!hasActive&&cfg.m_iSutffCount > 0 && G.DataMgr.thingData.getThingNum(cfg.m_iSutffID, 0, false) >= cfg.m_iSutffCount);
    }
}

export class SaiJiWaiXianView extends TabSubForm {

    private itemIcon_Normal: UnityEngine.GameObject;
    private leftObj: UnityEngine.GameObject;
    private left: GameObjectGetSet;
    private subPart: GameObjectGetSet;
    private wxFixedList: FixedList;
    private txtTime: TextGetSet;
    private txtName: TextGetSet;
    private txtLv: TextGetSet;
    private txtSeason: TextGetSet;
    private propList: List;
    private btnActive: GameObjectGetSet;
    private txtBtnActive: TextGetSet;
    private btnPrev: GameObjectGetSet;
    private btnNext: GameObjectGetSet;
    private btnAuto: GameObjectGetSet;

    private btnSubClose: GameObjectGetSet;
    private subPropList: List;
    private impSlider: UnityEngine.UI.Image;
    private txtSlider: TextGetSet;
    private wxIcon: GameObjectGetSet;
    private objHasActive: GameObjectGetSet;
    private txtSubName: TextGetSet;
    private txtSubLv: TextGetSet;
    private btnActiveWX: GameObjectGetSet;
    private txtActiveWX: TextGetSet;
    private getList: List;
    private actIcons: Game.UGUIAltas;

    private unitType: UnitCtrlType;
    private oldModelStr: string;
    private chRoot: UnityEngine.GameObject;
    private titleRoot: UnityEngine.GameObject;
    /**时装avatarList*/
    private roleRoot: UnityEngine.GameObject;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;
    private rideRoot: UnityEngine.GameObject;

    /**当前选择赛季*/
    private selectSeasonID: number = 1;
    private selectCfgsIndex: number = 0;
    /**已经参与的赛季总次数*/
    private seasonTimes: number = 1;
    private waiXianItems: WaiXianItem[] = [];
    private curSjCfgs: GameConfig.SaiJiConfigM[];
    private selectCfg: GameConfig.SaiJiConfigM;
    private totalProp: PropItemList;
    private subProp: PropItemList;
    private costData: MaterialItemData = new MaterialItemData();
    private iconItem: IconItem;
    private wXTuJingItems: WXTuJingItem[] = [];

    private isFirstOpen = true;
    private hTween: Tween.TweenPosition;
    private Start_Position = -188;
    private End_Position = -350;
    private oldTitleId: number = 0;
    private oldRideId: number = 0;
    private leftTime: number = 0;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN);
    }

    protected resPath(): string {
        return UIPathData.SaiJiWaiXianView;
    }


    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.leftObj = this.elems.getElement("left");
        this.left = new GameObjectGetSet(this.leftObj);
        this.subPart = new GameObjectGetSet(this.elems.getElement("subPart"));
        this.subPart.SetActive(false);
        this.wxFixedList = this.elems.getUIFixedList("wxFixedList");
        this.txtTime = new TextGetSet(this.elems.getText("txtTime"));
        this.txtName = new TextGetSet(this.elems.getText("txtName"));
        this.txtLv = new TextGetSet(this.elems.getText("txtLv"));
        this.txtSeason = new TextGetSet(this.elems.getText("txtSeason"));
        this.propList = this.elems.getUIList("propList");
        this.totalProp = new PropItemList(this.propList, this.txtLv);

        this.btnActive = new GameObjectGetSet(this.elems.getElement("btnActive"));
        this.txtBtnActive = new TextGetSet(ElemFinder.findText(this.btnActive.gameObject, "Text"));
        this.btnPrev = new GameObjectGetSet(this.elems.getElement("btnPrev"));
        this.btnNext = new GameObjectGetSet(this.elems.getElement("btnNext"));
        this.btnAuto = new GameObjectGetSet(this.elems.getElement("btnAuto"));

        this.btnSubClose = new GameObjectGetSet(this.elems.getElement("btnSubClose"));
        this.btnActiveWX = new GameObjectGetSet(this.elems.getElement("btnActiveWX"));
        this.txtActiveWX = new TextGetSet(ElemFinder.findText(this.btnActiveWX.gameObject, "Text"));
        this.subPropList = this.elems.getUIList("subPropList");
        this.impSlider = this.elems.getImage("imgSlider");
        this.txtSlider = new TextGetSet(this.elems.getText("txtSlider"));
        this.wxIcon = new GameObjectGetSet(this.elems.getElement("wxIcon"));
        this.objHasActive = new GameObjectGetSet(this.elems.getElement("objHasActive"));
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.wxIcon.gameObject);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.txtSubName = new TextGetSet(this.elems.getText("txtSubName"));
        this.txtSubLv = new TextGetSet(this.elems.getText("txtSubLv"));
        this.subProp = new PropItemList(this.subPropList, this.txtSubLv);
        this.getList = this.elems.getUIList("getList");
        this.actIcons = this.elems.getUGUIAtals("actIcons");

        let maxCount = G.DataMgr.zhufuData.Season_Max_WX_Count;
        for (let i = 0; i < maxCount; i++) {
            let obj = this.wxFixedList.GetItem(i).gameObject;
            let item = new WaiXianItem();
            item.setComponents(obj, this.itemIcon_Normal);
            this.waiXianItems.push(item);
        }

        this.chRoot = this.elems.getElement("chRoot");
        this.titleRoot = this.elems.getElement("titleRoot");
        this.roleRoot = this.elems.getElement("roleRoot");
        this.rideRoot = this.elems.getElement("rideRoot");

        this.hTween = this.leftObj.AddComponent(Tween.TweenPosition.GetType()) as Tween.TweenPosition;
        this.hTween.enabled = false;
    }

    protected initListeners() {
        this.addListClickListener(this.wxFixedList, this.onClickWXFixedList);
        this.addClickListener(this.elems.getElement("btnSubClose"), this.onCloseSubPart);
        this.addClickListener(this.btnPrev.gameObject, this.onClickPrev);
        this.addClickListener(this.btnNext.gameObject, this.onClickNext);
        this.addClickListener(this.btnActive.gameObject, this.onClickActiveTitle);
        this.addClickListener(this.btnActiveWX.gameObject, this.onClickActiveWX);
        this.addClickListener(this.btnAuto.gameObject, this.onClickAuto);
        this.addClickListener(this.elems.getElement("btnTitle"), this.onClickTitle);
    }


    open(imageId: number = 0) {
        this.selectCfgsIndex = 0;
        if (imageId > 0) {
            let cfg = G.DataMgr.zhufuData.getSaiJiCfgByImageId(imageId);
            if (cfg) {
                this.selectCfgsIndex = cfg.m_iID - 1;
                this.selectSeasonID = cfg.m_iSeasonID;
            }
        }
        super.open();
    }

    protected onOpen() {
        let curSaiji = G.DataMgr.zhufuData.getSaiJiCur();
        uts.logWarning(" 当前 curSaiji ------  " + curSaiji);
        curSaiji = curSaiji <= 0 ? 1 : curSaiji;
        this.selectSeasonID = curSaiji;
        this.seasonTimes = G.DataMgr.zhufuData.getSaiJiMax();
        uts.logWarning(" 最大赛季 ------  " + this.seasonTimes);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSaiJiPanelRequest());
        this.btnPrev.SetActive(this.seasonTimes > 1);
        this.btnNext.SetActive(this.seasonTimes > 1);

        this.updatePanel();
        //this.onClickWXFixedList(this.selectCfgsIndex);
        //this.wxFixedList.Selected = this.selectCfgsIndex;
    }


    protected onClose() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        this.isFirstOpen = true;
    }


    updatePanel() {
        this.updateCenterPart();
        this.updateTotalProp();
        this.setRoleAvater();
        this.loadRideModel();
        this.updateActiveTitleStaus();
        this.updateTime();
        this.selectedChanged();
    }

    private updateCenterPart() {
        let zhufuData = G.DataMgr.zhufuData;
        this.curSjCfgs = zhufuData.getSaiJiCfgs(this.selectSeasonID);
        if (!this.curSjCfgs) {
            uts.logWarning(" no saiji cfg , id =  " + this.selectSeasonID);
            return;
        }

        let maxCount = zhufuData.Season_Max_WX_Count;
        for (let i = 0; i < maxCount; i++) {
            this.waiXianItems[i].update(this.curSjCfgs[i], this.selectSeasonID);
        }
    }

    private updateActiveTitleStaus() {
        //称号激活按钮
        //1) 不可激活：未集齐时的状态，按钮隐藏不显示
        //2) 可激活：集齐但未获取时，按钮正常显示，文本为：激活
        //3) 已激活：按钮变灰显示，文本：已激活
        let flag = G.DataMgr.zhufuData.getSaiJiInfo(this.selectSeasonID);
        let allActiveFlag = 1 + 2 + 4 + 8;
        let str = "激活";
        // flag = allActiveFlag+2;
        if (flag < allActiveFlag) {
            this.btnActive.SetActive(false);
        } else if (flag == allActiveFlag) {
            this.btnActive.SetActive(true);
            // UIUtils.setButtonClickAble(this.btnActive.gameObject, true);
        } else {
            str = "已激活";
            this.btnActive.SetActive(false);
            //UIUtils.setButtonClickAble(this.btnActive.gameObject, false);
        }
        this.txtBtnActive.text = str;
        //一件化行
        this.btnAuto.SetActive(flag > allActiveFlag && this.getHuaXingCount() < 4);
    }

    private getHuaXingCount() {
        if (!this.curSjCfgs)
            return;
        let count = 0;
        for (let i = 0; i < this.curSjCfgs.length; i++) {
            let cfg = this.curSjCfgs[i];
            let type = cfg.m_iZhuFuID;
            let imageId = cfg.m_iImageID;

            if (type == KeyWord.HERO_TYPE_SAIJISZ) {
                if (G.DataMgr.heroData.dressList.m_uiImageID == EquipUtils.subStringEquipCollectDressImgId(imageId)) {
                    count++;
                }
            } else {
                if (G.DataMgr.zhufuData.isDress(type, imageId)) {
                    count++;
                }
            }
        }
        return count;
    }


    private updateZhufuBtnStatus() {
        //激活功能
        if (!this.selectCfg)
            return;
        let flag = G.DataMgr.zhufuData.getSaiJiInfo(this.selectSeasonID);
        let hasActive = (1 << (this.selectCfg.m_iID - 1) & flag) > 0;
        let imageId = this.selectCfg.m_iImageID;
        let type = this.selectCfg.m_iZhuFuID;

        if (hasActive) {
            let isUsing: boolean = false;
            if (type == KeyWord.HERO_TYPE_SAIJISZ) {
                isUsing = G.DataMgr.heroData.dressList.m_uiImageID == EquipUtils.subStringEquipCollectDressImgId(imageId);
            } else {
                imageId = G.DataMgr.zhufuData.getImageLevelID(imageId, 1)
                isUsing = G.DataMgr.zhufuData.isDress(type, imageId);
            }
            if (isUsing) {
                this.txtActiveWX.text = "化形中";
                UIUtils.setButtonClickAble(this.btnActiveWX.gameObject, false);
            } else {
                this.txtActiveWX.text = "化形";
                UIUtils.setButtonClickAble(this.btnActiveWX.gameObject, true);
            }
            this.btnActiveWX.SetActive(true);
        } else {
            let show = G.DataMgr.thingData.getThingNum(this.selectCfg.m_iSutffID, 0, false) >= this.selectCfg.m_iSutffCount;
            this.btnActiveWX.SetActive(show);
            this.txtActiveWX.text = "激活";
            UIUtils.setButtonClickAble(this.btnActiveWX.gameObject, true);
        }
    }

    private updateSelectedPropList() {
        let zhufuData = G.DataMgr.zhufuData;
        let type = this.selectCfg.m_iZhuFuID;
        let imageId = this.selectCfg.m_iImageID;
        switch (type) {
            case KeyWord.HERO_SUB_TYPE_ZUOQI://坐骑
            case KeyWord.HERO_SUB_TYPE_WUHUN: //神器
            case KeyWord.HERO_SUB_TYPE_YUYI://翅膀
                let newId = zhufuData.getImageLevelID(imageId, 1);
                let imageCfg = zhufuData.getImageConfig(newId);
                if (!imageCfg) {
                    uts.logWarning(" no  ZhuFuImageConfigM ,id = " + imageId);
                    return;
                }
                this.subProp.update(imageCfg.m_astProp);
                break;

            case KeyWord.HERO_TYPE_SAIJISZ:
                //时装
                imageId = EquipUtils.subStringEquipCollectDressImgId(imageId);
                if (imageId > 0) {
                    let cfg = ThingData.getDressImageConfig(imageId);
                    if (!cfg) {
                        uts.assert(cfg != null, "时装ID不存在" + imageId);
                    }
                    this.subProp.update(cfg.m_astProp);
                }
                break;
            case KeyWord.HERO_TYPE_SAIJICH:
                //称号
                let titleConfig = G.DataMgr.titleData.getDataConfig(imageId);
                if (!titleConfig) {
                    uts.logWarning("no titleCfg ,id = " + imageId);
                }
                this.subProp.update(titleConfig.m_stPropAtt);
                break;
        }
    }


    private updateTotalProp() {
        if (!this.curSjCfgs)
            return;
        let zhufuData = G.DataMgr.zhufuData;
        let totalProps: GameConfig.EquipPropAtt[] = [];
        for (let i = 0; i < this.curSjCfgs.length; i++) {
            let type = this.curSjCfgs[i].m_iZhuFuID;
            let imageId = this.curSjCfgs[i].m_iImageID;
            switch (type) {
                case KeyWord.HERO_SUB_TYPE_ZUOQI://坐骑
                case KeyWord.HERO_SUB_TYPE_WUHUN: //神器
                case KeyWord.HERO_SUB_TYPE_YUYI://翅膀
                    let newId = zhufuData.getImageLevelID(imageId, 1);
                    let imageCfg = zhufuData.getImageConfig(newId);
                    if (imageCfg) {
                        FightingStrengthUtil.mergeProp(totalProps, imageCfg.m_astProp);
                    } else {
                        uts.logWarning(" no  ZhuFuImageConfigM ,id = " + imageId);
                    }
                    break;

                case KeyWord.HERO_TYPE_SAIJISZ:
                    //时装
                    imageId = EquipUtils.subStringEquipCollectDressImgId(imageId);
                    if (imageId > 0) {
                        let cfg = ThingData.getDressImageConfig(imageId);
                        if (cfg) {
                            FightingStrengthUtil.mergeProp(totalProps, cfg.m_astProp);
                        } else {
                            uts.logWarning("时装ID不存在" + imageId);
                        }
                    }
                    break;
                case KeyWord.HERO_TYPE_SAIJICH:
                    //称号
                    let titleConfig = G.DataMgr.titleData.getDataConfig(imageId);
                    if (titleConfig) {
                        FightingStrengthUtil.mergeProp(totalProps, titleConfig.m_stPropAtt);
                    } else {
                        uts.logWarning("no titleCfg ,id = " + imageId);
                    }
                    break;
            }
        }
        this.totalProp.update(totalProps);

        let titleCfg = this.curSjCfgs[this.curSjCfgs.length - 1];
        if (!titleCfg)
            return;

        if (this.oldTitleId != titleCfg.m_iImageID) {
            this.oldTitleId = titleCfg.m_iImageID;
            G.ResourceMgr.loadModel(this.chRoot, UnitCtrlType.chenghao, this.oldTitleId + "", this.sortingOrder);
            G.ResourceMgr.loadModel(this.titleRoot, UnitCtrlType.chenghao, this.oldTitleId + "", this.sortingOrder);
        }
    }

    private loadRideModel() {
        let cfg = G.DataMgr.zhufuData.getSaiJiCfg(this.selectSeasonID, KeyWord.HERO_SUB_TYPE_ZUOQI);
        if (!cfg)
            return;
        let newId = G.DataMgr.zhufuData.getImageLevelID(cfg.m_iImageID, 1);
        let m_mountID = UnitUtil.getAvatarModelID(newId, KeyWord.HERO_SUB_TYPE_ZUOQI);
        if (!G.DataMgr.zhufuData.hasActiveWX(this.selectSeasonID, KeyWord.HERO_SUB_TYPE_ZUOQI)) {
            m_mountID = m_mountID * 10;
        }
        if (m_mountID > 0 && m_mountID != this.oldRideId) {
            this.oldRideId = m_mountID;
            G.ResourceMgr.loadModel(this.rideRoot, UnitCtrlType.ride, this.oldRideId + "", this.sortingOrder);
        }
    }


    private selectedChanged() {
        if (this.selectSeasonID > Macros.SAIJI_LOOP_CNT) {
            this.selectSeasonID = this.selectSeasonID % Macros.SAIJI_LOOP_CNT;
        }
        if (this.selectSeasonID == 0) {
            this.selectSeasonID = Macros.SAIJI_LOOP_CNT;
        }
        this.curSjCfgs = G.DataMgr.zhufuData.getSaiJiCfgs(this.selectSeasonID);
        this.selectCfg = this.curSjCfgs[this.selectCfgsIndex];
        this.updateSelected();
        this.updateTime();
    }

    private updateSelected() {
        if (!this.selectCfg)
            return;

        //  this.txtSeason.text = uts.format("第{0}赛季{1}", this.tmpValue, this.selectSeasonID);
        this.updateSelectedPropList();
        this.setRoleAvater();
        this.loadRideModel();

        let isActive = G.DataMgr.zhufuData.hasActiveThisWaiXian(this.selectCfg, this.selectSeasonID);
        this.wxIcon.SetActive(!isActive);
        this.objHasActive.SetActive(isActive);
        if (!isActive) {
            let maxSaiJi = G.DataMgr.zhufuData.getSaiJiMax();
            this.costData.id = this.selectCfg.m_iSutffID;
            this.costData.need = this.selectSeasonID < maxSaiJi ? this.selectCfg.m_iSutffCount2 : this.selectCfg.m_iSutffCount;
            this.costData.has = G.DataMgr.thingData.getThingNum(this.costData.id, 0, false);
            this.iconItem.updateByMaterialItemData(this.costData);
            this.iconItem.updateIcon();
            let value = this.costData.has / this.costData.need;
            value = value > 1 ? 1 : value;
            this.impSlider.fillAmount = value;
            this.txtSlider.text = uts.format("{0}/{1}", this.costData.has, this.costData.need);
        } else {
            this.impSlider.fillAmount = 1;
            this.txtSlider.text = "";
        }


        this.updateZhufuBtnStatus();

        let oldLen = this.wXTuJingItems.length;
        let bonus = this.selectCfg.m_stBonusList;
        this.getList.Count = bonus.length;

        let item: WXTuJingItem;
        for (let i = 0; i < bonus.length; i++) {
            if (i < oldLen) {
                item = this.wXTuJingItems[i];
            } else {
                item = new WXTuJingItem();
                item.setComponents(this.getList.GetItem(i).gameObject, this.actIcons);
                this.wXTuJingItems.push(item);
            }
            item.update(bonus[i]);
        }

    }



    private setRoleAvater(): void {
        if (!this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.roleRoot.transform, this.roleRoot.transform);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.hasRide = true;
            this.roleAvatar.checkActive = true;
            this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.setRenderLayer(5);
        }
        let zhufuData = G.DataMgr.zhufuData;
        let dressId = 0;
        let rideId = 0;
        let wingId = 0;
        let weaponId = 0;
        let dressCfg = zhufuData.getSaiJiCfg(this.selectSeasonID, KeyWord.HERO_TYPE_SAIJISZ);
        if (dressCfg) {
            dressId = EquipUtils.subStringEquipCollectDressImgId(dressCfg.m_iImageID);
        }
        //let rideCfg = zhufuData.getSaiJiCfg(this.selectSeasonID, KeyWord.HERO_SUB_TYPE_ZUOQI);
        //if (rideCfg) {
        //    rideId = rideCfg.m_iImageID;
        //}
        let wingCfg = zhufuData.getSaiJiCfg(this.selectSeasonID, KeyWord.HERO_SUB_TYPE_YUYI);
        if (wingCfg) {
            wingId = wingCfg.m_iImageID;
        }
        let weaponCfg = zhufuData.getSaiJiCfg(this.selectSeasonID, KeyWord.HERO_SUB_TYPE_WUHUN);
        if (weaponCfg) {
            weaponId = weaponCfg.m_iImageID;
        }

        let heroData = G.DataMgr.heroData;
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        this.m_avatarList.m_uiDressImageID = dressId;
        this.m_avatarList.m_ucHunLiLevel = 0;
        this.m_avatarList.m_auiSubLevel[Macros.HERO_SUB_TYPE_WUHUN - 1] = zhufuData.getImageLevelID(weaponId, 1);
        this.m_avatarList.m_auiSubLevel[Macros.HERO_SUB_TYPE_ZUOQI - 1] = 0 //zhufuData.getImageLevelID(rideId, 1);
        this.m_avatarList.m_auiSubLevel[Macros.HERO_SUB_TYPE_YUYI - 1] = zhufuData.getImageLevelID(wingId, 1);
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender, false, 0, this.selectSeasonID);
    }

    private updateTime() {
        let str: string;
        let curId = G.DataMgr.zhufuData.getSaiJiCur();
        if (this.selectSeasonID < curId) {
            str = TextFieldUtil.getColorText("本次挑战赛已结束", Color.RED);
        } else if (this.selectSeasonID == curId) {
            //let day = G.DataMgr.zhufuData.getSaiJiDay();
            this.leftTime = G.DataMgr.zhufuData.getToday2EndLeftDay() * 86400 + G.SyncTime.getServerZeroLeftTime();
            str = TextFieldUtil.getColorText(uts.format("本届挑战赛剩余时间：{0}", DataFormatter.second2day(this.leftTime)), Color.GREEN);
            this.addTimer("1", 1000, 0, this.onTimer);
        } else {
            this.leftTime = (Macros.SAIJI_START_DAY - G.SyncTime.getDateAfterStartServer()) * 86400 + G.SyncTime.getServerZeroLeftTime();
            str = TextFieldUtil.getColorText("本次挑战赛尚未开启", Color.RED);
            this.addTimer("2", 1000, 0, this.onTimer2);
        }
        this.txtTime.text = str;
    }
    private onTimer(): void {
        this.leftTime--;
        if (this.leftTime <= 0) {
            // this.txtTime.text = TextFieldUtil.getColorText("本次挑战赛已结束", Color.RED);
            this.removeTimer("2");
        }
        else {
            let str = TextFieldUtil.getColorText(uts.format("本届挑战赛剩余时间：{0}", DataFormatter.second2day(this.leftTime)), Color.GREEN);
            this.txtTime.text = str;
        }
    }
    private onTimer2(): void {
        this.leftTime--;
        if (this.leftTime <= 0) {
            this.removeTimer("2");
        }
        else {
            let str = TextFieldUtil.getColorText(uts.format("下届挑战赛开启剩余时间：{0}", DataFormatter.second2day(this.leftTime)), Color.GREEN);
            this.txtTime.text = str;
        }
    }

    //----效果---
    private doTweenPosition(moveLeft: boolean) {
        if (moveLeft) {
            Tween.TweenPosition.Begin(this.leftObj, 0.5, G.getCacheV3(this.End_Position, 0, 0));
        } else {
            Tween.TweenPosition.Begin(this.leftObj, 0.5, G.getCacheV3(this.Start_Position, 0, 0));
        }
    }

    private doTweenShader(index: number) {
        if (this.roleAvatar) {
            let arr: number[] = [KeyWord.HERO_SUB_TYPE_YUYI, KeyWord.HERO_TYPE_SAIJISZ, KeyWord.HERO_SUB_TYPE_ZUOQI, KeyWord.HERO_SUB_TYPE_WUHUN];
            this.doTweenShaderByType(arr[index]);
        }
    }


    private getMaterials(root: UnityEngine.Transform): UnityEngine.Material[] {
        let len = root.transform.childCount;
        let materials: UnityEngine.Material[] = [];
        for (let i = 0; i < len; i++) {
            let r = root.transform.GetChild(i).GetComponent(UnityEngine.Renderer.GetType()) as UnityEngine.Renderer;
            if (r) {
                let materialLen = Game.ArrayHelper.GetArrayLength(r.materials);
                for (let m = 0; m < materialLen; m++) {
                    let material = Game.ArrayHelper.GetArrayValue(r.materials, m) as UnityEngine.Material;
                    materials.push(material);
                }
            }
        }
        return materials;
    }

    private getMaterialsRecursion(root: UnityEngine.Transform): UnityEngine.Material[] {
        let renderers = root.GetComponentsInChildren(UnityEngine.Renderer.GetType()) as UnityEngine.Renderer[];
        let rLen = Game.ArrayHelper.GetArrayLength(renderers);
        let materials: UnityEngine.Material[] = [];
        for (let i = 0; i < rLen; i++) {
            let r = Game.ArrayHelper.GetArrayValue(renderers, i) as UnityEngine.Renderer;
            let materialLen = Game.ArrayHelper.GetArrayLength(r.materials);
            for (let m = 0; m < materialLen; m++) {
                let material = Game.ArrayHelper.GetArrayValue(r.materials, m) as UnityEngine.Material;
                materials.push(material);
            }
        }
        return materials;
    }

    private doTweenShaderByType(zhufuId: number) {
        let meshes: AvatarMesh[] = [];
        let obj: UnityEngine.GameObject;
        let materials: UnityEngine.Material[];
        let t: Tween.TweenShaderValue;
        let model: any;
        switch (zhufuId) {
            case KeyWord.HERO_SUB_TYPE_ZUOQI://坐骑
                meshes.push(this.roleAvatar.m_mountMesh);
                break;
            case KeyWord.HERO_SUB_TYPE_WUHUN: //神器
                meshes.push(this.roleAvatar.m_weaponMesh1, this.roleAvatar.m_weaponMesh2);
                break;
            case KeyWord.HERO_SUB_TYPE_YUYI://翅膀
                meshes.push(this.roleAvatar.m_wingMesh);
                break;
            case KeyWord.HERO_TYPE_SAIJISZ://时装
                meshes.push(this.roleAvatar.m_bodyMesh);
                break;
        }

        if (zhufuId == KeyWord.HERO_SUB_TYPE_ZUOQI) {
            materials = this.getMaterialsRecursion(this.rideRoot.transform);
            t = Tween.TweenShaderValue.Begin(this.rideRoot, 0.5, materials, "_LightScale", 2, 6);
            t.animationCurve = G.getCurve("jumpHeight");
        } else {
            for (let mesh of meshes) {
                let model = mesh.model;
                if (model) {
                    obj = model.gameObject;
                    if (obj) {
                        if (KeyWord.HERO_SUB_TYPE_WUHUN == zhufuId) {
                            let ts = Tween.TweenScale.Begin(obj, 0.3, G.getCacheV3(2.5, 2.5, 2.5));
                            ts.method = Tween.UITweener.Method.BounceIn;
                            ts.onFinished = delegate(this, this.onTweenScaleFinished, obj);
                        } else {
                            if (zhufuId == KeyWord.HERO_SUB_TYPE_YUYI) {
                                materials = this.getMaterialsRecursion(model.transform);
                            } else {
                                materials = this.getMaterials(model.transform);
                            }

                            if (zhufuId == KeyWord.HERO_SUB_TYPE_WUHUN) {
                                t = Tween.TweenShaderValue.Begin(obj, 0.5, materials, "_Light", 1, 3);
                            } else {
                                t = Tween.TweenShaderValue.Begin(obj, 0.5, materials, "_LightScale", 2, 6);
                            }
                            t.animationCurve = G.getCurve("jumpHeight");
                        }
                    }
                }
            }
        }

    }

    private onTweenScaleFinished(obj: UnityEngine.GameObject) {
        let ts = Tween.TweenScale.Begin(obj, 0.3, G.getCacheV3(1, 1, 1));
        ts.method = Tween.UITweener.Method.BounceIn;
    }

    //----交互操作
    private onClickWXFixedList(index: number) {
        this.selectCfgsIndex = index;
        this.selectCfg = this.curSjCfgs[index];
        let oldStatus = this.subPart.activeSelf;
        this.subPart.SetActive(true);
        //0,1的不需要动画
        if (!oldStatus && index > 1) {
            this.doTweenPosition(true);
        }
        this.selectedChanged();
        this.doTweenShader(index);
    }

    private onCloseSubPart() {
        this.subPart.SetActive(false);
        this.doTweenPosition(false);
    }

    private onClickPrev() {

        this.selectSeasonID--;
        let min = Math.min(this.seasonTimes, Macros.SAIJI_LOOP_CNT);
        if (this.selectSeasonID < 1) {
            this.selectSeasonID = min;
        }
        //if (this.selectSeasonID < 1) {
        //    this.selectSeasonID = this.seasonTimes == 0 ? 1 : this.seasonTimes;
        //}
        this.selectedChanged();
        this.updateCenterPart();
        this.updateActiveTitleStaus();
        this.updateTotalProp();
        this.removeTimer("1");


    }

    private onClickNext() {
        this.selectSeasonID++;
        let min = Math.min(this.seasonTimes, Macros.SAIJI_LOOP_CNT);
        if (this.selectSeasonID > min) {
            this.selectSeasonID = 1;
        }
        //if (this.selectSeasonID > this.seasonTimes) {
        //    this.selectSeasonID = 1;
        //}
        //if (this.selectSeasonID > Macros.SAIJI_LOOP_CNT) {
        //    let value = this.selectSeasonID % Macros.SAIJI_LOOP_CNT;
        //    value = value == 0 ? Macros.SAIJI_LOOP_CNT : value;
        //    this.selectSeasonID = value;
        //}
        this.selectedChanged();
        this.updateCenterPart();
        this.updateActiveTitleStaus();
        this.updateTotalProp();
        this.removeTimer("1");


    }

    private onClickActiveTitle() {
        if (!this.curSjCfgs)
            return;
        //取表最后一个称号
        let len = G.DataMgr.zhufuData.Season_Max_WX_Count;
        let cfg = this.curSjCfgs[len];
        if (!cfg)
            return;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSaiJiActiveRequest(this.selectSeasonID, cfg.m_iID));
    }

    private onClickActiveWX() {
        if (!this.selectCfg)
            return;
        let flag = G.DataMgr.zhufuData.getSaiJiInfo(this.selectSeasonID);
        let hasActive = (1 << (this.selectCfg.m_iID - 1) & flag) > 0;

        if (hasActive) {
            let type = this.selectCfg.m_iZhuFuID;
            let imageId = this.selectCfg.m_iImageID;
            if (type == KeyWord.HERO_TYPE_SAIJISZ) {
                imageId = EquipUtils.subStringEquipCollectDressImgId(imageId);
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSzhxRequest(0, imageId));
            } else {
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(type);
                if (data != null) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(type, imageId));
                }
            }
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSaiJiActiveRequest(this.selectSeasonID, this.selectCfg.m_iID));
        }

    }


    private onClickAuto() {
        if (!this.curSjCfgs)
            return;
        for (let i = 0; i < this.curSjCfgs.length; i++) {
            let cfg = this.curSjCfgs[i];
            let type = cfg.m_iZhuFuID;
            let imageId = cfg.m_iImageID;
            switch (type) {
                case KeyWord.HERO_SUB_TYPE_ZUOQI://坐骑
                case KeyWord.HERO_SUB_TYPE_WUHUN: //神器
                case KeyWord.HERO_SUB_TYPE_YUYI://翅膀
                    let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(type);
                    if (data != null) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(type, imageId));
                    }
                    break;
                case KeyWord.HERO_TYPE_SAIJISZ://时装
                    imageId = EquipUtils.subStringEquipCollectDressImgId(imageId);
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSzhxRequest(0, imageId));
                    break;
            }
        }
    }

    private onClickTitle() {
        if (!this.curSjCfgs)
            return;
        //取表最后一个称号
        let len = G.DataMgr.zhufuData.Season_Max_WX_Count;
        let cfg = this.curSjCfgs[len];
        if (!cfg)
            return;
        let thingCfg = G.DataMgr.thingData.getThingCfgByTitleId(cfg.m_iImageID);
        if (!thingCfg)
            return;

        let item = new IconItem();
        item.updateById(thingCfg.m_iID);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);

    }

}