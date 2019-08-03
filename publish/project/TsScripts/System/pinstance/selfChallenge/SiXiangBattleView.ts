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

class SiXiangBattleTeamItem {
    private head: UnityEngine.UI.Image;
    private dead: UnityEngine.GameObject;
    private oldType = 0;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.head = ElemFinder.findImage(go, 'head');
        this.dead = ElemFinder.findObject(go, 'dead');
    }

    update(type: number, isDead: boolean, altas: Game.UGUIAltas) {
        if (this.oldType != type) {
            this.oldType = type;
            this.head.sprite = altas.Get(type.toString());
        }

        UIUtils.setGrey(this.head.gameObject, isDead);
        this.dead.SetActive(isDead);
    }
}

class SiXiangBattleOneCtrl {
    private gameObject: UnityEngine.GameObject;
    private head: UnityEngine.UI.Image;
    private hpBar: UnityEngine.GameObject;
    private textHp: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textPosition: UnityEngine.UI.Text;
    private teamItems: SiXiangBattleTeamItem[] = [];

    private oldType = 0;
    private unitCtrl: UnitController;

    private isRight = false;

    constructor(isRight: boolean) {
        this.isRight = isRight;
    }

    setComponents(go: UnityEngine.GameObject, uiElems: UiElements) {
        //玩家属性
        this.gameObject = go;
        this.head = ElemFinder.findImage(go, 'head');
        this.hpBar = ElemFinder.findObject(go, 'hp/hpBar');
        this.textHp = ElemFinder.findText(go, 'textHp');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textPosition = ElemFinder.findText(go, 'textPosition');

        let teamList = ElemFinder.findObject(go, 'teamList');
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let itemGo = ElemFinder.findObject(teamList, i.toString());
            let item = new SiXiangBattleTeamItem();
            item.setComponents(itemGo);
            this.teamItems.push(item);
        }
    }

    updateName(name: string) {
        this.textName.text = name;
    }

    updateState(deathCnt: number, shenShouCnt: number, battleList: Protocol.BattleSSList[], altas: Game.UGUIAltas) {
        let crtIdx = Math.min(deathCnt, shenShouCnt - 1);
        let crtShenShou = battleList[crtIdx];
        if (this.oldType != crtShenShou.m_ucType) {
            this.oldType = crtShenShou.m_ucType;
            this.head.sprite = altas.Get(crtShenShou.m_ucType.toString());
            this.textPosition.text = SiXiangData.PositionDesc[crtIdx];
        }
        UIUtils.setGrey(this.head.gameObject, deathCnt >= shenShouCnt);

        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let teamItem = this.teamItems[i];
            if (i < shenShouCnt) {
                teamItem = this.teamItems[i];
                teamItem.update(battleList[i].m_ucType, i < deathCnt, altas);
                teamItem.gameObject.SetActive(true);
            } else {
                teamItem.gameObject.SetActive(false);
            }
        }
    }

    updateUAC(unitCtrl: UnitController) {
        this.unitCtrl = unitCtrl;
        // 更新血量
        let curHp = unitCtrl.Data.getProperty(Macros.EUAI_CURHP);
        let maxHp = unitCtrl.Data.getProperty(Macros.EUAI_MAXHP);
        this.textHp.text = uts.format('{0}/{1}', curHp, maxHp);
        let s = curHp / maxHp;
        Game.Tools.SetGameObjectLocalScale(this.hpBar, s, 1, 1);
    }
}

export class SiXiangBattleView extends NestedSubForm {

    private id2oneCtrl: { [id: number]: SiXiangBattleOneCtrl } = {};
    private id2ShenShouCnt: { [id: number]: number } = {};
    private id2BattleList: { [id: number]: Protocol.BattleSSList[] } = {};
    private id2DeathCnt: { [id: number]: number } = {};
    private altas: Game.UGUIAltas;

    constructor() {
        super(EnumMainViewChild.siXiangBattle);
    }

    protected resPath(): string {
        return UIPathData.SiXiangBattleView;
    }

    protected initElements() {
        for (let i = 0; i < SiXiangData.MonsterId.length; i++) {
            let id = SiXiangData.MonsterId[i];
            let go = this.elems.getElement(id.toString());
            let oneCtrl = new SiXiangBattleOneCtrl(1 == i);
            oneCtrl.setComponents(go, this.elems.getUiElements(id.toString()));
            this.id2oneCtrl[id] = oneCtrl;

            if (i == SiXiangData.MyMonsterIndex) {
                oneCtrl.updateName(G.DataMgr.heroData.name);
            }
        }
        this.altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    open() {
        let siXiangData = G.DataMgr.siXiangData;
        for (let i = 0; i < SiXiangData.MonsterId.length; i++) {
            let id = SiXiangData.MonsterId[i];
            this.id2DeathCnt[id] = 0;

            if (SiXiangData.MyMonsterIndex == i) {
                // 我的神兽
                this.id2ShenShouCnt[id] = siXiangData.sxActInfo.m_ucSSCout;
                this.id2BattleList[id] = siXiangData.sxActInfo.m_astBattleSSList;
            } else {
                // 对方的
                this.id2ShenShouCnt[id] = siXiangData.sxStartInfo.m_stBeAttackRoleInfo.m_ucSSCout;
                this.id2BattleList[id] = siXiangData.sxStartInfo.m_stBeAttackRoleInfo.m_astBattleSSList;
            }

            this.id2DeathCnt[id] = 0;
        }
        super.open();
    }

    protected onOpen() {
        let siXiangData = G.DataMgr.siXiangData;

        let oneCtrl = this.id2oneCtrl[SiXiangData.MonsterId[SiXiangData.OpponentMonsterIndex]];
        oneCtrl.updateName(siXiangData.sxStartInfo.m_stBeAttackRoleInfo.m_szNickName);
        for (let i = 0; i < SiXiangData.MonsterId.length; i++) {
            let id = SiXiangData.MonsterId[i];
            this.updateMonsterState(id);
        }
    }

    updateUAC(uac: Protocol.UnitAttributeChanged) {
        let unit = G.UnitMgr.getUnit(uac.m_iUnitID);
        if (null != unit) {
            let oneCtrl = this.id2oneCtrl[unit.Data.id];
            if (null != oneCtrl) {
                oneCtrl.updateUAC(unit);
            }
        }
    }

    onMonsterDead(monsterId: number) {
        let oldDeathCnt = this.id2DeathCnt[monsterId];
        this.id2DeathCnt[monsterId] = ++oldDeathCnt;
        this.updateMonsterState(monsterId);
    }

    private updateMonsterState(monsterId: number) {
        let oneCtrl = this.id2oneCtrl[monsterId];
        oneCtrl.updateState(this.id2DeathCnt[monsterId], this.id2ShenShouCnt[monsterId], this.id2BattleList[monsterId], this.altas);
    }
}