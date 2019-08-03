package
{
	import data.EnumMacro;
	import data.EnumProtocolInfo;
	import data.FileCacheData;
	import data.ProtocolData;
	import data.VariableData;
	
	import flash.desktop.NativeApplication;
	import flash.filesystem.File;
	
	import generator.MacroFileGenerator;
	import generator.ProtocolStructureGenerator;
	import generator.SendMsgUtilGenerator;
	
	import mx.controls.Alert;
	
	import util.As2Ts;
	import util.LoadFileUtil;
	import util.TemplateUtil;
	
	import version.EnumToolVer;

	public class ProtocolParse
	{
		private var m_savaPath: String;
		
		private var m_fileCacheData: FileCacheData;
		
		private var m_loadUtil: LoadFileUtil;
		
		private var m_tmplUtil: TemplateUtil;
		
		private var m_pcName: String;
		
		private var m_isCloseApp: Boolean;
		
		private var m_xmlList: Vector.<String>;
		
		private var m_endCall: Function;
		
		private var m_requestExp: RegExp = /Request$/;
		
		/**
		 * 构造函数 
		 * 
		 */		
		public function ProtocolParse()
		{
			m_fileCacheData = new FileCacheData();
			m_loadUtil = new LoadFileUtil();
		}
		
		/**
		 * 入口函数，开始转换
		 * @param sourcePath xml在的路径，绝对路径
		 * @param targetPath as所在的路径，相对路径
		 * @param isCloseApp 是否自动关闭程序
		 * 
		 */		
		public function beginConvert(pcName: String, sourcePath: String, 
									 targetPath: String, 
									 isCloseApp: Boolean,
									 onEndFunc: Function = null): void
		{
			m_pcName = pcName;
			m_isCloseApp = isCloseApp;
			m_endCall = onEndFunc;
			
			m_xmlList = new Vector.<String>();
			
			var srcFile: File =  new File(sourcePath);
			if (srcFile.exists)
			{
				if (!srcFile.isDirectory)
				{
					Alert.show(sourcePath + " 不是目录，指定的是文件，请检查");
					return;
				}
				var childFileList: Array = srcFile.getDirectoryListing();
				var len: int = childFileList.length;
				var file: File = null;
				for (var i: int = 0; i < len; ++i)
				{
					file = childFileList[i];
					if (!file.isDirectory)//过滤掉文件夹
					{
						if (file.name.indexOf(".xml") < 0)
						{
							continue;
						}
						m_xmlList.push(file.nativePath);
					}
				}
			}
			
			m_savaPath = targetPath;
			
			// 初始化ts工具
			As2Ts.init();
			
			// 先加载模板文件
			m_tmplUtil = new TemplateUtil();
			m_tmplUtil.start(m_pcName, _onTmplComplete);
		}
			
		private function _onTmplComplete() : void
		{
			//1.读取xml
			var xmlList: Vector.<XML> = m_loadUtil.loadXmlList(m_xmlList);
			
			//2.针对加载上来的xml进行逐个解析
			var len: int = xmlList.length;
			for (var i : int = 0; i < len; ++i)
			{
				_parseXml(xmlList[i]);
			}
			// 去掉因继承重合的属性
			_trimExtendDumplication();
			
			//3.生成相应的文件
			
			//生成宏的as文件
			var generate1: MacroFileGenerator = new MacroFileGenerator(m_fileCacheData, m_tmplUtil);
			generate1.generate(m_savaPath);
			
			//生成各种数据结构文件
			var generate2: ProtocolStructureGenerator = new ProtocolStructureGenerator(m_fileCacheData, m_tmplUtil);
			generate2.generate(m_savaPath);
			
			// 生成SendMsgUtil
			var generate3: SendMsgUtilGenerator = new SendMsgUtilGenerator(m_fileCacheData, m_tmplUtil, generate2);
			generate3.generate(m_savaPath);
			
			//生成MsgID2Class.as
//			var generate3: MsgID2ClassGenerator = new MsgID2ClassGenerator(false, "MsgID2Class.as", m_fileCacheData);
//			generate3.generate(m_savaPath);
//			
//			//生成固定的as文件，比如longlong.as等
//			var generate4: FixFileGenerator = new FixFileGenerator();
//			generate4.generate(m_savaPath);
//			
//			//生成专门用于encode的工具类
//			var generate5: EncodeUtilGenerator = new EncodeUtilGenerator(false, "EncodeUtil.as", m_fileCacheData);
//			generate5.generate(m_savaPath);
//			
//			//生成专门用于decode的工具类
//			var decodeFileName: String;
//			if(EnumToolVer.V2 == toolVersion)
//			{
//				decodeFileName = "DecodeUtilv2.as";
//			}
//			else
//			{
//				decodeFileName = "DecodeUtil.as";
//			}
//			var generate6: DecodeUtilGenerator = new DecodeUtilGenerator(false, decodeFileName, m_fileCacheData);
//			generate6.generate(m_savaPath, toolVersion);
			
			// 先清除各个标记
			m_fileCacheData.resetMaps();
			
			if (m_endCall != null)
			{
				m_endCall();
			}
			
			if (m_isCloseApp)
			{
				NativeApplication.nativeApplication.exit();
			}
		}		
		
		/**
		 * 开始解析xml 
		 * @param xml
		 * 
		 */		
		private function _parseXml(xml: XML): void
		{
			if (xml == null)
			{
				return;
			}
			
			var att: XMLList = xml.children(); 
			var len: int = att.length();
			var xmlNode: XML = null;
			var nodeName: String;
			for (var i : int = 0; i < len; ++i)
			{
				xmlNode = att[i];
				nodeName = xmlNode.name().localName;
				
				// 过滤掉只给server的
				if(1 == int(xmlNode.attribute("server")))
				{
					continue;
				}
				
				if (nodeName =="macros")
				{
					_parseMacroGroup(xmlNode);
				}
				else if (nodeName == "union")
				{
					_parseStructOrUnion(xmlNode, nodeName);
				}
				else if (nodeName == "struct")
				{
					_parseStructOrUnion(xmlNode, nodeName);
				}
			}
		}
		
		/**
		 * 
		 * @param xml
		 * @param nodeName
		 * 
		 */		
		private function _parseStructOrUnion(xml: XML, nodeName: String): void
		{
			CONFIG::debug
			{
				assert(xml != null && 
					(xml.name().localName == "struct" || xml.name().localName == "union") &&
					(nodeName == "struct" || nodeName == "union") &&
					nodeName == xml.name().localName, "参数必须合法");
			}
			var protocolName: String = xml.attribute("name");
			var extendParent: String = xml.attribute("parent");
			
			var protocolData: ProtocolData;
			if (m_fileCacheData.structMap[protocolName] == null)
			{
				if (xml.attribute("class") == "union")
				{
					m_fileCacheData.structMap[protocolName] = protocolData = new ProtocolData(protocolName, extendParent, "union", xml.attribute("version"));
				}
				else
				{
					m_fileCacheData.structMap[protocolName] = protocolData = new ProtocolData(protocolName, extendParent, "struct", xml.attribute("version"));
				}
				if("1" == xml.attribute("genNew"))
				{
					// 需要生成new文件
					m_fileCacheData.newStructureList.push(protocolName);
				}
			}
			
			var isCSMsgBody: Boolean = protocolName == "CSMsgBody";
			var isMsgHead: Boolean = protocolName == "MsgHead";
			
			var len: int = xml.children().length();
			var child: XML = null;
			for (var i: int = 0; i < len; ++i)
			{
				child =  xml.children()[i];
				
				if(1 == int(child.attribute("server")))
				{
					continue;
				}
				
				var variable: VariableData = new VariableData(xml.attribute("name"),
																child.attribute("name"),
																child.attribute("type"),
																child.attribute("desc"),
																child.attribute("count"),
																child.attribute("value"),
																child.attribute("select"),
																child.attribute("refer"), 
																child.attribute("size"));
				
				protocolData.addVariable(variable);
				
				if (isCSMsgBody)//对msgBody里面的东西进行缓存记录
				{
					if (child.attribute("value").toString() != "")
					{
						m_fileCacheData.protocolList.push(variable.type);
						
						if (variable.type.indexOf("Request") >= 0)
						{
							m_fileCacheData.encodeList.push(new EnumProtocolInfo(variable.type, variable.id));
							// Request或xml里指定需要生成new文件
							m_fileCacheData.newStructureList.push(variable.type);
						}
						else if (variable.type.indexOf("Response") >= 0)
						{
							m_fileCacheData.decodeList.push(new EnumProtocolInfo(variable.type, variable.id));
						}
						else if (variable.type.indexOf("Notify") >= 0)
						{
							m_fileCacheData.decodeList.push(new EnumProtocolInfo(variable.type, variable.id));
						}
						else
						{
							Alert.show(variable.type + "命名不符合规则，必须含有Request/Response/Notify之一！");
						}
						
						
						m_fileCacheData.msgBodyMap[variable.id] = variable.type;
					}
				}
				else if (isMsgHead)
				{
					m_fileCacheData.protocolList.push(protocolName);
					m_fileCacheData.encodeList.push(new EnumProtocolInfo(protocolName, ""));
					m_fileCacheData.decodeList.push(new EnumProtocolInfo(protocolName, ""));
				}
			}
		}
		
		private function _trimExtendDumplication():void
		{
			var pdata: ProtocolData;
			for(var protocolName: String in m_fileCacheData.structMap)
			{
				pdata = m_fileCacheData.structMap[protocolName];
				// 检查去掉父类中已有的属性
				if(null != pdata.extendParent && "" != pdata.extendParent)
				{
					pdata.trimExtendDumplication(m_fileCacheData.structMap);
				}
			}
		}
		
		/**
		 * 解析macro相关的东西 
		 * @param xml
		 * 
		 */		
		private function _parseMacro(xml: XML): void
		{
			CONFIG::debug
			{
				assert(xml != null && xml.name().localName == "macro", "参数必须合法");
			}
			//记录宏
			m_fileCacheData.macroMap[xml.attribute("name").toString()] = new EnumMacro(xml.attribute("name"), 
				xml.attribute("value"),
				xml.attribute("desc"));
			
		}
		
		/**
		 * 解析 MacroGroup标签
		 * @param xml
		 * 
		 */		
		private function _parseMacroGroup(xml: XML): void
		{
			CONFIG::debug
			{
				assert(xml != null && xml.name().localName == "macros", "参数必须合法");
			}
			
			//继续记录宏
			var macroGroupXml: XMLList = xml.children();
			var macroXmlNode: XML = null;
			var len: int = macroGroupXml.length();
			for (var j : int = 0; j < len; ++j)
			{
				macroXmlNode = macroGroupXml[j];
				
				// 过滤掉只给server的
				if(1 == int(macroXmlNode.attribute("server")))
				{
					continue;
				}
				
				if (macroXmlNode.name().localName =="macro")
				{
					_parseMacro(macroXmlNode);
				}
			}
		}
	}
}