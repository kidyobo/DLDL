import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { KaifuSignItemData } from 'System/data/vo/KaifuSignItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ZhufuData } from 'System/data/ZhufuData'
import { HeroAttItemData } from "System/hero/HeroAttItemData"
import { PropUtil } from "System/utils/PropUtil"
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { Constants } from 'System/constants/Constants'
import { DataFormatter } from "System/utils/DataFormatter"
import { VipView, VipTab } from "System/vip/VipView"

class ShenZhuangShenQiItem {
    private readonly Max_Lv = 20;

    private txtName: UnityEngine.UI.Text;
    private status: UnityEngine.GameObject;
    private headImg: UnityEngine.UI.RawImage;
    private txtStage: UnityEngine.UI.Text;

    private itemName: string;
    private canPy: boolean = false;
    private hasGet: boolean = false;
    private isHuaXingZhong: boolean = false;
    private obj: UnityEngine.GameObject;
    private iconId: string;
    private lastIconId: string;

    setComponents(go: UnityEngine.GameObject) {
        this.obj = go;
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtStage = ElemFinder.findText(go, "txtStage");
        this.status = ElemFinder.findObject(go, "status");
        this.headImg = ElemFinder.findRawImage(go, "headImg"); 
    }

    updateById(id: number) {
       
        this.isHuaXingZhong = false;
        this.hasGet = false;
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        if (id > 10000) {
            let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(id);
            this.itemName = cfg.m_szModelName;
            this.canPy = G.DataMgr.thingData.checkThingIDForZhufu(cfg.m_iZhuFuID, id);
            let zhufuInfo: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(cfg.m_iZhuFuID, id);
            if (zhufuData.isActive(cfg.m_iZhuFuID, id)) {
                this.hasGet = true;
                if (zhufuData.isDress(cfg.m_iZhuFuID, id)) {
                    this.isHuaXingZhong = true;
                }
            }
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (zhufuInfo != null) {
                if (zhufuInfo.m_uiTimeOut != 0 && zhufuInfo.m_uiTimeOut <= current) {
                    this.hasGet = false;
                }
                this.txtStage.text = uts.format("{0}/{1}", zhufuInfo.m_iLevel, this.Max_Lv);
            } else {
                this.txtStage.text = "";
            }

            this.iconId = this.getModelUrl(cfg.m_iModelID);
        }
    }

    updateByCfg(cfg: GameConfig.ZhuFuConfigM) {
        this.iconId = this.getModelUrl(cfg.m_iModelID);
        this.isHuaXingZhong = false;
        this.hasGet = false;
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        this.canPy = false;
        this.itemName = cfg.m_szName;
        if (zhufuData.isActive(cfg.m_ucType, cfg.m_iID)) {
            this.hasGet = true;
            if (zhufuData.isDress(cfg.m_ucType, cfg.m_iID)) {
                this.isHuaXingZhong = true;
            }
        }
        this.txtStage.text = "";
    }
    updateView(): void {
        this.txtName.text = this.itemName;
        this.status.SetActive(this.isHuaXingZhong);
        UIUtils.setGrey(this.obj, !this.hasGet);

        if (this.lastIconId != this.iconId) {
            this.lastIconId = this.iconId;
            G.ResourceMgr.loadImage(this.headImg, uts.format('images/weapon/{0}.png', this.iconId));
        }

    }

    private getModelUrl(id: number): string {
        return id.toString() + "_" + G.DataMgr.heroData.profession;
    }

   
}


export class ShenZhuangShenQiPanel extends TabSubForm {

    private readonly Max_Lv = 20;
    private readonly panelType = KeyWord.HERO_SUB_TYPE_WUHUN;

    private list: List;
    private modelRoot: UnityEngine.GameObject;
    private txtTitle: UnityEngine.UI.Text;
    private txtCondition: UnityEngine.UI.Text;
    private btnGoTo: UnityEngine.GameObject;

    private selectIndex: number;
    /**打开面板时指定要显示的image id*/
    private openId: number = 0;
    private leftTime: number = 0;
    private huanhuazhuFuData = [];
    private oldhuanhuazhuFuData = [];
    private oldmodelURL: string;
    private m_allProps: GameConfig.EquipPropAtt[] = [];
    private attListData: HeroAttItemData[] = [];
    private attListDic: { [key: number]: HeroAttItemData };
    private cfg: GameConfig.ZhuFuImageConfigM;

    private txtFight: UnityEngine.UI.Text;
    private m_scoreValue: number;
    private set scoreValue(value: number) {
        if (this.m_scoreValue != value) {
            this.m_scoreValue = value;
            this.txtFight.text = value.toString();
        }
    }

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SHENZHUANG_SHENQI);
    }

    protected resPath(): string {
        return UIPathData.ShenZhuangShenQiPanel;
    }


    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.list.onVirtualItemChange = delegate(this, this.onUpdateItem);
        this.modelRoot = this.elems.getElement("modelRoot2");
        this.txtTitle = this.elems.getText("txtTitle");
        this.txtFight = this.elems.getText("txtFight");
        this.txtCondition = this.elems.getText("txtCondition");
        this.btnGoTo = this.elems.getElement("btnGoTo");
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickListItem);
        this.addClickListener(this.btnGoTo, this.onClickGoto);
    }


    protected onOpen() {
        this.list.SetSlideAppearRefresh();
        this.updatePanel();
    }


    protected onClose() {

    }

    private onClickGoto() {
        if (this.cfg && this.cfg.m_iFuncID > 0) {
            if (this.cfg.m_iFuncID == KeyWord.OTHER_FUNCTION_VIPREBATE) {
                G.Uimgr.createForm<VipView>(VipView).open(VipTab.Reward);
            } else {
                G.ActionHandler.executeFunction(this.cfg.m_iFuncID);
            }
        }
    }

    private onClickListItem(index: number) {
        this.selectIndex = index;

        let selectData = this.huanhuazhuFuData[index];
        if (typeof (selectData) == "number") {
            this.updateSpecialPanel(selectData);
        }
        else {
            this.updateJinJiePanel(selectData);
        }
    }

    private onUpdateItem(item: ListItem) {
        let index = item._index;
        let data = this.huanhuazhuFuData[index];
        let huanhuaitem = item.data.huanhuaitem as ShenZhuangShenQiItem;
        if (!huanhuaitem) {
            let obj = this.list.GetItem(index).gameObject;
            huanhuaitem = new ShenZhuangShenQiItem();
            huanhuaitem.setComponents(obj);
            item.data.huanhuaitem = huanhuaitem;
        }

        let byid = typeof (data) == "number";
        if (byid) {
            huanhuaitem.updateById(data);
        }
        else {
            huanhuaitem.updateByCfg(data);
        }
        huanhuaitem.updateView();
    }

    private updatePanel() {

        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.panelType);
        if (data == null) {
            uts.log("未初始化");
            return;
        }
        let selectedindex = 0;
        let checkID = this.openId;
        if (this.openId == 0) {
            checkID = zhufuData.getImageUnLevelID(data.m_uiShowID);
        }
        let images: number[] = zhufuData.getImageID(this.panelType);

        let zhuFuData = [];
        //进阶外形
        let selectCfg: GameConfig.ZhuFuConfigM;
        let unsameArray: number[] = [];
        this.huanhuazhuFuData = [];
        let activeList = [];
        let inactiveList = [];
        let cfgs: { [key: number]: GameConfig.ZhuFuConfigM } = zhufuData.getConfigs(this.panelType);
        for (let key in cfgs) {
            let cfg = cfgs[key];
            if (cfg.m_iModelID != 0 && unsameArray.indexOf(cfg.m_iModelID) == -1) {
                //过滤重复模型
                unsameArray.push(cfg.m_iModelID);
                if (zhufuData.isActive(this.panelType, cfg.m_iID)) {
                    activeList.push(cfg);
                }
                else {
                    inactiveList.push(cfg);
                }
            }
        }
        activeList.sort(ZhufuData.huanHuaJinJieCompare);
        inactiveList.sort(ZhufuData.huanHuaJinJieCompare);

        //特殊外形
        let iddata = zhufuData.getImageID(this.panelType);
        iddata.sort(ZhufuData.huanHuaSpecialCompare);
        let thingData = G.DataMgr.thingData;
        for (let i = 0, len = iddata.length; i < len; i++) {
            let data = iddata[i];
            if (zhufuData.isActive(this.panelType, data)) {
                if (i == 0 && zhufuData.isDress(this.panelType, data)) {
                    activeList.splice(0, 0, data);
                }
                else {
                    activeList.push(data);
                }
                let unlevelID = zhufuData.getImageUnLevelID(data);
                let index = unsameArray.indexOf(unlevelID);
                if (index != -1) {
                    inactiveList.splice(index, 1);
                }
                unsameArray.push(unlevelID);
            }
            else {
                let unlevelID = zhufuData.getImageUnLevelID(data);
                if (data != 0 && unsameArray.indexOf(unlevelID) == -1) {
                    //过滤重复模型
                    unsameArray.push(unlevelID);

                    let have = thingData.checkThingIDForZhufu(this.panelType, data);
                    if (have) {
                        inactiveList.splice(0, 0, zhufuData.getImageLevelID(unlevelID, 1));
                    }
                    else {
                        inactiveList.push(zhufuData.getImageLevelID(unlevelID, 1));
                    }
                }
            }
        }
        for (let i of activeList) {
            this.huanhuazhuFuData.push(i);
        }
        for (let i of inactiveList) {
            this.huanhuazhuFuData.push(i);
        }
        this.list.Count = this.huanhuazhuFuData.length;

        for (let i = 0; i < this.huanhuazhuFuData.length; i++) {
            let data = this.huanhuazhuFuData[i];
            let byid = typeof (data) == "number";
            if (byid) {
                if (checkID == zhufuData.getImageUnLevelID(data)) {
                    selectedindex = i;
                }
            }
            else {
                if (checkID == (data as GameConfig.ZhuFuConfigM).m_iID) {
                    selectedindex = i;
                }
            }
        }


        if (this.list.Selected != selectedindex) {
            this.list.Selected = selectedindex;
        }
        if (this.oldhuanhuazhuFuData.length == this.huanhuazhuFuData.length) {
            for (let i = 0, len = this.oldhuanhuazhuFuData.length; i < len; i++) {
                let a = this.oldhuanhuazhuFuData[i];
                let b = this.huanhuazhuFuData[i];
                if (a != b) {
                    if (typeof (a) == "number" && typeof (b) == "number") {
                        if (zhufuData.getImageUnLevelID(a) != zhufuData.getImageUnLevelID(b)) {
                            this.list.ScrollByAxialRow(selectedindex);
                        }
                    }
                    else {
                        this.list.ScrollByAxialRow(selectedindex);
                    }
                    break;
                }
            }
        }
        else {
            this.list.ScrollByAxialRow(selectedindex);
        }
        this.list.Refresh();
        this.oldhuanhuazhuFuData = this.huanhuazhuFuData;
        let selectData = this.huanhuazhuFuData[selectedindex];
        if (typeof (selectData) == "number") {
            this.updateSpecialPanel(selectData);
        }
        else {
            this.updateJinJiePanel(selectData);
        }
        this.openId = 0;

        this.txtTitle.text = uts.format("已激活神器：{0}/{1}", activeList.length, this.huanhuazhuFuData.length)
    }

    private updateSpecialPanel(cfgId: number) {
        let oldTime: number = this.leftTime;
        let zhufuData = G.DataMgr.zhufuData;
        let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(cfgId);
        this.cfg = cfg;
        this.btnGoTo.SetActive(this.cfg != null && this.cfg.m_iFuncID > 0);
        let id = cfg.m_iModelID;
        let isActive: boolean = false;
        let modelUrl = this.getModelUrl(id);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.m_allProps = cfg.m_astProp;

        if (zhufuData.isActive(this.panelType, cfgId)) {
            isActive = true;
            let dressOneImage: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(this.panelType, cfgId);
            cfg = zhufuData.getImageConfig(cfgId);
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            this.leftTime = 0;
            let data: Protocol.CSHeroSubSuper = zhufuData.getData(this.panelType);
            if (dressOneImage.m_uiTimeOut == 0) {
                if (dressOneImage.m_uiImageID == Macros.GUILD_PVP_CHAIRMAN_SHENQI_IMGID ||
                    dressOneImage.m_uiImageID == Macros.GUILD_PVP_CHAIRMAN_ZUOQI_IMGID ||
                    dressOneImage.m_uiImageID == Macros.GUILD_PVP_GUILD_VICE_ZUOQI_IMGID) {
                    this.txtCondition.text = '持续时间:下次活动结束重置';
                }
                else {
                    this.txtCondition.text = Constants.S_YONGJIU;
                }
            }
            else if (dressOneImage.m_uiTimeOut <= current) {
                this.txtCondition.text = cfg.m_szCondition;
            }
            else {
                this.leftTime = dressOneImage.m_uiTimeOut;
                this.txtCondition.text = DataFormatter.second2day(dressOneImage.m_uiTimeOut - current);
            }
        }
        else {
            this.leftTime = 0;
            this.txtCondition.text = cfg.m_szCondition;
        }
        if (oldTime == 0 && this.leftTime != 0) {
            this.addTimer("upTimer", 1000, 0, this.onTime);
        }
        let dressOneImage: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(this.panelType, cfgId);

        let oldLevel = 0;
        let oldimageid = 0;
        //if (lastselect > 10000) {
        //    oldLevel = zhufuData.getImageLevel(lastselect);
        //    oldimageid = zhufuData.getImageUnLevelID(lastselect);
        //}
        let level = isActive ? zhufuData.getImageLevel(cfgId) : this.Max_Lv;
        let imageid = zhufuData.getImageUnLevelID(cfgId);
        let next = zhufuData.getImageLevelID(imageid, (dressOneImage == null || dressOneImage.m_uiTimeOut > 0 || !isActive) ? level : level + 1);
        let nextConfig = zhufuData.getImageConfig(next);

        if (nextConfig != null) {
            this.m_allProps = nextConfig.m_astProp;
            this.scoreValue = (FightingStrengthUtil.calStrength(nextConfig.m_astProp));
        } else {
            this.scoreValue = (FightingStrengthUtil.calStrength(cfg.m_astProp));
        }

        this.txtCondition.text = cfg.m_szCondition;
        this.updateAttList();
    }

    private updateJinJiePanel(cfg: GameConfig.ZhuFuConfigM) {
        this.cfg = null;
        this.btnGoTo.SetActive(this.cfg != null && this.cfg.m_iFuncID > 0);
        let modelUrl = this.getModelUrl(cfg.m_iModelID);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.m_allProps = cfg.m_astAttrList;
        this.txtCondition.text = uts.format('进阶到{0} 阶激活', ZhufuData.getZhufuStage(cfg.m_iID, this.panelType));
        this.updateAttList();
        this.scoreValue = (FightingStrengthUtil.calStrength(cfg.m_astAttrList));
    }

    private getModelUrl(id: number): string {
        return id.toString() + "_" + G.DataMgr.heroData.profession;
    }

    private lateLoadModel() {
        let type = UnitCtrlType.weapon;
        G.ResourceMgr.loadModel(this.modelRoot, type, this.oldmodelURL, this.sortingOrder, true);
    }

    private updateAttList(): void {
        this.attListData.length = 0;
        this.attListDic = {};
        let allPropData: HeroAttItemData[] = [];
        for (let prop of this.m_allProps) {
            if (prop.m_ucPropId) {
                var itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                var macroId: number = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                itemVo.macroId = macroId;
                itemVo.addVal = prop.m_ucPropValue;
                allPropData.push(itemVo);
            }
        }
        //战斗力
        //  this.scoreValue = (FightingStrengthUtil.calStrength(this.m_allProps));
    }

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

    private onTime(): void {
        if (this.leftTime > 0) {
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (this.leftTime > current) {
                this.txtCondition.text = DataFormatter.second2day(this.leftTime - current);
            }
            else {
                this.txtCondition.text = '已经过期';
                this.leftTime = 0;
                // this.updateSpecialPanel(this.selectedCFGID);
                this.removeTimer("upTimer");
            }
        }
        else {
            this.removeTimer("upTimer");
        }
    }

}