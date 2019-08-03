//
//  CommonSDK.h
//  LHHSDKDemo2.0
//
//  Created by fe li x on 2017/9/20.
//  Copyright © 2017年 cykj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ConnectorGo : NSObject
-(void)_CallSDKFunc_DouLuo :(NSString*)type :(NSString*)jsonpara;
-(void)_CallBackToUnity_DouLuo:(NSDictionary *)dict;
-(void)replyPushNotificationAuthorization:(UIApplication *)application;
+(ConnectorGo*)sharedInterce;
@end



