import { KeyWord } from 'System/constants/KeyWord';
import { DropPlanData } from 'System/data/DropPlanData';
import { KfLingDiData } from 'System/data/KfLingDiData';
import { UIPathData } from 'System/data/UIPathData';
import { TipFrom } from 'System/tip/view/TipsView';
import { CommonForm, UILayer } from 'System/uilib/CommonForm';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ElemFinder } from 'System/uilib/UiUtility';

export class KfLingDiRewardItem {
    private _nameImg: UnityEngine.UI.Image;

    private _rewardList: List;

    setCommonpents(gb: UnityEngine.GameObject) {
        this._nameImg = ElemFinder.findImage(gb, 'nameImg');
        this._rewardList = ElemFinder.getUIList(ElemFinder.findObject(gb, 'rewardList'));
    }

    update(dropID: number, sprite: UnityEngine.Sprite) {
        this._nameImg.sprite = sprite;

        let dropThings = DropPlanData.getDropPlanConfig(dropID).m_astDropThing;
        let len = Math.max(dropThings.length, 4);
        this._rewardList.Count = len;
        for (let i = 0; i < len; i++) {
            let iconItem = new IconItem();

            iconItem.setUsuallyIcon(this._rewardList.GetItem(i).gameObject);
            if (i >= dropThings.length) continue;

            iconItem.setTipFrom(TipFrom.normal);
            let config = dropThings[i];
            iconItem.updateById(config.m_iDropID, config.m_uiDropNumber);
            iconItem.updateIcon();
        }
    }
}


export class KfLingDiRewardView extends CommonForm {

    private _lists: List;

    private _listItems: KfLingDiRewardItem[] = [];

    private _rewardNameAltas: Game.UGUIAltas;

    constructor() {
        super(KeyWord.ACT_FUNCTION_ZZHC);
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KfLingDiRewardView;
    }

    protected initElements() {
        this._rewardNameAltas = this.elems.getElement('rewardNameAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this._lists = this.elems.getUIList('rewardGroup');
        let len = KfLingDiData.PREVIEW_REWARD_ID_GROUP.length;
        this._lists.Count = len;
        for (let i = 0; i < len; i++) {
            let listItem = this.getListItem(i);
            let dropID = KfLingDiData.PREVIEW_REWARD_ID_GROUP[i];
            let sprite = this._rewardNameAltas.Get(KfLingDiData.PREVIEW_REWARD_NAME_GROUP[i]);
            listItem.update(dropID, sprite);
        }
    }

    private getListItem(index: number): KfLingDiRewardItem {
        if (index < this._listItems.length) {
            return this._listItems[index];
        }

        let item = new KfLingDiRewardItem();
        let gb = this._lists.GetItem(index).gameObject;
        item.setCommonpents(gb);
        this._listItems.push(item);
        return item;
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this._onClickMask);
    }

    private _onClickMask() {
        this.close();
    }

    protected onOpen() {
    }

    protected onClose() {
    }

}
