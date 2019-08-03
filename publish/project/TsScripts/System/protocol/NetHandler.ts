import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros'
import { Profiler } from "System/utils/Profiler"

export enum EnumNetId {
    base = 1,
    cross,
}

enum ConnectStatus {
    none = 0,  // 空闲
    connecting = 1,  // 正在连接
    connected = 2,  // 已连接
    closed = 3,  // 已关闭
    error = 4,   // 连接错误
    disconnected = 5,  // 连接断开
}

class Socket {
    onConnect: (id: number, result: boolean, reason: number) => void;
    onDisConnect: (id: number, reason: number) => void;
    onReceived: (id: number, data: any, size: number) => void;

    totalTryTimes: number = 3;
    private curTryTimes: number = 0;
    private tcp: Game.TcpClient = null;
    private host: string;
    private port: number = 0;
    private status: ConnectStatus;
    private id = 0;

    constructor(id: number) {
        this.id = id;
        Game.TcpClient.setHandleTimesInFrame(30);
        let headsize = 2;
        if (this.versionCode > 1080) {
            headsize = 28;
        }
        this.tcp = Game.TcpClient.create(800000, 100000, headsize, 200000, 5000, 5000);
        this.tcp.onConnect = delegate(this, this.onTcpConnect);
        this.tcp.onDisConnect = delegate(this, this.onTcpDisConnect);
        this.tcp.onReceived = delegate(this, this.onTcpRecv);
    }

    get Id(): number {
        return this.id;
    }

    get Status(): ConnectStatus {
        return this.status;
    }

    connect(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.curTryTimes = 0;
        this.status = ConnectStatus.connecting;
        this.doConnect();
    }

    close() {
        this.tcp.close();
        this.status = ConnectStatus.closed;
        this.host = null;
        this.port = 0;
    }

    send(data: any, size: number) {
        this.tcp.send(data, size);
    }

    private doConnect() {
        this.curTryTimes++;

        this.tcp.close();
        this.tcp.connect(this.host, this.port, 5000 * 4); // 20 seconds timeout
        uts.log(uts.format('向{0}:{1}发起连接（第{2}次）...', this.host, this.port, this.curTryTimes));
    }

    private onTcpConnect(isSuccess: boolean, reason: number) {
        if (null == this.host) {
            return;
        }

        if (isSuccess) {
            uts.log(uts.format('tcp connect success: {0}:{1}', this.host, this.port));
            this.status = ConnectStatus.connected;
            if (null != this.onConnect) {
                this.onConnect(this.id, isSuccess, reason);
            }
        } else {
            uts.log(uts.format('tcp connect failed: {0}:{1}, reason is {2}', this.host, this.port, reason));
            if (reason != 0 && Game.TcpClient.getError != null) {
                uts.logWarning(Game.TcpClient.getError());
            }
            if (this.curTryTimes < this.totalTryTimes) {
                // 继续重试
                this.doConnect();
            } else {
                // 超过重试次数
                this.status = ConnectStatus.error;
                if (null != this.onConnect) {
                    this.onConnect(this.id, isSuccess, reason);
                }
            }
        }
    }

    private onTcpDisConnect(reason: number) {
        if (null == this.host) {
            return;
        }

        this.tcp.close();
        uts.log(uts.format('tcp disconnected: {0}:{1}, reason is {2}', this.host, this.port, reason));
        if (reason != 0 && Game.TcpClient.getError != null) {
            uts.logWarning(Game.TcpClient.getError());
        }
        this.status = ConnectStatus.disconnected;
        if (null != this.onDisConnect) {
            this.onDisConnect(this.id, reason);
        }
    }

    private onTcpRecv(data: any, size: number) {
        if (null == this.host) {
            return;
        }

        if (null != this.onDisConnect) {
            this.onReceived(this.id, data, size);
        }
    }

    private get versionCode(): number {
        let vers = UnityEngine.Application.version.split('.');
        if (vers.length < 4) return 100000;
        return Number(vers[3]);
    }
}

export class NetHandler {
    /**心跳包网络延迟，单位秒。*/
    private netDelay = 0;
    /**心跳包发送时间记录数组。*/
    private sendTimeStatArray: number[] = [];

    private static listeners = {};

    private static readonly totalTryTimes: number = 3;

    private sockets: Socket[] = [];
    private workSocket: Socket;
    private ips: string;
    private hostList: Array<string> = [];
    private port = 0;

    private netId: EnumNetId;

    public head: Protocol.MsgHead = null;

    /**在收到login response之前锁住消息*/
    private isMsgBlocked = true;

    public onConnectCallback: (isSuccess: boolean) => void;
    public onDisconnectCallback: () => void;
    public onExceptionCallback: () => void;

    get NetDelay(): number {
        return this.netDelay;
    }

    get NetId(): EnumNetId {
        return this.netId;
    }

    connect(ips: string, port: number, netId: EnumNetId) {
        this.netId = netId;

        // 同一个socket连接，不能list两次role，所以每次都要断开重连
        this.close();

        // 多个url用|分开
        this.ips = ips;
        this.hostList = ips.split("|");
        //先暂时定为一个
        this.port = port;

        let hostCount: number = this.hostList.length;
        // 创建ping
        let curSocketCnt: number = this.sockets.length;
        for (let i = 0; i < hostCount - curSocketCnt; i++) {
            let socket = new Socket(curSocketCnt + i);
            socket.onConnect = delegate(this, this.onConnect);
            socket.onDisConnect = delegate(this, this.onDisConnect);
            socket.onReceived = delegate(this, this.onRecv);
            this.sockets.push(socket);
        }
        this.doConnect();
    }

    reConnect() {
        uts.logWarning('reconnect...'); //不要删除定位crash用
        this.close();
        this.doConnect();
    }

    doConnect() {
        this.workSocket = null;
        // 如果有多个host，则采用ping测试各连接选择最快者
        let hostCount: number = this.hostList.length;
        for (let i = 0; i < hostCount; i++) {
            let socket = this.sockets[i];
            socket.connect(this.hostList[i], this.port);
        }
    }

    close() {
        // 关闭连接
        this.workSocket = null;
        let hostCount: number = this.hostList.length;
        for (let i = 0; i < hostCount; i++) {
            let socket = this.sockets[i];
            socket.close();
        }
    }

    send(obj: Protocol.FyMsg) {
        if (null == this.workSocket) {
            return;
        }

        let msgId: number = obj.m_stMsgHead.m_uiMsgID;
        let packlen = G.Dr.pack(obj);
        if (packlen < 0) {
            uts.bugReport('pack error! err:' + packlen + ', msgid:' + msgId + ', errmsg:' + G.Dr.error());
            return;
        }
        this.workSocket.send(G.Dr.packBuf(), packlen);

        // 记录发送时间
        if (Macros.MsgID_SyncTime_Request == msgId) {
            // 将延迟设置为0
            this.sendTimeStatArray.push(UnityEngine.Time.realtimeSinceStartup);
        }
    }

    private onConnect(id: number, isSuccess: boolean, reason: number) {
        if (null != this.workSocket) {
            return;
        }

        this.sendTimeStatArray.length = 0;

        let hostCount: number = this.hostList.length;
        if (isSuccess) {
            for (let i = 0; i < hostCount; i++) {
                let socket = this.sockets[i];
                if (socket.Id == id) {
                    this.workSocket = socket;
                } else {
                    socket.close();
                }
            }
            uts.assert(null != this.workSocket);

            // 连上socket后即阻塞其它消息
            this.isMsgBlocked = true;
            this.onConnectCallback(true);
        } else {
            let errorCnt = 0;
            for (let i = 0; i < hostCount; i++) {
                let socket = this.sockets[i];
                if (socket.Status == ConnectStatus.error) {
                    errorCnt++;
                }
            }

            if (errorCnt == hostCount) {
                this.onConnectCallback(false);
            }
        }
    }

    private onDisConnect(id: number, reason: number) {
        if (null != this.workSocket && this.workSocket.Id == id) {
            if (null != this.onDisconnectCallback) {
                this.onDisconnectCallback();
            }
        }
    }

    private onRecv(id: number, data: any, size: number, busy: boolean) {
        if (null != this.workSocket && this.workSocket.Id == id) {
            let msgid = G.Dr.msgid(data, size);
            if (msgid < 0) {
                uts.bugReport('get msgid error! err:' + msgid + ", datasize:" + size);
                return;
            }

            if (busy && Macros.MsgID_CastSkill_Notify == msgid) {
                // 繁忙丢掉技能notify
                return;
            }

            if (Macros.MsgID_LoginServer_Response == msgid) {
                this.isMsgBlocked = false;
            }
            if (this.isMsgBlocked && Macros.MsgID_Account_ListRole_Response != msgid && Macros.MsgID_Account_CreateRole_Response != msgid) {
                uts.log(uts.format('Ignore message received before login response, msgid={0}', msgid));
                return;
            }

            let obj: Protocol.FyMsg = G.Dr.getRecvObject(msgid) as Protocol.FyMsg;
            let rt = G.Dr.unpack(data, size, obj);
            if (rt < 0) {
                uts.bugReport('unpack error! err:' + rt + ', msgid:' + msgid + ", datasize:" + size);
                return;
            }

            this.head = obj.m_stMsgHead;

            // 计算延迟
            if (Macros.MsgID_SyncTime_Response == msgid) {
                let sendTime = this.sendTimeStatArray.shift();
                if (sendTime > 0) {
                    this.netDelay = Math.round((UnityEngine.Time.realtimeSinceStartup - sendTime) * 1000);
                    if (this.netDelay > 999) {
                        this.sendTimeStatArray.length = 0;
                    }
                }
            }

            Profiler.push('msgid:' + msgid);
            this.dispatchData(msgid, obj.m_msgBody);
            Profiler.pop();
        }
    }

    static addListener(msgid: number, deleg) {
        let list = NetHandler.listeners[msgid];
        if (list == null) {
            list = [];
            NetHandler.listeners[msgid] = list;
        }
        list.push(deleg);
    }

    static removeListener(msgid: number, deleg) {
        let list = NetHandler.listeners[msgid];
        if (list == null) return;

        let pos = list.indexOf(deleg);
        if (pos < 0) return;

        list.splice(pos, 1);
    }

    dispatchData(msgid: number, body) {
        let list = NetHandler.listeners[msgid];
        if (list == null)
            return;

        for (let i = 0, n = list.length; i < n; i++) {
            list[i](body);
        }
    }
}