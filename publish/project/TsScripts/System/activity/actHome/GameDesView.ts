import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { HddtDailyActItemData } from 'System/data/vo/HddtDailyActItemData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { Color } from 'System/utils/ColorUtil'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'/**
 * 日常活动玩法说明
 *
 */
export class GameDesView extends CommonForm {

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private txtLv: UnityEngine.UI.Text;
    private txtRule: UnityEngine.UI.Text;
    private txtTitle: UnityEngine.UI.Text;
    /**日常活动数据*/
    private config: GameConfig.ActHomeConfigM;
    /** 奖励数据 */
    private m_rewardListData: RewardIconItemData[] = [];

    private rewardList: List;
    private rewardIcons: IconItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GameDesView;
    }


    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.txtLv = this.elems.getText("txtLv");
        this.txtRule = this.elems.getText("txtRule"); 
        this.txtTitle = this.elems.getText("txtTitle");
        this.rewardList = this.elems.getUIList("rewardList");
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onCLickMask);
        this.addClickListener(this.btnClose, this.onCLickMask);
    }

    open(config: GameConfig.ActHomeConfigM) {
        this.config = config;
        super.open();

    }

    protected onOpen() {
        let color = this.config.m_iLevel < G.DataMgr.heroData.level ? Color.GREEN : Color.RED;
        this.txtLv.text = uts.format('参加等级：{0}', TextFieldUtil.getColorText(this.config.m_iLevel.toString(), color));
        this.txtRule.text = RegExpUtil.xlsDesc2Html(this.config.m_szRuleDesc);
        RewardIconItemData.freeVector(this.m_rewardListData);
        let count: number = this.config.m_BonusInfo.length;
        for (let i = 0; i < count; i++) {
            if (this.config.m_BonusInfo[i].m_iId > 0) {
                var rewardItemData: RewardIconItemData = RewardIconItemData.alloc();
                rewardItemData.id = this.config.m_BonusInfo[i].m_iId;
                rewardItemData.number = this.config.m_BonusInfo[i].m_iNum;
                rewardItemData.tipInfo = this.config.m_BonusInfo[i].m_szIconTips;
                this.m_rewardListData.push(rewardItemData);
            }
        }
        this.rewardList.Count = this.m_rewardListData.length;
        for (let i = 0; i < this.m_rewardListData.length; i++) {
            if (this.rewardIcons[i] == null) {
                let item = this.rewardList.GetItem(i).findObject("icon");
                this.rewardIcons[i] = new IconItem();
                this.rewardIcons[i].setTipFrom(TipFrom.normal);
                this.rewardIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, item)
            }
            this.rewardIcons[i].updateByRewardIconData(this.m_rewardListData[i]);
            this.rewardIcons[i].updateIcon();
        }
    }

    protected onClose() {

    }

    private onCLickMask() {
        this.close();
    }
}