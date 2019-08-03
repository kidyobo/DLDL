package generator
{
	import data.FileCacheData;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;

	/**
	 * 文件生成的基类 
	 * @author jacksonqian
	 * 
	 */	
	public class BaseFileGenerator
	{
		protected static const TEMPLETPATH: String = "templet\\";
		
		/**
		 * 对应的文件名字 
		 */		
		protected var m_fileName: String;
		
		/**
		 * file对象 
		 */		
		protected var m_file: File;
		
		/**
		 * 用于读取模板文件的fs 
		 */		
		protected var m_readFs: FileStream;
		
		/**
		 * 用于生成文件的fs 
		 */		
		protected var m_writeFs: FileStream;
		
		/**
		 * 模板的内容 
		 */		
		protected var m_templetStr: String;
		
		
		protected var m_fileCache: FileCacheData;
		
		public function BaseFileGenerator(fileName: String, fileCache: FileCacheData)
		{
			_init(fileName, fileCache);
		}
		
		protected function _init(fileName: String, fileCache: FileCacheData): void
		{
			m_fileCache = fileCache;
			m_fileName = fileName;
			m_file = File.applicationDirectory.resolvePath(TEMPLETPATH + fileName + ".templet");
			var m_readFs: FileStream = new FileStream();
			m_readFs.open(m_file, FileMode.READ);
			m_readFs.position = 0;
			m_templetStr = m_readFs.readMultiByte(m_readFs.bytesAvailable, "utf-8");
			m_readFs.close();
			
			m_writeFs = new FileStream();
		}
		
		/**
		 * 保存文件 
		 * @param savePath
		 * 
		 */		
		protected function _saveFile(savePath: String): void
		{
			m_file = File.documentsDirectory.resolvePath(savePath + m_fileName);
			m_writeFs.open(m_file, FileMode.WRITE);	
			m_writeFs.writeUTFBytes(m_templetStr);
			m_writeFs.close();
		}
	}
}