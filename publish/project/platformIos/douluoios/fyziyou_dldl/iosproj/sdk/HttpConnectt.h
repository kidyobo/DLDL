//
//  HttpConnect.h
//  JsPaySDK
//
//  Created by 杰莘宏业 on 16/12/21.
//  Copyright © 2016年 杰莘宏业. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface HttpConnectt : NSObject


+(void)HttpWithURL:(NSString *)URLStr postStr:(NSString *)postStr completion:(void (^)(NSData * __nullable data, NSURLResponse * __nullable response, NSError * __nullable error))completionHandler;

@end
