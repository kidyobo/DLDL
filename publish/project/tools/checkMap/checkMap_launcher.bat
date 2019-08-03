:: checkMap启动脚本
:: @teppei, 2017/5/31

@echo off
setlocal enabledelayedexpansion

title checkMap@teppei

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
    ::游戏配置
    set launcher_gameConfig="config\game\mgame.ini"
) else (
    echo 未知版本！
	goto END
)

REM 构建配置文件
set launcher_envConfig="config\env\TEPPEI-PC.ini"
set launcher_logPath="log\checkMap_log_!date:~0,4!!date:~5,2!!date:~8,2!!time:~0,2!!time:~3,2!!time:~6,2!.log"

REM 建立log文件夹
if not exist log (
	mkdir log
)

perl checkMap.pl %launcher_envConfig% %launcher_gameConfig% %launcher_logPath%

: END
endlocal enabledelayedexpansion
@pause