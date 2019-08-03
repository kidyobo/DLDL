//
//  ojhbdsTrack.h
//  ojhbdsTrack
//
//  Created by zero on 2018/8/30.
//  Copyright © 2018年 ojhbds. All rights reserved.
//

#import <Foundation/Foundation.h>

#define ojhbds [ojhbdsTrack sharedTrack]

@protocol ojhbdsTrackDelegate <NSObject>

- (void)loginResult:(NSString *)account andUid:(NSString *)uid andToken:(NSString *)token;
- (void)payResult:(NSString *)resultDic withState:(int)state;
- (void)loginOutOrChangeAccount;

@end

@interface ojhbdsTrack : NSObject

@property(nonatomic, unsafe_unretained) id<ojhbdsTrackDelegate>delegate;

@property (nonatomic,strong) NSDictionary * ojhbdsDict;
@property (nonatomic,assign) BOOL ojhbdsMaskPortrait;
@property (nonatomic,strong) NSDictionary * ojhbdsAlertStrDict;
@property (nonatomic,strong) NSDictionary * ojhbdsViewColorDict;

@property(nonatomic,retain) NSString* ojhbdsProductId;
@property(nonatomic,retain) NSString* ojhbdsPurOrder;
@property(nonatomic,retain) NSString* ojhbdsCpOrder;
@property(nonatomic,retain) NSString* ojhbdsPrice;

+ (ojhbdsTrack *)sharedTrack;

- (void)ojhbdsInitTrackWithDic:(NSDictionary *)dic interfaceOrientationsMaskPortrait:(BOOL)maskPortrait;
- (void)ojhbdsLoginShowLoginView;
- (void)ojhbdsGoumaiChangpinWithProductId:(NSString *)ProducetID productName:(NSString *)productName cpOrderId:(NSString *)cpOrderId Price:(NSString *)price roleLevel:(NSString *)level vipLevel:(NSString *)vip roleId:(NSString *)roleId roleName:(NSString *)roleName;
- (void)ojhbdsLoginOutOrChangeAccount;

- (void)ojhbdsChoseServerWithServerId:(NSString *)serverId roleLevel:(NSString *)rolelevel;
- (void)ojhbdsCreateRoleWithServerId:(NSString *)serverId roleId:(NSString *)roleId;
- (void)ojhbdsLevelUpWithRoleId:(NSString *)roleId roleLevel:(NSString *)roleLevel;
- (void)ojhbdsEnterGameViewWithRoleId:(NSString *)roleId;

- (void)ojhbdsLoginMonitor:(NSString *)time andStr:(NSDictionary *)str andResult:(NSString *)result andRequestTme:(NSString *)requestTime;
- (void)ojhbdsLoginSuccess:(NSString *)account andUid:(NSString *)uid andToken:(NSString *)token;
- (void)ojhbdsIsPayResult:(NSString *)result withState:(int)state;

@end
