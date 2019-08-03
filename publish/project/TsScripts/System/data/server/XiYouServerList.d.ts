declare module XiYouServerList {

    export class msgData {
        message: string;
        status: number;
        servers: Array<ServerPages>;
        domain: string;
    }

    //pagesize:10,代表一页显示十个服务器,categoryname:正式服(分类,比如应用宝和荣耀一起)
    export class ServerPages {
        categoryname: string;
        pagesize: number;
        platform: string;
        groups: Array<ServerOnePage>;
        customnames: Array<string>;
    }

    //page:1,name:1-10服
    export class ServerOnePage {
        page: number;
        name: string;
        list: Array<ServerList>;
    }

    export class ServerList {
        serverid: number;
        status: number;
        iscommend: number;
        type: number;
        servername: string;
        showstatus: number;
    }

}