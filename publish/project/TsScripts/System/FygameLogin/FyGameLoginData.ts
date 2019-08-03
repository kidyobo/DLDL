

/**此类专门管理fygame登录数据处理*/
export class FyGameLoginData {

    private readonly illegalChars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@";
    private readonly randomChars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    /**获取随机账号,8位数*/
    getRandomUserName(): string {
        return this.getRandomStr(8);
    }

    /**获取随机密码,6位数*/
    getRandomUserPassWord(): string {
        return this.getRandomStr(6);
    }


    /**检查字符是否合法*/
    checkIsIllegal(str: string): string {
        let noInvaliedStr: string = '';
        for (let i = 0; i < str.length; i++) {
            let a = str[i];
            let isIllegal: boolean = false;
            for (let index = 0; index < this.illegalChars.length; index++) {
                let b = this.illegalChars[index];
                if (a == b) {
                    isIllegal = true;
                    break;
                }
            }
            if (!isIllegal) {
                noInvaliedStr += a;
            }
        }
        return noInvaliedStr;
    }


    /**获取随机账号和密码*/
    private getRandomStr(times: number): string {
        let count = this.randomChars.length;
        let getStr: string = '';
        for (let i = 0; i < times; i++) {
            let index = Math.floor(Math.random() * count);
            getStr += this.randomChars[index];
        }
        return getStr;
    }

    /**保存账号*/
    saveUserAccountAndPassWord(userName: string, userPassWord: string) {
        //先把账号存到一个数组"aaa|bbb|ccc这样"
        //再用(key:账号,value:密码)的方式具体存储
        let allUserName = UnityEngine.PlayerPrefs.GetString("fyAllUser", '');
        if (allUserName != '') {
            let users = allUserName.split("|");
            let hasSave: boolean = false;
            for (let i = 0; i < users.length; i++) {
                if (userName == users[i]) {
                    hasSave = true;
                    break;
                }
            }
            if (hasSave) {
                uts.log("已经存储了该账号了:= " + userName);
                return;
            }
            else {
                let content = allUserName + "|" + userName;
                UnityEngine.PlayerPrefs.SetString("fyAllUser", content);
            }
        } else {
            UnityEngine.PlayerPrefs.SetString("fyAllUser", userName);
        }
        UnityEngine.PlayerPrefs.SetString(userName, userPassWord);
    }

    /**获取所有登录过的用户账号*/
    getAllUserNames(): string[] {
        let allUserName = UnityEngine.PlayerPrefs.GetString("fyAllUser", '');
        if (allUserName != '') {
            return allUserName.split("|");
        }
        return null;
    }
    /**获取最近一次登录过的用户账号*/
    getLastTimeLoginUser(): string {
        let allUsers = this.getAllUserNames();
        if (allUsers == null) {
            return null;
        }
        return allUsers[allUsers.length - 1];
    }
    /**通过用户账号取得密码*/
    getPassWordByUserName(userName: string) {
        let passWord = UnityEngine.PlayerPrefs.GetString(userName, '');
        if (passWord == "") {
            return null;
        }
        return passWord;
    }

}