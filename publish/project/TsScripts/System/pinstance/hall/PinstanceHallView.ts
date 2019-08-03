import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { JuQingFuBenPanel } from 'System/pinstance/hall/JuQingFuBenPanel';
import { MingWenFuBenPanel } from 'System/pinstance/hall/MingWenFuBenPanel';
import { ShenXuanZhiLuPanel } from 'System/pinstance/hall/ShenXuanZhiLuPanel';
import { ZuDuiFuBenPanel } from 'System/pinstance/hall/ZuDuiFuBenPanel';
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel';
import { DiZheZhiLuPanel } from 'System/pinstance/selfChallenge/DiZheZhiLuPanel';
import { JiSuTiaoZhanPanel } from 'System/pinstance/selfChallenge/JiSuTiaoZhanPanel';
import { ShenHuangMiJingPanel } from 'System/pinstance/selfChallenge/ShenHuangMiJingPanel';
import { WuYuanFuBenPanel } from 'System/pinstance/selfChallenge/WuYuanFuBenPanel';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from 'System/uilib/CommonForm';
import { CurrencyTip } from '../../uilib/CurrencyTip';
import { TabFormCommom } from '../../uilib/TabFormCommom';
import { EnumGuide } from 'System/constants/GameEnum';
import { ExperienceFubenPanel } from '../selfChallenge/ExperienceFubenPanel';

export class PinstanceHallView extends TabFormCommom {

    private btnReturn: UnityEngine.GameObject;
    private currencyTip: CurrencyTip;

    private openTabId: number;
    private openParam: any;

    constructor() {
        super(KeyWord.ACT_FUNC_PINSTANCEHALL, JuQingFuBenPanel, DiZheZhiLuPanel, ExperienceFubenPanel,
            CaiLiaoFuBenPanel, WuYuanFuBenPanel, ZuDuiFuBenPanel, MingWenFuBenPanel, JiSuTiaoZhanPanel,
            ShenXuanZhiLuPanel
        );
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FuBenDaTing;
    }

    protected initElements() {
        super.initElements();
        this.setTabGroupNanme(["剧情", "装备", "经验", "材料", "伙伴", "组队", "魂石", "挑战", "海神试炼"]);
        this.setTitleName("副本");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.btnReturn = this.getCloseButton();
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
    }
    protected onOpen() {
        super.onOpen();
        // 更新页签
        this.updateTabLabels();
        this.updateTabMarks();
        this.onMoneyChange();
        // 选中指定的页签
        this.switchTabFormById(this.openTabId, this.openParam);
    }

    open(openTabId: number = 0, openParam: any = null) {
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            // 副本里不让打开
            G.TipMgr.addMainFloatTip('请离开副本后再操作。');
            return;
        }
        if (G.GuideMgr.isGuiding(EnumGuide.ShenXuan)) {
            openTabId = KeyWord.OTHER_FUNCTION_SXZL;
        }
        this.openTabId = openTabId;

       
        this.openParam = openParam;
        super.open();
        G.GuideMgr.processGuideNext(EnumGuide.HuoBanFuBen, EnumGuide.HuoBanFuBen_OpenPinstanceHallView);
    }

    private updateTabLabels() {
        // 初始化分类标签页
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            let obj = this.tabGroup.GetToggle(i).gameObject;
            this.tabGroup.GetToggle(i).gameObject.SetActive(0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
        }
    }

    /**更新文本角标*/
    private updateTabMarks(): void {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            let needTip = false;
            if (KeyWord.OTHER_FUNCTION_JQFB == funId) {
                needTip = TipMarkUtil.juQingFuBen();
            } else if (KeyWord.OTHER_FUNCTION_DZZL == funId) {
                needTip = TipMarkUtil.qiangHuaFuBen();
            } else if (KeyWord.OTHER_FUNCTION_SHMJ == funId) {
                needTip = TipMarkUtil.jingYanFuBen();
            } else if (KeyWord.OTHER_FUNCTION_ZDFB == funId) {
                needTip = TipMarkUtil.zuDuiFuBen();
            } else if (KeyWord.OTHER_FUNCTION_CLFB == funId) {
                needTip = TipMarkUtil.caiLiaoFuBen();
            } else if (KeyWord.OTHER_FUNCTION_MWSL == funId) {
                needTip = TipMarkUtil.mingWenShiLian();
            } else if (KeyWord.OTHER_FUNCTION_FSD == funId) {
                needTip = TipMarkUtil.faShenDian();
            } else if (KeyWord.OTHER_FUNCTION_WYFB == funId) {
                needTip = TipMarkUtil.wuYuanFuBen();
            } else if (KeyWord.OTHER_FUNCTION_JSTZ == funId) {
                needTip = TipMarkUtil.jiSuTiaoZhan();
            } else if (KeyWord.OTHER_FUNCTION_SXZL == funId) {
                needTip = TipMarkUtil.shenxuanzhilu();
            }
            this.setTabTipMark(i, needTip);
        }
    }

    onPinstanceChange() {
        this.updateTabMarks();
        let selectedPanel = this.getCurrentTab();
        if (selectedPanel && selectedPanel.isOpened) {
            if (KeyWord.OTHER_FUNCTION_JQFB == selectedPanel.Id) {
                let jqfbPanel = selectedPanel as JuQingFuBenPanel;
                jqfbPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_DZZL == selectedPanel.Id) {
                let dzzlPanel = selectedPanel as DiZheZhiLuPanel;
                dzzlPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_SHMJ == selectedPanel.Id) {
                let shmjPanel = selectedPanel as ExperienceFubenPanel;
                shmjPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_CLFB == selectedPanel.Id) {
                let clfbPanel = selectedPanel as CaiLiaoFuBenPanel;
                clfbPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_ZDFB == selectedPanel.Id) {
                let zdfbPanel = selectedPanel as ZuDuiFuBenPanel;
                zdfbPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_WYFB == selectedPanel.Id) {
                let wyPanel = selectedPanel as WuYuanFuBenPanel;
                wyPanel.updateView();
            } else if (KeyWord.OTHER_FUNCTION_JSTZ == selectedPanel.Id) {
                let jiSuTiaoZhan = selectedPanel as JiSuTiaoZhanPanel;
                jiSuTiaoZhan.updatePanel();
            } else if (KeyWord.OTHER_FUNCTION_SXZL == selectedPanel.Id) {
                let sxzlPanel = selectedPanel as ShenXuanZhiLuPanel;
                sxzlPanel.updateView();
            }
        }
    }

    onMwslResponse(command: number) {
        let selectedPanel = this.getCurrentTab();
        if (selectedPanel.isOpened) {
            if (KeyWord.OTHER_FUNCTION_MWSL == selectedPanel.Id) {
                let mwslPanel = selectedPanel as MingWenFuBenPanel;
                mwslPanel.onMwslResponse(command);
            }
        }
    }

    onCurrencyChange(id: number) {
        if (id == KeyWord.MONEY_ID_ENERGY_WY) {
            //武缘副本 体力
            let selectedPanel = this.getCurrentTab();
            if (selectedPanel && selectedPanel.isOpened) {
                if (KeyWord.OTHER_FUNCTION_WYFB == selectedPanel.Id) {
                    let mwslPanel = selectedPanel as WuYuanFuBenPanel;
                    mwslPanel.onCurrencyChange(id);
                }
            }
        }
    }

    private onClickReturnBtn() {
        this.close();
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }
}