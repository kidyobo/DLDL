# -*- coding: UTF-8 -*-
import os, re, hashlib, shutil, subprocess
import json

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
    def read(fname):
        with open(fname,'rb') as f:
            s = f.read()
            return s
path = r'C:\client-src\client\trunk\project\publish\RawResources\MapTiles'
sceneconf = r'C:\client-src\client\trunk\project\Assets\AssetSources\data\SceneConfigM.json'

maxtitles = 350
patt = re.compile(r'MapTiles\\(\d+)')
maptiles = {}
maps = set()
files = FileUtil.findFiles(path, 'webp')
for f in files:
    mapid = patt.search(f).group(1)
    if maptiles.get(mapid, None) == None:
        maptiles[mapid] = 0
    maptiles[mapid] = maptiles[mapid] + 1
    maps.add(int(mapid))

largemaps = []
for mapid in maptiles:
    if (maptiles[mapid] > maxtitles): largemaps.append(int(mapid))
        
largemaps.sort()
print('----------\nlarge maps: %d' % len(largemaps))
for mapid in largemaps:
    print(mapid)
    
conf = json.loads(FileUtil.read(sceneconf).decode('utf-8'))
print('----------\nunused maps')
for mapid in maps:
    find = False
    for c in conf:
        if int(c['m_iResourceID']) == mapid:
            find = True
            break
    if not find :
        print(mapid)
        
print('----------\nmiss maps')        
for c in conf:
    find = False
    for mapid in maps:
        if int(c['m_iResourceID']) == mapid:
            find = True
            break
    if not find :
        print('sceneid: %d, resid: %d'%(c['m_iSceneID'], c['m_iResourceID']))
        
