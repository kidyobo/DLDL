import { ThingItemData } from 'System/data/thing/ThingItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { Global as G } from 'System/global'
import { FourInOneItemData } from 'System/data/FourInOneItemData'
import { Macros } from 'System/protocol/Macros'

class FourInOneItem {

    private iconitem: IconItem;
    private data: FourInOneItemData;
    private btnGet: UnityEngine.GameObject;
    private index: number = 0;
    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        let icon = ElemFinder.findObject(go, "icon");
        this.iconitem = new IconItem();
        this.iconitem.setUsualIconByPrefab(prefab, icon);
        this.iconitem.setTipFrom(TipFrom.normal);
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet)
    }

    update(data: FourInOneItemData, index: number) {
        this.data = data;
        this.index = index;
        this.iconitem.updateByDropThingCfg(data.rewardCfg);
        this.iconitem.updateIcon();
    }

    private onClickBtnGet(): void {
        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.addMainFloatTip("背包已满");
            return;
        }
        // 使用物品
        G.ModuleMgr.bagModule.useThing(this.data.thingConfig, this.data.thingdata, 1, true, this.index);
        G.Uimgr.closeForm(FourInOneView);
    }

}


export class FourInOneView extends CommonForm {
    private m_thing: ThingItemData = new ThingItemData();
    private m_giftListData: FourInOneItemData[]=[];
    private readonly MAX_THING_NUM: number = 4;
   
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    private txtTitle: UnityEngine.UI.Text;

    private fourInOneItems: FourInOneItem[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.FourInOneView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList("list");
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
        this.txtTitle = this.elems.getText("txtTitle");

        for (let i: number = 0; i < this.MAX_THING_NUM; i++) {
            this.m_giftListData[i] = new FourInOneItemData();
        }
    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
    }

    open(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo): void {
        this.m_thing.config = thingConfig;
        this.m_thing.data = thingInfo;
        super.open();
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {

    }

    private onClickClose() {
        this.close();
    }


    private updateView(): void {
        this.txtTitle.text = this.m_thing.config.m_szName;
        let dropConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(this.m_thing.config.m_iFunctionID);
        for (let i: number = 0; i < dropConfig.m_ucDropThingNumber; i++) {
            this.m_giftListData[i].rewardCfg = dropConfig.m_astDropThing[i];
            this.m_giftListData[i].thingConfig = this.m_thing.config;
            this.m_giftListData[i].thingdata = this.m_thing.data;
        }

        this.list.Count = this.m_giftListData.length;
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.list.GetItem(i).gameObject;
            if (this.fourInOneItems[i] == null) {
                this.fourInOneItems[i] = new FourInOneItem();
                this.fourInOneItems[i].setComponents(item, this.itemIcon_Normal);
            }
            this.fourInOneItems[i].update(this.m_giftListData[i],i);
        }
    }



}
