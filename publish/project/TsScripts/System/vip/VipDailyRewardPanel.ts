import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { DropPlanData } from 'System/data/DropPlanData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UnitCtrlType, EnumProductID } from 'System/constants/GameEnum'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { VipData } from 'System/data/VipData'
import { VipView, VipTab } from 'System/vip/VipView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'

class DailyListItem extends ListItemCtrl {


    private iconItems: IconItem[] = [];
    private btn_get: UnityEngine.GameObject;
    private btn_reward: UnityEngine.GameObject;
    private rewardRoot: UnityEngine.GameObject;
    private level: number = 0;
    private btn_getText: UnityEngine.UI.Text;
    private isNeedActive: boolean = false;
    private btnTexts: string[] = ['首冲即送', '领取', '领取'];

    setComponents(obj: UnityEngine.GameObject) {
        this.rewardRoot = ElemFinder.findObject(obj, "rewards");
        this.btn_get = ElemFinder.findObject(obj, "btn_get");
        this.btn_reward = ElemFinder.findObject(obj, "btn_reward");
        this.btn_getText = ElemFinder.findText(this.btn_get, "Text");
        for (let i = 0; i < VipDailyRewardPanel.MaxRewardNum; i++) {
            let iconItem = new IconItem();
            let iconRoot = ElemFinder.findObject(this.rewardRoot, i.toString());
            iconItem.setUsualIconByPrefab(VipDailyRewardPanel.iconItem_Normal, iconRoot);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);
        }
        Game.UIClickListener.Get(this.btn_get).onClick = delegate(this, this.onClickBtnGet);
        Game.UIClickListener.Get(this.btn_reward).onClick = delegate(this, this.onClickBtnGet);
    }

    update(data: GameConfig.DropConfigM, level: number) {
        this.level = level;
        for (let i = 0; i < VipDailyRewardPanel.MaxRewardNum; i++) {
            let dropThing = data.m_astDropThing[i];
            if (dropThing != null) {
                this.iconItems[i].updateByDropThingCfg(dropThing);
            } else {
                this.iconItems[i].updateById(0);
            }
            this.iconItems[i].updateIcon();
        }
    }



    updateBtnStage(hasGet: boolean = false) {
        if (this.level == KeyWord.VIPPRI_NONE) {
            UIUtils.setButtonClickAble(this.btn_get, !hasGet);
            this.btn_reward.SetActive(false);
            this.btn_get.SetActive(true);
            this.btn_getText.text = hasGet == false ? "可领取" : "已领取";
        } else {
            let stage = G.DataMgr.heroData.getPrivilegeState(this.level);
            if (stage >= 0) {
                //已经激活特权
                this.btn_reward.SetActive(false);
                this.btn_get.SetActive(true);
                UIUtils.setButtonClickAble(this.btn_get, !hasGet);
                this.btn_getText.text = hasGet == false ? "可领取" : "已领取";
            } else {
                //未激活
                this.btn_reward.SetActive(true);
                this.btn_get.SetActive(false);
                UIUtils.setButtonClickAble(this.btn_get, true);
                this.btn_getText.text = this.btnTexts[this.level - 1];
                this.isNeedActive = true;
            }
        }
    }


    private onClickBtnGet() {
        if (this.isNeedActive) {
            if (this.level == KeyWord.VIPPRI_1) {
                G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
            } else {
                G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
            }
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_GET_GIFT, Macros.VIP_MONTH_GET_TYPE_DAILY, this.level));

    }
}




export class VipDailyRewardPanel extends TabSubForm {


    static iconItem_Normal: UnityEngine.GameObject;

    static readonly MaxRewardNum: number = 4;

    private listRoot: UnityEngine.GameObject;

    private listItems: UnityEngine.GameObject[] = [];

    private dropThings: GameConfig.DropConfigM[] = [];

    private dailyListItems: DailyListItem[] = [];

    private privalegeLevels: number[] = [KeyWord.VIPPRI_NONE, KeyWord.VIPPRI_1, KeyWord.VIPPRI_2, KeyWord.VIPPRI_3];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_VIPDAILYREWARD);
    }

    protected resPath(): string {
        return UIPathData.VipDailyRewardPanel;
    }

    protected initElements() {
        VipDailyRewardPanel.iconItem_Normal = this.elems.getElement('itemIcon_Normal');
        this.listRoot = this.elems.getElement('list');
        for (let i = 0; i < VipDailyRewardPanel.MaxRewardNum; i++) {
            let obj = ElemFinder.findObject(this.listRoot, i.toString());
            this.listItems.push(obj);
        }
    }

    protected initListeners() {
        super.initListeners();

    }

    open() {
        super.open();
    }


    protected onOpen() {
        this.getRewardDatas();
        this.updateView();
    }


    updateView() {
        for (let i = 0; i < VipDailyRewardPanel.MaxRewardNum; i++) {
            let item = this.getDailyRewardItem(i, this.listItems[i]);
            item.update(this.dropThings[i], this.privalegeLevels[i]);
            item.updateBtnStage(G.DataMgr.vipData.getVipDailyGiftHasGet(this.privalegeLevels[i]));
        }
    }


    private getDailyRewardItem(index: number, obj: UnityEngine.GameObject): DailyListItem {
        let item: DailyListItem;
        if (index < this.dailyListItems.length) {
            item = this.dailyListItems[index];
        } else {
            item = new DailyListItem();
            item.setComponents(obj);
            this.dailyListItems.push(item);
        }
        return item;
    }


    private getRewardDatas() {
        this.dropThings.length = 0;
        let datas = G.DataMgr.vipData.getVipParaMaps(KeyWord.VIP_PARA_DAY_LOGIN_GIFT);
        datas.sort(this.sortVipData);
        for (let i = 0; i < datas.length; i++) {
            let dropId = datas[i].m_aiValue[0];
            if (dropId > 0) {
                let config: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropId);
                this.dropThings.push(config);
            }
        }
    }

    private sortVipData(a: GameConfig.VIPParameterConfigM, b: GameConfig.VIPParameterConfigM) {
        return a.m_ucPriType - b.m_ucPriType;
    }


}