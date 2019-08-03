"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 仅做测试用
*/
var net = require("net");
var fs = require("fs");
var SimpleProxy = (function () {
    function SimpleProxy() {
        this.serverPort = 5858;
        this.optTargetHost = '127.0.0.1';
        this.optTargetPort = 8686;
        this.targetStream = null;
        this.server = null;
        this.clientStream = null;
    }
    SimpleProxy.prototype.run = function () {
        var _this = this;
        console.log('Waiting for client connections on port ' + this.serverPort);
        this.server = net.createServer(function (socket) {
            _this.clientStream = socket;
            console.log('proxy client connected');
            socket.on('connection', function (client) {
            });
            socket.on('close', function () {
                console.log('***close:');
            });
            socket.on('data', function (data) {
                try {
                    var s = data.toString('utf-8');
                    console.log('<c->s>:' + s);
                    fs.appendFileSync('g:\\gdb.log', '\r\n---------------\r\n');
                    fs.appendFileSync('g:\\gdb.log', '<c->s>:' + s);
                    _this.targetStream.write(s);
                }
                catch (e) {
                    console.log(e);
                }
            });
            _this.connectToTarget();
        }).listen(this.serverPort);
    };
    SimpleProxy.prototype.connectToTarget = function () {
        var _this = this;
        console.log('Connecting to ' + this.optTargetHost + ':' + this.optTargetPort + '...');
        this.targetStream = new net.Socket();
        this.targetStream.connect(this.optTargetPort, this.optTargetHost, function () {
            console.log('Debug transport connected');
            _this.targetStream.on('data', function (data) {
                try {
                    var s = data.toString('utf-8');
                    console.log('<s->c>:' + s);
                    fs.appendFileSync('g:\\gdb.log', '\r\n---------------\r\n');
                    fs.appendFileSync('g:\\gdb.log', '<s->c>:' + s);
                    _this.clientStream.write(s);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    };
    return SimpleProxy;
}());
new SimpleProxy().run();
//node --debug-brk=8686 --nolazy C:\client-src\client\trunk\project\tools\NodejsConsoleApp1\NodejsConsoleApp1\app.js
//# sourceMappingURL=SimpleProxy.js.map