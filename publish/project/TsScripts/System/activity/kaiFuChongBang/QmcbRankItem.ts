import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { QmcbRankItemData } from 'System/activity/kaiFuChongBang/KaiFuChongBangView'
import { Global as G } from "System/global"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { ZhufuData } from 'System/data/ZhufuData'
import { PetData } from 'System/data/pet/PetData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'/**开服冲榜排行List显示*/

export class QmcbRankItem extends ListItemCtrl {

    /**奖励List*/
    private m_rewardList: List;
    /**领取按钮*/
    private m_btnGet: UnityEngine.GameObject;
    /**领取按钮文字*/
    private btnGetText: UnityEngine.UI.Text;
    private paiMingText: UnityEngine.UI.Text;
    private qmcbRankData: QmcbRankItemData;
    private iconItems: IconItem[] = [];
    private max_rewardNum: number = 3;

    setComponents(go: UnityEngine.GameObject) {
        this.m_rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'back/rewardList'));
        this.m_btnGet = ElemFinder.findObject(go, "back/btn_get");
        Game.UIClickListener.Get(this.m_btnGet).onClick = delegate(this, this.onBtnGetClick);
        this.btnGetText = ElemFinder.findText(go, "back/btn_get/Text");
        this.paiMingText = ElemFinder.findText(go, "back/oneBack/paimingText");
        this.m_rewardList.Count = this.max_rewardNum;
        for (let i: number = 0; i < this.max_rewardNum; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.m_rewardList.GetItem(i).gameObject);
            this.iconItems.push(iconItem);
        }
    }

    updateData(data: QmcbRankItemData) {
        this.qmcbRankData = data;
    }


    update() {
        let data = this.qmcbRankData;
        if (data.state == Macros.KF_ACT_STATUS_ARIVE) {
            UIUtils.setButtonClickAble(this.m_btnGet, true);
        }
        else {
            UIUtils.setButtonClickAble(this.m_btnGet, false);
        }
        if (data.state == Macros.KF_ACT_STATUS_REWARD) {
            this.btnGetText.text = '已领取';
        }
        else {
            this.btnGetText.text = '领取奖励';
        }
        if (data.config.m_ucType == KeyWord.KFQMCB_TYPE_PAIHANG1 || data.config.m_ucType == KeyWord.KFQMCB_TYPE_PAIHANG2 || data.config.m_ucType == KeyWord.KFQMCB_TYPE_PAIHANG3) {
            //排行2-5名,6-10名情况
            let condtion = data.config.m_iCondition2 + "-" + data.config.m_iCondition3;
            //let strContent: string = "";
            //if (data.config.m_ucRankType == KeyWord.RANK_TYPE_LEVEL) {
            //    //等级
            //    strContent = "等级排行第" + condtion + "名";
            //}
            //else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_ZQ) {
            //    //坐骑
            //    strContent = "坐骑排行第" + condtion + "名";
            //}
            //else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_WH) {
            //    //神器
            //    strContent = "神器阶级第" + condtion + "名";
            //}
            //else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_FZ) {
            //    //圣印
            //    strContent = "圣印排行第" + condtion + "名";
            //}
            //else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_STRENGTH) {
            //    //强化
            //    strContent = "强化排行第" + condtion + "名";
            //}
            //else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_HONGYAN) {
            //    //伙伴
            //    strContent = "伙伴排行第" + condtion + "名";
            //} else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_DIAMOND) {
            //    //宝石
            //    strContent = "宝石排行第" + condtion + "名";
            //} else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_FAQI) {
            //    //神盾
            //    strContent = "神盾阶级第" + condtion + "名";
            //} else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_LL) {
            //    //真迹
            //    strContent = "真迹阶级第" + condtion + "名";
            //} else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_MAGIC) {
            //    //星环
            //    strContent = "星环阶级第" + condtion + "名";
            //}
            this.paiMingText.text = uts.format("第{0}名", condtion);
        }
        else {
            //条件
            let condtion2: number = data.config.m_iCondition2;
            let strContent: string = "";
            if (data.config.m_ucRankType == KeyWord.RANK_TYPE_LEVEL) {
                //等级
                strContent = "等级达到" + condtion2 + "级";
            }
            else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_ZQ) {
                //坐骑
                condtion2 = ZhufuData.getZhufuStage(condtion2, KeyWord.HERO_SUB_TYPE_ZUOQI);
                strContent = "坐骑达到" + condtion2 + "阶";
            }
            else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_WH) {
                //神器
                condtion2 = ZhufuData.getZhufuStage(condtion2, KeyWord.HERO_SUB_TYPE_WUHUN);
                strContent = "神器达到" + condtion2 + "阶";
            }
            else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_FZ) {
                //圣印
                condtion2 = ZhufuData.getZhufuStage(condtion2, KeyWord.HERO_SUB_TYPE_FAZHEN);
                strContent = "圣印达到" + condtion2 + "阶";
            }
            else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_STRENGTH) {
                //强化
                strContent = "强化达到" + condtion2 + "级";
            }
            else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_HONGYAN) {
                //伙伴
                condtion2 = PetData.getPetStage(condtion2);
                strContent = "伙伴达到" + condtion2 + "阶";
            } else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_DIAMOND) {
                //宝石
                strContent = "宝石达到" + condtion2 + "级";
            } else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_FAQI) {
                //宝物
                strContent = "宝物达到" + condtion2 + "阶";
            } else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_LL) {
                //真迹
                condtion2 = ZhufuData.getZhufuStage(condtion2, KeyWord.HERO_SUB_TYPE_LEILING);
                strContent = "真迹达到" + condtion2 + "阶";
            } else if (data.config.m_ucRankType == KeyWord.RANK_TYPE_MAGIC) {
                //星环
                strContent = "星环达到" + condtion2 + "阶";
            }
            this.paiMingText.text = strContent;
        }
        let count = data.config.m_stItemList.length;
        this.m_rewardList.Count = count;
        //刷出奖励
        for (let i: number = 0; i < count; i++) {
            if (i < data.config.m_iItemCount) {
                this.iconItems[i].updateById(data.config.m_stItemList[i].m_uiOne, data.config.m_stItemList[i].m_uiTwo);
            }
            else {
                this.iconItems[i].updateById(0, 0);
            }
            this.iconItems[i].updateIcon();
        }
    }

    /**点击领取按钮*/
    private onBtnGetClick(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetRewardRequest(this.qmcbRankData.config.m_iID));
    }

}