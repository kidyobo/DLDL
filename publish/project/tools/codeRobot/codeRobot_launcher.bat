@echo off

TITLE ���δ���������@teppei
setlocal enabledelayedexpansion

type readme.txt

: selectFunc
set /p func=^>^> ��������Ҫ���ɵĴ������ͣ�m��ʾModule��

if %func%==m (
	goto genModule
) else (
	goto selectFunc
)

: genModule
set _codeType=module
type doc\%_codeType%.txt
set /p _moduleName=^>^> ������ģ���Ӣ�����ƣ����շ�������([Bag^|bag^|BagModule^|bagModule]������System/bag/BagModule.ts)��
if not defined _moduleName goto genModule

goto callCodeRobot

: callCodeRobot
REM �������Ƿ���
if not defined _codeType goto selectFunc
if not defined _moduleName goto selectFunc

perl codeRobot.pl %_codeType% %_moduleName%

echo ִ�гɹ�
goto selectFunc

:: �ر��ӳٱ���
endlocal enabledelayedexpansion

@pause