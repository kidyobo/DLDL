package
{
	public class ConfigDataMaker
	{
		private var m_dataController :DataController;
		
		private var m_tmplUtil: TemplateUtil;
		
		private var m_noConvertReg: RegExp = new RegExp(/^_nc_/);
		
		public function ConfigDataMaker(dataController :DataController, tmplUtil: TemplateUtil)
		{
			m_dataController = dataController;
			m_tmplUtil = tmplUtil;
		}
		
		/**
		 * 获取自定义类文本 
		 * @return 
		 * 
		 */		
		public function getConfigDataClassText(fileURL: String, className :String, 
											   classInfoXml :XML,
											   nodeList :XMLList,
											   additionalMemberXml :XML,
											   memberInfoList :Array, extractStrEnabled: Boolean) :String
		{
			var classDescription :String = classInfoXml.@desc;
			var parentClassName: String = classInfoXml.@parentClass;
			if(null != parentClassName && "" != parentClassName)
			{
				m_dataController.m_parentClassObj[className] = parentClassName;
			}
			
			// 生成类属性
			var attributesText: String = _getAttributesText(fileURL, classInfoXml, nodeList, additionalMemberXml, memberInfoList, extractStrEnabled);
			var classDefText: String = m_tmplUtil.makeClassDef(_flash2m(className), _flash2m(parentClassName), null, attributesText, classDescription, fileURL);
			
			// 存入成员信息
			m_dataController.m_fileMemberInfoObj[className] = memberInfoList;
			
			return classDefText;
		}
		
		/**
		 * 获取As的数据类型
		 * @param memberXml - 属性的Xml集合
		 * @param fileNodeXmlList - 读取的Xml的节点集合
		 * @param memberInfoList - 输出类引用变量，在该函数中存入相关类成员信息
		 * @param additionalMemberXml - 自定义类附加属性XML信息
		 * @return 返回As文件中关于属性的部分Text
		 **/
		private function _getAttributesText(fileURL: String, memberXml :XML, 
												  					fileNodeXmlList :XMLList,
																	additionalMemberXml :XML, 
																	memberInfoList :Array, 
																	extractStrEnabled: Boolean) :String
		{
			var attributeContent: String = "";
			
			var nodeXmlList :XMLList = memberXml.children();
			var isVector :Boolean = false;
			var className :String = memberXml.@name;
			var translationObj: Object = m_dataController.translationInfo[className];
			
			var hasUp: Boolean;
			for (var index :String in nodeXmlList)
			{	
				if("true" == nodeXmlList[index].@notMember)
				{
					// 
					continue;
				}
				
				var memberType :String = m_dataController.getMemberType(nodeXmlList[index].@type);
				
				// 检查数据类型
				var checkId :int = m_dataController.checkMemberType(memberType, fileNodeXmlList);
				if (checkId == -1)
				{
					// 类型检查异常
					// 该处需向上抛出异常....
					trace("[ERROR] ConfigDataMaker::getClassPublicMembersText(Unknown type): attr = " + nodeXmlList[index].@name + ", type = " + memberType + ", in file: " + fileURL + ", details: " + nodeXmlList[index].toXMLString());
					continue;
				}
				
				// 如果这个字段需要用到translation表，将其记录
				if(1 == int(nodeXmlList[index].@_nc_trans))
				{
					if(null == translationObj)
					{
						m_dataController.translationInfo[className] = translationObj = {};
					}
					translationObj[nodeXmlList[index].@name] = 1;
				}
				
				// _nc_开头的属性不需要转
				if(m_noConvertReg.test(nodeXmlList[index].@name))
				{
					continue;
				}
				
				// 检查是否是数组类型
				if (nodeXmlList[index].@count.toString().length > 0)
				{
					isVector = true;
				}
				else
				{
					isVector = false;
				}
				
				// 记录类成员属性
				var memberInfo :Object = new Object();
				memberInfo.name = nodeXmlList[index].@name;
				if("time" == memberType)
				{
					memberType = "String";
				}
				memberInfo.type = memberType;
				memberInfo.initFlag = 1;
				memberInfo.arrayFlag = (isVector == true) ? 1 : 0;
				// 是否
				memberInfo.strRedirectName = (extractStrEnabled && memberType == "String" && "true" != nodeXmlList[index].@noRedirect) ? ("_" + nodeXmlList[index].@name) : null;
				// 存入类成员属性信息
				memberInfoList.push(memberInfo);
				
				attributeContent += m_tmplUtil.makeAttributeDef(nodeXmlList[index].@name, _flash2m(memberType), nodeXmlList[index].@desc, false, isVector, false, null) + "\n";
			}
			
			// 创建附加属性
			if (additionalMemberXml != null)
			{
				var additionMemberXmlList :XMLList = additionalMemberXml.child("struct");
				for (index in additionMemberXmlList)
				{
					if (additionMemberXmlList[index].@name == className)
					{
						// 获取附加属性xml信息
						nodeXmlList = additionMemberXmlList[index].child("entry");
						for (var nodeIndex :String in nodeXmlList)
						{
							// 获取属性类型
							memberType = m_dataController.getMemberType(nodeXmlList[nodeIndex].@type);
							if(nodeXmlList[nodeIndex].@count.toString().length > 0)
							{
								// 数组
								isVector = true;
							}
							else
							{
								isVector = false;
							}
							
							attributeContent += m_tmplUtil.makeAttributeDef(nodeXmlList[nodeIndex].@name, _flash2m(memberType), nodeXmlList[nodeIndex].@desc, false, isVector, false, null) + "\n";
						}
					}
				}
			}
			
			return attributeContent;
		}
		
		private function _flash2m(className: String) : String
		{
			return className.replace(/_Flash$/, "M");
		}
	}
}