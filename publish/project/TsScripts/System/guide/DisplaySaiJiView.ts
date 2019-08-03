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
import { UnitCtrlType } from 'System/constants/GameEnum'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


export class DisplaySaiJiView extends CommonForm implements IGuideExecutor {
    private readonly AutoTimerKey = '1';
    private readonly AutoSeconds = 5;
    private readonly Min_Slider_Value = 0.09;

    private imgSlider: UnityEngine.UI.Image;
    private txtSlider: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private icon: UnityEngine.UI.RawImage;
   

    private m_crtThingId = 0;
    private saiJiCfg: GameConfig.SaiJiConfigM;

    private leftSeconds = 0;
    private autoUse = false;
  
    private tweenSlider: Tween.TweenImageFillAmount;
    private tweenSliderSpendTime: number = 0.2;
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.DisplaySaiJiView;
    }
    protected initElements(): void {
        this.txtSlider = this.elems.getText("txtSlider");
        this.txtName = this.elems.getText("txtName");
        this.imgSlider = this.elems.getImage("imgSlider");
        this.icon = this.elems.getRawImage("icon");
      
       // this.tweenSlider = this.imgSlider.gameObject.AddComponent(Tween.TweenSlider.GetType()) as Tween.TweenSlider;
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("mask"), this.onClickMask);
    }


    open(thingId: number) {
        this.m_crtThingId = thingId;
        super.open();
    }


    protected onOpen() {
        this.addTimer(this.AutoTimerKey, 1000, this.AutoSeconds, this.onAutoTimer);
        this.updateDisplayView();
    }

    protected onClose() {
        this.m_crtThingId = 0;
        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.DisplaySaiJi, EnumGuide.GuideCommon_None);
        this.removeTimer(this.AutoTimerKey);
    }

    

    private onclickBtnReturn() {
        this.close();
    }

    updateDisplayView() {
        let zhufuData = G.DataMgr.zhufuData;
        this. saiJiCfg = zhufuData.getSaiJiCfgByThingId(this.m_crtThingId);
        if (!this.saiJiCfg)
            return;
        this.txtName.text = this.saiJiCfg.m_szSeasonname;
        let seasonID = this.saiJiCfg.m_iSeasonID;
        let hasActive = zhufuData.hasActiveThisWaiXian(this.saiJiCfg, seasonID);
        if (hasActive) {
            this.txtSlider.text = "已激活";
            this.imgSlider.fillAmount =1;
        } else {
            let has = G.DataMgr.thingData.getThingNum(this.m_crtThingId, 0, false);
            let value = has / this.saiJiCfg.m_iSutffCount;
            //值太小，只有几个收集看不见
            if (value < this.Min_Slider_Value) {
                value += this.Min_Slider_Value;
            } else if (value>1){
                value = 1;
            }
            this.txtSlider.text = uts.format("{0}/{1}", has, this.saiJiCfg.m_iSutffCount);
            this.imgSlider.fillAmount = this.Min_Slider_Value;
            Game.Invoker.BeginInvoke(this.imgSlider.gameObject, "key", 0.5, delegate(this, this.barStart, value))
        }

        let thingCfg = ThingData.getThingConfig(this.saiJiCfg.m_iSutffID);
        if (!thingCfg) {
            return;
        }
        let iconStr: string = thingCfg.m_szIconID;
        if (thingCfg.m_ucFunctionType == KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE&&zhufuData.shiZhuangAndWeapons.indexOf(thingCfg.m_iFunctionID) >= 0) {
            let pro = G.DataMgr.heroData.profession;
            let suffix = pro == 2 ? "a" : "b";
            iconStr += suffix;
        }
        G.ResourceMgr.loadIcon(this.icon, iconStr, -1);

    }
    private barStart(value: number) {
        this.imgSlider.fillAmount = this.Min_Slider_Value;
        Tween.TweenImageFillAmount.Begin(this.imgSlider.gameObject, this.tweenSliderSpendTime, value);
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

    private onClickMask() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, this.saiJiCfg.m_iImageID);
        this.close();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (this.hasTimer(this.AutoTimerKey)) {
            // this.onClickBtnUse();
        }
        return true;
    }
}