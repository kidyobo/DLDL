import { Global as G } from "System/global"
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { UnitUtil } from 'System/utils/UnitUtil'
import { EnumMonsterID, UnitCtrlType } from 'System/constants/GameEnum'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { MonsterData } from 'System/data/MonsterData'
import { UIUtils } from 'System/utils/UIUtils'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from "System/utils/DataFormatter";
import { ThingData } from 'System/data/thing/ThingData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { OpenChestView } from "System/guide/OpenChestView";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView'
import { PathingState } from "System/constants/GameEnum";
import { TipMarkUtil } from "System/tipMark/TipMarkUtil";


class BossZhaoHuanItem {

    private readonly KFBOSS_SUMMON_TYPE: number[] = [Macros.KFBOSS_SUMMON_TYPE_GENERAL, Macros.KFBOSS_SUMMON_TYPE_ELITE, Macros.KFBOSS_SUMMON_TYPE_LEGEND];
    private readonly BTN_LABEL: string[] = ["普通召唤(1点)", "精英召唤(5点)", "传奇召唤(10点)"];
    private readonly KFBOSS_SUMMON_NEED: number[] = [1, 5, 10];

    private root: UnityEngine.GameObject;
    private btnZhaoHuan: UnityEngine.GameObject;
    //private status: UnityEngine.GameObject;
    //private txtName: UnityEngine.UI.Text;
    private txtLabel: UnityEngine.UI.Text;
    private reminToggle: UnityEngine.UI.ActiveToggle;

    private index: number = 0;
    private data: Protocol.SummonBossInfo;
    private bossPos: number[];

    setComponents(go: UnityEngine.GameObject, bossPos: number[]) {
        this.root = ElemFinder.findObject(go, "root");
        this.btnZhaoHuan = ElemFinder.findObject(go, "btnZhaoHuan");
        //this.status = ElemFinder.findObject(go, "status");
        //this.txtName = ElemFinder.findText(go, "txtName");
        this.txtLabel = ElemFinder.findText(go, "btnZhaoHuan/Text");
        this.reminToggle = ElemFinder.findActiveToggle(go,'reminToggle');
        this.bossPos = bossPos;
        Game.UIClickListener.Get(this.btnZhaoHuan).onClick = delegate(this, this.onClickZhaoHuan);
        Game.UIClickListener.Get(this.reminToggle.gameObject).onClick = delegate(this, this.onClickReminToggle);
    }

    update(data: Protocol.SummonBossInfo, leftValue: number, index: number, sortingOrder: number) {
        this.data = data;
        this.index = index;
        let monsterData = MonsterData.getMonsterConfig(data.m_iBossID);
        let SelectData = G.DataMgr.activityData.BOSSZhanHuanData.BossSummonPanelInfo.m_usWarnSelect;
        this.reminToggle.isOn = 0 == (SelectData & 1 << index);
        G.ResourceMgr.loadModel(this.root, UnitUtil.getRealMonsterType(monsterData.m_ucModelFolder), monsterData.m_szModelID, sortingOrder, true);

        this.txtLabel.text = this.BTN_LABEL[index];
        //this.txtName.text = monsterData.m_szMonsterName;
        //this.status.SetActive(data.m_iBossNumber > 0);
        let status = G.DataMgr.activityData.getTabStatue(Macros.ICON_START_ACTIVITY).m_stTabStatusList[Macros.TAB_STATUS_16];
        UIUtils.setButtonClickAble(this.btnZhaoHuan, leftValue >= this.KFBOSS_SUMMON_NEED[index] && status>0);
    }


    private onClickZhaoHuan() {
        let type = this.KFBOSS_SUMMON_TYPE[this.index];

        if (PathingState.CAN_REACH != G.Mapmgr.goToPos(this.bossPos[0], this.bossPos[1], this.bossPos[2], true, false)) {
            G.Mapmgr.goToPos(this.bossPos[0], this.bossPos[1], this.bossPos[2], false, false)
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON, type));
        G.Uimgr.closeForm(KaiFuHuoDongView);
      
    }

    private onClickReminToggle() {
        let data: number = G.DataMgr.activityData.BOSSZhanHuanData.BossSummonPanelInfo.m_usWarnSelect;
        data ^= (1 << this.index);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_WARN, data));
    }
   

}

/**由于层级问题，单独处理在模型前面的*/
class BossZhaoHuanStatusItem {

    private status: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
   
    setComponents(go: UnityEngine.GameObject, bossPos: number[]) {
        this.status = ElemFinder.findObject(go, "status");
        this.txtName = ElemFinder.findText(go, "txtName");
    }

    update(data: Protocol.SummonBossInfo, leftValue: number, index: number, sortingOrder: number) {
      
        let monsterData = MonsterData.getMonsterConfig(data.m_iBossID);
        this.txtName.text = monsterData.m_szMonsterName;
        this.status.SetActive(data.m_iBossNumber > 0);
    }
}


export class BossZhaoHuanView extends TabSubForm {

    /**boss召唤的坐标，场景3，xy*/
    private readonly BOSS_POSITION: number[] = [3, 7356, 3356];

    private curLeiJiChongZhi: UnityEngine.UI.Text;
    private shengYuPoint: UnityEngine.UI.Text;
    private CDTime: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;
    private DropIds: number[] = [60111107, 60111108];

    private data: Protocol.BossSummonPanelInfo;
    private curTime: number = 0;


    private BossZhaoHuanItem: BossZhaoHuanItem[] = [];
    private BossZhaoHuanStatusItem: BossZhaoHuanStatusItem[] = [];
    private bossList: List;
    private bossStatusList: List;
    private btnGoto: UnityEngine.GameObject;
   

    constructor() {
        super(KeyWord.OTHER_FUNCTION_BOSS_SUMMON);
    }

    protected initElements() {
        this.curLeiJiChongZhi = this.elems.getText('CurLeiJiChongZhi');
        this.CDTime = this.elems.getText('CDTime');
        this.shengYuPoint = this.elems.getText('shengyuPoint');
        this.btnRule = this.elems.getElement("btnRule"); 
        this.bossList = this.elems.getUIList("bossList");
        this.bossStatusList = this.elems.getUIList("bossStatusList");
        this.btnGoto = this.elems.getElement("btnGoto");

        for (let i = 0; i < this.DropIds.length; i++) {
            let rewardList = this.elems.getUIList('rewardList' + (i + 1));
            let dropCfg = DropPlanData.getDropPlanConfig(this.DropIds[i]);
            let dropCnt = dropCfg.m_ucDropThingNumber;
            rewardList.Count = dropCnt;
            for (let i = 0; i < dropCfg.m_astDropThing.length; i++) {
                let iconItem = new IconItem();
                iconItem.setTipFrom(TipFrom.normal);
                iconItem.setUsuallyIcon(rewardList.GetItem(i).gameObject);
                iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                iconItem.updateIcon();
            }
        }
    }


    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnGoto, this.onClickBtnGoto);
    }

    protected resPath(): string {
        return UIPathData.BossZhaoHuanView;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
        this.data = G.DataMgr.activityData.BOSSZhanHuanData.BossSummonPanelInfo;
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }
    private onCountDownTimer() {
        this.CDTime.text = uts.format('冷却中 ' + "{0}", TextFieldUtil.getColorText(DataFormatter.second2day((this.data.m_uiLeftTime--)).toString(), Color.RED));
        if (this.data.m_uiLeftTime <= 0) {
            this.CDTime.gameObject.SetActive(false);
        }
    }


    protected onClose() {

    }

    updateView(): void {

        this.curTime = 0;
        this.data = G.DataMgr.activityData.BOSSZhanHuanData.BossSummonPanelInfo;
        if (this.data == null)
            return;
        this.curLeiJiChongZhi.text = uts.format("当前充值金额 {0} 钻石", TextFieldUtil.getColorText(this.data.m_uiChargeValue.toString(), Color.WHITE));
        this.CDTime.gameObject.SetActive(this.data.m_uiLeftTime > 0);

        this.shengYuPoint.text = uts.format("{0}" + this.data.m_uiLeftValue, TextFieldUtil.getColorText("剩余召唤点数 ", Color.GREEN));
        this.CDTime.text = uts.format('冷却中 ' + "{0}", TextFieldUtil.getColorText(DataFormatter.second2day(this.data.m_uiLeftTime).toString(), Color.RED));

        let len = this.data.m_SummonBossList.m_iBossTypeNum;
        this.bossList.Count = len;
        this.bossStatusList.Count = len;
        for (let i = 0; i < len; i++) {
            if (this.BossZhaoHuanItem[i] == null) {
                let item = this.bossList.GetItem(i).gameObject;
                this.BossZhaoHuanItem[i] = new BossZhaoHuanItem();
                this.BossZhaoHuanItem[i].setComponents(item, this.BOSS_POSITION);

            }

            if (this.BossZhaoHuanStatusItem[i] == null) {
                let item = this.bossStatusList.GetItem(i).gameObject;
                this.BossZhaoHuanStatusItem[i] = new BossZhaoHuanStatusItem();
                this.BossZhaoHuanStatusItem[i].setComponents(item, this.BOSS_POSITION);
            }
            let info = this.data.m_SummonBossList.m_astBossList[i];

            this.BossZhaoHuanItem[i].update(info, this.data.m_uiLeftValue, i, this.sortingOrder);
            this.BossZhaoHuanStatusItem[i].update(info, this.data.m_uiLeftValue, i, this.sortingOrder);
        }

        UIUtils.setButtonClickAble(this.btnGoto, G.DataMgr.activityData.BOSSZhanHuanData.isHasZhaoHuanBoss());
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(381), '规则介绍');
    }

    private onClickBtnGoto() {
        if (PathingState.CAN_REACH != G.Mapmgr.goToPos(this.BOSS_POSITION[0], this.BOSS_POSITION[1], this.BOSS_POSITION[2], true, false)) {
            G.Mapmgr.goToPos(this.BOSS_POSITION[0], this.BOSS_POSITION[1], this.BOSS_POSITION[2], false, false)
        }
        G.Uimgr.closeForm(KaiFuHuoDongView);
    }

    showReward(bossType: number): void {
        let itemCfg: GameConfig.ThingConfigM;
        let BossName: string;
        let color: string;

        if (bossType == Macros.KFBOSS_SUMMON_TYPE_GENERAL) {
            itemCfg = ThingData.getThingConfig(10444041)
            BossName = "普通BOSS";
            color = Color.PURPLE;
        }
        else if (bossType == Macros.KFBOSS_SUMMON_TYPE_ELITE) {
            itemCfg = ThingData.getThingConfig(10444051)
            BossName = "精英BOSS";
            color = Color.GOLD;
        }
        else if (bossType == Macros.KFBOSS_SUMMON_TYPE_LEGEND) {
            itemCfg = ThingData.getThingConfig(10444061)
            BossName = "传奇BOSS";
            color = Color.RED;
        }

        let itemDatas: RewardIconItemData[] = [];
        let itemData = new RewardIconItemData();
        itemData.id = itemCfg.m_iID;
        itemDatas.push(itemData);

        let des = uts.format('您召唤了{0},获得：', TextFieldUtil.getColorText(BossName, color));
        G.Uimgr.createForm<OpenChestView>(OpenChestView).open(des, itemDatas);
    }


}