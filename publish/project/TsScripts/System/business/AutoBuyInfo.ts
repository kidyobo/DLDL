/**
* 自动购买信息。
* @author teppei
* 
*/
export class AutoBuyInfo {
    /**是否足以支付。*/
    isAffordable: boolean;

    /**绑定价格。*/
    bindPrice: number = 0;

    /**绑定数量。*/
    bindCnt: number = 0;

    /**绑定总价。*/
    bindCost: number = 0;

    /**非绑定价格。*/
    nonbindPrice: number = 0;

    /**非绑定数量。*/
    nonbindCnt: number = 0;

    /**非绑定总价。*/
    nonbindCost: number = 0;
}
