//
//  AARoleInfo.h
//  AA
//
//  Created by zhangwen on 2017/8/17.
//
//

#import <Foundation/Foundation.h>

@interface AASDKRoleInfo : NSObject

/**
 角色名称
 */
@property (nonatomic, copy) NSString *roleName;

/**
 角色等级
 */
@property (nonatomic, copy) NSString *roleLevel;

/**
 角色所在服务器id
 */
@property (nonatomic, copy) NSString *roleServerid;

/**
 生成角色信息

 @param roleName 角色名称
 @param roleLevel 角色等级
 @param roleServerid 角色所在服务器id
 @return 角色信息实例
 */
+ (instancetype)initWithRoleName:(NSString *)roleName roleLevel:(NSString *)roleLevel roleServerid:(NSString *)roleServerid;

@end
