package util
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import mx.controls.Alert;

	/**
	 * 主要用于加载文件 
	 * @author jacksonqian
	 * 
	 */	
	public class LoadFileUtil
	{
		public function LoadFileUtil()
		{
			
		}
		
		/**
		 * 解析xml文件列表 
		 * @param xmlNameList
		 * 
		 */		
		public function loadXmlList(xmlNameList: Vector.<String>): Vector.<XML>
		{
			var result: Vector.<XML> = new Vector.<XML>();
			
			var len: int = xmlNameList.length;
			var xml: XML = null;
			for (var i : int = 0; i < len; ++i)
			{
				xml = _loadXml(xmlNameList[i]);

				result.push(xml);
			}
			
			return result;
		}
		
		/**
		 * 加载读取某个xml文件 
		 * @param name
		 * 
		 */		
		private function _loadXml(name: String): XML
		{
			var result: XML = _loadXmlFile(name);
			
			return result;
		}
		
		/**
		 * 加载某个bin文件 
		 * @param file file对象
		 * @return 输出xml
		 * 
		 */		
		private function _loadXmlFile(name: String): XML
		{
			var result: XML = null;
			
			var readFile: File = new File(name);
			if (readFile.exists)//存在源文件的话
			{
				var readFs: FileStream = new FileStream();
				readFs.open(readFile, FileMode.READ);
				readFs.position = 0;
				var str: String = readFs.readMultiByte(readFs.bytesAvailable, "gb18030");
				readFs.close();
				
				result = new XML(str);
			}
			return result;
		}
	}
}