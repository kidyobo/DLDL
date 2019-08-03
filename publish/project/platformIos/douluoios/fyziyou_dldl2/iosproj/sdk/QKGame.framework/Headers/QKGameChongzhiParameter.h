//
//  QKGameChongzhiParameter.h

//
//

#import <Foundation/Foundation.h>

@interface QKGameChongzhiParameter : NSObject
@property (copy,nonatomic) NSString *productId;     //productID
@property (copy,nonatomic) NSString *subject;       //商品名称 必填
@property (copy,nonatomic) NSString *desc;          //商品描述 可选
@property (assign,nonatomic) float price;           //商品单价 必填
@property (assign,nonatomic) unsigned int amount;   //购买数量 必填
@property (assign,nonatomic) float total_fee;       //商品总价 必填
@property (copy,nonatomic) NSString *product_order_no;  //游戏方订单号 string[64] 可选、必须唯一
@property (copy,nonatomic) NSString *callback_url;      //回调通知地址 string[200] 可选  客户端配置优先
@property (copy,nonatomic) NSString *extras_params;     //附带参数 string[500] 可选，可作透传
- (id)init;
//返回一个参数对象
+ (instancetype)parameterWithName:(NSString *)name price:(float)price amount:(unsigned int)num totalFee:(float)fee;
+ (instancetype)parameterWithName:(NSString *)name price:(float)price amount:(unsigned int)num totalFee:(float)fee productOrderNo:(NSString *)info;
+ (instancetype)parameterWithName:(NSString *)name price:(float)price amount:(unsigned int)num totalFee:(float)fee productOrderNo:(NSString *)info callBackUrl:(NSString *)url extrasParams:(NSString *)params;
- (void)setInfoWithParameter:(QKGameChongzhiParameter *)param;
@end
