import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { ZhufuData } from 'System/data/ZhufuData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { IconItem } from "System/uilib/IconItem"
import { ResUtil } from "System/utils/ResUtil";


export class GrowUpDrugTipView extends CommonForm {

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private btnUse: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private bar: UnityEngine.RectTransform;
    private txtTitle: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private txtHave: UnityEngine.UI.Text;
    private imgNeed: UnityEngine.UI.RawImage;
    private imgHave: UnityEngine.UI.RawImage;
    private textProgress: UnityEngine.UI.Text;
    private txtDes: UnityEngine.UI.Text;
    private txtGetDes: UnityEngine.UI.Text;
    private itemIcon_Normal: UnityEngine.GameObject;

    private iconItem: IconItem;

    /**0表示成长丹，1资质丹*/
    private index: number = -1;

    /**面板关键字*/
    private keyordId: number;

    constructor() {
        super(0);
    }

    layer() {
        return UILayer.OnlyTip;
    }

    protected resPath(): string {
        return UIPathData.GrowUpDrugTipView;
    }

    protected initElements() {
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
        this.btnUse = this.elems.getElement("btnUse");
        this.icon = this.elems.getElement("icon");
        this.bar = this.elems.getRectTransform("bar");
        this.txtTitle = this.elems.getText("txtTitle");
        this.txtName = this.elems.getText("txtName");
        this.txtHave = this.elems.getText("txtHave");
        this.imgHave = this.elems.getRawImage("iconHave");
        this.imgNeed = this.elems.getRawImage("iconNeed");

        this.textProgress = this.elems.getText("textProgress");
        this.txtDes = this.elems.getText("txtDes");
        this.txtGetDes = this.elems.getText("txtGetDes");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);

    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
        this.addClickListener(this.btnUse, this.onClickUse);
    }

    open(keywordId: number, index: number) {
        this.keyordId = keywordId;
        this.index = index;
        super.open();
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {

    }

    private onClickClose() {
        this.close();
    }


    private onClickUse() {
        if (this.index == 0 && G.DataMgr.zhufuData.canEatCzd(this.keyordId)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuDanRuquest(KeyWord.HERO_SUB_DRUG_TYPE_CZ, this.keyordId));
        } else if (this.index == 1 && G.DataMgr.zhufuData.canEatZzd(this.keyordId)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuDanRuquest(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, this.keyordId));
        }
    }

    updateView() {

        let config: GameConfig.ZhuFuDrugConfigM;
        let thingConfig: GameConfig.ThingConfigM;
        let color: string;
        if (this.index == 0) {
            this.txtTitle.text = "成长丹";
            config = G.DataMgr.zhufuData.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_CZ, this.keyordId);
        } else {
            this.txtTitle.text = "资质丹";
            config = G.DataMgr.zhufuData.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, this.keyordId);
        }
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.keyordId);
        let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, this.keyordId);
        if (data != null) {
            thingConfig = ThingData.getThingConfig(config.m_iItemID);
            color = Color.getColorById(thingConfig.m_ucColor);
            let name = TextFieldUtil.getColorText(thingConfig.m_szName, color);
            this.txtName.text = name;

            let thingNum = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            let colorNum = thingNum > 0 ? Color.GREEN : Color.RED;

            this.txtHave.text = TextFieldUtil.getColorText(thingNum.toString(), colorNum);



            let des = thingConfig.m_szDesc;
            this.txtDes.text = RegExpUtil.xlsDesc2Html(thingConfig.m_szDesc);

            let getDes = RegExpUtil.xlsDesc2Html(thingConfig.m_szSpecDesc);
            this.txtGetDes.text = getDes;

            let progress: number;
            if (this.index == 0) {
                progress = data.m_uiSXDrugCount / (config.m_iLevelMax * stage);
                this.textProgress.text = data.m_uiSXDrugCount + '/' + config.m_iLevelMax * stage;
            } else {
                progress = data.m_uiZZDrugCount / (config.m_iLevelMax * stage);
                this.textProgress.text = data.m_uiZZDrugCount + '/' + config.m_iLevelMax * stage;
            }

            Game.Tools.SetLocalScale(this.bar, progress, 1, 1);

            this.iconItem.updateByItemConfig(thingConfig);
            this.iconItem.updateIcon();
            G.ResourceMgr.loadIcon(this.imgHave, (ResUtil.getIconID(thingConfig.m_szIconID, 28)), -1);
            G.ResourceMgr.loadIcon(this.imgNeed, (ResUtil.getIconID(thingConfig.m_szIconID, 28)), -1);

        }
    }
}