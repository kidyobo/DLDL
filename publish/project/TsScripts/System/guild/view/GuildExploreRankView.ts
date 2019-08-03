import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumRewardState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { CompareUtil } from 'System/utils/CompareUtil'

class GuildExploreRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textGx: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textGx = ElemFinder.findText(go, 'textGx');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, info: Protocol.ContributionRank, showNone: boolean) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szNickName;
            this.textGx.text = info.m_uiContribution.toString();

            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
            this.textGx.gameObject.SetActive(true);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(false);
            }
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textGx.gameObject.SetActive(false);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(showNone);
            }
        }

        if (null != this.bg2) {
            this.bg2.SetActive(rank % 2 == 0);
        }
    }
}

export class GuildExploreRankView extends CommonForm {

    private readonly MinDisplayCount = 9;

    private btnClose: UnityEngine.GameObject;

    /**排名列表*/
    private list: List;
    private items: GuildExploreRankItem[] = [];
    private myItem: GuildExploreRankItem;

    accRewardIcon: IconItem;
    no1RewardIcon: IconItem;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.GuildExploreRankView;
    }
    protected initElements(): void {
        this.list = this.elems.getUIList('list');
        this.myItem = new GuildExploreRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.accRewardIcon = new IconItem();
        this.accRewardIcon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('accReward'));
        this.accRewardIcon.setTipFrom(TipFrom.normal);
        this.no1RewardIcon = new IconItem();
        this.no1RewardIcon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('no1Reward'));
        this.no1RewardIcon.setTipFrom(TipFrom.normal);

        this.btnClose = this.elems.getElement('btnClose');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
    }

    protected onOpen() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        let len = 0;
        if (null != exploreInfo) {
            len = exploreInfo.m_stCommonData.m_uiRankNumber;
        }

        let oldItemCnt = this.items.length;

        let myRankData: Protocol.ContributionRank;
        let myRank = -1;
        let displayCnt = len;
        if (displayCnt < this.MinDisplayCount) {
            displayCnt = this.MinDisplayCount;
        }
        this.list.Count = displayCnt;
        for (let i = 0; i < displayCnt; i++) {
            let item: GuildExploreRankItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildExploreRankItem());
                item.setComponents(this.list.GetItem(i).gameObject, false, true);
            }

            if (i < len) {
                let itemData = exploreInfo.m_stCommonData.m_astContributionRank[i];
                item.update(i + 1, itemData, false);

                if (null == myRankData && CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, itemData.m_stRoleID)) {
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

        let cfg = guildData.getExploreProgressCfg(exploreInfo.m_stCommonData.m_ucDifficulty);

        let b = cfg.m_astBonus[0];
        this.accRewardIcon.updateById(b.m_uiType, b.m_uiCount);
        this.accRewardIcon.updateIcon();

        this.no1RewardIcon.updateById(cfg.m_uiSBonusType, cfg.m_uiSBonusNum);
        this.no1RewardIcon.updateIcon();
    }

    protected onClose() {
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnClose() {
        this.close();
    }
}
