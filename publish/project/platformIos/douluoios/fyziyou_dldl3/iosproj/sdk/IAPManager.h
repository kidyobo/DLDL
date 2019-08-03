//
//  IAPManager.h
//  IAPDemo
//
//  Created by Charles.Yao on 2016/10/31.
//  Copyright © 2016年 com.pico. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <StoreKit/StoreKit.h>


@interface IAPManager : NSObject

/**
 启动工具
 */
- (void)startManager;

/**
 结束工具
 */
- (void)stopManager;

/**
 请求商品列表
 */
-(void)requestProductWithId:(NSString *)productId :(NSString*)extention;

+(IAPManager*)sharedIntenace;

@end
