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
import { SiXiangData } from 'System/data/SiXiangData'

class SxdscRankItem extends ListItemCtrl {
    private textRank: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private textCredit: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.textCredit = ElemFinder.findText(go, 'textCredit');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, info: Protocol.CliColosseumOneRank, showNone: boolean) {
        if (null != info) {
            this.textRank.text = rank.toString();
            this.textName.text = info.m_szNickName;
            let config = G.DataMgr.siXiangData.getGradeCfg(info.m_uiGrade);
            this.textStage.text = config.m_szName;
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

/**斗兽斗兽场排名对话框。*/
export class SxdscRankView extends CommonForm {

    private readonly MinDisplayCount = 4;

    private btnClose: UnityEngine.GameObject;

    /**排名列表*/
    private list: List;
    private items: SxdscRankItem[] = [];
    private myItem: SxdscRankItem;

    /**我的排名*/
    private textRank: UnityEngine.UI.Text;

    /**斗兽币产出*/
    private textSxbOut: UnityEngine.UI.Text;

    /**当前可领*/
    private textCanGet: UnityEngine.UI.Text;

    /**领取排行奖励按钮*/
    private btnGetRank: UnityEngine.GameObject;
    private labelBtnGetRank: UnityEngine.UI.Text;

    // 勋章
    private medalBg: UnityEngine.GameObject;
    private medal: UnityEngine.UI.Image;
    private medalAltas: Game.UGUIAltas;
    private textStage: UnityEngine.UI.Text;

    private slider: UnityEngine.UI.Slider;
    private textSlider: UnityEngine.UI.Text;

    private textStageReward: UnityEngine.UI.Text;
    private btnGetStage: UnityEngine.GameObject;
    private labelBtnGetStage: UnityEngine.UI.Text;

    private textMySxb: UnityEngine.UI.Text;

    constructor() {
        super(0);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkRankRequest());
        this.onSxdscKuaFuChange();
        this.onSxdscActChange();
    }

    protected onClose() {
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.SxdscRankView;
    }
    protected initElements(): void {
        this.list = this.elems.getUIList('list');
        this.myItem = new SxdscRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);

        this.btnClose = this.elems.getElement('btnClose');
        this.textRank = this.elems.getText('textRank');
        this.textCanGet = this.elems.getText('textCanGet');
        this.textSxbOut = this.elems.getText('textSxbOut');

        this.btnGetRank = this.elems.getElement('btnGetRank');
        this.labelBtnGetRank = this.elems.getText('labelBtnGetRank');

        this.medalBg = this.elems.getElement('medalBg');
        this.medal = this.elems.getImage('medal');
        this.medalAltas = this.elems.getElement('medalAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.textStage = this.elems.getText('textStage');

        this.slider = this.elems.getSlider('slider');
        this.textSlider = this.elems.getText('textSlider');

        this.textMySxb = this.elems.getText('textMySxb');

        this.textStageReward = this.elems.getText('textStageReward');
        this.btnGetStage = this.elems.getElement('btnGetStage');
        this.labelBtnGetStage = this.elems.getText('labelBtnGetStage');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
        this.addClickListener(this.btnGetRank, this.onClickBtnGetRank);
        this.addClickListener(this.btnGetStage, this.onClickBtnGetStage);
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnGetRank() {
        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_COLOSSEUM)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkRewardRequest());
        } else {
            G.TipMgr.addMainFloatTip('活动未开启，暂不能领取');
        }
    }

    private onClickBtnGetStage() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_GET_REWARD));
    }

    private onClickBtnClose() {
        this.close();
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    onSxdscKuaFuChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let pkInfo = siXiangData.sxPkInfo;
        if (null == pkInfo) {
            return;
        }

        this.textRank.text = uts.format('我的积分排名：{0}', TextFieldUtil.getColorText((pkInfo.m_uiMyRank > 0) ? pkInfo.m_uiMyRank.toString() : '未上榜', Color.YELLOW));
        let rankConfig = siXiangData.getRankCfg(pkInfo.m_uiMyRank);
        let profit = 0;
        if (null != rankConfig) {
            profit = rankConfig.m_iProfit;
        }
        this.textSxbOut.text = uts.format('斗兽币生产率：{0}', TextFieldUtil.getColorText(uts.format('{0}/10分钟', profit), Color.YELLOW));

        UIUtils.setButtonClickAble(this.btnGetRank, siXiangData.canGetSxb > 0);
        this.updateCanGetSxb();
    }

    onSxdscActChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }

        if (sxActInfo.m_ucGiftStatu) {
            UIUtils.setButtonClickAble(this.btnGetStage, false);
            this.labelBtnGetStage.text = '已领取';
        } else {
            UIUtils.setButtonClickAble(this.btnGetStage, sxActInfo.m_uiPreGrade > 0);
            this.labelBtnGetStage.text = '领取奖励';
        } 

        let config = siXiangData.getGradeCfg(sxActInfo.m_uiGrade);
        let nextCfg = siXiangData.getGradeCfg(sxActInfo.m_uiGrade + 1);
        let max = config.m_iScore;
        if (nextCfg != null) {
            max = nextCfg.m_iScore;
        }
        this.textSlider.text = uts.format('{0}/{1}', sxActInfo.m_uiScore, max);
        this.slider.value = sxActInfo.m_uiScore / max;

        this.textStageReward.text = uts.format('段位每日奖励：{0}', TextFieldUtil.getColorText(uts.format('斗兽币{0}', config.m_stItemList[0].m_iCount), Color.YUANBAO));
        this.medal.sprite = this.medalAltas.Get(Math.ceil(sxActInfo.m_uiGrade / SiXiangData.StageSize).toString());
        this.textStage.text = config.m_szName;

        this.updateCanGetSxb();
    }

    private updateCanGetSxb() {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }
        let config = siXiangData.getGradeCfg(sxActInfo.m_uiGrade);
        this.textCanGet.text = uts.format('当前可领取：{0}', TextFieldUtil.getColorText(uts.format('{0}/{1}', siXiangData.canGetSxb, config.m_iMoneyLimit), Color.YELLOW));
        this.textMySxb.text = G.DataMgr.heroData.siXiangBi.toString();
    }

    onRankChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let rankInfo = siXiangData.sxRankInfo;
        let len = 0;
        if (null != rankInfo) {
            len = rankInfo.m_uiNumber;
        }

        let oldItemCnt = this.items.length;

        let myRankData: Protocol.CliColosseumOneRank;
        let myRank = -1;
        let displayCnt = len;
        if (displayCnt < this.MinDisplayCount) {
            displayCnt = this.MinDisplayCount;
        }
        this.list.Count = displayCnt;
        for (let i = 0; i < displayCnt; i++) {
            let item: SxdscRankItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new SxdscRankItem());
                item.setComponents(this.list.GetItem(i).gameObject, false, true);
            }

            if (i < len) {
                let itemData = rankInfo.m_astList[i];
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
    }
}
