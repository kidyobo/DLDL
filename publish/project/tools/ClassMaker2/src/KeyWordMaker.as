package
{
	

	public class KeyWordMaker
	{
		private var m_dataController :DataController;
		
		private var m_tmplUtil: TemplateUtil;
		
		private var m_groupDescMap: Object = {};
		
		public function KeyWordMaker(dataController :DataController, tmplUtil: TemplateUtil)
		{
			m_dataController = dataController;
			m_tmplUtil = tmplUtil;
		}
		
		/**
		 * 将Xml信息转成指定格式的数据
		 * @param dataXml - keyword的Xml信息
		 * @return 返回指定格式的数据
		 * */
		public function getKeywordData(dataXml :XML) :Object
		{
			var dataObj :Object = new Object();
			
			var nodeList :XMLList = dataXml.macro;
			var node :XML;
			
			for (var index :String in nodeList)
			{
				node = nodeList[index];
				
				if (dataObj[node.@group] == undefined)
				{
					dataObj[node.@group] = new Object();
				}
				
				if (dataObj[node.@group][node.@name] != undefined)
				{
					trace("[WARNING] KeyWordMaker::getKeywordData - repeated keyword id：" + node);
				}
				
				dataObj[node.@group][node.@name] = new Object();
				dataObj[node.@group][node.@name].group = String(node.@group);
				dataObj[node.@group][node.@name].name = String(node.@name);
				dataObj[node.@group][node.@name].value = String(node.@value);
				dataObj[node.@group][node.@name].cname = String(node.@cname);
				dataObj[node.@group][node.@name].desc = String(node.@desc);
				dataObj[node.@group][node.@name].convertDesc = int(node.@_convert_desc);
				dataObj[node.@group][node.@name].tiny = int(node.@tiny);
				
				if(1==int(node.@_convert_desc))
				{
					m_groupDescMap[node.@group] = 1;
				}
			}
			
			return dataObj;
		}
		
		public function createKeywordAsFile(dataObj :Object) :String
		{
			// 生成类属性
			var declareText: String = _getAttributesText(dataObj);
			var cnameText: String = _makeKeywordCnameText(dataObj);
			var keywordDefText: String = m_tmplUtil.makeKeywordDef(declareText, cnameText);
			
			return keywordDefText;
		}
		
		/**
		 * 创建关键字的成员变量
		 * @return 返回成员变量的定义格式
		 * */
		private function _getAttributesText(dataObj :Object) :String
		{
			var str :String = "";
			var comment: String;
			var groupId :uint = 1;
			var key :String;
			
			// 生成群组常量信息
			str += "// --------------------------- Keyword Groups ------------------------------ //\n";
			for (var group :String in dataObj)
			{
				comment = "";
				for (key in dataObj[group])
				{
					if("" != comment)
					{
						comment += ", ";
					}
					comment += key;
				}
				comment = "包含：" + comment;
				str += m_tmplUtil.makeAttributeDef(group, "number", comment, true, false, false, groupId) + "\n";
				
				groupId++;
			}
			
			// 生成关键字常量信息
			str += "// ------------------------------ Keywords --------------------------------- //\n";
			for (group in dataObj)
			{
				for (key in dataObj[group])
				{
					comment = dataObj[group][key].value + ', group = ' + group;
					if(null != dataObj[group][key].desc && "" != dataObj[group][key].desc)
					{
						comment += ', ' + dataObj[group][key].desc;
						if(1 == dataObj[group][key].convertDesc)
						{
							comment += "(可getDesc)";
						}
					}
					else if(null != dataObj[group][key].cname && "" != dataObj[group][key].cname)
					{
						comment += ', ' + dataObj[group][key].cname;
					}
					
					str += m_tmplUtil.makeAttributeDef(key, "number", comment, true, false, false, dataObj[group][key].value) + "\n";
				}
			}
			
			str += "\n";
			
			return str;
		}
		
		private function _makeKeywordCnameText(dataObj :Object) : String
		{
			var str: String = "";
			
			var subStr: String;
			for (var group: String in dataObj)
			{				
				subStr = "";
				for (var key: String in dataObj[group])
				{
					if(1 == dataObj[group][key].convertDesc)
					{
						subStr += "KeyWord.keywordTable[KeyWord." + group + "][KeyWord." + key + "] = \"" + dataObj[group][key].desc + "\";\n";
					}
				}
				
				if("" != subStr)
				{
					str += "KeyWord.keywordTable[KeyWord." + group + "] = {};\n";
					str += subStr;
					str += "\n";
				}
			}
			
			return str;
		}
	}
}