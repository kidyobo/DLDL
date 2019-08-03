##
#
# 生成表格结构定义ts。
# 使用时，需提供如下参数：
# 1. 游戏相关配置文件路径
# 2. 环境相关配置文件路径
#
#
# author teppei
# date 2017/5/31
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
print "此伟大的脚本用于检查筛除多余的地编文件 \n";
print "===============By teppei===============\n";
print "===============2017/5/31===============\n";
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
                               
# 读入地编目录
my $mapDataPathMobile = $gameCfg->val('MapData', 'MapDataPathMobile');
my $mapTilePathMobile = $gameCfg->val('MapData', 'MapTilePathMobile');
my $mapMosaicPathMobile = $gameCfg->val('MapData', 'MapMosaicPathMobile');
my $mapDataPathFlash = $gameCfg->val('MapData', 'MapDataPathFlash');

# 读入xml的目录
my $sceneXmlPath = $gameCfg->val('Xml', 'SceneXmlPath');
tlog("正在读入场景配置...\n");
my $configXs = XML::Simple->new(KeyAttr => "ch");
my $sceneCfg = $configXs->XMLin($sceneXmlPath);
my @allCfgs = @{$sceneCfg->{'SceneConfig_Flash'}};

my %resourceIdMap = ();
my %idMap = ();
my $totalSceneCnt = 0;
my $totalResourceCnt = 0;
foreach my $oneCfg (@allCfgs)
{
  my $sceneId = int($oneCfg->{'m_iSceneID'});
  if($sceneId > 0)
  {
    my $resourceId = int($oneCfg->{'m_iResourceID'});
    if($resourceId > 0)
    {
      if(!exists($resourceIdMap{$resourceId}))
      {
        $resourceIdMap{$resourceId} = 1;
        $totalResourceCnt++;
      }
      my $key = $resourceId.'_'.$sceneId;
      $idMap{$key} = 1;
      $totalSceneCnt++;
    }    
  }
}
tlog("场景总数：${totalSceneCnt}，资源总数：${totalResourceCnt}\n");

# 检查地编目录
my $totalPathCnt = 0;
my $invalidPathCnt = 0;
tlog("正在检查flash地编...\n");
tlog("---------------------------------------------------------------------\n");
checkMap($mapDataPathFlash, 1);
tlog("---------------------------------------------------------------------\n");
tlog("一共${totalPathCnt}个地编目录，其中${invalidPathCnt}个多余目录\n");

$totalPathCnt = 0;
$invalidPathCnt = 0;
tlog("正在检查手游地编...\n");
tlog("---------------------------------------------------------------------\n");
checkMap($mapDataPathMobile, 1);
tlog("---------------------------------------------------------------------\n");
tlog("一共${totalPathCnt}个地编目录，其中${invalidPathCnt}个多余目录\n");

$totalPathCnt = 0;
$invalidPathCnt = 0;
tlog("正在检查手游地图块...\n");
tlog("---------------------------------------------------------------------\n");
checkMap($mapTilePathMobile, 0);
tlog("---------------------------------------------------------------------\n");
tlog("一共${totalPathCnt}个地图块目录，其中${invalidPathCnt}个多余目录\n");

$totalPathCnt = 0;
$invalidPathCnt = 0;
tlog("正在检查手游马赛克...\n");
tlog("---------------------------------------------------------------------\n");
checkMap($mapMosaicPathMobile, 0);
tlog("---------------------------------------------------------------------\n");
tlog("一共${totalPathCnt}个马赛克目录，其中${invalidPathCnt}个多余目录\n");


# 写日志
print LOGFILE $logContent;
close LOGFILE;

exit 0;

sub checkMap
{
  my $input=shift;
  my $deep=shift;
  opendir DH,$input or die("ERROR: [checkMap] Please check the path: $input\n");
	foreach(readdir DH){
		next if($_ eq '.' || $_ eq '..');
		
		my $curPath = $input."/$_";
		if(-d $curPath)
		{
			# 还是目录
  		if($_ =~ /^(\d+)$/)
  		{
  		  my $rid = $1;
  		  if(0 == $deep)
  		  {
  		    $totalPathCnt++;
  		  }
  		  if(!exists($resourceIdMap{$rid}))
  		  {
  		    $invalidPathCnt++;
          $curPath =~ s/\//\\/g;
          system("rmdir $curPath /S /Q");
          tlog("多余的地编主目录：$curPath\n");
  		    next;
  		  }
  		  if($deep == 1)
  		  {
  		    opendir SUBDH,$curPath or die("ERROR: [checkMap] Please check the path: $curPath\n");
    		  foreach(readdir SUBDH){
    		    next if($_ eq '.' || $_ eq '..');
    		    
  		      my $subPath = $curPath."/$_";
    		    if(-d $subPath)
    		    {
    		      if($_ =~ /^(\d+)$/)
          		{
          		  $totalPathCnt++;
          		  my $sid = $1;
          		  my $key = $rid.'_'.$sid;
                if(!exists($idMap{$key}))
                {
                  $invalidPathCnt++;
                  $subPath =~ s/\//\\/g;
                  system("rmdir $subPath /S /Q");
                  tlog("多余的地编次目录：$subPath\n");
                }
          		}
    		    }
    		  }
  	      closedir SUBDH;
  		  }  		  
  		}
		}
	}
	closedir DH;
}

sub tlog
{
  my $logText = shift;
  $logContent.=$logText;
  print $logText;
}