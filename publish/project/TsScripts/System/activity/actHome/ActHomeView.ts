import { GuildPvpPanel } from 'System/activity/actHome/GuildPvpPanel';
import { KfLingDiPanel } from 'System/activity/actHome/KfLingDiPanel';
import { KuaFu3v3Panel } from 'System/activity/actHome/KuaFu3v3Panel';
import { MohuaZhanzhengView } from 'System/activity/actHome/MohuaZhanzhengView';
import { ZhenLongQiJuPanel } from 'System/activity/actHome/ZhenLongQiJuPanel';
import { WangHouJiangXiangView } from 'System/activity/whjx/WangHouJiangXiangView';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { BiWuDaHuiPanel } from 'System/kfjdc/BiWuDaHuiPanel';
import { PetExpeditionPanel } from 'System/pet/PetExpeditionPanel';
import { SiXiangDouShouChangPanel } from 'System/pinstance/selfChallenge/SiXiangDouShouChangPanel';
import { TianMingBangPanel } from 'System/pinstance/selfChallenge/TianMingBangPanel';
import { TianMingBangRankView } from 'System/pinstance/selfChallenge/TianMingBangRankView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from 'System/uilib/CommonForm';
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from '../../uilib/TabFormCommom';
import { UnitCtrlType } from "System/constants/GameEnum";

export class ActHomeView extends TabFormCommom {

    static readonly TABS: number[] = [KeyWord.OTHER_FUNCTION_DOUHUNBANG,KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG, KeyWord.OTHER_FUNCTION_TIANMINGBANG,
    KeyWord.OTHER_FUNC_KFZMZ, KeyWord.OTHER_FUNCTION_CROSS3V3,
    KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG, KeyWord.OTHER_FUNCTION_ZLQJ,
    KeyWord.ACT_FUNCTION_ZZHC, KeyWord.OTHER_FUNCTION_PET_EXPEDITION,
        KeyWord.OTHER_FUNC_MHZZ, KeyWord.OTHER_FUNCTION_BIWUDAHUI];

    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [true, false, true, true, false, false];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;

    private btnReturn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private openTab = 0;

    constructor() {
        super(KeyWord.ACT_FUNC_ACTHOME,TianMingBangRankView,SiXiangDouShouChangPanel, TianMingBangPanel,
            GuildPvpPanel, KuaFu3v3Panel, WangHouJiangXiangView,
            ZhenLongQiJuPanel, KfLingDiPanel, PetExpeditionPanel, MohuaZhanzhengView, BiWuDaHuiPanel);
        this.openSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ActHomeView;
    }

    protected initElements() {
        super.initElements();
        this.setTabGroupNanme(["斗魂榜", "斗兽场", "竞技场", "宗门争霸", "3V3", "武魂殿", "西洋棋","领地战", "试炼", "魔化战","角斗"]);
        this.setTitleName("竞技");
        this.setFightActive(false);

        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.btnReturn = this.getCloseButton();
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    protected onOpen() {
        super.onOpen();
        this.onUpdateMoney();
        // 更新页签
        let firstTipId = this.updateTabs();
        // 选中指定的页签
        if (0 == this.openTab) {
            this.openTab = firstTipId;
        }
        this.switchTabFormById(this.openTab);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_PVP_MULTI, Macros.ACTIVITY_CROSS3V3_LIST));

        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PET_EXPEDITION)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzPanelRequest());
        }
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
    }

    open(openTab = 0) {
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            // 副本里不让打开
            G.TipMgr.addMainFloatTip('请离开副本后再操作。');
            return;
        }
        if (!G.DataMgr.funcLimitData.isFuncAvailable(openTab, true)) {
            return;
        }
        this.openTab = openTab;
        super.open();
    }

    private updateTabs() {
        let firstTipId = 0;
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funcId: number = this.tabIds[i];
            let v = 0 == funcId || G.DataMgr.funcLimitData.isFuncAvailable(funcId);
            this.tabGroup.GetToggle(i).gameObject.SetActive(v);
            if (v) {
                let t = this.needTipMark(funcId);
                this.setTabTipMark(i, t);
                if (t && 0 == firstTipId) {
                    firstTipId = funcId;
                }
            }
        }

        return firstTipId;
    }

    protected onClose() {
        PetExpeditionPanel.LastLogicId = 0;
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    protected onTabGroupClick(index: number): void {
        super.onTabGroupClick(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
        if (G.DataMgr.petExpeditionData.isFirstOpen && ActHomeView.TABS[index] == KeyWord.OTHER_FUNCTION_PET_EXPEDITION) {
            G.DataMgr.petExpeditionData.isFirstOpen = false;
            this.onPetExpeditionChange();
        }
    }
    /**根据分页类型获取可进入次数(个人竞技面板)*/
    private needTipMark(funcId: number): boolean {
        let result = false;
        switch (funcId) {
            case KeyWord.OTHER_FUNCTION_DOUHUNBANG:
                result = TipMarkUtil.isDouHun();
                break;
            case KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG:
                result = TipMarkUtil.siXiangDouShouChang();
                break;
            case KeyWord.OTHER_FUNCTION_TIANMINGBANG:
                result = TipMarkUtil.tianMingBang();
                break;
            case KeyWord.OTHER_FUNC_KFZMZ:
                result = TipMarkUtil.kuaFuZongMenZhan();
                break;
            case KeyWord.OTHER_FUNCTION_CROSS3V3:
                result = TipMarkUtil.KuaFu3V3Reward();
                break;
            case KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG:
                result = TipMarkUtil.wangHouJiangXiang();
                break;
            case KeyWord.ACT_FUNCTION_ZZHC:
                result = TipMarkUtil.hasKfLingDiReward();
                break;
            case KeyWord.OTHER_FUNCTION_PET_EXPEDITION:
                result = TipMarkUtil.petExpedition();
                break;
            case KeyWord.OTHER_FUNC_MHZZ:
                result = TipMarkUtil.isMohuaZhanzhenOpen();
                break;
            case KeyWord.OTHER_FUNCTION_BIWUDAHUI:
                result = TipMarkUtil.biWuDaHui();
                break;
            default:
                break;
        }
        return result;
    }

    onActDataChange(id: number) {
        if (Macros.ACTIVITY_ID_PVP_MULTI == id) {
            let kuafu3v3Panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_CROSS3V3) as KuaFu3v3Panel;
            if (kuafu3v3Panel.isOpened) {
                kuafu3v3Panel.onActDataChange();
            }
        } else if (Macros.ACTIVITY_ID_WHJX == id) {
            let whjx = this.getTabFormByID(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG) as WangHouJiangXiangView;
            if (whjx.isOpened) {
                whjx.onActDataChange(id);
            }
            this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG, TipMarkUtil.wangHouJiangXiang());
        }
        else if (Macros.ACTIVITY_ID_PVP_BASE == id) {
            let bwdh = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BIWUDAHUI) as BiWuDaHuiPanel;
            if (bwdh.isOpened) {
                bwdh.onActDataChange(id);
            }
            this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_BIWUDAHUI, TipMarkUtil.biWuDaHui());
        }
    }

    updateByPVPRankCsResponse(response: Protocol.PVPRank_CS_Response) {
        let tianMingBangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_TIANMINGBANG) as TianMingBangPanel;
        if (tianMingBangPanel.isOpened) {
            tianMingBangPanel.updateByResponse(response);
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_TIANMINGBANG, TipMarkUtil.tianMingBang());
    }

    /**更新跨服3V3tipMark*/
    updateKuaFu3V3TipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_CROSS3V3, TipMarkUtil.KuaFu3V3Reward());
    }

    private onClickReturnBtn() {
        this.close();
    }

    /**
 * 打开面板后更新魔化战争面板
 * @param response
 */
    updateMohuaZhanzhengView(response: Protocol.MHZZ_Pannel_Response): void {
        let mohuaZhanzhengPanel = this.getTabFormByID(KeyWord.OTHER_FUNC_MHZZ) as MohuaZhanzhengView;
        mohuaZhanzhengPanel.updatePanel(response);
    }

    updateGuildPVPPanel() {
        let guildpvpPanel = this.getTabFormByID(KeyWord.OTHER_FUNC_KFZMZ) as GuildPvpPanel;
        if (guildpvpPanel.isOpened) {
            guildpvpPanel.updatePanel();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNC_KFZMZ, TipMarkUtil.kuaFuZongMenZhan());
    }

    onWangHouJiangXiangResp(response: Protocol.Cross_CS_Response) {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG, TipMarkUtil.wangHouJiangXiang());
        let crtPanel = this.getCurrentTab();
        if (null == crtPanel || crtPanel.Id != KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG) {
            return;
        }
        let view = crtPanel as WangHouJiangXiangView;
        if (Macros.CROSS_WHJX_PANNLE == response.m_usType) {
            view.onPanelResponse();
        }
        else if (Macros.CROSS_WHJX_BUY == response.m_usType) {
            view.onSignUpResponse();
        }
        else if (Macros.CROSS_WHJX_APPLY_PK == response.m_usType) {
            let resp = response.m_stValue.m_stWHJXApplyPKRsp;
            view.onApplyResultResponse(resp.m_iResult);
        }
        else if (Macros.CROSS_WHJX_APPLY_DEAL == response.m_usType) {
            let resp = response.m_stValue.m_stHWJXApplyDealRsp;
            view.onApplyDealResponse(resp.m_iOpVal);
        }
        else if (Macros.CROSS_WHJX_CDCLEAN == response.m_usType) {
            view.onCleanCdResponse();
        }
    }

    onSxdscActChange() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG) as SiXiangDouShouChangPanel;
        if (null != panel && panel.isOpened) {
            panel.onSxdscActChange();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG, TipMarkUtil.siXiangDouShouChang());
    }

    onSxdscKuaFuChange() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG) as SiXiangDouShouChangPanel;
        if (null != panel && panel.isOpened) {
            panel.onSxdscKuaFuChange();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG, TipMarkUtil.siXiangDouShouChang());
    }

    onPetExpeditionChange() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_PET_EXPEDITION) as PetExpeditionPanel;
        if (null != panel && panel.isOpened) {
            panel.onExpeditionChange();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_PET_EXPEDITION, TipMarkUtil.petExpedition());
    }

    updateKfLindDiPanel() {
        let kfLingDiPanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_ZZHC) as KfLingDiPanel;
        if (null == kfLingDiPanel || !kfLingDiPanel.isOpened) return;
        kfLingDiPanel.onPanelResp();
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_ZZHC, TipMarkUtil.hasKfLingDiReward());
    }

    updateKfLingDiReward() {
        let kfLingDiPanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_ZZHC) as KfLingDiPanel;
        if (null == kfLingDiPanel || !kfLingDiPanel.isOpened) return;
        kfLingDiPanel.updateTreasureBox();
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_ZZHC, TipMarkUtil.hasKfLingDiReward());
    }

    onBiWuDaHuiChange(opType: number) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BIWUDAHUI) as BiWuDaHuiPanel;
        if (null != panel && panel.isOpened) {
            panel.onBiWuDaHuiChange(opType);
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_BIWUDAHUI, TipMarkUtil.biWuDaHui());
    }
    onDouHunBangChange(response: Protocol.PVPRank_CS_Response) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DOUHUNBANG) as TianMingBangRankView;
        if (null != panel && panel.isOpened) {
            panel.updateView();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DOUHUNBANG, TipMarkUtil.isDouHun());
    }

}