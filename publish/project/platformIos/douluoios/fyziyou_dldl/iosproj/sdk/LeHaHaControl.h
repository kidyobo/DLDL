//
//  LeHaHaControl.h
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//
#import <UIKit/UIKit.h>


@interface LeHaHaControl : UIViewController


-(void)initSDK;

-(void)payFailed:(NSString*)error;


-(void)pay: (NSDictionary*)dict;

-(void)logout;

-(void)getPayType: (NSDictionary*)dict;


-(void)paySucess:(NSString*)recepit :(NSString*)ext :(NSString*)orderid;



+(LeHaHaControl*)sharedInterce;


-(NSString*)getValue:(NSString*)type;


-(void)reportData:(NSDictionary*)dict;

@end
