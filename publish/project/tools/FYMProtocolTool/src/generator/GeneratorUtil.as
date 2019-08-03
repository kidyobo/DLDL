package generator
{
	public class GeneratorUtil
	{
		private static const m_tempContent1: String = 
			"		/**\n" +
			"		* %desc%\n" +
			"		*/\n" +
			"		public var %variableName%: %type%;\n\n";
		
		
		private static const m_tempContent2: String = 
			"		/**\n" +
			"		* %desc%\n" +
			"		*/\n" +
			"		public var %variableName%: Vecter.<%type%>;\n\n";
		
		private static const m_tempContent3: String = 
			"			%variableName% = new Vecter.<%type%>(); //maxCount %num%\n";
		
		public function GeneratorUtil()
		{
		}
	}
}