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
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { CompareUtil } from 'System/utils/CompareUtil'

class ZhenLongQiJuRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textCredit: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    private selected: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.gameObject = go;
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textCredit = ElemFinder.findText(go, 'textCredit');
        this.selected = ElemFinder.findObject(go, 'selected');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, info: Protocol.SceneResultZLQJRole, showNone: boolean, showSelected: boolean) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szName;
            this.textCredit.text = info.m_iScore.toString();

            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
            this.textCredit.gameObject.SetActive(true);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(false);
            }
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textCredit.gameObject.SetActive(false);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(showNone);
            }
        }

        if (null != this.bg2) {
            this.bg2.SetActive(rank % 2 == 0);
        }

        this.selected.SetActive(showSelected);
    }
}

export class ZhenLongQiJuResultView extends CommonForm {
    private readonly MinDisplayCount = 10;
    private readonly AutoExitSeconds = 30;
    private readonly TickKey = '1';

    private btnExit: UnityEngine.GameObject;
    private labelBtnExit: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;

    private list: List;
    private items: ZhenLongQiJuRankItem[] = [];
    private myItem: ZhenLongQiJuRankItem;

    private info: Protocol.SceneResultZLQJ;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Result;
    }

    protected resPath(): string {
        return UIPathData.ZhenLongQiJuResultView;
    }

    protected initElements() {
        this.btnExit = this.elems.getElement('btnExit');
        this.labelBtnExit = this.elems.getText('labelBtnExit');
        this.mask = this.elems.getElement('mask');

        this.list = this.elems.getUIList('list');
        this.myItem = new ZhenLongQiJuRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onClickBtnExit);
        this.addClickListener(this.mask, this.onClickBtnExit);
    }

    protected onOpen() {
        this.updateView();
        this.labelBtnExit.text = uts.format('退出({0})', this.AutoExitSeconds);
        this.addTimer(this.TickKey, 1000, this.AutoExitSeconds, this.onTickTimer);
    }

    protected onClose() {
    }

    open(info: Protocol.SceneResultZLQJ) {
        this.info = info;
        super.open();
    }

    private onClickBtnExit() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        this.close();
    }

    private updateView() {
        let self = this.info.m_stSelfInfo;
        let myPos = 0;
        if (null == self) {
            this.myItem.update(0, null, true, false);
            this.myItem.gameObject.SetActive(true);
        } else {
            if (self.m_iRank > 10) {
                // 如果自己在前10名之外，则在第11行显示
                this.myItem.update(self.m_iRank, self, false, true);
                this.myItem.gameObject.SetActive(true);
            } else {
                // 自己在前10名，则不显示第11行
                myPos = self.m_iRank;
                this.myItem.gameObject.SetActive(false);
            }
        }

        let len = this.info.m_ucRankCount;
        let oldItemCnt = this.items.length;

        let displayCnt = len;
        if (displayCnt < this.MinDisplayCount) {
            displayCnt = this.MinDisplayCount;
        }
        this.list.Count = displayCnt;
        for (let i = 0; i < displayCnt; i++) {
            let item: ZhenLongQiJuRankItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new ZhenLongQiJuRankItem());
                item.setComponents(this.list.GetItem(i).gameObject, false, true);
            }

            if (i < len) {
                let itemData = this.info.m_stRankList[i];
                item.update(i + 1, itemData, false, myPos == i + 1);
            } else {
                // 只是显示一个空行，这样好看点
                item.update(i + 1, null, false, false);
            }
        }
    }

    private onTickTimer(timer: Game.Timer) {
        let left = this.AutoExitSeconds - timer.CallCount;
        if (left > 0) {
            this.labelBtnExit.text = uts.format('退出({0})', left);
        } else {
            this.onClickBtnExit();
        }
    }
}