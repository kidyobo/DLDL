import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { PetExpeditionData, ExpeditionPetOne } from 'System/data/pet/PetExpeditionData'
import { PetExpeditionItem } from 'System/pet/expedition/PetExpeditionBaseLogic'

class ExpeditionBattleOneCtrl {
    private textName: UnityEngine.UI.Text;
    private items: PetExpeditionItem[] = [];

    setComponents(elems: UiElements) {
        //玩家属性
        this.textName = elems.getText('textName');

        let pets = elems.getUIList('pets');
        pets.Count = Macros.MAX_WYYZ_FIGHT_PET_COUNT;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let item = new PetExpeditionItem();
            item.setComponents(pets.GetItem(i).gameObject);
            this.items.push(item);
        }
    }

    updateName(name: string) {
        this.textName.text = name;
    }

    updateOnePet(info: ExpeditionPetOne, index: number) {
        let item = this.items[index];
        item.update(info, true);
    }

    updateOnePetHp(hpPct: number, petId: number) {
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let item = this.items[i];
            let petInfo = item.Info;
            if (null != petInfo && petInfo.id == petId) {
                petInfo.hpPct = hpPct;
                item.updateHp();
            }
        }
    }
}

export class PetExpeditionBattleView extends NestedSubForm {

    private readonly MyIndex = 0;
    private readonly OpponentIndex = 1;

    private oneCtrls: ExpeditionBattleOneCtrl[] = [];
    private hpCache: {} = [];

    constructor() {
        super(EnumMainViewChild.petExpeditionBattle);
    }

    protected resPath(): string {
        return UIPathData.ExpeditionBattleView;
    }

    protected initElements() {
        let names = ['mine', 'opponent'];
        for (let i = 0; i < 2; i++) {
            let elems = this.elems.getUiElements(names[i]);
            let oneCtrl = new ExpeditionBattleOneCtrl();
            oneCtrl.setComponents(elems);
            this.oneCtrls.push(oneCtrl);

            if (i == this.MyIndex) {
                oneCtrl.updateName(G.DataMgr.heroData.name);
            } 
        }
    }

    protected onOpen() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;

        // 我自己的
        let oneCtrl = this.oneCtrls[0];
        let fightPetIds = info.m_stFightPetList.m_aiPetID;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let petId = fightPetIds[Macros.MAX_WYYZ_FIGHT_PET_COUNT - 1 - i];
            if (petId > 0) {
                oneCtrl.updateOnePet(expeditionData.getPetOne(petId), i);
            } else {
                oneCtrl.updateOnePet(null, i);
            }
        }

        // 对手的
        let levelInfo = info.m_stLevelList.m_stList[info.m_iTGLevel];
        let opponent = levelInfo.m_stPetList;
        oneCtrl = this.oneCtrls[1];
        oneCtrl.updateName(levelInfo.m_stBasePro.m_szNickName);
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            if (i < opponent.m_iCount) {
                let pet = opponent.m_stList[i];
                oneCtrl.updateOnePet(expeditionData.getLevelPetOne(pet.m_iPetID), i);
            } else {
                oneCtrl.updateOnePet(null, i);
            }
        }
    }

    setPetHpPct(monsterCtrl: MonsterController, hpPct: number) {
        if (!this.isOpened) {
            return;
        }
        let oneCtrl: ExpeditionBattleOneCtrl;
        if (monsterCtrl.Data.petMonsterInfo.m_iMasterUnitID == G.DataMgr.heroData.unitID) {
            // 我的
            oneCtrl = this.oneCtrls[0];
        } else {
            // 对手的
            oneCtrl = this.oneCtrls[1];
        }
        oneCtrl.updateOnePetHp(hpPct, monsterCtrl.Data.petMonsterInfo.m_iPetID);
    }
}