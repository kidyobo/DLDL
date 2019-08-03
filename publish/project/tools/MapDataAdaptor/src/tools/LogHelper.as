package tools
{
	import flash.utils.getTimer;

	public final class LogHelper
	{
		private static var m_logFunc: Function;
		private static var m_statusFunc: Function;
		
		public function LogHelper()
		{
		}
		
		public static function setFunc(value: Function, statusFunc: Function) : void
		{
			m_logFunc = value;
			m_statusFunc = statusFunc;
		}
		
		public static function appendLine(text: String) : void
		{
			m_logFunc.call(null, "[" + (getTimer() / 1000).toFixed(3) + "s]" + text + "\n");
		}
		
		public static function updateStatus(text: String) : void
		{
			m_statusFunc.call(null, "[" + (getTimer() / 1000).toFixed(3) + "s]" + text + "\n");
		}
	}
}