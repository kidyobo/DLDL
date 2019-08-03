export class VersionUtil {
    public static compare(ver1: string, ver2: string): number {
        let ver1s = this.getVersionNumbers(ver1);
        let ver2s = this.getVersionNumbers(ver2);
        for (let i = 0; i < ver1s.length; i++) {
            if (ver1s[i] < ver2s[i]) return -1;
            else if (ver1s[i] > ver2s[i]) return 1;
        }
        return 0;
    }

    private static getVersionNumbers(ver: string, count: number = 4): number[] {
        let arr = ver.split('.');
        let vers: number[] = [];
        for (let a of arr) {
            vers.push(Number(a));
        }
        for (let i=vers.length; i<count; i++) {
            vers.push(0);
        }
        return vers;
    }
}