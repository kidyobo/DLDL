package
{
	public class ErrorIdMaker
	{
		private var m_tmplUtil: TemplateUtil;
		
		private var m_dataController :DataController;
		
		public function ErrorIdMaker(dataController :DataController, tmplUtil: TemplateUtil)
		{
			m_dataController = dataController;
			m_tmplUtil = tmplUtil;
		}
		
		/**
		 * 将Xml信息转成指定格式的数据
		 * @param dataXml - keyword的Xml信息
		 * @return 返回指定格式的数据
		 * */
		public function getErrorIdData(dataXml :XML, tinyErrors: XMLList) :Object
		{
			var dataObj :Object = new Object();
			
			var nodeList :XMLList = dataXml.ErrnoConfig_Flash;
			var node :XML;
			
			for (var index :String in nodeList)
			{
				node = nodeList[index];
				
				if (dataObj[node.m_uiValue] == undefined)
				{
					dataObj[node.m_uiValue] = new Object();
				}
				else
				{
					trace("[WARNING] ErrorIdMaker::getErrorIdData - repeated keyword id：" + node);
				}					
				
				dataObj[node.m_uiValue].name = node.m_szName;
				dataObj[node.m_uiValue].description = node.m_szDescriptionZH;
				
				for each(var tinyDef: XML in tinyErrors)
				{
					if(tinyDef.@name == node.m_szName)
					{
						dataObj[node.m_uiValue].tiny = 1;
						break;
					}
				}
			}
			
			return dataObj;
		}
		
		public function createErrorIdFileContent(dataObj :Object) :String
		{
			// 生成类属性
			var enumItemsText: String = _getEnumItemsText(dataObj);
			var enumDefText: String = m_tmplUtil.makeEnumDef("ErrorId", enumItemsText, "错误码集合", "Errno.config.xml");
			
			return enumDefText;
		}
		
		/**
		 * 创建关键字的成员变量
		 * @return 返回成员变量的定义格式
		 * */
		private function _getEnumItemsText(errorIdDataObj :Object) :String
		{
			var str :String = "";
			
			for (var idStr :String in errorIdDataObj)
			{
				str += m_tmplUtil.makeEnumItemDef(errorIdDataObj[idStr].name, idStr, errorIdDataObj[idStr].description) + "\n";
			}				
			
			return str;
		}
	}
}