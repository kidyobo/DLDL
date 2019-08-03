import { EnumGuide, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { InsertDiamondPanel } from 'System/equip/InsertDiamondPanel';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { HunHuanPanel } from 'System/hunli/HunHuanPanel';
import { HunLiPanel } from 'System/hunli/HunLiPanel';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from '../uilib/TabFormCommom';
import { HunGuCollectPanel } from './HunGuCollectPanel';
import { Macros } from '../protocol/Macros';

//该面板为其他子面板的父面板
export class HunLiView extends TabFormCommom implements IGuideExecutor {

    btnReturn: UnityEngine.GameObject;
    /**魂币显示*/
    private currencyTip: CurrencyTip;
    private openTabId: number = 0;
    private subClass: number = 0;
    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [false, false, true, false];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;
    constructor() {
        super(KeyWord.BAR_FUNCTION_REBIRTH, HunLiPanel, HunGuCollectPanel, HunHuanPanel, InsertDiamondPanel);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    public open(openTabId = KeyWord.OTHER_FUNCTION_ZHUANSHENG, subClass: number = 0) {
        if (G.DataMgr.hunliData.level < 0) {
            //数据如果没有初始化则直接返回
            return;
        }

        if (G.GuideMgr.isGuiding(EnumGuide.HunHuanActive)) {
            openTabId = KeyWord.OTHER_FUNCTION_HUNHUAN;
        } else if (G.GuideMgr.isGuiding(EnumGuide.WuHunActivate)) {
            openTabId = KeyWord.OTHER_FUNCTION_ZHUANSHENG;
        }
        this.openTabId = openTabId;
        this.subClass = subClass;
        super.open();
    }

    protected resPath(): string {
        return UIPathData.HunLiView;
    }
    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["魂力", "魂骨收集", "魂环", "魔石"]);
        this.setTitleName("魂力");
        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
        this.btnReturn = this.getCloseButton();
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
    }

    protected onOpen() {
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
        this.judgeFunctionHasOpen();
        this.switchTabFormById(this.openTabId, this.subClass);
        this.updateMoney();
        this.updateTipMark();
        super.onOpen();
    }

    protected onClose() {
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.HunHuanActive, EnumGuide.HunHuanActive_ClickClose);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    /**检查功能是否开启*/
    private judgeFunctionHasOpen() {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            this.tabGroup.GetToggle(i).gameObject.SetActive(0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
        }
    }

    updateHunliPanel(id:number) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_ZHUANSHENG) as HunLiPanel;
        if (panel.isOpened) {
            if (id == Macros.HUNLI_LEVEL_UP){
                panel.upLevelSuccend();
            }
            panel.updateView();
        }
        this.updateTipMark();
    }

    /**
     * 背包数据改变
     * @param type
     */
    onContainerChange(type: number) {
        this.updateInsertPanel(type);
        this.updateTipMark();
    }

    /**更新魂环面板 */
    updateHunHuanPanel(isLevel: boolean = false, level: number = 0,isActive:boolean = false) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNHUAN) as HunHuanPanel;
        if (panel.isOpened) {
            panel.updateView(isLevel, level);
            if (isActive) {
               panel.textEffect(); 
            }
        }
        this.updateTipMark();
    }
    /**宝石升级成功 */
    onDiamondUpSuccess() {
        let equipInsertPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) as InsertDiamondPanel;
        if (equipInsertPanel && equipInsertPanel.isOpened) {
            equipInsertPanel.onDiamondUpSuccess();
        }
    }

    /**背包仓库数据改变刷新宝石面板*/
    private updateInsertPanel(type) {
        let equipInsertPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) as InsertDiamondPanel;
        if (equipInsertPanel && equipInsertPanel.isOpened) {
            equipInsertPanel._onContainerChange(type);
        }
    }

    /**
     *更新装备收集
     */
    updateByHunGuExhibitionResp() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) as HunGuCollectPanel;
        if (view.isOpened) {
            let equipSuitInfo = G.DataMgr.equipStrengthenData.equipSuitInfo;
            if (equipSuitInfo.m_ucNum == HunGuCollectPanel.MaxCollectHunGuCount) {
                view.autoSelectYearsList();
            } else {
                view.updatePanel();
            }
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, G.DataMgr.hunliData.hunGuCollectTipMark());
    }

    updateMoney() {
        this.currencyTip.updateMoney();
    }

    updateTipMark() {
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let isShow: boolean = false;
            if (panelId == KeyWord.OTHER_FUNCTION_ZHUANSHENG) {
                //魂力
                isShow = TipMarkUtil.isHunliShowTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNHUAN) {
                //魂环
                isShow = TipMarkUtil.isHunhuanActive();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_MOUNT) {
                //宝石
                isShow = G.DataMgr.equipStrengthenData.isCanInsertOrReplaceDiamond();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) {
                //魂骨收集
                isShow = G.DataMgr.hunliData.hunGuCollectTipMark();
            }
            // 显示红点
            this.setTabTipMark(i, isShow);
        }
    }

    setTitleFight(val: number) {
        this.setFightNumber(val);
    }

    closeTitleFight() {
        this.setFightActive(false);
    }

    openTitleFight() {
        this.setFightActive(true);
    }
    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.WuHunActivate_ClickClose == step) {
            this.onBtnReturn();
            return true;
        }
        return false;
    }
}