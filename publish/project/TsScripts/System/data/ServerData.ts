import { Global as G } from 'System/global'
import { DataFormatter } from 'System/utils/DataFormatter'
import { NoticeView } from 'System/login/view/NoticeView'
import { LoginView } from "System/login/view/LoginView"
import { UrlUtil } from 'System/utils/UrlUtil'
import { JavaCaller } from 'System/utils/JavaCaller'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { EnumLoadUrl } from "System/constants/GameEnum"
import { SafeJson } from '../utils/SafeJson';


export class ServerOneData {
    /**服务器对应的Id*/
    serverId: number = 0;
    /**服务器端口*/
    serverPort: number = 0;
    /**服务器IP*/
    serverIp: string = "";
    /**服务器名字*/
    serverName: string = "";
    /**是否要上报QOS*/
    isReportQOS: boolean = false;
    /**开服时间*/
    openingTime: number = 0;
    /**是否是新服*/
    isNewServer: boolean = false;
    /**是否火爆*/
    isHot: boolean = false;
    /**是否停服维护*/
    isMaintenance: boolean = false;
    /**是否满服*/
    isFull: boolean = false;
    /**属于哪个大类服(西游用)*/
    groupName: string = '';
}

/**最近登陆服务器数据结构*/
export class LastLoginData {
    data: ServerOneData;
    name: string = '';
    level: string = '';
    platform: string = '';
}

//增加西游服务器大类的概念
export class XiYouServerBigGroup {
    name: string;
    group: XiYouServerGroup[];
}

/**专门为西游用的(page:1,name:1-10服,serverLists)*/
export class XiYouServerGroup {
    page: number;
    name: string;
    serverLists: ServerOneData[];
}


/**服务器列表处理基类*/
export abstract class ServerData {
    /**内网oss服务器列表*/
    private allOssServers: ServerOneData[] = [];
    /**最终展示的服务器列表*/
    protected servers: ServerOneData[] = [];
    protected notMaintenanceServers: ServerOneData[] = [];
    lastLoginDatas: LastLoginData[] = [];
    protected hasIosTiShenServer: boolean = false;
    /**是否是内网test,存在9999就跳过平台服务器*/
    isNeiWangOssTest: boolean = false;
    /**平台服务器列表是否设置完成*/
    xiyouServerListHasFinshSetting: boolean = false;
    lastSelectedServer: ServerOneData = null;

    private nowTime = Math.floor((new Date()).getTime() / 1000);
    /**内网test服务器,如果存在该服务器就跳过平台服务器列表*/
    private readonly ossTestServerId: number = 10000;
    /**ios提审服需隐藏激活码功能*/
    private iosTiShenServerIds: number[] = [9991, 9992, 9993, 9994, 9995, 9996];


    /////////////////////////获取服务器数据相关接口//////////////////////////////

    get isIosTiShenEnv(): boolean {
        return this.hasIosTiShenServer && G.IsIOSPlatForm;
    }

    get Count(): number {
        return this.servers.length;
    }

    getServerDataByIndex(index: number): ServerOneData {
        return this.servers[index];
    }

    /**获取最新的服务器*/
    protected getNewlyServer(servers: ServerOneData[]): ServerOneData {
        if (servers.length == 0) {
            return null;
        }
        let newOpenTimeServer = servers[0];
        let newServers: ServerOneData[] = [newOpenTimeServer];
        for (let i = 1; i < servers.length; i++) {
            let server = servers[i];
            if (server.openingTime > newOpenTimeServer.openingTime) {
                newOpenTimeServer = server;
                newServers = [];
                newServers.push(server);
            }
            else if (server.openingTime == newOpenTimeServer.openingTime) {
                newServers.push(server);
            }
        }
        return newServers[Math.floor(Math.random() * newServers.length)];
    }

    /**通过服务器id获取数据*/
    getServerDataById(id: number, ip: string = ''): ServerOneData {
        for (let i = 0; i < this.Count; i++) {
            if (id == this.servers[i].serverId && (ip == '' || ip == this.servers[i].serverIp)) {
                return this.servers[i];
            }
        }
        return null;
    }


    /////////////////////////////////登陆拉取oss服务器列表///////////////////////////////////////////////////

    onServerDataPrepare(callback: (error: string) => void, trytimes: number) {
        let fromIp = trytimes > 0;
        let url: string = G.ChannelSDK.getServerListUrl(fromIp);
        uts.log("serverListUrl = " + url + '  time:= ' + UnityEngine.Time.realtimeSinceStartup);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onLoad, callback), EnumLoadUrl.ServerListTimeOut);
    }

    private onLoad(error: string, content: string, callback) {
        if (error != null) {
            callback(error);
            return;
        }
        let data = SafeJson.parse(content);
        if (data == null) {
            callback("解析错误");
            return;
        }

        this.setServerData(data);
        callback(null);
    }

    private setServerData(data: any) {
        this.servers = [];
        if (data instanceof Array) { // 格式为： [{'svrid':[info arr], 'svrid':[info arr]},{'svrid':[info arr], 'svrid':[info arr]}]
            for (let i = 0; i < data.length; i++) {
                this.collectServers(data[i]);
            }
        }
        else { // 格式为： {'svrid':[info arr], 'svrid':[info arr]}
            this.collectServers(data);
        }
        this.servers.sort(this.sortServers);
        this.allOssServers = this.servers;
        this.checkNeedLinkedKaiFuTime();
    }

    private sortServers(a: ServerOneData, b: ServerOneData) {
        return a.serverId - b.serverId;
    }

    private collectServers(servers: {}) {
        for (let key in servers) {
            let info: string[] = servers[key];
            let server = new ServerOneData();
            server.serverId = parseInt(key);
            server.serverPort = parseInt(info[0]);
            server.serverIp = info[1];
            server.serverName = info[2];
            server.isReportQOS = info[3] == '1';
            server.isNewServer = info[5] == '1';
            server.isHot = info[6] == '1';
            server.isMaintenance = info[7] == '1';
            if (info[8] != null) {
                server.isFull = info[8] == '1';
            }
            if (info[9] != null) { //格林时间单位秒
                server.openingTime = Number(info[9]);
            } else {
                server.openingTime = Math.floor((DataFormatter.getTimeByTimeStr(info[4]) / 1000));
            }
            if (server.serverId == this.ossTestServerId) {
                //通过特殊服务器9999来判断是否需要跳过平台服务器,目的为了内网方便测试未来开放的服务器等等
                this.isNeiWangOssTest = true;
            }
            this.servers.push(server);
            if (!server.isMaintenance) {
                this.notMaintenanceServers.push(server);
            }
        }
    }


    /**检查是否需要关联开服时间,西游平台和9999服不需要关联*/
    private checkNeedLinkedKaiFuTime() {
        if (G.ChannelSDK.serVerListFromSdk() || this.isNeiWangOssTest) {
            uts.log('为西游平台或者存在9999服,不需要关联开服时间');
            return;
        }
        this.setLastLoginDatas();
        let serverList: ServerOneData[] = [];
        let notMaintenceServerList: ServerOneData[] = [];
        for (let i = 0; i < this.servers.length; i++) {
            let oneServer = this.servers[i];
            this.checkServerIsIosTiShen(oneServer.serverId);
            let time = oneServer.openingTime;
            if (time <= this.nowTime) {
                serverList.push(oneServer);
                if (!oneServer.isMaintenance) {
                    notMaintenceServerList.push(oneServer);
                }
            }
        }
        this.servers = serverList;
        this.notMaintenanceServers = notMaintenceServerList;
    }

    //检查是不是ios提审服
    checkServerIsIosTiShen(serverId: number) {
        if (this.hasIosTiShenServer) {
            return;
        }
        for (let i = 0; i < this.iosTiShenServerIds.length; i++) {
            if (serverId == this.iosTiShenServerIds[i]) {
                this.hasIosTiShenServer = true;
                break;
            }
        }
    }

    ////////////////////////////////////////////最近登陆数据设置//////////////////////////////////////////////

    /**设置之前玩家数据*/
    setLastLoginDatas() {
        this.lastLoginDatas.length = 0;
        let userName = UnityEngine.PlayerPrefs.GetString('userName', '');
        for (let i = 0; i < this.servers.length; i++) {
            let id = this.servers[i].serverId.toString();
            let ip = this.servers[i].serverIp;
            let serverId = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_{1}_serverId', userName, id), '');
            let serverIp = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_{1}_serverIp', userName, id), '');
            if (serverId == id && serverIp == ip) {
                //说明在这个服务器存放了数据
                let item = new LastLoginData();
                item.data = this.servers[i];
                let heroName = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_{1}_heroName', userName, id), '');
                let heroLevel = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_{1}_heroLevel', userName, id), '');
                if (heroName != '' && heroLevel != '') {
                    item.name = heroName;
                    item.level = heroLevel;
                    this.lastLoginDatas.push(item);
                }
            }
        }
        if (this.needAddPlatLastLogin()) {
            this.setPlatLastLoginedData();
        }
    }

    /**存放历史数据(结构为uin_serverId_name-----数据:content,例7538_1_ip----192.168.1.68)*/
    setPlayerData(name: string = '', content: string = '') {
        UnityEngine.PlayerPrefs.SetString(uts.format('{0}_{1}_{2}', this.getSign(), G.DataMgr.gameParas.serverID, name), content);
    }

    /**存放最后一次登陆的数据*/
    setLastNewLoginData(name: string = '', content: string = '') {
        UnityEngine.PlayerPrefs.SetString(uts.format('{0}_{1}', this.getSign(), name), content);
    }

    private getSign(): string {
        let userName: string = '';
        if (defines.has('TESTUIN')) {
            userName = G.DataMgr.gameParas.uin.toString();
        } else {
            userName = G.DataMgr.gameParas.username;
        }
        return userName;
    }

    getAutoSelectServer(): ServerOneData {
        let server = this.getLastLoginData();
        if (server == null) {
            server = this.getNewOpenTimeServer();
        }
        return server;
    }


    private getLastLoginData(): ServerOneData {
        if (this.needAddPlatLastLogin()) {
            return this.getPlatLastLoginData();
        }
        let userName = UnityEngine.PlayerPrefs.GetString('userName', '');
        let serverId = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_serverId', userName), '');
        let serverIp = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_serverIp', userName), '');
        for (let i = 0; i < this.servers.length; i++) {
            let id = this.servers[i].serverId.toString();
            let ip = this.servers[i].serverIp;
            if (id == serverId && ip == serverIp) {
                return this.servers[i];
            }
        }
        return null;
    }


    getRandomServerToPlat(): ServerOneData {
        if (this.allOssServers.length > 0) {
            return this.allOssServers[0];
        }
        return null;
    };

    setDefaultAndLoggedServer(defaultServer: PlatCommomData.DefaultServer, loggedServer: PlatCommomData.LoggedServer[]) { };
    analysisPlatServers(content: string) { };
    platServerGroup: XiYouServerBigGroup[] = [];
    needAddPlatLastLogin(): boolean { return false };
    getPlatLastLoginData(): ServerOneData { return null };
    setPlatLastLoginedData() { };
    abstract getNewOpenTimeServer(): ServerOneData;

}


/**其他服务器平台数据*/
export class CommonServerData extends ServerData {
    /**获取没有维护中的服务器开服最近的那一个*/
    getNewOpenTimeServer(): ServerOneData {
        if (this.notMaintenanceServers.length == 0) {
            return this.getNewlyServer(this.servers);
        }
        return this.getNewlyServer(this.notMaintenanceServers);
    }
}


/**西游服务器数据*/
export class XiYouServerData extends ServerData {

    //西游平台defaultServer,LoggedServe
    private xiYoudefaultServer: PlatCommomData.DefaultServer = null;
    private xiYouLoggedServers: PlatCommomData.LoggedServer[] = null;

    /**设置西游平台默认选中的服务器*/
    setDefaultAndLoggedServer(defaultServer: PlatCommomData.DefaultServer, loggedServer: PlatCommomData.LoggedServer[]) {
        uts.log("==============设置西游平台默认选中的服务器================");
        this.xiYoudefaultServer = defaultServer;
        this.xiYouLoggedServers = loggedServer;
    }

    /**分析平台服务器列表*/
    analysisPlatServers(content: string) {
        uts.log("----------分析平台服务器列表xiyou-----------");
        if (this.isNeiWangOssTest) {
            uts.log('存在测试服务器9999服,跳过平台服务器列表');
            return;
        }
        let configs = SafeJson.parse(content);
        if (configs == null) {
            uts.bugReport('解析平台服务器列表失败');
            return;
        }
        let msgData = configs as XiYouServerList.msgData;
        let servers = msgData.servers;
        if (msgData == null || servers == null) {
            uts.log('sdk没有返回任何的服务器数据');
            return;
        }
        this.platServerGroup = [];
        for (let data of servers) {
            let bigGroup = new XiYouServerBigGroup();
            bigGroup.name = data.categoryname;
            bigGroup.group = this.getXiYouServerGroupAndCompareServerList(data.groups, data.categoryname);
            this.platServerGroup.push(bigGroup);
        }
        this.servers = this.newServerList;
        this.notMaintenanceServers = this.newNotMaintenanceServerList;
        if (this.newNotPeiZhiPlatServerList.length > 0) {
            uts.log('ossServer没有配置以下服务器:= ' + JSON.stringify(this.newNotPeiZhiPlatServerList));
        }
        this.setLastLoginDatas();
        //平台服务器数据设置完成
        this.xiyouServerListHasFinshSetting = true;
    }

    private newServerList: ServerOneData[] = [];
    private newNotPeiZhiPlatServerList: XiYouServerList.ServerList[] = [];
    private newNotMaintenanceServerList: ServerOneData[] = [];

    private getXiYouServerGroupAndCompareServerList(groups: XiYouServerList.ServerOnePage[], groupName: string): XiYouServerGroup[] {
        let platServerGroup: XiYouServerGroup[] = [];
        for (let i = 0; i < groups.length; i++) {
            let sdkServerGroup = groups[i];
            let serverGroup = new XiYouServerGroup();
            serverGroup.page = sdkServerGroup.page;
            serverGroup.name = sdkServerGroup.name;
            let showServers: ServerOneData[] = [];
            for (let index = 0; index < sdkServerGroup.list.length; index++) {
                let sdkServer = sdkServerGroup.list[index];
                this.checkServerIsIosTiShen(sdkServer.serverid);
                let isOssHas: boolean = false;
                for (let j = 0; j < this.servers.length; j++) {
                    let ossServer = this.servers[j];
                    if (ossServer.serverId == sdkServer.serverid) {
                        ossServer.serverName = sdkServer.servername;
                        ossServer.isNewServer = sdkServer.iscommend == 1;
                        ossServer.isHot = sdkServer.showstatus == 3;
                        if (!ossServer.isMaintenance) {
                            this.newNotMaintenanceServerList.push(ossServer);
                        }
                        ossServer.groupName = groupName;
                        this.newServerList.push(ossServer);
                        showServers.push(ossServer);
                        isOssHas = true;
                        break;
                    }
                }
                if (!isOssHas) {
                    this.newNotPeiZhiPlatServerList.push(sdkServer);
                }
            }
            serverGroup.serverLists = showServers;
            platServerGroup.push(serverGroup);
        }
        platServerGroup.sort(this.sortXiYouServerByPage);
        for (let i = 0; i < platServerGroup.length; i++) {
            platServerGroup[i].serverLists.sort(this.sortXiYouServerById);
        }
        return platServerGroup;
    }

    //对西游服务器进行排序(page越大排在前面,serverList对应id越大排在前面)
    private sortXiYouServerByPage(a: XiYouServerGroup, b: XiYouServerGroup) {
        return b.page - a.page;
    }

    private sortXiYouServerById(a: ServerOneData, b: ServerOneData) {
        return b.serverId - a.serverId;
    }

    needAddPlatLastLogin(): boolean {
        return true;
    }

    getPlatLastLoginData(): ServerOneData {
        if (this.xiYouLoggedServers == null || this.xiYouLoggedServers.length == 0) {
            uts.log('第一次登陆,没有最近登陆的服务器');
            return null;
        }
        let userName = UnityEngine.PlayerPrefs.GetString('userName', '');
        let serverId = UnityEngine.PlayerPrefs.GetString(uts.format('{0}_serverId', userName), '');
        //西游平台数据来源以loginIn.php的为主
        let lastSelectedServer: ServerOneData = null;
        let canSelectedServers: ServerOneData[] = [];
        for (let i = 0; i < this.xiYouLoggedServers.length; i++) {
            let loggedServer = this.xiYouLoggedServers[i];
            for (let index = 0; index < this.servers.length; index++) {
                if (loggedServer.serverid == this.servers[index].serverId) {
                    canSelectedServers.push(this.servers[index]);
                    break;
                }
            }
        }
        if (canSelectedServers.length > 0) {
            lastSelectedServer = canSelectedServers[0];
            for (let i = 0; i < canSelectedServers.length; i++) {
                if (serverId == canSelectedServers[i].serverId.toString()) {
                    //说明和本地存的最近一次是一样的
                    lastSelectedServer = canSelectedServers[i];
                    break;
                }
            }
        } else {
            uts.log('平台返回的最近登陆服务器没有一个在服务器列表里,请检查：= ' + JSON.stringify(this.xiYouLoggedServers));
        }
        return lastSelectedServer;
    }


    setPlatLastLoginedData() {
        //西游平台需要特殊处理,最近登陆数据来源必须以西游平台为主
        let lastLoginDatas: LastLoginData[] = [];
        if (this.xiYouLoggedServers != null) {
            for (let i = 0; i < this.xiYouLoggedServers.length; i++) {
                let loggedServer = this.xiYouLoggedServers[i];
                let item = new LastLoginData();
                item.name = "";
                item.level = "";
                //先检查服务器列表里有没有
                for (let index = 0; index < this.servers.length; index++) {
                    if (loggedServer.serverid == this.servers[index].serverId) {
                        item.data = this.servers[index];
                        break;
                    }
                }
                //拿我们的数据去填充玩家等级和姓名
                for (let j = 0; j < this.lastLoginDatas.length; j++) {
                    if (loggedServer.serverid == this.lastLoginDatas[j].data.serverId) {
                        item.level = this.lastLoginDatas[j].level;
                        item.name = this.lastLoginDatas[j].name;
                        break;
                    }
                }
                if (item.data != null) {
                    lastLoginDatas.push(item);
                }
            }
        }
        this.lastLoginDatas = lastLoginDatas;
    }

    /**获取没有维护中的服务器开服最近的那一个,西游平台需要特殊处理*/
    getNewOpenTimeServer(): ServerOneData {
        if (this.xiYoudefaultServer != null) {
            let defaultServer: ServerOneData = null;
            for (let i = 0; i < this.notMaintenanceServers.length; i++) {
                if (this.xiYoudefaultServer.serverid == this.notMaintenanceServers[i].serverId) {
                    defaultServer = this.notMaintenanceServers[i];
                    break;
                }
            }
            if (defaultServer == null && this.notMaintenanceServers.length > 0) {
                defaultServer = this.notMaintenanceServers[0];
            }
            return defaultServer;
        }
        return this.getNewlyServer(this.notMaintenanceServers);
    }

}

