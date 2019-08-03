import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { NPCData } from 'System/data/NPCData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { NpcActionData } from 'System/data/NpcActionData'
import { MessageBoxConst } from 'System/tip/TipManager'

 /**
 * npc的脚本功能
 * @author fygame
 * 
 */
export class ScriptNpcAction {
    /**菜单列表*/
    private m_menuNodeList: Protocol.MenuNode[];

     /**
     * 取得该npc关于任务的列表数据
     * 在打开npc的时候会去拉取数据
     * @param npcID
     * @return 
     * 
     */
    public getListData(id: number) {
        let hasScript: boolean = false;
        if (GameIDUtil.isNPCID(id)) {
            let npcConfig: GameConfig.NPCConfigM = NPCData.getNpcConfig(id);
            //遍历配置中的功能列表，判断是否有脚本功能
            for (let func of npcConfig.m_astNPCFunction) {
                if (func.m_ucFunction == KeyWord.NPC_FUNCTION_SCRIPT || func.m_ucFunction == KeyWord.NPC_FUNCTION_PINSTANCESCRIPT) {
                    hasScript = true;
                    break;
                }
            }
        } else if (GameIDUtil.isMonsterID(id)) {
            hasScript = true;
        }

        if (hasScript)//配了有脚本功能的话就向后台发送请求
        {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getListMenuRequest(id));
        }
    }

     /**
     * 点击任务item的处理 
     * @param data
     * 
     */
    public action(data: NpcActionData, id: number, ownerID: number): void {
        let index: number = data.id;

        let menuNode: Protocol.MenuNode = this.m_menuNodeList[index];

        //如果是历练副本，则需要弹出提示框
        if (menuNode.m_iPinstanceID > 0) {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(menuNode.m_iPinstanceID, 0, ownerID);
        }
        else {
            if (menuNode.m_ucReConfirm == 1)//需要弹框确认
            {
                let msg: string = uts.format('确认{0}?', menuNode.m_szCaption);
                if ('' != menuNode.m_szReconfirmInfo) {
                    msg += '\n' + '（' + menuNode.m_szReconfirmInfo + '）';
                }
                G.TipMgr.showConfirm(
                    msg, ConfirmCheck.noCheck, '确定|取消', delegate(this, this._confirmHandler, menuNode, id, data.unitID));
                return;
            }
            else {
                this._sendClickMenuRequest(id, menuNode.m_ucIndex, data.unitID);
            }
        }
    }

    /**
     * 发送点击某个菜单项的请求 
     * @param owenerID
     * @param menuNodeIndex
     * 
     */
    private _sendClickMenuRequest(ownerID: number, menuNodeIndex: number, unitID: number): void {
        let msg: Protocol.FyMsg = ProtocolUtil.getClickMenuRequest(ownerID, menuNodeIndex, unitID);
        G.ModuleMgr.netModule.sendMsg(msg);
    }

    /**
     * 点击某些需要确认的菜单项的回调函数 
     * @param args
     * @param state
     * 
     */
    private _confirmHandler(state: MessageBoxConst, isCheckSelected: boolean, menuNode: Protocol.MenuNode, id: number, ownerId: number): void {
        if (state == MessageBoxConst.yes) {
            this._sendClickMenuRequest(id, menuNode.m_ucIndex, ownerId);
        }
    }

    /**
     * 根据后台的菜单回复取得相应的数据
     * @param response
     * @return 
     * 
     */
    getScriptMenuData(menuNodeList: Protocol.MenuNodeList, unitID: number, result: NpcActionData[]): NpcActionData[] {
        if (null == result) {
            result = [];
        }
        let menuNodes: Protocol.MenuNode[] = menuNodeList.m_astMenuNode;
        this.m_menuNodeList = menuNodes;
        let len: number = menuNodeList.m_ucNumber;
        let funcData: NpcActionData;
        for (let i: number = 0; i < len; ++i) {
            funcData = new NpcActionData()
            result.push(funcData);

            funcData.id = i;//id为后台给的菜单的index,
            funcData.unitID = unitID;
            funcData.limitLevel = 0; // 此字段用于控制菜单显示，对于脚本菜单项没有等级限制，因此此处均填0，只有NPC功能菜单项才会用到
            funcData.type = KeyWord.NPC_FUNCTION_SCRIPT;
            funcData.icon = 1;
            funcData.title = menuNodes[i].m_szCaption;
        }
        return result;
    }
}

