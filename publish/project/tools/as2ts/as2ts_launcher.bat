:: as����תts�ű�
:: @teppei, 2016/9/30

@echo off
setlocal enabledelayedexpansion

title as����תts@teppei

type readme.txt

set launcher_srcPath="F:\wjtxm"
set lauucher_outPath="E:\FYMClient\branches\wjtxts"

perl as2ts.pl %launcher_srcPath% %lauucher_outPath%

: END
endlocal enabledelayedexpansion
@pause