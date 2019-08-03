import { Global as G } from 'System/global'
import { KfjdcData } from 'System/data/KfjdcData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { BwdhRoleItem } from 'System/kfjdc/view/BwdhRoleItem'
import { EnumDurationType } from 'System/constants/GameEnum'

export abstract class BwdhVsItem extends ListItemCtrl {

    protected left: BwdhRoleItem;
    protected right: BwdhRoleItem;
    protected btnGo: UnityEngine.GameObject;
    protected labelBtnGo: UnityEngine.UI.Text;

    protected info: Protocol.CSKFJDCFinalGame;

    update(idx: number, info: Protocol.CSKFJDCFinalGame, betInfo: Protocol.CSKFJDCBetInfo, progress: number, crtProgress: number, startTime: number, endTime: number, isActivityOpen: boolean, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        this.info = info;

        if (info) {
            let leftRole = info.m_stLeftRole;
            let rightRole = info.m_stRightRole;
            let someoneNone = leftRole.m_stRoleId.m_uiUin == 0 || rightRole.m_stRoleId.m_uiUin == 0;
            let resultComeout = info.m_ucLeftStatus != Macros.KFJDC_FINAL_PLAYER_NONE || info.m_ucRightStatus != Macros.KFJDC_FINAL_PLAYER_NONE;
            let myUin = G.DataMgr.heroData.roleID.m_uiUin;
            let isMePlayer = leftRole.m_stRoleId.m_uiUin == myUin || rightRole.m_stRoleId.m_uiUin == myUin;

            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            //uts.log(progress + ' progress ' + crtProgress +' crtProgress');
            let isCrtProgress = progress == crtProgress;
            let btnGoEnabled = isActivityOpen && !someoneNone && !resultComeout;
            let showBtnGo = isMePlayer;

            let durationType = EnumDurationType.Before;
            if (!isCrtProgress) {
                if (now > endTime) {
                    this.labelBtnGo.text = '比赛结束';
                    durationType = EnumDurationType.After;
                }
                else {
                    this.labelBtnGo.text = '即将开始';
                }

                btnGoEnabled = false;
            }
            else {
                if (now < startTime) {
                    this.labelBtnGo.text = '即将开始';
                    btnGoEnabled = false;
                }
                else if (now >= startTime && now < endTime) {
                    if (isMePlayer) {
                        this.labelBtnGo.text = '参与比赛';
                    }
                    else {
                        this.labelBtnGo.text = '进入观战';
                    }
                    durationType = EnumDurationType.InDuration;
                }
                else if (now > endTime) {
                    this.labelBtnGo.text = '比赛结束';
                    btnGoEnabled = false;
                    durationType = EnumDurationType.After;
                }
            }

            UIUtils.setButtonClickAble(this.btnGo, btnGoEnabled);

            let betOnLeft = false;
            let betOnRight = false;
            if (betInfo != null) {
                betOnLeft = betInfo.m_bLeft > 0;
                betOnRight = !betOnLeft;
            }
            let cfg = G.DataMgr.kfjdcData.getFinalCfg(progress);

            this.left.update(info.m_iGameID, isCrtProgress, durationType, someoneNone, resultComeout, leftRole, betInfo, betOnLeft, info.m_ucLeftStatus, info.m_llLeftMoney, cfg.m_iPoolBaseRewardNum, headAltas, statusAltas, sortingOrder);
            this.right.update(info.m_iGameID, isCrtProgress, durationType, someoneNone, resultComeout, rightRole, betInfo, betOnRight, info.m_ucRightStatus, info.m_llRightMoney, cfg.m_iPoolBaseRewardNum, headAltas, statusAltas, sortingOrder);
        } else {
            this.labelBtnGo.text = '名单未出';
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.left.update(0, false, EnumDurationType.Before, true, false, null, betInfo, false, 0, 0, 0, headAltas, statusAltas, sortingOrder);
            this.right.update(0, false, EnumDurationType.Before, true, false, null, betInfo, false, 0, 0, 0, headAltas, statusAltas, sortingOrder);
        }
    }

    protected onClickBtnGo() {
        let myUin = G.DataMgr.heroData.roleID.m_uiUin;
        let leftRole = this.info.m_stLeftRole;
        let rightRole = this.info.m_stRightRole;
        G.DataMgr.kfjdcData.watchMode = leftRole.m_stRoleId.m_uiUin != myUin && rightRole.m_stRoleId.m_uiUin != myUin;
        G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_PVP_FINAL, this.info.m_iGameID);
    }
}