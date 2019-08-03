package
{
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	
	import mx.controls.Text;

	public final class TemplateUtil
	{
		private const m_blockTagNameRegExp: RegExp = /^\[(\w+)\][\r|\n]+/;
		private var m_urlLoader: URLLoader;
		
		private var m_pcName: String;
		
		private var m_version: String;
		
		private var m_completeCallback: Function;
		
		private var m_enumDefTmpl: String;
		
		private var m_enumItemDefTmpl: String;
		
		private var m_interfaceDefTmpl: String;
		
		private var m_classDefTmpl: String;
		
		private var m_ctorDefTmpl: String;
		
		private var m_attributeDefTmpl: String;
		
		private var m_attributeArrDefTmpl: String;
		
		private var m_attributeStaticConstDefTmpl: String;
		
		private var m_gameConfigDefTmpl: String;
		
		private var m_keywordDefTmpl: String;
		
		public function TemplateUtil()
		{
		}
		
		public function start(pcName: String, onComplete: Function) : void
		{
			m_pcName = pcName;
			
			var date: Date = new Date();
			m_version = date.toLocaleString();
			
			m_completeCallback = onComplete;
			
			m_urlLoader = new URLLoader();
			m_urlLoader.addEventListener(Event.COMPLETE, _onLoadComplete);
			m_urlLoader.load(new URLRequest("tsClassTmpl.ts.template"));
		}
		
		private function _onLoadComplete(event:Event):void
		{
			event.stopImmediatePropagation();
			
			var content: String = m_urlLoader.data as String;
			
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
					
					if("enum_def" == tagName)
					{
						m_enumDefTmpl = tmplText;
					}
					else if("enum_item_def" == tagName)
					{
						m_enumItemDefTmpl = tmplText;
					}
					else if("interface_def" == tagName)
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
					else if("gameConfig_def" == tagName)
					{
						// 这是游戏结构定义
						m_gameConfigDefTmpl = tmplText;
					}
					else if("keyword_def" == tagName)
					{
						m_keywordDefTmpl = tmplText;
					}
				}
			}
			
			if(null != m_completeCallback)
			{
				m_completeCallback.call();
				m_completeCallback = null;
			}
		}
		
		public function makeGameConfigDef(content: String) : String
		{
			var gameConfigDefStr: String = m_gameConfigDefTmpl.replace(/%content%/g, _formatIndent(content, 4)).replace(/[\r\n]{3,}/g, "\n\n").replace(/[\r\n]{2}(\s*\}[\r\n])/g, "\n$1");
			return gameConfigDefStr;
		}
		
		public function makeKeywordDef(declareText: String, cnameText: String) : String
		{
			var keywordDefStr: String = m_keywordDefTmpl.replace(/%declare%/g, declareText).replace(/%cname%/g, cnameText);
			return keywordDefStr;
		}
		
		public function makeEnumDef(enumName: String, itemText: String, enumDesc: String, ownerXmlFileName: String) : String
		{
			var enumDefStr: String = m_enumDefTmpl.replace(/%enumName%/g, enumName).replace(/%contents%/g, _formatIndent(itemText, 4)).replace(/%desc%/g, enumDesc).replace(/%defXml%/g, ownerXmlFileName + ".xml");
			return enumDefStr;
		}
		
		public function makeEnumItemDef(itemName: String, itemValue: String, desc: String) : String
		{
			var enumItemDefStr: String = m_enumItemDefTmpl.replace(/%itemName%/g, itemName).replace(/%itemValue%/g, itemValue);
			if(null == desc || "" == desc)
			{
				enumItemDefStr = _formatComment(enumItemDefStr, false);
			}
			else
			{
				enumItemDefStr = _formatComment(enumItemDefStr, true).replace(/%desc%/g, desc);
			}
			return enumItemDefStr;
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
		
		public function makeClassDef(className: String, parentClassName: String, constructorText: String, attributesText: String, classDesc: String, fileURL: String) : String
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
			var classDefStr: String = m_classDefTmpl.replace(/%className%/g, className).replace(/%extends%/g, extendsText).replace(/%attributes%/g, _formatIndent(attributesText, 4)).replace(/%desc%/g, classDesc).replace(/%defXml%/g, fileURL);
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