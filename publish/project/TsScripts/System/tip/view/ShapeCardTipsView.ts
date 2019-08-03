import { NestedForm } from 'System/uilib/NestedForm'
import { UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from "System/data/UIPathData"
import { ITipData } from 'System/tip/tipData/ITipData'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { Global as G } from 'System/global'
import { KeyWord } from "System/constants/KeyWord"
import { ThingData } from "System/data/thing/ThingData"
import { UnitCtrlType } from 'System/constants/GameEnum'
import { List } from 'System/uilib/List'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { RegExpUtil } from "System/utils/RegExpUtil"
import { ElemFinder } from 'System/uilib/UiUtility'
import { PetData } from 'System/data/pet/PetData'
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { SkillData } from 'System/data/SkillData'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipView } from 'System/vip/VipView'
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';



class ShapeCardPropItem {
    private textName: UnityEngine.UI.Text;
    private textValue: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, "TextName");
        this.textValue = ElemFinder.findText(go, "TextValue");
    }

    update(propName:string,propValue )
    {
        this.textName.text = propName+":";
        this.textValue.text = TextFieldUtil.getColorText(propValue, Color.GREEN);
    }
}

export class ShapeCardTipsView extends NestedForm
{
    /**幻化等级*/
    private TextHierarchy: UnityEngine.UI.Text;
    private TextFight: UnityEngine.UI.Text;
    private propList: List;
    private thingDes: UnityEngine.UI.Text;
    private specDes: UnityEngine.UI.Text;
    private modelRootHero: UnityEngine.GameObject;
    private modelRootPet: UnityEngine.GameObject;
    private modelRootRide: UnityEngine.GameObject;
    private modelRootTitle: UnityEngine.GameObject;
    private modelRootZhenFa: UnityEngine.GameObject;
    private modelRootWing: UnityEngine.GameObject; 
    private modelRootShenQiWomen: UnityEngine.GameObject;
    private modelRootShenQiMan: UnityEngine.GameObject;
    private modelRootShenJi: UnityEngine.GameObject;
    private modelRootShengQi: UnityEngine.GameObject;
    private skillDesPanel:UnityEngine .GameObject ;
    private tipData: GameConfig.ThingConfigM;
    private mask: UnityEngine.GameObject;
    private titleText: UnityEngine.UI.Text;
    private name: UnityEngine.UI.Text;
    private skillType: UnityEngine.UI.Text;
    private skillDes: UnityEngine.UI.Text;
    private nqSkillIcon: UnityEngine.GameObject;
    private skillIcon_Normal: UnityEngine.GameObject;
    private btnShow: UnityEngine.GameObject;
    private roleAvatar: UIRoleAvatar;
    private petAvatar: PetAvatar;
    private NQSkillItem: SkillIconItem;
    private m_avatarList: Protocol.AvatarList = null;
    private ShapeCardPropItems: ShapeCardPropItem[] = [];
    private useType: number = 0;
    private level: number = 0;
    private tipFrom: TipFrom;
    private thingInfo: Protocol.ContainerThingInfo;
    private returnBtn: GameObjectGetSet;


    private readonly MaxListCount = 9;
    constructor(){
        super(0);
    }

    layer(){
        return UILayer.OnlyTip;
    }

    protected resPath(): string {
       return  UIPathData.ShapeCardTipsView;
    }


    protected initElements(){
        this.mask = this.elems.getElement('mask');
        this.titleText = this.elems.getText('titleText');
        this.name = this.elems.getText('TextName');
        this.propList = this.elems.getUIList('propList');
        this.TextFight = this.elems.getText('TextFight');
        this.TextHierarchy = this.elems.getText('TextHierarchy');
        this.thingDes = this.elems.getText('thingDes');
        this.specDes = this.elems.getText('specDes');
        this.skillDesPanel = this.elems.getElement('skillDesPanel');
        let skillDesPanelElem = this.elems.getUiElements('skillDesPanel');
        this.skillType = skillDesPanelElem.getText('skillType');
        this.skillDes = skillDesPanelElem.getText('skillDes');
        this.nqSkillIcon = skillDesPanelElem.getElement('nqSkillIcon');
        this.skillIcon_Normal = this.elems.getElement('skillIcon_Normal');
        this.btnShow = this.elems.getElement('btnShow');
        this.NQSkillItem = new SkillIconItem(false);
        this.NQSkillItem.needShowLv = false ;
        this.NQSkillItem.needArrow = false ;
        this.NQSkillItem.setUsuallyByPrefab(this.skillIcon_Normal, this.nqSkillIcon);
        
        this.modelRootHero = this.elems.getElement('modelRootHero');
        this.modelRootPet = this.elems.getElement('modelRootPet');
        this.modelRootRide = this.elems.getElement( 'modelRootRide');
        this.modelRootTitle = this.elems.getElement( 'modelRootTitle');
        this.modelRootZhenFa = this.elems.getElement( 'modelRootZhenFa');
        this.modelRootWing = this.elems.getElement('modelRootWing');
        this.modelRootShenQiWomen = this.elems.getElement('modelRootShenQiWomen');
        this.modelRootShenQiMan = this.elems.getElement('modelRootShenQiMan');
        this.modelRootShenJi = this.elems.getElement('modelRootShenJi');
        this.modelRootShengQi = this.elems.getElement('modelRootShengQi');
        this.returnBtn = new GameObjectGetSet(this.elems.getElement("returnBtn"));

    }

    protected initListeners(){
        
        this.addClickListener(this.mask, this.onClickReturnBtn);
        this.addClickListener(this.btnShow, this.onClickBtnShow);
        this.addClickListener(this.returnBtn.gameObject, this.onClickReturnBtn);

    }


    open(tipData: GameConfig.ThingConfigM, type: number, from: TipFrom, thingInfo: Protocol.ContainerThingInfo, level ?: number) {
        this.tipFrom = from;
        this.tipData = tipData;
        this.useType = type;
        this.thingInfo = thingInfo;
        this.level = level != undefined ? level : 0;
        super.open();
    }

    protected onOpen(){
        this.setVipOrderLayer();
        this.btnShow.SetActive(this.tipFrom == TipFrom.chat);

        let modelTransform: UnityEngine.GameObject;
        let propData = [];
        let unitType: number = 0;
        this.skillDesPanel.SetActive(this.useType == KeyWord.ITEM_FUNCTION_BEAUTY_CARD);
        this.TextHierarchy.gameObject.SetActive(this.useType == KeyWord.ITEM_FUNCTION_SUBIMAGE); 
        //幻化
        if (this.useType == KeyWord.ITEM_FUNCTION_SUBIMAGE) {
            let zhufuData = G.DataMgr.zhufuData;
            //化形
            let data = zhufuData.getImageConfig(zhufuData.getImageLevelID(this.tipData.m_iFunctionID, 1));
            propData = data.m_astProp;
            this.TextFight.text = "战斗力" +  FightingStrengthUtil.calStrength(data.m_astProp);
            let modelId: string = '';
            if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                //契约兽
                unitType = UnitCtrlType.ride;
                modelId = data.m_iModelID.toString();
                modelTransform = this.modelRootRide;
            }
            else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN) {
                //神器
                unitType = UnitCtrlType.weapon;
                modelId = uts.format('{0}_{1}', data.m_iModelID, G.DataMgr.heroData.profession);
                if (G.DataMgr.heroData.profession == 1) {
                    modelTransform = this.modelRootShenQiWomen;
                } else {
                    modelTransform = this.modelRootShenQiMan;
                }
            }
            else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_FAZHEN) {
                //阵法
                unitType = UnitCtrlType.zhenfa;
                modelId = data.m_iModelID.toString();
                modelTransform = this.modelRootZhenFa;
            }
            else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_YUYI) {
                //灵翼
                unitType = UnitCtrlType.wing;
                modelId = data.m_iModelID.toString();
                modelTransform = this.modelRootWing;
                this.TextHierarchy.gameObject.SetActive(false); 
            }
            else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_LEILING) {
                //神迹
                unitType = UnitCtrlType.shenji;
                modelId = data.m_iModelID.toString();
                modelTransform = this.modelRootShenJi;
            }
            G.ResourceMgr.loadModel(modelTransform, unitType, modelId, this.sortingOrder, true);
            this.setHierarchy();
        }
        //时装
        else if (this.useType == KeyWord.ITEM_FUNCTION_DRESS_IMAGE) {

            modelTransform = this.modelRootHero;
            if (this.roleAvatar == null) {

                this.roleAvatar = new UIRoleAvatar(this.modelRootHero.transform, this.modelRootHero.transform);
                this.m_avatarList = uts.deepcopy(G.DataMgr.heroData.avatarList, this.m_avatarList, true);
                this.roleAvatar.hasWing = false;
                this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
                this.roleAvatar.setSortingOrder(this.sortingOrder);
            }
            let modelId = uts.format('{0}{1}{2}', this.tipData.m_iFunctionID, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
            let data = ThingData.getDressImageConfig(Number(modelId));
            propData = data.m_astProp;
            this.TextFight.text = "战斗力" + FightingStrengthUtil.calStrength(data.m_astProp);
            this.m_avatarList.m_uiDressImageID = data.m_uiImageId;
            this.roleAvatar.setAvataByList(this.m_avatarList, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
        }
        //武缘
        else if (this.useType == KeyWord.ITEM_FUNCTION_BEAUTY_CARD) {
            modelTransform = this.modelRootPet;
            unitType = UnitCtrlType.pet;
            let data = PetData.getEnhanceConfig(this.tipData.m_iFunctionID, 100);
            
            let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.tipData.m_iFunctionID);
            let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(petConfig.m_uiSkillID);

            if (skillConfig!=null ){
                this.NQSkillItem.updateBySkillID(skillConfig.m_iSkillID);
                this.NQSkillItem .updateIcon();
            }
            this.skillDes.text = RegExpUtil.xlsDesc2Html(skillConfig.m_szDescription);
            this.skillType .text = petConfig.m_szShowDesc;
            this.TextFight.text = "战斗力" +  FightingStrengthUtil.calPetFight(data.m_astAttrList);
            propData = data.m_astAttrList; 
            G.ResourceMgr.loadModel(modelTransform, unitType, data.m_iModelID.toString(), this.sortingOrder, true);
        }
        //翅膀
        else if (this.useType == KeyWord.ITEM_FUNCTION_WING_SHOW) {
            modelTransform = this.modelRootWing;
            unitType = UnitCtrlType.wing;
            let data: GameConfig.WingStrengthM;
            if (this.level == 0) {
                data = G.DataMgr.equipStrengthenData.getWingStrengthCfg(this.tipData.m_iFunctionID, 1);
            }
            else {
                data = G.DataMgr.equipStrengthenData.getWingStrengthCfg(this.tipData.m_iFunctionID, this.level);
            }
            
            propData = data.m_astPropAtt;
            this.TextFight.text ="战斗力"+ FightingStrengthUtil.calStrength(data.m_astPropAtt);
            G.ResourceMgr.loadModel(modelTransform, unitType, data.m_iModelID.toString(), this.sortingOrder, true);
        }
       

        if (this.useType == KeyWord.ITEM_FUNCTION_WING_SHOW) {
            this.thingDes.text = RegExpUtil.xlsDesc2Html(this.tipData.m_szOutput);
            this.titleText.text = '羽翼'; 
        }
        else {
            this.thingDes.text = RegExpUtil.xlsDesc2Html(this.tipData.m_szOutput);
            this.titleText.text = RegExpUtil.xlsDesc2Html(this.tipData.m_szUse); 
        }
        this.hideModelRoot(modelTransform);
        this.specDes.text = RegExpUtil.xlsDesc2Html(this.tipData.m_szSpecDesc);
        this.name.text = this.tipData.m_szName;
        this.updateProp(propData,this.useType);
            
    }

    private setHierarchy() {
        if (this.useType != KeyWord.ITEM_FUNCTION_SUBIMAGE) {
            return;
        }
        if (this.level != 0) {
            let pyLevel = uts.format("{0}阶", this.level);
            this.TextHierarchy.text = pyLevel;
        } else {
            this.TextHierarchy.text = '未激活'
        }   
    }

    private hideModelRoot(go: UnityEngine.GameObject){
        this.modelRootHero.SetActive(this.modelRootHero == go);
        this.modelRootRide.SetActive(this.modelRootRide == go);
        this.modelRootZhenFa.SetActive(this.modelRootZhenFa == go);
        this.modelRootShenQiWomen.SetActive(this.modelRootShenQiWomen == go);
        this.modelRootShenQiMan.SetActive(this.modelRootShenQiMan == go);
        this.modelRootWing.SetActive(this.modelRootWing == go);
        this.modelRootShenJi.SetActive(this.modelRootShenJi == go);
        this.modelRootShengQi.SetActive(this.modelRootShengQi == go);
        this.modelRootPet.SetActive(this.modelRootPet == go );
    }

    private updateProp(propData: any,useType:number ){
        let propListCount: number = 0;
        if (propData.length > this.MaxListCount){
            propListCount = this.MaxListCount;
        }
        else{
            propListCount = propData.length;
        }

        this.propList.Count = propListCount;
        for (let i = 0; i < propListCount; i++){
            if (this.ShapeCardPropItems[i] == null){
                let item = this.propList.GetItem(i).gameObject;
                this.ShapeCardPropItems[i] = new ShapeCardPropItem();
                this.ShapeCardPropItems[i].setComponents(item);
            }
            let propName: string = '';
            let propValue: string = '';

            if (useType == KeyWord.ITEM_FUNCTION_SUBIMAGE || this.useType == KeyWord.ITEM_FUNCTION_DRESS_IMAGE || this.useType == KeyWord.ITEM_FUNCTION_WING_SHOW){
                propName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[i].m_ucPropId);
                propValue = propData[i].m_ucPropValue; 
            }
            else if (this.useType == KeyWord.ITEM_FUNCTION_BEAUTY_CARD){
                propName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[i].m_ucPropId);
                propValue = propData[i].m_iPropValue;  
            }
            else if (this.useType == KeyWord.ITEM_FUNCTION_SQ_CARD){
                propName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[i].m_ucPropName);
                propValue = propData[i].m_iPropValue;      
            }       

            this.ShapeCardPropItems[i].update(propName, propValue);
        }
    }

    /**Vip商城的物品Tips判断(注:Vip的面板比tips层级高，导致tips显示会被遮挡住)*/
    private setVipOrderLayer() {
        let vipiew = G.Uimgr.getForm<VipView>(VipView);
        if (vipiew != null) {
            this.canvas.sortingOrder = vipiew.canvas.sortingOrder + 10; //canvas层级设置
            this.form.transform.localPosition = G.getCacheV3(0, 0, -10000);
        }
        else {
            this.form.transform.localPosition = G.getCacheV3(0, 0, 0);
        }
    }

    protected onClose(){
        if (this.roleAvatar != null){
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }      
    }

    private onClickBtnShow() {
        if (this.thingInfo == null) return;
        G.ModuleMgr.chatModule.appendItemText(this.tipData, this.thingInfo.m_stThingProperty.m_stGUID);
        this.close();
    }

    private onClickReturnBtn() {
        this.close();
    }
}