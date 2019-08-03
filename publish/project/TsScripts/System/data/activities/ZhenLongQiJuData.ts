import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'

/**
 * 西洋棋
 */
export class ZhenLongQiJuData {

    static readonly MaxTakePartTimes = 1;
    /**最长等待2分钟*/
    static readonly CountDownSeconds = 120;

    /**匹配倒计时*/
    countDownTime = 0;

    panelResp: Protocol.CSZLQJRoleInfo;
    groupId = 0;
}