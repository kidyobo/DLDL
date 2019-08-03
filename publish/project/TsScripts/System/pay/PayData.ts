import { Constants } from 'System/constants/Constants'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'

export class PayData {
    private static readonly ChargeProductIDMin = 88001;
    private static readonly ChargeProductIDMax = 88008;

    static readonly ChargeMacros: number[] = [Macros.FST_CHARGE_GIFT_LEVEL_1, Macros.FST_CHARGE_GIFT_LEVEL_2, Macros.FST_CHARGE_GIFT_LEVEL_3, Macros.FST_CHARGE_GIFT_LEVEL_4, Macros.FST_CHARGE_GIFT_LEVEL_5, Macros.FST_CHARGE_GIFT_LEVEL_6, Macros.FST_CHARGE_GIFT_LEVEL_7, Macros.FST_CHARGE_GIFT_LEVEL_8];
    private readonly maxcount: number = 8;
    private data: GameConfig.ChargeGiftConfigM[];
    private shopData: GameConfig.ChargeGiftConfigM[] = [];

    onCfgReady(): void {
        let data: GameConfig.ChargeGiftConfigM[] = G.Cfgmgr.getCfg('data/ChargeGiftConfigM.json') as GameConfig.ChargeGiftConfigM[];
        this.data = this.getCurChannelData(data);
        for (let cfg of data) {
            if (cfg.m_iProductID >= PayData.ChargeProductIDMin && cfg.m_iProductID <= PayData.ChargeProductIDMax) {
                this.shopData.push(cfg);
            }
        }
    }

    private getCurChannelData(alldata: GameConfig.ChargeGiftConfigM[]): GameConfig.ChargeGiftConfigM[] {
        let data = [];
        if (data == null)
            return data;

        for (let value of alldata) {
            if (value.m_iChannlID == G.ChannelSDK.PlatformType) {
                data.push(value);
            }
        }

        if (data.length >= this.maxcount)
            return data;

        for (let value of alldata) {
            if (value.m_iChannlID == 0) {
                data.push(value);
            }
        }

        return data;
    }

    get ShopData(): GameConfig.ChargeGiftConfigM[] {
        if (!G.IsIosTiShenEnv && G.DataMgr.heroData.curChargeMoney > 0) {
            this.shopData[0] = this.shopData[this.maxcount - 1];
        }
        return this.shopData;
    }

    getCfgById(productId: number): GameConfig.ChargeGiftConfigM {
        for (let item of this.data) {
            if (item.m_iProductID == productId) return item;
        }
        return null;
    }

    getCfgByCount(count: number): GameConfig.ChargeGiftConfigM {
        for (let item of this.data) {
            if (item.m_iChargeCount == count) return item;
        }
        return null;
    }
}
