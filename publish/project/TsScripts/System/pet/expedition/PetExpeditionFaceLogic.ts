import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetExpeditionBaseLogic } from 'System/pet/expedition/PetExpeditionBaseLogic'
import { PetExpeditionData } from 'System/data/pet/PetExpeditionData'
import { RewardView } from 'System/pinstance/selfChallenge/RewardView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumRewardState, EnumStoreID } from 'System/constants/GameEnum'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MallView } from 'System/business/view/MallView'
import { PriceBar } from 'System/business/view/PriceBar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { PetView } from 'System/pet/PetView'

enum ExpeditionMilestoneState {
    none = 0,
    passed,
    ing,
    locked,
}

class ExpeditionMilestone {
    private bg: UnityEngine.GameObject;

    private lock: UnityEngine.GameObject;
    private textLv: UnityEngine.UI.Text;
    private priceBar: PriceBar;

    cfg: GameConfig.WYYZLevelCfgM;
    private state = ExpeditionMilestoneState.none;

    private logic: PetExpeditionFaceLogic;

    constructor(logic: PetExpeditionFaceLogic, cfg: GameConfig.WYYZLevelCfgM) {
        this.logic = logic;
        this.cfg = cfg;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.bg = ElemFinder.findObject(go, 'bg');

        this.lock = ElemFinder.findObject(go, 'lock');
        this.textLv = ElemFinder.findText(go, 'Text');
        this.textLv.text = this.cfg.m_iID.toString();

        this.priceBar = new PriceBar();
        let priceBarGo = ElemFinder.findObject(go, 'yzbBack/currencyBar');
        this.priceBar.setComponents(priceBarGo);
        this.priceBar.setCurrencyID(KeyWord.MONEY_ID_WYYZ);
        this.priceBar.setPrice(this.cfg.m_stItemList[0].m_iCount);

        Game.UIClickListener.Get(this.bg).onClick = delegate(this, this.onClickBg);
    }

    update(crtLevel: number, petCnt: number) {
        if (crtLevel >= this.cfg.m_iID) {
            this.state = ExpeditionMilestoneState.passed;
        } else if (crtLevel + 1 == this.cfg.m_iID && petCnt >= this.cfg.m_iNum) {
            this.state = ExpeditionMilestoneState.ing;
        } else {
            this.state = ExpeditionMilestoneState.locked;
        }

        let isLocked = ExpeditionMilestoneState.locked == this.state;
        UIUtils.setGrey(this.bg, isLocked);
        this.lock.SetActive(isLocked);
        this.textLv.gameObject.SetActive(!isLocked);
    }

    private onClickBg() {
        if (ExpeditionMilestoneState.ing == this.state) {
            this.logic.onClickBtnGo();
        }
    }

    get State(): ExpeditionMilestoneState {
        return this.state;
    }

    get Position() {
        return this.bg.transform.position;
    }
}

class ExpeditionPage {
    private milestones: ExpeditionMilestone[] = [];
    private arrows: UnityEngine.GameObject[] = [];

    private index = 0;
    gameObject: UnityEngine.GameObject;

    private logic: PetExpeditionFaceLogic;

    constructor(logic: PetExpeditionFaceLogic, index: number) {
        this.logic = logic;
        this.index = index;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;

        let expeditionData = G.DataMgr.petExpeditionData;
        for (let i = 0; i < PetExpeditionData.PageSize; i++) {
            let milestone = new ExpeditionMilestone(this.logic, expeditionData.getWyyzLevelConfig(this.index * PetExpeditionData.PageSize + i + 1));
            milestone.setComponents(ElemFinder.findObject(go, i.toString()));
            this.milestones.push(milestone);
        }

        for (let i = 0; i < PetExpeditionData.PageSize; i++) {
            this.arrows.push(ElemFinder.findObject(go, 'arrow' + i));
        }
    }

    update(crtLevel: number, petCnt: number) {
        for (let i = 0; i < PetExpeditionData.PageSize; i++) {
            let milestone = this.milestones[i];
            milestone.update(crtLevel, petCnt);
        }

        for (let i = 0; i < PetExpeditionData.PageSize - 1; i++) {
            let arrow = this.arrows[i];
            let fore = this.milestones[i];
            let next = this.milestones[i + 1];
            UIUtils.setGrey(arrow, ExpeditionMilestoneState.passed != fore.State || ExpeditionMilestoneState.locked == next.State);
        }

        let nextPageArrow = this.arrows[PetExpeditionData.PageSize - 1];
        if (nextPageArrow) {
            let fore = this.milestones[PetExpeditionData.PageSize - 1];
            // 下一阶是否可打
            let nextState = 0;
            let nextId = (this.index + 1) * PetExpeditionData.PageSize + 1;
            let nextCfg = G.DataMgr.petExpeditionData.getWyyzLevelConfig(nextId);
            if (crtLevel >= nextId) {
                nextState = ExpeditionMilestoneState.passed;
            } else if (crtLevel + 1 == nextId && petCnt >= nextCfg.m_iNum) {
                nextState = ExpeditionMilestoneState.ing;
            } else {
                nextState = ExpeditionMilestoneState.locked;
            }
            UIUtils.setGrey(nextPageArrow, ExpeditionMilestoneState.passed != fore.State || ExpeditionMilestoneState.locked == nextState);
        }
    }

    getMilestone(index: number): ExpeditionMilestone {
        return this.milestones[index];
    }
}

export class PetExpeditionFaceLogic extends PetExpeditionBaseLogic {

    private btnRule: UnityEngine.GameObject;

    private pages: ExpeditionPage[] = [];
    private crtPageIdx = -1;
    private oldAutoPageIdx = -1;

    private btnChest: UnityEngine.GameObject;
    private chestOpened: UnityEngine.GameObject;
    private chestEffect: UnityEngine.GameObject;

    private btnStore: UnityEngine.GameObject;

    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;

    private btnLeft: UnityEngine.GameObject;

    private btnRight: UnityEngine.GameObject;

    private textStatus: UnityEngine.UI.Text;
    private textCountDown: UnityEngine.UI.Text;

    private selected: UnityEngine.GameObject;

    private currencyBar: PriceBar;
    private pageCnt = 0;

    private canGo = false;

    initElements(elems: UiElements) {
        this.pageCnt = Math.ceil(Macros.MAX_WYYZ_LEVEL / PetExpeditionData.PageSize);
        for (let i = 0; i < this.pageCnt; i++) {
            let page = new ExpeditionPage(this, i);
            page.setComponents(elems.getElement('page' + i));
            this.pages.push(page);
        }

        this.btnChest = elems.getElement('btnChest');
        this.chestOpened = elems.getElement('chestOpened');
        this.chestEffect = elems.getElement('chestEffect');

        this.btnStore = elems.getElement('btnStore');
        this.btnGo = elems.getElement('btnGo');
        this.labelBtnGo = elems.getText('labelBtnGo');

        this.btnLeft = elems.getElement('btnLeft');
        this.btnRight = elems.getElement('btnRight');

        this.textStatus = elems.getText('textStatus');
        this.textCountDown = elems.getText('textCountDown');

        this.btnRule = elems.getElement('btnRule');

        this.selected = elems.getElement('selected');

        this.currencyBar = new PriceBar();
        this.currencyBar.setComponents(elems.getElement('currencyBar'));
        this.currencyBar.setCurrencyID(KeyWord.MONEY_ID_WYYZ);
    }

    initListeners() {
        Game.UIClickListener.Get(this.btnStore).onClick = delegate(this, this.onClickBtnStore);
        Game.UIClickListener.Get(this.btnChest).onClick = delegate(this, this.onClickBtnChest);
        Game.UIClickListener.Get(this.btnLeft).onClick = delegate(this, this.onClickBtnLeft);
        Game.UIClickListener.Get(this.btnRight).onClick = delegate(this, this.onClickBtnRight);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
        Game.UIClickListener.Get(this.btnRule).onClick = delegate(this, this.onClickBtnRule);
    }

    protected onOpen() {
        super.onOpen();
        this.panel.map.SetActive(true);
        this.panel.info.SetActive(false);
        this.panel.choose.SetActive(false);
        this.panel.bottom.SetActive(true);
        this.panel.mapBottom.SetActive(true);
        this.panel.infoBottom.SetActive(false);
    }

    protected onClose() {
        this.oldAutoPageIdx = 0;
    }

    onPanelClosed() {
    }

    onExpeditionChange() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        let refreshTime = 0;
        if (null != info) {
            level = info.m_iTGLevel;    
            refreshTime = info.m_uiFreshTime;
        }
        this.autoJumpPage();
        // 显示下一关的信息
        if (level < Macros.MAX_WYYZ_LEVEL) {
            let nextCfg = expeditionData.getWyyzLevelConfig(level + 1);
            let isPetNumOk = G.DataMgr.petData.getActivedPets().length >= nextCfg.m_iNum;
            let color = isPetNumOk ? Color.GREEN : Color.RED;
            this.textStatus.text = uts.format('收集{0}个伙伴开启', TextFieldUtil.getColorText(nextCfg.m_iNum.toString(), color));
            UIUtils.setButtonClickAble(this.btnGo, isPetNumOk);
            this.labelBtnGo.text = isPetNumOk ? uts.format('挑战{0}关', level + 1) : '未达成';
        } else {
            let nz = Math.floor(G.SyncTime.getCurrentTime() / 86400000);
            let rz = Math.floor(refreshTime / 86400);
            this.textStatus.text = uts.format('已完成全部关卡，将在{0}天后重置进度', Math.max(1, rz - nz));
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.labelBtnGo.text = '全通关';
        }

        // 重置倒计时
        this.onTickTimer(null);
        this.chestBtnState();
       
    }

    onCurrencyChange(id: number) {
        if (0 == id || KeyWord.MONEY_ID_WYYZ == id) {
            this.currencyBar.setPrice(G.DataMgr.heroData.yuanZhengBi);
        }
    }

    private openPage(pageIdx: number) {
        this.crtPageIdx = pageIdx;
        UIUtils.setButtonClickAble(this.btnLeft, pageIdx > 0);
        UIUtils.setButtonClickAble(this.btnRight, pageIdx < this.pageCnt - 1);

        for (let i = 0; i < this.pageCnt; i++) {
            let page = this.pages[i];
            page.gameObject.SetActive(i == this.crtPageIdx);
        }

        this.updateCrtPage();
    }

    private updateCrtPage() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        if (null != info) {
            level = info.m_iTGLevel;
        }

        let page = this.pages[this.crtPageIdx];
        page.update(level, G.DataMgr.petData.getActivedPets().length);

        if (level >= this.crtPageIdx * PetExpeditionData.PageSize && level <= (this.crtPageIdx + 1) * PetExpeditionData.PageSize - 1) {
            this.selected.transform.position = page.getMilestone(level % PetExpeditionData.PageSize).Position;
            this.selected.SetActive(true);
        } else {
            this.selected.SetActive( false);
        }
    }

    private onClickBtnChest() {
        let levelData = G.DataMgr.petExpeditionData.getWyyzLevelConfig((this.crtPageIdx + 1) * PetExpeditionData.PageSize);
        let dropId = levelData.m_iLevelReward;
        let cfg = DropPlanData.getDropPlanConfig(dropId);
        let itemDatas: RewardIconItemData[] = [];
        for (let i = 0; i < cfg.m_ucDropThingNumber; i++) {
            let item = new RewardIconItemData();
            let itemInfo = cfg.m_astDropThing[i];
            item.id = itemInfo.m_iDropID;
            item.number = itemInfo.m_uiDropNumber;
            itemDatas.push(item);
        }

        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        let hasGetReward = false;
        if (null != info) {
            level = info.m_iTGLevel;
            hasGetReward = 0 != (info.m_iTGRewardBit & 1 << ((this.crtPageIdx + 1) * PetExpeditionData.PageSize - 1));;
        }

        let state: EnumRewardState;
        if (hasGetReward) {
            state = EnumRewardState.HasGot;
        } else if (level >= (this.crtPageIdx + 1) * PetExpeditionData.PageSize) {
            state = EnumRewardState.NotGot;
        } else {
            state = EnumRewardState.NotReach;
        }
        G.Uimgr.createForm<RewardView>(RewardView).open(itemDatas, uts.format('第{0}关通关奖励', (this.crtPageIdx + 1) * PetExpeditionData.PageSize), state, delegate(this, this.onClickGetReward));
    }

    private onClickGetReward() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzGetRewardRequest((this.crtPageIdx + 1) * PetExpeditionData.PageSize));
        this.autoJumpPage();
    }

    private onClickBtnStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.YuanZheng);
        G.Uimgr.bindCloseCallback(MallView, PetView, KeyWord.OTHER_FUNCTION_PET_EXPEDITION);
    }

    onClickBtnGo() {
        this.panel.gotoInfo();
    }

    private onClickBtnLeft() {
        if (this.crtPageIdx > 0) {
            this.openPage(this.crtPageIdx - 1);
            this.chestBtnState();
        }
    }

    private onClickBtnRight() {
        if (this.crtPageIdx < this.pageCnt - 1) {
            this.openPage(this.crtPageIdx + 1);
            this.chestBtnState();
        }
    }

    onTickTimer(timer: Game.Timer) {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let crtLv = 0;
        let leftSeconds = 0;
        if (null != info) {
            crtLv = info.m_iTGLevel;
            leftSeconds = Math.max(0, info.m_uiFreshTime - Math.floor(G.SyncTime.getCurrentTime() / 1000));
        }

        this.textCountDown.text = uts.format('当前进度：{0}/{1}，下次重置:{2}', crtLv, Macros.MAX_WYYZ_LEVEL, DataFormatter.second2day(leftSeconds));
    }

    private onClickBtnRule() {
        let content = G.DataMgr.langData.getLang(411);
        content = RegExpUtil.xlsDesc2Html(content);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }

    private chestBtnState( )
    {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        let hasGetReward: boolean = false;
        if (null != info) {
            level = info.m_iTGLevel;          
            hasGetReward = 0 != (info.m_iTGRewardBit &1<< ((this.crtPageIdx + 1) * PetExpeditionData.PageSize - 1));
        }
        
        this.btnChest.SetActive(!hasGetReward);
        this.chestOpened.SetActive(hasGetReward);
        this.chestEffect.SetActive(!hasGetReward && level >= (this.crtPageIdx + 1) * PetExpeditionData.PageSize);
    }

    private  autoJumpPage()
    {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let nextPageIdx = 0;
        for (let i = 1; i <= this.pageCnt; i++) {
            let hasGetReward = 0 != (info.m_iTGRewardBit & 1 << (i * PetExpeditionData.PageSize - 1));
            if (!hasGetReward)
            {
                nextPageIdx = i;
                break;
            }
        }
        if (nextPageIdx == 0)
        {
            nextPageIdx = this.pageCnt;
        }
        this.openPage(nextPageIdx-1);
    }
}