import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { PetView } from 'System/pet/PetView'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { PetData } from 'System/data/pet/PetData'
import { UIUtils } from 'System/utils/UIUtils'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { Color } from "System/utils/ColorUtil"
import { ThingData } from "System/data/thing/ThingData"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { BatBuyView } from 'System/business/view/BatBuyView'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'


class PetZhenTuItem {

    private headImg: UnityEngine.UI.RawImage;
    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;
    private lastIconId: number = 0;

    private obj: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.obj = go;
        this.headImg = ElemFinder.findRawImage(go, "headImg");
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
    }

    update(data: GameConfig.BeautyZTPosInfo) {

        let petName = PetData.getPetConfigByPetID(data.m_iBeautyID).m_szBeautyName;
        this.txtName.text = petName;
        this.txtValue.text = "";
        if (this.lastIconId != data.m_iBeautyID) {
            this.lastIconId = data.m_iBeautyID;
            G.ResourceMgr.loadImage(this.headImg, uts.format('images/head/{0}.png', data.m_iBeautyID));
        }
        let peInfo: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(data.m_iBeautyID);
        let hasActive = (null != peInfo && peInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET);
        UIUtils.setGrey(this.obj, !hasActive);
    }

}


class PetZhenTuUpLvPropItem {

    private readonly WanFenBi: number = 100;

    private txtName: UnityEngine.UI.Text;
    private txtCurValue: UnityEngine.UI.Text;
    private txtNextValue: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtCurValue = ElemFinder.findText(go, "txtCurValue");
        this.txtNextValue = ElemFinder.findText(go, "txtNextValue");
    }

    update(curData: GameConfig.BeautyPropAtt, nextPropValue: number, noActive: boolean, isEndIndex: boolean) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, curData.m_ucPropId);
        this.txtCurValue.text = isEndIndex ? (curData.m_iPropValue / this.WanFenBi + "%") : (curData.m_iPropValue + "");
        if (nextPropValue == 0 || noActive) {
            this.txtNextValue.text = "";
        } else {
            this.txtNextValue.text = isEndIndex ? nextPropValue / this.WanFenBi+"%": nextPropValue + "";
        }
    }


}


export class PetZhenTuPanel extends NestedSubForm {

    private readonly petCounts = [2, 3, 4];

    private list: List;
    private propList: List;

    private txtFight: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
   
    private btnHandle: UnityEngine.GameObject;
    private txtHandle: UnityEngine.UI.Text;
    /**自动购买*/
    private toggleAutoBuy: UnityEngine.UI.ActiveToggle;

    private centerbg: UnityEngine.GameObject;
    private typeObjs: UnityEngine.GameObject[] = [];

    private petZhenTuItems: PetZhenTuItem[] = [];
    private petZhenTuUpLvPropItems: PetZhenTuUpLvPropItem[] = [];
    private petItemObjs: { [type: number]: UnityEngine.GameObject[] } = {};

    private icon: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private iconItem: IconItem;

    /**按钮是否是激活状态*/
    private statusBtn: number = 0;
    /**选择光印id,默认1第一个*/
    private selectZhentuId: number = 1;
    /**进阶材料*/
    private m_costData: MaterialItemData = new MaterialItemData();

    //特效
    /**中间最大的特效*/
    private zhentuQuan: UnityEngine.GameObject;
    /**线特效*/
    private lineEffects: UnityEngine.GameObject[] = [];
    /**满街级显示*/
    private stageFull: UnityEngine.UI.Text;

    private imgTip: UnityEngine.UI.Image;
    private imgAtals: Game.UGUIAltas;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_ZHENTU);
    }

    protected resPath(): string {
        return UIPathData.PetZhentuView;
    }

    protected initElements() {
        this.propList = this.elems.getUIList("propList");
        this.list = this.elems.getUIList("list");

        this.txtFight = this.elems.getText("txtFight");
        this.txtName = this.elems.getText("txtName");
        this.icon = this.elems.getElement("icon");
        this.btnHandle = this.elems.getElement("btnHandle");
        this.txtHandle = this.elems.getText("txtHandle");
        // 自动购买
        this.toggleAutoBuy = this.elems.getActiveToggle('toggleAutoBuy');

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

        //特效
        this.zhentuQuan = this.elems.getElement("zhentuQuan");
        this.zhentuQuan.SetActive(false);

        this.centerbg = this.elems.getElement("centerbg");

        for (let i = 0; i < this.petCounts.length; i++) {
            let typeItem = ElemFinder.findObject(this.centerbg, "type" + i);
            let effect = ElemFinder.findObject(typeItem, "effect");
            effect.SetActive(false);
            this.typeObjs.push(typeItem);
            this.lineEffects.push(effect);
            //中间伙伴头像。。
            let petCount = this.petCounts[i];
            this.petItemObjs[i] = [];
            for (let j = 0; j < petCount; j++) {
                let item = ElemFinder.findObject(typeItem, "item" + j);
                this.petItemObjs[i].push(item);
            }
        }

        this.stageFull = this.elems.getText("txtTip");

        this.imgTip = this.elems.getImage("imgTip");
        this.imgAtals = this.elems.getElement("imgAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
     }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickListItem);
        this.addClickListener(this.btnHandle, this.onClickBtnHandle);
    }

    protected onOpen() {
        //BEAUTY_ZT_LIST/BEAUTY_ZT_ACT/BEAUTY_ZT_UPLV
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetZhenTuRequest(Macros.BEAUTY_ZT_LIST));
    }

    protected onClose() {
        //隐藏所有特效
        this.zhentuQuan.SetActive(false);
        for (let i = 0; i < this.petCounts.length; i++) {
            this.lineEffects[i].SetActive(false);
        }
    }

    private onClickBtnHandle() {
        if (this.statusBtn == Macros.GOD_LOAD_AWARD_WAIT_GET) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetZhenTuRequest(Macros.BEAUTY_ZT_ACT, this.selectZhentuId));
        } else if (this.statusBtn == Macros.GOD_LOAD_AWARD_DONE_GET) {
            if (this.m_costData.id > 0) {
                if (this.m_costData.has >= this.m_costData.need) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetZhenTuRequest(Macros.BEAUTY_ZT_UPLV, this.selectZhentuId));
                }
                else if (this.toggleAutoBuy.isOn) {
                    let num: number = this.m_costData.need - this.m_costData.has;
                    let info = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
                    if (info.isAffordable) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetZhenTuRequest(Macros.BEAUTY_ZT_UPLV, this.selectZhentuId));
                        return;
                    }
                }
                else {
                    G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
                }
            }
        }
    }


    private stopzhentuQuan() {
        this.zhentuQuan.SetActive(false);
    }

    private stopLineEffect(index: number) {
        this.lineEffects[index].SetActive(false);
    }

    private playLineEffect(zhenTuId: number) {
        if (zhenTuId > 0) {
            let config = G.DataMgr.petData.getZhenTuConfigByType(zhenTuId);
            let index = this.petCounts.indexOf(config.m_iPosCnt);
            this.lineEffects[index].SetActive(false);
            this.lineEffects[index].SetActive(true);
            Game.Invoker.BeginInvoke(this.lineEffects[index], "stopLineEffect", 0.9, delegate(this, this.stopLineEffect, index));
        }
    }

    updateZhenTuPanel(type: number, zhenTuId: number = 0) {
        //处理激活，进阶特效
        if (type == Macros.BEAUTY_ZT_ACT) {
            this.zhentuQuan.SetActive(false);
            this.zhentuQuan.SetActive(true);
            Game.Invoker.BeginInvoke(this.zhentuQuan, "stopDianEffect", 0.9, delegate(this, this.stopzhentuQuan));
            this.playLineEffect(zhenTuId);
            G.AudioMgr.playJinJieSucessSound();
        } else if (type == Macros.BEAUTY_ZT_UPLV) {
            this.playLineEffect(zhenTuId);
            G.AudioMgr.playStarBombSucessSound();
        }
        //显示
        this.updateListLabel();
        this.list.Selected = this.selectZhentuId - 1;
        this.onClickListItem(this.selectZhentuId - 1);
    }

    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updatePropAndIcon(this.selectZhentuId - 1);
        }
    }


    private updateListLabel() {
        let petData = G.DataMgr.petData;
        let petZhenTuInfo = G.DataMgr.petData.petZhenTuInfo;
        this.list.Count = petData.zhenTuCount;
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.list.GetItem(i).gameObject;
            let txtNormal = ElemFinder.findText(item, "normal/text");
            let txtSelected = ElemFinder.findText(item, "selected/text");
            let str = petData.getZhenTuConfigByType(i + 1).m_szName;
            txtNormal.text = str;
            txtSelected.text = str;
            //激活状态显示
            let noActiveObj = ElemFinder.findObject(item, "noActive");
            let canActiveObj = ElemFinder.findObject(item, "canActive");
            let hadActiveObj = ElemFinder.findObject(item, "hadActive");
            //状态 GOD_LOAD_AWARD_CANT_GET  GOD_LOAD_AWARD_WAIT_GET  GOD_LOAD_AWARD_DONE_GET
            let stauts = G.DataMgr.petData.getZhenTuActiveStatus(i + 1);
            noActiveObj.SetActive(stauts == Macros.GOD_LOAD_AWARD_CANT_GET);
            canActiveObj.SetActive(stauts == Macros.GOD_LOAD_AWARD_WAIT_GET);
            hadActiveObj.SetActive(stauts == Macros.GOD_LOAD_AWARD_DONE_GET);
        }
    }


    private showOrHideType(type: number) {
        this.typeObjs[0].SetActive(type == 1);
        this.typeObjs[1].SetActive(type == 2);
        this.typeObjs[2].SetActive(type == 3);
    }

    private onClickListItem(index: number) {

        let petData = G.DataMgr.petData;
        let config = petData.getZhenTuConfigByType(index + 1);
        let count = config.m_iPosCnt;
        if (count == 2) {
            this.showOrHideType(1);
        } else if (count == 3) {
            this.showOrHideType(2);
        } else if (count == 4) {
            this.showOrHideType(3);
        }

        this.selectZhentuId = index + 1;
        this.updateCenterPetInfo(index);
        this.updatePropAndIcon(index);

    }




    //中间伙伴头像
    private updateCenterPetInfo(index: number) {
        let petData = G.DataMgr.petData;
        let config = petData.getZhenTuConfigByType(index + 1);
        //中间伙伴头像显示
        for (let i = 0; i < config.m_iPosCnt; i++) {
            let item = this.petItemObjs[this.petCounts.indexOf(config.m_iPosCnt)][i];
            if (this.petZhenTuItems[i] == null) {
                this.petZhenTuItems[i] = new PetZhenTuItem();
            }
            this.petZhenTuItems[i].setComponents(item);
            this.petZhenTuItems[i].update(config.m_szPosInfo[i]);
        }
    }

    //右侧属性，材料
    private updatePropAndIcon(index: number) {

        //阶级+名字显示
        let curLv = G.DataMgr.petData.petZhenTuInfo.m_stList.m_stInfo[index].m_ucLevel;
        if (curLv > 0) {
            this.txtName.text = DataFormatter.toHanNumStr(curLv) + "阶 " + G.DataMgr.petData.getZhenTuConfigByType(this.selectZhentuId).m_szName;
        } else {
            this.txtName.text = G.DataMgr.petData.getZhenTuConfigByType(this.selectZhentuId).m_szName;
        }
        let noActive = (curLv == 0);
        //未激活0级取1级
        curLv = noActive ? (curLv + 1) : curLv;

        let curLvConfig = G.DataMgr.petData.getPetZhenTuUpLvConfig((index + 1), curLv);
        let nextLvConfig = G.DataMgr.petData.getPetZhenTuUpLvConfig((index + 1), (curLv + 1));

        if (curLvConfig != null) {
            let fight = FightingStrengthUtil.calPetFight(curLvConfig.m_astProp);
            this.txtFight.text = fight.toString();

            this.propList.Count = curLvConfig.m_astProp.length;
            let nextPropAttValue: number = 0;
            for (let i = 0; i < this.propList.Count; i++) {
                if (this.petZhenTuUpLvPropItems[i] == null) {
                    let item = this.propList.GetItem(i).gameObject;
                    this.petZhenTuUpLvPropItems[i] = new PetZhenTuUpLvPropItem();
                    this.petZhenTuUpLvPropItems[i].setComponents(item);
                }
                if (nextLvConfig != null) {
                    nextPropAttValue = nextLvConfig.m_astProp[i].m_iPropValue;
                }
                this.petZhenTuUpLvPropItems[i].update(curLvConfig.m_astProp[i], nextPropAttValue, noActive, (i == (this.propList.Count-1)));
            }
        }

        let stageIsFull = false;
        if (nextLvConfig != null) {
            let config = ThingData.getThingConfig(nextLvConfig.m_iConsumID);
            let color = Color.getColorById(config.m_ucColor);
            this.m_costData.id = nextLvConfig.m_iConsumID;
            this.m_costData.need = nextLvConfig.m_iConsumNum;
            this.m_costData.has = G.DataMgr.thingData.getThingNum(nextLvConfig.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
            this.iconItem.updateByMaterialItemData(this.m_costData);
            this.iconItem.updateIcon();
            this.stageFull.text = noActive ? "收集伙伴激活" : "";
            this.icon.SetActive(!noActive);
            this.toggleAutoBuy.gameObject.SetActive(!noActive);
          
        } else {
            this.iconItem.updateById(null);
            this.iconItem.updateIcon();
            this.m_costData.id = 0;
            this.stageFull.text = "已满阶";
            this.icon.SetActive(false);
            stageIsFull = true;
        }

        this.updateBtnStatus(this.m_costData.need, this.m_costData.has, stageIsFull);
    }

    //更新按钮的状态
    private updateBtnStatus(need: number, has: number, stageIsFull: boolean) {
        this.statusBtn = G.DataMgr.petData.getZhenTuActiveStatus(this.selectZhentuId);
        this.txtHandle.text = (this.statusBtn == Macros.GOD_LOAD_AWARD_DONE_GET) ? "进阶" : "激活";
        if (this.statusBtn == Macros.GOD_LOAD_AWARD_WAIT_GET) {
            UIUtils.setButtonClickAble(this.btnHandle, true);
        } else if (this.statusBtn == Macros.GOD_LOAD_AWARD_DONE_GET) {
            UIUtils.setButtonClickAble(this.btnHandle, true);
        } else {
            UIUtils.setButtonClickAble(this.btnHandle, false);
        }
        //满街级后灰
        if (stageIsFull) {
            UIUtils.setButtonClickAble(this.btnHandle, false);
        }

        let str = "";
        if (this.statusBtn == Macros.GOD_LOAD_AWARD_DONE_GET) {
            str = this.selectZhentuId + "";
        } else {
            str = "j" + this.selectZhentuId;
        }
        this.imgTip.sprite = this.imgAtals.Get(str);

    }



}