//
//  GameSDKDelegate.h
//  GameSDK
//
//  Created by 向平 on 2017/6/27.
//  Copyright © 2017年 iqiyigame. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol GameLoginDelegate
@required
-(void) loginSuccess:(NSDictionary *) loginUser;
-(void) loginFail:(NSString *) msg;
@end

@protocol GamePurchaseDelegate
@required
-(void) purchaseSuccess:(NSDictionary *) purchase;
-(void) purchaseFail:(NSString *) msg;
@end

@protocol GameRestoreDelegate
@required
-(void) restoredSuccess:(NSDictionary *) restoredProducts;
-(void) restoredFail:(NSString *) msg;
@end

@protocol GetUserInfoDelegate
@required
- (void)getUserInfoDidSuccess:(NSDictionary *)userInfoDic;
- (void)getUserInfoDidFail:(NSString *)msg;
@end
