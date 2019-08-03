import { Global as G } from 'System/global'
import { KfjdcData } from 'System/data/KfjdcData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { BwdhSupportView } from 'System/kfjdc/view/BwdhSupportView'

export class BwdhRoleItem extends ListItemCtrl {

    private textName: UnityEngine.UI.Text;
    private flag: UnityEngine.UI.Image;
    private textPopular: UnityEngine.UI.Text;
    private btnSupport: UnityEngine.GameObject;
    private labelBtnSupport: UnityEngine.UI.Text;
    private btnGetReward: UnityEngine.GameObject;
    private labelBtnGetReward: UnityEngine.UI.Text;

    private id = 0;
    private gameId = 0;

    constructor(id: number) {
        super();
        this.id = id;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.flag = ElemFinder.findImage(go, 'flag');
        this.textPopular = ElemFinder.findText(go, 'textPopular');
        this.btnSupport = ElemFinder.findObject(go, 'btnSupport');
        this.labelBtnSupport = ElemFinder.findText(this.btnSupport, 'Text');
        this.btnGetReward = ElemFinder.findObject(go, 'btnGetReward');
        this.labelBtnGetReward = ElemFinder.findText(this.btnGetReward, 'Text');

        Game.UIClickListener.Get(this.btnSupport).onClick = delegate(this, this.onClickBtnSupport);
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickBtnGetReward);
    }

    update(gameId: number, isCrtProgress: boolean, someoneNone: boolean, someoneWin: boolean, roleInfo: Protocol.CliSimSingleOneRank, betInfo: Protocol.CSKFJDCBetInfo, betOnThis: boolean, status: number, betMoney: number, poolBaseMoney: number, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas) {
        this.gameId = gameId;
        if (null == roleInfo || roleInfo.m_stRoleId.m_uiUin == 0) {
            // 轮空
            this.textName.gameObject.SetActive(false);
            this.textPopular.gameObject.SetActive(false);
            this.btnSupport.SetActive(false);
            this.btnGetReward.SetActive(false);
        } else {
            this.textName.gameObject.SetActive(true);
            this.textPopular.gameObject.SetActive(true);
            this.btnSupport.SetActive(true);
            this.btnGetReward.SetActive(true);
            this.textName.text = name;
            this.textPopular.text = Math.floor((betMoney + poolBaseMoney) / 100).toString();
        }

        this.flag.sprite = statusAltas.Get(status.toString());

        if (betInfo != null) {
            if (betOnThis) {
                if (betInfo.m_bGet > 0) {
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
                        this.labelBtnSupport.text = '比赛结束';
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
            if (isCrtProgress && !someoneWin) {
                UIUtils.setButtonClickAble(this.btnSupport, !someoneNone);
                this.labelBtnSupport.text = '支持';
            } else {
                UIUtils.setButtonClickAble(this.btnSupport, false);
                this.labelBtnSupport.text = '比赛结束';
            }
        }
    }

    private onClickBtnSupport() {
        G.Uimgr.createForm<BwdhSupportView>(BwdhSupportView).open(this.gameId, this.id, null, false);
    }

    private onClickBtnGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_BETGET, 0, this.gameId));
    }
}