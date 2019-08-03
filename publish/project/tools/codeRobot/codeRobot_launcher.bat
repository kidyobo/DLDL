@echo off

TITLE 手游代码生成器@teppei
setlocal enabledelayedexpansion

type readme.txt

: selectFunc
set /p func=^>^> 请输入需要生成的代码类型，m表示Module：

if %func%==m (
	goto genModule
) else (
	goto selectFunc
)

: genModule
set _codeType=module
type doc\%_codeType%.txt
set /p _moduleName=^>^> 请输入模块的英文名称，以驼峰风格输入([Bag^|bag^|BagModule^|bagModule]均生成System/bag/BagModule.ts)：
if not defined _moduleName goto genModule

goto callCodeRobot

: callCodeRobot
REM 检查参数是否定义
if not defined _codeType goto selectFunc
if not defined _moduleName goto selectFunc

perl codeRobot.pl %_codeType% %_moduleName%

echo 执行成功
goto selectFunc

:: 关闭延迟变量
endlocal enabledelayedexpansion

@pause