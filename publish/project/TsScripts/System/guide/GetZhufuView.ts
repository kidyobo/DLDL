import { EnumGuide, UnitCtrlType } from "System/constants/GameEnum";
import { TypeCacher } from "System/TypeCacher"
import { KeyWord } from "System/constants/KeyWord";
import { ThingData } from "System/data/thing/ThingData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { GetZhufuGuider, GetZhufuVar } from "System/guide/cases/GetZhufuGuider";
import { IGuideExecutor } from "System/guide/IGuideExecutor";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { DataFormatter } from 'System/utils/DataFormatter'

export class GetZhufuView extends CommonForm implements IGuideExecutor {

    /**装备按钮。*/
    btnEquip: UnityEngine.GameObject;

    content: UnityEngine.GameObject;


    private modelTransMap: { [subType: number]: UnityEngine.GameObject } = {};
    private poemMap: { [subType: number]: UnityEngine.GameObject } = {};
    private modelTypeMap: { [subType: number]: UnitCtrlType } = {};
    private textDesMap: { [subType: number]: string } = {};

    private mask: UnityEngine.GameObject;

    private lastModelStr: string;

    private crtFuncVar: GetZhufuVar = new GetZhufuVar();

    private openSubType = 0;

    private showPoem: boolean = false;

    private textName: UnityEngine.UI.Text;
    private textDes: UnityEngine.UI.Text;
    /**时装avatarList*/
    private roleRoot: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;
    private relateId: number = 0;
    /**名称*/
    private name: string;
    private shenqiRoot: UnityEngine.GameObject;
    private shenqiRoot1: UnityEngine.GameObject;

    private canvasGroup: UnityEngine.CanvasGroup;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GetZhufuView;
    }

    protected initElements(): void {
        this.content = this.elems.getElement('content');
        this.textDes = this.elems.getText('textDes');
        this.textName = this.elems.getText('textName');
        this.btnEquip = this.elems.getElement('btnEquip');
        this.shenqiRoot = this.elems.getElement('shenqiRoot');
        this.shenqiRoot1 = this.elems.getElement("shenqiRoot1");

        this.modelTransMap[KeyWord.HERO_SUB_TYPE_ZUOQI] = this.elems.getElement('mountRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_YUYI] = this.elems.getElement('wingRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_SHENGLING] = this.elems.getElement('shenglingRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_FAZHEN] = this.elems.getElement('zhenfaRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_WUHUN] = this.elems.getElement('shenqiRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_JINGLING] = this.elems.getElement('lingbaoRoot');
        this.modelTransMap[KeyWord.HERO_SUB_TYPE_LEILING] = this.elems.getElement('shenjiRoot');
        this.modelTransMap[KeyWord.BAR_FUNCTION_BEAUTY] = this.modelTransMap[KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION] = this.elems.getElement('roleRoot');

        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_ZUOQI] = UnitCtrlType.ride;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_YUYI] = UnitCtrlType.wing;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_SHENGLING] = UnitCtrlType.shengling;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_FAZHEN] = UnitCtrlType.zhenfa;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_WUHUN] = UnitCtrlType.wuhun;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_JINGLING] = UnitCtrlType.lingbao;
        this.modelTypeMap[KeyWord.HERO_SUB_TYPE_LEILING] = UnitCtrlType.shenji;
        this.modelTypeMap[KeyWord.BAR_FUNCTION_BEAUTY] = UnitCtrlType.pet;

        this.poemMap[KeyWord.HERO_SUB_TYPE_ZUOQI] = this.elems.getElement('poemMount');
        this.poemMap[KeyWord.HERO_SUB_TYPE_YUYI] = this.elems.getElement('poemWing');
        this.poemMap[KeyWord.HERO_SUB_TYPE_SHENGLING] = this.elems.getElement('poemWing');
        this.poemMap[KeyWord.HERO_SUB_TYPE_FAZHEN] = this.elems.getElement('poemZhenfa');
        this.poemMap[KeyWord.HERO_SUB_TYPE_JINGLING] = this.elems.getElement('poemLingbao');
        this.poemMap[KeyWord.HERO_SUB_TYPE_LEILING] = this.elems.getElement('poemShenji');
        this.poemMap[KeyWord.HERO_SUB_TYPE_WUHUN * 100 + KeyWord.PROFTYPE_HUNTER] = this.elems.getElement('poemWeapon' + KeyWord.PROFTYPE_HUNTER);
        this.poemMap[KeyWord.HERO_SUB_TYPE_WUHUN * 100 + KeyWord.PROFTYPE_WARRIOR] = this.elems.getElement('poemWeapon' + KeyWord.PROFTYPE_WARRIOR);

        this.textDesMap[KeyWord.BAR_FUNCTION_BEAUTY] = "伙伴：\n 伙伴是您在斗罗大陆中可靠的战友，他们的能力提升可大幅提升您的战力。";
        this.textDesMap[KeyWord.HERO_SUB_TYPE_WUHUN] = "魂力：\n 斗罗大陆特有的一种能力，魂力越强大战力越强大，而你则是万中无一的先天满魂力。";
        this.textDesMap[KeyWord.HERO_SUB_TYPE_ZUOQI] = "坐骑：\n 坐骑是斗罗大陆中重要的伙伴，进阶坐骑可以适量提升战力。"
        this.mask = this.elems.getElement('mask');
        this.roleRoot = this.elems.getElement('roleRoot').transform;
        this.canvasGroup = this.content.GetComponent(TypeCacher.CanvasGroup) as UnityEngine.CanvasGroup;
    }


    protected initListeners(): void {
        this.addClickListener(this.btnEquip, this.onClickBtnEquip);
        this.addClickListener(this.mask, this.onClickBtnEquip);
    }

    open(subType, showPoem: boolean, relateId: number = 0, name: string = "") {
        this.openSubType = subType;
        this.showPoem = showPoem;
        this.relateId = relateId;
        this.name = name;
        super.open();
    }

    protected onOpen() {
        G.ViewCacher.mainView.canvas.enabled = false;
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.taskViewOpen();
        if (0 == this.crtFuncVar.subType) {
            this.processAfterEquip();
        }

        // 继续指引步骤
        G.GuideMgr.processGuideNext(EnumGuide.GetZhufu, EnumGuide.GetZhufu_OpenView);
        G.GuideMgr.processGuideNext(EnumGuide.ShengLingEnhance, EnumGuide.ShengLingEnhance_ClickAutoEnhance);
        G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickActive);
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_OpenGetZhufu);
        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_OpenGetZhufu);
        this.canvasGroup.alpha = 0;
        let tweenAlpha = Tween.TweenAlpha.Begin(this.content, 0.8, 1);
        tweenAlpha.method = Tween.UITweener.Method.EaseInOut;
    }

    protected onClose() {
        G.ViewCacher.mainView.canvas.enabled = true;
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.taskViewClose();
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        this.crtFuncVar.reset();
        for (let typeKey in this.modelTransMap) {
            G.ResourceMgr.loadModel(this.modelTransMap[typeKey], 0, null, 0);
        }

        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.GetZhufu, EnumGuide.GuideCommon_None);
        //G.GuideMgr.processGuideNext(EnumGuide.Pet, EnumGuide.Pet_ClickGet);
        G.GuideMgr.processGuideNext(EnumGuide.ShengLingEnhance, EnumGuide.ShengLingEnhance_ClickTakeOn);
        G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickTakeOn);
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_ClickAction);
        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_ClickAction);
    }


    private onClickBtnEquip() {
        //如果是第一次获得武器  关闭 因为武器已经自动使用了
        if (KeyWord.HERO_SUB_TYPE_WUHUN == this.openSubType) {
            this.close();
        } else {
            this.processAfterEquip();
        }
    }

    private processAfterEquip() {
        // 如果是精灵要穿上
        if (KeyWord.HERO_SUB_TYPE_JINGLING == this.crtFuncVar.subType) {
            let thingCfg = ThingData.getThingConfig(this.crtFuncVar.thingInfo.m_iThingID);
            let itemData = G.DataMgr.thingData.getBagItemByGuid(this.crtFuncVar.thingInfo.m_iThingID, this.crtFuncVar.thingInfo.m_stThingProperty.m_stGUID);
            if (null != itemData) {
                G.ActionHandler.takeOnEquip(itemData, 0);
            }
        }
        // 检查是否还有装备要显示
        this.crtFuncVar.reset();
        if (this.openSubType > 0) {
            this.crtFuncVar.subType = this.openSubType;
            this.openSubType = 0;
        } else {
            let guider = G.GuideMgr.getCurrentGuider(EnumGuide.GetZhufu) as GetZhufuGuider;
            if (null != guider) {
                let nextVar = guider.getNextFuncVar();
                if (null != nextVar) {
                    this.crtFuncVar = nextVar;
                }
            }
        }
        if (this.crtFuncVar.subType > 0) {
            this._updateView();
        }
        else {
            // 取消任务聚焦
            this.close();
        }
    }

    private _updateView(): void {
        let subType = this.crtFuncVar.subType;
        if (KeyWord.BAR_FUNCTION_BEAUTY != subType) {
            G.AudioMgr.playSound(uts.format('sound/functionDes/{0}.mp3', subType));
        }
        let modelstr: string;
        let name = "";
        if (KeyWord.HERO_SUB_TYPE_JINGLING == subType) {
            // 精灵不属于祝福系统
            let lingbaoId = this.crtFuncVar.thingInfo.m_iThingID;
            let thingCfg = ThingData.getThingConfig(lingbaoId);
            let equipCfg = ThingData.getThingConfig(lingbaoId);
            modelstr = equipCfg.m_iModelID.toString();
            //zdl = FightingStrengthUtil.getStrengthByEquip(thingCfg, this.crtFuncVar.thingInfo.m_stThingProperty.m_stSpecThingProperty);
            name = thingCfg.m_szName;
        }
        else if (KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION == subType) {
            modelstr = this.relateId.toString();
            //zdl = this.fight;
            name = this.name;
        }
        else if (KeyWord.BAR_FUNCTION_BEAUTY == subType) {
            modelstr = G.DataMgr.petData.getPetModleID(this.relateId, 0).toString();
            //zdl = this.fight;
            name = "少年唐三";
        }
        else if (KeyWord.HERO_SUB_TYPE_YUYI == subType) {
            //翅膀改成装备，也不属于祝福系统
            modelstr = this.relateId.toString();
            //zdl = this.fight;
            name = this.name;
        }

        else {
            let heroData = G.DataMgr.heroData;
            let subLevel: number[] = heroData.avatarList.m_auiSubLevel;
            if (subType <= subLevel.length) {
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(subType);
                if (null != data) {
                    let config = G.DataMgr.zhufuData.getConfig(subType, data.m_ucLevel > 0 ? data.m_ucLevel : 1);
                    if (null == config) {
                        this.processAfterEquip();
                        return;
                    }
                    if (KeyWord.HERO_SUB_TYPE_ZUOQI == subType) {
                        name = "坐骑";
                    }
                    modelstr = config.m_iModelID.toString();
                    
                    //zdl = FightingStrengthUtil.calStrength(config.m_astAttrList);
                }
            }
        }

        if (KeyWord.HERO_SUB_TYPE_WUHUN == this.crtFuncVar.subType ) {
            //name = "魂力";
            if (G.DataMgr.heroData.profession == 1) {
                //职业是器魂女
                name = "七杀剑";
                this.shenqiRoot.SetActive(true);
            }else{
                //职业是兽魂男
                name = "蓝电霸王龙";
                this.shenqiRoot.SetActive(true);
            }
        } else {
            this.shenqiRoot.SetActive(false);
            this.shenqiRoot1.SetActive(false);
        }
        this.textDes.text = this.textDesMap[subType];
        let modelTrans = this.modelTransMap[subType];
        for (let typeKey in this.modelTransMap) {
            let tmpTrans = this.modelTransMap[typeKey];
            tmpTrans.gameObject.SetActive(tmpTrans == modelTrans);
        }
        // 显示诗句
        //let poemGo: UnityEngine.GameObject;
        //if (this.showPoem) {
        //    if (KeyWord.HERO_SUB_TYPE_WUHUN == subType) {
        //        poemGo = this.poemMap[KeyWord.HERO_SUB_TYPE_WUHUN * 100 + G.DataMgr.heroData.profession];
        //    } else {
        //        poemGo = this.poemMap[subType];
        //    }
        //}
        for (let typeKey in this.poemMap) {
            let tmpGo = this.poemMap[typeKey];
            //tmpGo.gameObject.SetActive(tmpGo == poemGo);
            tmpGo.gameObject.SetActive(false);
        }
        // 更新名称
        this.textName.text = name;
        // 显示模型
        if (modelstr != this.lastModelStr) {
            this.lastModelStr = modelstr;
            if (subType == KeyWord.HERO_SUB_TYPE_WUHUN) {
        
                if (G.DataMgr.heroData.profession == 1) {
                    G.ResourceMgr.loadModel(this.shenqiRoot1, this.modelTypeMap[subType], modelstr + "_" + G.DataMgr.heroData.profession, this.sortingOrder, true);
                } else {
                    G.ResourceMgr.loadModel(this.shenqiRoot, this.modelTypeMap[subType], modelstr + "_" + G.DataMgr.heroData.profession, this.sortingOrder, true);
                }
               
            }
            else if (subType == KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) {
                this.setRoleAvaterStage(this.relateId);
            }
            else {
                G.ResourceMgr.loadModel(modelTrans, this.modelTypeMap[subType], modelstr, this.sortingOrder, true);
            }
        }
    }

    /**
     * 时装模型展示
     * @param dressId
     */
    private setRoleAvaterStage(dressId: number): void {
        let heroData = G.DataMgr.heroData;
        //时装显示
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        this.m_avatarList.m_uiDressImageID = dressId;
        if (this.roleAvatar == null) {
            this.roleRoot.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.roleAvatar = new UIRoleAvatar(this.roleRoot, this.roleRoot);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender);
    }


    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        // 自动点击装备按钮
        //先不用这里强制执行，用定时器强制关闭解决BUG
        if (EnumGuide.GuideCommon_None == step ||
            EnumGuide.ShengLingEnhance_ClickTakeOn == step ||
            EnumGuide.ShenZhuangShouJi_ClickTakeOn == step ||
            EnumGuide.PetActivate_OpenPetView == step ||
            EnumGuide.PetActivate_ClickAction == step ||
            EnumGuide.WuHunActivate_ClickAction == step
            ) {
            this.onClickBtnEquip();
            return true;
        }
        return false;
    }
}