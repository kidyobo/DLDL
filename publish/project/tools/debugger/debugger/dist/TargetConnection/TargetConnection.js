"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var Util_1 = require("../Util");
var DukProtocolDecoder_1 = require("./DukProtocolDecoder");
var DukProtocolEncoder_1 = require("./DukProtocolEncoder");
var DukCmdMeta_1 = require("./DukCmdMeta");
var ProcessStatus_1 = require("../ProcessStatus");
/**
 * This app connect to target duk server
 */
var TargetConnection = (function () {
    function TargetConnection(targetHost, targetPort, callback) {
        this.targetHost = '';
        this.targetPort = 0;
        this.targetStream = null;
        this.inputParser = null;
        this.optDumpDebugRead = false;
        this.optDumpDebugPretty = false;
        this.targetHost = targetHost;
        this.targetPort = targetPort;
        this.callback = callback;
        DukCmdMeta_1.DukCmdMeta.init();
    }
    TargetConnection.prototype.run = function () {
        var _this = this;
        this.connect();
        setInterval(function () {
            _this.connect();
        }, 2000);
    };
    TargetConnection.prototype.resumeTarget = function () {
        this.sendMsg({ request: 'Resume' });
    };
    TargetConnection.prototype.sendMsg = function (msg) {
        Util_1.Util.log('[s->t]', JSON.stringify(msg));
        if (this.targetStream == null) {
            Util_1.Util.log('[info]', 'target server is closed11!');
            return;
        }
        DukProtocolEncoder_1.DukProtocolEncoder.ins.encode(this.targetStream, msg);
    };
    TargetConnection.prototype.close = function () {
        if (this.inputParser) {
            this.inputParser.close();
            this.inputParser = null;
        }
        if (this.targetStream) {
            this.targetStream.destroy();
            this.targetStream = null;
        }
        ProcessStatus_1.ProcessStatus.ins.requestQueue.clear(); // bug..., 应该属于targetconnect的成员
    };
    TargetConnection.prototype.connect = function () {
        var _this = this;
        if (this.targetStream != null)
            return;
        console.log('Connecting to duk target server ' + this.targetHost + ':' + this.targetPort + '...');
        this.targetStream = new net.Socket();
        this.targetStream.connect(this.targetPort, this.targetHost, function () {
            console.log('connected to target server!');
            _this.callback({ notify: '_Connected' });
        });
        this.inputParser = new DukProtocolDecoder_1.DukProtocolDecoder(this.targetStream, null, this.optDumpDebugRead, this.optDumpDebugPretty, this.optDumpDebugPretty ? 'Recv: ' : null, null, null // console logging is done at a higher level to match request/response
        );
        // Don't add a 'value' key to numbers.
        this.inputParser.readableNumberValue = false;
        this.inputParser.on('transport-close', function () {
            console.log('target duk transport closed');
            _this.callback({ notify: '_Disconnecting' });
            _this.close();
        });
        this.inputParser.on('transport-error', function (err) {
            console.log('target duk transport error', err);
            _this.callback({ notify: '_Error', args: [String(err)] });
            _this.close();
        });
        this.inputParser.on('protocol-version', function (msg) {
            var ver = msg.protocolVersion;
            Util_1.Util.log('[t->s]', 'target duk version identification:' + msg.versionIdentification);
            _this.callback({ notify: '_TargetConnected', args: [msg.versionIdentification] });
            if (ver !== 1) {
                console.log('Protocol version ' + ver + ' unsupported, dropping connection');
            }
        });
        this.inputParser.on('debug-message', function (msg) {
            _this.callback(msg);
        });
        this.inputParser.on('stats-update', function () {
        });
    };
    return TargetConnection;
}());
exports.TargetConnection = TargetConnection;
//# sourceMappingURL=TargetConnection.js.map