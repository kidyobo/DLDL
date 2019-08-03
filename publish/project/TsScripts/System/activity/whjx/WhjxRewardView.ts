import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { WhjxData } from 'System/data/activities/WhjxData'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'

class WhjxRewardItem extends ListItemCtrl {
    private icon: IconItem;
    private title: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        let iconRoot = ElemFinder.findObject(go, 'icon');
        this.icon = new IconItem();
        this.icon.setUsualIconByPrefab(itemIcon_Normal, iconRoot);
        this.icon.setTipFrom(TipFrom.normal);

        this.title = ElemFinder.findObject(go, 'title');
    }

    update(cfg: GameConfig.WHJXCfgM) {
        // 显示物品图标
        this.icon.updateById(cfg.m_stItemList[0].m_iID);
        this.icon.updateIcon();
        // 加载称号
        let thingCfg = ThingData.getThingConfig(cfg.m_stItemList[0].m_iID);
        let titleCfg = G.DataMgr.titleData.getDataConfig(thingCfg.m_iFunctionID);
        G.ResourceMgr.loadModel(this.title, UnitCtrlType.chenghao, titleCfg.m_uiImageID.toString(), 0);
    }
}

/*
 * 能力叛乱奖励预览
 */
export class WhjxRewardView extends CommonForm {

    private list: List;
    private btnClose: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WhjxRewardView;
    }

    protected onOpen() {
        
    }

    protected initElements(): void {
        this.list = this.elems.getUIList('list');
        this.btnClose = this.elems.getElement('btnClose');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        let cnt = WhjxData.Types.length;
        this.list.Count = cnt;
        let whjxData = G.DataMgr.activityData.whjxData;
        for (let i = 0; i < cnt; i++) {
            let item = new WhjxRewardItem();
            item.setComponents(this.list.GetItem(i).gameObject, itemIcon_Normal);
            item.update(whjxData.getCfgByType(WhjxData.Types[i]));
        }
    }

    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onclickBtnClose);
    }

    private onclickBtnClose() {
        this.close();
    }
}