##
#
# 将表格xml转化为json格式，并剔除表头、空结构。
# 使用时，需提供如下参数：
# 1. 游戏相关配置文件路径
# 2. 环境相关配置文件路径
#
#
# author teppei
# date 2016/8/29
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
print "此伟大的脚本用于将表格xml转化为json格式\n";
print "===============By teppei===============\n";
print "===============2016/8/29===============\n";
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
# 结构定义目录
my $structRoot = $tempRoot.'/struct';
my $structRootWin = $structRoot;
$structRootWin =~ s/\//\\/g;
!(-d $structRoot) or (system("rmdir $structRootWin /S /Q") and mkpath($structRoot));
# 表格xml目录
my $xmlRoot = $tempRoot.'/xml';
my $xmlRootWin = $xmlRoot;
$xmlRootWin =~ s/\//\\/g;
!(-d $xmlRoot) or (system("rmdir $xmlRootWin /S /Q") and mkpath($xmlRoot));
# json目录
my $jsonRoot = $tempRoot.'/json';
my $jsonRootWin = $jsonRoot;
$jsonRootWin =~ s/\//\\/g;
!(-d $jsonRoot) or (system("rmdir $jsonRootWin /S /Q") and mkpath($jsonRoot));

# 读入结构定义的svn
my $structSvn = $gameCfg->val('Struct', 'StructSvn');

# 读入xml的svn
my $xmlSvn = $gameCfg->val('Xml', 'XmlSvn');

# 读入json的svn
my $jsonSvn = $gameCfg->val('Json', 'JsonSvn');

# check out struct
tlog("正在check out struct definition...\n");
`svn checkout $structSvn $structRoot`;

# check out xml
tlog("正在check out xml...\n");
`svn checkout $xmlSvn $xmlRoot`;

# check out json
tlog("正在check out json...\n");
`svn checkout $jsonSvn $jsonRoot`;

# 先读入结构定义
my %structDefMap = ();
my %arrayMap = ();
my $curPath;
opendir DH,$structRoot or die("ERROR: [main] Open direction failed: $structRoot\n");
foreach(readdir DH){
	next if($_ eq '.' || $_ eq '..');
	
	$curPath = $structRoot."/$_";
	if(-d $curPath)
	{
		# 还是目录，跳过
		next;
	}
	else
	{
	  my ($fileBase, $filePath, $fileSuffix) = fileparse($curPath, qr{.xml});
	  if('.xml' eq $fileSuffix)
	  {
	    processStructureDef($curPath);
	  }
	}
}
closedir DH;

tlog(Dumper($structDefMap));

# 开始转换
opendir DH,$xmlRoot or die("ERROR: [main] Open direction failed: $xmlRoot\n");
foreach(readdir DH){
	next if($_ eq '.' || $_ eq '..');
	
	$curPath = $xmlRoot."/$_";
	if(-d $curPath)
	{
		# 还是目录，跳过
		next;
	}
	else
	{
	  my ($fileBase, $filePath, $fileSuffix) = fileparse($curPath, qr{.xml});
	  if('.xml' eq $fileSuffix)
	  {
	    processXml($curPath);
	  }
	}
}
closedir DH;

tlog("转换结束\n");

# 上传json
tlog("正在上传json...\n");
my $svn2upload = $jsonRoot.'/*.json';
$svn2upload =~ s/\//\\/g;
`svn add -q $svn2upload 2>nul`;
`svn commit -q -m "xml2json@teppei" $svn2upload 2>nul`;

# 写日志
print LOGFILE $logContent;
close LOGFILE;

exit 0;

##
# 处理结构定义
##
sub processStructureDef
{
  my $xmlPath = shift;
  if($xmlPath !~ /\.xml$/ || $xmlPath =~ /1_ConvList/)
  {
    return;
  }
  tlog("正在处理结构定义：$xmlPath...\n");
  
  # 直接读文件，不解析xml，因xml是gbk，目前无法decode
  open ( STRUCTFILE, "<:encoding(gb2312)", $xmlPath ) or die ("ERROR: [processStructureDef] Can't open $xmlPath - $!\n");
	my @defContent=<STRUCTFILE>;
	close STRUCTFILE;
	
	my $curStruct;
	my $entryName;
	for(@defContent)
	{
	  if(/<\s?struct\s+name\s?=\s?"([^"]+)"/) # "
	  {
	    # 进入struct
	    $curStruct = $1;
	  }
	  elsif(/<\/\s?struct>/)
	  {
	    # 退出struct
	    $curStruct = '';
	  }
	  elsif(/<entry\s+name\s?=\s?"([^"]+)".*type\s?=\s?"([^"]+)"/)
	  {
	    # 属性
	    $entryName = $1;
	    $entryType = $2;	    
	    if(!exists $structDefMap{$curStruct})
	    {
	      my %tmpSructEntryMap = ();
	      $tmpSructEntryMap{$entryName} = $entryType;
	      $structDefMap{$curStruct} = \%tmpSructEntryMap;
	    }
	    else
	    {
	      $structDefMap{$curStruct}{$entryName} = $entryType;
	    }	    
	    
	    if(/<entry\s+name\s?=\s?"([^"]+)".*count\s?=\s?"/)
  	  {
  	    # 具有长度的数组
  	    $entryName = $1;
  	    if(!exists $arrayMap{$curStruct})
  	    {
  	      my @tmpSructArray = ();
  	      $arrayMap{$curStruct} = [@tmpSructArray];
  	    }
  	    my $structArray = $arrayMap{$curStruct};
  	    if(!(@$structArray ~~ $entryName))
  	    {
  	      push @$structArray, $entryName;
  	    }	    
  	  }
	  }
	}	
}

##
# 处理配置xml
##
sub processXml
{
  my $xmlPath = shift;
  tlog("正在处理xml：$xmlPath...\n");
  
  if($xmlPath !~ /\.xml$/)
  {
    return;
  }
  
	my $xmlStructName;
  
  my $simpleXml = XML::Simple->new();
  my $xmlContent = $simpleXml->XMLin($xmlPath);
    
  # 检查空结构  
  my @jsonArr = ();
  while(my ($k, $v)=each$xmlContent)
  {
    if($k eq 'TResHeadAll')
    {
      next;
    }
    
    if(!(defined $xmlStructName))
    {
      $xmlStructName = $k;   
    }
    
    my $vref = ref($v);
    my $structJsonText;
    if('ARRAY' eq $vref)
    {
      # 有多个的话就是数组
      my $count = scalar(@$v);
      for(my $i = 1; $i < $count; $i++)
      {
        # 第一个是表头
        my $item = @$v[$i];
        $structJsonText = struct2json($item, $k);
        if('' ne $structJsonText && '[]' ne $structJsonText && '{}' ne $structJsonText)
        {
          # 非空结构
          push @jsonArr, $structJsonText;
        }
      }
    }
    elsif('HASH' eq $vref)
    {
      # 单个的情况
      $structJsonText = struct2json($v, $k);
      if('' ne $structJsonText && '[]' ne $structJsonText && '{}' ne $structJsonText)
      {
        # 非空结构
        push @jsonArr, $structJsonText;
      }
    }    
  }
  
  if(!(defined $xmlStructName))
  {
    # 异常
    tlog("已跳过xml: $mlPath，原因：无法界定xml类名。\n");
    return;
  }
  
  my $jsonInsCount = scalar(@jsonArr);
  print "count=$jsonInsCount\n";
  my $jsonContent = '';
  if($jsonInsCount > 0)
  {
    $jsonContent = '['.join(',', @jsonArr).']';
  }
  else
  {
    $jsonContent = '[]';
  }
  
  # 写入json文件
  my $jsonFileName = $xmlStructName;
  $jsonFileName =~ s/_Flash$/M/;
  my $jsonPath = $jsonRoot.'\\'.$jsonFileName.'.json';    
  open ( JSONFILE, ">", "$jsonPath" ) or die ("ERROR: [processXml] Can't open $jsonPath - $!\n");
	binmode JSONFILE, ':utf8';
	print JSONFILE $jsonContent;
	close JSONFILE;
}

##
# 转化结构为json字符串
##
sub struct2json
{
  my $struct = shift;
  my $structKey = shift;
  
  my $jsonText = '';
  my $structRef = ref($struct);
  
  my $kcount = 0;
  my $zeroCount = 0;
  
  my @itemJsonArr =();
  my $itemJsonText;
  
  my $structArray;  
  if(defined $structKey && exists $arrayMap{$structKey})
  {
    $structArray = $arrayMap{$structKey};     
  }
  my $structEntryInfoMap;
  if(defined $structKey && exists $structDefMap{$structKey})
  {
    $structEntryInfoMap = $structDefMap{$structKey};
    if(defined $structEntryInfoMap) {
      foreach my $oneEntryName (keys %$structEntryInfoMap)
      {
        if(!$struct->{$oneEntryName})
        {
          # 结构定义里有该字段，但是表格里没填所以xml里没有这个字段，需要补上
          my $oneEntryType = $structEntryInfoMap->{$oneEntryName};  # structEntryInfoMap为引用，需使用->
          my $itemIsArray = 0;
          if(defined $structArray)
          {  
            for(@$structArray)
            {
              if($_ eq $k)
              {
                $itemIsArray = 1;
                last;
              }
            }
          }
          $itemJsonText = getDefaultValue($oneEntryType, $itemIsArray);
          $itemJsonText = "\"".$oneEntryName."\":".formatJsonValue($itemJsonText);
          push @itemJsonArr, $itemJsonText;
        }
      }
    }
  }
  
  
  while(my ($k, $v)=each$struct)
  {
    $kcount++;
    
    my $vref = ref($v);
    my $itemIsArray = 0;
    if(defined $structArray)
    {  
      for(@$structArray)
      {
        if($_ eq $k)
        {
          $itemIsArray = 1;
          last;
        }
      }
    }
    
    if('HASH' eq $vref)
    {
      my $vType;
      if(exists $v{'type'})
      {
        $vType = $v{'type'};
      }
      
      $itemJsonText = struct2json($v, $vType);
      # 取消掉子结构空结构检查
      if('' eq $itemJsonText || '[]' eq $itemJsonText || '{}' eq $itemJsonText)
      {
        $zeroCount++;
      }
      
      $itemJsonText = formatJsonValue($itemJsonText);
      if(1 == $itemIsArray)
      {
        # 这个字段必须是数组，如果数组只有一个元素，xml里读出来会是Hash，因此需要在此转为数组
        $itemJsonText = '['.$itemJsonText.']';
      }
      $itemJsonText = "\"".$k."\":".$itemJsonText;
      push @itemJsonArr, $itemJsonText;    
    }
    elsif('ARRAY' eq $vref)
    {
      my $arrCount = scalar(@$v);
      my $arrItemZeroCount = 0;
      my @itemArrJsonArr = ();
      for(my $i = 0; $i < $arrCount; $i++)
      {
        my $arrItem = @$v[$i];
        my $arrItemType;
        if(exists $arrItem{'type'})
        {
          $arrItemType = $arrItem{'type'};
        }
      
        my $arrItemJsonText = struct2json($arrItem, $arrItemType);
        if('' eq $arrItemJsonText || '[]' eq $arrItemJsonText || '{}' eq $arrItemJsonText)
        {
          # 空结构
          $arrItemZeroCount++;
        }
        else
        {
          push @itemArrJsonArr, formatJsonValue($arrItemJsonText);
        }
      }
      if($arrItemZeroCount == $arrCount)
      {
        $zeroCount++;
      }
      $itemJsonText = join(',', @itemArrJsonArr);
      $itemJsonText = "\"".$k."\":[".$itemJsonText."]";
      push @itemJsonArr, $itemJsonText;
    }
    elsif('type' eq $k || 'version' eq $k)
    {
      # 这是xml节点属性转化来的，忽略
      $zeroCount++;
    }
    else
    { 
      my $oneEntryType = '';
      if(defined $structEntryInfoMap) {
        $oneEntryType = $structEntryInfoMap->{$k};
      }
      
      if(1 == $itemIsArray)
      {
        # 这个字段必须是数组          
        my @itemJsonValueArray = ();
        my @vArray = split(/\s+/, $v);
        my $vArrayCount = scalar(@vArray);
        if($vArrayCount > 0) {
          for(my $i = 0; $i < $vArrayCount; $i++) {
            push @itemJsonValueArray, getSimpleValue($vArray[$i], $oneEntryType);
          }
          $itemJsonText = '['.join(',', @itemJsonValueArray).']';
        } else {
          $itemJsonText = '[]';
        }          
      } else {
        $itemJsonText = getSimpleValue($v, $oneEntryType);
      }
        
      if('' eq $v || '0 ' eq $v || '0x0 ' eq $v || $v =~ /^0[^x]{1}$/)
      {
        $zeroCount++;
      }
      $itemJsonText = "\"".$k."\":".formatJsonValue($itemJsonText);
      push @itemJsonArr, $itemJsonText;    
    }
  } 
  
  if(0 == $kcount || $kcount == $zeroCount)
  {
    # 整个是空结构
    if('HASH' eq $structRef && $kcount > 0)
    {
      # 对于单字段的如果是空值也会认为是hash，所以要检查kcount
      $jsonText = '{}';
    }
    elsif('ARRAY' eq $structRef)
    {
      $jsonText = '[]';
    }
    else
    {
      $jsonText = '';
    }    
  }
  else
  {    
    $jsonText = join(',', @itemJsonArr);
    if('HASH' eq $structRef)
    {
      $jsonText = '{'.$jsonText.'}';
    }
    elsif('ARRAY' eq $structRef)
    {
      $jsonText = '['.$jsonText.']';
    }
  }
  
  return $jsonText;
}

sub getSimpleValue
{
  my $v = shift;
  my $type = shift;
  
  my $itemJsonText;
  if(0 == isStringType($type))
  {
    # 将字符串转为数值
    if($v =~ /^-?\d+\s*$/)
    {
      $itemJsonText = ''.int($v);
    }
    elsif($v =~ /^0x[a-f\d]+\s*$/)
    {
      $itemJsonText = ''.hex($v);
    }
  }
  
  if(!defined $itemJsonText)
  {
    # 给双引号加上转义
    my $stringValue = $v;
    $stringValue =~ s/(?<!\\)"/\\"/g; # "
    # 换号符换成\n
    $stringValue =~ s/[\r\n]+/\\n/g;
    $itemJsonText = "\"".$stringValue."\"";
  }
  return $itemJsonText;
}

sub getDefaultValue
{
  my $entryType = shift;
  my $isArray = shift;
  $entryType = lc($entryType);
  my $value;
  if(1 == $isArray)
  {
    $value = '[]';
  }
  elsif(isNumberType($entryType))
  {
    $value = '0';
  }
  elsif(isStringType($entryType))
  {
    $value = '';
  }
  else
  {
    $value = '{}';
  }
  return $value;
}

sub isNumberType
{
  my $entryType = shift;
  if('bigint' eq $entryType || 'biguint' eq $entryType || 
    'longlong' eq $entryType || 'ulonglong' eq $entryType || 
    'byte' eq $entryType || 'char' eq $entryType || 'uchar' eq $entryType || 
    'double' eq $entryType || 
    'float' eq $entryType || 
    'int32' eq $entryType || 'uint32' eq $entryType || 
    'int16' eq $entryType || 'uint16' eq $entryType || 
    'int8' eq $entryType || 'uint8' eq $entryType || 
    'short' eq $entryType || 'ushort' eq $entryType || 
    'int' eq $entryType || 'uint' eq $entryType || 
    'smallint' eq $entryType || 'smalluint' eq $entryType || 
    'tinyint' eq $entryType || 'tinyuint' eq $entryType)
  {
    return 1;
  }
  return 0;
}

sub isStringType
{
  my $entryType = shift;
  if('string' eq $entryType)
  {
    return 1;
  }
  return 0;
}

sub formatJsonValue
{
  my $jsonValue = shift;
  # 空字符串显示两个括号
  if('' eq $jsonValue) {
    $jsonValue = "\"\"";
  }
  return $jsonValue;
}

sub tlog
{
  my $logText = shift;
  $logContent.=$logText;
  print $logText;
}