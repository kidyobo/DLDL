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
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { BeautyEquipListItemData } from 'System/data/vo/BeautyEquipListItemData'
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
import { ElemFinder } from 'System/uilib/UiUtility'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { PetView } from 'System/pet/PetView'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm"
import { DropPlanData } from 'System/data/DropPlanData'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'

class PetXunBaoItem {
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

        this.objNeedHide = ElemFinder.findObject(go, "content");
        this.txtStatus = ElemFinder.findText(go, "txtStatus");
    }

    update(petId: number) {
        this.petId = petId;
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        let config = PetData.getPetConfigByPetID(petId);

        let stage = PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID);
        this.txtName.text = stage + "阶" + config.m_szBeautyName;
        this.txtStatus.text = PetData.LabelDesc[config.m_uiLabelID - 1] + '.' + config.m_szShowDesc;

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
export class PetXunBaoPanel extends NestedSubForm {
    private readonly labelDesc: string[] = ['所有', '精英', '完美', '传说', '史诗', '神话'];

    private titleList: List;
    private petList: List;

    //btn
    private btnRecord: UnityEngine.GameObject;
    private btnYuanBaoBegin: GameObjectGetSet;
    private btnBegin: GameObjectGetSet;
    private btnEnd: GameObjectGetSet;

    private petGroup: UnityEngine.GameObject;
    private headIcos: UnityEngine.UI.RawImage[] = [];
    private timeTxt: UnityEngine.UI.Text;
    private back: UnityEngine.GameObject;
    private acquireGoodsGo: UnityEngine.GameObject;
    private previewGoodsGo: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private tips: TextGetSet[] = [];
    private xiaoluTxt: TextGetSet;
    private xunBaoNumTxt: TextGetSet;

    private labIndexs: number[] = [];

    /**存放所有伙伴Id(已领取的游戏)*/
    private allPetIds: number[] = [];
    /**各类已领取伙伴*/
    private allPetTypeIds: { [id: number]: Array<number> } = {};

    /**当前 伙伴类型 所有，凡，天，神...*/
    private curTypeIndex: number = 0;
    private oldTypeIndex: number = 0;

    /**当前选择的伙伴*/
    private curPetId: number = 0;

    private tabSelect: Game.UGUIAltas;
    private tabNormal: Game.UGUIAltas;

    //data
    private levelTime: number = 0;
    private petXunBaoItems: PetXunBaoItem[] = [];
    private goodsAcquireArray: IconItem[] = [];
    private goodsPreviewArray: IconItem[] = [];
    private selectPets: number[] = [];
    private petNum: number = 3;
    private goodsNum = 6;
    private currentBeautyID: number = 0;
    private leftBeautyID: number = 0;
    private rightBeautyID: number = 0;
    private xunBaoData: Protocol.TreasureHuntPanelInfo = null;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_XUNBAO);
    }

    protected resPath(): string {
        return UIPathData.PetXunBaoView;
    }

    protected initElements() {
        this.titleList = this.elems.getUIList("titleList");
        this.petList = this.elems.getUIList("petList");
        let maxLabel = G.DataMgr.petData.maxLabel;

        this.tabSelect = this.elems.getElement("tabSelect").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.tabNormal = this.elems.getElement("tabNormal").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        //btn
        this.btnRecord = this.elems.getElement('btnRecord');
        this.btnBegin = new GameObjectGetSet(this.elems.getElement('btnBegin'));
        this.btnEnd = new GameObjectGetSet(this.elems.getElement('btnEnd'));
        this.btnYuanBaoBegin = new GameObjectGetSet(this.elems.getElement('btnYuanBaoBegin'));

        this.petGroup = this.elems.getElement('petGroup');
        for (let i = 0; i < this.petNum; i++) {
            let item = ElemFinder.findObject(this.petGroup, 'pet' + i);
            let rawImage = ElemFinder.findRawImage(item, 'headImg');
            this.headIcos.push(rawImage)
            rawImage.gameObject.SetActive(false);
            if (i == 0) continue;
            let tip = new TextGetSet(ElemFinder.findText(item, 'tip'));
            this.tips.push(tip);
        }
        this.timeTxt = this.elems.getText('xunbaoTime');
        this.xiaoluTxt = new TextGetSet(this.elems.getText('xunbaoXiaolu'));
        this.xunBaoNumTxt = new TextGetSet(this.elems.getText('xunBaoNum'));

        //goods
        this.acquireGoodsGo = this.elems.getElement('acquireGoodsList');
        this.previewGoodsGo = this.elems.getElement('previewGoodsList');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        for (let i: number = 0; i < this.goodsNum; i++) {
            //预览
            let itemAcquire = ElemFinder.findObject(this.acquireGoodsGo, 'goods' + i);
            (itemAcquire.transform as UnityEngine.RectTransform).sizeDelta = new UnityEngine.Vector2(75, 75);      
            let iconItemAcquire = new IconItem();
            iconItemAcquire.effectRule = EnumEffectRule.none;
            iconItemAcquire.setUsualEquipSlotByPrefab(this.itemIcon_Normal, itemAcquire);
            iconItemAcquire.showBg = false;
            iconItemAcquire.setTipFrom(TipFrom.normal);
            this.goodsAcquireArray.push(iconItemAcquire);

            //获得
            let itemPreview = ElemFinder.findObject(this.previewGoodsGo, 'goods' + i);
            (itemPreview.transform as UnityEngine.RectTransform).sizeDelta = new UnityEngine.Vector2(75, 75);            
            let iconItemPreview = new IconItem();
            iconItemPreview.effectRule = EnumEffectRule.none;
            iconItemPreview.setUsualEquipSlotByPrefab(this.itemIcon_Normal, itemPreview);
            iconItemPreview.showBg = false;
            iconItemPreview.setTipFrom(TipFrom.normal);
            this.goodsPreviewArray.push(iconItemPreview);

        }


        //0表示所有的已领取伙伴
        this.labIndexs.push(0);
        for (let i = 1; i < maxLabel + 1; i++) {
            //表是从1开始记
            let petIds = PetData.getPetIdByLabel(i);
            this.allPetTypeIds[i] = [];
            if (null != petIds) {
                this.labIndexs.push(i);
                //获得所有的伙伴(已领取的伙伴)
                for (let j = 0; j < petIds.length; j++) {
                    let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petIds[j]);
                    if (info.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                        this.allPetIds.push(petIds[j]);
                        this.allPetTypeIds[i].push(petIds[j]);
                    }                   
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

        this.InitUI();
    }

    protected initListeners() {
        this.addListClickListener(this.titleList, this.onClickTitleListItem);
        this.addListClickListener(this.petList, this.onClickPetListItem);
        this.addClickListener(this.btnBegin.gameObject, this.OnClickXunBaoBtn);
        this.addClickListener(this.btnEnd.gameObject, this.OnClickXunBaoBtn)
        this.addClickListener(this.btnYuanBaoBegin.gameObject, this.OnClickXunBaoBtn)
        this.addClickListener(this.btnRecord, this.onBtnRecordClick);
    }

    private InitUI() {
        for (let i = 0; i < this.headIcos.length; i++) {
            this.headIcos[i].gameObject.SetActive(false);
        }
        for (let i = 0; i < this.goodsNum; i++) {
            this.goodsAcquireArray[i].updateById(0);
            this.goodsAcquireArray[i].updateIcon();
            this.goodsPreviewArray[i].updateById(0);
            this.goodsPreviewArray[i].updateIcon();
        }
        for (let i = 0; i < this.tips.length; i++) {
            this.tips[i].text = '';
        }
        this.timeTxt.text = '';
        this.xiaoluTxt.text = '';

        this.InitData();
    }

    private InitData() {
        this.currentBeautyID = 0;
        this.leftBeautyID = 0;
        this.rightBeautyID = 0;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetXunBaoRequest(Macros.BEAUTY_TREASURE_HUNT_LIST, null, null, null));

        //打开界面默认选择的伙伴: 所有
        this.titleList.Selected = 0;
        this.curTypeIndex = 0;
        this.oldTypeIndex = 0;

        this.updateTuJianList(0);
        this.petList.Selected = -1
    }

    protected onClose() {

    }

    //伙伴类型选项
    private onClickTitleListItem(index: number) {       
        this.curTypeIndex = index;
        //检测是否和之前的选项页一样,如果一样则不更新武缘列表
        if (this.curTypeIndex != this.oldTypeIndex) {
            this.oldTypeIndex = this.curTypeIndex;
            this.petList.Selected = -1;
            this.updateTuJianList(index);
        }
    }

    //点击的伙伴响应
    private onClickPetListItem(index: number) {
        //0表示所有页
        if (this.curTypeIndex == 0) {
            this.curPetId = this.allPetIds[index];
        } else {
            let labIndex = this.labIndexs[this.curTypeIndex];
            let pets = this.allPetTypeIds[labIndex];
            this.curPetId = pets[index];
        }

        if (this.curPetId == null) return;

        //检测是否已领取
        if (G.DataMgr.petData.getPetInfo(this.curPetId).m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) return;
        this.currentBeautyID = this.curPetId;
        this.updateCenter();
    }

    updateView(response: Protocol.WYTreasureHunt_Response) {
        let data: Protocol.TreasureHuntPanelInfo;
        if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_LIST) {      //打开面板
            this.xunBaoData = response.m_stValue.m_stPannelInfo;
            if (this.xunBaoData.m_iBeautyID == 0) {
                this.InitUI();
            }
            else {
                this.updateCenter();
            }
        }
        else if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_START) {  //开始寻宝
            this.xunBaoData = response.m_stValue.m_stStartInfo;
            this.updateCenter();
        }
        else if (response.m_usType == Macros.BEAUTY_TREASURE_HUNT_END) {        //停止寻宝
            this.xunBaoData = response.m_stValue.m_stEndInfo;
            this.InitUI();
        }

        //红点提示
        G.Uimgr.getForm<PetView>(PetView).updateXunBaoTipMark(this.xunBaoData.m_iBeautyID == 0);
        G.DataMgr.petData.treasureHuntInfo.m_iBeautyID = this.xunBaoData.m_iBeautyID;
        G.MainBtnCtrl.update(true);

        if (this.xunBaoData.m_iBeautyID == 0) {
            if (this.xunBaoData.m_ucLeftCount != 0) {
                this.btnBegin.SetActive(true);
                this.btnEnd.SetActive(false);
                this.btnYuanBaoBegin.SetActive(false);
            }
            else {
                this.btnBegin.SetActive(false);
                this.btnEnd.SetActive(false);
                this.btnYuanBaoBegin.SetActive(true);
            }
        }
        else {
            this.btnBegin.SetActive(false);
            this.btnEnd.SetActive(true);
            this.btnYuanBaoBegin.SetActive(false);;
        }

        if (this.xunBaoData == null) return;

        //武缘辅助配置条件显示
        let xunbaoConfig: GameConfig.WYTreasureHuntCfgM = PetData.getPetXunBaoData(this.xunBaoData.m_iConditionID);
        if (xunbaoConfig && xunbaoConfig.m_stConditionList.length == 2) {
            this.setPetConditionLabel(true, xunbaoConfig.m_stConditionList[0])
            this.setPetConditionLabel(false, xunbaoConfig.m_stConditionList[1]);
        }

        //寻宝次数
        if (this.xunBaoData.m_ucLeftCount == 0) {
            this.xunBaoNumTxt.text = TextFieldUtil.getColorText('免费祈愿次数:', Color.WHITE) + TextFieldUtil.getColorText(this.xunBaoData.m_ucLeftCount.toString(), Color.RED);
        }
        else {
            this.xunBaoNumTxt.text = TextFieldUtil.getColorText('免费祈愿次数:', Color.WHITE) + TextFieldUtil.getColorText(this.xunBaoData.m_ucLeftCount.toString(), Color.GREEN);
        }      

        if (this.xunBaoData.m_iBeautyID != 0) {
            this.createTime();
        }
        else {
            this.stopTime();
        }
    } 

    //更新寻宝UI
    private updateCenter() {
        //武缘Ico展示
        let assistPetsNum = 0;  //辅助武缘人数
        if (this.xunBaoData.m_iBeautyID == 0) {
            let xunbaoConfig: GameConfig.WYTreasureHuntCfgM = PetData.getPetXunBaoData(this.xunBaoData.m_iConditionID);
            G.ResourceMgr.loadImage(this.headIcos[0], uts.format('images/head/{0}.png', this.currentBeautyID));
            this.headIcos[0].gameObject.SetActive(true);
            this.selectPets = [];
            this.selectPets.push(this.currentBeautyID);
            this.leftBeautyID = this.getAssistPetID(xunbaoConfig.m_stConditionList[0]);
            if (this.leftBeautyID != 0) {
                this.selectPets.push(this.leftBeautyID);
                assistPetsNum++;
            }
            this.rightBeautyID = this.getAssistPetID(xunbaoConfig.m_stConditionList[1]);
            if (this.rightBeautyID != 0) {
                this.selectPets.push(this.rightBeautyID);
                assistPetsNum++;
            }
            this.setAssistPet(this.leftBeautyID, this.headIcos[1]);
            this.setAssistPet(this.rightBeautyID, this.headIcos[2]);
        }
        else {
            G.ResourceMgr.loadImage(this.headIcos[0], uts.format('images/head/{0}.png', this.xunBaoData.m_iBeautyID));
            this.headIcos[0].gameObject.SetActive(true);
            this.setAssistPet(this.xunBaoData.m_iLeftBeautyID, this.headIcos[1]);
            this.setAssistPet(this.xunBaoData.m_iRightBeautyID, this.headIcos[2]);
            if (this.xunBaoData.m_iLeftBeautyID != 0) assistPetsNum++;
            if (this.xunBaoData.m_iRightBeautyID != 0) assistPetsNum++;
        }
        //概率设置(注:初始值100+每添加一个辅助武缘则+50%)
        let str = 100 + assistPetsNum * 50;
        this.xiaoluTxt.text = '本次祈愿效率:' + str + '%';
        //可获得道具展示
        let showID = this.xunBaoData.m_iBeautyID != 0 ? this.xunBaoData.m_iBeautyID : this.currentBeautyID;
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(showID);
        if (config) {
            this.setAcquireGoods(config.m_uiXunBaoShowID);
        }
        //已获得道具展示
        this.setPreviewGoods();
    }

    private setPetConditionLabel(left: boolean, gameConfig: GameConfig.WYXBConditionInfo) {
        let label = gameConfig.m_ucLabel != 0 ? PetData.LabelDesc[gameConfig.m_ucLabel - 1] : '';
        let desc = gameConfig.m_szShowDesc;
        let stage = Math.floor(gameConfig.m_iStage / 10) + 1 + '阶';

        if (left)
            this.tips[0].text = label + desc + stage;
        else
            this.tips[1].text = label + desc + stage;
    }

    //获取辅助武缘id
    private getAssistPetID(data: GameConfig.WYXBConditionInfo): number {
        for (let i = 0; i < this.allPetIds.length; i++) {
            let petId = this.allPetIds[i];
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
            let info: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);

            if (data.m_szShowDesc != '' && data.m_szShowDesc != config.m_szShowDesc) continue;
            if (data.m_ucLabel != 0 && data.m_ucLabel != config.m_uiLabelID) continue;
            if (data.m_iStage != 0 && info.m_uiStage < data.m_iStage) continue;
            let flag = false;
            for (let i = 0; i < this.selectPets.length; i++) {
                if (petId == this.selectPets[i]) {
                    flag = true;
                    break;
                }
            }
            if (flag) continue;
            return petId;
        }
        return 0;
    }

    private setAssistPet(petID: number, raw: UnityEngine.UI.RawImage) {
        raw.gameObject.SetActive(petID != 0);

        G.ResourceMgr.loadImage(raw, uts.format('images/head/{0}.png', petID));
    }

    private setAcquireGoods(DropId: number) {
        let data = DropPlanData.getDropPlanConfig(DropId);
        if (data.m_astDropThing.length == 0) return;

        for (let i = 0; i < this.goodsNum; i++) {
            if (i < data.m_astDropThing.length) {
                let drop = data.m_astDropThing[i];
                this.goodsAcquireArray[i].updateById(drop.m_iDropID, drop.m_uiDropNumber);
                this.goodsAcquireArray[i].updateIcon();
            }
            else {
                this.goodsAcquireArray[i].updateById(0);
                this.goodsAcquireArray[i].updateIcon();
            }
        }
    }

    private setPreviewGoods() {
        if (this.xunBaoData.m_ucCount == 0) return;

        for (let i = 0; i < this.goodsNum; i++) {
            if (i < this.xunBaoData.m_ucCount) {
                let drop = this.xunBaoData.m_stThingList[i]
                this.goodsPreviewArray[i].updateById(drop.m_iThingID, drop.m_iNumber);
                this.goodsPreviewArray[i].updateIcon();
            }
            else {
                this.goodsPreviewArray[i].updateById(0);
                this.goodsPreviewArray[i].updateIcon();
            }
        }
    }

    private createTime() {
        this.levelTime = this.xunBaoData.m_uiLeftTime;
        this.addTimer('1', 1000, 0, this.onCountXunBaoTimer);
    }
    private stopTime() {
        this.removeTimer('1');
        this.timeTxt.text = '';
    }

    private onCountXunBaoTimer() {
        this.timeTxt.text = uts.format('本次祈愿倒计时：{0}', DataFormatter.second2day(this.levelTime--));
        if (this.levelTime <= 0) {
            this.stopTime();
            this.InitUI();
        }
    }

    //寻宝按钮响应
    private OnClickXunBaoBtn() {
        if (this.xunBaoData.m_iBeautyID == 0) {        //开始寻宝
            if (this.currentBeautyID == 0) {
                G.TipMgr.addMainFloatTip("请选择伙伴");
                return;
            }
            if (this.xunBaoData.m_ucLeftCount == 0 && G.DataMgr.heroData.gold < 10) {
                G.TipMgr.showConfirm('您的元宝不足10,请前往充值', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onClickConfirm));
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetXunBaoRequest(Macros.BEAUTY_TREASURE_HUNT_START, this.currentBeautyID, this.leftBeautyID, this.rightBeautyID));
            return;
        }
        else if (this.xunBaoData.m_iBeautyID != 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetXunBaoRequest(Macros.BEAUTY_TREASURE_HUNT_END, this.currentBeautyID, this.leftBeautyID, this.rightBeautyID));
        }
    }

    private onClickConfirm(state: MessageBoxConst): void {
        if (state == MessageBoxConst.yes) {
            G.ActionHandler.go2Pay();
        }
    }

    protected onBtnRecordClick() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(480), '规则介绍');
    }

    /**
     * 更新伙伴列表
     * @param index
     */
    private updateTuJianList(index: number) {
        let labIndex = this.labIndexs[index];
        let willShowIds = null;
        //显示所有的
        if (labIndex == 0) {
            willShowIds = this.allPetIds;
        } else {
            willShowIds = this.allPetTypeIds[labIndex];
        }

        willShowIds = willShowIds.sort(this.sortPetList);

        this.petList.Count = willShowIds.length;
        for (let i = 0; i < this.petList.Count; i++) {
            let item = this.petList.GetItem(i);
            if (this.petXunBaoItems[i] == null) {
                this.petXunBaoItems[i] = new PetXunBaoItem();
                this.petXunBaoItems[i].setComponents(item.gameObject);
            }
            this.petXunBaoItems[i].update(willShowIds[i]);
        }
    }

    private sortPetList(a: number, b: number): number {
        let petInfoA = G.DataMgr.petData.getPetInfo(a);
        let petInfoB = G.DataMgr.petData.getPetInfo(b);
        let hada = petInfoA != null && petInfoA.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET;
        let hadb = petInfoB != null && petInfoB.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET;
        if (petInfoA.m_iBeautyID >= petInfoB.m_iBeautyID) {
            if (!hada) {
                return 1;
            }
            else if (hada && !hadb) {
                return -1;
            }
            else if (hada && hadb) {
                return 1;
            }
        }
        else {
            if (!hadb) {
                return -1;
            }
            else if (hadb && !hada) {
                return 1;
            }
            else if (hadb && hada) {
                return -1;
            }
        }
        return 0;
    }

}