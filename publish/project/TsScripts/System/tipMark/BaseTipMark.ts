import { Global as G } from 'System/global'
import { Profiler } from 'System/utils/Profiler'

export abstract class BaseTipMark {
    /**激活功能*/
    protected activeByFunc = 0;

    protected isActivated = false;

    /**是否在主界面展示*/
    protected showOnMain = false;

    /**是否可提示*/
    protected showTip = false;

    /**是否在下一帧进行检查*/
    protected waitChecking = false;

    /**关注的功能*/
    protected concernedFunctions: number[];

    /**关注的容器*/
    protected concernedContainers: number[];

    /**关注的货币*/
    protected concernedCurrencys: number[];

    /**关注的祝福类型*/
    protected concernedZhufuTypes: number[];

    /**是否关注角色等级*/
    protected sensitiveToHeroLv = false;

    /**是否关注技能*/
    protected sensitiveToSkill = false;

    /**是否关注法宝*/
    protected sensitiveToFabao = false;

    /**是否关注宝物*/
    protected sensitiveToFaQi = false;

    /**是否关注斗兽*/
    protected sensitiveToSiXiang = false;

    /**是否关注伙伴*/
    protected sensitiveToPet = false;

    /**是否关注宗门申请*/
    protected sensitiveToGuildApply = false;

    /**是否关注宗门礼包*/
    protected sensitiveToGuildGift = false;

    /**是否关注星环*/
    protected sensitiveToMagicCube = false;

    /**是否关注转生*/
    protected sensitiveToRebirth = false;

    protected sensitiveToRebirthEquip = false;

    /**是否关注神力*/
    protected sensitiveToJuYuan = false;

    /**是否关注道攻九星*/
    protected sensitiveToDaoGong = false;

    /**是否关注神力提升*/
    protected sensitiveToXueMai = false;

    /**是否关注装备收集*/
    protected sensitiveToEquipCollect = false;

    protected sensitiveToEquipFuHun = false;

    protected sensitiveToHunGuXiLian = false;

    protected sensitiveToEquipLianti = false;

    /**是否关注光印*/
    protected sensitiveToPetZhenTu = false;

    /**是否关注宗门拍卖*/
    protected sensitiveToGuildPaiMai = false;

    /**是否与战斗力有关*/
    protected sensitiveToZhanDouLi = false;

    /**是否跟魂力等级相关 */
    protected sensitiveToHunli = false;

    constructor(showOnMain) {
        this.showOnMain = showOnMain;
    }

    protected abstract doCheck(): boolean;
    abstract get TipName(): string;
    abstract action();

    checkActivated() {
        if (!this.isActivated) {
            if (this.activeByFunc > 0) {
                this.isActivated = G.DataMgr.funcLimitData.isFuncEntranceVisible(this.activeByFunc);
            } else {
                this.isActivated = true;
            }
            this.waitChecking = this.isActivated;
        }
    }

    get IsActviated(): boolean {
        return this.isActivated;
    }

    check(): boolean {
        if (!this.waitChecking) {
            return false;
        }
        
        //Profiler.push('check:' + (this as any).constructor.name.substr(0, 11));
        let showTip = this.doCheck();
        let isDiff = this.showTip != showTip;
        this.showTip = showTip;
        this.waitChecking = false;
        //Profiler.pop();
        return isDiff;
    }

    onFunctionUnlock(funcId: number) {
        if (this.activeByFunc > 0 && this.activeByFunc == funcId) {
            this.checkActivated();
        }
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || (null != this.concernedFunctions && this.concernedFunctions.indexOf(funcId) >= 0);
        }
    }

    onHeroUpgrade() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToHeroLv;
        }
    }

    onSkillChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToSkill;
        }
    }

    onContainerChange(containerID: number) {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || (null != this.concernedContainers && (0 == containerID || this.concernedContainers.indexOf(containerID) >= 0));
        }
    }

    onCurrencyChange(id: number) {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || (null != this.concernedCurrencys && (0 == id || this.concernedCurrencys.indexOf(id) >= 0));
        }
    }

    onZhufuDataChange(id: number) {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || (null != this.concernedZhufuTypes && (0 == id || this.concernedZhufuTypes.indexOf(id) >= 0));
        }
    }

    onFabaoChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToFabao;
        }
    } 

    onFaQiChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToFaQi;
        }
    }

    onSiXiangChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToSiXiang;
        }
    }

    onPetChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToPet;
        }
    }

    onGuildApplyChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToGuildApply;
        }
    }

    onGuildGiftChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToGuildGift;
        }
    }

    onMagicCudeChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToMagicCube;
        }
    }
    
    onRebirthChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToRebirth;
        }
    }

    onRebirthEquipChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToRebirthEquip;
        }
    }

    onJuYuanChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToJuYuan;
        }
    }

    onDaoGongChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToDaoGong;
        }
    }

    onXueMaiChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToXueMai;
        }
    }


    onEquipCollectChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToEquipCollect;
        }
    }

    onEquipFuHunChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToEquipFuHun;
        }
    }

    onHunGuXiLianChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToHunGuXiLian;
        }
    }

    onEquipLiantiChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToEquipLianti;
        }
    }

    onPetZhenTuChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToPetZhenTu;
        }
    }

    onGuildPaiMaiChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToGuildPaiMai;
        }
    }

    onZhanDouLiChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToZhanDouLi;
        }
    }

    onHunliLevelChange() {
        if (this.isActivated) {
            this.waitChecking = this.waitChecking || this.sensitiveToHunli;
        }
    }

    get WaitChecking(): boolean {
        return this.waitChecking;
    }

    get ShowTip(): boolean {
        return this.showTip;
    }

    get ShowOnMain(): boolean {
        return this.showOnMain;
    }
}