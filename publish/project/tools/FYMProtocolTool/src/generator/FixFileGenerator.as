package generator
{
	import data.FileCacheData;
	
	import flash.filesystem.File;

	public class FixFileGenerator extends BaseFileGenerator
	{
		public function FixFileGenerator(fileName: String = "", fileCache: FileCacheData = null)
		{
			super(fileName, fileCache);
		}
		
		override protected function _init(fileName:String, fileCache:FileCacheData):void
		{
			//不需要实现什么
		}
		
		public function generate(savePath: String): void
		{
			var sourceFile: File = File.applicationDirectory.resolvePath(TEMPLETPATH + "DrUtil.as.templet");
			var destination: File = File.documentsDirectory.resolvePath(savePath + "DrUtil.as");
			
			sourceFile.copyTo(destination, true);
			
			sourceFile = File.applicationDirectory.resolvePath(TEMPLETPATH + "ulonglong.as.templet");
			destination = File.documentsDirectory.resolvePath(savePath + "ulonglong.as");
			sourceFile.copyTo(destination, true);
			
			sourceFile = File.applicationDirectory.resolvePath(TEMPLETPATH + "longlong.as.templet");
			destination = File.documentsDirectory.resolvePath(savePath + "longlong.as");
			sourceFile.copyTo(destination, true);
			
//			sourceFile = File.applicationDirectory.resolvePath("FyMsg.as.templet");
//			destination = File.documentsDirectory.resolvePath(savePath + "FyMsg.as");
//			sourceFile.copyTo(destination, true);
			
			sourceFile = File.applicationDirectory.resolvePath(TEMPLETPATH + "ErrorMap.as.templet");
			destination = File.documentsDirectory.resolvePath(savePath + "ErrorMap.as");
			sourceFile.copyTo(destination, true);
		}
	}
}