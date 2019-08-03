//
//  LeHaHaControl.h
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//
#import <UIKit/UIKit.h>


@interface Function : UIViewController


-(void)initSDK_douluo;

-(void)payFailed_douluo:(NSString*)error;


-(void)pay_douluo: (NSDictionary*)dict;

-(void)logout_douluo;

-(void)getPayType_douluo: (NSDictionary*)dict;


-(void)paySucess_douluo:(NSString*)recepit :(NSString*)ext :(NSString*)orderid;



+(Function*)sharedInterce;


-(NSString*)getValue_douluo:(NSString*)type;


-(void)reportData_douluo:(NSDictionary*)dict;

@end
