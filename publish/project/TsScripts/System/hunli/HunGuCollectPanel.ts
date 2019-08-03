import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { HunguSelectView } from 'System/hunli/HunguSelectView';
import { Macros } from 'System/protocol/Macros';
import { FixedList } from 'System/uilib/FixedList';
import { ElemFinder } from 'System/uilib/UiUtility';
import { IconModelItem } from '../ItemPanels/IconModelItem';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { IconItem } from '../uilib/IconItem';
import { TipFrom } from '../tip/view/TipsView';
import { List, ListItem } from 'System/uilib/List'
import { ThingData } from "System/data/thing/ThingData"
import { UIUtils } from 'System/utils/UIUtils';
import { GameObjectGetSet, TextGetSet } from '../uilib/CommonForm';
import { TitleItemNode } from '../ItemPanels/TitleItemNode';
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UnitCtrlType } from "System/constants/GameEnum";

export class HunGuCollectPanel extends TabSubFormCommon {
    /**年代个数 20*/
    static readonly YearsCount: number = 20;
    /**激活件数进度分三个进度*/
    private readonly ActiveProgressCount: number = 3;
    /**最高收集件数:6*/
    static readonly MaxCollectHunGuCount: number = 6;
    /**最低收集2件才能激活*/
    static readonly MinCollectHunGuCount: number = 2;
    private itemiconModelPrefab: UnityEngine.GameObject;
    /**年代列表*/
    private yearsList: List;
    private yearsListIndex: number = 0;

    private actives: GameObjectGetSet[] = [];
    private activings: GameObjectGetSet[] = [];
    private tipMarks: GameObjectGetSet[] = [];
    private nameTexts: UnityEngine.UI.Text[] = [];

    equipList: FixedList;
    private equipListEffectRoot: GameObjectGetSet[] = [];
    private hunguItems: IconModelItem[] = [];

    private selectEquipCfg: GameConfig.GetEquipCfgM[] = [];
    private equipItemDatas: { [part: number]: ThingItemData };
    /**后台数据*/
    private equipSuitInfo: Protocol.EquipSuitInfo = null;
    //当前阶数 已激活魂骨的数量
    private curActiveHunGuCount: number = 0;

    /**超链接下划线提示父节点*/
    private btnLines: GameObjectGetSet;
    private urlObjs: GameObjectGetSet[] = [];
    private openTexts: TextGetSet[] = [];
    private underline: GameObjectGetSet[] = [];

    /**右侧节点标题 （名字+战斗力） */
    private nodeTitleItem: TitleItemNode;

    private propList: List;

    private progressItem: GameObjectGetSet[] = [];
    private btnActive: GameObjectGetSet;
    private BigEffectRoot: GameObjectGetSet;
    private collectFlag: boolean[] = [false, false, false, false, false, false, false, false, false];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    }

    protected resPath(): string {
        return UIPathData.HunGuCollectPanel;
    }

    protected initElements() {
        super.initElements();

        this.yearsList = this.elems.getUIList("yearsList");
        //设置左侧列表显示
        this.yearsList.Count = HunGuCollectPanel.YearsCount;
        for (let i = 0; i < HunGuCollectPanel.YearsCount; i++) {
            let item = this.yearsList.GetItem(i).gameObject;
            let name = ElemFinder.findText(item, "name");
            let selectName = ElemFinder.findText(item, "select/selectName");
            let str = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, i + 1);
            name.text = str;
            selectName.text = str;
            this.actives.push(new GameObjectGetSet(ElemFinder.findObject(item, "active")));
            this.activings.push(new GameObjectGetSet(ElemFinder.findObject(item, "activing")));
            this.tipMarks.push(new GameObjectGetSet(ElemFinder.findObject(item, "tipMark")));
            this.nameTexts.push(name);
        }

        //中间部分
        this.itemiconModelPrefab = this.elems.getElement("itemIcon_Model");
        this.btnLines = new GameObjectGetSet(this.elems.getElement("btnLine"));
        this.equipList = this.elems.getUIFixedList("equipList");
        let count = this.equipList.Count;
        for (let i = 0; i < count; i++) {
            if (this.hunguItems[i] == null) {
                let item = new IconModelItem();
                let root = ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "icon");
                this.equipListEffectRoot.push(new GameObjectGetSet(ElemFinder.findObject(this.equipList.GetItem(i).gameObject, "effectRoot")));
                item.setIconByPrefab(this.itemiconModelPrefab, root);
                item.selectedClose();
                this.hunguItems.push(item);
            }
            let obj = ElemFinder.findObject(this.btnLines.gameObject, i.toString());
            this.urlObjs.push(new GameObjectGetSet(obj));
            this.openTexts.push(new TextGetSet(ElemFinder.findText(obj, "openText")));
            this.underline.push(new GameObjectGetSet(ElemFinder.findObject(obj,"underline")));
            Game.UIClickListener.Get(obj).onClick = delegate(this, this.onMouseUp, i);

        }

        //右侧部分
        this.nodeTitleItem = new TitleItemNode();
        this.nodeTitleItem.setComponents(this.elems.getElement("nodeTitleItem"));

        this.propList = this.elems.getUIList("propList");

        let progressGo = this.elems.getElement("progress");
        for (let i = 0; i < this.ActiveProgressCount; i++) {
            this.progressItem.push(new GameObjectGetSet(ElemFinder.findObject(progressGo, i.toString())));
            this.progressItem[i].gameObject.SetActive(false);
        }

        this.btnActive = new GameObjectGetSet(this.elems.getElement("btnActive"));
        this.BigEffectRoot = new GameObjectGetSet(this.elems.getElement("BigEffectRoot"));
    }

    protected initListeners() {
        super.initListeners();
        this.addListClickListener(this.yearsList, this.onYearListClick);
        this.addListClickListener(this.equipList, this.onEquipListClick);
        this.addClickListener(this.btnActive.gameObject, this.onClickActive);
    }

    protected onOpen() {
        super.onOpen();
        this.autoSelectYearsList();
        this.yearsList.ScrollByAxialRow(this.yearsListIndex);
    }

    protected onClose() {
        for (let i = 0, con = this.equipList.Count; i < con; i++) {
            this.hunguItems[i].stopButtonEffect();
        }
    }

    private onMouseUp(index: number): void {
        //表格有配跳转且没有激活
        if (this.selectEquipCfg[index].m_iFunction > 0 && !this.collectFlag[index]) {
            G.ActionHandler.executeFunction(this.selectEquipCfg[index].m_iFunction);
        }
    }

    private onYearListClick(index: number) {
        this.yearsListIndex = index;
        this.updatePanel();
    }

    private onEquipListClick(index: number) {
        let data = this.selectEquipCfg[index];
        if (data != null) {
            let item = new IconItem();
            item.updateById(data.m_iEquipId);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    /**刷新界面 */
    updatePanel() {
        this.equipSuitInfo = G.DataMgr.equipStrengthenData.equipSuitInfo;
        this.selectEquipCfg = ThingData.getGodEquipCfgs(this.yearsListIndex + 1);//开服活动-魂骨收集 表格配置从1开始,所以+1
        this.equipItemDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        this.updateYearsList();
        this.updateEquipIcon();
        //右侧
        this.nodeTitleItem.setTitleName(KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.yearsListIndex + 1));//最低三十年魂骨对应关键字从1开始,所以+1
        //获取的当前配置数据中每一条m_iGrade都一样,所以去下标0 ,这里的m_iGrade可用this.yearsListIndex + 1代替
        let props: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(this.selectEquipCfg[0].m_iGrade);
        let propLength: number = props[2].m_astPropAtt.length;//取 装备表-魂骨收集 中当前档次,激活数据为6,也就是下标为2的属性配置
        let fightCount: number = 0;
        this.propList.Count = propLength;
        for (let j = 0; j < propLength; j++) {
            let txtNum = this.propList.GetItem(j).findText("txtNum");
            let txtName = this.propList.GetItem(j).findText("txtName");
            let txtValue = this.propList.GetItem(j).findText("txtValue");
            txtNum.text = j * 2 + 2 + "件";
            txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, props[2].m_astPropAtt[j].m_ucPropId);
            txtValue.text = props[2].m_astPropAtt[j].m_ucPropValue + "";
            //这里%3是因为表格props只有3条数据,而属性可能不只3条
            if (this.equipSuitInfo.m_ucStage > props[j % 3].m_iGrade || (this.equipSuitInfo.m_ucStage == props[j % 3].m_iGrade && this.equipSuitInfo.m_ucNum / 2 > j)) {
                txtName.color = Color.toUnityColor("FFFFFFFF");
                txtNum.color = Color.toUnityColor("FFFFFFFF");
                fightCount += FightingStrengthUtil.calStrengthByOneProp(props[2].m_astPropAtt[j].m_ucPropId, props[2].m_astPropAtt[j].m_ucPropValue);
            } else {
                txtName.color = Color.toUnityColor("CACBCCFF");
                txtNum.color = Color.toUnityColor("CACBCCFF");
            }
        }
        this.nodeTitleItem.setFighting(fightCount);
        this.setTitleFight(G.DataMgr.heroData.fight);

        //这个是三个激活进度
        let progress = Math.floor(this.equipSuitInfo.m_ucNum / 2);
        for (let i = 0; i < this.ActiveProgressCount; i++) {
            //激活了更高的年代
            if (this.equipSuitInfo.m_ucStage > this.selectEquipCfg[0].m_iGrade) {
                this.progressItem[i].gameObject.SetActive(true);
            } else if (this.equipSuitInfo.m_ucStage < this.selectEquipCfg[0].m_iGrade) {
                //这个年代一个都没有激活
                this.progressItem[i].gameObject.SetActive(false);
            } else {
                //正在进行中的年代
                this.progressItem[i].gameObject.SetActive(i < progress);
            }
        }
        UIUtils.setButtonClickAble(this.btnActive.gameObject, this.canActive());
    }
    /**更新左侧列表显示 */
    private updateYearsList() {
        //这个变量用来限制只显示一个点
        let tipMarkFlag: boolean = true;
        for (let i = 0; i < HunGuCollectPanel.YearsCount; i++) {
            let cfg = ThingData.getGodEquipCfgs(i + 1)[0];
            let stage = this.equipSuitInfo.m_ucStage;
            let num = this.equipSuitInfo.m_ucNum;
            let activeFlag: boolean = stage > cfg.m_iGrade || (stage == cfg.m_iGrade && num == HunGuCollectPanel.MaxCollectHunGuCount);
            this.actives[i].SetActive(activeFlag);
            this.nameTexts[i].color = Color.toUnityColor(activeFlag ? "FFFFFFFF" : "CACBCCFF");
            let stage1 = (stage > 0 ? stage : 1);
            let activingFlag: boolean = i == (num == HunGuCollectPanel.MaxCollectHunGuCount ? stage1 : stage1 - 1);
            this.activings[i].SetActive(activingFlag);
            let hunguCollectCount: number = this.getHunGuCollectCount(ThingData.getGodEquipCfgs(i + 1));
            //当前年代没激活6件且身上穿的超过两件 || 当前年代激活了6件且下一年代身上穿的超过两件
            let tipMark: boolean = ((stage == 0 || stage == cfg.m_iGrade) && num != HunGuCollectPanel.MaxCollectHunGuCount && hunguCollectCount >= num + 2) ||
                (num == HunGuCollectPanel.MaxCollectHunGuCount && stage == cfg.m_iGrade - 1 && hunguCollectCount >= HunGuCollectPanel.MinCollectHunGuCount);
            this.tipMarks[i].SetActive(tipMark && tipMarkFlag);
            if (tipMark)
                tipMarkFlag = false;
            //控制列表总是显示比当前已激活的年代多显示两个item
            this.yearsList.GetItem(i).gameObject.SetActive(i < (stage1+2));
           
        }
    }
    /**
     * 获得 已收集魂骨数量
     * @param cfg
     */
    private getHunGuCollectCount(cfg: GameConfig.GetEquipCfgM[]): number {
        let count = 0;
        let hunliData = G.DataMgr.hunliData;
        for (let i = 0; i < hunliData.HUNGU_COUNT; i++) {
            let itemdata = this.equipItemDatas[i];
            let config = cfg[i]
            if (itemdata != null) {
                if (itemdata.config.m_iDropLevel > config.m_iGrade) {
                    count++;
                } else if (itemdata.config.m_iDropLevel == config.m_iGrade&&itemdata.config.m_ucColor >= config.m_iColor) {
                    count++;
                }
            }
        }
        return count;
    }
    /**自动选择左侧列表 */
     autoSelectYearsList() {
        this.equipSuitInfo = G.DataMgr.equipStrengthenData.equipSuitInfo;
         this.yearsListIndex = (this.equipSuitInfo.m_ucStage > 0 ? this.equipSuitInfo.m_ucStage : 1) - 1;
         if (this.equipSuitInfo.m_ucNum == HunGuCollectPanel.MaxCollectHunGuCount) this.yearsListIndex = this.yearsListIndex + 1;
         this.yearsListIndex = this.yearsListIndex > HunGuCollectPanel.YearsCount - 1 ? HunGuCollectPanel.YearsCount - 1 : this.yearsListIndex;
         this.yearsList.Selected = this.yearsListIndex;

        this.updatePanel();
    }
    /**是否可以点击激活 */
    private canActive(): boolean {
        //后台的数据
        let stage = this.equipSuitInfo.m_ucStage;
        let num = this.equipSuitInfo.m_ucNum;
        //当前选中表格的配置
        let grade = this.selectEquipCfg[0].m_iGrade;
        //从没激活过,只有选列表第一个 激活按钮才会亮
        if ((stage == 0 && grade==1) || stage == grade) {
            if (num != HunGuCollectPanel.MaxCollectHunGuCount && this.curActiveHunGuCount >= num + 2) {
                //可激活属性
                return true;
            }
        }
        if (num == HunGuCollectPanel.MaxCollectHunGuCount && stage == grade - 1 && this.curActiveHunGuCount >= HunGuCollectPanel.MinCollectHunGuCount) {
            //这一年代收集了6件并且下一年代收集两件以上
            return true;
        }
        return false;
    }

    private onClickActive() {
        let len = G.DataMgr.hunliData.HUNGU_COUNT;
        if (this.curActiveHunGuCount >= 6) {
            this.BigEffectRoot.SetActive(true);
            G.ResourceMgr.loadModel(this.BigEffectRoot.gameObject, UnitCtrlType.other, "effect/uitx/hunlishouji/sixcg.prefab", this.sortingOrder + 3);
        } else {
            for (let i = 0; i < len; i++) {
                if (this.collectFlag[i]) {
                    this.equipListEffectRoot[i].SetActive(true);
                    if (i < 6) {
                        G.ResourceMgr.loadModel(this.equipListEffectRoot[i].gameObject, UnitCtrlType.other, "effect/uitx/hunlishouji/shoujichengg.prefab", this.sortingOrder + 3);
                    } else {
                        G.ResourceMgr.loadModel(this.equipListEffectRoot[i].gameObject, UnitCtrlType.other, "effect/uitx/hunlishouji/waifuhungu.prefab", this.sortingOrder + 3);
                    }
                }

            }
        }
        this.addTimer("1", 500, 1, this.sendMsg);
    }

    private sendMsg() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguFZRequest(0, Macros.EQUIP_SUIT_ACT));
        if (this.curActiveHunGuCount >= 6) {
            this.BigEffectRoot.SetActive(false);
        } else {
            let len = G.DataMgr.hunliData.HUNGU_COUNT;
            for (let i = 0; i < len; i++) {
                this.equipListEffectRoot[i].SetActive(false);
            }
        }

        this.removeTimer("1");
    }

    /**更新魂骨图标显示 */
    private updateEquipIcon() {
        this.curActiveHunGuCount = 0;
        let hunliData = G.DataMgr.hunliData;
        for (let i = 0; i < hunliData.HUNGU_COUNT; i++) {
            //身上穿的
            let itemdata = this.equipItemDatas[i];
            //当前选择的
            let selectCfg = this.selectEquipCfg[i]
            let itemObj = this.hunguItems[i];
            let cfg = ThingData.getThingConfig(selectCfg.m_iEquipId);
            itemObj.setHunguEquipIconById(selectCfg.m_iEquipId);
            itemObj.updateIconShow();
            this.collectFlag[i] = false;
            //更新每个图标下面的文本

            this.openTexts[i].text = TextFieldUtil.getColorText(selectCfg.m_szGetDescription, Color.GREEN);
            if (itemdata && itemdata.config.m_iDropLevel >= selectCfg.m_iGrade) {
                if (itemdata.config.m_iDropLevel > selectCfg.m_iGrade) {
                    this.curActiveHunGuCount++;
                    this.openTexts[i].text = TextFieldUtil.getColorText("已收集", Color.WHITE);
                    this.collectFlag[i] = true;
                } else if (itemdata.config.m_iDropLevel == selectCfg.m_iGrade && itemdata.config.m_ucColor >= selectCfg.m_iColor) {
                    this.curActiveHunGuCount++;
                    this.openTexts[i].text = TextFieldUtil.getColorText("已收集", Color.WHITE);
                    this.collectFlag[i] = true;
                }
            }
            UIUtils.setGrey(this.equipList.GetItem(i).gameObject, !this.collectFlag[i] );
        }
    }
}