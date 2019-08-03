import { UnitState } from "System/unit/UnitState"
export interface UnitAgent {
    getSex(): boolean;
    getName(): string;
    onMoveEnd(byStop: boolean);
    getAnimName(state: UnitState): string;
    updateUnitAvatar(type: number, id: number);
}