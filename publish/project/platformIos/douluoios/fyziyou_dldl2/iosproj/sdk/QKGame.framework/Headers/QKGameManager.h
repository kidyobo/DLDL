//  
//  QKGameManager.h
//
//

#define SDKVERSIONSTR @"2.1.1"

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "TopMenuButtonConfig.h"
#import "QKGame_NOTIS.h"
#import "QKGameChongzhiParameter.h"
#import "QKGameRoleInfo.h"

/**
 *	@interface	QKGameManager
 *  接入类对象
 */
@interface QKGameManager : NSObject {

}

#pragma mark - init
//初始化 设置产品
+ (QKGame_RESULT_CODE)initWithProductCode:(NSString *)productCode;

//设置平台方向
+ (QKGame_RESULT_CODE)setPlatformOrientation:(UIInterfaceOrientationMask)orientation;


#pragma mark - 用户服务
// 进入用户登录页面。
+ (QKGame_RESULT_CODE)gotoLoginView;

//@method	logout 退出登录。
+ (QKGame_RESULT_CODE)logout;

//购买接口
+ (QKGame_RESULT_CODE)chongzhiWithParameter:(QKGameChongzhiParameter *)param;

// 进入个人中心页面。
+ (QKGame_RESULT_CODE)gotoUserCenter;
// 进入礼包页面。
+ (QKGame_RESULT_CODE)gotoLibaoPage;
// 显示，重新显示浮动图标
+ (void)showTopMenuAtPosition:(TopMenuButtonPosition)position;
// 隐藏浮动图标
+ (void)dismissTopMenu;

/**
    @method	userID
    @rerurn 返回用户id。如未登录，返回空。
 */
+ (NSString *)userID;
// 获取用户登录账号。如未登录，返回空。
+ (NSString *)getUserAccount;
//设置区服角色信息
+ (void)setGameRoleInfoWithInfo:(QKGameRoleInfo *)roleInfo;
// 用户是否是游客,请先判断用户是否有登录
+ (BOOL)isUserGuest;
// 用户校验码，用于到服务器端验证用户真实性。
+ (NSString *)getUserToken;
// 获取产品code
+ (NSString *)getProductCode;
// 获取项目的渠道ID
+ (NSString *)getChannelID;

//应用OpenUrl回调 带第三方登录必接
+ (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary *)options;
+ (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)source annotation:(id)annotation;

@end





