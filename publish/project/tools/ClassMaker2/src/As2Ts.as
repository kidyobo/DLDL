package
{
	public final class As2Ts
	{
		private static var m_as2tsTypeMap: Object;
		
		public function As2Ts()
		{
		}
		
		public static function init() : void
		{
			m_as2tsTypeMap = {};
			m_as2tsTypeMap["Boolean"] = "boolean";
			m_as2tsTypeMap["int"] = "number";
			m_as2tsTypeMap["uint"] = "number";
			m_as2tsTypeMap["Number"] = "number";
			m_as2tsTypeMap["String"] = "string";
		}
		
		public static function mapType(asType: String) : String
		{
			var tsType: String;
			if(null != m_as2tsTypeMap && m_as2tsTypeMap[asType])
			{
				tsType = m_as2tsTypeMap[asType];
			}
			else
			{
				tsType = asType;
			}
			return tsType;
		}
		
		public static function isBasicTsType(typeName: String) : Boolean
		{
			return "boolean" == typeName || "number" == typeName || "string" == typeName; 
		}
	}
}