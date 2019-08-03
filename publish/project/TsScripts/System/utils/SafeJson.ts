export class SafeJson {
    static parse(s: string): any {
        try {
            return JSON.parse(s);
        } catch (e) {
            uts.logWarning(e.stack || e);
            return null;
        }
    }
    static stringify(o: any): string {
        return JSON.stringify(o);
    }
}