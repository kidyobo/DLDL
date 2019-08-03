//
//  IAPManager.m
//  IAPDemo
//
//  Created by Charles.Yao on 2016/10/31.
//  Copyright © 2016年 com.pico. All rights reserved.
//
#import "IAPManager.h"
#import "Function.h"
@interface IAPManager ()<SKPaymentTransactionObserver, SKProductsRequestDelegate>
@end
static BOOL goodsRequestFinished; //判断一次请求是否完成
static NSString *_currentProId; //此次交易的产品id
static NSString *_extenion;  //交易的透传参数,交易完成发给服务器用于发货
static IAPManager*go;

@implementation IAPManager
+(IAPManager*)sharedIntenace{
    if(go==NULL){
        go=[[IAPManager alloc]init];
    }
    return go;
}

- (void)startManager { //开启监听
        goodsRequestFinished = YES;
        /***
         内购支付两个阶段：
         1.app直接向苹果服务器请求商品，支付阶段；
         2.苹果服务器返回凭证，app向公司服务器发送验证，公司再向苹果服务器验证阶段；
         */
        /**
         阶段一正在进中,app退出。
         在程序启动时，设置监听，监听是否有未完成订单，有的话恢复订单。
         */
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        /**
         阶段二正在进行中,app退出。
         在程序启动时，检测本地是否有receipt文件，有的话，去二次验证。
         */
}

#pragma mark -- 结束上次未完成的交易
-(void)removeAllUncompleteTransactionsBeforeNewPurchase{
    NSArray* transactions = [SKPaymentQueue defaultQueue].transactions;
    if (transactions.count >= 1) {
        for (NSInteger count = transactions.count; count > 0; count--) {
            SKPaymentTransaction* transaction = [transactions objectAtIndex:count-1];
            if (transaction.transactionState == SKPaymentTransactionStatePurchased||transaction.transactionState == SKPaymentTransactionStateRestored) {
                [[SKPaymentQueue defaultQueue]finishTransaction:transaction];
            }
        }
    }else{
        NSLog(@"没有历史未消耗订单");
    }
}

- (void)stopManager{
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
    });
}

#pragma mark 查询
-(void)requestProductWithId:(NSString *)productId :(NSString*)extention {
    if (goodsRequestFinished) {
	goodsRequestFinished = NO;
	//先检查是否有漏的没销毁的订单
	[self removeAllUncompleteTransactionsBeforeNewPurchase];
        if ([SKPaymentQueue canMakePayments]) { //用户允许app内购
            if (productId.length) {
	            _currentProId=productId;
                _extenion=extention;
                NSLog(@"%@商品正在请求中",productId);
                goodsRequestFinished = NO; //正在请求
                NSArray *product = [[NSArray alloc] initWithObjects:productId, nil];
                NSSet *set = [NSSet setWithArray:product];
                SKProductsRequest *productRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
                productRequest.delegate = self;
                [productRequest start];
            } else {
                NSLog(@"商品为空");
                [[Function sharedInterce]payFailed_douluo:@"商品为空"];
                goodsRequestFinished = YES; //完成请求
            }
        } else { //没有权限
            [[Function sharedInterce]payFailed_douluo:@"没有权限"];
            goodsRequestFinished = YES; //完成请求
        }
    } else {
        NSLog(@"上次请求还未完成，请稍等");
         [[Function sharedInterce]payFailed_douluo:@"上次请求还未完成，请稍等"];
    }
}

#pragma mark SKProductsRequestDelegate 查询成功后的回调
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response {
    NSLog(@"--------------收到产品反馈消息---------------------");
    NSArray *product = response.products;
    if([product count] == 0){
        goodsRequestFinished = YES; //失败，请求完成
        NSLog(@"--------------没有商品------------------");
        [[Function sharedInterce]payFailed_douluo:@"反馈没有商品"];
        return;
    }
    NSLog(@"productID:%@", response.invalidProductIdentifiers);
    NSLog(@"产品付费数量:%lu",(unsigned long)[product count]);
    SKProduct *p = nil;
    for (SKProduct *pro in product) {
        NSLog(@"%@", [pro description]);
        NSLog(@"%@", [pro localizedTitle]);
        NSLog(@"%@", [pro localizedDescription]);
        NSLog(@"%@", [pro price]);
        NSLog(@"%@", [pro productIdentifier]);
        if([pro.productIdentifier isEqualToString:_currentProId]){
            p = pro;
        }
    }
    SKMutablePayment *payment=[SKMutablePayment paymentWithProduct:p];
    payment.applicationUsername=_extenion;
    //发起购买请求
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}


#pragma mark SKProductsRequestDelegate 查询失败后的回调
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error {
    [[Function sharedInterce]payFailed_douluo:@"查询失败"];
    goodsRequestFinished = YES; //失败，请求完成
}

#pragma Mark 购买操作后的回调
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(nonnull NSArray<SKPaymentTransaction *> *)transactions {
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchasing://正在交易
                break;
            case SKPaymentTransactionStatePurchased://交易完成
                [self getReceipt:transaction]; //获取交易成功后的购买凭证
                break;
            case SKPaymentTransactionStateFailed://交易失败
                [[Function sharedInterce]payFailed_douluo:@"交易失败"];
                [self failedTransaction:transaction];
                break;
            case SKPaymentTransactionStateRestored://已经购买过该商品
                [self restoreTransaction:transaction];
                break;
            default:
                break;
        }
    }
}

- (void)failedTransaction:(SKPaymentTransaction *)transaction {
    NSLog(@"transaction.error.code = %ld", transaction.error.code);
    if(transaction.error.code != SKErrorPaymentCancelled) {

    } else {
        
    }
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
    goodsRequestFinished = YES; //失败，请求完成
}

- (void)restoreTransaction:(SKPaymentTransaction *)transaction {
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
    goodsRequestFinished = YES; //恢复购买，请求完成
}

#pragma mark 获取交易成功后的购买凭证

- (void)getReceipt: (SKPaymentTransaction *)transaction{
    NSURL *receiptUrl = [[NSBundle mainBundle] appStoreReceiptURL];
    NSData *receiptData = [NSData dataWithContentsOfURL:receiptUrl];
    NSString *receipt = [receiptData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
    NSString *payExt= transaction.payment.applicationUsername;
    NSString *orderId=transaction.transactionIdentifier;
    

    

    [[Function sharedInterce] paySucess_douluo:receipt :payExt :orderId];
    
    
    [self completeTransaction:transaction];
}

- (void)completeTransaction:(SKPaymentTransaction *)transaction {
    goodsRequestFinished = YES; //成功，请求完成
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

@end
