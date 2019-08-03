import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ThingData } from 'System/data/thing/ThingData'
import { List, ListItem } from "System/uilib/List"
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { GameIDUtil } from "System/utils/GameIDUtil"
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { PetData } from 'System/data/pet/PetData'
import { SkillData } from 'System/data/SkillData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
/*
 *伙伴飞升预览
 */
export class PetPreviewView extends CommonForm {

    private readonly skillMaxCount = 4;

    private skill: UnityEngine.GameObject;
    private skillIcon_Normal: UnityEngine.GameObject;


    private petId: number = 0;
    /**技能图标*/
    private skillItems: SkillIconItem[] = [];

    /**美人模型*/
    private petModelCtn: UnityEngine.Transform;
    private petAvatar: PetAvatar;
    private lastAvatarKey: string;


    constructor() {
        super(998);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.PetPreviewView;
    }

    protected initElements() {
        this.skill = this.elems.getElement("skill");
        this.petModelCtn = this.elems.getTransform("petModelCtn");
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        for (let i = 0; i < this.skillMaxCount; i++) {
            //基础技能
            let item = ElemFinder.findObject(this.skill, 'skill' + i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsuallyByPrefab(this.skillIcon_Normal, item);
            iconItem.needShowLv = true;
            this.skillItems.push(iconItem);
        }

    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.onClickClose);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickClose);
    }

    open(petId: number) {
        this.petId = petId;
        super.open();
    }

    protected onOpen() {
        this.petAvatar = new PetAvatar(this.petModelCtn, this.petModelCtn);
        this.petAvatar.setSortingOrder(this.sortingOrder);


        this.updateSkill();
        this.showPetModel(this.petId)

    }

    protected onClose() {
        if (null != this.petAvatar) {
            this.petAvatar.destroy();
            this.petAvatar = null;
        }
    }


    private onClickClose() {
        this.close();
    }



    private updateSkill() {
        //基础技能
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.petId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.petId);
        //飞升后可替换技能
        let petFeishengSkillCnt = config.m_stFSInfo.length;
        for (let i = 0; i < this.skillMaxCount; i++) {
            let skillId = 0;
            if (i < petFeishengSkillCnt) {
                skillId = config.m_stFSInfo[i].m_uiSkillID;
                let skillCfg = SkillData.getSkillConfig(skillId);
                skillCfg.completed = 1;
            }
            this.skillItems[i].updateBySkillID(skillId);
            this.skillItems[i].updateIcon();
        }
    }

    private showPetModel(petId: number) {
        let stageConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(petId, 1);
        let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let fabao: number = G.DataMgr.heroData.avatarList.m_uiFabaoShowID;
        //已经飞升次数
        let feiShenNum = info.m_stFeiSheng.m_ucNum;
        //表格总共飞升配置
        let feiShenCfgLen = config.m_stFSInfo.length;
        let index = 0;
        if (feiShenNum < feiShenCfgLen) {
            index = feiShenNum;
        } else {
            index = feiShenCfgLen - 1;
        }
        let fsModelId = config.m_stFSInfo[index].m_uiModelID;
        let avatarKey = fsModelId + '-' + fabao;
        let modelId = fsModelId.toString();
        if (this.lastAvatarKey != avatarKey) {
            this.lastAvatarKey = avatarKey;
           // this.petAvatar.m_shengQiMesh.destroy();
            this.petAvatar.defaultAvatar.destroy();
            this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, modelId, true, false);
            let fabaoCfg = G.DataMgr.fabaoData.getFabaoConfig(fabao);
            if (null != fabaoCfg) {
                this.petAvatar.updateShengQiModel(fabaoCfg.m_iModelID);
            }
        }
    }







}