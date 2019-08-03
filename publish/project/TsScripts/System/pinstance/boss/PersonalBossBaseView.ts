import { Constants } from 'System/constants/Constants';
import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { MonsterData } from 'System/data/MonsterData';
import { PinstanceData } from 'System/data/PinstanceData';
import { UIPathData } from 'System/data/UIPathData';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { BossView } from "System/pinstance/boss/BossView";
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { TipFrom } from 'System/tip/view/TipsView';
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { List, ListItem } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UnitUtil } from "System/utils/UnitUtil";
import { VipView } from "System/vip/VipView";
import ThingData from '../../data/thing/ThingData';
import { GameIDUtil } from '../../utils/GameIDUtil';

export class PersonalBossData {
    data: Protocol.DBBossCountInfo;
    config: GameConfig.PrivatBossCfgM;
    monsterCfg: GameConfig.MonsterConfigM;

    //存放多人boss数据 有四个
    personalBossData: PersonalBossData[] = [];

    static sortFunc(a: PersonalBossData, b: PersonalBossData) {
        if (a.config.m_iLevel > b.config.m_iLevel) {
            return 0;
        }
        else if (a.config.m_iLevel == b.config.m_iLevel) {
            if (a.config.m_iIMonsterType == b.config.m_iIMonsterType) {
                return 0;
            }
            else if (a.config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else {
            return -1;
        }
    }
    static sortByTimeFunc(a: PersonalBossData, b: PersonalBossData) {
        return a.data.m_uiBossRefreshTime - b.data.m_uiBossRefreshTime;
    }
}

export class MultiplayerBossListItem {
    private txtTltleName: TextGetSet;
    // private bossHeads: UnityEngine.UI.RawImage[];
    private lockNode: GameObjectGetSet;
    private txtLimit: TextGetSet;

    private bossList: List;
    private bossListItem: PersonalBossListItem[] = [];

    private bossDatas: PersonalBossData[] = [];

    setComponent(obj: UnityEngine.GameObject) {

        this.txtTltleName = new TextGetSet(ElemFinder.findText(obj, "txtTltleName"));
        // this.bossHeads = [];
        // for (let i = 0; i < 4; i++) {
        //     let img = ElemFinder.findRawImage(obj, uts.format("headNode/{0}", i));
        //     this.bossHeads.push(img);
        // }
        this.lockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "lockNode"));
        this.txtLimit = new TextGetSet(ElemFinder.findText(this.lockNode.gameObject, "txtLimit"));

    }

    update(data: PersonalBossData, id: number) {
        this.bossDatas = [];
        this.bossDatas[0] = data;
        for (let i = 0, count = data.personalBossData.length; i < count; i++) {
            this.bossDatas[i + 1] = data.personalBossData[i];
        }
        //是否开启
        let heroLv = G.DataMgr.heroData.level;
        let isOpen = (heroLv >= data.config.m_iLevel) && (heroLv <= data.config.m_iLevelUp);
        this.txtTltleName.text = data.config.m_sAreaName;//  uts.format("核心{0}区", SpecialCharUtil.getJieNumberCN(id));
        if (isOpen) {
            this.lockNode.SetActive(false);
        }
        else {
            this.lockNode.SetActive(true);
            if (heroLv > data.config.m_iLevelUp)
                this.txtLimit.text = TextFieldUtil.getColorText("等级过高", Color.RED);
            else
                this.txtLimit.text = uts.format("{0}级开启", data.config.m_iLevel);
        }
        // for (let i = 0, count = this.bossDatas.length; i < count; i++) {
        //     G.ResourceMgr.loadImage(this.bossHeads[i], uts.format('images/head/{0}.png', this.bossDatas[i].monsterCfg.m_iHeadID));
        // }
    }
}

export class PersonalBossListItem {
    private timer: Game.Timer = null;
    private data: PersonalBossData;
    public timestatus = false;
    private panel: PersonalBossBaseView;
    private obj: UnityEngine.GameObject;
    private lvIsLow: boolean = false;
    private lvIsUp: boolean = false;


    private lockNode: GameObjectGetSet;
    private unlockNode: GameObjectGetSet;

    private bossHead: UnityEngine.UI.RawImage;
    private txtLv: TextGetSet;
    private txtStatus: TextGetSet;
    private txtCount: TextGetSet;
    private flagDeath: GameObjectGetSet;

    private flagColor1: UnityEngine.GameObject;
    private flagColor2: UnityEngine.GameObject;
    private flagColor3: UnityEngine.GameObject;

    setComponent(obj: UnityEngine.GameObject, panel: PersonalBossBaseView) {
        this.obj = obj;
        this.panel = panel;

        this.lockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "lockNode"));
        this.unlockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "unlockNode"));

        this.bossHead = ElemFinder.findRawImage(obj, 'bossHead');
        this.txtLv = new TextGetSet(ElemFinder.findText(obj, 'lockNode/txtLv'));
        this.txtStatus = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtStatus'));
        this.txtCount = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtCount'));
        this.flagDeath = new GameObjectGetSet(ElemFinder.findObject(obj, "unlockNode/flagDeath"));

        let node = ElemFinder.findObject(obj, "colorNode");
        this.flagColor1 = ElemFinder.findObject(node, "1");
        this.flagColor2 = ElemFinder.findObject(node, "2");
        this.flagColor3 = ElemFinder.findObject(node, "3");
    }

    update(data: PersonalBossData) {
        this.data = data;
        let cfg = data.config;
        G.ResourceMgr.loadImage(this.bossHead, uts.format('images/head/{0}.png', data.monsterCfg.m_iHeadID));

        let heroLv = G.DataMgr.heroData.level;
        this.lvIsLow = heroLv < cfg.m_iLevel;
        this.lvIsUp = heroLv > cfg.m_iLevelUp;
        let islock = this.lvIsLow || this.lvIsUp;

        if (this.timer) {
            this.timer.Stop();
        }
        let times = this.data.data.m_ucFightCount;

        this.lockNode.SetActive(islock);
        this.unlockNode.SetActive(!islock);
        if (islock) {
            if (this.lvIsLow) {
                this.txtLv.text = TextFieldUtil.getColorText(uts.format("{0}级开启", cfg.m_iLevel), Color.RED);
            } else if (this.lvIsUp) {
                this.txtLv.text = TextFieldUtil.getColorText("等级过高", Color.RED);
            }
        }
        else {
            //次数
            if (this.data.config.m_iTimeLimit == 0) {
                this.txtCount.text = uts.format("挑战：{0}", TextFieldUtil.getColorText("不限", Color.WHITE));
            }
            else {
                let max = this.data.config.m_iTimeLimit + this.data.data.m_ucVipBuyTimes;
                if (times >= max) {
                    this.txtCount.text = uts.format("挑战：{0}", TextFieldUtil.getColorText(uts.format("{0}/{1}", 0, max), Color.RED));
                }
                else {
                    this.txtCount.text = uts.format("挑战：{0}", TextFieldUtil.getColorText(uts.format("{0}/{1}", max - times, max), Color.GREEN));
                }
            }
            //时间
            this.timer = new Game.Timer("bosstimer", 1000, 0, delegate(this, this.onTickTimer));
            this.timestatus = false;
            this.onTickTimer();
        }

        if (this.lvIsLow) {
            this.txtLv.text = TextFieldUtil.getColorText(uts.format("{0}级开启", cfg.m_iLevel), Color.RED);
        } else if (this.lvIsUp) {
            this.txtLv.text = TextFieldUtil.getColorText("等级过高", Color.RED);
        } else {
            this.timer = new Game.Timer("bosstimer", 1000, 0, delegate(this, this.onTickTimer));
            this.onTickTimer();
        }

        let isPrivateBoss = data.config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS;
        let isNotLimit = data.config.m_iTimeLimit > 0;
        this.flagColor1.SetActive(isPrivateBoss && isNotLimit);
        this.flagColor2.SetActive(isPrivateBoss && !isNotLimit);
        this.flagColor3.SetActive(!isPrivateBoss);
    }


    private onTickTimer() {
        if (this.timestatus == true) {
            return;
        }

        let max = this.data.config.m_iTimeLimit + this.data.data.m_ucVipBuyTimes;
        let times = this.data.data.m_ucFightCount;

        let refreshTime = this.data.data.m_uiBossRefreshTime;
        if (this.data.config.m_iTimeLimit == 0) {
            this.txtCount.text = TextFieldUtil.getColorText("不限", Color.WHITE);
        }
        else {
            let max = this.data.config.m_iTimeLimit + this.data.data.m_ucVipBuyTimes;
            if (times >= max) {
                this.txtCount.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", 0, max), Color.RED);
            }
            else {
                this.txtCount.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", max - times, max), Color.GREEN);
            }
        }
        let leftSecond = refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
        if (this.data.config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
            this.txtStatus.text = TextFieldUtil.getColorText("五分钟刷新", Color.GREEN);
        }
        else {
            if (leftSecond > 0) {
                this.timestatus = false;
                this.flagDeath.SetActive(true);
                this.txtStatus.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(leftSecond), Color.RED);
            } else {
                this.timestatus = true;
                this.flagDeath.SetActive(false);
                if (this.data.config.m_iTimeLimit == 0) {
                    //次数不限
                    this.txtStatus.text = TextFieldUtil.getColorText('已刷新', Color.GREEN);
                }
                else {
                    if (times < max)
                        this.txtStatus.text = TextFieldUtil.getColorText('已刷新', Color.GREEN);
                    else
                        this.txtStatus.text = TextFieldUtil.getColorText('已无奖励', Color.RED);
                }
                this.updateBtnStatus();
            }
        }
    }
    public dispose() {
        if (this.timer) {
            this.timer.Stop();
        }
        this.timer = null;
        // this.panel = null;
    }
    private updateBtnStatus() {
        if (this.panel) {
            this.panel.updateBtnStatus();
        }
    }

}

/**一组头像 四个圆的加两个 */
export class PersonalBossHeartNode {
    private gameObject: GameObjectGetSet;
    private panel: PersonalBossBaseView;

    private bossDatas: PersonalBossData[] = [];
    private itemList: PersonalBossHeartItem[] = [];
    private timer: Game.Timer = null;

    onClickAct: (index: number) => void;

    setComponent(obj: UnityEngine.GameObject, panel: PersonalBossBaseView) {
        this.gameObject = new GameObjectGetSet(obj);
        this.panel = panel;

        for (let i = 0; i < 6; i++) {
            let item = new PersonalBossHeartItem();
            item.setComponent(ElemFinder.findObject(obj, i.toString()));
            item.onClickAct = delegate(this, this.onClick, i);
            this.itemList.push(item);
        }
    }

    update(data: PersonalBossData) {
        this.bossDatas = [];
        this.bossDatas[0] = data;
        for (let i = 0, count = data.personalBossData.length; i < count; i++) {
            this.bossDatas[i + 1] = data.personalBossData[i];
        }
        for (let i = 0, count = this.bossDatas.length; i < count; i++) {
            this.itemList[i].update(this.bossDatas[i].monsterCfg.m_iHeadID, this.bossDatas[i].monsterCfg.m_szMonsterName);
        }

        if (this.timer) {
            this.timer.Stop();
        }
        this.timer = new Game.Timer("bossItemtimer", 1000, 0, delegate(this, this.onTickTimer));
        this.onTickTimer();
    }

    private onTickTimer() {
        let iscall = true;
        let severTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
        for (let i = 0, count = this.bossDatas.length; i < count; i++) {
            let data = this.bossDatas[i];
            let leftSecond = data.data.m_uiBossRefreshTime - severTime;
            if (leftSecond > 0) {
                //有数值
                iscall = false;
            }
            this.itemList[i].updateTime(DataFormatter.second2mmss(leftSecond), leftSecond > 0);
        }
        if (iscall) {
            this.timer.Stop();
            if (this.panel)
                this.panel.updateBtnStatus();
        }
    }

    public close() {
        this.gameObject.SetActive(false);
        if (this.timer)
            this.timer.Stop();
        this.timer = null;

    }

    public open() {
        this.gameObject.SetActive(true);
    }

    public onClick(index: number) {
        if (this.onClickAct != null)
            this.onClickAct(index);
    }

}

/**一个头像 圆的 */
export class PersonalBossHeartItem {
    private gameObject: GameObjectGetSet;
    private bossDatas: PersonalBossData[] = [];

    private imgHeart: UnityEngine.UI.RawImage;
    private limit: GameObjectGetSet;
    private txtTime: TextGetSet;
    private txtName: TextGetSet;

    private strBossName: string;
    onClickAct: () => void;

    setComponent(obj: UnityEngine.GameObject) {
        this.gameObject = new GameObjectGetSet(obj);

        this.imgHeart = ElemFinder.findRawImage(obj, "Mask/imgHeart");
        this.limit = new GameObjectGetSet(ElemFinder.findObject(obj, "limit"));
        this.txtTime = new TextGetSet(ElemFinder.findText(obj, "limit/txtTime"));
        this.txtName = new TextGetSet(ElemFinder.findText(obj, "txtName"));
        Game.UIClickListener.Get(this.gameObject.gameObject).onClick = delegate(this, this.onClick);
    }

    update(iconid: number, name: string) {
        G.ResourceMgr.loadImage(this.imgHeart, uts.format('images/head/{0}.png', iconid));
        this.txtName.text = name;
        this.strBossName = name;
    }

    updateTime(time: string, istime: boolean) {
        this.limit.SetActive(istime);
        if (istime)
            this.txtTime.text = time;
        this.txtName.text = TextFieldUtil.getColorText(this.strBossName, istime ? Color.RED : Color.WHITE);
    }

    public onClick() {
        if (this.onClickAct != null)
            this.onClickAct();
    }
}

export class PersonalBossBaseView extends TabSubForm implements IGuideExecutor {

    btnGo: GameObjectGetSet;
    private rewardList: List;
    private rewardHunguList: List;

    private bossList: List;
    private multiBossList: List;
    private modelCtn: UnityEngine.GameObject;
    private modelRoot: UnityEngine.GameObject;
    static iconItemNormal: UnityEngine.GameObject;
    private vipDescriteNode: GameObjectGetSet;
    private txtVipDescrite: TextGetSet;
    private btnAdd: UnityEngine.GameObject;
    private tipText: TextGetSet;
    private textLv: TextGetSet;
    private textName: TextGetSet;
    protected godPower: TextGetSet;
    protected gotext: TextGetSet;
    protected countTip: TextGetSet;
    protected timeTip: TextGetSet;
    private currentNum: TextGetSet;
    private txtRecommendFight: TextGetSet;
    private openBossId: number = 0;
    private guidingBossId = 0;
    /**引导使用的难度*/
    guideUsePinstanceDiff: number = 0;
    private selectedBossData: PersonalBossData = null;
    private dataList: PersonalBossData[] = [];
    private multiDataList: PersonalBossData[] = [];
    private bossDatas: PersonalBossData[] = [];
    private inititems: PersonalBossListItem[] = [];
    private multiInititems: MultiplayerBossListItem[] = [];
    private personalBossHeartNode: PersonalBossHeartNode = null;
    info: Protocol.ListPinHomeRsp;
    private specialshowtimetip = false;
    private btnRefresh: GameObjectGetSet;
    private firstOpen: boolean = true;
    private bossType: UnityEngine.GameObject[] = [];

    //多人boss添加模型节点和旋转功能
    private drag: UnityEngine.GameObject;
    private modelFourNode: UnityEngine.GameObject;
    private rextModelFourNode: UnityEngine.RectTransform;

    private rectModelNodel: UnityEngine.GameObject[] = [];
    protected isMultiBoss: boolean = false;
    private curMultiBossData: PersonalBossData = null;
    private curMultiBossDatas: PersonalBossData[] = [];

    //添加个人 多人boss按钮
    btnBoss: GameObjectGetSet;
    btnMultiBoss: GameObjectGetSet;
    private buttonBossSel: GameObjectGetSet;
    private buttonMuiltBossSel: GameObjectGetSet;
    private multiTipMask: GameObjectGetSet;
    private txtMultiTipMask: TextGetSet;
    private txtRewardName: TextGetSet;

    private curSelected: number = -1;
    private multiBossMinLevel = 999;
    private multiBossNumber = 6;


    constructor(id: number) {
        // super(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
        super(id);
        this._cacheForm = true;
    }


    protected resPath(): string {
        return UIPathData.PersonalBossView;
    }

    protected initElements() {
        this.btnGo = new GameObjectGetSet(this.elems.getElement('btnGo'));
        this.rewardList = this.elems.getUIList('rewardList');
        this.rewardHunguList = this.elems.getUIList('rewardHunguList');

        this.modelCtn = this.elems.getElement('modelCtn');
        //改缩放的节点
        this.modelRoot = this.elems.getElement("modelRoot");
        this.bossList = this.elems.getUIList('list');
        this.multiBossList = this.elems.getUIList('multiList');
        this.multiBossList.MovementType = Game.FyScrollRect.MovementType.NoCross;
        this.vipDescriteNode = new GameObjectGetSet(this.elems.getElement("vipDescriteNode"));
        this.txtVipDescrite = new TextGetSet(this.elems.getText("txtVipDescrite"));
        this.btnAdd = this.elems.getElement('btnAdd');
        PersonalBossBaseView.iconItemNormal = this.elems.getElement('itemIcon_Normal');//适用职业：器魂师
        this.tipText = new TextGetSet(this.elems.getText('tipText'));
        this.textLv = new TextGetSet(this.elems.getText('textLv'));
        this.textName = new TextGetSet(this.elems.getText('textName'));
        this.godPower = new TextGetSet(this.elems.getText('godPower'));
        this.gotext = new TextGetSet(this.elems.getText('gotext'));
        this.countTip = new TextGetSet(this.elems.getText('countTip'));
        this.timeTip = new TextGetSet(this.elems.getText('timeTip'));
        this.currentNum = new TextGetSet(this.elems.getText('currentNum'));
        this.txtRecommendFight = new TextGetSet(this.elems.getText('txtRecommendFight'));
        this.bossList.onVirtualItemChange = delegate(this, this.onUpdateItem);
        this.multiBossList.onVirtualItemChange = delegate(this, this.onUpdateMultiItem);
        this.btnRefresh = new GameObjectGetSet(this.elems.getElement('btnRefresh'));
        let extraImg = this.elems.getElement('extraImg');

        this.btnBoss = new GameObjectGetSet(this.elems.getElement('btnBoss'));
        this.btnMultiBoss = new GameObjectGetSet(this.elems.getElement('btnMultiBoss'));
        this.buttonBossSel = new GameObjectGetSet(this.elems.getElement('buttonBossSel'));
        this.buttonMuiltBossSel = new GameObjectGetSet(this.elems.getElement('buttonMuiltBossSel'));
        this.multiTipMask = new GameObjectGetSet(this.elems.getElement('multiTipMask'));
        this.txtMultiTipMask = new TextGetSet(this.elems.getText('txtMultiTipMask'));
        let bossNode = this.elems.getElement('bossNode');
        this.personalBossHeartNode = new PersonalBossHeartNode();
        this.personalBossHeartNode.setComponent(bossNode, this);
        this.personalBossHeartNode.onClickAct = delegate(this, this.onClickBossHerte);
        this.txtRewardName = new TextGetSet(this.elems.getText('txtRewardName'));

        //判断怪物类型
        for (let j = 0; j < 3; j++) {
            this.bossType[j] = ElemFinder.findObject(extraImg, (j + 1).toString());
            Game.UIClickListener.Get(this.bossType[j]).onClick = delegate(this, this.onClickRule, j + 1);
        }

        this.drag = this.elems.getElement("drag");
        this.modelFourNode = this.elems.getElement("modelFourNode");
        this.rextModelFourNode = this.elems.getRectTransform("modelFourNode");

        for (let i = 0; i < this.multiBossNumber; i++) {
            let rect = ElemFinder.findObject(this.modelFourNode, i.toString());
            this.rectModelNodel[i] = rect;
        }
        let touch = Game.UITouchListener.Get(this.drag);
        touch.onTouchBegin = delegate(this, this.onTouchBegin);
        touch.onTouchEnd = delegate(this, this.onTouchEnd);
        // touch.onTouching = delegate(this, this.onTouching);
        let drug = Game.UIDragListener.Get(this.drag);
        drug.onDrag = delegate(this, this.onDrug);


    }

    private onTouchBegin() {
        if (!this.isMultiBoss) return;
        let delta = Game.UITouchListener.eventData.delta;
    }

    private onTouchEnd() {
        if (!this.isMultiBoss) return;

        //加一个返回的动画
        let nodeY = this.modelFourNode.transform.localRotation.eulerAngles.y;
        nodeY += 15;
        nodeY = nodeY % 360;
        if (nodeY < 0) {
            nodeY += 360;
        }
        let angle = 360 / this.multiBossNumber;
        let index = Math.floor(nodeY / angle);

        let targetY = index * angle + 15;
        let tween = Tween.TweenRotation.Begin(this.modelFourNode, 0.2, new UnityEngine.Vector3(0, targetY, 0));
        tween.onFinished = delegate(this, this.onTweenEnd, index);
        //330 -- 60  60 -- 150 150 -- 240  240 -- 330
        //345 -- 45
    }

    private onTweenEnd(index: number) {
        this.setFourBossRotate();
        //刷新奖励 战力
        let data: PersonalBossData[] = this.curMultiBossDatas;
        this.updateAwardList(data[index].config);
        let fig = uts.format("推荐战力：{0}", data[index].monsterCfg.m_iFightPoint);
        this.txtRecommendFight.text = TextFieldUtil.getColorText(fig, G.DataMgr.heroData.fight < data[index].monsterCfg.m_iFightPoint ? Color.RED : Color.GREEN);
    }
    private onDrug() {
        if (!this.isMultiBoss) return;

        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        let nodeY = this.modelFourNode.transform.localRotation.eulerAngles.y;
        let rotate = new UnityEngine.Vector3(0, -roatespeed * delta.x + nodeY, 0);
        Game.Tools.SetGameObjectRotation(this.modelFourNode, rotate);
        this.setFourBossRotate();
    }

    private setFourBossRotate() {
        for (let i = 0, count = this.rectModelNodel.length; i < count; i++) {
            Game.Tools.SetGameObjectRotation(this.rectModelNodel[i], G.getCacheV3(0, 160, 0));
        }
        // let v3 = G.cacheVec3;
        // uts.log("jackson..." + this.modelFourNode);
        // Game.Tools.GetRotation(this.rextModelFourNode, v3);
        // let nodeY = v3.y;

        let nodeY = this.modelFourNode.transform.localRotation.eulerAngles.y;
        nodeY += 15;
        nodeY = nodeY % 360;
        if (nodeY < 0) {
            nodeY += 360;
        }
        let angle = 360 / this.multiBossNumber;
        let index = Math.floor(nodeY / angle);
        this.curMultiBossData = this.curMultiBossDatas[index];
    }

    private onClickBossHerte(index: number) {
        let angle = 360 / this.multiBossNumber;
        let tween = Tween.TweenRotation.Begin(this.modelFourNode, 0.2, new UnityEngine.Vector3(0, index * angle + 15, 0));
        tween.onFinished = delegate(this, this.onTweenEnd, index);
    }

    protected initListeners() {
        this.addClickListener(this.btnGo.gameObject, this.onClickBtnGo);
        this.addClickListener(this.elems.getElement('btnRecord'), this.onClickBtnTip);
        this.addClickListener(this.btnAdd.gameObject, this.onClickAdd);
        this.addListClickListener(this.bossList, this.onClickBossList);
        this.addListClickListener(this.multiBossList, this.onClickMuiltBossList);
        this.addClickListener(this.btnRefresh.gameObject, this.onClickRefreshTime);
        this.addClickListener(this.btnBoss.gameObject, this.onClickBtnBoss);
        this.addClickListener(this.btnMultiBoss.gameObject, this.onClickBtnMultiBoss);
    }


    open(openBossId: number = 0) {
        this.openBossId = openBossId;
        if (G.GuideMgr.isGuiding(EnumGuide.PersonBossActive)) {
            let grider = G.GuideMgr.getCurrentGuider(EnumGuide.PersonBossActive);
            if (grider != null) {
                this.openBossId = G.DataMgr.pinstanceData.getTeachBossIdForIndex(grider.index);
                this.guideUsePinstanceDiff = grider.index;
            }
        }
        this.guidingBossId = this.openBossId;

        super.open();
    }

    /**
     * 增加次数
     */
    private onClickAdd() {
        if (!this.selectedBossData || !this.selectedBossData.data)
            return;
        if (this.isMultiBoss) {
            let ccount = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount;
            let maxcount = G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT);
            if (ccount == maxcount) {
                G.TipMgr.addMainFloatTip("当前点数已满");
                return;
            }
            let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, G.DataMgr.heroData.curVipLevel);
            let leftTime = extraTime - this.info.m_stPinExtraInfo.m_stPrivateBossList.m_ucMultiBuyRefreshTimes;
            let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_VALUE, G.DataMgr.heroData.curVipLevel);
            G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, cost, leftTime, delegate(this, this.goToBuyCountMulti));
        }
        else {
            let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_PERSONAL_BOSS_NUMBER, G.DataMgr.heroData.curVipLevel);
            let leftTime = extraTime - this.selectedBossData.data.m_ucVipBuyTimes;
            let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_PRIVATE_BOSS_BUY_COST, G.DataMgr.heroData.curVipLevel);
            G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_PERSONAL_BOSS_NUMBER, cost, leftTime, delegate(this, this.goToBuyCount));
        }
    }

    private goToBuyCountMulti(state: MessageBoxConst = 0) {
        if (MessageBoxConst.yes == state) {
            if (this.selectedBossData && this.selectedBossData.config) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_BUY_MUlTIBOSS_REFRESH_TIMES, Macros.PINSTANCE_ID_PRIVATE_BOSS, null, this.selectedBossData.config.m_ucNandu));
            } else {
                uts.log("该boss没有配置 ");
            }
        }
    }

    private goToBuyCount(state: MessageBoxConst = 0) {
        if (MessageBoxConst.yes == state) {
            if (this.selectedBossData && this.selectedBossData.config) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_VIP_BUY_TIMES, Macros.PINSTANCE_ID_PRIVATE_BOSS, null, this.selectedBossData.config.m_ucNandu));
            } else {
                uts.log("该boss没有配置 ");
            }
        }
    }

    private onClickBtnTip() {
        if (this.isMultiBoss)
            G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(469), '玩法说明');
        else
            G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(468), '玩法说明');

    }
    private onClickRule(index: number) {
        if (index == 1) {
            G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(475), '玩法说明');
        } else if (index == 2) {
            G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(474), '玩法说明');
        } else if (index == 3) {
            G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(476), '玩法说明');
        }
    }
    private onClickRefreshTime() {
        if (!this.selectedBossData || !this.selectedBossData.config)
            return;
        let vipLv = G.DataMgr.heroData.curVipLevel;
        let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_REFRESH_PRIVATEBOSS_COST, vipLv);
        let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_REFRESH_PRIVATEBOSS);
        let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_REFRESH_PRIVATEBOSS);
        let privilegeStrs = TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs);
        if (hasActive) {
            let info = uts.format("已激活{0}，是否使用{1}{2}或{3}{4}刷新Boss？",
                TextFieldUtil.getColorText(privilegeStrs, Color.GOLD),
                TextFieldUtil.getColorText(cost + "", Color.GREEN),
                KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_BIND_ID),
                TextFieldUtil.getColorText(Math.floor(cost / Constants.SummonBindRate) + "", Color.GREEN),
                KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_ID)
            );
            G.TipMgr.showConfirm(uts.format(info, TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.sendMsgToBuy, cost));
        } else {
            G.TipMgr.showConfirm(uts.format('激活{0}可使用开启此功能', TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
        }
    }
    private onGoToVipPanel(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }
    private sendMsgToBuy(stage: MessageBoxConst, isCheckSelected: boolean, cost: number) {
        if (MessageBoxConst.yes == stage) {
            // 检查货币是否足够     
            if (G.ActionHandler.getMoneyIsOk(cost)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_REFRESH_PRIVATE_BOSS, Macros.PINSTANCE_ID_PRIVATE_BOSS, null, this.selectedBossData.config.m_ucNandu));
            }
        }
    }
    protected onOpen() {
        this.firstOpen = true;
        // if (this.openBossId == 0)
        //     this.isMultiBoss = false;
        //this.bossView = G.Uimgr.getForm<BossView>(BossView);
        this.bossList.SetSlideAppearRefresh();
        this.multiBossList.SetSlideAppearRefresh();
        this.updateView();
        this.addTimer("refresh", 1000, 0, delegate(this, this.onTick));
        if (G.GuideMgr.isGuiding(EnumGuide.PersonBossActive)) {
            this.btnGo.SetActive(true);
            this.gotext.text = '马上挑战';
            this.btnGo.grey = false;
        }
        G.GuideMgr.processGuideNext(EnumGuide.PersonBossActive, EnumGuide.PersonBossActive_ClickAction);
    }

    protected onClose() {
        for (let i = 0, len = this.inititems.length; i < len; i++) {
            this.inititems[i].dispose();
        }
        this.inititems = [];
        this.openBossId = 0;
        this.bossList.Count = 0;
        this.multiBossList.Count = 0;
        this.dataList = [];
        this.multiDataList = [];
    }

    private onClickBtnBoss() {

        if (!this.isMultiBoss) return;

        this.isMultiBoss = false;
        this.firstOpen = true;
        this.updateView();
    }

    private onClickBtnMultiBoss() {
        if (this.isMultiBoss) return;

        this.isMultiBoss = true;
        this.firstOpen = true;
        this.updateView();
    }
    private onUpdateItem(listitem: ListItem) {
        let index = listitem._index;
        let data = listitem.data.data as PersonalBossListItem;
        if (!data) {
            data = new PersonalBossListItem();
            data.setComponent(listitem.gameObject, this);
            listitem.data.data = data;
            this.inititems.push(data);
        }
        data.update(this.dataList[index]);
    }

    private onUpdateMultiItem(listitem: ListItem) {
        let index = listitem._index;
        let data = listitem.data.data as MultiplayerBossListItem;
        if (!data) {
            data = new MultiplayerBossListItem();
            data.setComponent(listitem.gameObject);
            listitem.data.data = data;
            this.multiInititems.push(data);
        }
        data.update(this.multiDataList[index], index);
    }

    private onClickBtnGo() {
        if (G.GuideMgr.isGuiding(EnumGuide.PersonBossActive)) {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(PinstanceData.PersonBossGuidePinId, this.guideUsePinstanceDiff);
            G.GuideMgr.processGuideNext(EnumGuide.PersonBossActive, EnumGuide.PersonBossActive_EnterPinstance);
            G.ViewCacher.functionGuideView.setMaskImageColor();
            G.Uimgr.closeForm(BossView);
            return;
        }
        if (this.selectedBossData == null) {
            return;
        }

        if (this.selectedBossData.config.m_iFightLimit > G.DataMgr.heroData.fight /**&& !this.btnGo.grey */) {
            G.TipMgr.addMainFloatTip(uts.format("战力达到{0}可挑战", this.selectedBossData.config.m_iFightLimit));
            return;
        }
        //等级限制
        let heroLv = G.DataMgr.heroData.level;
        if (this.selectedBossData.config.m_iLevel > heroLv || heroLv > this.selectedBossData.config.m_iLevelUp) {
            G.TipMgr.addMainFloatTip("等级不符");
            return;
        }

        if (this.selectedBossData.monsterCfg.m_iFightPoint > G.DataMgr.heroData.fight && !this.isMultiBoss) {
            //提示
            G.TipMgr.showConfirm('当前战力低于推荐通关战力，副本难度较大，是否继续挑战？', ConfirmCheck.noCheck, '是|否', delegate(this, this.tryEnterPinstance));
        }
        else {
            this.tryEnterPinstance(MessageBoxConst.yes, false);
        }
    }

    private tryEnterPinstance(state: number, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == state) {
            let data = this.selectedBossData;
            let config = data.config;
            //显示次数提示
            if (this.isMultiBoss && this.info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount <= 0) {
                //消耗钻石XX重置点数
                let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, G.DataMgr.heroData.curVipLevel);
                let leftTime = extraTime - this.info.m_stPinExtraInfo.m_stPrivateBossList.m_ucMultiBuyRefreshTimes;
                let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_VALUE, G.DataMgr.heroData.curVipLevel);
                if (leftTime == 0) {
                    this.goToBuyCountMultiStar(MessageBoxConst.no, config);
                } else {
                    G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, cost, leftTime,
                        delegate(this, this.goToBuyCountMultiStar, MessageBoxConst.yes, config),
                        delegate(this, this.goToBuyCountMultiStar, MessageBoxConst.no, config));
                }
            }
            else {
                //多人boss加提示 第一层的取消提示
                if (config.m_iIMonsterType != KeyWord.GROUP_PRIVATE_BOSS && config.m_iLevel != this.multiBossMinLevel) {
                    let info = '即将进入PVP场景，可能受到来自其他玩家的攻击，是否继续';
                    if (PinstanceData.isCheckSelected) {
                        this.confirm(MessageBoxConst.yes, true);
                    } else {
                        G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.confirm));
                    }
                } else {
                    this.gointoScene();
                }
            }
        }
    }

    private goToBuyCountMultiStar(state: number, config: GameConfig.PrivatBossCfgM) {
        if (MessageBoxConst.yes == state) {
            this.goToBuyCountMulti();
        }
        else if (MessageBoxConst.no == state) {
            if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES)) {
                G.TipMgr.showConfirm("当前奖励次数为0，击杀BOSS无法获得奖励", ConfirmCheck.noCheck, '进入副本|取消', delegate(this, this.awardConfirm, config));
            } else {
                G.TipMgr.showConfirm("当前奖励次数为0，击杀BOSS无法获得奖励(黄金VIP可重置所有点数)", ConfirmCheck.noCheck, '进入副本|取消', delegate(this, this.awardConfirm, config));
            }

        }
    }

    private confirm(state: number, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == state) {
            this.gointoScene();
            PinstanceData.isCheckSelected = isCheckSelected;
        }
    }

    private gointoScene() {
        if (this.info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount <= 0 && this.selectedBossData.config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS) {
            G.TipMgr.addMainFloatTip("总挑战次数不足");
            return;
        }

        let limit = this.selectedBossData.config.m_iTimeLimit;
        let vipnum = this.selectedBossData.data.m_ucVipBuyTimes;
        if (limit > 0 && this.selectedBossData.data.m_ucFightCount >= limit + vipnum) {
            G.TipMgr.addMainFloatTip("当前BOSS挑战次数已经用尽，请选择其它BOSS挑战");
            return;
        }
        let refreshTime = this.selectedBossData.data.m_uiBossRefreshTime;
        //let leftSecond = refreshTime - Math.ceil(G.SyncTime.getCurrentTime() / 1000);
        // if (refreshTime != 0 && leftSecond > 0) {
        //     G.TipMgr.addMainFloatTip("当前BOSS未刷新，请等待");
        //     return;
        // }
        if (this.btnGo.grey) {
            return;
        }
        if (this.selectedBossData.config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS) {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_PRIVATE_BOSS, this.selectedBossData.data.m_iNandu);
        }
        else {
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_MULTIPLAYER_BOSS, this.selectedBossData.config.m_MonsterID);
        }

        G.Uimgr.closeForm(BossView);
    }

    private awardConfirm(state: number, isCheckSelected: boolean, config: GameConfig.PrivatBossCfgM) {
        if (MessageBoxConst.yes == state) {
            //多人boss加提示 第一层的取消提示
            if (config.m_iIMonsterType != KeyWord.GROUP_PRIVATE_BOSS && config.m_iLevel != this.multiBossMinLevel) {
                let info = '即将进入PVP场景，可能受到来自其他玩家的攻击，是否继续';
                if (PinstanceData.isCheckSelected) {
                    this.confirm(MessageBoxConst.yes, true);
                } else {
                    G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.confirm));
                }
            } else {
                this.gointoScene();
            }
        }
    }

    private onClickBossList(index: number) {
        this.curSelected = index;
        this.selectedBossData = this.dataList[index];
        // this.openBossId = this.selectedBossData.config.m_MonsterID;
        G.AudioMgr.playBtnClickSound();
        this.updateSelected();
    }

    private onClickMuiltBossList(index: number) {
        this.curSelected = index;
        this.selectedBossData = this.multiDataList[index];
        // this.openBossId = this.selectedBossData.config.m_MonsterID;
        G.AudioMgr.playBtnClickSound();
        this.updateSelected();
        //模型位置归零
        Game.Tools.SetGameObjectRotation(this.modelFourNode, new UnityEngine.Vector3(0, 15, 0));
        this.setFourBossRotate();
    }

    updateView() {
        let pinstanceData = G.DataMgr.pinstanceData;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        if (info == null) {
            uts.log("数据尚未拉取到本地，等待");
            return;
        }
        this.info = info;
        let selectIndex = 0;
        let lv = G.DataMgr.heroData.level;
        let currentTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
        this.refreshData();
        if (this.openBossId > 0) {
            //有默认选择
            let len = this.bossDatas.length;
            let data: PersonalBossData = null;
            for (let i = 0; i < len; i++) {
                if (this.bossDatas[i].config.m_MonsterID == this.openBossId) {
                    data = this.bossDatas[i];
                    break;
                }
            }
            if (data != null) {
                if (data.config.m_iIMonsterType != KeyWord.GROUP_MULTIPLAYER_BOSS) {
                    //单人boss
                    selectIndex = data.data.m_iNandu - 1;
                    this.isMultiBoss = false;
                }
                else {
                    //多人boss
                    for (let i = 0, count = this.multiDataList.length; i < count; i++) {
                        if (this.multiDataList[i].config.m_iLevel == data.config.m_iLevel) {
                            selectIndex = i;
                            this.isMultiBoss = true;
                            break;
                        }
                    }
                }
            }
            this.openBossId = 0;
        }
        else {
            if (!this.isMultiBoss) {
                //单人 默认选择
                let len = this.dataList.length;
                let lastIndex = 0;
                for (let i = 0; i < len; i++) {
                    let data = this.dataList[i];
                    let limit = false;
                    if (data.config.m_iTimeLimit > 0 && data.data.m_ucFightCount >= data.config.m_iTimeLimit) {
                        limit = true;
                    }
                    // //选择一个等级最近的
                    // if (data.config.m_iLevel <= lv && !limit) {
                    //     if ((currentTime - data.data.m_uiBossRefreshTime) >= 0)
                    //         selectIndex = i;
                    // }
                    //选择一个推荐战力最近的
                    if (!limit && (currentTime - data.data.m_uiBossRefreshTime) >= 0 && data.config.m_iLevel <= lv && data.config.m_iLevelUp >= lv) {
                        //满足可以打的条件
                        if (data.monsterCfg.m_iFightPoint <= G.DataMgr.heroData.fight)
                            selectIndex = i;
                        if (lastIndex == 0)
                            lastIndex = i;
                    }
                    // if (data.monsterCfg.m_iFightPoint <= G.DataMgr.heroData.fight && !limit) {
                    //     if ((currentTime - data.data.m_uiBossRefreshTime) >= 0)
                    //         selectIndex = i;
                    // }
                }
                if (selectIndex == 0)
                    selectIndex = lastIndex;
            }
            else {
                //多人 默认选择
                let lastIndex = 0;
                let len = this.multiDataList.length;
                for (let i = 0; i < len; i++) {
                    let data = this.multiDataList[i];
                    let limit = false;
                    if (data.config.m_iTimeLimit > 0 && data.data.m_ucFightCount >= data.config.m_iTimeLimit) {
                        limit = true;
                    }
                    //选择一个推荐战力最近的
                    if (!limit && data.config.m_iLevel <= lv && data.config.m_iLevelUp >= lv) {
                        if (lastIndex == 0)
                            lastIndex = i;
                        //满足可以打的条件
                        if (data.monsterCfg.m_iFightPoint <= G.DataMgr.heroData.fight && data.config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
                            let datas = data.personalBossData;
                            for (let j = 0, count = datas.length; j < count; j++) {
                                let itemdata = datas[j];
                                if ((currentTime - itemdata.data.m_uiBossRefreshTime) >= 0 && data.monsterCfg.m_iFightPoint <= G.DataMgr.heroData.fight) {
                                    selectIndex = i;
                                    break;
                                }
                            }
                        }
                    }
                    if (selectIndex == 0)
                        selectIndex = lastIndex;

                    // //选择一个等级最近的
                    // if (data.config.m_iLevel <= lv && !limit) {
                    //     if ((currentTime - data.data.m_uiBossRefreshTime) >= 0)
                    //         selectIndex = i;

                    //     //多人boss需要全部判断
                    //     if (data.config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
                    //         let datas = data.personalBossData;
                    //         for (let j = 0, count = datas.length; j < count; j++) {
                    //             let itemdata = datas[j];
                    //             if ((currentTime - itemdata.data.m_uiBossRefreshTime) >= 0) {
                    //                 selectIndex = i;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        }
        this.curSelected = selectIndex;

        this.bossList.SetActive(!this.isMultiBoss);
        this.multiBossList.SetActive(this.isMultiBoss);
        this.buttonBossSel.SetActive(!this.isMultiBoss);
        this.buttonMuiltBossSel.SetActive(this.isMultiBoss);
        if (!this.isMultiBoss) {
            //设置按钮
            if (this.firstOpen) {
                this.bossList.Count = this.dataList.length;
                this.selectedBossData = this.dataList[selectIndex];
                this.bossList.Selected = selectIndex;
                if (!G.GuideMgr.isGuiding(EnumGuide.PersonBossActive)) {
                    this.bossList.ScrollByAxialRow(selectIndex - 0.5);
                }
                this.firstOpen = false;
                Game.Tools.SetGameObjectRotation(this.modelFourNode, new UnityEngine.Vector3(0, 15, 0));
            }
            // this.bossList.Refresh();
        }
        else {
            if (this.firstOpen) {
                this.multiBossList.Count = this.multiDataList.length;
                this.selectedBossData = this.multiDataList[selectIndex];
                this.multiBossList.Selected = selectIndex;
                this.multiBossList.ScrollByAxialRow(selectIndex - 0.5);
                this.firstOpen = false;
            }
            // this.multiBossList.Refresh();
        }
        this.updateSelected();
        this.updateButtonTipMask();

        if (this.isMultiBoss)
            this.txtVipDescrite.text = "黄金特权可重置点数";
        else
            this.txtVipDescrite.text = "黄金特权可增加次数";
    }

    private refreshData() {
        let pinstanceData = G.DataMgr.pinstanceData;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        if (info == null) {
            uts.log("数据尚未拉取到本地，等待");
            return;
        }
        this.info = info;
        let group = info.m_stPinExtraInfo.m_stPrivateBossList.m_astBossLimitInfo;
        let len = info.m_stPinExtraInfo.m_stPrivateBossList.m_ucCount;
        if (this.bossDatas.length == 0) {
            for (let i = 0; i < len; i++) {
                let data = new PersonalBossData();
                let g = group[i];
                data.data = g;
                data.config = pinstanceData.privateBossConfigs[g.m_iNandu - 1];
                if (data.config == null) continue;
                data.monsterCfg = MonsterData.getMonsterConfig(data.config.m_MonsterID);
                if (data.config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
                    if (data.config.m_iLevel < this.multiBossMinLevel)
                        this.multiBossMinLevel = data.config.m_iLevel;
                }
                this.bossDatas.push(data);
            }
            this.bossDatas.sort(PersonalBossData.sortFunc);
        }
        else {
            for (let i = 0; i < len; i++) {
                let data = this.bossDatas[i];
                if (data == null) continue;
                if (data.data == null) continue;
                data.data = group[data.data.m_iNandu - 1];
            }
        }
        this.neatenData();
    }

    private neatenData() {
        //把个人的和多人的分开
        let isSkip = false;
        let isMultiSkip = false;
        this.dataList = [];
        this.multiDataList = [];
        let showCount = 0;
        for (let i = 0, count = this.bossDatas.length; i < count; i++) {
            let data = this.bossDatas[i];
            if (data.config.m_iIMonsterType != KeyWord.GROUP_MULTIPLAYER_BOSS) {
                //进一步筛选数据 只保留可挑战的+未开启的一个
                //取消个人的筛选预览
                // if (data.config.m_iLevelUp < G.DataMgr.heroData.level) continue;
                // if (showCount < 4)
                this.dataList.push(data);
                if (data.config.m_iLevel > G.DataMgr.heroData.level) {
                    showCount++;
                }
            }
            else {
                //多人boss
                let ishavedata = false;
                for (let j = 0, count = this.multiDataList.length; j < count; j++) {
                    let itemdata = this.multiDataList[j];
                    if (itemdata.config.m_iLevel == data.config.m_iLevel) {
                        itemdata.personalBossData.push(data);
                        ishavedata = true;
                        break;
                    }
                }
                if (ishavedata == false) {
                    data.personalBossData = [];
                    //取消多人的筛选预览
                    // if (data.config.m_iLevelUp < G.DataMgr.heroData.level) continue;
                    // if (!isMultiSkip)
                    this.multiDataList.push(data);
                    if (data.config.m_iLevel > G.DataMgr.heroData.level) {
                        isMultiSkip = true;
                    }
                    // this.multiDataList.push(data);
                }
            }
        }
    }

    private updateSelected() {
        if (this.selectedBossData == null) {
            return;
        }
        let data = this.selectedBossData;
        let config = data.config;
        let monsterCfg = data.monsterCfg;
        let isPrivateBoss = config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS;
        let isNotLimit = this.selectedBossData.config.m_iTimeLimit > 0;
        this.bossType[0].SetActive(isPrivateBoss && isNotLimit);
        this.bossType[1].SetActive(isPrivateBoss && !isNotLimit);
        this.bossType[2].SetActive(!isPrivateBoss);

        let times = this.selectedBossData.data.m_ucFightCount;
        let max = this.selectedBossData.config.m_iTimeLimit;

        let leftTime = max + this.selectedBossData.data.m_ucVipBuyTimes - times;
        let heroLv = G.DataMgr.heroData.level;

        //加载模型特殊处理
        if (config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
            //多人boss
            this.modelFourNode.SetActive(true);
            this.modelRoot.SetActive(false);
            this.curMultiBossDatas = [];
            this.curMultiBossDatas.push(data);
            for (let i = 0, count = data.personalBossData.length; i < count; i++) {
                this.curMultiBossDatas.push(data.personalBossData[i]);
            }

            for (let i = 0, count = this.curMultiBossDatas.length; i < count; i++) {
                let item = this.curMultiBossDatas[i];
                let node = this.rectModelNodel[i];
                if (node == null) continue;
                Game.Tools.SetGameObjectLocalScale(node, item.monsterCfg.m_ucUnitScale, item.monsterCfg.m_ucUnitScale, item.monsterCfg.m_ucUnitScale);
                G.ResourceMgr.loadModel(node, UnitUtil.getRealMonsterType(item.monsterCfg.m_ucModelFolder), item.monsterCfg.m_szModelID, this.sortingOrder, true);
            }
            this.setFourBossRotate();
        }
        else {
            //个人boss
            this.modelFourNode.SetActive(false);
            this.modelRoot.SetActive(true);
            Game.Tools.SetGameObjectLocalScale(this.modelRoot, monsterCfg.m_ucUnitScale, monsterCfg.m_ucUnitScale, monsterCfg.m_ucUnitScale);
            G.ResourceMgr.loadModel(this.modelCtn, UnitUtil.getRealMonsterType(monsterCfg.m_ucModelFolder), monsterCfg.m_szModelID, this.sortingOrder, true);
        }

        // 奖励列表 分开来 魂骨放一起，其他放一起
        this.updateAwardList(config);

        // 判断boss等级
        if (config.m_iLevel > heroLv) {
            this.gotext.text = uts.format('{0}级开放', config.m_iLevel);
            this.btnGo.grey = true;
        }// 判断玩家可进入等级是否超过等级上限
        else if (heroLv > config.m_iLevelUp || this.selectedBossData.config.m_iFightLimit > G.DataMgr.heroData.fight) {
            this.gotext.text = '无法进入';
            this.btnGo.grey = true;
        }
        else {
            this.gotext.text = '马上挑战';
            this.btnGo.grey = false;
        }

        // 判断boss战力
        if (this.selectedBossData.config.m_iFightLimit > G.DataMgr.heroData.fight) {
            this.godPower.text = uts.format('推荐战力：{0}', TextFieldUtil.getColorText(config.m_iFightLimit.toString(), "FF0000FF", 24, false));
        } else {
            this.godPower.text = uts.format('推荐战力：{0}', config.m_iFightLimit);
        }

        let fig = uts.format("推荐战力：{0}", monsterCfg.m_iFightPoint);
        this.txtRecommendFight.text = TextFieldUtil.getColorText(fig, G.DataMgr.heroData.fight < monsterCfg.m_iFightPoint ? Color.RED : Color.GREEN);
        if (this.isMultiBoss) {
            Game.Tools.SetGameObjectLocalPosition(this.txtRecommendFight.gameObject.gameObject, G.getCacheV3(-12, -174, 0));
        }
        else {
            Game.Tools.SetGameObjectLocalPosition(this.txtRecommendFight.gameObject.gameObject, G.getCacheV3(-12, -250, 0));
        }

        if (config.m_iIMonsterType == KeyWord.GROUP_MULTIPLAYER_BOSS) {
            //多人boss 隐藏次数
            this.personalBossHeartNode.open();
            this.personalBossHeartNode.update(data);

            this.currentNum.gameObject.SetActive(false);

            this.textName.text = uts.format(config.m_sAreaName);// monsterCfg.m_szMonsterName;
            this.textLv.text = uts.format("{0}级", config.m_iLevel.toString());

            let maxcount = G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT);
            let ccount = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount;
            this.countTip.text = uts.format("奖励点数: {0}/{1}", TextFieldUtil.getColorText(ccount.toString(), ccount == 0 ? Color.RED : Color.GREEN), maxcount);
            if (ccount == maxcount) {
                this.timeTip.text = "(下次恢复----)";
                this.specialshowtimetip = true;
            }
            else {
                this.specialshowtimetip = false;
                this.onTick();
            }
        }
        else {
            // 更新名字
            this.textName.text = monsterCfg.m_szMonsterName;
            this.textLv.text = uts.format("{0}级", config.m_iLevel.toString());

            this.personalBossHeartNode.close();

            this.currentNum.gameObject.SetActive(true);
            this.currentNum.text = uts.format('本层挑战次数: {0}', TextFieldUtil.getColorText(leftTime + "", leftTime > 0 ? Color.GREEN : Color.RED));
            this.currentNum.gameObject.SetActive(max > 0 && heroLv <= config.m_iLevelUp);

            let maxcount = G.DataMgr.constData.getValueById(KeyWord.PARAM_PRIVATE_BOSS_LIMIT_COUNT);
            let ccount = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount;
            this.countTip.text = uts.format("总挑战次数: {0}/{1}", TextFieldUtil.getColorText(ccount.toString(), Color.GREEN), maxcount);
            if (ccount == maxcount) {
                this.timeTip.text = "(下次恢复----)";
                this.specialshowtimetip = true;
            }
            else {
                this.specialshowtimetip = false;
                this.onTick();
            }
        }


        this.updateBtnStatus();
    }

    private updateButtonTipMask() {
        let ccount = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount;
        this.multiTipMask.SetActive(ccount >= 9 && G.DataMgr.heroData.level >= this.multiBossMinLevel);
        this.txtMultiTipMask.gameObject.SetActive(false);
        this.txtMultiTipMask.text = ccount.toString();
    }
    private onTick() {
        if (this.specialshowtimetip) {
            return;
        }
        //更新倒计时
        let leftSecond: number = 0;
        if (this.info) {
            if (this.isMultiBoss)
                leftSecond = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_uiMultiNextRefreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
            else
                leftSecond = this.info.m_stPinExtraInfo.m_stPrivateBossList.m_uiNextRefreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);


            if (leftSecond < 0) {
                leftSecond = 0;
            }
        }
        this.timeTip.text = uts.format("(下次恢复{0})", DataFormatter.second2mmss(leftSecond));
    }

    private updateAwardList(config: GameConfig.PrivatBossCfgM) {
        // 奖励列表 分开来 魂骨放一起，其他放一起
        let newArr = [];
        let newHunguArr: number[] = [];
        let newHunguProf: number[] = [];
        let hunguArr: { "id": number, "prof": number }[] = [];
        let profId = G.DataMgr.heroData.profession;
        for (let i = 0; i < config.m_iItemID.length; i++) {
            // if (config.m_iProf[i] != profId && config.m_iProf[i] != 0) {
            //     continue;
            // }
            if (GameIDUtil.isHunguEquipID(config.m_iItemID[i])) {
                newHunguArr.push(config.m_iItemID[i]);
                newHunguProf.push(config.m_iProf[i]);
            }
            else
                newArr.push(config.m_iItemID[i]);
        }
        for (let i = 0, count = newHunguArr.length; i < count; i++) {
            hunguArr[i] = {
                "id": newHunguArr[i],
                "prof": newHunguProf[i]
            }
        }
        hunguArr.sort(this.rewardSort);
        let iconItem: IconItem;
        this.rewardList.Count = newArr.length;
        for (let i: number = 0; i < newArr.length; i++) {
            let item = this.rewardList.GetItem(i);
            if (item.data.iconitem) {
                iconItem = item.data.iconitem;
            } else {
                iconItem = item.data.iconitem = new IconItem()
                iconItem.arrowType = ArrowType.personalHungu;
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(newArr[i]);
            iconItem.updateIcon();
        }

        this.rewardHunguList.Count = hunguArr.length;
        for (let i: number = 0; i < hunguArr.length; i++) {
            let item = this.rewardHunguList.GetItem(i);
            if (item.data.iconitem) {
                iconItem = item.data.iconitem;
            } else {
                iconItem = item.data.iconitem = new IconItem()
                iconItem.arrowType = ArrowType.personalHungu;
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(hunguArr[i].id);
            iconItem.updateIcon();
        }

        //魂骨标题名字
        let firstHunguId = newHunguArr[0];
        let hungudata = ThingData.getThingConfig(firstHunguId);
        if (hungudata)
            this.txtRewardName.text = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, hungudata.m_iDropLevel);
        else
            this.txtRewardName.text = "魂骨装备";
    }

    updateBtnStatus() {
        if (!this.selectedBossData)
            return;
        let heroLv = G.DataMgr.heroData.level;
        let config = this.selectedBossData.config;
        let refreshTime = this.selectedBossData.data.m_uiBossRefreshTime;
        let leftSecond = refreshTime - Math.ceil(G.SyncTime.getCurrentTime() / 1000);
        let showRefresh = this.selectedBossData.config.m_iIMonsterType == KeyWord.GROUP_PRIVATE_BOSS
            && heroLv >= config.m_iLevel
            && heroLv <= config.m_iLevelUp
            && refreshTime != 0
            && leftSecond > 0;
        this.btnRefresh.SetActive(showRefresh);
        this.btnGo.SetActive(!showRefresh);
    }

    private rewardSort(a: { "id": number, "prof": number }, b: { "id": number, "prof": number }): number {
        if (a.prof == b.prof) {
            return -1;
        }
        else {
            if (a.prof == G.DataMgr.heroData.profession)
                return -1;
            else if (a.prof == 0)
                return 0;
            else
                return 1;
        }
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.PersonBossActive_EnterPinstance == step) {
            this.onClickBtnGo();
            return true;
        }
        return false;
    }
}