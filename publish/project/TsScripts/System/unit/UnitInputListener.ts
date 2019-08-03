import { Constants } from "System/constants/Constants";
import { HeroGotoType, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { ClickEffectPlayer } from "System/unit/ClickEffectPlayer";
import { HeroController } from "System/unit/hero/HeroController";
import { UnitController } from "System/unit/UnitController";
import { UnitStatus } from "System/utils/UnitStatus";
import { UnitUtil } from "System/utils/UnitUtil";

//根据用户行为改变单位状态
export class UnitInputListener {
    //控制对象
    private target: HeroController;
    //用户输入监控脚本对象
    private input: Game.InputListener;

    private clickEffectPlayer: ClickEffectPlayer;
    public setTarget(target: HeroController): void {
        if (this.input != null) {
            UnityEngine.GameObject.Destroy(this.input);
        }
        this.target = target;
        this.input = target.model.gameObject.AddComponent(Game.InputListener.GetType()) as Game.InputListener;
        //绑定鼠标点击事件
        this.input.onClick = delegate(this, this.onMouseClick);
        this.input.onUIClick = delegate(this, this.onUIClick);
        this.input.enabled = false;
        this.clickEffectPlayer = new ClickEffectPlayer();
        // 绑定手势事件
        this.input.fingerActionSensitivity = UnityEngine.Screen.width * 0.05;
        this.input.onGuesture = delegate(this, this.onGuesture);
    }

    setEnabled(enabled: boolean) {
        this.input.enabled = enabled;
    }

    private onMouseClick(gameObject: UnityEngine.GameObject, x: number, y: number, z: number) {

        //此处回调判断
        let heroData = G.DataMgr.heroData;

        let unit = (gameObject as any).userdata as UnitController;
        if (unit == null) {
            if (G.UnitMgr.hero.moveable()) {
                G.ModuleMgr.deputyModule.startEndHangUp(false); // 清除任务标记
                // 清除任务标记
                G.DataMgr.runtime.resetAllBut();
                // 停止自动寻路
                G.Mapmgr.stopAutoPath();
                G.Mapmgr.moveHeroToBlank(G.localPositionXToServerPixelX(x), G.localPositionYToServerPixelY(z));
                this.clickEffectPlayer.play(x, y, z);
            }
        }
        else {
            let unitID = unit.Data.unitID;
            if (UnitCtrlType.hero == unit.Data.unitType) {
                return;
            }

            if (UnitCtrlType.npc == unit.Data.unitType) {
                // npc
                let same = G.UnitMgr.selectUnit(unitID, true);
                if (!same) {
                    //只是选中而已
                    return;
                }
            } else if (UnitCtrlType.collection == unit.Data.unitType) {
                // 采集物
                G.UnitMgr.selectUnit(unitID, false);
            }
            else if (UnitCtrlType.dropThing == unit.Data.unitType) {
                // 掉落物可选中但不显示其头像
                G.UnitMgr.selectUnit(unitID, false);
            }
            else {
                let same = G.UnitMgr.selectUnit(unitID, false);
                if (!same) {
                    //只是选中而已
                    return;
                }
            }

            if (UnitCtrlType.npc == unit.Data.unitType) {
                heroData.gotoType = HeroGotoType.NONE;
                G.DataMgr.runtime.resetAllBut(); // 清除任务信息
            } else {
                if (UnitCtrlType.dropThing == unit.Data.unitType) //是掉落物品
                {
                    heroData.gotoType = HeroGotoType.GET_SINGLE_DROP;
                }
                else if (UnitCtrlType.monster == unit.Data.unitType) {
                    if (UnitUtil.isEnemy(unit)) {
                        heroData.gotoType = HeroGotoType.ATTACK;
                    }
                    else {
                        heroData.gotoType = HeroGotoType.NONE;
                    }
                }
                else if (UnitCtrlType.collection == unit.Data.unitType) {
                    if (G.ViewCacher.collectionBar.hasShowCollection) {
                        return;
                    }

                    if (UnitUtil.isEnemy(unit)) {
                        heroData.gotoType = HeroGotoType.PICK_MONSTER;
                    }
                    else {
                        heroData.gotoType = HeroGotoType.NONE;
                    }
                }
                else if (UnitCtrlType.role == unit.Data.unitType) {
                    if (UnitUtil.isEnemy(unit)) {
                        if (G.DataMgr.runtime.isInSafety) {
                            G.TipMgr.addMainFloatTip('安全区内无法攻击其他玩家');
                            heroData.gotoType = HeroGotoType.NONE;
                        }
                        else {
                            heroData.gotoType = HeroGotoType.ATTACK;
                        }
                    }
                    else {
                        heroData.gotoType = HeroGotoType.NONE;
                    }
                }
                else if (UnitCtrlType.pet == unit.Data.unitType) {
                    heroData.gotoType = HeroGotoType.NONE;
                }
            }

            if (heroData.gotoType == HeroGotoType.ATTACK) {
                this.target.attackAuto();
            }
            else {
                G.Mapmgr.moveToTarget(unit);
            }
        }
    }

    private onUIClick() {
        let now = UnityEngine.Time.realtimeSinceStartup;
        let runtime = G.DataMgr.runtime;
        runtime.lastMouseActionTime = now;
        runtime.lastActiveAt = now;
    }

    private onGuesture(h: number, v: number) {
        if (G.freecamera) {
            return;
        }
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.SUBBAR_FUNCTION_RIDE)) {
            return;
        }
        let now = UnityEngine.Time.realtimeSinceStartup;
        let runtime = G.DataMgr.runtime;
        if (0 == runtime.lastRideOnOffAt || now - runtime.lastRideOnOffAt > Constants.RideOnGap) {
            if (UnitStatus.isInRide(G.DataMgr.heroData.unitStatus)) {
                // 当前上马状态，滑屏下马
                G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_RIDE, 0, 0, -1);
            } else {
                // 当前下马状态，滑屏上马
                G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_RIDE, 0, 0, 1);
            }
            runtime.lastRideOnOffAt = now;
        }
    }
}
export default UnitInputListener;