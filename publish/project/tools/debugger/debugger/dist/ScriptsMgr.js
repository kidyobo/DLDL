"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function findFiles(path, ext, filesList) {
    if (ext === void 0) { ext = ''; }
    if (filesList === void 0) { filesList = null; }
    filesList = filesList ? filesList : [];
    var files = fs.readdirSync(path);
    files.forEach(walk);
    function walk(file) {
        var states = fs.statSync(path + '/' + file);
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
var ScriptType;
(function (ScriptType) {
    ScriptType[ScriptType["Native"] = 0] = "Native";
    ScriptType[ScriptType["Extension"] = 1] = "Extension";
    ScriptType[ScriptType["Normal"] = 2] = "Normal";
    ScriptType[ScriptType["Wasm"] = 3] = "Wasm";
})(ScriptType || (ScriptType = {}));
;
var ScriptsMgr = (function () {
    function ScriptsMgr() {
    }
    Object.defineProperty(ScriptsMgr, "workPath", {
        get: function () {
            return this._workPath;
        },
        enumerable: true,
        configurable: true
    });
    ScriptsMgr.initScripts = function (workPath) {
        this._workPath = workPath;
        this.scripts = [];
        var files = findFiles(this._workPath, 'js');
        for (var i = 0; i < files.length; i++) {
            var fname = files[i].replace(/\//g, '\\');
            var script = {
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
            };
            this.scripts.push(script);
        }
    };
    ScriptsMgr.getScript = function (scriptName) {
        var fname = scriptName.replace(/\//g, '\\').toLowerCase();
        for (var _i = 0, _a = this.scripts; _i < _a.length; _i++) {
            var script = _a[_i];
            if (script.name.toLowerCase() == fname)
                return script;
        }
        return null;
    };
    ScriptsMgr.getScriptById = function (id) {
        for (var _i = 0, _a = this.scripts; _i < _a.length; _i++) {
            var script = _a[_i];
            if (script.id == id)
                return script;
        }
        return null;
    };
    ScriptsMgr.getScripts = function () {
        return this.scripts;
    };
    ScriptsMgr.getScriptShortName = function (id) {
        var script = this.getScriptById(id);
        return script.name.substring(this.workPath.length + 1, script.name.length - 3).replace(/\\/g, '/');
    };
    ScriptsMgr.hasScript = function (script) {
        return this.getScript(script) !== null;
    };
    ScriptsMgr.makeFullPath = function (script) {
        console.log('script:' + script);
        if (script.indexOf(this.workPath) < 0) {
            script = this.workPath + "\\" + script;
            if (!script.match(new RegExp('\.js$'))) {
                script += '.js';
            }
        }
        return script;
    };
    ScriptsMgr.getScriptId = function (script) {
        var scriptobj = this.getScript(script);
        return scriptobj !== null ? scriptobj.id : -1;
    };
    return ScriptsMgr;
}());
ScriptsMgr.scripts = [];
ScriptsMgr._workPath = '';
exports.ScriptsMgr = ScriptsMgr;
//# sourceMappingURL=ScriptsMgr.js.map