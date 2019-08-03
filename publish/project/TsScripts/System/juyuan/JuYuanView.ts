import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { JuyuanData } from 'System/data/JuyuanData'
import { Global as G } from 'System/global'
import { JuyuanRule } from 'System/juyuan/JuyuanRule'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { JuYuanUtils } from 'System/juyuan/JuYuanUtils'
import { UIUtils } from 'System/utils/UIUtils'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { KeyWord } from 'System/constants/KeyWord'
import { HeroView } from 'System/hero/view/HeroView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumGuide } from 'System/constants/GameEnum'
import { UIEffect, EffectType } from 'System/uiEffect/UIEffect'
import { ThingData } from 'System/data/thing/ThingData'
import { JuYuanFashionView } from 'System/juyuan/JuYuanFashionView'
import { Macros } from 'System/protocol/Macros'
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule } from "System/constants/GameEnum";
import { WybqView } from "System/hero/view/WybqView"
import { TouXianZongLanView, titleListItemData } from 'System/juyuan/TouXianZongLanView'
import { IconItem } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { TipFrom } from 'System/tip/view/TipsView'
import { JinjieView } from 'System/jinjie/view/JinjieView'


enum JuYuanStage {
    start = 1,
    middle = 2,
    last = 3,
    dianfeng = 4,
}

export class JuYuanView extends CommonForm implements IGuideExecutor {

    /**突破按钮*/
    btn_break: UnityEngine.GameObject = null;
    /**关闭按钮*/
    btn_close: UnityEngine.GameObject = null;
    /**右侧面板，用于新手引导*/
    rightGoPanelNext: UnityEngine.GameObject;
    /**变强按钮*/
    btn_bianqiang: UnityEngine.GameObject = null;
    /**头衔预览按钮*/
    btn_touxian: UnityEngine.GameObject = null;
    private jinjitiaojianIcon: UnityEngine.GameObject;
    protected iconAltas: Game.UGUIAltas = null;

    private readonly max_juYuanIcon = 13;
    private max_propsNum: number = 12;
    private max_breakCondition: number = 3;
    private max_juyuanDress: number = 5;
    private needInfoParent: UnityEngine.GameObject;
    private fightTextCur: UnityEngine.UI.Text;
    private fightTextNext: UnityEngine.UI.Text;
    private propParentCur: UnityEngine.GameObject;
    private propParentNext: UnityEngine.GameObject;
    private titleCur: UnityEngine.UI.Image;
    private titleNext: UnityEngine.UI.Image;
    private m_selectState: boolean = false;
    private juYuanIconParent: UnityEngine.GameObject;
    private slider_JuYuan: UnityEngine.UI.Slider;
    private rolePosition: UnityEngine.Transform;
    private fashion: UnityEngine.GameObject;
    private juYuanBtParent: UnityEngine.GameObject;
    private name_FashionText: UnityEngine.UI.Text;
    private btn_huanHua: UnityEngine.GameObject;
    /**时装avatarList*/
    private m_avatarList: Protocol.AvatarList = null;
    /**角色模型*/
    private roleAvatar: UIRoleAvatar;
    private btnEffectPrefab: UnityEngine.GameObject;
    //5个特效预制体
    private container: UnityEngine.GameObject;
    private juyuanMainPrefab: UnityEngine.GameObject;
    private juyuanMains: UIEffect[] = [];
    private juyuanGreen: UIEffect;
    private juyuanPurple: UIEffect;
    private juyuanRed: UIEffect;
    private juyuanYellow: UIEffect;
    private isHasCreatEffext: boolean = false;
    //突破成功特效
    private effectTrans: UnityEngine.GameObject;
    private tupoSucceedPrefab: UnityEngine.GameObject;
    private tupoSucceedEffect: UIEffect;
    private dressIds: number[] = [];
    private juYuanData: JuyuanData = null;
    private upBtText: UnityEngine.UI.Text;
    private manjieTips: UnityEngine.GameObject;
    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;

    //突破材料
    private icon: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private iconItem: IconItem;
    private materialItemData: MaterialItemData = new MaterialItemData();



    constructor() {
        super(KeyWord.OTHER_FUNCTION_JU_YUAN);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.JuYuanView;
    }

    protected initElements() {
        this.icon = this.elems.getElement("icon");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

        this.jinjitiaojianIcon = this.elems.getElement("titleBack2");
        this.manjieTips = this.elems.getElement("manjieTips");

        this.fightTextCur = this.elems.getText("fightTextCur");
        this.fightTextNext = this.elems.getText("fightTextNext");
        this.propParentCur = this.elems.getElement("propParentCur");
        this.propParentNext = this.elems.getElement("propParentNext");
        this.titleCur = this.elems.getImage("titleCur");
        this.titleNext = this.elems.getImage("titleNext");
        this.needInfoParent = this.elems.getElement("tupoNeed");
        this.juYuanIconParent = this.elems.getElement("ballIcons");
        this.slider_JuYuan = this.elems.getSlider("silder");
        this.btn_break = this.elems.getElement("btn_tupo");
        this.btn_bianqiang = this.elems.getElement("btn_bianqiang");
        this.btn_touxian = this.elems.getElement("btn_touxian");
        this.rolePosition = this.elems.getTransform("rolePosition");
        this.fashion = this.elems.getElement("shizhuang");
        this.btn_close = this.elems.getElement("returnBt");
        this.juYuanBtParent = this.elems.getElement("allTopBt");
        this.name_FashionText = this.elems.getText("fashionName");
        this.btn_huanHua = this.elems.getElement("btn_huanHua");
        this.upBtText = ElemFinder.findText(this.btn_break, "Text");
        //添加特效
        this.container = this.elems.getElement("container");
        this.juyuanMainPrefab = this.elems.getElement("juyuanMain");
        this.rightGoPanelNext = this.elems.getElement('rightPanelNext');
        for (let i = 1; i <= this.max_juYuanIcon; i++) {
            this.juyuanMains[i] = new UIEffect();
            this.juyuanMains[i].setEffectPrefab(this.juyuanMainPrefab, ElemFinder.findObject(this.container, i.toString()));
        }
        //添加特效
        this.juyuanGreen = new UIEffect();
        this.juyuanGreen.setEffectPrefab(this.elems.getElement('juyuanGreen'), this.elems.getElement('start'));
        this.juyuanPurple = new UIEffect();
        this.juyuanPurple.setEffectPrefab(this.elems.getElement('juyuanPurple'), this.elems.getElement('middle'));
        this.juyuanRed = new UIEffect();
        this.juyuanRed.setEffectPrefab(this.elems.getElement('juyuanRed'), this.elems.getElement('last'));
        this.juyuanYellow = new UIEffect();
        this.juyuanYellow.setEffectPrefab(this.elems.getElement('juyuanYellow'), this.elems.getElement('dianfeng'));
        this.effectTrans = this.elems.getElement("effectTrans");
        this.tupoSucceedPrefab = this.elems.getElement("tupoSucceed");
        this.tupoSucceedEffect = new UIEffect();
        this.tupoSucceedEffect.setEffectPrefab(this.tupoSucceedPrefab, this.effectTrans);

        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");

        this.iconAltas = this.elems.getUGUIAtals('actIcons');
    }

    protected initListeners() {
        this.addClickListener(this.btn_break, this.onClickBreakBt);
        this.addClickListener(this.btn_close, this.close);
        this.addClickListener(this.btn_bianqiang, this.onClickBianQiang);
        this.addClickListener(this.btn_touxian, this.onClickTouXian);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btn_huanHua, this.onClickHuanHuaBt);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJuyuanInfo());
        G.GuideMgr.processGuideNext(EnumGuide.JuYuan, EnumGuide.JuYuan_ClickJuYuan);
        this.juYuanData = G.DataMgr.juyuanData;

        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
    }

    protected onClose() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        G.GuideMgr.processGuideNext(EnumGuide.JuYuan, EnumGuide.JuYuan_ClickClose);
        this.liziEffectRoot.SetActive(false);
    }

    /**点击幻化按钮,进入幻化时装界面*/
    private onClickHuanHuaBt() {
        // 必须先打开别人，再关闭自己，否则会跟新手指引冲突，因为新手指引会监听面板关闭然后恢复指引
        G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_DRESS);
        G.Uimgr.bindCloseCallback(HeroView, JuYuanView);
        this.close();
    }

    private onClickBreakBt() {
        let cfg: GameConfig.JuYuanCfgM = G.DataMgr.juyuanData.getNextCfg();
        if (cfg.m_iPinstanceID <= 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJuYuanUpgradeRequest());
        }
        else {
            // 必须先打开别人，再关闭自己，否则会跟新手指引冲突，因为新手指引会监听面板关闭然后恢复指引
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(cfg.m_iPinstanceID);
            this.close();
        }
        G.GuideMgr.processGuideNext(EnumGuide.JuYuan, EnumGuide.JuYuan_ClickUp);
    }

    private onClickBianQiang() {
        G.Uimgr.createForm<WybqView>(WybqView).open();
    }

    private onClickTouXian() {
        let titleData: titleListItemData[] = [];
        for (let i = 1; i <= JuyuanRule.MAX_JUYUAN_TYPE; i++) {
            let item = new titleListItemData();
            let cfg: GameConfig.JuYuanCfgM = this.juYuanData.getJuYuanCfgById(i);
            item.icon = cfg.m_iTitle;
            item.value = this.juYuanData.getFight(cfg);
            titleData.push(item);
        }
        G.Uimgr.createForm<TouXianZongLanView>(TouXianZongLanView).open("头衔总览", titleData);
    }

    //////////////////////////////////刷新界面////////////////////////////////////////////////

    /**钻石变化*/
    onMoneyChange(id: number) {
        if (KeyWord.MONEY_TONGQIAN_ID == id) {
            this.updateEnableBt();
            this.updateActiveList();
        }
    }


    /**
   * 播放粒子系统
   */
    private playLiZiEffect() {
        this.liziEffectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.liziEffectRoot, "effect", 2.5, delegate(this, this.onEndEffect));
    }

    private onEndEffect() {
        this.liziEffectRoot.SetActive(false);
    }


    upgradeSucceed() {
        G.AudioMgr.playJinJieSucessSound();
        this.tupoSucceedEffect.playEffect(EffectType.Effect_Normal);
        //this.playLiZiEffect();
    }


    //神力type显示图标
    updatePanel(): void {
        if (this.juYuanData == null) {
            return;
        }
        let type: number = this.juYuanData.type;
        let level: number = this.juYuanData.level;
        if (this.juYuanData.isNoLevel()) {
            type = 1;
            level = 1;
        }
        else if (this.juYuanData.isFullLevel()) {
            type = JuyuanRule.MAX_JUYUAN_TYPE;
            level = JuyuanRule.MAX_JUYUAN_LEVEL;
        }
        else if (this.m_selectState) {
            if (level == JuyuanRule.MAX_JUYUAN_LEVEL) {
                type += 1;
                level = 1;
            }
            else {
                level++;
            }
        }
        let currCfg: GameConfig.JuYuanCfgM = this.juYuanData.getJuYuanCfg(type, level);
        //头衔
        this.updateTitle(currCfg);
        //战斗力属性
        this.updateFight(currCfg);
        //this.updateIconLevelList(currCfg, type, level);
        this.updatePropList(currCfg, type, level);
        //this.updateBallList(type, level);
        //this.updateDress(type, level);
        this.updateEnableBt();
        //时装显示
        let heroData = G.DataMgr.heroData;
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        if (currCfg.m_iModelId > 0) {
            this.m_avatarList.m_uiDressImageID = JuYuanUtils.getModeId(currCfg.m_iModelId);
        }

        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_bodyMesh.playAnimation('stand');
            this.roleAvatar.m_rebirthMesh.setRotation(15, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender);
    }


    private addStageEffect(value: number) {
        this.juyuanGreen.playEffect(EffectType.Effect_None, value >= 1);
        this.juyuanPurple.playEffect(EffectType.Effect_None, value >= 2);
        this.juyuanRed.playEffect(EffectType.Effect_None, value >= 3);
        this.juyuanYellow.playEffect(EffectType.Effect_None, value >= 4);
    }

    /**
     * 更新战斗力
     * @param cfg
     */
    private updateFight(cfg: GameConfig.JuYuanCfgM): void {
        //更新当前战斗力
        if (!this.juYuanData.isNoLevel()) {
            this.fightTextCur.text = this.juYuanData.getFight(cfg).toString();
        }
        else {
            this.fightTextCur.text = "0";
        }
        //更新下一阶段战斗力
        if (this.juYuanData.isFullLevel()) {
            this.fightTextNext.text = this.juYuanData.getFight(cfg).toString();
        }
        else {
            this.fightTextNext.text = this.juYuanData.getFight(this.juYuanData.getNextCfg()).toString();
        }
    }

    /**更新头衔 */
    private updateTitle(cfg: GameConfig.JuYuanCfgM): void {
        //更新当前头衔
        if (!this.juYuanData.isNoLevel()) {
            this.titleCur.gameObject.SetActive(true);
            this.titleCur.sprite = this.getIcon(cfg.m_iTitle);
        }
        else {
            this.titleCur.gameObject.SetActive(false);
        }
        //更新下一阶段头衔
        if (this.juYuanData.isFullLevel()) {
            this.titleNext.sprite = this.getIcon(cfg.m_iTitle);
        }
        else {
            this.titleNext.gameObject.SetActive(true);
            this.titleNext.sprite = this.getIcon(this.juYuanData.getNextCfg().m_iTitle);
        }
    }

    private updateEnableBt(): void {
        if (this.juYuanData.isFullLevel()) {
            //满级
            this.btn_break.SetActive(false);
            for (let i = 0; i < this.max_breakCondition; i++) {
                let needInfo = ElemFinder.findText(this.needInfoParent, i.toString());
                needInfo.text = "";
            }
        }
        else {
            let nextCfg: GameConfig.JuYuanCfgM = G.DataMgr.juyuanData.getNextCfg();
            if (nextCfg != null) {
                UIUtils.setButtonClickAble(this.btn_break, JuYuanUtils.isUpgradeGrey(nextCfg));
            }
        }
    }

    /**刷新突破按钮,神力阶段*/
    private updateIconLevelList(cfg: GameConfig.JuYuanCfgM, type: number, level: number): void {
        let nowJuYuanLevel = this.juYuanData.level;
        this.addStageEffect(nowJuYuanLevel);
        if (nowJuYuanLevel == JuYuanStage.start || nowJuYuanLevel == 0) {
            this.setIconLevelList('突破', 0);
        } else if (nowJuYuanLevel == JuYuanStage.middle) {
            this.setIconLevelList('突破', 1 / 3);
        } else if (nowJuYuanLevel == JuYuanStage.last) {
            this.setIconLevelList('突破', 2 / 3);
        } else if (nowJuYuanLevel == JuYuanStage.dianfeng) {
            this.setIconLevelList('挑战', 1);
        }
    }

    /**更新属性列表显示*/
    private updatePropList(cfgCur: GameConfig.JuYuanCfgM, type: number, level: number): void {
        let cfgNext: GameConfig.JuYuanCfgM;
        ////if (this.m_selectState) {
        ////    cfgCur = this.juYuanData.getCurCfg();
        ////    if (this.juYuanData.isFullLevel)
        ////        cfgNext = this.juYuanData.getNextCfg();
        ////    else
        ////        cfgNext = this.juYuanData.getCurCfg();
        ////}
        ////else 
        {
            if ((type == this.juYuanData.type || this.juYuanData.isNoLevel() && level == 1)) {
                cfgCur = this.juYuanData.getCurCfg();
                if (this.juYuanData.isFullLevel())
                    cfgNext = this.juYuanData.getCurCfg();
                else
                    cfgNext = this.juYuanData.getNextCfg();
            }
        }

        let propListCur = this.juYuanData.toPorpList(cfgCur);
        let propListNext = this.juYuanData.toPorpList(cfgNext);

        for (let i = 0; i < this.max_propsNum; i++) {
            //更新当前属性
            let propNameTextCur = ElemFinder.findText(this.propParentCur, i.toString());
            let valueTextCur = ElemFinder.findText(propNameTextCur.gameObject, 'Text');
            let strCur = propListCur[0][i].split(':');
            propNameTextCur.text = strCur[0] + ':';
            valueTextCur.text = strCur[1];
            //更新下一阶段属性
            let propNameTextNext = ElemFinder.findText(this.propParentNext, i.toString());
            let valueTextNext = ElemFinder.findText(propNameTextNext.gameObject, 'Text');
            let strNext = propListNext[0][i].split(':');
            propNameTextNext.text = strNext[0] + ':';
            valueTextNext.text = strNext[1];
        }
        this.updateActiveList();
    }

    /**更新提升需求*/
    private updateActiveList() {
        //提升需求
        let cfg: GameConfig.JuYuanCfgM = this.juYuanData.getNextCfg();

        let activateList = this.juYuanData.getActivateList(cfg);
        for (let i = 0; i < this.max_breakCondition; i++) {
            let needInfo = ElemFinder.findText(this.needInfoParent, i.toString());
            if (i < activateList.length) {
                needInfo.text = activateList[i].toString();
            } else {
                needInfo.text = '';
            }
        }


        if (cfg.m_iCount == 0) {
            this.icon.SetActive(false);
        }
        else {
            this.icon.SetActive(true);
        }

        if (this.juYuanData.isFullLevel()) {
            this.jinjitiaojianIcon.SetActive(false);
            this.icon.SetActive(false);
            this.rightGoPanelNext.SetActive(false);
            this.manjieTips.SetActive(true);
        }
        else {
            this.jinjitiaojianIcon.SetActive(true);
            this.manjieTips.SetActive(false);
        }

        this.materialItemData.id = cfg.m_iItemId;
        this.materialItemData.has = G.DataMgr.thingData.getThingNum(cfg.m_iItemId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.materialItemData.need = cfg.m_iCount;

        this.iconItem.updateByMaterialItemData(this.materialItemData);
        this.iconItem.updateIcon();



    }

    /**更新神力图标显示*/
    private updateBallList(type: number, level: number): void {

        let ids: number[] = this.juYuanData.ids;
        if (ids == null)
            return;
        if (ids[0] >= this.max_propsNum) {
            for (let i = 0; i < this.max_juYuanIcon; i++) {
                let obj = this.juYuanIconParent.transform.GetChild(i).gameObject;
                let index = i + this.max_propsNum;
                obj.name = index.toString();
                if (!this.isHasCreatEffext) {
                    this.juyuanMains[index] = new UIEffect();
                    this.juyuanMains[index].setEffectPrefab(this.juyuanMainPrefab, obj);
                }
            }
            this.isHasCreatEffext = true;
        }

        for (let index = 0; index < ids.length; index++) {
            let indexIcon = ids[index];
            let juYuanCfg: GameConfig.JuYuanCfgM = this.juYuanData.getJuYuanCfg(indexIcon, 1);
            let icon = ElemFinder.findObject(this.juYuanIconParent, indexIcon.toString());
            let iconText = ElemFinder.findText(icon, "text");
            let isShow = type >= ids[index];
            //特效
            this.juyuanMains[indexIcon].playEffect(EffectType.Effect_None, isShow);
            if (type > indexIcon) {
                //已经完成的     
                iconText.text = juYuanCfg.m_ucName;
                UIUtils.setGrey(icon, false, false);
            } else if (type == indexIcon) {
                //正在进行的 
                iconText.text = JuyuanRule.getJuYuanName(juYuanCfg.m_ucName, level);
                UIUtils.setGrey(icon, false, false);
            } else {
                //未完成的
                iconText.text = TextFieldUtil.getColorText(juYuanCfg.m_ucName, Color.WHITE);
                UIUtils.setGrey(icon, true, false);
            }
        }
    }


    /**更新时装列表*/
    private updateDress(type: number, level: number): void {

        let modeId: number = 0;
        let cfg: GameConfig.JuYuanCfgM;
        let dataList = [];
        this.dressIds.length = 0;
        for (let i: number = 1; i <= JuyuanRule.MAX_JUYUAN_TYPE; i++) {
            cfg = this.juYuanData.getJuYuanCfg(i, 1);
            if (cfg.m_iModelId <= 0 || this.dressIds.indexOf(cfg.m_iModelId) != -1)
                continue;
            this.dressIds.push(cfg.m_iModelId);
            modeId = JuYuanUtils.getModeId(cfg.m_iModelId);
            dataList.push(i);
            if (i > type)
                break;
        }
        for (let i = 0; i < this.max_juyuanDress; i++) {
            let fashionIcon = ElemFinder.findObject(this.fashion, uts.format('{0}/icon', i));
            let btn = ElemFinder.findObject(this.fashion, i.toString());
            if (i < this.dressIds.length) {
                fashionIcon.SetActive(true);
                Game.UIClickListener.Get(btn).onClick = delegate(this, this.setShowPanelShow, this.dressIds[i], i);
                UIUtils.setGrey(fashionIcon, !(dataList[i] <= type), false);
            } else {
                fashionIcon.SetActive(false);
            }
        }
    }


    private setShowPanelShow(modelId: number, index: number) {
        G.Uimgr.createForm<JuYuanFashionView>(JuYuanFashionView).open(modelId, index);
    }



    private setIconLevelList(btnUpName: string, silderValue: number) {
        this.upBtText.text = btnUpName;
        this.slider_JuYuan.value = silderValue;
    }


    getIcon(id: number): UnityEngine.Sprite {
        let s = this.iconAltas.Get(id.toString());
        if (s == null) {
            uts.logError('no icon: ' + id);
        }
        return s;
    }
    /////////////////////////////////////// 引导 ///////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.JuYuan_ClickUp == step) {
            this.onClickBreakBt();
            return true;
        } else if (EnumGuide.JuYuan_ClickClose == step) {
            this.close();
            return true;
        }
        return false;
    }
}
