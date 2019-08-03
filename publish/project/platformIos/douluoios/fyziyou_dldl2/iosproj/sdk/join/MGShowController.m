//
//  MGShowController.m
//  MGWidget
//
//  Created by acmeway on 2018/3/29.
//  Copyright © 2018年 acmeway. All rights reserved.
//

#import "MGShowController.h"
#import "MGShowView.h"
#import "MGLoaderView.h"
#import "MGPatternView.h"
@interface MGShowController ()<CAAnimationDelegate>



@property (nonatomic, assign) NSInteger section;

@end

@implementation MGShowController



- (NSArray <UIButton *>*)countItems
{
    NSMutableArray *array = [[NSMutableArray alloc] init];
    
    NSInteger tag = 0;
    for (NSString *title in @[@"0️⃣", @"1️⃣", @"2️⃣", @"3️⃣", @"4️⃣", @"5️⃣", @"6️⃣", @"7️⃣"]) {

        UIButton *button          = [UIButton buttonWithType:UIButtonTypeSystem];

        [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];

        [button setTitle:title forState:UIControlStateNormal];

        button.frame              = CGRectMake(0, 0, 40, 40);


        button.backgroundColor    = [UIColor colorWithRed:0.f green:0.f blue:0.f alpha:0.5f];

        button.clipsToBounds      = YES;

        button.tag                = tag++;

        [array addObject:button];
    }
    return array.copy;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
