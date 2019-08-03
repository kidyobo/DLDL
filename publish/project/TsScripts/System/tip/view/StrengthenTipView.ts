import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { ElemFinder } from 'System/uilib/UiUtility'
import { PropUtil } from 'System/utils/PropUtil'
import { Global as G } from 'System/global'
import { ShengQiView } from 'System/shengqi/ShengQiView'
import { HeroView } from 'System/hero/view/HeroView'
import { JiuXingView } from 'System/jiuxing/JiuXingView'
import { JuYuanView } from 'System/juyuan/JuYuanView'
import { PetView } from 'System/pet/PetView'
import { SlotMachine } from 'System/uilib/SlotMachine'
import { KeyWord } from 'System/constants/KeyWord'

export class PropIDValue {
    propID: number;
    value: number;
    macrosID: number;
}


export class StrengthenTipView extends CommonForm {
    /**飘字的父容器*/
    private content: UnityEngine.GameObject;

    private proStrAarry: PropIDValue[] = [];

    private playShuxingCount: number = 0;

    /**最近一次常规飘字的时间戳*/
    private lastFloatAt: number = 0;
    private lastFight: number = 0;

    private shuxingItem: UnityEngine.GameObject;
    private fightItem: UnityEngine.GameObject;

    private txtFight: UnityEngine.UI.Text;
    private txtAdd: UnityEngine.UI.Text;
    private jiantou: UnityEngine.GameObject;

    //private shuxingAtals: Game.UGUIAltas;
    private shuxings: UnityEngine.UI.Text[] = [];
    private canFly: boolean = true;
    /**玩家总战斗力*/
    private totalFinght: number = 0;
    //上次战力加成
    private oldFinght: number = 0;

    private fightSlotMachine: SlotMachine;

    private finghtAnim: UnityEngine.Animator;
    private proText:{[id:number]:string}={};

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Effect;
    }
    protected resPath(): string {
        return UIPathData.StrengthenTipView;
    }

    protected initElements() {
        this.content = this.elems.getElement("content");
        this.fightItem = ElemFinder.findObject(this.content, "fight");
        this.finghtAnim = this.fightItem.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        this.txtFight = this.elems.getText("txtFight");
        this.txtAdd = this.elems.getText("txtAdd");
        this.jiantou = this.elems.getElement("jiantou");
        this.jiantou.SetActive(false);
        this.fightSlotMachine = new SlotMachine();
        this.fightSlotMachine.setComponent(this.txtFight, null);

        this.shuxingItem = ElemFinder.findObject(this.content, "shuxing");
        //this.shuxingAtals = this.elems.getElement("shuxingAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.fightItem.SetActive(false);
        this.shuxingItem.SetActive(false);
    }

    protected initListeners() {
    }

    protected onOpen() {

    }

    protected onClose() {

    }

    private checkFloat() {
        let cnt = this.proStrAarry.length;
        if (cnt > 0) {
            let nowTime = UnityEngine.Time.realtimeSinceStartup;
            if (nowTime - this.lastFloatAt > 0.2) {
                let strValue: PropIDValue = null;
                if (this.canFly) {
                    strValue = this.proStrAarry.shift();
                    if (strValue.macrosID != Macros.EUAI_FIGHT) {
                        this.cloneShuxingTip(strValue);
                    } else {
                        this.cloneFightTip(strValue);
                    }
                    this.lastFloatAt = nowTime;
                    cnt--;
                }
            }
        }
        if (cnt > 0) {
            //开启定时器
            this.addTimer("float", 250, 0, this.checkFloat);
        } else {
            this.removeTimer("float");
        }
    }

    //属性加成
    private cloneShuxingTip(data: PropIDValue) {
        let obj = UnityEngine.UnityObject.Instantiate(this.shuxingItem, this.content.transform, false) as UnityEngine.GameObject;
        obj.SetActive(true);
        let animator = obj.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        animator.Play("shuxingAnim");
        let infoText = ElemFinder.findText(obj, "Text");
        let imgShuXing = ElemFinder.findImage(obj, "bg/shuxingbg");
        let imgShuXing1 = ElemFinder.findImage(obj, "bg/shuxingbg1");
        infoText.text = uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.propID), data.value.toString());
     
        //11,12是伤害加成，伤害减免4个字，其他属性2个字
        //if (data.propID == 11 || data.propID == 12) {

        //    imgShuXing1.sprite = this.shuxingAtals.Get(data.propID.toString());
        //    imgShuXing1.gameObject.SetActive(true);
        //    imgShuXing.gameObject.SetActive(false);
        //} else {

        //    imgShuXing.sprite = this.shuxingAtals.Get(data.propID.toString());
        //    imgShuXing1.gameObject.SetActive(false);
        //    imgShuXing.gameObject.SetActive(true);
        //}

        Game.Invoker.BeginInvoke(obj, '1', 1, delegate(this, this.onShuxingAnimExit, obj));
    }

    private onShuxingAnimExit(obj: UnityEngine.GameObject) {
        UnityEngine.UnityObject.Destroy(obj, 0);
    }


    //战斗力加成
    private cloneFightTip(data: PropIDValue) {
        this.canFly = false;
        this.fightItem.SetActive(true);
        this.finghtAnim.Play("fightAnim");
        if (this.oldFinght > this.totalFinght) {
            this.txtFight.text = this.totalFinght.toString();
            this.jiantou.SetActive(false);

        } else {
            this.jiantou.SetActive(true);
            this.txtFight.text = (this.totalFinght - data.value).toString();
            this.txtAdd.text = data.value.toString();
        }

        this.oldFinght = this.totalFinght
        this.fightSlotMachine.rollTo(this.totalFinght);
        Game.Invoker.BeginInvoke(this.fightItem, '1', 1.2, delegate(this, this.onFightAnimExit, this.fightItem));
    }


    private onFightAnimExit(obj: UnityEngine.GameObject) {
        this.removeTimer("scroll");
        this.fightItem.SetActive(false);
        this.canFly = true;

        let data = G.DataMgr.heroData;
        this.totalFinght = data.getProperty(Macros.EUAI_FIGHT);
        if (this.proStrAarry.length == 0) {
            this.close();
        }
    }


    /**
	* 处理uac中涉及到跳字相关的
	* @param unitCtrl
	* @param uac
	*
	*/
    processUnitFloatWords(uac: Protocol.UnitAttributeChanged): void {
        let data = G.DataMgr.heroData;
        this.totalFinght = data.getProperty(Macros.EUAI_FIGHT);

        if (uac.m_ucNumber == 0) {
            return;
        }
        let mask = uac.m_uiMask;
        let macroId: number = 0;
        let info: PropIDValue;
        let j = 0;
        // 先检查低位掩码
        for (let i = 0; i < 32; i++) {
            if (j >= uac.m_ucNumber) {
                break;
            }
            if (mask % 2 == 1) {
                let curValue = uac.m_allDeltaValue[j];
                if (curValue > 0) {
                    macroId = i;
                    switch (i) {
                        case Macros.EUAI_MAXHP:
                        case Macros.EUAI_PHYATK:
                        case Macros.EUAI_MAGATK:
                        case Macros.EUAI_DEFENSE:
                        case Macros.EUAI_GOAL:
                        case Macros.EUAI_DODGE:
                        case Macros.EUAI_CRITICAL:
                        case Macros.EUAI_TOUGHNESS:
                        case Macros.EUAI_CRITICAL_HURT:
                        case Macros.EUAI_HURTEXTRA:
                        case Macros.EUAI_THROUGH:
                        case Macros.EUAI_MAGICRESIST:
                        case Macros.EUAI_FIGHT:
                            this.add2queue(i, curValue);
                            break;
                        default:
                    }
                }
                j++;
            }
            mask = Math.floor(mask / 2);
        }
        // 先检查高位掩码
        mask = uac.m_uiMask64;
        for (let i = 0; i < 32; i++) {
            if (j >= uac.m_ucNumber) {
                break;
            }
            if (mask % 2 == 1) {
                let curValue = uac.m_allDeltaValue[j];
                if (curValue > 0) {
                    macroId = (i + 32);
                    switch (macroId) {
                        case Macros.EUAI_MAX_SOUL:
                        case Macros.EUAI_BREAK_ATT:
                        case Macros.EUAI_BREAK_DEF:
                        case Macros.EUAI_GOD_POWER:
                            this.add2queue(i + 32, curValue);
                            break;
                        default:
                    }
                }
                j++;
            }
            mask = Math.floor(mask / 2);
        }

        this.checkFloat();
    }

    private add2queue(macroId: number, value: number) {
        let fightIdx = -1;
        let cnt = this.proStrAarry.length;
        for (let i = 0; i < cnt; i++) {
            let o = this.proStrAarry[i];
            if (o.macrosID == Macros.EUAI_FIGHT) {
                fightIdx = i;
            }
            if (o.macrosID == macroId) {
                o.value += value;
                return;
            }
        }
        let info = new PropIDValue();
        info.propID = PropUtil.getPropIdByPropMacros(macroId);
        info.value = value;
        info.macrosID = macroId;
        if (fightIdx >= 0) {
            this.proStrAarry.splice(fightIdx, 0, info);
        } else {
            this.proStrAarry.push(info);
        }
    }
}