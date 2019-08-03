//
//  CommonSDK.h
//  LHHSDKDemo2.0
//
//  Created by fe li x on 2017/9/20.
//  Copyright © 2017年 cykj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SDKConnector : NSObject
-(void)_CallSDKFunc :(NSString*)type :(NSString*)jsonpara;
-(void)_CallBackToUnity:(NSDictionary *)dict;
-(void)replyPushNotificationAuthorization:(UIApplication *)application;
+(SDKConnector*)sharedInterce;
@end



