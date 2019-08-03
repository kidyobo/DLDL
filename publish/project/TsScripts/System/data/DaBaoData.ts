import { Global as G } from 'System/global'



export class DaBaoData {

    ////////////////////////////IOS//////////////////////////////////////

    private iosDaBaoData: { [gameId: number]: GameConfig.IOSDabaoM } = {};

    onCfgReady() {
        let datas: GameConfig.IOSDabaoM[] = G.Cfgmgr.getCfg('data/IOSDabaoM.json') as GameConfig.IOSDabaoM[];
        for (let data of datas) {
            if (this.iosDaBaoData[data.m_iGameID] == null) {
                this.iosDaBaoData[data.m_iGameID] = {} as GameConfig.IOSDabaoM;
            }
            this.iosDaBaoData[data.m_iGameID] = data;
        }
    }

    getIosDaBaoDataByGameId(gameId: number): GameConfig.IOSDabaoM {
        let data: GameConfig.IOSDabaoM = null;
        if (this.iosDaBaoData[gameId] != null) {
            data = this.iosDaBaoData[gameId];
        }
        return data;
    }

    ////////////////////////////Android//////////////////////////////////////




}