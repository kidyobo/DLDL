//
//  QKGame_NOTIS.h

//


#ifndef QKGame_NOTIS_h
#define QKGame_NOTIS_h

//通知事件
#define QKGame_RESULT_INIT             @"QKGame_RESULT_INIT"             //初始化事件
#define QKGame_RESULT_LOGIN            @"QKGame_RESULT_LOGIN"            //用户登录界面事件
#define QKGame_RESULT_LOGOUT           @"QKGame_RESULT_LOGOUT"           //用户注销登录事件
#define QKGame_RESULT_CHONGZHI         @"QKGame_RESULT_CHONGZHI"         //充值结果事件
#define QKGame_ACTION_TOPMENU_CLOSE    @"QKGame_ACTION_TOPMENU_CLOSE"    //关闭工具条事件
#define QKGame_ACTION_TOPMENU_CUSTOMER_SERVICE   @"QKGame_ACTION_TOPMENU_CUSTOMER_SERVICE" //点击客服

//事件通知userInfo附带参数key
#define SDKNotiDicKeyUserId              @"SDKNotiDicKeyUserId"    //用户id,登录通知
#define SDKNotiDicKeyCode                @"SDKNotiDicKeyCode"      //事件错误码
#define SDKNotiDicKeyMsg                 @"SDKNotiDicKeyMsg"       //事件描述
#define SDKNotiDicKeyCustomerServiceId   @"SDKNotiDicKeyCustomerServiceId" //客服类型

#define SDKNotiDicKeyReceipt             @"receipt"              //内购交易凭据
#define SDKNotiDicKeyProductId           @"productIdentifier"    //内购商品id
#define SDKNotiDicKeyTransactionId       @"transactionId"        //内购交易id

// ui方向参数
#define SDKUIInterfaceOrientationMaskPortrait   UIInterfaceOrientationMaskPortrait  //竖屏
#define SDKUIInterfaceOrientationMaskLandscape  UIInterfaceOrientationMaskLandscape //横屏

//事件错误码
typedef enum {
    
    QKGame_RESULT_ERROR_NONE                  = 0,        //事件成功
    QKGame_RESULT_INIT_FAIL                   = 10,       //初始化失败
    QKGame_RESULT_ORIENTATION_UNSUPPORT       = 19,       //不支持设置方向
    
    QKGame_RESULT_LOGIN_QUIT                  = 22,       //用户关闭登录界面
    QKGame_RESULT_LOGIN_LOGIN_USER_EXIST      = 23,       //已有登录用户
    
    QKGame_RESULT_ERROR_CHONGZHI_FAIL         = 30,       //充值失败
    QKGame_RESULT_ERROR_CHONGZHI_QUIT         = 32,       //充值取消
    QKGame_RESULT_ERROR_CHONGZHI_UNDEFINE     = 39,       //充值状态不明确


    QKGame_RESULT_INIT_UNDONE                 = 91,       //还未初始化成功
    QKGame_RESULT_LOGIN_UNDONE                = 92,       //用户还未登录
    QKGame_RESULT_NOT_REG_USER                = 93,       //当前用户为非正式用户
    QKGame_RESULT_NOT_REALNAME_USER           = 94,       //当前用户未实名认证
    QKGame_RESULT_PARAM_INVALID               = 99        //参数不正确
    
} QKGame_RESULT_CODE;


#endif
