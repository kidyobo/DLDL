import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ZhuRongJiTanItemData } from 'System/data/vo/ZhuRongJiTanItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MwslData } from 'System/data/MwslData'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MwslMagicView } from 'System/pinstance/hall/MwslMagicView'
import { MwslRuleView } from 'System/pinstance/hall/MwslRuleView'
import { Dice } from 'System/uilib/Dice'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RewardView } from 'System/pinstance/selfChallenge/RewardView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumRewardState } from 'System/constants/GameEnum'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"

class MingWenFuBenBlock {
    gameObject: UnityEngine.GameObject;

    private icon: UnityEngine.UI.Image;
    private title: UnityEngine.UI.Text;
    private lock: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.icon = ElemFinder.findImage(go, 'icon');
        this.title = ElemFinder.findText(go, 'title');
        this.lock = ElemFinder.findObject(go, 'lock');
    }

    update(cfg: GameConfig.HistoricalRemainsCfgM, altas: Game.UGUIAltas, isActivated: boolean) {
        if (null != cfg) {
            this.icon.sprite = altas.Get(cfg.m_iIcon.toString());
            //this.title.text = altas.Get(cfg.m_iIcon + 'a');
            this.icon.gameObject.SetActive(isActivated);
            this.title.gameObject.SetActive(isActivated);
            this.lock.SetActive(!isActivated);
            this.gameObject.SetActive(true);
        } else {
            this.gameObject.SetActive(false);
        }
    }
}

class MingWenFuBenLayerItem {
    private normal: UnityEngine.GameObject;
    private selected: UnityEngine.GameObject;
    private lock: UnityEngine.GameObject;
    private limited: UnityEngine.GameObject;

    private gift: UnityEngine.GameObject;
    private boxLight: UnityEngine.GameObject;
    private yiLingQu: UnityEngine.GameObject;
    private lingQu: UnityEngine.GameObject;
    private textProgress: UnityEngine.UI.Text;

    private label: UnityEngine.UI.Text;
    private unlock: UnityEngine.GameObject;

    private cfg: GameConfig.HistoricalRemainsCfgM;
    private isAllPassed = false;
    private hasGotGift = false;
    private canUnlock = false;

    setComponents(go: UnityEngine.GameObject) {
        this.normal = ElemFinder.findObject(go, 'normal');
        this.selected = ElemFinder.findObject(go, 'selected');
        this.lock = ElemFinder.findObject(go, 'lock');
        this.limited = ElemFinder.findObject(go, 'limited');
        this.gift = ElemFinder.findObject(go, 'gift');
        this.boxLight = ElemFinder.findObject(this.gift, 'boxLight');
        this.yiLingQu = ElemFinder.findObject(this.gift, 'yiLingQu');
        this.lingQu = ElemFinder.findObject(this.gift, 'lingQu');
        this.textProgress = ElemFinder.findText(this.gift, 'textProgress');
        this.label = ElemFinder.findText(go, 'Text');
        this.unlock = ElemFinder.findObject(go, 'unlock');

        Game.UIClickListener.Get(this.gift).onClick = delegate(this, this.onClickGift);
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickGo);
    }

    update(cfg: GameConfig.HistoricalRemainsCfgM, isSelected: boolean, isActivated: boolean, isAllPassed: boolean, canUnlock: boolean, limitLv: number, hasGotGift: boolean, activatedCnt: number, totalCnt: number) {
        this.cfg = cfg;
        this.isAllPassed = isAllPassed;
        this.hasGotGift = hasGotGift;
        this.canUnlock = canUnlock;
        this.selected.SetActive(isSelected);
        UIUtils.setGrey(this.normal, !isActivated);
        this.lock.SetActive(!isActivated);
        this.limited.SetActive(!isActivated);
        if (isActivated) {
            this.gift.SetActive(true);
            if (activatedCnt < totalCnt) {
                UIUtils.setGrey(this.gift, true, false, false);
                this.boxLight.SetActive(false);
                this.yiLingQu.SetActive(false);
                this.lingQu.SetActive(false);
                this.textProgress.gameObject.SetActive(true);
                this.textProgress.text = activatedCnt + '/' + totalCnt;
            } else {
                UIUtils.setGrey(this.gift, hasGotGift, false, false);
                this.boxLight.SetActive(!hasGotGift);
                this.yiLingQu.SetActive(hasGotGift);
                this.lingQu.SetActive(!hasGotGift);
                this.textProgress.gameObject.SetActive(false);
            }
        } else {
            this.gift.SetActive(false);
        }

        if (isActivated || canUnlock) {
            this.label.text = uts.format('第{0}层', DataFormatter.toHanNumStr(cfg.m_iStage));
        } else {
            if (limitLv > 0) {
                this.label.text = uts.format('{0}级开启', limitLv);
            } else {
                this.label.text = '上层全部探索后解锁';
            }
        }

        if (this.unlock) {
            this.unlock.SetActive(canUnlock);
        }
    }

    private onClickGift() {
        let itemDatas: RewardIconItemData[] = [];
        let dropCfg = DropPlanData.getDropPlanConfig(this.cfg.m_iLayerGift);
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            let item = new RewardIconItemData();
            let itemInfo = dropCfg.m_astDropThing[i];
            item.id = itemInfo.m_iDropID;
            item.number = itemInfo.m_uiDropNumber;
            itemDatas.push(item);
        }
        let state: EnumRewardState;
        if (this.isAllPassed) {
            state = this.hasGotGift ? EnumRewardState.HasGot : EnumRewardState.NotGot;
        } else {
            state = EnumRewardState.NotReach;
        }
        let desc = uts.format('点亮第{0}层所有格子即可领取：', DataFormatter.toHanNumStr(this.cfg.m_iStage));
        G.Uimgr.createForm<RewardView>(RewardView).open(itemDatas, desc, state, delegate(this, this.onClickGetReward));
    }

    private onClickGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_GET_STAGEPASS_GIFT, this.cfg.m_iStage));
    }

    private onClickGo() {
        if (this.canUnlock) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_ACT_NEXT_STAGE));
        }
    }
}

export class MingWenFuBenPanel extends TabSubForm {

    private layerItems: MingWenFuBenLayerItem[] = [];
    private textCnt: UnityEngine.UI.Text;

    private btnDice: UnityEngine.GameObject;
    private labelDice: UnityEngine.UI.Text;
    private textTimes: UnityEngine.UI.Text;
    private textCountDown: UnityEngine.UI.Text;

    private btnMagicDice: UnityEngine.GameObject;
    private btnEff: UnityEngine.GameObject;
    private textMagicTimes: UnityEngine.UI.Text;

    private btnReset: UnityEngine.GameObject;
    private textResetCost: UnityEngine.UI.Text;

    private btnRule: UnityEngine.GameObject;

    private dice: Dice = new Dice();

    private blocks: MingWenFuBenBlock[] = [];
    private altas: Game.UGUIAltas;
    private selected: UnityEngine.RectTransform;

    private roleAvatar: UIRoleAvatar;
    private roleRoot: UnityEngine.RectTransform;

    private nextMovePos: UnityEngine.Vector2;

    private bg: UnityEngine.UI.RawImage;
    private MosaicMap: { [layer: number]: UnityEngine.GameObject[] } = {};
    private Mosics: UnityEngine.GameObject[]=[];
    private bgs: UnityEngine.GameObject[] = [];
    private curActivatedCnt: number;
    private MosicsEffectObj: UnityEngine.GameObject;
    private MosicsEffect: UIEffect;
    private MosicsEffect2: UIEffect;
    private effectPos: UnityEngine.GameObject;
    private effectPos2: UnityEngine.GameObject;

    private confirmId = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MWSL);
    }

    protected resPath(): string {
        return UIPathData.MingWenShiLianView;
    }

    protected initElements() {
        this.MosicsEffectObj = this.elems.getElement('mosaicsEffect');
        this.effectPos = this.elems.getElement('effectPos');
        this.effectPos2 = this.elems.getElement('effectPos2');

        this.MosicsEffect = new UIEffect(); 
        this.MosicsEffect2 = new UIEffect(); 
        this.MosicsEffect.setEffectPrefab(this.MosicsEffectObj, this.effectPos);
        this.MosicsEffect2.setEffectPrefab(this.MosicsEffectObj, this.effectPos2);

        let layers = this.elems.getElement('layers');
        for (let i = 0; i < MwslData.MaxLayer; i++) {
            let layerItemGo = ElemFinder.findObject(layers, i.toString());
            let layerItem = new MingWenFuBenLayerItem();
            layerItem.setComponents(layerItemGo);
            this.layerItems.push(layerItem);
        }

        let Mosaic = this.elems.getElement('Mosaics');
        let bg = this.elems.getElement("bgs");
        for (let i = 1; i <= MwslData.MaxLayer; i++)
        {

            this.bgs.push(ElemFinder.findObject(bg, 'bg'+i.toString()));
            let mskObj = ElemFinder.findObject(Mosaic, i.toString());
            this.Mosics.push(mskObj);
            let config = G.DataMgr.mwslData.getLayerCfgs(i);

            for (let j = 1; j <= config.length+1;j++)
            {
                if (this.MosaicMap[i] == null)
                    this.MosaicMap[i] = [];
                this.MosaicMap[i].push(ElemFinder.findObject(mskObj, j.toString()));
            }
        }

        this.bg = this.elems.getRawImage('right');
        this.btnDice = this.elems.getElement('btnDice');
        this.labelDice = this.elems.getText('labelDice');
        this.textTimes = this.elems.getText('textTimes');
        this.textCountDown = this.elems.getText('textCountDown');
        this.textCnt = this.elems.getText('textCnt');

        this.btnMagicDice = this.elems.getElement('btnMagicDice');
        this.btnEff = ElemFinder.findObject(this.btnMagicDice, 'btnEff');
        this.textMagicTimes = this.elems.getText('textMagicTimes');

        this.btnReset = this.elems.getElement('btnReset');
        this.textResetCost = this.elems.getText('textResetCost');

        this.btnRule = this.elems.getElement('btnRule');

        this.dice.setComponents(this.elems.getElement('dice'), delegate(this, this.onDiceRolleCallback));
        //角色Avatar
        this.roleRoot = this.elems.getRectTransform('roleRoot');

        let types: number[] = [KeyWord.GRID_TYPE_GET_PRIZE, KeyWord.GRID_TYPE_LUCKY_BIRD, KeyWord.GRID_TYPE_MINI_BOSS, KeyWord.GRID_TYPE_RANDOM_PRIZE,
            KeyWord.GRID_TYPE_MINI_MONSTER, KeyWord.GRID_TYPE_FINAL_BOSS, KeyWord.GRID_TYPE_REINFORCE_PINSTANCE];

        this.altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        let blocks = this.elems.getElement('blocks');
        for (let i: number = 0; i <= MwslData.MAX_SIZE; i++) {
            let blockGo = ElemFinder.findObject(blocks, i.toString());
            let block = new MingWenFuBenBlock();
            block.setComponents(blockGo);
            this.blocks.push(block);
        }
        this.selected = this.elems.getRectTransform('selected');
    }

    protected initListeners() {
        this.addClickListener(this.btnDice, this.onClickBtnDice);
        this.addClickListener(this.btnMagicDice, this.onClickBtnMagicDice);
        this.addClickListener(this.btnReset, this.onClickBtnReset);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected onOpen() {
            let roleCtn = this.elems.getTransform('roleCtn');
            this.roleAvatar = new UIRoleAvatar(roleCtn, roleCtn);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.hasWing = true;
            let heroData = G.DataMgr.heroData;
            this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
        this.updateView();

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));
    }

    protected onClose() {
        this.roleAvatar.destroy();
        this._clear();
        G.Uimgr.closeForm(MwslRuleView);
    }

    onMwslResponse(command: number) {
        let mwslData = G.DataMgr.mwslData;

        if (Macros.HISTORICAL_REMAINS_PANEL == command || Macros.HISTORICAL_ACT_NEXT_STAGE == command) {
            this.updateView();
        }
        else if (Macros.HISTORICAL_REMAINS_THROW_DICE == command) {
            this.dice.setResult(mwslData.data.m_ucPreNumber);
            this.updateTimes();
        }
        else if (Macros.HISTORICAL_REMAINS_RESET_TIMES == command) {
            this.updateView();
        }
        else if (Macros.HISTORICAL_REMAINS_BUY_MAGIC_DICE_TIMES == command) {
            this.updateTimes();
            G.Uimgr.createForm<MwslMagicView>(MwslMagicView).open();
        }
        else if (Macros.HISTORICAL_REMAINS_GOTO_POS == command) {
            let cfg = mwslData.getCfg(mwslData.data.m_ucStage, mwslData.getCurPos());
            if (cfg.m_iType == KeyWord.GRID_TYPE_GET_PRIZE || cfg.m_iType == KeyWord.GRID_TYPE_LUCKY_BIRD || cfg.m_iType == KeyWord.GRID_TYPE_RANDOM_PRIZE) {
                G.TipMgr.addMainFloatTip('恭喜获得宝石试炼大礼包！', Macros.PROMPTMSG_TYPE_POPUP);
                this.updateView();
            }
            else {
                this.showEnterPinstance(cfg);
            }
        }
        else if (Macros.HISTORICAL_GET_STAGEPASS_GIFT == command) {
            this.updateLayerItems();
        }
    }

    private updateView() {
        let mwslData = G.DataMgr.mwslData;

        // 刷新格子
        let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
        let layerSize = cfgs.length;
        let activatedCnt = 0;
        let openMosaic: number[] = [];
        this.updateBg(mwslData.data.m_ucStage, MwslData.MaxLayer);
        for (let i = 1; i <= MwslData.MAX_SIZE; i++) {
            let block = this.blocks[i];
            if (i - 1 < layerSize) {
                let cfg = cfgs[i - 1];
                let isActivated = mwslData.isBlockActivated(cfg);
                block.update(cfg, this.altas, isActivated);
                if (isActivated) {
                    activatedCnt++;
                    openMosaic.push(i);
                    
                }
            } else {
                block.update(null, null, false);
            }
        }

        this.curActivatedCnt = activatedCnt;
        for (let i = 0; i < openMosaic.length; i++)
        {
            this.updateMosics(mwslData.data.m_ucStage, layerSize, openMosaic[i], activatedCnt);
        }
        // 更新左侧页签
        this.updateLayerItems();

        //检查是否在上次投掷过骰子之后走到了目标位置
        let pos: number = mwslData.getCurPos();
        let showConfirm = false;
        if (mwslData.data.m_ucPosStatus == MwslData.STATE_ABLED && mwslData.data.m_ucPreNumber > 0) {
            this.updateOneMosics();
            this.goToPos();
            this.resetSelectPos(false);
        }
        else if (mwslData.data.m_ucPos == 0 && mwslData.data.m_ucPreNumber > 0) {
            this.updateOneMosics();
            this.goToPos();
            this.resetSelectPos(false);
        }
        else if (mwslData.data.m_ucPosStatus == MwslData.STATE_DISABLED && pos > 0) {
            this.resetSelectPos(true);
            this.showEnterPinstance(mwslData.getCfg(mwslData.data.m_ucStage, pos));
            showConfirm = true;
        }
        else {
            this.resetSelectPos(true);
        }

        if (!showConfirm && this.confirmId > 0) {
            G.TipMgr.closeConfirm(this.confirmId);
        }

        this.updateTimes();
        // 显示上次骰子点数
        if (this.dice.isRollCompleted) {
            this.dice.go(mwslData.lastDiceNum, false);
        }

        this.textCnt.text = uts.format('本层已探索：{0}/{1}', activatedCnt, layerSize);

        if (layerSize == mwslData.getCurPos() || mwslData.data.m_uiMDRemainTimes <= 0) {
            this.btnEff.SetActive(false);
        }
        else {
            this.btnEff.SetActive(true);
        }
    }

    private updateLayerItems() {
        let mwslData = G.DataMgr.mwslData;

        let myLv = G.DataMgr.heroData.level;

        let allPassedArr: boolean[] = [];
        let gotArr: boolean[] = [];
        let activatedCntArr: number[] = [];
        let layerCfgArr: GameConfig.HistoricalRemainsCfgM[] = [];
        let layerSizeArr: number[] = [];
        let s = mwslData.data.m_ucStage;
        for (let i = 0; i < MwslData.MaxLayer; i++) {
            let layer = i + 1;
            allPassedArr.push(mwslData.isLayerAllPassed(layer));
            gotArr.push(mwslData.isLayerGiftGot(layer));
            activatedCntArr.push(mwslData.getLayerActivatedBlockCnt(layer));
            let cfgs = mwslData.getLayerCfgs(layer);
            layerCfgArr.push(cfgs[0]);
            layerSizeArr.push(cfgs.length);
        }

        let unlockLayer = 0;
        if (s > 0 && s < MwslData.MaxLayer && allPassedArr[s - 1]) {
            let cfgs = mwslData.getLayerCfgs(s);
            let layerSize = cfgs.length;
            if (mwslData.data.m_ucPos >= layerSize && mwslData.isComplete() && myLv >= layerCfgArr[s].m_iLimitLv) {
                unlockLayer = s + 1;
            }
        }
        
        for (let i = 0; i < MwslData.MaxLayer; i++) {
            let layer = i + 1;
            let layerItem = this.layerItems[i];
            let limitLv = 0;
            if (layerCfgArr[i].m_iLimitLv > myLv) {
                limitLv = layerCfgArr[i].m_iLimitLv;
            }
            layerItem.update(layerCfgArr[i], layer == mwslData.data.m_ucStage, i < mwslData.data.m_ucStage,
                allPassedArr[i], layer == unlockLayer, limitLv, gotArr[i],
                activatedCntArr[i], layerSizeArr[i]);
        }
    }

    private updateTimes() {
        let mwslData = G.DataMgr.mwslData;

        this.textMagicTimes.text = uts.format('剩余次数：{0}', mwslData.data.m_uiMDRemainTimes);
        this.textTimes.text = uts.format('剩余次数：{0}', TextFieldUtil.getColorText(mwslData.data.m_ucNDRemainTimes.toString(), Color.GREEN));
        if (mwslData.data.m_uiMDRemainTimes <= 0) {
            this.btnEff.SetActive(false);
        }
        // 骰子
        let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
        let layerSize = cfgs.length;
        if (!mwslData.isComplete()) {
            this.labelDice.text = '挑战';
            UIUtils.setButtonClickAble(this.btnDice, true);
        }
        else if (mwslData.getCurPos() >= layerSize) {
            this.labelDice.text = '已挑战';
            UIUtils.setButtonClickAble(this.btnDice, false);
        }
        else {
            this.labelDice.text = '投掷';
            UIUtils.setButtonClickAble(this.btnDice, true);
        }

        if (mwslData.data.m_ucNDRemainTimes < Macros.MAX_NORMAL_DICE_TIMES) {
            if (mwslData.getCurPos() < layerSize) {
                this.addTimer("countDownTimer", 1000, mwslData.data.m_uiDiceResetTime, this.onCountDownTimer);
                this.textCountDown.text = uts.format('次数+1倒计时:{0}', DataFormatter.second2mmss(mwslData.data.m_uiDiceResetTime));
            }
            else if (mwslData.isComplete()) {
                this.textCountDown.text = '次数+1倒计时:--';
                this.textTimes.text = '剩余次数:--';
                this.textMagicTimes.text = '剩余次数:--';
                this.stopCountDownTimer();
            }
        }
        else {
            this.textCountDown.text = '次数已满';
            this.stopCountDownTimer();
        }

        // 更新重置价格
        UIUtils.setButtonClickAble(this.btnReset, mwslData.getCurPos() > 0 && mwslData.data.m_ucRemainResetTimes > 0);
        this.textResetCost.text = cfgs[0].m_iResetPrice.toString();  
    }

    private onCountDownTimer(timer: Game.Timer) {
        let mwslData = G.DataMgr.mwslData;
        mwslData.data.m_uiDiceResetTime = Math.max(0, mwslData.data.m_uiDiceResetTime - timer.CallCountDelta);
        if (mwslData.data.m_uiDiceResetTime > 0) {
            this.textCountDown.text = uts.format('次数+1倒计时:{0}', DataFormatter.second2mmss(mwslData.data.m_uiDiceResetTime));
        }
        else {
            this.stopCountDownTimer();
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));
        }
    }

    private stopCountDownTimer() {
        this.removeTimer("countDownTimer");
    }

    private onClickBtnDice() {
        let mwslData = G.DataMgr.mwslData;

        if (mwslData.data.m_ucPreNumber > 0) {
            G.TipMgr.addMainFloatTip('请稍候...');
            return;
        }

        let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
        let layerSize = cfgs.length;
        let curPos: number = mwslData.getCurPos();
        if (!mwslData.isComplete()) {
            this.showEnterPinstance(mwslData.getCfg(mwslData.data.m_ucStage, curPos));
        }
        else if (curPos < layerSize) {
            if (mwslData.data.m_ucNDRemainTimes <= 0) {
                G.TipMgr.addMainFloatTip('没有点数了');
                return;
            }
            if (this.dice.isRollCompleted) {
                this.dice.go(0, true);
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_THROW_DICE, Macros.HISTORICAL_REMAINS_DICE_TYPE_1, 0));
            }
        }
        else {
            G.TipMgr.addMainFloatTip('终点已挑战完成，请明日再试。');
        }
    }

    private onDiceRolleCallback() {
        let mwslData = G.DataMgr.mwslData;
        this.setSelectPos(mwslData.data.m_ucPos, mwslData.getCurPos());
        this._clear();
        G.TipMgr.addMainFloatTip(uts.format('试炼进度+{0}', G.DataMgr.mwslData.data.m_ucPreNumber), Macros.PROMPTMSG_TYPE_POPUP);
        this.updateOneMosics();
        this.goToPos();

    }

    private onClickBtnMagicDice() {
        let mwslData = G.DataMgr.mwslData;
        if (mwslData.data.m_ucPreNumber > 0) {
            G.TipMgr.addMainFloatTip('正在试炼中,请稍候...');
            return;
        }

        let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
        let layerSize = cfgs.length;
        let curPos: number = mwslData.getCurPos();
        if (!mwslData.isComplete()) {
            this.showEnterPinstance(mwslData.getCfg(mwslData.data.m_ucStage, curPos));
        }
        else {
            if (curPos < layerSize) {
                let remainTimes: number = mwslData.data.m_uiMDRemainTimes;
                if (remainTimes > 0) {
                    G.Uimgr.createForm<MwslMagicView>(MwslMagicView).open();
                }
                else {
                    this.buyMagicDiceCount();
                }
            }
            else {
                G.TipMgr.addMainFloatTip('本次试炼已通关');
            }
        }
    }

    private showEnterPinstance(cfg: GameConfig.HistoricalRemainsCfgM): void {
        let info: string
        if (cfg.m_iType == KeyWord.GRID_TYPE_FINAL_BOSS) {
            info = '宝藏被他藏在身上了，赶快击败他夺取宝物!';
        }
        else if (cfg.m_iType == KeyWord.GRID_TYPE_MINI_BOSS) {
            info = '大魔王跳出来拦住了你的去路，\n不给TA点颜色瞧瞧是不行了';
        }
        else if (cfg.m_iType == KeyWord.GRID_TYPE_MINI_MONSTER) {
            info = '您在宝石试炼中遇到一群不长眼的精怪，这群家伙没有让开的意思!';
        }
        else if (cfg.m_iType == KeyWord.GRID_TYPE_REINFORCE_PINSTANCE) {
            info = '您在宝石试炼中遇到一群渣渣守卫，砍翻他们拿宝石!';
        }

        let mwslData = G.DataMgr.mwslData;
        let btnName: string;
        let needX = false;
        let isDouble = false;
        if (mwslData.isBlockActivated(cfg) && cfg.m_iPrice > 0) {
            btnName = '进入副本|一键双倍￥' + KeyWord.MONEY_YUANBAO_ID + ':' + cfg.m_iPrice;
            needX = true;
            isDouble = true;
        } else {
            btnName = '进入副本|取消';
            isDouble = false;
        }
        this.confirmId = G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, btnName, delegate(this, this._on5starConfirm, cfg.m_iPrice, cfg.m_iType,isDouble ), 0, 0, needX);
    }

    private _on5starConfirm(state: MessageBoxConst, isCheckSelected: boolean, price: number, type: number,isDouble:boolean ): void {
        if (MessageBoxConst.yes == state) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEnterPinstanceRequest(0, Macros.PINSTANCE_ID_HISTORICAL_REMAINS, false, 0));
        }
        else if (MessageBoxConst.no == state && price > 0&&isDouble ) {
            // 检查钻石
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, price, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_ONE_KEY_FINISH));
            }
        }
    }

    private buyMagicDiceCount(): void {
        let price = G.DataMgr.constData.getValueById(KeyWord.PARAM_MAGIC_DICE_BASE_COST);
        let content: string = uts.format('是否花费{0}购买一次魔法骰子？', TextFieldUtil.getYuanBaoText(price));
        G.TipMgr.showConfirm(content, ConfirmCheck.noCheck, '确定|取消', delegate(this, this._buyMagicDiceCount, price));

    }

    private _buyMagicDiceCount(state: MessageBoxConst, isCheckSelected: boolean, price: number): void {
        if (MessageBoxConst.yes == state) {
            // 检查钻石
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, price, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_BUY_MAGIC_DICE_TIMES, 1));
            }
        }
    }

    private onClickBtnReset() {
        let mwslData = G.DataMgr.mwslData;
        if (mwslData.data.m_ucPreNumber > 0 || !this.dice.isRollCompleted) {
            G.TipMgr.addMainFloatTip('请稍候...');
            return;
        }

        if (mwslData.getCurPos() > 0) {
            let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cfgs[0].m_iResetPrice, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_RESET_TIMES));
            }
        } else {
            G.TipMgr.addMainFloatTip('当前无需重置');
        }
    }

    /**
     *走的方法
     * @param now当前格子
     * @param to目标格子
     *
     */
    private goToPos(): void {

        this.nextMovePos = null;
        this.roleAvatar.m_bodyMesh.playAnimation('move');
        this.addTimer("moveTimer", 30, 0, this.onMoveTimer);
    }

    private onMoveTimer(): void {
        let mwsl = G.DataMgr.mwslData;
        let cfgs = mwsl.getLayerCfgs(mwsl.data.m_ucStage);
        let layerSize = cfgs.length;
        if (mwsl.data.m_ucPreNumber > 0) {
            let move: number = 5;
            let rolePoint = this.roleRoot.anchoredPosition;
            if (null == this.nextMovePos) {
                this.nextMovePos = this.getMovePath(mwsl.data.m_ucPos < layerSize ? mwsl.data.m_ucPos + 1 : 1);
                let angle = Math.atan2(this.nextMovePos.x - rolePoint.x, this.nextMovePos.y - rolePoint.y) * 57;
                this.roleRoot.rotation = UnityEngine.Quaternion.Euler(0, angle, 0);
            }
            if (UnityEngine.Vector2.Distance(rolePoint, this.nextMovePos) < move) {
                this.roleRoot.anchoredPosition = this.nextMovePos;
                this.nextMovePos = null;
                mwsl.data.m_ucPos++;
                mwsl.data.m_ucPreNumber--;
            }
            else {
                let abs: number = Math.abs(rolePoint.x - this.nextMovePos.x);
                if (abs > 1) {
                    if (rolePoint.x > this.nextMovePos.x) {
                        rolePoint.x -= Math.min(move, abs);
                    }
                    else {
                        rolePoint.x += Math.min(move, abs);
                    }
                }
                abs = Math.abs(rolePoint.y - this.nextMovePos.y);
                if (abs >= 1) {
                    if (rolePoint.y > this.nextMovePos.y) {
                        rolePoint.y -= Math.min(move, abs);
                    }
                    else {
                        rolePoint.y += Math.min(move, abs);
                    }
                }
                this.roleRoot.anchoredPosition = rolePoint;
            }
        }
        if (mwsl.data.m_ucPreNumber <= 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_GOTO_POS));
            this.nextMovePos = null;
            this.stopMoveTimer();
            this.roleAvatar.m_bodyMesh.playAnimation('stand');

            if (!mwsl.isComplete()) {
                this.labelDice.text = '挑战';
            }
            else {
                this.labelDice.text = '投掷';
            }

            if (layerSize == mwsl.getCurPos()) {
                this.btnEff.SetActive(false);
            }
        }
    }

    private stopMoveTimer() {
        this.removeTimer("moveTimer");
    }

    private getMovePath(i: number): UnityEngine.Vector2 {
        return this.getPoint(i);
    }

    private setSelectPos(pos: number, targetIdx: number = -2): void {
        let blockPos = this.getPoint(pos);
        let rect = this.roleRoot.transform as UnityEngine.RectTransform;
        rect.anchoredPosition = blockPos;

        if (targetIdx != -2) {
            let blockPos = this.getPoint(targetIdx);
            this.selected.anchoredPosition = blockPos;
        }
    }

    private resetSelectPos(reset: boolean): void {
        let mwslData = G.DataMgr.mwslData;
        let pos: number = mwslData.getCurPos();
        if (reset) {
            this.setSelectPos(pos, pos);
        }
        else {
            let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
            let layerSize = cfgs.length;
            if (pos > layerSize) {
                mwslData.data.m_ucPreNumber = layerSize - mwslData.data.m_ucPos;
            }
            this.setSelectPos(mwslData.data.m_ucPos, mwslData.data.m_ucPos + mwslData.data.m_ucPreNumber);
        }
    }

    private getPoint(index: number): UnityEngine.Vector2 {
        let block = this.blocks[index];
        let rect = block.gameObject.transform as UnityEngine.RectTransform;
        return rect.anchoredPosition;
    }

    onSelectMagicDice(num: number): void {
        this.dice.go(0, true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_THROW_DICE, Macros.HISTORICAL_REMAINS_DICE_TYPE_2, num));
    }

    private _clear(): void {
        this.dice.reset();
        G.Uimgr.closeForm(MwslMagicView);
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<MwslRuleView>(MwslRuleView).open();
    }

    private updateBg(layer:number,maxLayer:number  )
    {
        //G.ResourceMgr.loadImage(this.bg, uts.format('ui/texture/{0}.jpg', 'mwslbj' + layer.toString()));
        for (let i = 0; i < maxLayer; i++)
        {
            this.bgs[i].SetActive(i==(layer-1));
        }

        for (let i = 0; i < this.Mosics.length;i++)
        {
            this.Mosics[i].SetActive(i==(layer-1));
        }
    }

    //刷新全部
    private updateMosics(layer: number, layerSize:number,isActivatedIndex: number, activatedCnt:number )
    {
        this.MosaicMap[layer][isActivatedIndex - 1].SetActive(false );
        if (layerSize == activatedCnt)
        {
            this.MosaicMap[layer][layerSize].SetActive(false );
        }
    }

    //刷新某一个
    private updateOneMosics()
    {
        let mwsl = G.DataMgr.mwslData;
        let nextPos = mwsl.getCurPos();
        let curLayer = mwsl.data.m_ucStage;
        if (this.MosaicMap[curLayer][nextPos - 1].activeSelf == true)
        {
            this.effectPos.transform.localPosition = this.MosaicMap[curLayer][nextPos - 1].transform.localPosition;                      
            this.MosicsEffect.playEffect(EffectType.Effect_Normal);
            this.MosaicMap[curLayer][nextPos - 1].SetActive(false);
        }
        
        if (this.curActivatedCnt + 1 == mwsl.getLayerCfgs(curLayer).length && this.MosaicMap[curLayer][this.curActivatedCnt + 1].activeSelf ==true)
        {
            this.effectPos2.transform.localPosition = this.MosaicMap[curLayer][this.curActivatedCnt + 1].transform.localPosition;
            this.MosicsEffect2.playEffect(EffectType.Effect_Normal);
            this.MosaicMap[curLayer][this.curActivatedCnt + 1 ].SetActive(false);
        }
    }
}