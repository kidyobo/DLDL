:: 模型文件批量改名
:: @teppei, 2017/3/2

@echo off
setlocal enabledelayedexpansion

title 模型文件批量改名@teppei

type readme.txt

set launcher_srcPath="models"

perl renameModels.pl %launcher_srcPath%

: END
endlocal enabledelayedexpansion
@pause