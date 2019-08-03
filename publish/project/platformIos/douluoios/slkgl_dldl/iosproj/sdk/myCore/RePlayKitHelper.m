//
//  LeHaHaControl.m
//  Unity-iPhone
//
//  Created by fe li x on 2017/9/20.
//
//
#import "RePlayKitHelper.h"
#import "info.h"
#import "SDKConnector.h"
#import "MBProgressHUD+Message.h"


static RePlayKitHelper*control;


@implementation RePlayKitHelper

+(RePlayKitHelper*)sharedInterce{
    if(control==NULL){
        control=[[RePlayKitHelper alloc]init];
    }
    return control;
}

//是否正在录制
-(BOOL)isRecording{
    return [RPScreenRecorder sharedRecorder].recording;
}

-(BOOL)systemVersionOK{
    if ([[UIDevice currentDevice].systemVersion floatValue]<9.0) {
        return NO;
    } else {
        return YES;
    }
}

//开始录制
-(void)startRecord{
    if ([RPScreenRecorder sharedRecorder].recording==YES) {
	    //[MBProgressHUD showMessage:@"正在录制中,轻稍后再试"];
        NSLog(@"CDPReplay:已经开始录制");
        [self stopRecordAndShowVideoPreviewController:true];
	    [self updateRecordFailedOrCancel];
        return;
    }
    if ([self systemVersionOK]) {
        if ([[RPScreenRecorder sharedRecorder] isAvailable]) {
            NSLog(@"CDPReplay:录制开始初始化");
            //[MBProgressHUD showMessage:@"录制开始初始化"];
            [[RPScreenRecorder sharedRecorder] startRecordingWithMicrophoneEnabled:YES handler:^(NSError *error){
                if (error) {
                    NSString*string1=@"开始录制error:";
                    NSString*string2=error.description;
                    
                    NSString*string3=[NSString stringWithFormat:@"%@%@",string1,string2];
                    [MBProgressHUD showMessage:string3];
                    NSLog(@"CDPReplay:开始录制error %@",error);
                    [self updateRecordFailedOrCancel];
                }
                else{

                    NSLog(@"CDPReplay:开始录制");
		            [self updateRecordSucess];
                   // [MBProgressHUD showMessage:@"成功开始录制"];
                }
            }];
        }
        else {
	  [MBProgressHUD showMessage:@"当前环境不支持ReplayKit录制"];
            NSLog(@"CDPReplay:环境不支持ReplayKit录制");
	   [self updateRecordFailedOrCancel];
        }
    }
    else{
	[MBProgressHUD showMessage:@"系统版本需要是iOS9.0及以上才支持ReplayKit录制"];
        NSLog(@"CDPReplay:系统版本需要是iOS9.0及以上才支持ReplayKit录制");
	[self updateRecordFailedOrCancel];
    }
}

-(void)updateRecordSucess{
   	NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_UpdateRecordState,Ts_msgtype,
                Value_ResultOk,Ts_result,
                nil];
       //[[SDKConnector sharedInterce] _CallBackToUnity:s_DictList];	
}

-(void)updateRecordFailedOrCancel{
   	NSDictionary*s_DictList=[NSDictionary dictionaryWithObjectsAndKeys:
                Value_UpdateRecordState,Ts_msgtype,
                Value_ResultFailed,Ts_result,
                nil];
      // [[SDKConnector sharedInterce] _CallBackToUnity:s_DictList];	
}

//结束录制
-(void)stopRecordAndShowVideoPreviewController:(BOOL)isShow{
    NSLog(@"CDPReplay:正在结束录制");
    [[RPScreenRecorder sharedRecorder] stopRecordingWithHandler:^(RPPreviewViewController *previewViewController, NSError *  error){
        if (error) {
            NSString*string1=@"结束录制error:";
            NSString*string2=error.description;
            NSString*string3=[NSString stringWithFormat:@"%@%@",string1,string2];
	    [MBProgressHUD showMessage:string3];
            NSLog(@"CDPReplay:结束录制error %@", error);
	    [self updateRecordFailedOrCancel];
        }
        else {
	   //[MBProgressHUD showMessage:@"录制完成"];
            NSLog(@"CDPReplay:录制完成");
	    [self updateRecordFailedOrCancel];	
            if (isShow) {
                [self showVideoPreviewController:previewViewController animation:YES];
            }
        }
    }];
}


#pragma mark - 显示/关闭视频预览页
//显示视频预览页面
-(void)showVideoPreviewController:(RPPreviewViewController *)previewController animation:(BOOL)animation {
    previewController.previewControllerDelegate=self;
    __weak UIViewController *rootVC=[self getRootVC];
    dispatch_async(dispatch_get_main_queue(), ^{
        CGRect rect = [UIScreen mainScreen].bounds;
        if (animation) {
            rect.origin.x+=rect.size.width;
            previewController.view.frame=rect;
            rect.origin.x-=rect.size.width;
            [UIView animateWithDuration:0.3 animations:^(){
                previewController.view.frame=rect;
            }];
        }
        else{
            previewController.view.frame=rect;
        }
        [rootVC.view addSubview:previewController.view];
        [rootVC addChildViewController:previewController];
    });
    
}


//关闭视频预览页面
-(void)hideVideoPreviewController:(RPPreviewViewController *)previewController animation:(BOOL)animation {
    previewController.previewControllerDelegate=nil;
    dispatch_async(dispatch_get_main_queue(), ^{
        CGRect rect = previewController.view.frame;
        
        if (animation) {
            rect.origin.x+=rect.size.width;
            [UIView animateWithDuration:0.3 animations:^(){
                previewController.view.frame=rect;
            }completion:^(BOOL finished){
                [previewController.view removeFromSuperview];
                [previewController removeFromParentViewController];
            }];
            
        }
        else{
            [previewController.view removeFromSuperview];
            [previewController removeFromParentViewController];
        }
    });
}

#pragma mark - 视频预览页回调
//关闭的回调
- (void)previewControllerDidFinish:(RPPreviewViewController *)previewController {
    [self hideVideoPreviewController:previewController animation:YES];
}

//选择了某些功能的回调（如分享和保存）
- (void)previewController:(RPPreviewViewController *)previewController didFinishWithActivityTypes:(NSSet <NSString *> *)activityTypes {    
    if ([activityTypes containsObject:@"com.apple.UIKit.activity.SaveToCameraRoll"]) {
	[MBProgressHUD showMessage:@"视频保存到相册成功"];  
        NSLog(@"CDPReplay:保存到相册成功");
    }
    else if ([activityTypes containsObject:@"com.apple.UIKit.activity.CopyToPasteboard"]) {
        NSLog(@"CDPReplay:复制成功");
    }
}


//获取rootVC
-(UIViewController *)getRootVC{
    return UnityGetGLViewController();
}


@end
