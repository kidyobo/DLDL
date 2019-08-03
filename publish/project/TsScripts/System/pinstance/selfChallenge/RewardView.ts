import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from "System/data/UIPathData"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { List } from 'System/uilib/List'
import { RewardIconItemData } from "System/data/vo/RewardIconItemData"
import { IconItem } from "System/uilib/IconItem"
import { ShouHuNvShenItemData } from "System/data/ShouHuNvShenItemData"
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { EnumRewardState } from 'System/constants/GameEnum'

/**
 * 神凰秘境，奖励
 */
export class RewardView extends CommonForm {
    private btnConfirm: UnityEngine.GameObject = null;
    private labelBtn: UnityEngine.UI.Text;

    private objReward: UnityEngine.GameObject = null;
    /**要获得的奖励ICON*/
    private list: List;
    private rewardIcons: IconItem[] = [];
    private textDesc: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;

    private itemDatas: RewardIconItemData[];
    private openDesc: string;
    private state = EnumRewardState.NotReach;
    private onClickGet: () => void;
 
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.RewardView;
    }
    protected initElements(): void {
        this.btnConfirm = this.elems.getElement("btnConfirm");
        this.labelBtn = this.elems.getText('labelBtn');
        this.mask = this.elems.getElement("mask");
        this.list = this.elems.getUIList("list");
        this.textDesc = this.elems.getText('textDesc');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnConfirm, this.onBtnConfirm);
        this.addClickListener(this.mask, this.onBtnMask);
    }

    /**
     * 
     * @param data 奖励图标数据
     * @param sendMsg 领取发送的数据
     * @param index 当前点击的索引
     */
    open(itemDatas: RewardIconItemData[], desc: string, state: EnumRewardState, onClickGet: () => void) {
        this.itemDatas = itemDatas;
        this.openDesc = desc;
        this.state = state;
        this.onClickGet = onClickGet;
        super.open();
    }

    protected onOpen() {
        //3表示奖励物品数量
        this.textDesc.text = this.openDesc;
        let cnt = this.itemDatas.length;
        this.list.Count = cnt;
        let oldItemCnt = this.rewardIcons.length;
        for (let i = 0; i < cnt; i++) {
            let iconItem: IconItem;
            if (i < oldItemCnt) {
                iconItem = this.rewardIcons[i];
            } else {
                this.rewardIcons[i] = iconItem = new IconItem();
                iconItem.setUsuallyIcon(this.list.GetItem(i).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            this.rewardIcons[i].updateByRewardIconData(this.itemDatas[i]);
            this.rewardIcons[i].updateIcon();
        }
        if (EnumRewardState.HasGot == this.state) {
            this.labelBtn.text = '已领取';
        } else {
            this.labelBtn.text = '领取';
        }
        UIUtils.setButtonClickAble(this.btnConfirm, EnumRewardState.NotGot == this.state);
    }

    private onBtnConfirm() {
        if (null != this.onClickGet) {
            this.onClickGet();
        }
        this.close();
    }

    protected onClose() {

    }

    private onBtnMask() {
        this.close();
    }
}