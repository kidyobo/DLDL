import { UIPathData } from 'System/data/UIPathData';
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData';
import { CommonForm, UILayer } from 'System/uilib/CommonForm';
import { IconItem } from 'System/uilib/IconItem';
import { TipFrom } from '../tip/view/TipsView';


export class OpenChestView extends CommonForm {
    private readonly AutoTimerKey = '1';

    private list: UnityEngine.GameObject;
    private icons: IconItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;

    private leftSeconds = 0;
    private autoUse = false;

    private openDesc: string;
    private itemDatas: RewardIconItemData[];

    private btnMask: UnityEngine.GameObject;
    private isAuto: boolean;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.OpenChestView;
    }

    protected onOpen() {
        // if (this.isAuto)
        //     this.addTimer(this.AutoTimerKey, 1500, 1, this.onAutoTimer);

        // 奖励列表
        let cnt = this.itemDatas.length;
        let oldIconCnt = this.icons.length;
        if (oldIconCnt < cnt) {
            for (let i = oldIconCnt; i < cnt; i++) {
                let iconItem = new IconItem();
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.list);
                iconItem.setTipFrom(TipFrom.normal);
                this.icons.push(iconItem);
            }
        } else if (oldIconCnt > cnt) {
            for (let i = cnt; i < oldIconCnt; i++) {
                this.icons[i].gameObject.SetActive(false);
            }
        }
        for (let i = 0; i < cnt; i++) {
            let iconItem = this.icons[i];
            iconItem.updateByRewardIconData(this.itemDatas[i]);
            iconItem.updateIcon();
            this.icons[i].gameObject.SetActive(true);
        }
    }

    protected onClose() {
        this.itemDatas = null;
        // this.removeTimer(this.AutoTimerKey);
    }

    protected initElements(): void {
        this.btnMask = this.elems.getElement('mask');

        this.list = this.elems.getElement('list');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
    }

    protected initListeners(): void {
        this.addClickListener(this.form, this.onClickForm);
        this.addClickListener(this.btnMask, this.onClickForm);
    }

    open(desc: string, itemDatas: RewardIconItemData[], isAuto: boolean = true) {
        this.openDesc = desc;
        this.itemDatas = itemDatas;
        this.isAuto = isAuto;
        super.open();
    }

    private onClickForm() {
        this.close();
    }

    private onAutoTimer(timer: Game.Timer) {
        this.close();
    }
}