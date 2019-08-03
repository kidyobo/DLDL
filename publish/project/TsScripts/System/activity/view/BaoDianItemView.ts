import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { CompareUtil } from 'System/utils/CompareUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { EnumBagTab } from 'System/bag/view/BagView'
import { UIUtils } from 'System/utils/UIUtils'
import { VipView,VipTab } from 'System/vip/VipView'
import { TabSubForm } from 'System/uilib/TabForm'



class BaoDianItem extends ListItemCtrl {
    private icon: UnityEngine.UI.Image;
    private name: UnityEngine.UI.Image;
    private textDesc: UnityEngine.UI.Text;

    private btnGo: UnityEngine.GameObject;

    private finished: UnityEngine.GameObject;
    private recommanded: UnityEngine.GameObject;

    private cfg: GameConfig.BaoDianCfgM;

    setComponents(go: UnityEngine.GameObject) {
        this.icon = ElemFinder.findImage(go, 'iconBg/icon');
        this.name = ElemFinder.findImage(go, 'iconBg/name');
        this.textDesc = ElemFinder.findText(go, 'descBg/textDesc');

        this.btnGo = ElemFinder.findObject(go, 'btnGo');

        this.finished = ElemFinder.findObject(go, 'finished');
        this.recommanded = ElemFinder.findObject(go, 'recommanded');

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    update(cfg: GameConfig.BaoDianCfgM, status: number, recommanded: boolean, altas: Game.UGUIAltas) {
        this.cfg = cfg;

        this.icon.sprite = altas.Get(cfg.m_iID.toString());
        this.name.sprite = altas.Get('n' + cfg.m_iID.toString());
        this.textDesc.text = RegExpUtil.xlsDesc2Html(cfg.m_szShow);

        UIUtils.setButtonClickAble(this.btnGo, 0 == status);
        if (0 == status) {
            this.finished.SetActive(false);
            this.recommanded.SetActive(recommanded);
        } else {
            this.finished.SetActive(true);
            this.recommanded.SetActive(false);
        }
    }

    private onClickBtnGo() {
        let executed = false;
        if (KeyWord.BAR_FUNCTION_BAG == this.cfg.m_iFunctionID) {
            executed = G.ActionHandler.executeFunction(this.cfg.m_iFunctionID, 0, 0, EnumBagTab.bag, this.cfg.m_iFunctionValue);
        } else if (KeyWord.BAR_FUNCTION_PRIVILEGE == this.cfg.m_iFunctionID) {
            executed = G.ActionHandler.executeFunction(this.cfg.m_iFunctionID, 0, 0, VipTab.ZunXiang, this.cfg.m_iFunctionValue);
        } else {
            executed = G.ActionHandler.executeFunction(this.cfg.m_iFunctionID, 0, 0, this.cfg.m_iFunctionValue);
        }

        if (executed) {
            G.Uimgr.closeForm(BaoDianItemView);
        }
    }
}

export class BaoDianItemView extends TabSubForm {
    private readonly RewardsCount = 3;

    //private btnClose: UnityEngine.GameObject;
    //private mask: UnityEngine.GameObject;

    private altas: Game.UGUIAltas;

    private list: List;
    private items: BaoDianItem[] = [];

    private openType = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_7GOAL_FENGYUEBAODIAN);
    }

    //layer(): UILayer {
    //    return UILayer.Second;
    //}

    protected resPath(): string {
        return UIPathData.BaoDianItemView;
    }

    protected initElements() {
      //  this.btnClose = this.elems.getElement('btnClose');
        this.list = this.elems.getUIList('list');
       // this.mask = this.elems.getElement('mask');
        this.altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    protected initListeners() {
        //this.addClickListener(this.btnClose, this.onClickBtnClose);
        //this.addClickListener(this.mask, this.onClickBtnClose);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getBaoDianRequest());
    }

    protected onClose() {
    }

    open(type: number) {
        this.openType = type;
        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }

    updateBaoDianView() {
        let kfhdData = G.DataMgr.kfhdData;
        // let cfgsArr = kfhdData.getBaoDianConfigsByType(this.openType);
        let cfgsArr = kfhdData.getBaoDianAllConfigs();
        let recommandId = kfhdData.getRecommenedId();
        let count = cfgsArr.length;
        this.list.Count = count;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < count; i++) {
            let item: BaoDianItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new BaoDianItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            let cfg = cfgsArr[i];
            let status = kfhdData.getBaoDianStatus(cfg.m_iID);
            item.update(cfg, status, recommandId == cfg.m_iID, this.altas);
        }
    }

}