import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { TeamFbView, TeamFbListBaseItem } from 'System/teamFb/TeamFbView'
import { Macros } from 'System/protocol/Macros'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { FsdItemData, EnumFsdState } from 'System/data/vo/FsdItemData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { PinstanceData } from 'System/data/PinstanceData'
import { DropPlanData } from 'System/data/DropPlanData'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumStoreID, EnumKuafuPvpStatus } from 'System/constants/GameEnum'
import { MallView } from 'System/business/view/MallView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'

class FaShenDianListItem extends TeamFbListBaseItem {

    /**可挑战*/
    private challengableGo: UnityEngine.GameObject;
    /**未开启*/
    private unavailableGo: UnityEngine.GameObject;
    /**扫荡按钮*/
    private btnSaodang: UnityEngine.GameObject;
    private pinstanceId = 0;
    private btnSaoDangText: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.challengableGo = ElemFinder.findObject(go, 'challengable');
        this.unavailableGo = ElemFinder.findObject(go, 'unavailable');
        this.btnSaodang = ElemFinder.findObject(go, 'btnSaodang');
        this.btnSaoDangText = ElemFinder.findText(this.btnSaodang,'Text');
        Game.UIClickListener.Get(this.btnSaodang).onClick = delegate(this, this.onClickBtnSaodang);
    }

    update(vo: FsdItemData) {
        this.pinstanceId = vo.diffConfig.m_iID;
        let cfg = PinstanceData.getConfigByID(this.pinstanceId);
        let isLvMeet: boolean = G.DataMgr.heroData.level >= vo.diffConfig.m_iOpenLevel;
        this.nameText.text = uts.format('{0} {1}级', cfg.m_szName, TextFieldUtil.getColorText(vo.diffConfig.m_iOpenLevel.toString(), (isLvMeet ? Color.GREEN : Color.RED)));
        let state = vo.state;
        switch (state) {
            case EnumFsdState.COMPLETED:
                // 已通关
                this.showStateFlag(this.passFlagGo);
                break;
            case EnumFsdState.CHANLLEGING:
            case EnumFsdState.OPEN:
                // 可挑战
                this.showStateFlag(this.challengableGo);
                break;
            case EnumFsdState.CLOSED:
            case EnumFsdState.LIMITED:
            default:
                // 未开启
                this.showStateFlag(this.unavailableGo);
                break;
        }     
        //this.btnShop.enabled = vo.isShopOpen;
        if (G.DataMgr.heroData.level >= vo.diffConfig.m_iSweepLevel) {
            //达到扫荡等级
            UIUtils.setButtonClickAble(this.btnSaodang, vo.canSd);
            this.btnSaoDangText.text = '一键扫荡';
        } else {
            UIUtils.setButtonClickAble(this.btnSaodang, false);
            this.btnSaoDangText.text = uts.format('达到{0}级可扫荡', vo.diffConfig.m_iSweepLevel);
        }
        if (EnumFsdState.COMPLETED == state) {
            this.rewardTypeGo.SetActive(false);
            this.rewardList.gameObject.SetActive(false);
        }
        else {
            this.rewardTypeGo.SetActive(true);
            let diffThingVec: GameConfig.PinstanceDiffThing[];
            if (vo.maxProgress >= vo.layer * PinstanceData.FaShenDianLayersPerId) {
                // 终生已通
                diffThingVec = vo.diffConfig.m_stDailyBonus;
                this.lifePassGo.SetActive(true);
                this.todayPassGo.SetActive(false);
            }
            else {
                diffThingVec = vo.diffConfig.m_stLifeBonus;
                this.lifePassGo.SetActive(false);
                this.todayPassGo.SetActive(true);
            }
            let rewardCnt = diffThingVec.length;
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
                item.updateById(diffThingVec[i].m_iThingId, diffThingVec[i].m_iThingNum);
                item.updateIcon();
            }
            this.rewardList.gameObject.SetActive(true);
        }
    }

    private showStateFlag(showFlag: UnityEngine.GameObject) {
        this.passFlagGo.SetActive(this.passFlagGo == showFlag);
        this.challengableGo.SetActive(this.challengableGo == showFlag);
        this.unavailableGo.SetActive(this.unavailableGo == showFlag);
    }

    private onClickBtnSaodang() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(this.pinstanceId, false));
    }
}

export class FaShenDianPanel extends TeamFbView {

    private faShenDianIds: number[] = [];

    private listData: FsdItemData[] = [];

    private textShenhun: UnityEngine.UI.Text;

    /**商店按钮*/
    private btnShop: UnityEngine.GameObject;

    private btnRule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_FSD);
        let itemData: FsdItemData;
        //for (let i: number = 0; i < PinstanceIDUtil.FaShenDianNum; i++) {
        //    let pid = Macros.PINSTANCE_ID_FSD_BASE + i;
        //    this.faShenDianIds.push(pid);
        //    this.listData.push(itemData = new FsdItemData());
        //    itemData.layer = i + 1;
        //    itemData.diffConfig = PinstanceData.getDiffBonusData(pid, PinstanceData.FaShenDianLayersPerId);
        //}
    }

    protected resPath(): string {
        return UIPathData.FaShenDianView;
    }

    protected initElements(): void {
        super.initElements();

        this.textShenhun = this.elems.getText('textShenhun');
        this.btnShop = this.elems.getElement('btnShop');
        this.btnRule = this.elems.getElement('btnRule');
    }

    protected initListeners(): void {
        super.initListeners();

        this.addClickListener(this.btnShop, this.onClickBtnShop);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected updatePinstanceList() {
        //// 刷新副本信息
        //let fsdData = G.DataMgr.pinstanceData.fsdData;
        //for (let i = 0; i < PinstanceIDUtil.FaShenDianNum; i++) {
        //    let itemData = this.listData[i];
        //    if (null != fsdData) {
        //        itemData.maxProgress = fsdData.m_iMaxLevel;
        //        itemData.progress = fsdData.m_stFSDPinInfo[i].m_ucLevel;
        //    }
        //    else {
        //        itemData.maxProgress = 0;
        //        itemData.progress = 0;
        //    }

        //    let item = this.listItems[i];
        //    item.update(itemData);
        //}

        //this.textShenhun.text = G.DataMgr.heroData.shenhun.toString();
    }

    protected canPlay(index: number): boolean {
        if (EnumFsdState.CLOSED != this.listData[index].state) {
            let cfg = this.getPinstanceCfgByIdx(index);
            return G.DataMgr.heroData.level >= cfg.m_iLevelLow;
        }
        return false;
    }

    protected getPinstanceCfgByIdx(index: number): GameConfig.PinstanceConfigM {
        return PinstanceData.getConfigByID(this.faShenDianIds[index]);
    }

    protected newListItemCtrl(): TeamFbListBaseItem {
        return new FaShenDianListItem();
    }

    protected getPinstanceIDs(): number[] {
        return this.faShenDianIds;
    }

    protected getPinstanceIdx(id: number): number {
        let count = this.listData.length;
        for (let i = 0; i < count; i++) {
            if (this.faShenDianIds[i] == id) {
                return i;
            }
        }
        return -1;
    }

    private onClickBtnShop() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.SHSX_ID);
        G.Uimgr.bindCloseCallback(MallView, PinstanceHallView, this.id);
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(266), '规则介绍');
    }
}