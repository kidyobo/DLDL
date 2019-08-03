//
// 脚本的加载路径和扩展名
//
class ScriptEnvironment {
    static get Workspace(): string {
        if (Game.ResLoader.isPublish) {
            return "tsbytes/";
        } else {
            return "TsScripts/.dist/";
        }
    }

    static get Ext(): string {
        if (Game.ResLoader.isPublish) {
            return ".bytes";
        } else {
            return ".js";
        }
    }
}

//
// sourcemap的解析类
// 格式说明文档：https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1
//
interface SourceMapSpan {
    /** Line number in the .js file. */
    emittedLine: number;
    /** Column number in the .js file. */
    emittedColumn: number;
    /** Line number in the .ts file. */
    sourceLine: number;
    /** Column number in the .ts file. */
    sourceColumn: number;
    /** Optional name (index into names array) associated with this span. */
    nameIndex?: number;
    /** .ts file (index into sources array) associated with this span */
    sourceIndex: number;
}

interface MapLines {
    [index: string]: Array<SourceMapSpan>;
}

interface SMap {
    version: string,
    exist: boolean,
    file: string,
    sourceRoot: string,
    sources: Array<string>,
    names: Array<string>,
    maplines: MapLines,
}

module SourceMapDecoder {
    let sourceMapMappings: string;
    let sourceMapNames: string[];
    let decodingIndex: number;
    let prevNameIndex: number;
    let decodeOfEncodedMapping: SourceMapSpan;
    let errorDecodeOfEncodedMapping: string;

    export function initializeSourceMapDecoding(map: SMap, mapraw: string) {
        sourceMapMappings = mapraw;
        sourceMapNames = map.names;
        decodingIndex = 0;
        prevNameIndex = 0;
        decodeOfEncodedMapping = {
            emittedLine: 1,
            emittedColumn: 1,
            sourceLine: 1,
            sourceColumn: 1,
            sourceIndex: 0,
        };
        errorDecodeOfEncodedMapping = undefined;
    }

    function isSourceMappingSegmentEnd() {
        if (decodingIndex == sourceMapMappings.length) {
            return true;
        }

        if (sourceMapMappings.charAt(decodingIndex) == ",") {
            return true;
        }

        if (sourceMapMappings.charAt(decodingIndex) == ";") {
            return true;
        }

        return false;
    }

    export function decodeNextEncodedSourceMapSpan() {
        errorDecodeOfEncodedMapping = undefined;

        function createErrorIfCondition(condition: boolean, errormsg: string) {
            if (errorDecodeOfEncodedMapping) {
                // there was existing error:
                return true;
            }

            if (condition) {
                errorDecodeOfEncodedMapping = errormsg;
            }

            return condition;
        }

        function base64VLQFormatDecode() {
            function base64FormatDecode() {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(sourceMapMappings.charAt(decodingIndex));
            }

            let moreDigits = true;
            let shiftCount = 0;
            let value = 0;

            for (; moreDigits; decodingIndex++) {
                if (createErrorIfCondition(decodingIndex >= sourceMapMappings.length, "Error in decoding base64VLQFormatDecode, past the mapping string")) {
                    return;
                }

                // 6 digit number
                const currentByte = base64FormatDecode();

                // If msb is set, we still have more bits to continue
                moreDigits = (currentByte & 32) !== 0;

                // least significant 5 bits are the next msbs in the final value.
                value = value | ((currentByte & 31) << shiftCount);
                shiftCount += 5;
            }

            // Least significant bit if 1 represents negative and rest of the msb is actual absolute value
            if ((value & 1) === 0) {
                // + number
                value = value >> 1;
            }
            else {
                // - number
                value = value >> 1;
                value = -value;
            }

            return value;
        }

        while (decodingIndex < sourceMapMappings.length) {
            if (sourceMapMappings.charAt(decodingIndex) == ";") {
                // New line
                decodeOfEncodedMapping.emittedLine++;
                decodeOfEncodedMapping.emittedColumn = 1;
                decodingIndex++;
                continue;
            }

            if (sourceMapMappings.charAt(decodingIndex) == ",") {
                // Next entry is on same line - no action needed
                decodingIndex++;
                continue;
            }

            // Read the current span
            // 1. Column offset from prev read jsColumn
            decodeOfEncodedMapping.emittedColumn += base64VLQFormatDecode();
            // Incorrect emittedColumn dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.emittedColumn < 1, "Invalid emittedColumn found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after emitted column")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 2. Relative sourceIndex
            decodeOfEncodedMapping.sourceIndex += base64VLQFormatDecode();
            // Incorrect sourceIndex dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceIndex < 0, "Invalid sourceIndex found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source span
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after sourceIndex")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 3. Relative sourceLine 0 based
            decodeOfEncodedMapping.sourceLine += base64VLQFormatDecode();
            // Incorrect sourceLine dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceLine < 1, "Invalid sourceLine found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after emitted Line")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 4. Relative sourceColumn 0 based
            decodeOfEncodedMapping.sourceColumn += base64VLQFormatDecode();
            // Incorrect sourceColumn dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceColumn < 1, "Invalid sourceLine found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // 5. Check if there is name:
            if (!isSourceMappingSegmentEnd()) {
                prevNameIndex += base64VLQFormatDecode();
                decodeOfEncodedMapping.nameIndex = prevNameIndex;
                // Incorrect nameIndex dont support this map
                if (createErrorIfCondition(decodeOfEncodedMapping.nameIndex < 0 || decodeOfEncodedMapping.nameIndex >= sourceMapNames.length, "Invalid name index for the source map entry")) {
                    return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
                }
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(!isSourceMappingSegmentEnd(), "Unsupported Error Format: There are more entries after " + (decodeOfEncodedMapping.nameIndex === -1 ? "sourceColumn" : "nameIndex"))) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // Populated the entry
            return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
        }

        createErrorIfCondition(/*condition*/ true, "No encoded entry found");
        return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
    }

    export function hasCompletedDecoding() {
        return decodingIndex === sourceMapMappings.length;
    }

    export function getRemainingDecodeString() {
        return sourceMapMappings.substr(decodingIndex);
    }
}

class SourceMap {
    private _maps: { [index: string]: SMap; } = {};

    public getSourceLine(file: string, line: number): { file: string, line: number } {
        let map = this.getMap(file)
        if (map == null) {
            Game.Log.logWarning('getMap by file:' + file + ' in getSourceLine failed!');
        }
        if (map == null || !map.exist) {
            return { file: file, line: -1 };
        }

        let lineSegments = map.maplines[line];
        if (lineSegments == null) {
            return { file: map.sources[0], line: -1 };
        }

        if (lineSegments[0] == null) {
            return { file: map.sources[0], line: -1 };
        }

        return { file: map.sources[0], line: lineSegments[0].sourceLine || 0 };
    }

    // 一次加载多个map文件（从网上或本地）
    public loadMaps(mapfiles: any[], callback: (mapfiles: any[]) => void) {
        function allLoadedNotify(allLoaded: boolean) {
            if (allLoaded) {
                callback(mapfiles);
            }
        }

        if (mapfiles.length == 0) {
            allLoadedNotify(true);
            return;
        }

        let loadedCount = 0;
        for (let i = 0; i < mapfiles.length; i++) {
            let map = mapfiles[i];
            let map_file = map.mapfile + '.map'
            if (this.getMap(map.mapfile) != null) {
                loadedCount++;
                allLoadedNotify(loadedCount == mapfiles.length);
                continue;
            }

            if (UnityEngine.Application.platform == UnityEngine.RuntimePlatform.WindowsEditor) {
                // 从本地同步读取map文件
                let s = uts.readAllText(map_file);
                this.makeMap(map_file, s);
                loadedCount++;
                allLoadedNotify(loadedCount == mapfiles.length);
            } else {
                // 从cdn上异步加载map文件
                let url = this.makeUrl(map_file);
                Game.ResLoader.LoadTextFromFullUrl(url, (error: string, context: string) => {
                    loadedCount++;
                    if (error == null || error == '') {
                        this.makeMap(map_file, context);
                    } else {
                        this.makeMap(map_file, null);
                    }
                    allLoadedNotify(loadedCount == mapfiles.length);
                });
            }
        }
    }

    private makeUrl(map_file: string): string {
        let url = Game.Config.remoteResUrl + 'assets/';
        if (UnityEngine.Application.platform == UnityEngine.RuntimePlatform.Android) {
            url += 'android/';
        } else if (UnityEngine.Application.platform == UnityEngine.RuntimePlatform.IPhonePlayer) {
            url += 'ios/';
        } else {
            url += 'windows/';
        }
        url += 'tsscriptmaps/' + map_file.replace(ScriptEnvironment.Workspace, '') + '?v=' + (new Date).getTime();
        return url;
    }

    private makeMap(map_file: string, s: string) {
        this._maps[map_file] = this.getEmptyMap()
        if (s != null && s != "") {
            let map = this._maps[map_file];
            map.exist = true;
            map.version = this.getFieldByName(s, 'version');
            map.file = this.getFieldByName(s, 'file');
            map.sourceRoot = this.getFieldByName(s, 'sourceRoot');
            map.sources = this.getFieldsByName(s, 'sources');
            map.names = this.getFieldsByName(s, 'names');
            map.maplines = this.getMaplines(s, 'mappings', map);
        }
    }

    private getMap(file: string): SMap {
        let map_file = file + '.map'
        return this._maps[map_file]
    }

    private getFieldByName(s: string, field: string): string {
        field = '\"' + field + '\":';
        let pos = s.indexOf(field);
        if (pos < 0) {
            return '';
        }

        pos += field.length;
        let startToken = s.charAt(pos);
        let endToken = '';
        if (startToken == '"') {
            endToken = '"';
            pos++;
        }
        else if (startToken == '[') {
            endToken = ']';
            pos++;
        }
        else {
            endToken = ',';
        }

        let endPos = s.indexOf(endToken, pos);
        if (endPos < 0 && endToken == ',') {
            endPos = s.indexOf('}', pos);
        }
        if (endPos < 0) {
            endPos = s.length;
        }
        return s.substring(pos, endPos);
    }

    private getFieldsByName(s: string, field: string): Array<string> {
        let value = this.getFieldByName(s, field);
        let arr = value.split(',');
        for (let i = 0, n = arr.length; i < n; i++) {
            if (arr[i].charAt(0) == '"') {
                arr[i] = arr[i].slice(1, -1);
            }
        }
        return arr;
    }

    private getMaplines(s: string, field: string, map: SMap): MapLines {
        let maplines: MapLines = {};
        let mapraw = this.getFieldByName(s, field);
        SourceMapDecoder.initializeSourceMapDecoding(map, mapraw);
        while (!SourceMapDecoder.hasCompletedDecoding()) {
            let rt = SourceMapDecoder.decodeNextEncodedSourceMapSpan();
            if (rt.error) return maplines;
            if (!maplines[rt.sourceMapSpan.emittedLine]) {
                maplines[rt.sourceMapSpan.emittedLine] = [];
            }

            maplines[rt.sourceMapSpan.emittedLine].push(this.cloneMapSpan(rt.sourceMapSpan));
        }
        return maplines;
    }

    private getEmptyMap(): SMap {
        return {
            version: '3',
            exist: false,
            file: '',
            sourceRoot: '',
            sources: null,
            names: null,
            maplines: null,
        };
    }

    private cloneMapSpan(s: SourceMapSpan): SourceMapSpan {
        return {
            emittedLine: s.emittedLine,
            emittedColumn: s.emittedColumn,
            sourceLine: s.sourceLine,
            sourceColumn: s.sourceColumn,
            nameIndex: s.nameIndex,
            sourceIndex: s.sourceIndex
        };
    }
}

//
// 异常上报处理，处理js堆栈帧到ts的映射
//
class BugReport {
    private static cacheStacks: { [hash: string]: boolean } = {};
    static report(e: any) {
        if (e.message != null && e.stack != null) {
            this.reportTrace(e.message + "\nstack:\n" + e.stack);
        }
        else if (e.stack != null) {
            this.reportTrace(e.stack);
        }
        else {
            this.reportTrace(e);
        }
    }

    private static reportTrace(s: string) {
        // 防止同一异常频繁出现时，一直从网上拉取map文件和向网上上报
        if (this.cacheStacks[Game.Tools.Md5(s)]) {
            return;
        }
        this.handleStack(s, (mapedstr: string) => {
            if (UnityEngine.Application.platform == UnityEngine.RuntimePlatform.WindowsEditor) {
                __bugReport(mapedstr);
            } else {
                Game.Log.logError(mapedstr);
            }
        });
    }

    private static handleStack(stack: string, callback: (mapedstr: string) => void): void {
        let sm = new SourceMap();
        let mapfiles = [];
        let newstack = '';
        let stacks = stack.split('\n');
        for (let frame of stacks) {
            frame = frame.trim().replace(/\\/g, '/');
            if (frame.length < 2) {
                newstack += this.framePrefix(false) + frame + '\n';
                continue;
            }

            let method = 'anon';
            let file = 'native';
            let lineno = 0;
            let colno = '';
            if (frame.charAt(0) == '#') {
                let groups = frame.match(/^#\d+\s+(\w*)\(\)\s+at\s+([\w\/]+):(\d+)/); // matching: #0 method() at file:1100
                if (groups == null) {
                    newstack += this.framePrefix(frame.indexOf('#') >= 0) + frame + '\n';
                    continue;
                }
                if (groups[1] != '') {
                    method = groups[1];
                }
                file = groups[2];
                lineno = Number(groups[3]);
            } else {
                let groups = frame.match(/^\s*([\w\/\@]+):(\d+):(\d+)/); // matching:  onLoad@System/utils/UrlUtil:28:26
                if (groups == null) {
                    newstack += this.framePrefix(frame.indexOf('@') >= 0) + frame + '\n';
                    continue;
                }
                file = groups[1];
                lineno = Number(groups[2]);
                colno = groups[3];
                if (file.indexOf('@') > 0) {
                    let gs = file.split('@');
                    method = gs[0];
                    file = gs[1];
                }
            }

            if (file == 'eval') {
                for (let i = define.codes_offset.length - 1; i >= 0; i--) {
                    let off = define.codes_offset[i];
                    if (lineno >= off.lineoffset) {
                        file = off.path;
                        lineno -= off.lineoffset;
                        break;
                    }
                }
            }

            let fullfile = file.indexOf('Assets') == 0 ? file : __workSpace() + file;
            let defaultframe = this.framePrefix(true) + 'at ' + method + ' ' + fullfile + '.js:' + lineno + ':' + colno + '\n';

            // 搜集所有的map文件，以便动态下载
            mapfiles.push({ mapfile: fullfile + '.js', defaultframe: defaultframe, lineno: lineno, method: method, colno: colno });
            newstack += '{' + fullfile + '.js' + '}';
        }

        sm.loadMaps(mapfiles, (mapfiles: any) => {
            for (let map of mapfiles) {
                let defaultframe = map.defaultframe;
                let newframe = defaultframe;
                let rt = sm.getSourceLine(map.mapfile, map.lineno);
                if (rt.line >= 0) {
                    newframe = this.framePrefix(true) + 'at ' + map.method + ' ' + map.mapfile.replace('.dist/', '').replace('.js', '.ts:') + rt.line + ':' + map.colno + '\n';
                }
                newstack = newstack.replace('{' + map.mapfile + '}', newframe);
            }
            this.cacheStacks[Game.Tools.Md5(stack)] = true;
            callback(newstack);
        });
    }

    private static framePrefix(need: boolean): string {
        return need ? '  #' : '';
    }
}
__reg_global('BugReport', BugReport);


//
// 处理import中相对路径的组合
// 
class PathCombiner {
    private pathstacks: string[] = [];
    combine(curPath: string) {
        let basePath = this.pathstacks[this.pathstacks.length - 1];
        if (!basePath)
            return curPath;
        if (curPath.indexOf('.') != 0)
            return curPath;
        let curPaths = curPath.split('/');
        let fullPaths = basePath.split('/');
        fullPaths.pop(); // pop file name
        for (var i = 0; i < curPaths.length; i++) {
            var c = curPaths[i];
            if (c == '..')
                fullPaths.pop();
            else if (c != '.')
                fullPaths.push(curPaths[i]);
        }
        return fullPaths.join('/');
    }
    push(path: string) {
        this.pathstacks.push(path);
    }
    pop() {
        this.pathstacks.pop();
    }
}


//
// 实现amd模式的define函数，处理js的amd散开的js文件加载
//
declare module define {
    export function require(path: string): any;
    export var codes_offset: Array<{ lineoffset: number, path: string }>;
    export var used: boolean;
}
(function () {
    var mods_define = {};
    var pathCombiner = new PathCombiner();
    var _define = function (arg1, arg2, arg3) {
        var id = null;
        var deps = null;
        var factory = null;
        if (arg3 != null) {
            id = arg1;
            deps = arg2;
            factory = arg3;
        } else {
            id = (_define as any).curmodule;
            deps = arg1;
            factory = arg2;
        }
        mods_define[id] = { deps: deps, factory: factory };
    };

    var mods = {};
    var _require = function (curid: string) {
        var id = pathCombiner.combine(curid);
        var mod = mods[id];
        if (!mod) {
            mod = { exports: {} };
            mods[id] = mod;
            var def = mods_define[id];
            if (!def) {
                return mod.exports;
            }

            pathCombiner.push(id);
            var deps_args = [_require, mod.exports];
            for (var i = 2, n = def.deps.length; i < n; i++) {
                var dep_id = def.deps[i];
                deps_args.push(_require(dep_id));
            }
            pathCombiner.pop();
            def.factory.apply(def.factory, deps_args);
            delete mods_define[id];
        }
        return mod.exports;
    };

    (_define as any).require = _require;
    (_define as any).codes_offset = [];
    (_define as any).used = false;
    __reg_global('define', _define);
})();


//
// 脚本加载器，实现加载指定路径的脚本文件文本
//
class ScriptLoader {
    loadScript(path: string): string {
        path = this.getScriptPath(path);
        if (Game.ResLoader.isPublish) {
            let parent = this.getDirectoryName(path);
            let assetPath = parent == "tsbytes" ? path : parent;
            var asset = Game.ResLoader.LoadAsset(assetPath);
            if (asset == null) {
                Game.Log.logError('load asset failed: ' + assetPath);
            }
            return (asset.Load(path) as UnityEngine.TextAsset).text;

        } else {
            return __read_alltext(path);
        }
    }

    private getScriptPath(relPath: string): string {
        return ScriptEnvironment.Workspace + relPath + ScriptEnvironment.Ext;
    }

    private getDirectoryName(path: string) {
        let pos = path.lastIndexOf('/');
        return path.substring(0, pos);
    }
}


//
// AMD模式下的散开文件的合并处理类，解决在javascriptcore在模拟器上多线程加载多个脚本卡死现象
//
class AMDCodesMerger {
    private modules = {};
    private codes: string[] = [];
    private scriptLoader: ScriptLoader = null;
    private pathCombiner: PathCombiner = null;
    private curCodeOffset: number = 1;
    private codesOffset: Array<{ lineoffset: number, path: string }> = [];
    constructor(scriptLoader: ScriptLoader) {
        this.scriptLoader = scriptLoader;
        this.pathCombiner = new PathCombiner();
    }

    merge(path: string): string {
        this.mergeCode(path);
        define.codes_offset = this.codesOffset;
        return this.codes.join('');
    }

    private mergeCode(refpath: string) {
        var path = this.pathCombiner.combine(refpath);

        if (this.modules[path])
            return;

        this.pathCombiner.push(path);
        this.modules[path] = true;
        let code = this.scriptLoader.loadScript(path);
        let startpos = code.indexOf('define(["');
        if (startpos >= 0) {
            let endpos = code.indexOf(']', startpos);
            let depss = code.substring(startpos + 7, endpos + 1);
            let deps = JSON.parse(depss);
            for (let i = 2, n = deps.length; i < n; i++) {
                this.mergeCode(deps[i]);
            }
        }
        this.pathCombiner.pop();

        this.codesOffset.push({ lineoffset: this.curCodeOffset, path: path })
        this.curCodeOffset++;
        this.codes.push("define.curmodule = '");
        this.codes.push(path);
        this.codes.push("';\n");

        this.curCodeOffset += this.getLines(code);
        this.codes.push(code);
        this.curCodeOffset++;
        this.codes.push("\n");
    }

    private getLines(code: string): number {
        let count = 0;
        let pos = 0;
        while (true) {
            pos = code.indexOf('\n', pos);
            if (pos >= 0) {
                pos++;
                count++;
            } else {
                break;
            }
        }
        return count;
    }
}

//
// 兼容amd和commonjs的处理（兼容已发布的老版本commonjs模式）
//
function main() {
    let t = UnityEngine.Time.realtimeSinceStartup;
    let appPath = 'app';
    let scriptLoader = new ScriptLoader();
    let code = scriptLoader.loadScript(appPath);
    let isAMDSingleFileMode = code.indexOf('define("') >= 0;
    let isAMDMultiFilesMode = code.indexOf('define(["') >= 0;
    if (isAMDSingleFileMode || isAMDMultiFilesMode) {
        define.used = true;
        if (isAMDMultiFilesMode) {
            code = new AMDCodesMerger(scriptLoader).merge(appPath);
        }
        Game.Log.log('amd');
        eval(code);
        define.require(appPath);
    } else {
        Game.Log.log('commonjs');
        require(appPath);
    }
    Game.Log.log('load script time:' + (UnityEngine.Time.realtimeSinceStartup - t));
}

try {
    main();
} catch (e) {
    BugReport.report(e);
}
