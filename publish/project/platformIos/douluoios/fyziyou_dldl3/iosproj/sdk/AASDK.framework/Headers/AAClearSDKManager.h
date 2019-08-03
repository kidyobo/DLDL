//
//  KingCheerSDKManager.h
//  AA
//
//  Created by zhangwen on 2017/6/7.
//
//

#import <Foundation/Foundation.h>

#import "AASDKCommon.h"

@protocol AASDKDelegate <NSObject>

- (void)SDKInitSuccess;

- (void)loginDidSuccessWithUserInfo:(NSDictionary *)userInfo;

- (void)logoutDidSuccess;

- (void)payIAPDidSuccess;

- (void)payIAPDidFailWithReason:(AAInAppPurchaseFailReason)reason;

@end

@interface AAClearSDKManager : NSObject

/**
 SDK初始化方法
 注意事项：请最好将该方法放在[window makeKeyAndVisible]后调用
 
 Unity调用时机：确保是在startUnity:方法调用后，即UnityController.mm文件中applicationDidBecomeActive:方法里调用的startUnity方法
 cocos2dx调用时机：AppController.mm文件中application:didFinishLaunchingWithOptions:方法里的[window makeKeyAndVisible]方法调用后
 */
+ (void)initSDK;

/**
 SDK登录方法
 */
+ (void)login;

/**
 SDK登出方法
 游戏内如有登出按钮，可调用此接口
 */
+ (void)logout;

/**
 SDK切换账号接口
 游戏内如有切换账号按钮，可调用此接口
 */
+ (void)switchAccount;

/**
 设置登录、支付回调

 @param delegate 回调接收对象
 */
+ (void)setResultDelegate:(id<AASDKDelegate>)delegate;

/**
 支付接口

 @param orderInfo 支付所需订单信息
 */
+ (void)buyProductWithOrderInfo:(AASDKOrderInfo *)orderInfo;

/**
 是否显示调试日志
 
 @param isDebug debug
 */
+ (void)setDebug:(BOOL)isDebug;

/**
 角色信息统计

 @param roleInfo 角色信息
 */
+ (void)dataStatisticsWithRoleInfo:(AASDKRoleInfo *)roleInfo;

/**
 当前游戏状态
 
 @return 游戏状态 1:审核 0:正式
 */
+ (NSString *)gameAuditState;

/**
 web游戏所需的地址，其余游戏可不关注
 
 @return web游戏url
 */
+ (NSString *)webGameUrlString;

@end
