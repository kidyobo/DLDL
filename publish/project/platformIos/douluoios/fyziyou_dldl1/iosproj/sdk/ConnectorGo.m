//
//  SDKConnector.m
//  LHHSDKDemo2.0
//
//  Created by fe li x on 2017/9/20.
//  Copyright © 2017年 cykj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ConnectorGo.h"
#import "Function.h"
//#import "RePlayKitHelper.h"
//推送相关
#import <UserNotifications/UserNotifications.h>
@interface ConnectorGo()<UNUserNotificationCenterDelegate>
@end


//*********************************给unity暴露的c接口**************************************************

static NSString *s_calltype;
static NSString *s_calljsonpara;

#if defined(__cplusplus)
extern "C"{
#endif
    void CallSDKFunc(const char*type,const char*jsonpara){
        NSLog(@"++++++++++++++++++++unity call c sucess+++++++++++++++++++");
        s_calltype = [NSString stringWithUTF8String: type];
        s_calljsonpara = [NSString stringWithUTF8String: jsonpara];
        [[ConnectorGo sharedInterce] _CallSDKFunc_DouLuo:s_calltype:s_calljsonpara];
    };
    void ActiveInitializeIosUI(){
        UIWindow* window = [[UIApplication sharedApplication].delegate window];
        if (window != nil && window.rootViewController != nil)
		{
			[window makeKeyAndVisible];
		}
	}
    const char* GetValueBySdk(const char*type){
        NSString *newType=[NSString stringWithUTF8String:type];
        NSString *a=[[LeHaHaControl sharedInterce] getValue:newType];
        return strdup([a UTF8String]);
    }
    //c传unity的方法
    extern void UnitySendMessage(const char *name, const char *method, const char *data);
    extern NSString* _CreateNSString (const char* string);
    //字符串转化的工具函数
    NSString* _CreateNSString (const char* string)
    {
        if (string)
            return [NSString stringWithUTF8String: string];
        else
            return [NSString stringWithUTF8String: ""];
    }
    
    char* _MakeStringCopy( const char* string)
    {
        if (NULL == string) {
            return NULL;
        }
        char* res = (char*)malloc(strlen(string)+1);
        strcpy(res, string);
        return res;
    }
#if defined(__cplusplus)
}
#endif


//*********************************变量***************************************************************
//初始化

//bugly
static NSString *s_buglyId=@"";
//支付
/////////////////////////推送相关///////////////////////////////
static NSString *type1=@"0";
static NSString *hour1=@"";
static NSString *minute1=@"";
static NSString *content1=@"";

static NSString *type2=@"0";
static NSString *hour2=@"";
static NSString *minute2=@"";
static NSString *content2=@"";

static NSString *type3=@"0";
static NSString *hour3=@"";
static NSString *minute3=@"";
static NSString *content3=@"";

static NSString *type4=@"0";
static NSString *hour4=@"";
static NSString *minute4=@"";
static NSString *content4=@"";

static NSString *type5=@"0";
static NSString *hour5=@"";
static NSString *minute5=@"";
static NSString *content5=@"";

static NSString *type6=@"0";
static NSString *hour6=@"";
static NSString *minute6=@"";
static NSString *content6=@"";

static ConnectorGo*connect;
//*********************************通用SDKConnector类**************************************************
@implementation ConnectorGo

+(ConnectorGo*)sharedInterce{
    if(connect==NULL){
        connect=[[ConnectorGo alloc]init];
    }
    return connect;
}

-(void)_CallSDKFunc_DouLuo :(NSString*)type :(NSString*)jsonpara
{
    NSLog(@"[SDK] Recevie cmd = %@   jsonpara = %@\n",type,jsonpara);
    /////////////////解析unity发过来的json/////////////////
    NSData *jsonData=[jsonpara dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *jsonDict=[NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
    if(err){
        NSLog(@"json解析失败 :%@",err);
    }
    /////////////////下面就是调用乐哈哈sdk的方法/////////////////
    if ([type isEqualToString:@"initSdk"])
    {//初始化
        NSLog(@"+++调用SDK初始化借口啦+++++++++++++++++");
        [[Function sharedInterce] initSDK_douluo];
    }
    else if ([type isEqualToString:@"doLogin"])
    {//登录
        NSLog(@"+++调用denglu啦+++++++++++++++++");
        //[[LeHaHaControl sharedInterce] login];
    }
    else if ([type isEqualToString:@"doPay"])
    {//充值
        NSLog(@"+++调用充值接口+++++++++++++++++");
        [[Function sharedInterce]pay_douluo:jsonDict];
    }
    else if ([type isEqualToString:@"reportData"])
    {//上报
        [[Function sharedInterce]reportData_douluo:jsonDict];
    }
    else if ([type isEqualToString:@"doLogout"])
    {//上报
        [[Function sharedInterce]logout_douluo];
    }
   else if ([type isEqualToString:@"startRecord"])
    {//startrecord
        //[[RePlayKitHelper sharedInterce]startRecord];
    }
    else if ([type isEqualToString:@"stopRecord"])
    {//stoprecord
        //[[RePlayKitHelper sharedInterce]stopRecordAndShowVideoPreviewController:true];
    }
    else if ([type isEqualToString:@"getPayType"])
    {//stoprecord
        //[[LeHaHaControl sharedInterce]getPayType:jsonDict];
    }
    else if ([type isEqualToString:@"creatLocalNotify"]){
        //ios消息推送
        NSLog(@"+++注册ios消息推送啊+++++++++++++++++");
        type1=[jsonDict objectForKey:@"type1"];
        hour1=[jsonDict objectForKey:@"hour1"];
        minute1=[jsonDict objectForKey:@"minute1"];
        content1=[jsonDict objectForKey:@"content1"];
        
        type2=[jsonDict objectForKey:@"type2"];
        hour2=[jsonDict objectForKey:@"hour2"];
        minute2=[jsonDict objectForKey:@"minute2"];
        content2=[jsonDict objectForKey:@"content2"];
        
        type3=[jsonDict objectForKey:@"type3"];
        hour3=[jsonDict objectForKey:@"hour3"];
        minute3=[jsonDict objectForKey:@"minute3"];
        content3=[jsonDict objectForKey:@"content3"];
        
        type4=[jsonDict objectForKey:@"type4"];
        hour4=[jsonDict objectForKey:@"hour4"];
        minute4=[jsonDict objectForKey:@"minute4"];
        content4=[jsonDict objectForKey:@"content4"];
        
        type5=[jsonDict objectForKey:@"type5"];
        hour5=[jsonDict objectForKey:@"hour5"];
        minute5=[jsonDict objectForKey:@"minute5"];
        content5=[jsonDict objectForKey:@"content5"];
        
        
        type6=[jsonDict objectForKey:@"type6"];
        hour6=[jsonDict objectForKey:@"hour6"];
        minute6=[jsonDict objectForKey:@"minute6"];
        content6=[jsonDict objectForKey:@"content6"];
        
        [self createLocalizedUserNotification:type1 :hour1 :minute1 :content1 :type2 :hour2 :minute2 :content2 :type3 :hour3 :minute3 :content3 :type4 :hour4 :minute4 :content4 :type5 :hour5 :minute5 :content5 :type6 :hour6 :minute6 :content6];
    }
    
}


//Ios向unity发送消息
-(void)_CallBackToUnity_DouLuo:(NSDictionary *)dict
{
    NSString *param_A = @"";
    if ( nil != dict ) {
        for (NSString *key in dict)
        {
            if ([param_A length] == 0)
            {
                param_A = [param_A stringByAppendingFormat:@"%@=%@", key, [dict valueForKey:key]];
            }
            else
            {
                param_A = [param_A stringByAppendingFormat:@"&%@=%@", key, [dict valueForKey:key]];
            }
        }
    }
    UnitySendMessage("Root", "OcCallUnityBack", [param_A UTF8String]);
}

/////////////////////////////////ios消息推送/////////////////////////////////////////////


// 申请通知权限
- (void)replyPushNotificationAuthorization:(UIApplication *)application{
    //iOS 10 later
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    //必须写代理，不然无法监听通知的接收与点击事件
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (!error && granted) {
            NSLog(@"注册成功");
        }else{
            NSLog(@"注册失败");
        }
    }];
    [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
        NSLog(@"========%@",settings);
    }];
    //注册远端消息通知获取device token
    [application registerForRemoteNotifications];
}


#pragma mark - iOS10 收到通知（本地和远端） UNUserNotificationCenterDelegate

//App处于前台接收通知时
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
    //收到推送的请求
    UNNotificationRequest *request = notification.request;
    //收到推送的内容
    UNNotificationContent *content = request.content;
    //收到用户的基本信息
    NSDictionary *userInfo = content.userInfo;
    //收到推送消息的角标
    NSNumber *badge = content.badge;
    //收到推送消息body
    NSString *body = content.body;
    //推送消息的声音
    UNNotificationSound *sound = content.sound;
    // 推送消息的副标题
    NSString *subtitle = content.subtitle;
    // 推送消息的标题
    NSString *title = content.title;
    if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        //此处省略一万行需求代码。。。。。。
        NSLog(@"iOS10 收到远程通知:%@",userInfo);
        
    }else {
        // 判断为本地通知
        //此处省略一万行需求代码。。。。。。
        NSLog(@"iOS10 收到本地通知:{\\\\nbody:%@，\\\\ntitle:%@,\\\\nsubtitle:%@,\\\\nbadge：%@，\\\\nsound：%@，\\\\nuserInfo：%@\\\\n}",body,title,subtitle,badge,sound,userInfo);
    }
    // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以设置
    completionHandler(UNNotificationPresentationOptionBadge|
                      UNNotificationPresentationOptionSound|
                      UNNotificationPresentationOptionAlert);
    
}


//App通知的点击事件
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler{
    //收到推送的请求
    UNNotificationRequest *request = response.notification.request;
    //收到推送的内容
    UNNotificationContent *content = request.content;
    //收到用户的基本信息
    NSDictionary *userInfo = content.userInfo;
    //收到推送消息的角标
    NSNumber *badge = content.badge;
    //收到推送消息body
    NSString *body = content.body;
    //推送消息的声音
    UNNotificationSound *sound = content.sound;
    // 推送消息的副标题
    NSString *subtitle = content.subtitle;
    // 推送消息的标题
    NSString *title = content.title;
    if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        NSLog(@"iOS10 收到远程通知:%@",userInfo);
        //此处省略一万行需求代码。。。。。。
    }else {
        // 判断为本地通知
        //此处省略一万行需求代码。。。。。。
        NSLog(@"iOS10 收到本地通知:{\\\\nbody:%@，\\\\ntitle:%@,\\\\nsubtitle:%@,\\\\nbadge：%@，\\\\nsound：%@，\\\\nuserInfo：%@\\\\n}",body,title,subtitle,badge,sound,userInfo);
    }
    //2016-09-27 14:42:16.353978 UserNotificationsDemo[1765:800117] Warning: UNUserNotificationCenter delegate received call to -userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler: but the completion handler was never called.
    completionHandler(); // 系统要求执行这个方法
}



-(void)createLocalizedUserNotification:(NSString*)type1 :(NSString*)hour1 :(NSString*)minute1 :(NSString*)content1 :(NSString*)type2 :(NSString*)hour2 :(NSString*)minute2 :(NSString*)content2 :(NSString*)type3 :(NSString*)hour3 :(NSString*)minute3 :(NSString*)content3 :(NSString*)type4 :(NSString*)hour4 :(NSString*)minute4 :(NSString*)content4 :(NSString*)type5 :(NSString*)hour5 :(NSString*)minute5 :(NSString*)content5 :(NSString*)type6 :(NSString*)hour6 :(NSString*)minute6 :(NSString*)content6 {
    
    if([type1 intValue]!=0){
        [self resgiterNotifyToAppCenter:type1 :hour1 :minute1 :content1 :@"fygame.A.time" ];
    }
    if([type2 intValue]!=0){
        [self resgiterNotifyToAppCenter:type2 :hour2 :minute2 :content2 :@"fygame.B.time" ];
    }
    if([type3 intValue]!=0){
        [self resgiterNotifyToAppCenter:type3 :hour3 :minute3 :content3 :@"fygame.C.time" ];
    }
    
    if([type4 intValue]!=0){
        [self resgiterNotifyToAppCenter:type4 :hour4 :minute4 :content4 :@"fygame.D.time" ];
    }
    if([type5 intValue]!=0){
        [self resgiterNotifyToAppCenter:type5 :hour5 :minute5 :content5 :@"fygame.E.time" ];
        
    }
    if([type6 intValue]!=0){
        [self resgiterNotifyToAppCenter:type6 :hour6 :minute6 :content6 :@"fygame.F.time" ];
        
    }
}

-(void)resgiterNotifyToAppCenter:(NSString*)type :(NSString*)hour :(NSString*)minute :(NSString*)content :(NSString*)requestident{
    
    NSDateComponents *components = [[NSDateComponents alloc] init];
    components.hour = [hour intValue];
    components.minute = [minute intValue];
    
    
    // components 日期
    UNCalendarNotificationTrigger *calendarTrigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:components repeats:YES];
    UNMutableNotificationContent *contenta = [[UNMutableNotificationContent alloc] init];
    contenta.body = content;
    contenta.sound = [UNNotificationSound defaultSound];
    contenta.userInfo = @{@"key1":@"value1",@"key2":@"value2"};
    contenta.badge=@1;
    
    // 创建通知标示
    NSString *requestIdentifiera = requestident;
    UNUserNotificationCenter* centera = [UNUserNotificationCenter currentNotificationCenter];
    // 将通知请求 add 到 UNUserNotificationCenter
    if([type intValue]==100){
        //删除特定已经递送的通知
        [centera removeDeliveredNotificationsWithIdentifiers:@[requestIdentifiera]];
        NSLog(@"删除特定已经递送的通知 %@", requestIdentifiera);
    }
    else if([type intValue]==101){
        //删除特定等待递送的通知
        [centera removePendingNotificationRequestsWithIdentifiers:@[requestIdentifiera]];
        NSLog(@"删除特定等待递送的通知 %@", requestIdentifiera);
    }
    else if([type intValue]==102){
        //删除所有已经递送的通知
        [centera removeAllDeliveredNotifications];
        NSLog(@"删除所有已经递送的通知");
    }
    else if([type intValue]==103){
        //删除所有等待递送的通知
        [centera removeAllPendingNotificationRequests];
        NSLog(@"删除所有等待递送的通知");
    }
    else{
        // 创建通知请求 UNNotificationRequest 将触发条件和通知内容添加到请求中
        UNNotificationRequest *requesta = [UNNotificationRequest requestWithIdentifier:requestIdentifiera content:contenta trigger:calendarTrigger];
        [centera addNotificationRequest:requesta withCompletionHandler:^(NSError * _Nullable error) {
            if (!error) {
                NSLog(@"推送已添加成功 %@", requestIdentifiera);
                //你自己的需求例如下面：
                //此处省略一万行需求。。。。
            }
        }];
    }
    
}



@end



