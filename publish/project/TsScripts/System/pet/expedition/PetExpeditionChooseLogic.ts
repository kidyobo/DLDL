import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetExpeditionBaseLogic, PetExpeditionItem } from 'System/pet/expedition/PetExpeditionBaseLogic'
import { List, ListItem } from 'System/uilib/List'
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
import { PetExpeditionData } from 'System/data/pet/PetExpeditionData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { PetData } from 'System/data/pet/PetData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { ExpeditionPetOne } from 'System/data/pet/PetExpeditionData'
import { DataFormatter } from 'System/utils/DataFormatter'

class ExpeditionChoiceItem extends PetExpeditionItem {
    private btnKick: UnityEngine.GameObject;

    private logic: PetExpeditionChooseLogic;

    constructor(logic: PetExpeditionChooseLogic) {
        super();
        this.logic = logic;
    }

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.btnKick = ElemFinder.findObject(go, 'btnKick');
        Game.UIClickListener.Get(this.btnKick).onClick = delegate(this, this.onClickBtnKick);
    }

    update(info: ExpeditionPetOne) {
        super.update(info, true);
        this.btnKick.SetActive(null != info && info.id > 0);
    }

    private onClickBtnKick() {
        this.logic.setPetNotFighting(this.info.id);
    }
}

export class PetExpeditionChooseLogic extends PetExpeditionBaseLogic {

    private petList: List;
    private petItems: PetExpeditionItem[] = [];

    private choices: ExpeditionChoiceItem[] = [];

    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;

    private modelRoot: UnityEngine.Transform;
    private petAvatar: PetAvatar;

    private skillList: List;
    private skills: SkillIconItem[] = [];

    private btnFight: UnityEngine.GameObject;
    private labelBtnFight: UnityEngine.UI.Text;

    private btnBack: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;

    private oldPetId = 0;

    initElements(elems: UiElements) {
        this.petList = elems.getUIList('petList');

        let choiceGroup = elems.getElement('group');
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let choice = new ExpeditionChoiceItem(this);
            choice.setComponents(ElemFinder.findObject(choiceGroup, i.toString()));
            this.choices.push(choice);
        }

        this.modelRoot = elems.getTransform('modelRoot');
        this.skillList = elems.getUIList('skillList');
        this.skillList.Count = PetExpeditionData.SkillCnt;
        for (let i = 0; i < PetExpeditionData.SkillCnt; i++) {
            let skillIcon = new SkillIconItem(true);
            skillIcon.setUsually(this.skillList.GetItem(i).gameObject);
            this.skills.push(skillIcon);
        }    

        this.btnFight = elems.getElement('btnFight');
        this.labelBtnFight = elems.getText('labelBtnFight');
        this.textName = elems.getText('textName');
        this.textStage = elems.getText('textStage');

        this.btnBack = elems.getElement('btnBack');
        this.btnGo = elems.getElement('btnGo');
    }

    initListeners() {
        this.petList.onValueChange = delegate(this, this.onPetListChange);
        Game.UIClickListener.Get(this.btnFight).onClick = delegate(this, this.onClickBtnFight);
        Game.UIClickListener.Get(this.btnBack).onClick = delegate(this, this.onClickBtnBack);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    protected onOpen() {
        super.onOpen();
        this.panel.bg.SetActive(false);
        this.panel.map.SetActive(false);
        this.panel.info.SetActive(false);
        this.panel.choose.SetActive(true);
        this.panel.bottom.SetActive(false);
        this.modelRoot.gameObject.SetActive(true);
    }

    protected onClose() {
        this.modelRoot.gameObject.SetActive(false);

    }

    onPanelClosed() {
        this.oldPetId = 0;
        if (null != this.petAvatar) {
            this.petAvatar.destroy();
            this.petAvatar = null;
        }
    }

    onExpeditionChange() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        let hasGetReward = false;
        let refreshTime = 0;
        let fighterIds: number[] = [];
        let buffBit = 0;
        if (null != info) {
            level = info.m_iTGLevel;
            hasGetReward = 0 != info.m_iTGRewardBit;
            refreshTime = info.m_uiFreshTime;
            fighterIds = info.m_stFightPetList.m_aiPetID;
            buffBit = info.m_iBuffBit;
        }

        let petData = G.DataMgr.petData;
        // 伙伴列表
        let myPets = petData.getActivedPets();
        let myPetCnt = myPets.length;
        let itemDatas: ExpeditionPetOne[] = [];
        for (let i = 0; i < myPetCnt; i++) {
            let petInfo = myPets[i];
            let itemData = expeditionData.getPetOne(petInfo.m_iBeautyID);
            itemDatas.push(itemData);
        }
        itemDatas.sort(delegate(this, this.sortMyPets));

        this.petList.Count = myPetCnt;
        let oldPetCnt = this.petItems.length;
        for (let i = 0; i < myPetCnt; i++) {
            let petItem: PetExpeditionItem;
            if (i < oldPetCnt) {
                petItem = this.petItems[i];
            } else {
                this.petItems.push(petItem = new PetExpeditionItem());
                petItem.setComponents(this.petList.GetItem(i).gameObject);
            }
            let itemData = itemDatas[i];
            petItem.update(itemData, fighterIds.indexOf(itemData.id) >= 0);
        }

        // 上阵伙伴
        let aliveFighterCnt = 0;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let petItem = this.choices[i];
            let petId = fighterIds[i];
            if (petId > 0) {
                let itemData = expeditionData.getPetOne(petId);
                petItem.update(itemData);
                if (itemData.hpPct > 0) {
                    aliveFighterCnt++;
                }
            } else {
                petItem.update(null);
            }
        }

        if (this.petList.Selected < 0) {
            this.petList.Selected = 0;
            this.onPetListChange(0);
        }

        this.updateLabelBtnFight();
        UIUtils.setButtonClickAble(this.btnGo, aliveFighterCnt > 0);
    }

    private sortMyPets(a: ExpeditionPetOne, b: ExpeditionPetOne): number {
        let aIsDead = a.hpPct == 0 ? 1 : 0;
        let bIsDead = b.hpPct == 0 ? 1 : 0;
        if (aIsDead != bIsDead) {
            return aIsDead - bIsDead;
        }

        if (a.stage != b.stage) {
            return b.stage - a.stage;
        }

        let cfgA = PetData.getPetConfigByPetID(a.id);
        let cfgB = PetData.getPetConfigByPetID(b.id);

        if (cfgA.m_uiLabelID != cfgB.m_uiLabelID) {
            return cfgB.m_uiLabelID - cfgA.m_uiLabelID;
        }

        return b.id - a.id;
    }

    onCurrencyChange(id: number) {
    }

    private onPetListChange(index: number) {
        let expeditionData = G.DataMgr.petExpeditionData;
        // 显示伙伴avatar
        let item = this.petItems[index];
        let petInfo = item.Info;
        let stage = PetData.getPetStage(petInfo.stage, petInfo.id);
        this.textStage.text = uts.format('{0}阶', DataFormatter.toHanNumStr(stage));
        if (petInfo.id != this.oldPetId) {
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petInfo.id);
            let n = config.m_szBeautyName;
            if (petInfo.feiSheng > 0) {
                n += uts.format("（{0}转）", petInfo.feiSheng);
            }
            this.textName.text = n;
            let fabaoID = 0;
            let modelId = G.DataMgr.petData.getPetModleID(petInfo.id, petInfo.feiSheng);
            let fabaoInfo = G.DataMgr.fabaoData.getFabaoConfig(G.DataMgr.heroData.avatarList.m_uiFabaoShowID);
            if (fabaoInfo != null)
            {
                fabaoID = fabaoInfo.m_iModelID;
            }
            
            if (null == this.petAvatar) {
                this.petAvatar = new PetAvatar(this.modelRoot, this.modelRoot);
                this.petAvatar.setSortingOrder(this.panel.sortingOrder);
            }
            this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, modelId, true, false);
            this.petAvatar.updateShengQiModel(fabaoID);

            // 技能列表
            let yzPetCfg = expeditionData.getWyyzPetConfig(petInfo.id);
            let skillIcon = this.skills[0];
            skillIcon.updateBySkillID(yzPetCfg.m_iBuff);
            skillIcon.updateIcon();
            skillIcon = this.skills[1];
            skillIcon.updateBySkillID(yzPetCfg.m_iPGSkill);
            skillIcon.updateIcon();
            skillIcon = this.skills[2];
            skillIcon.updateBySkillID(yzPetCfg.m_iTSSkill);
            skillIcon.updateIcon();
        }

        this.updateLabelBtnFight();
    }

    private updateLabelBtnFight() {
        let selectedIdx = this.petList.Selected;
        if (selectedIdx >= 0) {
            let expeditionData = G.DataMgr.petExpeditionData;
            let item = this.petItems[selectedIdx];
            let petInfo = item.Info;
            let fightIdx = expeditionData.getFightIndex(petInfo.id);
            this.labelBtnFight.text = fightIdx >= 0 ? '下阵' : '上阵';

            UIUtils.setButtonClickAble(this.btnFight, fightIdx >= 0 || petInfo.hpPct > 0);
        }
    }

    private onClickBtnFight() {
        let selected = this.petList.Selected;
        if (selected < 0) {
            return;
        }

        let item = this.petItems[selected];
        let petId = item.Info.id;
        let expeditionData = G.DataMgr.petExpeditionData;
        let fightIdx = expeditionData.getFightIndex(petId);
        if (fightIdx >= 0) {
            // 已经上阵，点击按钮下阵
            this.setPetNotFighting(petId);
        } else {
            // 未上阵，点击按钮上阵
            this.setPetFighting(petId);
        }
    }

    private setPetFighting(petId: number) {
        let expeditionData = G.DataMgr.petExpeditionData;
        // 血量0不允许出阵
        if (expeditionData.isMyPetDead(petId)) {
            G.TipMgr.addMainFloatTip('阵亡伙伴无法上阵');
            return;
        }

        let info = expeditionData.info;
        let l = info.m_stFightPetList.m_aiPetID.concat();
        let len = l.length;
        for (let i = 0; i < len; i++) {
            if (l[i] <= 0) {
                l[i] = petId;
                break;
            }
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzFightSetRequest(l));
    }

    setPetNotFighting(petId: number) {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let l = info.m_stFightPetList.m_aiPetID.concat();
        let len = l.length;
        for (let i = 0; i < len; i++) {
            if (l[i] == petId) {
                l[i] = 0;
                break;
            }
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzFightSetRequest(l));
    }

    private onClickBtnBack() {
        this.panel.gotoInfo();
    }

    private onClickBtnGo() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzPKRequest());
    }

    onTickTimer(timer: Game.Timer) {
    }
}