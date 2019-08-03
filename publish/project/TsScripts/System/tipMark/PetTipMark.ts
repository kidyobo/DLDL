import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PetJinJieFuncTab, PetTipMarkType } from 'System/pet/PetJinJiePanel'
import { ItemMergeView } from 'System/Merge/ItemMergeView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { PetView } from 'System/pet/PetView'

export class PetTipMark extends BaseTipMark {
    private tipName: string;
    private tipType: PetTipMarkType = PetTipMarkType.None;
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_BEAUTY_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_BEAUTY, KeyWord.OTHER_FUNCTION_MRQH];
        this.sensitiveToPet = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_BEAUTY;
    }

    protected doCheck(): boolean {
        let isShow = false;
        let petData = G.DataMgr.petData;
        if (petData.isAllPetExistCanActive()) {
            this.tipName = '伙伴激活';
            this.tipType = PetTipMarkType.Active;
            isShow = true;
        }
        else if (petData.isAllPetExistCanJinJie()) {
            this.tipName = '伙伴成长';
            this.tipType = PetTipMarkType.JinJie;
            isShow = true;
        }
        else if (petData.isAllPetExistCanSkillUp()) {
            this.tipName = '伙伴技能';
            this.tipType = PetTipMarkType.Skill;
            isShow = true;
        }
        else if (petData.isAllPetCanJuShen()) {
            this.tipName = '伙伴炼神';
            this.tipType = PetTipMarkType.JuShen;
            isShow = true;
        }
        else if (petData.isAllPetExistBetterEquip()) {
            this.tipName = '伙伴装备';
            this.tipType = PetTipMarkType.Equip;
            isShow = true;
        }
        else if (petData.isAllPetCanAwaken()>0) {
            this.tipName = '伙伴觉醒';
            this.tipType = PetTipMarkType.Awaken;
            isShow = true;
        }
        //else if (G.DataMgr.equipStrengthenData.canItemMergeByType(KeyWord.MERGER_CLASS1_PET)) {
        //    this.tipName = '装备合成';
        //    this.tipType = 0;
        //    isShow = true;
        //}
        return isShow;
    }

    get ShowTipMarkOnPet(): boolean {
        return this.showTip && this.tipType != 0;
    }

    get TipName(): string {
        return this.tipName;
    }

    action() {
        //G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, 0, 0, PetJinJieFuncTab.jinjie, this.tipType);
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_BEAUTY)) {
            return;
        }
        G.Uimgr.createForm<PetView>(PetView).open();
    }
}