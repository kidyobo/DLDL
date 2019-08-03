##
#
# 手游代码机器人。
# author teppei
# date 2016/9/28
#
##

use Data::Dumper;
use Encode;
use File::Basename;
use File::Path;
use POSIX;
use XML::Simple;

use utf8;
use encoding "utf8", STDOUT => 'gbk';

my ($_codeType, $_moduleName) = @ARGV;

(defined $_codeType) or die("ERROR: [main] _codeType not defined!");
(defined $_moduleName) or die("ERROR: [main] _configFile not defined!");

# 先读入配置文件
my $configXs = XML::Simple->new();
my $configXml = $configXs->XMLin('conf.xml');

my $tmplFileName = 'tmpl/'.$_codeType.'.tmpl';
# 读入模板文件
open ( TMPLFILE, "<", $tmplFileName ) or die ("ERROR: [main] Can't open $tmplFileName - $!\n");
my @tmplContent=<TMPLFILE>;
close TMPLFILE;

my $saveFileFullPath = '';

if('module' eq $_codeType) {
  # 生成模块
  # 先解析模块名参数：moduleName+chName
  my @moduleParas = split(/\+/, $_moduleName);
  
  my $pkgName = $moduleParas[0];
  # 截去末尾的module
  $pkgName =~ s/module$//i;
  # 包名改为小写开头
  $pkgName = lcfirst($pkgName);
  
  my $moduleClassName = $moduleParas[0];
  # 类名改为大写开头
  $moduleClassName = ucfirst($moduleClassName);
  # 末尾添加Module
  if($moduleClassName !~ /module$/i) {
    $moduleClassName.='Module';
  }  
  
  # 解析chName(可选)
  my $chName;
  if(scalar(@moduleParas) > 1) {
    $chName = encode("utf-8",decode("gb2312",$moduleParas[1]));
  } else {
    $chName = $configXml->{'module'}->{'defaultChName'};
  }
  
  # 进行模板替换
  foreach(@tmplContent) {
    s/%ModuleName%/$moduleClassName/g;
    s/%ModuleChName%/$chName/g;
  }
  # 组成保存路径
  $saveFileFullPath = '../../TsScripts/System/'.$pkgName.'/'.$moduleClassName.'.ts';
}

my($saveFileName, $saveFilePath, $saveFileSuffix)=fileparse($saveFileFullPath);
(-e $saveFilePath) or mkpath($saveFilePath);

# 保存文件
open ( OUTFILE, ">", $saveFileFullPath ) or die ("ERROR: [main] Can't open $saveFileFullPath - $!\n");
print OUTFILE @tmplContent;
close OUTFILE;

print "已生成：$saveFileFullPath\n";

exit 0;