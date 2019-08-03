import { EnumGuide, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { MonsterData } from 'System/data/MonsterData';
import { PinstanceData } from 'System/data/PinstanceData';
import { QuestData } from 'System/data/QuestData';
import { ThingData } from 'System/data/thing/ThingData';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { GameObjectGetSet, TextGetSet, UILayer } from "System/uilib/CommonForm";
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { ElemFinder } from 'System/uilib/UiUtility';
import { DataFormatter } from 'System/utils/DataFormatter';
import { UIUtils } from 'System/utils/UIUtils';
import { HunLiData } from '../data/hunli/HunLiData';
import { PropertyListNode } from '../ItemPanels/PropertyItemNode';
import { TitleItemNode } from '../ItemPanels/TitleItemNode';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { Color } from '../utils/ColorUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { HunLiView } from './HunLiView';
import { ConfirmCheck, MessageBoxConst } from '../tip/TipManager';

/**单个条件 */
class ConditionItem extends ListItemCtrl {
    private index: number;
    private conditionCfg: GameConfig.HunLiConditionClient;
    private canGetReward: boolean = false;

    private txtName: UnityEngine.UI.Text;
    private txtProgress: UnityEngine.UI.Text;
    private imgCompleted: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private btnYellow: UnityEngine.GameObject;
    private tipMark: GameObjectGetSet;
    private iconItem: IconItem;
    private timer: Game.Timer = null;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject, index: number) {
        let iconRoot = ElemFinder.findObject(go, "icon");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, iconRoot);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtProgress = ElemFinder.findText(go, "txtProgress");
        this.imgCompleted = ElemFinder.findObject(go, "imgCompleted");
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        this.btnYellow = ElemFinder.findObject(go, "btnGo/btnYellow");
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onBtnGo);

        this.btnGo.SetActive(false);
        this.imgCompleted.SetActive(false);

        this.index = index;
    }

    /**
     * 刷新条件界面（单个条件）
     * @param config 条件数据
     * @param condition 奖励条件
     */
    update(config: GameConfig.HunLiConditionClient, condition: Protocol.HunLiConditionOne, seleindex: number, requireLevel: number) {
        this.conditionCfg = config;
        //图标
        this.iconItem.updateById(config.m_iRewardID, config.m_iRewardNum);
        this.iconItem.updateIcon();
        //设置右侧状态
        //只处理当前试炼数据
        let hunlidata = G.DataMgr.hunliData;
        let nextIndex = hunlidata.getNextIndex() - 1;
        if (seleindex == nextIndex) {
            //文字
            let info = this.getConditionText(condition);
            this.txtName.text = info[0];
            this.txtProgress.text = info[1] + info[2];
            //当前的
            this.imgCompleted.SetActive(false);
            this.btnGo.SetActive(true);
            //达成条件转换
            let condNumber = config.m_iValue2;
            let isfight = false;
            switch (this.conditionCfg.m_ucType) {
                case KeyWord.HUNLI_CONDITION_PIN_PASS:
                    //判断副本对应的boss战力是否符合
                    let data = PinstanceData.getDiffBonusData(this.conditionCfg.m_iValue1, this.conditionCfg.m_iValue2);
                    if (data.m_iFightPower <= G.DataMgr.heroData.fight && requireLevel <= G.DataMgr.heroData.level) {
                        isfight = true;
                    }
                    condNumber = 1;
                    break;

                case KeyWord.HUNLI_CONDITION_KILL_BOSS:
                    condNumber = this.conditionCfg.m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_SUIT_COLLECT:
                    condNumber = this.conditionCfg.m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_HUNGU_EQUIP:
                    condNumber = this.conditionCfg.m_iValue3;
                    break;
            }
            //提示的显示转换
            if (condition == null || condition.m_iFinishParam < condNumber) {
                this.btnYellow.SetActive(true);
                this.canGetReward = false;
                this.tipMark.SetActive(isfight);
            }
            else if (condition.m_iFinishParam >= condNumber) {
                //0未领  2已领
                if (condition.m_ucRewardGet == 0) {
                    this.btnYellow.SetActive(false);
                    this.canGetReward = true;
                    this.tipMark.SetActive(true);
                }
                else {
                    this.btnGo.SetActive(false);
                    this.imgCompleted.SetActive(true);
                    this.tipMark.SetActive(false);
                }
            }

        }
        else if (nextIndex < seleindex) {
            //未做的
            //文字
            let info = this.getConditionText(condition);
            this.txtName.text = info[0];
            this.txtProgress.text = info[1];
            this.imgCompleted.SetActive(false);
            this.btnGo.SetActive(true);
            this.btnYellow.SetActive(true);
            this.canGetReward = false;
            this.tipMark.SetActive(false);
        }
        else if (nextIndex > seleindex) {
            //已完成
            //文字
            let info = this.getConditionText(condition);
            this.txtName.text = info[0];
            this.txtProgress.text = info[1];
            //提示
            this.btnGo.SetActive(false);
            this.imgCompleted.SetActive(true);
            this.tipMark.SetActive(false);
        }
    }

    /**按钮（获取/领取） */
    onBtnGo() {
        let hunlidata = G.DataMgr.hunliData;
        if (this.canGetReward) {
            //领取
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunliRewardRequest(hunlidata.getNextHunliLevel(), hunlidata.getNextHunliSubLevel(), this.index));
        } else {
            if (this.conditionCfg.m_ucType == KeyWord.HUNLI_CONDITION_PIN_PASS && this.conditionCfg.m_iValue1 == 300063) {
                let data = PinstanceData.getDiffBonusData(this.conditionCfg.m_iValue1, this.conditionCfg.m_iValue2);
                if (data.m_iFightPower > G.DataMgr.heroData.fight) {
                    G.TipMgr.showConfirm(uts.format("您当前战力过低，还差{0}到达推荐通关战力，副本难度较大，是否继续挑战？", TextFieldUtil.getColorText((data.m_iFightPower - G.DataMgr.heroData.fight).toString(), Color.RED)),
                        ConfirmCheck.noCheck, '是|否', (stage: number) => {
                            if (stage == MessageBoxConst.yes) {
                                this.enterPinstance();
                            }
                        });
                }
                else {
                    this.enterPinstance();
                }
            }
            else {
                //跳转
                let linkID = this.conditionCfg.m_iLink;
                let diff = this.conditionCfg.m_iValue2;
                G.ActionHandler.executeFunction(linkID, 0, 0, diff);
            }
        }
        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_ClickActivate1);
    }

    private enterPinstance() {
        let hunliview = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (hunliview != null && hunliview.isOpened)
            hunliview.close();
        if (G.DataMgr.sceneData.curPinstanceID != Macros.PINSTANCE_ID_HLSL) {
            G.ViewCacher.mainView.showDenseFog(0.8);
            let config = PinstanceData.getDiffBonusData(Macros.PINSTANCE_ID_HLSL, this.conditionCfg.m_iValue2);
            if (G.DataMgr.heroData.level < config.m_iOpenLevel) {//等级不够
                G.TipMgr.addMainFloatTip(uts.format('等级达到{0}级可挑战', config.m_iOpenLevel));
            } else {
                G.DataMgr.pinstanceData.pinstanceTitle = config.m_szName;
                this.timer = new Game.Timer("timer", 800, 1, delegate(this, this.sendEnterPinstance));
            }
        } else {
            G.TipMgr.addMainFloatTip(uts.format('您已经在副本中了' ));
        }
     
    }

    private sendEnterPinstance() {
        this.timer.Stop();
        //发协议
        G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_HLSL, this.conditionCfg.m_iValue2);
    }

    /**
     * 获取文字显示
     * @param info
     */
    private getConditionText(info: Protocol.HunLiConditionOne): [string, string, string] {
        let str: [string, string, string] = ["", "", ""];
        switch (this.conditionCfg.m_ucType) {
            case KeyWord.HUNLI_CONDITION_PIN_PASS:
                if (this.conditionCfg.m_iValue1 == 300063) {
                    str[0] = uts.format("成功挑战");
                    str[1] = uts.format("{0} ", PinstanceData.getDiffBonusData(this.conditionCfg.m_iValue1, this.conditionCfg.m_iValue2).m_szName);
                    //str[2] = this.conditionCfg.m_iValue2.toString();//uts.format("{0}/1", info != null ? (info.m_iFinishParam == 0 ? 0 : 1) : 0);
                }
                else {
                    str[0] = uts.format("通关");
                    str[1] = uts.format("{0} ", PinstanceData.getDiffBonusData(this.conditionCfg.m_iValue1, this.conditionCfg.m_iValue2).m_szName);
                    str[2] = this.conditionCfg.m_iValue2.toString();//uts.format("{0}/1", info != null ? (info.m_iFinishParam == 0 ? 0 : 1) : 0);
                }
                break;
            case KeyWord.HUNLI_CONDITION_KILL_BOSS:
                str[0] = uts.format("协助击杀多人BOSS");
                str[1] = uts.format("{0} ", MonsterData.getMonsterConfig(this.conditionCfg.m_iValue1).m_szMonsterName);
                str[2] = uts.format("{0}/{1}", info != null ? (info.m_iFinishParam == 0 ? 0 : this.conditionCfg.m_iValue2) : 0, this.conditionCfg.m_iValue2);
                break;
            case KeyWord.HUNLI_CONDITION_SUIT_COLLECT:
                str[0] = uts.format("收集套装");
                str[1] = uts.format("{0}阶套装 ", DataFormatter.toHanNumStr(this.conditionCfg.m_iValue1));
                str[2] = uts.format("{0}/{1}", this.getEquipNum(this.conditionCfg.m_iValue1), this.conditionCfg.m_iValue2);
                break;
            case KeyWord.HUNLI_CONDITION_GOD_POWER:
                str[0] = uts.format("神圣之力");
                str[1] = "神圣之力";
                str[2] = uts.format("{0}/{1}", this.getEquipNum(this.conditionCfg.m_iValue1), this.conditionCfg.m_iValue2);
                break;
            case KeyWord.HUNLI_CONDITION_QUESTION_FINISH:
                str[0] = uts.format("完成任务");
                let data = QuestData.getConfigByQuestID(this.conditionCfg.m_iValue1);
                str[1] = uts.format("{0}", data.m_szQuestTitle);
                str[2] = "";
                break;
            case KeyWord.HUNLI_CONDITION_HUNGU_EQUIP:
                let color = KeyWord.getDesc(KeyWord.GROUP_ITEM_COLOR, this.conditionCfg.m_iValue2);
                let drop = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.conditionCfg.m_iValue1);
                str[0] = uts.format("{0}{1}", color, drop);
                str[1] = uts.format("");
                if (info)
                    str[2] = uts.format("收集 {0}/{1}", info.m_iFinishParam, this.conditionCfg.m_iValue3);
                break;
        }
        return str;
    }

    /**
     * 获取装备数量
     * @param stage
     */
    private getEquipNum(stage: number): number {
        let count = 0;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let data: ThingItemData = new ThingItemData();
        for (let i: number = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            data = dataList[i];
            if (data && data.config.m_ucStage >= stage) {
                count++;
            }
        }
        return count;
    }
}

class HunliSubItem1 {
    public subIndex: number;
    public gameobject: GameObjectGetSet;

    protected goActive: GameObjectGetSet;
    protected goNotActive: GameObjectGetSet;

    setComponents(go: UnityEngine.GameObject, id: number) {
        this.subIndex = id;
        this.gameobject = new GameObjectGetSet(go);

        this.goActive = new GameObjectGetSet(ElemFinder.findObject(go, "active"));
        this.goNotActive = new GameObjectGetSet(ElemFinder.findObject(go, "notActive"));
    }

    setActive(isactive: boolean) {
        this.goActive.SetActive(isactive);
        this.goNotActive.SetActive(!isactive);
    }

    setShowOrHide(isshow: boolean) {
        this.gameobject.SetActive(isshow);
    }
}

class HunliSubItem2 extends HunliSubItem1 {
    private txtActiveName: TextGetSet;
    private txtNotActiveName: TextGetSet;
    private imgActiveIcon: UnityEngine.UI.Image;
    private imgNoActiveIcon: UnityEngine.UI.Image;
    private readonly activeName: string = "SoulForce_Have_";
    private readonly noActiveName: string = "SoulForce_air_";

    setComponents(go: UnityEngine.GameObject, id: number) {
        super.setComponents(go, id);
        this.txtActiveName = new TextGetSet(ElemFinder.findText(go, "active/txtName"));
        this.txtNotActiveName = new TextGetSet(ElemFinder.findText(go, "notActive/txtName"));
        this.imgActiveIcon = ElemFinder.findImage(go, "active/icon");
        this.imgNoActiveIcon = ElemFinder.findImage(go, "notActive/icon");
    }

    setHunliLevel(level: number) {
        let name = uts.format("{0}试炼", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, level));
        this.txtActiveName.text = name;
        this.txtNotActiveName.text = name;
        this.imgActiveIcon.sprite = HunLiPanel.altasActive.Get(uts.format("{0}{1}", this.activeName, level));
        this.imgNoActiveIcon.sprite = HunLiPanel.altasNoActive.Get(uts.format("{0}{1}", this.noActiveName, level));
    }
}

/**一个 */
class HunliInfoItem {
    private index: number;
    private hunliLevel: number;
    private subLevel: number;

    private subNode: HunliSubItem1;
    private bigNode: HunliSubItem2;

    private isBigItem = false;
    private isNull = false;

    setComponents(go: UnityEngine.GameObject, index: number) {
        //0 和 最大 的是空的什么都没有
        this.index = index;
        this.hunliLevel = Math.ceil((index) / 3);
        this.subLevel = (index - 1) % 3 + 1;
        if (index == 0 || index == HunLiPanel.maxHunliCount - 1) {
            this.isNull = true;
        }

        this.subNode = new HunliSubItem1();
        this.bigNode = new HunliSubItem2();
        this.subNode.setComponents(ElemFinder.findObject(go, "subNode"), this.subLevel);
        this.bigNode.setComponents(ElemFinder.findObject(go, "bigNode"), this.subLevel);
        if (this.isNull) {
            this.subNode.setShowOrHide(false);
            this.bigNode.setShowOrHide(false);
        }
        else {
            this.subNode.setShowOrHide(this.subLevel != 1);
            this.bigNode.setShowOrHide(this.subLevel == 1);
        }
        this.isBigItem = this.subLevel == 1;
    }

    refreshItem(isactive: boolean) {
        if (this.isBigItem) {
            this.bigNode.setActive(isactive);
        }
        else {
            this.subNode.setActive(isactive);
        }
        this.bigNode.setHunliLevel(this.hunliLevel);
    }
}

export class HunLiPanel extends TabSubFormCommon implements IGuideExecutor {
    private readonly conditionLength: number = 3;               //魂力升级的条件个数
    private readonly basePropLength: number = 4;                //基础属性的数量
    static readonly hunliConfigLength: number = 9;              //魂力总共9个阶段
    static readonly maxHunliCount: number = 9 * 3 - 2 + 2;      //魂力等级一共25个 前后各加一个空的，用于动画表现
    private readonly describeMaxNumber: number = 4;


    /**右侧节点标题 （名字+战斗力） */
    private nodeTitleItem: TitleItemNode;
    /**基础属性 表里的前四条*/
    private basicAttributeNode: PropertyListNode;
    /**特殊属性 表里的后四条*/
    private spaceAttributeNode: PropertyListNode;

    private curSelectedIndex: number;
    private curSelectedLevel: number;
    private curSelectedNodeLevel: number;
    private curSelectedCfg: GameConfig.HunLiConfigM;

    private hunliInfoItems: HunliInfoItem[] = [];
    private hunliList: List;

    private txtDescribes: TextGetSet[] = [];

    public static altasActive: Game.UGUIAltas;
    public static altasNoActive: Game.UGUIAltas;
    private modelNode: UnityEngine.GameObject;
    private modelNode2: UnityEngine.GameObject;
    private tweenNode: UnityEngine.GameObject;
    private startPos: UnityEngine.GameObject;
    private endPos: UnityEngine.GameObject;
    private subStage: UnityEngine.GameObject;
    private bigStage: UnityEngine.GameObject;
    private txtLevelLimit: TextGetSet;

    private effSuccend: GameObjectGetSet;
    private effSuccendBig: GameObjectGetSet;
    private txtEffectHunli: TextGetSet;
    private imgEffectHunli: UnityEngine.UI.Image;



    private conditionList: List;
    private btnUp: GameObjectGetSet;

    private itemIcon_Normal: UnityEngine.GameObject;
    private conditionItems: ConditionItem[] = [];

    private hunliData: HunLiData = null;

    /**引导用的按钮*/
    btnGuide1: UnityEngine.GameObject;
    /**引导用得按钮 */
    btnGuide2: UnityEngine.GameObject;

    private conditionNode: UnityEngine.GameObject;
    private txtHunliDes: UnityEngine.UI.Text;

    private guideGo: UnityEngine.GameObject;
    private guideMask: UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HunLiPanel;
    }

    protected initElements(): void {
        super.initElements();
        this.hunliData = G.DataMgr.hunliData;
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //图集
        HunLiPanel.altasActive = this.elems.getUGUIAtals("SoulForceActive");
        HunLiPanel.altasNoActive = this.elems.getUGUIAtals("SoulForceNoActive");

        this.nodeTitleItem = new TitleItemNode();
        this.nodeTitleItem.setComponents(this.elems.getElement("nodeTitleItem"));
        this.basicAttributeNode = new PropertyListNode();
        this.basicAttributeNode.setComponents(this.elems.getElement("basicAttributeNode"));
        this.spaceAttributeNode = new PropertyListNode();
        this.spaceAttributeNode.setComponents(this.elems.getElement("spaceAttributeNode"));
        //四个描述
        let desobj = this.elems.getElement("desc");
        for (let i = 0; i < this.describeMaxNumber; i++) {
            this.txtDescribes[i] = new TextGetSet(ElemFinder.findText(desobj, uts.format("desc{0}/Text", i)));
        }
        //三个条件
        this.conditionList = this.elems.getUIList("conditionList");
        this.conditionList.Count = this.conditionLength;
        for (let i = 0; i < this.conditionLength; i++) {
            let item = new ConditionItem();
            this.conditionItems.push(item);
            item.setComponents(this.conditionList.GetItem(i).gameObject, this.itemIcon_Normal, i);
        }
        if (this.conditionLength > 0) {
            this.btnGuide1 = this.conditionList.GetItem(0).findObject("btnGo");
        }
        //二十多个等级
        this.hunliList = this.elems.getUIList('hunliList');
        this.hunliList.MovementType = Game.FyScrollRect.MovementType.NoCross;
        this.hunliList.Count = HunLiPanel.maxHunliCount;
        this.hunliList.BeginDragCallback = delegate(this, this.onScrollBeginDrag);
        this.hunliList.EndDragCallback = delegate(this, this.onScrollEndDrag);

        for (let i = 0; i < HunLiPanel.maxHunliCount; i++) {
            let infoItem = new HunliInfoItem();
            this.hunliInfoItems.push(infoItem);
            infoItem.setComponents(this.hunliList.GetItem(i).gameObject, i);
        }

        this.modelNode = this.elems.getElement("modelNode");
        this.modelNode2 = this.elems.getElement("modelNode2");
        this.tweenNode = this.elems.getElement("tweenNode");
        this.startPos = this.elems.getElement("startPos");
        this.endPos = this.elems.getElement("endPos");
        this.subStage = this.elems.getElement("subStage");
        this.bigStage = this.elems.getElement("bigStage");

        this.txtLevelLimit = new TextGetSet(this.elems.getText("txtLevelLimit"));

        //特效
        this.effSuccend = new GameObjectGetSet(this.elems.getElement("effSuccend"));
        this.effSuccendBig = new GameObjectGetSet(this.elems.getElement("effSuccendBig"));
        this.txtEffectHunli = new TextGetSet(this.elems.getText("txtEffectHunli"));
        this.imgEffectHunli = this.elems.getImage("imgEffectHunli");
        this.btnUp = new GameObjectGetSet(this.elems.getElement("btnUp"));
        this.conditionNode = this.elems.getElement("conditionNode");
        this.txtHunliDes = this.elems.getText("txtHunliDes");
        this.guideGo = this.elems.getElement("guideGo");
        this.guideMask = this.elems.getElement("guideMask");
        this.effSuccend.SetActive(false);
        this.effSuccendBig.SetActive(false);
    }


    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnUp.gameObject, this.onBtnUpClick);
        this.addClickListener(this.guideMask, this.hunLiJinJieGuiderFunc);
        this.addListClickListener(this.hunliList, this.onClickHunliItem);
    }

    protected onOpen() {
        super.onOpen();
        //设置默认选择
        let index = this.hunliData.getNextIndex() - 1;
        this.setHunliLevel(index);

        this.hunliList.ScrollByAxialRow(index);

        this.updateView();

        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_OpenHunLiView);
        this.hunLiJinJieGuiderFunc();
    }
    /**魂力进阶引导调用的方法 */
    hunLiJinJieGuiderFunc() {
        if (G.GuideMgr.isGuiding(EnumGuide.HunLiJinJie)) {
            if (!this.guideGo.activeSelf && !this.guideMask.activeSelf) {
                this.guideMask.SetActive(true);
                this.guideGo.SetActive(true);
            }
        } else {
            if (this.guideGo.activeSelf && this.guideMask.activeSelf) {
                this.guideMask.SetActive(false);
                this.guideGo.SetActive(false);
            }
        }
        G.GuideMgr.processGuideNext(EnumGuide.HunLiJinJie, EnumGuide.HunLiJinJie_OpenHunLiPanel);
    }

    private onClickHunliItem(index: number) {
        this.hunliList.scrollByAxialTween(index - 1, 0.2);
        this.setHunliLevel(index - 1);
        this.updateView();
    }


    protected onClose() {
        this.effSuccend.SetActive(false);
        this.effSuccendBig.SetActive(false);
    }

    updateView() {
        this.curSelectedCfg = G.DataMgr.hunliData.getHunLiConfigByLevel(this.curSelectedLevel, this.curSelectedNodeLevel);
        //刷新试炼列表 注意要往后刷新一个，第一个数据是空的
        for (let i = 0; i < HunLiPanel.maxHunliCount; i++) {
            let level = this.hunliData.getNextIndex();
            let isactive: boolean = false;

            if (i < level) {
                isactive = true;
            }
            else if (i >= level) {
                isactive = false;
            }
            this.hunliInfoItems[i].refreshItem(isactive);
        }
        //刷新描述
        this.txtDescribes[0].text = this.curSelectedCfg.m_szDesc1;
        this.txtDescribes[1].text = this.curSelectedCfg.m_szDesc2;
        this.txtDescribes[2].text = this.curSelectedCfg.m_szDesc3;
        this.txtDescribes[3].text = this.curSelectedCfg.m_szDesc4;
        //刷新属性
        this.basicAttributeNode.clearProperty();
        for (let i = 0; i < this.basePropLength; i++) {
            let prop = this.curSelectedCfg.m_astProp[i];
            this.basicAttributeNode.addProperty(prop.m_ucPropId, prop.m_iPropValue);
        }
        this.basicAttributeNode.refreshPropertyNode();
        this.spaceAttributeNode.clearProperty();
        for (let i = this.basePropLength; i < this.curSelectedCfg.m_astProp.length; i++) {
            let prop = this.curSelectedCfg.m_astProp[i];
            this.spaceAttributeNode.addProperty(prop.m_ucPropId, prop.m_iPropValue);
        }
        this.spaceAttributeNode.refreshPropertyNode();
        //战斗力 
        let fight = this.basicAttributeNode.getFighting();
        fight += this.spaceAttributeNode.getFighting();
        this.nodeTitleItem.setTitleName(this.curSelectedCfg.m_szName);
        this.nodeTitleItem.setFighting(fight);
        //刷新条件
        this.refreshConditionList();
        //模型
        this.updateModel(this.curSelectedLevel);
        //战斗力限制
        let limit = this.curSelectedCfg.m_iRequireLevel;
        let color = G.DataMgr.heroData.level >= limit ? Color.GREEN : Color.RED;
        this.txtLevelLimit.text = TextFieldUtil.getColorText(uts.format("需求等级:{0}级", limit), color);
        //标题战斗力
        let titlefight = G.DataMgr.hunliData.calFightVlaueByLevel();
        this.setTitleFight(titlefight);
    }

    upLevelSuccend() {
        let index = this.hunliData.getNextIndex() - 1;
        this.setHunliLevel(index);
        this.hunliList.ScrollByAxialRow(index);
        this.updateView();
        //播放成功特效
        this.effSuccend.SetActive(false);
        this.effSuccendBig.SetActive(false);
        if (this.hunliData.getNextHunliSubLevel() == 2) {
            this.effSuccendBig.SetActive(true);
            G.ResourceMgr.loadModel(this.effSuccendBig.gameObject, UnitCtrlType.other, 'effect/uitx/panding/jinjietongyong.prefab', this.sortingOrder);
            this.txtEffectHunli.text = uts.format("成功进阶{0}", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, this.hunliData.getNextHunliLevel()));
            this.imgEffectHunli.sprite = HunLiPanel.altasActive.Get(uts.format("{0}{1}", "SoulForce_Have_", this.hunliData.getNextHunliLevel()));
            this.addTimer("effectPlay", 3000, 1, () => {
                this.effSuccendBig.SetActive(false);
            });
        }
        else {
            this.effSuccend.SetActive(true);
        }
    }

    private refreshConditionList() {
        //刷新条件列表
        let count = this.curSelectedCfg.m_astConditionList.length;
        this.conditionList.Count = count;
        let nextIndex = this.hunliData.getNextIndex() - 1;

        for (let i = 0; i < count; i++) {
            let conditionCfg = this.curSelectedCfg.m_astConditionList[i];
            let severCfg = null;
            if (this.hunliData.level != this.hunliData.HUNLI_LEVEL_MAX) {
                severCfg = this.hunliData.conditionInfo[this.hunliData.getNextHunliSubLevel() - 1].m_astConditionFinish[i];
            }
            this.conditionItems[i].update(conditionCfg, severCfg, this.curSelectedIndex, this.curSelectedCfg.m_iRequireLevel);
        }
        this.conditionNode.SetActive(this.curSelectedIndex <= nextIndex);
        if (this.curSelectedIndex <= nextIndex) {
            this.txtHunliDes.text = "";
        }
        else {
            this.txtHunliDes.text = "完成上一级试炼开启";
        }

        //按钮更新
        if (this.hunliData.level == this.hunliData.HUNLI_LEVEL_MAX) {
            this.btnUp.SetActive(false);
            return;
        }
        if (this.curSelectedIndex == nextIndex && G.DataMgr.heroData.level >= this.hunliData.getNextHunliConfig().m_iRequireLevel) {
            this.btnUp.SetActive(this.hunliData.getHunliProgress() == 1 ? true : false);
            this.btnGuide2 = this.btnUp.gameObject;
        }
        else {
            this.btnUp.SetActive(false);
        }
    }

    private onBtnUpClick() {
        if (G.DataMgr.hunliData.level >= G.DataMgr.hunliData.HUNLI_LEVEL_MAX) return;

        let hunlidata = this.hunliData.getNextHunliConfig();
        if (this.curSelectedIndex != this.hunliData.getNextIndex() - 1 && this.hunliData.getHunliProgress() != 1) {
            return;
        }

        if (G.DataMgr.heroData.level < hunlidata.m_iRequireLevel) {
            G.TipMgr.addMainFloatTip(uts.format("等级达到{0}级开启!", hunlidata.m_iRequireLevel));
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunliUpRequest());
        G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_ClickActivate2);
    }
    private onScrollBeginDrag() {
        //模型消失
        Tween.TweenPosition.Begin(this.tweenNode, 0.5, this.endPos.transform.position, true);
    }

    private onScrollEndDrag() {
        //模型出现
        let index = this.hunliList.FirstShowIndex;
        if (this.curSelectedIndex != index) {
            this.setHunliLevel(index);
            this.updateView();
        }
        Tween.TweenPosition.Begin(this.tweenNode, 0.5, this.startPos.transform.position, true);
        this.subStage.SetActive(this.curSelectedNodeLevel != 1);
        this.bigStage.SetActive(this.curSelectedNodeLevel == 1);
    }

    private setHunliLevel(index: number) {
        this.curSelectedIndex = Math.min(index, HunLiPanel.maxHunliCount - 2 - 1);
        let lv = this.hunliData.getHunliLevelAndSubLevel(index + 1);
        this.curSelectedLevel = lv[0];
        this.curSelectedNodeLevel = lv[1];
        if (this.curSelectedLevel == this.hunliData.HUNLI_LEVEL_MAX) {
            this.curSelectedLevel = this.hunliData.HUNLI_LEVEL_MAX;
            this.curSelectedNodeLevel = 1;
        }
    }



    private updateModel(level: number) {
        //台子的初始
        this.subStage.SetActive(this.curSelectedNodeLevel != 1);
        this.bigStage.SetActive(this.curSelectedNodeLevel == 1);

        if (this.curSelectedCfg.m_iModel == 0) return;

        let modelPath = uts.format("{0}_{1}", this.curSelectedCfg.m_iModel, G.DataMgr.heroData.profession);
        if (G.DataMgr.heroData.profession == 1) {
            G.ResourceMgr.loadModel(this.modelNode, UnitCtrlType.wuhun, modelPath, this.sortingOrder);
        } else {
            G.ResourceMgr.loadModel(this.modelNode2, UnitCtrlType.wuhun, modelPath, this.sortingOrder);
        }
    }

    private guideOnClick() {
        if (this.conditionItems.length > 1) {
            this.conditionItems[0].onBtnGo();
        }
    }


    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.WuHunActivate_ClickActivate1 == step) {
            this.guideOnClick();
            return true;
        } else if (EnumGuide.WuHunActivate_ClickActivate2 == step) {
            this.onBtnUpClick();
            return true;
        }
        return false;
    }
}