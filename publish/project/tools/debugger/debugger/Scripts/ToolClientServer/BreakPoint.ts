export class BreakPoint {
    id: number;
    scriptId: number;
    line: number;
    column: number;
    enabled: boolean = true;
    condition: string = '';
    ignoreCount: number = 0;
    duk_id: number = -1;
    virtual: boolean = false;
    toJSON(): any {
        return {
            breakpoint: this.id, script_id: this.scriptId, line: this.line, column: this.column, actual_locations: [{ line: this.line, column: this.column, script_id: this.scriptId }]
        }
    }
}

export class BreakPoints {
    private static next_id = 1;
    private breakPoints: Array<BreakPoint> = [];
    addVirtualPoint(scriptId: number, line: number, column: number): BreakPoint {
        let bkp = this.addPoint(scriptId, line, column);
        bkp.virtual = true;
        return bkp;
    }
    addPoint(scriptId: number, line: number, column: number, condition?: string): BreakPoint {
        for (let i = 0; i < this.breakPoints.length; i++) {
            let b = this.breakPoints[i];
            if (b.scriptId === scriptId && b.line === line && b.column === column) {
                this.breakPoints.splice(i, 1);
                break;
            }
        }
        let nb = new BreakPoint();
        nb.scriptId = scriptId;
        nb.line = line;
        nb.column = column;
        nb.condition = condition ? condition : '';
        nb.id = BreakPoints.next_id++;
        this.breakPoints.push(nb);
        return nb;
    }
    clearPoint(id: number) {
        for (let i = 0; i < this.breakPoints.length; i++) {
            let b = this.breakPoints[i];
            if (b.id === id) {
                this.breakPoints.splice(i, 1);
                break;
            }
        }
    }
    getPoint(id: number) {
        for (let i = 0; i < this.breakPoints.length; i++) {
            let b = this.breakPoints[i];
            if (b.id === id) {
                return b;
            }
        }
        return null;
    }
    clear() {
        this.breakPoints = [];
    }
    bindPoint(id: number, dukbpid: number) {
        let bp = this.getPoint(id);
        if (bp == null) {
            console.log('not find bp no in bindPoint, id:' + id + ', duk_id' + dukbpid);
            return;
        }
        bp.duk_id = dukbpid;
    }
    findPointId(line: number, column: number, scriptId: number): number {
        for (let i = 0; i < this.breakPoints.length; i++) {
            let b = this.breakPoints[i];
            if (b.scriptId === scriptId && b.line === line && b.column === column) {
                return b.id;
            }
        }
        return -1;
    }
    get count(): number {
        return this.breakPoints.length;
    }
    getPointByIndex(idx: number): BreakPoint {
        return this.breakPoints[idx];
    }
}