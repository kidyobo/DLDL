package loader
{
	import flash.display.Bitmap;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.filesystem.File;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.utils.Dictionary;

	/**
	 * 加载工具。
	 * @author teppei
	 * 
	 */	
	public final class MELoader extends EventDispatcher
	{
		private var m_totalCnt: int;
		
		private var m_completeCnt: int;
		
		private var m_dataMap: Dictionary;
		
		public function MELoader()
		{
			m_dataMap = new Dictionary();
		}
		
		public function loadFiles(files: Vector.<File>) : void
		{
			_clearAll();
			var len: int  = files.length;
			m_totalCnt = len;
			var file: File;
			var urlLoader: URLLoader, pngLoader: Loader;
			for(var i: int = 0; i < len; i++)
			{
				file = files[i];
				if("png" == file.extension || "jpg" == file.extension)
				{
					pngLoader = new Loader();
					m_dataMap[pngLoader] = file;
					pngLoader.load(new URLRequest(file.nativePath));
					pngLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, _onLoaderComplete);
					pngLoader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, _onLoaderIOError);
				}
				else
				{
					urlLoader = new URLLoader();
					m_dataMap[urlLoader] = file;
					urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
					urlLoader.load(new URLRequest(file.nativePath));
					urlLoader.addEventListener(Event.COMPLETE, _onUrlLoaderComplete);
					urlLoader.addEventListener(IOErrorEvent.IO_ERROR, _onUrlLoaderIOError);
				}
			}
		}
		
		private function _onLoaderComplete(event: Event) : void
		{
			event.stopImmediatePropagation();
			
			var loaderInfo: LoaderInfo = event.target as LoaderInfo;
			var pngLoader: Loader = loaderInfo.loader as Loader;
			pngLoader.contentLoaderInfo.removeEventListener(Event.COMPLETE, _onLoaderComplete);
			pngLoader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, _onLoaderIOError);
			
			var file: File = m_dataMap[pngLoader];
			delete m_dataMap[pngLoader];
			
			if(null == file)
			{
				return;
			}
			
			m_dataMap[file] = Bitmap(pngLoader.content).bitmapData;
			
			checkComplete();
		}
		
		private function _onLoaderIOError(event: Event) : void
		{
			event.stopImmediatePropagation();
			
			var loaderInfo: LoaderInfo = event.target as LoaderInfo;
			var pngLoader: Loader = loaderInfo.loader as Loader;
			pngLoader.contentLoaderInfo.removeEventListener(Event.COMPLETE, _onLoaderComplete);
			pngLoader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, _onLoaderIOError);
			
			var file: File = m_dataMap[pngLoader];
			delete m_dataMap[pngLoader];
			
			if(null == file)
			{
				return;
			}
			
			dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, file.nativePath));
			
			checkComplete();
		}
		
		private function _onUrlLoaderComplete(event: Event) : void
		{
			event.stopImmediatePropagation();
			
			var urlLoader: URLLoader = event.target as URLLoader;
			urlLoader.removeEventListener(Event.COMPLETE, _onUrlLoaderComplete);
			urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, _onUrlLoaderIOError);
			
			var file: File = m_dataMap[urlLoader];
			delete m_dataMap[urlLoader];
			
			if(null == file)
			{
				return;
			}
			
			m_dataMap[file] = urlLoader.data;
			
			checkComplete();
		}
		
		private function _onUrlLoaderIOError(event: Event) : void
		{
			event.stopImmediatePropagation();
			
			var urlLoader: URLLoader = event.target as URLLoader;
			urlLoader.removeEventListener(Event.COMPLETE, _onUrlLoaderComplete);
			urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, _onUrlLoaderIOError);
			
			var file: File = m_dataMap[urlLoader];
			delete m_dataMap[urlLoader];
			
			if(null == file)
			{
				return;
			}
			
			dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, file.nativePath));
			
			checkComplete();
		}
		
		private function checkComplete(): void
		{
			m_completeCnt++;
			if(m_completeCnt >= m_totalCnt)
			{
				dispatchEvent(new Event(Event.COMPLETE));
			}
		}
		
		public function getData(file: File) : Object
		{
			return m_dataMap[file];
		}
		
		private function _clearAll() : void
		{
			m_totalCnt = 0;
			m_completeCnt = 0;
			
			var allKeys: Array = [];
			var urlLoader: URLLoader;
			var file: File;
			for(var k: * in m_dataMap)
			{
				if(k is URLLoader)
				{
					urlLoader = k as URLLoader;
					urlLoader.removeEventListener(Event.COMPLETE, _onUrlLoaderComplete);
					urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, _onUrlLoaderIOError);
					urlLoader.close();
				}
				allKeys.push(k);
			}
			
			var klen: int = allKeys.length;
			for(var i: int = 0; i < klen; i++)
			{
				k = allKeys[i];
				delete m_dataMap[k];
			}
		}
	}
}