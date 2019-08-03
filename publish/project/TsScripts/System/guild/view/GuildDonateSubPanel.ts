import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EnumGuildFuncSubTab } from 'System/guild/view/GuildFuncPanel'
import { NumInput } from 'System/uilib/NumInput'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { BuffData } from 'System/data/BuffData'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { ThingData } from 'System/data/thing/ThingData'
import { DropPlanData } from 'System/data/DropPlanData'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'

class GuildDonateListItemData {
    name: string;
    money: number = 0;
}

class GuildDonateListItem extends ListItemCtrl {
    private rankText: UnityEngine.UI.Text;
    private nameText: UnityEngine.UI.Text;
    private moneyText: UnityEngine.UI.Text;
    
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.rankText = ElemFinder.findText(go, 'rankText');
        this.nameText = ElemFinder.findText(go, 'nameText');
        this.moneyText = ElemFinder.findText(go, 'moneyText');
        this.bg2 = ElemFinder.findObject(go, "bg2");
    }

    update(rank: number, itemData: GuildDonateListItemData) {
        this.rankText.text = rank.toString();
        this.nameText.text = itemData.name;
        this.moneyText.text = itemData.money.toString();
        this.bg2.SetActive(rank % 2 == 1);
    }
}

export class GuildDonateSubPanel extends TabSubForm {
    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    /**捐献*/
    private list: List;
    private listData: GuildDonateListItemData[] = [];
    private items: GuildDonateListItem[] = [];

    private lingpaiText: UnityEngine.UI.Text;
    private lingpaiInput: NumInput;
    private btnDonateLingpai: UnityEngine.GameObject;

    private yuanbaoText: UnityEngine.UI.Text;
    private yuanbaoInput: NumInput;
    private btnDonateYuanbao: UnityEngine.GameObject;

    /**右侧等级面板*/
    private gradePanel: UnityEngine.GameObject;
    private slider: UnityEngine.UI.Slider;
    private nameText: UnityEngine.UI.Text;
    private lvText: UnityEngine.UI.Text;
    private contributionText: UnityEngine.UI.Text;
    private moneyText: UnityEngine.UI.Text;
    private rewardList: List;
    private rewardItems: IconItem[] = [];
    private oldGiftId: number = 0;
    private textContribution: UnityEngine.UI.Text;
    private itemIcon_Normal: UnityEngine.GameObject;

    /**右侧图腾面板*/
    private totemPanel: UnityEngine.GameObject;
    private titleCur: UnityEngine.UI.Text;
    private titleNext: UnityEngine.UI.Text;
    private detailCur: UnityEngine.UI.Text;
    private detailNext: UnityEngine.UI.Text;
    private btnGetReward: UnityEngine.GameObject;

    constructor() {
        super(EnumGuildFuncSubTab.donate);
    }

    protected resPath(): string {
        return UIPathData.GuildDonateView;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup('tabGroup');

        /**左侧捐献面板*/
        this.lingpaiText = this.elems.getText('lingpaiText');
        this.lingpaiInput = new NumInput();
        this.lingpaiInput.setComponents(this.elems.getElement('lingpaiInput'));
        this.btnDonateLingpai = this.elems.getElement('btnDonateLingpai');

        this.yuanbaoText = this.elems.getText('yuanbaoText');
        this.yuanbaoInput = new NumInput();
        this.yuanbaoInput.setComponents(this.elems.getElement('yuanbaoInput'));
        this.btnDonateYuanbao = this.elems.getElement('btnDonateYuanbao');

        /**中间排行面板*/
        this.list = this.elems.getUIList('list');

        /**右侧等级面板*/
        this.gradePanel = this.elems.getElement("gradePanel");
        this.slider = this.elems.getSlider('Slider');
        this.nameText = this.elems.getText('nameText');
        this.lvText = this.elems.getText("lvText");
        this.contributionText = this.elems.getText('contributionText');
        this.moneyText = this.elems.getText('moneyText');
        this.rewardList = this.elems.getUIList('rewardList');
        this.btnGetReward = this.elems.getElement('btnGetReward');
        this.textContribution = this.elems.getText("textContribution");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        /**右侧图腾面板*/
        this.totemPanel = this.elems.getElement("totemPanel");
        this.titleCur = this.elems.getText('titleCur');
        this.titleNext = this.elems.getText('titleNext');
        this.detailCur = this.elems.getText('detailCur');
        this.detailNext = this.elems.getText('detailNext');
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
        this.addClickListener(this.btnDonateLingpai.gameObject, this.onClickBtnDonateLingpai);
        this.addClickListener(this.btnDonateYuanbao.gameObject, this.onClickBtnDonateYuanbao);

        this.addClickListener(this.btnGetReward, this.onClickBtnGetReward);
    }

    protected onOpen() {
        this.tabGroup.Selected = 0;
        this.updateView();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());
    }

    protected onClose() {
    }

    private onClickTabGroup(index: number) {
        this.gradePanel.SetActive(index == 0);
        this.totemPanel.SetActive(index == 1);
    }
    
    private onClickBtnGetReward() {
        // 领取协议
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildDayBxRequest());
    }

    private onClickBtnDonateLingpai() {
        let lingpaiNum: number = this.lingpaiInput.num;
        if (lingpaiNum > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildContriutionRequest(Macros.GUILD_DONATE_TYPE_ITEM, lingpaiNum));
        }
    }
    
    private onClickBtnDonateYuanbao() {
        let yuanbaoNum: number = this.yuanbaoInput.num;
        if (yuanbaoNum > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildContriutionRequest(Macros.GUILD_DONATE_TYPE_YUANBAO, yuanbaoNum));
        }
    }
    
    onDonateSuccess() {
        this.updateView();
        // 捐献后重新拉取成员数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());
    }
    
    updateView(): void {
        let heroData = G.DataMgr.heroData;
        let guildData = G.DataMgr.guildData;

        //左侧面板
        let lingpaiNum: number = G.DataMgr.thingData.getThingNum(Macros.GUILD_DONATE_ITEM_ID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.lingpaiText.text = lingpaiNum.toString();
        this.yuanbaoText.text = heroData.gold.toString();
        this.lingpaiInput.setRange(1, lingpaiNum, 1);
        this.yuanbaoInput.setRange(1, heroData.gold, 1);

        this.updateDonateList();

        //等级面板
        this.nameText.text = guildData.guildName;
        this.lvText.text = uts.format(guildData.guildLevel + "级"); 
        //this.lvText.text = guildData.getGuildMoneyProgressStr();
        let curDonate = TextFieldUtil.getColorText(heroData.guildDonateCur.toString(), heroData.guildDonateCur > 0 ? Color.GREEN : Color.RED);
        this.contributionText.text = uts.format("我的贡献：{0}/{1}", curDonate, heroData.guildDonateTotal);
        let guildMoney = TextFieldUtil.getColorText(guildData.guildAbstract.m_uiGuildMoney.toString(), guildData.guildAbstract.m_uiGuildMoney > 0 ? Color.GREEN : Color.RED);
        this.moneyText.text = uts.format('宗门资金：{0}', guildMoney); 
        this.slider.value = guildData.getGuildMoneyProgress();

        this.updateGiftView();

        //图腾面板
        let curGuildLevel = guildData.guildAbstract.m_ucGuildLevel;
        let levelCfg: GameConfig.GuildLevelM;
        levelCfg = guildData.getGuildLevelConfig(curGuildLevel);
        let buffConfig: GameConfig.BuffConfigM = BuffData.getBuffByID(levelCfg.m_uiLvBuff);
        this.titleCur.text = uts.format('{0}级宗门', curGuildLevel);
        this.detailCur.text = this._getBuffString(buffConfig);
        if (curGuildLevel + 1 <= Macros.MAX_GUILD_LEVEL_SIZE) {
            this.titleNext.text = uts.format('{0}级宗门', curGuildLevel + 1);
            levelCfg = guildData.getGuildLevelConfig(curGuildLevel + 1);
            buffConfig = BuffData.getBuffByID(levelCfg.m_uiLvBuff);
            this.detailNext.text = this._getBuffString(buffConfig);
        }
        else {
            this.titleNext.text = '';
            this.detailNext.text = '';
        }
    }
    
    onCurrencyChange(id: number) {
        // 按钮领取状态
        let guildData = G.DataMgr.guildData;
        if (guildData.guildLevel > 0) {
            let config = guildData.getGuildLevelConfig(guildData.guildLevel);
            UIUtils.setButtonClickAble(this.btnGetReward, guildData.isDayWelfareCanGet());
            let myContribution = G.DataMgr.heroData.guildDonateCur;
            this.textContribution.text = uts.format('当前拥有宗门贡献：{0}', TextFieldUtil.getColorText(myContribution.toString(), myContribution >= config.m_uiDayCost ? Color.GREEN : Color.RED));
        } else {
            UIUtils.setButtonClickAble(this.btnGetReward, false);
            this.textContribution.text = '';
        }
    }

    updateGiftView() {
        // 每日奖励
        let guildData = G.DataMgr.guildData;
        if (guildData.guildLevel > 0) {
            let config = guildData.getGuildLevelConfig(guildData.guildLevel);
            if (this.oldGiftId != config.m_uiDayBX) {
                this.oldGiftId = config.m_uiDayBX;

                let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(config.m_uiDayBX);
                let dropConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(thingConfig.m_iFunctionID);

                this.rewardList.Count = dropConfig.m_ucDropThingNumber;
                let oldItemCnt = this.rewardItems.length;
                for (let i = 0; i < dropConfig.m_ucDropThingNumber; i++) {
                    let item: IconItem;
                    if (i < oldItemCnt) {
                        item = this.rewardItems[i];
                    } else {
                        this.rewardItems.push(item = new IconItem());
                        item.setUsualIconByPrefab(this.itemIcon_Normal, this.rewardList.GetItem(i).findObject("icon"));
                        item.setTipFrom(TipFrom.normal);
                    }
                    item.updateByDropThingCfg(dropConfig.m_astDropThing[i]);
                    item.updateIcon();
                }
            }
        }
        this.onCurrencyChange(KeyWord.GUILD_CONTRIBUTE_ID);
    }

    updateDonateList() {
        let memberInfos: Protocol.GuildMemberInfo[] = null;
        if (G.DataMgr.guildData.guildMemberList) {
            memberInfos = G.DataMgr.guildData.guildMemberList.m_astGuildMemberInfo;
        }

        this.listData.length = 0;
        if (memberInfos != null) {
            let itemData: GuildDonateListItemData;
            for (let oneInfo of memberInfos) {
                let money = oneInfo.m_uiAccDonate;
                if (money > 0) {
                    itemData = new GuildDonateListItemData();
                    itemData.money = money;
                    itemData.name = oneInfo.m_stBaseProfile.m_szNickName;
                    this.listData.push(itemData);
                }
            }

            // 排序
            this.listData.sort(delegate(this, this._compareDonate));
        }

        let count = this.listData.length;
        this.list.Count = count;
        let oldItemCnt = this.items.length;
        let listItem: GuildDonateListItem;
        for (let i = 0; i < count; i++) {
            if (i < oldItemCnt) {
                listItem = this.items[i];
            } else {
                listItem = new GuildDonateListItem();
                listItem.setComponents(this.list.GetItem(i).gameObject);
                this.items.push(listItem);
            }
            listItem.update(i + 1, this.listData[i]);
        }
    }
    
    private _getBuffString(buffConfig: GameConfig.BuffConfigM): string {
        let len: number = buffConfig.m_astBuffEffect.length;
        let effect: GameConfig.BuffEffect;
        let buffDesc: string;

        for (let i: number = 0; i < len; ++i) {
            effect = buffConfig.m_astBuffEffect[i];

            if (effect.m_iBuffEffectType == 0) {
                continue;
            }

            let valueStr: string = KeyWord.DATA_TYPE_PER10000 == effect.m_ucDataType ? (effect.m_iBuffEffectValue / 100) + '%' : effect.m_iBuffEffectValue + '';

            if (effect.m_iBuffEffectValue > 0) {
                valueStr = '+' + valueStr;
            }

            let info = KeyWord.getDesc(KeyWord.GROUP_BUFF_EFFECT, effect.m_iBuffEffectType);
            if (buffDesc == null) {
                buffDesc = info + valueStr;
            }
            else {
                buffDesc += '\n' + info + valueStr;
            }
        }

        return buffDesc;
    }
    /**
     * 对捐献值进行排序
     * @param a
     * @param b
     * @return
     *
     */
    private _compareDonate(a: GuildDonateListItemData, b: GuildDonateListItemData): number {
        return b.money - a.money;
    }
}