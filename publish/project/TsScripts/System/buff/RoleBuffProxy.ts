import { Global as G } from 'System/global'
import { BuffData } from 'System/data/BuffData'
import { BuffDataList } from 'System/buff/BuffDataList'
import { BuffInfoData } from 'System/buff/BuffInfoData'
import { UnitController } from 'System/unit/UnitController'
import { RoleController } from 'System/unit/role/RoleController'
import { HeroController } from 'System/unit/hero/HeroController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitUtil } from 'System/utils/UnitUtil'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { BuffableAvatar } from 'System/unit/avatar/BuffableAvatar'

export class RoleBuffProxy {
    /**buff承载的角色*/
    private m_role: UnitController;

    /**该角色身上所有的buff数据*/
    buffDataList: BuffDataList = new BuffDataList();

    private _isComa = false;
    private _isFreeze = false;
    private _isSilence = false;

    lastFreeComaAt = 0;

    /**
     * 构造函数
     * @param holder
     * 
     */
    constructor(unitCtrl: UnitController) {
        this.m_role = unitCtrl;
    }

    destroy() {
        this.m_role = null;
        this.buffDataList.destroy();
        this.buffDataList = null;
    }

    /**
    * 判断玩家身上是否有变身的buff
    * @return
    *
    */
    public getChangeAvatarBuff(): GameConfig.BuffConfigM {
        let buffList = this.buffDataList.buffDatas;
        for (let buffIdKey in buffList) {
            let buffInfo = buffList[buffIdKey];
            if (BuffData.isNeedChangeAvata(buffInfo.config)) {
                return buffInfo.config;
            }
        }
        return null;
    }

    /**
	* 判断玩家是否昏迷
	* @return
	*
	*/
    get isComa(): boolean {
        return this._isComa;
    }

    /**
     * 判断玩家是否被定身
     * @return
     *
     */
    get isFreze(): boolean {
        return this._isFreeze;
    }

    /**
     * 判断玩家是否被沉默
     * @return
     *
     */
    get isSilence(): boolean {
        return this._isSilence;
    }

    getBuffInfo(id: number): BuffInfoData {
        return this.buffDataList.getBuffInfoData(id);
    }

    /**
	* 判断玩家身上有指定的buff效果。
	* @param effectType buff效果类型。
	* @param value buff数值。
	* @param valueRule 数值比较规则，默认为0，表示与指定的value相当，-1表示不超过指定的value，
	* -2表示比指定的value小，1表示不小于指定的value，2表示比指定的value大。
	* @return
	*
	*/
    hasBuffEffect(effectType: number, value: number = -1, valueRule: number = 0): boolean {
        let buffList = this.buffDataList.buffDatas;
        for (let buffIdKey in buffList) {
            let buffInfo = buffList[buffIdKey];
            if (BuffData.isBuffHasEffect(buffInfo.config, effectType, value, valueRule)) {
                return true;
            }
        }
        return false;
    }

    /**
	* 判断玩家身上有指定的buff。
	* @param buffID 指定的buffID。
	* @param exactly 传true的话必须匹配ID，false则根据buff的识别ID和互斥类型进行匹配。
	* @param buffLv Buff等级，0表示不检查。
	* @param valueRule 数值比较规则，默认为0，表示与指定的value相当，-1表示不超过指定的value，
	* -2表示比指定的value小，1表示不小于指定的value，2表示比指定的value大。
	*
	* @return
	*
	*/
    hasBuffByID(buffID: number, exactly: boolean = true, buffLv: number = 0, valueRule: number = 0): boolean {
        let result: boolean = false;
        let buffConfig: GameConfig.BuffConfigM = BuffData.getBuffByID(buffID);
        let buffList = this.buffDataList.buffDatas;
        for (let buffIdKey in buffList) {
            let buffInfo = buffList[buffIdKey];
            if (exactly) {
                if (buffInfo.config.m_uiBuffID == buffID) {
                    result = true;
                }
            }
            else {
                if ((buffInfo.config.m_iIdentifyID == buffConfig.m_iIdentifyID) || (buffConfig.m_ucBuffType > 0 && buffInfo.config.m_ucBuffType == buffConfig.m_ucBuffType)) {
                    // 识别Id相同或者互斥类型相同
                    if (buffLv <= 0) {
                        // 不检查buff等级
                        result = true;
                    }
                    else {
                        // 根据比较规则检查buff等级
                        if (0 == valueRule) {
                            result = buffInfo.config.m_ucBuffLevel == buffConfig.m_ucBuffLevel;
                        }
                        else if (1 == valueRule) {
                            result = buffInfo.config.m_ucBuffLevel >= buffConfig.m_ucBuffLevel;
                        }
                        else if (valueRule > 1) {
                            result = buffInfo.config.m_ucBuffLevel > buffConfig.m_ucBuffLevel;
                        }
                        else if (-1 == valueRule) {
                            result = buffInfo.config.m_ucBuffLevel <= buffConfig.m_ucBuffLevel;
                        }
                        else if (valueRule < -1) {
                            result = buffInfo.config.m_ucBuffLevel < buffConfig.m_ucBuffLevel;
                        }
                    }
                }
            }

            if (result) {
                break;
            }
        }

        return result;
    }

    /**
     * 增加某个buff 
     * @param buffInfo
     * @param buffName
     * 
     */
    addBuff(buffInfo: Protocol.BuffInfo, buffConfig: GameConfig.BuffConfigM): BuffInfoData {
        // 1. 增加或者更新buff数据
        let bid = this.buffDataList.addBuffData(buffInfo, buffConfig);

        let rotation: number = 0;

        if (UnitUtil.isMonster(this.m_role) && BuffData.isBuffHaveBossSing(buffConfig)) {
            rotation = UnitUtil.dir2Dto3D(buffInfo.m_ucBuffDirection);
        }

        //添加效果
        if (buffConfig.m_szBuffSpecialEffect != null && buffConfig.m_szBuffSpecialEffect != '') {
            if (buffConfig.m_szBuffSpecialEffect.length < 3) {
                if (buffConfig.m_szBuffSpecialEffect == "1") {
                    //this.m_role.model.avatar.setLightColor(true, 1, 0, 0, 1);
                }
            }
            else {
                let avatar = this.m_role.model.avatar as BuffableAvatar;
                if (avatar.addBuff) {
                    avatar.addBuff(buffConfig.m_uiBuffID, buffConfig.m_szBuffSpecialEffect, buffConfig.m_ucBindingPosition);
                }
                else {
                    uts.logError('addBuff error: ' + buffConfig.m_uiBuffID + ', unit = ' + this.m_role.Data.id);
                }
            }
        }

        this.m_role.onAddBuff(buffInfo);
        if (BuffData.isNeedChangeAvata(buffConfig)) {
            this.m_role.changeAvatarByBuff(buffConfig);
        }

        return bid;
    }

    /**
     * 删除某个指定的buff 
     * @param buffId
     * 
     */
    deleteBuff(buffId: number): void {
        let buffInfoData: BuffInfoData = this.buffDataList.getBuffInfoData(buffId);
        if (buffInfoData == null) {
            return;
        }

        let congfig: GameConfig.BuffConfigM = buffInfoData.config;

        // 2. 更新数据
        this.buffDataList.deleteBuffData(buffId);

        if (congfig.m_szBuffSpecialEffect != null && congfig.m_szBuffSpecialEffect != '') {
            if (congfig.m_szBuffSpecialEffect.length < 3) {
                if (congfig.m_szBuffSpecialEffect == "1") {
                    //this.m_role.model.avatar.setLightColor(false, 1, 0, 0, 1);
                }
            }
            else {
                let avatar = this.m_role.model.avatar as BuffableAvatar;
                if (avatar.removeBuff) {
                    avatar.removeBuff(congfig.m_uiBuffID);
                }
                else {
                    uts.logError('removeBuff error: ' + congfig.m_uiBuffID + ', unit = ' + this.m_role.Data.id);
                }
            }
        }
        this.m_role.onDeleteBuff(buffId);

        if (BuffData.isNeedChangeAvata(congfig)) {
            this.m_role.cancelChangeAvatar();
        }
    }

    /**
     * 删除所有的buff 
     * 
     */
    deleteAllBuff(): void {
        //1. 删除所有的数据
        let allIds = this.buffDataList.getAllBuffId();
        this._isComa = false;
        this._isFreeze = false;
        this._isSilence = false;
        let len = allIds.length;
        for (let i = 0; i < len; ++i) {
            this.deleteBuff(allIds[i]);
        }
    }

    checkSomeBuff() {
        let oldComa = this._isComa;
        this._isComa = this.hasBuffEffect(KeyWord.BUFF_EFFECT_COMA);
        this._isFreeze = this.hasBuffEffect(KeyWord.BUFF_EFFECT_SKILLFREEZE);
        this._isSilence = this.hasBuffEffect(KeyWord.BUFF_EFFECT_SKILL_SILENCE);
        if (oldComa && !this._isComa) {
            this.lastFreeComaAt = UnityEngine.Time.realtimeSinceStartup;
        }
    }

    /**每个周期内的处理*/
    run(): number {
        //检查这个周期内是不是需要删除某些buff
        let deleteIds = this.buffDataList.processBuffData();
        let len: number = deleteIds.length;
        let config: GameConfig.BuffConfigM = null;
        for (let i: number = 0; i < len; ++i) {
            this.deleteBuff(deleteIds[i]);
        }
        return len;
    }
}