import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { HeroView } from 'System/hero/view/HeroView'

/**称号特殊物品可使用时*/
export class TitleCanUseTipView extends CommonForm {

    /**使用物品*/
    private m_btnUse: UnityEngine.GameObject;
    /**称号id*/
    private m_id: number = 0;
    /**物品类型*/
    private m_type: number = 0;
    /**称号*/
    private modelPos: UnityEngine.GameObject;
    /**限制等级*/
    static M_LEVEL: number = 60;
    private _btnClose: UnityEngine.GameObject;
    private thingUseNotify: Protocol.SpecialThingUsable_Notify = null;
    private btn_UseText: UnityEngine.UI.Text;


    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }


    open(response: Protocol.SpecialThingUsable_Notify) {
        this.thingUseNotify = response;
        super.open();
    }


    layer(): UILayer {
        return UILayer.Second;
    }


    protected resPath(): string {
        return UIPathData.TitleCanUseTipView;
    }


    protected initElements() {
        this.modelPos = this.elems.getElement('modelTrans');
        this.m_btnUse = this.elems.getElement('btn_use');
        this.btn_UseText = this.elems.getText('btName');
    }


    protected initListeners() {
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.m_btnUse, this.onClickBtnUse);
    }


    protected onOpen() {
        if (this.thingUseNotify == null) {
            return;
        }
        this.m_id = this.thingUseNotify.m_uiThingID;
        this.m_type = this.thingUseNotify.m_ucThingType;
        if (this.m_type == Macros.SPECIAL_THING_TYPE_TITLE) {
            this.updateChenghao();
        }
    }


    protected onClose() {

    }

    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    private updateChenghao(): void {

        let titleConfig = G.DataMgr.titleData.getDataConfig(this.m_id);
        if (titleConfig == null) {
            uts.log(uts.format('获得了一个配置表没有的称号：{0}', this.m_id));
            return;
        }
        this.updateBtnLabel();
        G.ResourceMgr.loadModel(this.modelPos, UnitCtrlType.chenghao, titleConfig.m_uiImageID.toString(), 0);
    }


    /**点击使用按钮*/
    private onClickBtnUse() {
        if (this.m_type == Macros.SPECIAL_THING_TYPE_TITLE && G.DataMgr.heroData.level > TitleCanUseTipView.M_LEVEL) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTitleActiveChangeRequest(Macros.TITLE_SET_SHOW, this.m_id, 1));
        }
        else {
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_HEROTITLE, this.m_id);
        }
        this.close();
    }

    
    onHeroDataChange() {
        this.updateBtnLabel();
    }

    //addEvent(EventTypes.HeroDataChange, updateBtnLabel);
    private updateBtnLabel() {
        if (G.DataMgr.heroData.level > TitleCanUseTipView.M_LEVEL) {
            this.btn_UseText.text = '立即佩戴';
        }
        else {
            this.btn_UseText.text = '前往佩戴';
        }
    }


}




