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
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { MathUtil } from "System/utils/MathUtil"
import { EnumDurationType, FuncBtnState } from "System/constants/GameEnum";

export class CeremonyBoxRewardItem extends ListItemCtrl {
    private medalImg: UnityEngine.UI.Image;
    private rankText: UnityEngine.UI.Text;
    private rewardIcons: IconItem[] = [];
    protected iconItems: IconItem[] = [];
    private rewardList: List;

    setComponents(go: UnityEngine.GameObject, iconTemplate: UnityEngine.GameObject, count: number) {
        this.medalImg = ElemFinder.findImage(go, 'medalImg');
        this.rankText = ElemFinder.findText(go, 'rankText');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.rewardList.Count = count;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i);
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setTipFrom(TipFrom.normal);
                this.iconItems[i].setUsuallyIcon(item.gameObject);
            }
        }

    }

    update(config: Protocol.SDBXRankConfig_Server, medalAltas: Game.UGUIAltas) {
        // 勋章样式
        this.medalImg.sprite = medalAltas.Get(Math.min(6, config.m_iID).toString());

        // 名次
        this.rankText.text = CeremonyBoxRewardItem.getRankStr(config.m_iCondition1, config.m_iCondition2);

        let rewardList = config.m_stRewordList;
        for (let i: number = 0; i < config.m_iRewardCount; i++) {
            this.iconItems[i].updateById(rewardList[i].m_iID, rewardList[i].m_iCount);
            this.iconItems[i].updateIcon();
        }
    }
    static getRankStr(min: number, max: number): string {
        let rankStr;
        if (min >= max) {
            rankStr = uts.format('第{0}名', min);
        } else if (min >= 50) {
            rankStr = '未上榜';
        } else {
            rankStr = uts.format('第{0}~{1}名', min, max);
        }
        return rankStr;
    }

}

/**神力榜排行奖励对话框。*/
export class CeremonyBoxRewardView extends CommonForm {

    static readonly MAX_REWARD_CNT: number = 2;
    static readonly BTN_COUNT: number = 2;

    private btnClose: UnityEngine.GameObject;

    /**领取排名奖励按钮*/
    private btnGetReward1: UnityEngine.GameObject;
    private labelGetReward1: UnityEngine.UI.Text;
    /**领取参与奖励按钮*/
    private btnGetReward2: UnityEngine.GameObject;
    private labelGetReward2: UnityEngine.UI.Text;

    private itemIcon_Normal: UnityEngine.GameObject;

    /**勋章图集*/
    private medalAltas: Game.UGUIAltas;

    /**奖励预览列表*/
    private previewList: List;

    /**我的排名*/
    private myRankText: UnityEngine.UI.Text;
    /**我的购买数量*/
    private myBuyCount: UnityEngine.UI.Text;

    /**倒计时文本*/
    private countDownText: UnityEngine.UI.Text;

    /**固定奖励数据*/
    private myRewardIconItems: IconItem[] = [];

    /**我的固定排名奖励数据*/
    private myRewardListData: RewardIconItemData[] = [];
    private ceremonyBoxRewardItems: CeremonyBoxRewardItem[] = [];

    /**剩余领奖时间*/
    private m_leftTime: number = 0;
    /**是否在可领奖励时间内*/
    private canGet: boolean = false;
    /**是否有奖励可领*/
    hasGet: boolean = false;
    private isActivityOpen = false;
    private oldId = -1;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.CeremonyBoxRewardView;
    }


    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');
        this.medalAltas = this.elems.getElement('medalAltas').transform.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.myRankText = this.elems.getText('myRankText');
        this.myBuyCount = this.elems.getText('myBuyCount');

        this.countDownText = this.elems.getText('countDownText');
        this.previewList = this.elems.getUIList('list');

        this.btnGetReward1 = this.elems.getElement('btnGetReward1');
        this.labelGetReward1 = this.elems.getText('labelGetReward1');

        this.btnGetReward2 = this.elems.getElement('btnGetReward2');
        this.labelGetReward2 = this.elems.getText('labelGetReward2');
        this.labelGetReward1.text = '未结算';
        UIUtils.setButtonClickAble(this.btnGetReward1, false);
        UIUtils.setButtonClickAble(this.btnGetReward2, false);
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
    }

    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement('mask'), this.onClickReturnBtn);
        this.addClickListener(this.btnGetReward1, this.onClickBtnGetReward1);
        this.addClickListener(this.btnGetReward2, this.onClickBtnGetReward2);

    }

    protected onOpen() {
        this.isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_SDBX);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_OPEN_PANEL));

        this.addTimer("1", 1000, 0, this.onTimer);
        this.updataPanel();

    }

    updataPanel() {
        let info = G.DataMgr.activityData.sdbxPanelInfo;
        if (info != null) {

            //此处减一是因为第一个配置是参与奖励，不显示在列表里
            this.previewList.Count = info.m_ucCount - 1;
            for (let i: number = 0; i < info.m_ucCount; i++) {
                if (i == 0) {
                    continue;
                }
                let data = info.m_stSDBXCfgList[i];
                let item = this.previewList.GetItem(i - 1);
                let reward = new CeremonyBoxRewardItem();
                if (this.ceremonyBoxRewardItems[i - 1] == null) {
                    this.ceremonyBoxRewardItems[i - 1] = new CeremonyBoxRewardItem();
                    this.ceremonyBoxRewardItems[i - 1].setComponents(item.gameObject, this.itemIcon_Normal, data.m_iRewardCount);
                }
                this.ceremonyBoxRewardItems[i - 1].update(info.m_stSDBXCfgList[i], this.medalAltas);
            }

            //参与奖励配置
            let data = info.m_stSDBXCfgList[0];
            for (let i: number = 0; i < data.m_iRewardCount; i++) {
                let iconGo = this.elems.getElement('reward' + i);
                let iconItem = new IconItem();
                if (this.myRewardIconItems[i] == null) {
                    iconItem.setUsualIconByPrefab(this.itemIcon_Normal, iconGo);
                    iconItem.setTipFrom(TipFrom.normal);
                    this.myRewardIconItems.push(iconItem);
                }

                this.myRewardIconItems[i].updateById(data.m_stRewordList[i].m_iID, data.m_stRewordList[i].m_iCount);
                this.myRewardIconItems[i].updateIcon();
            }
        }
        this.updateByRewardResponse(info);

    }

    protected onTimer() {
        let activityData = G.DataMgr.activityData;
        let oldActivityOpen = this.isActivityOpen;
        this.isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_SDBX);
        if (this.isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SDBX);
            let now = G.SyncTime.getCurrentTime();
            //结算时间
            let endtime = Math.max(0, status.m_iEndTime - 86400);
            this.canGet = Math.max(now / 1000) < endtime ? false : true;
            let time = Math.max(0, status.m_iEndTime - Math.max(now / 1000));
            if (this.canGet) {
                this.countDownText.text = TextFieldUtil.getColorText('剩余领奖时间：', '98fe5d') + DataFormatter.second2day(time);

            } else {
                this.countDownText.text = '';
            }
            let info = G.DataMgr.activityData.sdbxPanelInfo;

            if (info != null) {
                this.updateByRewardResponse(info);
            }
        }
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    updateByRewardResponse(response: Protocol.SDBXActPanelRsp): void {
        if (response != null) {
            //更新按键显示
            if (response.m_stSDBXCfgList != null) {
                let cfgs = response.m_stSDBXCfgList;
                let myRank = response.m_uiRank;
                for (let i = 0; i < response.m_ucCount; i++) {

                    if (cfgs[i].m_iID == 1) {
                        this.ishasGet(1, response);
                    } if (cfgs[i].m_iID > 1) {
                        //找到自己的奖励段位后，无需再继续判断其它段位
                        let id = this.getRank(myRank, response.m_stSDBXCfgList[i], cfgs[i].m_iID);
                        if (this.oldId < id) {
                            this.oldId = id;
                        }
                    }
                }
                this.ishasGet(this.oldId, response);

            }
            let myRankStr: string;
            if (response.m_uiRank <= 50 && response.m_uiRank >= 1) {
                myRankStr = TextFieldUtil.getColorText(uts.format('第{0}名', response.m_uiRank), Color.GREEN);
            } else {
                myRankStr = TextFieldUtil.getColorText('未上榜', Color.WHITE);
            }

            //奖励排名刷新
            this.myRankText.text = uts.format('{0}', TextFieldUtil.getColorText(myRankStr, Color.WHITE));
            this.myBuyCount.text = TextFieldUtil.getColorText(uts.format('{0}', response.m_uiBuyTimes), Color.WHITE);

        }
    }

    /**判断按键状态*/
    private ishasGet(id: number, response: Protocol.SDBXActPanelRsp): void {
        this.hasGet = MathUtil.checkPosIsReach(id - 1, response.m_uiBitFlag);
        if (this.canGet == true) {
            if (this.hasGet) {
                UIUtils.setButtonClickAble(this.btnGetReward1, false);
                this.labelGetReward1.text = '已领取';
            } else {
                if (response.m_uiRank <= response.m_stSDBXCfgList[response.m_stSDBXCfgList.length - 1].m_iCondition2 && response.m_uiRank > 0) {
                    UIUtils.setButtonClickAble(this.btnGetReward1, true);
                    this.labelGetReward1.text = '领取奖励';
                } else {
                    UIUtils.setButtonClickAble(this.btnGetReward1, false);
                    this.labelGetReward1.text = '未达成';
                }
            }
        }
        if (id == 1) {
            if (this.hasGet) {
                UIUtils.setButtonClickAble(this.btnGetReward2, false);
                this.labelGetReward2.text = '已领取';
            } else {
                if (response.m_uiBuyTimes>=50) {
                    UIUtils.setButtonClickAble(this.btnGetReward2, true);
                    this.labelGetReward2.text = '领取奖励';
                } else {
                    UIUtils.setButtonClickAble(this.btnGetReward2, false);
                    this.labelGetReward2.text = '未达成';
                }
            }
        }
    }



    //领取排行奖励
    private onClickBtnGetReward1(): void {

        if (this.oldId != -1) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_GET_REWARD, this.oldId));
        }
    }

    //领取参与奖励，参与奖励id是1
    private onClickBtnGetReward2(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_GET_REWARD, 1));
    }
    //判断自己在哪个奖励段，有排行返回奖励id，没有返回-1
    private getRank(myRank: number, cfg: Protocol.SDBXRankConfig_Server, id: number): number {
        if (myRank >= cfg.m_iCondition1 && myRank <= cfg.m_iCondition2) {
            return id;
        }
        return -1;
    }


    protected onClose() {
    }

    private onClickReturnBtn() {
        this.close();
    }

}

