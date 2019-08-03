import { Global as G } from "System/global"
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { FuncBtnState, EnumGuide } from 'System/constants/GameEnum'
import { List, ListItem } from 'System/uilib/List'
import { KeyWord } from 'System/constants/KeyWord'
import { BtnGroupCtrl, BtnGroupItem } from 'System/main/BtnGroupCtrl'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { HeroCtrl } from 'System/main/ctrls/HeroCtrl'
import { JuYuanCtrl } from 'System/main/ctrls/JuYuanCtrl'
import { DaoGongCtrl } from 'System/main/ctrls/DaoGongCtrl'
import { EnhanceCtrl } from 'System/main/ctrls/EnhanceCtrl'
import { SettingCtrl } from 'System/main/ctrls/SettingCtrl'
import { FaQiCtrl } from 'System/main/ctrls/FaQiCtrl'
import { MallCtrl } from 'System/main/ctrls/MallCtrl'
import { GuildCtrl } from 'System/main/ctrls/GuildCtrl'
import { ItemMergeCtrl } from 'System/main/ctrls/ItemMergeCtrl'
import { ShengQiCtrl } from 'System/main/ctrls/ShengQiCtrl'
import { SkillCtrl } from 'System/main/ctrls/SkillCtrl'
import { BagView } from 'System/bag/view/BagView'
import { PetView } from 'System/pet/PetView'
import { TianChiView } from 'System/activity/view/TianChiView'
import { TestView } from 'System/test/TestView'
import { SkillData } from 'System/data/SkillData'
import { Macros } from 'System/protocol/Macros'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { VipView, VipTab } from 'System/vip/VipView'
import { UnitStatus } from 'System/utils/UnitStatus'
import { Constants } from 'System/constants/Constants'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { MainMarryCtrl } from 'System/main/ctrls/MainMarryCtrl'
import { ShieldGodCtrl } from 'System/main/ctrls/ShieldGodCtrl'
import { FanXianCtrl } from 'System/main/ctrls/FanXianCtrl'
import { ExchangeCtrl } from "System/main/ctrls/ExchangeCtrl";
import { HunLiCtrl } from 'System/main/ctrls/HunLiCtrl';
import { HunGuCtrl } from 'System/main/ctrls/HunGuCtrl';
import { JinjieCtrl } from 'System/main/ctrls/JinjieCtrl';
import { HunLiView } from 'System/hunli/HunLiView'


export class MainFuncsCtrl extends BtnGroupCtrl {
    private readonly TweenSeconds = 0.15;
    private readonly ItemGap = 85;
    //private readonly ItemGap = 105;

    private readonly VerticalPivot = new UnityEngine.Vector2(1, 1);
    private readonly HorizonPivot = new UnityEngine.Vector2(1, 1);

    private vZeroPosition: UnityEngine.Vector3;
    private vZeroPosition2: UnityEngine.Vector3;
    private hZeroPosition: UnityEngine.Vector3;

    /**垂直方向的list*/
    private vlist: UnityEngine.GameObject;
    /**垂直方向的list2*/
    private vlist2: UnityEngine.GameObject;
    /**水平方向的list*/
    private hlist: UnityEngine.GameObject;

    private vItems: BtnGroupItem[] = [];
    private vItemPositions: UnityEngine.Vector3[] = [];
    private vItems2: BtnGroupItem[] = [];
    private vItemPositions2: UnityEngine.Vector3[] = [];
    private hItems: BtnGroupItem[] = [];
    private hItemPositions: UnityEngine.Vector3[] = [];

    /**背包按钮*/
    btnBag: UnityEngine.GameObject;
    /**伙伴按钮-->魂力按钮*/
    btnPet: UnityEngine.GameObject;
    /**测试按钮*/
    btnTest: UnityEngine.GameObject;

    //宗门聊天+红点
    btnGuildChat: UnityEngine.GameObject;
    guildChatTipMark: UnityEngine.GameObject;

    private petHeadTrans: UnityEngine.UI.RawImage;
    private petNuQi: UnityEngine.UI.Image;

    private normalSkillRect: UnityEngine.GameObject;
    private skillRectCanvasGroup: UnityEngine.CanvasGroup;

    private btnBarTween: Tween.TweenPosition;
    private skillRectTween: Tween.TweenAlpha;

    private vlistCtrls: BaseFuncIconCtrl[] = [];
    private vlistCtrls2: BaseFuncIconCtrl[] = [];
    private hlistCtrls: BaseFuncIconCtrl[] = [];

    private needSpreadAnim = false;

    private needUpdatePet = true;

    constructor() {
        super();
        this.initCtrl();
    }

    setView(uiElems: UiElements) {
        this.effectPrefab = uiElems.getElement('actIconEffect');

        let skillRect = uiElems.getElement("skillRect");
        this.skillRectCanvasGroup = skillRect.GetComponent(UnityEngine.CanvasGroup.GetType()) as UnityEngine.CanvasGroup;
        this.normalSkillRect = ElemFinder.findObject(skillRect, "normalSkillNode");

        let mainFuncsElems = uiElems.getUiElements('mainFuncs');
        this.initSwitcher(mainFuncsElems);

        this.vlist = mainFuncsElems.getElement('vlist');
        this.vlist2 = mainFuncsElems.getElement('vlist2');
        this.hlist = mainFuncsElems.getElement('hlist');
        this.itemTemp = mainFuncsElems.getElement('MainFuncIcon');

        this.vZeroPosition = new UnityEngine.Vector3(0, this.ItemGap, 0);
        let vzx2 = (this.vlist.transform as UnityEngine.RectTransform).localPosition.x - (this.vlist2.transform as UnityEngine.RectTransform).localPosition.x;
        this.vZeroPosition2 = new UnityEngine.Vector3(vzx2, this.ItemGap, 0);
        this.hZeroPosition = new UnityEngine.Vector3(0, 0, 0);

        this.btnBag = mainFuncsElems.getElement('btnBag');

        this.btnPet = mainFuncsElems.getElement('btnPet');
        this.petHeadTrans = mainFuncsElems.getRawImage('petHeadTrans');
        this.petNuQi = mainFuncsElems.getImage('petNuQi');

        //宗门按钮+红点
        this.btnGuildChat = mainFuncsElems.getElement('btnGuildChat');
        this.guildChatTipMark = ElemFinder.findObject(this.btnGuildChat, "tipMark");

        Game.UIClickListener.Get(this.btnBag).onClick = delegate(this, this.onClickBtnBag);
        Game.UIClickListener.Get(this.btnPet).onClick = delegate(this, this.onClickBtnPet);
        Game.UIClickListener.Get(this.btnGuildChat).onClick = delegate(this, this.onClickGuildChat);

        this.btnTest = mainFuncsElems.getElement('btnTest');
        this.cheskTestBtn();
        //this.btnTest.SetActive(defines.has('DEVELOP'));
        Game.UIClickListener.Get(this.btnTest).onClick = delegate(this, this.onClick);
    }

    private cheskTestBtn() {
        let uin = G.DataMgr.gameParas.uin;
        if (uin == 0) {
            let timer = new Game.Timer("checkTestBtn", 100, 1, delegate(this, this.callBack));
        }
        else {
            if (uin < 10000) {
                this.btnTest.SetActive(true);
            }
            else {
                this.btnTest.SetActive(false);
            }
        }
    }

    private callBack() {
        this.cheskTestBtn();
    }


    private onClick() {
        G.Uimgr.createForm<TestView>(TestView).open();
        //G.GuideMgr.tryGuide(EnumGuide.QiangHuaFuBen + 0, 0, false, KeyWord.OTHER_FUNCTION_DZZL, false, KeyWord.OTHER_FUNCTION_DZZL);
        //G.GuideMgr.tryGuide(EnumGuide.ShenZhuangShouJi, 0, false, KeyWord.OTHER_FUNCTION_SZSJ_1, false, KeyWord.OTHER_FUNCTION_SZSJ_1);
        //G.UnitMgr.addDropCoins(40, G.UnitMgr.SelectedUnit.Data.unitID);
    }

    protected initCtrl() {
        this.addCtrls(
            new HeroCtrl(), // 角色
            new HunLiCtrl(),//魂力(现在变成伙伴了)
            new HunGuCtrl(),//魂骨
            new EnhanceCtrl(), // 强化
            new FaQiCtrl(), // 神盾
            new GuildCtrl(),  // 宗门
            new ItemMergeCtrl(),  // 合成
            new ShengQiCtrl(),  // 宝物
            new SkillCtrl(),  // 技能
            new MainMarryCtrl(),//结婚
            new FanXianCtrl(),//凡仙
            new ExchangeCtrl(),//兑换商店
            new ShieldGodCtrl(), // 守护神
            new SettingCtrl(), // 设置
            //new MallCtrl(), // 商城
            new JinjieCtrl(), //进阶
        );
    }

    changeState(isOpen: boolean, needAnim: boolean) {
        this.needSpreadAnim = needAnim && isOpen != this.isOpened;
        super.changeState(isOpen, needAnim);

        // 处理技能板
        if (this.needSpreadAnim) {
            if (isOpen) {
                // 技能板渐隐消失
                this.skillRectTween = Tween.TweenAlpha.Begin(this.normalSkillRect, this.TweenSeconds, 0);
                this.skillRectTween.onFinished = delegate(this, this.onSkillRectTweenFinished);
            } else {
                if (null != this.skillRectTween && this.skillRectTween.enabled) {
                    this.skillRectTween.enabled = false;
                    this.skillRectTween = null;
                }
            }
        } else {
            if (null != this.skillRectTween && this.skillRectTween.enabled) {
                this.skillRectTween.enabled = false;
                this.skillRectTween = null;
            }
            if (!isOpen) {
                this.skillRectCanvasGroup.alpha = 1;
            }
            this.normalSkillRect.SetActive(!isOpen);

        }

        G.ActBtnCtrl.changeState(isOpen, needAnim);

        this.needSpreadAnim = false;

        let form = G.ViewCacher.mainView.getChildForm<TianChiView>(EnumMainViewChild.tianChi);
        if (form != null) {
            form.setActive(!isOpen);
        }

        //if (isOpen) {
        //    // 进行下一步指引
        //    let guider = G.GuideMgr.getCurrentGuider(0);
        //    if (null != guider) {
        //        guider.onGuideStepFinished(EnumGuide.FunctionGuide_OpenMainFuncBar);
        //    }
        //}
    }

    private onSkillRectTweenFinished() {
        this.normalSkillRect.SetActive(false);

    }

    checkUpdate() {
        if (!this.isDirty || !G.DataMgr.questData.isQuestDataReady || !G.DataMgr.activityData.isReady) {
            return;
        }

        this.vlistCtrls.length = 0;
        this.vlistCtrls2.length = 0;
        this.hlistCtrls.length = 0;

        let funcLimitData = G.DataMgr.funcLimitData;

        let anyHasTipMark = false;
        for (let idKey in this.id2ctrlMap) {
            let ctrl = this.id2ctrlMap[idKey];
            let actIconCfg: GameConfig.ActIconOrderM = funcLimitData.getActIconCfg(ctrl.data.id);
            if (null == actIconCfg) {
                continue;
            }
            if (funcLimitData.isFuncEntranceVisible(ctrl.data.id)) {
                ctrl.onStatusChange();
                if (FuncBtnState.Invisible == ctrl.data.state) {
                    continue;
                }
                if (ctrl.data.tipCount > 0) {
                    anyHasTipMark = true;
                }

                if (0 == actIconCfg.m_iArea) {
                    this.vlistCtrls.push(ctrl);
                } else if (1 == actIconCfg.m_iArea) {
                    this.hlistCtrls.push(ctrl);
                } else if (2 == actIconCfg.m_iArea) {
                    this.vlistCtrls2.push(ctrl);
                }
            }
        }

        this.vlistCtrls.sort(this.sortListCtrls);
        this.vlistCtrls2.sort(this.sortListCtrls);
        this.hlistCtrls.sort(this.sortListCtrls);

        // 先清理多余的按钮
        this.vItems.length = 0;
        this.vItemPositions.length = 0;
        this.vItems2.length = 0;
        this.vItemPositions2.length = 0;
        this.hItems.length = 0;
        this.hItemPositions.length = 0;

        let showIds: number[] = [];

        // 竖列
        this.processVerticalList(this.vlist.transform, this.vlistCtrls, this.vItems, this.vItemPositions, showIds);
        this.processVerticalList(this.vlist2.transform, this.vlistCtrls2, this.vItems2, this.vItemPositions2, showIds);

        // 横排
        let hCnt = this.hlistCtrls.length;
        for (let i = 0; i < hCnt; i++) {
            let ctrl = this.hlistCtrls[i];
            showIds.push(ctrl.data.id);
            let item = this.getItemByIdInternal(ctrl.data.id, this.hlist.transform);
            this.hItems.push(item);
            let itemPos = new UnityEngine.Vector3(0, 0, 0);
            this.hItemPositions.push(itemPos);

            let rect = item.goTrans as UnityEngine.RectTransform;
            rect.pivot = this.HorizonPivot;

            itemPos.x = i * this.ItemGap;

            item.update(ctrl, this.effectPrefab);
            Game.UIClickListener.Get(item.goGetSet.gameObject).onClick = delegate(this, this.onClickItem, this.hlistCtrls[i]);
        }

        this.showThisItems(showIds);

        // 按钮展开动画
        if (this.IsOpened) {
            this.vlist.SetActive(true);
            this.vlist2.SetActive(true);
            this.hlist.SetActive(true);
            if (this.normalSkillRect.activeSelf) {
                this.normalSkillRect.SetActive(false);
            }
        } else {
            if (!this.normalSkillRect.activeSelf) {
                this.normalSkillRect.SetActive(true);
            }
            if (!this.needSpreadAnim) {
                this.vlist.SetActive(false);
                this.vlist2.SetActive(false);
                this.hlist.SetActive(false);
            }
        }

        if (this.needSpreadAnim) {
            if (this.IsOpened) {
                let lastTween: Tween.TweenPosition;
                let vCnt = this.vlistCtrls.length;
                for (let i = 0; i < vCnt; i++) {
                    let item = this.vItems[i];
                    item.goTrans.localPosition = this.vZeroPosition;
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.vItemPositions[i]);
                }
                let v2Cnt = this.vlistCtrls2.length;
                for (let i = 0; i < v2Cnt; i++) {
                    let item = this.vItems2[i];
                    item.goTrans.localPosition = this.vZeroPosition2;
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.vItemPositions2[i]);
                }

                for (let i = 0; i < hCnt; i++) {
                    let item = this.hItems[i];
                    item.goTrans.localPosition = this.hZeroPosition;
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.hItemPositions[i]);
                }
                if (null != lastTween) {
                    lastTween.onFinished = delegate(this, this.onLastTweenFinished);
                    this.btnBarTween = lastTween;
                }
            } else {
                let lastTween: Tween.TweenPosition;
                let vCnt = this.vlistCtrls.length;
                for (let i = 0; i < vCnt; i++) {
                    let item = this.vItems[i];
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.vZeroPosition);
                }
                let v2Cnt = this.vlistCtrls2.length;
                for (let i = 0; i < v2Cnt; i++) {
                    let item = this.vItems2[i];
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.vZeroPosition2);
                }

                for (let i = 0; i < hCnt; i++) {
                    let item = this.hItems[i];
                    lastTween = Tween.TweenPosition.Begin(item.goGetSet.gameObject, this.TweenSeconds, this.hZeroPosition);
                }
                if (null != lastTween) {
                    lastTween.onFinished = delegate(this, this.onLastTweenFinished);
                    this.btnBarTween = lastTween;
                }
            }
        } else {
            let vCnt = this.vlistCtrls.length;
            for (let i = 0; i < vCnt; i++) {
                let item = this.vItems[i];
                item.goTrans.localPosition = this.vItemPositions[i];
            }
            let v2Cnt = this.vlistCtrls2.length;
            for (let i = 0; i < v2Cnt; i++) {
                let item = this.vItems2[i];
                item.goTrans.localPosition = this.vItemPositions2[i];
            }
            for (let i = 0; i < hCnt; i++) {
                let item = this.hItems[i];
                item.goTrans.localPosition = this.hItemPositions[i];
            }
        }

        let tipMark = ElemFinder.findObject(this.switcher, 'tipMark');
        tipMark.SetActive(anyHasTipMark);

        // 伙伴按钮
        if (funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_REBIRTH)) {
            this.btnPet.SetActive(true);
            //this.setTipMark(this.btnPet, G.GuideMgr.tipMarkCtrl.petTipMark.ShowTipMarkOnPet || TipMarkUtil.petExpedition());
            let istip = (G.GuideMgr.tipMarkCtrl.rebirthTipMark.ShowTip
                || G.GuideMgr.tipMarkCtrl.rebirthEquipSuitTipMark.ShowTip
                //|| G.GuideMgr.tipMarkCtrl.rebirthEquipTipMark.ShowTip//魂骨
                || G.GuideMgr.tipMarkCtrl.rebirthSkillTipMark.ShowTip//
                || G.GuideMgr.tipMarkCtrl.equipMingWenTipMark.ShowTip
                || G.GuideMgr.tipMarkCtrl.equipCollectTipMark.ShowTip
                //|| G.GuideMgr.tipMarkCtrl.hunguIntensifyTipMark.ShowTip
                //|| G.GuideMgr.tipMarkCtrl.hunGuShengJiTipMark.ShowTip
                //|| G.GuideMgr.tipMarkCtrl.hunGuStrengTipMark.ShowTip
            );
            this.setTipMark(this.btnPet, istip);

            if (this.needUpdatePet) {
                this.onFightPetChange();
                this.needUpdatePet = false;
            }
        } else {
            this.btnPet.SetActive(false);
        }

        this.setBtnGuildChatStatus();

        this.isDirty = false;
    }

    private processVerticalList(listTrans: UnityEngine.Transform, ctrls: BaseFuncIconCtrl[], items: BtnGroupItem[], positions: UnityEngine.Vector3[], showIds: number[]) {
        let vCnt = ctrls.length;
        for (let i = 0; i < vCnt; i++) {
            let ctrl = ctrls[i];
            showIds.push(ctrl.data.id);
            let item = this.getItemByIdInternal(ctrl.data.id, listTrans);
            items.push(item);
            let itemPos = new UnityEngine.Vector3(0, 0, 0);
            positions.push(itemPos);

            let rect = item.goTrans as UnityEngine.RectTransform;
            rect.pivot = this.VerticalPivot;

            itemPos.y = -i * this.ItemGap;
            if (i >= 4 && i < 8) {
                itemPos.x = -this.ItemGap;
                itemPos.y = -(i - 4) * this.ItemGap;
            } else if (i >= 8 && i < 12) {
                itemPos.x = -2 * this.ItemGap;
                itemPos.y = -(i - 8) * this.ItemGap;
            } else if (i >= 12 && i < 16) {
                itemPos.x = -3 * this.ItemGap;
                itemPos.y = -(i - 12) * this.ItemGap;
            }
            item.update(ctrl, this.effectPrefab);
            Game.UIClickListener.Get(item.goGetSet.gameObject).onClick = delegate(this, this.onClickItem, ctrls[i]);
        }
    }

    private onLastTweenFinished() {
        if (!this.IsOpened) {
            this.vlist.SetActive(false);
            this.vlist2.SetActive(false);
            this.hlist.SetActive(false);

            this.skillRectCanvasGroup.alpha = 1;
            this.normalSkillRect.SetActive(true);
        }
        G.ViewCacher.functionGuideView.updateTarget(null);
    }

    private onClickItem(ctrl: BaseFuncIconCtrl) {
        if (!G.ActionHandler.checkCrossSvrUsable(true, ctrl.data.id)) {
            return;
        }
        G.ViewCacher.functionGuideView.guideOffTarget(Game.UIClickListener.target);
        ctrl.handleClick();
    }

    private handleClick(itemGo: UnityEngine.GameObject, ctrl: BaseFuncIconCtrl) {
        G.ViewCacher.functionGuideView.guideOffTarget(itemGo);
        ctrl.handleClick();
    }

    private onClickBtnBag() {
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_BAG)) {
            return;
        }
        G.Uimgr.createForm<BagView>(BagView).open();
    }

    /**点击伙伴（魂力）按钮 */
    private onClickBtnPet() {
        //if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_BEAUTY)) {
        //    return;
        //}
        //G.Uimgr.createForm<PetView>(PetView).open();

        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_REBIRTH)) {
            return;
        }
        G.Uimgr.createForm<HunLiView>(HunLiView).open();
    }

    getFuncBtn(id: number): UnityEngine.GameObject {
        if (KeyWord.BAR_FUNCTION_REBIRTH == id) {
            return this.btnPet;
        }

        if (KeyWord.BAR_FUNCTION_BAG == id) {
            return this.btnBag;
        }

        let itemGo: UnityEngine.GameObject;
        let vCnt = this.vlistCtrls.length;
        for (let i = 0; i < vCnt; i++) {
            if (this.vlistCtrls[i].data.id == id) {
                itemGo = this.vItems[i].goGetSet.gameObject;
                break;
            }
        }

        if (null == itemGo) {
            let v2Cnt = this.vlistCtrls2.length;
            for (let i = 0; i < v2Cnt; i++) {
                if (this.vlistCtrls2[i].data.id == id) {
                    itemGo = this.vItems2[i].goGetSet.gameObject;
                    break;
                }
            }
        }

        if (null == itemGo) {
            let hCnt = this.hlistCtrls.length;
            for (let i = 0; i < hCnt; i++) {
                if (this.hlistCtrls[i].data.id == id) {
                    itemGo = this.hItems[i].goGetSet.gameObject;
                    break;
                }
            }
        }

        if (null != itemGo) {
            return this.getBtnWrapper(itemGo);
        }
        return null;
    }

    isInHorizonList(id: number): boolean {
        let hCnt = this.hlistCtrls.length;
        for (let i = 0; i < hCnt; i++) {
            if (this.hlistCtrls[i].data.id == id) {
                return true;
            }
        }
        return false;
    }

    // onPetNuQiChanged() {
    //     let petCtrl = G.UnitMgr.hero.pet;
    //     let progress = 0;
    //     if (null != petCtrl) {
    //         let skillCfg = SkillData.getSkillConfig(G.DataMgr.petData.getNqSkill(petCtrl.Data.id));
    //         if (null != skillCfg) {
    //             progress = petCtrl.Data.getProperty(Macros.EUAI_RAGE) / skillCfg.m_stConsumable[0].m_iConsumeValue;
    //         }
    //         if (progress > 1) {
    //             progress = 1;
    //         }
    //     }
    //     this.petNuQi.fillAmount = 0.8 * progress;
    // }

    onFightPetChange() {
        let petInfo = G.DataMgr.petData.getFollowPet();
        if (null != petInfo) {
            G.ResourceMgr.loadImage(this.petHeadTrans, uts.format('images/head/{0}.png', petInfo.m_iBeautyID));
        }
    }


    /////////////////////宗门按钮，红点。/////////////////////////////

    private oldGuildChatTipMark = false;
    /**
     * 设置宗门聊天的红点
     */
    setGuildChatTipMark() {
        let showTip = G.DataMgr.runtime.hasNewGuildChatMsg;
        if (this.oldGuildChatTipMark != showTip) {
            this.guildChatTipMark.SetActive(showTip);
            this.oldGuildChatTipMark = showTip;
        }
    }

    private oldBtnGuildChatStatus: boolean;
    /**
     * 设置宗门按钮显示状态
     */
    setBtnGuildChatStatus() {
        let showBtn = 0 != G.DataMgr.heroData.guildId;
        if (this.oldBtnGuildChatStatus != showBtn) {
            this.btnGuildChat.SetActive(showBtn);
            this.oldBtnGuildChatStatus = showBtn;
        }
    }

    private onClickGuildChat() {
        G.ViewCacher.chatView.open(Macros.CHANNEL_GUILD);
    }

}