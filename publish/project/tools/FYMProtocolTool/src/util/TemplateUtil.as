package util
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;

	public final class TemplateUtil
	{
		private const m_blockTagNameRegExp: RegExp = /^\[(\w+)\][\r|\n]+/;
		
		private var m_file: File;
		
		private var m_pcName: String;
		
		private var m_version: String;
		
		private var m_interfaceDefTmpl: String;
		
		private var m_classDefTmpl: String;
		
		private var m_ctorDefTmpl: String;
		
		private var m_attributeDefTmpl: String;
		
		private var m_attributeArrDefTmpl: String;
		
		private var m_attributeStaticConstDefTmpl: String;
		
		private var m_protocolDefTmpl: String;
		
		private var m_sendMsgUtilDefTmpl: String;
		
		private var m_sendMsgUtilItemDefTmpl: String;
		
		private var m_newProtocolStructDefTmpl: String;
		
		public function TemplateUtil()
		{
		}
	
		public function start(pcName: String, onComplete: Function) : void
		{
			m_pcName = pcName;
			
			var date: Date = new Date();
			m_version = date.toLocaleString();
			
			m_file = File.applicationDirectory.resolvePath("templates\\tsClassTmpl.ts.template");
			
			var readFs: FileStream = new FileStream();
			readFs.open(m_file, FileMode.READ);
			readFs.position = 0;
			var content: String = readFs.readMultiByte(readFs.bytesAvailable, "utf-8");
			readFs.close();
		
			// 开始解析模板文件
			var lines: Array = content.split(/-{3,}[\r|\n]+/);
			for each(var block: String in lines)
			{
				var tagRst: Array = m_blockTagNameRegExp.exec(block);
				if(tagRst)
				{
					var tagName: String = tagRst[1];
					var tmplText: String = block.substr(tagRst[0].length);
					
					// 先批量替换作者、版本等固定信息
					tmplText = tmplText.replace(/%version%/g, m_version).replace(/%pcName%/g, m_pcName);
					
					if("interface_def" == tagName)
					{
						// 这是接口定义
						m_interfaceDefTmpl = tmplText;
					}
					else if("class_def" == tagName)
					{
						// 这是类定义
						m_classDefTmpl = tmplText;
					}
					else if("ctor_def" == tagName)
					{
						// 这是构造函数定义
						m_ctorDefTmpl = tmplText;
					}
					else if("attribute_def" == tagName)
					{
						// 这是属性定义
						m_attributeDefTmpl = tmplText;
					}
					else if("attribute_arr_def" == tagName)
					{
						// 这是数组属性定义
						m_attributeArrDefTmpl = tmplText;
					}
					else if("attribute_static_const_def" == tagName)
					{
						// 这是静态属性定义
						m_attributeStaticConstDefTmpl = tmplText;
					}
					else if("protocol_def" == tagName)
					{
						// 这是协议结构定义
						m_protocolDefTmpl = tmplText;
					}
					else if("SendMsgUtil_def" == tagName)
					{
						m_sendMsgUtilDefTmpl = tmplText;
					}
					else if("SendMsgUtil_item_def" == tagName)
					{
						m_sendMsgUtilItemDefTmpl = tmplText;
					}
					else if("NewProtocolStruct_def" == tagName)
					{
						m_newProtocolStructDefTmpl = tmplText;
					}
				}
			}
			
			if(null != onComplete)
			{
				onComplete.call();
				onComplete = null;
			}
		}
		
		public function makeSendMsgDef(importsContent: String, itemsText: String, msgVersion: int) : String
		{
			var sendMsgUtilDefStr: String = m_sendMsgUtilDefTmpl.replace(/%imports%/g, importsContent).replace(/%contents%/g, _formatIndent(itemsText, 4)).replace(/%msgVersion%/g, msgVersion);
			return sendMsgUtilDefStr;
		}
		
		public function makeNewProtocolStructDef(protocolName: String, initText: String, msgVersion: int) : String
		{
			var makeNewProtocolStructDefStr: String = m_newProtocolStructDefTmpl.replace(/%ProtocolName%/g, protocolName).replace(/%contents%/g, initText).replace(/%msgVersion%/g, msgVersion);
			return makeNewProtocolStructDefStr;
		}
		
		public function makeSendMsgItemDef(requestName: String, msgIDName: String, initContent: String) : String
		{
			var sendMsgUtilItemDefStr: String = m_sendMsgUtilItemDefTmpl.replace(/%requestName%/g, requestName).replace(/%msgIDName%/g, msgIDName).replace(/%initBody%/g, initContent);
			return sendMsgUtilItemDefStr;
		}
		
		public function makeProtocolDef(content: String, msgVersion: int) : String
		{
			var protocolDefStr: String = m_protocolDefTmpl.replace(/%content%/g, _formatIndent(content, 4)).replace(/[\r\n]{3,}/g, "\n\n").replace(/[\r\n]{2}(\s*\}[\r\n])/g, "\n$1").replace(/%msgVersion%/g, msgVersion);
			return protocolDefStr;
		}
		
		public function makeInterfaceDef(interfaceName: String, parentInterfaceName: String, attributesText: String, interfaceDesc: String, ownerXmlFileName: String) : String
		{
			var extendsText: String;
			if(null != parentInterfaceName && "" != parentInterfaceName)
			{
				extendsText = "extends " + parentInterfaceName;
			}
			else
			{
				extendsText = "";
			}
			
			if(null == interfaceDesc || "" == interfaceDesc)
			{
				interfaceDesc = interfaceName;
			}
			var interfaceDefStr: String = m_interfaceDefTmpl.replace(/%interfaceName%/g, interfaceName).replace(/%extends%/g, extendsText).replace(/%attributes%/g, 
				_formatIndent(attributesText, 4)).replace(/%desc%/g, interfaceDesc).replace(/%defXml%/g, ownerXmlFileName + ".xml");
			return interfaceDefStr;
		}
		
		public function makeClassDef(className: String, parentClassName: String, constructorText: String, attributesText: String, classDesc: String, ownerXmlFileName: String) : String
		{
			var extendsText: String;
			if(null != parentClassName && "" != parentClassName)
			{
				extendsText = "extends " + parentClassName;
			}
			else
			{
				extendsText = "";
			}
			
			if(null == constructorText) constructorText = "";
			
			if(null == classDesc || "" == classDesc)
			{
				classDesc = className;
			}
			var classDefStr: String = m_classDefTmpl.replace(/%className%/g, className).replace(/%extends%/g, extendsText).replace(/%attributes%/g, _formatIndent(attributesText, 4)).replace(/%desc%/g, classDesc).replace(/%defXml%/g, ownerXmlFileName + ".xml");
			var ctorDefStr: String;
			if(null == constructorText || "" == constructorText)
			{
				classDefStr = classDefStr.replace(/%ctor%[\r\n]{1}/g, "");
			}
			else
			{
				classDefStr = classDefStr.replace(/%ctor%/g, _formatIndent(m_ctorDefTmpl.replace(/%ctorContent%/g, _formatIndent(constructorText, 4)), 4));
			}
			
			return classDefStr;
		}
		
		public function makeAttributeDef(attributeName: String, attributeType: String, attributeDesc: String, isStatic: Boolean, isArray: Boolean, isOptional: Boolean, value: Object = null, decoration: String = null) : String
		{
			attributeType = As2Ts.mapType(attributeType);
			
			var attributeDefStr: String;
			
			if(isStatic)
			{
				attributeDefStr = m_attributeStaticConstDefTmpl;
			}
			else
			{
				if(isArray)
				{
					attributeDefStr = m_attributeArrDefTmpl;
				}
				else
				{
					attributeDefStr = m_attributeDefTmpl;
				}
			}
			
			var optionalFlag: String;
			if(isOptional)
			{
				optionalFlag = "?";
			}
			else
			{
				optionalFlag = "";
			}
			
			var valueText: String;
			if(null != value)
			{
				valueText = value.toString();
			}
			else
			{
				valueText = "";
			}
			
			if(null != decoration && "" != decoration)
			{
				decoration += " ";
			}
			else
			{
				decoration = "";
			}
			
			attributeDefStr = attributeDefStr.replace(/%decoration%/g, decoration).replace(/%attributeName%/g, attributeName).replace(/%optional%/g, optionalFlag).replace(/%attributeType%/g, 
				attributeType).replace(/%attributeValue%/g, valueText);
			
			if(null != attributeDesc && "" != attributeDesc)
			{
				attributeDefStr = attributeDefStr.replace(/%attributeDesc%/g, attributeDesc);
				attributeDefStr = _formatComment(attributeDefStr, true);
			}
			else
			{
				attributeDefStr = _formatComment(attributeDefStr, false);
			}
			
			return attributeDefStr;
		}
		
		/**
		 * 给指定字符串的每一行行首添加指定数量的空格。
		 * @param rawStr
		 * @param blankCnt
		 * @return 
		 * 
		 */		
		private function _formatIndent(rawStr: String, blankCnt: int) : String
		{
			const newLineRegExp: RegExp = /[\r|\n]+/;
			
			var blankStr: String = "";
			for(var i: int = 0; i < blankCnt; i++)
			{
				blankStr += " ";
			}
			
			var resultStr: String = "";
			var searchStr: String = rawStr;
			
			var endIdx: int = 0;
			
			var rst: Array;
			while(rst = newLineRegExp.exec(searchStr))
			{
				endIdx = rst.index + rst[0].length;
				resultStr += blankStr + searchStr.substr(0, endIdx);
				searchStr = searchStr.substring(endIdx);
			}
			
			if("" == resultStr)
			{
				resultStr = rawStr;
			}
			
			return resultStr;
		}
		
		private function _formatComment(input: String, needComment: Boolean) : String
		{
			var si: int = input.search(/<c>/);
			var ei: int = input.search(/<\/c>/);
			if(ei <= si)
			{
				return input; 
			}
			
			if(needComment)
			{
				return input.substring(0, si) + input.substring(si + 3, ei) + input.substr(ei + 4);
			}
			else
			{
				return input.substring(0, si) + input.substr(ei + 4);
			}
		}
	}
}