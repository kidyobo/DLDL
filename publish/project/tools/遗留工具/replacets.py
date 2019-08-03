# -*- coding: UTF-8 -*-
# ts中import的路径大小写于实际路径不同，导致debugger无法断点调试
# 用此工具统一将import的路径格式化为正确的大小写相同的路径

#pip install findfiles
import os, re, shutil, codecs, chardet
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
    @staticmethod
    def read(fname, mod='rb', size=0):
        try:
            with open(fname, mod) as f:
                if size == 0:
                    return f.read()
                else:
                    return f.read(size)
        except:
            return ''
    @staticmethod
    def getBOM(f):
        s = FileUtil.read(f, size=3)
        if len(s) == 3 and s[0] == 0xef and s[1] == 0xbb and s[2] == 0xbf:
            return 'UTF-8'
        elif len(s) >= 2 and s[0] == 0xff and s[1] == 0xfe:
            return 'UTF-16'
        return ''
    @staticmethod
    def cread(fname, mod='rb',encoding="gbk"):
        try:
            with codecs.open(fname,mod,encoding) as f:
                return f.read()
        except:
            return None
    @staticmethod
    def cwrite(filePath,u,encoding="utf_8_sig"):
        try:
            with codecs.open(filePath,"w",encoding) as f:
                f.write(u)
        except:
            pass


#--
mods = {}
base = r'C:\client-src\client\trunk\project\TsScripts'
files = FileUtil.findFiles(base, r'ts')
for f in files:
    mod = f[len(base)+1:-3].replace('\\', '/')
    mods[mod.lower()] = mod


specails = {
'./mapfloor':'System/map/mapfloor',
'./mapobjects':'System/map/mapobjects',
'./mapCameraSetting':'System/map/mapCameraSetting',
'../global':'System/global',
'./map':'System/map/map',
'./UiElements':'System/uilib/UiElements'
}

patt1 = re.compile(r'(.*)import\s+\{(.*)\}\s*from\s*([\'\"])(.*)(?=["\'])')
patt2 = re.compile(r'(.*)import\s+(\w+)\s+from\s*([\'\"])(.*)(?=["\'])')
for f in files:
    s = FileUtil.cread(f, encoding="utf8")
    def rep(matched):
        head = matched.group(1)
        if head.startswith('//') :
            return matched.group(0)
        modname = matched.group(2)
        quote = matched.group(3)
        mod = matched.group(4).replace('//', '/')
        
        if mod.startswith('unit/'): mod = 'System/' + mod
        elif specails.get(mod, None) != None: mod = specails[mod]
        
        validmod = mods.get(mod.lower(), None)
        if validmod == None:
            print(mod)
            
        rt = 'import { ' + modname.strip() + ' } from ' + quote + validmod
        #print (matched.group(0) + ' -> ' + rt)
        return rt
    s = patt1.sub(rep, s)
    s = patt2.sub(rep, s)
    encoding = 'utf_8_sig'
    if FileUtil.getBOM(f) == 'UTF-8' : 
        encoding = 'utf-8'
    FileUtil.cwrite(f, s, encoding=encoding)

