import { Global as G } from 'System/global'
import { KfjdcData } from 'System/data/KfjdcData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { BwdhSupportView } from 'System/kfjdc/view/BwdhSupportView'
import { EnumDurationType } from 'System/constants/GameEnum'

export abstract class BwdhRoleItem extends ListItemCtrl {

    protected textName: UnityEngine.UI.Text;
    protected flag: UnityEngine.UI.Image;
    protected textPopularity: UnityEngine.UI.Text;
    protected btnSupport: UnityEngine.GameObject;
    protected labelBtnSupport: UnityEngine.UI.Text;
    protected btnGetReward: UnityEngine.GameObject;
    protected labelBtnGetReward: UnityEngine.UI.Text;
    protected id = 0;
    protected bigStatus = false;
    protected gameId = 0;

    constructor(id: number, bigStatus: boolean) {
        super();
        this.id = id;
        this.bigStatus = bigStatus;
    }

    setComponents(go: UnityEngine.GameObject, ...args) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.btnSupport = ElemFinder.findObject(go, 'btnSupport');
        this.labelBtnSupport = ElemFinder.findText(this.btnSupport, 'Text');
        this.btnGetReward = ElemFinder.findObject(go, 'btnGetReward');
        this.labelBtnGetReward = ElemFinder.findText(this.btnGetReward, 'Text');

        Game.UIClickListener.Get(this.btnSupport).onClick = delegate(this, this.onClickBtnSupport);
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickBtnGetReward);
    }
    update(gameId: number, isCrtProgress: boolean, durationType: EnumDurationType, someoneNone: boolean, resultComeout: boolean, roleInfo: Protocol.CliSimSingleOneRank, betInfo: Protocol.CSKFJDCBetInfo, betOnThis: boolean, status: number, betMoney: number, poolBaseMoney: number, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        this.gameId = gameId;
        let showStatus = status;
        if (null == roleInfo || roleInfo.m_stRoleId.m_uiUin == 0) {
            // 轮空
            showStatus = 4; // 轮空
            this.textName.gameObject.SetActive(false);
            this.textPopularity.gameObject.SetActive(false);
            this.btnSupport.SetActive(false);
            this.btnGetReward.SetActive(false);
        } else {
            this.textName.gameObject.SetActive(true);
            this.textPopularity.gameObject.SetActive(true);
            this.btnSupport.SetActive(true);
            this.btnGetReward.SetActive(true);
            this.textName.text = roleInfo.m_szNickName;
            this.textPopularity.text = uts.format('人气指数：{0}', Math.floor((betMoney + poolBaseMoney) / 100).toString());
        }

        if (status > 0) {
            this.flag.sprite = statusAltas.Get(this.bigStatus ? showStatus + 'c' : showStatus.toString());
            this.flag.gameObject.SetActive(true);
        } else {
            this.flag.gameObject.SetActive(false);
        }
        //uts.log(betInfo+' 支持信息 ');
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
            //uts.log(isCrtProgress + ' isCrtProgress ' + durationType + ' durationType ' + resultComeout +' resultComeout ');
            this.btnSupport.SetActive(true);
            this.btnGetReward.SetActive(false);
            if ((isCrtProgress && (EnumDurationType.Before == durationType || !resultComeout)) || gameId == 0) {
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