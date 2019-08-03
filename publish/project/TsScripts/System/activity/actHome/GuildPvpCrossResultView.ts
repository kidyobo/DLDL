import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { GuildPvpResultBaseView } from 'System/activity/actHome/GuildPvpResultBaseView'
import { GuildPvpRankItem } from 'System/activity/actHome/GuildPvpResultBaseView'
import { IconItem } from 'System/uilib/IconItem'
import { Constants } from 'System/constants/Constants'
import { DropPlanData } from 'System/data/DropPlanData'
import { TipFrom } from 'System/tip/view/TipsView'

export class GuildPvpCrossResultView extends GuildPvpResultBaseView {

    private info: Protocol.GuildCrossPVPResult;

    constructor() {
        super();
        this.countDownSeconds = 60;
    }

    protected resPath(): string {
        return UIPathData.GuildPvpCrossResultView;
    }

    onOpen() {
        let cnt = 0;
        if (null != this.info) {
            cnt = this.info.m_ucNum;
        }
        let oldItemCnt = this.rankItems.length;
        this.rankList.Count = cnt;
        let myGuildName = G.DataMgr.guildData.guildName;
        let myRankInfo: Protocol.GuildCrossPVPResultValue;
        for (let i = 0; i < cnt; i++) {
            let oneRank = this.info.m_stResultData[i];
            if (oneRank.m_szGuildName == myGuildName) {
                // 我的宗门排名
                myRankInfo = oneRank;
            }
            let item: GuildPvpRankItem;
            if (i < oldItemCnt) {
                item = this.rankItems[i]
            } else {
                this.rankItems.push(item = new GuildPvpRankItem());
                item.setComponents(this.rankList.GetItem(i).gameObject, false, true);
            }
            item.update(oneRank.m_ucRank, oneRank.m_szGuildName, oneRank.m_szChairmanName, oneRank.m_uiScore, false);
        }

        if (null != myRankInfo) {
            this.myItem.update(myRankInfo.m_ucRank, myRankInfo.m_szGuildName, myRankInfo.m_szChairmanName, myRankInfo.m_uiScore, false);

            this.goTextNoRewards.SetActive(false);

            let dropId = Constants.GUILD_PVP_CROSS_REWARD_LIST[myRankInfo.m_ucRank - 1];
            let dropCfg = DropPlanData.getDropPlanConfig(dropId);
            let cnt = dropCfg.m_ucDropThingNumber;
            let oldItemCnt = this.rewardItems.length;
            this.rewardList.Count = cnt;
            for (let i = 0; i < cnt; i++) {
                let item: IconItem;
                if (i < oldItemCnt) {
                    item = this.rewardItems[i];
                } else {
                    this.rewardItems.push(item = new IconItem());
                    item.setTipFrom(TipFrom.normal);
                    item.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
                }
                item.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                item.updateIcon();
            }
            this.rewardList.gameObject.SetActive(true);
        } else {
            this.myItem.update(0, null, null, 0, true);

            this.goTextNoRewards.SetActive(true);
            this.rewardList.gameObject.SetActive(false);
        }

        super.onOpen();
    }

    onClose() {
    }

    open(info: Protocol.GuildCrossPVPResult) {
        this.info = info;
        super.open();
    }
}