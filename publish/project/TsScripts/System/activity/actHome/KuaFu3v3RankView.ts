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
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { TipFrom } from 'System/tip/view/TipsView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { CompareUtil } from 'System/utils/CompareUtil'

class KuaFu3v3RankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private textCredit: UnityEngine.UI.Text;

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.textCredit = ElemFinder.findText(go, 'textCredit');

        this.bg1 = ElemFinder.findObject(go, 'bg1');
        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, info: Protocol.CliCross3V3PVPOneRank, showNone: boolean) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szNickName;
            this.textStage.text = G.DataMgr.kf3v3Data.getStageName(info.m_uiGrade);
            this.textCredit.text = info.m_uiScore.toString();

            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
            this.textStage.gameObject.SetActive(true);
            this.textCredit.gameObject.SetActive(true);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(false);
            }
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textStage.gameObject.SetActive(false);
            this.textCredit.gameObject.SetActive(false);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(showNone);
            }
        }

        if (null != this.bg2) {
            this.bg2.SetActive(rank % 2 == 0);
        }
    }
}

export class KuaFu3v3RankView extends CommonForm {
    private readonly MinDisplayCount = 4;
    private readonly RewardsCount = 3;

    //private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private list: List;
    private items: KuaFu3v3RankItem[] = [];
    private myItem: KuaFu3v3RankItem;

    private roleRoot: UnityEngine.GameObject;
    private roleAvatar: UIRoleAvatar;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KuaFu3v3RankView;
    }

    protected initElements() {
        //this.btnClose = this.elems.getElement('btnClose');
        this.mask = this.elems.getElement('mask');

        this.list = this.elems.getUIList('list');
        this.myItem = new KuaFu3v3RankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);
        this.roleRoot = this.elems.getElement('roleRoot');

        let seasonCfgs = G.DataMgr.kf3v3Data.seasonArr;
        for (let i = 0; i < this.RewardsCount; i++) {
            let rewardList = this.elems.getUIList('rewardList' + i);
            let cfg = seasonCfgs[i];
            rewardList.Count = cfg.m_iItemCount;
            for (let j = 0; j < cfg.m_iItemCount; j++) {
                let iconItem = new IconItem();
                iconItem.setUsuallyIcon(rewardList.GetItem(j).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
                iconItem.updateById(cfg.m_stItemList[j].m_iID, cfg.m_stItemList[j].m_iCount);
                iconItem.updateIcon();
            }
        }
    }

    protected initListeners() {
        //this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addListClickListener(this.list, this.onClickList);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_MULTI_RANK));
        this.onRankDataChanged();
    }

    protected onClose() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }


    private onClickBtnClose() {
        this.close();
    }

    private onClickList(index: number) {
        this.updateRoleAvatar(index);
    }

    private updateRoleAvatar(index: number) {
        let rankData = G.DataMgr.kf3v3Data.rankData;
        if (null == rankData || index >= rankData.m_ucNumber) {
            return;
        }

        let info = rankData.m_astList[index];
        if (null == this.roleAvatar) {
            let root = this.roleRoot.transform;
            this.roleAvatar = new UIRoleAvatar(root, root);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.hasWing = true;
        }
        this.roleAvatar.setAvataByList(info.m_stAvatarList, info.m_cProf, info.m_ucGender);
    }

    onRankDataChanged() {
        let rankData = G.DataMgr.kf3v3Data.rankData;
        let len = 0;
        if (null != rankData) {
            len = rankData.m_ucNumber;
        }

        let oldItemCnt = this.items.length;

        let myRankData: Protocol.CliCross3V3PVPOneRank;
        let myRank = -1;
        let displayCnt = len;
        if (displayCnt < this.MinDisplayCount) {
            displayCnt = this.MinDisplayCount;
        }
        this.list.Count = displayCnt;
        for (let i = 0; i < displayCnt; i++) {
            let item: KuaFu3v3RankItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new KuaFu3v3RankItem());
                item.setComponents(this.list.GetItem(i).gameObject, false, true);
            }

            if (i < len) {
                let itemData = rankData.m_astList[i];
                item.update(i + 1, itemData, false);

                if (null == myRankData && CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, itemData.m_stRoleId)) {
                    myRankData = itemData;
                    myRank = i + 1;
                }
            } else {
                // 只是显示一个空行，这样好看点
                item.update(i + 1, null, false);
            }
        }

        if (null == myRankData) {
            this.myItem.update(0, null, true);
        } else {
            this.myItem.update(myRank, myRankData, false);
        }

        if (len > 0) {
            this.list.canSelect = true;
            this.list.Selected = 0;
            this.updateRoleAvatar(0);
        } else {
            this.list.canSelect = false;
            if (null != this.roleAvatar) {
                this.roleAvatar.setActive(false);
            }
        }
    }
}