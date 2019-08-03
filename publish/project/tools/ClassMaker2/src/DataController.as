package
{
	/**
	 * 该类是用于数据判断或处理的 
	 * @author gavinsun
	 * 
	 */	
	public class DataController
	{
		/**
		 * 存放需要创建的AS文件的String的Table
		 * key - className.
		 * value - AS文件的String
		 */		
		public var m_fileStringObj :Object;
		
		/**
		 * 存放生成new文件的内容。
		 */		
		public var newFileStringObj: Object;
		
		/**
		 * 存放需要创建的AS文件名的Table
		 * key - className
		 * value - AS文件名
		 */		
		public var m_fileNameStringObj :Object;
		
		/**
		 * 存放类中所有成员信息
		 * key - className
		 * value - array 成员数组
		 */		
		public var m_fileMemberInfoObj :Object;
		
		/**
		 * 保存类的父类信息。
		 */		
		public var m_parentClassObj: Object;
		
		/**
		 * 需要使用translation表的字段信息。
		 */		
		public var translationInfo: Object;
		
		public function DataController()
		{
			m_fileStringObj = new Object();
			newFileStringObj = {};
			m_fileNameStringObj = new Object();
			m_fileMemberInfoObj = new Object();
			m_parentClassObj = new Object();
			translationInfo = new Object();
		}
		
		/**
		 * 获取As数据类型
		 * @param memberType - xml中的类型名
		 * @return 返回As的数据类型
		 **/
		public function getMemberType(memberType :String) :String
		{
			switch (memberType)
			{
				case "string":
				case "char":
					return "String";
				case "Float":
				case "Double":
				case "longlong":
				case "ulonglong":
					return "Number";
				case "byte":
				case "uint":
				case "Bigint":
				case "bigint":
				case "Biguint":
				case "biguint":
				case "uchar":
				case "DateTime":
					return "uint";
				case "ushort":
				case "short":
				case "int":
				case "byte":
					return "int";
				case "boolean":
					return "Boolean";
				case "object":
					return "Object";
				default:
					return memberType;
			}
			
			return memberType;
		}
		
		/**
		 * 检查数据类型合法性
		 * @param memberType - AS的数据类型
		 * @param fileNodeXmlList - 读取的Xml的节点集合
		 * @return 0 - AS的基础数据类型
		 *				1 - 合法的引用类数据类型
		 *				-1 - 不合法的数据类型
		 **/
		public function checkMemberType(memberType :String, fileNodeXmlList :XMLList = null) :int
		{
			if (null == fileNodeXmlList)
			{
				fileNodeXmlList = new XMLList();
			}
			
			// 如果是Vector类型，则过滤掉多余字段
			if (memberType.split("<").length > 1)
			{
				memberType = memberType.split("<")[1];
				
				// 去掉字符">"
				memberType = memberType.substring(0, memberType.length - 1);
			}
			
			switch (memberType)
			{
				case "int":
				case "uint":
				case "String":
				case "Number":
				case "Boolean":
				case "Object":
					// 是AS的基础数据类型
					return 0;
				case "time":
					// 时间类型
					return 1;
				case "UnitPosition":
					// 使用的是协议的，看做是基础类型
					return 0;
				default:
					// 检查是否是以声明的数据类型
					var isFind :Boolean = false;
					for (var index :String in fileNodeXmlList)
					{
						if (memberType == fileNodeXmlList[index].@name)
						{
							// 找到已声明的引用类
							isFind = true;
							
							// 创建需要生成的AS文件的Key
							m_fileStringObj[memberType] = "";
							
							break;
						}
					}
					
					//						trace("checkMemberType: 引用类型 - " + memberType + ", " + isFind);
					
					if (isFind == true)
					{
						return 1;
					}
					else
					{
						// 去当前m_fileNameStringObj中查找该数据类
						for (index in m_fileNameStringObj)
						{
							if (memberType == index)
							{
								// 找到已声明的引用类
								isFind = true;
								
								return 1;
							}
						}
						//							trace("Unknow Type:" + memberType);
						return -1;
					}
			}
			
			//				trace("Unknow Type:" + memberType);
			return -1;
		}
		
		/**
		 * 是否是基础数据类型，该函数用于防止转bin文件时，基础数据类型的数组格式是未知的，可能在序列化时出错
		 * @param type - 数据类型
		 * @return 返回As文件中关于属性的部分Text
		 **/
		public function isSupportedTypeByArray(type :String) :Boolean
		{
			if (type == "Tinyint"
				|| type == "Tinyuint"
				|| type == "Smallint"
				|| type == "Smalluint"
				|| type == "Int8"
				|| type == "Int16"
				|| type == "Uint8"
				|| type == "Uint16"
				|| type == "Date"
				|| type == "Time"
				|| type == "IP"
//				|| type == "Char"
//				|| type == "Wchar"
//				|| type == "String"
//				|| type == "Wstring"
				|| type == "Void*")
			{
				return false;
			}
			
			return true;
		}
		
		/**
		 * 数据初始化 
		 * 
		 */		
		public function resetData() :void
		{
			m_fileStringObj = new Object();
			m_fileNameStringObj = new Object();
			m_fileMemberInfoObj = new Object();
		}
		
		/**
		 * 将Xml信息转成指定格式的数据
		 * @param dataXml - keyword的Xml信息
		 * @return 返回指定格式的数据
		 * */
		public function getErrorIdData(dataXml :XML) :Object
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
					trace("[WARNING] DataControllerErrorId::getErrorIdData - repeated keyword id：" + node);
				}					
				
				dataObj[node.m_uiValue].name = node.m_szName;
				dataObj[node.m_uiValue].description = node.m_szDescriptionZH;
			}
			
			return dataObj;
		}
	}
}