
#import <Foundation/Foundation.h>

@interface OrderInfo : NSObject

@property (nonatomic, assign) int goodsPrice;
@property (nonatomic, copy) NSString *goodsName;//商品名称
@property (nonatomic, copy) NSString *goodsDesc;//商品描述
@property (nonatomic, copy) NSString *productId;//内购产品id
@property (nonatomic, copy) NSString *extendInfo;//此字段会透传到游戏服务器，可拼接
@property (nonatomic, copy) NSString *gameVersion;//游戏版本号


@end
