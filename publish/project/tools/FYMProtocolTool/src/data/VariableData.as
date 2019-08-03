package data
{
	import flash.utils.Dictionary;
	
	import util.TemplateUtil;
	import util.VariableInfoUtil;
	
	import version.EnumToolVer;

	/**
	 * 协议结构体中每个变量的数据 
	 * @author lenovo
	 * 
	 */	
	public class VariableData
	{
		/**
		 * 变量声明的形式 
		 */		
		private static const m_variableContent: String = 
			"		/**\n" +
			"		* %desc%\n" +
			"		*/\n" +
			"		public var %variableName%: %type%;\n\n";
		
		/**
		 * 数组变量的声明模板
		 */		
		private static const m_variableArrContent: String = 
			"		/**\n" +
			"		* %desc%\n" +
			"		*/\n" +
			"		public var %variableName%: Vector.<%type%>;\n\n";

		/**
		 * 初始化数组变量
		 */		
		private static const m_initArrContent: String = 
			"			%variableName% = new Vector.<%type%>(); //maxCount %num%\n";
		
		
		/**
		 * 初始化变量 
		 */		
		private static const m_initArrContent2: String = 
			"			%variableName% = new %type%();" + "\n";
		
		/**
		 * 内置类型数组类型的dispose 
		 */		
		private static const m_disposeContent1: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				%variableName%.length = 0;" + "\n" +
			"				%variableName% = null;" + "\n" +
			"			}" + "\n\n";
		
		/**
		 * 自定义数组类型的dispose 
		 */		
		private static const m_disposeContent2: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				var i: int;" +  "\n" +
			"				for (i = 0; i < %variableName%.length; ++i)" + "\n" +
			"				{" + "\n" +
			"					if (%variableName%[i] != null)" + "\n" +
			"					{" + "\n" +
			"						%variableName%[i].dispose();" + "\n" +
			"						%variableName%[i] = null;" + "\n" +
			"					}" + "\n" +
			"				}" + "\n" +
			"				%variableName%.length = 0;" + "\n" +
			"				%variableName% = null;" + "\n" +
			"			}" + "\n\n";
		
		/**
		 * 自定义类型的dispose 
		 */		
		private static const m_disposeContent3: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				%variableName%.dispose();" + "\n" +
			"				%variableName% = null;" + "\n" +
			"			}" + "\n\n";
		
		/**
		 * 数组元素自定义类的reset模式
		 */		
		private static const m_resetCode1: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				var i: int;" +  "\n" +
			"				for (i = 0; i < %variableName%.length; ++i)" + "\n" +
			"				{" + "\n" +
			"%reset%" + "\n" +
			"				}" + "\n" +
			"				%variableName%.length = 0;" + "\n" +
			"			}" + "\n";
		
		/**
		 * 数组元素是内置类型的reset 
		 */		
		private static const m_resetCode2: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				%variableName%.length = 0;" + "\n" +
			"			}" + "\n";
		
		/**
		 * 普通类型的reset，主要是大整数和string类型
		 */		
		private static const m_resetCode3: String = 
			"%tab%%variableName%%index% = null;" + "\n";
		
		/**
		 * 单个自定义类型在数组中的reset 
		 */		
		private static const m_resetCode4: String = 
			"%tab%if (%variableName%[i] != null)" + "\n" +
			"%tab%{" + "\n" +
			"//%tab%%variableName%%index%.reset();" + "\n" +
			"//%tab%%variableName%%index% = null;" + "\n" +
			"%tab%}";
		
		/**
		 * 单个自定义类型的普通reset
		 */		
		private static const m_resetCode5: String = 
			"			if (%variableName% != null)" + "\n" +
			"			{" + "\n" +
			"				%variableName%.reset();" + "\n" +
			"			}" + "\n";
		
		
		/**
		 * 编码内置类型的模板 
		 */		
		private static const m_encodeContent1: String = 
			"			byteArray.%operate%(body.%variable%%index%);" + "\n";
		
		
		/**
		 * 编码struct类型变量的模板 
		 */		
		private static const m_encodeContent2: String = 
			"			_encode%className%(body.%name%%index%, byteArray);" + "\n";
		
		/**
		 * 编码union类型变量的模板
		 */		
		private static const m_encodeContent3: String = 
			"			_encode%className%(body.%select%, body.%name%%index%, byteArray);" + "\n";
		
		
		/**
		 * 编码大整数,比如longlong类型的模板 
		 */		
		private static const m_encodeContent4: String = 
			"			body.%name%%index%.encode(byteArray);" + "\n";
		
		/**
		 * 编码union类型里的数据
		 */		
		private static const m_encodeContent5: String = 
			"				case %selectValue%: //%macro%" + "\n" +
			"		%encode%" + "\n" +
			"					break;" + "\n";
		
		/**
		 * 编码数组类型的模板 
		 */
		private static const m_encodeContent6: String = 
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body.%refer% >= 0 && body.%refer% <= Macros.%macros%, \"数目必须合法\"); //maxnum %maxnum%" + "\n" +
			"				assert(body.%name% != null, \"数组不能为空\");" + "\n" +
			"			}" + "\n" +
			"			%numdef% = body.%refer%;" + "\n" +
			"%idef%" + // "			var i: int;\n"
			"			for (i = 0; i < num; i++)" + "\n" +
			"			{" + "\n" +
			"	%encode%" + "\n" +
			"			}" + "\n";
		
		/**
		 *  
		 */		
		private static const m_encodeContent8: String = 
			"			if (body.%refer% == 1)" + "\n" +
			"			{" + "\n" +
			"	%encode%" + "\n" +
			"			}" + "\n";
		
		/**
		 * 编码字符串类型的模板 
		 */		
		private static const m_encodeContent7: String = 
			"			var %name%SizeInfoPos: uint = byteArray.position;" + "\n" +
			"			byteArray.position += 4;" + "\n" +
			"			var %name%BeginPos : uint = byteArray.position;" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body.%name%%index%.length + 1 <= Macros.%num%, \"长度合法\"); //maxnum %num%" + "\n" +
			"			}" + "\n" +
			"			byteArray.writeUTFBytes(body.%name%%index%);" + "\n" +
			"			byteArray.writeByte(0);" + "\n" +
			"			DrUtil.directWriteUint(byteArray, %name%SizeInfoPos, byteArray.position - %name%BeginPos);" + "\n";
		
		
		/**
		 * 解码内置类型的模板 
		 */		
		private static const m_decodeContent1: String = 		
		"%tab%CONFIG::debug" + "\n" +
		"%tab%{" + "\n" +
		"%tab%	assert(byteArray.bytesAvailable >= %byteCount%, \"二进制数据必须够读\");" + "\n" +
		"%tab%}" + "\n" +
		"%tab%body.%name%%index% = byteArray.%operate%();" + "\n";
		
		/**
		 * 解码内置类型的模板（版本2）
		 */		
		private static const m_decodeContent1_v2: String = 		
			"%tab%if(byteArray.bytesAvailable < %byteCount%)" + "\n" +
			"%tab%{" + "\n" +
			"%tab%	return EnumNetResultCode.ERROR_BUFFER_LENGTH;" + "\n" +
			"%tab%}" + "\n" +
			"%tab%body.%name%%index% = byteArray.%operate%();" + "\n";
		
		/**
		 * 解码大整数,比如longlong类型的模板 
		 */		
		private static const m_decodeContent2: String = 
			"%tab%body.%name%%index%.decode(byteArray);";
		
		/**
		 * 解码大整数,比如longlong类型的模板（版本2）
		 */		
		private static const m_decodeContent2_v2: String = 
			"%tab%if(EnumNetResultCode.SUCESS != body.%name%%index%.decode(byteArray)) return EnumNetResultCode.ERROR_BUFFER_LENGTH;";
		
		/**
		 * 对字符串类型解码的模板 
		 */		
		private static const m_decodeContent3: String = 
			"%tab%var %name%Size: uint = byteArray.readUnsignedInt();" + "\n" +
			"%tab%CONFIG::debug" + "\n" +
			"%tab%{" + "\n" +
			"%tab%	assert(%name%Size <= byteArray.bytesAvailable, \"长度必须合法\");" + "\n" +
			"%tab%}" + "\n" +
			"%tab%body.%name%%index% = byteArray.readUTFBytes(%name%Size - 1);" + "\n" +
			"%tab%byteArray.readByte();" + "\n";
		
		/**
		 * 对字符串类型解码的模板（版本2）
		 */		
		private static const m_decodeContent3_v2: String = 
			"%tab%if(byteArray.bytesAvailable < 4)" + "\n" +
			"%tab%{" + "\n" +
			"%tab%	return EnumNetResultCode.ERROR_BUFFER_LENGTH;" + "\n" +
			"%tab%}" + "\n" +
			"%tab%var %name%Size: uint = byteArray.readUnsignedInt();" + "\n" +			
			"%tab%if(byteArray.bytesAvailable < %name%Size)" + "\n" +
			"%tab%{" + "\n" +
			"%tab%	return EnumNetResultCode.ERROR_BUFFER_LENGTH;" + "\n" +
			"%tab%}" + "\n" +
			"%tab%body.%name%%index% = byteArray.readUTFBytes(%name%Size - 1);" + "\n" +
			"%tab%byteArray.readByte();" + "\n";
		
		/**
		 *  
		 */			
		private static const m_decodeContent4: String = 	
			"%tab%_decode%className%(body.%select%, body.%name%%index%, byteArray);" + "\n";
			
			
		/**
		 * 解码struct类型变量的模板 
		 */		
		private static const m_decodeContent5: String = 
			"%tab%_decode%className%(body.%name%%index%, byteArray);" + "\n";	
		
		/**
		 * 解码struct类型变量的模板（版本2）
		 */		
		private static const m_decodeContent5_v2: String = 
			"%tab%var %className%DR: int = _decode%className%(body.%name%%index%, byteArray);" + "\n" +			
			"%tab%if(EnumNetResultCode.SUCESS != %className%DR)" + "\n" +
			"%tab%{" + "\n" +
			"%tab%	return %className%DR;" + "\n" +
			"%tab%}" + "\n";
		
		/**
		 * 数组类型的模板 
		 */
		private static const m_decodeContent6: String = 
			"			%numdef% = body.%refer%; //如果协议里没有设置，则默认是最大值 %macros%" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				assert(body.%refer% >= 0 && body.%refer% <= Macros.%macros%, \"数目必须合法\"); //maxnum %maxnum%" + "\n" +
			"				assert(body.%name% != null, \"数组不能为空\");" + "\n" +
			"			}" + "\n" +
			"			body.%name%.length = 0" + "\n" +
			"%idef%" + // "			var i: int;\n"
			"			for (i = 0; i < num; i++)" + "\n" +
			"			{" + "\n" +
			"	%initDecodeVar%" + "\n" +
			"%decode%" + "\n" +
			"			}" + "\n";
		
		/**
		 * 数组类型的模板（版本2）
		 */
		private static const m_decodeContent6_v2: String = 
			"			%numdef% = body.%refer%; //如果协议里没有设置，则默认是最大值 %macros%" + "\n" +
			"			CONFIG::debug" + "\n" +
			"			{" + "\n" +
			"				if(body.%refer% < 0 || body.%refer% > Macros.%macros%) //maxnum %maxnum%" + "\n" +
			"				{" + "\n" +
			"					return EnumNetResultCode.ERROR_REFER_INVALID;" + "\n" +
			"				}" + "\n" +
			"			}" + "\n" +
			"			body.%name%.length = 0" + "\n" +
			"%idef%" + // "			var i: int;\n"
			"			for (i = 0; i < num; i++)" + "\n" +
			"			{" + "\n" +
			"	%initDecodeVar%" + "\n" +
			"%decode%" + "\n" +
			"			}" + "\n";
		
		/**
		 * 解码union类型里的数据
		 */		
		private static const m_decodeContent7: String = 
			"				case %selectValue%: //%macro%" + "\n" +
			"		%decode%" + "\n" +
			"					break;" + "\n";
		
		
		private static const m_decodeContent8: String = 
			"			if (body.%refer% == 1)" + "\n" +
			"			{" + "\n" +
			"	%decode%" + "\n" +
			"			}" + "\n";
		
		private static var m_loopIndex: int;
		
		/**
		 * 取得struct类型的编码内容
		 * @param macroMap
		 * @return 
		 * 
		 */		
		private function _getStructDecode(macroMap: Dictionary, toolVersion: int): String
		{
			var result: String = "";
			
			var temp: String = null;
			var operate: String = VariableInfoUtil.instatce.getDefaultDecodeOper(type);
			var isDefaultDecode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null)//数组
			{
				if (macroData.value >= 1)
				{
					result = _getDecodeContent6(refer, macroData.value, count, variableName, toolVersion);
					temp = _getVarDecode(true, toolVersion);
					result = result.replace("%decode%", temp);
				}
//				else if (macroData.value == 1)
//				{
//					result = _getDecodeContent8(refer);
//					temp = _getVarDecode(false);
//					result = result.replace("%decode%", temp);
//				}
				else
				{
					CONFIG::debug
					{
						assert(false, "错误,协议定义错误");
					}
				}
				
			}
			else//不是数组
			{
				result = _getVarDecode(false, toolVersion);
			}
			
			return result;
		}
		
		private function _getUnionDecode(macroMap: Dictionary, toolVersion: int): String
		{
			var result: String = "";
			var temp: String = "";
			var operate: String = VariableInfoUtil.instatce.getDefaultDecodeOper(type);
			var isDefaultDecode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			result = m_decodeContent7;
			if (macroData != null)
			{
				if (macroData.value >= 1)
				{
					temp = _getStructDecode(macroMap, toolVersion);
					
//					temp = _getVarDecode(true);
					
				}
//				else if (macroData.value == 1)
//				{
//					temp = _getVarDecode(false);
//				}
				else
				{
					CONFIG::debug
					{
						assert(false, "错误,协议定义错误");
					}
				}
			}
			else
			{
				temp = _getVarDecode(false, toolVersion);
			}
			if(null == macroMap[id])
			{
				throw new Error("协议错误：" + id);
			}
			result = result.replace("%macro%", EnumMacro(macroMap[id]).name);
			result = result.replace("%selectValue%", EnumMacro(macroMap[id]).value);
			result = result.replace("%decode%", temp);
			
			return result;
		}
		
		/**
		 * 取得Union类型结构体的变量encode 
		 * @param macroMap
		 * @return 
		 * 
		 */		
		private function _getUnionEncode(macroMap: Dictionary): String
		{
			if(null == id || "" == id)
			{
				throw new Error("ERROR: union value undefinded: " + structure + ":" + variableName + ", WTF! (感谢teppei提供报错)");
			}
			var result: String = m_encodeContent5;
			var temp: String = "";
			var operate: String = VariableInfoUtil.instatce.getDefaultEncodeOper(type);
			var isDefaultEncode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null)
			{
				if (macroData.value >= 1)
				{
					temp = _getStructEncode(macroMap);
					//temp = _getVarEncode(true);
				}
//				else if (macroData.value == 1)
//				{
//					temp = _getVarEncode(false);
//				}
				else
				{
					CONFIG::debug
					{
						assert(false, "错误,协议定义错误");
					}
				}
			}
			else
			{
				temp = _getVarEncode(false);
			}
			
			if(null == macroMap[id])
			{
				throw new Error(id.toString());
			}
			result = result.replace("%macro%", EnumMacro(macroMap[id]).name);	
			result = result.replace("%selectValue%", EnumMacro(macroMap[id]).value);
			result = result.replace("%encode%", temp);	
			return result;
		}
		
		/**
		 * reset函数 
		 * @param macroMap
		 * @retuon
		 * rn 
		 * 
		 */		
		public function getResetContent(macroMap: Dictionary, clearI: Boolean): String
		{
			var result: String = "";
			var temp: String = null;
			var isDefault: Boolean = VariableInfoUtil.instatce.isDefaultType(type);
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null)//数组
			{
				if (macroData.value >= 1)
				{
					if (isDefault)
					{
						result = m_resetCode2;
						result = result.replace("%variableName%", variableName);
						result = result.replace("%variableName%", variableName);
					}
					else
					{
						result = m_resetCode1;
						result = result.replace("%variableName%", variableName);
						result = result.replace("%variableName%", variableName);
						result = result.replace("%variableName%", variableName);
						temp = _getVarRest(true);
						result = result.replace("%reset%", temp);
					}
				}
//				else if (macroData.value == 1)
//				{
//					result = _getVarRest(false);
//				}
				else
				{
					CONFIG::debug
					{
						assert(false, "错误,协议定义错误");
					}
				}
				
			}
			else
			{
				result = _getVarRest(false);
				
			}
			
			// 清除重复的i定义
			if(clearI)
			{
				result = result.replace(/\t*var i: int;/, "");
			}
			
			return result;
		}
		
		/**
		 * 取得单个变量的reset 
		 * @param isArray
		 * @return 
		 * 
		 */		
		private function _getVarRest(isArray: Boolean): String
		{
			var result: String = "";
			var isDefault: Boolean = VariableInfoUtil.instatce.isDefaultType(type);
			if (isDefault)//默认类型
			{
				if (VariableInfoUtil.instatce.isBigIntType(type) ||//大整数类型
					VariableInfoUtil.instatce.isStringType(type))//字符串类型
				{
					result = m_resetCode3;
					result = result.replace("%variableName%", variableName);
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t" : "\t\t\t");
					result = result.replace("%index%", isArray ? "[i]" : "");
				}
			}
			else
			{
				//不管该字段是union还是struct类型
				if (isArray)
				{
					result = m_resetCode4;
					result = result.replace("%variableName%", variableName);
					result = result.replace("%variableName%", variableName);
					result = result.replace("%variableName%", variableName);
					result = result.replace("%index%", isArray ? "[i]" : "");
					result = result.replace("%index%", isArray ? "[i]" : "");
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t" : "\t\t\t");
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t" : "\t\t\t");
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t\t" : "\t\t\t");
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t\t" : "\t\t\t");
					result = result.replace("%tab%", isArray ? "\t\t\t\t\t" : "\t\t\t");
				}
				else
				{
					result = m_resetCode5;
					result = result.replace("%variableName%", variableName);
					result = result.replace("%variableName%", variableName);
				}
			}
			
			return result;
		}
		
		/**
		 * 取得结构体类型中的变量的encode字符串
		 * @param macroMap
		 * @return 
		 * 
		 */		
		private function _getStructEncode(macroMap: Dictionary): String
		{
			var result: String = "";
			var temp: String = null;
			var operate: String = VariableInfoUtil.instatce.getDefaultEncodeOper(type);
			var isDefaultEncode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null)//数组
			{
				if (macroData.value >= 1)
				{
					result = _getEncodeContent6(refer, macroData.value, count, variableName);//采用数组类型的模板
					temp = _getVarEncode(true);
					result = result.replace("%encode%", temp);
				}
//				else if (macroData.value == 1)
//				{
//					result = _getEncodeContent8(refer)
//					temp = _getVarEncode(false);
//					result = result.replace("%encode%", temp);
//				}
				else
				{
					CONFIG::debug
					{
						assert(false, "错误,协议定义错误");
					}
				}
				
			}
			else//不是数组
			{
				result = _getVarEncode(false);
			}
			
			return result;
		}
		
		public function getDecodeContent(macroMap: Dictionary, type: String, toolVersion: int): String
		{
			var result: String = "";
			switch (type)
			{
				case "struct":
					result = _getStructDecode(macroMap, toolVersion);
					break;
				case "union":
					result = _getUnionDecode(macroMap, toolVersion);
					break;
				default:
					break;
			}
			
			return result;
		}
		
		
		
		/**
		 * 取得该字段的encode内容 
		 * @param macroMap
		 * @param type
		 * @return 
		 * 
		 */		
		public function getEncodeContent(macroMap: Dictionary, type: String): String
		{
			var result: String = "";
			switch (type)
			{
				case "struct":
					result = _getStructEncode(macroMap);
					break;
				case "union":
					result = _getUnionEncode(macroMap);
					break;
				default:
					break;
			}
			
			return result;
		}
		
		
		/**
		 * 变量名字 
		 */		
		public var variableName: String;
		
		/**
		 * 变量类型 
		 */		
		public var type: String;
		
		/**
		 * 变量描述 
		 */		
		public var desc: String;
		
		/**
		 * 变量数量，数目大于0的话就表示是数组
		 */		
		public var count: String;
		
		/**
		 *  
		 */		
		public var id: String;
		
		/**
		 * 变量所属结构体 
		 */		
		public var structure: String;
		
		/**
		 * 如果是数组类型的话，会索引到某个值，是数组当前的长度，最大值不能超过count
		 */		
		public var refer: String;
		
		/**
		 * 如果该变量是union类型的话，需要有一个select的值 
		 */		
		public var selectType: String;
		
		public var strSize: String;
		
		public function VariableData(structure: String, 
									variableName: String, 
									 type: String, 
									 desc: String,
									 count: String,
									 id: String,
									 selectType: String,
									 refer: String, 
									 strSize: String)
		{
			this.structure = structure;
			this.variableName = variableName;
			this.type = type;
			this.desc = desc;
			this.count = count;
			this.id = id;
			this.selectType = selectType;
			this.refer = refer;
			this.strSize = strSize;
		}
		
		private static const m_cloneContent1: String = 
			"			result.%variableName% = this.%variableName%;" + "\n";
		
		private static const m_cloneContent2: String = 
			"			result.%variableName% = this.%variableName%.%cloneFunc%(result.%variableName%);" + "\n";
		
		private static const m_cloneContent3: String = 
			"			var %variableName%Len: int = %variableName%.length;" + "\n" +
			"			var %variableName%LenR: int = result.%variableName%.length;" + "\n" +
			"			var %variableName%LenMin: int = %variableName%Len > %variableName%LenR ? %variableName%LenR : %variableName%Len;" + "\n" +
			"			var i: int;" +  "\n" +
			"			for (i = 0; i < %variableName%LenMin; ++i)" +  "\n" +
			"			{" + "\n" +
			"				this.%variableName%[i].%cloneFunc%(result.%variableName%[i]);" + "\n" +
			"			}" + "\n" +
			"			for (i = %variableName%LenMin; i < %variableName%Len; ++i)" +  "\n" +
			"			{" + "\n" +
			"				result.%variableName%.push(this.%variableName%[i].%cloneFunc%());" + "\n" +
			"			}" + "\n" +
			"			result.%variableName%.length = %variableName%.length;" + "\n";
		
		private static const m_cloneContent4: String = 
			"			var %variableName%Len: int = %variableName%.length;" + "\n" +
			"			var %variableName%LenR: int = result.%variableName%.length;" + "\n" +
			"			var %variableName%LenMin: int = %variableName%Len > %variableName%LenR ? %variableName%LenR : %variableName%Len;" + "\n" +
			"			var i: int;" +  "\n" +
			"			for (i = 0; i < %variableName%LenMin; ++i)" +  "\n" +
			"			{" + "\n" +
			"				result.%variableName%[i] = this.%variableName%[i];" + "\n" +
			"			}" + "\n" +
			"			for (i = %variableName%LenMin; i < %variableName%Len; ++i)" +  "\n" +
			"			{" + "\n" +
			"				result.%variableName%.push(this.%variableName%[i]);" + "\n" +
			"			}" + "\n" +
			"			result.%variableName%.length = %variableName%.length;" + "\n";
		
		
		public function getCloneContent(macroMap: Dictionary, structureMap: Dictionary, clearI: Boolean): String
		{
			var result: String = "";
			
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null && macroData.value >= 1)
			{
				if (VariableInfoUtil.instatce.isDefaultType(type) && !VariableInfoUtil.instatce.islonglongType(type) && !VariableInfoUtil.instatce.isulonglongType(type))//内置类型数组
				{
					result = m_cloneContent4;
				}
				else
				{
					result = m_cloneContent3;
				}
			}
			else
			{
				if (VariableInfoUtil.instatce.isDefaultType(type) && !VariableInfoUtil.instatce.islonglongType(type) && !VariableInfoUtil.instatce.isulonglongType(type))//内置变量
				{
					result = m_cloneContent1;
				}
				else//自定义类型变量
				{
					result = m_cloneContent2;
				}
			}
			
			var pdata: ProtocolData = structureMap[type];
			if(null != pdata && null != pdata.extendParent && "" != pdata.extendParent)
			{
				result = result.replace(/%cloneFunc%/g, "clone" + type);
			}
			else
			{
				result = result.replace(/%cloneFunc%/g, "clone");
			}
			
			result = result.replace(/%variableName%/g, variableName);
			// 清除重复的i定义
			if(clearI)
			{
				result = result.replace(/\t*var i: int;/, "");
			}
			
			return result;
		}
		
		
		public function getDisposeContent(macroMap: Dictionary, clearI: Boolean): String
		{
			var result: String = "";
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			if (macroData != null && macroData.value >= 1)
			{
				if (VariableInfoUtil.instatce.isDefaultType(type))//内置类型数组
				{
					result = m_disposeContent1;
				}
				else//自定义数组类型
				{
					result = m_disposeContent2;
				}
			}
			else
			{
				if (VariableInfoUtil.instatce.isDefaultType(type))//内置变量
				{
					
				}
				else//自定义类型变量
				{
					result = m_disposeContent3;
				}
			}
			
			result = result.replace(/%variableName%/g, variableName);
			// 清除重复的i定义
			if(clearI)
			{
				result = result.replace(/\t*var i: int;/, "");
			}
			return result;
		}
		
		
		
		public function getPreInitContent(macroMap: Dictionary): String
		{
			var result: String = "";
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			
			if (macroData != null && macroData.value >= 1)
			{
				var initType1: String = VariableInfoUtil.instatce.getASType(type);
				if (initType1 == null)
				{
					initType1 = type;
				}
				result = m_initArrContent;
				result = result.replace(/%variableName%/g, variableName);
				result = result.replace(/%num%/g, macroData.value);
				result = result.replace(/%type%/g, initType1);
			}
			else
			{
				result = _getSingleVarInit(false);
				
//				var isNeedInit: Boolean = false;
//				var initType2: String = VariableInfoUtil.instatce.getASType(type);
//				if (initType2 != null)
//				{
//					if (VariableInfoUtil.instatce.isStringType(type) ||
//						VariableInfoUtil.instatce.isBigIntType(type))
//					{
//						isNeedInit = true;
//					}
//				}
//				else
//				{
//					initType2 = type;
//					isNeedInit = true;
//					
//				}
//				if (isNeedInit)
//				{
//					result = m_initArrContent2;
//					result = result.replace("%variableName%", variableName);
//					result = result.replace("%type%", initType2);
//				}
				
			}
			return result;
		}
		
		private function _getSingleVarInit(isArray: Boolean): String
		{
			var result: String = "";
			var isNeedInit: Boolean = false;
			var initType2: String = VariableInfoUtil.instatce.getASType(type);
			if (initType2 != null)
			{
				if (VariableInfoUtil.instatce.isStringType(type) ||
					VariableInfoUtil.instatce.isBigIntType(type))
				{
					isNeedInit = true;
				}
			}
			else
			{
				initType2 = type;
				isNeedInit = true;
				
			}
			if (isNeedInit)
			{
				result = m_initArrContent2;
				result = result.replace(/%variableName%/g, isArray ? "body." + variableName + "[i]" : variableName);
				result = result.replace(/%type%/g, initType2);
			}
			
			return result;
		}
		
		public function getVariableContent(macroMap: Dictionary, tmplUtil: TemplateUtil): String
		{
			var macroData: EnumMacro = macroMap[count] as EnumMacro;
			
			var asType: String = VariableInfoUtil.instatce.getASType(type);
			
			var result: String = tmplUtil.makeAttributeDef(variableName, null != asType ? asType : type, desc, false, null != macroData && macroData.value >= 1, false, null, null);
			
			return result;
		}
		
		
		
		private function _getResetContent1(): String
		{
			return "";
		}
		
		private function _getEncodeContent1(isArray: Boolean, operate: String, variableName: String): String
		{
			var result: String = m_encodeContent1;
			result = result.replace(/%operate%/g, operate);
			result = result.replace(/%variable%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getEncodeContent4(isArray: Boolean, variableName: String): String
		{
			var result: String = m_encodeContent4;
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getEncodeContent2(isArray: Boolean, type: String, variableName: String): String
		{
			var result: String = m_encodeContent2;
			result = result.replace(/%className%/g, type);
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getEncodeContent7(isArray: Boolean, variableName: String, strSize: String): String
		{
			var result: String = m_encodeContent7;
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%num%/g, strSize);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getEncodeContent3(isArray: Boolean, selectType: String, type: String, variableName: String): String
		{
			var result: String = m_encodeContent3;
			result = result.replace(/%select%/g, selectType);
			result = result.replace(/%className%/g, type);
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		
		private function _getEncodeContent8(refer: String): String
		{
			var result: String = m_encodeContent8;
			result = result.replace(/%refer%/g, refer);
			return result;
		}
		
		
		
		private function _getEncodeContent6(refer: String, maxNum: int, count: String, variable: String): String
		{
			var result: String = m_encodeContent6;//采用数组类型的模板
			if (refer != "")
			{
				result = result.replace(/%refer%/g, refer);
			}
			else
			{
				refer = maxNum.toString();
				result = result.replace(/body\.%refer%/g, refer);
			}
			result = result.replace(/%maxnum%/g, maxNum.toString());
			result = result.replace(/%macros%/g, count);
			result = result.replace(/%name%/g, variableName);
			
			// 第一个循环需要声明下变量i
			if(0 == m_loopIndex)
			{
				result = result.replace("%idef%", "			var i: int;\n");
				result = result.replace("%numdef%", "var num: int");
			}
			else
			{
				result = result.replace("%idef%", "");
				result = result.replace("%numdef%", "num");
			}
			m_loopIndex++;
			
			return result;
		}
		
		private function _getVarEncode(isArray: Boolean): String
		{
			var operate: String = VariableInfoUtil.instatce.getDefaultEncodeOper(type);
			var isDefaultEncode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			var result: String = "";
			if (isDefaultEncode)//可以直接写入二进制
			{
				result = _getEncodeContent1(isArray, operate, variableName);
			}
			else//调用该类型的encode方法
			{
				if (VariableInfoUtil.instatce.isBigIntType(type))//大整数类型用另外一种形式
				{
					result = _getEncodeContent4(isArray, variableName);
				}
				else if (VariableInfoUtil.instatce.isStringType(type))
				{
					result = _getEncodeContent7(isArray, variableName, strSize);
				}
				else
				{
					if (selectType != "")//如果该变量是个union类型,需要用另一种形式
					{
						result = _getEncodeContent3(isArray, selectType, type, variableName);
					}
					else//自定义类型
					{
						result = _getEncodeContent2(isArray, type, variableName);
					}
				}
			}
			
			return result;
		}
		
		
		private function _getDecodeContent1(isArray: Boolean, type: String, variable: String, toolVersion: int): String
		{
			var result: String;
			if(EnumToolVer.V2 == toolVersion)
			{
				result = m_decodeContent1_v2;
			}
			else
			{
				result = m_decodeContent1;
			}
			result = result.replace(/%tab%/g, isArray ? "\t\t\t\t" : "\t\t\t");
			result = result.replace(/%byteCount%/g, VariableInfoUtil.instatce.getTypeByteCount(type));
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%operate%/g, VariableInfoUtil.instatce.getDefaultDecodeOper(type));
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getDecodeContent2(isArray: Boolean, variableName: String, toolVersion: int): String
		{
			var result: String;
			if(EnumToolVer.V2 == toolVersion)
			{
				result = m_decodeContent2_v2;
			}
			else
			{
				result = m_decodeContent2;
			}
			result = result.replace(/%tab%/g, isArray ? "\t\t\t\t" : "\t\t\t");
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getDecodeContent3(isArray: Boolean, variableName: String, toolVersion: int): String
		{
			var result: String;
			if(EnumToolVer.V2 == toolVersion)
			{
				result = m_decodeContent3_v2;
			}
			else
			{
				result = m_decodeContent3;
			}
			result = result.replace(/%tab%/g, isArray ? "\t\t\t\t" : "\t\t\t");
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getDecodeContent4(isArray: Boolean, selectType: String, type: String, variableName: String): String
		{
			var result: String = m_decodeContent4;
			result = result.replace(/%tab%/g, isArray ? "\t\t\t\t" : "\t\t\t");
			result = result.replace(/%select%/g, selectType);
			result = result.replace(/%className%/g, type);
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getDecodeContent5(isArray: Boolean, type: String, variableName: String, toolVersion: int): String
		{
			var result: String;
			if(EnumToolVer.V2 == toolVersion)
			{
				result = m_decodeContent5_v2;
			}
			else
			{
				result = m_decodeContent5;
			}
			result = result.replace(/%tab%/g, isArray ? "\t\t\t\t" : "\t\t\t");
			result = result.replace(/%className%/g, type);
			result = result.replace(/%name%/g, variableName);
			result = result.replace(/%index%/g, isArray ? "[i]" : "");
			return result;
		}
		
		private function _getDecodeContent6(refer: String, maxNum: int, count: String, variableName: String, toolVersion: int): String
		{
			var result: String;
			if(EnumToolVer.V2 == toolVersion)
			{
				result = m_decodeContent6_v2;
			}
			else
			{
				result = m_decodeContent6;
			}
			
			if (refer != "")
			{
				result = result.replace("%macros%", "");
				result = result.replace("%refer%", refer);
				result = result.replace("%refer%", refer);
				result = result.replace("%refer%", refer);
			}
			else
			{
				refer = maxNum.toString();
				result = result.replace("%macros%", count);
				result = result.replace("body.%refer%", refer);
				result = result.replace("body.%refer%", refer);
				result = result.replace("body.%refer%", refer);
			}
			result = result.replace("%maxnum%", maxNum.toString());
			result = result.replace("%macros%", count);
			result = result.replace("%name%", variableName);
			result = result.replace("%name%", variableName);
			
			result = result.replace("%initDecodeVar%", _getSingleVarInit(true));
			
			// 第一个循环需要声明下变量i
			if(0 == m_loopIndex)
			{
				result = result.replace("%idef%", "			var i: int;\n");
				result = result.replace("%numdef%", "var num: int");
			}
			else
			{
				result = result.replace("%idef%", "");
				result = result.replace("%numdef%", "num");
			}
			m_loopIndex++;
			return result;
		}
		
		private function _getDecodeContent8(refer: String): String
		{
			var result: String = m_decodeContent8;
			result = result.replace(/%refer%/g, refer);
			return result;
		}
		
		
		private function _getDecodeContent7(): String
		{
			var result: String = m_decodeContent7;
			
			return result;
		}
		
		private function _getVarDecode(isArray: Boolean, toolVersion: int): String
		{
			var result: String = null;
			var operate: String = VariableInfoUtil.instatce.getDefaultDecodeOper(type);
			var isDefaultDecode: Boolean = (operate != null);//根据类型判断是否可以直接操作
			if (isDefaultDecode)//可以直接写入二进制
			{
				result = _getDecodeContent1(isArray, type, variableName, toolVersion);
			}
			else//调用该类型的encode方法
			{
				if (VariableInfoUtil.instatce.isBigIntType(type))//大整数类型用另外一种形式
				{
					result = _getDecodeContent2(isArray, variableName, toolVersion);
				}
				else if (VariableInfoUtil.instatce.isStringType(type))//字符串类型要另外处理
				{
					result = _getDecodeContent3(isArray, variableName, toolVersion);
				}
				else
				{
					if (selectType != "")//如果该变量是个union类型
					{
						result = _getDecodeContent4(isArray, selectType, type, variableName);
					}
					else
					{
						result = _getDecodeContent5(isArray, type, variableName, toolVersion);
					}
				}
			}
			return result;
		}
		
		public static function resetLoop() : void
		{
			m_loopIndex = 0;
		}
	}
}