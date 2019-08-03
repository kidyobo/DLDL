import { EnumEffectRule, EnumGuide, GameIDType, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { AchievementData } from 'System/data/AchievementData';
import { PetData } from 'System/data/pet/PetData';
import { SkillData } from 'System/data/SkillData';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { BeautyEquipListItemData } from 'System/data/vo/BeautyEquipListItemData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { PetJuexingPanel } from "System/ItemPanels/PetJuexingPanel";
import { PetPreviewView } from 'System/pet/view/PetPreviewView';
import { PetPropItem } from 'System/pet/view/PetPropItem';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TextTipData } from 'System/tip/tipData/TextTipData';
import { TipFrom } from 'System/tip/view/TipsView';
import { EffectType, UIEffect } from "System/uiEffect/UIEffect";
import { GroupList } from 'System/uilib/GroupList';
import { IconItem } from 'System/uilib/IconItem';
import { ListItem } from 'System/uilib/List';
import { NestedSubForm } from 'System/uilib/NestedForm';
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { ElemFinder } from 'System/uilib/UiUtility';
import { PetAvatar } from 'System/unit/avatar/PetAvatar';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { GameObjectGetSet } from '../uilib/CommonForm';


/**选择伙伴优先级*/
export enum PetTipMarkType {
    /**出战的*/
    None = 0,
    Active,
    JinJie,
    Skill,
    JuShen,
    Equip,
    MergeEquip,
    Expedition,
    Awaken,
}

export enum PetJinJieFuncTab {
    jinjie = 0,
    skill = 1,
    juexing = 2,
    lianShen = 3,
    none = 99,
}

/**
 * 此面板进阶、求缘合用，其中左侧列表和中间美人属于公共部分。
 */
export class PetJinJiePanel extends NestedSubForm implements IGuideExecutor {

    private typeDate: { [des: string]: string } = null;

    /**自动强化时间间隔*/
    private readonly deltaTime: number = 500;

    private readonly starEffectScale = 0.6;
    //美人数量
    private petCount: number = 0;
    private readonly maxPropCnt: number = 12;
    private readonly skillCnt: number = 4;
    private readonly propCnt: number = 12;
    private readonly jinJieLvCnt: number = 10;
    /**伙伴最大阶级15阶*/
    private readonly maxStage: number = 15;

    private readonly equipParts: number[] = [KeyWord.EQUIP_PARTCLASS_ARMET, KeyWord.EQUIP_PARTCLASS_NECKLACE,
    KeyWord.EQUIP_PARTCLASS_ARMOUR, KeyWord.EQUIP_PARTCLASS_BANGLE, KeyWord.EQUIP_PARTCLASS_BINHUN, KeyWord.EQUIP_PARTCLASS_BRACELET];

    ///////////////////////////////// 公共部分 /////////////////////////////////

    private funcGroup: UnityEngine.UI.ActiveToggleGroup;
    private btnJuexingTip: UnityEngine.GameObject;

    /**图标模板*/
    private equipSlotIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private skillIcon_Normal: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;
    private textTip: GameObjectGetSet;
    private petStage: number = 0;

    /**美人模型*/
    private petModelCtn: UnityEngine.GameObject;
    private petAvatar: PetAvatar;
    private lastAvatarKey: string;
    /**出战按钮*/
    private btnFight: UnityEngine.GameObject;

    /**武缘类型*/
    private imgType: UnityEngine.UI.Image;

    ///////////////////////////////// 激活部分 /////////////////////////////////

    private activePart: UnityEngine.GameObject;
    btnActivate: UnityEngine.GameObject;
    private txtCondition: UnityEngine.UI.Text;

    /**预览技能*/
    private activateSkillItems: SkillIconItem[] = [];

    ///////////////////////////////// 进阶部分 /////////////////////////////////

    private jinjiePart: UnityEngine.GameObject;
    /**战斗力的值*/
    private fight: number = 0;

    /**战斗力*/
    private zdlText: UnityEngine.UI.Text;
    private equipNode: UnityEngine.GameObject;
    /**装备图标*/
    private equipItems: IconItem[] = [];
    /**属性*/
    private propItems: PetPropItem[] = [];

    /**进阶*/
    private jinjieFunc: UnityEngine.GameObject;
    /**属性*/
    private propGo: UnityEngine.GameObject;
    /**技能*/
    private skillFunc: UnityEngine.GameObject;

    /**进阶材料*/
    private materialGameObj: UnityEngine.GameObject;
    private materialItem: IconItem;

    /**已满阶*/
    private stageFullText: UnityEngine.UI.Text;
    /**点亮星星*/
    private lightStars: UnityEngine.GameObject[] = [];
    /**开始进阶*/
    btnEnhance: UnityEngine.GameObject;
    /**自动进阶*/
    btnAutoEnhance: UnityEngine.GameObject;
    /**停止进阶*/
    btnStopAuto: UnityEngine.GameObject;

    /**技能图标*/
    private skillItems: SkillIconItem[] = [];

    /**怒气技能*/
    private nqSkillItem: SkillIconItem;

    /**打开面板时指定显示的美人*/
    private openPetId: number = 0;
    private curPetLabelIdx: number = 0;
    private curPetId: number = 0;
    private curFightPetId: number = -1;
    private curFuncTab: PetJinJieFuncTab = PetJinJieFuncTab.none;
    private openJinjieFuncTab: PetJinJieFuncTab;
    /**手选的美人id*/
    private handSelectedPetId: number = 0;
    /**进阶材料*/
    private m_costData: MaterialItemData = new MaterialItemData();
    /**下一阶配置*/
    private nextBeautyConfig: GameConfig.BeautyStageM;

    /**装备数据*/
    private m_equipListData: BeautyEquipListItemData[] = [];
    /**穿装备数据*/
    private m_bagEquipListData: BeautyEquipListItemData[] = [];

    private m_allProps: GameConfig.BeautyPropAtt[] = [];
    /**是否正在自动进阶*/
    private m_isAutoEnhance = false;
    private m_autoTime: number = 0;

    private textTipData: TextTipData = new TextTipData();

    //按钮红点
    private skillTipMark: UnityEngine.GameObject;
    private jinjieTipMark: UnityEngine.GameObject;
    private juexingTipMark: UnityEngine.GameObject;


    private activeSkillIds: number[] = [];
    private typeAtlas: Game.UGUIAltas;

    //特效
    private starEffectPrefab: UnityEngine.GameObject;
    private startEffects: UIEffect[] = [];
    //进阶成功特效
    private effectRoot: UnityEngine.GameObject;
    private jinjieEffectPrefab: UnityEngine.GameObject;
    private jinjieUIEffect: UIEffect;

    //强化成功/失败飘字
    private flyPos: UnityEngine.GameObject;
    /**进阶日类型*/
    private jjrType: number = -1;

    ///////////////////////////////// 聚神部分 /////////////////////////////////
    /**开始聚神*/
    private btnJushen: UnityEngine.GameObject;
    /**聚神材料*/
    private m_soulCostData: MaterialItemData = new MaterialItemData();
    private jushenIcon: IconItem;
    /**点亮星星*/
    private jsLights: UnityEngine.GameObject[] = [];
    private txtAdd: UnityEngine.UI.Text;
    private levelTxt: UnityEngine.UI.Text;
    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;

    private petGroupList: GroupList;
    /**GroupList一级选择*/
    private firstSelectIndex: number = -1;
    /**GroupList二级选择*/
    private secondSelectIndex: number = -1;
    /**所有的伙伴*/
    private allPetIndexs: { [index: number]: number[] } = {};
    private groupStatus: { [index: number]: { tipMark: boolean, refreshSubList: boolean } } = {};
    /**伙伴类型标题*/
    private firstType: string[] = [];

    private selectPetType: PetTipMarkType = PetTipMarkType.None;

    /**可以穿装备的装备位*/
    private showWearTipIndexs: number[] = [];
    private equipTip: UnityEngine.GameObject;
    private roots: UnityEngine.GameObject[] = [];
    private arrow: UnityEngine.GameObject;
    private itemSelected: UnityEngine.GameObject;

    private newDianRoot: UnityEngine.GameObject;

    private shengxingRoot: UnityEngine.GameObject;

    private modelEffectRoot: UnityEngine.GameObject;

    private colorTypeAtals: Game.UGUIAltas;

    private firstOpen: boolean = false;

    /**觉醒界面*/
    private petJuexingPanel: PetJuexingPanel;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_JINJIE);
    }

    protected resPath(): string {
        return UIPathData.PetJinjieView;
    }

    protected initElements() {
        this.petGroupList = this.elems.getUIGroupList("petGroupList");
        this.flyPos = this.elems.getElement("flyPos");
        this.starEffectPrefab = this.elems.getElement("starEffect");
        this.skillTipMark = this.elems.getElement("skillTipMark");
        this.jinjieTipMark = this.elems.getElement("jinjieTipMark");
        this.juexingTipMark = this.elems.getElement("juexingTipMark");

        this.equipSlotIcon_Normal = this.elems.getElement('equipSlotIcon_Normal');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.skillIcon_Normal = this.elems.getElement('skillIcon_Normal');

        ///////////////////////////////// 公共部分 /////////////////////////////////
        this.txtLv = this.elems.getText("txtLv");
        this.txtName = this.elems.getText("txtName");
        this.textTip = new GameObjectGetSet(this.elems.getElement("textTip"));
        this.imgType = this.elems.getImage("imgType");

        //获取伙伴列表的数据
        let maxNewLabel = G.DataMgr.petData.maxLabel;
        let newIndex = 0;
        for (let i = 0; i < maxNewLabel; i++) {
            //表是从1开始记
            let petIds = G.DataMgr.petData.getAllPetID();
            if (null != petIds) {
                this.firstType.push(PetData.LabelDesc[i])
                if (this.allPetIndexs[newIndex] == null) {
                    this.allPetIndexs[newIndex] = [];
                }
                for (let j = 0; j < petIds.length; j++) {
                    this.allPetIndexs[newIndex].push(petIds[j]);
                }
                this.groupStatus[newIndex] = { tipMark: false, refreshSubList: false };
                newIndex++;
            }
        }

        this.petModelCtn = this.elems.getElement('modelCtn');
        this.btnFight = this.elems.getElement('btnFight');

        this.funcGroup = this.elems.getToggleGroup("funcGroup");
        this.btnJuexingTip = this.elems.getElement("btnJuexingTip");
        this.jinjieFunc = this.elems.getElement('jinjieFunc');
        this.skillFunc = this.elems.getElement('skillFunc');
        this.zdlText = this.elems.getText('zdlText');
        this.modelEffectRoot = this.elems.getElement("modelEffecRoot");

        ///////////////////////////////// 进阶部分 /////////////////////////////////
        let jinjieElem = this.elems.getUiElements("jinjieFunc");
        this.activePart = jinjieElem.getElement("activePart");
        this.jinjiePart = jinjieElem.getElement("jinjiePart");
        this.btnActivate = this.elems.getElement("btnActive");
        this.txtCondition = ElemFinder.findText(this.activePart, "condition");
        this.levelTxt = jinjieElem.getText('levelTxt');

        this.equipNode = this.elems.getElement('equip');
        for (let i: number = 0; i < PetData.EQUIP_NUM_PER_PET; i++) {
            let item: UnityEngine.GameObject = null;
            if (i < 4) {
                item = ElemFinder.findObject(this.equipNode, "normal/equip" + i);
            } else {
                item = ElemFinder.findObject(this.equipNode, "special/equip" + i);
            }
            let iconItem = new IconItem();
            //iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualEquipSlotByPrefab(this.equipSlotIcon_Normal, item);
            iconItem.showBg = false;
            this.equipItems.push(iconItem);
            this.m_equipListData.push(new BeautyEquipListItemData());
            this.addClickListener(item, delegate(this, this.onClickEquipIcon, iconItem));

        }

        // 属性
        this.propGo = this.elems.getElement('prop');
        for (let i: number = 0; i < this.propCnt; i++) {
            let item = ElemFinder.findObject(this.propGo, 'prop' + i);
            let propItem = new PetPropItem();
            propItem.setUsual(item);
            this.propItems.push(propItem);
        }

        let jinjieFuncElems = this.elems.getUiElements('jinjieFunc');
        // 星星
        for (let i: number = 0; i < this.jinJieLvCnt / 2; i++) {
            let starGo = jinjieFuncElems.getElement('star' + i);
            this.lightStars.push(ElemFinder.findObject(starGo, 'star/half'));
            this.lightStars.push(ElemFinder.findObject(starGo, 'star/light'));
        }
        //特效
        let index = 0;
        for (let i = 0; i < this.jinJieLvCnt; i++) {
            index = i;
            if (index % 2 == 1) {
                index--;
            }
            index = index / 2;
            let starGo = jinjieFuncElems.getElement('star' + index);
            this.startEffects[i] = new UIEffect();
            this.startEffects[i].setEffectPrefab(this.starEffectPrefab, starGo.gameObject, this.starEffectScale);
        }

        this.effectRoot = this.elems.getElement("effectRoot");
        this.jinjieEffectPrefab = this.elems.getElement("jinjieSucceed");
        this.jinjieUIEffect = new UIEffect();
        this.jinjieUIEffect.setEffectPrefab(this.jinjieEffectPrefab, this.effectRoot);

        // 材料
        this.materialItem = new IconItem();
        this.materialItem.effectRule = EnumEffectRule.none;
        this.materialGameObj = jinjieFuncElems.getElement('materialIcon');
        this.materialItem.setUsualIconByPrefab(this.itemIcon_Normal, this.materialGameObj);
        this.materialItem.setTipFrom(TipFrom.material);

        this.stageFullText = jinjieFuncElems.getText('stageFull');

        this.btnEnhance = jinjieFuncElems.getElement('btnEnhance');
        this.btnAutoEnhance = jinjieFuncElems.getElement('btnAutoEnhance');
        this.btnStopAuto = jinjieFuncElems.getElement('btnStopAuto')

        ///////////////////////////////// 技能部分 /////////////////////////////////

        let skillObject = ElemFinder.findObject(this.skillFunc, "skill");
        for (let i: number = 0; i < this.skillCnt; i++) {

        }

        let skillFuncElems = this.elems.getUiElements('skillFunc');
        // 基础技能列表
        for (let i: number = 0; i < this.skillCnt; i++) {
            //基础技能
            let item = skillFuncElems.getElement('skill' + i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsuallyByPrefab(this.skillIcon_Normal, item);
            iconItem.needShowLv = true;
            this.skillItems.push(iconItem);
            this.activateSkillItems.push(iconItem);
        }

        // 怒气技能
        this.nqSkillItem = new SkillIconItem(true);
        this.nqSkillItem.setUsuallyByPrefab(this.skillIcon_Normal, skillFuncElems.getElement('nqSkillIcon'));
        this.nqSkillItem.needShowLv = true;
        this.nqSkillItem.needArrow = true;

        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
        //星星爆开特效
        this.newDianRoot = this.elems.getElement("newDianRoot");
        this.newDianRoot.SetActive(false);

        this.shengxingRoot = this.elems.getElement("shengxingRoot");
        this.shengxingRoot.SetActive(false);

        this.itemSelected = this.elems.getElement('itemSelected');
        this.arrow = this.elems.getElement("arrow");
        this.equipTip = this.elems.getElement("equipTip");
        for (let i: number = 0; i < PetData.EQUIP_NUM_PER_PET - 2; i++) {
            let root = ElemFinder.findObject(this.equipTip, "root" + i);
            this.roots.push(root);
        }

        this.colorTypeAtals = this.elems.getElement("colorTypeAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.typeAtlas = this.elems.getElement("typeAtlas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        //觉醒界面设置
        let juexing = this.elems.getUiElements("PetJuexingPanel");
        let juexingGo = this.elems.getElement("PetJuexingPanel");
        this.petJuexingPanel = new PetJuexingPanel();
        this.petJuexingPanel.setComponents(juexing, juexingGo, this.itemIcon_Normal);
    }

    protected initListeners() {
        this.addListClickListener(this.petGroupList, this.onPetGroupListClick);
        this.addToggleGroupListener(this.funcGroup, this.onFuncGroup1Change);
        this.addClickListener(this.btnJuexingTip, this.onClickJuexingTip);
        this.addClickListener(this.btnActivate, this.onBtnActivateClick);
        this.addClickListener(this.btnFight, this.onBtnFightClick);
        this.addClickListener(this.btnEnhance, this.onBtnEnhanceClick);
        this.addClickListener(this.btnAutoEnhance, this.onBtnAutoEnhanceClick);
        this.addClickListener(this.btnStopAuto, this.onBtnStopAutoClick);

        this.petJuexingPanel.actionOnClick = delegate(this, this.updateFight);
    }

    /**
 * 滑动屏幕人物旋转
 * @param x
 * @param y
 */
    public onDrag() {
        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        this.petAvatar.defaultAvatar.setRotation(0, -roatespeed * delta.x + this.petAvatar.defaultAvatar.rotationY, 0);
    }

    open(petId = 0, jinjieFuncTab: PetJinJieFuncTab = PetJinJieFuncTab.jinjie, tipType: PetTipMarkType = PetTipMarkType.None) {
        this.openJinjieFuncTab = jinjieFuncTab;
        this.openPetId = petId;
        this.selectPetType = tipType;
        super.open(petId);
    }

    protected onOpen() {
        this.firstOpen = true;
        if (this.petAvatar == null) {
            let t = this.petModelCtn.transform;
            this.petAvatar = new PetAvatar(t, t);
            this.petAvatar.setRenderLayer(5);
            this.petAvatar.setSortingOrder(this.sortingOrder);
        }
        this.updateSelectedPet();
        // 每次打开前对伙伴进行排序，已激活的排前面
        this.updatePetListItemInfo();
        this.autoSelectPet();
        this.updateJinjie();
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
        G.GuideMgr.processGuideNext(EnumGuide.Pet, EnumGuide.Pet_OpenPetView);
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_OpenPetView);
        let info = G.DataMgr.petData.getPetInfo(this.curPetId);
        this.funcGroup.Selected = 0;
        this.onFuncGroup1Change(0);
        this.calAllPetFightValue();

        //检测觉醒是否打开
        let isopen = G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_WUYUAN_AWAKE);
        if (isopen)
            this.btnJuexingTip.SetActive(false);
        this.addTimer('idleDelay', 5000, 0, delegate(this, this.onIdleDelayTimer));

        this.firstOpen = false;
    }

    private onIdleDelayTimer(timer: Game.Timer) {
        if (this.petAvatar) {
            let modelId = G.DataMgr.petData.getPetModleID(this.curPetId, 0);
            let animStr = '';
            if (modelId == "200009" || modelId == "200012") {
                animStr = "show_stand";
            }
            else {
                animStr = 'stand';
            }
            if (this.petAvatar.defaultAvatar.isPlaying(animStr))
                this.petAvatar.defaultAvatar.playAnimation("show_idle", 0.2);
        }
    }


    private onBtnPreviewClick() {
        G.Uimgr.createForm<PetPreviewView>(PetPreviewView).open(this.curPetId);
    }

    private sortPets(a: number, b: number): number {
        let petA: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(a);
        let stateA = 0;
        if (null != petA) {
            if (petA.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                stateA = 2;
            } else if (petA.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                stateA = 1;
            }
        }

        let petB: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(b);
        let stateB = 0;
        if (null != petB) {
            if (petB.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                stateB = 2;
            } else if (petB.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                stateB = 1;
            }
        }

        if (stateA != stateB) {
            return stateB - stateA;
        }

        return a - b;
    }

    private calAllPetFightValue() {
        let fight = 0;
        //let pets = G.DataMgr.petData.getAllPetID();
        //for (let i = 0; i < pets.length; i++) {
        //    let pet = G.DataMgr.petData.getPetInfo(pets[i]);
        //    if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
        //        let config = PetData.getEnhanceConfig(pets[i], pet.m_uiStage);
        //        fight += FightingStrengthUtil.calPetFight(config.m_astAttrList);
        //    }
        //}

        this.zdlText.text = G.DataMgr.heroData.fight.toString();
    }

    private updateFight() {
        this.zdlText.text = G.DataMgr.heroData.fight.toString();
    }

    /**
   * 跟新伙伴列表显示
   * @param firstCount 1级可选数
   * @param firstType  1级选择名字
   * @param secondType 2级选择名字  
   */
    private updatePetListItemInfo() {
        this.createPetList();
        this.updateGroupTipMark();
        this.refeshSubList();
    }

    /**创建伙伴列表 */
    private createPetList() {
        if (this.petGroupList.Count > 0)
            return;
        this.petGroupList.Count = this.firstType.length;
        let petData = G.DataMgr.petData;
        for (let i: number = 0; i < this.petGroupList.Count; i++) {
            let labelItem = this.petGroupList.GetItem(i);

            //let labelText = labelItem.findText('catalog/normal/text');
            //labelText.text = this.firstType[i];
            //labelText = labelItem.findText('catalog/selected/text');
            //labelText.text = this.firstType[i];
            //let colorTypeImg = labelItem.findImage('catalog/colorType');
            //colorTypeImg.sprite = this.colorTypeAtals.Get(i.toString());

            let subList = this.petGroupList.GetSubList(i);
            subList.Clear();
            this.allPetIndexs[i].sort(delegate(this, this.sortPets));
            subList.Count = this.allPetIndexs[i].length;
            if (!subList.onClickItem) {
                subList.onClickItem = delegate(this, this.onClickGroupPetItem);
            }
            if (!subList.onVirtualItemChange) {
                subList.onVirtualItemChange = delegate(this, this.onVirtualItemChange);
            }
        }
    }

    /**
     * 列表变化
     * @param item
     */
    private onVirtualItemChange(item: ListItem): void {
        let groupIndex = this.firstSelectIndex;
        let itemIndex = item.Index;

        let petNameText = item.findText('txtItem');
        let tipMark = item.findObject('tipMark');

        let petId = this.allPetIndexs[groupIndex][itemIndex];
        let petData = G.DataMgr.petData;
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let petName = PetData.getPetConfigByPetID(petId).m_szBeautyName;
        //伙伴的头像
        let imgAwater = ElemFinder.findRawImage(item.gameObject, 'imgAwater');
        G.ResourceMgr.loadImage(imgAwater, uts.format("images/pethead/{0}.png", petId));
        petNameText.text = petName;
        let showTipMark = (null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) ||
            (petData.isPetActive(petId) && (petData.isOnePetCanJinJie(petId) || (petData.isOnePetCanJuShen(petId))
                || petData.isOnePetCanAwaken(petId) || petData.canKfSkillUp(petId, false) || (petData.isOnePetCanWearBetterEquip(pet))));
        tipMark.SetActive(showTipMark);

        // 出战标记
        let isEquip = item.findObject('isEquip');
        let followPet: Protocol.NewBeautyInfo = G.DataMgr.petData.getFollowPet();
        isEquip.SetActive((null != followPet) && (followPet.m_iBeautyID == pet.m_iBeautyID));

        //可激活
        let canActive = item.findObject('canActive');
        canActive.SetActive(null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET);
        //判断伙伴是否激活
        let isActive = item.findObject('isActive');
        let isNotActive = pet.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET;
        isActive.SetActive(isNotActive);
        UIUtils.setGrey(imgAwater.gameObject, isNotActive);
    }

    private updateGroupTipMark() {
        this.updateGroupTipMarkData();
        let petData = G.DataMgr.petData;
        for (let i: number = 0, n = this.petGroupList.Count; i < n; i++) {
            let labelItem = this.petGroupList.GetItem(i);
            labelItem.findObject("catalog/tipMark").SetActive(this.groupStatus[i].tipMark);
        }
    }

    private updateGroupTipMarkData() {
        let petData = G.DataMgr.petData;
        for (let groupIdx: number = 0, n = this.petGroupList.Count; groupIdx < n; groupIdx++) {
            let subpets = this.allPetIndexs[groupIdx];
            let needTipMark = false;
            for (let petIdx = 0, m = subpets.length; petIdx < m; petIdx++) {
                let pet = petData.getPet(subpets[petIdx]);
                if (!pet) continue;
                needTipMark = petData.isPetActive(subpets[petIdx]) && (pet.canActive() || pet.canJinJie() || pet.canJuShen() || pet.canUpgradeSkill(false) || pet.canWearBetterEquip() || pet.canAwaken());
                if (needTipMark) break;
            }
            this.groupStatus[groupIdx].tipMark = needTipMark;
        }
    }

    private refeshSubList() {
        if (this.firstSelectIndex >= 0 && this.secondSelectIndex >= 0) {
            //this.petGroupList.Selected = this.firstSelectIndex;
            this.allPetIndexs[this.firstSelectIndex].sort(delegate(this, this.sortPets));
            if (this.firstOpen) {
                this.petGroupList.GetSubList(this.firstSelectIndex).SetSlideAppearRefresh();
            }
            this.petGroupList.GetSubList(this.firstSelectIndex).Refresh();
            for (let groupIdx: number = 0, n = this.petGroupList.Count; groupIdx < n; groupIdx++) {
                this.groupStatus[groupIdx].refreshSubList = (groupIdx != this.firstSelectIndex);
            }
        }
    }


    /**
     * 点击group
     * @param index
     */
    private onPetGroupListClick(index: number) {
        this.firstSelectIndex = index;
        if (this.groupStatus[index].refreshSubList) {
            this.allPetIndexs[index].sort(delegate(this, this.sortPets));
            this.petGroupList.GetSubList(index).SetSlideAppearRefresh();
            this.petGroupList.GetSubList(index).Refresh();
            this.groupStatus[index].refreshSubList = false;
        }
        this.updateSelectedPet();
    }

    /**
     * 点击二级界面item
     * @param index
     */
    private onClickGroupPetItem(index: number) {
        this.funcGroup.Selected = 0;
        this.secondSelectIndex = index;
        this.curPetId = this.allPetIndexs[this.firstSelectIndex][index];
        this.showPetModel(this.curPetId);
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);

        if (null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            this.onFuncGroup2Change(this.curFuncTab);
        }
        else {
            this.onFuncGroup2Change(PetJinJieFuncTab.jinjie);
        }

        G.AudioMgr.playBtnClickSound();
        this.removeTimer('idleDelay');
        this.handSelectedPetId = this.curPetId;
        this.resetOnChangeSelect();
        this.updateSelectedPet();
        //切换停止强化
        this._stopAutoEnhance();
        this.updateJinjie();
        this.updateSelectedPet();
    }


    private getPetIdByTipMark(): number {
        let petData = G.DataMgr.petData;
        for (let i = 0; i < this.firstType.length; i++) {
            for (let j = 0; j < this.allPetIndexs[i].length; j++) {
                let petId = this.allPetIndexs[i][j];
                let petInfo = petData.getPetInfo(petId);
                switch (this.selectPetType) {
                    case PetTipMarkType.None:
                        // 选中当前出战的
                        let followPet = petData.getFollowPet();
                        if (null != followPet) {
                            return followPet.m_iBeautyID;
                        }
                        break;
                    case PetTipMarkType.Active:

                        if ((null != petInfo && petInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET)) {
                            return petId;
                        }
                        break;
                    case PetTipMarkType.JinJie:
                        if (petData.isOnePetCanJinJie(petId)) {
                            return petId;
                        }
                        break;
                    case PetTipMarkType.Skill:
                        if (petData.canKfSkillUp(petId, false)) {
                            return petId;
                        }
                        break;
                    case PetTipMarkType.JuShen:
                        if (petData.isOnePetCanJuShen(petId)) {
                            return petId;
                        }
                        break;
                    case PetTipMarkType.Equip:
                        if ((petData.isOnePetCanWearBetterEquip(petInfo))) {
                            return petId;
                        }
                        break;
                }

            }
        }


    }

    private autoSelectPet() {
        let openPetId = this.openPetId;

        if (openPetId <= 0) {
            openPetId = this.getPetIdByTipMark();
        }

        for (let i = 0; i < this.firstType.length; i++) {
            for (let j = 0; j < this.allPetIndexs[i].length; j++) {
                if (openPetId == this.allPetIndexs[i][j]) {
                    this.firstSelectIndex = i;
                    this.secondSelectIndex = j;
                    break;
                }
            }
        }

        if (this.firstSelectIndex < 0 || this.secondSelectIndex < 0) {
            this.firstSelectIndex = 0;
            this.secondSelectIndex = 0;
        }

        this.petGroupList.Selected = this.firstSelectIndex;
        this.petGroupList.GetSubList(this.firstSelectIndex).Selected = this.secondSelectIndex;
        this.curPetId = this.allPetIndexs[this.firstSelectIndex][this.secondSelectIndex];
        this.showPetModel(this.curPetId);
        this.updateSelectedPet();
    }

    protected onClose() {
        this.liziEffectRoot.SetActive(false);
        this.newDianRoot.SetActive(false);
        this.shengxingRoot.SetActive(false);
        if (null != this.petAvatar) {
            this.petAvatar.destroy();
            this.petAvatar = null;
        }
    }


    /**
     * 还在强化时切换，停止所有的特效,重置按钮
     */
    private resetOnChangeSelect() {
        for (let i = 0; i < this.jinJieLvCnt; i++) {
            this.startEffects[i].stopEffect();
        }
        this.m_isAutoEnhance = false;
        this.jinjieUIEffect.stopEffect();
        this.liziEffectRoot.SetActive(false);
    }

    /**
     * 飘字
     * @param index
     */
    private addFlyText(index: number) {
        if (index != 9) {
            this.playSHENGJIEffect();
        } else {
            //进阶成功特效
            G.AudioMgr.playJinJieSucessSound();
            this.jinjieUIEffect.playEffect(EffectType.Effect_Normal, true);

        }
    }


    /**
   * 新点特效
   */
    private playNewDianEffect() {
        this.newDianRoot.SetActive(false);
        this.newDianRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.newDianRoot, "effect", 0.9, delegate(this, this.onEndNewDianEffect));
    }

    private onEndNewDianEffect() {
        this.newDianRoot.SetActive(false);
    }

    private playSHENGJIEffect() {
        this.shengxingRoot.SetActive(false);
        this.shengxingRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.shengxingRoot, "effect", 0.9, delegate(this, this.onEndSHENGJIEffect));
    }

    private onEndSHENGJIEffect() {
        this.shengxingRoot.SetActive(false);
    }


    /**
     * 播放粒子系统
     */
    private playLiZiEffect() {
        this.liziEffectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.liziEffectRoot, "lizhieffect", 2.5, delegate(this, this.onEndEffect));
    }

    private onEndEffect() {
        this.liziEffectRoot.SetActive(false);
    }

    /**
     * 星星特效
     * @param index
     */
    private addEffect(index: number): void {
        this.playNewDianEffect();
        this.startEffects[index].playEffect(EffectType.Effect_Normal, true);
        this.addFlyText(index);
        //粒子特效在此开始播
        if (index == 9) {
            this.playLiZiEffect();
        }
    }
    /**刷新视图*/
    private updateSelectedPet() {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        if (pet == null) return;

        let followPet: Protocol.NewBeautyInfo = G.DataMgr.petData.getFollowPet();
        G.DataMgr.petData.currentHongYanData = pet;
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.curPetId);
        let zhuanLvStr = pet.m_stFeiSheng.m_ucNum > 0 ? uts.format("（{0}转）", pet.m_stFeiSheng.m_ucNum) : "";

        this.txtName.text = config.m_szBeautyName + zhuanLvStr;
        let awakenLevel: number = pet.m_stAwake.m_ucLevel;
        //if (awakenLevel == 0) {
        //    this.title.text = '';
        //}
        //else {
        //    this.title.text = TextFieldUtil.getColorText(PetData.petTitle[awakenLevel - 1], PetData.petTitleColors[awakenLevel - 1]);
        //}

        let stage: number = 0;
        if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            // 已激活
            this.funcGroup.gameObject.SetActive(true);
            this.jinjiePart.SetActive(true);
            this.activePart.SetActive(false);
            this.equipNode.SetActive(true);

            stage = PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID);

            // 是否出战
            let isFighting = (followPet != null && pet.m_iBeautyID == followPet.m_iBeautyID);
            this.btnFight.SetActive(!isFighting);
            this.textTip.SetActive(G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_PET_SKILL));

            this.updateJinjie();
            this.updateGongFa();
            this.updateEquip(isFighting);

            //按钮红点提示
            this.skillTipMark.SetActive(G.DataMgr.petData.canKfSkillUp(this.curPetId, false));
            this.jinjieTipMark.SetActive(G.DataMgr.petData.isOnePetCanJinJie(this.curPetId));
            this.juexingTipMark.SetActive(G.DataMgr.petData.isOnePetCanAwaken(this.curPetId));
        }
        else {
            // 未激活
            this.funcGroup.gameObject.SetActive(false);
            this.jinjiePart.SetActive(false);
            this.activePart.SetActive(true);
            this.equipNode.SetActive(false);

            stage = Math.floor(config.m_uiStage / 10);
            this.btnFight.SetActive(false);
            this.textTip.SetActive(false);

            this.txtCondition.text = AchievementData.getQuestStr(config.m_iCondition, pet.m_uiDoneCount);
            UIUtils.setButtonClickAble(this.btnActivate, pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET);

            // 预览属性
            let strongConfig = PetData.getEnhanceConfig(this.curPetId, config.m_uiStage);
            if (strongConfig != null) {
                this._updateProps(this.propItems, strongConfig.m_astAttrList);
                //预览技能
                let activeskillConfig: GameConfig.SkillConfigM;
                for (let i = 0; i < this.skillCnt; i++) {
                    if (i < strongConfig.m_astSkillList.length) {
                        this.activeSkillIds[i] = strongConfig.m_astSkillList[i].m_uiID;
                        activeskillConfig = SkillData.getSkillConfig(this.activeSkillIds[i]);
                        if (activeskillConfig != null) {
                            activeskillConfig.completed = (strongConfig.m_iStage >= activeskillConfig.m_stSkillStudy.m_iStudyLevel) ? 1 : 0;
                        }
                        this.activateSkillItems[i].updateBySkillID(this.activeSkillIds[i]);
                    }
                    else {
                        this.activeSkillIds[i] = 0;
                        this.activateSkillItems[i].updateBySkillID(0);
                    }
                    this.activateSkillItems[i].updateIcon();
                }
            }
            // 没激活的情况
            let gfConfig: GameConfig.HongYanFateConfigM = PetData.getYuanfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, 9);
            let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(gfConfig.m_uiSkillID);

            this.skillTipMark.SetActive(false);
            this.jinjieTipMark.SetActive(G.DataMgr.petData.isPetActive(this.curPetId));
        }

        // 几阶
        let curStage = stage >= this.maxStage ? this.maxStage : stage;
        // this.petStageImg.sprite = this.petStageAltas.Get(curStage.toString());
        this.txtLv.text = uts.format('{0}阶', DataFormatter.toHanNumStr(curStage));
        this.levelTxt.text = uts.format('{0}阶', DataFormatter.toHanNumStr(curStage));

        this.petStage = curStage;
        this.setImageType(config.m_szShowDesc);

    }

    onSpecialPriChange() {
        this.updateSelectedPet();
    }

    /**
     * 更新基础，飞升技能
     * @param item
     * @param isPrev 是否是预览飞升技能
     * @param isFeiSheng 是否已经飞升过
     */
    private updateSkill(skillItem: SkillIconItem, index: number, isPrev: boolean, hasFeiSheng: boolean = true) {
        //基础技能
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.curPetId);
        let strongConfig = PetData.getEnhanceConfig(this.curPetId, pet.m_uiStage);
        //普通技能
        let petNormalSkillCnt = strongConfig.m_astSkillList.length;
        //飞升后可替换技能
        let petFeishengSkillCnt = config.m_stFSInfo.length;

        let skillId = 0;
        //飞升技能
        if (isPrev) {
            if (index < petFeishengSkillCnt) {
                skillId = config.m_stFSInfo[index].m_uiSkillID;
            }
        } else {
            //普通技能
            if (index < petNormalSkillCnt) {
                //已经飞升过替换技能
                if (hasFeiSheng && config.m_stFSInfo[index] != null && config.m_stFSInfo[index].m_uiSkillID > 0) {
                    skillId = config.m_stFSInfo[index].m_uiSkillID;
                } else {
                    skillId = strongConfig.m_astSkillList[index].m_uiID;
                }
            }
        }
        let skillCfg = SkillData.getSkillConfig(skillId);
        if (null != skillCfg) {
            if (isPrev) {
                skillCfg.completed = pet.m_stFeiSheng.m_ucNum >= (index + 1) ? 1 : 0;
            } else {
                skillCfg.completed = strongConfig.m_iStage >= skillCfg.m_stSkillStudy.m_iStudyLevel ? 1 : 0;
            }
            skillItem.updateBySkillID(skillId);
        }
        skillItem.updateBySkillID(skillId);
        skillItem.updateIcon();
    }

    /**进阶*/
    private updateJinjie() {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.curPetId);
        if (pet.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) return;
        // 进阶星星
        let level = 0;
        if (pet.m_uiStage == config.m_uiStage) {
            level = 10;
        }
        else {
            level = (pet.m_uiStage - 1) % 10;
        }
        for (let i: number = 0; i < this.jinJieLvCnt; i++) {
            if (i < level) {
                this.lightStars[i].SetActive(true);
            }
            else {
                this.lightStars[i].SetActive(false);
            }
        }
        let strongConfig = PetData.getEnhanceConfig(this.curPetId, pet.m_uiStage);
        this._updateProps(this.propItems, strongConfig.m_astAttrList);
        for (let i = 0; i < this.skillCnt; i++) {
            ////基础技能
            this.updateSkill(this.skillItems[i], i, false, pet.m_stFeiSheng.m_ucNum > 0);
        }

        let nextConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(this.curPetId, pet.m_uiStage + 1);
        this.nextBeautyConfig = nextConfig;
        if (nextConfig != null) {
            //幸运值
            this.m_costData.id = nextConfig.m_iConsumableID;
            this.m_costData.need = nextConfig.m_iConsumableNumber;
            this.materialGameObj.SetActive(true);
            this.stageFullText.gameObject.SetActive(false);
        }
        else {
            this.m_costData.id = 0;
            this.m_costData.need = 0;
            this.materialGameObj.SetActive(false);
            this.stageFullText.gameObject.SetActive(true);
        }

        this.updateJinjieMaterial();
        UIUtils.setButtonClickAble(this.btnEnhance, this.m_costData.id > 0);
        UIUtils.setButtonClickAble(this.btnAutoEnhance, this.m_costData.id > 0);
        this.updateBtnAutoEnhance();


    }

    private updateJinjieMaterial() {
        if (this.m_costData.id > 0) {
            this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            for (let i = 0; i < this.nextBeautyConfig.m_stLimitIDList.length; i++) {
                if (this.nextBeautyConfig.m_stLimitIDList[i].m_uiValue) {
                    this.m_costData.has += G.DataMgr.thingData.getThingNum(this.nextBeautyConfig.m_stLimitIDList[i].m_uiValue, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                }
            }
            // 更新材料图标
            this.materialItem.updateByMaterialItemData(this.m_costData);
            this.materialItem.updateIcon();
        }
        else {
            this.materialItem.updateByMaterialItemData(null);
            this.materialItem.updateIcon();
        }

    }

    /**刷新怒气技能 */
    private updateGongFa() {
        // 怒气技能
        let info = G.DataMgr.petData.getPetInfo(this.curPetId);
        if (info.m_ucStatus == 3) {
            //已激活
            let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(G.DataMgr.petData.getNqSkill(this.curPetId));
            if (skillConfig != null) {
                this.nqSkillItem.updateBySkillID(skillConfig.m_iSkillID);
                this.nqSkillItem.updateIcon();
            }
        }
        else {
            //未激活
            this.nqSkillItem.updateBySkillID(G.DataMgr.petData.getNqSkill(this.curPetId));
            this.nqSkillItem.updateIcon();
        }
    }
    /**觉醒*/
    private updateJiuXingPanel() {
        let severData = G.DataMgr.petData.getPetInfo(this.curPetId);
        let clickData = G.DataMgr.petData.getPetAwakenCfg(severData.m_iBeautyID, severData.m_stAwake.m_ucLevel);
        this.petJuexingPanel.updatePanel(severData, clickData);
    }

    private showPetModel(petId: number) {
        let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        let fabao: number = G.DataMgr.heroData.avatarList.m_uiFabaoShowID;
        let feiShenNum = info.m_stFeiSheng.m_ucNum;
        let modelId = G.DataMgr.petData.getPetModleID(petId, feiShenNum);

        let avatarKey = modelId + '-' + fabao;

        if (this.lastAvatarKey != avatarKey) {
            this.lastAvatarKey = avatarKey;
            //this.petAvatar.m_shengQiMesh.destroy();
            this.petAvatar.defaultAvatar.destroy();
            let t = this.petModelCtn.transform;
            this.petAvatar = new PetAvatar(t, t);
            this.petAvatar.setRenderLayer(5);
            this.petAvatar.setSortingOrder(this.sortingOrder);

            let fabaoCfg = G.DataMgr.fabaoData.getFabaoConfig(fabao);
            let fabaoID = 0;
            if (null != fabaoCfg) {
                fabaoID = fabaoCfg.m_iModelID;
            }
            this.addTimer('lateModel', 50, 1, delegate(this, this.delayShow, modelId, fabaoID));
            this.addTimer("delayLoad", 800, 1, this.lateEffectLoad);
        } else {
            this.onLoadPlayAnim(modelId);
        }
    }

    private delayShow(timer, model: string, fabaoID: number) {
        this.petAvatar.onLoadBodyCallbackOnce = delegate(this, this.onLoadPlayAnim, model);
        this.petModelCtn.SetActive(false);
        this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, model, true, false);
        this.petModelCtn.SetActive(true);
        this.petAvatar.updateShengQiModel(fabaoID);
    }
    private onLoadPlayAnim(model: string) {
        let obj = this.petModelCtn.gameObject;
        this.petAvatar.defaultAvatar.playAnimation("show", 0);
    }
    private lateEffectLoad() {
        G.ResourceMgr.loadModel(this.modelEffectRoot, UnitCtrlType.reactive, "effect/ui/RY_yingxiongchuchang.prefab", this.sortingOrder);
    }


    private showWearEquipTip() {
        if (this.showWearTipIndexs.length > 0) {
            this.arrow.SetActive(true);
            this.itemSelected.SetActive(true);
            this.itemSelected.transform.SetParent(this.roots[this.showWearTipIndexs[0]].transform, false);
            this.arrow.transform.SetParent(this.roots[this.showWearTipIndexs[0]].transform, false);
            this.arrow.transform.localPosition = G.getCacheV3(0, 100, 0);
            this.roots[this.showWearTipIndexs[0]].SetActive(true);
        } else {
            this.arrow.SetActive(false);
            this.itemSelected.SetActive(false);
        }
    }

    /**
     * 刷新装备数据
     * @param isFight
     */
    private updateEquip(isFight: boolean = false): void {
        this.showWearTipIndexs = [];
        let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.curPetId);
        let data: ThingItemData;
        let pos: number = 0;
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);

        let canWearIndex: number = -1;

        let allEquipInBag: ThingItemData[] = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.PET_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG);
        let equipPart: number;
        for (let i: number = 0; i < PetData.EQUIP_NUM_PER_PET; i++) {
            pos = config.m_uiEquipPosition + i;
            let itemData: BeautyEquipListItemData = this.m_equipListData[i];
            data = itemData.thingItemData;
            equipPart = KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN + i;

            if (equipObject != null && equipObject[pos] != null) {
                data.config = equipObject[pos].config;
                data.data = equipObject[pos].data;
                data.containerID = equipObject[pos].containerID;
                let beautyBetterEquip: ThingItemData = G.DataMgr.thingData.getBeautyBetterEquip(equipPart, pet, allEquipInBag);
                itemData.showUp = null != beautyBetterEquip;
            }
            else {
                data.config = null;
                data.data = null;
                itemData.showUp = false;
            }
            let equipIconItem = this.equipItems[this.equipParts.indexOf(equipPart)];
            equipIconItem.updateByBeautyEquipListItemData(itemData);
            equipIconItem.updateEquipIcon(GameIDType.PET_EQUIP, KeyWord.HERO_SUB_TYPE_MEIREN, i);

            if (i < PetData.EQUIP_NUM_PER_PET - 2 && equipIconItem.equipIsNullShowTip) {
                this.showWearTipIndexs.push(i);
            }
            this.showWearEquipTip();
        }

        if (this.curFuncTab == PetJinJieFuncTab.juexing) {
            // 更新属性和战斗力
            //FightingStrengthUtil.getPetAttr(pet, this.jueXingProps);
        }
        else {
            // 更新属性和战斗力
            this.m_allProps = FightingStrengthUtil.getPetAttr(pet, this.m_allProps);
            this._updateProps(this.propItems, this.m_allProps, isFight);
        }
    }

    /**
     * 刷新属性
     * @param propItems
     * @param propDatas
     * @param isFight
     */
    private _updateProps(propItems: PetPropItem[], propDatas: GameConfig.BeautyPropAtt[], isFight: boolean = false) {
        let jueXingPropData: GameConfig.BeautyPropAtt[] = [];
        for (let i = 0; i < this.maxPropCnt; i++) {
            this.propItems[i].gameObject.SetActive(false);
        }

        for (let i: number = 0; i < propDatas.length; i++) {
            propItems[i].update(propDatas[i].m_ucPropId, propDatas[i].m_iPropValue);
        }
    }


    onContainerChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
            // 刷新是否可进阶的红点
            this.updatePetListItemInfo()
        }
        else if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            // 刷新装备位提示，因背包里可能多了装备，要显示点击装备
            for (let i: number = 0; i < PetData.EQUIP_NUM_PER_PET; i++) {
                let equipIconItem = this.equipItems[i];
                equipIconItem.updateEquipIcon(GameIDType.PET_EQUIP, KeyWord.HERO_SUB_TYPE_MEIREN, i);
            }
            this.updateFight();

            let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
            if (pet == null) {
                return;
            }

            if (PetJinJieFuncTab.jinjie == this.curFuncTab) {
                // 进阶
                this.updateJinjieMaterial();
            }
            else if (PetJinJieFuncTab.juexing == this.curFuncTab) {
                //觉醒
                this.updateJiuXingPanel();
            }
            // 刷新是否可进阶的红点
            this.updatePetListItemInfo();

            //按钮红点提示
            this.skillTipMark.SetActive(G.DataMgr.petData.canKfSkillUp(this.curPetId, false));
            this.jinjieTipMark.SetActive(G.DataMgr.petData.isOnePetCanJinJie(this.curPetId));
            this.juexingTipMark.SetActive(G.DataMgr.petData.isOnePetCanAwaken(this.curPetId));
        }

        if (type == Macros.CONTAINER_TYPE_BEAUTY_EQUIP || type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateEquip();
        }
    }

    private onClickEquipIcon(iconItem: IconItem) {
        // 显示tip
        let index = this.equipItems.indexOf(iconItem);
        let equipPart: number = this.equipParts[index];
        let wearThingData: ThingItemData = this.m_equipListData[index].thingItemData;
        G.ActionHandler.showBagEquipPanel(equipPart, wearThingData, this.curPetId, GameIDType.PET_EQUIP);
    }

    /**点击未激活的觉醒按钮 */
    private onClickJuexingTip() {
        let isopen = G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_WUYUAN_AWAKE, true);
        if (isopen)
            this.btnJuexingTip.SetActive(false);
    }

    /**
     * 点击右侧group（成长，技能）
     * @param index
     */
    private onFuncGroup1Change(index: number) {
        //this.jinjieFunc.SetActive(index == 0);
        //this.skillFunc.SetActive(index == 1);
        this.onFuncGroup2Change(index);
    }
    private curGroupIndex = 0;
    private onFuncGroup2Change(index: number) {
        this.resetOnChangeSelect();

        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        if (null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            this.curFuncTab = index;
        }
        if (PetJinJieFuncTab.jinjie == index) {
            // 显示进阶
            this.jinjieFunc.SetActive(true);
            this.skillFunc.SetActive(false);
            this.propGo.SetActive(true);
            this.updateJinjie();
            this.petJuexingPanel.onClose();
        }
        else if (PetJinJieFuncTab.skill == index) {
            // 显示功法技能
            this._stopAutoEnhance();
            this.jinjieFunc.SetActive(false);
            this.skillFunc.SetActive(true);
            this.propGo.SetActive(false);
            this.updateGongFa();
            this.petJuexingPanel.onClose();
        }
        else if (PetJinJieFuncTab.lianShen == index) {
            //显示炼神飞升
            this._stopAutoEnhance();
            this.jinjieFunc.SetActive(false);
            this.skillFunc.SetActive(false);
            this.propGo.SetActive(true);
            this.petJuexingPanel.onClose();
        }
        else if (PetJinJieFuncTab.juexing == index) {
            this._stopAutoEnhance();
            this.jinjieFunc.SetActive(false);
            this.skillFunc.SetActive(false);
            this.propGo.SetActive(true);
            this.updateJiuXingPanel();
            this.petJuexingPanel.onOpen();

        }

        this.curGroupIndex = index;

    }
    /**点击激活 */
    private onBtnActivateClick() {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        if (pet == null) {
            return;
        }
        if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
            if (pet.m_iCanUseCard > 0) {
                // 使用激活卡激活
                let cardItemDatas = G.DataMgr.thingData.getBagItemById(pet.m_iCanUseCard, true, 1);
                if (cardItemDatas.length > 0) {
                    let card = cardItemDatas[0];
                    G.ModuleMgr.bagModule.useThing(card.config, card.data, 1, true, 0);
                }
            } else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getActivePetRequest(pet.m_iBeautyID));
            }
            // 没材料了，跳过装备指引
            G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_ClickActivate);
        }
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_ClickActivate);
    }

    /**点击出战 */
    private onBtnFightClick() {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        if (pet == null) {
            return;
        }
        if (Macros.BATHE_SCENE_ID == G.DataMgr.sceneData.curSceneID) {
            G.TipMgr.addMainFloatTip('该场景无法出战伙伴');
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetBattleRequest(pet.m_iBeautyID));
    }

    /**点击进阶 */
    private onBtnEnhanceClick() {
        if (this.m_costData.id == 0) {
            return;
        }
        if (this.m_costData.has >= this.m_costData.need) {
            this.requsetEnhance();
        }
        else {
            this._stopAutoEnhance();
            if (!G.GuideMgr.isGuiding(EnumGuide.PetActivate) && !G.GuideMgr.isGuiding(EnumGuide.Pet)) {
                let num = this.m_costData.need - this.m_costData.has;
                G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, delegate(this, this.requsetEnhance));
            }
            // if (this.petStage >= ThingData.minLvOpenBatBuyViwe) {
            //     if (!G.GuideMgr.isGuiding(EnumGuide.PetActivate) && !G.GuideMgr.isGuiding(EnumGuide.Pet)) {
            //         let num = this.m_costData.need - this.m_costData.has;
            //         G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, delegate(this, this.requsetEnhance));
            //     }
            // } else {
            //     G.TipMgr.addMainFloatTip("材料不足");
            // }
        }

    }

    /**点击 自动进阶 */
    private onBtnAutoEnhanceClick() {
        if (!this.m_isAutoEnhance) {
            this._startAutoEnhance();
        }
    }

    /**点击 停止进阶 */
    private onBtnStopAutoClick() {
        if (this.m_isAutoEnhance) {
            this._stopAutoEnhance();
        }
    }

    /**请求强化*/
    private requsetEnhance(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetEnhanceRequest(this.curPetId));
    }

    private _startAutoEnhance(): void {
        if (!this.m_isAutoEnhance) {
            this.m_isAutoEnhance = true;
            UIUtils.setButtonClickAble(this.btnEnhance, false);
            this.updateBtnAutoEnhance();

            this.onBtnEnhanceClick();
        }
    }

    private _stopAutoEnhance(): void {
        if (this.m_isAutoEnhance) {
            this.m_isAutoEnhance = false;
            UIUtils.setButtonClickAble(this.btnEnhance, this.m_costData.id > 0);
            UIUtils.setButtonClickAble(this.btnAutoEnhance, this.m_costData.id > 0);
            this.updateBtnAutoEnhance();

            // 没材料了，跳过装备指引
            G.GuideMgr.processGuideNext(EnumGuide.Pet, EnumGuide.Pet_ClickJinJie);
        }
        this.removeTimer("petjin");
    }

    private updateBtnAutoEnhance() {
        this.btnAutoEnhance.SetActive(!this.m_isAutoEnhance);
        this.btnStopAuto.SetActive(this.m_isAutoEnhance);
        UIUtils.setButtonClickAble(this.btnEnhance, this.m_costData.id > 0 && !this.m_isAutoEnhance);
    }

    updateView(isActivePet: boolean = false) {
        this.updatePetListItemInfo();
        this.updateSelectedPet();
        //激活需要，点击一下进阶按钮，要不，进阶数据没刷新
        if (isActivePet) {
            this.onFuncGroup2Change(PetJinJieFuncTab.jinjie);
            this.openPetId = this.curPetId;
            this.autoSelectPet();
        }
        this.calAllPetFightValue();
    }

    updateByStageUpResp(response: Protocol.BeautyStageUp_Response) {
        if (response.m_iResult == 0) {
            if (response.m_ucSucces > 0) {
                G.AudioMgr.playStarBombSucessSound();
                let star: number = (response.m_stBeautyInfo.m_uiStage - 1) % 10;
                if (star > 0) {
                    this.addEffect(star - 1);
                }
                else {
                    this.addEffect(9);
                    G.ActBtnCtrl.update(false);
                    if (this.m_isAutoEnhance) {
                        this._stopAutoEnhance();
                    }
                }
            }
            else {
                G.TipMgr.addPosTextMsg('提升失败!', Color.RED, this.flyPos.transform, 0, 0, false);
            }

            if (this.m_isAutoEnhance) {
                let time: number = G.SyncTime.getCurrentTime();
                if (time - this.m_autoTime > this.deltaTime) {
                    this.m_autoTime = time;
                    this.onBtnEnhanceClick();
                }
                else {
                    this.addTimer("petjin", this.deltaTime, 1, this._onAutoEnhanceTimer);
                }

                UIUtils.setButtonClickAble(this.btnEnhance, false);
            }

            // 更新阶数
            let stage = PetData.getPetStage(response.m_stBeautyInfo.m_uiStage, response.m_stBeautyInfo.m_iBeautyID);
            let curStage = stage >= this.maxStage ? this.maxStage : stage;
            this.txtLv.text = DataFormatter.toHanNumStr(curStage) + "阶";
            this.levelTxt.text = DataFormatter.toHanNumStr(curStage) + "阶";
            this.petStage = curStage;
            // 因现在伙伴成长100%成功，pet data change 会调用updateView，updateView会调用updateJinjie
            //this.updateJinjie();
            // 更新属性和战斗力
            let pet = G.DataMgr.petData.getPetInfo(this.curPetId);
            FightingStrengthUtil.getPetAttr(pet, this.m_allProps);
            this.updateJinjie();
        }
        else {
            this._stopAutoEnhance();
        }
    }

    private _onAutoEnhanceTimer() {
        this.m_autoTime = G.SyncTime.getCurrentTime();
        this.onBtnEnhanceClick();
    }

    private playJinJieEffect() {
        this.jinjieUIEffect.playEffect(EffectType.Effect_Normal, true);
    }

    updateByJuShenResp(response: Protocol.BeautyJuShen_Response) {
        if (response.m_iResult == 0) {
            let star: number = PetData.getJushenStar(response.m_stBeautyInfo.m_stJuShen.m_uiLevel);
            let effectIndex = 0;
            if (star > 0) {
                effectIndex = star - 1;
                G.AudioMgr.playStarBombSucessSound();
            }
            else {
                //4表示最后一颗
                effectIndex = 4;
                G.AudioMgr.playJinJieSucessSound();
                this.playLiZiEffect();
                //飞升后需要刷新模型
                this.updateSelectedPet();
            }
            // 更新属性和战斗力
            let pet = G.DataMgr.petData.getPetInfo(this.curPetId);
            FightingStrengthUtil.getPetAttr(pet, this.m_allProps);
            this._updateProps(this.propItems, this.m_allProps);
            this.updatePetListItemInfo();
            // 更新阶数
            let stage = PetData.getPetStage(response.m_stBeautyInfo.m_uiStage, response.m_stBeautyInfo.m_iBeautyID);
            let curStage = stage >= this.maxStage ? this.maxStage : stage;
            this.txtLv.text = DataFormatter.toHanNumStr(curStage) + "阶";

            this.levelTxt.text = DataFormatter.toHanNumStr(curStage) + "阶";

            this.petStage = curStage;
        }
    }

    updateByGongFaResp(response: Protocol.BeautyKF_Response) {
        if (response.m_iResult == 0) {
            G.TipMgr.addPosTextMsg('升级成功', Color.GREEN, this.flyPos.transform, 0, 0, false);
            this.updateGongFa();
            // 更新属性和战斗力
            let pet = G.DataMgr.petData.getPetInfo(this.curPetId);
            FightingStrengthUtil.getPetAttr(pet, this.m_allProps);
            this._updateProps(this.propItems, this.m_allProps);
        }
    }

    /**
     * 伙伴觉醒响应
     * @param response
     */
    updateByJueXingResp(response: Protocol.BeautyAwake_Response) {
        this.petJuexingPanel.serverResponse(response.m_iResult, response.m_stValue.m_stAwakeStrengthenRsp.m_usLuck);

        this.updateJiuXingPanel();
    }

    private onBtnTypeClick() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(430), '伙伴类型');
    }

    private onClickGotoJJR() {
        let funcId = 0;
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK)) {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK;
        } else {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY;
        }
        G.ActionHandler.executeFunction(funcId);
    }

    /**
     * 设置伙伴类型（图片显示）
     * @param des
     */
    private setImageType(des: string) {
        if (this.typeDate == null) {
            this.typeDate = {};
            this.typeDate["群攻型"] = "1";
            this.typeDate["刺杀型"] = "2";
            this.typeDate["辅助型"] = "3";
            this.typeDate["治疗型"] = "4";
        }

        this.imgType.sprite = this.typeAtlas.Get(this.typeDate[des]);
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    getSelectedPetItem(): UnityEngine.GameObject {
        //let selected = this.petList.Selected;
        //if (selected >= 0) {
        //    return this.petList.GetItem(8).gameObject;
        //}

        if (this.firstSelectIndex >= 0 && this.secondSelectIndex >= 0) {
            let item = this.petGroupList.GetSubList(this.firstSelectIndex).GetItem(this.secondSelectIndex);
            if (null != item) {
                return item.gameObject;
            }
        }
        return null;
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.Pet_ClickJinJie == step) {
            this.onBtnAutoEnhanceClick();
            return true;
        } else if (EnumGuide.PetActivate_ClickActivate == step) {
            this.onBtnActivateClick();
            return true;
        }
        return false;
    }
}