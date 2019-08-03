import { Global as G } from 'System/global'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIUtils } from 'System/utils/UIUtils'
import { GroupList } from 'System/uilib/GroupList'
import { FixedList } from 'System/uilib/FixedList'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ThingData } from 'System/data/thing/ThingData'
import { VipView } from "System/vip/VipView"
import { TanBaoView } from 'System/tanbao/TanBaoView'
import { DailyRechargeView } from 'System/activity/view/DailyRechargeView'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { BossView } from 'System/pinstance/boss/BossView'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { EquipView } from 'System/equip/EquipView'
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule, EnumGuide } from "System/constants/GameEnum";
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { HeroView } from 'System/hero/view/HeroView'
import { WuXiaHuanXingView } from 'System/equip/WuXiaHuanXingView'
import { SpecialPriBasePanel } from 'System/hero/view/SpecialPriBasePanel'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { JinjieView } from 'System/jinjie/view/JinjieView'


export class EquipCollectPropItem {
    private txtNum: UnityEngine.UI.Text;
    private txtValue1: UnityEngine.UI.Text;
    private txtValue2: UnityEngine.UI.Text;
    private txtValue3: UnityEngine.UI.Text;


    setComponent(go: UnityEngine.GameObject) {
        this.txtNum = ElemFinder.findText(go, "txtNum");
        this.txtValue1 = ElemFinder.findText(go, "txtValue1");
        this.txtValue2 = ElemFinder.findText(go, "txtValue2");
        this.txtValue3 = ElemFinder.findText(go, "txtValue3");

    }

    update(data: GameConfig.EquipAllColorPropM, numComplete: number, index: number, specialPriAddPct: number) {
        let color: string = "";
        if (numComplete >= data.m_ucNum) {
            color = Color.GREEN;
        } else {
            color = Color.GREY;
        }
        this.txtNum.text = TextFieldUtil.getColorText(uts.format("[收集{0}件]", data.m_ucNum), color);

        let propConfigs = data.m_astPropAtt;
        let len = propConfigs.length;

        //三条属性，写的稍微繁琐了点...
        let propConfig = propConfigs[0];
        if (propConfig != null) {
            let str = uts.format("{0}  {1}", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propConfig.m_ucPropId), propConfig.m_ucPropValue);
            this.txtValue1.text = TextFieldUtil.getColorText(str, color);
        }
        propConfig = propConfigs[1];
        if (propConfig != null) {
            let str = uts.format("{0}  {1}", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propConfig.m_ucPropId), propConfig.m_ucPropValue);
            this.txtValue2.text = TextFieldUtil.getColorText(str, color);
        }
        propConfig = propConfigs[2];
        if (propConfig != null) {
            let str = uts.format("{0}  {1}", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propConfig.m_ucPropId), propConfig.m_ucPropValue);
            this.txtValue3.text = TextFieldUtil.getColorText(str, color);
        }

        //let propConfig = data.m_astPropAtt[index];
        //if (propConfig != null) {
        //    let propValue = propConfig.m_ucPropValue + Math.floor(propConfig.m_ucPropValue * specialPriAddPct);
        //    this.txtValue.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propConfig.m_ucPropId) + "  " + propValue, color);
        //}
    }

}


/**
 *装备收集
 * @author jesse
 */
export class EquipCollectPanel extends SpecialPriBasePanel implements IGuideExecutor {
    private readonly firsStrCount: number = 5;
    /**进度条分度数4*/
    private readonly MAXPROGRESS: number = 4;

    private equipView: EquipView;
    /**左侧的选择界面 树状结构*/
   // private groupList: GroupList;
    /**左侧的选择界面 链表结构*/
    private list: List;
    private readonly isList = true;

    /**右侧界面*/
    private propPanel: UnityEngine.GameObject;              //总界面
    private btnEquip: UnityEngine.GameObject;               //“获取套装”按钮
    private imgEquipButton: UnityEngine.GameObject;         //套装选中效果
    public btnProperty: UnityEngine.GameObject;             //“激活属性”按钮
    private imgPropertyButton: UnityEngine.GameObject;      //属性选中效果
    private tipPropertyButtonMask: UnityEngine.GameObject;  //小红点


    private equipPanel: UnityEngine.GameObject;             //套装界面
    private equipFixedList: FixedList = null;               //装备列表

    private propertyPanel: UnityEngine.GameObject;          //属性界面
    private txtPropertyNumber: UnityEngine.UI.Text;         //激活的属性数量“2/4”

    private propList: List;
    //进度
    private progressObj: UnityEngine.GameObject;
    private progressObjs: UnityEngine.GameObject[] = [];
    /**超链接下划线提示父节点*/
    private btnLines: UnityEngine.GameObject;
    private urlObjs: UnityEngine.GameObject[] = [];

    private txtFight: UnityEngine.UI.Text;                  //左上角的战斗力数值
    private txtActive: UnityEngine.UI.Text;
    private txtTip: UnityEngine.UI.Text;
    private txtActiveDes: UnityEngine.UI.Text;
    /**激活时装*/
    private txtShiZhuang: UnityEngine.UI.Text;
    private txtActiveLabel: UnityEngine.UI.Text;
    private txtFashionFight: UnityEngine.UI.Text;
    /**"时装战斗力"*/
    private imgScatteredEquip: UnityEngine.UI.Image;        //"时装战斗力"
    /**“套装战斗力”*/
    private imgIntactEquip: UnityEngine.UI.Image;           //“套装战斗力”


    private firstStrAtals: Game.UGUIAltas;
    private sceondStrAtals: Game.UGUIAltas;
    private colorTypeAtals: Game.UGUIAltas;

    /**GroupList一级选择*/
    private firstSelectIndex: number = 0;
    /**GroupList二级选择*/
    private secondSelectIndex: number = 0;
    /**当前选择的阶级类型*/
    private curSelectStage: number = -1;
    /**当前选择的套装类型*/
    private curListIndex: number = -1;

    private equipList: FixedList = null;
    private equipIcons: IconItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;

    /**装备数据*/
    private EquipItemDatas: ThingItemData[] = [];
    private equipCollectPropItem: EquipCollectPropItem[] = [];

    btnActive: UnityEngine.GameObject;
    /**激活 0 - 套装，1-时装*/
    private actDress: number = 0;
    /**激活下一个套装数*/
    private actNextNum: number = -1;

    /**服务器存的当前阶级是否激活了时装*/
    private curGradeIsActive: { [grade: number]: boolean };

    /**时装avatarList*/
    private rolePosition: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;

    //特效
    private equipCollectFull: UnityEngine.GameObject;
    private equipCollectBaoKai: UnityEngine.GameObject;
    private effectRoot: UnityEngine.GameObject;
    private duanEffects: UnityEngine.GameObject[] = [];
    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;

    /***时装*/
    private btnShiZhuang: UnityEngine.GameObject;
    /**无暇幻形*/
    private btnWuXiaHuanXing: UnityEngine.GameObject;

    /**当前选择时装id*/
    private curDressID: number = 0;

    //private shizhuangTipMark: UnityEngine.GameObject;
    /**打开神装飞升|无暇幻化时优先选择第一个能强化的*/
    private firstSelectDressId: number = 0;

    constructor() {
        super(2139, KeyWord.SPECPRI_EQUIPSUIT_ADD);
    }

    protected resPath(): string {
        return UIPathData.EquipCollectPanel;
    }

    private properssNumber: number[];

    /**初始右侧面板绑定 */
    private initRightPanelElements() {
        this.propPanel = this.elems.getElement("propPanel");
        this.btnProperty = ElemFinder.findObject(this.propPanel, "btnProperty");
        this.btnEquip = ElemFinder.findObject(this.propPanel, "btnEquip");
        this.equipPanel = ElemFinder.findObject(this.propPanel, "equipPanel");
        this.propertyPanel = ElemFinder.findObject(this.propPanel, "propertyPanel");
        this.imgEquipButton = ElemFinder.findObject(this.propPanel, "btnEquip/selected");
        this.imgPropertyButton = ElemFinder.findObject(this.propPanel, "btnProperty/selected");
        this.txtPropertyNumber = ElemFinder.findText(this.propertyPanel, "number");
        this.tipPropertyButtonMask = ElemFinder.findObject(this.btnProperty, "tipMark");

        this.initEquipFixedList();
    }

    /**右侧“获取套装”装备初始绑定 */
    private initEquipFixedList() {
        this.equipFixedList = ElemFinder.getUIFixedList(ElemFinder.findObject(this.equipPanel, "equipFixedList"));
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        let cnt = ThingData.All_EQUIP_NUM - 2;
        for (let i = 0; i < cnt; i++) {
            let itemobj = this.equipFixedList.GetItem(i);
            let itemGo = itemobj.findObject('equip');
            let iconItem = new IconItem();
            iconItem.showBg = true;
            iconItem.needWuCaiColor = true;
            iconItem.setTipFrom(TipFrom.normal);
            //  iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, itemGo);
            this.equipIcons[i] = iconItem;

            let obj = ElemFinder.findObject(itemobj.gameObject, "tipGet");
            this.urlObjs.push(obj);
            Game.UIClickListener.Get(obj).onClick = delegate(this, this.onMouseUp);
        }
    }

    protected initElements(): void {
        super.initElements();

        //右侧面板查找.
        this.initRightPanelElements();

        if (!this.isList) {
            //装备图标
            this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
            this.equipList = ElemFinder.getUIFixedList(this.elems.getElement('equipList'));
            let cnt = ThingData.All_EQUIP_NUM - 2;
            for (let i = 0; i < cnt; i++) {
                let itemobj = this.equipList.GetItem(i);
                let itemGo = itemobj.findObject('equip');
                let iconItem = new IconItem();
                iconItem.showBg = true;
                iconItem.needWuCaiColor = true;
                iconItem.setTipFrom(TipFrom.normal);
                //  iconItem.effectRule = EnumEffectRule.none;
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, itemGo);
                this.equipIcons[i] = iconItem;
            }

            this.btnLines = this.elems.getElement("btnLine");
            for (let i = 0; i < EquipUtils.All_EQUIP_NUM; i++) {
                let obj = ElemFinder.findObject(this.btnLines, i.toString());
                this.urlObjs.push(obj);
                Game.UIClickListener.Get(obj).onClick = delegate(this, this.onMouseUp);
            }
        }

       // this.groupList = this.elems.getUIGroupList("groupList");
        this.list = this.elems.getUIList("list");
        this.propList = this.elems.getUIList("propList");
        //进度条分段
        this.progressObj = this.elems.getElement("progressObj");
        for (let i = 0; i < this.MAXPROGRESS; i++) {
            let obj = ElemFinder.findObject(this.progressObj, i.toString());
            obj.SetActive(false);
            this.progressObjs.push(obj);
        }
        this.txtFight = this.elems.getText("txtFight");
        this.txtActive = this.elems.getText("txtActive")
        this.txtTip = this.elems.getText("txtTip");
        this.txtActiveDes = this.elems.getText("txtActiveDes");
        this.txtShiZhuang = this.elems.getText("txtShiZhuang");
        this.txtActiveLabel = this.elems.getText("txtActiveLabel");
        this.txtFashionFight = this.elems.getText("txtFashionFight");
        this.imgScatteredEquip = this.elems.getImage("txtFightString1");
        this.imgIntactEquip = this.elems.getImage("txtFightString2");

        this.firstStrAtals = this.elems.getElement("firstStrAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.sceondStrAtals = this.elems.getElement("sceondStrAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.colorTypeAtals = this.elems.getElement("colorTypeAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.btnShiZhuang = this.elems.getElement("btnShiZhuang");
        this.btnWuXiaHuanXing = this.elems.getElement("btnWuXiaHuanXing");
        this.btnActive = this.elems.getElement("btnActive");
        this.rolePosition = this.elems.getTransform("rolePosition");


        //特效
        this.equipCollectFull = this.elems.getElement("equipCollectFull");
        this.equipCollectFull.SetActive(false);
        this.equipCollectBaoKai = this.elems.getElement("equipCollectBaoKai");
        this.equipCollectBaoKai.SetActive(false);
        this.effectRoot = this.elems.getElement("effectRoot");
        for (let i = 0; i < this.MAXPROGRESS - 1; i++) {
            let obj = ElemFinder.findObject(this.effectRoot, "equipCollectDuan" + i);
            this.duanEffects.push(obj);
        }
        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
        //此处为了把数组赋值
        EquipUtils.getEquipCollectName(0);

        //this.shizhuangTipMark = this.elems.getElement("shizhuangTipMark");



    }

    protected initListeners(): void {
        super.initListeners();
        //this.addListClickListener(this.groupList, this.onGroupListClick);
        this.addListClickListener(this.list, this.onListClick);
        this.addClickListener(this.btnActive, this.onClickActive);
        this.addClickListener(this.btnShiZhuang, this.onClickShiZhaung);

        this.addClickListener(this.btnEquip, this.onClickEquip);
        this.addClickListener(this.btnProperty, this.onClickProperty);

        //this.addClickListener(this.btnWuXiaHuanXing, this.onClickWuXiaHuanXing);
    }

    protected onOpen() {
        super.onOpen();
        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            //this.equipView.showModelBg(true);
            this.equipView.showFight(true);
        }
        this.initRightPanel();

        this.btnWuXiaHuanXing.SetActive(false);

        //两种实现，一种链表一种树型
        this.isList ? this.updateListItemInfo() : this.updateGroupListItemInfo();

        this.updatePanelData(false);
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickEntrance);

        this.addTimer('idleDelay', 5000, 0, delegate(this, this.onIdleDelayTimer));

    }

    private onIdleDelayTimer(timer: Game.Timer) {
        if (this.roleAvatar) {
            if (this.roleAvatar.defaultAvatar.isPlaying("stand"))
                this.roleAvatar.defaultAvatar.playAnimation("show_idle",0.2);
        }
    }

    protected onClose() {
        if (this.equipView != null) {
            this.equipView.showFight(false);
        }
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        this.liziEffectRoot.SetActive(false);
    }

    private onClickActive() {
        if (this.actNextNum > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(0, Macros.EQUIP_SUIT_ACT, this.actDress, this.actNextNum, this.curSelectStage));
        }
    }


    private onClickShiZhaung() {
        G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_DRESS);
        this.close();
    }

    /**点击“获取套装”按钮 */
    private onClickEquip() {
        if (this.equipPanel.activeSelf) return;

        this.equipPanel.SetActive(true);
        this.propertyPanel.SetActive(false);

        this.imgEquipButton.SetActive(true);
        this.imgPropertyButton.SetActive(false);
    }

    /**点击“激活属性”按钮 */
    private onClickProperty() {
        if (this.propertyPanel.activeSelf) return;

        this.equipPanel.SetActive(false);
        this.propertyPanel.SetActive(true);

        this.imgEquipButton.SetActive(false);
        this.imgPropertyButton.SetActive(true);

        // 进行下一步指引
        //G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickEnter);

    }

    /**初始化右侧的装备界面 */
    private initRightPanel() {
        this.equipPanel.SetActive(false);
        this.propertyPanel.SetActive(false);
        this.onClickProperty();
    }

    /**初始化左侧品阶界面 */
    private initLeftPanel() {

    }

    //private onClickWuXiaHuanXing() {
    //    G.Uimgr.createForm<WuXiaHuanXingView>(WuXiaHuanXingView).open(this.curDressID,this.firstSelectDressId);
    //}

    /**
* 播放粒子系统
*/
    private playLiZiEffect() {
        this.liziEffectRoot.SetActive(false);
        this.liziEffectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.liziEffectRoot, "effect", 2.5, delegate(this, this.onEndEffect));
    }

    private onEndEffect() {
        this.liziEffectRoot.SetActive(false);
    }


    /**
     * 拉去时装数据
     */
    pullSzListRequestAndUpdateGroupList() {
        this.playLiZiEffect();
        G.AudioMgr.playStarBombSucessSound();
        //播放爆开特效
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSzListRequest());
        if (G.DataMgr.equipStrengthenData.activeSuitInfo.m_ucActDress == 1) {
            this.equipCollectBaoKai.SetActive(true);
            //进阶成功播放粒子特效
            G.AudioMgr.playJinJieSucessSound();
            Game.Invoker.BeginInvoke(this.progressObj, "baokaiEffect", 0.9, delegate(this, this.stopBaoKaiEffect));
            let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(this.curSelectStage);
            let dressId = EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID);

            //let numComplete = G.DataMgr.thingData.getEquipSuitsCount(this.curSelectStage);
            //let fight = EquipUtils.getUpLevelFight(numComplete, this.curSelectStage);
            //G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, false, dressId, fight);
        } else if (this.actNextNum <= 0) {
            // 不能激活了，继续下一步指引
            G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickTakeOn);
        }
    }

    private stopBaoKaiEffect() {
        this.equipCollectBaoKai.SetActive(false);
    }

    //时装改变 heroModule
    onDressChange() {
        this.updatePanelData(true);

        //两种实现，一种链表一种树型
        this.isList ? this.updateListItemInfo() : this.updateGroupListItemInfo();

        //G.ViewCacher.mainView.updateEquipCollectProgress();
    }

    updatePanelData(byResp: boolean) {
        //得到服务端当前阶级
        this.curSelectStage = G.DataMgr.equipStrengthenData.equipSuitInfo.m_ucStage;
        if (this.curSelectStage == 0) {
            this.curSelectStage = 1;
        }
        //查看时装列表中是否有当前阶级，有说明已经激活，this.curSelectStage++
        let imageList = G.DataMgr.heroData.dressList.m_astImageList;
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(this.curSelectStage);
        this.curGradeIsActive = {};
        this.curGradeIsActive[this.curSelectStage] = false;
        for (let i = 0; i < G.DataMgr.heroData.dressList.m_ucNumber; i++) {
            if (imageList[i].m_uiImageID == EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID)) {
                this.curGradeIsActive[this.curSelectStage] = true;
                if (this.curGradeIsActive[this.curSelectStage] && G.DataMgr.equipStrengthenData.equipSuitInfo.m_ucNum == 8)
                    this.curSelectStage++;
                break;
            }
        }

        //查找对应索引
        //let indexs = EquipUtils.getEquipCollectIndexByKeyWord(this.curSelectStage);
        //this.firstSelectIndex = indexs[0];
        //this.secondSelectIndex = indexs[1];
        //this.groupList.Selected = this.firstSelectIndex;
        //if (this.groupList.GetSubList(this.firstSelectIndex) != null) {
        //    this.groupList.GetSubList(this.firstSelectIndex).Selected = this.secondSelectIndex;
        //}

        //let indexs = EquipUtils.getEquipCollectNameForList(this.curSelectStage);
        this.list.Selected = this.curSelectStage - 1;

        this.updateEquipPanel(byResp);
    }

    /**给GroupList赋值 */
    private updateGroupListItemInfo() {

        //当前正在收集
        let curEquipCollectStage = G.DataMgr.thingData.curEquipCollectStage;
        let openIndexArray = EquipUtils.getEquipCollectIndexByKeyWord(curEquipCollectStage + 1 > ThingData.maxEquipStage ? ThingData.maxEquipStage : curEquipCollectStage + 1);
        //this.groupList.Count = openIndexArray[0] + 1;
        let petData = G.DataMgr.petData;

        //for (let i: number = 0; i < this.groupList.Count; i++) {
        //    let labelItem = this.groupList.GetItem(i);
        //    //unity结构获取赋值
        //    let labelText = labelItem.findImage('catalog/normal/text');
        //    labelText.sprite = this.firstStrAtals.Get(i.toString());
        //    labelText = labelItem.findImage('catalog/selected/text');
        //    labelText.sprite = this.firstStrAtals.Get(i.toString());
        //    let colorTypeImg = labelItem.findImage('catalog/colorType');
        //    colorTypeImg.sprite = this.colorTypeAtals.Get(i.toString());
        //    let typeTipMark = labelItem.findObject("catalog/tipMark");

        //    let subList = this.groupList.GetSubList(i);
        //    // typeTipMark.SetActive(G.DataMgr.equipStrengthenData.getEquipCollectLabelTipMark(i));
        //    subList.onClickItem = delegate(this, this.onClickGroupItem);
        //    if (i == this.groupList.Count - 1) {
        //        subList.Count = openIndexArray[1] + 1;
        //    } else {
        //        subList.Count = EquipUtils.getEquipCollectName(i).length;
        //    }

        //    //二级界面的赋值
        //    let mainTip = false;

        //    for (let j: number = 0; j < subList.Count; j++) {
        //        let petItem = subList.GetItem(j);
        //        let petNameText = petItem.findImage('txtName');
        //        let tipMark = petItem.findObject('tipMark');

        //        let index = EquipUtils.getEquipCollectName(i)[j];
        //        petNameText.sprite = this.sceondStrAtals.Get(index.toString());

        //        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(index);
        //        let dressId = EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID);

        //        let subTip = G.DataMgr.equipStrengthenData.getEquipStageCanActiveType(index) > 0;

        //        if (subTip) {
        //            mainTip = true;
        //        }
        //        tipMark.SetActive(subTip);
        //    }
        //    typeTipMark.SetActive(mainTip);

        //}
    }

    /**给左边list赋值 */
    private updateListItemInfo() {


        let len = EquipUtils.getEquipCountForList();
        this.list.Count = len;
        //初始按钮选择
        let curEquipCollectStage = G.DataMgr.thingData.curEquipCollectStage;

        //二级界面的赋值
        let mainTip = false;

        for (let j: number = 0; j < len; j++) {
            let petItem = this.list.GetItem(j);
            //let petNameText = petItem.findImage('txtName');
            let petNameTextString = petItem.findText("txtNameString");
            let tipMark = petItem.findObject('tipMark');

            let index = EquipUtils.getEquipCollectNameForList(j);

            //petNameText.sprite = this.sceondStrAtals.Get(index.toString());
            petNameTextString.text = EquipUtils.EQUIP_LEVEL_NAME[j];

            let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(index);
            let dressId = EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID);

            let subTip = G.DataMgr.equipStrengthenData.getEquipStageCanActiveType(index) > 0;

            if (subTip) {
                mainTip = true;
            }
            tipMark.SetActive(subTip);
            //this.list.GetItem(j).Selected = subTip;
        }
        this.tipPropertyButtonMask.SetActive(mainTip);
    }

    private onGroupListClick(index: number) {
        this.firstSelectIndex = index;
    }

    /**
     * 点击ListItem
     * @param index
     */
    private onListClick(index: number) {
        if (this.curListIndex == index) return;

        this.curListIndex = index;

        this.curSelectStage = EquipUtils.getEquipCollectNameForList(index);
        this.updateEquipPanel(false);
    }

    /**
     * 点击GroupItem
     * @param index
     */
    private onClickGroupItem(index: number) {
        this.secondSelectIndex = index;
        this.curSelectStage = EquipUtils.getEquipCollectName(this.firstSelectIndex)[this.secondSelectIndex];
        this.updateEquipPanel(false);
    }

    private updateEquipPanel(byResp: boolean) {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let equipData: ThingItemData;
        //默认为玩家紫装
        let data = G.DataMgr.equipStrengthenData;

        this.curSelectStage = this.curSelectStage > ThingData.maxEquipStage ? ThingData.maxEquipStage : this.curSelectStage;
        let dataList: GameConfig.GetEquipCfgM[] = ThingData.getGodEquipCfgs(this.curSelectStage);
        let config: GameConfig.GetEquipCfgM;
        let numComplete: number = 0;

        for (let i: number = 0; i < dataList.length; i++) {
            config = dataList[i];
            equipData = equipDatas[i];

            //let lineTextObj = ElemFinder.findObject(this.btnLines, i.toString());
            //let lineText = ElemFinder.findText(lineTextObj, "Text");
            //let underLine = ElemFinder.findObject(lineTextObj, "underline");

            let nameText = ElemFinder.findText(this.equipFixedList.GetItem(i).gameObject, "txtName");
            let lineText = ElemFinder.findText(this.equipFixedList.GetItem(i).gameObject, "txtUrl");
            let underLine = ElemFinder.findObject(this.equipFixedList.GetItem(i).gameObject, "tipGet");

            if (config != null) {
                let funcId: number = config.m_iFunction;
                //TODO...暂时隐藏
                //underLine.SetActive(funcId > 0);
                underLine.SetActive(false);
            }
            //刷新图标显示
            this.equipIcons[i].updateById(config.m_iEquipId);
            if (equipData == null || equipData.config.m_ucStage < this.curSelectStage) {
                this.equipIcons[i].filterType = IconItem.FILTER_GRAY;
                this.equipIcons[i].m_effectRule = EnumEffectRule.none;
                lineText.text = config.m_szGetDescription;
            }
            else {
                this.equipIcons[i].filterType = IconItem.NoNeedFILTER_GRAY;
                this.equipIcons[i].m_effectRule = EnumEffectRule.normal;
                numComplete++;
                lineText.text = TextFieldUtil.getColorText("已激活", Color.GREEN);
                underLine.SetActive(false);
            }
            let thingConfig: GameConfig.ThingConfigM = this.equipIcons[i].getConfig();
            nameText.text = thingConfig.m_szName;
            this.equipIcons[i].needEffectGrey = false;
            this.equipIcons[i].updateIcon();
        }

        let curEquipCollectStage = G.DataMgr.thingData.curEquipCollectStage;
        //战斗力加成显示
        //let num = G.DataMgr.thingData.getEquipSuitsCount(this.curSelectStage);
        //this.txtFight.text = EquipUtils.getUpLevelFight(num, this.curSelectStage).toString();
        let sumFight: number = 0;
        //装备基础战力
        let equipObject: { [pos: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let itemDate: ThingItemData;
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            itemDate = equipObject[i];
            if (itemDate != null) {
                sumFight += itemDate.zdl;
            }
        }
        //套装加成战力 在还没有开始收集时 当前收集的套装是0 之后从1开始...
        let curStrengthenFight: number = 0;
        let suitInfo = G.DataMgr.equipStrengthenData.equipSuitInfo;
        let curStage = suitInfo.m_ucStage;
        if (curStage != 0) {
            //数量索引 0-8 1-8 2-0 3-0 4-4 5-4 6-2 7-2 8-3
            let curIndex = (suitInfo.m_ucNum / 2) - 1;
            let info: GameConfig.EquipAllColorPropM[] = null;
            if (curIndex == -1) {
                //上一阶的满装属性
                if (curStage != 1) {
                    info = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(suitInfo.m_ucStage - 1);
                    let propInfo = info[8].m_astPropAtt;
                    curStrengthenFight = FightingStrengthUtil.calStrength(propInfo);
                }
            }
            else {
                info = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(suitInfo.m_ucStage);
                let propInfo = info[curIndex].m_astPropAtt;
                curStrengthenFight = FightingStrengthUtil.calStrength(propInfo);
            }
        }
        sumFight += curStrengthenFight;
        this.txtFight.text = sumFight.toString();

        if (this.equipView != null) {
            //总战力
            this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        }
        //套装属性的显示
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(this.curSelectStage);
        this.propList.Count = colorList.length;
        let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(KeyWord.SPECPRI_EQUIPSUIT_ADD);

        for (let i = 0; i < this.propList.Count; i++) {
            if (this.equipCollectPropItem[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.equipCollectPropItem[i] = new EquipCollectPropItem();
                this.equipCollectPropItem[i].setComponent(item);
            }
            this.equipCollectPropItem[i].update(colorList[i], numComplete, i, specialPriAddPct);
        }
        //激活数量显示
        let color = numComplete == colorList[this.propList.Count - 1].m_ucNum ? Color.GREEN : Color.GREY;
        this.txtPropertyNumber.text = TextFieldUtil.getColorText("(", color)
            + TextFieldUtil.getColorText(numComplete.toString(), numComplete == 0 ? Color.GREY : Color.GREEN)
            + TextFieldUtil.getColorText("/", color)
            + TextFieldUtil.getColorText(colorList[this.propList.Count - 1].m_ucNum.toString(), color)
            + TextFieldUtil.getColorText(")", color);


        let dressId = EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID);
        this.curDressID = dressId;
        let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(dressId);


        this.txtShiZhuang.text = cfg.m_szModelName;
        //this.shizhuangTipMark.SetActive(TipMarkUtil.oneShiZhuangCanQH(dressId));
        //let fashionFight = FightingStrengthUtil.calStrength(cfg.m_astProp);
        if (this.curSelectStage != suitInfo.m_ucStage) {
            //套装战斗力
            this.txtFashionFight.text = FightingStrengthUtil.calStrength(colorList[3].m_astPropAtt).toString();
            this.imgIntactEquip.enabled = true;
            this.imgScatteredEquip.enabled = false;
        }
        else {
            //时装战斗力
            this.txtFashionFight.text = curStrengthenFight.toString();
            this.imgIntactEquip.enabled = false;
            this.imgScatteredEquip.enabled = true;
        }

        this.handelBtnStatus(numComplete, colorList, byResp);
        this.setRoleAvaterStage(dressId);
        this.updateCollectProgress();
    }


    private handelBtnStatus(numComplete: number, colorList: GameConfig.EquipAllColorPropM[], byResp: boolean) {

        let data = G.DataMgr.equipStrengthenData.equipSuitInfo;

        if (this.curSelectStage < data.m_ucStage) {
            //当前选择的阶级 < 服务端存储的阶级
            UIUtils.setButtonClickAble(this.btnActive, false);
            this.txtActiveLabel.text = "已激活";
            // 进行下一步指引
            G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickActive);
            return;
        }
        else if (this.curSelectStage == data.m_ucStage) {
            //当前选择的阶级 = 服务端存储的阶级
            if (this.curGradeIsActive[data.m_ucStage] && data.m_ucNum == 8) {
                //是否已经激活了时装
                UIUtils.setButtonClickAble(this.btnActive, false);
                this.txtActiveLabel.text = "已激活";
                // 进行下一步指引
                G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickActive);
                return;
            }
            //没有激活时装

            for (let i = 0; i < colorList.length; i++) {
                //当前收集的>=限制
                if (numComplete >= colorList[i].m_ucNum) {
                    if (data.m_ucNum < colorList[i].m_ucNum) {
                        UIUtils.setButtonClickAble(this.btnActive, true);
                        this.actNextNum = colorList[i].m_ucNum;
                        this.actDress = 0;
                        this.txtActiveLabel.text = "激活属性";
                        return;
                    } else if (data.m_ucNum == 8) {
                        UIUtils.setButtonClickAble(this.btnActive, true);
                        this.actNextNum = data.m_ucNum;
                        this.txtActiveLabel.text = "激活时装";
                        this.actDress = 1;
                        return;
                    }
                }
            }
        }
        else {
            //当前选择的阶级 > 服务端存储的阶级
            //如果当前选择-服务端>1,表示不可激活，等于1，先判断服务端阶级是否激活时装，没激活时装=>不可激活，激活时装=>判断收集进度

            let value = this.curSelectStage - data.m_ucStage;
            if (value > 1) {
                UIUtils.setButtonClickAble(this.btnActive, false);
                // 进行下一步指引
                G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickActive);
                this.txtActiveLabel.text = "激活";
                return;
            } else {

                //一次都没有激活
                if (data.m_ucStage == 0 && numComplete >= colorList[0].m_ucNum) {
                    UIUtils.setButtonClickAble(this.btnActive, true);
                    this.txtActiveLabel.text = "激活属性";
                    this.actNextNum = colorList[0].m_ucNum;
                    this.actDress = 0;
                    return;
                }
                else if (this.curGradeIsActive[data.m_ucStage] == true && numComplete >= colorList[0].m_ucNum && data.m_ucNum == 8) {
                    //当前已激活，下一阶未激活
                    UIUtils.setButtonClickAble(this.btnActive, true);
                    this.txtActiveLabel.text = "激活属性";
                    this.actNextNum = colorList[0].m_ucNum;
                    this.actDress = 0;
                    return;
                }
            }
        }
        this.actNextNum = -1;
        this.txtActiveLabel.text = "激活";
        UIUtils.setButtonClickAble(this.btnActive, false);
        // 进行下一步指引
        if (!byResp) {
            // 如果是点了激活按钮回复后进来这里的，等会在updateByEquipCollectResp会处理这一指引步骤
            // 否则指引会跳过点击时装台子那一步
            G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickActive);
        }
    }


    /**
     * 更新收集进度
     */
    private updateCollectProgress() {
        let data = G.DataMgr.equipStrengthenData.equipSuitInfo;

        if (data.m_ucStage == this.curSelectStage) {
            // 服务端给的阶级== 当前选择
            for (let i = 0; i < this.MAXPROGRESS; i++) {
                this.progressObjs[i].SetActive(i < data.m_ucNum / 2);
            }
            if (data.m_ucNum == 8) {
                this.equipCollectFull.SetActive(true);
            } else {
                this.equipCollectFull.SetActive(false);
            }

            for (let i = 0; i < this.MAXPROGRESS - 1; i++) {
                this.duanEffects[i].SetActive(i < data.m_ucNum / 2)
            }

        } else if (data.m_ucStage > this.curSelectStage) {
            //服务端给的阶级 > 当前选择
            for (let i = 0; i < this.MAXPROGRESS; i++) {
                this.progressObjs[i].SetActive(true);
            }
            this.equipCollectFull.SetActive(true);

            for (let i = 0; i < this.MAXPROGRESS - 1; i++) {
                this.duanEffects[i].SetActive(true)
            }

        } else {
            //服务端给的阶级 < 当前选择
            for (let i = 0; i < this.MAXPROGRESS; i++) {
                this.progressObjs[i].SetActive(false);
            }
            this.equipCollectFull.SetActive(false);
            for (let i = 0; i < this.MAXPROGRESS - 1; i++) {
                this.duanEffects[i].SetActive(false)
            }
        }

    }

    /**点击获取条件进入场景*/
    private onMouseUp(): void {
        let indexOf = this.urlObjs.indexOf(Game.UIClickListener.target);
        let dataList: GameConfig.GetEquipCfgM[] = ThingData.getGodEquipCfgs(this.curSelectStage);
        let config: GameConfig.GetEquipCfgM = dataList[indexOf];

        if (G.ActionHandler.executeFunction(config.m_iFunction)) {
            G.Uimgr.closeForm(EquipView);
        }
    }

    private setRoleAvaterStage(dressId: number): void {
        let heroData = G.DataMgr.heroData;
        //时装显示
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        this.m_avatarList.m_uiDressImageID = dressId;
        this.m_avatarList.m_ucColorLevel = EquipUtils.getEquipCollectColorByType(this.curSelectStage);
        if (null == this.roleAvatar) {
            this.rolePosition.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender, true, 0);
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.ShenZhuangShouJi_ClickActive == step) {
            this.onClickActive();
            return true;
        }
        //else if (EnumGuide.ShenZhuangShouJi_ClickEnter == step) {
        //    this.onClickProperty();
        //    return true;
        //}
        return false;
    }
}

