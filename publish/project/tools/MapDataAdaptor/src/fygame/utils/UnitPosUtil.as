package fygame.utils
{
	import fygame.math.FyPoint;
	import fygame.modules.net.FyProtocol.UnitPosition;

	public class UnitPosUtil
	{
		public function UnitPosUtil()
		{
		}
		
		public static function add(pos1: UnitPosition, pos2: UnitPosition): UnitPosition
		{
			var result: UnitPosition = new UnitPosition();
			result.m_uiX = pos1.m_uiX + pos2.m_uiX;
			result.m_uiY = pos1.m_uiY + pos2.m_uiY;
			return result;
		}
		
		public static function normalize(pos: UnitPosition, thickness: Number): void
		{
			var invD:Number = getLength(pos);
			if (invD > 0)
			{
				invD = (thickness / invD);
				pos.m_uiX = (pos.m_uiX * invD);
				pos.m_uiY = (pos.m_uiY * invD);
			}
		}
		
		public static function subtract(pos1: UnitPosition, pos2: UnitPosition): FyPoint
		{
			var result: FyPoint = new FyPoint();
			result.x = pos1.m_uiX - pos2.m_uiX;
			result.y = pos1.m_uiY - pos2.m_uiY;
			return result;
		}
		
		public static function getLength(pos: UnitPosition): Number
		{
			return (Math.sqrt(((pos.m_uiX * pos.m_uiX) + (pos.m_uiY * pos.m_uiY))));
		}
		
		public static function subLength(pos1: UnitPosition, pos2: UnitPosition): Number
		{
			return distance(pos1, pos2);
		}

		public static function distance(pos1: UnitPosition, pos2: UnitPosition): Number
		{
			return Math.sqrt(Math.pow(pos1.m_uiX - pos2.m_uiX, 2) + Math.pow(pos1.m_uiY - pos2.m_uiY, 2));
		}
		
		public static function toUnitPos(posX: int, posY: int): UnitPosition
		{
			var result: UnitPosition = new UnitPosition();
			result.m_uiX = posX;
			result.m_uiY = posY;
			return result;
		}
		
		public static function fromTUnitPos(pos: FyPoint): UnitPosition
		{
			var result: UnitPosition = new UnitPosition();
			result.m_uiX = pos.x;
			result.m_uiY = pos.y;
			return result;
		}
		
		public static function clonePos(pos: UnitPosition): UnitPosition
		{
			var result: UnitPosition = new UnitPosition();
			result.m_uiX = pos.m_uiX;
			result.m_uiY = pos.m_uiY;
			return result;
		}
		
		public static function cloneVector(src: Vector.<UnitPosition>, opt:Vector.<UnitPosition> = null): Vector.<UnitPosition>
		{
			if(null == opt)
			{
				opt = new Vector.<UnitPosition>();
			}
			var srcLen: int = src.length;
			var optLen: int = opt.length;
			var minLen: int = srcLen < optLen ? srcLen : optLen;
			
			var up: UnitPosition;
			var i: int;
			for (i = 0; i < minLen; ++i)
			{
				src[i].clone(opt[i]);
			}
			for (i = minLen; i < srcLen; ++i)
			{
				opt.push(src[i].clone());
			}
			opt.length = srcLen;
			
			return opt;
		}
	}
}