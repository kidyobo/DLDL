:: checkMap�����ű�
:: @teppei, 2017/5/31

@echo off
setlocal enabledelayedexpansion

title checkMap@teppei

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
    ::��Ϸ����
    set launcher_gameConfig="config\game\mgame.ini"
) else (
    echo δ֪�汾��
	goto END
)

REM ���������ļ�
set launcher_envConfig="config\env\TEPPEI-PC.ini"
set launcher_logPath="log\checkMap_log_!date:~0,4!!date:~5,2!!date:~8,2!!time:~0,2!!time:~3,2!!time:~6,2!.log"

REM ����log�ļ���
if not exist log (
	mkdir log
)

perl checkMap.pl %launcher_envConfig% %launcher_gameConfig% %launcher_logPath%

: END
endlocal enabledelayedexpansion
@pause