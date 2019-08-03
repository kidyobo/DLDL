import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { BuffData } from 'System/data/BuffData'
import { RoleData } from 'System/data/RoleData'
import { HeroController } from 'System/unit/hero/HeroController'
import { UnitController } from 'System/unit/UnitController'
import { RoleController } from 'System/unit/role/RoleController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { Macros } from 'System/protocol/Macros'
import { UnitCtrlType, EnumBuff } from 'System/constants/GameEnum'
import { UnitUtil } from 'System/utils/UnitUtil'
import { KeyWord } from 'System/constants/KeyWord'
/**
 * buff模块 
 * @author fygame
 * 
 */
export class BuffModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_Buff_Notify, this._onBuffNotify);
    }
    /**---------------------   以下代码处理网络消息  -----------------------**/

    /**
     * 通过buff的notify得到该buff的承载角色
     * @param notify
     * @return 
     * 
     */
    private _getBuffRole(unitBuff: Protocol.UnitBuff): UnitController {
        let result: UnitController = null;
        switch (unitBuff.m_ucUnitType) {
            case Macros.EUT_MONSTER://buff用在怪物身上,通过unitid
                result = G.UnitMgr.getUnit(unitBuff.m_iUnitID);
                break;
            case Macros.EUT_ROLE://用在角色身上	
                if (unitBuff.m_iUnitID != 0)//没有qq号码，只有unitID，肯定是其他角色
                {
                    result = G.UnitMgr.getUnit(unitBuff.m_iUnitID);
                }

                if (null == result && unitBuff.m_stRoleID.m_uiUin != 0)//有qq号码
                {
                    if (unitBuff.m_stRoleID.m_uiUin != G.DataMgr.heroData.roleID.m_uiUin)//用在队友身上
                    {
                    }
                    else {
                        result = G.UnitMgr.hero;
                    }
                }
                break;
            default:
                break;
        }

        return result;
    }

    private _onBuffNotify(notify: Protocol.Buff_Notify): void {
        let unitBuff: Protocol.UnitBuff = null;
        let len: number = notify.m_ucNumber;
        for (let i: number = 0; i < len; i++) {
            unitBuff = notify.m_astBuff[i];
            this._processUnitBuff(unitBuff);
        }
    }

    /**
     * 处理单个角色的buff 
     * @param unitBuff
     * 
     */
    private _processUnitBuff(unitBuff: Protocol.UnitBuff) {
        //处理角色身上的buff显示
        let baseRole: UnitController;
        let teamRoleData: RoleData;

        baseRole = G.UnitMgr.getUnit(unitBuff.m_iUnitID);
        if (null == baseRole) {
                      //uts.log('notify buff but no role: ' + unitBuff.m_stRoleID.m_uiUin);
            return;
        }


        let isHero = UnitCtrlType.hero == baseRole.Data.unitType;
        let changeDetail: Protocol.BuffChangeList = unitBuff.m_stBuffChangeList;
        let buffInfo: Protocol.BuffInfo;
        let buffConfig: GameConfig.BuffConfigM;

        // 增加的buff
        let changeList: Protocol.BuffInfo[] = changeDetail.m_astUpdateBuff;
        for (let i: number = 0; i < changeDetail.m_ucUpdateBuffNumber; ++i) {
            buffInfo = changeList[i];

            buffConfig = BuffData.getBuffByID(buffInfo.m_iBuffID);

            if (null == buffConfig) {
                continue;
            }

            //更新角色身上的buff特效,在里面会发送消息到mainui那边去更新头像下的buff图标
            //头像下的图标为什么要放到那边去发送，因为是像删除buff并不一定是通过协议，也许是时间到了，这是
            //前台自己维护的，所以根据自己身上的buff数据来维护，所以就统一放到那边去了
            let bid = baseRole.buffProxy.addBuff(buffInfo, buffConfig);

            if (isHero) {
                if (EnumBuff.ZLQJ_JIASU == buffInfo.m_iBuffID) {
                    // 获得西洋棋加速buff，显示剩余倒计时
                    G.ViewCacher.mainUIEffectView.showBuffCountDown(buffInfo.m_iBuffID, Math.round((bid.beginTime + bid.buffInfo.m_iBuffRemainTime) / 1000 - UnityEngine.Time.realtimeSinceStartup));
                }
            }
            else if (UnitUtil.isMonster(baseRole)) {
                if (BuffData.isBuffHasEffect(buffConfig, KeyWord.BUFF_EFFECT_NOT_SELECT) && G.UnitMgr.SelectedUnit == baseRole) {
                    // 给怪物打上不可选中的buff
                    G.UnitMgr.unselectUnit(baseRole.Data.unitID, false);
                }
            }
        }

        // 删除的buff
        let deleteList: number[] = changeDetail.m_astDeleteBuffID;
        for (let i: number = 0; i < changeDetail.m_ucDeleteBuffNumber; ++i) {
            let buffId: number = deleteList[i];

            buffConfig = BuffData.getBuffByID(buffId);

            if (null == buffConfig) {
                continue;
            }

            // 删除角色身上的buff
            baseRole.buffProxy.deleteBuff(buffId);
            G.ViewCacher.mainUIEffectView.showBuffCountDown(buffId, 0);
        }

        if (isHero) {
            baseRole.buffProxy.checkSomeBuff();
        }
        G.ViewCacher.mainView.onUnitBuffChanged(baseRole);
    }
}
