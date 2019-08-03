# -*- coding: UTF-8 -*-
import os, re, hashlib, shutil, subprocess

def syscall(s):
    print(s)
    p = subprocess.Popen(s, stdin = subprocess.PIPE, stdout = subprocess.PIPE, stderr = subprocess.STDOUT, shell = False)
    print (p.communicate()[0].decode('UTF-8'))
    
class FileUtil:
    @staticmethod
    def findFiles(basepath, ext=''):
        rfiles = []
        for root, dirs, files in os.walk(basepath):
            for file in files:
                if ext != '' and re.search(r'\.(' + ext + r')$', file, re.IGNORECASE) == None: continue
                rfiles.append(root + os.sep + file)
        return rfiles
    @staticmethod
    def xcp(srcpath, despath, ext):
        files = FileUtil.findFiles(srcpath, ext)
        print ('copy files count:' + str(len(files)))
        for f in files:
            df = f.replace(srcpath, despath)
            ddir = os.path.dirname(df)
            if not os.path.exists(ddir):
                os.makedirs(ddir)
            shutil.copy(f, df)
        print ('copy finished!')
            

srcPath = r'F:\work\my\arts\Develop\ClientRes\maps'
desPath = r'C:\client-src\client\trunk\project\Assets\AssetSources\map\config'


def deleteAllByteFiles():
    exceptFile = 'objects.bytes' 
    files = FileUtil.findFiles(desPath, 'bytes')
    for f in files:
        if f[-len(exceptFile):] != exceptFile:
            os.remove(f)

def changeType(ext, srcpatt, despatt):
    files = FileUtil.findFiles(desPath, ext)
    for f in files:
        nf = f.replace(srcpatt,  despatt)
        print(f + ' -> ' + nf)
        if os.path.exists(nf): os.remove(nf)
        os.rename(f, nf)

syscall(r'svn up ' + srcPath)
syscall(r'svn up ' + desPath)
deleteAllByteFiles()
FileUtil.xcp(srcPath, desPath, 'rsc')
FileUtil.xcp(srcPath, desPath, 'ref')
changeType('rsc', r'data.rsc', 'mapData.bytes')
changeType('ref', r'.ref', '.bytes')
syscall(r'svn add ' + desPath + r'\* --force')
syscall(r'svn commit ' + desPath + r'\* -m "地图配置自动提交"')