@echo off
TortoiseProc.exe /command:update /path:"..\Assets\AssetSources\data" /closeonend:2
echo [svn] updated data.������json���
TortoiseProc.exe /command:update /path:"..\Assets\AssetSources\binarydata" /closeonend:2
echo [svn] updated binarydata.������json���bin�ļ���
cd %cd%
echo [ts] compiling ts scripts...������ts�ű��У�
echo  ��...
echo        ��ش��ڣ�������֮��������ڻ��Լ��ص�
tsc
echo compile done

pause