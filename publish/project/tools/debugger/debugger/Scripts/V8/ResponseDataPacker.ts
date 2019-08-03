import net = require("net");
import { Util } from '../Util';
import { V8Notify } from './V8Notify'

export class ResponseDataPacker {
    private readonly packPatt = 'Content-Length: <pkglen>\r\n\r\n<pkg>';
    private recv = '';
    pack(response: V8Notify): string {
        let pkg = response.toJSONString();
        let s = this.packPatt.replace('<pkglen>', pkg.length.toString()).replace('<pkg>', pkg);
        if (response.islog)
            Util.log('[s->c]', pkg);
        return s;
    }
    clear() {
        this.recv = '';
    }
}