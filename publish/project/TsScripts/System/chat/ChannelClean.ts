/**
* 聊天净化系统。
* @author teppei
* 
*/
export class ChannelClean {

    private static _nameReg: RegExp = /^&|#\/\\/;

    private static _yyReg: RegExp = /(?:[yｙУ丫メシＹヅ歪外][\.．。,，、▇■\s]*){2,}/i;

    private static _yyReg2: RegExp = /(?:(?:夕卜)[\.．。,，、▇■\s]*){2,}/i;

    private static _yyReg4: RegExp = /(?:(?:タド)[\.．。,，、▇■\s]*){2,}/i;

    private static _yyReg5: RegExp = /(?:(?:タト)[\.．。,，、▇■\s]*){2,}/i;

    private static _yyReg3: RegExp = /(?:[wｗ][\.．。,，、▇■\s]*[aａ][\.．。,，、▇■\s]*[iｉ][\.．。,，、▇■\s]*){2,}/i;

    private static _qqReg: RegExp = /(?:[Qq扣Ｑｑ][\.．。,，、▇■\s]*){1,}/i;

    private static _qunReg: RegExp = /群[^英汇|英会]+/i;

    private static _qunReg2: RegExp = /群$/i;

    private static _pindaoReg: RegExp = /[频蘋平萍苹]+/;

    /**YY号为4316。*/
    private static _codeReg: RegExp = /[4４四肆泗④]{1}[\.．。,，、▇■\s]*[3３三叁弎叄③]{1}[\.．。,，、▇■\s]*[1１一壹伊①]{1}[\.．。,，、▇■\s]*[6６六陆⑥]{1}/;

    private static _fuliReg: RegExp = /[福幅副]+[\.．。,，、▇■\s]*[利力莉]/;

    private static _yuanbaoReg: RegExp = /[元圆园]+[\.．。,，、▇■\s]*宝/;

    private static _yuanbaoReg2: RegExp = /[yｙУ丫メシＹヅ][\.．。,，、▇■\s]*[uｕ][\.．。,，、▇■\s]*[aａ][\.．。,，、▇■\s]*[nｎ][\.．。,，、▇■\s]*/i;

    private static _yuanbaoReg3: RegExp = /[bｂ][\.．。,，、▇■\s]*[aａ][\.．。,，、▇■\s]*[oｏ○☉⊙◎][\.．。,，、▇■\s]*/i;

    private static _jinReg: RegExp = /金/;

    private static _vipReg: RegExp = /[VvＶｖ][\.．。,，、▇■\s]*[IiＩｉ][\.．。,，、▇■\s]*[PpＰｐ][\.．。,，、▇■\s]*/i;

    private static _shouchongReg: RegExp = /[首艏手守垨狩]+[\.．。,，、▇■\s]*[充冲沖统統铳茺]/;

    private static _shenzhuangReg: RegExp = /[神申伸绅砷珅呻]+[\.．。,，、▇■\s]*[装庄莊壮妆状裝砖传宠]/;

    private static _libaoReg: RegExp = /[礼利丽里理力李莉梨]+[\.．。,，、▇■\s]*[包苞胞物屋]/;

    private static _sanxianReg: RegExp = /[散]+[\.．。,，、▇■\s]*[仙]/;

    private static _songReg: RegExp = /[赠增曾蹭噌嶒送宋领给]+/;

    /**
     * 判断是否广告消息。
     * @param msg
     * @return 
     * 
     */
    static isAdMsg(msg: string): boolean {
        let result: boolean;
        if (ChannelClean._codeReg.test(msg)) {
            result = true;
        }
        else if (ChannelClean._yyReg.test(msg) || ChannelClean._yyReg2.test(msg) || ChannelClean._yyReg3.test(msg) || ChannelClean._yyReg4.test(msg) || ChannelClean._yyReg5.test(msg) || ChannelClean._qqReg.test(msg) || ChannelClean._qunReg.test(msg) || ChannelClean._qunReg2.test(msg)) {
            if (ChannelClean._pindaoReg.test(msg) ||
                ChannelClean._fuliReg.test(msg) ||
                ChannelClean._yuanbaoReg.test(msg) || ChannelClean._yuanbaoReg2.test(msg) || ChannelClean._yuanbaoReg3.test(msg) ||
                ChannelClean._jinReg.test(msg) || ChannelClean._vipReg.test(msg) ||
                ChannelClean._shouchongReg.test(msg) || ChannelClean._libaoReg.test(msg) ||
                ChannelClean._shenzhuangReg.test(msg) || ChannelClean._sanxianReg.test(msg) ||
                ChannelClean._songReg.test(msg)) {
                result = true;
            }
        }

        return result;
    }

    /**
     * 判断是否非法名字。
     * @param name
     * @return 
     * 
     */
    static isInvalidName(name: string): boolean {
        let result: boolean;
        if (ChannelClean._nameReg.test(name) || ChannelClean._yyReg.test(name) || ChannelClean._yyReg2.test(name) || ChannelClean._yyReg3.test(name) ||
            ChannelClean._fuliReg.test(name) ||
            ChannelClean._yuanbaoReg.test(name) || ChannelClean._yuanbaoReg2.test(name) ||
            ChannelClean._shouchongReg.test(name) || ChannelClean._libaoReg.test(name) ||
            ChannelClean._shenzhuangReg.test(name) ||
            ((ChannelClean._jinReg.test(name) || ChannelClean._vipReg.test(name)) && ChannelClean._songReg.test(name))) {
            result = true;
        }

        return result;
    }

    /**
     * 是否非法的角色名字 
     * @param name
     * @return 
     * 
     */
    static isInvalidRoleName(name: string): boolean {
        let result: boolean;
        if (ChannelClean._nameReg.test(name) || ChannelClean._yyReg.test(name) || ChannelClean._yyReg2.test(name) ||
            ChannelClean._fuliReg.test(name) ||
            ChannelClean._yuanbaoReg.test(name) || ChannelClean._yuanbaoReg2.test(name) ||
            ChannelClean._shouchongReg.test(name) || ChannelClean._libaoReg.test(name)) {
            result = true;
        }

        return result;
    }
}
