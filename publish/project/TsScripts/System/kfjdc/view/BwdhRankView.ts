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
import { BwdhStars } from 'System/kfjdc/view/BwdhStars'
import { KfjdcData } from 'System/data/KfjdcData'
import { UIUtils } from 'System/utils/UIUtils'
import { EnumEffectRule } from 'System/constants/GameEnum'

class BwdhRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textZdl: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private stars = new BwdhStars();
    private textCredit: UnityEngine.UI.Text;
    private icon = new IconItem();

    private bg2: UnityEngine.GameObject;

    private selected: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean, itemIcon_Normal: UnityEngine.GameObject) {
        this.gameObject = go;
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textZdl = ElemFinder.findText(go, 'textZdl');
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.stars.setComponents(ElemFinder.findObject(go, 'stars5'), ElemFinder.findObject(go, 'stars4'), ElemFinder.findObject(go, 'stars3'), null, null, null, null, null);
        this.textCredit = ElemFinder.findText(go, 'textCredit');
        this.icon.setTipFrom(TipFrom.normal);
        this.icon.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(go, 'icon'));
        this.selected = ElemFinder.findObject(go, 'selected');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, info: Protocol.CliCrossPVPOneRank, showNone: boolean, showSelected: boolean) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szNickName;
            this.textZdl.text = info.m_uiFight.toString();
            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
            this.textZdl.gameObject.SetActive(true);
            this.textStage.gameObject.SetActive(true);

            this.textStage.text = KfjdcData.RANK_DESC_LIST[info.m_uiGrade - 1];
            if (info.m_uiGrade < KfjdcData.RANK_DESC_LIST.length) {
                this.stars.setScore(info.m_uiScore, info.m_uiScore, KfjdcData.STAR_COUNT[info.m_uiGrade - 1]);
                this.textCredit.gameObject.SetActive(false);
            } else {
                this.stars.setScore(0, 0, 0);
                this.textCredit.text = info.m_uiScore.toString();
                this.textCredit.gameObject.SetActive(true);
            }

            let cfg = G.DataMgr.kfjdcData.getCfg(KeyWord.KFJDC_REWARD_GRADE, info.m_uiGrade);
            this.icon.updateById(cfg.m_stGiftList[0].m_iID, cfg.m_stGiftList[0].m_iCount);
            this.icon.updateIcon();
            this.icon.gameObject.SetActive(true);

            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(false);
            }
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textZdl.gameObject.SetActive(false);
            this.textStage.gameObject.SetActive(false);
            this.textCredit.gameObject.SetActive(false);
            this.stars.setScore(0, 0, 0);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(showNone);
            }
            this.icon.gameObject.SetActive(false);
        }

        if (null != this.bg2) {
            this.bg2.SetActive(rank % 2 == 0);
        }

        if (this.selected) {
            this.selected.SetActive(showSelected);
        }
    }
}

export class BwdhRankView extends CommonForm {
    private readonly MinDisplayCount = 4;
    private readonly AutoExitSeconds = 30;
    private readonly TickKey = '1';

    private rewardIcon = new IconItem();
    private btnGetReward: UnityEngine.GameObject;
    private labelBtnGetReward: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private list: List;
    private myItem: BwdhRankItem;
    private myPos = 0;

    private itemIcon_Normal: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.BwdhRankView;
    }

    protected initElements() {
        this.btnGetReward = this.elems.getElement('btnGetReward');
        this.labelBtnGetReward = this.elems.getText('labelBtnGetReward');
        this.mask = this.elems.getElement('mask');
        this.btnClose = this.elems.getElement('btnClose');

        this.list = this.elems.getUIList('list');
        this.list.onVirtualItemChange = delegate(this, this.onListItemChange);
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.myItem = new BwdhRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false, this.itemIcon_Normal);

        this.rewardIcon.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('rewardIcon'));
        this.rewardIcon.setTipFrom(TipFrom.normal);
    }

    protected initListeners() {
        this.addClickListener(this.btnGetReward, this.onClickBtnGetReward);
        this.addClickListener(this.btnClose, this.close);
        this.addClickListener(this.mask, this.close);
    }

    protected onOpen() {
        this.list.SetSlideAppearRefresh();
        this.onRankChange();
        //uts.log('  排行榜面板');
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_RANK));
    }

    protected onClose() {
    }

    private onClickBtnGetReward() {
        if (G.DataMgr.thingData.isBagEnough(true, 1)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_REWARD));
        }
    }

    onRankChange() {
        let kfjdcData = G.DataMgr.kfjdcData;
        let uiData = kfjdcData.uiData;
        let rankData = kfjdcData.rankData;
        if (null == rankData) {
            return;
        }

        let myRoleID = G.DataMgr.heroData.roleID;
        let self: Protocol.CliCrossPVPOneRank;
        this.myPos = 0;

        let len = rankData.m_ucNumber;

        let displayCnt = len;
        if (displayCnt < this.MinDisplayCount) {
            displayCnt = this.MinDisplayCount;
        }
        this.list.Count = displayCnt;
        this.list.Refresh();
        for (let i = 0; i < displayCnt; i++) {
            if (i < len) {
                let itemData = rankData.m_astList[i];
                if (!self && CompareUtil.isRoleIDEqual(myRoleID, itemData.m_stRoleId)) {
                    self = itemData;
                    this.myPos = i + 1;
                }
            }
        }

        if (null == self) {
            this.myItem.update(0, null, true, false);
        } else {
            this.myItem.update(this.myPos, self, false, true);
        }

        if (uiData.m_uiRewardGrade > 0) {
            let cfg = G.DataMgr.kfjdcData.getCfg(KeyWord.KFJDC_REWARD_GRADE, uiData.m_uiRewardGrade);
            this.rewardIcon.effectRule = 0 == uiData.m_bRewardGet ? EnumEffectRule.normal : EnumEffectRule.none;
            this.rewardIcon.updateById(cfg.m_stGiftList[0].m_iID, cfg.m_stGiftList[0].m_iCount);
            this.rewardIcon.updateIcon();
            this.rewardIcon.gameObject.SetActive(true);
        } else {
            this.rewardIcon.gameObject.SetActive(false);
        }

        UIUtils.setButtonClickAble(this.btnGetReward, uiData.m_uiRewardGrade > 0 && 0 == uiData.m_bRewardGet);
        if (0 == uiData.m_uiRewardGrade) {
            this.labelBtnGetReward.text = '未达成';
        } else {
            if (0 == uiData.m_bRewardGet) {
                this.labelBtnGetReward.text = '领取奖励';
            } else {
                this.labelBtnGetReward.text = '已领取';
            }
        }
    }

    private onListItemChange(listItem: ListItem) {
        let rankData = G.DataMgr.kfjdcData.rankData;

        let item = listItem.data.item as BwdhRankItem;
        let i = listItem.Index;
        if (!item) {
            listItem.data.item = item = new BwdhRankItem();
            item.setComponents(listItem.gameObject, false, true, this.itemIcon_Normal);
        }

        if (i < rankData.m_ucNumber) {
            let itemData = rankData.m_astList[i];
            item.update(i + 1, itemData, false, this.myPos == i + 1);
        } else {
            // 只是显示一个空行，这样好看点
            item.update(i + 1, null, false, false);
        }
    }
}