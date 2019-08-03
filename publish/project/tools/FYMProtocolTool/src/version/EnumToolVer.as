package version
{
	/**
	 * 工具版本号的枚举。
	 * @author teppei
	 * 
	 */	
	public final class EnumToolVer
	{
		public static const DEFAULT: int = 0;
		
		/**
		 * 这个版本在decode buff不足的时候不会assert，而是返回错误码。
		 */		
		public static const V2: int = 2;
		
		public function EnumToolVer()
		{
		}
	}
}