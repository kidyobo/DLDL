import { Global as G } from 'System/global'
import { CDData } from 'System/data/vo/CDData'
import { Macros } from 'System/protocol/Macros'

/**
 * 物品、技能CD的管理中心。
 * @author xiaojialin
 * 
 */
export class CdDataMgr {
    /**上一次使用集结令的时间。*/
    lastJijieAt: number = 0;

    /**承载冷却数据的映射表。*/
    private m_cdDatum: { [skillID: number]: CDData };

    /**是否正在更新冷却数据。*/
    private m_isUpdating: boolean = false;

    /**是否有冷却数据被真正更新。*/
    private m_isUpdatedReally: boolean = false;

    /**用来做所有技能释放之间的间隔，公共cd的公共cd之类的东西*/
    private m_jgCD: CDData;

    constructor() {
        this.m_cdDatum = {};
        this.m_jgCD = new CDData();
    }

    /**
     * 初始化登陆时下发的下线冷却数据。
     * @param pCoolDownListClient 登陆时下发的下线冷却数据。
     * 
     */
    initCdDatum(pCoolDownListClient: Protocol.CooldownListClient): void {
        this._startUpdate();
        let now: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        // 初始化技能冷却
        let coolDownList: Protocol.CooldownClient[] = pCoolDownListClient.m_astCooldown;
        for (let coolDown of coolDownList) {
            this._updateCd(coolDown.m_iID, coolDown.m_iAllCDTime,
                now + (coolDown.m_iLeftTime - coolDown.m_iAllCDTime), coolDown.m_iLeftTime);
        }
        this._endUpdate();
    }

    /**
     * 更新CD数据，若更新成功将触发CD数据更新事件。
     * 
     * @param pSkill 技能配置数据。
     * 
     */
    addNewCd(pSkill: GameConfig.SkillConfigM): void {
        this._startUpdate();
        let startAt: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        let colldown = pSkill.m_stSkillCollDown;
        if (colldown.m_uiSelfCoolDown > 0) {
            // 自身冷却
            let selfCd: number = colldown.m_uiSelfCoolDown;

            ////看看有没有受法则影响
            //selfCd -= G.DataMgr.skillData.getSkillCdEffect(pSkill.m_iSkillID);

            if (selfCd > 0) {
                this._updateCd(pSkill.m_iSkillID, selfCd, startAt, -1);
            }
        }

        if (colldown.m_ucGCDIncluded > 0 && colldown.m_iGCDTime > 0) {
            // 公共冷却
            this._updateCd(colldown.m_ucGCDIncluded, colldown.m_iGCDTime, startAt, -1);
        }

        //如果是需要控制间隔的，更新间隔cd
        if (pSkill.m_bSkillJG > 0) {
            this.m_jgCD.reset(0, Macros.MAX_SKILL_TIME_COMMON_CD_DIS, startAt, -1);
        }

        this._endUpdate();
    }

    /**
     * 通过技能配置获取指定性质（是否自身冷却）的冷却数据。
     * @param id 技能冷却ID。
     * @return 指定的冷却数据，如果不存在匹配的冷却数据则返回<code>null</code>。
     * 
     */
    private _getCdData(id: number): CDData {
        if (id > 0 && this.m_cdDatum.hasOwnProperty(id.toString())) {
            let cdData: CDData = this.m_cdDatum[id];
            if (cdData.isColding) {
                return cdData;
            }
            else {
                this.m_cdDatum[id] = null;
                delete this.m_cdDatum[id];
            }
        }
        return null;
    }

    /**
     * 通过技能配置获取冷却数据。按照自身冷却优先级比公共冷却高的顺序，如果存在匹配的
     * 自身冷却数据则返回自身冷却数据，否则如果存在匹配的公共冷却数据，则返回公共冷却
     * 数据，如果都不存在则返回<code>null</code>。
     * 
     * @param pSkill 技能配置。
     * @return 按照自身冷却优先级比公共冷却高的顺序查询到的冷却数据。
     * 
     */
    getCdDataBySkill(pSkill: GameConfig.SkillConfigM): CDData {
        let selfCdData: CDData = this._getCdData(pSkill.m_iSkillID);

        let min: number = 0;
        let result: CDData;

        if (null != selfCdData && selfCdData.remainTime > min) {
            min = selfCdData.remainTime;
            result = selfCdData;
        }

        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        if (cfg.m_iSkillID == pSkill.m_iSkillID) {
            return result;
        }

        let gcdData: CDData = this._getCdData(pSkill.m_stSkillCollDown.m_ucGCDIncluded);
        if (null != gcdData && gcdData.remainTime > min) {
            min = gcdData.remainTime;
            result = gcdData;
        }

        if (pSkill.m_bSkillJG && this.m_jgCD.remainTime > min) {
            min = this.m_jgCD.remainTime;
            result = this.m_jgCD;
        }

        return result;
    }

    /**
     * 更新指定冷却数据的内置方法。由于属于内置方法，对参数值有严格的规则要求，若不符合规则将产生断言失败。
     * @param pCdKey 技能ID。
     * @param pIsSelf 是否自身冷却。
     * @param pStartTime 开始冷却的时间，若无意义请传递-1，此时不允许向pLeftTime传递无意义数值（-1或任何小于0的数值）。
     * @param pLeftTime 剩余冷却时间，若无意义请传递-1，此时不允许向pStartTime传递无意义数值（-1或任何小于0的数值）。
     * @param pSkill 技能配置。
     * 
     */
    private _updateCd(pID: number, pAllTime: number, pStartTime: number, pLeftTime: number = -1): void {
        if (!this.m_isUpdating) {
            return;
        }

        let cdData: CDData = this.m_cdDatum[pID];
        if (null == cdData) {
            cdData = this.m_cdDatum[pID] = new CDData();
        }
        cdData.reset(pID, pAllTime, pStartTime, pLeftTime);

        this.m_isUpdatedReally = true;
    }

    /**
     * 开始更新CD数据，调用endUpdate将结束更新数据并触发CD数据更新事件。
     *  
     */
    private _startUpdate(): void {
        this.m_isUpdating = true;
    }

    /**
     * 结束更新CD数据，如果之前调用过startUpdate，将触发CD数据更新事件。
     * 
     */
    private _endUpdate(): void {
        if (this.m_isUpdating) {
            this.m_isUpdating = false;
            if (this.m_isUpdatedReally) {
                this.m_isUpdatedReally = false;
                G.ViewCacher.mainView.onCdChanged();
            }
        }
    }

    reset() {
        this.m_cdDatum = {};
        G.ViewCacher.mainView.onCdChanged();
    }
}
