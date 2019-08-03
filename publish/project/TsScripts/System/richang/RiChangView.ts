import { CommonForm, UILayer ,GameObjectGetSet,TextGetSet} from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { UnitUtil } from 'System/utils/UnitUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { RCRecommendItem } from 'System/data/TaskRecommendData'
import { DataFormatter } from "System/utils/DataFormatter";
import { TabForm } from "System/uilib/TabForm"
import { TabFormCommom } from "System/uilib/TabFormCommom"
import { RiChangBaseView } from 'System/richang/RiChangBaseView'
import { RiChangTab1View } from 'System/richang/RiChangTab1View'
import { RiChangTab2View } from 'System/richang/RiChangTab2View'
import { RiChangTab3View } from 'System/richang/RiChangTab3View'
import { RiChangTab4View } from 'System/richang/RiChangTab4View'
import { RiChangTab5View } from 'System/richang/RiChangTab5View'
import { SaiJiWaiXianView } from 'System/richang/SaiJiWaiXianView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { UnitCtrlType } from "System/constants/GameEnum";

import { CurrencyTip } from "System/uilib/CurrencyTip";
export class RiChangView extends TabFormCommom {
    private openTabId: number = 0;
    private subClass: number = 0;
    private currencyTip: CurrencyTip;

    private recommendTabIds: number[] = [KeyWord.OTHER_FUNCTION_RICHANG_JY, KeyWord.OTHER_FUNCTION_RICHANG_ZB, KeyWord.OTHER_FUNCTION_RICHANG_CL, KeyWord.OTHER_FUNCTION_RICHANG_SL, KeyWord.OTHER_FUNCTION_RICHANG_HD];

    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [true, false, false, false, false, false];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;

    private bg_3d_prefabPath: string;

    constructor() {
        super(KeyWord.ACT_FUNCTION_DAILY, SaiJiWaiXianView, RiChangTab1View, RiChangTab2View, RiChangTab3View, RiChangTab4View, RiChangTab5View);
        this._cacheForm = true;
        this.closeSound = null;
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.RiChangView;
    }
    open(tabId: number = 0, subclass: number = 0) {
        uts.log('tabId = ' + tabId + ', subclass = ' + subclass);
        this.openTabId = tabId;
        this.subClass = subclass;
        super.open();
    }

    protected initElements(): void {
        super.initElements();
        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.getCloseButton(), this.onClickBtnClose);
        this.addClickListener(this.elems.getElement("mask"), this.onClickBtnClose);
    }

    protected onOpen() {
        super.onOpen();
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);
        this.setTabGroupNanme(["赛季","升级", "战力", "材料", "挑战", "活动"]);

        this.setTitleName("日常");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());
        this.currencyTip.updateMoney();
        this.judgeFunctionHasOpen();
        this.autoOpenTab();
        this.updateSaiJiTipMark();
    }

    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    onMoneyChange(id: number) {
        this.currencyTip.updateMoney();
    }

    private judgeFunctionHasOpen() {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            let show = (0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
            //if (funId == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {
            //    show = true;
            //}
            this.tabGroup.GetToggle(i).gameObject.SetActive(show);
        }
    }

    private autoOpenTab() {
        uts.log('autoOpenTab: ' + this.openTabId);
        if (this.openTabId > 0) {
            this.switchTabFormById(this.openTabId, this.subClass);
        }
        else {
            let firstid = this.updateRCStatus();
            // 选中指定的页签
            this.switchTabFormById(firstid);
        }
    }

    private onClickBtnClose() {
        G.AudioMgr.playSound('sound/ui/uisound_openAndclose.mp3');
        this.close();
    }

    public updateRCStatus(): number {
        let rcdata = G.DataMgr.taskRecommendData;
        let count = this.getTabCount();
        let firstid = 0;
        for (let i = 0; i < count; i++) {
            let form = this.getTabFormByIndex(i);
            let funId = form.Id;
            if (this.recommendTabIds.indexOf(funId) >= 0) {
                let arr = rcdata.getRCRecommendArray((form as RiChangBaseView).type);
                this.setTabVisible(i, arr.length > 0);
                let hasRed = false;
                for (let data of arr) {
                    if (data.redTip) {
                        hasRed = true;
                        break;
                    }
                }
                this.setTabTipMark(i, hasRed);
                if (firstid == 0 && arr.length > 0) {
                    firstid = form.Id;
                }
            }
        }
        let view = this.getCurrentTab() as RiChangBaseView;
        if (view && this.recommendTabIds.indexOf(view.Id) >= 0 && view.isOpened) {
            view.updateView();
        }
        return firstid;
    }

    updateSaiJiView() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) as SaiJiWaiXianView;
        if (view && view.isOpened) {
            view.updatePanel();
        }
        this.updateSaiJiTipMark();
    }

    private updateSaiJiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, TipMarkUtil.saiJiViewTipMark());
    }

}