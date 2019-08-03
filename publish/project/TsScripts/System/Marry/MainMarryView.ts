import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { KeyWord } from 'System/constants/KeyWord'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumMarriage } from 'System/constants/GameEnum'
import { UIUtils } from 'System/utils/UIUtils'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { SendFlowerView } from 'System/Marry/SendFlowerView'
import { XianLvFuBenPanel } from 'System/Marry/XianLvFuBenPanel'

enum HunYinStage {
    shuijin = 15,
    jingangzuanhun = 60,
    zuanshihun = 80,
}

/**结婚面板*/
export class MainMarryView extends CommonForm {
    /**战斗力*/
    private fightText: UnityEngine.UI.Text;
    /**需要的甜蜜度*/
    private m_cost: number = 0;
    /**每阶级数*/
    private max_LevelStage: number = 9;
    private max_Level: number = 50;
    /**当前要升级的*/
    private m_currendIndex: number = 0;
    private processBar: UnityEngine.UI.Slider;
    private processBarText: UnityEngine.UI.Text;
    private btn_xiulian: UnityEngine.GameObject;
    private btn_xiuLianText: UnityEngine.UI.Text;
    private conditionDesText: UnityEngine.UI.Text;

    private propTexts: UnityEngine.UI.Text[] = [];
    private propRoot: UnityEngine.GameObject;

    private jinJieLevelTexts: UnityEngine.UI.Text[] = [];
    private jieJiRoot: UnityEngine.GameObject;

    private isOpenXianYuanSystem: boolean = false;

    private btn_sendFlower: UnityEngine.GameObject;
    private btn_fuben: UnityEngine.GameObject;
    private imageIcons: UnityEngine.UI.Image[] = [];
    private altas: Game.UGUIAltas;

    private yearText: UnityEngine.UI.Text;
    private yearIcon: UnityEngine.UI.Image;
    private yearRoot: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.BAR_FUNCTION_XIANYUAN);
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.MainMarryView;
    }

    protected initElements() {
        this.fightText = this.elems.getText('fightText');
        this.processBar = this.elems.getSlider('pressBar');
        this.processBarText = this.elems.getText('processText');
        this.btn_xiulian = this.elems.getElement('btn_xiulian');
        this.btn_xiuLianText = ElemFinder.findText(this.btn_xiulian, 'Text');
        this.conditionDesText = this.elems.getText('condition');
        this.propRoot = this.elems.getElement('props');
        this.jieJiRoot = this.elems.getElement('list');
        for (let i = 0; i < this.max_LevelStage; i++) {
            let propText = ElemFinder.findText(this.propRoot, i.toString());
            let levelText = ElemFinder.findText(this.jieJiRoot, uts.format("{0}/levelText", i));
            let image = ElemFinder.findImage(this.jieJiRoot, i.toString());
            this.imageIcons.push(image);
            this.propTexts.push(propText);
            this.jinJieLevelTexts.push(levelText);
        }
        this.btn_fuben = this.elems.getElement('btn_fuben');
        this.btn_sendFlower = this.elems.getElement('btn_songhua');
        this.altas = ElemFinderMySelf.findAltas(this.elems.getElement('altas'));
        this.yearText = this.elems.getText('yearText');
        this.yearIcon = this.elems.getImage('yearIcon');
        this.yearRoot = this.elems.getElement('zhounianBack');
    }

    protected initListeners() {
        this.addClickListener(this.btn_xiulian, this.onBtnUpClick);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btn_fuben, this.onClickMarryFuBen);
        this.addClickListener(this.btn_sendFlower, this.onClickSendFlower);
    }


    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_LIST_XIANYUAN));
        this.isOpenXianYuanSystem = G.DataMgr.heroData.mateName != '';
        this.conditionDesText.text = this.isOpenXianYuanSystem ? "情缘值可通过鲜花赠送，情缘副本获得" : "双方组队可前往爱神处结婚,结婚后可开启双修系统";
        this.btn_xiuLianText.text = this.isOpenXianYuanSystem ? "开始修炼" : "前往爱神";
        this.yearRoot.SetActive(this.isOpenXianYuanSystem);
        this.processBar.gameObject.SetActive(this.isOpenXianYuanSystem);
    }


    protected onClose() {

    }

    ////////////////////////点击事件处理/////////////////////////////

    /**点击修炼*/
    private onBtnUpClick(): void {
        if (this.isOpenXianYuanSystem) {
            if (G.DataMgr.heroData.honey < this.m_cost) {
                G.TipMgr.addMainFloatTip(uts.format("您的情缘值不足{0}", this.m_cost));
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_XIANYUAN_UPLEVEL));
        } else {
            G.Mapmgr.findPath2Npc(EnumMarriage.HONGNIANG_NPC, false, 0, false);
            this.close();
        }
    }

    /**送花*/
    private onClickSendFlower(): void {
        if (G.DataMgr.heroData.mateName == '') {
            G.TipMgr.addMainFloatTip('您当前没有仙侣');
            return;
        }
        let lover: Protocol.RoleLoverInfo = G.DataMgr.heroData.lover;
        //打开送花面板
        G.Uimgr.createForm<SendFlowerView>(SendFlowerView).open(lover.m_stBaseProfile.m_szNickName, lover.m_stID);
    }

    /**点击夫妻副本*/
    private onClickMarryFuBen(): void {
        if (G.DataMgr.heroData.inFuBen) {
            G.TipMgr.addMainFloatTip('请离开副本后在进行操作');
            return;
        }
        G.Uimgr.createForm<XianLvFuBenPanel>(XianLvFuBenPanel).open();
    }

    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    onListResponse(response: Protocol.Marriage_Response): void {
        if (response.m_usResultID == 0) {
            let xyLevle: number = 0;
            if (response.m_usType == Macros.HY_XIANYUAN_UPLEVEL) {
                xyLevle = response.m_stValue.m_usXYUpLevelRsp;
            }
            else if (response.m_usType == Macros.HY_LIST_XIANYUAN) {
                xyLevle = response.m_stValue.m_usXYLevel;
            }
            else {
                return;
            }
            //消耗取下一级(离婚的就显示满级属性,不能把按钮置灰)
            let config: GameConfig.XianYuanPropCfgM = G.DataMgr.zhufuData.getXianyuanConfig(xyLevle + 1);
            if (config == null) {
                if (this.isOpenXianYuanSystem) {
                    UIUtils.setButtonClickAble(this.btn_xiulian, false);
                } else {
                    UIUtils.setButtonClickAble(this.btn_xiulian, true);
                } 
                this.m_cost = 0;
            }
            else {
                UIUtils.setButtonClickAble(this.btn_xiulian, true);
                this.m_cost = config.m_uiConsumableNum;
            }
            this.onMoneyChange();
            //属性取当前阶级属性
            let proConfig: GameConfig.XianYuanPropCfgM = G.DataMgr.zhufuData.getXianyuanConfig(xyLevle);
            let props = proConfig.m_astProp;
            for (let i = 0; i < this.max_LevelStage; i++) {
                if (i < props.length) {
                    let propName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, props[i].m_ucPropId);
                    let propValue: number = 0;
                    if (xyLevle != 0) {
                        propValue = props[i].m_ucPropValue;
                    }
                    this.propTexts[i].text = propName + ':          ' + TextFieldUtil.getColorText(propValue.toString(), Color.GREEN);
                } else {
                    this.propTexts[i].text = '';
                }
            }
            let fight = xyLevle != 0 ? FightingStrengthUtil.calStrength(proConfig.m_astProp) : 0;
            this.fightText.text = fight.toString();
            this.updateLevel(xyLevle);
        }
    }

    onMoneyChange(id: number = KeyWord.HONEY_THING_ID): void {
        if (id != KeyWord.HONEY_THING_ID) {
            return;
        }
        this.processBar.value = G.DataMgr.heroData.honey / this.m_cost;
        this.processBarText.text = uts.format('{0}/{1}', G.DataMgr.heroData.honey, this.m_cost);
    }

    private updateLevel(xyLevle: number): void {
        //计算每颗心的数值
        let stage: number = Math.floor(xyLevle / this.max_LevelStage + 1) * this.max_LevelStage;
        let level: number = Math.floor(xyLevle % this.max_LevelStage);
        if (stage > 1) {
            let proConfig: GameConfig.XianYuanPropCfgM = G.DataMgr.zhufuData.getXianyuanConfig(stage - this.max_LevelStage);
        }
        let config: GameConfig.XianYuanPropCfgM = G.DataMgr.zhufuData.getXianyuanConfig(stage);
        for (let i = 0; i < this.max_LevelStage; i++) {
            //已激活级别
            if (level > i) {
                this.imageIcons[i].sprite = this.altas.Get('xingxian');
            }
            else {
                this.imageIcons[i].sprite = this.altas.Get('xingYin');
            }
            let stagelevel = Math.floor(stage / this.max_LevelStage);
            if (stagelevel > this.max_Level) {
                stagelevel = this.max_Level;
                this.imageIcons[i].sprite = this.altas.Get('xingxian');
            }
            this.jinJieLevelTexts[i].text = stagelevel + '级';
        }
        this.m_currendIndex = level;
        //网页上的(一周年：婚纸)
        let yearLevel: number = Math.floor(xyLevle / this.max_LevelStage);
        if (yearLevel >= 1) {
            if (!this.yearRoot.activeSelf) {
                this.yearRoot.SetActive(true);
            }
            this.yearText.text = DataFormatter.toHanNumStr(yearLevel);
            if (yearLevel > HunYinStage.shuijin) {
                //此时5年一个婚
                yearLevel = (Math.floor(yearLevel / 5)) * 5;
            } else if (yearLevel > HunYinStage.jingangzuanhun) {
                //此时10年一个婚
                yearLevel = (Math.floor(yearLevel / 10)) * 10;
            } else if (yearLevel >= HunYinStage.zuanshihun) {
                //最大婚姻
                yearLevel = HunYinStage.zuanshihun;
            }           
            this.yearIcon.sprite = this.altas.Get(yearLevel.toString());
            this.yearIcon.SetNativeSize();
        }
        else {
            this.yearRoot.SetActive(false);
        }
    }

}




