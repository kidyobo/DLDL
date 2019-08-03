import { BatBuyView } from "System/business/view/BatBuyView";
import { JinJieRiBatBuyView } from "System/business/view/JinJieRiBatBuyView";
import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { MagicCubeData } from "System/data/MagicCubeData";
import { HeroData } from 'System/data/RoleData';
import { ThingData } from "System/data/thing/ThingData";
import { UIPathData } from "System/data/UIPathData";
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { ZhufuData } from 'System/data/ZhufuData';
import { Global as G } from 'System/global';
import { HeroView } from 'System/hero/view/HeroView';
import { SpecialPriBasePanel } from 'System/hero/view/SpecialPriBasePanel';
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { TipFrom } from 'System/tip/view/TipsView';
import { EffectType, UIEffect } from "System/uiEffect/UIEffect";
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from "System/utils/DataFormatter";
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';

class MagicCubeItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue1: UnityEngine.UI.Text;
    private txtValue2: UnityEngine.UI.Text;

    setCommponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue1 = ElemFinder.findText(go, "txtValue1");
    }

    update(beforeData: GameConfig.EquipPropAtt, extraValue: number) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, beforeData.m_ucPropId);
        this.txtValue1.text = (beforeData.m_ucPropValue + extraValue).toString();
    }

}



/**
 * <星环面板>的对话框。
 * 新-控鹤擒龙
 *控鹤擒龙用 （坐骑ZhufuRideBaseView 神器ZhufuBaseView 紫极魔瞳和鬼影迷踪NewZhufuBaseView 控鹤擒龙MagicCubeView）
 */
export class MagicCubeView extends SpecialPriBasePanel {
    private heroView: HeroView;
    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;
    private _nextExpValue: number = 0;
    /**升级前等级*/
    private beforeLevelUpLevel: number = 0;
    /**升级后等级*/
    private _afterLevelUpLevel: number = 0;

    /**是否是最大的等级*/
    private isMaxLevel: boolean = false;



    private magicCubeBaseConfig: GameConfig.MagicCubeBaseCfgM;
    private nextMagicCubeBaseConfig: GameConfig.MagicCubeBaseCfgM;

    //////////////////////////////////////////////
    private m_isAuto: boolean = false;
    btnStart: UnityEngine.GameObject;
    private btnAuto: UnityEngine.GameObject;

    /**星环等级*/
    private txtLv: UnityEngine.UI.Text = null;
    private txtLoopName: UnityEngine.UI.Text;
    /**魂值*/
    private txtSlider: UnityEngine.UI.Text = null;
    private bar: UnityEngine.UI.Image;

    /**战斗力*/
    //private txtFight: UnityEngine.UI.Text = null;
    private cubeParent: UnityEngine.GameObject = null;
    /**自动强化时间*/
    private m_autoTime: number = 0;
    //特效
    private effectTrans: UnityEngine.GameObject;
    private levelupPrefab: UnityEngine.GameObject;
    private levelUpEffect: UIEffect;

    private btnBao: UnityEngine.GameObject;
    private btnZhui: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private txtTime: UnityEngine.UI.Text;
    private txtTip: UnityEngine.UI.Text;
    private txtAutoLabel: UnityEngine.UI.Text;
    private itemIcon_Normal: UnityEngine.GameObject;
    private iconItem: IconItem;
    private txtName: UnityEngine.UI.Text;

    private list: List;
    private magicCubeItems: MagicCubeItem[] = [];
    ///**
    // *消耗的材料
    // */
    private m_costData: MaterialItemData = new MaterialItemData();

    private showBtnGotoJJR: boolean = false;
    private currentStage: number = 0;
    private oldStage: number = 0;
    private mainTimeCheck: boolean = false;
    private _timeNum: number;
    private currentZhuFuValue: number = 0;
    private oldLuckValue: number = -1;

    private isFirstOpenView = true;

    //是否提示使用万用进阶丹
    private static isNotTip: boolean = false;
    private static isNotTipAgain: boolean = false;
    private static isNotTipThirdConfirm: boolean = false;
    private MagicCubeJjdId: number = 0;
    private MagicCubeJjdHas: number = 0;

    //进阶日跳转
    private btnGotoJJR: UnityEngine.GameObject;
    private jjRankTipMark: UnityEngine.GameObject;

    //private upEffect: UnityEngine.GameObject;
    //private zhufuPlusEffect: UnityEngine.GameObject;

    private rightNode: UnityEngine.GameObject;
    //tip 按钮
    private btnTip: UnityEngine.GameObject;
    private btnTipClose: UnityEngine.GameObject;
    private panelTip: UnityEngine.GameObject;
    //右侧等级
    private topLevel: UnityEngine.UI.Text;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_MAGICCUBE, KeyWord.SPECPRI_MAGICCUBE_ADD);
    }

    protected resPath(): string {
        return UIPathData.MagicCubeView;
    }
    protected initElements(): void {
        super.initElements();
        this.btnStart = this.elems.getElement("btnStart");
        this.btnAuto = this.elems.getElement("btnAuto");

        this.txtLv = this.elems.getText("txtLv");
        this.txtLoopName = this.elems.getText("txtLoopName");
        this.txtSlider = this.elems.getText("txtSlider");
        //this.bar = this.elems.getElement("bar");
        this.bar = this.elems.getImage("bar");

        //this.txtFight = this.elems.getText("txtFight");
        this.txtTip = this.elems.getText("txtTip");
        this.txtAutoLabel = this.elems.getText("txtAutoLabel");

        this.cubeParent = this.elems.getElement("cubeParent");
        //添加特效
        this.effectTrans = this.elems.getElement("effectTrans");
        this.levelupPrefab = this.elems.getElement("levelUpEffect");
        this.levelUpEffect = new UIEffect();
        this.levelUpEffect.setEffectPrefab(this.levelupPrefab, this.effectTrans);
        //模型
        //G.ResourceMgr.loadModel(this.cubeParent, UnitCtrlType.other, "model/magicCube/lifangti.prefab", this.sortingOrder);

        this.btnBao = this.elems.getElement("btnBao");
        this.btnZhui = this.elems.getElement("btnZhui");
        this.icon = this.elems.getElement("icon");
        this.txtTime = this.elems.getText("txtTime");
        this.txtName = this.elems.getText("txtName");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.list = this.elems.getUIList("list");
        //进阶日跳转按钮
        this.btnGotoJJR = this.elems.getElement("btnGotoJJR");
        this.jjRankTipMark = this.elems.getElement("jjRankTipMark");

        this.rightNode = this.elems.getElement("right");
        this.btnTip = ElemFinder.findObject(this.rightNode, "down/btnTip");
        this.panelTip = ElemFinder.findObject(this.rightNode, "down/tip");
        this.btnTipClose = ElemFinder.findObject(this.panelTip, "close");

        //右侧标题
        this.topLevel = ElemFinder.findText(this.rightNode, 'topTitle/txtLv');
    }
    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnStart, this.onBtnStart);
        this.addClickListener(this.btnAuto, this.onBtnAutoClick);
        //祝福系规则相关
        this.addClickListener(this.btnBao, this.onClickBtnBaoLiuZhuFu);
        this.addClickListener(this.btnZhui, this.onClickBtnZhuiHuiZhuFu);

        this.addClickListener(this.btnGotoJJR, this.onClickGotoJJR);

        this.addClickListener(this.btnTip, this.onClickOpenTip);
        this.addClickListener(this.btnTipClose, this.onClickCloseTip);

    }



    protected onOpen() {
        super.onOpen();
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(true);
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenMagicCubePannelRequest());
        this.addTimer("daojishi", 1000, 0, this.onSuaiJianTimer);

        //进阶日跳转的显示，红点
        this.showBtnGotoJJR = G.DataMgr.activityData.isShowJJRGotoBtn(this.id);
        this.btnGotoJJR.SetActive(this.showBtnGotoJJR);
        this.jjRankTipMark.SetActive(this.showBtnGotoJJR && G.DataMgr.runtime.isFirstShouldShowJJRTipMark);
        if (this.showBtnGotoJJR) {
            G.DataMgr.runtime.isFirstShouldShowJJRTipMark = false;
        }
        //this.checkJinJieFu();
        //this.updateView();
        G.GuideMgr.processGuideNext(EnumGuide.QinLongActive, EnumGuide.QinLongActive_OpenView);
    }

    protected onClose() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
        this.m_isAuto = false;
        UIUtils.setButtonClickAble(this.btnStart, true);
        this.txtAutoLabel.text = "自动进阶";
    }

    open() {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_MAGICCUBE, true)) {
            return;
        }
        super.open();
    }


    private onClickReturn() {
        this.close();
    }

    /**"保"按钮 */
    private onClickBtnBaoLiuZhuFu() {
        let data = this.magicCubeData.magicCubeInfo;
        if (data == null) {
            return;
        }
        if (data.m_uiLuckyTime == 0) {
            G.TipMgr.addMainFloatTip("目前还没开始衰减祝福值,不需要保留");
            return;
        }
        G.TipMgr.showConfirm('是否花费50钻石将祝福值衰减时间延长24小时？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmBaoLiuZhuFu));
    }

    private onConfirmBaoLiuZhuFu(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMagicCubeLuckyRequest(Macros.MAGICCUBE_LUCKY_KEEP));
        }
    }

    /**"追"按钮 */
    private onClickBtnZhuiHuiZhuFu() {
        let data = this.magicCubeData.magicCubeInfo;
        if (data == null) {
            return;
        }
        if (data.m_uiSaveLucky == 0) {
            G.TipMgr.addMainFloatTip("当前没有衰减祝福值,不需要找回");
            return;
        }
        G.Uimgr.createForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView).open(KeyWord.OTHER_FUNCTION_MAGICCUBE, this.nextMagicCubeBaseConfig.m_uiLuckUp, this.magicCubeData.magicCubeInfo.m_uiSaveLucky, this.currentZhuFuValue);
    }

    /**打开提示 */
    private onClickOpenTip() {
        if (this.panelTip.activeSelf == false)
            this.panelTip.SetActive(true);
    }

    /**关闭提示 */
    private onClickCloseTip() {
        if (this.panelTip.activeSelf)
            this.panelTip.SetActive(false);
    }

    private updateTime(): void {
        // 更新时间
        let startTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
        this._timeNum = Math.floor((this.magicCubeData.magicCubeInfo.m_uiLuckyTime - startTime));
        if (this._timeNum > 0) {
            this.mainTimeCheck = true;
        } else {
            if (this.txtTime == null) return;
            this.txtTime.text = "不限时";
        }
    }


    private onSuaiJianTimer(): void {
        if (this.mainTimeCheck) {
            this._timeNum--;
            if (this._timeNum > 0) {
                this.txtTime.text = uts.format('{0}', DataFormatter.second2hhmmss(this._timeNum));
            }
            else {
                this.mainTimeCheck = false;
                this.txtTime.text = '不限时';
            }
        }
    }



    /////////////////////////////////////////////强化///////////////////////////////////

    onBtnStart(): void {
        if (!this.nextMagicCubeBaseConfig) {
            return;
        }
        G.GuideMgr.processGuideNext(EnumGuide.QinLongActive, EnumGuide.QinLongActive_ClickPanelBtn);
        let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this.nextMagicCubeBaseConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)

        if (this.MagicCubeJjdHas >= this.m_costData.need) {
            this.sendStreng();
            return;
        }
        else if (this.MagicCubeJjdHas + universalJinjieDanNum >= this.m_costData.need) {
            if (MagicCubeView.isNotTip) {
                if (MagicCubeView.isNotTipAgain) {
                    if (MagicCubeView.isNotTipThirdConfirm == false) {
                        G.TipMgr.showConfirm(uts.format('当前您的{0}已经不足，是否消耗{1}继续升阶？', TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this.nextMagicCubeBaseConfig.m_iUniversalItem))), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine2));
                    }
                    else {
                        this.sendStreng();
                        return;
                    }

                }
                else {
                    this.sendStreng();
                    return;
                }
            }
            else {
                G.TipMgr.showConfirm(uts.format('您的{0}已经不足，是否消耗{1}继续升阶？', TextFieldUtil.getItemText(ThingData.getThingConfig(this.MagicCubeJjdId)), TextFieldUtil.getItemText(ThingData.getThingConfig(this.nextMagicCubeBaseConfig.m_iUniversalItem))), ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine));
            }
        }
        else {
            this.stopAuto();
            let num = this.m_costData.need - (this.m_costData.has + universalJinjieDanNum);
            let morelv = this.getZhufuNumber();
            let morenum = this.m_costData.need * morelv;
            num += morenum;
            G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, () => {
                for (let i = 0; i < morelv + 1; i++) {
                    this.sendStreng();
                }
            });
        }

    }


    private _onConfirmMultiRefine(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
        MagicCubeView.isNotTip = isCheckSelected;
        if (MessageBoxConst.yes == stage) {
            this.sendStreng();
        }
        else {
            this.stopAuto();
            if (isCheckSelected == true) {
                MagicCubeView.isNotTipAgain = true;
            }

        }

    }

    private _onConfirmMultiRefine2(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
        if (MessageBoxConst.yes == stage) {
            MagicCubeView.isNotTipThirdConfirm = isCheckSelected;
            this.sendStreng();
        }
        else {
            this.stopAuto();
        }

    }



    private onBtnAutoClick(): void {
        if (this.m_isAuto) {
            this.stopAuto();
        }
        else {
            this.startAuto();
        }
    }



    private startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.btnStart, false);
            this.txtAutoLabel.text = "停止进阶";
            this.onBtnStart();
        }
    }

    private stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            UIUtils.setButtonClickAble(this.btnStart, true);
            this.txtAutoLabel.text = "自动进阶";
            // this.m_oldPart = -1;
        }
        this.removeTimer("equipStrength");
    }

    /**发送强化*/
    private sendStreng(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMagicCubeLevelUpRequest());
    }


    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////
    getZhufuNumber(): number {
        let magicCubeInfo: Protocol.MagicCubeInfo = this.magicCubeData.magicCubeInfo;
        this.magicCubeBaseConfig = this.magicCubeData.getMagicCubeBaseConfig(magicCubeInfo.m_uiLevel);
        let nextLevel: number = Math.ceil(magicCubeInfo.m_uiLevel / 10) * 10 + 1;
        this.nextMagicCubeBaseConfig = this.magicCubeData.getMagicCubeBaseConfig(nextLevel);
        if (this.nextMagicCubeBaseConfig) {
            let luck = this.nextMagicCubeBaseConfig.m_uiLuckUp - magicCubeInfo.m_uiLucky;
            let num = Math.ceil(luck / 10) - 1;
            return num;
        }
        return 0;
    }

    /**更新数据*/
    updateView(): void {
        if (this.isFirstOpenView) {
            this.isFirstOpenView = false;
            this.oldStage = ZhufuData.getZhufuStage(G.DataMgr.magicCubeData.magicCubeInfo.m_uiLevel, this.id);
            this.oldLuckValue = this.magicCubeData.magicCubeInfo.m_uiLucky;
            this.updateTime();
        }

        let magicCubeInfo: Protocol.MagicCubeInfo = this.magicCubeData.magicCubeInfo;
        if (magicCubeInfo) {
            let heroData: HeroData = G.DataMgr.heroData;
            this.beforeLevelUpLevel = magicCubeInfo.m_uiLevel;
            this.magicCubeBaseConfig = this.magicCubeData.getMagicCubeBaseConfig(magicCubeInfo.m_uiLevel);

            if (!this.magicCubeBaseConfig) {
                uts.logError(uts.format('为什么星环系统开启了，星环等级还是0？后台没更新吧！！') + magicCubeInfo.m_uiLevel);
            }
            this.isMaxLevel = (this.beforeLevelUpLevel == this.magicCubeData.magicCubeMaxLevel);

            this.currentStage = ZhufuData.getZhufuStage(magicCubeInfo.m_uiLevel, this.id);
            this.txtLv.text = uts.format("{0}阶", this.currentStage);//DataFormatter.toHanNumStr(this.currentStage);
            //this.txtLoopName.text = ZhufuData.getXuemaiConfig(this.id);
            this.topLevel.text = DataFormatter.toHanNumStr(this.currentStage) + '阶';
            this.currentZhuFuValue = magicCubeInfo.m_uiLucky;

            if (this.oldLuckValue != this.currentZhuFuValue && this.currentZhuFuValue != 0) {
                if (this.currentZhuFuValue - this.oldLuckValue > 0 || this.currentZhuFuValue == 0) {
                    // G.AudioMgr.playStarBombSucessSound();
                    this.playZhufuPlusEffect(this.currentZhuFuValue - this.oldLuckValue);
                }
                this.oldLuckValue = this.currentZhuFuValue;
            }

            if (this.oldStage != 0 && this.oldStage != this.currentStage) {
                this.oldStage = this.currentStage;
                this.playUpEffect();
                //进阶成功播放粒子特效
                G.AudioMgr.playJinJieSucessSound();
                this.stopAuto();
                this.checkJinJieFu();
            }

            if (this.currentStage >= 5) {
                this.txtTip.text = G.DataMgr.langData.getLang(350);
            } else {
                this.txtTip.text = G.DataMgr.langData.getLang(349);
            }

            let nextLevel: number = Math.ceil(magicCubeInfo.m_uiLevel / 10) * 10 + 1;

            this.nextMagicCubeBaseConfig = this.magicCubeData.getMagicCubeBaseConfig(nextLevel);

            //材料
            if (this.nextMagicCubeBaseConfig != null) {
                this.m_costData.id = this.nextMagicCubeBaseConfig.m_iConsumableID;
                this.m_costData.need = this.nextMagicCubeBaseConfig.m_iConsumableNumber;
                this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                this._nextExpValue = this.magicCubeBaseConfig.m_uiMagicCubeExp;
                this.txtSlider.text = TextFieldUtil.getColorText(uts.format('{0}/{1}', magicCubeInfo.m_uiLucky, this.nextMagicCubeBaseConfig.m_uiLuckUp), Color.DEFAULT_WHITE);
                let value = magicCubeInfo.m_uiLucky / this.nextMagicCubeBaseConfig.m_uiLuckUp;
                //this.bar.transform.localScale = G.getCacheV3(value > 1 ? 1 : value, 1, 1);
                value = 0.095 + (value * 0.81);
                this.bar.fillAmount = value;
                this.icon.SetActive(true);
            }
            else {
                this.m_costData.id = 0;
                this.txtSlider.text = "已满阶";
                //this.bar.transform.localScale = G.getCacheV3(1, 1, 1);
                this.bar.fillAmount = 1;
                this.bar.type = UnityEngine.UI.Image.Type.Filled;
                this.icon.SetActive(false);
                this.txtName.text = '已满阶';
                UIUtils.setButtonClickAble(this.btnStart, false);
                UIUtils.setButtonClickAble(this.btnAuto, false);
            }

            //处理满级后显示
            //if (this.isMaxLevel) {
            //    this.txtSlider.text = "已满级";
            //    UIUtils.setButtonClickAble(this.btnStart, false);
            //    UIUtils.setButtonClickAble(this.btnAuto, false);
            //}

            if (this.m_isAuto) {
                if (this.m_costData.id == 0) {
                    this.stopAuto();
                }
                else {
                    let time: number = G.SyncTime.getCurrentTime();
                    if (time - this.m_autoTime > this.deltaTime) {
                        this.m_autoTime = time;
                        this.onBtnStart();
                    }
                    else {
                        this.addTimer("equipStrength", this.deltaTime, 1, this._onTimer);
                    }
                }
            }
        }
        this.updateAttList();
    }

    private _onTimer(): void {
        this.m_autoTime = G.SyncTime.getCurrentTime();
        this.onBtnStart();
    }


    /**更新属性列表*/
    private updateAttList(): void {
        if (this.magicCubeBaseConfig) {
            let newAttrDatas: GameConfig.EquipPropAtt[] = [];
            let beforeAttrList = this.magicCubeBaseConfig.m_astAttrList;
            let afterAttrList = this.nextMagicCubeBaseConfig == null ? null : this.nextMagicCubeBaseConfig.m_astAttrList;
            this.list.Count = beforeAttrList.length;
            let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(this.specialVipPara);
            for (let i = 0; i < this.list.Count; i++) {
                if (this.magicCubeItems[i] == null) {
                    let item = this.list.GetItem(i).gameObject;
                    this.magicCubeItems[i] = new MagicCubeItem();
                    this.magicCubeItems[i].setCommponents(item);
                }
                let magicCubeInfo: Protocol.MagicCubeInfo = G.DataMgr.magicCubeData.magicCubeInfo;
                let extraValue = 0;

                if (afterAttrList == null) {
                    extraValue = 0;
                } else {
                    extraValue = Math.floor((afterAttrList[i].m_ucPropValue - beforeAttrList[i].m_ucPropValue) * magicCubeInfo.m_uiLucky / this.nextMagicCubeBaseConfig.m_uiLuckUp / 2);
                }
                extraValue += Math.floor(beforeAttrList[i].m_ucPropValue * specialPriAddPct);
                newAttrDatas[i] = {} as GameConfig.EquipPropAtt;
                newAttrDatas[i].m_ucPropId = beforeAttrList[i].m_ucPropId;
                newAttrDatas[i].m_ucPropValue = beforeAttrList[i].m_ucPropValue + extraValue;
                this.magicCubeItems[i].update(beforeAttrList[i], extraValue);
            }
            //this.txtFight.text = FightingStrengthUtil.calStrength(newAttrDatas).toString();
            if (this.heroView != null) {
                this.heroView.setTxtFight(FightingStrengthUtil.calStrength(newAttrDatas));
            }
            let newCostData: MaterialItemData = this.m_costData;

            if (this.nextMagicCubeBaseConfig != null) {
                let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this.nextMagicCubeBaseConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let oldId = this.m_costData.id;
                this.MagicCubeJjdHas = this.m_costData.has;
                this.MagicCubeJjdId = oldId;
                // if (newCostData.has <= 0 && universalJinjieDanNum >= this.m_costData.need) {
                //     newCostData.id = this.nextMagicCubeBaseConfig.m_iUniversalItem;
                // }
                // else {
                //     newCostData.id = oldId;
                // }
                // newCostData.has += universalJinjieDanNum;
                this.iconItem.updateByMaterialItemData(this.m_costData);
                this.iconItem.updateIcon();
                let equipinfo = ThingData.getThingConfig(this.m_costData.id);
                this.txtName.text = TextFieldUtil.getColorText(equipinfo.m_szName, Color.getColorById(equipinfo.m_ucColor));
            }
        }

    }

    private checkJinJieFu() {
        let magicCubeInfo: Protocol.MagicCubeInfo = G.DataMgr.magicCubeData.magicCubeInfo;

        let itemDatas = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_HEROSUB_JINGJIEFU, this.id, ZhufuData.getNextStageLv(magicCubeInfo.m_uiLevel, this.id));
        if (itemDatas.length > 0) {
            let sysName = '星环';
            let crtStage = ZhufuData.getZhufuStage(magicCubeInfo.m_uiLevel, this.id);
            let itemData = itemDatas[0];
            G.TipMgr.showConfirm(uts.format(G.DataMgr.langData.getLang(456), sysName, crtStage, TextFieldUtil.getItemText(itemData.config)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmUseJinJieFu, itemData.config, itemData.data));
        }
    }

    private onConfirmUseJinJieFu(state: MessageBoxConst, isCheckSelected: boolean, config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (MessageBoxConst.yes == state) {
            G.ModuleMgr.bagModule.useThing(config, thingInfo, useNum, true);
        }
    }

    /**更新道具数量*/
    private updateItemCount(): void {
        this.updateView();
    }



    /**更新星环信息*/
    onUpdateMagicCubeInfo(): void {
        this.updateView();
        this.updateTime();
    }

    /**升级成功*/
    onLevelUpMagicCubeCompelete(): void {
        let magicCubeInfo: Protocol.MagicCubeInfo = this.magicCubeData.magicCubeInfo;
        this._afterLevelUpLevel = magicCubeInfo.m_uiLevel;
        this.updateView();
        this.levelUpEffect.stopEffect();
        this.levelUpEffect.playEffect(EffectType.Effect_Normal);
        G.AudioMgr.playStarBombSucessSound();
        this.updateTime();
    }


    /**背包改变*/
    onContainerChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateItemCount();
        }
    }

    private onClickGotoJJR() {
        let funcId = 0;
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK)) {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK;
        } else {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY;
        }
        G.ActionHandler.executeFunction(funcId);
    }

    private playUpEffect() {
        //this.upEffect.SetActive(false);
        //this.upEffect.SetActive(true);
        //Game.Invoker.BeginInvoke(this.upEffect, "effect", 0.9, delegate(this, this.onEndUpEffect));
    }

    private onEndUpEffect() {
        //this.upEffect.SetActive(false);
    }

    private playZhufuPlusEffect(value: number) {
        //this.zhufuPlusEffect.SetActive(false);
        ////this.textZhufuPlus.text = value.toString();
        //this.zhufuPlusEffect.SetActive(true);
        //Game.Invoker.BeginInvoke(this.zhufuPlusEffect, "effect", 0.9, delegate(this, this.onEndZhufuPlusEffect));
    }

    private onEndZhufuPlusEffect() {
        //this.zhufuPlusEffect.SetActive(false);
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    get magicCubeData(): MagicCubeData {
        return G.DataMgr.magicCubeData;
    }



}

