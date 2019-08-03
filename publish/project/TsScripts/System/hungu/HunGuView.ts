import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { InsertDiamondPanel } from 'System/equip/InsertDiamondPanel';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { HunGuPanel } from 'System/hunli/HunGuPanel';
import { HunHuanPanel } from 'System/hunli/HunHuanPanel';
import { HunLiPanel } from 'System/hunli/HunLiPanel';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from '../uilib/TabFormCommom';
import { HunguIntensifyPanel } from 'System/hunli/HunguIntensifyPanel';
import { HunGuShengJiPanel } from 'System/hunli/HunGuShengJiPanel';
import { UnitCtrlType } from "System/constants/GameEnum";
import { HunguStrengPanel } from 'System/hunli/HunguStrengPanel';
import { HunGuXiLianPanel } from 'System/hungu/HunGuXiLianPanel';
import { HunguMergePanel } from './HunguMergePanel';
import { HunguSkillPanel } from '../hunli/HunguSkillPanel';

//该面板为其他子面板的父面板
export class HunGuView extends TabFormCommom implements IGuideExecutor {

    btnReturn: UnityEngine.GameObject;
    /**魂币显示*/
    private currencyTip: CurrencyTip;
    private openTabId: number = 0;
    private subClass: number = 0;
    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [false, false, false, false, false];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;
    constructor() {
        super(KeyWord.BAR_FUNCTION_HUNGU, HunGuPanel, HunguMergePanel, HunguIntensifyPanel, HunGuXiLianPanel, HunguStrengPanel, HunGuShengJiPanel, HunguSkillPanel);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    public open(openTabId = KeyWord.OTHER_FUNCTION_HUNGUN, subClass: number = 0) {
        if (G.DataMgr.hunliData.level < 0) {
            //数据如果没有初始化则直接返回
            return;
        }

        if (G.GuideMgr.isGuiding(EnumGuide.HunGuActive)) {
            openTabId = KeyWord.OTHER_FUNCTION_HUNGUN;
        } else if (G.GuideMgr.isGuiding(EnumGuide.HunGuShengHua)) {
            openTabId = KeyWord.OTHER_FUNCTION_HUNGUN_MERGE;
        }

        this.openTabId = openTabId;
        this.subClass = subClass;
        super.open();
    }



    protected resPath(): string {
        return UIPathData.HunGuView;
    }
    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["魂骨", "升华", "封装", "洗炼", "强化", "升级", "技能"]);
        this.setTitleName("魂骨");
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
        G.GuideMgr.processGuideNext(EnumGuide.HunGuActive, EnumGuide.HunGuActive_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunGuShengHuaClickBtnClose);
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


    /**
     * 背包数据改变
     * @param type
     */
    onContainerChange(type: number) {
        this.updataHunGuPanel(type);
        this.updateTipMark();
        this.updateHunGuShengJiPanel();
        this.updateHunGuStrengPanel();
        this.updateHunGuXiLianPanel();
        this.hunGuXiLianPanelOnContainerChange(type);
        this.hunguSkillFZResponse();
    }

    /**更新魂骨面板 */
    private updataHunGuPanel(type: number) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN) as HunGuPanel;
        if (panel.isOpened) {
            panel.onContainerChange(type);
        }
        this.hunguIntensifyResponse();
    }

    /**
     * 魂骨封装响应
     */
    private hunguIntensifyResponse() {
        let currentForm = this.getCurrentTab();
        if (null == currentForm || !currentForm.isOpened) {
            return;
        }
        if (currentForm.Id == KeyWord.OTHER_FUNCTION_HUNGUN_FZ) {
            let hunguPanel = currentForm as HunguIntensifyPanel;
            hunguPanel.updatePanel();
        }
    }

    /**
     * 魂骨技能封装响应
     */
    private hunguSkillFZResponse() {
        let currentForm = this.getCurrentTab();
        if (null == currentForm || !currentForm.isOpened) {
            return;
        }
        if (currentForm.Id == KeyWord.OTHER_FUNCTION_HUNGU_SKILL) {
            let hunguPanel = currentForm as HunguSkillPanel;
            hunguPanel.updatePanel();
        }
        this.updateTipMark();
    }

    /**更新魂骨升级面板 */
    updateHunGuShengJiPanel() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP) as HunGuShengJiPanel;
        if (panel.isOpened) {
            panel.UpdateListSelectAndPanel();
        }
        this.updateTipMark();
    }

    /**更新魂骨强化面板 */
    updateHunGuStrengPanel() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN_STRENG) as HunguStrengPanel;
        if (panel.isOpened) {
            panel.UpdateListSelectAndPanel();
        }
        this.updateTipMark();
    }

    updateHunGuXiLianPanel() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGU_WASH) as HunGuXiLianPanel;
        if (panel.isOpened) {
            panel.updatePanel();
        }
        this.updateTipMark();
    }
    private hunGuXiLianPanelOnContainerChange(type: number) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGU_WASH) as HunGuXiLianPanel;
        if (panel.isOpened) {
            panel.onContainerChange(type);
        }
    }

    updateMoney() {
        this.currencyTip.updateMoney();
    }

    updateTipMark() {
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let ishow: boolean = false;
            if (panelId == KeyWord.OTHER_FUNCTION_HUNGUN) {
                //魂骨
                ishow = G.DataMgr.thingData.isHunliPanelMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGUN_FZ) {
                //封装红点
                ishow = TipMarkUtil.isHunguFZShowTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP) {
                //魂骨升级
                ishow = TipMarkUtil.isHunguSJShowTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGUN_STRENG) {
                //魂骨强化
                ishow = TipMarkUtil.isHunguStrengShowTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGU_WASH) {
                //魂骨洗炼
                ishow = /*HunGuXiLianPanel.isOpenedThisLanding == false && */G.DataMgr.hunliData.hunGuXiLianData.hunGuXiLianTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) {
                //魂骨升华
                ishow = TipMarkUtil.isHunguMergeShowTipMark();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGU_SKILL) {
                //魂骨技能
                ishow = TipMarkUtil.isHunguSkillShowTipMark();
            }
            // 显示红点
            this.setTabTipMark(i, ishow);
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
        //if (EnumGuide.WuHunActivate_ClickClose == step) {
        //    this.onBtnReturn();
        //    return true;
        //}
        return false;
    }
}