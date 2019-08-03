@echo off
setlocal enabledelayedexpansion

TITLE ������ȡ���@teppei
echo ������ȡ�汾...

set /p ver=������汾���ͣ�T/t��ʾtrunk��K/k��ʾ���棬W/w��ʾ̨��棬B/b��ʾTB�棬Q/q��ʾ��Ѷ�棬Y/y��ʾԽ�ϰ棬E/e��ʾӢ�İ棬J/j��ʾ���İ�,NJY/njy��ʾ�½���,SY/sy��ʾ���Σ�
set isTrunk=0
if %ver%==T (
	set isTrunk=1
) else if %ver%==t (
	set isTrunk=1
)

set isKorea=0
if %ver%==K (
	set isKorea=1
) else if %ver%==k (
	set isKorea=1
)

set isTaiwan=0
if %ver%==W (
	set isTaiwan=1
) else if %ver%==w (
	set isTaiwan=1
)

set isTB=0
if %ver%==B (
	set isTB=1
) else if %ver%==b (
	set isTB=1
)

set isTengxun=0
if %ver%==Q (
	set isTengxun=1
) else if %ver%==q (
	set isTengxun=1
)

set isYN=0
if %ver%==Y (
	set isYN=1
) else if %ver%==y (
	set isYN=1
)

set isEN=0
if %ver%==E (
	set isEN=1
) else if %ver%==e (
	set isEN=1
)

set isJp=0
if %ver%==J (
	set isJp=1
) else if %ver%==j (
	set isJp=1
)

set isNJY=0
if %ver%==NJY (
	set isNJY=1
) else if %ver%==njy (
	set isNJY=1
)

set isSY=0
if %ver%==SY (
	set isSY=1
) else if %ver%==sy (
	set isSY=1
)

REM ���÷�֧Ŀ¼�ͱ���Ŀ¼
if %isTrunk% == 1 (
	set svnPath=https://fygame-svn:8080/svn/FYtools/trunk/
	set localPath=FYTools
) else if %isKorea% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZKoreanTools/trunk/
	set localPath=KoreaTools
) else if %isTaiwan% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZTaiwanTools/trunk/
	set localPath=TaiwanTools
) else if %isTB% == 1 (
	set svnPath=https://fygame-svn:8080/svn/TBtools/trunk/
	set localPath=TBTools
) else if %isTengxun% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZTXTools/trunk/
	set localPath=TXTools
) else if %isYN% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZYueTools/trunk/
	set localPath=YNTools
) else if %isEN% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZEnTools/trunk/
	set localPath=ENTools
) else if %isJp% == 1 (
	set svnPath=https://fygame-svn:8080/svn/JZZTaiwanTools/branches/JPTools/trunk/
	set localPath=JPTools
) else if %isNJY% == 1 (
	set svnPath=https://fygame-svn:8080/svn/TBtools/branches/JYNewTools/
	set localPath=NewJYTools
) else if %isSY% == 1 (
	set svnPath=https://fygame-svn:8080/svn/TBTOOLS/branches/FYMTOOLS
	set localPath=FYMTools
) else (
	echo δ֪�汾��
	goto END_OF_SCRIPT
)

echo ���ڵ�ǰĿ¼�´���Ŀ¼%localPath%����ȡsvn
@pause

if not exist %localPath% (
	mkdir %localPath%
)

svn checkout --depth=empty %svnPath% %localPath% -q --non-interactive --trust-server-cert
REM svn up --depth=empty %localPath%\trunk --non-interactive --trust-server-cert
svn up --depth=empty %localPath%\���±��.bat  --non-interactive --trust-server-cert
svn up --depth=empty %localPath%\Develop --non-interactive --trust-server-cert
svn up --depth=infinity %localPath%\Develop\bin --non-interactive --trust-server-cert
svn up --depth=infinity %localPath%\Develop\convert --non-interactive --trust-server-cert
svn up --depth=infinity %localPath%\Develop\tools --non-interactive --trust-server-cert
svn up --depth=infinity %localPath%\Develop\xls --non-interactive --trust-server-cert
svn up --depth=infinity %localPath%\Develop\xml --non-interactive --trust-server-cert

set /p listResInput=�Ƿ���ȡ������Դ��[Y|y]:
set listRes=0
if %listResInput%==Y (
	set listRes=1
) else if %listResInput%==y (
	set listRes=1
)

if %listRes% == 1 (
	svn up --depth=infinity %localPath%\Develop\ClientRes --non-interactive --trust-server-cert
)

echo ��ȡ����...

REM �ű�����
: END_OF_SCRIPT
endlocal enabledelayedexpansion
@pause