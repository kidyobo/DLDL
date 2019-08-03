import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { EnumRewardState } from 'System/constants/GameEnum'
import { UIUtils } from 'System/utils/UIUtils'
import { EnumGuide } from 'System/constants/GameEnum'

class LvUpGiftItem extends ListItemCtrl {

    btnGetReward: UnityEngine.GameObject;

    private textLv: UnityEngine.UI.Text;
    private rewardList: List;
    private items: IconItem[] = [];
    private btnLabel: UnityEngine.UI.Text;
    private level: number = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.textLv = ElemFinder.findText(go, 'textLv');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        this.btnGetReward = ElemFinder.findObject(go, 'btnGetReward');
        this.btnLabel = ElemFinder.findText(this.btnGetReward.gameObject, 'Text');
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickBtnGetReward);
    }


    init(cfg: GameConfig.GiftBagConfigM) {
        this.level = cfg.m_iParameter;
        this.textLv.text = uts.format('Lv.{0}', this.level);
        let rewardCnt = cfg.m_astGiftThing.length;
        this.rewardList.Count = rewardCnt;
        for (let i = 0; i < rewardCnt; i++) {
            let icon = new IconItem();
            icon.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            icon.setTipFrom(TipFrom.normal);
            this.items.push(icon);
            icon.updateById(cfg.m_astGiftThing[i].m_iThingID, cfg.m_astGiftThing[i].m_iThingNumber);
            icon.updateIcon();
        }
    }

    update(status: EnumRewardState, btnLabel: string) {
        this.btnLabel.text = btnLabel;
        let enable = (EnumRewardState.NotGot == status);
        UIUtils.setButtonClickAble(this.btnGetReward, enable);
    }

    onClickBtnGetReward() {
        let level = G.DataMgr.activityData.levelGiftData.cheakHasNotGetLv(this.level);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getLevelGiftRequest(level));
        G.GuideMgr.processGuideNext(EnumGuide.LvUpGift, EnumGuide.LvUpGift_ClickGet);
    }
}

export class LvUpGiftPanel extends TabSubForm implements IGuideExecutor {

    private list: List;
    private items: LvUpGiftItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SJLB);
    }

    protected resPath(): string {
        return UIPathData.LvUpGiftView;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');

        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        let cnt = cfgs.length;
        this.list.Count = cnt;

        let item: LvUpGiftItem;
        for (let i: number = 0; i < cnt; i++) {
            this.items.push(item = new LvUpGiftItem());
            item.setComponents(this.list.GetItem(i).gameObject);
            item.init(cfgs[i]);
        }
    }

    protected initListeners() {
    }

    protected onOpen() {
        this.updateView();
        G.GuideMgr.processGuideNext(EnumGuide.LvUpGift, EnumGuide.LvUpGift_OpenLvUpGift);
    }

    protected onClose() {
    }

    updateView(): void {
        //当前伙伴等级及进度条
        let heroLv: number = G.DataMgr.heroData.level;

        // 奖励列表
        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);

        let cnt = cfgs.length;
        this.list.Count = cnt;
        let m_minLevel: number = G.DataMgr.activityData.levelGiftData.minLevel;
        let hasGetLevel: number = G.DataMgr.activityData.levelGiftData.getlevel();
        let scrollIndex: number = 0;
        for (let i: number = 0; i < cnt; i++) {
            let state: EnumRewardState;
            let btnLabel: string;
            let parameter = cfgs[i].m_iParameter;
            if (heroLv < m_minLevel || heroLv < parameter) {
                //未达到最低等级礼包全部显示不可领取
                state = EnumRewardState.NotReach;
                btnLabel = '未达成';
            } else if (parameter <= hasGetLevel) {
              	//小于等于最后已领等级的礼包都显示为已领取
                state = EnumRewardState.HasGot;
                btnLabel = '已领取';
                scrollIndex = i;
            }
            else if (heroLv >= parameter) {
                //有可领取的礼包则让后面所有按钮都亮着
                state = EnumRewardState.NotGot;
                btnLabel = '领取奖励';
            }
            else {
                //否则让它们都灰掉
                state = EnumRewardState.HasGot;
                btnLabel = '领取奖励';
            }
            this.items[i].update(state, btnLabel);
        }
        this.list.ScrollByAxialRow(scrollIndex);
        let data = G.DataMgr.activityData.levelGiftData;
        if (data.isHasNotGetLv) {                        
            if (data.notGetLvs[0] > data.selectedLevel) {
                data.isHasNotGetLv = false;
                return;
            }
            let level = data.notGetLvs.shift();
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getLevelGiftRequest(level));
        }
    }

    getCanGetItem(lv: number): LvUpGiftItem {
        let myLv = G.DataMgr.heroData.level;
        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        let cnt = cfgs.length;
        let lastGetLevel: number = G.DataMgr.activityData.levelGiftData.getlevel();
        for (let i: number = 0; i < cnt; i++) {
            let getLv = cfgs[i].m_iParameter;
            if (getLv > lastGetLevel && myLv >= getLv) {
                if (0 == lv || getLv == lv)
                return this.items[i];
            }
        }
        return null;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.LvUpGift_ClickGet == step) {
            let lv = args[0] as number;
            let item = this.getCanGetItem(lv);
            if (null != item) {
                item.onClickBtnGetReward();
                return true;
            }
        }
        return false;
    }
}