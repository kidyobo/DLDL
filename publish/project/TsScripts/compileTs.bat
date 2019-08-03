@echo off
TortoiseProc.exe /command:update /path:"..\Assets\AssetSources\data" /closeonend:2
echo [svn] updated data.（更新json表格）
TortoiseProc.exe /command:update /path:"..\Assets\AssetSources\binarydata" /closeonend:2
echo [svn] updated binarydata.（更新json表格bin文件）
cd %cd%
echo [ts] compiling ts scripts...（编译ts脚本中）
echo  　...
echo        别关窗口，编译完之后这个窗口会自己关的
tsc
echo compile done

pause