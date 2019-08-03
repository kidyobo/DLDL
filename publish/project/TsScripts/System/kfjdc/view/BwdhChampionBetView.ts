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
import { BwdhSupportView } from 'System/kfjdc/view/BwdhSupportView'

class BwdhChampionBetItem extends ListItemCtrl {
    private championFlag: UnityEngine.GameObject;
    private textName: UnityEngine.UI.Text;
    private textPopularity: UnityEngine.UI.Text;

    private btnSupport: UnityEngine.GameObject;
    private labelBtnSupport: UnityEngine.UI.Text;
    private btnGetReward: UnityEngine.GameObject;
    private labelBtnGetReward: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;
    private selected: UnityEngine.GameObject;

    private roleID: Protocol.RoleID;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.championFlag = ElemFinder.findObject(go, 'champion');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textPopularity = ElemFinder.findText(go, 'textPopularity');
        this.btnSupport = ElemFinder.findObject(go, 'btnSupport');
        this.labelBtnSupport = ElemFinder.findText(this.btnSupport, 'Text');
        this.btnGetReward = ElemFinder.findObject(go, 'btnGetReward');
        this.labelBtnGetReward = ElemFinder.findText(this.btnGetReward, 'Text');
        this.selected = ElemFinder.findObject(go, 'selected');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        Game.UIClickListener.Get(this.btnSupport).onClick = delegate(this, this.onClickBtnSupport);
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickBtnGetReward);
    }

    update(index: number, info: Protocol.CliSimSingleOneRank, betMoney: number, betOnThis: boolean, isThisWin: boolean) {
        if (null != info) {
            this.roleID = info.m_stRoleId;

            this.championFlag.SetActive(isThisWin);
            this.textName.text = info.m_szNickName;
            this.textPopularity.text = Math.floor((betMoney + 2000) / 100).toString();
            this.textName.gameObject.SetActive(true);
            this.textPopularity.gameObject.SetActive(true);

            let d = G.SyncTime.serverDate.getDay();
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let kfjdcData = G.DataMgr.kfjdcData;
            let betInfo = kfjdcData.m_finalData.m_stWinBetInfo;
            let gameInfo = kfjdcData.m_finalData.m_stGameInfo;

            if (betInfo.m_stBetWinRoleID.m_uiUin > 0) {
                // 已押注了某人
                if (betOnThis) {
                    if (betInfo.m_ucWinBetBit > 0) {
                        this.btnSupport.SetActive(false);
                        this.btnGetReward.SetActive(true);
                        UIUtils.setButtonClickAble(this.btnGetReward, false);
                        this.labelBtnGetReward.text = '已领取';
                    } else {
                        if (betInfo.m_bWinStatus == 0) {
                            this.btnSupport.SetActive(true);
                            this.btnGetReward.SetActive(false);
                            UIUtils.setButtonClickAble(this.btnSupport, false);
                            this.labelBtnSupport.text = '已支持';
                        }
                        else if (betInfo.m_bWinStatus == 1) {
                            this.btnSupport.SetActive(false);
                            this.btnGetReward.SetActive(true);
                            UIUtils.setButtonClickAble(this.btnGetReward, true);
                            this.labelBtnGetReward.text = '领取奖励';
                        }
                        else if (betInfo.m_bWinStatus == 2) {
                            this.btnSupport.SetActive(true);
                            this.btnGetReward.SetActive(false);
                            UIUtils.setButtonClickAble(this.btnSupport, false);
                            this.labelBtnSupport.text = '未押中';
                        }
                        else if (betInfo.m_bWinStatus == 3) {
                            this.btnSupport.SetActive(false);
                            this.btnGetReward.SetActive(true);
                            UIUtils.setButtonClickAble(this.btnGetReward, true);
                            this.labelBtnGetReward.text = '平局返还';
                        }
                    }
                } else {
                    this.btnSupport.SetActive(true);
                    this.btnGetReward.SetActive(false);
                    UIUtils.setButtonClickAble(this.btnSupport, false);
                    this.labelBtnSupport.text = '支持';
                }
            }
            else {
                this.btnSupport.SetActive(true);
                this.btnGetReward.SetActive(false);
                if (d == 6 && KeyWord.KFJDC_FINAL_PROGRESS_32TO16 == gameInfo.m_iProgress && now < gameInfo.m_uiStartTime) {
                    UIUtils.setButtonClickAble(this.btnSupport, true);
                    this.labelBtnSupport.text = '支持';
                } else {
                    UIUtils.setButtonClickAble(this.btnSupport, false);
                    this.labelBtnSupport.text = '已截止';
                }
            }
        } else {
            this.championFlag.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textPopularity.gameObject.SetActive(false);
            this.btnGetReward.SetActive(false);
            this.btnSupport.SetActive(false);
        }

        if (null != this.bg2) {
            this.bg2.SetActive(index % 2 == 0);
        }

        if (this.selected) {
            this.selected.SetActive(betOnThis);
        }
    }

    private onClickBtnSupport() {
        G.Uimgr.createForm<BwdhSupportView>(BwdhSupportView).open(0, 0, this.roleID, true);
    }

    private onClickBtnGetReward() {
        if (G.DataMgr.thingData.isBagEnough(true, 1)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_FINAL_WINBETGET));
        }
    }
}

export class BwdhChampionBetView extends CommonForm {
    private readonly MinDisplayCount = 9;

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private list: List;
    private players: Protocol.CliSimSingleOneRank[] = [];
    private betMoneys: number[] = [];
    private championIdx = -1;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.BwdhChampionBetView;
    }

    protected initElements() {
        this.mask = this.elems.getElement('mask');
        this.btnClose = this.elems.getElement('btnClose');

        this.list = this.elems.getUIList('list');
        this.list.onVirtualItemChange = delegate(this, this.onListItemChange);
    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.close);
        this.addClickListener(this.mask, this.close);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_OPEN));
        this.list.SetSlideAppearRefresh();
        this.onChampionBetChange();
    }

    protected onClose() {
    }

    onChampionBetChange() {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (null == finalData) {
            return;
        }

        this.betMoneys.length = 0;
        this.players.length = 0;
        this.championIdx = -1;
        let gameInfo = kfjdcData.m_finalData.m_stGameInfo;
        let uinMap: { [uin: number]: boolean } = {};

        for (let i = 0; i < gameInfo.m_iGameCount; i++) {
            let g = gameInfo.m_stGameList[i];
            let leftUin = g.m_stLeftRole.m_stRoleId.m_uiUin;
            if (leftUin > 0 && !(leftUin in uinMap)) {
                uinMap[leftUin] = true;
                this.players.push(g.m_stLeftRole);
                this.betMoneys.push(g.m_llLeftWinBet);
                if (i == 31 && g.m_ucLeftStatus == Macros.KFJDC_FINAL_PLAYER_WIN) {
                    this.championIdx = this.players.length;
                }
            }

            let rightUin = g.m_stRightRole.m_stRoleId.m_uiUin;
            if (rightUin > 0 && !(rightUin in uinMap)) {
                uinMap[rightUin] = true;
                this.players.push(g.m_stRightRole);
                this.betMoneys.push(g.m_llRightWinBet);
                if (i == 31 && g.m_ucRightStatus == Macros.KFJDC_FINAL_PLAYER_WIN) {
                    this.championIdx = this.players.length;
                }
            }

            let betInfo = finalData.m_stWinBetInfo;
            let canGetReward = betInfo.m_iBetWinMoney > 0 && betInfo.m_iRewardMoney > 0;

            let myBetIdx = -1;
            let len = this.players.length;
            if (betInfo.m_stBetWinRoleID.m_uiUin > 0) {
                for (let i = 0; i < len; i++) {
                    if (CompareUtil.isRoleIDEqual(betInfo.m_stBetWinRoleID, this.players[i].m_stRoleId)) {
                        myBetIdx = i;
                    }
                }
            }

            let displayCnt = len;
            if (displayCnt < this.MinDisplayCount) {
                displayCnt = this.MinDisplayCount;
            }
            this.list.Count = displayCnt;
            if (myBetIdx > 0) {
                this.list.ScrollByAxialRow(myBetIdx);
            }
            this.list.Refresh();
        }
    }

    private onListItemChange(listItem: ListItem) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let betInfo = kfjdcData.m_finalData.m_stWinBetInfo;
        let gameInfo = kfjdcData.m_finalData.m_stGameInfo;

        let item = listItem.data.item as BwdhChampionBetItem;
        let i = listItem.Index;
        if (!item) {
            listItem.data.item = item = new BwdhChampionBetItem();
            item.setComponents(listItem.gameObject, false, true);
        }

        if (i < this.players.length) {
            let itemData = this.players[i];
            let betOnThis = CompareUtil.isRoleIDEqual(betInfo.m_stBetWinRoleID, itemData.m_stRoleId);
            item.update(i + 1, itemData, this.betMoneys[i], betOnThis, this.championIdx == i);
        } else {
            // 只是显示一个空行，这样好看点
            item.update(i + 1, null, 0, false, false);
        }
    }
}