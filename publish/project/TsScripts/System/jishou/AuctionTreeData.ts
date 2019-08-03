import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { JishouData } from 'System/jishou/jishouData'

export class AuctionTreeData {

    private static readonly maxNum: number = 5;

    private m_huigouClass: { [id: number]: number[] } = {};
    /**回购配置*/
    private m_huigouConfigs: { [class2: number]: GameConfig.NPCStoreBuyBackCfgM[] } = [];
    static classData: { [id: number]: number[] } = {};
    static getClassId(class1: number, class2: number = 0, class3: number = 0): number {
        return class1 * 10000 + class2 * 100 + class3;
    }

    //注释 策划改表控制也签
    static getTypeList(): JishouData[] {

        //寄售一级页签映射
        let keyList: { [id: number]: number } = {};
        keyList[KeyWord.AUCTION_CLASS1_WAIGUAN] = KeyWord.GROUP_AUCTION_CLASS2_WAIGUAN;
        keyList[KeyWord.AUCTION_CLASS1_EQUIP] = KeyWord.GROUP_AUCTION_CLASS2_EQUIP;
        keyList[KeyWord.AUCTION_CLASS1_BEAUTY] = KeyWord.GROUP_AUCTION_CLASS2_BEAUTY;
        //keyList[KeyWord.AUCTION_CLASS1_STUFF] = KeyWord.GROUP_AUCTION_CLASS2_STUFF;
        keyList[KeyWord.AUCTION_CLASS1_OTHERS] = KeyWord.GROUP_AUCTION_CLASS2_OTHERS;
        keyList[KeyWord.AUCTION_CLASS1_SAIJI] = KeyWord.GROUP_AUCTION_CLASS2_SAIJI;

        //物品表+装备表（1级+2级[]）
        let dataList: { [id: number]: number[] } = G.DataMgr.thingData.auctionClass;

        let firstClass: number[] = [];
        for (let id in dataList) {
            firstClass.push(parseInt(id));
        }
        firstClass.sort(delegate(this, this.sortNumber));

        let returnList: JishouData[] = [];
        let returnItem1: JishouData;
        let returnItem2: JishouData;
        let data: number[];
        for (let i = 0; i < firstClass.length; i++) {
            let class1 = firstClass[i];
            returnItem1 = new JishouData();
            returnItem1.items = [];
            returnItem1.classID = AuctionTreeData.getClassId(class1);
            returnItem1.self = KeyWord.getDesc(KeyWord.GROUP_AUCTION_CLASS1, class1);
            returnItem1.opened = false;
            returnItem1.classType = class1;

            data = dataList[class1];
            data.sort(delegate(this, this.sortNumber));
            this.classData[class1] = data;
            if (data == null || data.length <= 0)
                continue;
            for (let j: number = 0; j < data.length; j++) {
                returnItem2 = new JishouData();
                returnItem2.items = null;
                returnItem2.classID = AuctionTreeData.getClassId(class1, data[j]);
                returnItem2.self = KeyWord.getDesc(keyList[class1], data[j]);
                returnItem2.opened = false;
                returnItem2.classType = data[j];
                returnItem1.items.push(returnItem2);
            }
            returnList.push(returnItem1);
        }
        return returnList;
    }

    private static sortNumber(a: number, b: number): number {
        return a - b;
    }

    onCfgReady(): void {
        this.setHuigouConfig();
    }

    private setHuigouConfig(): void {
        let configs: GameConfig.NPCStoreBuyBackCfgM[] = G.Cfgmgr.getCfg('data/NPCStoreBuyBackCfgM.json') as GameConfig.NPCStoreBuyBackCfgM[];
        for (let cfg of configs) {
            if (cfg.m_iItemID == 0) {
                // 过滤掉无用数据
                continue;
            }
            if (cfg.m_ucExchange1Class != 0 && cfg.m_ucExchange2Class != 0) {

                if (!this.m_huigouClass[cfg.m_ucExchange1Class]) {
                    this.m_huigouClass[cfg.m_ucExchange1Class] = [];
                }

                if (this.m_huigouClass[cfg.m_ucExchange1Class].indexOf(cfg.m_ucExchange2Class) == -1) {
                    this.m_huigouClass[cfg.m_ucExchange1Class].push(cfg.m_ucExchange2Class);
                }

                if (!this.m_huigouConfigs[cfg.m_ucExchange2Class]) {
                    this.m_huigouConfigs[cfg.m_ucExchange2Class] = [];
                }
                this.m_huigouConfigs[cfg.m_ucExchange2Class].push(cfg);

            }
        }
    }

    getHuigouConfigsByClassID(class2: number): GameConfig.NPCStoreBuyBackCfgM[] {
        return this.m_huigouConfigs[class2];
    }

    getHuigouList(): JishouData[] {
        //物品表+装备表（1级+2级[]）
        let dataList: { [id: number]: number[] } = this.m_huigouClass;

        let firstClass: number[] = [];
        for (let id in dataList) {
            firstClass.push(parseInt(id));
        }
        // firstClass.sort(delegate(this, this.sortNumber));

        let returnList: JishouData[] = [];
        let returnItem1: JishouData;
        let returnItem2: JishouData;
        let data: number[];

        for (let i = 0; i < firstClass.length; i++) {
            let class1 = firstClass[i];
            returnItem1 = new JishouData();
            returnItem1.items = [];
            returnItem1.classID = class1;
            returnItem1.self = KeyWord.getDesc(KeyWord.GROUP_STORE_BUYBACK_TYPE, class1);//一级名称
            returnItem1.opened = false;

            data = dataList[class1];
            // data.sort(delegate(this, this.sortNumber));

            if (data == null || data.length <= 0)
                continue;
            for (let j: number = 0; j < data.length; j++) {
                returnItem2 = new JishouData();
                returnItem2.items = null;
                returnItem2.classID = data[j];
                returnItem2.self = KeyWord.getDesc(KeyWord.GROUP_STORE_BUYBACK_TYPE, data[j]);//二级名称
                returnItem2.opened = false;
                returnItem1.items.push(returnItem2);
            }
            returnList.push(returnItem1);
        }
        return returnList;
    }
}
