/**
 仅做测试用
*/
import net = require("net");
import fs = require('fs');

class SimpleProxy {
    private serverPort: number = 5858;
    private optTargetHost: string = '127.0.0.1';
    private optTargetPort: number = 8686;
    private targetStream: net.Socket = null;
    private server: net.Server = null;
    private clientStream: net.Socket = null;
    run() {
        console.log('Waiting for client connections on port ' + this.serverPort);
        this.server = net.createServer((socket) => {
            this.clientStream = socket;
            console.log('proxy client connected');
            socket.on('connection', (client) => {
            });
            socket.on('close', () => {
                console.log('***close:');
            });
            socket.on('data', (data) => {
                try {
                    let s = data.toString('utf-8');
                    console.log('<c->s>:' + s);
                    fs.appendFileSync('g:\\gdb.log', '\r\n---------------\r\n');
                    fs.appendFileSync('g:\\gdb.log', '<c->s>:' + s);
                    this.targetStream.write(s);
                }
                catch (e) {
                    console.log(e);
                }
            });
            this.connectToTarget();
        }).listen(this.serverPort);
    }

    private connectToTarget() {
        console.log('Connecting to ' + this.optTargetHost + ':' + this.optTargetPort + '...');
        this.targetStream = new net.Socket();
        this.targetStream.connect(this.optTargetPort, this.optTargetHost, () => {
            console.log('Debug transport connected');
            this.targetStream.on('data', (data) => {
                try {
                    let s = data.toString('utf-8');
                    console.log('<s->c>:' + s);
                    fs.appendFileSync('g:\\gdb.log', '\r\n---------------\r\n');
                    fs.appendFileSync('g:\\gdb.log', '<s->c>:' + s);
                    this.clientStream.write(s);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

new SimpleProxy().run();
//node --debug-brk=8686 --nolazy C:\client-src\client\trunk\project\tools\NodejsConsoleApp1\NodejsConsoleApp1\app.js
