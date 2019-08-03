import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KfjdcData } from 'System/data/KfjdcData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GroupList } from 'System/uilib/GroupList'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { BwdhSupportView } from 'System/kfjdc/view/BwdhSupportView'
import { BwdhRoleItem } from 'System/kfjdc/view/BwdhRoleItem'
import { BwdhVsItem } from 'System/kfjdc/view/BwdhVsItem'
import { EnumDurationType } from 'System/constants/GameEnum'

class BwdhCompetitionRoleItem extends BwdhRoleItem {

    private head: UnityEngine.UI.Image;

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.head = ElemFinder.findImage(go, 'head');
        this.flag = ElemFinder.findImage(this.head.gameObject, 'flag');
        this.textPopularity = ElemFinder.findText(go, 'textPopularity');
    }

    update(gameId: number, isCrtProgress: boolean, durationType: EnumDurationType, someoneNone: boolean, resultComeout: boolean, roleInfo: Protocol.CliSimSingleOneRank, betInfo: Protocol.CSKFJDCBetInfo, betOnThis: boolean, status: number, betMoney: number, poolBaseMoney: number, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        super.update(gameId, isCrtProgress, durationType, someoneNone, resultComeout, roleInfo, betInfo, betOnThis, status, betMoney, poolBaseMoney, headAltas, statusAltas, sortingOrder);
        if (null == roleInfo || roleInfo.m_stRoleId.m_uiUin == 0) {
            // 轮空
            this.head.enabled = false;
        } else {
            this.head.enabled = true;
            this.head.sprite = headAltas.Get(roleInfo.m_ucProf + '_' + roleInfo.m_ucGender);
        }
    }
}

class BwdhCompetitionItem extends BwdhVsItem {

    private leftRole = new BwdhCompetitionRoleItem(1, false);
    private rightRole = new BwdhCompetitionRoleItem(0, false);
    private bg2: UnityEngine.GameObject;
    private selected: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.left = this.leftRole;
        this.right = this.rightRole;
        this.leftRole.setComponents(ElemFinder.findObject(go, 'left'));
        this.rightRole.setComponents(ElemFinder.findObject(go, 'right'));
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.selected = ElemFinder.findObject(go, 'selected');

        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.labelBtnGo = ElemFinder.findText(this.btnGo, 'Text');

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    update(idx: number, info: Protocol.CSKFJDCFinalGame, betInfo: Protocol.CSKFJDCBetInfo, progress: number, crtProgress: number, startTime: number, endTime: number, isActivityOpen: boolean, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        super.update(idx, info, betInfo, progress, crtProgress, startTime, endTime, isActivityOpen, headAltas, statusAltas, sortingOrder);
        let myUIN = G.DataMgr.heroData.roleID.m_uiUin;
        // 如果有我，就高亮
        this.selected.SetActive(info && (((info.m_stLeftRole.m_stRoleId.m_uiUin == myUIN || info.m_stRightRole.m_stRoleId.m_uiUin == myUIN)) ||
            (betInfo && betInfo.m_bWinStatus == 1 && betInfo.m_bGet == 0)));
        this.bg2.SetActive(idx % 2 == 1);
    }
}
class BwdhCompetitionGroupItem extends ListItemCtrl {

    private textTitle: UnityEngine.UI.Text;
    private tipMark: UnityEngine.GameObject;
    private items: BwdhCompetitionItem[] = [];

    setComponents(go: UnityEngine.GameObject) {
        this.textTitle = ElemFinder.findText(go, 'catalog/textTitle');
        this.tipMark = ElemFinder.findObject(go, 'catalog/tipMark');
    }

    update(progress: number, list: List, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        let gameData = finalData.m_stGameInfo;
        finalData.m_stBetInfo;

        let isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_FINAL);
        let headAltas = G.AltasManager.roleHeadAltas;

        let roleID = G.DataMgr.heroData.roleID.m_uiUin;

        let betNum = 0;
        let progressSeq = KfjdcData.ProgressSeq.indexOf(progress);

        let stateStr: string;
        let week = G.SyncTime.serverDate.getDay();
        if (week >= 1 && week <= 4) {
            stateStr = "已结束";
        } else if (week == 5) {
            if (progress < KeyWord.KFJDC_FINAL_PROGRESS_4TO2) {
                stateStr = '周六开启';
            } else {
                stateStr = '周日开启';
            }
        } else if (week == 6) {
            // 周六
            if (progress < KeyWord.KFJDC_FINAL_PROGRESS_4TO2) {
                if (progress < gameData.m_iProgress || gameData.m_iProgress == 0) {
                    stateStr = '已结束';
                } else {
                    stateStr = KfjdcData.ProgressTime[progressSeq];
                }
            } else {
                stateStr = '周日开启';
            }
        } else {
            // 周日
            if (progress < KeyWord.KFJDC_FINAL_PROGRESS_4TO2 || progress < gameData.m_iProgress || gameData.m_iProgress == 0) {
                stateStr = '已结束';
            } else {
                stateStr = KfjdcData.ProgressTime[progressSeq - 3];
            }
        }
        this.textTitle.text = KfjdcData.ProgressDesc[progressSeq] + ' - ' + stateStr;

        let start = KfjdcData.ProgressStart[progressSeq];
        let end = KfjdcData.ProgressEnd[progressSeq];

        let itemCnt = end - start;

        list.Count = itemCnt;
        let oldItemCnt = this.items.length;

        for (let i = 0; i < itemCnt; i++) {
            let item: BwdhCompetitionItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new BwdhCompetitionItem());
                item.setComponents(list.GetItem(i).gameObject);
            }

            let info = gameData.m_stGameList[start + i];
            if (info) {
                //uts.log(progress + ' progress ' + gameData.m_iProgress +' gameData.m_iProgress ');
                item.update(i, info, kfjdcData.getBetInfoByGameId(info.m_iGameID), progress, gameData.m_iProgress, gameData.m_uiStartTime, gameData.m_uiEndTime, isActivityOpen, headAltas, statusAltas, sortingOrder);
            } else {
                item.update(i, null, null, progress, gameData.m_iProgress, gameData.m_uiStartTime, gameData.m_uiEndTime, isActivityOpen, headAltas, statusAltas, sortingOrder);
            }
        }

        let needTipMark = false;
        for (let i = 0; i < itemCnt; i++) {
            let info = gameData.m_stGameList[start + i];
            if (info) {
                let betInfo = kfjdcData.getBetInfoByGameId(info.m_iGameID);
                if (betInfo && betInfo.m_bGet == 0 && betInfo.m_bWinStatus == 1) {
                    needTipMark = true;
                    break;
                }
            }
        }
        this.tipMark.SetActive(needTipMark);
    }
}
export abstract class BwdhCompetitionPage extends BwdhBasePage {

    protected groupList: GroupList;
    protected items: BwdhCompetitionGroupItem[] = [];

    protected statusAltas: Game.UGUIAltas;

    protected resPath(): string {
        return UIPathData.BwdhCompetitionPage;
    }

    protected initElements() {
        this.groupList = this.elems.getUIGroupList('groupList');
        this.statusAltas = this.elems.getElement('statusAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    protected onOpen() {
        super.onOpen();
        if (this.groupList != null) {
            this.groupList.Selected = this.groupList.Count - 1;
        }
    }
    onActDataChange(activityID: number) {
    }

    protected updateList(allProgress: number[]) {
        let progressCnt = allProgress.length;
        let oldGroupItemCnt = this.items.length;
        this.groupList.Count = progressCnt;
        for (let i = 0; i < progressCnt; i++) {
            let item: BwdhCompetitionGroupItem;
            if (i < oldGroupItemCnt) {
                item = this.items[i];
            } else {
                this.items[i] = item = new BwdhCompetitionGroupItem();
                item.setComponents(this.groupList.GetItem(i).gameObject);
            }
            item.update(allProgress[i], this.groupList.GetSubList(i), this.statusAltas, this.sortingOrder);
        }
    }
}