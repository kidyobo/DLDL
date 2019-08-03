package generator
{
	import data.EnumMacro;
	import data.FileCacheData;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import util.TemplateUtil;
	
	/**
	 * 协议相关宏文件的生成器 
	 * @author jacksonqian
	 * 
	 */	
	public class MacroFileGenerator
	{
		private var m_tmplUtil: TemplateUtil;
		
		private var m_fileCache: FileCacheData;
		
		/**
		 *  
		 * 
		 */		
		public function MacroFileGenerator(fileCache: FileCacheData, tmplUtil: TemplateUtil)
		{
			super();
			
			m_fileCache = fileCache;
			m_tmplUtil = tmplUtil;
		}
		
		public 	function generate(savePath: String): void
		{
			var attributesText: String = "";
			for each(var macroData: EnumMacro in m_fileCache.macroMap)
			{
				var desc: String = macroData.value.toString();
				if(null != macroData.desc && '' != macroData.desc)
				{
					desc += ", " + macroData.desc;
				}
				attributesText += m_tmplUtil.makeAttributeDef(macroData.name, "number", desc, true, false, false, macroData.value) + "\n";
			}
			
			var macrosContent: String = m_tmplUtil.makeClassDef("Macros", null, null, attributesText, "协议宏定义", "Common.xml");
			
			var newFile :File = new File(savePath + "Macros.ts");
			
			// 写入文件
			var fileController :FileStream = new FileStream();
			fileController.open(newFile, FileMode.WRITE);
			fileController.writeUTFBytes(macrosContent);
			fileController.close();
		}
	}
}