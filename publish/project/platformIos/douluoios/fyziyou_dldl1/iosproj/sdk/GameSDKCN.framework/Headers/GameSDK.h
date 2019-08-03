//
//  GameSDK.h
//  GameSDK
//
//  Created by 王 亭 on 16/4/14.
//  Copyright © 2016年 iqiyigame. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "GameSDKDelegate.h"
#import "GameSDKLogin.h"

@interface GameSDK : NSObject
{
    id<GameSDKLogin> gameLoginProxy;
}

+(id) sharedInstance;

-(void) initGameSDK:(NSString *) gameId;
-(void) initQQLogin:(NSString *) appId unionAppId:(NSString *)unionAPPID userData:(NSString *)userData;
-(void) finishGameSDK;

-(void) userLogin:(UIViewController *) viewController delegate:(id<GameLoginDelegate>) loginDelegate;

-(void) userPayment:(UIViewController *) viewController serverId:(NSString *) serverId roleId:(NSString *) roleId productPrice:(int) money productId:(NSString *) productid developerInfo:(NSString *) developerinfo delegate:(id<GamePurchaseDelegate>) purchaseDelegate;
-(void) createRole:(UIViewController *)viewController serverId:(NSString *) serverId;
-(void) enterGame:(UIViewController *)viewController serverId:(NSString *) serverId;

-(void) userCenter:(UIViewController *) viewController ;
-(void) customService:(UIViewController *) viewController ;
-(NSDictionary *) getUserVipInfo;
- (void)getUserInfoAsync:(id<GetUserInfoDelegate>)delegate;
-(void)clearData;

/*!
* 恢复所有商品
*/
-(void) restoreAllProducts :(UIViewController *) viewController delegate:(id<GameRestoreDelegate>) restoreDelegate;

@end
