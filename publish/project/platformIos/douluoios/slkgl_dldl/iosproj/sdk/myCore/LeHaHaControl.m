//
//  LeHaHaControl.m
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//

#import <Foundation/Foundation.h>
#import "LeHaHaControl.h"
#import "SDKConnector.h"
#import <ojhbdsTrack/ojhbdsTrack.h>
#import "info.h"

@interface LeHaHaControl ()<ojhbdsTrackDelegate>
@end


////////////////////变量///////////////////////////
//初始化
static NSString *s_initStage=@"no";
static NSString *s_isLogined=@"no";
static LeHaHaControl*control;


@implementation LeHaHaControl

+(LeHaHaControl*)sharedInterce{
    if(control==NULL){
        control=[[LeHaHaControl alloc]init];
    }
    return control;
}

-(NSString*)getValue:(NSString*)type{
    if([type isEqualToString:@"isInited"]){
        return s_initStage;
    }
    else if([type isEqualToString:@"isLogined"]){
        return s_isLogined;
    }
    return @"";
}

-(void)initSDK {
    //初始化sdk
    NSDictionary *initDic = [[NSDictionary alloc] initWithDictionary:[NSDictionary dictionaryWithObjectsAndKeys:
                                                                      pid, @"pid",//平台id
                                                                      cid, @"cid", //渠道id
                                                                      aid, @"aid", //广告id
                                                                      game, @"game", //游戏唯一识别
                                                                      gameversion, @"game_version", //游戏版本号
                                                                      areaid, @"areaId", //地区唯一识别
                                                                      adtype, @"adtype", //广告类型
                                                                      appkey, @"appKey", //appkey
                                                                      pkid,@"pkid",//pkid
                                                                      sdktype,@"sdkType",
                                                                      @"",@"buglyAppid",//BuglyAppid,我方没提供用空字符串@""
                                                                      nil]];
    [ojhbds ojhbdsInitTrackWithDic:initDic interfaceOrientationsMaskPortrait:NO];
    ojhbds.delegate = self;
    s_initStage=@"yes";
    [self login];
}

-(void)login{
   [ojhbds ojhbdsLoginShowLoginView];
}


-(void)logout{
    [ojhbds ojhbdsLoginOutOrChangeAccount];
}

//支付
-(void)pay:(NSDictionary*)dict{
    NSString*productName=(NSString*)[dict objectForKey:@"productName"];
    NSString*orderId=(NSString*)[dict objectForKey:@"orderId"];
    NSString*price=(NSString*)[dict objectForKey:@"price"];
    NSString*roleLevel=(NSString*)[dict objectForKey:@"roleLevel"];
    NSString*vipLevel=(NSString*)[dict objectForKey:@"vip"];
    NSString*roleId=(NSString*)[dict objectForKey:@"roleId"];
    NSString*roleName=(NSString*)[dict objectForKey:@"roleName"];
    NSString*string1=@"com.mgame.slkgl.";
    NSString*string2=@"diamond";
    NSString*productId=[[NSString alloc]initWithFormat:@"%@%@%@", string1,price,string2];
    NSLog(@"productId4455888888= %@",productId);
    [ojhbds ojhbdsGoumaiChangpinWithProductId:productId
                                  productName:productName
                                    cpOrderId:orderId
                                        Price:price
                                    roleLevel:roleLevel
                                     vipLevel:vipLevel
                                       roleId:roleId
                                     roleName:roleName];
}

-(void)report:(NSDictionary*)dict{
    NSString*type=(NSString*)[dict objectForKey:@"dataType"];
    if([type isEqualToString:@"13"]){
        //选服
        NSString*serverId=(NSString*)[dict objectForKey:@"serverId"];
        NSString*roleLevel=(NSString*)[dict objectForKey:@"roleLevel"];
        NSLog(@"0001serverId= %@  roleLevel= %@",serverId,roleLevel);
        [ojhbds ojhbdsChoseServerWithServerId:serverId roleLevel:roleLevel];
    }
    else if([type isEqualToString:@"6"]){
        //创角
        NSString*serverId=(NSString*)[dict objectForKey:@"serverId"];
        NSString*roleId=(NSString*)[dict objectForKey:@"roleId"];
        NSLog(@"0002serverId= %@  roleId= %@",serverId,roleId);
        [ojhbds ojhbdsCreateRoleWithServerId:serverId roleId:roleId];
    }
    else if([type isEqualToString:@"1"]){
        //进入游戏
        NSString*roleId=(NSString*)[dict objectForKey:@"roleId"];
         NSLog(@"0003roleId= %@",roleId);
        [ojhbds ojhbdsEnterGameViewWithRoleId:roleId];
    }
    else if([type isEqualToString:@"3"]){
        //升级
        NSString*roleId=(NSString*)[dict objectForKey:@"roleId"];
        NSString*roleLevel=(NSString*)[dict objectForKey:@"roleLevel"];
        NSLog(@"0004roleId= %@  roleLevel= %@",roleId,roleLevel);
        [ojhbds ojhbdsLevelUpWithRoleId:roleId roleLevel:roleLevel];
    }
}

//////////////// 回调函数 ////////////////////
-(void)loginResult:(NSString *)account andUid:(NSString *)uid andToken:(NSString *)token{
    s_isLogined=@"yes";
    NSLog(@"--%@--\n--%@--\n%@--",account,uid,token);
    NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_Login,Ts_msgtype,
                Value_ResultOk,Ts_result,
                uid,Ts_userid,
                token,Ts_token,
                nil];
    NSLog(@"dict = %@",s_DictList);
    [[SDKConnector sharedInterce] _CallBackToUnity:s_DictList];
}

-(void)payResult:(NSString *)resultDic withState:(int)state{
    NSLog(@"desc = %@   state = %d",resultDic,state);
    NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_Pay,Ts_msgtype,
                Value_ResultOk,Ts_result,
                nil];
    [[SDKConnector sharedInterce] _CallBackToUnity:s_DictList];
}

-(void)loginOutOrChangeAccount{
    s_isLogined=@"no";
    NSLog(@"loginOutOrChangeAccount");
   NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_Logout,Ts_msgtype,
                Value_ResultOk,Ts_result,
                nil];
    [[SDKConnector sharedInterce] _CallBackToUnity:s_DictList];
}


@end
