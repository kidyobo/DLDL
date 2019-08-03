package generator
{
	import data.EnumMacro;
	import data.FileCacheData;
	import data.ProtocolData;
	import data.VariableData;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import util.As2Ts;
	import util.TemplateUtil;
	import util.VariableInfoUtil;

	/**
	 * 协议数据结构文件的生成 
	 * @author lenovo
	 * 
	 */	
	public class ProtocolStructureGenerator
	{
		private var m_tmplUtil: TemplateUtil;
		
		private var m_fileCache: FileCacheData;
		
		private var m_generateMap: Object = {};
		
		public function ProtocolStructureGenerator(fileCache: FileCacheData, tmplUtil: TemplateUtil)
		{
			super();
			
			m_fileCache = fileCache;
			m_tmplUtil = tmplUtil;
		}
		
		public 	function generate(savePath: String): void
		{
			var structDefContent: String = "";
			
			var list: Vector.<String> = m_fileCache.protocolList;
			var len: int = list.length;
			var structure: ProtocolData = null;
			
			//生成各个msgbody以及里面对应的结构体
			for (var i: int = 0; i < len; i++)
			{
				structure = m_fileCache.structMap[list[i]];//取到对应body的协议信息
				if (structure != null && !m_generateMap[structure.protocolName])
				{
					structDefContent += _processStructure(structure);
				}
			}
			
			var fileContent: String = m_tmplUtil.makeProtocolDef(structDefContent, m_fileCache.macroMap["VERSION"].value);
			
			// 写入Protocol.d.ts
			var writeFs: FileStream = new FileStream();
			var file: File = File.documentsDirectory.resolvePath(savePath + "Protocol.d.ts");
			writeFs.open(file, FileMode.WRITE);
			writeFs.writeUTFBytes(fileContent);
			writeFs.close();
			
			// 每个结构生成独立的初始化类
			for each(var protocolName: String in m_fileCache.newStructureList)
			{
				file = File.documentsDirectory.resolvePath(savePath + "new/N" + protocolName + ".ts");
				writeFs.open(file, FileMode.WRITE);
				structure = m_fileCache.structMap[protocolName];
				fileContent = m_tmplUtil.makeNewProtocolStructDef(protocolName, getStructInitContent(structure), m_fileCache.macroMap["VERSION"].value);
				writeFs.writeUTFBytes(fileContent);
				writeFs.close();
			}
		}
		
		private function _processStructure(structure: ProtocolData) : String
		{
			var structureText: String = "";
			
			var attributesText: String = structure.getProtocolStr(m_fileCache.macroMap, m_tmplUtil);
			structureText += m_tmplUtil.makeClassDef(structure.protocolName, structure.extendParent, null, attributesText, "协议数据结构", null);
			m_generateMap[structure.protocolName] = true;
			
			var variableList: Vector.<VariableData> = structure.variableList;
			var variable: VariableData = null;
			var vlen: int = variableList.length;
			
			//遍历每个变量，需要生成相应的内容
			for (var j: int = 0; j < vlen; j++)
			{
				variable = variableList[j];
				
				//对于非内置类型的话要继续生成它们各自的文件
				if (!VariableInfoUtil.instatce.isDefaultType(variable.type))
				{
					var subStruct: ProtocolData = m_fileCache.structMap[variable.type];
					if(null != subStruct && !m_generateMap[subStruct.protocolName])
					{
						structureText += _processStructure(subStruct);
					}
				}
			}
			
			return structureText;
		}
		
		public function getStructInitContent(structure: ProtocolData) : String
		{
			var structureText: String = "";
			
			var variableList: Vector.<VariableData> = structure.variableList;
			var variable: VariableData = null;
			var vlen: int = variableList.length;
			
			//遍历每个变量，需要生成相应的内容
			var vText: String;
			for (var i: int = 0; i < vlen; i++)
			{
				if(i > 0)
				{
					structureText += ", ";
				}
				
				variable = variableList[i];
				
				var vCount: int = 0;
				if(null != variable.count && "" != variable.count)
				{
					var macroInfo: EnumMacro = m_fileCache.macroMap[variable.count];
					if(null != macroInfo && macroInfo.value > 0)
					{
						vCount = macroInfo.value;
					}
				}
				
				structureText += variable.variableName + ":" + _getObjContent(variable.type, vCount);
			}
			
			return "{" + structureText + "}";
		}
		
		private function _getObjContent(objType: String, count: int) : String
		{
			var out: String;
			
			if(count > 0)
			{
				// 数组
				out = "";
				
				// 取消自动填充数组
//				for(var i: int = 0; i < count; i++)
//				{
//					if(i > 0)
//					{
//						out += ", ";
//					}
//					out += _getObjContent(objType, 0);
//				}
				
				out = "[" + out + "]";
			}
			else
			{
				if(!VariableInfoUtil.instatce.isDefaultType(objType))
				{
					// 非自定义类型生成object
					var subStruct: ProtocolData = m_fileCache.structMap[objType];
					out = getStructInitContent(subStruct);
				}
				else
				{
					// 普通类型
					var asType: String = VariableInfoUtil.instatce.getASType(objType);
					if(null == asType)
					{
						asType = objType;
					}
					var tsType: String = As2Ts.mapType(asType);
					if("boolean" == tsType) 
					{
						out = "false";
					}
					else if("number" == tsType)
					{
						out = "0";
					}
					else
					{
						out = "\"\"";
					}
				}
			}
			
			return out;
		}
	}
}