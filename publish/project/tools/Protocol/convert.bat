@echo off

TITLE ����Э��ṹ���ɹ���@teppei

setlocal enabledelayedexpansion

echo =================ת������ǰ��Э��=================

set ver=%1

if not defined ver (
	set /p ver=	������汾���ͣ�M/m��ʾ���ΰ棺
)

set isFYM=0
if %ver%==M (
	set isFYM=1
) else if %ver%==m (
	set isFYM=1
)

if %isFYM%==1 (
    ::xml��Դ·��
    set sourcePath=https://fygame-svn:8080/svn/TBSVR/branches/FYMSVR/protocol
    ::ts��Ŀ��·��
    set targetPath=https://fygame-svn:8080/svn/FYMClient/trunk/project/TsScripts/System/protocol
    ::ss.byte��Ŀ��·��
    set ssBytePath=https://fygame-svn:8080/svn/FYMClient/trunk/project/Assets/AssetSources/net
    REM temp·��
    set tempPath=tempFYM
) else (
    echo δ֪�汾��
	goto END
)

::app�ĵ�ַ
set appPath=https://fygame-svn:8080/svn/FYMClient/trunk/project/tools/FYMProtocolTool/bin-debug

echo ^>^>��ʼʱ�䣺!time:~0,2!:!time:~3,2!:!time:~6,2!

if not exist %tempPath% (
	mkdir %tempPath%
)

echo ^>^>��ȡЭ������...
rmdir %tempPath%\xmlProtocol /S /Q
svn checkout -q --depth=empty %sourcePath% %tempPath%\xmlProtocol
svn update -q %tempPath%\xmlProtocol\Common.xml
svn update -q %tempPath%\xmlProtocol\ProtoType.xml
svn update -q %tempPath%\xmlProtocol\CS.xml
svn update -q %tempPath%\xmlProtocol\SS.bin

echo ^>^>����Э���...
if exist %tempPath%\svnTs (
	svn update -q %tempPath%\svnTs >nul
) else (
	svn checkout -q %targetPath% %tempPath%\svnTs >nul
)

echo ^>^>��ȡ���µ�ת������...
rmdir %tempPath%\app /S /Q
svn checkout -q %appPath% %tempPath%\app

echo ^>^>��ʼת��Э��...(!time:~0,2!:!time:~3,2!:!time:~6,2!)
rmdir %tempPath%\tsProtocol /S /Q
adl\adl.exe %tempPath%\app\FyMProtocolTool-app.xml -- %COMPUTERNAME% 1 1 %tempPath%\xmlProtocol %tempPath%\svnTs
	
echo ^>^>�ύ�µ�Э�����...(!time:~0,2!:!time:~3,2!:!time:~6,2!)
svn add -q %tempPath%\svnTs\* >nul 2>nul
svn add -q %tempPath%\svnTs\new\* >nul 2>nul
svn commit -q -m "����commitЭ��ts" %tempPath%\svnTs >nul 2>nul

echo ^>^>����ss.bytes...
rmdir %tempPath%\svnSSByte /S /Q
svn checkout -q --depth=empty %ssBytePath% %tempPath%\svnSSByte
svn update -q %tempPath%\svnSSByte\ss.bytes
echo ^>^>�ύss.bytes
copy %tempPath%\xmlProtocol\SS.bin %tempPath%\svnSSByte\ss.bytes /Y
svn commit -q -m "����commit ss.bytes" %tempPath%\svnSSByte >nul 2>nul


echo ^>^>ת��������!time:~0,2!:!time:~3,2!:!time:~6,2!

: END
@pause