##
#
# 提取页游版icon。
#
# 注意：可能包含中文目录，因此本脚本采用gbk编码，请勿改动，否则拷贝可能出错
#
#
# author teppei
# date 2016/12/8
#
##

use Config::IniFiles;  # 非原生库，需额外安装
use Encode;
use File::Basename;
use File::Copy;
use FileCopyRecursive::Recursive;  # dircopy用到，非原生库，需额外安装

use utf8;
use encoding "utf8", STDOUT => 'gbk';

my ($arg_sourceDir, $arg_dstDir, $arg_logPath) = @ARGV;

# 检查参数 - 源路径
if(!defined $arg_sourceDir)
{
	die("ERROR: [main] source path not defined!");
}
elsif(!(-e $arg_sourceDir))
{
	die("ERROR: [main] source path not exist - $arg_sourceDir!");
}

# 检查参数 - 输出路径
if(!defined $arg_dstDir)
{
	die("ERROR: [main] destination path not defined!");
}

# 检查参数 - log文件路径
(defined $arg_logPath) or die("ERROR: [main] log file path not defined!");

print "=========================================\n";
print "此伟大的脚本用于提取页游版icon的必要图片\n";
print "================By teppei================\n";
print "================2016/12/8================\n";
print "=========================================\n";

# 打开log文件准备写入
open ( LOGFILE, ">", "$arg_logPath" ) or die ("ERROR: [main] Can't open $arg_logPath - $!\n");
binmode LOGFILE, ':utf8';

my $logContent = '';

if(!-e $arg_dstDir) {
  mkDeepDir($arg_dstDir);
}

scanRecuisively($arg_sourceDir);

tlog("处理结束\n");

# 写日志
print LOGFILE $logContent;
close LOGFILE;

exit 0;

##
# 递归检查目录
##
sub scanRecuisively
{
	my $input = shift;
	
	# 检查是否目录
	if(-d $input)
	{
		# 输入是目录		
		opendir DH,$input or die("ERROR: [scanRecuisively] Please check the path: $input\n");
		foreach(readdir DH){
			next if($_ eq '.' || $_ eq '..');
			
			$curPath = $input."/$_";
			if(-d $curPath)
			{
				# 还是目录				
				scanRecuisively($curPath);
			}
			else
			{
				processFile($curPath);
			}
		}
		closedir DH;
	}
	else
	{
		processFile($input);
	}
}

sub processFile
{
  my $filePath = shift;
  my $dstPath = $filePath;
  if($dstPath !~ s/XL\.png$/.png/) {
    return;
  }
  if($dstPath =~ s/\Q$arg_sourceDir\E/$arg_dstDir/) {
    copy($filePath, $dstPath) or die("ERROR: [main] copy $filePath to $dstPath failed: $!");
  }
}

##
# make the deep level dir
#
# @param path the dir address
##
sub mkDeepDir{
	my $path = shift;
	@pathArray=split(/\/|\\/,$path);
	my $i=0;
	my $j=0;
	for($i=0;$i<@pathArray;$i++){
		my $subPath = $pathArray[0];
		for($j=1;$j<=$i;$j++){
			$subPath="$subPath/$pathArray[$j]";
		}
		if(!-e $subPath){
			mkdir($subPath) or die("ERROR: [mkDeepDir] create folder '$subPath' failed: - $!");
		}
	}
}

sub tlog
{
  my $logText = shift;
  $logContent.=$logText;
  print $logText;
}