import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { FaQiBasePanel } from 'System/faqi/FaQiBasePanel'
import { FaQiJinJiePanel, FaQiPanelTag } from 'System/faqi/FaQiJinJiePanel'
import { SiXiangJinJiePanel } from 'System/faqi/SiXiangJinJiePanel'
import { SiXiangTuTengPanel } from 'System/faqi/SiXiangTuTengPanel'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

export class FaQiView extends TabForm {

    private btnReturn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private openTab = 0;
    private openId = 0;
    private openSubTab = 0;

    constructor() {
        super(KeyWord.BAR_FUNCTION_FAQI, FaQiJinJiePanel, SiXiangJinJiePanel, SiXiangTuTengPanel);
        this.openSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FaQiView;
    }

    protected initElements() {
        super.initElements();
        this.btnReturn = this.elems.getElement('btnReturn');
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
        // 更新页签
        let firstTipId = this.updateTabs();
        // 选中指定的页签
        if (0 == this.openTab) {
            this.openTab = firstTipId;
        }
        this.switchTabFormById(this.openTab, this.openId, this.openSubTab);
        this.setTabTipMarkById(KeyWord.BAR_FUNCTION_FAQI, TipMarkUtil.faQiJinJie());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE, TipMarkUtil.siXiangJinJie());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG, TipMarkUtil.siXiangTuTeng());
    }

    open(openTab = 0, id = 0, subTab: FaQiPanelTag = 0) {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(openTab, true)) {
            return;
        }
        this.openTab = openTab;
        this.openId = id;
        this.openSubTab = subTab;
        super.open();
    }

    onContainerChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            let panel = this.getCurrentTab() as FaQiBasePanel;
            if (null != panel && panel.isOpened) {
                panel.onContainerChange(type);
            }
        }
    }

    onFaQiChange() {
        let faqiPanel = this.getTabFormByID(KeyWord.BAR_FUNCTION_FAQI) as FaQiJinJiePanel;
        if (null != faqiPanel && faqiPanel.isOpened) {
            faqiPanel.updateView();
        }
        this.setTabTipMarkById(KeyWord.BAR_FUNCTION_FAQI, TipMarkUtil.faQiJinJie());
    }

    onSkillChange(): void {
        let faqiPanel = this.getTabFormByID(KeyWord.BAR_FUNCTION_FAQI) as FaQiJinJiePanel;
        if (null != faqiPanel && faqiPanel.isOpened) {
            faqiPanel.onSkillChange();
        }
        this.setTabTipMarkById(KeyWord.BAR_FUNCTION_FAQI, TipMarkUtil.faQiJinJie());
    }

    onShenShouChange() {
        let sxjjPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE) as SiXiangJinJiePanel;
        if (null != sxjjPanel && sxjjPanel.isOpened) {
            sxjjPanel.onShenShouChange();
        } else {
            let sxttPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG) as SiXiangTuTengPanel;
            if (null != sxttPanel && sxttPanel.isOpened) {
                sxttPanel.onShenShouChange();
            }
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE, TipMarkUtil.siXiangJinJie());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG, TipMarkUtil.siXiangTuTeng());
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

                if (KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE == funcId) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_PANEL, 0, 0));
                }
            }
        }
        return firstTipId;
    }

    /**根据分页类型获取可进入次数(个人竞技面板)*/
    private needTipMark(funcId: number): boolean {
        let result = false;
        switch (funcId) {
            case KeyWord.BAR_FUNCTION_FAQI:
                result = TipMarkUtil.faQiJinJie();
                break;
            case KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE:
                result = TipMarkUtil.siXiangJinJie();
                break;
            case KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG:
                result = TipMarkUtil.siXiangTuTeng();
                break;
            default:
                break;
        }
        return result;
    }

    private onClickReturnBtn() {
        this.close();
    }
}