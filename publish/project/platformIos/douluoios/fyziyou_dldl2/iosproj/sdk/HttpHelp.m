//
//  HttpConnect.m
//  JsPaySDK
//
//  Created by 杰莘宏业 on 16/12/21.
//  Copyright © 2016年 杰莘宏业. All rights reserved.
//

#import "HttpHelp.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import <WebKit/WebKit.h>
@implementation HttpHelp


+(void)HttpWithURL:(NSString *)URLStr postStr:(NSString *)postStr completion:(void (^)(NSData * __nullable data, NSURLResponse * __nullable response, NSError * __nullable error))completion{
    if ([URLStr rangeOfString:@"jieshenkj"].length) {
       
        NSMutableString * Url = [[NSMutableString alloc] initWithString:URLStr];
        [Url replaceCharactersInRange:[Url rangeOfString:@"http"] withString:@"http"];
        
        NSURL *url = [[NSURL alloc] initWithString:Url];
        //NSLog(@"%@",url);
        NSMutableURLRequest * request = [[NSMutableURLRequest alloc]initWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10];
        if (postStr) {
            [request setHTTPMethod:@"POST"];
        }
        NSData *data = [postStr dataUsingEncoding:NSUTF8StringEncoding];
        
        [request setHTTPBody:data];
        
        if ([[UIDevice currentDevice].systemVersion floatValue]>8.0) {
            NSURLSession * session = [NSURLSession sharedSession];
            NSURLSessionTask * task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                completion(data,response,error);
            }];
            [task resume];
        }else{
            NSOperationQueue * queue = [[NSOperationQueue alloc] init];
            [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse * _Nullable response, NSData * _Nullable data, NSError * _Nullable connectionError) {
                completion(data,response,connectionError);
            }];
        }
        
        
    }else{
        
        NSURL * url = [[NSURL alloc] initWithString:[NSString stringWithFormat:@"%@",URLStr]];
        
        NSMutableURLRequest * request = [[NSMutableURLRequest alloc]initWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10];
        if (postStr) {
            [request setHTTPMethod:@"POST"];
        }
        NSData *data = [postStr dataUsingEncoding:NSUTF8StringEncoding];
        
        [request setHTTPBody:data];
        
        if ([[UIDevice currentDevice].systemVersion floatValue]>8.0) {
            NSURLSession * session = [NSURLSession sharedSession];
            NSURLSessionTask * task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                completion(data,response,error);
            }];
            [task resume];
        }else{
            NSOperationQueue * queue = [[NSOperationQueue alloc] init];
            [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse * _Nullable response, NSData * _Nullable data, NSError * _Nullable connectionError) {
                completion(data,response,connectionError);
            }];
        }


    }
    

}
@end
