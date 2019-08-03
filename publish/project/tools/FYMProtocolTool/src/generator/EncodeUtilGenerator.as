package generator
{
	import data.EnumMacro;
	import data.EnumProtocolInfo;
	import data.FileCacheData;
	import data.ProtocolData;
	import data.VariableData;
	
	import util.VariableInfoUtil;

	public class EncodeUtilGenerator extends BaseFileGenerator
	{
		/**
		 * encode一个struct
		 */		
		private static const m_encodeStructContent: String = 
		"		/**" + "\n" +
		"		* 对%className%进行encode，struct类型 " + "\n" +
		"		*/" + "\n" +
		"		private function _encode%className%(body: %className%, byteArray: ByteArray): void" + "\n" +
		"		{" + "\n" +
		"			CONFIG::debug" + "\n" +
		"			{" + "\n" +
		"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
		"			}" + "\n\n" +
		"%encodeContent%" + "\n" +
		"		}\n"
		
		/**
		 * encode一个union 
		 */		
		private static const m_encodeUnionContent: String = 
			"		/**" + "\n" +
			"		* 对%className%进行encode，union类型" + "\n" +
			"		*/" + "\n" +
			"		private function _encode%className%(select: int, body: %className%, byteArray: ByteArray): void" + "\n" +
			"		{" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
			"			}" + "\n\n" +
			"			switch (select)" + "\n" +
			"			{" + "\n" +
			"%encodeContent%" + "\n" +
			"				default:" + "\n" +
			"					break;" + "\n" +
			"			}" + "\n" +
			"		}\n";
		
		/**
		 * 初始化的内容模板 
		 */			
		private static const m_initTemplate: String=
			"			m_id2EncodeFunction[%msgIDValue%] = _encode%className%;"  + "\n";
			
		/**
		 * 所有编码函数的集合 
		 */		
		private var m_encodeContent: String;
		
		/**
		 * 初始化编码函数的内容 
		 */		
		private var m_initContent: String;
		
		private var m_isTiny: Boolean;
		
		/**
		 * 构造函数 
		 * @param fileName
		 * @param fileCache
		 * 
		 */		
		public function EncodeUtilGenerator(isTiny: Boolean, fileName: String, fileCache: FileCacheData)
		{
			super(fileName, fileCache);
			
			m_isTiny = isTiny;
			m_encodeContent = "";
			m_initContent = "";
		}
		
		/**
		 * 生成相应的文件 
		 * @param savePath
		 * 
		 */		
		public 	function generate(savePath: String): void
		{
			CONFIG::debug
			{
				assert(savePath != null, "参数必须合法");
			}
			
			var list: Vector.<EnumProtocolInfo> = m_fileCache.encodeList;
			var len: int = list.length;
			var cnt: int;
			var structure: ProtocolData = null;
			//遍历需要encode的协议，生成相对应的字符串以及对应的初始化内容
			for (var i: int = 0; i < len; ++i)
			{
				if(m_isTiny && m_fileCache.tinyEncoders.indexOf(list[i].msgID) < 0)
				{
					continue;
				}
				
				structure = m_fileCache.structMap[list[i].name];//取到对应body的协议信息
				if (structure != null)
				{
					_processStructure(savePath, structure);
				}
				
				_generateInitCount(list[i]);
				cnt++;
			}
			m_templetStr = m_templetStr.replace("%count%", cnt);
			m_templetStr = m_templetStr.replace("%encodeFuncListContent%", m_encodeContent);
			m_templetStr = m_templetStr.replace("%initMap%", m_initContent);
			
			_saveFile(savePath);
		}
		
		/**
		 * 生成每个需要编码的协议的初始化内容 
		 * @param protocolInfo
		 * 
		 */		
		private function _generateInitCount(protocolInfo: EnumProtocolInfo): void
		{
			CONFIG::debug
			{
				assert(protocolInfo != null, "参数必须要合法啊");
			}
			
			if (protocolInfo.msgID == "")
			{
				return;
			}
			var initTemp: String = m_initTemplate;
			initTemp = initTemp.replace("%className%", protocolInfo.name);
			var macroData: EnumMacro = m_fileCache.macroMap[protocolInfo.msgID];
			initTemp = initTemp.replace("%msgIDValue%", macroData.value);
			m_initContent += initTemp;
		}
			
		
		/**
		 * 处理每一个协议结构体，生成其对应的encode函数字符串 
		 * @param savePath
		 * @param structure
		 * 
		 */		
		private function _processStructure(savePath: String, structure: ProtocolData): void
		{
			//先得检查这个结构体有没有被encode过
			if (m_fileCache.encodeGeneratorMap[structure.protocolName] != null)
			{
				return;
			}
			m_fileCache.encodeGeneratorMap[structure.protocolName] = true;
			
			//每个结构体要对应生成一个函数
			var funcContent: String = "\n";
			if (structure.type == "struct")
			{
				funcContent += m_encodeStructContent;
			}
			else if (structure.type == "union")
			{
				funcContent += m_encodeUnionContent;
			}
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			
			var encodeStr: String = structure.getEncodeStr(m_fileCache.macroMap);
			funcContent = funcContent.replace("%encodeContent%", encodeStr);
			m_encodeContent += funcContent;
			
			var variableList: Vector.<VariableData> = structure.variableList;
			var variable: VariableData = null;
			var len: int = variableList.length;
			//遍历每个变量，对于自定义类型变量的解码需要额外再生成函数
			for (var i: int = 0; i < len; ++i)
			{
				variable = variableList[i];
				if (!VariableInfoUtil.instatce.isDefaultEncodeOper(variable.type))
				{
					_processStructure(savePath, m_fileCache.structMap[variable.type]);
				}
			}
		}
	}
}