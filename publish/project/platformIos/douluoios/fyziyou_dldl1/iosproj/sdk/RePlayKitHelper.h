//
//  LeHaHaControl.h
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//
#import <UIKit/UIKit.h>
#import <ReplayKit/ReplayKit.h>

@interface RePlayKitHelper : UIViewController
+(RePlayKitHelper*)sharedInterce;
-(void)startRecord;
-(void)stopRecordAndShowVideoPreviewController:(BOOL)isShow;
@property (nonatomic,assign,readonly) BOOL isRecording;
@end
