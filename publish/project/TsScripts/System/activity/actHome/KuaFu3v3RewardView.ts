import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'

/**跨服3v3奖励对话框。*/
export class KuaFu3v3RewardView extends CommonForm {
    private readonly SwordCount = 3;
    private readonly SwordMaxPerOne = 2;

    private mask: UnityEngine.GameObject;
    //private btnClose: UnityEngine.GameObject;

    private swords: UnityEngine.GameObject[] = [];
    private textRule: UnityEngine.UI.Text;

    /**每日胜场奖励*/
    private dailyList: List;
    /**赛季段位奖励*/
    private seasonList: List;

    private btnGetReward: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    private dailyItems: IconItem[] = [];

    private seasonItems: IconItem[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KuaFu3v3RewardView;
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        //this.btnClose = this.elems.getElement('btnClose');
        this.dailyList = this.elems.getUIList('dailyList');
        this.seasonList = this.elems.getUIList('seasonList');

        for (let i = 0; i < this.SwordCount; i++) {
            this.swords.push(this.elems.getElement('sword' + i));
        }

        this.textRule = this.elems.getText('textRule');
        //this.textRule.text = G.DataMgr.langData.getLang(346);

        this.btnGetReward = this.elems.getElement('btnGetReward');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickReturnBtn);
        //this.addClickListener(this.btnClose, this.onClickReturnBtn);
        this.addClickListener(this.btnGetReward, this.onClickBtnGetReward);
    }

    protected onOpen() {
        let kf3v3Data = G.DataMgr.kf3v3Data;
        let info = kf3v3Data.pvpV3Info;
        let dayWinTime = 0;
        let grade = 0;
        if (null != info) {
            dayWinTime = info.m_uiDayWinTime;
            grade = info.m_uiPreGrade;
        }

        // 每日胜场奖励
        for (let i = 0; i < this.SwordCount; i++) {
            let count = dayWinTime - i * this.SwordMaxPerOne;
            if (count < 0) {
                count = 0;
            } else if (count > this.SwordMaxPerOne) {
                count = this.SwordMaxPerOne;
            }
            this.setSwordCont(i, count);
        }
        let dailyWinCfg = kf3v3Data.getDailyWinCfg(dayWinTime);
        this.setRewardList(this.dailyList, this.dailyItems, dailyWinCfg.m_iItemCount, dailyWinCfg.m_stItemList);

        // 赛季段位奖励
        let gradeCfg = kf3v3Data.getConfByLevel(grade);
        this.setRewardList(this.seasonList, this.seasonItems, gradeCfg.m_iItemCount, gradeCfg.m_stItemList);

        // 领取赛季段位奖励按钮
        this.updateBtnGetReward();
    }

    protected onClose() {
    }

    onGetReward() {
        this.updateBtnGetReward();
    }

    private updateBtnGetReward() {
        let info = G.DataMgr.kf3v3Data.pvpV3Info;
        UIUtils.setButtonClickAble(this.btnGetReward, null != info ? 1 != info.m_ucSeasonGift : false);
    }

    private setSwordCont(index: number, count: number) {
        let sword = this.swords[index];
        for (let i = 0; i <= this.SwordMaxPerOne; i++) {
            ElemFinder.findObject(sword, i.toString()).SetActive(i == count);
        }
    }

    private setRewardList(list: List, items: IconItem[], itemCount: number, itemCfgs: GameConfig.Cross3V3CfgItem[]) {
        list.Count = itemCount;
        let oldItemCnt = items.length;
        for (let i = 0; i < itemCount; i++) {
            let item: IconItem;
            if (i < oldItemCnt) {
                item = items[i];
            } else {
                items.push(item = new IconItem());
                item.setTipFrom(TipFrom.normal);
                item.setUsuallyIcon(list.GetItem(i).gameObject);
            }
            item.updateById(itemCfgs[i].m_iID, itemCfgs[i].m_iCount);
            item.updateIcon();
        }
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnGetReward(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_PVP_MULTI, Macros.ACTIVITY_CROSS3V3_GET_REWARD));
    }

    private onClickReturnBtn() {
        this.close();
    }
}
