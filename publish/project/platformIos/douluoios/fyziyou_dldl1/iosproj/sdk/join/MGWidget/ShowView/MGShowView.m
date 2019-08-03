//
//  MGShowView.m
//  MGWidget
//
//  Created by acmeway on 2018/3/29.
//  Copyright © 2018年 acmeway. All rights reserved.
//

#import "MGShowView.h"
#import "MGPatternView.h"
@interface MGShowView ()

@property (nonatomic, strong) NSMutableArray *btnArray;

@property (strong, nonatomic) CAShapeLayer *indicatorLayer;

@property (strong, nonatomic) CAReplicatorLayer *replicatorLayer;

@end

@implementation MGShowView


- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        
        [self.layer addSublayer:self.replicatorLayer];
        
        [self.replicatorLayer addSublayer:self.indicatorLayer];
        
        
//        CALayer *line         = [[CALayer alloc] init];
//
//        line.backgroundColor  = [[UIColor blackColor] colorWithAlphaComponent:0.5].CGColor;
//
//        line.frame            = CGRectMake((kScreenWidth - 0.5) * 0.5, 0, 0.5, kScreenHeight);
//
//        [self.layer addSublayer:line];
//
//        CALayer *line2        = [[CALayer alloc] init];
//
//        line2.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5].CGColor;
//
//        line2.frame           = CGRectMake(0, (self.height - 0.5) * 0.5, kScreenWidth, 0.5);
//
//        [self.layer addSublayer:line2];
        
    }
    return self;
}



- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.replicatorLayer.frame = self.bounds;
}

- (NSArray <UIButton *>*)subViews
{
    NSMutableArray *array = [[NSMutableArray alloc] init];
    
    NSInteger tag = 0;
    for (NSString *title in @[@"唐", @"宋", @"元", @"明", @"清"]) {
        
        UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
        
        [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        
        //[button setTitleColor:MGColor forState:UIControlStateHighlighted];
        
        [button setTitle:title forState:UIControlStateNormal];
        
        button.frame = CGRectMake(0, 0, 40, 40);
        
        //button.layer.cornerRadius = button.height / 2.0f;
        
        button.backgroundColor = [UIColor colorWithRed:0.f green:0.f blue:0.f alpha:0.5f];
        
        button.clipsToBounds = YES;
        
        button.tag = tag++;
        
        [array addObject:button];
    }
    return array.copy;
}

- (CAShapeLayer *)indicatorLayer
{
    if (!_indicatorLayer) {
        
        _indicatorLayer = [CAShapeLayer layer];
        
        _indicatorLayer.contentsScale = [[UIScreen mainScreen] scale];
    }
    return _indicatorLayer;
}

- (CAReplicatorLayer *)replicatorLayer
{
    if (!_replicatorLayer) {
        
        _replicatorLayer = [CAReplicatorLayer layer];
        
        _replicatorLayer.backgroundColor = [UIColor clearColor].CGColor;
        
        _replicatorLayer.shouldRasterize = YES;
        
        _replicatorLayer.rasterizationScale = [[UIScreen mainScreen] scale];
    }
    return _replicatorLayer;
}

- (NSMutableArray *)btnArray
{
    if (!_btnArray) {
        _btnArray = [[NSMutableArray alloc] init];
    }
    return _btnArray;
}

@end

