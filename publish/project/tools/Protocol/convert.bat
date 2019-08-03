@echo off

TITLE 手游协议结构生成工具@teppei

setlocal enabledelayedexpansion

echo =================转换手游前端协议=================

set ver=%1

if not defined ver (
	set /p ver=	请输入版本类型，M/m表示手游版：
)

set isFYM=0
if %ver%==M (
	set isFYM=1
) else if %ver%==m (
	set isFYM=1
)

if %isFYM%==1 (
    ::xml的源路径
    set sourcePath=https://fygame-svn:8080/svn/TBSVR/branches/FYMSVR/protocol
    ::ts的目的路径
    set targetPath=https://fygame-svn:8080/svn/FYMClient/trunk/project/TsScripts/System/protocol
    ::ss.byte的目的路径
    set ssBytePath=https://fygame-svn:8080/svn/FYMClient/trunk/project/Assets/AssetSources/net
    REM temp路径
    set tempPath=tempFYM
) else (
    echo 未知版本！
	goto END
)

::app的地址
set appPath=https://fygame-svn:8080/svn/FYMClient/trunk/project/tools/FYMProtocolTool/bin-debug

echo ^>^>开始时间：!time:~0,2!:!time:~3,2!:!time:~6,2!

if not exist %tempPath% (
	mkdir %tempPath%
)

echo ^>^>拉取协议配置...
rmdir %tempPath%\xmlProtocol /S /Q
svn checkout -q --depth=empty %sourcePath% %tempPath%\xmlProtocol
svn update -q %tempPath%\xmlProtocol\Common.xml
svn update -q %tempPath%\xmlProtocol\ProtoType.xml
svn update -q %tempPath%\xmlProtocol\CS.xml
svn update -q %tempPath%\xmlProtocol\SS.bin

echo ^>^>更新协议库...
if exist %tempPath%\svnTs (
	svn update -q %tempPath%\svnTs >nul
) else (
	svn checkout -q %targetPath% %tempPath%\svnTs >nul
)

echo ^>^>拉取最新的转换程序...
rmdir %tempPath%\app /S /Q
svn checkout -q %appPath% %tempPath%\app

echo ^>^>开始转换协议...(!time:~0,2!:!time:~3,2!:!time:~6,2!)
rmdir %tempPath%\tsProtocol /S /Q
adl\adl.exe %tempPath%\app\FyMProtocolTool-app.xml -- %COMPUTERNAME% 1 1 %tempPath%\xmlProtocol %tempPath%\svnTs
	
echo ^>^>提交新的协议入库...(!time:~0,2!:!time:~3,2!:!time:~6,2!)
svn add -q %tempPath%\svnTs\* >nul 2>nul
svn add -q %tempPath%\svnTs\new\* >nul 2>nul
svn commit -q -m "正在commit协议ts" %tempPath%\svnTs >nul 2>nul

echo ^>^>更新ss.bytes...
rmdir %tempPath%\svnSSByte /S /Q
svn checkout -q --depth=empty %ssBytePath% %tempPath%\svnSSByte
svn update -q %tempPath%\svnSSByte\ss.bytes
echo ^>^>提交ss.bytes
copy %tempPath%\xmlProtocol\SS.bin %tempPath%\svnSSByte\ss.bytes /Y
svn commit -q -m "正在commit ss.bytes" %tempPath%\svnSSByte >nul 2>nul


echo ^>^>转换结束：!time:~0,2!:!time:~3,2!:!time:~6,2!

: END
@pause