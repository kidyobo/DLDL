:: cfg2ts�����ű�
:: @teppei, 2016/10/20

@echo off
setlocal enabledelayedexpansion

title cfg2ts@teppei

set ver=%1

if not defined ver (
	set /p ver=	������汾���ͣ�M/m��ʾ���ΰ棬MBS/mbs��ʾ����棺
)

set isFYM=0
if %ver%==M (
	set isFYM=1
) else if %ver%==m (
	set isFYM=1
)

set isFYMBS=0
if %ver%==MBS (
	set isFYMBS=1
) else if %ver%==mbs (
	set isFYMBS=1
)

if %isFYM%==1 (
    ::��Ϸ����
    set launcher_gameConfig="config\game\mgame.ini"
) else if %isFYMBS%==1 (
	set launcher_gameConfig="config\game\mgame_banshu.ini"
) else (
    echo δ֪�汾��
	goto END
)

REM ���������ļ�
set launcher_envConfig="config\env\TEPPEI-PC.ini"
set launcher_logPath="log\cfg2as_log_!date:~0,4!!date:~5,2!!date:~8,2!!time:~0,2!!time:~3,2!!time:~6,2!.log"

REM ����log�ļ���
if not exist log (
	mkdir log
)

perl cfg2ts.pl %launcher_envConfig% %launcher_gameConfig% %launcher_logPath%

: END
endlocal enabledelayedexpansion
@pause