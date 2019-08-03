package generator
{
	import data.EnumMacro;
	import data.EnumProtocolInfo;
	import data.FileCacheData;
	import data.ProtocolData;
	import data.VariableData;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import util.As2Ts;
	import util.TemplateUtil;
	import util.VariableInfoUtil;

	public final class SendMsgUtilGenerator
	{
		private var m_tmplUtil: TemplateUtil;
		
		private var m_fileCache: FileCacheData;
		
		private var m_structGenerator: ProtocolStructureGenerator;
		
		private var m_generateMap: Object = {};
		
		public function SendMsgUtilGenerator(fileCache: FileCacheData, tmplUtil: TemplateUtil, structGenerator: ProtocolStructureGenerator)
		{
			super();
			
			m_fileCache = fileCache;
			m_tmplUtil = tmplUtil;
			m_structGenerator = structGenerator;
		}
		
		public 	function generate(savePath: String): void
		{
			var utilItemDefContent: String = "";
			var importsContent: String = "";
			var initContent: String;
			
			var list: Vector.<EnumProtocolInfo> = m_fileCache.encodeList;
			var len: int = list.length;
			var info: EnumProtocolInfo = null;
			var structure: ProtocolData = null;
			
			//生成各个msgbody以及里面对应的结构体
			for (var i: int = 0; i < len; i++)
			{
				info = list[i];//取到对应body的协议信息
				if(!m_generateMap[info.msgID])
				{
					m_generateMap[info.msgID] = true;
					
					// 生成初始化代码
					structure = m_fileCache.structMap[info.name];
					initContent = m_structGenerator.getStructInitContent(structure);
					
					utilItemDefContent += m_tmplUtil.makeSendMsgItemDef(info.name, info.msgID, initContent);
					importsContent += "import {new" + structure.protocolName + "} from 'System/protocol/new/N" + structure.protocolName + "'\n";
				}
			}
			
			var fileContent: String = m_tmplUtil.makeSendMsgDef(importsContent, utilItemDefContent, m_fileCache.macroMap["VERSION"].value);
			
			// 写入FyMsgUtil.ts
			var writeFs: FileStream = new FileStream();
			var file: File = File.documentsDirectory.resolvePath(savePath + "SendMsgUtil.ts");
			writeFs.open(file, FileMode.WRITE);
			writeFs.writeUTFBytes(fileContent);
			writeFs.close();
		}
	}
}