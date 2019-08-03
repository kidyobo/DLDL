"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolClient_1 = require("./ToolClient");
var ProcessStatus_1 = require("../ProcessStatus");
var net = require("net");
/**
 * waiting for vstool connect server
 */
var ToolClientServer = (function () {
    function ToolClientServer(serverPort, callback) {
        this.server = null;
        this.serverPort = 0;
        this.serverPort = serverPort;
        this.callback = callback;
    }
    ToolClientServer.prototype.run = function () {
        var _this = this;
        console.log('Waiting for client connections on port ' + this.serverPort);
        this.server = net.createServer(function (socket) {
            console.log('client connected');
            ProcessStatus_1.ProcessStatus.ins.toolClient.close(1);
            ProcessStatus_1.ProcessStatus.ins.toolClient = new ToolClient_1.ToolClient(socket);
            _this.callback({ type: 'start', data: null, client: ProcessStatus_1.ProcessStatus.ins.toolClient });
            socket.on('close', function () {
                _this.callback({ type: 'close', data: null });
                ProcessStatus_1.ProcessStatus.ins.toolClient.close(2);
            });
            socket.on('error', function (data) {
                _this.callback({ type: 'error', data: data });
                ProcessStatus_1.ProcessStatus.ins.toolClient.close(3);
            });
            socket.on('data', function (data) {
                if (_this.callback({ type: 'data', data: data }) < 0) {
                    ProcessStatus_1.ProcessStatus.ins.toolClient.close(4);
                }
            });
        }).listen(this.serverPort);
    };
    return ToolClientServer;
}());
exports.ToolClientServer = ToolClientServer;
//# sourceMappingURL=ToolClientServer.js.map