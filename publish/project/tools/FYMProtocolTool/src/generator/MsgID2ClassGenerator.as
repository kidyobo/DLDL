package generator
{
	import data.FileCacheData;
	import data.ProtocolData;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.utils.Dictionary;
	
	import mx.messaging.channels.StreamingAMFChannel;
	
	/**
	 * 生成msgID到对应类索引表的文件 
	 * @author jacksonqian
	 * 
	 */	
	public class MsgID2ClassGenerator extends BaseFileGenerator
	{
		private var m_contentTemplet : String;
		
		private var m_isTiny: Boolean;
		
		public function MsgID2ClassGenerator(isTiny: Boolean, fileName: String, fileCache: FileCacheData)
		{
			super(fileName, fileCache);
			
			m_isTiny = isTiny;
			
			if(m_isTiny)
			{
				m_contentTemplet = 
				"			m_map[TinyMacros.%MacroMsgID%] = %class%;\n";
			}
			else
			{
				m_contentTemplet = 
				"			m_map[Macros.%MacroMsgID%] = %class%;\n";
			
			}
				
		}
		
		public 	function generate(savePath: String): void
		{
			CONFIG::debug
			{
				assert(savePath != null, "参数必须合法");
			}
			
			var bodyMap: Dictionary = m_fileCache.msgBodyMap;
			var structure: ProtocolData = null;
			var mapInitStr: String = "";
			var tempStr: String = null;
			var body: String = null;
			//遍历所有的消息body记录
			for (var id: String in bodyMap)
			{
				if(m_isTiny && m_fileCache.tinyDecoders.indexOf(id) < 0 && m_fileCache.tinyEncoders.indexOf(id) < 0)
				{
					continue;
				}
				
				body = bodyMap[id];
				
				tempStr = m_contentTemplet;
				tempStr = tempStr.replace("%MacroMsgID%", id);
				tempStr = tempStr.replace("%class%", body);
				
				mapInitStr += tempStr;
			}
			
			m_file = File.documentsDirectory.resolvePath(savePath + m_fileName);
			
			m_writeFs.open(m_file, FileMode.WRITE);
			m_templetStr = m_templetStr.replace("%initMap%", mapInitStr);
			m_writeFs.writeUTFBytes(m_templetStr);
			m_writeFs.close();
		}
		
		
		
		
		
		
		
		
		
		
		
		
	}
}