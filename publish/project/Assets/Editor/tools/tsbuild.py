# python 3.x
import sys, os, re, shutil
import traceback, subprocess

class FileUtil:
    @staticmethod
    def findFiles(basepath, ext=''):
        rfiles = []
        for root, dirs, files in os.walk(basepath):
            for file in files:
                if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
                rfiles.append(root + os.sep + file)
        return rfiles
       
class Builder:
    def build(self, utsTool, tsSourcePath, jsTempPath, bytesCompiledPath):
        self._ts2jsBuild(tsSourcePath, jsTempPath)
        self._js2byteBuild(utsTool, jsTempPath, bytesCompiledPath)
            
    def _ts2jsBuild(self, tsSourcePath, jsTempPath):
        print('@build ts -> js')
        os.system('tsc --version')
        
        if os.path.exists(jsTempPath): 
          shutil.rmtree( jsTempPath )
          
        tsbuildcmd = r'tsc -p ' + tsSourcePath + ' --outDir ' + jsTempPath + ' --sourceMap --module amd --target ES5'
        os.system(tsbuildcmd)
        
    def _js2byteBuild(self, utsTool, jsTempPath, bytesCompiledPath):
        print('@build js -> bytes')

        bytesfiles = FileUtil.findFiles(bytesCompiledPath, 'bytes')
        for bytesfile in bytesfiles:
          os.remove(bytesfile)

        jsfiles = FileUtil.findFiles(jsTempPath, 'js')          
        for jsfile in jsfiles :
            jsfile = jsfile.replace('\\', '/')
            bytesfile = os.path.join(bytesCompiledPath, jsfile[len(jsTempPath) + 1:-3] + '.bytes')
            if not os.path.exists(os.path.dirname(bytesfile)): 
              os.makedirs(os.path.dirname(bytesfile))
            shutil.copy(jsfile, bytesfile)
        
def makeDefaultArgs(args):
    toolPath = sys.argv[0][0:sys.argv[0].replace('\\', '/').rfind('/')+1]
    args['utsTool'] = os.path.abspath(toolPath + 'uts')
    args['tsSourcePath'] = os.path.abspath(toolPath + '../../../TsScripts')
    args['jsTempPath'] = os.path.abspath(args['tsSourcePath'] + '/.dist')
    args['bytesCompiledPath'] =  os.path.abspath(toolPath + '../../../Assets/AssetSources/tsbytes')

def main():
    try:
        args = {}
        makeDefaultArgs(args)
        print('------------------')
        print('usage: \n python tsbuild.py --utsTool xxx --tsSourcePath xxx --jsTempPath xxx --bytesCompiledPath xxx')
        print('------------------')
        
        for i in range(1, len(sys.argv), 2): 
            op = sys.argv[i][2:]
            value = sys.argv[i+1]
            args[op] = value;
            
        Builder().build(args['utsTool'], args['tsSourcePath'], args['jsTempPath'], args['bytesCompiledPath'])
        
    except Exception as e:
        print(traceback.format_exc());
main()


