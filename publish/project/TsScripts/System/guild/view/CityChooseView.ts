import { Global as G } from 'System/global'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { ChannelClean } from 'System/chat/ChannelClean'
import { CharLenUtil } from 'System/utils/CharLenUtil'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { List } from 'System/uilib/List'
import { UIUtils } from "System/utils/UIUtils";
import { DataFormatter } from 'System/utils/DataFormatter'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ActivityData } from 'System/data/ActivityData'
import { KfLingDiData } from "System/data/KfLingDiData";


class CityChooseItem {
    private static NoPromp = false;


    private btnGo: UnityEngine.GameObject;
    private txtBtnGo: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private bg1: UnityEngine.UI.Image;
    private bg2: UnityEngine.UI.Image;
    private selectedImg: UnityEngine.UI.Image;

    private isActive: boolean = false;
    private cityId: number = 0;
    public names: string[] = [];

    setComponents(go: UnityEngine.GameObject, id: number) {
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.bg1 = ElemFinder.findImage(go, 'bg1');
        this.bg2 = ElemFinder.findImage(go, 'bg2');
        this.txtBtnGo = ElemFinder.findText(this.btnGo, 'Text');
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo, id);


    }
    update(info: Protocol.CSZZHCPannelInfo, cityOneData: Protocol.CSZZHCCityOneData, index: number) {
        if (index % 2 == 0) {
            this.isActive = true;
        } else {
            this.isActive = false;
        }
        this.bg1.gameObject.SetActive(this.isActive);
        this.bg2.gameObject.SetActive(!this.isActive);
        this.txtName.text = cityOneData.m_szCityName;
        let isActive: boolean = true;
        if (info.m_iRecommondCityID == index + 1) {
            this.txtBtnGo.text = '已选择';
            isActive = false;
        }
        else {
            this.txtBtnGo.text = '选择';
            isActive = true;

        }
        UIUtils.setButtonClickAble(this.btnGo, isActive);


    }
    private onClickBtnGo(id: number) {
        this.cityId = id;
        let info = G.DataMgr.kfLingDiData.PanelInfo
        if (info != null) {
            let cityInfo = info.m_stCityData;
            if (info.m_iRecommondCityID == 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDitargetRequest(this.cityId));
            } else {
                if (info.m_bRecommondGrade == 1 && G.DataMgr.heroData.isViceManagers) {
                    let text: string = uts.format('对不起,宗主已选择{0}作为本周攻击目标,如想更换目标,请联系宗主修改', cityInfo.m_stRankList[info.m_iRecommondCityID-1].m_szCityName);
                    G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, '确定');
                }
                else {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDitargetRequest(this.cityId));

                }
            }
        }
    }

    private onColickChoose(state: MessageBoxConst = 0, isCheckSelected: boolean) {
        CityChooseItem.NoPromp = isCheckSelected;
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDitargetRequest(this.cityId));

        }
    }

}

export class CityChooseView extends CommonForm {

    private items: CityChooseItem[] = [];
    private list: List;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.CityChooseView;
    }

    protected initElements() {


        this.list = this.elems.getUIList('list');

    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('btnClose'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }
    protected onOpen() {

        this.updatePanel();
    }


    updatePanel() {
        let oldItemCnt = this.items.length;
        this.list.Count = KfLingDiData.CITY_COUNT - 1;
        let item: CityChooseItem;
        for (let i = 0; i < KfLingDiData.CITY_COUNT - 1; i++) {
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items[i] = item = new CityChooseItem();
                item.setComponents(this.list.GetItem(i).gameObject, i + 2);
            }

            let info = G.DataMgr.kfLingDiData.PanelInfo
            let cityData = G.DataMgr.kfLingDiData.PanelInfo.m_stCityData;
            item.update(info, cityData.m_stRankList[i + 1], i + 1);
        }
    }

}