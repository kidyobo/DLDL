/**
 * 对来自客户端工具发来的请求进行组包
 */
import { Util } from '../Util';

export class RequestDataCombiner {
    private readonly endToken = '\r\n\r\n'
    private readonly recvPackLenPatt = /Content-Length:\s+(\d+)/;
    private recv = '';
    combine(data): Array<any> {
        this.recv += data.toString('utf8');
        let reqs = new Array();
        while (true) {
            let pos = this.recv.indexOf(this.endToken);
            if (pos < 0) break;

            let arr = this.recvPackLenPatt.exec(this.recv);
            let datasize = Number(arr[1]);
            let pkgpos = pos + this.endToken.length;
            if (this.recv.length < pkgpos + datasize) break;

            let pkg = this.recv.substr(pkgpos, datasize);
            Util.log('[c->s]', pkg);
            reqs.push(JSON.parse(pkg));

            this.recv = this.recv.substr(pkgpos + datasize);
        }
        return reqs;
    }
    clear() {
        this.recv = '';
    }
}