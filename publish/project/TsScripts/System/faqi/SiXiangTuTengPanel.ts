import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { SiXiangBasePanel } from 'System/faqi/SiXiangBasePanel'
import { KeyWord } from "System/constants/KeyWord"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { SiXiangData, SiXiangJinJieItemData } from 'System/data/SiXiangData'
import { EnumActivateState } from 'System/constants/GameEnum'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { FaQiView } from 'System/faqi/FaQiiView'
import { SiXiangFaQiView } from 'System/faqi/SiXiangFaQiView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { RegExpUtil } from 'System/utils/RegExpUtil'

class SiXiangBall {
    bg: UnityEngine.GameObject;

    private textName: UnityEngine.UI.Text;
    private textProps: UnityEngine.UI.Text;
    private textProgress: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;

    id = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.textProps = ElemFinder.findText(go, 'textProps');
        this.textProgress = ElemFinder.findText(go, 'textProgress');
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.bg = ElemFinder.findObject(go, 'bg');
    }

    init(id: number) {
        this.id = id;
        this.textName.text = uts.format('{0}光环属性', SiXiangData.Names[id - 1]);
    }

    update(itemData: SiXiangJinJieItemData) {
        UIUtils.setGrey(this.bg, EnumActivateState.activated != itemData.activateState);
        if (EnumActivateState.activated == itemData.activateState) {
            // 已激活
            this.textStage.text = uts.format('{0}阶', DataFormatter.toHanNumStr(itemData.cfg.m_iSeasonLevel));
            this.textStage.gameObject.SetActive(true);
            this.textProgress.gameObject.SetActive(false);
            let halos = itemData.cfg.m_astHalo;
            this.textProps.text = uts.format('{0}%{1} {2}%{3}', Math.round(halos[0].m_ucPropValue / 100), KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, halos[0].m_ucPropId),
                Math.round(halos[1].m_ucPropValue / 100), KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, halos[1].m_ucPropId));
        } else {
            // 未激活
            this.textStage.gameObject.SetActive(false);
            this.textProgress.text = TextFieldUtil.getColorText(uts.format('碎片{0}/{1}', G.DataMgr.thingData.getThingNumInsensitiveToBind(itemData.cfg.m_iActID), itemData.cfg.m_iActNumber),
                EnumActivateState.canActivate == itemData.activateState ? Color.GREEN : Color.RED);
            this.textProgress.gameObject.SetActive(true);
            this.textProps.text = '激活神兽获得';
        }
    }
}

class SiXiangChain {
    private effect: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.effect = ElemFinder.findObject(go, 'effect');
    }

    update(enabled: boolean) {
        this.effect.SetActive(enabled);
    }
}

class SiXiangFaQi {
    gameObject: UnityEngine.GameObject;

    private add: UnityEngine.GameObject;
    private lock: UnityEngine.GameObject;
    private head: UnityEngine.UI.Image;

    position = 0;
    private limited = false;

    constructor(position: number) {
        this.position = position;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.add = ElemFinder.findObject(go, 'add');
        this.lock = ElemFinder.findObject(go, 'lock');
        this.head = ElemFinder.findImage(go, 'head');
    }

    update(limited: boolean, cfg: GameConfig.FaQiCfgM, altas: Game.UGUIAltas) {
        this.limited = limited;
        if (limited) {
            // 未激活
            this.lock.SetActive(true);
            this.add.SetActive(false);
            this.head.gameObject.SetActive(false);
        } else {
            this.lock.SetActive(false);
            if (null != cfg) {
                this.add.SetActive(false);
                this.head.gameObject.SetActive(true);
                this.head.sprite = altas.Get(cfg.m_szName);
            } else {
                this.add.SetActive(true);
                this.head.gameObject.SetActive(false);
            }
        }
    }

    get Limited(): boolean {
        return this.limited;
    }
}

export class SiXiangTuTengPanel extends SiXiangBasePanel {
    private balls: SiXiangBall[] = [];
    private ballDatas: SiXiangJinJieItemData[] = [];

    private propItems: PetPropItem[] = [];
    private faqis: SiXiangFaQi[] = [];
    private chains: SiXiangChain[] = [];

    private altas: Game.UGUIAltas;
    private faQiAltas: Game.UGUIAltas;

    private btnRule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG);
    }

    protected resPath(): string {
        return UIPathData.SiXiangTuTengView;
    }

    protected initElements(): void {
        this.btnRule = this.elems.getElement('btnRule');

        this.altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.faQiAltas = this.elems.getElement('faQiAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let ballGo = this.elems.getElement('ball' + i);
            let ball = new SiXiangBall();
            ball.setComponents(ballGo);
            ball.init(i + 1);
            this.balls.push(ball);

            this.ballDatas.push(new SiXiangJinJieItemData());
        }

        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let faqiGo = this.elems.getElement('faqi' + i);
            let faqi = new SiXiangFaQi(i + 1);
            faqi.setComponents(faqiGo);
            this.faqis.push(faqi);
        }

        let props = this.elems.getElement('props');
        for (let i = 0; i < SiXiangData.TotalCnt * 2; i++) {
            let propGo = ElemFinder.findObject(props, i.toString());
            let propItem = new PetPropItem();
            propItem.setUsual(propGo);
            this.propItems.push(propItem);
        }
        
        for (let i = 0; i < SiXiangData.TotalCnt * 2; i++) {
            let chainGo = this.elems.getElement('chain' + i);
            let chain = new SiXiangChain();
            chain.setComponents(chainGo);
            this.chains.push(chain);
        }
    }

    protected initListeners(): void {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let ball = this.balls[i];
            this.addClickListener(ball.bg, delegate(this, this.onClickBall, ball.id));

            let faqi = this.faqis[i];
            this.addClickListener(faqi.gameObject, delegate(this, this.onClickFaQi, faqi.position));
        }
    }


    protected onOpen() {
        this.updateView();
    }

    protected onClose() {

    }

    onShenShouChange() {
        this.updateView();
    }

    onContainerChange(type: number) {
        if (Macros.CONTAINER_TYPE_ROLE_BAG == type) {
            this.updateView();
        }
    }

    private updateView() {
        let siXiangData = G.DataMgr.siXiangData;
        let faQiData = G.DataMgr.fabaoData;
        // 4个珠子
        let propValues: GameConfig.EquipPropAtt[] = [];
        let propMap: { [propId: number]: GameConfig.EquipPropAtt } = {};
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let ball = this.balls[i];
            let itemData = this.ballDatas[i];
            let info = siXiangData.getShenShouInfo(i + 1);
            let stage = 0;
            let exp = 0;
            if (null != info) {
                stage = info.m_ucLevel;
                exp = info.m_uiLayer;
            }
            let activateState = EnumActivateState.none;
            let cfg = siXiangData.getCfg(i + 1, stage);
            if (stage > 0) {
                activateState = EnumActivateState.activated;
                //this.mergeProps(cfg.m_astFixProp, exp / cfg.m_iLvXP, propValues, propMap);
                //this.mergeProps(cfg.m_astProp, 1, propValues, propMap);
            } else {
                activateState = 0 == G.ActionHandler.getLackNum(cfg.m_iActID, cfg.m_iActNumber, false) ? EnumActivateState.canActivate : EnumActivateState.cannotActivate;
            }

            itemData.activateState = activateState;
            itemData.cfg = cfg;
            itemData.stage = stage;
            itemData.exp = exp;
            ball.update(itemData);
        }

        // 4个宝物
        let funcLimitData = G.DataMgr.funcLimitData;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let faqi = this.faqis[i];
            let ss1 = this.ballDatas[SiXiangData.getShenShouId1ByFaQiPosition(faqi.position) - 1];
            let ss2 = this.ballDatas[SiXiangData.getShenShouId2ByFaQiPosition(faqi.position) - 1];

            let limited = EnumActivateState.activated != ss1.activateState &&
                EnumActivateState.activated != ss2.activateState;
            let faQiId = siXiangData.getFaQiIdAtPosition(i + 1);
            let faQiInfo: Protocol.FaQiInfo;
            let faQiCfg: GameConfig.FaQiCfgM;
            if (faQiId > 0) {
                faQiInfo = faQiData.getFaqiData(faQiId);
                faQiCfg  = faQiData.getFaqiConfig(faQiId, faQiInfo.m_ucLayer);
            }
            faqi.update(limited, faQiCfg, this.faQiAltas);
            this.chains[i * 2].update(faQiId > 0);
            this.chains[i * 2 + 1].update(faQiId > 0);

            // 计算光环属性
            if (faQiId > 0) {
                let soulCfg = faQiData.getFaqiZhuhunCfg(faQiId, faQiInfo.m_stZhuHunInfo.m_uiLevel);
                if (EnumActivateState.activated == ss1.activateState) {
                    this.mergeHaloProps(ss1.cfg.m_astHalo, faQiCfg, soulCfg, propValues, propMap);
                }
                if (EnumActivateState.activated == ss2.activateState) {
                    this.mergeHaloProps(ss2.cfg.m_astHalo, faQiCfg, soulCfg, propValues, propMap);
                }
            }
        }

        // 属性
        let propCnt = propValues.length;
        for (let i = 0; i < SiXiangData.TotalCnt * 2; i++) {
            let propItem = this.propItems[i];
            if (i < propCnt) {
                propItem.update(propValues[i].m_ucPropId, propValues[i].m_ucPropValue);
            } else {
                propItem.update(0, 0);
            }
        }
    }

    private onClickBall(id: number) {
        G.Uimgr.getForm<FaQiView>(FaQiView).switchTabFormById(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE, id);
    }

    private onClickFaQi(position: number) {
        let faqi = this.faqis[position - 1];
        if (!faqi.Limited) {
            G.Uimgr.createForm<SiXiangFaQiView>(SiXiangFaQiView).open(position);
        }
    }

    private onClickBtnRule() {
        let content = G.DataMgr.langData.getLang(403);
        content = RegExpUtil.xlsDesc2Html(content);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }
}