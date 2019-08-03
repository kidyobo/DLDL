import { Global as G } from 'System/global'
import { EnumTgbjRule } from 'System/tanbao/EnumTgbjRule'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { EnumStoreID } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { List } from "System/uilib/List"
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


class HFBXExchangeItem extends ListItemCtrl {

    private txtName: UnityEngine.UI.Text;
    private txtJifen: UnityEngine.UI.Text;
    private parent: UnityEngine.GameObject;
    private btnBuy: UnityEngine.GameObject;
    private iconItem: IconItem;

    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtJifen = ElemFinder.findText(go, 'xianjia/txtJifen');
        this.parent = ElemFinder.findObject(go, 'content');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        if (this.iconItem == null) {
            this.iconItem = new IconItem();
            this.iconItem.setUsualIconByPrefab(prefab, this.parent);
            this.iconItem.setTipFrom(TipFrom.normal);
        }
    }

    update(vo: GameConfig.HFBXYLShopCfgM, myJifen: number) {
        let thingConfig = ThingData.getThingConfig(vo.m_iID);
        let color = Color.getColorById(thingConfig.m_ucColor);
        this.txtName.text = TextFieldUtil.getColorText(thingConfig.m_szName, color);
        // 现价
        this.txtJifen.text = vo.m_iPrice.toString();
        this.txtJifen.color = Color.toUnityColor(myJifen >= vo.m_iPrice ? Color.GREEN : Color.RED);
        this.iconItem.updateById(vo.m_iID, vo.m_iCount);
        this.iconItem.updateIcon();
        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBuy, vo);
    }


    private onClickBuy(vo: GameConfig.HFBXYLShopCfgM) {
        if (null != vo) {

            uts.log("  vo.m_iID   " + vo.m_iID);

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_BXYL_SHOP_EXCHANGE, vo.m_iID));
        }
    }
}


export class MergeShopView extends CommonForm {

    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    // private txtCurJifen: UnityEngine.UI.Text;
    private exchangeItem: HFBXExchangeItem[] = [];

    constructor() {
        super(9997);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.MergeShopView;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        // this.txtCurJifen = this.elems.getText("txtCurJifen");
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturn);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickReturn);
    }


    protected onOpen() {
        this.updatePanel();
    }
    protected onClose() {

    }

    private onClickReturn() {
        this.close();
    }


    updatePanel(): void {
        let hfData = G.DataMgr.hfhdData;
        let curJiFen = hfData.hfBaoxiangInfo.m_iCurScore;
        let configs = hfData.getHFBaoXiangDuiHuanAllConfigs();
        this.list.Count = configs.length;
        for (let i = 0; i < this.list.Count; i++) {
            let itemGo = this.list.GetItem(i).gameObject;
            if (this.exchangeItem[i] == null) {
                this.exchangeItem[i] = new HFBXExchangeItem();
                this.exchangeItem[i].setComponents(itemGo, this.itemIcon_Normal);
            }
            this.exchangeItem[i].update(configs[i], curJiFen);
        }
    }
}
