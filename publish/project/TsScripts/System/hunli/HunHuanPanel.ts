import { HunHuanJinSheng } from './HunHuanJinSheng';
import { TipMarkUtil } from './../tipMark/TipMarkUtil';
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
import { HunLiView } from 'System/hunli/HunLiView'
import { HunLiPanel } from 'System/hunli/HunLiPanel'
import { MonsterData } from 'System/data/MonsterData'
import { BossView } from 'System/pinstance/boss/BossView'
import { EnumGuide } from 'System/constants/GameEnum'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
export class HunHuanPanel extends TabSubForm {
    private selectedIndex: number = 0;
    private config: GameConfig.HunHuanConfigM;
    private isJinSheng: boolean;
    private jinshengCfg: GameConfig.HunHuanLevelUpConfigM;
    private txtFightValue: TextGetSet;
    private list: List;
    private btnGet: GameObjectGetSet;
    private propList: List;
    private txtHas: TextGetSet;
    private txtCondition: TextGetSet;
    btnGo: GameObjectGetSet;
    private modelRoot: GameObjectGetSet;
    private hunliView: HunLiView;
    /**当前魂环数据*/
    private curHunhuanData: GameConfig.HunHuanConfigM;
    private curData: GameConfig.HunHuanConfigM;;
    /**角色模型*/
    private roleAvatar: UIRoleAvatar;
    /**模型父物体*/
    private rolePosition: UnityEngine.Transform = null;
    //注入魂力能量值
    private imgSlider: UnityEngine.UI.Image;
    private txtCurSlider: TextGetSet;
    private iconImg: GameObjectGetSet;
    private materialItemicon: IconItem;
    private materialData: MaterialItemData = new MaterialItemData();
    private itemIcon_Normal: GameObjectGetSet;
    private btnGoText: TextGetSet;
    private textDesc: TextGetSet;
    private title: TextGetSet;
    //右侧面板的名字
    private titleName: TextGetSet;
    //右侧战力
    private rightFight: TextGetSet;
    private upEffect: GameObjectGetSet;
    private isActiveObj: GameObjectGetSet;
    private jinShengObj: GameObjectGetSet;
    //晋升界面
    private jinshengPanel: HunHuanJinSheng;
    private modelEffectRoot: GameObjectGetSet;
    //魂环展示
    private showHunHuanEffect: GameObjectGetSet;
    private btnGoTo:GameObjectGetSet;
    private gotoText:TextGetSet;
    private nameTexts:UnityEngine.UI.Text[]=[];
    private actives:UnityEngine.GameObject[]=[];
    private notActives:UnityEngine.GameObject[]=[];
    //魂环激活后的文字显示特效
    private leveUpEffectRoot: GameObjectGetSet;
    private activeText:UnityEngine.UI.Text;
    private hunhuanEffectRoot:GameObjectGetSet;
    /**刷新魂环数据 （通过角色当前装备的魂环id获得） */
    private refreshHunhuanData() {
        let hunhuanId = G.DataMgr.heroData.avatarList.m_uiHunHuanID;
        this.curHunhuanData = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
    }

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNHUAN);
    }

    protected resPath(): string {
        return UIPathData.HunHuanPanel;
    }

    protected initElements() {
        //人物
        this.rolePosition = this.elems.getTransform("rolePosition");
        this.txtFightValue = new TextGetSet(this.elems.getText("fightText"));
        this.list = this.elems.getUIList("list");
        this.list.Count = HunLiPanel.hunliConfigLength;
        this.btnGet = new GameObjectGetSet(this.elems.getElement("btnWear"));
        this.propList = this.elems.getUIList("propList");
        this.txtHas = new TextGetSet(this.elems.getText("txtHas"));
        this.txtCondition = new TextGetSet(this.elems.getText("txtCondition"));
        this.btnGo = new GameObjectGetSet(this.elems.getElement("btnGo"));
        this.btnGoText = new TextGetSet(ElemFinder.findText(this.btnGo.gameObject, 'Text'));
        this.modelRoot = new GameObjectGetSet(this.elems.getElement("modelRoot"));
        this.titleName = new TextGetSet(this.elems.getText("titleName"));
        this.rightFight = new TextGetSet(this.elems.getText('rightFight'));
        this.imgSlider = this.elems.getImage("imgSlider");
        this.txtCurSlider = new TextGetSet(this.elems.getText("txtCurSlider"));
        this.iconImg = new GameObjectGetSet(this.elems.getElement("icon"));
        this.itemIcon_Normal = new GameObjectGetSet(this.elems.getElement('itemIcon_Normal'));
        this.materialItemicon = new IconItem();
        this.materialItemicon.setUsualIconByPrefab(this.itemIcon_Normal.gameObject, this.iconImg.gameObject);
        this.materialItemicon.setTipFrom(TipFrom.material);
        this.textDesc = new TextGetSet(this.elems.getText('textDesc'));
        this.title = new TextGetSet(this.elems.getText('title'));
        this.activeText = this.elems.getText('activeText');

        this.isActiveObj = new GameObjectGetSet(this.elems.getElement("isActiveObj"));
        this.jinShengObj = new GameObjectGetSet(this.elems.getElement("jinShengObj"));
        //晋升特效
        this.modelEffectRoot = new GameObjectGetSet(this.elems.getElement("modelEffectRoot"));
        this.leveUpEffectRoot = new GameObjectGetSet(this.elems.getElement("leveUpEffectRoot"));
        this.hunhuanEffectRoot = new GameObjectGetSet(this.elems.getElement('hunhuanEffectRoot'));
        this.upEffect = new GameObjectGetSet(this.elems.getElement('upEffect'));
        this.btnGoTo = new GameObjectGetSet(this.elems.getElement('btnGoTo'));
        this.gotoText = new TextGetSet(this.elems.getText('desc'));

        this.upEffect.SetActive(false);
        for (let i = 0; i < this.list.Count; i++) {
            let cfg = G.DataMgr.hunliData.getHunHuanConfigByIndex(i);
            let itemObj = this.list.GetItem(i);
            let txtName =  itemObj.findText("txtName");
            let txtNameWhite = itemObj.findText("selectedStage/txtNameWhite");
            let active = ElemFinder.findObject(this.list.GetItem(i).gameObject, 'active');
            let notActive = ElemFinder.findObject(this.list.GetItem(i).gameObject, 'activing');
            this.actives.push(active);
            this.notActives.push(notActive);
            this.nameTexts.push(txtName);
            txtName.text = cfg.m_szName;
            txtNameWhite.text = cfg.m_szName;
        }
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnGet.gameObject, this.onClickBtnGo);
        this.addClickListener(this.btnGoTo.gameObject, this.onClickGoTo);

    }

    protected onOpen() {
        super.onOpen();
        this.hunliView = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (this.hunliView != null && this.hunliView.isOpened) {
            this.hunliView.openTitleFight();
        }
        //角色Avatar
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        let heroData = G.DataMgr.heroData;
        this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
        this.addTimer('idleDelay', 5000, 0, delegate(this, this.onIdleDelayTimer));
        this.refreshHunhuanData();
        let hunliData = G.DataMgr.hunliData;
        let cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
        if (cfg == null) {
            this.list.Selected = 0;
        } else {
            if (cfg.m_iRequireHunLiLevel == 9) {
                this.list.Selected = 8;
            } else {
                this.list.Selected = cfg.m_iRequireHunLiLevel;
            }
        }
        if (G.DataMgr.hunliData.canLevelUp() > 0) {
            this.list.Selected = G.DataMgr.hunliData.canLevelUp() - 1;
        }
        this.updateView();
        // this.onClickList(this.list.Selected);
        //this.updateFightText();hero female
        G.GuideMgr.processGuideNext(EnumGuide.HunHuanActive, EnumGuide.HunHuanActive_ClickAction);
    }
    private onIdleDelayTimer(timer: Game.Timer) {
        if (this.roleAvatar) {
            if (this.roleAvatar.defaultAvatar.isPlaying("stand"))
                this.roleAvatar.defaultAvatar.playAnimation("show_idle", 0.2);
        }
    }
    protected onClose() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        if (this.hunliView != null && this.hunliView.isOpened) {
            this.hunliView.closeTitleFight();
        }
        G.ResourceMgr.loadModel(this.modelRoot.gameObject, UnitCtrlType.other, null, 0);
    }

    private onClickList(index: number) {
        this.updateHuanHuanLevelUp(index);
        this.selectedIndex = index;
        this.config = G.DataMgr.hunliData.getHunHuanConfigByIndex(index);
        this.titleName.text = this.config.m_szName;
        let len = this.config.m_astProp.length;
        let fightCount = 0;
        for (let i = 0; i < len; i++) {
            let prop = this.config.m_astProp[i];
            if (index > 0) {
                let lastCfg = G.DataMgr.hunliData.getHunHuanConfigByIndex(index - 1);
                let lastProp = lastCfg.m_astProp[i];
                fightCount += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue - lastProp.m_iPropValue);
            } else {
                fightCount += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue);
            }
        }
        if (this.isJinSheng) {
            this.jinshengCfg = G.DataMgr.hunliData.getHunHuanLevelUpById(this.config.m_iID, G.DataMgr.hunliData.hunhuanLevelInfoList[index].m_ucLevel);
            for (let i = 0; i < len; i++) {
                fightCount += FightingStrengthUtil.calStrengthByOneProp(this.jinshengCfg.m_astProp[i].m_ucPropId, this.jinshengCfg.m_astProp[i].m_iPropValue);
            }
        }
        this.rightFight.text = fightCount.toString();
        if (this.config == null) return;
        this.updateRightView();
        // this.materialItemicon.updateById(this.config.m_iConsumeID, this.config.m_iConsumeNumber);-20 -30 5 -30 -130
        this.materialData.id = this.config.m_iConsumeID;
        this.materialData.has = G.DataMgr.thingData.getThingNum(this.materialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.materialData.need = this.config.m_iConsumeNumber;

        this.materialItemicon.updateByMaterialItemData(this.materialData);
        this.materialItemicon.updateIcon();
    }
    private updateTipmark() {
        //没有激活的时候
        this.updateActiveTipMark();
        //激活的时候 
        this.updateLevelUpMark();
    }
    private updatePage(){
        let hunliData = G.DataMgr.hunliData;
        if (this.curData!=null) {
            for (let i = 0; i < this.curData.m_iRequireHunLiLevel; i++) {
                //已经激活的全部显示
                this.actives[i].SetActive(true);
                this.nameTexts[i].color =  UnityEngine.Color.white;
            }
            //进行中是还没有激活的
            if (this.curData.m_iRequireHunLiLevel<9) {
                this.notActives[this.curData.m_iRequireHunLiLevel].SetActive(true);
                //上一个
                this.notActives[this.curData.m_iRequireHunLiLevel - 1].SetActive(false)
            }else{
                this.notActives[this.curData.m_iRequireHunLiLevel-1].SetActive(false)
            }
            
        } else {
            this.notActives[0].SetActive(true);
        }
    }
    
    updateActiveTipMark() {
        //激活的小红点
        if (G.DataMgr.hunliData.level > 0) {
            let itemMark1:UnityEngine.GameObject;
            let cfg:GameConfig.HunHuanConfigM;
        
            if (G.DataMgr.hunliData.hunhuanId > 0) {
                cfg = G.DataMgr.hunliData.getHunHuanConfigById(G.DataMgr.hunliData.hunhuanId);
                if (G.DataMgr.hunliData.level == 9 && cfg.m_iRequireHunLiLevel == 9) {
                    let itemMark = ElemFinder.findObject(this.list.GetItem(cfg.m_iRequireHunLiLevel - 1).gameObject, 'tipMark');
                    itemMark.SetActive(false);
                    return;
                }
                //魂环等级从1开始
                //当前魂环
                itemMark1 = ElemFinder.findObject(this.list.GetItem(cfg.m_iRequireHunLiLevel).gameObject, 'tipMark');
                //上一魂环
                if (cfg.m_iRequireHunLiLevel > 0) {
                    let itemMark2 = ElemFinder.findObject(this.list.GetItem(cfg.m_iRequireHunLiLevel - 1).gameObject, 'tipMark');
                    itemMark2.SetActive(false);
                }
            } else {
                cfg = G.DataMgr.hunliData.getHunHuanConfigByIndex(0);
                itemMark1 = ElemFinder.findObject(this.list.GetItem(0).gameObject, 'tipMark');
            }
            itemMark1.SetActive(G.DataMgr.hunliData.showHunHuanMark());
        }
    }
    updateLevelUpMark() {
        let hunlidate = G.DataMgr.hunliData;
        if (hunlidate.hunhuanId > 0) {
            for (let i = 0; i < this.curData.m_iRequireHunLiLevel; i++) {
                let jinshengCfg = hunlidate.getHunHuanConfigByIndex(i);
                let itemMark = ElemFinder.findObject(this.list.GetItem(i).gameObject, 'tipMark');
                if (hunlidate.hunhuanLevelInfoList[i].m_ucLevel < 27) {
                    let nextLevelUpCfg = hunlidate.getHunHuanLevelUpById(jinshengCfg.m_iID, hunlidate.hunhuanLevelInfoList[i].m_ucLevel + 1)
                    if (nextLevelUpCfg.m_iCost <= G.DataMgr.heroData.haishenhunli) {
                        itemMark.SetActive(true);
                    } else {
                        itemMark.SetActive(false);
                    }
                } else {
                    itemMark.SetActive(false);
                }

            }
        }
    }
    onClickActive() {
        if (G.DataMgr.hunliData.level < this.config.m_iRequireHunLiLevel) {
            G.TipMgr.addMainFloatTip("条件未达成！");
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunhuanWearRequest(Macros.HUNLI_HUNHUAN_ACTIVE, this.config.m_iID));
        }
        G.GuideMgr.processGuideNext(EnumGuide.HunHuanActive, EnumGuide.HunHuanActive_ClickActiveBtn1);
    }

    /**注入能量值 */
    onClickZhuRu() {
        let hunliData = G.DataMgr.hunliData;
        let cfg;
        let lastcfg;
        if (hunliData.level > 0) {
            if (hunliData.hunhuanId == 0) {
                cfg = hunliData.getHunHuanConfigByIndex(0);
                lastcfg = hunliData.getHunHuanConfigByIndex(0);
            } else {
                cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
                lastcfg = hunliData.getHunHuanConfigByIndex(cfg.m_iRequireHunLiLevel);
            }
            if (this.list.Selected > cfg.m_iRequireHunLiLevel) {
                let hunhuan: string = uts.format('请先激活{0}', lastcfg.m_szName)
                G.TipMgr.addMainFloatTip(hunhuan);
            } else {
                if (hunliData.level > 0) {
                    // let cfg = G.DataMgr.hunliData.getHunHuanConfigByLevel(hunliData.level);
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunhuanWearRequest(Macros.HUNLI_HUNHUAN_ZHURU, this.config.m_iID));
                    if (TipMarkUtil.isHunhuanActive()) {
                        this.playUpEffect();
                    }
                }
            }
        } else {
            G.TipMgr.addMainFloatTip('当前魂力不足');
        }
        G.GuideMgr.processGuideNext(EnumGuide.HunHuanActive, EnumGuide.HunHuanActive_ClickActiveBtn);
    }

    private onClickBtnGo() {
        if (this.config.m_iRequireHunLiLevel > G.DataMgr.hunliData.level) {
            G.TipMgr.addMainFloatTip("魂力不足！");
        } else {
            let conditionLink = this.config.m_iConditionLink;
            let qid: number = G.DataMgr.funcLimitData.getFuncLimitConfig(conditionLink).m_ucAcceptQuest;
            //任务领取后开启功能
            if (G.DataMgr.questData.isQuestCompleted(qid)) {
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS);
            }
        }
    }
    private onClickGoTo(){
        if (this.hunliView) {
            this.hunliView.open(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
        }
    }

    updateView(isLevel: boolean = false, levle: number = 0) {
        this.curData = G.DataMgr.hunliData.getHunHuanConfigById(G.DataMgr.hunliData.hunhuanId);
        //如果可以晋升就自动选中可以晋升的魂环
        if (isLevel == true) {
            this.addTimer("delayLoad", 800, 1, this.lateEffectLoad);
            this.playUpEffect();
        }
        this.onClickList(this.list.Selected);
        this.updateTipmark();
        this.updatePage();
        if (this.config == null) return;
        this.updateFightText();
    }
    /**激活之后刷新魂环晋升界面 */
    private updateHuanHuanLevelUp(index: number) {
        if (G.DataMgr.hunliData.hunhuanId > 0) {
            this.isJinSheng = this.curData.m_iRequireHunLiLevel > index;
            this.isActiveObj.SetActive(!this.isJinSheng);
            this.jinShengObj.SetActive(this.isJinSheng);
            G.DataMgr.hunliData.canJinShengMaxNum = this.curData.m_iRequireHunLiLevel;
            if (this.isJinSheng) {
                this.jinshengPanel = new HunHuanJinSheng();
                this.jinshengPanel.setComponents(this.jinShengObj.gameObject);
                this.jinshengPanel.updateJinShengView(index);
            }
        }
    }

    private updateHunHuan(node:UnityEngine.GameObject) {
        //激活的时候有魂环 没有激活就不显示
        if (this.config.m_iRequireHunLiLevel > 0 && this.config.m_iRequireHunLiLevel < 3) {
            G.ResourceMgr.loadModel(node, UnitCtrlType.other, uts.format("effect/hunhuan/bainian.prefab"), this.sortingOrder);
        } else if (this.config.m_iRequireHunLiLevel >= 3 && this.config.m_iRequireHunLiLevel < 5) {
            G.ResourceMgr.loadModel(node, UnitCtrlType.other, uts.format("effect/hunhuan/qiannian.prefab"), this.sortingOrder);
        } else if (this.config.m_iRequireHunLiLevel >= 5 && this.config.m_iRequireHunLiLevel < 9) {
            G.ResourceMgr.loadModel(node, UnitCtrlType.other, uts.format("effect/hunhuan/wannian.prefab"), this.sortingOrder);
        } else {
            G.ResourceMgr.loadModel(node, UnitCtrlType.other, uts.format("effect/hunhuan/shiwannian.prefab"), this.sortingOrder);
        }
    }

    private updateFightText() {
        let hunliData = G.DataMgr.hunliData;
        //当前激活的魂力等级
        let level = hunliData.level;
        let cfg;
        if (hunliData.level == 0) {
            cfg = null;
        } else {
            cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
        }
        if (cfg == null) {
            this.hunliView.setTitleFight(0);
        } else {
            let len = cfg.m_astProp.length;
            let fightCount = 0;
            let jinsCfg:GameConfig.HunHuanLevelUpConfigM;
            if (G.DataMgr.hunliData.hunhuanId>0) {
                let hunliData = G.DataMgr.hunliData;
                //当前佩戴的魂环的等级
                let hunhuanLevel = hunliData.getHunHuanConfigById(hunliData.hunhuanId).m_iRequireHunLiLevel;
                jinsCfg = G.DataMgr.hunliData.getHunHuanLevelUpById(this.config.m_iID, hunliData.hunhuanLevelInfoList[hunhuanLevel-1].m_ucLevel);
            }
            for (let i = 0; i < len; i++) {
                let prop = cfg.m_astProp[i];
                fightCount += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue);
                if (jinsCfg != null) {
                    fightCount += FightingStrengthUtil.calStrengthByOneProp(jinsCfg.m_astProp[i].m_ucPropId, jinsCfg.m_astProp[i].m_iPropValue);
                }
            }
           let fight = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
            //this.txtFightValue.text = '战斗力 ' + fightCount.toString();
            this.hunliView.setTitleFight(fight);
        }
    }

    private updateRightView() {
        let hunliData = G.DataMgr.hunliData;
        let maxNum: number = this.config.m_iConditionValue;
        let curNum: number;
        if (hunliData.hunhuanId < this.config.m_iID) {
            // 未激活
            this.txtHas.text = '(未获得)';
            this.title.text = '激活后显示属性加成';
            let config = G.DataMgr.hunliData.getHunLiConfigByLevel(G.DataMgr.hunliData.level,1);
            if ((0 == hunliData.hunhuanId && 1 == this.config.m_iRequireHunLiLevel) || hunliData.hunhuanId + 1 == this.config.m_iID) {
                curNum = G.DataMgr.hunliData.hunhuanProgress;
                if (hunliData.level >= this.config.m_iRequireHunLiLevel) {
                    this.textDesc.text = '注入足够的魂力激活魂环';
                    if (curNum >= maxNum) {
                        this.btnGoText.text = '激活';
                        this.addClickListener(this.btnGo.gameObject, this.onClickActive);
                    } else {
                        this.title.text = '当前阶级属性加成';
                        this.btnGoText.text = '注入';
                        this.addClickListener(this.btnGo.gameObject, this.onClickZhuRu);
                    }
                    UIUtils.setButtonClickAble(this.btnGo.gameObject, true);
                    this.btnGo.SetActive(true);
                    this.btnGet.SetActive(true);
                    this.btnGoTo.SetActive(false);
                    this.gotoText.gameObject.SetActive(false);
                } else {
                    let hunliCfg = hunliData.getHunLiConfigByLevel(this.config.m_iRequireHunLiLevel, 1);
                    this.textDesc.text = uts.format('魂力达到{0}后开始注入', hunliCfg.m_szName);
                    this.btnGo.SetActive(false);
                    this.btnGet.SetActive(false);
                    this.btnGoTo.SetActive(true&&(config!=null));
                    this.gotoText.gameObject.SetActive(true&&(config!=null));
                    if (config!=null) {
                        this.gotoText.text = uts.format('当前：{0}',config.m_szName);
                    }
                }
            } else {
                curNum = 0;
                this.textDesc.text = uts.format('请先激活{0}', (0 == hunliData.hunhuanId ? hunliData.getHunHuanConfigByIndex(0) : hunliData.getHunHuanConfigById(hunliData.hunhuanId + 1)).m_szName);
                this.btnGo.SetActive(false);
                this.btnGet.SetActive(false);
                this.btnGoTo.SetActive(true&&(config!=null));
                this.gotoText.gameObject.SetActive(true&&(config!=null));
                if (config!=null) {
                    this.gotoText.text = uts.format('当前：{0}',config.m_szName);
                }
            }
        } else {
            // 已激活
            this.title.text = '当前阶级属性加成';
            curNum = maxNum;
            this.textDesc.text = '';
            this.txtHas.text = '(已获得)';
            this.btnGoText.text = '已激活';
            UIUtils.setButtonClickAble(this.btnGo.gameObject, false);
            this.btnGo.SetActive(true);
            this.btnGet.SetActive(false);
            this.btnGoTo.SetActive(false);
        }
        this.imgSlider.fillAmount = 0.08 + (curNum / maxNum) * (0.92 - 0.08);
        this.txtCurSlider.text = uts.format('{0}/{1}', curNum, maxNum);
        if (curNum == maxNum) {
            this.imgSlider.fillAmount = 1;
            this.materialItemicon.closeItemCount();
        } else if (curNum == 0) {
            this.imgSlider.fillAmount = 0;
            this.materialItemicon.openItemCount();
        }
        else {
            this.materialItemicon.openItemCount();
        }
        this.updatePropValue();
        this.updateHunHuan(this.modelRoot.gameObject);
    }
    /**刷新属性 */
    private updatePropValue() {
        let propRate = 1;
        let hunliData = G.DataMgr.hunliData;
        let maxNum: number = this.config.m_iConditionValue;
        let curNum: number = G.DataMgr.hunliData.hunhuanProgress;;
        if (hunliData.hunhuanId < this.config.m_iID) {
            propRate = Math.floor(curNum / maxNum / 0.2) * 0.05;
        }
        this.propList.Count = this.config.m_astProp.length;
        for (let i = 0; i < this.propList.Count; i++) {
            let itemObj = this.propList.GetItem(i);
            let txtName = itemObj.findText("name");
            let txtValue = itemObj.findText("value");
            let prop = this.config.m_astProp[i];
            txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, prop.m_ucPropId);
            let value: number = 0;
            let cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
            if (this.list.Selected > 0) {
                let lastCfg = hunliData.getHunHuanConfigByIndex(this.list.Selected - 1);
                let lastProp = lastCfg.m_astProp[i];
                if (hunliData.hunhuanId > 0) {
                    if (cfg.m_iRequireHunLiLevel + 1 < this.config.m_iRequireHunLiLevel || hunliData.level < this.config.m_iRequireHunLiLevel) {
                        value = Math.floor(prop.m_iPropValue - lastProp.m_iPropValue);
                    } else {
                        value = Math.floor((prop.m_iPropValue - lastProp.m_iPropValue) * propRate);
                    }
                    txtValue.text = value.toString();
                    if (this.isJinSheng) {
                        //加上可以晋升的属性
                        value += Math.floor(this.jinshengCfg.m_astProp[i].m_iPropValue);
                    }
                } else if (hunliData.level == this.config.m_iRequireHunLiLevel) {
                    value = Math.floor((prop.m_iPropValue - lastProp.m_iPropValue) * propRate);
                } else {
                    value = Math.floor(prop.m_iPropValue - lastProp.m_iPropValue);
                }
            } else {
                if (hunliData.hunhuanId > 0) {
                    if (cfg.m_iRequireHunLiLevel + 1 < this.config.m_iRequireHunLiLevel || hunliData.level < this.config.m_iRequireHunLiLevel) {
                        value = Math.floor(prop.m_iPropValue);
                    } else {
                        value = Math.floor((prop.m_iPropValue) * propRate);
                    }
                    txtValue.text = value.toString();
                    if (this.isJinSheng) {
                        //加上可以晋升的属性
                        value += Math.floor(this.jinshengCfg.m_astProp[i].m_iPropValue);
                    }
                } else if (hunliData.level == this.config.m_iRequireHunLiLevel) {
                    value = Math.floor((prop.m_iPropValue) * propRate);
                } else {
                    value = Math.floor(prop.m_iPropValue);
                }

            }
            txtValue.text = value.toString();
        }

    }

    /** 晋升成功的特效leveUpEffectRoot*/
    private lateEffectLoad() {
        G.ResourceMgr.loadModel(this.modelEffectRoot.gameObject, UnitCtrlType.reactive, "effect/ui/RY_yingxiongchuchang.prefab", this.sortingOrder);
    }

    /**激活成功的文字特效 */
     textEffect(){
        this.activeText.gameObject.SetActive(true);
        this.leveUpEffectRoot.gameObject.SetActive(true);
        this.hunhuanEffectRoot.SetActive(true);
        G.ResourceMgr.loadModel(this.leveUpEffectRoot.gameObject, UnitCtrlType.reactive, "effect/uitx/panding/hunlishouji.prefab", this.sortingOrder);
        this.activeText.text = uts.format('成功激活{0}！',this.config.m_szName);
        this.addTimer('textEffect',3000,1,this.playEnd);
    }

    private playEnd(){
        this.activeText.gameObject.SetActive(false);
        this.leveUpEffectRoot.gameObject.SetActive(false);
        this.hunhuanEffectRoot.SetActive(false);
    }


    private showEffect() {
        // G.ResourceMgr.loadModel(this.showHunHuanEffect.gameObject, UnitCtrlType.reactive, "effect/hunhuan/hunhuan_zhanshi.prefab", this.sortingOrder);
    }
  
    /**注入成功特效 */
    private playUpEffect() {
        this.upEffect.SetActive(false);
        this.upEffect.SetActive(true);
        Game.Invoker.BeginInvoke(this.upEffect.gameObject, "effect", 0.9, delegate(this, this.onEndUpEffect));
    }

    private onEndUpEffect() {
        this.upEffect.SetActive(false);
    }
}