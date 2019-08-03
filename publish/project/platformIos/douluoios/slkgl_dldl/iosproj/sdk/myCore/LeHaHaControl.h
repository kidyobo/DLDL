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
-(void)login;
-(void)pay:(NSDictionary*)dict;
-(void)logout;
-(NSString*)getValue:(NSString*)type;
+(LeHaHaControl*)sharedInterce;
-(void)report:(NSDictionary*)dict;
@end
