"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var SingleProcess = (function () {
    function SingleProcess() {
        this.mutexServer = null;
        this.called = false;
        this.portadd = 100;
    }
    SingleProcess.prototype.enterMutex = function (port, setStartScript) {
        this.mutexServer = net.createServer(function (socket) {
            var d = '';
            socket.on('close', function () {
                socket.destroy();
            });
            socket.on('error', function (data) {
                socket.destroy();
            });
            socket.on('data', function (data) {
                try {
                    d = d + data;
                    if (d.charAt(d.length - 1) == '#') {
                        setStartScript(d.substr(0, d.length - 1));
                        socket.destroy();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        }).listen(port + this.portadd);
    };
    SingleProcess.prototype.check = function (host, port, caller) {
        var _this = this;
        var socket = new net.Socket();
        socket.connect(port + this.portadd, host, function () {
            if (!_this.called) {
                caller('running', socket);
                _this.called = true;
            }
        });
        socket.on('close', function () {
            if (!_this.called) {
                caller('stop', socket);
                _this.called = true;
            }
        });
        socket.on('error', function (data) {
            if (!_this.called) {
                caller('stop', socket);
                _this.called = true;
            }
        });
    };
    return SingleProcess;
}());
SingleProcess.ins = new SingleProcess();
exports.SingleProcess = SingleProcess;
//# sourceMappingURL=SingleProcess.js.map