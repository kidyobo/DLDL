##
#
# ����������ģ������������
# ʹ��ʱ�����ṩ���²�����
# ģ��������ԴĿ¼���Թ���idΪ��Ŀ¼��
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

# ������ - ��ԴԭĿ¼
(defined $_srcPath) or die('ERROR: [main] _srcPath not defined!');
(-e $_srcPath) or die("ERROR: [main] $_srcPath not exist!");

# �����޸Ĺ���
my @rules = ();  # ת������
my %seqRuleMap = ();  # ��Ź���

# ���������ת������
addRule('��Ƥ', '');
addRule('վ��', 'stand');
# ���һ�����ƿ���ת��2�����֣������߸�����������Ϊ����û�С�վ��.FBX��������£���������.FBX����Ϊstand
addRule('����', 'stand|idle');
addRule('�ƶ�', 'move');
addRule('����', 'born');
addRule('����', 'born');
addRule('����', 'dead');
addRule('����', 'attack');
addRule('�ܻ�', 'behit');
addRule('ƽ��', 'attack');
addRule('������', 'hold');
addRule('ս��վ��', 'stand_fight');
addRule('����վ��', 'stand_ride');
addRule('��������', 'move_hold');
addRule('����', 'sit');
addRule('���ﱼ��', 'move_ride');
addRule('ʰȡ', 'pick');
addRule('ʰȡ��̬', 'pick');
addRule('��Ծ', 'jump');

# �������Ź���
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

# ��ʼɨ��Ŀ¼�ļ�	
# ����Ƿ�Ŀ¼
if(-d $_srcPath)
{
	# ������Ŀ¼		
	opendir DH,$_srcPath or die("ERROR: [main] Please check the path: $_srcPath\n");
	foreach(readdir DH){
		next if($_ eq '.' || $_ eq '..');
		
		# ����Ƿ�id
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
# ����Ƿ�����file
##
sub processModelFolder
{
  my $id=shift;
  my $subPath=shift;
  # ������Ŀ¼		
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