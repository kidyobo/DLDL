import { FightTipsView } from './FightTipsView';
import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { ZhufuData } from 'System/data/ZhufuData';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { NewZhuFuBaseView } from 'System/hero/view/NewZhuFuBaseView';
import { PropertyView } from "System/hero/view/PropertyView";
import { ShenJiView } from "System/hero/view/ShenJiView";
import { SpecialPriBasePanel } from 'System/hero/view/SpecialPriBasePanel';
import { TitleView } from 'System/hero/view/TitleView';
import { ZhenFaView } from "System/hero/view/ZhenFaView";
import { JiuXingView } from 'System/jiuxing/JiuXingView';
import { MagicCubeView } from 'System/magicCube/MagicCubeView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { TabFormCommom } from '../../uilib/TabFormCommom';
import { UnitCtrlType } from "System/constants/GameEnum";

//该面板为其他子面板的父面板
export class HeroView extends TabFormCommom implements IGuideExecutor {



    private currencyTip: CurrencyTip;
    btnReturn: UnityEngine.GameObject;
    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [true, true, false, false, false, false,false];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;

    private bg_3d_prefabPath: string;

    /**战斗力文本的父物体，用于显示和隐藏*/
    private fight: UnityEngine.GameObject;
    private txtFight: UnityEngine.UI.Text;
    private openTabId: number = 0;
    private subClass: number = 0;
    constructor() {
        super(KeyWord.BAR_FUNCTION_ROLE, PropertyView,/*ShiZhuangPanel,*/ TitleView, JiuXingView, ZhenFaView, MagicCubeView, ShenJiView,FightTipsView);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HeroView;
    }

    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["属性", /*"时装",*/ "称号", "玄天功", "紫极魔瞳", "控鹤擒龙", "鬼影迷踪","战力成长"]);
        this.setTitleName("角色");
        // this.setFightActive(false);
        this.fight = this.getTitleFightingNode();// this.elems.getElement("fight");
        this.showFight(false);
        this.txtFight = this.getTitleFight();// this.elems.getText("txtFight");
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
        this.btnReturn = this.getCloseButton();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        Game.UIDragListener.Get(this.bg_3D).onDrag = delegate(this, this.onDrag);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
    }
    private onDrag() {
        let view = this.getCurrentTab();
        if (view && view.isOpened) {
            if ((view as any).onDrag) {
                (view as any).onDrag();
            }
        }
    }
    /**
     * 
     * @param tabId
     * @param subclass -1 表示查看别人信息，只显示信息，其他页隐藏
     */
    open(tabId: number = 0, subclass: number = 0) {
        if (G.GuideMgr.isGuiding(EnumGuide.XuanTianGongActive)) {
            tabId = KeyWord.BAR_FUNCTION_JIUXING;
        } else if (G.GuideMgr.isGuiding(EnumGuide.ZhenFaActive)) {
            tabId = KeyWord.HERO_SUB_TYPE_FAZHEN;
        } else if (G.GuideMgr.isGuiding(EnumGuide.MiZongActive)) {
            tabId = KeyWord.HERO_SUB_TYPE_LEILING;
        } else if (G.GuideMgr.isGuiding(EnumGuide.QinLongActive)) {
            tabId = KeyWord.OTHER_FUNCTION_MAGICCUBE;
        }
        this.openTabId = tabId;
        this.subClass = subclass;
        super.open();

    }
    /**
    * 设置战斗力
    * @param fightValue
    */
    public setTxtFight(fightValue: number) {
        this.txtFight.text = fightValue.toString();
    }
    /**
   * 是否在负面板显示战斗力
   * @param isShow
   */
    public showFight(isShow: boolean) {
        this.fight.SetActive(isShow);
    }
    protected onOpen() {
        this.autoOpenTab();
        this.updateTabAngle();

        this.onMoneyChange();
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
    }

    protected onClose() {
        super.onClose();
        G.DataMgr.otherPlayerData.roleByRes = null;
        G.GuideMgr.processGuideNext(EnumGuide.MountEnhance, EnumGuide.MountEnhance_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.ZhenFaActive, EnumGuide.ZhenFaActive_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.XuanTianGongActive, EnumGuide.XuanTianGongActive_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.MiZongActive, EnumGuide.MiZongActive_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.QinLongActive, EnumGuide.QinLongActive_ClickClose);
    }

    private autoOpenTab() {

        let count = this.getTabCount();
        //查看别人
        if (this.subClass < 0) {
            for (let i = 1; i < count; i++) {
                this.tabGroup.GetToggle(i).gameObject.SetActive(false);
            }
        }
        else {
            for (let i = 0; i < count; i++) {
                let form = this.getTabFormByIndex(i);
                let formid = form.Id;
                if (form.Id == KeyWord.HERO_SUB_TYPE_FAZHEN || form.Id == KeyWord.HERO_SUB_TYPE_LEILING) {
                    formid = GameIDUtil.getFuncIdBySubType(form.Id);
                }
                let visible = Boolean(!G.DataMgr.otherPlayerData.isOtherPlayer && G.DataMgr.funcLimitData.isFuncEntranceVisible(formid));
                this.tabGroup.GetToggle(i).gameObject.SetActive(visible);
            }
        }
        // 选中指定的页签
        this.switchTabFormById(this.openTabId, this.subClass);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }

    onContainerChange(type: number) {
        let currentForm = this.getCurrentTab();
        if (null == currentForm || !currentForm.isOpened) {
            return;
        }
        if (currentForm.Id == KeyWord.OTHER_FUNCTION_HEROPROPERTY) {
            let propertyView = currentForm as PropertyView;
            if (type == Macros.CONTAINER_TYPE_ROLE_EQUIP || type == Macros.CONTAINER_TYPE_ROLE_BAG) {
                // 更新装备
                propertyView.updateEquip();
            }
        } else if (/*currentForm.Id == KeyWord.HERO_SUB_TYPE_YUYI ||*/ /**currentForm.Id == KeyWord.HERO_SUB_TYPE_ZUOQI ||*/
            /*currentForm.Id == KeyWord.HERO_SUB_TYPE_WUHUN ||*/ currentForm.Id == KeyWord.HERO_SUB_TYPE_FAZHEN ||
            currentForm.Id == KeyWord.HERO_SUB_TYPE_LEILING || currentForm.Id == KeyWord.HERO_SUB_TYPE_SHENGLING) {
            let zhufuView = currentForm as NewZhuFuBaseView;
            if (Macros.CONTAINER_TYPE_ROLE_BAG == type || type == GameIDUtil.getContainerIDBySubtype(zhufuView.Id)) {
                zhufuView.updateViewLater(false);
            }
        } else if (currentForm.Id == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
            let magicCubeView = currentForm as MagicCubeView;
            magicCubeView.onContainerChange(type);
        }
        //Game.Profiler.Ins.Push("change 2");
        this.updateTabAngle();
        //Game.Profiler.Ins.Pop();
    }

    updateTipMark() {
        this.updateTabAngle();
    }

    /**
     * 特殊特权变化
     */
    onSpecialPriChange() {
        let crtTab = this.getCurrentTab();
        if (null != crtTab && (crtTab.Id == KeyWord.HERO_SUB_TYPE_WUHUN || crtTab.Id == KeyWord.HERO_SUB_TYPE_LEILING || crtTab.Id == KeyWord.OTHER_FUNCTION_MAGICCUBE)) {
            (crtTab as SpecialPriBasePanel).onSpecialPriChange();
        }
    }

    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        if (this.tabIds[index] == KeyWord.OTHER_FUNCTION_FIGHTPOINT_TIPS) {
            G.DataMgr.fightTipData.isOnOpen = false;
            this.updateTabAngle();
        }
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    //////////////////////////////////星环相关//////////////////////////////

    needSendOpenPanelMsg() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenMagicCubePannelRequest());
    }


    onUpdateMagicCubeInfo() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MAGICCUBE) as MagicCubeView;
        if (view && view.isOpened) {
            view.onUpdateMagicCubeInfo();
        }
    }

    onLevelUpMagicCubeCompelete() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MAGICCUBE) as MagicCubeView;
        if (view && view.isOpened) {
            view.onLevelUpMagicCubeCompelete();
        }
    }

    onJiuXingChanged() {
        let view = this.getTabFormByID(KeyWord.BAR_FUNCTION_JIUXING) as JiuXingView;
        if (view && view.isOpened) {
            view.updatePanel();
        }
    }

    ///////////////////////////////////////////////////////////////

    /**更新小原点显示*/
    private updateTabAngle(): void {
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let thingData = G.DataMgr.thingData;
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let type: number = form.Id;
            if (type == KeyWord.BAR_FUNCTION_ROLE) {
                let lingbaoTipmark = thingData.isLingbaoTipmark();
                this.setTabTipMark(i, lingbaoTipmark);
            } else if (/*type == KeyWord.HERO_SUB_TYPE_YUYI || type == KeyWord.HERO_SUB_TYPE_ZUOQI ||*/
                type == KeyWord.HERO_SUB_TYPE_WUHUN || type == KeyWord.HERO_SUB_TYPE_FAZHEN || type == KeyWord.HERO_SUB_TYPE_LEILING) {
                let show1 = zhufuData.isShowZhuFuCZTipMark(type);
                let show2 = thingData.checkThingForZhufu(type);
                this.setTabTipMark(i, show1 || show2);
                (form as NewZhuFuBaseView).updateTips(show1, show2);
            } else if (type == KeyWord.OTHER_FUNCTION_CRAZYBLOOD) {
                this.setTabTipMark(i, G.DataMgr.zhufuData.checkXueMaiCanUp());
            }
            else if (type == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
                this.setTabTipMark(i, G.DataMgr.magicCubeData.canLevelUp());
            } else if (type == KeyWord.OTHER_FUNCTION_HEROTITLE) {
                //更新称号的小圆点显示
                this.setTabTipMark(i, G.DataMgr.titleData.canPeiYangTitles());
            }
            //else if (type == KeyWord.OTHER_FUNCTION_HEROPROPERTY) {
            //    let tipMark = G.GuideMgr.tipMarkCtrl;
            //    let show1 = tipMark.rebirthEquipSuitTipMark.ShowTip || tipMark.rebirthTipMark.ShowTip || tipMark.rebirthSkillTipMark.ShowTip || tipMark.rebirthEquipTipMark.ShowTip || tipMark.juYuanTipMark.getJuYuanTip() || TipMarkUtil.chengHao() || TipMarkUtil.shiZhuangQHTip() > 0 || tipMark.juYuanTipMark.ShowTip;

            //    this.setTabTipMark(i, show1);
            //}
            else if (type == KeyWord.BAR_FUNCTION_JIUXING) {
                //玄天功
                let show = G.DataMgr.jiuXingData.canLevelUpJiuXing() || G.DataMgr.jiuXingData.canLevelUpSkill();
                this.setTabTipMark(i, show);
            }else if(type == KeyWord.OTHER_FUNCTION_FIGHTPOINT_TIPS){
                //战力提示的小红点
                this.setTabTipMark(i, G.DataMgr.fightTipData.isOnOpen);
            }
        }
    }

    updateTitleTipMark() {
        G.DataMgr.titleData.canPeiYangTitles()

    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.MountEnhance_ClickClose == step) {
            this.onBtnReturn();
            return true;
        }
        return false;
    }
}
export default HeroView;