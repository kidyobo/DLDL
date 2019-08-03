import { FanLiDaTingView } from './../activity/fanLiDaTing/FanLiDaTingView';
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Global as G } from 'System/global'
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from 'System/constants/KeyWord'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { Events } from 'System/Events'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumGuide, EnumAutoUse, UnitCtrlType } from 'System/constants/GameEnum'
import { YiYuanDuoBaoView, YiYuanDuoBaoGroupType } from 'System/activity/YunYingHuoDong/YiYuanDuoBaoView'
import { DailyRechargeView } from '../activity/view/DailyRechargeView';


export class LingBaoOverDueView extends CommonForm {

    private lingBaoId: number = 0;

    private btn_xufei: UnityEngine.GameObject;
    private btn_return: UnityEngine.GameObject;

    private lingbao_huo: UnityEngine.GameObject;
    private lingbao_shui: UnityEngine.GameObject;
    private lingbao_mu: UnityEngine.GameObject;

    private modlePos: UnityEngine.GameObject;
    private modelParentTransform: UnityEngine.Transform;

    constructor() {
        super(0);
    }

    open(id: number = 0) {
        this.lingBaoId = id;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.LingBaoOverDueView;
    }

    protected initElements() {

        this.btn_xufei = this.elems.getElement('btn_xufei');
        this.btn_return = this.elems.getElement('btn_return');
        this.lingbao_huo = this.elems.getElement('lingbaohuo');
        this.lingbao_shui = this.elems.getElement('lingbaoshui');
        this.lingbao_mu = this.elems.getElement('lingbaomu');

        this.modlePos = this.elems.getElement("RoleGameObject");
        this.modelParentTransform = this.elems.getTransform('qysPos');
    }


    protected initListeners() {
        this.addClickListener(this.btn_xufei, this.onClickBtXuFei);
        this.addClickListener(this.btn_return, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
    }

    protected onOpen() {
        this.setModlePosTransform();
        this.updatePanel();
    }


    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.OverDue, EnumGuide.GuideCommon_None);
    }


    private onClickBtnClose() {
        this.close();
    }

    private setModlePosTransform() {
        this.modelParentTransform.localPosition = new UnityEngine.Vector3(-10, 0, 0);
        this.modelParentTransform.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
        this.modelParentTransform.transform.localScale = new UnityEngine.Vector3(160, 160, 160);
    }

    private updatePanel() {
        let lingbaoCfg: GameConfig.LingBaoCfgM = G.DataMgr.lingbaoData.getLingBaoCfg(this.lingBaoId);
        let equipCfg: GameConfig.EquipConfigM = ThingData.getThingConfig(lingbaoCfg.m_iEquipId);
        let buffCfg: GameConfig.BuffConfigM = BuffData.getBuffByID(equipCfg.m_iFunctionID);
        //this._ui.numFight.setValue(lingbaoCfg.m_iFight);
        let buffEffect: GameConfig.BuffEffect = buffCfg.m_astBuffEffect[0];
        if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_HARM_ADD) {
            //火精灵
            this.setLingBaoActive(true, false, false);
            G.ResourceMgr.loadModel(this.modlePos, UnitCtrlType.lingbao, "350013", this.sortingOrder);
        }
        else if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_SKILL_DEC_DAMAGE) {
            //水精灵
            this.setLingBaoActive(false, true, false);
        }
        else if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_ROLE_EXPERENCE_RATE) {
            //木精灵
            this.setLingBaoActive(false, false, true);
        }
    }


    private setLingBaoActive(huoActive: boolean, shuiActive: boolean, muActive: boolean) {
        this.lingbao_huo.SetActive(huoActive);
        this.lingbao_shui.SetActive(shuiActive);
        this.lingbao_mu.SetActive(muActive);
    } 


    private onClickBtXuFei() {
        let lingbaoCfg: GameConfig.LingBaoCfgM = G.DataMgr.lingbaoData.getLingBaoCfg(this.lingBaoId);
        let itemList = G.DataMgr.thingData.getBagItemById(lingbaoCfg.m_iAddTimeItem, false, 1);
        if (itemList != null && itemList.length > 0) {
            let item = itemList.shift();
            G.ModuleMgr.bagModule.useThing(item.config, item.data, item.data.m_iNumber);
        }
        else {
            //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(lingbaoCfg.m_iAddTimeItem, 1, 0, 0, 0, EnumAutoUse.NormalUse);
            // G.Uimgr.createForm<YiYuanDuoBaoView>(YiYuanDuoBaoView).open(YiYuanDuoBaoGroupType.meiriyiyuanPanel);
            if (G.SyncTime.getDateAfterStartServer() >= 8) {
                G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
            } else {
                G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
            }
        }
        this.close();
    }
}