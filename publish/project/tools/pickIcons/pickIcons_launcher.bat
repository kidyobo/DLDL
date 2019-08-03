:: pickIcons启动脚本
:: @teppei, 2016/12/8

@echo off
setlocal enabledelayedexpansion

title pickIcons@teppei

REM 构建配置文件
set launcher_srcDir="F:\FYMTools\Develop\ClientRes\icon"
set launcher_dstDir="F:\FYMClient\trunk\project\Assets\AssetSources\icon"
set launcher_logPath="pickIcons_log_!date:~0,4!!date:~5,2!!date:~8,2!!time:~0,2!!time:~3,2!!time:~6,2!.log"

perl pickIcons.pl %launcher_srcDir% %launcher_dstDir% %launcher_logPath%

: END
endlocal enabledelayedexpansion
@pause