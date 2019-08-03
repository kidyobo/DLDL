//
//  FWDemoViewController.m
//  FWPopupView
//
//  Created by xfg on 2018/3/27.
//  Copyright © 2018年 xfg. All rights reserved.
//

#import "FWDemoViewController.h"

@interface FWDemoViewController ()

@property (nonatomic, strong) NSArray   *titleArray;

@end

@implementation FWDemoViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.navigationItem.title = @"FWPopupView";
    
    self.titleArray = @[@"Alert - 单个按钮", @"Alert - 两个按钮", @"Alert - 多个按钮", @"Alert - 带输入框", @"Alert - 带自定义视图", @"Sheet - 少量Item", @"Sheet - 大量Item", @"Custom - 自定义弹窗"];
    
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"cellId"];
    self.tableView.estimatedRowHeight = 44.0;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.titleArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cellId"];
    cell.textLabel.text = self.titleArray[indexPath.row];
    cell.textLabel.numberOfLines = 0;
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    switch (indexPath.row) {
        case 0:
        {
        }
            break;
        case 1:
        {
        }
            break;
        case 2:
        {
        }
            break;
        case 3:
        {
        }
            break;
        case 4:
        {
        }
            break;
        case 5:
        {
        }
            break;
        case 6:
        {

        }
            break;
        case 7:
        {
        }
            break;
            
        default:
            break;
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
