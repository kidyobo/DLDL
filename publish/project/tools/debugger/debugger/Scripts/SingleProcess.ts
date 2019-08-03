import net = require("net");
export class SingleProcess {
    static ins = new SingleProcess();

    private mutexServer = null;
    private called = false;
    private portadd = 100;
    enterMutex(port: number, setStartScript: (startScript: string) => void) {
        this.mutexServer = net.createServer((socket) => {
            let d = '';
            socket.on('close', () => {
                socket.destroy();
            });
            socket.on('error', (data) => {
                socket.destroy();
            });
            socket.on('data', (data) => {
                try {
                    d = d + data;
                    if (d.charAt(d.length - 1) == '#') { // notify scriptPath   c:\xx\xx\xxx.js#
                        setStartScript(d.substr(0, d.length - 1));
                        socket.destroy();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        }).listen(port + this.portadd);
    }
    check(host: string, port: number, caller) {
        let socket = new net.Socket();
        socket.connect(port + this.portadd, host, () => {
            if (!this.called) {
                caller('running', socket);
                this.called = true;
            }
        });
        socket.on('close', () => {
            if (!this.called) {
                caller('stop', socket);
                this.called = true;
            }
        });
        socket.on('error', (data) => {
            if (!this.called) {
                caller('stop', socket);
                this.called = true;
            }
        });
    }
}
