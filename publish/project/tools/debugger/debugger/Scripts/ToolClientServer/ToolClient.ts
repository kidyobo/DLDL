/**
 * vstool connect to this ToolClientServer client
 */
import net = require('net');
import { FrameValueRefs } from './FrameValueRefs'
import { BreakPoints, BreakPoint } from './BreakPoint'
import { Util } from '../Util';
export class ToolClient {
    private _valueRefs: FrameValueRefs = new FrameValueRefs();
    private _breakPoints: BreakPoints = new BreakPoints();
    private socket: net.Socket = null;
    constructor(socket: net.Socket) {
        this.socket = socket;
    }
    get frameValueRefs(): FrameValueRefs {
        return this._valueRefs;
    }
    get breakPoints(): BreakPoints {
        return this._breakPoints;
    }
    send(msg: string) {
        if (this.socket == null) {
            Util.log('[error]', '*client is null when send!');
            return;
        }
        this.socket.write(msg);
    }
    close(reason: number = 0) {
        if (this.socket != null) {
            this.socket.destroy();
            this.socket = null;
            Util.log('[comm]', '*client close, reason:' + reason);
        }
    }
    isNull(): boolean {
        return this.socket === null;
    }
}