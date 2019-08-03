//
//  GameSDKLogin.h
//  GameSDK
//
//  Created by 向平 on 2017/7/17.
//  Copyright © 2017年 iqiyigame. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol GameSDKLogin <NSObject>

/*!
 * 初始化要接受登录的消息
 */
- (void)addLoginNotification;

- (void)removeLoginNotification;

- (void)userLogin:(UIViewController *) viewController delegate:(id<GameLoginDelegate>) loginDelegate;

@end
