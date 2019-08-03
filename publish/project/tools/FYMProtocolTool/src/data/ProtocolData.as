package data
{
	import flash.utils.Dictionary;
	
	import util.TemplateUtil;

	/**
	 * 协议的数据结构
	 * @author jacksonqian
	 * 
	 */	
	public class ProtocolData
	{
		/**
		 * 版本号 
		 */		
		public var version: String;
		
		/**
		 * 协议的名字 
		 */		
		public var protocolName: String;
		
		/**
		 * 继承父类名字，目前只有decode支持继承，encode不支持。
		 */		
		public var extendParent: String;
		
		/**
		 * 类型，union或者struct 
		 */		
		public var type: String;
		
		/**
		 * 协议里每个字段的信息 
		 */		
		private var m_variableList: Vector.<VariableData>;
		
		/**
		 * 构造函数 
		 * @param fileName
		 * 
		 */		
		public function ProtocolData(protocolName: String, extendParent: String, type: String, version: String)
		{
			this.protocolName = protocolName;
			this.extendParent = extendParent;
			this.type = type;
			this.version = version;
			m_variableList = new Vector.<VariableData>();
		}
		
		public function trimExtendDumplication(structureMap: Dictionary) : void
		{
			if(null != extendParent && "" != extendParent)
			{
				var parentData: ProtocolData = structureMap[extendParent];
				var varData: VariableData;
				for(var i: int = m_variableList.length - 1; i >= 0; i--)
				{
					varData = m_variableList[i];
					if(_isDumplicationWith(varData.variableName, parentData, structureMap))
					{
						m_variableList.splice(i, 1);
					}
				}
			}
		}
		
		private function _isDumplicationWith(varName: String, parentData: ProtocolData, structureMap: Dictionary) : Boolean
		{
			while(null != parentData)
			{
				if(parentData.hasNamedVar(varName))
				{
					return true;
				}
				
				if(null != parentData.extendParent && "" != parentData.extendParent)
				{
					parentData = structureMap[parentData.extendParent];
				}
				else
				{
					parentData = null;
				}
			}
			
			return false;
		}
		
		public function hasNamedVar(varName: String) : Boolean
		{
			for each(var varData: VariableData in m_variableList)
			{
				if(varData.variableName == varName)
				{
					return true;
				}
			}
			
			return false;
		}
		
		/**
		 * 取得变量的列表 
		 * @return 
		 * 
		 */		
		public function get variableList(): Vector.<VariableData>
		{
			return m_variableList;
		}
		
		/**
		 * 添加一个变量数据 
		 * @param data
		 * 
		 */		
		public function addVariable(data: VariableData): void
		{
			m_variableList.push(data);
		}
		
		/**
		 * 取得协议解码的内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getDecodeStr(macroMap: Dictionary, toolVersion: int): String
		{
			var result: String = "";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				result += "			_decode" + extendParent + "(body, byteArray);";
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			VariableData.resetLoop();
			for (var i: int = 0; i < len; ++i)
			{
				if("" != result)
				{
					result += "\n";
				}
				
				variable = m_variableList[i];
				result += variable.getDecodeContent(macroMap, type, toolVersion);
			}
			
			var index: int = result.lastIndexOf("\n");
			if (index == result.length - 1)
			{
				result = result.substring(0, result.length -1);
			}
			return result;
		}
		
		/**
		 * 取得协议编码的内容 
		 * @return 
		 * 
		 */		
		public function getEncodeStr(macroMap: Dictionary): String
		{
			var result: String = "";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				result += "			_encode" + extendParent + "(body, byteArray);";
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			VariableData.resetLoop();
			for (var i: int = 0; i < len; ++i)
			{
				if("" != result)
				{
					result += "\n";
				}
				
				variable = m_variableList[i];
				result += variable.getEncodeContent(macroMap, type);
			}
			
			var index: int = result.lastIndexOf("\n");
			if (index == result.length - 1)
			{
				result = result.substring(0, result.length -1);
			}
			return result;
		}
		
		/**
		 * 取得协议reset的内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getResetStr(macroMap: Dictionary): String
		{
			var result: String = "		public function reset(): void\n" + 
				"		{\n" + "";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				result += "			super.reset();\n";
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			for (var i: int = 0; i < len; ++i)
			{
				variable = m_variableList[i];
				result += variable.getResetContent(macroMap, result.search("var i: int;") >= 0);
			}
			
			result += "		}\n\n";
			return result;
		}
		
		/**
		 * 取得clone函数的内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getCloneStr(macroMap: Dictionary, structureMap: Dictionary): String
		{
			var result: String = "";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				var parentData: ProtocolData = structureMap[extendParent];
				if(null != parentData.extendParent && "" != parentData.extendParent)
				{
					result += "			super.clone" + extendParent + "(result);\n";
				}
				else
				{
					result += "			super.clone(result);\n";
				}
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			for (var i: int = 0; i < len; ++i)
			{
				variable = m_variableList[i];
				result += variable.getCloneContent(macroMap, structureMap, result.search("var i: int;") >= 0);
			}
			
			return result;
		}
		
		/**
		 * 取得协议dispose的内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getDisposeStr(macroMap: Dictionary): String
		{
			var result: String = "		public function dispose(): void\n" + 
				"		{\n";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				result += "			super.dispose();\n";
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			for (var i: int = 0; i < len; ++i)
			{
				variable = m_variableList[i];
				result += variable.getDisposeContent(macroMap, result.search("var i: int;") >= 0);
			}
			result += "		}\n\n";
			return result;
		}
		
		/**
		 * 取得协议字段初始化的内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getInitStr(macroMap: Dictionary): String
		{
			var result: String = "";
			
			// 如果有父类则先decode父类的内容
			if(null != extendParent && "" != extendParent)
			{
				result += "			super();\n";
			}
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			for (var i: int = 0; i < len; ++i)
			{
				variable = m_variableList[i];
				result += variable.getPreInitContent(macroMap);
			}
			
			return result;
		}
		
		/**
		 * 取得协议数据结构的字段内容 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		public function getProtocolStr(macroMap: Dictionary, tmplUtil: TemplateUtil): String
		{
			var result: String = "";
			
			var variable: VariableData = null;
			var len: int = m_variableList.length;
			for (var i: int = 0; i < len; ++i)
			{
				variable = m_variableList[i];
				result += variable.getVariableContent(macroMap, tmplUtil) + "\n";
			}
			
			return result;
		}
	}
}