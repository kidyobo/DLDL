import { DropPlanData } from 'System/data/DropPlanData'
import { Constants } from 'System/constants/Constants'
import { IconItem } from 'System/uilib/IconItem'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { List, ListItem } from 'System/uilib/List'
import { DataFormatter } from '../../utils/DataFormatter';

/**
 * 跨服奖励面板
 * @author jesse
 */
export class GuildCrossPvpRewardView extends CommonForm {
    /**宗门胜利奖励*/
    private readonly winGuildRewardIDs: number[] = [60165025, 60165026];
    /**宗门胜利最大奖励数量4*/
    private readonly maxWinGuild: number = 4;

    /**最大排行奖励8*/
    private readonly maxRank: number = 8;

    private winIconItems0: IconItem[] = [];
    private winIconItems1: IconItem[] = [];


    /**宗门排行奖励*/
    private readonly rankGuildRewardIDs: number[] = Constants.GUILD_PVP_CROSS_REWARD_LIST;

    /**勋章图集*/
    private medalAltas: Game.UGUIAltas;

    private btnClose: UnityEngine.GameObject;
    /**胜利宗门奖励*/
    private guild: UnityEngine.GameObject;
    /**胜利宗门成员奖励*/
    private member: UnityEngine.GameObject;

    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildCrossPvpRewardView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //宗门争霸排名
        this.list = this.elems.getUIList("list");
        this.list.Count = this.maxRank;

        this.medalAltas = this.elems.getElement('medalAltas').transform.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.btnClose = this.elems.getElement("btnClose");
        this.guild = this.elems.getElement("guild");
        this.member = this.elems.getElement("member");
        //宗门胜利/成员奖励 
        for (let i = 0; i < this.maxWinGuild; i++) {
            let item0 = ElemFinder.findObject(this.guild, 'icon' + i);
            let item1 = ElemFinder.findObject(this.member, 'icon' + i);
            let icon0 = new IconItem();
            let icon1 = new IconItem();
            icon0.setUsualIconByPrefab(this.itemIcon_Normal,item0);
            icon1.setUsualIconByPrefab(this.itemIcon_Normal ,item1);
            icon0.setTipFrom(TipFrom.normal);
            icon1.setTipFrom(TipFrom.normal);
            this.winIconItems0.push(icon0);
            this.winIconItems1.push(icon1);
        }

    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onBtnClose);
    }

    protected onOpen() {
        this.showWinGuildRwardUI();
        this.showRankRwardUI();
    }

    protected onClose() {

    }

    private onBtnClose() {
        this.close();
    }
    /**
     * 显示胜利宗门/成员的奖励
     */
    private showWinGuildRwardUI() {
        this.initRewards1(this.winGuildRewardIDs[0], this.winIconItems0);
        this.initRewards1(this.winGuildRewardIDs[1], this.winIconItems1);
    }
    /**
     * 显示排行宗门的奖励
     */
    private showRankRwardUI() {
        for (let i = 0; i < this.maxRank; i++) {
            this.initRewards2(this.rankGuildRewardIDs[i], i);
        }
    }

    private initRewards1(id: number, icons: IconItem[]) {
        let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(id);
        for (let i = 0; i < this.maxWinGuild; i++) {
            if (i < dropCfg.m_ucDropThingNumber) {
                icons[i].updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            } else {
                icons[i].updateByDropThingCfg(null);
            }
            
            icons[i].updateIcon();
        }
    }

    private initRewards2(id: number, rankNum: number) {
        let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(id);
        let item = this.list.GetItem(rankNum);
        let rewardItem = new GuildCrossRewardItem();
        rewardItem.setComponents(item.gameObject, this.itemIcon_Normal);
        rewardItem.update(dropCfg, rankNum, this.medalAltas);
    }
}

class GuildCrossRewardItem {
    private medalImg: UnityEngine.UI.Image;
    private rewardIcons: IconItem[] = [];
    private txtRank:UnityEngine.UI.Text;
    // /**第一/二名直接替换一张图片*/
    // private rank1: UnityEngine.GameObject;
    // private imgRank1: UnityEngine.UI.Image;
    // /**第3-8名，只替换中奖数字*/
    // private rank2: UnityEngine.GameObject;
    // private imgRank2: UnityEngine.UI.Image;
    setComponents(go: UnityEngine.GameObject, icon: UnityEngine.GameObject) {
        this.medalImg = ElemFinder.findImage(go, 'medalImg');
        this.txtRank=ElemFinder.findText(go,"txtRank");
        // this.rank1 = ElemFinder.findObject(go, 'rank1');
        // this.imgRank1 = ElemFinder.findImage(go, 'rank1');
        // this.rank2 = ElemFinder.findObject(go, 'rank2');
        // this.imgRank2 = ElemFinder.findImage(this.rank2, 'imgNum');
        for (let i: number = 0; i < 2; i++) {
            let iconGo = ElemFinder.findObject(go, 'icon' + i);
            let iconItem = new IconItem();
            this.rewardIcons.push(iconItem);
            iconItem.setUsualIconByPrefab(icon,iconGo);        
        }
    }

    update(dropCfg: GameConfig.DropConfigM, rank: number, medalAltas: Game.UGUIAltas) {
         // 勋章样式   
        // if (rank == 0 || rank == 1) {
        //     this.rank1.SetActive(true);
        //     this.rank2.SetActive(false);
        //     this.imgRank1.sprite = medalAltas.Get("zm" + (rank + 1));
        // } else {
        //     this.rank1.SetActive(false);
        //     this.rank2.SetActive(true);
        //     this.imgRank2.sprite = medalAltas.Get("zm" + (rank + 1));
        // }
        this.txtRank.text=uts.format("第{0}名",DataFormatter.toHanNumStr(rank+1));
        for (let i: number = 0; i < this.rewardIcons.length; i++) {
            let iconItem = this.rewardIcons[i];
            if (i < dropCfg.m_ucDropThingNumber) {
                iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            } else {
                iconItem.updateByDropThingCfg(null);
            }
            iconItem.updateIcon();
        }
    }
}

