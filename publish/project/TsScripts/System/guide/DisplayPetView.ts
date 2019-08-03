import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
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
import { EnumGuide } from 'System/constants/GameEnum'
import { GetThingGuider } from 'System/guide/cases/GetThingGuider'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { PetData } from 'System/data/pet/PetData'
import { AchievementData } from 'System/data/AchievementData'
import { Color } from 'System/utils/ColorUtil'
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
import { UnitCtrlType} from 'System/constants/GameEnum'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


export class DisplayPetView extends CommonForm implements IGuideExecutor {
    private readonly AutoTimerKey = '1';
    private readonly AutoSeconds = 5;

    private mask: UnityEngine.GameObject;
    private bar: UnityEngine.GameObject;
    private txtSlider: UnityEngine.UI.Text;
   

    private m_crtThingId = 0;

    private leftSeconds = 0;
    private autoUse = false;

    /**美人模型*/
    private petModelCtn: UnityEngine.Transform;
    private petAvatar: PetAvatar;
    private lastAvatarKey: string;
    private tweenSlider: Tween.TweenScale;
    private tweenSliderSpendTime: number = 0.4;
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.DisplayPetView;
    }


    open(thingId: number) {
        this.m_crtThingId = thingId;
        super.open();
    }


    protected onOpen() {
        // 拉取美人数据
        this.addTimer(this.AutoTimerKey, 1000, this.AutoSeconds, this.onAutoTimer);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPetPanelRequest());
    }

    protected onClose() {
        this.m_crtThingId = 0;
        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.DisplayPet, EnumGuide.GuideCommon_None);
        this.removeTimer(this.AutoTimerKey);
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.bar = this.elems.getElement("bar");
        this.txtSlider = this.elems.getText("txtSlider");
        this.petModelCtn = this.elems.getTransform("petModelCtn");
    }

    protected initListeners(): void {
       this.addClickListener(this.mask, this.onclickBtnReturn);
    }


    private onclickBtnReturn() {
        this.close();
    }

    updateDisplayPetView() {
        let itemData = ThingData.getThingConfig(this.m_crtThingId);
        if (itemData != null && itemData.m_iFunctionID > 0) {

            let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(itemData.m_iFunctionID);
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(itemData.m_iFunctionID);
            let achiConfig: GameConfig.AchiConfigM = AchievementData.getConfigVo(config.m_iCondition);

            if (pet != null)
            {
                let currentColor: string = pet.m_uiDoneCount >= achiConfig.m_uiQuestValue ? Color.GREEN : Color.RED;
                if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                    let stage = PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID);
                    this.txtSlider.text = stage + "阶";
                    this.bar.transform.localScale = G.getCacheV3(1, 1, 1);
                }
                else {
                    // 预览条件
                    this.txtSlider.text = TextFieldUtil.getColorText(pet.m_uiDoneCount.toString(), currentColor) + "/" + achiConfig.m_uiQuestValue;
                    let value = pet.m_uiDoneCount / achiConfig.m_uiQuestValue;
                   // this.bar.transform.localScale = G.getCacheV3(value > 1 ? 1 : value, 1, 1);
                    Game.Tools.SetLocalScale(this.bar.transform as UnityEngine.RectTransform, 0, 1, 1);
                    Game.Invoker.BeginInvoke(this.bar, "key", 1, delegate(this,this.barStart,value))
                   
                    //this.tweenSlider.onFinished = delegate(this, this.tweenSliderOver, value, 1);
                }
                this.showPetModel(pet.m_iBeautyID);
            }
        }
    }
    private barStart(value: number)
    {
        this.tweenSliderSpendTime = 1;
        Game.Tools.SetLocalScale(this.bar.transform as UnityEngine.RectTransform, 0, 1, 1);
        this.tweenSlider = Tween.TweenScale.Begin(this.bar, this.tweenSliderSpendTime, G.getCacheV3(value > 1 ? 1 : value, 1, 1));
    }
    
    private tweenSliderOver(curExp: number, maxExp: number)
    {

        if (this.tweenSlider != null)
        {
            UnityEngine.UnityObject.DestroyImmediate(this.tweenSlider);
            this.tweenSlider = null;
        }
        let endValue = curExp / maxExp;
        this.tweenSliderSpendTime = endValue;
        Game.Tools.SetLocalScale(this.bar.transform as UnityEngine.RectTransform, 0, 1, 1);
        this.tweenSlider = Tween.TweenScale.Begin(this.bar, this.tweenSliderSpendTime, G.getCacheV3(endValue, 1, 1));
    }


    private showPetModel(petId: number) {
        let stageConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(petId, 1);
        let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let fabao: number = G.DataMgr.heroData.avatarList.m_uiFabaoShowID;

        let avatarKey = stageConfig.m_iModelID + '-' + fabao;
        if (this.lastAvatarKey != avatarKey) {
            this.lastAvatarKey = avatarKey;
            if (null != this.petAvatar) {
                this.petAvatar.destroy();
            }
            this.petAvatar = new PetAvatar(this.petModelCtn, this.petModelCtn);
            this.petAvatar.setSortingOrder(this.sortingOrder);
            this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, stageConfig.m_iModelID.toString(), true, false);

            let fabaoCfg = G.DataMgr.fabaoData.getFabaoConfig(fabao);
            if (null != fabaoCfg) {
                this.petAvatar.updateShengQiModel(fabaoCfg.m_iModelID);
            }
        }
    }

    private onAutoTimer(timer: Game.Timer) {
        let leftSeconds = this.AutoSeconds - timer.CallCount;
        if (leftSeconds <= 0) {
            this.close();
        }
    }

    checkCurrentId(id: number): boolean {
        if (this.isOpened && this.m_crtThingId == id) {
            // 跟当前的物品id一致，刷新数量
            let itemDatas = G.DataMgr.thingData.getBagItemById(id, false, 1);
            if (itemDatas.length > 0) {
                let itemData = itemDatas[0];
                return true;
            }
        }
        return false;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (this.hasTimer(this.AutoTimerKey)) {
           // this.onClickBtnUse();
        }
        return true;
    }
}