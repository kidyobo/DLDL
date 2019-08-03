//
//  AACommon.h
//  AA
//
//  Created by zhangwen on 2017/8/18.
//
//

#ifndef AACommon_h
#define AACommon_h

#import "AASDKOrderInfo.h"
#import "AASDKRoleInfo.h"

/**
 内购支付异常原因

 - AAInAppPurchaseFailNotInit: SDK未初始化
 - AAInAppPurchaseFailNotLogin: SDK未登录
 - AAInAppPurchaseFailCanNotMakePayment: 该机器未支持内购
 - AAInAppPurchaseFailCheckProductIdTimeOut: 检查内购商品标识超时
 - AAInAppPurchaseFailInvalidProductId: 无效的商品标识
 - AAInAppPurchaseFailInvalidPlatformOrder: 无效的订单，订单信息异常
 - AAInAppPurchaseFailNotExistPlatformOrder: 订单不存在
 - AAInAppPurchaseFailInvalidParameter: 所传参数无效，orderId或productCode为空
 - AAInAppPurchaseFailPayFail: 内购支付失败
 - AAInAppPurchaseFailCheckReceiptFail: 验证苹果支付收据失败
 - AAInAppPurchaseFailNetworkError: 网络异常
 - AAInAppPurchaseFailServerError: 服务器内部错误
 */
typedef NS_ENUM(NSInteger, AAInAppPurchaseFailReason) {
    AAInAppPurchaseFailNotInit = 1,
    AAInAppPurchaseFailNotLogin,
    AAInAppPurchaseFailCanNotMakePayment,
    AAInAppPurchaseFailCheckProductIdTimeOut,
    AAInAppPurchaseFailInvalidProductId,
    AAInAppPurchaseFailInvalidPlatformOrder,
    AAInAppPurchaseFailNotExistPlatformOrder,
    AAInAppPurchaseFailInvalidParameter,
    AAInAppPurchaseFailPayFail,
    AAInAppPurchaseFailCheckReceiptFail,
    AAInAppPurchaseFailNetworkError,
    AAInAppPurchaseFailServerError,
};



#endif /* AACommon_h */
