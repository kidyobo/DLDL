import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { List, ListItem } from 'System/uilib/List'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { Global as G } from "System/global"
import { KeyWord } from 'System/constants/KeyWord'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { HeroAttItemData } from 'System/hero/HeroAttItemData'
import { PropUtil } from 'System/utils/PropUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { DataFormatter } from 'System/utils/DataFormatter'
import { HeroView } from 'System/hero/view/HeroView'
import { PropertyListNode } from '../../ItemPanels/PropertyItemNode';

enum AchieveGroupTag {
    SaiJiTitle = 0,
    NormalAchieveTitle = 1,
    SpecialAchieveTitle = 2
}

class TitleListItem extends ListItemCtrl {

    private isWearingIcon: UnityEngine.GameObject;
    private titlePos: UnityEngine.GameObject;
    //private isAchieveText: UnityEngine.UI.Text;
    private canPyIcon: UnityEngine.GameObject;
    private data: TitleDressItemData;


    setComponents(go: UnityEngine.GameObject) {
        this.isWearingIcon = ElemFinder.findObject(go, 'iswearing');
        this.titlePos = ElemFinder.findObject(go, 'titlePosition');
        //this.isAchieveText = ElemFinder.findText(go, 'isachieve');
        this.canPyIcon = ElemFinder.findObject(go, 'canPy');
    }


    update(data: TitleDressItemData) {
        this.data = data;
        let time: string = '';
        //let hasStr: string = this.data.had ? TextFieldUtil.getColorText(uts.format('已获得'), Color.GREEN) : TextFieldUtil.getColorText(uts.format('未拥有'), Color.WHITE);
        //this.isAchieveText.text = hasStr;
        this.isWearingIcon.SetActive(data.show);
        this.canPyIcon.SetActive(data.canPy);
        G.ResourceMgr.loadModel(this.titlePos, UnitCtrlType.chenghao, data.config.m_uiImageID.toString(), 0);
    }

}

class TitleDressItemData {

    config: GameConfig.TitleListConfigM;
    /**是否已经佩带*/
    show: boolean = false;
    /**是否获得*/
    had: boolean = false;
    /**过期日期*/
    timeOut: number = 0;
    /**持续时长*/
    validTime: number = 0;
    /**培养次数*/
    addTime: number = 0;
    /**能否培养*/
    canPy: boolean = false;
}



export class TitleView extends TabSubForm {

    private adornBt: UnityEngine.GameObject = null;
    private adornBtName: UnityEngine.UI.Text;
    private txtHaveInfo: UnityEngine.UI.Text;               //未拥有
    private achieveTitleGroup: GroupList = null;
    private tmpAchiId: number = 0;
    private tmpSpecId: number = 0;
    private currentDressItemData: TitleDressItemData;
    private allTitleIds: GameConfig.TitleListConfigM[][] = [];
    private titleListData: TitleDressItemData[] = [];
    private titleData = G.DataMgr.titleData;
    private currentTitleId: number = 0;
    private m_allProps: GameConfig.EquipPropAtt[];
    private attListData: HeroAttItemData[] = [];
    private attListDic: { [key: number]: HeroAttItemData };
    private rolePosition: UnityEngine.Transform;
    private normalTitlePos: UnityEngine.GameObject;
    private avatar: UIRoleAvatar = null;
    private selectedList: List = null;
    //培养相关
    private peiYang: UnityEngine.GameObject;
    //可以培养面板
    private m_pyPanel: UnityEngine.GameObject = null;
    //培养到达满级
    private fullLevelTxt: UnityEngine.UI.Text;
    private m_pyMaterialIconItem: IconItem;
    private m_pyMaterialData: MaterialItemData = new MaterialItemData();
    private m_btnPy: UnityEngine.GameObject = null;
    private m_pyTimes: number = 0;
    private pyTimeText: UnityEngine.UI.Text = null;
    private btnGet: UnityEngine.GameObject;
    private showTitleId: number = 0;
    private max_props: number = 5;
    private achieveDesText: UnityEngine.UI.Text;
    private achieveConditionText: UnityEngine.UI.Text;
    private _validTime: number = 0;
    private propParent: UnityEngine.GameObject;
    //private fightText: UnityEngine.UI.Text;
    private fightUnlimit: UnityEngine.GameObject;
    private heroView: HeroView;
   
    private attributeListPanel: PropertyListNode;
    //可以培养的时候显示小红点
    private canPeiYang:UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_HEROTITLE);
    }

    protected resPath(): string {
        return UIPathData.TitleView;
    }

    protected initElements() {

        this.adornBt = this.elems.getElement("peidaiBt");
        this.txtHaveInfo = this.elems.getText("txtHaveInfo");
        this.achieveTitleGroup = ElemFinder.getUIGroupList(this.elems.getElement('achieveGroup'));
        this.rolePosition = this.elems.getTransform("rolePosition");
        this.normalTitlePos = this.elems.getElement("headps");
        //培养面板相关
        this.peiYang = this.elems.getElement('back3');
        //可以培养面板
        this.m_pyPanel = this.elems.getElement("peiyangPanel");
        this.m_btnPy = this.elems.getElement('btpy');
        this.pyTimeText = this.elems.getText('times');
        this.m_pyMaterialIconItem = new IconItem();
        this.m_pyMaterialIconItem.setUsualIconByPrefab(this.elems.getElement('itemIcon_Normal'), this.elems.getElement('pyIcon'));
        this.m_pyMaterialIconItem.setTipFrom(TipFrom.normal);
        this.btnGet = this.elems.getElement('btnGet');
        this.achieveDesText = this.elems.getText('achieveDes');
        this.achieveConditionText = this.elems.getText('getRoadTitle');
        this.adornBtName = ElemFinder.findText(this.adornBt, "Text");
        this.propParent = this.elems.getElement('props');
        //this.fightText = this.elems.getText('fightText');
        this.fightUnlimit = this.elems.getElement('fightUnlimit');
        this.fullLevelTxt = this.elems.getText('fullLevelTxt');
        this.attributeListPanel = new PropertyListNode();
        this.attributeListPanel.setComponents(this.elems.getElement("attributeListPanel"));
        this.initAchieveMentGroup();
    }

    protected initListeners() {
        this.addListValueChangeListener(this.achieveTitleGroup, this.onClickAchieveTitleGroup);
        this.addClickListener(this.adornBt, this.onClickAdbornBt);
        this.addClickListener(this.m_btnPy, this.onBtnPyClick);
        this.addClickListener(this.btnGet, this.onBtnGetClick);
    }

    open(showId: number = 0) {
        this.showTitleId = showId;
        super.open();
    }

    protected onOpen() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            //this.equipView.showModelBg(true);
            this.heroView.showFight(true);
        }
        //人物模型的初始化状态
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTitleActiveChangeRequest(Macros.TITLE_LIST_DATA));
        if (null == this.avatar) {
            this.avatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.avatar.setRenderLayer(5);
            this.avatar.hasWing = true;
            this.avatar.m_rebirthMesh.setRotation(20, 0, 0);
            this.avatar.setSortingOrder(this.sortingOrder);
        }
        let heroData = G.DataMgr.heroData;
        this.avatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
        this.tmpAchiId = this.titleData.curShowAchiTitleID;
        this.tmpSpecId = this.titleData.curShowSpecTitleID;
        this.updateView();
    }

    protected onClose() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
        if (this.avatar != null) {
            this.avatar.destroy();
            this.avatar = null;
        }
    }

    private initAchieveMentGroup() {
        let groupNames: string[] = ['赛季称号', '成就称号', '特殊称号'/*, '至尊称号'*/];
        let len = groupNames.length;
        this.achieveTitleGroup.Count = len;
        let infoPlat: number = Game.Config.plat;
        for (let i = 0; i < len; i++) {
            let obj = this.achieveTitleGroup.GetItem(i);
            let normalText = obj.findText('citem/normal/Textnormal');
            let selectedText = obj.findText('citem/selected/Textselected');
            this.canPeiYang = this.achieveTitleGroup.GetItem(1).findObject('citem/tipMark');
            normalText.text = groupNames[i];
            selectedText.text = groupNames[i];

            let titleArrByDisplay = this.titleData.getTitleArrByDisplay(i);
            let cfgs: GameConfig.TitleListConfigM[] = [];
            if (titleArrByDisplay) {
                let matchNum = -1;
                if(AchieveGroupTag.SaiJiTitle == i) {
                    matchNum = G.DataMgr.zhufuData.getSaiJiMax();
                }
                for (let config of titleArrByDisplay) {
                    if (config.m_usPlatId != KeyWord.PLAT_FORM_TYPE_GENERAL && config.m_usPlatId != infoPlat) {
                        continue;
                    }
                    if(matchNum >= 0 && (config.m_ucTitleID % 10) > matchNum) {
                        // 赛季称号在该赛季从未开始之前不显示
                        continue;
                    }
                    cfgs.push(config);
                }
            }
            this.allTitleIds.push(cfgs);
            let sublist = this.achieveTitleGroup.GetSubList(i);
            sublist.Count = cfgs.length;
            sublist.onVirtualItemChange = delegate(this, this.onTitleListChange);
            this.addListClickListener(sublist, this.onClickAchieveList);
        }
    }

    ////////////////////////////// 面板显示 /////////////////////////////////////////////
    /**容器发生变化*/
    onContainerChange(containerID: number): void {
        if (containerID == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updatePyMaterial();
        }
    }

    updateView() {
        let groupIndex: number = AchieveGroupTag.NormalAchieveTitle;
        if (this.showTitleId > 0) {
            let titleConfig = G.DataMgr.titleData.getDataConfig(this.showTitleId);
            groupIndex = titleConfig == null ? AchieveGroupTag.NormalAchieveTitle : titleConfig.m_ucDisplay;
        }
        this.achieveTitleGroup.Selected = groupIndex;
        this.updateAchievePanel(groupIndex);
    }


    updatePanel(id: number = 0): void {
        //先设置groupList选择页签
        if (id != 0) {
            this.showTitleId = id;
        }
        this.setTitleListData();
        if(this.achieveTitleGroup.Selected >= 0) {
            // this.selectedList.Count = this.titleListData.length;
            this.selectedList.Refresh();
            this.autoSelectedTitle();
        }
        this.canPeiYang.SetActive(G.DataMgr.titleData.canPeiYangTitles());
    }


    private onTitleListChange(item: ListItem) {
        let titleItem = item.data.titleItem as TitleListItem;
        let data = this.titleListData[item.Index];
        if (!item.data.titleItem) {
            titleItem = new TitleListItem();
            titleItem.setComponents(item.gameObject);
            item.data.titleItem = titleItem;
        }
        titleItem.update(data);
    }


    /**设置称号数据*/
    private setTitleListData() {
        this.titleListData.length = 0;
        let selectedTab = this.achieveTitleGroup.Selected;
        if(selectedTab >= 0) {
            let titleArrByDisplay = this.allTitleIds[selectedTab];
    
            for (let config of titleArrByDisplay) {
                let itemVo: TitleDressItemData = new TitleDressItemData();
                itemVo.config = config;
                itemVo.canPy = false;
                if (config.m_ucTitleType == KeyWord.TITLE_TYPE_ACHI) {
                    itemVo.had = this.titleData.checkHasTitle(config.m_ucTitleID);
                    itemVo.show = (this.titleData.curShowAchiTitleID == config.m_ucTitleID);
                    itemVo.addTime = 0;
                }
                else if (config.m_ucTitleType == KeyWord.TITLE_TYPE_SPECIAL) {
                    let specTitleOneInfo: Protocol.TitleFixOne = this.titleData.getSpecTitleOneInfo(config.m_ucTitleID);
                    itemVo.had = this.titleData.checkHasTitle(config.m_ucTitleID);
                    itemVo.show = this.titleData.curShowSpecTitleID == config.m_ucTitleID;
                    if (itemVo.had) {
                        itemVo.timeOut = specTitleOneInfo.m_uiTimeOut;
                        itemVo.addTime = specTitleOneInfo.m_uiAddNum;
                        if (itemVo.timeOut == 0 && itemVo.addTime < config.m_uiAddNum && config.m_iConsumeID > 0
                            && G.DataMgr.thingData.getThingNum(config.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) > 0) {
                            itemVo.canPy = true;
                        }
                    }
                    else {
                        itemVo.addTime = 0;
                    }
                }
                this.titleListData.push(itemVo);
            }
            this.titleListData.sort(this.titleCompare);
        }
    }


    private autoSelectedTitle() {
        if (this.showTitleId > 0) {
            for (let i = 0; i < this.titleListData.length; i++) {
                let itemVo = this.titleListData[i];
                if (itemVo.config.m_ucTitleID == this.showTitleId) {
                    this.selectedList.Selected = i;
                    this.selectedList.ScrollByAxialRow(i);
                    this.onClickAchieveList(i);
                    this.showTitleId = 0;
                    break;
                }
            }
        } else {
            this.selectedList.Selected = 0;
            this.selectedList.ScrollTop();
            this.onClickAchieveList(0);
        }
    }

    /**称号排序*/
    private titleCompare(a: TitleDressItemData, b: TitleDressItemData): number {
        //每个类型只有一个可佩带
        if (a.show) {
            return -1;
        }
        if (b.show) {
            return 1;
        }
        if (a.config.m_ucTitleID >= b.config.m_ucTitleID) {
            if (!a.had) {
                return 1;
            }
            else if (a.had && !b.had) {
                return -1;
            }
            else if (a.had && b.had) {
                return 1;
            }
        }
        else {
            if (!b.had) {
                return -1;
            }
            else if (b.had && !a.had) {
                return 1;
            }
            else if (b.had && a.had) {
                return -1;
            }
        }
        return 0;
    }


    private updateCurrentSelect(): void {
        //选中item的data数据
        if (this.currentDressItemData == null) {
            return;
        }
        this.currentTitleId = this.currentDressItemData.config.m_ucTitleID;
        switch (this.currentDressItemData.config.m_ucTitleType) {
            case KeyWord.TITLE_TYPE_ACHI:
                this.tmpAchiId = this.currentTitleId;
                break;
            case KeyWord.TITLE_TYPE_SPECIAL:
                this.tmpSpecId = this.currentTitleId;
                break;
            default:
        }
        //获取条件描述
        this.removeTimer('1');
        if (this.currentDressItemData.had) {
            if (this.currentDressItemData.timeOut == 0) {
                this.achieveConditionText.text = uts.format("获取途径{0}", TextFieldUtil.getColorText("(已获得)", Color.ORANGE));
                this.achieveDesText.text = '永久';
            } else {
                this.achieveConditionText.text = '获取途径(有效时间)';
                let currentTime: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                this._validTime = this.currentDressItemData.timeOut - currentTime;
                this.onTimer(null);
                this.addTimer('1', 1000, 0, this.onTimer);
            }
            this.btnGet.SetActive(false);
        } else {
            this.achieveConditionText.text = uts.format("获取途径{0}", TextFieldUtil.getColorText("(未获得)", Color.GREY));
            this.achieveDesText.text = this.currentDressItemData.config.m_szDesc;
            this.btnGet.SetActive(AchieveGroupTag.SaiJiTitle == this.currentDressItemData.config.m_ucDisplay);
        }
        this.updateTitleModel();
        if (this.currentDressItemData.addTime == undefined) {
            this.currentDressItemData.addTime = 0;
        }
        this.m_allProps = this.currentDressItemData.config.m_stPropAtt;
        this.m_pyTimes = this.currentDressItemData.addTime + 1;
        this.updateAttList();
        this.updateAdornBt();
        //培养相关
        this.peiYang.SetActive(true);
        if (this.currentDressItemData == null || !this.currentDressItemData.had || this.currentDressItemData.timeOut > 0
            || this.currentDressItemData.config.m_uiAddNum == 0) {
            this.m_pyMaterialData.id = 0;
            this.m_pyMaterialData.need = 0;
            this.peiYang.SetActive(false);
        }
        else if (this.currentDressItemData.addTime >= this.currentDressItemData.config.m_uiAddNum) {
            //培养到满级了
            this.fullLevelTxt.gameObject.SetActive(true);
            this.m_pyPanel.SetActive(false);
            this.fullLevelTxt.text = TextFieldUtil.getColorText('已经达到上限\n无法继续提升', Color.GREEN);
            // this.m_pyMaterialData.id = 0;
            // this.m_pyMaterialData.need = 0;
            // this.pyTimeText.text = uts.format('{0}{1}/{2}', TextFieldUtil.getColorText('培养次数：', Color.GREEN),
            //     this.currentDressItemData.config.m_uiAddNum, this.currentDressItemData.config.m_uiAddNum);
        }
        else {
            this.m_pyMaterialData.id = this.currentDressItemData.config.m_iConsumeID;
            if (this.m_pyMaterialData.id == 0) {
                this.fullLevelTxt.gameObject.SetActive(true);
                this.m_pyPanel.SetActive(false);
                this.fullLevelTxt.text = TextFieldUtil.getColorText('无法培养此称号', Color.GREEN);
            }else{
                this.fullLevelTxt.gameObject.SetActive(false);
                this.m_pyPanel.SetActive(true);
            }
            this.m_pyMaterialData.need = 1;
            this.pyTimeText.text = uts.format('{0}{1}/{2}', TextFieldUtil.getColorText('培养次数：', Color.GREEN),
                this.currentDressItemData.addTime, this.currentDressItemData.config.m_uiAddNum);
        }
        this.updatePyMaterial();
    }

    /**更新佩戴按钮的显示*/
    private updateAdornBt() {
        if (this.currentDressItemData.had) {
            this.adornBt.SetActive(true);
            this.adornBtName.text = this.currentDressItemData.show ? '卸下' : '佩戴';
            this.txtHaveInfo.gameObject.SetActive(false);
        } else {
            this.adornBt.SetActive(false);
            this.txtHaveInfo.gameObject.SetActive(true);
        }
    }

    /**更新称号模型*/
    private updateTitleModel(): void {
        let titleConfig: GameConfig.TitleListConfigM;
        let achiTitleID: number = 0;
        if (this.tmpAchiId > 0) {
            //当前选择普通成就
            titleConfig = this.titleData.getDataConfig(this.tmpAchiId);
            achiTitleID = titleConfig.m_uiImageID;
            G.ResourceMgr.loadModel(this.normalTitlePos, UnitCtrlType.chenghao, achiTitleID.toString(), 0);
            this.tmpAchiId = 0;
        }
        if (this.tmpSpecId > 0) {
            //当前选择特殊成就
            titleConfig = this.titleData.getDataConfig(this.tmpSpecId);
            achiTitleID = titleConfig.m_uiImageID;
            G.ResourceMgr.loadModel(this.normalTitlePos, UnitCtrlType.chenghao, achiTitleID.toString(), 0);
            this.tmpSpecId = 0;
        }
    }


    /**更新属性列表*/
    private updateAttList(): void {
        this.attListData.length = 0;
        this.attListDic = {};
        let allPropData: HeroAttItemData[] = [];
        let byPercent = this.currentDressItemData.config.m_bIsPercent != 0;
        for (let prop of this.m_allProps) {
            if (prop.m_ucPropId) {
                let itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                let macroId: number = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                itemVo.macroId = macroId;
                itemVo.addVal = prop.m_ucPropValue * this.m_pyTimes;
                allPropData.push(itemVo);
            }
        }
        //附加属性列表
        // for (let i = 0; i < this.max_props; i++) {
        //     let propName = ElemFinder.findText(this.propParent, i.toString());
        //     let str = '';
        //     if (i < allPropData.length) {
        //         str = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, allPropData[i].propId) + ":        ";
        //         let vStr: string;
        //         if (byPercent) {
        //             vStr = '+';
        //             vStr += Math.round(allPropData[i].addVal / 100);
        //             vStr += '%';
        //         } else {
        //             vStr = allPropData[i].addVal.toString();
        //         }
        //         str += TextFieldUtil.getColorText(vStr, Color.GREEN);
        //     }
        //     propName.text = str;
        // }
        this.attributeListPanel.clearProperty();
        for (let i = 0; i < allPropData.length; i++) {
            this.attributeListPanel.addProperty(allPropData[i].propId, allPropData[i].addVal);
        }
        this.attributeListPanel.refreshPropertyNode();
        //战斗力
        if (byPercent) {
            // 百分比加属性的则不计算战斗力，显示强者愈强
            this.fightUnlimit.SetActive(true);
            if (this.heroView != null) {
                this.heroView.showFight(true);
            }
        } else {
            this.fightUnlimit.SetActive(false);
            if (this.heroView != null) {
                this.heroView.showFight(true);
                //总战力
                this.heroView.setTxtFight((FightingStrengthUtil.calStrength(this.m_allProps) * this.m_pyTimes));
            }
        }
    }


    private onTimer(timer: Game.Timer): void {
        this._validTime--;
        if (this._validTime > 0) {
            this.achieveDesText.text = TextFieldUtil.getColorText(uts.format('剩余时间：{0}', TextFieldUtil.getColorText(DataFormatter.second2day(this._validTime), Color.GREEN)), Color.WHITE);
        }
        else {
            this.achieveConditionText.text = '获取途径(未获得)';
            this.achieveDesText.text = this.currentDressItemData.config.m_szDesc;
            this.removeTimer('1');
        }
    }

    /**获取属性列表*/
    private getHeroAttItemData(m_ucPropId: number): HeroAttItemData {
        let itemVo: HeroAttItemData = this.attListDic[m_ucPropId] as HeroAttItemData;
        if (!itemVo && m_ucPropId > 0) {
            itemVo = new HeroAttItemData();
            let macroId: number = PropUtil.getPropMacrosByPropId(m_ucPropId);
            itemVo.macroId = macroId;
            this.attListData.push(itemVo);
            this.attListDic[m_ucPropId] = itemVo;
        }
        return this.attListDic[m_ucPropId];
    }


    ///////////////////////培养面板/////////////////////////////////////////////////


    private updatePyMaterial(): void {
        if (this.m_pyMaterialData.id != 0) {
            this.m_pyMaterialData.has = G.DataMgr.thingData.getThingNum(this.m_pyMaterialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            this.m_pyMaterialIconItem.updateByMaterialItemData(this.m_pyMaterialData);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setButtonClickAble(this.m_btnPy, true);
        }
        else {
            this.m_pyMaterialIconItem.updateByMaterialItemData(null);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setButtonClickAble(this.m_btnPy, false);
        }
        
    }


    private onBtnPyClick(): void {
        if (this.m_pyMaterialData.has < this.m_pyMaterialData.need) {
            G.TipMgr.addMainFloatTip('您的培养材料不足');
        }
        else {
            if (this.currentDressItemData == null) {
                uts.log('没选择要培养的称号，就发协议了');
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaPyRequest(Macros.IMAGE_TRAIN_TITLE, 0, this.currentDressItemData.config.m_ucTitleID));
        }
    }

    private onBtnGetClick(): void {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, 0);
    }


    //////////////////////////////////点击事件/////////////////////////////////////
    private onClickAchieveTitleGroup(index: number) {
        //点击成就、特殊、至尊称号group
        if (this.selectedList)
            this.selectedList.SetSlideAppearRefresh();
        this.updateAchievePanel(index);
    }
    
    private updateAchievePanel(index: number) {
        //this.achieveKeyWord = index == AchieveGroupTag.NormalAchieveTitle ? KeyWord.TITLE_TYPE_ACHI : KeyWord.TITLE_TYPE_SPECIAL;
        this.selectedList = this.achieveTitleGroup.GetSubList(index);
        this.updatePanel();
    }

    /**点击穿戴按钮*/
    private onClickAdbornBt() {
        G.AudioMgr.playBtnClickSound();
        let type = this.currentDressItemData.show ? 0 : 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTitleActiveChangeRequest(Macros.TITLE_SET_SHOW, this.currentTitleId, type));
    }

    private onClickAchieveList(index: number) {
        //点击成就称号List
        this.currentDressItemData = this.titleListData[index];
        this.updateCurrentSelect();
    }

}