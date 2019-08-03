package fygame.modules.net.FyProtocol
{
	import flash.utils.ByteArray;

	/**
	 * 协议的数据结构定义
	 */
    public class UnitPosition
    {
		/**
		* 
		*/
		public var m_uiX: uint;

		/**
		* 
		*/
		public var m_uiY: uint;



		/**
		 * 构造函数，一些自定义类型需要预先初始化
		 */
		public function UnitPosition()
		{

		}
		


		/**
		 * 克隆函数 
		 * @return 
		 * 
		 */
		public function clone(result: UnitPosition = null): UnitPosition
		{
			if(null == result)
			{
				result = new UnitPosition();
			}
			result.m_uiX = this.m_uiX;
			result.m_uiY = this.m_uiY;

			return result;
		}
		
//%variable version%
    }
}
