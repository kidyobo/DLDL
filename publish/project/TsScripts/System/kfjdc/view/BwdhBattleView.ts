import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { UnitController } from 'System/unit/UnitController'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { SiXiangData } from 'System/data/SiXiangData'

class BwdhBattleOneCtrl {
    gameObject: UnityEngine.GameObject;
    private head: UnityEngine.UI.Image;
    private hpBar: UnityEngine.GameObject;
    private textHp: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private selected: UnityEngine.GameObject;

    private oldType = 0;

    setComponents(go: UnityEngine.GameObject) {
        //玩家属性
        this.gameObject = go;
        this.head = ElemFinder.findImage(go, 'head');
        this.hpBar = ElemFinder.findObject(go, 'hp/hpBar');
        this.textHp = ElemFinder.findText(go, 'textHp');
        this.textName = ElemFinder.findText(go, 'textName');
        this.selected = ElemFinder.findObject(go, 'selected');
        this.selected.SetActive(false);
    }

    updateName(uin: number, name: string, prof: number, gender: number, headAltas: Game.UGUIAltas) {
        if (uin == 0) {
            // 轮空
            this.head.enabled = false;
            this.textName.gameObject.SetActive(false);
        } else {
            this.head.enabled = true;
            this.head.sprite = headAltas.Get(prof + '_' + gender);
            this.textName.gameObject.SetActive(true);
            this.textName.text = name;
        }
    }

    updateUAC(curHp: number, maxHp: number) {
        // 更新血量
        if (maxHp > 0) {
            this.textHp.text = uts.format('{0}/{1}', curHp, maxHp);
            let s = Math.min(curHp / maxHp, 1);
            Game.Tools.SetGameObjectLocalScale(this.hpBar, s, 1, 1);
        } else {
            this.textHp.text = '';
            Game.Tools.SetGameObjectLocalScale(this.hpBar, 1, 1, 1);
        }
    }

    setSelected(value: boolean) {
        this.selected.SetActive(value);
    }
}

export class BwdhBattleView extends NestedSubForm {
    private readonly TickKey = 'Tick';

    private left = new BwdhBattleOneCtrl();
    private right = new BwdhBattleOneCtrl();

    private textCountDown: UnityEngine.UI.Text;
    private vs: UnityEngine.GameObject;

    private tip: UnityEngine.GameObject;
    private btnCloseTip: UnityEngine.GameObject;

    private tick = 0;
    private static LastClickAt = 0;

    constructor() {
        super(EnumMainViewChild.bwdhBattle);
    }

    protected resPath(): string {
        return UIPathData.BwdhBattleView;
    }

    protected initElements() {
        this.left.setComponents(this.elems.getElement('left'));
        this.right.setComponents(this.elems.getElement('right'));

        this.textCountDown = this.elems.getText('textCountDown');
        this.vs = this.elems.getElement('vs');

        this.tip = this.elems.getElement('tip');
        this.btnCloseTip = this.elems.getElement('btnCloseTip');
    }

    protected initListeners() {
        this.addClickListener(this.left.gameObject, delegate(this, this.onClickPlayer, true));
        this.addClickListener(this.right.gameObject, delegate(this, this.onClickPlayer, false));
        this.addClickListener(this.btnCloseTip, this.onClickBtnCloseTip);
    }

    protected onOpen() {
        super.onOpen();
        this.onPlayerDataChange();
        this.startTick();

        this.tip.SetActive(G.DataMgr.kfjdcData.watchMode && 0 == BwdhBattleView.LastClickAt);
        this.left.setSelected(false);
        this.right.setSelected(false);
    }

    onPlayerDataChange() {
        let playerData = G.DataMgr.kfjdcData.finalPlayerData;
        if (playerData) {
            let headAltas = G.AltasManager.roleHeadAltas;
            this.left.updateName(playerData.m_stLeftRoleID.m_uiUin, playerData.m_szLeftName, playerData.m_iLeftProf, playerData.m_iLeftGender, headAltas);
            this.left.updateUAC(playerData.m_iLeftLeftHp, playerData.m_iLeftMaxHp);
            this.right.updateName(playerData.m_stRightRoleID.m_uiUin, playerData.m_szRightName, playerData.m_iRightProf, playerData.m_iRightGender, headAltas);
            this.right.updateUAC(playerData.m_iRightLeftHp, playerData.m_iRightMaxHp);
        }
    }

    startTick() {
        let finalTime = G.DataMgr.kfjdcData.jjtzKfjdcTime;
        if (finalTime) {
            this.tick = finalTime.m_iTickTime;
            this.textCountDown.text = finalTime.m_iTickTime.toString();
            this.textCountDown.gameObject.SetActive(true);
            this.vs.SetActive(false);

            this.addTimer(this.TickKey, 1000, finalTime.m_iTickTime, this.onTickTimer);
        } else {
            this.textCountDown.gameObject.SetActive(false);
            this.vs.SetActive(true);
        }
    }

    private onTickTimer(timer: Game.Timer) {
        this.tick -= timer.CallCountDelta;
        if (this.tick > 0) {
            this.textCountDown.text = this.tick.toString();
        } else {
            this.textCountDown.gameObject.SetActive(false);
            this.vs.SetActive(true);
        }
    }

    updateUAC(unitCtrl: UnitController) {
        let playerData = G.DataMgr.kfjdcData.finalPlayerData;
        let oneCtrl: BwdhBattleOneCtrl;
        if (playerData) {
            if (playerData.m_iLeftUnitID == unitCtrl.Data.unitID) {
                oneCtrl = this.left;
            } else if (playerData.m_iRightUnitID == unitCtrl.Data.unitID) {
                oneCtrl = this.right;
            }
        }

        if (oneCtrl) {
            let curHp = unitCtrl.Data.getProperty(Macros.EUAI_CURHP);
            let maxHp = unitCtrl.Data.getProperty(Macros.EUAI_MAXHP);
            oneCtrl.updateUAC(curHp, maxHp);
        }
    }

    private onClickPlayer(isLeft: boolean) {
        //let now = UnityEngine.Time.realtimeSinceStartup;
        //if (now - BwdhBattleView.LastClickAt < 2) {
        //    G.TipMgr.addMainFloatTip('切换视角过于频繁，请稍候再试。');
        //    return;
        //}
        //BwdhBattleView.LastClickAt = now;

        this.tip.SetActive(false);

        let kfjdcData = G.DataMgr.kfjdcData;
        if (kfjdcData.watchMode) {
            let playerData = kfjdcData.finalPlayerData;
            if (playerData) {
                let unitID = playerData.m_iLeftUnitID;
                if (!isLeft) {
                    unitID = playerData.m_iRightUnitID;
                }

                let unitMgr = G.UnitMgr;
                let unit = unitMgr.getUnit(unitID);
                if (unit) {
                    //unitMgr.controlUnit(unit);
                    if (isLeft) {
                        this.left.setSelected(true);
                        this.right.setSelected(false);
                    } else {
                        this.left.setSelected(false);
                        this.right.setSelected(true);
                    }
                    return;
                }
            }
            G.TipMgr.addMainFloatTip('选手未上阵，请稍候再试。');
        }
    }

    private onClickBtnCloseTip() {
        this.tip.SetActive(false);
    }
}