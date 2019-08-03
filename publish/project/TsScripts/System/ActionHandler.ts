import { MessageBox } from './uilib/MessageBox';
import { LuckyCatView } from './activity/luckyCat/LuckyCatView';
import { UIManager } from './uilib/UIManager';
import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { FanLiDaTingView } from "System/activity/fanLiDaTing/FanLiDaTingView";
import { FirstRechargeView } from "System/activity/view/FirstRechargeView";
import { BagEquipView } from "System/bag/view/BagEquipView";
import { BagView } from "System/bag/view/BagView";
import { MallView } from "System/business/view/MallView";
import { Constants } from "System/constants/Constants";
import { EnumStoreID, MenuNodeKey, PathingState, SceneID } from "System/constants/GameEnum";
import { GameIDType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { BuffData } from "System/data/BuffData";
import { AutoBuyInfo } from "System/data/business/AutoBuyInfo";
import { FuncLimitData } from "System/data/FuncLimitData";
import { MonsterData } from "System/data/MonsterData";
import { PetData } from "System/data/pet/PetData";
import { PinstanceData } from "System/data/PinstanceData";
import { SkillData } from "System/data/SkillData";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { BeautyEquipListItemData } from "System/data/vo/BeautyEquipListItemData";
import { RoleAbstract } from "System/data/vo/RoleAbstract";
import { EquipView } from "System/equip/EquipView";
import { FaQiView } from "System/faqi/FaQiiView";
import { FriendView, FriendViewTab } from "System/friend/FriendView";
import { Global as G } from "System/global";
import { GuildView } from "System/guild/view/GuildView";
import { HeroView } from "System/hero/view/HeroView";
import { JishouView } from "System/jishou/JishouView";
import { JiuXingView } from "System/jiuxing/JiuXingView";
import { JuYuanView } from "System/juyuan/JuYuanView";
import { SendFlowerView } from "System/Marry/SendFlowerView";
import { ItemMergeView } from "System/Merge/ItemMergeView";
import { PayView } from "System/pay/PayView";
import { PetJinJieFuncTab } from "System/pet/PetJinJiePanel";
import { PetView } from "System/pet/PetView";
import { BossView } from "System/pinstance/boss/BossView";
import { FengMoTaView } from "System/pinstance/fmt/FengMoTaView";
import { PinstanceHallView } from "System/pinstance/hall/PinstanceHallView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ShengQiView } from "System/shengqi/ShengQiView";
import { SkillView } from "System/skill/view/SkillView";
import { EnumTanBaoType, TanBaoView } from "System/tanbao/TanBaoView";
import { TeamView } from "System/team/TeamView";
import { MessageBoxConst } from "System/tip/TipManager";
import { ConfirmCheck } from "System/tip/TipManager";
import { EnumThingID, EnumAutoUse } from 'System/constants/GameEnum'
import { MenuNodeData } from "System/uilib/MenuView";
import { CompareUtil } from "System/utils/CompareUtil";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UnitStatus } from "System/utils/UnitStatus";
import { VipTab, VipView } from "System/vip/VipView";
import { ShieldGodView } from 'System/shield/ShieldGodView'
import { MainMarryView } from 'System/Marry/MainMarryView'
import { FanXianTaoView } from 'System/equip/FanXianTaoView'
import { ChongZhiKuangHuanView } from "System/activity/newKaiFuAct/ChongZhiKuangHuanView"
import { ActivityData } from 'System/data/ActivityData'
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView'
import { ChannelData } from "System/chat/ChannelData"
import { ChannelMsgData } from "System/chat/ChannelMsgData"
import { HunLiPanel } from 'System/hunli/HunLiPanel'
import { HunLiView } from 'System/hunli/HunLiView'
import { HunGuView } from 'System/hungu/HunGuView'
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView'
import { FriendPanel } from 'System/friend/FriendPanel'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { HunguSelectView } from 'System/hunli/HunguSelectView'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { Color } from 'System/utils/ColorUtil'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";
import { KuaiSuShengJiView } from './activity/view/KuaiSuShengJiView';
//import { PrivilegeMsgBoxView } from 'System/vip/PrivilegeMsgBoxView'
import { RiChangView } from 'System/richang/RiChangView'
import { MarketItemData } from './data/vo/MarketItemData';
/**
 * 常用行为处理器。
 * @author teppei
 *
 */
export class ActionHandler {
    private m_noPromptDestroy: boolean;

    private roleAbstracts: RoleAbstract[] = [];
    /**魂骨替换时的提示标记 */
    private isHunguEquipTips = false;
    private isHunguSkillTips = false;


    /**
    * 根据技能id取到相应的buff配置
    * @param config
    * @return
    *
    */
    getBuffConfigByThingId(thingId: number): GameConfig.BuffConfigM[] {
        let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(thingId);
        if (thingConfig.m_ucFunctionType != KeyWord.ITEM_FUNCTION_SKILL || 0 == thingConfig.m_iFunctionID) {
            return null;
        }

        let skill: GameConfig.SkillConfigM = SkillData.getSkillConfig(thingConfig.m_iFunctionID);
        if (defines.has('_DEBUG')) {
            uts.assert(skill != null, '物品' + thingId + '没有对应的技能！');
        }

        let result: GameConfig.BuffConfigM[] = new Array<GameConfig.BuffConfigM>();
        let len: number = skill.m_astSkillEffect.length;
        let effect: GameConfig.SkillEffectM;
        let buffConfig: GameConfig.BuffConfigM;
        for (let i: number = 0; i < len; ++i) {
            effect = skill.m_astSkillEffect[i];
            if (effect.m_iEffectObj == KeyWord.SKILL_EFFECT_BUFF) {
                buffConfig = BuffData.getBuffByID(effect.m_iEffectValue);
                if (defines.has('_DEBUG')) {
                    uts.assert(null != buffConfig, '必须是buff配置');
                }
                result.push(buffConfig);
            }
        }

        return result;
    }


    /**
	* 获取自动购买信息。
	* @param thingID 欲购买的物品。
	* @param num 欲购买数量。
	* @param prompt 是否弹出提示。
	* @param mode 购买模式，0表示混合购买，1表示绑钻购买，2表示非绑钻购买。
	* @return
	*
	*/
    checkAutoBuyInfo(thingID: number, num: number, prompt: boolean = false, mode: number = 0): AutoBuyInfo {
        let info: AutoBuyInfo = new AutoBuyInfo();

        info.bindPrice = G.DataMgr.npcSellData.getPriceByID(thingID, 0, EnumStoreID.MALL_YUANBAOBIND, KeyWord.MONEY_YUANBAO_BIND_ID, 1, false, true);
        info.nonbindPrice = G.DataMgr.npcSellData.getPriceByID(thingID, 0, EnumStoreID.MALL_YUANBAO, KeyWord.MONEY_YUANBAO_ID, 1, false, true);

        if (1 == mode || 0 == mode) {
            // 只用绑钻购买，或者混合购买，先用绑钻测试
            if (info.bindPrice > 0) {
                info.bindCnt = Math.max(0, Math.floor(G.DataMgr.heroData.gold_bind / info.bindPrice));
                info.bindCost = info.bindPrice * info.bindCnt;
            }
        }

        if (2 == mode || 0 == mode) {
            // 只用非绑钻购买，或者混合购买，再用非绑钻测试
            if (info.nonbindPrice > 0) {
                // 绑定商城里面有，优先从绑定商城找
                info.nonbindCnt = Math.min(num - info.bindCnt, Math.max(0, Math.floor(G.DataMgr.heroData.gold / info.nonbindPrice)));
                info.nonbindCost = info.nonbindPrice * info.nonbindCnt;
            }
        }

        // 最终看结果怎样
        if (info.bindCnt + info.nonbindCnt >= num) {
            info.isAffordable = true;
        }
        else {
            info.isAffordable = false;
            if (prompt) {
                G.ModuleMgr.businessModule.queryCharge('您的钻石不足，请充值。');
            }
        }

        return info;
    }

    /**
     * 根据指定的货币类型和价格判断是否支付得起。铜钱不区分绑定非绑定，钻石则按下述规则检查：
     * 如果传入绑定钻石ID - KeyWord.MONEY_YUANBAO_BIND_ID，则优先检查绑定钻石，不足则继续检查
     * 非绑定钻石；若传入钻石ID - KeyWord.MONEY_YUANBAO_ID，则明确检查非绑定钻石。
     * @param exChangeID 货币类型ID。
     * @param price 价格。
     * @param prompt 是否提示。
     * @return 如果指定的货币类型余额足够支持指定的价格则返回0，否则返回不足的数量。
     *
     */
    getLackNum(exChangeID: number, price: number, prompt: boolean = false): number {
        let has = G.DataMgr.getOwnValueByID(exChangeID);
        if (has < price) {
            if (prompt) {

                let excName: string;
                if (GameIDUtil.isBagThingID(exChangeID)) {
                    excName = ThingData.getThingConfig(exChangeID).m_szName;
                }
                else {
                    excName = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, exChangeID);
                }
                if (KeyWord.MONEY_YUANBAO_ID == exChangeID) {
                    G.ModuleMgr.businessModule.queryCharge(uts.format('您的{0}不足{1}，请充值。', excName, price));
                }
                else {
                    G.TipMgr.addMainFloatTip(uts.format('您的{0}不足{1}。', excName, price));
                }
            }
            return price - has;
        }
        return 0;
    }

    /**
		 * 将指定的玩家加为好友。
		 * @param roleID
		 *
		 */
    addFriend(roleID: Protocol.RoleID, level: number): void {
        if (!this.checkCrossSvrUsable(true)) {
            return;
        }
        let limitLevel: number = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.SUBBAR_FUNCTION_HAOYOU).m_ucLevel;
        if (limitLevel > G.DataMgr.heroData.level) {
            G.TipMgr.addMainFloatTip(uts.format('您未满{0}级，无法添加好友！', limitLevel));
            return;
        }

        if (limitLevel > level) {
            G.TipMgr.addMainFloatTip(uts.format('对方未满{0}级，无法添加为好友！', limitLevel));
            return;
        }

        if (G.DataMgr.friendData.isMyFriend(roleID)) {
            G.TipMgr.addMainFloatTip('对方已经是您的好友了。');
            return;
        }
        if (G.DataMgr.friendData.isBlack(roleID)) {
            G.TipMgr.addMainFloatTip('对方在您的黑名单中了,无法添加好友。');
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getApplyFriendRequest(roleID));
    }

    /**
     *  将指定的玩家加为仇人。
     * @param roleID
     *
     */
    addEnemy(roleID: Protocol.RoleID): void {
        if (!this.checkCrossSvrUsable(true)) {
            return;
        }
        if (G.DataMgr.friendData.isMyEnemy(roleID)) {
            G.TipMgr.addMainFloatTip('对方已经是您的仇人了。');
            return;
        }

        G.TipMgr.showConfirm('确定要将该玩家添加为仇人？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onAddEnemy, roleID));
    }

    private _onAddEnemy(state: MessageBoxConst, isCheckSelected: boolean, roleID: Protocol.RoleID): void {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddFriendRequest(roleID, Macros.FRIEND_TYPE_ENEMY));
        }
    }

    /**
     * 将指定的玩家加入黑名单。
     * @param roleID
     *
     */
    addBlack(roleID: Protocol.RoleID): void {
        if (!this.checkCrossSvrUsable(true)) {
            return;
        }
        if (G.DataMgr.friendData.isBlack(roleID)) {
            G.TipMgr.addMainFloatTip('对方已经在您的黑名单中了。');
            return;
        }
        if (!G.DataMgr.friendData.isMyFriend(roleID)) {
            G.TipMgr.addMainFloatTip('对方不是你的好友，无法拉黑。');
            return;
        }

        G.TipMgr.showConfirm('确定要将该玩家拉黑？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onAddBlack, roleID));
    }

    private _onAddBlack(state: MessageBoxConst, isCheckSelected: boolean, roleID: Protocol.RoleID): void {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddFriendRequest(roleID, Macros.FRIEND_TYPE_BLACK));
        }
    }

    /**
     * 查看某人的详细资料。
     * @param roleID
     *
     */
    getProfile(roleID: Protocol.RoleID): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFriendRoleInfoRequest(roleID));
    }

    /**
     * 邀请指定的玩家入队。
     * @param roleID
     *
     */
    inviteTeam(roleID: Protocol.RoleID, isGuild: boolean = false): void {
        if (!this.checkCrossSvrUsable(true)) {
            return;
        }
        if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.SUBBAR_FUNCTION_TEAM, true)) {
            //和宗门的组队要区分
            if (isGuild) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_InviteRole, roleID, null));
            } else {
                let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
                if (myTeam) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossRecruitTeamRequest(myTeam.m_uiPinstanceID));
                }
            }
            G.TipMgr.addMainFloatTip('已发送组队邀请');
        } else {
            G.TipMgr.addMainFloatTip('还不能使用组队功能');
        }
    }
    /**
     * 加入指定的玩家队伍。
     * @param roleID
     *
     */
    joinTeam(roleID: Protocol.RoleID): void {
        if (!this.checkCrossSvrUsable(true)) {
            return;
        }
        if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.SUBBAR_FUNCTION_TEAM, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_InviteRole, roleID, null));
        }
    }

    /**
     * 复制名字
     * @param roleID
     *
     */
    copyName(name: string): void {
        //let chatModule: ChatModule = G.module.getModule(EnumModuleName.ChatModule) as ChatModule;
        //chatModule.copyNameToChat(name);
    }

    /**
     * 获取玩家菜单。
     * @param isOnline
     * @return
     *
     */
    getRoleMenu(menuNodes: MenuNodeData[], roleID: Protocol.RoleID, isOnline: boolean, needChat: boolean = true, needTeam: boolean = true, needFriend: boolean = true, needFlower: boolean = true, isCaption: boolean = false): void {
        menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_INFO, null, roleID));

        let isSelf: boolean = CompareUtil.isRoleIDEqual(roleID, G.DataMgr.heroData.roleID);

        if (!isSelf) {
            if (isOnline) {
                if (needChat) {
                    if (G.DataMgr.friendData.isMyFriend(roleID)) {
                        menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_TALK, null, roleID));
                    }
                }

                if (needTeam && !G.DataMgr.teamData.isMyTeamMember(roleID)) {
                    if (isCaption) {
                        menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_TEAM, '申请入队', roleID));
                    }
                    else {
                        menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_TEAM, '邀请组队', roleID));
                    }
                }
            }

            if (needFriend) {
                if (!G.DataMgr.friendData.isMyFriend(roleID)) {
                    menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_ADD_FRIEND, null, roleID));
                }
                if (!G.DataMgr.friendData.isBlack(roleID)) {
                    menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_BLACK, null, roleID));
                }
            }

            if (needFlower) {
                menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_FLOWER, null, roleID));
            }
        }

        menuNodes.push(new MenuNodeData(MenuNodeKey.ROLE_COPYNAME, null, roleID));
    }

    onRoleMenu(role: RoleAbstract, menuKey: MenuNodeKey): void {
        this.roleAbstracts.length = 0;
        this.roleAbstracts.push(role);
        if (menuKey == MenuNodeKey.ROLE_INFO) {
            if (!G.DataMgr.otherPlayerData.isOtherPlayer) {
                G.Uimgr.closeForm(HeroView);
            }
            this.getProfile(role.roleID);
        }
        else if (menuKey == MenuNodeKey.ROLE_TALK) {
            //跨服环境下不可私聊
            if (!G.ActionHandler.checkCrossSvrUsable(true)) {
                return;
            }
            let friendData = G.DataMgr.friendData;
            if (friendData.isBlack(role.roleID)) {
                G.TipMgr.addMainFloatTip("对方在您的黑名单中,不能私聊!");
                return;
            } else {
                //打开好友面板进行私聊
                G.Uimgr.createForm<FriendView>(FriendView).open(FriendViewTab.FriendPanel, this.roleAbstracts);
            }
        }
        else if (menuKey == MenuNodeKey.ROLE_ADD_FRIEND) {
            this.addFriend(role.roleID, role.lv);
        }
        else if (menuKey == MenuNodeKey.ROLE_ADD_ENEMY) {
            this.addEnemy(role.roleID);
        }
        else if (menuKey == MenuNodeKey.ROLE_BLACK) {
            this.addBlack(role.roleID);
        }
        else if (menuKey == MenuNodeKey.ROLE_COPYNAME) {
            //let chatModule: ChatModule = G.module.getModule(EnumModuleName.ChatModule) as ChatModule;
            //chatModule.copyNameToChat(role.nickName);
        }
        else if (menuKey == MenuNodeKey.ROLE_TEAM) {
            this.inviteTeam(role.roleID, true);
        }
        else if (menuKey == MenuNodeKey.ROLE_FLOWER) {
            G.Uimgr.createForm<SendFlowerView>(SendFlowerView).open(role.nickName, role.roleID);
        }
        else if (menuKey == MenuNodeKey.TEAM_CAPTAIN) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_NewCaptain, role.roleID));
        }
        else if (menuKey == MenuNodeKey.TEAM_KICK) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_KickMember, role.roleID));
        }
        else if (menuKey == MenuNodeKey.ROLE_DELECT) {
            //删除好友
            let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
            if (friendPanel != null) {
                friendPanel.deleteFriend(role);
            }
        }
    }

    handlePinstance(pinstanceID: number, value: number) {
        if (pinstanceID == Macros.PINSTANCE_ID_JDYJ) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_JQFB);
        }
        else if (PinstanceIDUtil.ZuDuiFuBenIDs.indexOf(pinstanceID) >= 0) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_ZDFB, 0, 0, pinstanceID);
        }
        if (PinstanceIDUtil.TeQuanFuBenIDs.indexOf(pinstanceID) >= 0) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_ZRJT);
        }
        else if (pinstanceID == Macros.PINSTANCE_ID_WST) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_DZZL);
        }
        else if (pinstanceID == Macros.PINSTANCE_ID_SHNS) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_SHMJ);
        }
        else if (pinstanceID == Macros.PINSTANCE_ID_PVP) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
        }
        else if (pinstanceID == Macros.PINSTANCE_ID_BPXD) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_JSTZ);
        }
        else if (Macros.PINSTANCE_ID_MAGICCUBE == pinstanceID) {
            let view = G.Uimgr.createForm<HeroView>(HeroView);
            view.open(KeyWord.OTHER_FUNCTION_MAGICCUBE);
        }
        else if (Macros.PINSTANCE_ID_WORLDBOSS == pinstanceID) {
            let view = G.Uimgr.createForm<BossView>(BossView);
            view.open(KeyWord.OTHER_FUNCTION_WORLDBOSS);
        }
        else if (Macros.PINSTANCE_ID_DIGONG == pinstanceID) {
            let view = G.Uimgr.createForm<BossView>(BossView);
            view.open(KeyWord.OTHER_FUNCTION_DI_BOSS);
        }
        else if (Macros.PINSTANCE_ID_WYFB == pinstanceID) {
            this.executeFunction(KeyWord.OTHER_FUNCTION_WYFB);
        }
        else {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(pinstanceID);
        }
    }

    /**
     *处理国运逻辑
     *
     */
    handleGuoyun(): void {
        let qp: Protocol.QuestProgress = G.DataMgr.questData.getDoingQuestByType(KeyWord.QUEST_TYPE_GUO_YUN, false, false);
        if (null != qp) {
            G.ModuleMgr.questModule.tryAutoDoQuest(qp.m_iQuestID, false);
        }
        else {
            // 本国和边境可以直接飞过去
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUOYUN_NPC, 0, 0, G.DataMgr.questData.nextGuoYunQuestID);
        }
    }

    ////////////////////////////////////////////// 物品可用性判断 //////////////////////////////////////////////

    /**
     * 判断背包中某个道具能不能使用
     * @param itemData
     * @return
     *
     */
    canUse(config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, needPromp: boolean = true): boolean {
        // 检查跨服可用
        //if (0 == config.m_ucKFUse) {
        //    return false;
        //}
        //


        // 角色装备检查职业
        if (GameIDUtil.isRoleEquipID(config.m_iID)) {
            if (config.m_ucProf != KeyWord.PROFTYPE_COMMON && G.DataMgr.heroData.profession != config.m_ucProf) {
                if (needPromp) {
                    G.TipMgr.addMainFloatTip(uts.format('只有{0}职业才能使用该装备。', KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, config.m_ucProf)));
                }
                return false;
            }
        }
        else if (GameIDUtil.isOtherEquipID(config.m_iID)) {
            //let type: number = GameIDUtil.getSubTypeByEquip(config.m_iID);
            //let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(type);

            //if (data.m_ucLevel < config.m_ucRequiredLevel) {
            //    if (needPromp) {
            //        G.TipMgr.addMainFloatTip(uts.format('{0}等阶不足', KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, type)));
            //    }
            //    return false;
            //}
            //else {
            //    return true;
            //}
        }
        else if (GameIDUtil.isPetEquipID(config.m_iID)) {
            return true;
        }
        // 传送功能的物品只能在本国或4线使用
        if (KeyWord.ITEM_FUNCTION_TRANSFER_CITY == config.m_ucFunctionType) {
            if (G.Mapmgr.canTransport(config.m_szName, needPromp)) {
                return false;
            }
        }
        // 检查场景限制
        let disableList: GameConfig.DisableClass[] = G.DataMgr.sceneData.getSceneInfo(G.DataMgr.sceneData.curSceneID).config.m_stDisable;
        for (let dc of disableList) {
            if (dc.m_iClass > 0 && (dc.m_iClass == config.m_iSubClass || dc.m_iClass == config.m_iMainClass)) {
                if (needPromp) {
                    G.TipMgr.addMainFloatTip('该道具不能在本场景使用。');
                }
                return false;
            }
        }

        // 检查是否过期
        if (null != thingInfo && this._isTimeout(config, thingInfo, needPromp)) {
            return false;
        }

        // 检查等级限制
        if (config.m_ucRequiredLevel > G.DataMgr.heroData.level) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('{0}级后才可使用{1}', config.m_ucRequiredLevel, (GameIDUtil.isEquipmentID(config.m_iID) ? '该装备' : '该物品')));
            }
            return false;
        }

        // 检查冷却
        let functionID: number = config.m_iFunctionID;
        if (GameIDUtil.isSkillID(functionID)) {
            let skill: GameConfig.SkillConfigM = SkillData.getSkillConfig(functionID);
            let cdData = G.DataMgr.cdData.getCdDataBySkill(skill);
            if (cdData) {
                if (needPromp) {
                    G.TipMgr.addMainFloatTip('该物品还在冷却，不能使用');
                }
                return false;
            }
        }

        // 对超级补血药和超级法力药进行判断
        if (KeyWord.ITEM_FUNCTION_SPECIAL_ITEM == config.m_ucFunctionType) {
            // 特殊物品
            if (KeyWord.HP_STORE_THING_ID == config.m_iFunctionID) {
                // 生命药包
                if (G.DataMgr.heroData.getProperty(Macros.EUAI_HPSTORE) >= G.DataMgr.roleAttributeData.getConfig(G.DataMgr.heroData.level).m_iMaxHpOfLevel) {
                    if (needPromp) {
                        G.TipMgr.addMainFloatTip('您当前的生命池已满，无需再补充。');
                    }
                    return false;
                }
            }
            else if (KeyWord.MP_STORE_THING_ID == config.m_iFunctionID) {
                // 法力药包
                if (G.DataMgr.heroData.getProperty(Macros.EUAI_MPSTORE) >= G.DataMgr.roleAttributeData.getConfig(G.DataMgr.heroData.level).m_iMaxMpOfLevel) {
                    if (needPromp) {
                        G.TipMgr.addMainFloatTip('您当前的法力池已满，无需再补充。');
                    }
                    return false;
                }
            } else if (KeyWord.ITEM_FUNCTION_BEAUTY_ACTIVE == config.m_ucFunctionType) {
                return true;
            }
            else {
                //为了经验卡这样加，建议以后有问题增加个经验卡的道具类型
                //经验卡是第一次提示使用，第二次不提示
                //var isBuffID:boolean = GameIDUtil.isBuffID(config.m_iFunctionID);
                //if (isBuffID)
                //{
                //var hero2:Hero=ElementModule(Mgr.ins.module.getModule(EnumModuleName.ElementModule)).hero;
                //return !hero2.hasBuffByID(config.m_iFunctionID);
                //}
            }
        }
        else if (KeyWord.ITEM_FUNCTION_TASK == config.m_ucFunctionType) {
            // 卷轴任务检查是否已领取
            if (!G.DataMgr.questData.canAcceptJuanzhou(needPromp, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * 判断物品是否过期。
     * @param thingConfig 物品配置。
     * @param thingInfo 物品信息。
     * @return 若物品已过期则返回<CODE>true</CODE>，否则返回<CODE>false</CODE>。
     */
    private _isTimeout(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, needPromp: boolean = true): boolean {
        if (1 == thingInfo.m_stThingProperty.m_ucTimerStarted) {
            let serverTime: number = G.SyncTime.getCurrentTime();
            let leftTime: number = thingInfo.m_stThingProperty.m_iPersistTime - Math.floor(serverTime / 1000);

            if (leftTime <= 0) {
                if (needPromp) {
                    G.TipMgr.addMainFloatTip('此物品已过期');
                }
                return true;
            }
        }
        return false;
    }

    /**
    * 检查当前是否处于跨服环境的可用性，如跨服中则返回false，表示不可用。
    * @param needPromp 是否需要弹出提示。
    * @return
    *
    */
    checkCrossSvrUsable(needPromp: boolean, funcId: number = 0): boolean {
        let funcConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(funcId);
        if (null != funcConfig && 1 == funcConfig.m_ucIsCrossOpen) {
            return true;
        }
        if (G.DataMgr.runtime.isAllFuncLocked) {
            let pinstanceID: number = G.DataMgr.sceneData.curPinstanceID;
            let hour: number = (G.SyncTime.getCurrentTime() / 1000 / 3600) % 24;
            //开服第四天凌晨4点前不禁
            if (G.DataMgr.gameParas.worldID == G.DataMgr.heroData.WorldID) {
                if (Macros.PINSTANCE_ID_BATHE == pinstanceID || Macros.PINSTANCE_ID_QUESTION == pinstanceID) {
                    if (G.SyncTime.getDateAfterStartServer() < 4 || (G.SyncTime.getDateAfterStartServer() == 4 && hour < 4)) {
                        return true;
                    }
                }
            }
            //夫妻副本
            if (pinstanceID == Macros.PINSTANCE_ID_FUQI) {
                return true;
            }
            // 跨服不让使用
            if (needPromp) {
                let msg: string;
                if (PinstanceIDUtil.isKfjdc(pinstanceID)) {
                    // 跨服封神榜中
                    msg = '该功能在跨服单挑赛中无法使用';
                }
                else if (PinstanceIDUtil.isCrossTeamPins(pinstanceID)) {
                    // 锁仙台中
                    msg = '该功能在组队副本中无法使用';
                }
                else if (PinstanceIDUtil.isRmbZcPin(pinstanceID)) {
                    // 人民币战场
                    msg = '该功能在战场副本中无法使用';
                }
                else {
                    msg = '副本中无法使用此功能';
                }
                G.TipMgr.addMainFloatTip(msg);
            }
            return false;
        }
        return true;
    }

    /**
     * 是否可以进入指定的副本。
     * @param pinstanceID 指定的副本ID。
     * @param isStrict 是否严格检查，包括检查当前是否在自己国家、是否在副本中。
     * @param needPromp 是否需要弹出提示。
     * @return
     *
     */
    canEnterPinstance(pinstanceID: number, diff: number, isStrict: boolean = true, needPromp: boolean = true): boolean {
        let pConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pinstanceID);

        // 检查功能开放
        let funcID: number = FuncLimitData.getFuncIdByPinstanceID(pinstanceID);
        if (funcID > 0 && !G.DataMgr.funcLimitData.isFuncAvailable(funcID, needPromp)) {
            return false;
        }

        // 检查静态限制
        if (!G.DataMgr.pinstanceData.checkPinstanceStaticCondition(pinstanceID, diff, needPromp)) {
            return false;
        }

        // 检查单人副本
        if (0 == pConfig.m_bIsTeamable && G.DataMgr.teamData.hasTeam) //单人副本
        {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('{0}只允许单人进入，请先离队。', pConfig.m_szName));
            }
            return false;
        }

        // 国运中不可进入副本
        if (G.DataMgr.heroData.guoyunLevel > 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('护送状态下无法进入{0}', pConfig.m_szName));
            }
            return false;
        }

        // 检查国家
        if (isStrict) {
            // 检查是否在副本中
            let crtPinstanceID: number = G.DataMgr.sceneData.curPinstanceID;
            if (crtPinstanceID > 0) {
                if (needPromp) {
                    if (crtPinstanceID == pinstanceID) {
                        G.TipMgr.addMainFloatTip(uts.format('您已经在{0}中了', pConfig.m_szName));
                    }
                    else {
                        G.TipMgr.addMainFloatTip('您正在副本中，无法进入');
                    }
                }
                return false;
            }
        }

        return this.checkMatchingStatus(needPromp);
    }

    /**
     * 检查排队状态，如果因排队不能执行操作则返回false，否则返回true。
     * @param needPromp
     */
    checkMatchingStatus(needPromp: boolean): boolean {
        if (G.DataMgr.heroData.guoyunLevel > 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('护送状态中，请完成任务后再试');
            }
            return false;
        }

        if (G.DataMgr.kfjdcData.isMathing) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('请先取消比武大会的匹配再操作');
            }
            return false;
        }
        if (G.DataMgr.kf3v3Data.isMathing) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(347));
            }
            return false;
        }
        if (G.DataMgr.rmbData.isMathing) {
            G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(185));
            return false;
        }
        return true;
    }

    /**进入某层闯塔*/
    goToFmtLayer(layer: number, pathBossId: number = 0, questId = 0): boolean {
        G.GuideMgr.autoFengMoTa = false;
        G.Uimgr.closeForm(BossView);
        G.Uimgr.closeForm(FengMoTaView);
        G.DataMgr.fmtData.pathFmtBossId = pathBossId;
        if (pathBossId > 0) {
            let cfg = G.DataMgr.fmtData.getFmtCfgByBossId(pathBossId);
            let sceneData = G.DataMgr.sceneData;
            if (cfg.m_iSceneID == sceneData.curSceneID && sceneData.isEnterSceneComplete) {
                // 已经在该场景了
                G.ModuleMgr.pinstanceModule.checkFmtBossGuide();
                return true;
            }
        }

        let questProgress: Protocol.QuestProgress;
        let taskId: number = 0;
        let isTaskDoing: boolean = false;
        let dif: number = 0;
        taskId = G.DataMgr.constData.getValueById(KeyWord.PARAM_FMT_MISSION_ID);
        if (taskId > 0) {
            questProgress = G.DataMgr.questData.getQuestProgress(taskId);
            if (questProgress) {
                isTaskDoing = !G.DataMgr.questData.isQuestCompleting(questProgress);
                dif = 1;
            }
        }
        if (!isTaskDoing) {
            taskId = G.DataMgr.constData.getValueById(KeyWord.PARAM_FMT_MISSION_ID2);
            if (taskId > 0) {
                questProgress = G.DataMgr.questData.getQuestProgress(taskId);
                if (questProgress) {
                    isTaskDoing = !G.DataMgr.questData.isQuestCompleting(questProgress);
                    dif = 2;
                }
            }
        }
        // 直接前往指定的场景
        let canSpecialTransport: boolean = G.Mapmgr.canSpecialTransport(KeyWord.NAVIGATION_GUAJI);
        if (canSpecialTransport) {
            if (isTaskDoing) {
                G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_FMT, dif);
            }
            else {
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUAJI, layer, 0, questId, pathBossId > 0 ? false : true);
            }
            //let posConfig = G.DataMgr.sceneData.getywbossCfg(pathBossId);
            //if (posConfig) {
            //    G.Mapmgr.goToPos(posConfig.m_iSceneID, posConfig.m_stPosition.m_uiX, posConfig.m_stPosition.m_uiY);
            //} else {
            //    uts.logWarning(" 没有寻路表 pathBossId   " + pathBossId)
            //}
        }
        return canSpecialTransport;
    }
    //heroCurPrivilege是主角当前激活的特权-白银/黄金/钻石特权
    gotoWorldBoss(bossId: number, heroCurPrivilege: number = -1): void {
        let bossConfig = MonsterData.getBossConfigById(bossId);

        if (G.DataMgr.heroData.level >= bossConfig.m_iLevel) {
            //世界boss进入副本逻辑 不用那么复杂,等级够直接进
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_WORLDBOSS, bossId, 0);
            G.Uimgr.closeForm(BossView);

            ////世界Boss已经领奖次数
            //let allScriptCnt = G.DataMgr.activityData.allScriptCnt;
            ////已经领奖次数小于5+保留次数
            //if (allScriptCnt < Macros.MAX_BOSS_DAY_SCRIPT_CNT + G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS) + G.DataMgr.activityData.leftCnt) {
            //    this.onGotoWorldBossConfirm(MessageBoxConst.no, false, bossId)
            //} else {
            //    //世界Boss奖励次数用完的时候
            //    //检查背包是否有奖励劵
            //    let worldBossRewardBinNum = G.DataMgr.thingData.getThingNum(EnumThingID.WorldBossRewardBin);
            //    let worldBossReward = G.DataMgr.thingData.getThingNum(EnumThingID.WorldBossReward);
            //    if (worldBossRewardBinNum > 0 || worldBossReward > 0) {
            //        //有奖励劵
            //        G.TipMgr.showConfirm(uts.format("当前拥有<color=yellow>世界BOSS奖励券*{0}</color>，是否消耗1张奖励券增加1次奖励次数？\n<color=green>没有奖励券时激活钻石特权也可购买额外奖励次数~</color>", worldBossRewardBinNum + worldBossReward),
            //            ConfirmCheck.noCheck,
            //            '使用进入|直接进入',
            //            delegate(this, this.onUserWorldBossThingItem, bossId, heroCurPrivilege), 0, 0, true);
            //    } else {//没有奖励劵

            //        G.TipMgr.showConfirm(uts.format("今日的世界BOSS奖励次数已用尽,现在\n进入不会再获得奖励,钻石特权\n可花费{0}额外购买奖励次数.\n今日剩余购买次数:{1}次",
            //            TextFieldUtil.getYuanBaoText(G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3)),
            //            //剩余购买次数
            //            G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUYTIMES, G.DataMgr.heroData.curVipLevel, heroCurPrivilege) - G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS)),
            //            ConfirmCheck.noCheck,
            //            '购买次数|直接进入',
            //            delegate(this, this.onGotoWorldBossConfirm, bossId, heroCurPrivilege), 0, 0, true);
            //    }
            //}

        }
        else {
            G.TipMgr.addMainFloatTip(uts.format('您的等级低于{0}级，不能挑战', bossConfig.m_iLevel));
        }
    }
    //使用世界boss奖励劵
    private onUserWorldBossThingItem(stage: MessageBoxConst, isCheckSelected: boolean, bossID: number, heroCurPrivilege: number = -1): void {
        if (MessageBoxConst.no == stage) {
            G.DataMgr.runtime.lastWorldBossId = bossID;
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_WORLDBOSS, bossID, 0);
            G.Uimgr.closeForm(BossView);
        } else if (MessageBoxConst.yes == stage) {
            let worldBossRewardBinNum = G.DataMgr.thingData.getThingNum(EnumThingID.WorldBossRewardBin);
            let worldBossReward = G.DataMgr.thingData.getThingNum(EnumThingID.WorldBossReward);
            let items = G.DataMgr.thingData.getBagItemById(worldBossRewardBinNum > 0 ? EnumThingID.WorldBossRewardBin : EnumThingID.WorldBossReward,
                worldBossRewardBinNum > 0 ? true : false, 1);
            let itemData = items[0];
            if (null != itemData && null != itemData.data)
                //发送使用奖励劵协议
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_USE_THING, Macros.CONTAINER_TYPE_ROLE_BAG,
                    itemData.data.m_iThingID, //物品id
                    itemData.data.m_usPosition, //物品位置
                    1, -1));
            G.DataMgr.runtime.lastWorldBossId = bossID;

            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_WORLDBOSS, bossID, 0);
            G.Uimgr.closeForm(BossView);
        }

    }
    private onGotoWorldBossConfirm(stage: MessageBoxConst, isCheckSelected: boolean, bossID: number, heroCurPrivilege: number = -1): void {
        if (MessageBoxConst.no == stage) {
            G.DataMgr.runtime.lastWorldBossId = bossID;
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_WORLDBOSS, bossID, 0);
            G.Uimgr.closeForm(BossView);
        } else if (MessageBoxConst.yes == stage) {
            if (heroCurPrivilege == KeyWord.VIPPRI_3) {//钻石vip
                if (G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUYTIMES, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3) - G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS) <= 0) {
                    G.TipMgr.addMainFloatTip(uts.format("可购买奖励次数已经用完"));
                } else if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WORLDBOSS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel, KeyWord.VIPPRI_3), true)) {
                    //发送购买协议
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_BUY_PINSTANCE, Macros.PINSTANCE_ID_WORLDBOSS));
                    G.DataMgr.runtime.lastWorldBossId = bossID;
                    G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_WORLDBOSS, bossID, 0);
                    G.Uimgr.closeForm(BossView);
                }
            } else {
                //打开特权充值界面
                G.Uimgr.createForm<VipView>(VipView).open();
            }
        }
    }

    /**
     * 用于切线、传送等需要停止当前可能造成移动等动作的接口。
     *
     */
    beAGoodBaby(clearQuest: boolean, stopHangup: boolean, stopJump: boolean, stopAttack: boolean, informServerStop: boolean): void {
        if (stopHangup) {
            G.ModuleMgr.deputyModule.startEndHangUp(false);
        }

        let heroCtrl = G.UnitMgr.hero;
        if (null != heroCtrl) {
            heroCtrl.clearStatus(stopJump, stopAttack, true, informServerStop);
        }

        // 清除任务标记
        if (clearQuest) {
            G.DataMgr.runtime.resetAllBut();
        }
    }

    canTakeOnEquip(thingInfo: Protocol.ContainerThingInfo, petOrZhufuId: number, needPromp: boolean): boolean {
        if (GameIDUtil.isRoleEquipID(thingInfo.m_iThingID)) {
            // 角色装备
            return this.canTakeOnRoleEquip(thingInfo, needPromp);
        } else if (GameIDUtil.isPetEquipID(thingInfo.m_iThingID)) {
            // 伙伴装备
            return this.canTakeOnPetEquip(thingInfo, petOrZhufuId, needPromp);
        }
        // 祝福装备
        return this.canTakeOnZhufuEquip(thingInfo, needPromp);
    }

    private canTakeOnRoleEquip(thingInfo: Protocol.ContainerThingInfo, needPromp: boolean): boolean {
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        if (equipConfig.m_ucProf > 0 && equipConfig.m_ucProf != G.DataMgr.heroData.profession) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('当前装备不符合您的职业');
            }
            return false;
        }
        return true;
    }

    private canTakeOnZhufuEquip(thingInfo: Protocol.ContainerThingInfo, needPromp: boolean): boolean {
        let thingConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        let subType = GameIDUtil.getSubTypeByEquip(thingConfig.m_iEquipPart);
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(subType);

        if (data != null && thingConfig.m_ucRequiredLevel > data.m_ucLevel) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('{0}等阶不足', KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, subType)));
            }
            return false;
        }
        return true;
    }

    private canTakeOnPetEquip(thingInfo: Protocol.ContainerThingInfo, petId: number, needPromp: boolean): boolean {
        let config = ThingData.getThingConfig(thingInfo.m_iThingID);
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        if (petId <= 0) {
            // 没有指定给哪个伙伴穿上，则根据功能id来定
            petId = this.getPetIdByEquipId(thingInfo.m_iThingID);
        }

        if (petId <= 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('当前装备无法穿戴');
            }
            return false;
        }

        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petId);
        if (null == pet || pet.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('当前装备无法穿戴');
            }
            return false;
        }

        let equipPart = equipConfig.m_iEquipPart
        if (equipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || equipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
            if (config.m_ucRequiredLevel > pet.m_uiStage) {
                if (needPromp) {
                    let petCfg = PetData.getPetConfigByPetID(petId);
                    G.TipMgr.addMainFloatTip(uts.format('{0}未达{1}阶，无法穿戴', petCfg.m_szBeautyName, PetData.getPetStage(config.m_ucRequiredLevel, petId)));
                }
                return false;
            }
        }
        else {
            let awakenStage = G.DataMgr.petData.getPetInfo(petId).m_stAwake.m_ucLevel;
            if (config.m_ucRequiredLevel > awakenStage) {
                if (needPromp) {
                    let petCfg = PetData.getPetConfigByPetID(petId);
                    G.TipMgr.addMainFloatTip(uts.format('{0}觉醒未达{1}，无法穿戴', petCfg.m_szBeautyName, PetData.petTitle[config.m_ucRequiredLevel - 1]));
                }
                return false;
            }
        }



        return true;
    }

    takeOnEquip(itemData: ThingItemData, petOrZhufuId: number) {
        if (itemData.config.m_ucBindType == KeyWord.BIND_TYPE_USE && itemData.data.m_stThingProperty.m_ucBindStatus == KeyWord.BIND_STATUS_NOBINDED) {
            G.TipMgr.showConfirm('装备将会被绑定，是否继续?', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.doTakeOnEquip, itemData, petOrZhufuId));
        } else {
            this.doTakeOnEquip(MessageBoxConst.yes, false, itemData, petOrZhufuId);
        }
    }

    private doTakeOnEquip(state: MessageBoxConst, isCheckSelected: boolean, itemData: ThingItemData, petOrZhufuId: number) {
        if (state != MessageBoxConst.yes) {
            return;
        }

        let canTakeOn = true;
        if (GameIDUtil.isRoleEquipID(itemData.config.m_iID)) {
            // 角色装备
            let equipConfig = ThingData.getThingConfig(itemData.config.m_iID);
            G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, itemData.data, ThingData.getContainerByEquip(itemData.config.m_iID), ThingData.getIndexByEquipPart(equipConfig.m_iEquipPart));
        } else if (GameIDUtil.isPetEquipID(itemData.config.m_iID)) {
            // 伙伴装备
            canTakeOn = this.doTakeOnPetEquip(itemData.data, petOrZhufuId);
        } else if (GameIDUtil.isHunguEquipID(itemData.config.m_iID)) {
            // 魂骨装备 +封装提示
            let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
            let equipdata = equipDatas[itemData.config.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
            if (equipdata != null) {
                let isintensify = equipdata.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
                let skillfz = equipdata.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID > 0;

                if (isintensify) {
                    if (!this.isHunguEquipTips) {
                        G.TipMgr.showConfirm(uts.format("替换后魂骨封装石将{0}，背包空间不足则会用{1}，新穿戴的魂骨需要{2}。",
                            TextFieldUtil.getColorText("返还到背包", Color.GREEN),
                            TextFieldUtil.getColorText("邮件返还", Color.GREEN),
                            TextFieldUtil.getColorText("重新封装", Color.GREEN)),
                            ConfirmCheck.withCheck,
                            '确定|取消',
                            delegate(this, this.HunguEquipFZTips, itemData.data, skillfz));
                    }
                    else {
                        if (skillfz && !this.isHunguSkillTips)
                            this.tryHungSkillFZTip(itemData.data);
                        else
                            canTakeOn = this.doTakeOnHunguEquip(itemData.data);
                    }

                }
                else {
                    canTakeOn = this.doTakeOnHunguEquip(itemData.data);
                }
            }
            else {
                canTakeOn = this.doTakeOnHunguEquip(itemData.data);
            }
        } else {
            // 祝福装备
            canTakeOn = this.doTakeOnZhufuEquip(itemData.data);
        }

        if (canTakeOn) {
            G.Uimgr.closeForm(BagEquipView);
        }
    }

    private HunguEquipFZTips(status: number, isCheckSelected: boolean, thingInfo: Protocol.ContainerThingInfo, skillFz: boolean) {
        if (MessageBoxConst.yes == status) {
            this.isHunguEquipTips = isCheckSelected;
            if (skillFz && !this.isHunguSkillTips)
                this.tryHungSkillFZTip(thingInfo);
            else
                this.doTakeOnHunguEquip(thingInfo);
        }
    }

    private tryHungSkillFZTip(thingInfo: Protocol.ContainerThingInfo) {
        G.TipMgr.showConfirm(uts.format("替换后技能石将{0}，背包空间不足则会用{1}，新穿戴的魂骨需要{2}。",
            TextFieldUtil.getColorText("返还到背包", Color.GREEN),
            TextFieldUtil.getColorText("邮件返还", Color.GREEN),
            TextFieldUtil.getColorText("重新镶嵌", Color.GREEN)),
            ConfirmCheck.withCheck,
            '确定|取消',
            delegate(this, this.HunguEquipSkillFZTips, thingInfo));
    }

    private HunguEquipSkillFZTips(status: number, isCheckSelected: boolean, thingInfo: Protocol.ContainerThingInfo) {
        if (MessageBoxConst.yes == status) {
            this.isHunguSkillTips = isCheckSelected;
            this.doTakeOnHunguEquip(thingInfo);
        }
    }

    private doTakeOnZhufuEquip(thingInfo: Protocol.ContainerThingInfo): boolean {
        if (!this.canTakeOnZhufuEquip(thingInfo, true)) {
            return false;
        }
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        let subType = GameIDUtil.getSubTypeByEquip(equipConfig.m_iEquipPart);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSwapContainerMsg(Macros.CONTAINER_TYPE_ROLE_BAG, [thingInfo.m_iThingID],
            [thingInfo.m_usPosition], [1], GameIDUtil.getContainerIDBySubtype(subType), ThingData.getIndexByEquipPart(equipConfig.m_iEquipPart)));
        return true;
    }

    private doTakeOnPetEquip(thingInfo: Protocol.ContainerThingInfo, petId: number): boolean {
        // 先决定给哪个伙伴穿上
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        if (petId <= 0) {
            // 没有指定给哪个伙伴穿上，则根据功能id来定
            petId = this.getPetIdByEquipId(thingInfo.m_iThingID);
        }

        if (petId <= 0) {
            G.TipMgr.addMainFloatTip('当前装备无法穿戴');
            return false;
        }

        if (!this.canTakeOnPetEquip(thingInfo, petId, true)) {
            return false;
        }

        let beautyCfg: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
        G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo, Macros.CONTAINER_TYPE_BEAUTY_EQUIP, beautyCfg.m_uiEquipPosition + ThingData.getIndexByEquipPart(equipConfig.m_iEquipPart));
        return true;
    }


    private doTakeOnHunguEquip(thingInfo: Protocol.ContainerThingInfo): boolean {
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo, Macros.CONTAINER_TYPE_HUNGU_EQUIP, ThingData.getIndexByEquipPart(equipConfig.m_iEquipPart));
        return true;
    }

    getPetIdByEquipId(equipId: number): number {
        // 先决定给哪个伙伴穿上
        let config = ThingData.getThingConfig(equipId);
        let equipConfig = ThingData.getThingConfig(equipId);
        // 根据功能id来定
        let petId = equipConfig.m_iFunctionID;

        let petData = G.DataMgr.petData;
        if (petId <= 0) {
            // 走到这里说明是伙伴通用装备，则选择第一只可以穿上的
            let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);

            let fight: number = FightingStrengthUtil.calStrength(equipConfig.m_astBaseProp);
            let pos: number = equipConfig.m_iEquipPart - KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN;

            let beautyCfg: GameConfig.BeautyAttrM;
            let wearThingData: ThingItemData;

            let allPetIds = petData.getAllPetID();

            for (let id of allPetIds) {
                let beauty = petData.getPetInfo(id);
                if (beauty != null && beauty.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET && config.m_ucRequiredLevel <= beauty.m_stAwake.m_ucLevel) {
                    beautyCfg = PetData.getPetConfigByPetID(beauty.m_iBeautyID);

                    if (equipObject && equipObject[beautyCfg.m_uiEquipPosition + pos]) {
                        wearThingData = equipObject[beautyCfg.m_uiEquipPosition + pos] as ThingItemData;
                        equipConfig = wearThingData.config;

                        if (FightingStrengthUtil.calStrength(equipConfig.m_astBaseProp) < fight) {
                            petId = beauty.m_iBeautyID;
                            break;
                        }
                    }
                    else {
                        petId = beauty.m_iBeautyID;
                        break;
                    }
                }
            }
        }

        if (petId <= 0) {
            // 最后没找到合适的伙伴，则选择当前出战的伙伴
            let followPet = petData.getFollowPet();
            if (null != followPet) {
                petId = followPet.m_iBeautyID;
            }
        }

        return petId;
    }

    ///////////////////////////////////////////////// 丢弃背包物品 /////////////////////////////////////////////////

    /**
     * 丢弃某个物品
     * @param data
     *
     */
    deleteBagThing(thingInfo: Protocol.ContainerThingInfo): void {
        let config = ThingData.getThingConfig(thingInfo.m_iThingID);
        if (1 == config.m_ucIsDestroy) {
            if (this.m_noPromptDestroy) {
                this.doThrowItem(thingInfo);
            }
            else {
                G.TipMgr.showConfirm(uts.format('您确定要将{0}丢弃？', TextFieldUtil.getItemText(config)),
                    ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onDeleteConfirmClick, thingInfo));
            }
        }
        else {
            //物品不可摧毁 不可售卖
            G.TipMgr.addMainFloatTip('物品不可丢弃！');
        }
    }

    private onDeleteConfirmClick(state: MessageBoxConst, isCheckSelected: boolean, thingInfo) {
        if (state == MessageBoxConst.yes) {
            this.m_noPromptDestroy = isCheckSelected;
            this.doThrowItem(thingInfo);
        }
    }

    /**
     * 丢弃物品。
     * @param s
     *
     */
    doThrowItem(itemInfo: Protocol.ContainerThingInfo): void {
        let cmd = ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_DROP_THING, Macros.CONTAINER_TYPE_ROLE_BAG, itemInfo.m_iThingID, itemInfo.m_usPosition, itemInfo.m_iNumber);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    /**
     * 执行指定功能。
     * @param funcId 指定的功能ID，如KeyWord.SUBBAR_FUNCTION_ZAZEN，KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE等
     * @param subClass GameConfig.WYBQTuJingConfigM::m_iSubClass
     * @param value
     */
    public executeFunction(funcId: number, funcClass = 0, subClass = 0, value1 = 0, value2 = 0, value3 = 0): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(funcId, true)) {
            return false;
        }
        let funcConfig: GameConfig.NPCFunctionLimitM = G.DataMgr.funcLimitData.getFuncLimitConfig(funcId);
        let funcParent = 0;
        if (null != funcConfig) {
            funcParent = funcConfig.m_iParentName;
            if (funcClass == 0) {
                funcClass = funcConfig.m_ucFunctionClass;
            }
        }

        if (funcParent > 0 && !G.DataMgr.funcLimitData.isFuncAvailable(funcParent, true)) {
            // 父功能没开
            return false;
        }
        if (!this.checkCrossSvrUsable(true, funcId) || (funcParent > 0 && !this.checkCrossSvrUsable(true, funcParent))) {
            //跨服不可用
            return false;
        }

        if (KeyWord.OTHER_FUNCTION_ZQQH == funcId || KeyWord.OTHER_FUNCTION_ZQJH == funcId) {
            // 坐骑
            G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_ZUOQI, subClass);
        }
        else if (funcId == KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) {
            //翅膀精炼
            G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
        }
        else if (KeyWord.OTHER_FUNCTION_WHQH == funcId || KeyWord.OTHER_FUNCTION_WHJH == funcId) {
            // 神器
            G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_WUHUN, subClass);
        }
        else if (KeyWord.OTHER_FUNCTION_FZQH == funcId || KeyWord.OTHER_FUNCTION_FZJH == funcId) {
            // 法阵
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_FAZHEN, subClass);
        }
        else if (KeyWord.OTHER_FUNCTION_LLJH == funcId || KeyWord.OTHER_FUNCTION_LLQH == funcId) {
            // 真迹
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_LEILING, subClass);
        }
        else if (KeyWord.OTHER_FUNCTION_MAGICCUBE == funcId) {
            // 星环
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_MAGICCUBE);
        }
        else if (KeyWord.OTHER_FUNCTION_JU_YUAN == funcId) {
            // 神力
            G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
        }
        else if (KeyWord.BAR_FUNCTION_ROLE == funcId || KeyWord.BAR_FUNCTION_ROLE == funcParent) {
            // 主角
            G.Uimgr.createForm<HeroView>(HeroView).open();
        }
        else if (KeyWord.BAR_FUNCTION_BAG == funcId) {
            // 背包
            G.Uimgr.createForm<BagView>(BagView).open(value1, value2);
        }
        else if (KeyWord.ACT_FUNC_PINSTANCEHALL == funcId || KeyWord.ACT_FUNC_PINSTANCEHALL == funcParent) {
            // 副本大厅各页签
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(funcId, value1);
        }

        else if (KeyWord.ACT_FUNCTION_ZZHC_WC == funcId || KeyWord.ACT_FUNCTION_ZZHC == funcId) {
            //领地站 
            G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.ACT_FUNCTION_ZZHC);
        }
        else if (KeyWord.BAR_FUNCTION_SHIELDGOD == funcId || KeyWord.BAR_FUNCTION_SHIELDGOD == funcParent) {
            // 守护神
            G.Uimgr.createForm<ShieldGodView>(ShieldGodView).open(value1);
        }
        else if (KeyWord.ACT_FUNC_ACTHOME == funcId || KeyWord.ACT_FUNC_ACTHOME == funcParent) {
            // 活动大厅 各个页签
            G.Uimgr.createForm<ActHomeView>(ActHomeView).open(funcId);
        }
        else if (KeyWord.ACT_FUNCTION_KFHD == funcId || KeyWord.ACT_FUNCTION_KFHD == funcParent) {
            // 开服活动 各个页签
            G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(funcId);
        }
        else if (KeyWord.BAR_FUNCTION_GUILD == funcId || KeyWord.BAR_FUNCTION_GUILD == funcParent) {
            // 宗门
            G.Uimgr.createForm<GuildView>(GuildView).open(funcId, value1);
        }
        else if (KeyWord.BAR_FUNCTION_MALL == funcId || KeyWord.BAR_FUNCTION_MALL == funcParent) {
            // 商城
            G.Uimgr.createForm<MallView>(MallView).open(value1, value2);
        }
        else if (KeyWord.SUBBAR_FUNCTION_HAOYOU == funcId) {
            // 好友
            G.Uimgr.createForm<FriendView>(FriendView).open();
        }
        else if (KeyWord.SUBBAR_FUNCTION_TEAM == funcId) {
            // 队伍
            G.Uimgr.createForm<TeamView>(TeamView).open();
        }
        else if (KeyWord.BAR_FUNCTION_ANQI == funcId) {
            // 宝物
            G.Uimgr.createForm<ShengQiView>(ShengQiView).open(value1);
        }
        else if (KeyWord.ACT_FUNCTION_JISHOU == funcId) {
            // 交易所
            let sceneId = G.DataMgr.sceneData.curSceneID;
            //4 是索托城，在同一张地图上，就不用小飞鞋了
            if (sceneId == 4) {
                G.Mapmgr.findPath2Npc(100204, false, 0, false);
            }
            else {
                G.TipMgr.showConfirm("距离过远，是否立即前往？", ConfirmCheck.noCheck, "确定|取消", delegate(this, (state: MessageBoxConst) => {
                    if (MessageBoxConst.yes == state) {
                        let state = G.Mapmgr.findPath2Npc(100204, true, 0, false);
                        if (state == PathingState.CANNOT_REACH)
                            G.Mapmgr.findPath2Npc(100204, false, 0, false);
                    }
                }));
            }
            //G.Uimgr.createForm<JishouView>(JishouView).open(value1);
        }
        else if (KeyWord.ACT_FUNCTION_QIFU == funcId) {
            //祈福
            if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_QIFU))
                G.Uimgr.createForm<KuaiSuShengJiView>(KuaiSuShengJiView).open();
            // let sceneId = G.DataMgr.sceneData.curSceneID;
            // if (sceneId == 4) {
            //     G.Mapmgr.findPath2Npc(100203, false, 0, false);
            // }
            // else {
            //     G.TipMgr.showConfirm("距离过远，是否立即前往？", ConfirmCheck.noCheck, "确定|取消", delegate(this, (state: MessageBoxConst) => {
            //         if (MessageBoxConst.yes == state) {
            //             let state = G.Mapmgr.findPath2Npc(100203, true, 0, false);
            //             if (state == PathingState.CANNOT_REACH)
            //                 G.Mapmgr.findPath2Npc(100203, false, 0, false);
            //         }
            //     }));
            // }
        }
        else if (KeyWord.ACT_FUNCTION_DAILY == funcId || KeyWord.ACT_FUNCTION_DAILY == funcParent) {
            //这个功能开启特殊
            if (funcId >= KeyWord.OTHER_FUNCTION_RICHANG_JY && funcId <= KeyWord.OTHER_FUNCTION_RICHANG_HD) {
                let rcdata = G.DataMgr.taskRecommendData;
                let type = funcId - KeyWord.OTHER_FUNCTION_RICHANG_JY + 1;
                let arr = rcdata.getRCRecommendArray(type);
                if (arr.length <= 0) {
                    G.TipMgr.addMainFloatTip("功能尚未开启！");
                    return;
                }
            }
            G.Uimgr.createForm<RiChangView>(RiChangView).open(funcId, value1);
        }
        else if (KeyWord.BAR_FUNCTION_EXCHANGE == funcId) {
            //兑换商城
            let sceneId = G.DataMgr.sceneData.curSceneID;
            if (sceneId == 4) {
                G.Mapmgr.findPath2Npc(100202, false, 0, false);
            }
            else {
                G.TipMgr.showConfirm("距离过远，是否立即前往？", ConfirmCheck.noCheck, "确定|取消", delegate(this, (state: MessageBoxConst) => {
                    if (MessageBoxConst.yes == state) {
                        let state = G.Mapmgr.findPath2Npc(100202, true, 0, false);
                        if (state == PathingState.CANNOT_REACH)
                            G.Mapmgr.findPath2Npc(100202, false, 0, false);
                    }
                }));
            }
        }
        else if (KeyWord.BAR_FUNCTION_REBIRTH == funcId || KeyWord.BAR_FUNCTION_REBIRTH == funcParent) {
            //魂力
            G.Uimgr.createForm<HunLiView>(HunLiView).open(funcId);
        } else if (KeyWord.BAR_FUNCTION_HUNGU == funcParent) {
            //魂骨
            G.Uimgr.createForm<HunGuView>(HunGuView).open(funcId);
        }
        else if (KeyWord.SUBBAR_FUNCTION_RIDE == funcId) {
            // 坐骑
            let heroCtrl = G.UnitMgr.hero;
            if (null == heroCtrl) {
                return;
            }

            let nowValue = 0;
            if (UnitStatus.isInRide(heroCtrl.Data.unitStatus)) {
                nowValue = 1;
            }
            else {
                nowValue = -1;
            }
            if (0 == value1) {
                value1 = -nowValue;
            }
            if (value1 == nowValue) {
                return;
            }

            if (value1 < 0) {
                if (heroCtrl.canRideOff()) {
                    G.DataMgr.runtime.isWaitingRideResp = true;
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMountRideRequst(Macros.MountRide_Down));
                }
                else {
                    G.TipMgr.addMainFloatTip('当前状态无法下马', Macros.PROMPTMSG_TYPE_MIDDLE);
                }
            }
            else {
                if (heroCtrl.canRideOn()) {
                    G.DataMgr.runtime.isWaitingRideResp = true;
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMountRideRequst(Macros.MountRide_Up));
                }
                else {
                    G.TipMgr.addMainFloatTip('当前状态无法上马', Macros.PROMPTMSG_TYPE_MIDDLE);
                }
            }
        }
        else if (KeyWord.BAR_FUNCTION_JIUXING == funcId) {
            // 圣光 ==>玄天功
            //G.Uimgr.createForm<JiuXingView>(JiuXingView).open();
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.BAR_FUNCTION_JIUXING);
        }
        else if (KeyWord.BAR_FUNCTION_FAQI == funcId || KeyWord.BAR_FUNCTION_FAQI == funcParent || KeyWord.OTHER_FUNCTION_TIANZHU == funcId) {
            //宝物
            G.Uimgr.createForm<FaQiView>(FaQiView).open(funcId, value1, value2);
        }
        //else if (KeyWord.BAR_FUNCTION_EQUIP_ENHANCE == funcId ||
        //    KeyWord.BAR_FUNCTION_EQUIP_ENHANCE == funcParent ||
        //    KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP == funcId) {
        //    if (subClass == KeyWord.STRONG_SUB_ZBJJ) {
        //        // 装备进阶
        //        G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
        //    }
        //    else if (funcId == KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN) {
        //        //翅膀进阶
        //        G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
        //    }
        //    else {
        //        // 装备各页签
        //        G.Uimgr.createForm<EquipView>(EquipView).open(funcId);
        //    }
        //}
        else if (KeyWord.BAR_FUNCTION_HECHEN == funcId || KeyWord.BAR_FUNCTION_HECHEN == funcParent) {
            // 装备合成
            G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open(funcId);
        }
        else if (KeyWord.BAR_FUNCTION_FANXIAN == funcId || KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE == funcId ||
            KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE == funcId || KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING == funcId ||
            KeyWord.OTHER_FUNCTION_EQUIP_LIANTI == funcId) {
            //凡，仙 ，升灵
            G.Uimgr.createForm<FanXianTaoView>(FanXianTaoView).open(funcId);
        }
        else if (KeyWord.BAR_FUNCTION_SKILL == funcId || KeyWord.BAR_FUNCTION_SKILL == funcParent || KeyWord.OTHER_FUNCTION_FAZE_UP == funcId || KeyWord.OTHER_FUNCTION_FAZE == funcId) {
            // 技能
            G.Uimgr.createForm<SkillView>(SkillView).open(funcId, value1);
        }
        else if (KeyWord.OTHER_FUNCTION_PET_JINJIE == funcId || KeyWord.BAR_FUNCTION_BEAUTY == funcParent || KeyWord.OTHER_FUNCTION_BEAUTY_STRONG == funcId || KeyWord.BAR_FUNCTION_BEAUTY == funcId) {
            if (subClass == KeyWord.STRONG_SUB_BEAUTY_SQYF) {
                //宝物
                G.Uimgr.createForm<ShengQiView>(ShengQiView).open();
            }
            //else if (subClass == KeyWord.STRONG_SUB_BEAUTY_GFYF) {
            //    //伙伴技能
            //    G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, PetJinJieFuncTab.skill);
            //} else if (subClass == KeyWord.STRONG_SUB_BEAUTY_AWAKE) {
            //    //伙伴觉醒
            //    G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, PetJinJieFuncTab.juexing);
            //}
            else {
                //G.Uimgr.createForm<PetView>(PetView).open(funcId, value1, value2, value3);
                G.Uimgr.createForm<PetView>(PetView).open();
            }
        }
        else if (KeyWord.ACT_FUNCTION_TGBJ == funcId) {
            // 探宝
            G.Uimgr.createForm<TanBaoView>(TanBaoView).open(EnumTanBaoType.BaoKu);
        }
        else if (KeyWord.ACT_FUNCTION_STARSTREASURY == funcId) {
            //星斗宝库
            G.Uimgr.createForm<StarsTreasuryView>(StarsTreasuryView).open();
        } else if (KeyWord.ACT_FUNCTION_KF_ZHAOCAIMAO == funcId) {
            //招财猫
            G.Uimgr.createForm<LuckyCatView>(LuckyCatView).open();
        }
        else if (KeyWord.ACT_FUNCTION_FIRSTCHARGE == funcId) {
            // 首充礼包
            G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
        }
        else if (KeyWord.BAR_FUNCTION_PRIVILEGE == funcId) {
            // 特权
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
        else if (KeyWord.ACT_FUNCTION_KFHD == funcId || KeyWord.ACT_FUNCTION_KFHD == funcParent) {
            // 开服活动
            G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(funcId);
        }
        else if (KeyWord.ACT_FUNCTION_SZSJ == funcId || KeyWord.ACT_FUNCTION_SZSJ == funcParent) {
            // 装备收集
            G.Uimgr.createForm<EquipView>(EquipView).open(funcId);
        }
        else if (KeyWord.ACT_FUNC_FLDT == funcId || KeyWord.ACT_FUNC_FLDT == funcParent) {
            // 返利大厅
            G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(funcId, value1)
        }
        else if (KeyWord.ACT_FUNCTION_FMT == funcId) {
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_FMT);
        }
        else if (KeyWord.ACT_FUNCTION_BOSS == funcId || KeyWord.ACT_FUNCTION_BOSS == funcParent) {
            // 世界boss、地宫boss
            G.Uimgr.createForm<BossView>(BossView).open(funcId, value1);
        }
        else if (KeyWord.BAR_FUNCTION_XIANYUAN == funcId) {
            //婚姻
            G.Uimgr.createForm<MainMarryView>(MainMarryView).open();
        }
        else if (KeyWord.BAR_FUNCTION_FANXIAN == funcId || KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE == funcId ||
            KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE == funcId || KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING == funcId
        ) {
            //凡，仙 ，升灵
            G.Uimgr.createForm<FanXianTaoView>(FanXianTaoView).open(funcId);
        }
        else if (KeyWord.OTHER_FUNCTION_ZPQYH == funcId) {
            //宗门争霸
            G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNC_KFZMZ);
        }

        else if (KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU == funcId) {
            //充值狂欢
            G.Uimgr.createForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView).open(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU);
        }
        else if (KeyWord.OTHER_FUNC_MHZZ == funcId) {
            //魔化战争
            G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNC_MHZZ);
        }

        else if (KeyWord.FUNC_LIMIT_ACT == funcClass && null != G.ActBtnCtrl.getControllerById(funcId)) {
            return G.ActBtnCtrl.executeFunc(funcId);
        } else {
            uts.logError('Cannot execute: funcId = ' + funcId + ', funcParent = ' + funcParent);
            return false;
        }
        return true;
    }

    handleDailyAct(actId: number): boolean {
        let closeActHome = true;
        let actHomeCfg = G.DataMgr.activityData.getActHomeCfg(actId);
        //if (G.DataMgr.rmbData.isMathing) {
        //    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(185));
        //    return;
        //}
        if (G.DataMgr.heroData.level < actHomeCfg.m_iLevel) {
            G.TipMgr.addMainFloatTip('等级不足');
            return closeActHome;
        }
        switch (actHomeCfg.m_iIndex) {
            case KeyWord.ACTHOME_YMZC:
                // 星球之巅
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_YMZC, 0, 0);
                break;
            case KeyWord.ACTHOME_SWZC:
                //死亡战场
                let dateAfterStartServer: number = G.SyncTime.getDateAfterStartServer();
                if (dateAfterStartServer <= 7) {
                    //本服
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_CROSS_ACT, Macros.ACTIVITY_ID_SWZC);
                } else {
                    //跨服
                    G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_SWZC, 0, 0);
                }
                break;
            case KeyWord.ACTHOME_CROSS3V3:
                // 跨服3v3
                this.executeFunction(KeyWord.OTHER_FUNCTION_CROSS3V3);
                closeActHome = false;
                break;
            case KeyWord.ACTHOME_DTHD1:
            case KeyWord.ACTHOME_DTHD2:
                // 答题活动
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_QUESTIONACTIVITY, 0, 0);
                break;
            case KeyWord.ACTHOME_ZYZ:
                // 阵营战
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_CAMPBATTLE, 0, 0);
                break;
            case KeyWord.ACTHOME_WQHD_1:
            case KeyWord.ACTHOME_WQHD_2:
                // 温泉
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_BATHE, 0, 0);
                break;
            case KeyWord.ACTHOME_ZPQYH:
            case KeyWord.ACTHOME_KFZMZ:
                // 跨服宗门战
                this.executeFunction(KeyWord.OTHER_FUNC_KFZMZ);
                closeActHome = false;
                break;
            //case KeyWord.ACTHOME_ZPFMZ:
            //    G.DataMgr.guildData.gotoGuildSecrectArea();
            //    break;
            //case KeyWord.ACTHOME_JDC:
            //    // 决斗场
            //    this.dispatchEvent(Events.showFsbMainDialog, DialogCmd.open);
            //    this.dispatchEvent(Events.OpenCloseHDDTDialog, DialogCmd.open, null, EnumHddtTab.TAB_FSB);
            //    break;
            case KeyWord.ACTHOME_SMZT_1:
            case KeyWord.ACTHOME_SMZT_2:
                // 神兽秘境
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_SHENMOZHENTIAN);
                break;
            case KeyWord.ACTHOME_MYKXB:
                // 魔帝遗迹
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_MYKXB);
                break;
            case KeyWord.ACTHOME_NMRQ:
                // 末日终结者（原南蛮入侵）
                //魂兽入侵 未加入宗门不能参加
                if (G.DataMgr.heroData.guildId == 0) {
                    G.TipMgr.addMainFloatTip('请先加入宗门');
                }
                else {
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_NMRQ);
                }
                break;
            case KeyWord.ACTHOME_HAQX:
                // 黑暗侵袭
                //G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_HAQX, 0);
                break;
            case KeyWord.ACTHOME_JZXG:
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_JZXG, 0, 0);
                break;
            case KeyWord.ACTHOME_TJFS_1:
            case KeyWord.ACTHOME_TJFS_2:
                // 福神宝箱
                // 能飞则飞，不能飞则走
                if (!G.Mapmgr.goToPos(SceneID.CHONGHUACHENG, 3935, 2798, true, false)) {
                    G.Mapmgr.goToPos(SceneID.CHONGHUACHENG, 3935, 2798, false, true);
                }
                break;

            case KeyWord.ACTHOME_WORLDBOSS_1:
            case KeyWord.ACTHOME_WORLDBOSS_2:
            case KeyWord.ACTHOME_WORLDBOSS_3:
            case KeyWord.ACTHOME_WORLDBOSS_4:
            case KeyWord.ACTHOME_WORLDBOSS_5:
            case KeyWord.ACTHOME_WORLDBOSS_6:
            case KeyWord.ACTHOME_WORLDBOSS_7:
            case KeyWord.ACTHOME_WORLDBOSS_8:
                // 世界boss
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WORLDBOSS);
                break;

            case KeyWord.ACTHOME_SBGY_1:
            case KeyWord.ACTHOME_SBGY_2:
                // 国运（护送灵舟）
                G.ActionHandler.handleGuoyun();
                break;

            case KeyWord.ACTHOME_DYZSPIN_1:
                // 小鸡小鸡
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
                break;

            case KeyWord.ACTHOME_KFBOSS:
            case KeyWord.ACTHOME_KFBOSS2:
                if (G.DataMgr.heroData.guildId > 0) {
                    G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_SHENMOZHETIAN, Macros.ACTIVITY_ID_SHENMOZHETIAN, 0);
                }
                else {
                    G.TipMgr.addMainFloatTip('尚未加入宗门无法参加此活动');
                }
                break;

            case KeyWord.ACTHOME_SMZT_1:
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_SHENMOZHETIAN, Macros.ACTIVITY_ID_SHENMOZHETIAN, 0);
                break;

            case KeyWord.ACTHOME_4BSG_1:
            case KeyWord.ACTHOME_4BSG_2:
                G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
                break;

            case KeyWord.ACTHOME_BXZB_1:
            case KeyWord.ACTHOME_BXZB_2:
            case KeyWord.ACTHOME_BXZB_3:
                // 福神争霸
                let sceneID = (Number)(G.DataMgr.defaultValue.getValue("FSZBID"));
                let x = (Number)(G.DataMgr.defaultValue.getValue("FSZBx"));
                let y = (Number)(G.DataMgr.defaultValue.getValue("FSZBy"));
                if (PathingState.CAN_REACH != G.Mapmgr.goToPos(sceneID, x, y, true, false)) {
                    G.Mapmgr.goToPos(sceneID, x, y, false, true);
                }
                break;

            case KeyWord.ACTHOME_YSZC:
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_YSZC, 0, 0);
                break;

            case KeyWord.ACTHOME_WHJX:
                this.executeFunction(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG);
                break;

            case KeyWord.ACTHOME_ZLQJ:
                // 西洋棋
                this.executeFunction(KeyWord.OTHER_FUNCTION_ZLQJ);
                closeActHome = false;
                break;

            case KeyWord.ACTHOME_ZZHC_WEI:
            case KeyWord.ACTHOME_ZZHC_ZHU:
                // 西洋棋
                this.executeFunction(KeyWord.ACT_FUNCTION_ZZHC);
                break;

            case KeyWord.ACTHOME_JDC:
            case KeyWord.ACTHOME_JDC_JS:
                // 比武大会
                this.executeFunction(KeyWord.OTHER_FUNCTION_BIWUDAHUI);
                break;

            //case KeyWord.ACTHOME_RMBZC1:
            //case KeyWord.ACTHOME_RMBZC2:
            //case KeyWord.ACTHOME_RMBZC3:
            //    this.dispatchEvent(Events.showRmbMatchingDialog, DialogCmd.toggle);
            //    this.dispatchEvent(Events.OpenCloseHDDTDialog, DialogCmd.open, null, EnumHddtTab.TAB_RMB);
            //    break;
            //case KeyWord.ACTHOME_HHZC1:
            //case KeyWord.ACTHOME_HHZC2:
            //case KeyWord.ACTHOME_HHZC3:
            //    this.dispatchEvent(Events.showHHRmbMatchingDialog, DialogCmd.toggle);
            //    this.dispatchEvent(Events.OpenCloseHDDTDialog, DialogCmd.open, null, EnumHddtTab.TAB_RMB);
            //    break;
            case KeyWord.ACTHOME_MHZZ:
                // 魔化战争
                this.executeFunction(KeyWord.OTHER_FUNC_MHZZ);
                closeActHome = false;
                break;
            default:
                break;
        }

        return closeActHome;
    }

    /**
     * 得到背包中可穿戴的装备
     * @param equipPart 部位
     * @param wearThingData 已穿装备
     * @param curId  伙伴，祝福类型ID
     * @param type 类型
     */
    showBagEquipPanel(equipPart: number, wearThingData: ThingItemData, petOrZhufuId: number, type: GameIDType) {
        let m_bagEquipListData: BeautyEquipListItemData[] = [];
        let allEquipInBag: ThingItemData[];
        let data: any;
        if (type == GameIDType.PET_EQUIP) {
            allEquipInBag = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.PET_EQUIP);
            data = G.DataMgr.petData.getPetInfo(petOrZhufuId);
        }
        else if (type == GameIDType.REBIRTH_EQUIP) {
            allEquipInBag = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP);
        }
        else if (type == GameIDType.OTHER_EQUIP) {
            allEquipInBag = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP);
            data = G.DataMgr.zhufuData.getData(petOrZhufuId);
        }

        let fight: number = 0;
        if (wearThingData.config != null) {
            fight = wearThingData.zdl;
        }

        let profession = G.DataMgr.heroData.profession;
        for (let i: number = allEquipInBag.length - 1; i >= 0; i--) {
            let equipConfig = allEquipInBag[i].config;
            if (type == GameIDType.PET_EQUIP) {
                if (equipConfig.m_iEquipPart != equipPart || (equipConfig.m_iFunctionID != 0 && equipConfig.m_iFunctionID != petOrZhufuId)) {
                    allEquipInBag.splice(i, 1);
                }

            } else if (type == GameIDType.OTHER_EQUIP) {
                if (GameIDUtil.getSubTypeByEquip(equipConfig.m_iEquipPart) != petOrZhufuId || (equipConfig.m_iEquipPart != equipPart)) {
                    allEquipInBag.splice(i, 1);
                }
            }
            else if (type == GameIDType.REBIRTH_EQUIP) {
                if ((equipConfig.m_ucProf != 0 && equipConfig.m_ucProf != profession) || equipConfig.m_iEquipPart != equipPart) {
                    allEquipInBag.splice(i, 1);
                }
            }
        }
        for (let thingItemData of allEquipInBag) {
            let itemData: BeautyEquipListItemData = new BeautyEquipListItemData();
            itemData.thingItemData = thingItemData;
            if (data != null && thingItemData.config.m_ucRequiredLevel <= data.m_uiStage && fight < thingItemData.zdl) {
                itemData.showUp = true;
            } else {
                itemData.showUp = false;
            }

            itemData.petOrZhufuId = petOrZhufuId;
            m_bagEquipListData.push(itemData);
        }
        G.Uimgr.createForm<BagEquipView>(BagEquipView).open(petOrZhufuId, wearThingData, m_bagEquipListData);
    }

    /**
     * 根据装备Id获得关键子
     * 只处理伙伴|祝福
     * @param equipPart
     */
    getEquipKeyWorkByEquipPart(equipPart: number): number {
        if (equipPart >= KeyWord.ZQ_EQUIP_PARTCLASS_MIN && equipPart < KeyWord.ZQ_EQUIP_PARTCLASS_MAX) {
            //坐骑
            return KeyWord.HERO_SUB_TYPE_ZUOQI;
        } else if (equipPart >= KeyWord.WH_EQUIP_PARTCLASS_MIN && equipPart < KeyWord.WH_EQUIP_PARTCLASS_MAX) {
            //神器
            return KeyWord.HERO_SUB_TYPE_WUHUN;
        } else if (equipPart >= KeyWord.FZ_EQUIP_PARTCLASS_MIN && equipPart < KeyWord.FZ_EQUIP_PARTCLASS_MAX) {
            //圣印
            return KeyWord.HERO_SUB_TYPE_FAZHEN;
        } else if (equipPart >= KeyWord.YY_EQUIP_PARTCLASS_MIN && equipPart < KeyWord.YY_EQUIP_PARTCLASS_MAX) {
            //翅膀
            return KeyWord.HERO_SUB_TYPE_YUYI;
        } else {
            //表示伙伴
            return 0;
        }
    }

    isJiSuTiaoZhanTime(): boolean {
        let now = G.SyncTime.getCurrentTime();
        let tmpDate = G.SyncTime.tmpDate;
        tmpDate.setTime(now);
        let hours = tmpDate.getHours();
        let minutes = tmpDate.getMinutes();
        return hours >= 6 && (hours <= 22 || minutes < 50);
    }

    leaveTeam() {
        let myTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossQuitTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
        }
        if (G.DataMgr.teamData.hasTeam) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_LeaveTeam));
        }
    }

    joinGuildPVP() {
        if (G.DataMgr.rmbData.isMathing) {
            G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(185));
            return;
        }
        if (G.DataMgr.heroData.guildId <= 0) {
            G.TipMgr.addMainFloatTip('没有宗门不能参加');
            return;
        }
        let status: Protocol.ActivityStatus;
        if (G.SyncTime.getDateAfterStartServer() > Constants.CORSS_GUILD_PVP_START_DAY) {
            status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_CROSS_GUILDPVPBATTLE);
            if (status && status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_CROSS_GUILDPVPBATTLE, 0, 0);
            }
            else {
                G.TipMgr.addMainFloatTip('活动暂未开始');
            }
        }
        else {
            status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_GUILDPVPBATTLE);
            if (status && status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUILDPVPBATTLE);
            }
            else {
                G.TipMgr.addMainFloatTip('活动暂未开始');
            }
        }
    }

    go2Pay() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
    }

    //获取聊天超链信息
    getChatLinkData(channelData: ChannelData, itemConfig: GameConfig.ThingConfigM, guid: Protocol.ThingGUID, closePanel: boolean = false): ChannelMsgData {
        let count: number = 0;
        for (let i: number = 0; i < channelData.listMsgData.length; ++i) {
            if (channelData.listMsgData[i].type == Macros.MSGDATATYPE_MAX) {
                continue;
            }
            count++;
        }
        if (count >= Constants.MAX_CHAT_LINK_COUNT) {
            G.TipMgr.addMainFloatTip(uts.format('最多只能发送{0}个链接', Constants.MAX_CHAT_LINK_COUNT));
            return;
        }
        let itemName: string = '[' + itemConfig.m_szName + ']';
        // 存入道具信息
        let data: ChannelMsgData = new ChannelMsgData();
        data.msg = itemName;
        data.data.m_stValue = {} as Protocol.ChatMsgDataValue;
        if (GameIDUtil.isEquipmentID(itemConfig.m_iID)) {
            // 只有装备和散仙卡支持动态类型
            data.data.m_ucType = Macros.MSGDATATYPE_PROP;
            data.data.m_stValue.m_stPropThing = {} as Protocol.MsgDataPropThing;
            data.data.m_stValue.m_stPropThing.m_iThingID = itemConfig.m_iID;
            data.data.m_stValue.m_stPropThing.m_stRoleId = G.DataMgr.heroData.roleID;
            data.data.m_stValue.m_stPropThing.m_stThingGUID = uts.deepcopy(guid, data.data.m_stValue.m_stPropThing.m_stThingGUID);
        }
        else {
            data.data.m_ucType = Macros.MSGDATATYPE_THING;
            data.data.m_stValue.m_stThing = {} as Protocol.MsgDataThing;
            data.data.m_stValue.m_stThing.m_iThingID = itemConfig.m_iID;
        }
        if (closePanel) {
            G.ViewCacher.emoijPanel.chatToolPanelAnimator.Play("BQdown");
            G.ViewCacher.emoijPanel.timeOut();
        }
        return data;
    }

    private callback: () => void = null;
    private panelTipTomaterailId: { [id: number]: boolean } = {};
    autoBuyMaterials(materailId: number, num: number, callback: () => void = null, storeID: EnumStoreID = EnumStoreID.MALL_YUANBAOBIND, excID = KeyWord.MONEY_YUANBAO_BIND_ID) {
        //优先绑定，其次非绑

        let ybData: MarketItemData;
        let bindybData: MarketItemData;
        let goodsData: MarketItemData;

        bindybData = G.DataMgr.npcSellData.getMarketDataByItemId(materailId, storeID, excID);
        let hasMoney = G.DataMgr.heroData.gold_bind;
        let price: number = 0;

        if (bindybData) {
            price = G.DataMgr.npcSellData.getPriceByID(bindybData.sellConfig.m_iItemID, 0, storeID, excID, num);
        }

        if (!bindybData || price > hasMoney) {
            storeID = EnumStoreID.MALL_YUANBAO;
            excID = KeyWord.MONEY_YUANBAO_ID;
            hasMoney = G.DataMgr.heroData.gold;
            ybData = G.DataMgr.npcSellData.getMarketDataByItemId(materailId, storeID, excID);
        }
        goodsData = ybData ? ybData : bindybData;
        storeID = ybData ? EnumStoreID.MALL_YUANBAO : EnumStoreID.MALL_YUANBAOBIND;
        excID = ybData ? KeyWord.MONEY_YUANBAO_ID : KeyWord.MONEY_YUANBAO_BIND_ID;
        hasMoney = ybData ? G.DataMgr.heroData.gold : G.DataMgr.heroData.gold_bind;

        if (!goodsData) {
            G.TipMgr.addMainFloatTip("此物品无法购买！");
            return;
        }
        price = G.DataMgr.npcSellData.getPriceByID(goodsData.sellConfig.m_iItemID, 0, storeID, excID, num);
        if (price > hasMoney) {
            G.TipMgr.addMainFloatTip("购买材料的货币不足支付，无法购买！");
            return;
        }
        let moneyStr = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, excID);
        let thingCfg = ThingData.getThingConfig(materailId);
        let thingName = thingCfg ? TextFieldUtil.getItemText(thingCfg) : "";
        let str = uts.format("是否花费{0}{1}\n补齐缺少的{2}x{3}", TextFieldUtil.getColorText(price + "", Color.GREEN), moneyStr, thingName, num);

        this.callback = callback;

        if (!this.notipagain/* !(materailId in this.panelTipTomaterailId) || !this.panelTipTomaterailId[materailId] */) {
            this.panelTipTomaterailId[materailId] = false;
            G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, "确认|取消", delegate(this, this.onGoToPayView, goodsData, num, excID, materailId));
        }
        else {
            this.onGoToPayView(MessageBoxConst.yes, true, goodsData, num, excID);
        }
    }

    private notipagain: boolean = false;
    private onGoToPayView(stage: MessageBoxConst, isCheckSelected: boolean, goodsData: MarketItemData, num: number, excID = 0, materailId: number = -1) {
        if (MessageBoxConst.yes == stage) {
            this.notipagain = isCheckSelected;
            // this.panelTipTomaterailId[materailId] = isCheckSelected;
            G.ModuleMgr.businessModule.directBuy(goodsData.sellConfig.m_iItemID, num, goodsData.sellConfig.m_iStoreID, excID, 0, false);
            let call = this.callback;
            this.callback = null;
            if (call) {
                call();
            }
        }
    }

    private privilegePromptCallback: () => void = null;
    private privilegePromptNoCallback: () => void = null;
    /**特权提示 vipLeftCount =-1 表示不限次数 */
    privilegePrompt(vipParam: number, cost: number, vipLeftCount: number, callback: () => void, callbackNo: () => void = null, autoRefresh: boolean = false) {
        let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(vipParam);
        let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(vipParam);
        let privilegeStrs = TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs);
        let buyTarget: string = "购买次数"
        //if (vipParam == KeyWord.VIP_PARA_DG_TIRED_BUY_NUM) {
        //    buyTarget = RichTextUtil.getColorText(uts.format("{0}疲劳值", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_DG_TIRED_BUY_VALUE, G.DataMgr.heroData.curVipLevel)), Color.GREEN);
        //}
        //else
        if (vipParam == KeyWord.VIP_PARA_WYFB_EXT_NUM) {
            buyTarget = uts.format("购买{0}体力", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WYFB_TIRED_BUY_VALUE, G.DataMgr.heroData.curVipLevel));
        }
        else if (vipParam == KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES) {
            buyTarget = "重置点数"
        }
        //else if (vipParam == KeyWord.VIP_PARA_BWFB_EXT_NUM) {
        //    buyTarget = uts.format("{0}活力", G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_BWFB_TIRED_BUY_VALUE, G.DataMgr.heroData.curVipLevel));
        //}
        if (hasActive) {
            this.privilegePromptCallback = callback;
            this.privilegePromptNoCallback = callbackNo;
            let info: string;
            let btnStr: string;
            if (vipLeftCount > 0 || vipLeftCount == -1) {
                btnStr = '确认|取消';
                info = uts.format("尊敬的{0}，是否使用{2}{1}{3}？",
                    TextFieldUtil.getColorText(privilegeStrs, Color.GOLD),
                    KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_ID),
                    TextFieldUtil.getColorText(Math.floor(cost) + "", Color.GREEN),
                    buyTarget);
                if (vipLeftCount > 0) {
                    info += uts.format("\n(今日剩余{0}次)", TextFieldUtil.getColorText(vipLeftCount + "", vipLeftCount > 0 ? Color.GREEN : Color.RED))
                }
                G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToGoToTask, cost));
            } else {
                // info = uts.format("可购买次数不足\n提升VIP等级获得更多购买次数！")
                if (autoRefresh) {
                    G.TipMgr.showConfirm('当前奖励次数为0，击杀BOSS无法获得奖励!', ConfirmCheck.noCheck, '确定', null);
                } else {
                    info = uts.format("您今天的重置次数已用完！")
                    btnStr = '提升|取消';
                    G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定', null);
                }
            }
            //G.Uimgr.createForm<PrivilegeMsgBoxView>(PrivilegeMsgBoxView).open(info, btnStr, vipParam, vipLeftCount, (vipLeftCount > 0 || vipLeftCount == -1) ? delegate(this, this.onGoToGoToTask, cost) : delegate(this, this.onGoToVipPanel));
        } else {
            if (vipParam == KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES) {
                G.TipMgr.showConfirm(uts.format('{0}可重置点数，是否购买？', TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
            } else {
                G.TipMgr.showConfirm(uts.format('激活{0}可使用开启此功能', TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
            }
        }
    }

    private onGoToGoToTask(stage: MessageBoxConst, isCheckSelected: boolean, cost: number = 0): void {
        if (MessageBoxConst.yes == stage) {
            let call = this.privilegePromptCallback;
            this.privilegePromptCallback = null;

            if (call) {
                // 检查货币是否足够     
                if (this.getMoneyIsOk(cost)) {
                    call();
                }
            }
        }
        else if (MessageBoxConst.no == stage) {
            let call = this.privilegePromptNoCallback;
            this.privilegePromptNoCallback = null;
            if (call) {
                call();
            }
        }
    }

    private onGoToVipPanel(stage: MessageBoxConst): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    /**1元宝=5绑定元宝*/
    readonly YUANBAO2BIND: number = 5;
    /**
     * 优先绑定，不足用非绑定*5比较
     * @param price
     */
    getMoneyIsOk(price: number): boolean {
        //MONEY_YUANBAO_BIND_ID
        let hasBind = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_BIND_ID);
        if (hasBind >= price)
            return true;
        let hasNoBind = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_ID);
        if ((hasNoBind) >= price)
            return true;

        G.TipMgr.addMainFloatTip(uts.format('您的{0}不足{1}！', KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_ID), price));
        return false;
    }
}
