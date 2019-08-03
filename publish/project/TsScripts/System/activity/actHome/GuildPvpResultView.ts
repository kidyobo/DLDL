import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { GuildPvpResultBaseView } from 'System/activity/actHome/GuildPvpResultBaseView'
import { GuildPvpRankItem } from 'System/activity/actHome/GuildPvpResultBaseView'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'

export class GuildPvpResultView extends GuildPvpResultBaseView {

    private readonly MinPrivateScore = 50;

    private textMyRank: UnityEngine.UI.Text;
    private textMyScore: UnityEngine.UI.Text;

    private info: Protocol.PVPRankResult;

    constructor() {
        super();
    }

    protected resPath(): string {
        return UIPathData.GuildPvpResultView;
    }

    protected initElements() {
        super.initElements();

        this.textMyRank = this.elems.getText('textMyRank');
        this.textMyScore = this.elems.getText('textMyScore');
    }

    onOpen() {
        let cnt = 0;
        if (null != this.info) {
            cnt = this.info.m_ucNum;
        }
        let oldItemCnt = this.rankItems.length;
        this.rankList.Count = cnt;
        let myGuildName = G.DataMgr.guildData.guildName;
        let myRankInfo: Protocol.PVPRankOne;
        let myRank = 0;
        for (let i = 0; i < cnt; i++) {
            let oneRank = this.info.m_astRankData[i];
            if (oneRank.m_szTextOne == myGuildName) {
                // 我的宗门排名
                myRankInfo = oneRank;
                myRank = i + 1;
            }
            let item: GuildPvpRankItem;
            if (i < oldItemCnt) {
                item = this.rankItems[i]
            } else {
                this.rankItems.push(item = new GuildPvpRankItem());
                item.setComponents(this.rankList.GetItem(i).gameObject, false, true);
            }
            item.update(i + 1, oneRank.m_szTextOne, oneRank.m_szTextTwo, oneRank.m_iScore, false);
        }

        if (null != myRankInfo) {
            this.myItem.update(myRank, myRankInfo.m_szTextOne, myRankInfo.m_szTextTwo, myRankInfo.m_iScore, false);
        } else {
            this.myItem.update(myRank, null, null, 0, true);
        }

        this.textMyRank.text = uts.format('我的排名：{0}', this.info.m_iPersonalRank);
        this.textMyScore.text = uts.format('我的积分：{0}', this.info.m_iPersonalScore);
        if (this.info.m_iPersonalScore >= this.MinPrivateScore) {
            this.goTextNoRewards.SetActive(false);
            let cnt = this.info.m_stThingList.m_ucNum;
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
                let oneThing = this.info.m_stThingList.m_astThing[i];
                item.updateById(oneThing.m_uiThingID, oneThing.m_uiThingNum);
                item.updateIcon();
            }
            this.rewardList.gameObject.SetActive(true);
        } else {
            this.goTextNoRewards.SetActive(true);
            this.rewardList.gameObject.SetActive(false);
        }

        super.onOpen();
    }

    onClose() {
    }

    open(info: Protocol.PVPRankResult) {
        this.info = info;
        super.open();
    }
}