##
#
# 重命名怪物模型美术部件。
# 使用时，需提供如下参数：
# 模型美术资源目录，以怪物id为子目录名
#
# author teppei
# date 2017/3/2
#
##

use Data::Dumper;
use Encode;
use File::Basename;
use File::Path;
use POSIX;
use XML::Simple;

#use utf8;
#use encoding "utf8", STDOUT => 'gbk';

my ($_srcPath) = @ARGV;

# 检查参数 - 资源原目录
(defined $_srcPath) or die('ERROR: [main] _srcPath not defined!');
(-e $_srcPath) or die("ERROR: [main] $_srcPath not exist!");

# 定义修改规则
my @rules = ();  # 转换规则
my %seqRuleMap = ();  # 序号规则

# 先添加名字转换规则
addRule('蒙皮', '');
addRule('站立', 'stand');
# 如果一个名称可能转成2种名字，用竖线隔开，这里是为了在没有“站立.FBX”的情况下，将“待机.FBX”改为stand
addRule('待机', 'stand|idle');
addRule('移动', 'move');
addRule('出生', 'born');
addRule('诞生', 'born');
addRule('死亡', 'dead');
addRule('攻击', 'attack');
addRule('受击', 'behit');
addRule('平砍', 'attack');
addRule('抱东西', 'hold');
addRule('战斗站立', 'stand_fight');
addRule('乘骑站立', 'stand_ride');
addRule('抱东西跑', 'move_hold');
addRule('坐下', 'sit');
addRule('乘骑奔跑', 'move_ride');
addRule('拾取', 'pick');
addRule('拾取姿态', 'pick');
addRule('跳跃', 'jump');

# 再添加序号规则
$seqRuleMap->{'stand'} = 0;
$seqRuleMap->{'idle'} = 0;
$seqRuleMap->{'move'} = 0;
$seqRuleMap->{'hold'} = 0;
$seqRuleMap->{'sit'} = 0;
$seqRuleMap->{'move_hold'} = 0;
$seqRuleMap->{'move_ride'} = 0;
$seqRuleMap->{'stand_ride'} = 0;
$seqRuleMap->{'stand_fight'} = 0;
$seqRuleMap->{'jump'} = 0;
$seqRuleMap->{'pick'} = 0;
$seqRuleMap->{'born'} = 1;
$seqRuleMap->{'dead'} = 1;
$seqRuleMap->{'attack'} = 1;
$seqRuleMap->{'behit'} = 1;


my $hour_min_sec=strftime("%H:%M:%S", localtime());

print "[$hour_min_sec] start converting, please wait...\n";

# 开始扫描目录文件	
# 检查是否目录
if(-d $_srcPath)
{
	# 输入是目录		
	opendir DH,$_srcPath or die("ERROR: [main] Please check the path: $_srcPath\n");
	foreach(readdir DH){
		next if($_ eq '.' || $_ eq '..');
		
		# 检查是否id
		my $id = $_;
		if($id !~ /^(\d+)$/) {
		  print "WARNING: [main] Skip folder without id: $_\n";
		  next;
		}
		
		my $curPath = $_srcPath."\\$id";
		if(-d $curPath)
		{	
		  processModelFolder($id, $curPath);
		}
		else
		{
			die("ERROR: [main] folder structure not correct!");
		}
	}
	closedir DH;
}
else
{
	die("ERROR: [main] folder structure not correct!");
}

$hour_min_sec=strftime("%H:%M:%S", localtime());
print "[$hour_min_sec] Conversion finished!\n";

exit 0;

sub addRule
{
  my $oldName = shift;
  my $newName = shift;
  my %rule = ('oldName'=>$oldName, 'newName'=>$newName);
  push @rules, \%rule;
}

##
# 检查是否跳过file
##
sub processModelFolder
{
  my $id=shift;
  my $subPath=shift;
  # 输入是目录		
	opendir SUBDH,$subPath or die("ERROR: [processModelFolder] Please check the path: $subPath\n");
	my %usedNameMap = ();
	my %usedFileNameMap = ();
	foreach(readdir SUBDH){
		next if($_ eq '.' || $_ eq '..');
		next if(!(/\.FBX$/));
		
		my $filePath = $subPath."\\$_";
		next if(!(-e $filePath));
		
		my $oldFileName = $_;
		my $newFileName = '';		
		my $hitRule = 0;
		foreach my $oneRule (@rules) {
		  my $oldName = $oneRule->{'oldName'};
		  my $newName;
		  my $newNameTmp = $oneRule->{'newName'};
		  if('' ne $newNameTmp) {
		    my @newNameList = split(/\|/, $newNameTmp);
  		  my $newNameCnt = scalar(@newNameList);
  		  for(my $i = 0; $i < $newNameCnt; $i++) {
		      next if(exists $usedNameList->{$newNameList[$i]});
		      $newName = $newNameList[$i];
		      last;
		    }
		  } else {
		    $newName = $newNameTmp;
		  }
		  
		  if(!(defined $newName)) {
		    print "WARNING: [processModelFolder] name occupied: $filePath\n";
		    next;
		  }		  
		  
		  $newFileName = $oldFileName;
		  if($newFileName =~ s/\Q$oldName\E-?(\d?).FBX$/$newName/) {
		    my $seq = $1;
		    if('' eq $newName) {
		      $newFileName = $id;
		    } else {
		      $newFileName = $id.'@'.$newFileName;
		    }
		    
		    if('' ne $seq) {
		      $newFileName.=$seq;
		    } elsif(1 == $seqRuleMap->{$newName}) {
		      $newFileName.='1';
		    }
		    $newFileName.='.FBX';
		    $hitRule = 1;
		    $usedNameMap->{$newName} = 1;
		    
		    if(exists $usedFileNameMap->{$newFileName}) {
		      print "WARNING: [processModelFolder] repeated file name: $newFileName, please check!\n";
		    } else {
		      $usedFileNameMap->{$newFileName} = 1;
		    }
		    last;
		  }
		}
		
		if(1 == $hitRule) {
		  system("ren $filePath $newFileName");		  
		} else {
		  print "WARNING: [processModelFolder] Not hit any rule: $filePath\n";
		}
	}
	closedir SUBDH;
}