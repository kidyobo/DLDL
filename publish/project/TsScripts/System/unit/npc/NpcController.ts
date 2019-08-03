import { UnitController } from "System/unit/UnitController";
import { UnitData } from "System/data/RoleData";
import { NPCData } from 'System/data/NPCData'
import { Global as G } from "System/global";
import { UnitCtrlType } from 'System/constants/GameEnum'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { NPCQuestState } from 'System/constants/GameEnum'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { AvatarType } from "System/unit/avatar/AvatarType"
export class NpcController extends UnitController {
    private timer: Game.Timer;
    public get Config(): GameConfig.NPCConfigM {
        return this.data.config as GameConfig.NPCConfigM;
    }
    private loaded: boolean = false;
    public hideflag: boolean = true;
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Simple);
        this.onUpdateNameboard(null);

        let config = this.Config;
        // 城主npc和装饰npc不可选中
        this.model.selectAble = !NPCData.isDecorationNpc(config.m_iNPCID) && !NPCData.isStatueNpc(config);
        G.UnitMgr.unitCreateQueue.add(this);
    }
    public onLoadModel() {
        this.loaded = true;
        this.onUpdateVisible();
        // npc
        let realData = this.data.config as GameConfig.NPCConfigM;
        let url = realData.m_szNPCModelID;
        this.model.avatar.defaultAvatar.loadModel(this.data.unitType, url, true, true);
    }
    public onDestroy() {
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
        if (this.timer != null)
            this.timer.Stop();
    }
    public onMoveEnd(byStop: boolean) { }
    public onHit() { }
    public onUpdateNameboard(name: string) {
        if (!NPCData.isDecorationNpc(this.data.id)) {
            if (null == name) {
                name = this.Config.m_szNPCName;
            }
            this.model.topTitleContainer.setTextTopTitleValue(0,TextFieldUtil.getColorText(name, Color.NAME_YELLOW));
        }
    }
    public getAnimName(state: UnitState): string {
        return null;
    }
    public onAddBuff(buffInfo: Protocol.BuffInfo) { }
    public onDeleteBuff(buffId: number) { }


    private onPlayIdle(timer: Game.Timer): void {
        if (this.model.isVisible) {
            this.model.avatar.defaultAvatar.playAnimation("idle", 0.5);
        }
    }

    public updateQuestState() {
        let state = G.DataMgr.questData.getStateByNPCID(this.data.id, G.DataMgr.heroData);
        this.model.topTitleContainer.setNpcQuestStateTopTitle(state);
    }
    public onUpdateVisible() {
        if (this.timer != null) {
            this.timer.Stop();
        }
        let settingData = G.DataMgr.settingData;
        let force = settingData.hideNPCsForce;
        if (this.hideflag) {
            this.model.showShadow(false, true);
            this.model.setVisible(false, false);
        }
        else {
            this.model.showShadow(true, true);
            this.model.setVisible(!force, !force);
            //开启一个计时器，循环播放idle
            this.timer = new Game.Timer("npccontroller", Math.random() * 5000 + 5000, 0, delegate(this, this.onPlayIdle));
        }
    }
}
export default NpcController;