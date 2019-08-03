import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { PetData } from 'System/data/pet/PetData'
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UiElements } from 'System/uilib/UiElements'
import { IconItem } from 'System/uilib/IconItem'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { BeautyEquipListItemData } from 'System/data/vo/BeautyEquipListItemData'
import { SkillData } from 'System/data/SkillData'
import { ThingData } from 'System/data/thing/ThingData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { AchievementData } from 'System/data/AchievementData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { PetView } from 'System/pet/PetView'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { EnumGuide } from 'System/constants/GameEnum'
import { PetGuider } from 'System/guide/cases/PetGuider'
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { RegExpUtil } from 'System/utils/RegExpUtil'

class PetTuJianItem {
    private lastIconId: number;
    private readonly maxCount = 5;
    private headImg: UnityEngine.UI.RawImage;
    private txtName: UnityEngine.UI.Text;
    private txtDes: UnityEngine.UI.Text;
    private objNeedHide: UnityEngine.GameObject;
    private txtStatus: UnityEngine.UI.Text;
    private petId = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.headImg = ElemFinder.findRawImage(go, "content/headImg");
        this.txtName = ElemFinder.findText(go, "content/namebg/txtName");
       
        this.txtDes = ElemFinder.findText(go, "txtDes");
        this.objNeedHide = ElemFinder.findObject(go, "content");
        this.txtStatus = ElemFinder.findText(go, "txtStatus");
    }

    update(petId: number) {
        this.petId = petId;
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let petName = PetData.getPetConfigByPetID(petId).m_szBeautyName;
        this.txtName.text = petName;
     
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        let achiConfig: GameConfig.AchiConfigM = AchievementData.getConfigVo(config.m_iCondition);
        let currentColor: string = pet.m_uiDoneCount >= achiConfig.m_uiQuestValue ? Color.GREEN : Color.RED;

        if (pet != null && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            let stage = PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID);
            this.txtDes.text = stage + "阶";
            this.txtStatus.text="当前阶级"
            UIUtils.setGrey(this.objNeedHide, false);
        } else {
            this.txtStatus.text = "收集进度"
            // 预览条件
            this.txtDes.text =TextFieldUtil.getColorText(pet.m_uiDoneCount.toString(), currentColor) + "/" + achiConfig.m_uiQuestValue;
            if (pet != null && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                UIUtils.setGrey(this.objNeedHide, false);
            } else {
                UIUtils.setGrey(this.objNeedHide, true);
            }
        }

        // 出战标记
        let followPet: Protocol.NewBeautyInfo = G.DataMgr.petData.getFollowPet();
        let fightingPetId: number = 0;
        if (null != followPet) {
            fightingPetId = followPet.m_iBeautyID;
        }
        // 在这里键入Item更新渲染的代码
        if (this.lastIconId != petId) {
            this.lastIconId = petId;
            G.ResourceMgr.loadImage(this.headImg, uts.format('images/head/{0}.png', petId));
        }
    }
}


/**
 * 伙伴图鉴 
 */
export class PetTuJianPanel extends NestedSubForm {
    private readonly skillCnt: number = 4;
    private readonly labelDesc: string[] = ['所有', '精英', '完美', '传说', '史诗', '神话'];
    private petTuJianItems: PetTuJianItem[] = [];

    private titleList: List;
    private petList: List;

    private labIndexs: number[] = [];

    /**存放所有伙伴Id*/
    private allPetIds: number[] = [];

    /**美人模型*/
    private petModelCtn: UnityEngine.Transform;
    private petAvatar: PetAvatar;
    private lastAvatarKey: string;

    /**当前 伙伴类型 所有，凡，天，神...*/
    private curTypeIndex: number = 0;
    private oldTypeIndex: number = 0;

    /**当前选择的伙伴*/
    private curPetId: number = 0;


    private skillList: UnityEngine.GameObject;
    private nqSkill: UnityEngine.GameObject;
    private skillIcon_Normal: UnityEngine.GameObject;
    private activeSkillIds: number[] = [];
    /**激活怒气技能图标*/
    private activateNQSkillItem: SkillIconItem;
    /**预览技能*/
    private activateSkillItems: SkillIconItem[] = [];

    /**激活条件*/
    private txtCondition: UnityEngine.UI.Text;

    private tabSelect: Game.UGUIAltas;
    private tabNormal: Game.UGUIAltas;

    /**雷达图*/
    private radar: Game.UIPolygon;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_TUJIAN);
    }

    protected resPath(): string {
        return UIPathData.PetTuJianView;
    }

    protected initElements() {
        this.titleList = this.elems.getUIList("titleList");
        this.petList = this.elems.getUIList("petList");
        this.skillList = this.elems.getElement("skilllist");
        this.petModelCtn = this.elems.getTransform("petModelCtn");
        this.nqSkill = this.elems.getElement("nqSkill");
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        this.txtCondition = this.elems.getText("txtCondition");
        let maxLabel = G.DataMgr.petData.maxLabel;

        this.tabSelect = this.elems.getElement("tabSelect").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.tabNormal = this.elems.getElement("tabNormal").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        // 预览怒气技能
        this.activateNQSkillItem = new SkillIconItem(true);
        this.activateNQSkillItem.setUsuallyByPrefab(this.skillIcon_Normal, this.nqSkill);

        // 预览技能列表
        for (let i: number = 0; i < this.skillCnt; i++) {
            let item = ElemFinder.findObject(this.skillList, 'skill' + i);
            let iconItem = new SkillIconItem(true);
            iconItem.needArrow = false;
            iconItem.setUsuallyByPrefab(this.skillIcon_Normal, item);
            iconItem.needShowLv = true;
            this.activateSkillItems.push(iconItem);
        }


        //0表示所有的伙伴
        this.labIndexs.push(0);

        for (let i = 1; i < maxLabel + 1; i++) {
            //表是从1开始记
            let petIds = PetData.getPetIdByLabel(i);
            if (null != petIds) {
                this.labIndexs.push(i);
                //获得所有的伙伴
                for (let j = 0; j < petIds.length; j++) {
                    this.allPetIds.push(petIds[j]);
                }
            }
        }

        //左侧伙伴类型
        this.titleList.Count = this.labIndexs.length;
        for (let i = 0; i < this.titleList.Count; i++) {
            let item = this.titleList.GetItem(i);
            let txtNormal = ElemFinder.findText(item.gameObject, "normal/txtName");
            let txtSelected = ElemFinder.findText(item.gameObject, "selected/txtName");

            let tabNormalBg = ElemFinder.findImage(item.gameObject, "normal");
            let tabSelectBg = ElemFinder.findImage(item.gameObject, "selected");
            let tabSelect = ElemFinder.findImage(item.gameObject, "selected/selectStatus");

            txtNormal.text = this.labelDesc[this.labIndexs[i]];
            txtSelected.text = this.labelDesc[this.labIndexs[i]];

            tabNormalBg.sprite = this.tabNormal.Get("normal" + i);
            tabSelectBg.sprite = this.tabNormal.Get("normal" + i);
            tabSelect.sprite = this.tabSelect.Get("select" + i);

        }

        this.radar = this.elems.getElement('polygon').GetComponent(Game.UIPolygon.GetType()) as Game.UIPolygon;
    }

    protected initListeners() {
        this.addListClickListener(this.titleList, this.onClickTitleListItem);
        this.addListClickListener(this.petList, this.onClickPetListItem);
    }

    protected onOpen() {
        //打开界面默认选择 所有
        this.titleList.Selected = 0;
        this.updateTuJianList(0);
        //所有下的第一个
        this.petList.Selected = 0;
        this.onClickPetListItem(0);
    }

    protected onClose() {

    }


    private onClickTitleListItem(index: number) {
        this.updateTuJianList(index);
        this.curTypeIndex = index;
        //切换页签，选择第一个
        if (this.curTypeIndex != this.oldTypeIndex) {
            this.oldTypeIndex = this.curTypeIndex;
            this.petList.Selected = 0;
            this.onClickPetListItem(0);
        }
    }


    private onClickPetListItem(index: number) {
        //0表示所有页
        if (this.curTypeIndex == 0) {
            this.curPetId = this.allPetIds[index];
        } else {
            let labIndex = this.labIndexs[this.curTypeIndex];
            let petIds = PetData.getPetIdByLabel(labIndex);
            this.curPetId = petIds[index];
        }

        this.showPetModel(this.curPetId);
        this.showSkillIcon();
    }


    /**
     * 跟新伙伴列表
     * @param index
     */
    private updateTuJianList(index: number) {
        let labIndex = this.labIndexs[index];
        let willShowIds = null;
        //显示所有的
        if (labIndex == 0) {
            willShowIds = this.allPetIds;
        } else {
            let petIds = PetData.getPetIdByLabel(labIndex);
            if (null != petIds) {
                willShowIds = petIds;
            }
        }

        this.petList.Count = willShowIds.length;
        for (let i = 0; i < this.petList.Count; i++) {
            let item = this.petList.GetItem(i);
            if (this.petTuJianItems[i] == null) {
                this.petTuJianItems[i] = new PetTuJianItem();
                this.petTuJianItems[i].setComponents(item.gameObject);
            }
            this.petTuJianItems[i].update(willShowIds[i]);
        }

    }




    private showPetModel(petId: number) {
        let stageConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(petId, 1);
        let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let fabao: number = G.DataMgr.heroData.avatarList.m_uiFabaoShowID;

        let avatarKey = stageConfig.m_iModelID + '-' + fabao;
        if (this.lastAvatarKey != avatarKey) {
            this.lastAvatarKey = avatarKey;
            if (null != this.petAvatar) {
                this.petAvatar.destroy();
            }
            this.petAvatar = new PetAvatar(this.petModelCtn, this.petModelCtn);
            this.petAvatar.setSortingOrder(this.sortingOrder);
            this.petAvatar.defaultAvatar.loadModel(UnitCtrlType.pet, stageConfig.m_iModelID.toString(), true, false);

            let fabaoCfg = G.DataMgr.fabaoData.getFabaoConfig(fabao);
            if (null != fabaoCfg) {
                this.petAvatar.updateShengQiModel(fabaoCfg.m_iModelID);
            }
        }

        //显示收集条件
        let achiConfig: GameConfig.AchiConfigM = AchievementData.getConfigVo(config.m_iCondition);
        let currentColor: string = info.m_uiDoneCount >= achiConfig.m_uiQuestValue ? Color.GREEN : Color.RED;


        if (info != null && info.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            let stage = PetData.getPetStage(info.m_uiStage, info.m_iBeautyID);
            this.txtCondition.text = "当前阶级："+stage + "阶";
        } else {
            // 预览条件
            this.txtCondition.text = AchievementData.getQuestStr(config.m_iCondition, info.m_uiDoneCount);
        }
      //  this.txtCondition.text = AchievementData.getQuestStr(config.m_iCondition, info.m_uiDoneCount);
        //AchievementData.getQuestStr(config.m_iCondition, pet.m_uiDoneCount);

        //画雷达图
        this.radar.SetPercent(0, config.m_uiSolo / 5);
        this.radar.SetPercent(1, config.m_uiAttack / 5);
        this.radar.SetPercent(2, config.m_uiPk / 5);
        this.radar.SetPercent(3, config.m_uiBlood / 5);
        this.radar.SetPercent(4, config.m_uiAuxiliary / 5);
    }


    private showSkillIcon() {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(this.curPetId);
        let skillConfig: GameConfig.SkillConfigM;
        if (null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            skillConfig = SkillData.getSkillConfig(G.DataMgr.petData.getNqSkill(this.curPetId));
            this.activateNQSkillItem.isPreview = false;
        } else {
            // 没激活的情况
            let gfConfig: GameConfig.HongYanFateConfigM = PetData.getYuanfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, 9);
            skillConfig = SkillData.getSkillConfig(gfConfig.m_uiSkillID);
            this.activateNQSkillItem.isPreview = true;
        }
        this.activateNQSkillItem.updateBySkillID(skillConfig.m_iSkillID);
        this.activateNQSkillItem.updateIcon();

        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(this.curPetId);
        // 预览属性
        let strongConfig = PetData.getEnhanceConfig(this.curPetId, config.m_uiStage);
        //预览技能
        let activeskillConfig: GameConfig.SkillConfigM;
        for (let i = 0; i < this.skillCnt; i++) {
            if (i < strongConfig.m_astSkillList.length) {
                this.activeSkillIds[i] = strongConfig.m_astSkillList[i].m_uiID;
                activeskillConfig = SkillData.getSkillConfig(this.activeSkillIds[i]);
                if (activeskillConfig != null) {
                    activeskillConfig.completed = (strongConfig.m_iStage >= activeskillConfig.m_stSkillStudy.m_iStudyLevel) ? 1 : 0;
                }
                this.activateSkillItems[i].updateBySkillID(this.activeSkillIds[i]);
            }
            else {
                this.activeSkillIds[i] = 0;
                this.activateSkillItems[i].updateBySkillID(0);
            }
            this.activateSkillItems[i].updateIcon();
        }

    }


}