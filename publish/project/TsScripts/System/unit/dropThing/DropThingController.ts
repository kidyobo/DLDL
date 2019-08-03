import { Global as G } from "System/global";
import { UnitController } from 'System/unit/UnitController'
import { UnitData, DropUnitData } from 'System/data/RoleData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { SimpleAvatar } from "System/unit/avatar/SimpleAvatar"

export class DropThingController extends UnitController {
    /**是否可以获得*/
    private m_canGet: boolean;
    private loaded: boolean = false;
    private timer: Game.Timer;
    public lastPickTime: number = 0;

    public get Data() {
        return this.data as DropUnitData;
    }
    public get Config(): GameConfig.ThingConfigM {
        return this.data.config as GameConfig.ThingConfigM;
    }
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Simple);
        this.model.showShadow(false, false);
        this.model.setVisible(true, true);
        this.model.avatar.defaultAvatar.setRotation(-90, 0, 0);
        G.UnitMgr.unitCreateQueue.add(this);
    }

    onLoadModel() {
        this.loaded = true;
        let data = this.Data;
        if (null != data.info) {
            this.onUpdateNameboard(null);
        }
        // 掉落物
        let realData = data.config as GameConfig.ThingConfigM;
        let url = realData.m_iGroundIconID.toString();
        this.model.avatar.defaultAvatar.loadModel(this.data.unitType, url, false, true);
        if (realData.m_iEffectName>0) {
            (this.model.avatar as SimpleAvatar).m_circleMesh.loadModel(UnitCtrlType.other, uts.format("effect/dropThing/{0}.prefab", realData.m_iEffectName), false, false);
        }
        //如果掉落物是魂骨
        let equipData = data.config as GameConfig.EquipConfigM;
        let equipUrl = equipData.m_iGroundIconID.toString();
        this.model.avatar.defaultAvatar.loadModel(this.data.unitType, equipUrl, false, true);
        if(equipData.m_iEffectName>0){
            (this.model.avatar as SimpleAvatar).m_circleMesh.loadModel(UnitCtrlType.other, uts.format("effect/dropThing/{0}.prefab", equipData.m_iEffectName), false, false);
        }
        // 跳出来的动作
        if (data.info.m_stSrcPos.m_uiX > 0) {
            let model = this.model;
            let dstPosPixel = data.info.m_stCurPos;
            let dstPos = G.serverPixelToLocalPosition(dstPosPixel.m_uiX, dstPosPixel.m_uiY);
            Tween.TweenPath.Begin(model.gameObject, model.rotateGameObject, 0.05, [dstPos], 2, 0, 0);
        }
    }
    public onDestroy() {
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
    }
    public onMoveEnd(byStop: boolean) {

    }
    public onHit() {

    }
    public onUpdateNameboard(name: string) {
        if (null == name) {
            name = this.Config.m_szName;
        }
        this.model.topTitleContainer.setTextTopTitleValue(0,TextFieldUtil.getColorText(name, UnitUtil.getDropNameColor(this)));
    }
    public onAddBuff(buffInfo: Protocol.BuffInfo) {

    }
    public onDeleteBuff(buffId: number) {

    }
    public getAnimName(state: UnitState): string {
        return null;
    }



    get canGet(): boolean {
        return this.m_canGet;
    }
    set canGet(value: boolean) {
        this.m_canGet = value;
        this.model.selectAble = value;
    }
    /**
	*物品是否可以拾取
	* @param info
	* @return
	*
	*/
    judgeCanGet() {
        let canGet = false;
        if (null != this.data && null != this.Data.info) {
            //是否可拾取
            if (this.Data.info.m_iOwnerType == Macros.DROPPEDTHING_OWNERTYPE_NORMAL) {
                canGet = CompareUtil.isRoleIDEqual(this.Data.info.m_stRoleID, G.DataMgr.heroData.roleID)
            }
            else if (this.Data.info.m_iOwnerType == Macros.DROPPEDTHING_OWNERTYPE_TEAM) {
                let teamInfo: Protocol.TEAMID = G.DataMgr.teamData.teamID;
                canGet = (teamInfo != null && CompareUtil.isTeamIDEqual(teamInfo, this.Data.info.m_stTeamID));
            }
            else if (this.Data.info.m_iOwnerType == Macros.DROPPEDTHING_OWNERTYPE_GUILD) {
                let guildId = G.DataMgr.heroData.guildId;
                if (guildId == 0) {
                    canGet = true;
                } else {
                    canGet = this.Data.info.m_stRoleID.m_uiSeq == guildId;
                }
            }
            else {
                canGet = true;
            }
        }

        this.canGet = canGet;
    }

    public onUpdateVisible() {

    }
}
export default DropThingController;