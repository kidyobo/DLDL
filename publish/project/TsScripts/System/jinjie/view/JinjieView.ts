import { EnumGuide, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { ZhufuData } from 'System/data/ZhufuData';
import { WingEquipJingLianPanel } from 'System/equip/WingEquipJingLianPanel';
import { Global as G } from "System/global";
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { ShiZhuangPanel } from "System/hero/view/ShiZhuangPanel";
import { ArtifactView } from 'System/jinjie/view/ArtifactView';
import { RideView } from 'System/jinjie/view/RideView';
import { Macros } from 'System/protocol/Macros';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { EquipUtils } from 'System/utils/EquipUtils';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { TabFormCommom } from '../../uilib/TabFormCommom';

/**该界面为(坐骑,神器)父界面*/
export class JinjieView extends TabFormCommom implements IGuideExecutor {
    private currencyTip: CurrencyTip;
    private openTabId: number = 0;
    private showId: number = 0;

    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [true, true, true, true];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;
    btnReturn: UnityEngine.GameObject = null;

    constructor() {
        super(KeyWord.BAR_FUNCTION_IMPROVE, ShiZhuangPanel, ArtifactView, RideView, WingEquipJingLianPanel);
        this._cacheForm = true;
    }

    open(openTabId: number = 0, showId: number = 0) {
        this.openTabId = openTabId;
        this.showId = showId;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.JinjieView;
    }

    protected initElements() {
        super.initElements();
        this.setTabGroupNanme(["时装", "武魂", "坐骑", "灵翼"]);
        this.setTitleName("进阶");
        // this.setFightActive(false);

        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
        this.btnReturn = this.getCloseButton();
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());
    }

    protected initListeners() {
        super.initListeners();
        Game.UIDragListener.Get(this.bg_3D).onDrag = delegate(this, this.onDrag);
        this.addClickListener(this.btnReturn, this.onClickCloseBt);
        this.addClickListener(this.elems.getElement('mask'), this.onClickCloseBt);
    }

    private onDrag() {
        let view = this.getCurrentTab();
        if (view && view.isOpened) {
            if ((view as any).onDrag) {
                (view as any).onDrag();
            }
        }
    }

    protected onOpen() {
        this.judgeTabGroupCount();
        this.switchTabFormById(this.openTabId, this.showId);
        this.updateTipMark();
        this.currencyTip.updateMoney();
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
    }

    protected onClose() {
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.MountEnhance, EnumGuide.MountEnhance_ClickClose);
    }

    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    private onClickCloseBt() {
        this.close();
    }

    onMoneyChange(id: number) {
        this.currencyTip.updateMoney();
    }

    onContainerChange(type: number) {
        let currentForm = this.getCurrentTab();
        if (null == currentForm || !currentForm.isOpened) {
            return;
        }
        if (currentForm.Id == KeyWord.HERO_SUB_TYPE_ZUOQI) {
            let rideView = currentForm as RideView;
            if (Macros.CONTAINER_TYPE_ROLE_BAG == type || type == GameIDUtil.getContainerIDBySubtype(rideView.Id)) {
                rideView.updateViewLater(false);
            }
        } else if (currentForm.Id == KeyWord.HERO_SUB_TYPE_WUHUN) {
            let view = currentForm as ArtifactView;
            if (Macros.CONTAINER_TYPE_ROLE_BAG == type || type == GameIDUtil.getContainerIDBySubtype(view.Id)) {
                view.updateViewLater(false);
            }
        }
        this.updateTipMark();
    }

    /**判断tabgroup个数*/
    private judgeTabGroupCount() {

        //检查功能是否开启
        let count = this.getTabCount();
        for (let i = 0; i < count; i++) {
            let form = this.getTabFormByIndex(i);
            let formid = form.Id;
            if (form.Id == KeyWord.HERO_SUB_TYPE_WUHUN || form.Id == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                formid = GameIDUtil.getFuncIdBySubType(form.Id);
            }
            let visible = G.DataMgr.funcLimitData.isFuncEntranceVisible(formid) && !G.DataMgr.otherPlayerData.isOtherPlayer;
            this.tabGroup.GetToggle(i).gameObject.SetActive(visible);
        }
    }


    updateTipMark() {
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let thingData = G.DataMgr.thingData;
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let tagtype: number = form.Id;
            //if (tagtype == KeyWord.BAR_FUNCTION_ROLE) {
            //    this.setTabTipMark(i, false);
            //} else  {
            //    //this.setTabTipMark(i, G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_ZUOQI));
            //    let show1 = zhufuData.isShowZhuFuCZTipMark(tagtype);
            //    let show2 = thingData.checkThingForZhufu(tagtype);
            //    this.setTabTipMark(i, show1 || show2);
            //    (form as RideView).updateTips(show1, show2);
            //}
            if (tagtype == KeyWord.HERO_SUB_TYPE_ZUOQI /*|| tagtype == KeyWord.HERO_SUB_TYPE_WUHUN*/) {
                let show1 = zhufuData.isShowZhuFuCZTipMark(tagtype);
                let show2 = thingData.checkThingForZhufu(tagtype);
                this.setTabTipMark(i, show1 || show2);
                (form as RideView).updateTips(show1, show2);
            } else if (tagtype == KeyWord.HERO_SUB_TYPE_WUHUN) {
                let show2 = thingData.checkThingForZhufu(tagtype);
                this.setTabTipMark(i, show2);
            }
            else if (tagtype == KeyWord.OTHER_FUNCTION_DRESS) {
                let istipmark = TipMarkUtil.shiZhuangQHTip() > 0 || null != EquipUtils.getFirstCanDressPyInfo() || EquipUtils.canSaijiDressActive();
                this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DRESS, istipmark);
            }
            else if (tagtype == KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) {
                this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN, TipMarkUtil.isShowWingEquipStrengthTipMark());
            }
        }
    }

    /**羽翼 */
    updateWingEquipPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) as WingEquipJingLianPanel;
        if (view.isOpened) {
            view.updateStrengthSucceed();
        }
        //小红点
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN, TipMarkUtil.isShowWingEquipStrengthTipMark());
    }
    /**羽翼幻化回复时,刷新面板 */
    public updateWingHuanHua() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) as WingEquipJingLianPanel;
        if (view.isOpened) {
            view.onHHDataChange();
        }
        //小红点
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN, TipMarkUtil.isShowWingEquipStrengthTipMark());
    }


    /**羽翼幻化回复时,刷新面板 */
    public updateRideHuanHua() {
        let view = this.getTabFormByID(KeyWord.HERO_SUB_TYPE_ZUOQI) as RideView;
        if (view.isOpened) {
            view.updateViewLater(false);
        }
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.MountEnhance_ClickClose == step) {
            this.onClickCloseBt();
            return true;
        }
        return false;
    }


}
