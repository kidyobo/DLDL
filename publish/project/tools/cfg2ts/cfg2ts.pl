##
#
# 生成表格结构定义ts。
# 使用时，需提供如下参数：
# 1. 游戏相关配置文件路径
# 2. 环境相关配置文件路径
#
#
# author teppei
# date 2016/10/20
#
##

use Config::IniFiles;  # 非原生库，需额外安装
use Data::Dumper;
use Encode;
use File::Basename;
use File::Copy;
use File::Path;
use FileCopyRecursive::Recursive;  # dircopy用到，非原生库，需额外安装
use JSON;
use XML::Simple;

use utf8;
use encoding "utf8", STDOUT => 'gbk';

my ($arg_envConfig, $arg_gameConfig, $arg_logPath) = @ARGV;

# 检查参数 - 环境配置路径
(defined $arg_envConfig) or die("ERROR: [main] environment config path not defined!");
(-e $arg_envConfig) or die("ERROR: [main] environment config path not exist - $arg_envConfig!");

# 检查参数 - 游戏配置路径
(defined $arg_gameConfig) or die("ERROR: [main] game config path not defined!");
(-e $arg_gameConfig) or die("ERROR: [main] game config path not exist - $arg_gameConfig!");

# 检查参数 - log文件路径
(defined $arg_logPath) or die("ERROR: [main] log file path not defined!");

print "=======================================\n";
print "此伟大的脚本用于生成表格结构定义ts文件 \n";
print "===============By teppei===============\n";
print "===============2016/10/20==============\n";
print "=======================================\n";

# 打开log文件准备写入
open ( LOGFILE, ">", "$arg_logPath" ) or die ("ERROR: [main] Can't open $arg_logPath - $!\n");
binmode LOGFILE, ':utf8';

my $logContent = '';

# 读入配置文件----------------------------------------
tlog("正在读入环境配置...\n");
my $envCfg = new Config::IniFiles(-file => $arg_envConfig,  #配置文件名
                               -allowcontinue => 0,   #是否允许一个参数值写在多行
                               -reloadwarn => 1,           
                               -nocase  => 1);       #大小写不敏感
# 读入环境变量...

# 读入游戏配置----------------------------------------
tlog("正在读入游戏配置...\n");
my $gameCfg = new Config::IniFiles(-file => $arg_gameConfig,  #配置文件名
                               -allowcontinue => 0,   #是否允许一个参数值写在多行
                               -reloadwarn => 1,           
                               -nocase  => 1);       #大小写不敏感
                               

# 读入临时根目录
my $tempRoot = 'temp/'.$gameCfg->val('Temp', 'TempRoot');
# 工具目录
my $toolRoot = $tempRoot.'/tool';
my $toolRootWin = $toolRoot;
$toolRootWin =~ s/\//\\/g;
!(-d $toolRoot) or (system("rmdir $toolRootWin /S /Q") and mkpath($toolRoot));

# 表格结构定义xml目录
my $xmlRoot = $tempRoot.'/tool/xml';
my $xmlRootWin = $xmlRoot;
$xmlRootWin =~ s/\//\\/g;
!(-d $xmlRoot) or (system("rmdir $xmlRootWin /S /Q") and mkpath($xmlRoot));

# error id xml目录
my $errorIdXmlRoot = $tempRoot.'/tool/errorId';
my $errorIdXmlRootWin = $errorIdXmlRoot;
$errorIdXmlRootWin =~ s/\//\\/g;
!(-d $errorIdXmlRoot) or (system("rmdir $errorIdXmlRootWin /S /Q") and mkpath($errorIdXmlRoot));

# game config目录
my $gameConfigRoot = $tempRoot.'/gameConfig';
my $gameConfigRootWin = $gameConfigRoot;
$gameConfigRootWin =~ s/\//\\/g;
!(-d $gameConfigRoot) or (system("rmdir $gameConfigRootWin /S /Q") and mkpath($gameConfigRoot));

# error id目录
my $errorIdRoot = $tempRoot.'/errorId';
my $errorIdRootWin = $errorIdRoot;
$errorIdRootWin =~ s/\//\\/g;
!(-d $errorIdRoot) or (system("rmdir $errorIdRootWin /S /Q") and mkpath($errorIdRoot));

# keyword目录
my $keywordRoot = $tempRoot.'/keyword';
my $keywordRootWin = $keywordRoot;
$keywordRootWin =~ s/\//\\/g;
!(-d $keywordRoot) or (system("rmdir $keywordRootWin /S /Q") and mkpath($keywordRoot));

# 读入工具svn
my $toolSvn = $gameCfg->val('Tool', 'ToolSvn');
my $toolCfg = $gameCfg->val('Tool', 'ToolCfg');

# 读入xml的svn
my $xmlSvn = $gameCfg->val('Xml', 'XmlSvn');
my $errorIdXmlSvn = $gameCfg->val('Xml', 'ErrorIdXmlSvn');

# 读入ts的svn
my $gameConfigSvn = $gameCfg->val('Ts', 'GameConfigSvn');
my $errorIdSvn = $gameCfg->val('Ts', 'ErrorIdSvn');
my $keyWordSvn = $gameCfg->val('Ts', 'KeyWordSvn');

# check out tool
tlog("正在check out flash tool...\n");
`svn checkout $toolSvn $toolRoot`;

# check out xml
tlog("正在check out xml...\n");
`svn checkout $xmlSvn $xmlRoot`;

# check out error id xml
tlog("正在check out error id xml...\n");
`svn checkout $errorIdXmlSvn $errorIdXmlRoot`;

# check out GameConfig.d.ts
tlog("正在check out GameConfig.d.ts...\n");
system("svn checkout --depth=empty $gameConfigSvn $gameConfigRoot -q --non-interactive --trust-server-cert");
system("svn up --depth=empty $gameConfigRoot\\GameConfig.d.ts --non-interactive --trust-server-cert");

# check out ErrorId.ts
tlog("正在check out ErrorId.ts...\n");
system("svn checkout --depth=empty $errorIdSvn $errorIdRoot -q --non-interactive --trust-server-cert");
system("svn up --depth=empty $errorIdRoot\\ErrorId.ts --non-interactive --trust-server-cert");

# check out KeyWord.ts
tlog("正在check out KeyWord.ts...\n");
system("svn checkout --depth=empty $keyWordSvn $keywordRoot -q --non-interactive --trust-server-cert");
system("svn up --depth=empty $keywordRoot\\KeyWord.ts --non-interactive --trust-server-cert");

# 开始转换
system("adl\\adl.exe $toolRoot\\ClassMaker2-app.xml -nodebug -- $toolCfg %COMPUTERNAME%");

tlog("转换结束\n");

# 拷贝转换出来的ts到对应的文件夹
copy("$toolRootWin\\ts\\GameConfig.d.ts", "$gameConfigRoot\\GameConfig.d.ts") or die("fail to copy from $toolRootWin\\ts\\GameConfig.d.ts to $gameConfigRoot\\GameConfig.d.ts!");
copy("$toolRootWin\\ts\\ErrorId.ts", "$errorIdRoot\\ErrorId.ts") or die("fail to copy from $toolRootWin\\ts\\ErrorId.ts to $errorIdRoot\\ErrorId.ts!");
copy("$toolRootWin\\ts\\KeyWord.ts", "$keywordRoot\\KeyWord.ts") or die("fail to copy from $toolRootWin\\ts\\KeyWord.ts to $keywordRoot\\KeyWord.ts!");

# 上传ts
tlog("正在上传ts...\n");
system("svn commit -q -m \"cfg2ts by teppei\" $gameConfigRoot\\GameConfig.d.ts $errorIdRoot\\ErrorId.ts $keywordRoot\\KeyWord.ts 2>nul");

# 写日志
print LOGFILE $logContent;
close LOGFILE;

exit 0;

sub tlog
{
  my $logText = shift;
  $logContent.=$logText;
  print $logText;
}