import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { GameObjectGetSet, TextGetSet } from '../../uilib/CommonForm';
import { FixedList } from '../../uilib/FixedList';
import { List } from '../../uilib/List';
import { TabSubForm } from '../../uilib/TabForm';
import { ElemFinder } from '../../uilib/UiUtility';
import { ActivityRuleView } from '../../diandeng/ActivityRuleView';
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipData } from 'System/data/VipData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { Color } from 'System/utils/ColorUtil';
import { VipView } from "System/vip/VipView";
import { Macros } from 'System/protocol/Macros';
import { BossView } from 'System/pinstance/boss/BossView'
import { ProtocolUtil } from '../../protocol/ProtocolUtil';

export class WoodsBossPanel extends TabSubForm {
    private iconitemPrefab: UnityEngine.GameObject;
    private readonly bossPlise = 2;
    private readonly maxCollectNumber = 10;
    private bossList: FixedList;
    private bossItems: WoodsBossItem[] = [];
    private txtTitle: TextGetSet;
    //private txtSubhead: TextGetSet;
    private txtSeedNumber: TextGetSet;
    private txtMonsterNumber: TextGetSet;

    private btnRule: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private btnGoName: TextGetSet;
    private finished: GameObjectGetSet;
    private curListSelectIndex: number = 0;

    private selectConfig: GameConfig.ForestBossCfgM;
    /**落日森林回复数据*/
    private m_stForestBossActOpenRsp: Protocol.ForestBossActOpenRsp;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WOODS_BOSS);
    }

    protected resPath(): string {
        return UIPathData.WoodsBossPanel;
    }

    protected initElements() {
        this.iconitemPrefab = this.elems.getElement("");

        this.bossList = this.elems.getUIFixedList("bossList");
        for (let i = 0; i < this.bossPlise; i++) {
            let item = new WoodsBossItem();
            item.setCommonpents(this.bossList.GetItem(i).gameObject, this.iconitemPrefab);
            this.bossItems.push(item);
        }
        this.txtTitle = new TextGetSet(this.elems.getText("txtTitle"));
        //this.txtSubhead = new TextGetSet(this.elems.getText("txtSubhead"));
        this.txtSeedNumber = new TextGetSet(this.elems.getText("txtSeedNumber"));
        this.txtMonsterNumber = new TextGetSet(this.elems.getText("txtMonsterNumber"));

        this.btnRule = this.elems.getElement("btnRule");
        this.btnGo = this.elems.getElement("btnGo");
        this.btnGoName = new TextGetSet(this.elems.getText("btnGoName"));

        this.finished = new GameObjectGetSet(this.elems.getElement("finished"));
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickRule);
        this.addClickListener(this.btnGo, this.onClickGO);
        this.addListClickListener(this.bossList, this.onClickBossList);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_FOREST_BOSS, Macros.ACTIVITY_FOREST_BOSS_OPEN));
        this.bossList.Selected = 0;
        this.updateView();
    }

    protected onClose() {

    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(482), "规则说明");
    }

    private onClickGO() {
        if (this.funcIsOpen()) {
            if (this.curListSelectIndex == 1) {//选择白银特权那一层
                if (VipData.getVipPriKeyWord() > 0) {//有白银以上的特权
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_FOREST_BOSS, Macros.PINSTANCE_ID_FOREST_BOSS, this.curListSelectIndex + 1);
                    G.Uimgr.closeForm(BossView);
                } else {
                    G.TipMgr.showConfirm(uts.format('激活{0}可进入落日森林第二层', TextFieldUtil.getColorText("白银VIP", Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
                }
            } else {
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_FOREST_BOSS, Macros.PINSTANCE_ID_FOREST_BOSS, this.curListSelectIndex + 1);
                G.Uimgr.closeForm(BossView);
            }
        }
        else {
            G.TipMgr.addMainFloatTip("落日森林在9:00~23:00可进入");
        }
    }

    private onGoToVipPanel(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    private onClickBossList(index: number) {
        this.curListSelectIndex = index;
        this.updateView();

    }



    updateView() {
        this.m_stForestBossActOpenRsp = G.DataMgr.pinstanceData.m_stForestBossActOpenRsp;
        let startServerDay = G.SyncTime.getDateAfterStartServer();
        startServerDay = startServerDay > 7 ? 7 : startServerDay;
        if (this.curListSelectIndex == 0) {
            this.txtTitle.text = "一层";
        } else {
            this.txtTitle.text = "二层";
        }
        if (this.m_stForestBossActOpenRsp == null) {
            //更新ListItem
            for (let i = 0; i < this.bossPlise; i++) {
                this.bossItems[i].update(G.DataMgr.pinstanceData.getForestBossConfig(i + 1, startServerDay), 0);
            }
            this.txtSeedNumber.text = uts.format("灵药种子：{0}/{1}", 0, G.DataMgr.constData.getValueById(KeyWord.PARAM_FOREST_BOSS_COLLECT_COUNT));
            this.txtMonsterNumber.text = uts.format("消灭怪物可获得大量经验\n今日剩余{0}只", G.DataMgr.constData.getValueById(KeyWord.PARAM_FORESTBOSS_MONSTER_PRIZE_COUNT));
            this.finished.SetActive(false);
        } else {
            //更新ListItem
            for (let i = 0; i < this.bossPlise; i++) {
                this.bossItems[i].update(G.DataMgr.pinstanceData.getForestBossConfig(i + 1, startServerDay), i == 0 ? this.m_stForestBossActOpenRsp.m_iBoss1Number : this.m_stForestBossActOpenRsp.m_iBoss2Number);
            }
            this.txtSeedNumber.text = uts.format("灵药种子：{0}/{1}", this.m_stForestBossActOpenRsp.m_iCollectNumber, G.DataMgr.constData.getValueById(KeyWord.PARAM_FOREST_BOSS_COLLECT_COUNT));
            let num = Math.max(0, G.DataMgr.constData.getValueById(KeyWord.PARAM_FORESTBOSS_MONSTER_PRIZE_COUNT) - this.m_stForestBossActOpenRsp.m_iKillMonsterNumber);
            this.txtMonsterNumber.text = uts.format("消灭怪物可获得大量经验\n今日剩余{0}只", num);
            this.finished.SetActive(this.m_stForestBossActOpenRsp.m_iCollectNumber >= this.maxCollectNumber);
        }

        if (this.funcIsOpen) {
            this.btnGoName.text = "立即前往";
        } else {
            this.btnGoName.text = "9:00~23:00开启";
        }
    }

    //功能是否开启
    private funcIsOpen(): boolean {
        let hour = G.SyncTime.getDateHour();
        if (hour >= 9 && hour < 23) {
            return true;
        }
        return false;
    }

}

export class WoodsBossItem {
    private awardList: List;
    private itemIconPrefan: UnityEngine.GameObject;
    private txtDescribe: TextGetSet;
    protected iconItems: IconItem[] = [];

    setCommonpents(obj: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.awardList = ElemFinder.getUIList(ElemFinder.findObject(obj, "awardList"));
        this.txtDescribe = new TextGetSet(ElemFinder.findText(obj, "txtDescribe"));
    }
    update(forestBossCfgM: GameConfig.ForestBossCfgM, bossCount: number) {
        if (forestBossCfgM) {
            let rewardCnt = forestBossCfgM.m_iItemID.length
            let count = 0;
            for (let i = 0; i < rewardCnt; i++) {
                if (forestBossCfgM.m_iItemID[i] > 0) {
                    count++;
                }
            }
            this.awardList.Count = count;
            let oldIconCnt = this.iconItems.length;
            let item: IconItem;
            for (let i: number = 0; i < rewardCnt; i++) {
                if (forestBossCfgM.m_iItemID[i] > 0) {
                    if (i < oldIconCnt) {
                        item = this.iconItems[i];
                    } else {
                        this.iconItems.push(item = new IconItem());
                        item.setTipFrom(TipFrom.normal);
                        let itemGo = this.awardList.GetItem(i).gameObject;
                        item.setUsuallyIcon(itemGo);
                    }
                    item.updateById(forestBossCfgM.m_iItemID[i]);
                    item.updateIcon();
                }
            }
            this.txtDescribe.text = uts.format("魂兽数量：{0}", bossCount);
        }
    }

}