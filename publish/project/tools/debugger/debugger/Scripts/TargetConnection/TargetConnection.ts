import net = require('net');
import { Util } from '../Util';
import { V8Protocol, ResponseRt } from '../V8/V8protocol'
import { DukProtocolDecoder } from './DukProtocolDecoder'
import { DukProtocolEncoder } from './DukProtocolEncoder'
import { DVAL_JSON, DukMsg } from './Common'
import { DukCmdMeta } from './DukCmdMeta'
import { ProcessStatus } from '../ProcessStatus'

/**
 * This app connect to target duk server
 */
export class TargetConnection {
    private targetHost: string = '';
    private targetPort: number = 0;
    private callback: (msg: DukMsg) => void;
    private targetStream: net.Socket = null;
    private inputParser: DukProtocolDecoder = null;
    private optDumpDebugRead: boolean = false;
    private optDumpDebugPretty: boolean = false;

    constructor(targetHost: string, targetPort: number, callback: (msg: DukMsg) => void) {
        this.targetHost = targetHost;
        this.targetPort = targetPort;
        this.callback = callback;
        DukCmdMeta.init();
    }

    run() {
        this.connect();
        setInterval(() => {
            this.connect();
        }, 2000);
    }

    resumeTarget() {
        this.sendMsg({ request: 'Resume' });
    }

    sendMsg(msg: DukMsg) {
        Util.log('[s->t]', JSON.stringify(msg));
        if (this.targetStream == null) {
            Util.log('[info]', 'target server is closed11!');
            return;
        }
        DukProtocolEncoder.ins.encode(this.targetStream, msg);
    }

    close() {
        if (this.inputParser) {
            this.inputParser.close();
            this.inputParser = null;
        }
        if (this.targetStream) {
            this.targetStream.destroy();
            this.targetStream = null;
        }
        ProcessStatus.ins.requestQueue.clear(); // bug..., 应该属于targetconnect的成员
    }

    private connect() {
        if (this.targetStream != null)
            return;

        console.log('Connecting to duk target server ' + this.targetHost + ':' + this.targetPort + '...');

        this.targetStream = new net.Socket();
        this.targetStream.connect(this.targetPort, this.targetHost, () => {
            console.log('connected to target server!');
            this.callback({ notify: '_Connected' });
        });

        this.inputParser = new DukProtocolDecoder(
            this.targetStream,
            null,
            this.optDumpDebugRead,
            this.optDumpDebugPretty,
            this.optDumpDebugPretty ? 'Recv: ' : null,
            null,
            null   // console logging is done at a higher level to match request/response
        );
        // Don't add a 'value' key to numbers.
        this.inputParser.readableNumberValue = false;

        this.inputParser.on('transport-close', () => {
            console.log('target duk transport closed');
            this.callback({ notify: '_Disconnecting' });
            this.close();
        });
        this.inputParser.on('transport-error', (err) => {
            console.log('target duk transport error', err);
            this.callback({ notify: '_Error', args: [String(err)] });
            this.close();
        });
        this.inputParser.on('protocol-version', (msg) => {
            let ver = msg.protocolVersion;
            Util.log('[t->s]', 'target duk version identification:' + msg.versionIdentification);
            this.callback({ notify: '_TargetConnected', args: [msg.versionIdentification] });
            if (ver !== 1) {
                console.log('Protocol version ' + ver + ' unsupported, dropping connection');
            }
        });
        this.inputParser.on('debug-message', (msg) => {
            this.callback(msg);
        });
        this.inputParser.on('stats-update', () => {
        });
    }
}

