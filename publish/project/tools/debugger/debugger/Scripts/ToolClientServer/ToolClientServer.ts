import { V8Protocol, ResponseRt } from '../V8/V8protocol'
import { SingleProcess } from "../SingleProcess";
import { ToolClient } from "./ToolClient";
import { ProcessStatus } from '../ProcessStatus'
import net = require("net");

export interface ClientData {
    type: string;
    data: any;
    client?: ToolClient;
}

/**
 * waiting for vstool connect server
 */
export class ToolClientServer {
    private callback: (data: ClientData) => number;
    private server: net.Server = null;
    private serverPort: number = 0;

    constructor(serverPort: number, callback: (data: ClientData) => number) {
        this.serverPort = serverPort;
        this.callback = callback;
    }

    run() {
        console.log('Waiting for client connections on port ' + this.serverPort);
        this.server = net.createServer((socket) => {
            console.log('client connected');
            ProcessStatus.ins.toolClient.close(1);
            ProcessStatus.ins.toolClient = new ToolClient(socket);
            this.callback({ type: 'start', data: null, client: ProcessStatus.ins.toolClient });
            socket.on('close', () => {
                this.callback({ type: 'close', data: null });
                ProcessStatus.ins.toolClient.close(2);
            });
            socket.on('error', (data) => {
                this.callback({ type: 'error', data: data });
                ProcessStatus.ins.toolClient.close(3);
            });
            socket.on('data', (data) => {
                if (this.callback({ type: 'data', data: data }) < 0) {
                    ProcessStatus.ins.toolClient.close(4);
                }
            });
        }).listen(this.serverPort);
    }
}