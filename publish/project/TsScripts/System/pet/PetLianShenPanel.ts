import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { Events } from 'System/Events'
import { PetData } from 'System/data/pet/PetData'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UiElements } from 'System/uilib/UiElements'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { BatBuyView } from "System/business/view/BatBuyView"
import { List } from 'System/uilib/List'



/**
 *飞升，聚神
 */
export class PetLianShenPanel {

    /**最大进度，5次1阶*/
    private readonly STAR_NUM = 5;

    /**炼神按钮*/
    private btnLianShen: UnityEngine.GameObject;
    /**飞升按钮*/
    private btnFeiSheng: UnityEngine.GameObject;
    //材料图标
    private icon0: UnityEngine.GameObject;
    private icon1: UnityEngine.GameObject;
    private icon2: UnityEngine.GameObject;
    private iconItem1: IconItem;
    private iconItem2: IconItem;
    private iconItem3: IconItem;
    private itemIcon_Normal: UnityEngine.GameObject;
    /**增加属性*/
  //  private txtAdd: UnityEngine.UI.Text;
    private txtFeiSheng: UnityEngine.UI.Text;
    /**5个进度点*/
    private path: UnityEngine.GameObject;
    private starObjs: UnityEngine.GameObject[] = [];
    private lianshenEffects: UIEffect[] = [];
    private buleBoomEffect: UnityEngine.GameObject;

    /**选中的伙伴id*/
    private m_petID: number = 0;
    private m_petInfo: Protocol.NewBeautyInfo;
    private m_petConfig: GameConfig.BeautyAttrM;
    private m_petLianshenConfig: GameConfig.HongYanJuShenConfigM;
    private m_nextLianshenConfig: GameConfig.HongYanJuShenConfigM;
    /**炼神消耗的材料*/
    private m_lianshenCostData1: MaterialItemData = new MaterialItemData();
    private m_lianshenCostData2: MaterialItemData = new MaterialItemData();
    /**飞升消耗的材料*/
    private m_feishengCostData: MaterialItemData = new MaterialItemData();
    /**是否激活了*/
    private m_isActive: boolean = false;

    private jushenAltas: Game.UGUIAltas;
    private stageImg: UnityEngine.UI.Image;

    private list: List;

    setView(uiElems: UiElements) {
        this.btnLianShen = uiElems.getElement("btnLianShen");
        this.btnFeiSheng = uiElems.getElement("btnFeiSheng");

        //材料图标
        this.itemIcon_Normal = uiElems.getElement("itemIcon_Normal");
        this.icon0 = uiElems.getElement("icon0");
        this.icon1 = uiElems.getElement("icon1");
        this.icon2 = uiElems.getElement("icon2");
        this.iconItem1 = new IconItem();
        this.iconItem1.setUsualIconByPrefab(this.itemIcon_Normal, this.icon0);
        this.iconItem1.setTipFrom(TipFrom.normal);
        this.iconItem2 = new IconItem();
        this.iconItem2.setUsualIconByPrefab(this.itemIcon_Normal, this.icon1);
        this.iconItem2.setTipFrom(TipFrom.normal);
        this.iconItem3 = new IconItem();
        this.iconItem3.setUsualIconByPrefab(this.itemIcon_Normal, this.icon2);
        this.iconItem3.setTipFrom(TipFrom.normal);

       // this.txtAdd = uiElems.getText("txtAdd");
        this.txtFeiSheng = uiElems.getText("txtFeiSheng");
        this.list = uiElems.getUIList("list");

        this.buleBoomEffect = uiElems.getElement("buleBoomEffect");
        this.path = uiElems.getElement("path");
        for (let i: number = 0; i < this.STAR_NUM; i++) {
            let light = this.path.transform.Find(i + "/" + i);
            this.starObjs.push(light.gameObject);
            //特效
            let effcetRoot = this.path.transform.Find(i.toString());
            this.lianshenEffects[i] = new UIEffect();
            this.lianshenEffects[i].setEffectPrefab(this.buleBoomEffect, effcetRoot.gameObject);

        }
        this.jushenAltas = uiElems.getElement('jushenAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;;
        this.stageImg = uiElems.getImage('stageImg');

        Game.UIClickListener.Get(this.btnLianShen).onClick = delegate(this, this.onBtnLianshenClick);
        Game.UIClickListener.Get(this.btnFeiSheng).onClick = delegate(this, this.onBtnFeishengClick);
    }


    private onBtnLianshenClick(): void {

        let stage = PetData.getPetStage(this.m_petInfo.m_uiStage, this.m_petInfo.m_iBeautyID);
        // 聚神几阶
        let num = Math.floor(PetData.getJushenStage(this.m_petInfo.m_stJuShen.m_uiLevel));
        if (stage < num) {
            G.TipMgr.addMainFloatTip('伙伴等阶过低，请先升级伙伴等阶');
            return;
        }

        if (this.m_lianshenCostData2.has >= this.m_lianshenCostData2.need) {
            if (this.m_lianshenCostData1.has >= this.m_lianshenCostData1.need) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetShuhunRequest(this.m_petID, 0));
            } else {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_lianshenCostData1.id, 1);
            }
        } else {
            G.TipMgr.addMainFloatTip('伙伴碎片不足，无法炼神！');
        }

        //if (this.m_lianshenCostData1.has >= this.m_lianshenCostData1.need && this.m_lianshenCostData2.has >= this.m_lianshenCostData2.need) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetShuhunRequest(this.m_petID, 0));
        //}
        //else {
        //    G.TipMgr.addMainFloatTip('炼神材料不足，无法炼神！');
        //}
    }

    private onBtnFeishengClick(): void {
        if (this.m_feishengCostData.has >= this.m_feishengCostData.need) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetShuhunRequest(this.m_petID, 1));
        }
        else {
           // G.TipMgr.addMainFloatTip('飞升材料不足，无法飞升！');
           // G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_feishengCostData.id, 1);
        }
    }

    /**
     * 飞升与炼神图标的显示
     * @param isFeiSheng
     */
    private showFeiShengIcon(isFeiSheng: boolean) {
        this.icon0.SetActive(!isFeiSheng);
        this.icon1.SetActive(!isFeiSheng);
        this.icon2.SetActive(isFeiSheng);
    }


    /**
   * 停止聚神的特效
   */
    stopLianShenEffect() {
        for (let i: number = 0; i < this.STAR_NUM; i++) {
            this.lianshenEffects[i].stopEffect();
        }
    }

    playLianShenEffect(index: number, callback: () => void = null) {
        this.lianshenEffects[index].playEffect(EffectType.Effect_Normal,true);
    }


    /**
     *面板刷新 
     * 
     */
    updatePanel(petID: number): void {

        this.m_petID = petID;
        this.m_petInfo = G.DataMgr.petData.getPetInfo(this.m_petID);
        this.m_isActive = G.DataMgr.petData.isPetActive(this.m_petID);
        this.m_petConfig = PetData.getPetConfigByPetID(this.m_petID);


    
        let length: number = 0;
        // 聚神几阶
        let jushenStage = Math.floor(PetData.getJushenStage(this.m_petInfo.m_stJuShen.m_uiLevel));
        let jushenLv = this.m_petInfo.m_stJuShen.m_uiLevel;
        this.stageImg.sprite = this.jushenAltas.Get(jushenStage.toString());

        if (this.m_isActive) {

            this.m_petLianshenConfig = PetData.getFeishengConfig(this.m_petID, jushenLv == 0 ? 1 : jushenLv);
            this.m_nextLianshenConfig = PetData.getFeishengConfig(this.m_petID, jushenLv == 0 ? 2 : jushenLv + 1);

            if (this.m_nextLianshenConfig != null) {
                this.m_lianshenCostData1.id = this.m_nextLianshenConfig.m_iConsumableID;
                this.m_lianshenCostData2.id = this.m_nextLianshenConfig.m_iConsumID2
                this.m_lianshenCostData1.need = this.m_nextLianshenConfig.m_iConsumableNumber;
                this.m_lianshenCostData2.need = this.m_nextLianshenConfig.m_iConsumNum2;

                //2个按钮显示
                UIUtils.setButtonClickAble(this.btnLianShen, true);
                UIUtils.setButtonClickAble(this.btnFeiSheng, true);
                this.btnLianShen.SetActive(true);
                this.btnFeiSheng.SetActive(true);

                length = this.m_nextLianshenConfig.m_astProp.length;
                this.list.Count = length;
                for (let i: number = 0; i < length; i++) {
                    if (this.m_nextLianshenConfig.m_astProp[i].m_iPropValue > this.m_petLianshenConfig.m_astProp[i].m_iPropValue) {
                        let name =  KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, this.m_nextLianshenConfig.m_astProp[i].m_ucPropId);
                        let value =(this.m_nextLianshenConfig.m_astProp[i].m_iPropValue - this.m_petLianshenConfig.m_astProp[i].m_iPropValue).toString();
                    
                        let item = this.list.GetItem(i);
                        let txtName = item.findText("txtName");
                        let txtValue = item.findText("txtValue");
                        txtName.text = name;
                        txtValue.text = value;
                    }
                }
            }
            else {
                this.m_lianshenCostData1.id = 0;
                this.m_lianshenCostData1.need = 0;
                this.m_lianshenCostData2.id = 0;
                this.m_lianshenCostData2.need = 0;
                UIUtils.setButtonClickAble(this.btnLianShen, false);
                UIUtils.setButtonClickAble(this.btnFeiSheng, false);
               // this.txtAdd.text = "";
                this.list.Count = 0;
            }

            let star = PetData.getJushenStar(jushenLv);
            for (let i = 0; i < this.STAR_NUM; i++) {
                if (i < star) {
                    this.starObjs[i].SetActive(true);
                }
                else {
                    this.starObjs[i].SetActive(false);
                }
            }

        }
        else {
            for (let i = 0; i < this.STAR_NUM; i++) {
                this.starObjs[i].SetActive(false);
            }
            this.m_nextLianshenConfig = PetData.getFeishengConfig(this.m_petID, 2);
            this.m_lianshenCostData1.id = this.m_petLianshenConfig.m_iConsumableID;
            this.m_lianshenCostData2.id = this.m_petLianshenConfig.m_iConsumID2;
            this.m_lianshenCostData1.need = this.m_petLianshenConfig.m_iConsumableNumber;
            this.m_lianshenCostData2.need = this.m_petLianshenConfig.m_iConsumNum2;

        }


        let level: number = Math.floor(PetData.getCanFeishengLv(this.m_petID) / 5);

        if (this.m_petInfo.m_stJuShen.m_uiLevel >= PetData.getCanFeishengLv(this.m_petID)) {

            this.stopLianShenEffect();
            this.btnLianShen.SetActive(false);
            this.btnFeiSheng.SetActive(true);

            this.showFeiShengIcon(true);
            this.m_feishengCostData.id = this.m_petLianshenConfig.m_iFSConsumID;
            this.m_feishengCostData.need = this.m_petLianshenConfig.m_iFSConsumNum;

            if (this.m_petInfo.m_stFeiSheng.m_ucNum < this.m_petConfig.m_iFSCntLimit) {
                this.txtFeiSheng.text = "已满阶满星，可飞升";
                UIUtils.setButtonClickAble(this.btnFeiSheng, true);
            } else {
                this.txtFeiSheng.text = "已达到最大可飞升次数";
                UIUtils.setButtonClickAble(this.btnFeiSheng, false);
            }

          
        }
        else {
            this.txtFeiSheng.text = (uts.format('{0}炼神{1}阶满星可飞升',
                TextFieldUtil.getColorText(this.m_petConfig.m_szBeautyName, Color.getColorById(this.m_petConfig.m_ucColor)),
                TextFieldUtil.getColorText(level.toString(), Color.GREEN)));

            this.m_feishengCostData.id = 0;
            this.m_feishengCostData.need = 0;
            this.btnFeiSheng.SetActive(false);
            this.btnLianShen.SetActive(true);

            this.showFeiShengIcon(false);

        }

        this.onBagChange(Macros.CONTAINER_TYPE_ROLE_BAG);
    }


    private updateMaterialIcon() {
        //炼神的2个材料图标
        this.iconItem1.updateByMaterialItemData(this.m_lianshenCostData1);
        this.iconItem1.updateIcon();
        this.iconItem2.updateByMaterialItemData(this.m_lianshenCostData2);
        this.iconItem2.updateIcon();
        //飞升材料
        this.iconItem3.updateByMaterialItemData(this.m_feishengCostData);
        this.iconItem3.updateIcon();
    }


    onBagChange(type: number): void {
        if (type != Macros.CONTAINER_TYPE_ROLE_BAG) {
            return;
        }

        let color: string = "";
        let color2: string = "";
        if (this.m_lianshenCostData1.id > 0) {
            this.m_lianshenCostData1.has = G.DataMgr.thingData.getThingNum(this.m_lianshenCostData1.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            this.m_lianshenCostData2.has = G.DataMgr.thingData.getThingNum(this.m_lianshenCostData2.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

        }

        if (this.m_feishengCostData.id > 0) {
            this.m_feishengCostData.has = G.DataMgr.thingData.getThingNum(this.m_feishengCostData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        }
        UIUtils.setButtonClickAble(this.btnFeiSheng, this.m_feishengCostData.has >= this.m_feishengCostData.need && this.m_feishengCostData.has!=0);
        this.updateMaterialIcon();
    }

}
