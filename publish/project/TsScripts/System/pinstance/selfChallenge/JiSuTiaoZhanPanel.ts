import { KeyWord } from 'System/constants/KeyWord';
import { JstzItemData } from 'System/data/JstzItemData';
import { MonsterData } from 'System/data/MonsterData';
import { UIPathData } from 'System/data/UIPathData';
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { Global as G } from 'System/global';
import { JiSuTiaoZhanRankView } from 'System/pinstance/selfChallenge/JiSuTiaoZhanRankView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TextTipData } from 'System/tip/tipData/TextTipData';
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UnitUtil } from "System/utils/UnitUtil";
import { RegExpUtil } from '../../utils/RegExpUtil';
/**
 * 急速挑战
 * @author jesse
 */
export class JiSuTiaoZhanPanel extends TabSubForm {

    private m_isAutoBuy: boolean = false;
    private m_timerStatus: boolean = false;


    /**极速挑战排行榜的数据*/
    private jstzRankDatas: JstzItemData[] = [];
    /**我的排名*/
    private myRank: string = "";
    /**我的通关时间*/
    private myTime: string = "";
    /**排行榜显示的个数*/
    private rankCount: number;

    /**奖励数量*/
    private readonly rewardCount: number = 2;

    /**进入*/
    private btnEnter: UnityEngine.GameObject;
    /**增加次数*/
    private btnAddCount: UnityEngine.GameObject;
    /**攻略按钮*/
    private btnGonglve: UnityEngine.GameObject;

    /**排名列表*/
    private rankList: List = null;
    private listItems: JSTZrankItem[] = [];
    private iconAltas: Game.UGUIAltas;
    /**我的排名文本显示*/
    private txtMyRank: UnityEngine.UI.Text = null;
    private txtTitleMyRank: UnityEngine.UI.Text = null;
    /**通关时间*/
    private txtTongGuanTime: UnityEngine.UI.Text;
    /**通关状态*/
    private txtTongGuanState: UnityEngine.UI.Text;
    /**挑战次数*/
    private txtTiaozhanCount: UnityEngine.UI.Text;
    /**额外免费次数倒计时*/
    private txtEwaiFreeTime: UnityEngine.UI.Text;
    /**boss模型节点*/
    private bossTransform: UnityEngine.GameObject;
    /**boss的Id*/
    private monsterModelId: number = 0;

    private itemIcon_Normal: UnityEngine.GameObject;

    private btnRule: UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_JSTZ);
    }

    protected resPath(): string {
        return UIPathData.JiSuTiaoZhanView;
    }

    protected initElements() {
        this.btnRule = this.elems.getElement('btnRule');
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //按钮
        this.btnEnter = this.elems.getElement("btnEnter");
        this.btnAddCount = this.elems.getElement("btnAddCount");
        this.btnGonglve = this.elems.getElement("btnGonglve");
        //要显示的文本
        this.txtTongGuanTime = this.elems.getText("txtTongGuanTime");
        this.txtTongGuanState = this.elems.getText("txtTongGuanState");
        this.txtTiaozhanCount = this.elems.getText("txtTiaozhanCount");
        this.txtEwaiFreeTime = this.elems.getText("txtEwaiFreeTime");
        this.rankList = this.elems.getUIList('rankList');
        this.txtMyRank = this.elems.getText('txtMyRank');
        this.txtTitleMyRank = this.elems.getText('txtTitleMyRank');
        this.iconAltas = this.elems.getElement('rankAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        //模型显示节点      
        this.bossTransform = this.elems.getElement("bossTransform");
    }

    protected initListeners() {
        this.addClickListener(this.btnEnter, this.onEnterPinstance);
        this.addClickListener(this.btnAddCount, this.onClearCD);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnGonglve, this.onClickBtnGonglve);
    }
    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKTIMEINFO, Macros.PINSTANCE_ID_BPXD));
        this.showRewardIcon();
        //this.updatePanel();
    }

    protected onClose() {
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(240), '规则介绍');
    }

    //查看排名
    private onRankClick() {
        G.Uimgr.createForm<JiSuTiaoZhanRankView>(JiSuTiaoZhanRankView).open(this.jstzRankDatas, this.myRank, this.myTime, this.rankCount)
    }

    private onClickBtnGonglve() {
        let day: number = this.getActDay();
        let cfg: GameConfig.JSTZM = G.DataMgr.activityData.getJstzCfg_Flash(day);

        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(RegExpUtil.xlsDesc2Html(cfg.m_szTip), '规则介绍');
    }

    updatePanel(): void {
        let jstzData: Protocol.PinTimeRankInfo = G.DataMgr.pinstanceData.jstzData;
        if (jstzData == null)
            return;
        this.jstzRankDatas = [];
        let day: number = 1;//this.getActDay();
        let cfg: GameConfig.JSTZM = G.DataMgr.activityData.getJstzCfg_Flash(day);
        //this.txtGongLue.text = RegExpUtil.xlsDesc2Html(cfg.m_szTip);
        let myRank: number = -1;
        let items: JstzItemData[] = new Array<JstzItemData>();
        let itemCount: number = 50;// day > 7 ? 30 : 20;
        for (let i: number = 0; i < itemCount; i++) {
            items[i] = new JstzItemData();
            items[i].rank = i + 1;
            items[i].cfg = G.DataMgr.activityData.getJstzRankCfg_Flash(day, i + 1);
            items[i].isHero = false;
            if (i < jstzData.m_ucCount) {
                items[i].roleID = jstzData.m_stFrontInfoList[i].m_stRoleID;
                items[i].time = jstzData.m_stFrontInfoList[i].m_uiTime;
                items[i].roleName = jstzData.m_stFrontInfoList[i].m_szNickName;
                if (items[i].roleID.m_uiUin == G.DataMgr.heroData.roleID.m_uiUin) {
                    myRank = items[i].rank;
                    items[i].isHero = true;
                }
            }
            else {
                items[i].roleID = null
                items[i].time = 0
                items[i].roleName = '虚位以待';
            }
            this.jstzRankDatas.push(items[i]);

        }
        this.txtTongGuanTime.text = uts.format('最佳通关时间：{0}', TextFieldUtil.getColorText(DataFormatter.second2hhmmss(jstzData.m_iMyTime), Color.GREEN));
        this.txtTiaozhanCount.text = uts.format('挑战次数：{0}/2', jstzData.m_iMyPKCount);
        this.txtTongGuanState.text = uts.format('通关状态：{0}', jstzData.m_iMyTime > 0 ? TextFieldUtil.getColorText('通关', Color.GREEN) : TextFieldUtil.getColorText('未通关', Color.RED));
        this.rankCount = itemCount;
        this.myRank = (myRank == -1) ? TextFieldUtil.getColorText('未上榜', Color.RED) : TextFieldUtil.getColorText(myRank.toString(), Color.GREEN);
        this.myTime = (jstzData.m_iMyTime <= 0) ? TextFieldUtil.getColorText('未通关', Color.RED) : TextFieldUtil.getColorText(DataFormatter.second2hhmmss(jstzData.m_iMyTime), Color.GREEN);

        this.onTimer();
        this.onUpdateRank();
    }

    private onUpdateRank() {
        this.txtMyRank.text = "我的排名：" + this.myRank;
        this.txtTitleMyRank.text = this.myRank;
        this.rankList.Count = this.rankCount;
        for (let i = 0; i < this.rankCount; i++) {
            let item = this.rankList.GetItem(i).gameObject;
            if (this.listItems[i] == null) {
                this.listItems[i] = new JSTZrankItem();
                this.listItems[i].setComponents(item, this.iconAltas, this.itemIcon_Normal);
            }
            this.listItems[i].update(this.jstzRankDatas[i], i);
        }
    }


    //进入副本
    private onEnterPinstance(): void {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_JSTZ)) {
            G.TipMgr.addMainFloatTip('75级以后开启');
        }
        else {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_BPXD);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKTIMEINFO, Macros.PINSTANCE_ID_BPXD));
        }
    }
    //增加副本次数
    private onClearCD(): void {
        let jstzData: Protocol.PinTimeRankInfo = G.DataMgr.pinstanceData.jstzData;
        if (jstzData == null)
            return;

        let cost: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_BPXD_FRESH_PRICE));
        if (jstzData.m_iMyPKCount < 2) {
            if (this.m_isAutoBuy) {
                this.onBuyChallenge(MessageBoxConst.yes, this.m_isAutoBuy);
            }
            else {
                let info: string = uts.format('是否花费{0}购买1次挑战次数', TextFieldUtil.getYuanBaoText(cost));
                G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onBuyChallenge));
            }
        }
        else {
            G.TipMgr.addMainFloatTip('已经达到挑战次数上限');
        }

    }

    private onBuyChallenge(state: number = 0, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            this.m_isAutoBuy = isCheckSelected;
            let cost: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_BPXD_FRESH_PRICE));
            if (G.DataMgr.heroData.gold >= cost) {
                if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RANKTIME_REFRESH, Macros.PINSTANCE_ID_BPXD));
                }
            }
            else {
                G.TipMgr.addMainFloatTip('钻石不足，请充值！');
            }
        }
    }

    private onTimer(): void {
        let jstzData: Protocol.PinTimeRankInfo = G.DataMgr.pinstanceData.jstzData;
        if (jstzData == null)
            return;
        let currentTime: number = Math.round(G.SyncTime.getCurrentTime() / 1000);

        let timeCd: number = Math.max(0, jstzData.m_iReFreshTime - currentTime);

        let countDownStr: string;
        if (timeCd > 0) {
            if (!this.m_timerStatus) {
                this.m_timerStatus = true;
                this.addTimer("1", 1000, 0, this.onTimer);
            }
            countDownStr = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(timeCd), Color.GREEN);
        }
        else {
            if (this.m_timerStatus) {
                this.m_timerStatus = false;
                this.removeTimer("1");
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKTIMEINFO, Macros.PINSTANCE_ID_BPXD));
            }
            countDownStr = TextFieldUtil.getColorText('挑战次数已满', Color.GREY);
        }
        this.txtEwaiFreeTime.text = uts.format('额外免费次数倒计时：{0}', countDownStr);
    }

    //显示奖励物品
    private showRewardIcon() {
        let day: number = this.getActDay();
        let cfg: GameConfig.JSTZM = G.DataMgr.activityData.getJstzCfg_Flash(day);
        //for (let i: number = 0; i < cfg.m_iItemCount; i++) {
        //    this.rewardIconItem[i].updateById(cfg.m_stItemList[i].m_iID, cfg.m_stItemList[i].m_iCount);
        //    this.rewardIconItem[i].setTipFrom(TipFrom.normal);
        //    this.rewardIconItem[i].updateIcon();
        //}     
        this.showMonsterModle(cfg);
    }

    //显示Boss的模型
    private showMonsterModle(cfg: GameConfig.JSTZM) {
        let config = MonsterData.getMonsterConfig(cfg.m_iMonsterID);
        let monsterId = config.m_szModelID;
        this.monsterModelId = cfg.m_iMonsterID;
        Game.Tools.SetGameObjectLocalScale(this.bossTransform, config.m_ucUnitScale, config.m_ucUnitScale, config.m_ucUnitScale);
        G.ResourceMgr.loadModel(this.bossTransform, UnitUtil.getRealMonsterType(config.m_ucModelFolder), monsterId.toString(), this.sortingOrder, true);
    }

    private getActDay(): number {
        let startTime: number = Math.floor(G.SyncTime.getDateAfterStartServer());
         if (startTime > 7) {
             let currentTime: number = (G.SyncTime.getCurrentTime());
             let date = new Date();
             date.setTime(currentTime);
             startTime = (date.getDay() + 6) % 7 + 8;
        }
        if (defines.has('DEVELOP')) {
            uts.log("急速挑战  当前配置ID: " + startTime);
        }
      
        return startTime;
    }
}
class JSTZrankItem extends ListItemCtrl {
    private data: JstzItemData;
    /**排名*/
    private txtRank: UnityEngine.UI.Text;
    /**名字*/
    private txtName: UnityEngine.UI.Text;
    /**通关时间*/
    private txtTime: UnityEngine.UI.Text;
    private iconParent: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    protected icon: UnityEngine.UI.Image;
    private iconAltas: Game.UGUIAltas;

    private iconReard: UnityEngine.GameObject;
    private iconItem: IconItem;
    private rewardItemData: RewardIconItemData;

    setComponents(go: UnityEngine.GameObject, iconAltas: Game.UGUIAltas, itemIcon_Normal: UnityEngine.GameObject) {
        this.txtRank = ElemFinder.findText(go, 'bg2/txtRank');
        this.txtName = ElemFinder.findText(go, 'bg2/txtName');
        this.txtTime = ElemFinder.findText(go, 'bg2/txtTime');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.icon = ElemFinder.findImage(go, 'bg2/icon');
        this.iconAltas = iconAltas;

        this.iconReard = ElemFinder.findObject(go, "bg2/rewardIcon");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.iconReard);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.rewardItemData = new RewardIconItemData();

        Game.UIClickListener.Get(this.icon.gameObject).onClick = delegate(this, this.onIconClick);
    }

    private onIconClick(): void {
        // 文本tip
        let str: string = "";
        let fight: number = 0;
        for (let item of this.data.cfg.m_astAttrList) {
            str += KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, item.m_ucPropId) + ": + " + item.m_ucPropValue + "\n";
            fight += FightingStrengthUtil.calStrengthByOneProp(item.m_ucPropId, item.m_ucPropValue);
        }

        str += '\n战斗力 + ' + fight;
        let textTipData = new TextTipData();
        textTipData.setTipData(str);
        G.ViewCacher.tipsView.open(textTipData, TipFrom.normal);
    }

    update(vo: JstzItemData, index: number) {
        this.data = vo;
        this.txtRank.text = this.data.rank.toString();
        this.txtName.text = this.data.roleName;
        if (this.data.roleID != null) {
            this.txtTime.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(this.data.time), this.data.isHero ? Color.GREEN : Color.DEFAULT_WHITE);
        }
        else {
            this.txtTime.text = TextFieldUtil.getColorText('00:00:00', Color.GREY);
        }
        let cfg: GameConfig.JSTZRankM = this.data.cfg;
        this.icon.sprite = this.iconAltas.Get(cfg.m_uiClass.toString());

        let reward: GameConfig.JSTZCfgItem = cfg.m_stItemList[0];
        if (reward != null && reward.m_iID > 0) {
            this.iconItem.gameObject.SetActive(true);
            this.iconReard.SetActive(true);
            this.rewardItemData.id = reward.m_iID;
            this.rewardItemData.number = reward.m_iCount;
            this.iconItem.updateByRewardIconData(this.rewardItemData);
            this.iconItem.updateIcon();
        }
        else {
            this.iconItem.gameObject.SetActive(false);
            this.iconReard.SetActive(false);
        }
    }
}

