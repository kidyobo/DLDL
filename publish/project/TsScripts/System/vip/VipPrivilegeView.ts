import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TabSubForm } from 'System/uilib/TabForm'
import { VipTab, VipView } from 'System/vip/VipView'
import { VipData } from 'System/data/VipData'


export class VipPrivilegeListItem extends ListItemCtrl {

    private jiShuBack: UnityEngine.GameObject;
    private ouShuBack: UnityEngine.GameObject;
    private titleText: UnityEngine.UI.Text;
    private vipValueTexts: UnityEngine.UI.Text[] = [];
    private yesObs: UnityEngine.GameObject[] = [];
    private noObjs: UnityEngine.GameObject[] = [];


    setComponents(go: UnityEngine.GameObject, maxLevel: number) {
        this.jiShuBack = ElemFinder.findObject(go, 'jishuBack');
        this.ouShuBack = ElemFinder.findObject(go, 'oushuBack');
        this.titleText = ElemFinder.findText(go, 'bg/title');
        for (let i = 1; i <= maxLevel; i++) {
            let text = ElemFinder.findText(go, 'bg/'+i);
            let yes = ElemFinder.findObject(text.gameObject, 'yes');
            let no = ElemFinder.findObject(text.gameObject, 'no');
            this.vipValueTexts.push(text);
            this.yesObs.push(yes);
            this.noObjs.push(no);
        }
    }





    update(index: number, data1: GameConfig.VIPParameterConfigM, data2: GameConfig.VIPPriHYParamM) {
        let data = data1 == null ? data2 : data1;
        let active = (index % 2 == 0);
        this.ouShuBack.SetActive(active);
        this.jiShuBack.SetActive(!active);
        this.titleText.text = data.m_szDesc;
        let showtype = data.m_ucDisplayType;
        let values: number[] = data.m_aiValue;
        for (let i = 0; i < values.length; i++) {
            let text = this.vipValueTexts[i];
            let yes = this.yesObs[i];
            let no = this.noObjs[i];
            if (G.DataMgr.heroData.curVipLevel < 12 && i == 12) {
                text.text = '';
                yes.SetActive(false);
                no.SetActive(false);
                continue;
            }
            if (showtype == KeyWord.VIP_DISP_TYPE_CONDITION) {
                //显示开启条件
                text.text = '';
                let active = values[i] > 0;
                yes.SetActive(active);
                no.SetActive(!active);
            }
            else if (showtype == KeyWord.VIP_DISP_TYPE_PER10000) {
                //显示万分比
                text.text = Math.floor(values[i] / 10000 * 100) + "%";
                yes.SetActive(false);
                no.SetActive(false);
            }
            else if (showtype == KeyWord.VIP_DISP_TYPE_REBATE) {
                //显示折扣
                if (values[i] == 0) {
                    yes.SetActive(false);
                    no.SetActive(true);
                    text.text = '';
                    continue;
                }
                yes.SetActive(false);
                no.SetActive(false);
                text.text = values[i] + '折';
            }
            else if (showtype == KeyWord.VIP_DISP_TYPE_TIMES) {
                //显示次数
                if (values[i] == -1) {
                    yes.SetActive(true);
                    no.SetActive(false);
                    continue;
                }
                yes.SetActive(false);
                no.SetActive(false);
                text.text = '+' + values[i];
            }
        }
    }

}


export class VipPrivilegeView extends TabSubForm {

    ///////////////////vip对比面板//////////////////////////////
    private list: List = null;
    private selectedParent: UnityEngine.GameObject;
    private selectedObjs: UnityEngine.GameObject[] = [];
    private m_vipParaMap: { [vipType: number]: GameConfig.VIPParameterConfigM[] } = {};
    private privilegeIcons: UnityEngine.GameObject[] = [];
    private vipHighTitle: UnityEngine.UI.Text;

    constructor() {
        super(VipTab.TeQuan);
    }

    protected resPath(): string {
        return UIPathData.VipPrivilegeView;
    }

    protected initElements() {
        this.list = ElemFinder.getUIList(this.elems.getElement("list"));
        this.selectedParent = this.elems.getElement('selecteds');
        for (let i = 1; i <= Macros.MAX_VIP_LEVEL; i++) {
            let selected = ElemFinder.findObject(this.selectedParent, i.toString());
            selected.SetActive(false);
            this.selectedObjs.push(selected);
        }
        for (let i = 0; i < VipData.PrivilegeCnt; i++) {
            this.privilegeIcons.push(this.elems.getElement(uts.format("back{0}", i)));
        }
        this.vipHighTitle = this.elems.getText('Text14');
    }

    protected initListeners() {

    }

    open() {
        super.open();
    }

    protected onOpen() {
        this.vipHighTitle.text = G.DataMgr.heroData.curVipLevel >= 12 ? 'VIP13' : '';
        this.updateView();

        //this.setVipTopPanel(false);
    }

    protected onClose() {
        for (let i = 1; i <= VipData.PrivilegeCnt; i++) {
            this.m_vipParaMap[i].length = 0;
        }

        //this.setVipTopPanel(true);
    }

    private onClickReturnBt() {
        this.close();
    }

    //private setVipTopPanel(isShow: boolean) {
    //    let vipView = G.Uimgr.getForm<VipView>(VipView);
    //    if (vipView != null) {
    //        vipView.setTopPanelActive(isShow);
    //    }
    //}

    //////////////////////////////vip特权对比面板/////////////////////////////////////////

    private updateView(): void {
        for (let i = 1; i <= Macros.MAX_VIP_LEVEL; i++) {
            if (i == G.DataMgr.heroData.curVipLevel) {
                this.selectedObjs[i - 1].SetActive(true);
                break;
            }
        }
        let listData: GameConfig.VIPParameterConfigM[] = [];
        let rawData: GameConfig.VIPParameterConfigM[] = G.DataMgr.vipData.vipParas;
        for (let config of rawData) {
            if (config.m_ucDisplayType > 0) {
                if (this.m_vipParaMap[config.m_ucPriType] == null) {
                    this.m_vipParaMap[config.m_ucPriType] = [];
                }
                this.m_vipParaMap[config.m_ucPriType].push(config);
            }
        }
        for (let i = 1; i <= VipData.PrivilegeCnt; i++) {
            let data = this.m_vipParaMap[i];
            data.sort(this.sortVipParaMap);
            for (let i = 0; i < data.length; i++) {
                listData.push(data[i]);
            }
        }
        this.list.Count = listData.length;
        for (let i = 0; i < listData.length; i++) {
            let obj = this.list.GetItem(i).gameObject;
            let item = new VipPrivilegeListItem();
            item.setComponents(obj, Macros.MAX_VIP_LEVEL);
            item.update(i, listData[i], null);
        }
        //设置特权标题长度
        let content = ElemFinder.findObject(this.list.gameObject, "content");
        if (content != null) {
            let rect = ElemFinderMySelf.findRectTransForm(content);
            let hight = rect.sizeDelta.y;
            let addHight: number = 0;
            for (let i = 1; i <= VipData.PrivilegeCnt; i++) {
                let back = this.privilegeIcons[i - 1];
                back.transform.SetParent(content.transform);
                let backRect = ElemFinderMySelf.findRectTransForm(back);
                backRect.anchoredPosition = G.getCacheV2(0, addHight);
                let backHight = Math.floor(hight * this.m_vipParaMap[i].length / listData.length);
                backRect.sizeDelta = G.getCacheV2(90, backHight);
                addHight = addHight - backHight;
            }
        }
    }


    private sortVipParaMap(a: GameConfig.VIPParameterConfigM, b: GameConfig.VIPParameterConfigM) {
        return a.m_iOrder - b.m_iOrder;
    }
}

