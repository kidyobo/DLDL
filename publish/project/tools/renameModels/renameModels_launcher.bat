:: ģ���ļ���������
:: @teppei, 2017/3/2

@echo off
setlocal enabledelayedexpansion

title ģ���ļ���������@teppei

type readme.txt

set launcher_srcPath="models"

perl renameModels.pl %launcher_srcPath%

: END
endlocal enabledelayedexpansion
@pause