import fs = require('fs');

function findFiles(path, ext = '', filesList = null): Array<string> {
    filesList = filesList ? filesList : [];
    let files = fs.readdirSync(path);
    files.forEach(walk);
    function walk(file) {
        let states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            findFiles(path + '/' + file, ext, filesList);
        }
        else {
            if (file.match(new RegExp('\.' + ext + '$')))
                filesList.push(path + '/' + file);
        }
    }
    return filesList;
}

enum ScriptType {
    Native = 0,
    Extension = 1,
    Normal = 2,
    Wasm = 3
};

interface Script {
    handle: number;
    id: number;
    type: string;
    name: string;
    lineOffset: number;
    columnOffset: number;
    lineCount: number;
    sourceStart: string;
    sourceLength: number;
    scriptType: ScriptType;
    compilationType: number;
    context: { ref: number };
    text: string;
}

export class ScriptsMgr {
    private static scripts: Array<Script> = [];
    private static _workPath: string = '';
    static get workPath(): string {
        return this._workPath;
    }
    static initScripts(workPath) {
        this._workPath = workPath;
        this.scripts = [];
        let files = findFiles(this._workPath, 'js');
        for (let i = 0; i < files.length; i++) {
            let fname = files[i].replace(/\//g, '\\');
            let script = {
                handle: (i + 1),
                id: (i + 1),
                type: "script",
                name: fname,
                lineOffset: 0,
                columnOffset: 0,
                lineCount: 0,
                sourceStart: "",
                sourceLength: 0,
                scriptType: ScriptType.Normal,
                compilationType: 0,
                context: { ref: 0 },
                text: "",
            }
            this.scripts.push(script);
        }
    }
    static getScript(scriptName: string): Script {
        let fname = scriptName.replace(/\//g, '\\').toLowerCase();
        for (let script of this.scripts) {
            if (script.name.toLowerCase() == fname) return script;
        }
        return null;
    }
    static getScriptById(id: number): Script {
        for (let script of this.scripts) {
            if (script.id == id) return script;
        }
        return null;
    }
    static getScripts(): Array<Script> {
        return this.scripts;
    }
    static getScriptShortName(id: number): string {
        let script = this.getScriptById(id);
        return script.name.substring(this.workPath.length + 1, script.name.length - 3).replace(/\\/g, '/');
    }
    static hasScript(script: string): boolean {
        return this.getScript(script) !== null;
    }
    static makeFullPath(script: string): string {
        console.log('script:' + script);
        if (script.indexOf(this.workPath) < 0) {
            script = this.workPath + "\\" + script;
            if (!script.match(new RegExp('\.js$'))) {
                script += '.js';
            }
        }
        return script;
    }
    static getScriptId(script: string): number {
        let scriptobj = this.getScript(script);
        return scriptobj !== null ? scriptobj.id : -1;
    }
}
