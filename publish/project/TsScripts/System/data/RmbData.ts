import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 人民币战场数据
 * @author lyl
 */
export class RmbData {
    //todo 人民币战场数据  RmbData
    /**二维码URL地址*/
    twoCodeUrl: string;
    //twoCodeBin: ByteArray;
    //twoCodeUrl: string;
    /**人民币战场信息*/
    rmbZcInfo: Protocol.RMBZCInfoRsp;
    /**人民币兑换信息*/
    exhcangeInfo: Protocol.CSRMBGetInfo_Response;
    /**人民币引导兑换标识*/
    private _flagGuideRmbExchange: number = 0;

    twoCodeUrlRoot: string = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';

    constructor() {
        //if(defines.has('_DEBUG'))
        //{
        //this.twoCodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQE68DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FrUUlYUnprNXhXZW4wOTJuMm91AAIEG9E2VwMECAcAAA==';
        //}
    }

    /**是否正在匹配中*/
    get isMathing(): boolean {     
        return this.rmbZcInfo && this.rmbZcInfo.m_ucStatus == Macros.RMBZC_STATUS_JOIN;
    }

    /**人民币引导兑换标识*/
    get flagGuideRmbExchange(): number {
        return this._flagGuideRmbExchange;
    }

    set flagGuideRmbExchange(value: number) {
        this._flagGuideRmbExchange = value;
        //this.dispatchEvent(Events.rmbExchangeGuiderUpdate);
    }

    /**请求二维码数据*/
    requestTwoCodeData(money: number): void {
        if (RmbData.isOpenRmbZc) {
            //G.DataMgr.gameParas.p360Get.getTwoCodeStatus(updateTwoCodeData, money);
        }
    }

    /**更新二维码数据*/
    private updateTwoCodeData(data: any): void {
        //if (data != null)
        //{
        //	this.twoCodeBin = data as ByteArray;

        //	if (this.twoCodeBin == null || this.twoCodeBin.length == 0)
        //	{
        //		G.TipMgr.addMainFloatTip('兑换太火爆，请稍后再试[02]');
        //	}
        //	else
        //	{
        //		this.dispatchEvent(Events.twoCodeCompelete);
        //	}
        //}
        //else
        //{
        //	G.TipMgr.addMainFloatTip('兑换太火爆，请稍后再试[01]');
        //}

        //this.dispatchEvent(Events.twoCodeCompelete);

        //this.dispatchEvent(Events.twoCodeCompelete);

        //G.TipMgr.addMainFloatTip(data['errmsg']);

    }

    private onTimer(): void {
       // this.dispatchEvent(Events.twoCodeCleanCompelete);
    }

    /**是否在人民币战场地图*/
    isInRmbZcMap(): boolean {
        // return G.DataMgr.sceneData.curSceneID == MapId.RMB_ZHAN_CHANG;
        //todo    isInRmbZcMap(): boolean
        return false;
    }

    /**是否开启RMB战场*/
    static get isOpenRmbZc(): boolean {
        return G.DataMgr.funcLimitData.isFuncMatchPlatform(KeyWord.OTHER_FUNCTION_RMBZC);
    }

    /**是否开启红荒战场*/
    static get isOpenHHZc(): boolean {
        return G.DataMgr.funcLimitData.isFuncMatchPlatform(KeyWord.OTHER_FUNCTION_HH_BATTLE);
    }
}