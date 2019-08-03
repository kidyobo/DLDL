package generator
{
	import data.EnumMacro;
	import data.EnumProtocolInfo;
	import data.FileCacheData;
	import data.ProtocolData;
	import data.VariableData;
	
	import util.VariableInfoUtil;
	
	import version.EnumToolVer;

	/**
	 * 负责生成decode文件 
	 * @author jacksonqian
	 * 
	 */	
	public class DecodeUtilGenerator extends BaseFileGenerator
	{
		/**
		 * decode一个strct
		 */		
		private static const m_decodeStructContent: String = 
			"		/**" + "\n" +
			"		* 对%className%进行decode，struct类型 " + "\n" +
			"		*/" + "\n" +
			"		private function _decode%className%(body: %className%, byteArray: ByteArray): void" + "\n" +
			"		{" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
			"			}" + "\n\n" +
			"%decodeContent%" + "\n" +
			"		}\n";
		
		/**
		 * decode一个strct（版本2，含返回值）
		 */		
		private static const m_decodeStructContent_v2: String = 
			"		/**" + "\n" +
			"		* 对%className%进行decode，struct类型 " + "\n" +
			"		*/" + "\n" +
			"		private function _decode%className%(body: %className%, byteArray: ByteArray): int" + "\n" +
			"		{" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
			"			}" + "\n\n" +
			"%decodeContent%" + "\n" +
			"			return EnumNetResultCode.SUCESS;" + "\n" +
			"		}\n";
		
		/**
		 * decode一个union 
		 */		
		private static const m_decodeUnionContent: String = 
			"		/**" + "\n" +
			"		* 对%className%进行decode，union类型" + "\n" +
			"		*/" + "\n" +
			"		private function _decode%className%(select: int, body: %className%, byteArray: ByteArray): void" + "\n" +
			"		{" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
			"			}" + "\n\n" +
			"			switch (select)" + "\n" +
			"			{" + "\n" +
			"%decodeContent%" + "\n" +
			"				default:" + "\n" +
			"					break;" + "\n" +
			"			}" + "\n" +
			"		}\n";
		
		/**
		 * decode一个union 
		 */		
		private static const m_decodeUnionContent_v2: String = 
			"		/**" + "\n" +
			"		* 对%className%进行decode，union类型" + "\n" +
			"		*/" + "\n" +
			"		private function _decode%className%(select: int, body: %className%, byteArray: ByteArray): int" + "\n" +
			"		{" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body != null, \"body类型必须正确%className%\");" + "\n" +
			"			}" + "\n\n" +
			"			switch (select)" + "\n" +
			"			{" + "\n" +
			"%decodeContent%" + "\n" +
			"				default:" + "\n" +
			"					break;" + "\n" +
			"			}" + "\n" +
			"			return EnumNetResultCode.SUCESS;" + "\n" +
			"		}\n";
		
		/**
		 * 初始化的内容模板 
		 */
		private static const m_initTemplate: String=
			"			m_id2DecodeFunction[%msgIDValue%] = _decode%className%;"  + "\n";	
			
		
		/**
		 * 所有解码函数的集合 
		 */
		private var m_decodeContent: String;
		
		/**
		 * 初始化内容 
		 */		
		private var m_initContent: String;
		
		private var m_isTiny: Boolean;
	
		/**
		 * 构造函数 
		 * @param fileName
		 * @param fileCache
		 * 
		 */		
		public function DecodeUtilGenerator(isTiny: Boolean, fileName:String, fileCache:FileCacheData)
		{
			super(fileName, fileCache);
			m_isTiny = isTiny;
			m_decodeContent= "";
			m_initContent = "";
		}
		
		/**
		 *  生成文件
		 * @param savePath
		 * @param toolVersion 工具版本，不同版本产生的文件可能不同
		 * 
		 */		
		public 	function generate(savePath: String, toolVersion: int): void
		{
			CONFIG::debug
			{
				assert(savePath != null, "参数必须合法");
			}
			
			var list: Vector.<EnumProtocolInfo> = m_fileCache.decodeList;
			var len: int = list.length;
			var cnt: int;
			var structure: ProtocolData = null;
			var content: String = "";
			var fileStr: String;
			//遍历每个需要decode的协议
			for (var i: int = 0; i < len; ++i)
			{
				if(m_isTiny && m_fileCache.tinyDecoders.indexOf(list[i].msgID) < 0)
				{
					continue;
				}
				
				structure = m_fileCache.structMap[list[i].name];//取到对应body的协议信息
				if (structure != null)
				{
					_processStructure(savePath, structure, toolVersion);
				}
				
				_generateInitCount(list[i]);
				cnt++;
			}
			
			m_templetStr = m_templetStr.replace("%count%", cnt);
			m_templetStr = m_templetStr.replace("%decodeFuncListContent%", m_decodeContent);
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
		private function _processStructure(savePath: String, structure: ProtocolData, toolVersion: int): void
		{
			//先得检查这个结构体有没有被encode过
			if (m_fileCache.decodeGeneratorMap[structure.protocolName] != null)
			{
				return;
			}
			m_fileCache.decodeGeneratorMap[structure.protocolName] = true;
			
			//每个结构体要对应生成一个函数
			var funcContent: String = "\n";
			if (structure.type == "struct")
			{
				if(EnumToolVer.V2 == toolVersion)
				{
					funcContent += m_decodeStructContent_v2;
				}
				else
				{
					funcContent += m_decodeStructContent;
				}
			}
			else if (structure.type == "union")
			{
				if(EnumToolVer.V2 == toolVersion)
				{
					funcContent += m_decodeUnionContent_v2;
				}
				else
				{
					funcContent += m_decodeUnionContent;
				}
			}
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			funcContent = funcContent.replace("%className%", structure.protocolName);
			
			var decodeStr: String = structure.getDecodeStr(m_fileCache.macroMap, toolVersion);
			funcContent = funcContent.replace("%decodeContent%", decodeStr);
			m_decodeContent += funcContent;
			
			var variableList: Vector.<VariableData> = structure.variableList;
			var variable: VariableData = null;
			var len: int = variableList.length;
			//遍历每个变量，对于非自定义类型变量的解码需要额外再生成函数
			for (var i: int = 0; i < len; ++i)
			{
				variable = variableList[i];
				if (!VariableInfoUtil.instatce.isDefaultDecodeOper(variable.type))
				{
					//对于那些不是直接操作的类型以及大整数类型，需要继续对其结构体进行生成解码函数
					_processStructure(savePath, m_fileCache.structMap[variable.type], toolVersion);
				}
			}
		}
	}
}