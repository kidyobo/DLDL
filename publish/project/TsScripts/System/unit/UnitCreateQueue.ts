import { UnitController } from "System/unit/UnitController";
export class UnitCreateQueue {
    private list: UnitController[] = [];
    private count: number = 0;
    public update() {
        if (this.count == 0) {
            return;
        }
        this.count--;
        let item = this.list.pop();
        item.onLoadModel();
    }
    public add(unit: UnitController) {
        this.list.push(unit);
        this.count++;
    }
    public remove(unit: UnitController) {
        let index = this.list.indexOf(unit);
        if (index >= 0) {
            this.list.splice(index, 1);
            this.count--;
        }
    }
    public clear() {
        this.list = [];
        this.count = 0;
    }
}