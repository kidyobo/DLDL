import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { NestedForm } from 'System/uilib/NestedForm'
import { UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PetJinJiePanel, PetJinJieFuncTab, PetTipMarkType } from 'System/pet/PetJinJiePanel'
import { PetTuJianPanel } from 'System/pet/PetTuJianPanel'
import { PetXunBaoPanel } from 'System/pet/PetXunBaoPanel'
import { PetPiecePanel } from 'System/pet/PetPiecePanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuide } from 'System/constants/GameEnum'
import { PetZhenTuPanel } from 'System/pet/PetZhentuPanel'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { CurrencyTip } from '../uilib/CurrencyTip';
import { UnitCtrlType } from "System/constants/GameEnum";

export class PetView extends NestedForm implements IGuideExecutor {
    private readonly Tabs: number[] = [KeyWord.OTHER_FUNCTION_PET_JINJIE, KeyWord.OTHER_FUNCTION_PET_ZHENTU, KeyWord.OTHER_FUNCTION_PET_TUJIAN, KeyWord.OTHER_FUNCTION_PET_SUIPIAN, KeyWord.OTHER_FUNCTION_PET_XUNBAO];

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;

    //是否显示3d背景
    private isBg_3D: boolean[] = [true];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;
    private currencyTip: CurrencyTip;

    btnReturn: UnityEngine.GameObject;
    private jinjiePanel: PetJinJiePanel;
    private tujianPanel: PetTuJianPanel;
    private xunbaoPanel: PetXunBaoPanel;
    private suipianPanel: PetPiecePanel;
    private zhentuPanel: PetZhenTuPanel;
    private openTab = 0;
    private openPetID: number = 0;

    /**技能或者进阶面板*/
    private petJinJieFuncTab: PetJinJieFuncTab = 0;
    private curTabIdx = 0;
    private selectPetType: PetTipMarkType = PetTipMarkType.None;
    private tipMarks: { [key: number]: UnityEngine.GameObject } = {};
    private tabObjs: { [key: number]: UnityEngine.GameObject } = {};

    constructor() {
        super(KeyWord.BAR_FUNCTION_BEAUTY);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.PetView;
    }
    protected initElements(): void {
        super.initElements();
        this.btnReturn = this.elems.getElement('btnReturn');
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
        for (let i = 0; i < this.Tabs.length; i++) {
            let tabobj = ElemFinder.findObject(this.tabGroup.gameObject, i + "");
            let tipMark = ElemFinder.findObject(this.tabGroup.gameObject, i + "/tipMark");
            this.tabObjs[this.Tabs[i]] = tabobj;
            this.tipMarks[this.Tabs[i]] = tipMark;
        }

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));
    }
    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
        this.addToggleGroupListener(this.tabGroup, this.onToggleTabGroup);
        Game.UIDragListener.Get(this.elems.getElement("back")).onDrag = delegate(this, this.onDrag);
    }
    private onDrag() {
        if (this.jinjiePanel && this.jinjiePanel.isOpened) {
            this.jinjiePanel.onDrag();
        }
    }

    protected onOpen() {
        for (let tabKey in this.tabObjs) {
            let tabId = parseInt(tabKey);
            let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(tabId);
            this.tabObjs[tabId].SetActive(isShow);
        }

        let openIdx = this.Tabs.indexOf(this.openTab);
        if (openIdx < 0) {
            openIdx = this.curTabIdx;
        }
        if (openIdx < 0) {
            openIdx = 0;
        }
        if (this.curTabIdx != openIdx) {
            this.tabGroup.Selected = openIdx;
        } else {
            this.onToggleTabGroup(openIdx);
        }
        // 拉取美人数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPetPanelRequest());
        this.updateTipMark();
        this.onMoneyChange();
        super.onOpen();

        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
    }

    protected onClose() {
        super.onClose();
        this.jinjiePanel = null;
        this.suipianPanel = null;
        this.tujianPanel = null;
        this.xunbaoPanel = null;
        this.zhentuPanel = null;
        G.GuideMgr.processGuideNext(EnumGuide.Pet, EnumGuide.Pet_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.PetActivate, EnumGuide.PetActivate_FlyIcon);
        G.GuideMgr.processGuideNext(EnumGuide.OverDue, EnumGuide.GuideCommon_None);
    }

    open(tab = 0, petID: number = 0, petJinJieFuncTab: number = PetJinJieFuncTab.jinjie, tipType: PetTipMarkType = PetTipMarkType.None) {
        this.openTab = tab;
        this.openPetID = petID;
        this.petJinJieFuncTab = petJinJieFuncTab;
        this.selectPetType = tipType;
        super.open();
    }

    private onToggleTabGroup(index: number) {
        this.tabGroup.Selected = index;
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
        let openPetId = this.openPetID;
        this.openPetID = 0;
        let tab = this.Tabs[index];
        if (KeyWord.OTHER_FUNCTION_PET_TUJIAN == tab) {
            this.closeAllButThis(this.tujianPanel);
            if (null == this.tujianPanel) {
                this.tujianPanel = this.createChildForm<PetTuJianPanel>(PetTuJianPanel, KeyWord.OTHER_FUNCTION_PET_TUJIAN);
            }
            this.tujianPanel.open();
        } else if (KeyWord.OTHER_FUNCTION_PET_XUNBAO == tab) {
            this.closeAllButThis(this.xunbaoPanel);
            if (null == this.xunbaoPanel) {
                this.xunbaoPanel = this.createChildForm<PetXunBaoPanel>(PetXunBaoPanel, KeyWord.OTHER_FUNCTION_PET_XUNBAO);
            }
            this.xunbaoPanel.open();

        } else if (KeyWord.OTHER_FUNCTION_PET_SUIPIAN == tab) {
            this.closeAllButThis(this.suipianPanel);
            if (null == this.suipianPanel) {
                this.suipianPanel = this.createChildForm<PetPiecePanel>(PetPiecePanel, KeyWord.OTHER_FUNCTION_PET_SUIPIAN);
            }
            this.suipianPanel.open();

        } else if (KeyWord.OTHER_FUNCTION_PET_ZHENTU == tab) {
            this.closeAllButThis(this.zhentuPanel);
            if (null == this.zhentuPanel) {
                this.zhentuPanel = this.createChildForm<PetZhenTuPanel>(PetZhenTuPanel, KeyWord.OTHER_FUNCTION_PET_ZHENTU);
            }
            this.zhentuPanel.open();
        } else {
            // 进阶和求缘共用
            this.closeAllButThis(this.jinjiePanel);
            if (null == this.jinjiePanel) {
                this.jinjiePanel = this.createChildForm<PetJinJiePanel>(PetJinJiePanel, KeyWord.OTHER_FUNCTION_PET_JINJIE);
            }
            this.jinjiePanel.open(openPetId, this.petJinJieFuncTab, this.selectPetType);
        }
    }

    private onClickReturnBtn() {
        this.close();
    }

    private closeAllButThis(butWho: any) {
        if (null == butWho || butWho != this.jinjiePanel) {
            if (this.jinjiePanel) {
                this.closeChildForm(KeyWord.OTHER_FUNCTION_PET_JINJIE);
                this.jinjiePanel = null;
            }
        }
        if (null == butWho || butWho != this.suipianPanel) {
            if (this.suipianPanel) {
                this.closeChildForm(KeyWord.OTHER_FUNCTION_PET_SUIPIAN);
                this.suipianPanel = null;
            }
        }
        if (null == butWho || butWho != this.tujianPanel) {
            if (this.tujianPanel) {
                this.closeChildForm(KeyWord.OTHER_FUNCTION_PET_TUJIAN);
                this.tujianPanel = null;
            }
        }
        if (null == butWho || butWho != this.xunbaoPanel) {
            if (this.xunbaoPanel) {
                this.closeChildForm(KeyWord.OTHER_FUNCTION_PET_XUNBAO);
                this.xunbaoPanel = null;
            }
        }
        if (null == butWho || butWho != this.zhentuPanel) {
            if (this.zhentuPanel) {
                this.closeChildForm(KeyWord.OTHER_FUNCTION_PET_ZHENTU);
                this.zhentuPanel = null;
            }
        }
    }

    updateByPetChange(isActivePet: boolean = false) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.updateView(isActivePet);
        }
        this.updateJinJieTipMark();
    }

    updateByStageUpResp(response: Protocol.BeautyStageUp_Response) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.updateByStageUpResp(response);
        }
        this.updateJinJieTipMark();
    }

    updateByGongFaResp(response: Protocol.BeautyKF_Response) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.updateByGongFaResp(response);
        }
        this.updateJinJieTipMark();
    }

    updateByJuShenResp(response: Protocol.BeautyJuShen_Response) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.updateByJuShenResp(response);
        }
        this.updateJinJieTipMark();
    }

    updateByJueXingResp(response: Protocol.BeautyAwake_Response) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.updateByJueXingResp(response);
        }
    }
    /**武缘寻宝*/
    onPetXunBaoDataChange(data: Protocol.WYTreasureHunt_Response) {
        if (this.xunbaoPanel != null && this.xunbaoPanel.isOpened) {
            this.xunbaoPanel.updateView(data)
        }
    }


    onContainerChange(type: number) {
        if (this.jinjiePanel != null && this.jinjiePanel.isOpened) {
            this.jinjiePanel.onContainerChange(type);
        } else if (this.suipianPanel != null && this.suipianPanel.isOpened) {
            this.suipianPanel.onContainerChange(type);
        } else if (this.zhentuPanel != null && this.zhentuPanel.isOpened) {
            this.zhentuPanel.onContainerChange(type);
        }
        this.updateJinJieTipMark();
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_ZHENTU].SetActive(G.DataMgr.petData.petZhenTuCanShowTipMark());
    }

    /**
     * 光印界面
     * type 什么类型来的回复（面板，激活，强化）
     */
    updateZhenTuPanel(type: number, zhenTuId: number = 0) {
        if (this.zhentuPanel != null && this.zhentuPanel.isOpened) {
            this.zhentuPanel.updateZhenTuPanel(type, zhenTuId);
        }
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_ZHENTU].SetActive(G.DataMgr.petData.petZhenTuCanShowTipMark());
    }

    private updateTipMark() {
        this.updateJinJieTipMark();
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_ZHENTU].SetActive(G.DataMgr.petData.petZhenTuCanShowTipMark());
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_XUNBAO].SetActive(G.DataMgr.petData.petXunBaoCanShowTipMark());
    }

    updateXunBaoTipMark(bFalg: boolean) {
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_XUNBAO].SetActive(bFalg);
    }

    private updateJinJieTipMark() {
        let petData = G.DataMgr.petData;
        this.tipMarks[KeyWord.OTHER_FUNCTION_PET_JINJIE].SetActive(petData.isAllPetExistCanActive() || petData.isAllPetExistCanJinJie() ||
            petData.isAllPetExistCanSkillUp() || petData.isAllPetCanJuShen() || petData.isAllPetExistBetterEquip());
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.Pet_ClickClose == step) {
            this.onClickReturnBtn();
            return true;
        }
        else if (EnumGuide.PetActivate_ClickClose == step) {
            this.onClickReturnBtn();
            return true;
        }
        return false;
    }
}