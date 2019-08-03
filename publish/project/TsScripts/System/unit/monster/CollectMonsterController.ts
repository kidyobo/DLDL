import { Global as G } from "System/global";
import { UnitController } from "System/unit/UnitController";
import { UnitData, RoleData } from "System/data/RoleData";
import { Macros } from 'System/protocol/Macros';
import { KeyWord } from 'System/constants/KeyWord'
import { MonsterController } from 'System/unit/monster/MonsterController';
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum'
import { QuestData } from 'System/data/QuestData'
import { MonsterData } from 'System/data/MonsterData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { Color } from 'System/utils/ColorUtil'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { CachingLayer, CachingSystem} from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { AvatarType } from "System/unit/avatar/AvatarType"
export class CollectMonsterController extends UnitController {
    private m_canCollect: boolean;

    public get Data() {
        return this.data as RoleData;
    }

    public get Config(): GameConfig.MonsterConfigM {
        return this.data.config as GameConfig.MonsterConfigM;
    }
    private loaded: boolean = false;
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Simple);
        this.model.showShadow(true, true);
        this.setCollectable(this.judgeCollectable());
        G.UnitMgr.unitCreateQueue.add(this);
    }
    public onLoadModel() {
        this.loaded = true;
        let scale = 1;
        if (this.Config.m_ucUnitScale > 0) {
            scale = this.Config.m_ucUnitScale / 100;
        }
        this.model.setScale(scale);
        // 采集物
        let realData = this.data.config as GameConfig.MonsterConfigM;
        let url = realData.m_szModelID;
        this.model.avatar.defaultAvatar.loadModel(this.data.unitType, url, false, true);
    }

    public onDestroy() {
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
    }
    public onMoveEnd(byStop: boolean) { }
    public onHit() { }
    public onUpdateNameboard(name: string) {
        if (null == name) {
            if (null != this.Data.name && '' != this.Data.name) {
                name = this.Data.name;
            } else {
                name = this.Config.m_szMonsterName;
            }
        }
        this.model.topTitleContainer.setTextTopTitleValue(0,TextFieldUtil.getColorText(name, Color.NAME_WHITE));
    }
    public getAnimName(state: UnitState): string {
        return null;
    }
    public onAddBuff(buffInfo: Protocol.BuffInfo) {}
    public onDeleteBuff(buffId: number) {}


    /**
	* 设置是否可采集
	* @param canCollect
	*
	*/
    setCollectable(canCollect: boolean): void {
        this.m_canCollect = canCollect;

        if (canCollect) {
            this.model.selectAble = (this.Data.config as GameConfig.MonsterConfigM).m_ucIsBeSelected == 1;
        }
        else {
            this.model.selectAble = false;
        }
        this.onUpdateVisible();
    }

    /**
	* 判断monsyerID的怪物是否可采集
	* @param doingList
	* @param monsterID
	* @return
	*
	*/
    judgeCollectable(): boolean {
        if (!UnitUtil.isEnemy(this)) {
            return false;
        }

        let result: boolean;
        let monsterConfig: GameConfig.MonsterConfigM = this.Data.config as GameConfig.MonsterConfigM;
        if (1 == monsterConfig.m_bIsGatherDirect) {
            // 可直接采集
            return true;
        }

        let doingList: Protocol.QuestProgress[] = G.DataMgr.questData.getDoingQuestList();
        if (doingList == null || this.data.id == -1) //任务列表为空的话则都不可以采集
        {
            return false;
        }

        for (let qp of doingList) //遍历正在做的任务
        {
            let quest: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(qp.m_iQuestID); //任务配置
            if (quest == null || (quest != null && quest.m_astQuestNodeConfig == null)) {
                continue;
            }

            let nodeConfig: GameConfig.QuestNodeConfigCli[] = quest.m_astQuestNodeConfig;
            let nodeCount: number = nodeConfig.length;
            for (let j: number = 0; j < nodeCount; ++j) //遍历任务下的任务配置
            {
                let node: GameConfig.QuestNodeConfigCli = nodeConfig[j];
                let thingID: number = node.m_iThingID;

                if (node.m_ucType == KeyWord.QUEST_NODE_QUEST) //子任务节点
                {
                    //走普通的任务流程
                    let childConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(thingID);
                    result = this._judgeCollectableByQuest(childConfig, this.data.id);
                    if (result) {
                        return true;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    let mId: number = 0;
                    if (GameIDUtil.isThingID(thingID)) {
                        mId = this._getMonsterIDByThingID(qp.m_iQuestID, thingID);
                    }
                    else if (GameIDUtil.isMonsterID(thingID)) {
                        mId = thingID;
                    }
                    if (mId == this.data.id) {
                        if (qp.m_astNodeProgress[j].m_shProgressValue >= node.m_shValue) //已经完成了所有的节点的话
                        {
                            continue;
                        }
                        else {
                            return true;
                        }
                    }
                }
            }
        }
        return result;
    }

    /**
     * 根据当前的任务配置去判断当前的怪物能否采集
     * 遍历任务节点
     * @param quest
     * @param monsterID
     * @return
     *
     */
    private _judgeCollectableByQuest(quest: GameConfig.QuestConfigM, monsterID: number): boolean {
        let nodeConfig: GameConfig.QuestNodeConfigCli[] = quest.m_astQuestNodeConfig;
        for (let i: number = 0; i < quest.m_ucQuestNodeNumber; ++i) //遍历任务下的节点配置
        {
            let node: GameConfig.QuestNodeConfigCli = nodeConfig[i];
            let thingID: number = node.m_iThingID;

            let mId: number = 0;
            if (GameIDUtil.isThingID(thingID)) {
                mId = this._getMonsterIDByThingID(quest.m_iQuestID, thingID);
            }
            else if (GameIDUtil.isMonsterID(thingID)) {
                mId = thingID;
            }
            if (mId == monsterID) {
                let progress: Protocol.QuestProgress = G.DataMgr.questData.getQuestProgress(quest.m_iQuestID);
                // 节点未完成，同时对于前线任务来说在同一个线上
                return (null != progress && progress.m_astNodeProgress[i].m_shProgressValue < node.m_shValue);
            }
        }

        return false;
    }

    /**
     * 通过物品的ID到任务中去寻找掉落物品中有这个thingId的monsterid
     * @param questID 任务id
     * @param thingID 道具的id
     * @return
     *
     */
    private _getMonsterIDByThingID(questID: number, thingID: number): number {
        let dropConfig: GameConfig.QuestMonsterDropConfigM[] = G.DataMgr.questData.getMonsterDropById(questID);

        if (dropConfig == null)
            return -1;
        let monsterID: number = this._getMonsterIDInDrop(dropConfig, thingID);
        return monsterID;
    }

    /**
     * 通过在掉落配置里面的物品的id得到掉落配置里面采集怪的ID
     * @param dropConfig
     * @param thingID
     * @return
     *
     */
    private _getMonsterIDInDrop(dropConfig: GameConfig.QuestMonsterDropConfigM[], thingID: number): number {
        let len: number = dropConfig.length;
        let config: GameConfig.QuestMonsterDropConfigM = null;
        for (let i: number = 0; i < len; ++i) {
            config = dropConfig[i];
            if (config.m_iQuestThingID == thingID) {
                let monsterID: number = config.m_iMonsterID;
                if (MonsterData.getMonsterConfig(monsterID).m_bDignity == KeyWord.MONSTER_TYPE_PICK) //采集怪
                {
                    return monsterID;
                }
            }
        }
        return -1;
    }
    public onUpdateVisible() {
        if (this.m_canCollect || this.Config.m_ucIsDisplayName == KeyWord.SHOWNAME_TYPE_YES_PERMENANT) {
            // 可以选中则显示名字
            this.model.setVisible(true,true);
            this.onUpdateNameboard(null);
        } else {
            // 不显示名字
            this.model.setVisible(true, false);
        }
    }
}
export default CollectMonsterController;