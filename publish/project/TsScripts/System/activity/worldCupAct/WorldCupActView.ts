import { UILayer } from 'System/uilib/CommonForm'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { Global as G } from 'System/global'
import { ElemFinder, ElemFinderMySelf} from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from "System/protocol/Macros"
import { KeyWord } from 'System/constants/KeyWord'
import { WorldCupJingCaiPanel } from "System/activity/worldCupAct/WorldCupJingCaiPanel"
import { WorldCupGuanJunPanel } from "System/activity/worldCupAct/WorldCupGuanJunPanel"

export class WorldCupActView extends TabForm {
    private closeBtn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    static CountryAltas: Game.UGUIAltas;
    static CountryAltas2: Game.UGUIAltas;

    private openTab: number = 0;
    
    constructor() {
        super(KeyWord.ACT_FUNCTION_WORLDCUP, WorldCupJingCaiPanel, WorldCupGuanJunPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.WorldCupActView;
    }

    protected initElements() {
        super.initElements();
        this.closeBtn = this.elems.getElement('closeBtn');
        this.mask = this.elems.getElement('mask');
        WorldCupActView.CountryAltas = ElemFinderMySelf.findAltas(this.elems.getElement('CountryAltas'));
        WorldCupActView.CountryAltas2 = ElemFinderMySelf.findAltas(this.elems.getElement('CountryAltas2'));
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.closeBtn, this.onClickCloseBtn);
        this.addClickListener(this.mask, this.onClickCloseBtn);
    }
    
    open(openTab: number = 0) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        super.onOpen();
        let isJingCaiAvailable = G.DataMgr.funcLimitData.isFuncAvailable(Macros.ACTIVITY_ID_WORLDCUP);
        let isGuanJunAvailable = G.DataMgr.funcLimitData.isFuncAvailable(Macros.ACTIVITY_ID_WORLDCUPCHAMPION);
        let isJingCaiOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_WORLDCUP);
        let isGuanJunOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_WORLDCUPCHAMPION);
        //uts.log("JingcaiAble: " + isJingCaiAvailable + "   JingcaiOpen: " + isJingCaiOpen + "   GuanjunAble: " + isGuanJunAvailable + "   Guanjunopen:" + isGuanJunOpen);
        if (isJingCaiAvailable && isGuanJunAvailable) {
            if (isJingCaiOpen && !isGuanJunOpen) {
                this.openTab = Macros.ACTIVITY_ID_WORLDCUP;
                this.tabGroup.transform.GetChild(0).gameObject.SetActive(true);
                this.tabGroup.transform.GetChild(1).gameObject.SetActive(false);
            }
            else if (isGuanJunOpen && !isJingCaiOpen) {
                this.openTab = Macros.ACTIVITY_ID_WORLDCUPCHAMPION;
                this.tabGroup.transform.GetChild(0).gameObject.SetActive(false);
                this.tabGroup.transform.GetChild(1).gameObject.SetActive(true);
            } else if(isGuanJunOpen && isJingCaiOpen) {
                this.openTab = Macros.ACTIVITY_ID_WORLDCUP;
                this.tabGroup.transform.GetChild(0).gameObject.SetActive(true);
                this.tabGroup.transform.GetChild(1).gameObject.SetActive(true);
            }
            this.switchTabFormById(this.openTab);
            this.updateView(this.openTab);
        }
    }

    updateView(id: number) {
        switch (id) {
            case Macros.ACTIVITY_ID_WORLDCUP:
                this.updateJingCaiPanel();
                break;
            case Macros.ACTIVITY_ID_WORLDCUPCHAMPION:
                this.updateGuanJunPanel();
                break;
            default:
                break;
        }
    }

    updateJingCaiPanel() {
        let jingCaiPanel: WorldCupJingCaiPanel = this.getTabFormByID(Macros.ACTIVITY_ID_WORLDCUP) as WorldCupJingCaiPanel;
        if (jingCaiPanel && jingCaiPanel.isOpened) {
            jingCaiPanel.updateView();
        }
    }

    updateGuanJunPanel() {
        let guanJunPanel: WorldCupGuanJunPanel = this.getTabFormByID(Macros.ACTIVITY_ID_WORLDCUPCHAMPION) as WorldCupGuanJunPanel;
        if (guanJunPanel && guanJunPanel.isOpened) {
            guanJunPanel.updateView();
        }
    }
    
    private onClickCloseBtn() {
        this.close();
    }
}