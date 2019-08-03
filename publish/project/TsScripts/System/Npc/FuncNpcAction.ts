import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { NPCData } from 'System/data/NPCData'
import { PinstanceData } from 'System/data/PinstanceData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { NpcActionData } from 'System/data/NpcActionData'
import { StringUtil } from 'System/utils/StringUtil'
import { SellView } from 'System/jishou/SellView'
import { KuaiSuShengJiView } from 'System/activity/view/KuaiSuShengJiView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { JishouView } from 'System/jishou/JishouView'
import { ExchangeView } from 'System/business/view/ExchangeView'


export class FuncNpcAction {
    /**是否不再提示治疗花费。*/
    private m_noPrompHeal: boolean = false;

    getListData(id: number, listData: NpcActionData[]): NpcActionData[] {
        if (null == listData) {
            listData = [];
        }
        let npcConfig: GameConfig.NPCConfigM = NPCData.getNpcConfig(id);

        let heroLevel: number = G.DataMgr.heroData.level;

        //npc的其他功能
        let limitConf: GameConfig.NPCFunctionLimitM;

        let funcData: NpcActionData;
        let funcList: GameConfig.NPCFunction[] = npcConfig.m_astNPCFunction;
        // 显示NPC相关功能信息
        for (let func of npcConfig.m_astNPCFunction) {
            funcData = new NpcActionData();
            funcData.func = func;
            funcData.type = func.m_ucFunction;

            limitConf = G.DataMgr.funcLimitData.getFuncLimitConfig(func.m_ucFunction);
            funcData.limitLevel = (null != limitConf && heroLevel < limitConf.m_ucLevel) ? limitConf.m_ucLevel : 0;

            let funcDesc = KeyWord.getDesc(KeyWord.GROUP_NPC_FUNCTION, func.m_ucFunction);

            switch (func.m_ucFunction)//功能类型
            {
                case KeyWord.NPC_FUNCTION_TRANSPORT:
                    // 传送
                    funcData.title = funcDesc + G.DataMgr.sceneData.getTeleportConfig(func.m_iParam).m_szName;
                    listData.push(funcData);
                    continue;

                case KeyWord.NPC_FUNCTION_PINSTANCE:
                    let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(func.m_iParam);
                    let desc: string;
                    if (0 < pinstanceConfig.m_ucTeamNumber) {
                        desc = '报名参加' + pinstanceConfig.m_szName + '活动';
                    }
                    else {
                        desc = '进入' + pinstanceConfig.m_szName + '副本';
                    }

                    if (0 != pinstanceConfig.m_ucEnterTimes) {
                        // 限次副本
                        desc += '  (' + G.DataMgr.systemData.getFinishTime(pinstanceConfig.m_iPinstanceID) + '/' +
                            G.DataMgr.systemData.getPinstanceTotalTimes(pinstanceConfig) + ')';
                    }

                    funcData.title = desc;
                    listData.push(funcData);
                    continue;

                //脚本的要过滤
                case KeyWord.NPC_FUNCTION_SCRIPT:
                    continue;

                default:
                    funcData.title = funcDesc;
                    listData.push(funcData);
                    continue;
            }
        }

        return listData;
    }

    action(npcFunction: GameConfig.NPCFunction, ownerID: number): void {
        let limitConf: GameConfig.NPCFunctionLimitM = G.DataMgr.funcLimitData.getFuncLimitConfig(npcFunction.m_ucFunction);
        if (null != limitConf && G.DataMgr.heroData.level < limitConf.m_ucLevel) {
            // 等级受限制
            G.TipMgr.addMainFloatTip(!StringUtil.isEmpty(limitConf.m_szDisableMsg) ? limitConf.m_szDisableMsg : '该功能尚未开启！');
            return;
        }

        switch (npcFunction.m_ucFunction) {
            case KeyWord.NPC_FUNCTION_TRANSPORT:
                // 传送
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getNPCTransportRequestMsg(ownerID, npcFunction.m_iParam));
                break;

            case KeyWord.NPC_FUNCTION_PINSTANCE:
                G.ModuleMgr.pinstanceModule.tryEnterPinstance(npcFunction.m_iParam, 0, ownerID);
                break;

            case KeyWord.NPC_FUNCTION_HEAL:
                this._healHero(ownerID);
                break;

            case KeyWord.NPC_FUNCITON_MARRY:
                let heroData = G.DataMgr.heroData;
                if (G.DataMgr.teamData.hasTeam && G.DataMgr.teamData.memberList.length == 1) {
                    let target: Protocol.TeamMemberInfoForNotify = G.DataMgr.teamData.memberList[0];

                    if (target.m_ucGenderType != heroData.gender && heroData.level >= 70 && target.m_usLevel >= 70) {
                        //this.dispatchEvent(Events.ShowOrCloseMarryDialog, DialogCmd.open, null, Macros.HY_APPLY_MARRY);
                        return;
                    }
                }
                G.TipMgr.addMainFloatTip('需要男女双方单独组队并且双方等级都达到70级');
                break;

            case KeyWord.NPC_FUNCITON_DIVORCE:
                if (G.DataMgr.heroData.mateName != '') {
                    //this.dispatchEvent(Events.ShowDivoeceDialog);
                }
                else {
                    G.TipMgr.addMainFloatTip('您当前还没有仙侣');
                }
                break;

            case KeyWord.NPC_FUNCITON_QIFU:
                //祈福
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_QIFU, true))
                    G.Uimgr.createForm<KuaiSuShengJiView>(KuaiSuShengJiView).open();
                break;
            case KeyWord.NPC_FUNCTION_CONSIGNMENT:
                //交易所
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_JISHOU, true))
                    G.Uimgr.createForm<JishouView>(JishouView).open();
                break;
            case KeyWord.NPC_FUNCTION_SHOP:
                //兑换商城
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_EXCHANGE, true))
                    G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_REPUTATION);
                break;
            default:
                break;
        }
    }

    /**
     * 治疗玩家及其散仙。
     * 
     */
    private _healHero(ownerID: number): void {
        let heroData = G.DataMgr.heroData;
        let lostHP: number = heroData.getProperty(Macros.EUAI_MAXHP) - heroData.getProperty(Macros.EUAI_CURHP);

        // 向下取整
        if (0 == lostHP) {
            G.TipMgr.addMainFloatTip('您不需要治疗。');
            return;
        }

        let isBind: boolean = true;

        let cost: number = G.DataMgr.constData.getValueById(KeyWord.PARAM_CAMPBATTLE_BIND_PRICE);
        let costString: string = TextFieldUtil.getGoldBindText(cost);

        if (cost > heroData.gold_bind) {
            cost = G.DataMgr.constData.getValueById(KeyWord.PARAM_CAMPBATTLE_PRICE);
            costString = TextFieldUtil.getYuanBaoText(cost);
            isBind = false;
        }

        if (isBind || 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
            if (this.m_noPrompHeal) {
                this._onHealConfirm(MessageBoxConst.yes, this.m_noPrompHeal, ownerID);
            }
            else {
                G.TipMgr.showConfirm(uts.format('确定花费{0}恢复{1}吗？', costString, TextFieldUtil.getColorText('满血', Color.GREEN)),
                    ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onHealConfirm, ownerID));
            }
        }
    }

    /**
     * 确认治疗的回调函数 
     * @param args - 花费的铜钱
     * @param state
     * 
     */
    private _onHealConfirm(state: MessageBoxConst = 0, isCheckSelected: boolean, ownerID: number): void {
        if (MessageBoxConst.yes == state) {
            this.m_noPrompHeal = isCheckSelected;
            // 发送请求
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHealRequest(ownerID));
        }
    }
}