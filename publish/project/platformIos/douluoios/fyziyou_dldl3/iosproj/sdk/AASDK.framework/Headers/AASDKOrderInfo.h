//
//  AAOrderInfo.h
//  AA
//
//  Created by zhangwen on 2017/8/17.
//
//

#import <Foundation/Foundation.h>

@interface AASDKOrderInfo : NSObject

/**
 游戏生成的订单，必须
 */
@property (nonatomic, copy) NSString *orderId;

/**
 商品标识，对应于后台配置的内购商品id，必须
 */
@property (nonatomic, copy) NSString *productCode;

/**
 商品金额，必须
 */
@property (nonatomic, copy) NSString *amount;

/**
 商品名称，例：60元宝，必须
 */
@property (nonatomic, copy) NSString *productName;

/**
 用户游戏角色所在的服务器id
 */
@property (nonatomic, copy) NSString *serverId;

/**
 用户游戏角色名称
 */
@property (nonatomic, copy) NSString *roleName;

/**
 用户游戏角色等级
 */
@property (nonatomic, copy) NSString *roleLevel;

/**
 订单额外信息，最终将回传给游戏服务器
 */
@property (nonatomic, copy) NSString *extraInfo;

/**
 生成订单信息

 @param gameOrderId 游戏订单id
 @param productCode 商品id
 @param amount 商品金额
 @param productName 商品名称
 @param serverId 游戏角色所在服务器
 @param roleName 游戏角色名称
 @param roleLevel 游戏角色等级
 @param extraInfo 订单额外信息
 @return 订单信息
 */
+ (instancetype)initWithOrderId:(NSString *)gameOrderId productCode:(NSString *)productCode amount:(NSString *)amount productName:(NSString *)productName serverId:(NSString*)serverId roleName:(NSString *)roleName roleLevel:(NSString *)roleLevel extraInfo:(NSString *)extraInfo;

@end
