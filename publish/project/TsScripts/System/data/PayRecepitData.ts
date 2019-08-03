import { Msg, MsgType } from "System/channel/ChannelDef";
import { Global as G } from "System/global";


/**此类专门管理支付订单数据*/
export class PayRecepitData {
    private recepits: string[] = [];
    private readonly sendIntervalTime: number = 10;
    private isSending: boolean = false;
    private lastSendTime: number = 0;
    private sendTimer: Game.Timer;

    /**保存订单信息到本地*/
    saveRecepit(recepit: string) {
        let arrays = this.getParas();
        if (arrays.indexOf(recepit) >= 0) {
            uts.log("该张订单已经存在本地,不需要再保存");
            return;
        }
        let lastRecepit = UnityEngine.PlayerPrefs.GetString("recepits", "");
        let saveRecepit: string;
        if (lastRecepit == "") {
            saveRecepit = recepit;
        } else {
            saveRecepit = lastRecepit + "|" + recepit;
        }
        UnityEngine.PlayerPrefs.SetString("recepits", saveRecepit);
    }

    /**删除成功发放的订单,服务器返回orderId*/
    removeRecepit(removeOrderId: string) {
        let isSucess: boolean = false;
        let arrys = this.getParas();
        let saveNew: string = '';
        for (let i = 0; i < arrys.length; i++) {
            let arry = arrys[i];
            let json = JSON.parse(arry);
            if (removeOrderId == json.payOrderId) {
                isSucess = true;
                continue;
            }
            if (saveNew == '') {
                saveNew = arry;
            } else {
                saveNew = saveNew + "|" + arry;
            }
        }
        UnityEngine.PlayerPrefs.SetString("recepits", saveNew);
        if (isSucess) {
            uts.log("删除订单成功:= " + removeOrderId);
        } else {
            uts.log("删除订单失败,改订单在本地找不到:= " + removeOrderId);
        }
    }

    private getParas(): string[] {
        let a: string[] = [];
        let recepits = UnityEngine.PlayerPrefs.GetString("recepits", "");
        if (recepits != "") {
            a = recepits.split("|");
        }
        return a;
    }

    private deleteSameRecepit() {
        let arrys = this.getParas();
        let tmp: string[] = [];
        let newSave: string = "";
        for (let i = 0; i < arrys.length; i++) {
            let value = arrys[i];
            if (tmp.indexOf(value) < 0) {
                tmp.push(value);
                if (newSave == "") {
                    newSave = value;
                } else {
                    newSave = newSave + "|" + value;
                }
            } else {
                uts.log("删除本地重复订单:= " + value);
            }
        }
        UnityEngine.PlayerPrefs.SetString("recepits", newSave);
    }


    /**检查是否存在漏发的订单,重新向服务器发送,10秒发一个漏单*/
    checkLeakRecepit() {
        if (this.isSending) {
            uts.log("上次订单检查还在继续");
            return;
        }
        this.deleteSameRecepit();
        this.recepits = this.getParas();
        if (this.recepits.length == 0) {
            uts.log("没有漏的订单");
            return;
        }
        this.isSending = true;
        if (this.sendTimer == null) {
            this.sendTimer = new Game.Timer("sendGood", 500, 0, delegate(this, this.sendRecepitToServer));
        }
    }

    private sendRecepitToServer() {
        if (this.recepits.length > 0) {
            let nowTime = UnityEngine.Time.realtimeSinceStartup;
            let value = nowTime - this.lastSendTime;
            if (value > this.sendIntervalTime) {
                let recepit = this.recepits.shift();
                let msg = JSON.parse(recepit) as Msg;
                if (msg.payUin == G.DataMgr.gameParas.uin.toString() && msg.payServerId == G.DataMgr.gameParas.serverID.toString()) {
                    G.ChannelSDK.sendGoodToPlayer(msg);
                }
                this.lastSendTime = nowTime;
            }
        }
        else {
            this.sendTimer.Stop();
            this.sendTimer = null;
            this.isSending = false;
        }
    }


}