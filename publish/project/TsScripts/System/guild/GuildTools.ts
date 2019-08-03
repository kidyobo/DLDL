import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ActivityData } from 'System/data/ActivityData'
import { GuildData } from 'System/data/GuildData'
import { HeroData } from 'System/data/RoleData'
import { ThingData } from 'System/data/thing/ThingData'
import { LangData } from 'System/data/LangData'
import { GuildRule } from 'System/constants/GuildRule'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { MapId } from 'System/map/MapId'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { Constants } from 'System/constants/Constants'

 /**
 * 宗门工具
 * @author lyl
 */
export class GuildTools {

    /**获取可兑换物品数量*/
    static getCanBuyCount(thingId: number): number {

        let heroData: HeroData = G.DataMgr.heroData;
        let buyMoney: number = GuildTools.getDepotBuyMoney(thingId);
        let count: number = heroData.guildDonateCur / buyMoney;
        return count;
    }

    /**获取宗门仓库兑换需要金钱数量*/
    static getDepotBuyMoney(thingId: number, currentCount: number = 1): number {
        let needMoney: number = 0;
        let thingConfig = ThingData.getThingConfig(thingId);
        if (thingConfig) {
            needMoney = thingConfig.m_uiGuildBuy;
        }
        return needMoney * currentCount;
    }

    /**
     * 获取带职位描述的成员名称。
     * @param memberName
     * @param memberGrade
     */
    static getMemberNameWithPosition(memberName: string, memberGrade: number): string {
        if (GuildTools.checkIsHasPos(memberGrade)) {
            memberName = uts.format('[{0}]{1}', GuildTools.getPosName(memberGrade), memberName);
        }
        return memberName;
    }

    /**检查是否为超级管理者*/
    static checkIsManager(grade: number): boolean {
        return (grade == Macros.GUILD_GRADE_CHAIRMAN || grade == Macros.GUILD_GRADE_VICE_CHAIRMAN);
    }

    /**检查是否有职位*/
    static checkIsHasPos(grade: number): boolean {
        return (grade == Macros.GUILD_GRADE_CHAIRMAN || grade == Macros.GUILD_GRADE_VICE_CHAIRMAN || grade == Macros.GUILD_GRADE_ELDER);
    }

    /**
     * 获取宗门职位名称
     * @param	pose   职位ID
     * @return
     */
    static getPosName(poseId: number): string {
        let gradeName: string;
        if (poseId == Macros.GUILD_GRADE_CHAIRMAN) {
            gradeName = '宗主';
        }
        else if (poseId == Macros.GUILD_GRADE_VICE_CHAIRMAN) {
            gradeName = '副宗主';
        }
        else if (poseId == Macros.GUILD_GRADE_ELDER) {
            gradeName = '长老';
        }
        else if (poseId == Macros.GUILD_GRADE_MEMBER) {
            gradeName = '成员';
        }
        else {
            gradeName = '无';
        }
        return gradeName;
    }

    /**
     * 获取宗门职位权限等级
     * @param	pose   职位ID
     * @return
     */
    static getPosLevel(poseId: number): number {
        let level: number = GuildRule.POS_LEVEL.indexOf(poseId);
        return level;
    }


    /**检查道具是否超过申请人数*/
    static checkIsApplyMaxCount(id: number): boolean {
        let m_stItemList: Protocol.GuildStoreItem[] = GuildTools.guildData.guildDepotInfo.m_stItemList;
        for (let obj of m_stItemList) {
            if (obj.m_uiItemID == id) {
                return obj.m_stApplyInfo.m_ushNumber >= Macros.MAX_GUILD_TIME_APPLY_NUMBER;
            }
        }
        return false;
    }

    static TITLES = [1003, 1004];
    private static _isNoTipsGotoZMMJ: boolean = false;
    private static _isNotTipsCallPartner: boolean = false;

    reset(): void {
    }

    static get guildData(): GuildData {
        return G.DataMgr.guildData;
    }

    static gotoMap(isTips: boolean = false): void {
        let activityData: ActivityData = G.DataMgr.activityData;
        if (G.DataMgr.heroData.guildId <= 0) {
            if (isTips)
                G.TipMgr.addMainFloatTip('没有宗门，不能进入战场');
        }
        else {
            let activityStatus: Protocol.ActivityStatus = activityData.getActivityStatus(Macros.ACTIVITY_ID_GUILDPVPBATTLE);
            if (activityStatus.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUILDPVPBATTLE);
            }
            else {
                if (isTips)
                    G.TipMgr.addMainFloatTip('活动尚未开启或者已经结束');
            }
        }
    }

    /**召集成员*/
    static summonGuildMembers(): void {
        let cost = GuildTools.getSummonPrice();
        let bindCost = cost * Constants.SummonBindRate;
        if (!GuildTools._isNoTipsGotoZMMJ) {
            let info = uts.format('是否消耗{0}召集本宗门成员到自己身边？（绑钻不足则消耗{1}）', TextFieldUtil.getGoldBindText(cost * 5), TextFieldUtil.getYuanBaoText(cost));
            G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', GuildTools.onCallMemberTip);
        }
        else {
            GuildTools.sendCallMember(cost, bindCost);
        }
    }

    /**求救*/
    static callGuildMembers(): void {
        let cost = GuildTools.getSummonPrice();
        let bindCost = cost * Constants.SummonBindRate;
        if (!GuildTools._isNotTipsCallPartner) {
            let info = uts.format('求助将会消费{0}，是否继续，如果继续，本次登录中再次点击则不再提示了', TextFieldUtil.getGoldBindText(cost), TextFieldUtil.getYuanBaoText(cost));
            G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', GuildTools.onCallMemberTip);
        }
        else {
            GuildTools.sendCallMember(cost, bindCost);
        }
    }

    private static getSummonPrice(): number {
        let cost = 0;
        if (Macros.PINSTANCE_ID_WORLDBOSS == G.DataMgr.sceneData.curPinstanceID) {
            cost = G.DataMgr.constData.getValueById(KeyWord.PARAMETER_BOSS_CALLUP);
        }
        else if (Macros.PINSTANCE_ID_XZFM == G.DataMgr.sceneData.curPinstanceID) {
            cost = G.DataMgr.constData.getValueById(KeyWord.PARAM_XZFM_HELP_BY);
        }
        else {
            cost = G.DataMgr.constData.getValueById(KeyWord.PARAMETER_FMTBOSS_CALLUP);
        }
        return cost;
    }

    /**点击召集成员二次提示处理*/
    private static onCallMemberTip(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            GuildTools._isNoTipsGotoZMMJ = isCheckSelected;
            if (Macros.PINSTANCE_ID_XZFM == G.DataMgr.sceneData.curPinstanceID) {
                GuildTools._isNotTipsCallPartner = isCheckSelected;
            }
            let cost = GuildTools.getSummonPrice();
            let bindCost = cost * Constants.SummonBindRate;
            GuildTools.sendCallMember(cost, bindCost);
        }
    }

    /**请求召集成员*/
    private static sendCallMember(cost: number, bindCost: number): void {
        let curSceneID = G.DataMgr.sceneData.curSceneID;
        let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        if (Macros.PINSTANCE_ID_XZFM != curPinstanceID&&(0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, bindCost, true) ||
            0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true))) {
            let isSuccess = false;
            if (Macros.PINSTANCE_ID_WORLDBOSS == G.DataMgr.sceneData.curPinstanceID) {
                // 世界boss
                let bossId = G.DataMgr.runtime.lastWorldBossId;
                if (bossId > 0) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_GUILDCALL, bossId));
                    isSuccess = true;
                }
            }
            else if (G.DataMgr.fmtData.isFmtScene(curSceneID)) {
                // 黑洞塔
                let cfg = G.DataMgr.fmtData.getFmtCfgBySceneId(curSceneID);
                if (null != cfg) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_GUILDCALL, cfg.m_iLayer));
                    isSuccess = true;
                }
            }
            else if (MapId.isDgBossMapId(curSceneID)) {
                // 地宫boss
                let layer = MapId.getDgBossLayer(curSceneID);
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_GUILDCALL, layer));
                isSuccess = true;
            }
            
            else {
                // 宗门秘境
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ZPFM, Macros.ACTIVITY_ZPFM_GUILDCALL));
                isSuccess = true;
            }

            if (isSuccess) {
                G.TipMgr.addMainFloatTip('成功发出召集', Macros.PROMPTMSG_TYPE_POPUP);
            }
        }

        if (Macros.PINSTANCE_ID_XZFM == curPinstanceID) {
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, cost, true)) {
                if (Macros.PINSTANCE_ID_XZFM == curPinstanceID) {
                    //远古BOSS
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getXZFMGuildCallRequest());
                    G.TipMgr.addMainFloatTip('成功发出求助', Macros.PROMPTMSG_TYPE_POPUP);
                }
            }
        }
    }

    static responseCallZpfm(response: Protocol.Guild_CS_Response): void {
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_ZPFM))
            return;
        let curSceneID: number = G.DataMgr.sceneData.curSceneID;
        if (MapId.isZMMJMapId(curSceneID))
            return;
        let guildCallZPFMRsp: Protocol.GuildCallZPFMResponse = response.m_stValue.m_stGuildCallZPFMRsp;
        let nickName: string = G.DataMgr.guildData.guildAbstract.m_stLeaderList.m_astGuildMemberInfo[0].m_stBaseProfile.m_szNickName;
        let confirmInfo: string = G.DataMgr.langData.getLang(129, nickName);
        G.TipMgr.showConfirm(confirmInfo, ConfirmCheck.noCheck, '确定|取消', this._onCallMemberTipToZpfm);
    }

    private static _onCallMemberTipToZpfm(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            G.DataMgr.guildData.gotoGuildSecrectArea();
        }
    }

    static doExchange(itemData: ThingItemData, num: number) {
        let heroData = G.DataMgr.heroData;
        let needMoney = GuildTools.getDepotBuyMoney(itemData.data.m_iThingID, num);
        if (heroData.guildDonateCur >= needMoney) {
            let thingVo: Protocol.ContainerThing = {} as Protocol.ContainerThing;
            thingVo.m_iThingID = itemData.data.m_iThingID;
            thingVo.m_iNumber = num;
            thingVo.m_usPosition = itemData.data.m_usPosition;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreTakeOutRequest([thingVo], heroData.roleID));
        }
        else {
            G.TipMgr.addMainFloatTip(uts.format('宗门贡献值不足{0}，无法兑换', needMoney));
        }
    }
}

