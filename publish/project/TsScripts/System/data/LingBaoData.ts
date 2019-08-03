import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export class LingBaoData {
    static DEFAULT_GET_ITEM: number = 20156001;
    private _lingbaoItems: { [id: number]: GameConfig.LingBaoCfgM } = {};

    onCfgReady(): void {
        let dataList: GameConfig.LingBaoCfgM[] = G.Cfgmgr.getCfg('data/LingBaoCfgM.json') as GameConfig.LingBaoCfgM[];
        for (let cfg of dataList)
            this._lingbaoItems[cfg.m_iEquipId] = cfg;
    }

    getLingBaoCfg(equipId: number): GameConfig.LingBaoCfgM {
        return this._lingbaoItems[equipId];
    }

    ///**
    // * 是否显示获取精灵面板
    // * @param cfg
    // * @return
    // *
    // */
    //private isShowGetPanel(cfg: GameConfig.EquipConfigM): boolean {
    //    if (cfg == null || cfg.m_iID != LingBaoData.DEFAULT_GET_ITEM)
    //        return false;
    //    return !G.DataMgr.systemData.firshShowLingBao;
    //}

    ///**
    // * 比较精灵，检查是否弹出新的精灵
    // * @param thingInfo	装备属性
    // *
    // */
    //betterLingBao(thingInfo: Protocol.ContainerThingInfo): void {
    //    if (thingInfo == null)
    //        return;
    //    let equipConfig: GameConfig.EquipConfigM = ThingData.getThingConfig(thingInfo.m_iThingID);
    //    if (equipConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_LINGBAO)
    //        return;

    //    if (G.DataMgr.sceneData.curPinstanceID > 0)
    //        return;

    //    if (this.isShowGetPanel(equipConfig)) {
    //        G.DataMgr.systemData.firshShowLingBao = true;
    //        sendMsg(ProtocolUtil.getSystemSettingChangeRequest());
    //        this.dispatchEvent(Events.SHOW_CLOSE_DIALOG_LING_BAO_GET, thingInfo);
    //    }
    //}
}
