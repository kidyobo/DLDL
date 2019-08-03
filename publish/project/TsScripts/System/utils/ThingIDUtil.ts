import { EnumThingID } from 'System/constants/GameEnum'

export class ThingIDUtil {
    private static zhiShengDanLv2Id: { [lv: number]: number } = {};

    /**新手礼包。*/
    static XSLBS: number[] = [10012011, 
        10012021,
        10012031,
        10012041,
        10012051,
        10012061,
        10012071
    ];

    /**筋斗云。（由读表时筛选）*/
    static JDY: number = 0;

    /**天宫宝镜鉴宝符。*/
    static TGBJ_JBF: number = 0;

    /**天宫秘境鉴宝符。*/
    static TGMJ_JBF: number = 0;

    static setZhiShengDanId(id: number, lv: number) {
        ThingIDUtil.zhiShengDanLv2Id[lv] = id;
    }

    static getZhiShengDanId(lv: number): number {
        return ThingIDUtil.zhiShengDanLv2Id[lv];
    }
}