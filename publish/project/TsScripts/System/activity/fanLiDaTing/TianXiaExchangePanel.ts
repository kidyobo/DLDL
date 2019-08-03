﻿import { KeyWord } from 'System/constants/KeyWord'
import { FanLiExchangeBasePanel } from 'System/activity/fanLiDaTing/FanLiExchangeBasePanel'

export class TianXiaExchangePanel extends FanLiExchangeBasePanel {
    constructor() {
        // 下面要定个页签关键字，暂时不用的功能就不定了，用的时候要改下 by teppei@2017/11/10
        super(KeyWord.TX_EXCHANGE, KeyWord.TX_EXCHANGE);
    }
}
