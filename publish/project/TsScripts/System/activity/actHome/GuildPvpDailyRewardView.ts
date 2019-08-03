import { IconItem } from 'System/uilib/IconItem'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { TipFrom } from 'System/tip/view/TipsView'
import { List, ListItem } from 'System/uilib/List'

/**
 * 跨服奖励面板
 * @author jesse
 */
export class GuildPvpDailyRewardView extends CommonForm {
    private rewardList:List;
    private readonly itemCnt = 2;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildPvpDailyRewardView;
    }

    protected initElements() {
        this.rewardList=this.elems.getUIList("rewardList");
        this.rewardList.Count = this.itemCnt;

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        
        let item = new IconItem();
        item.setUsualIconByPrefab(itemIcon_Normal,this.rewardList.GetItem(0).gameObject);
        item.setTipFrom(TipFrom.normal);
        item.updateById(10056021, 1);
        item.updateIcon();

        let item2 = new IconItem();
        item2.setUsualIconByPrefab(itemIcon_Normal,this.rewardList.GetItem(1).gameObject);
        item2.setTipFrom(TipFrom.normal);
        item2.updateById(10401121, 1);
        item2.updateIcon();
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }
}