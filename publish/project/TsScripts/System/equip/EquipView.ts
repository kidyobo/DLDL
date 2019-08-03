import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { EquipCollectPanel } from 'System/equip/EquipCollectPanel';
import { EquipFuHunPanel } from 'System/equip/EquipFuHunPanel';
import { EquipLianTiPanel } from 'System/equip/EquipLianTiPanel';
import { EquipPartLevelUpPanel } from 'System/equip/EquipPartLevelUpPanel';
import { EquipStrengPanel } from 'System/equip/EquipStrengPanel';
import { EquipUpLevelPanel } from 'System/equip/EquipUplevelPanel';
import { EquipZmPanel } from 'System/equip/EquipZmPanel';
import { Global as G } from "System/global";
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from "../uilib/TabFormCommom";
//import { UnitCtrlType } from "System/constants/GameEnum";

/**父面板*/
export class EquipView extends TabFormCommom implements IGuideExecutor {
    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    ////是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    //private isBg_3D: boolean[] = [false, false, false, false, false, true];
    //private bg_2D: UnityEngine.GameObject;
    //private bg_3D: UnityEngine.GameObject;

    /**战斗力文本的父物体，用于显示和隐藏*/
    private fight: UnityEngine.GameObject;
    private txtFight: UnityEngine.UI.Text;
    /**返回按钮*/
    returnBt: UnityEngine.GameObject = null;
    private openTabId = 0;

    constructor() {
        super(KeyWord.BAR_FUNCTION_EQUIP_ENHANCE, EquipPartLevelUpPanel, EquipStrengPanel, EquipUpLevelPanel, EquipFuHunPanel/*, InsertDiamondPanel*/, EquipCollectPanel/* EquipZmPanel,*/ /*WingEquipJingLianPanel*/);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.EquipView;
    }
    protected initElements() {
        super.initElements();
        this.setTabGroupNanme(["升级", "强化", "进阶", "洗炼"/*, "魔石"*/, "套装"/*, "羽翼"*/]);
        this.setTitleName("装备");
        // this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        //this.bg_2D = this.elems.getElement("2dBg");
        //this.bg_3D = this.elems.getElement("3dcamera_image");

        this.fight = this.getTitleFightingNode();// this.elems.getElement("fight");
        this.showFight(false);
        this.txtFight = this.getTitleFight();// this.elems.getText("txtFight");

        this.returnBt = this.getCloseButton();
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.returnBt, this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);


    }
    protected onOpen() {
        super.onOpen();
        this.judgeFunctionHasOpen();
        this.switchTabFormById(this.openTabId);
        this.updateTabAngle();
        this.onUpdateMoney(0);
        //G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, "ui/uiscene/uiscene/3dBg.prefab", this.sortingOrder);
    }

    protected onClose() {
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.EquipEnhance, EnumGuide.EquipEnhance_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.EquipSlotLvUp, EnumGuide.EquipSlotLvUp_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.EquipUpLevel, EnumGuide.EquipUpLevel_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickClose);
    }

    open(openTabId = 0) {
        this.openTabId = openTabId;
        super.open();

        //this.onUpdateMoney(0);
    }

    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        //this.bg_3D.SetActive(this.isBg_3D[index]);
        //this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    /**检查功能是否开启*/
    private judgeFunctionHasOpen() {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            this.tabGroup.GetToggle(i).gameObject.SetActive(0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
        }
    }

    /**
     * 是否在负面板显示战斗力
     * @param isShow
     */
    public showFight(isShow: boolean) {
        this.fight.SetActive(isShow);
    }

    /**
     * 设置战斗力
     * @param fightValue
     */
    public setTxtFight(fightValue: number) {
        this.txtFight.text = fightValue.toString();
    }

    updateView(type: number) {
        //强化
        this.updateStrengPanel(type);
        //进阶  
        this.upLevelPanelOnContainerChange();
        //锻造
        this.fuHunPanelOnContainerChange(type);
        ////宝石
        //this.updateInsertPanel(type);
        //附魔
        //this.updateZmPanel(type);
        //套装
        this.updateByEquipCollectResp();
        //刷新角标
        this.updateTabAngle();
    }

    onUpdateMoney(id: number) {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    /**银俩货币改变*/
    onMoneyChange(id: number) {
        this.onUpdateMoney(id);
        let ishow = G.DataMgr.equipStrengthenData.IsAllEquipExistCanLevelUp();
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP, ishow);
    }

    updateEquipPartTipMark() {
        let ishow = G.DataMgr.equipStrengthenData.IsAllEquipExistCanLevelUp();
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP, ishow);
    }

    updateLianTiPanel() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI) as EquipLianTiPanel;
        if (panel.isOpened) {
            panel.updatePanel();
        }
        this.lianTiTipMark();
    }

    /**装备炼体*/
    private lianTiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI, TipMarkUtil.equipLianTi());
    }

    /**背包仓库数据改变强化面板*/
    private updateStrengPanel(type) {
        let equipStrengPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE) as EquipStrengPanel;
        if (equipStrengPanel.isOpened) {
            equipStrengPanel._onContainerChange(type);
        }
    }


    setStrengProgressValue(data: Protocol.EquipStrengRsp) {
        let equipStrengPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE) as EquipStrengPanel;
        if (equipStrengPanel.isOpened) {
            equipStrengPanel.setStrengProgressValue(data);
        }
    }
    ///**宝石升级成功 */
    //onDiamondUpSuccess() {
    //    let equipInsertPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) as InsertDiamondPanel;
    //    if (equipInsertPanel && equipInsertPanel.isOpened) {
    //        equipInsertPanel.onDiamondUpSuccess();
    //    }
    //}

    ///**背包仓库数据改变刷新宝石面板*/
    //private updateInsertPanel(type) {
    //    let equipInsertPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) as InsertDiamondPanel;
    //    if (equipInsertPanel && equipInsertPanel.isOpened) {
    //        equipInsertPanel._onContainerChange(type);
    //    }

    //}

    onZmLevelUpSuccess() {
        let equipZmPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIPLQ) as EquipZmPanel;
        if (equipZmPanel.isOpened) {
            equipZmPanel.onZmLevelUpSuccess();
        }
    }



    /**
     * 一级一级提升特效
     */
    onEquipPartLevelUpPlayEffect() {
        let equipPartLevelUp = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP) as EquipPartLevelUpPanel;
        if (equipPartLevelUp.isOpened) {
            equipPartLevelUp.playEffect();
        }
    }
    /**
     * 一键提升特效
     */
    onPlayOneKeyEffect() {
        let equipPartLevelUp = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP) as EquipPartLevelUpPanel;
        if (equipPartLevelUp.isOpened) {
            equipPartLevelUp.onPlayOneKeyEffect();
        }
    }

    onEquipPartLevelUpUpdateEquip(isOneKey: boolean = false) {
        let equipPartLevelUp = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP) as EquipPartLevelUpPanel;
        if (equipPartLevelUp.isOpened) {
            equipPartLevelUp.updateEquip(isOneKey);
        }
    }


    onPlayEffect(succeed: boolean) {
        let equipZmPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIPLQ) as EquipZmPanel;
        if (equipZmPanel.isOpened) {
            equipZmPanel.playZMEffect(succeed);
        }
    }


    /**背包仓库数据改变刷新附魔面板*/
    private updateZmPanel(type) {
        let equipZmPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIPLQ) as EquipZmPanel;
        if (equipZmPanel && equipZmPanel.isOpened) {
            equipZmPanel._onContainerChange(type);
        }
    }

    /**
     * 进阶面板特效
     */
    playJinJieEffect() {
        let upLevelPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL) as EquipUpLevelPanel;
        if (upLevelPanel.isOpened) {
            upLevelPanel.playJinJieEffect();
        }
    }


    /**背包仓库数据改变刷新升阶面板*/
    private upLevelPanelOnContainerChange() {
        let upLevelPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL) as EquipUpLevelPanel;
        if (upLevelPanel.isOpened) {
            upLevelPanel.updateUpLevelPanel();
        }
    }


    /**背包仓库数据变化刷新锻造面板*/
    private fuHunPanelOnContainerChange(type: number) {
        let fuHunPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_WASH) as EquipFuHunPanel;
        if (fuHunPanel.isOpened) {
            fuHunPanel.onContainerChange(type);
        }
    }

    /**
     *跟新装备收集
     */
    updateByEquipCollectResp() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) as EquipCollectPanel;
        if (view.isOpened) {
            view.updatePanelData(true);
            view.pullSzListRequestAndUpdateGroupList();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage());
    }

    onDressChange() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) as EquipCollectPanel;
        if (view.isOpened) {
            view.onDressChange();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage());
    }

    /**更新锻造面板小红点提示 */
    updateFuHunTipMark(): void {
        let length: number = this.getTabCount();
        for (let i = 0; i < length; i++) {
            let form = this.getTabFormByIndex(i);
            let isShow = false;
            if (form.Id == KeyWord.OTHER_FUNCTION_EQUIP_WASH) {
                isShow = EquipFuHunPanel.isOpenedThisLanding == false;
                this.setTabTipMark(i, isShow);
                break;
            }
        }
    }

    //updateWingEquipPanel() {
    //    let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) as WingEquipJingLianPanel;
    //    if (view.isOpened) {
    //        view.updateStrengthSucceed();
    //    }
    //    this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN, TipMarkUtil.isShowWingEquipStrengthTipMark());
    //}


    /**更新小红点显示*/
    private updateTabAngle(): void {
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let ishow: boolean = false;
            if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP) {
                //升级
                ishow = G.DataMgr.equipStrengthenData.IsAllEquipExistCanLevelUp();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE) {
                //强化
                ishow = G.DataMgr.equipStrengthenData.getCanStrengthEquip(1).length > 0;
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL) {
                //升阶
                ishow = G.DataMgr.equipStrengthenData.getCanUpLevelEquip(1).length > 0;
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) {
                //宝石
                ishow = G.DataMgr.equipStrengthenData.isCanInsertOrReplaceDiamond();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIPLQ) {
                //附魔
                ishow = G.DataMgr.equipStrengthenData.canZhanMoInAllEquip();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) {
                //收集
                ishow = G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_WASH) {
                //锻造
                ishow = EquipFuHunPanel.isOpenedThisLanding == false;
            } else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) {
                //翅膀精炼
                ishow = TipMarkUtil.isShowWingEquipStrengthTipMark();
            } else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_LIANTI) {
                ishow = TipMarkUtil.equipLianTi();
            }
            // 显示圆点
            this.setTabTipMark(i, ishow);
        }
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.EquipEnhance_ClickClose == step || EnumGuide.EquipSlotLvUp_ClickClose == step ||
            EnumGuide.EquipUpLevel_ClickClose == step || EnumGuide.ShenZhuangShouJi_ClickClose == step) {
            this.close();
            return true;
        }
        return false;
    }
}
