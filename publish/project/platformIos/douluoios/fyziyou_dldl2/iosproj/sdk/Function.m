//
//  LeHaHaControl.m
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//

#import <Foundation/Foundation.h>
#import "Function.h"
#import "ConnectorGo.h"
#import "HttpHelp.h"
#import "IAPManager.h"
#import "MBProgressHUD+Message.h"


////////////////////变量///////////////////////////
//初始化
//登录换取服务器token
static NSString *s_token=@"";
static NSString *s_openId=@"";

static BOOL *isPaying=false;


static Boolean*isAdPayRemote=false;

///////////////////////TS变量定义//////////////////////////////////
//MsgType
static const NSString *value_ResultOk=@"0";
static const NSString *value_ResultFailed=@"-1";
static const NSString *Value_Init_Sdk=@"1";
static const NSString *Value_Login=@"3";
static const NSString *Value_Logout=@"4";
static const NSString *Value_Pay=@"5";
static const NSString *Value_RequestServer=@"15";
static const NSString *Value_GetPayType=@"26";
//其他变量
static const NSString *Ts_msgtype=@"msgtype";
static const NSString *Ts_openid=@"openid";
static const NSString *Ts_username=@"username";
static const NSString *Ts_token=@"token";
static const NSString *Ts_servers=@"servers";
static const NSString *Ts_result=@"result";
//登录
static const NSString *Ts_loginType=@"login_type";
static const NSString *Ts_publicKeyUrl=@"publicKeyUrl";
static const NSString *Ts_appBundleId=@"appBundleId";
static const NSString *Ts_salt=@"salt";
static const NSString *Ts_timeStamp=@"timestamp";
static const NSString *Ts_btimeStamp=@"btimestamp";
//支付
static const NSString *Ts_payServerId=@"payServerId";
static const NSString *Ts_payUin=@"payUin";
static const NSString *Ts_payCoin=@"payCoin";
static const NSString *Ts_payProductId=@"payProductId";
static const NSString *Ts_payOrderId=@"payOrderId";
static const NSString *Ts_payRecepit=@"payReceipt";
static const NSString *Ts_payUserName=@"payUserName";
////////////////////变量///////////////////////////////////////////

static Function*control;


@implementation Function


+(Function*)sharedInterce{
    if(control==NULL){
        control=[[Function alloc]init];
    }
    return control;
}

-(NSString*)getValue_douluo:(NSString*)type{
    if([type isEqualToString:@"getPayType"]){
        return @"yes";
    }
    return @"";
}

-(void)reportData_douluo:(NSDictionary*)dict{
    NSString*type=[dict objectForKey:@"dataType"];
    if([type isEqualToString:@"1"]){
        //进入游戏添加监听
        if(!isAdPayRemote){
            [[IAPManager sharedIntenace]startManager];
            isAdPayRemote=true;
        }
    }
    
}

-(void)payFailed_douluo:(NSString*)error{
    [MBProgressHUD showMessage:error];  
    NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_Pay,Ts_msgtype,
                value_ResultFailed,Ts_result,
                nil];
    [[ConnectorGo sharedInterce] _CallBackToUnity_DouLuo:s_DictList];
}


-(void)initSDK_douluo {
    //初始化sdk
 
}

-(void)logout_douluo{
    //[[JSLogin sharedLogin] logout];
}

//支付(不是苹果)
-(void)pay_douluo: (NSDictionary*)dict{
      NSString*payServerid=(NSString*)[dict objectForKey:@"serverId"];
     NSString*payUserName=(NSString*)[dict objectForKey:@"userName"];
     NSString*payCoin=(NSString*)[dict objectForKey:@"yuanbao"];
     NSString*payProductId=(NSString*)[dict objectForKey:@"productId"];
     NSString*payUin=(NSString*)[dict objectForKey:@"roleId"];

      

    NSString*string1= @"com.fygame.dldl.dlwh.";
    NSString*productId=[[NSString alloc]initWithFormat:@"%@%@", string1,payProductId];
    NSLog(@"productId4455888888= %@",productId);
	
    	
	
    NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                payServerid,@"serverId",
                payUserName,@"userName",
                payCoin,@"yuanbao",
                productId,@"productId",
                payUin,@"roleId",
                nil];
    NSError *error;
    NSData*jsonData=[NSJSONSerialization dataWithJSONObject:s_DictList options:NSJSONWritingPrettyPrinted error:&error];
    if(error!=NULL||!jsonData){
        NSLog(@"error%@",error.description);
    }else{
       NSString*extention=[[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
        [[IAPManager sharedIntenace] requestProductWithId:productId :extention];
    }
}


//支付成功
-(void)paySucess_douluo:(NSString*)recepit :(NSString*)ext :(NSString*)orderid{
    if(ext==nil){
        NSLog(@"透传参数竟然没有,本次发货可能要失败");
    }
    NSData *jsonData=[ext dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *jsonDict=[NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
    if(err){
        NSLog(@"json解析失败 :%@",err);
    }else{
       NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                    Value_Pay,Ts_msgtype,
                    value_ResultOk,Ts_result,
                    [jsonDict objectForKey:@"serverId"],Ts_payServerId,
                    [jsonDict objectForKey:@"userName"],Ts_payUserName,
                    [jsonDict objectForKey:@"yuanbao"],Ts_payCoin,
                    [jsonDict objectForKey:@"productId"],Ts_payProductId,
                    orderid,Ts_payOrderId,
                    [jsonDict objectForKey:@"roleId"],Ts_payUin,
                    recepit,Ts_payRecepit,
                    nil];
        NSLog(@"fa huo dict = %@",s_DictList);
          [[ConnectorGo sharedInterce] _CallBackToUnity_DouLuo:s_DictList];
    }
}



/////////////////////////////////////////// 回调函数 ///////////////////////////////////////////////////
#pragma mark - JSLoginSDKDelegate 登录结果
-(void)geggggtloginResult:(NSDictionary *)result{
    NSLog(@"++++%@",result);
    NSLog(@"++++%@",result[@"message"]);
    /*
     如果使用服务器下单方式，在登录成功后，请将用户唯一标识上传服务器，作为下单参数 “userIdentity”的值。
     此处模拟服务器下单，所以在本地登录成功后直接赋值。
     */
    if ([result[@"status"] intValue] == 0) {
        s_openId = result[@"userid"];
    }
    NSLog(@" sdk 登录回调 ");
    NSLog(@"登录成功了哦");
    NSDictionary *dict=[NSDictionary dictionaryWithObjectsAndKeys:s_openId,@"userOpenId", nil];
    NSLog(@"dict = %@",dict);
     [[ConnectorGo sharedInterce] _CallBackToUnity_DouLuo:dict];
}

-(void)bindPhonelkkddNumResult:(NSDictionary *)result{
    NSLog(@"%@",result);
    NSLog(@"%@",result[@"message"]);
}

#pragma mark - gmhyDelegate 支付代理
-(void)returffffnPra:(NSString *)title{
    //获取用户点击的支付方式名称
    NSLog(@"小标:%@",title);
}

-(void)rtWithffffNSDictionary:(NSDictionary *)dic{
    //获取支付结果
    NSLog(@"+++%@",dic);
    NSLog(@"%@",dic[@"message"]);
    //[[NSNotificationCenter defaultCenter] removeObserver:[NSL sharedInstance]];  //移除通知，不能省略
}

-(void)rtApplffgggeResu:(NSDictionary *)dic{
    /*
     在苹果内购支付完成后，贝付宝服务器向苹果服务器验证当前订单的支付结果，并异步通知商户服务器。但贝付宝无法对苹果订单唯一性
     做判断，为防止可能出现的刷单行为，在status=1000时，贝付宝服务器会将苹果服务器返回的验证结果返回商户服务器，商户服务器需以此对
     该笔订单做校验，判断该笔订单是否正常，然后再发货。
     */
    //获取苹果支付结果
    NSLog(@"苹果内购支付结果：%@",dic);
    NSLog(@"%@",dic[@"message"]);
}


@end
