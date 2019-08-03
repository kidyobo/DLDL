declare module PlatCommomData {
    //该模块负责对平台sdk(LoginIn,getOrder进行数据结构对应)
    //loginIn.Php数据结构
    export class LoginData {
        errcode: number;
        errmsg: string;
        uin: number;
        aas: number;
        charge: number;
        isadult: number;
        platform: string;
        payurl: string;
        sign: string;
        isnewbie: number;
        userid: number;
        username: string;
        channelID: string;
        channelUserID: string;
        defaultServer: DefaultServer;
        loggedServers: Array<LoggedServer>;
        iosNoPush: number;
    }

    export class DefaultServer {
        showstatus: number;
        serverid: number;
        status: number;
        iscommend: number;
        type: number;
        servername: string;
    }

    export class LoggedServer {
        showstatus: number;
        serverid: number;
        status: number;
        iscommend: number;
        type: number;
        servername: string;
    }


}