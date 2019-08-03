import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { HddtDailyActItemData } from 'System/data/vo/HddtDailyActItemData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { Color } from 'System/utils/ColorUtil'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'

export class SaoDangResultView extends CommonForm {

    private readonly DisplayCnt = 40;

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private list: List;
    private icons: IconItem[] = [];
    private textTitle: UnityEngine.UI.Text;
    private textDesc: UnityEngine.UI.Text;

    private openTitle: string;
    private openDesc: string;
    private openItems: RewardIconItemData[];
    
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SaoDangResultView;
    }

    protected initElements(): void {
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.list = this.elems.getUIList("list");
        this.textTitle = this.elems.getText('textTitle');
        this.textDesc = this.elems.getText('textDesc');

        this.list.Count = this.DisplayCnt;
        for (let i = 0; i < this.DisplayCnt; i++) {
            let icon = new IconItem();
            this.icons.push(icon);
            icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
            icon.setTipFrom(TipFrom.normal);
            icon.showBg = true;
        }
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onCLickMask);
        this.addClickListener(this.btnClose, this.onCLickMask);
    }

    open(title: string, desc: string, items: RewardIconItemData[]) {
        this.openTitle = title;
        this.openDesc = desc;
        this.openItems = items;

        super.open();
    }

    protected onOpen() {
        this.textTitle.text = this.openTitle;
        this.textDesc.text = this.openDesc;

        let cnt = this.openItems.length;
        for (let i = 0; i < this.DisplayCnt; i++) {
            let icon = this.icons[i];
            if (i < cnt) {
                let itemInfo = this.openItems[i];
                icon.updateByRewardIconData(itemInfo);
            } else {
                icon.updateById(0);
            }
            icon.updateIcon();
        }
    }

    private onCLickMask() {
        this.close();
    }
}