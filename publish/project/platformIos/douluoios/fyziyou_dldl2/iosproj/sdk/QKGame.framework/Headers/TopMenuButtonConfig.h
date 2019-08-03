//
//  TopMenuButtonConfig.h
//  SDatabase
//

//

#ifndef SDatabase_TopMenuButtonConfig_h
#define SDatabase_TopMenuButtonConfig_h

typedef NS_OPTIONS(NSUInteger, TopMenuButtonPosition){
    TopMenuButtonPositionUpside = (1 << 0),  //上方
    TopMenuButtonPositionDown = (1 << 1),     //下方
    TopMenuButtonPositionMiddle = (1 << 2),   //中部
    TopMenuButtonPositionLeft = (1 << 3),     //左方
    TopMenuButtonPositionRight = (1 << 4),    //右方
    TopMenuButtonPositionBefore = (1 << 5), //之前的位置
};


#endif
