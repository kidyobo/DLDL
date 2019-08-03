//
//  QKGameRoleInfo.h

//
//

#import <Foundation/Foundation.h>

@interface QKGameRoleInfo : NSObject

@property (copy,nonatomic) NSString *server_name;       //区服
@property (copy,nonatomic) NSString *vip_level;         //vip等级
@property (copy,nonatomic) NSString *game_role_name;    //角色名称
@property (copy,nonatomic) NSString *game_role_id;      //角色id
@property (copy,nonatomic) NSString *game_role_level;   //角色等级

- (void)setValuesFromRoleInfo:(QKGameRoleInfo *)info;
@end
