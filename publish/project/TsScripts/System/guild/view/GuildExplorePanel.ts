import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildData } from 'System/data/GuildData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GuildExploreBaseLogic } from 'System/guild/view/GuildExploreBaseLogic'
import { GuildExploreMainLogic } from 'System/guild/view/GuildExploreMainLogic'
import { GuildExploreMonsterLogic } from 'System/guild/view/GuildExploreMonsterLogic'
import { GuildExploreDonateLogic } from 'System/guild/view/GuildExploreDonateLogic'
import { GuildExploreForkLogic } from 'System/guild/view/GuildExploreForkLogic'
import { GuildExploreMoveLogic } from 'System/guild/view/GuildExploreMoveLogic'
import { GuildExploreRewardLogic } from 'System/guild/view/GuildExploreRewardLogic'
import { GuildExploreRankView } from 'System/guild/view/GuildExploreRankView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { GuildView } from 'System/guild/view/GuildView'

enum ExploreEnergyState {
    none,
    full,
    ing,
}

class ExploreEnergy {

    private full: UnityEngine.GameObject;
    private ing: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.full = ElemFinder.findObject(go, 'full');
        this.ing = ElemFinder.findObject(go, 'ing');
    }

    update(state: ExploreEnergyState) {
        this.full.SetActive(ExploreEnergyState.full == state);
        this.ing.SetActive(ExploreEnergyState.ing == state);
    }
}

export class GuildExplorePanel extends TabSubForm {
    private readonly TickTimerKey = 'TickTimerKey';

    private mainLogic: GuildExploreMainLogic;
    private monsterLogic: GuildExploreMonsterLogic;
    private donateLogic: GuildExploreDonateLogic;
    private forkLogic: GuildExploreForkLogic;
    private moveLogic: GuildExploreMoveLogic;
    private rewardLogic: GuildExploreRewardLogic;

    private crtLogic: GuildExploreBaseLogic;

    /**未开启*/
    private main: UnityEngine.GameObject;

    /**已开启*/
    private ing: UnityEngine.GameObject;

    private btnStore1: UnityEngine.GameObject;
    private btnStore2: UnityEngine.GameObject;

    private btnRule1: UnityEngine.GameObject;
    private btnRule2: UnityEngine.GameObject;

    private myEnergies: ExploreEnergy[] = [];
    private textEnergy: UnityEngine.UI.Text;

    itemIcon_Normal: UnityEngine.GameObject;

    imgTitle: UnityEngine.UI.Image;
    titleAltas: Game.UGUIAltas;

    oldMan: UnityEngine.GameObject;
    beauty: UnityEngine.GameObject;
    monster: UnityEngine.GameObject;
    master: UnityEngine.GameObject;

    textOldManTalk: UnityEngine.UI.Text;
    textBeautyTalk: UnityEngine.UI.Text;

    cost: UnityEngine.GameObject;
    costEnergies: UnityEngine.GameObject[] = [];

    fork: UnityEngine.GameObject;

    slider: UnityEngine.UI.Slider;
    textSlider: UnityEngine.UI.Text;
    textContent: UnityEngine.UI.Text;
    textDesc: UnityEngine.UI.Text;

    btnGo: UnityEngine.GameObject;
    labelBtnGo: UnityEngine.UI.Text;

    btnReward: UnityEngine.GameObject;
    labelBtnReward: UnityEngine.UI.Text;

    btnRank: UnityEngine.GameObject;

    config: GameConfig.GuildTreasureHuntEventM;
    processCfg: GameConfig.GuildTreasureHuntProcessM;
    m_processTime = 0;

    private isEnergyFull = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_EXPLORE);
        this.closeSound = null;

        this.mainLogic = new GuildExploreMainLogic(this, false);
        this.monsterLogic = new GuildExploreMonsterLogic(this, false);
        this.donateLogic = new GuildExploreDonateLogic(this, false);
        this.forkLogic = new GuildExploreForkLogic(this, true);
        this.moveLogic = new GuildExploreMoveLogic(this, true);
        this.rewardLogic = new GuildExploreRewardLogic(this, true);
    }

    protected resPath(): string {
        return UIPathData.GuildExploreView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.main = this.elems.getElement('main');
        this.main.SetActive(true);
        let mainElems = this.elems.getUiElements('main');
        this.btnStore1 = mainElems.getElement('btnStore');
        this.btnRule1 = mainElems.getElement('btnRule');

        this.ing = this.elems.getElement('ing');
        this.ing.SetActive(true);
        let ingElems = this.elems.getUiElements('ing');
        this.imgTitle = ingElems.getImage('imgTitle');
        this.titleAltas = ingElems.getElement('titleAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.oldMan = ingElems.getElement('oldMan');
        this.beauty = ingElems.getElement('beauty');
        this.monster = ingElems.getElement('monster');
        this.master = ingElems.getElement('master');

        this.textOldManTalk = ingElems.getText('textOldManTalk');
        this.textBeautyTalk = ingElems.getText('textBeautyTalk'); 
        this.btnStore2 = ingElems.getElement('btnStore');
        this.btnRule2 = ingElems.getElement('btnRule');

        let myEnergies = ingElems.getElement('myEnergies');
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            let energy = new ExploreEnergy();
            energy.setComponents(ElemFinder.findObject(myEnergies, i.toString()));
            this.myEnergies.push(energy);
        }
        this.textEnergy = ingElems.getText('textEnergy');

        this.cost = ingElems.getElement('cost');
        let costs = ingElems.getElement('costs');
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            this.costEnergies.push(ElemFinder.findObject(costs, i.toString()));
        }
        this.fork = ingElems.getElement('fork');

        this.slider = ingElems.getSlider('slider');
        this.textSlider = ingElems.getText('textSlider');
        this.textContent = ingElems.getText('textContent');
        this.textDesc = ingElems.getText('textDesc');

        this.btnGo = ingElems.getElement('btnGo');
        this.labelBtnGo = ingElems.getText('labelBtnGo');
        this.btnReward = ingElems.getElement('btnReward');
        this.labelBtnReward = ingElems.getText('labelBtnReward');
        this.btnRank = ingElems.getElement('btnRank');

        this.mainLogic.initElements(mainElems);
        this.monsterLogic.initElements(ingElems);
        this.donateLogic.initElements(ingElems);
        this.forkLogic.initElements(ingElems);
        this.moveLogic.initElements(ingElems);
        this.rewardLogic.initElements(ingElems);
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        this.addClickListener(this.btnRank, this.onClickBtnRank);

        this.addClickListener(this.btnStore1, this.onClickBtnStore);
        this.addClickListener(this.btnStore2, this.onClickBtnStore);

        this.addClickListener(this.btnRule1, this.onClickRule);
        this.addClickListener(this.btnRule2, this.onClickRule);

        this.mainLogic.initListeners();
        this.monsterLogic.initListeners();
        this.donateLogic.initListeners();
        this.forkLogic.initListeners();
        this.moveLogic.initListeners();
        this.rewardLogic.initListeners();
    }

    onOpen() {
        super.onOpen();
        this.onGuildExploreChanged();

        this.addTimer(this.TickTimerKey, 1000, 0, this.onTickTimer);
    }

    onGuildExploreChanged() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        this.config = guildData.getExploreEventCfg(exploreInfo.m_stCommonData.m_uiEventID);
        this.processCfg = G.DataMgr.guildData.getExploreProgressCfg(exploreInfo.m_stCommonData.m_ucDifficulty);
        this.m_processTime = 0;
        if (null != this.processCfg) {
            for (let i: number = 0; i < this.processCfg.m_astPoint.length; i++) {
                if (this.processCfg.m_astPoint[i].m_uiNum == exploreInfo.m_stCommonData.m_ucStep) {
                    this.m_processTime = this.processCfg.m_astPoint[i].m_iTime;
                    break;
                }
            }
        } 

        let type = exploreInfo.m_stCommonData.m_uiEventType;
        
        if (type == Macros.GUILD_TREASURE_HUNT_EVENT_DONATION) {
            this.crtLogic = this.donateLogic;
        }
        else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_END) {
            this.crtLogic = this.rewardLogic;
        }
        else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_MOVE) {
            this.crtLogic = this.moveLogic;
        }
        else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_SELECT) {
            this.crtLogic = this.forkLogic;
        }
        else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_TASK || type == Macros.GUILD_TREASURE_HUNT_EVENT_BOSS) {
            this.crtLogic = this.monsterLogic;
        }
        else {
            this.crtLogic = this.mainLogic;
        }
        this.imgTitle.sprite = this.titleAltas.Get(type.toString());

        if (this.crtLogic != this.mainLogic) {
            this.main.SetActive(false);
            this.ing.SetActive(true);
            this.updateMyEnergies();
        } else {
            this.ing.SetActive(false);
            this.main.SetActive(true);
        }

        this.crtLogic.onOpen();
        this.crtLogic.onGuildExploreChanged();
    }

    private updateMyEnergies() {
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;
        for (let i = 0; i < GuildData.MaxExploreEnergy; i++) {
            let state = ExploreEnergyState.none;
            if (i < exploreInfo.m_stPersonalData.m_uiPower) {
                state = ExploreEnergyState.full;
            }
            else if (i == exploreInfo.m_stPersonalData.m_uiPower) {
                state = ExploreEnergyState.ing;
            }
            this.myEnergies[i].update(state);
        }

        if (exploreInfo.m_stPersonalData.m_uiPower >= GuildData.MaxExploreEnergy) {
            this.textEnergy.text = '当前体力已达最大值';
            this.isEnergyFull = true;
        }
        else {
            this.isEnergyFull = false;
        }
    }

    private onTickTimer(timer: Game.Timer) {
        if (this.crtLogic == this.mainLogic) {
            return;
        }
        let guildData = G.DataMgr.guildData;
        let exploreInfo = guildData.exploreInfo;

        if (this.crtLogic != this.mainLogic && !this.isEnergyFull) {
            let leftTime = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUILD_TREASURE_HUNT_POWER_RECOVER_TIME) - (Math.round(G.SyncTime.getCurrentTime() / 1000) - exploreInfo.m_stPersonalData.m_iLastPowerRefreshTime);
            if (leftTime > 0) {
                this.textEnergy.text = uts.format('体力恢复中：{0}', DataFormatter.second2mmss(leftTime));
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreOpenRequest());
            }
        }

        if (this.crtLogic.NeedTick) {
            let nowTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
            let diffTime = nowTime - exploreInfo.m_stCommonData.m_iStepStartTime;
            let leftTime = this.m_processTime - diffTime;
            this.textSlider.text = DataFormatter.second2hhmmss(leftTime);

            if (leftTime > 0) {
                this.slider.value = leftTime / this.m_processTime;
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreOpenRequest());
            }
        }
    }

    onCurrencyChange(id: number) {
        if (this.crtLogic) {
            this.crtLogic.onCurrencyChange(id);
        }
    }

    onQuestChange() {
        if (this.monsterLogic == this.crtLogic) {
            this.monsterLogic.onGuildExploreChanged();
        }
    }

    private onClickBtnGo() {
        if (null == this.crtLogic) {
            return;
        }
        this.crtLogic.onClickBtnGo();
    }

    private onClickBtnRank() {
        G.Uimgr.createForm<GuildExploreRankView>(GuildExploreRankView).open();
    }

    private onClickBtnStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.LiLian);
        G.Uimgr.bindCloseCallback(MallView, GuildView, this.id);
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(405), '宗门探险');
    }
}