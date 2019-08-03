import { RoleData } from 'System/data/RoleData'
import { Macros } from 'System/protocol/Macros'
import { uint } from 'System/utils/MathUtil'

/**
 *单元状态
 *
 */
export class UnitStatus {
    static BLANK: string = '';

    static getStatusString(data: RoleData): string {
        let statusStr: string = UnitStatus.BLANK;

        let unitStatus: number = data.unitStatus;

        if ((unitStatus & Macros.EUS_ONLINE) == 0) {
            statusStr += '离线 ';
        }
        else if ((unitStatus & Macros.EUS_ALIVE) == 0) {
            statusStr += '死亡 ';
        }
        else {
            statusStr += '在线 ';
        }

        if (unitStatus & Macros.EUS_RECRUIT) {
            statusStr += '   招募中 ';
        }

        return statusStr;
    }

    static isInRide(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_RIDE);
    }

    /**
     * 是否挂了
     * @param unitStatus
     * @return
     *
     */
    static isDead(unitStatus: number): boolean {
        if (unitStatus & Macros.EUS_ALIVE) {
            return false;
        }

        return true;
    }

    /**
     * 是否不在线
     * @param unitStatus
     * @return
     *
     */
    static isOffline(unitStatus: number): boolean {
        if (unitStatus & Macros.EUS_ONLINE) {
            return false;
        }

        return true;
    }

    /**
     * 是否在战斗
     * @param unitStatus
     * @return
     *
     */
    static isInFight(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_FIGHT);
    }

    /**
     * 是否离线挂机
     * @param unitStatus
     */
    static isGuaJi(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_GUAJI);
    }

    static isInPvpFight(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_PVP_FIGHT);
    }

    static isActiveAttack(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_ACTIVEATTACK);
    }

    static isTransform(unitStatus: number): boolean {
        return 0 != (unitStatus & Macros.EUS_TRANSFORM);
    }

    /**
     *设置之前变身状态的为正常状态
     * @param unitStatus
     * @return
     *
     */
    static setStatusNormal(unitStatus: number): number {
        return (uint.MAX_VALUE - Macros.EUS_TRANSFORM) & unitStatus;
    }

    static revertStatus(unitStatus: number, eus: number): number {
        if (0 == (unitStatus & eus)) {
            return unitStatus;
        }
        let p = Math.pow(10, (eus - 1));
        let k = Math.floor(unitStatus / p);
        let t = k * p;
        return (k - 1) * p + unitStatus - t;
    }
}