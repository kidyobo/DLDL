import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { TeamFbView, TeamFbListBaseItem } from 'System/teamFb/TeamFbView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { PinstanceData } from 'System/data/PinstanceData'
import { SxtItemData } from 'System/data/vo/SxtItemData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { UIUtils } from 'System/utils/UIUtils'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { DropPlanData } from 'System/data/DropPlanData'


class ZuDuiFuBenListItem extends TeamFbListBaseItem {

    private readonly MaxRewardCount = 4;
    private leftTimeText: UnityEngine.UI.Text;
    private pinstanceId: number = 0;
    private max_dayEarningTimes: number = 3;
    private bg1:UnityEngine.GameObject;
    private bg2:UnityEngine.GameObject;
    private bg3:UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.nameText = ElemFinder.findText(go, 'nameText');
        this.leftTimeText = ElemFinder.findText(go, 'leftTimeText');
        this.bg1 = ElemFinder.findObject(go, '1');
        this.bg2 = ElemFinder.findObject(go, '2');
        this.bg3 = ElemFinder.findObject(go, '3');
    }

    update(vo: SxtItemData) {
        this.pinstanceId = vo.config.m_iPinstanceID;
        // 名字和需求等级

        let lv = vo.isLvMeet ? G.DataMgr.heroData.level : vo.config.m_iLevelLow;
       
        this.nameText.text = uts.format('{0} {1}级', vo.config.m_szName, TextFieldUtil.getColorText(lv.toString(), (vo.isLvMeet ? Color.GREEN : Color.RED)));
        this.leftTimeText.text = '剩余可收益次数:' + TextFieldUtil.getColorText(vo.leftTimes.toString(), vo.leftTimes > 0 ? Color.GREEN : Color.RED);
        this.bg1.SetActive(vo.config.m_iPinstanceID == 300015);
        this.bg2.SetActive(vo.config.m_iPinstanceID == 300016);
        this.bg3.SetActive(vo.config.m_iPinstanceID == 300017);
       
        let dropCfg = G.DataMgr.pinstanceData.getZuDuiGroupPinLevelDropCfg(vo.config.m_iPinstanceID, lv);
        if (dropCfg) {
           // let dropPlanConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropCfg.m_DropID);
            let rewardCnt = dropCfg.m_stShowList.length;
            this.rewardList.Count = rewardCnt;
            let oldIconCnt = this.iconItems.length;
            let item: IconItem;
            for (let i: number = 0; i < rewardCnt; i++) {
                if (i < oldIconCnt) {
                    item = this.iconItems[i];
                } else {
                    this.iconItems.push(item = new IconItem());
                    item.setTipFrom(TipFrom.normal);
                    let itemGo = this.rewardList.GetItem(i).gameObject;
                    item.setUsuallyIcon(itemGo);
                }
                item.updateById(dropCfg.m_stShowList[i].m_iID, dropCfg.m_stShowList[i].m_iNum);
                item.updateIcon();
            }
        }
    }

}

export class ZuDuiFuBenPanel extends TeamFbView {

    private listData: SxtItemData[] = [];
    private btn_Rule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZDFB);
    }

    protected resPath(): string {
        return UIPathData.ZuDuiFuBenView;
    }

    protected initElements() {
        super.initElements();
        let pinstanceIds = this.getPinstanceIDs();
        let cnt = pinstanceIds.length;
        for (let i: number = 0; i < cnt; i++) {
            let itemData = new SxtItemData();
            itemData.config = PinstanceData.getConfigByID(pinstanceIds[i]);
           // itemData.diffConfig = PinstanceData.getDiffBonusData(pinstanceIds[i], 1);
            this.listData.push(itemData);
        }
        this.listData.sort(this.sortListData);
        this.btn_Rule = this.elems.getElement('btnRule');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btn_Rule, this.onClickBtnRule);
    }


    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(368), '规则介绍');
    }


    /**排序副本列表*/
    private sortListData(a: SxtItemData, b: SxtItemData): number {
        return a.config.m_iLevelLow - b.config.m_iLevelLow;
    }

    protected updatePinstanceList() {
        // 刷新副本信息
        let i: number = 0;
        let itemData: SxtItemData;
        let info: Protocol.ListPinHomeRsp;
        let myZdl: number = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        let cnt = this.listData.length;
        for (let i = 0; i < cnt; i++) {
            let itemData = this.listData[i];
            // 等级是否符合
            itemData.isLvMeet = G.DataMgr.heroData.level >= itemData.config.m_iLevelLow;
            // 剩余次数
            if (itemData.config.m_ucEnterTimes > 0) {
                itemData.leftTimes = G.DataMgr.systemData.getPinstanceLeftTimes(itemData.config);
            }
            else {
                itemData.leftTimes = 0;
            }
           
            let item = this.listItems[i];
            item.update(itemData);
        }
    }


    protected canPlay(index: number): boolean {
        let cfg = this.getPinstanceCfgByIdx(index);
        return G.DataMgr.heroData.level >= cfg.m_iLevelLow;
    }

    protected getPinstanceCfgByIdx(index: number): GameConfig.PinstanceConfigM {
        return this.listData[index].config;
    }

    protected newListItemCtrl(): TeamFbListBaseItem {
        return new ZuDuiFuBenListItem();
    }

    protected getPinstanceIDs(): number[] {
        return PinstanceIDUtil.ZuDuiFuBenIDs;
    }

    protected getPinstanceIdx(id: number): number {
        let count = this.listData.length;
        for (let i = 0; i < count; i++) {
            if (this.listData[i].config.m_iPinstanceID == id) {
                return i;
            }
        }
        return -1;
    }


}