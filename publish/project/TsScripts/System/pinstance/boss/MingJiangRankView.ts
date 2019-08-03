import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

import { MingJiangData, MingJiangOneRankData } from "../../data/MingJiangData";

class MingJiangRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textGx: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textGx = ElemFinder.findText(go, 'textGx');

        if (hasBg2) this.bg2 = ElemFinder.findObject(go, 'bg2');
        if (hasNone) this.textNone = ElemFinder.findText(go, 'textNone');
    }

    update(data: MingJiangOneRankData) {
        if (!data && this.textNone) {
            this.textNone.gameObject.SetActive(true);
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textGx.gameObject.SetActive(false);
            return;
        }

        if (this.textNone) this.textNone.gameObject.SetActive(false);
        if (this.bg2) this.bg2.SetActive(data.rankValue % 2 == 0);


        this.textRank.gameObject.SetActive(true);
        this.textName.gameObject.SetActive(true);
        this.textGx.gameObject.SetActive(true);
        this.textRank.text = data.rankValue.toString();
        this.textName.text = data.name;
        this.textGx.text = data.damagePer;
    }
}

export class MingJiangRankView extends CommonForm {

    private btnClose: UnityEngine.GameObject;

    /**排名列表*/
    private list: List;
    private items: MingJiangRankItem[] = [];
    private myItem: MingJiangRankItem;

    private _myRankTxt: UnityEngine.UI.Text;
    private _outPutTxt: UnityEngine.UI.Text;
    private _canGetTxt: UnityEngine.UI.Text;

    private _rewardIcon: IconItem;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.MingJiangRankView;
    }
    protected initElements(): void {
        this.list = this.elems.getUIList('list');
        this.myItem = new MingJiangRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);

        this.btnClose = this.elems.getElement('btnClose');

        this._myRankTxt = this.elems.getText('myRankTxt');
        this._outPutTxt = this.elems.getText('outputTxt');
        this._canGetTxt = this.elems.getText('canGetTxt');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this._rewardIcon = new IconItem();
        this._rewardIcon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('reward'));
        this._rewardIcon.setTipFrom(TipFrom.normal);
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangPanelRequest());
    }

    update() {
        let data = G.DataMgr.mingJiangData;
        let rankDatas = data.getRankDatas();

        this.list.Count = rankDatas.length;
        this.items.length = rankDatas.length;
        for (let i = 0; i < rankDatas.length; i++) {
            if (!this.items[i]) this.items[i] = new MingJiangRankItem();
            let item: MingJiangRankItem = this.items[i];

            item.setComponents(this.list.GetItem(i).gameObject, false, true);
            item.update(rankDatas[i]);
        }

        this.myItem.update(data.getMyRankData());

        let rankStr = data.myRank > 0 ? data.myRank.toString() : '未上榜';
        let rankColor = data.myRank > 0 ? Color.GOLD : Color.GREY;
        this._myRankTxt.text = '我的排名：' + TextFieldUtil.getColorText(rankStr, rankColor);

        this._outPutTxt.text = '神将币产出：' + TextFieldUtil.getColorText(<string>data.mjCoinOutput, Color.GOLD);
        this._canGetTxt.text = '当前可领取：' + TextFieldUtil.getColorText(<string>data.curCanGetMJCoin, Color.GOLD);

        let itemID = MingJiangData.TOP_DAMAGE_GIFT_ID + (G.DataMgr.mingJiangData.curPage + 1) * 10;
        this._rewardIcon.updateById(itemID, 1);
        this._rewardIcon.updateIcon();
    }

    protected onClose() {
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnClose() {
        this.close();
    }
}
