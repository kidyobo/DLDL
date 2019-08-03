package fygame.math
{
	import flash.geom.Point;
	
	import fygame.modules.net.FyProtocol.UnitPosition;
	
	/**
	 * API Point类的手工实现，主要为了跟后台通用 
	 * @author fygame
	 * 
	 */	
	public class FyPoint
	{		
        public static var TEMP_POS: FyPoint = new FyPoint();
        
        private static const sqrt:Function = Math.sqrt;
        private static const pow:Function = Math.pow;
        private static const sin:Function = Math.sin;
        private static const cos:Function = Math.cos;
        
        private static var m_caches: Vector.<FyPoint> = new Vector.<FyPoint>();
		
		public var x: Number;
		
		public var y: Number;

        public var z: Number;
        
		public function FyPoint(x: Number = 0, y: Number = 0, z: Number = 0)
		{
			this.x = x;
			this.y = y;
            this.z = z;
		}
		
		public function dispose(): void
		{
			x = 0;
			y = 0;
            z = 0;
		}
		
		public function setTo(m_uiX: Number = 0, m_uiY: Number = 0): void
		{
			this.x = m_uiX;
			this.y = m_uiY;
		}
		
		public static function interpolate(pt1: FyPoint, pt2: FyPoint, f: Number, outputPoint: FyPoint=null): FyPoint
		{
            if(outputPoint == null)
            {
                outputPoint = new FyPoint();
            }
            
            outputPoint.setTo((pt2.x + (f * (pt1.x - pt2.x))), (pt2.y + (f * (pt1.y - pt2.y))));
            
			return outputPoint;
		}
		
		public static function distance(pt1: FyPoint, pt2: FyPoint): Number
		{
			return sqrt(pow(pt1.x - pt2.x, 2) + pow(pt1.y - pt2.y, 2));
//			return (pt1.subtract(pt2).length());
		}
		
		public static function polar(len: Number, angle: Number): FyPoint
		{
			return (new FyPoint((len * cos(angle)), (len * sin(angle))));
		}
		
		public function add(v: FyPoint): FyPoint
		{
			return (new FyPoint((this.x + v.x), (this.y + v.y)));
		}
			
		public function length(): Number
		{
			return (sqrt(((this.x * this.x) + (this.y * this.y))));
		}
		
        /**
         * 求与他点的距离 
         * @param pos
         * @return 
         * 
         */        
		public  function subLength(posX: int, posY: int): Number
		{
			return sqrt(pow(x - posX, 2) + pow(y - posY, 2));
		}
		
		public function normalize(thickness: Number): void
		{
			var invD:Number = this.length();
			if (invD > 0)
			{
				invD = (thickness / invD);
				this.x = (this.x * invD);
				this.y = (this.y * invD);
			}
		}
		
		/**
		 * 向target进行逼近，保证最大逼近距离为move。
		 * @param target 目的点。
		 * @param move 最大逼近距离，如果p2与p1间的距离小于最大逼近距离，则结果为p2所在位置。
		 * @param result 返回的结果，可以由外界提供实例。如果为null，将返回一个新的实例。
		 * @return 
		 * 
		 */		
		public function approach(target: FyPoint, move: int, result: FyPoint = null) : FyPoint
		{
			if(null == result)
			{
				result = new FyPoint();
			}
			
			var dis: Number = distance(this, target);
			if(dis <= move)
			{
				result.copyFrom(target);
			}
			else
			{
				result.x = x + (move / dis) * (target.x - x);
				result.y = y + (move / dis) * (target.y - y);
			}
			
			return result;
		}
		
		public  function subtract(pos: FyPoint): FyPoint
		{
			return (new FyPoint((this.x - pos.x), (this.y - pos.y)));
		}
		
		public function offset(dx: Number, dy: Number): void
		{
			this.x = (this.x + dx);
			this.y = (this.y + dy);
		}
		
		public function equals(toCompare: FyPoint, maxTolerance: int = 0): Boolean
		{
			var result: Boolean;
			if(toCompare.x == this.x && toCompare.y == this.y)
			{
				result = true;
			}
			else if(maxTolerance > 0 && Math.abs(toCompare.x - this.x) < maxTolerance && Math.abs(toCompare.y - this.y) < maxTolerance)
			{
				result = true;
			}
			
			return result;
		}
		
		public function clone(): FyPoint
		{
			return (new FyPoint(this.x, this.y));
		}
        
        public function copyFrom(pos: FyPoint): void
        {
            x = pos.x;
            y = pos.y;
            z = pos.z;
        }
		
		public function toString(): String
		{
			return ((((("(x=" + this.x) + ", y=") + this.y) + ")"));
		}
		
		public function fromUnitPosition(pos: UnitPosition): void
		{
			x = pos.m_uiX;
			y = pos.m_uiY;
		}
		
		public static function fromPoint(pos: Point): FyPoint
		{
			return new FyPoint(pos.x, pos.y);
		}
		
		public function toPoint(): Point
		{
			return new Point(x, y);
		}
		
		public static function alloc(x: int = 0, y: int = 0): FyPoint
		{
			var ret: FyPoint;
			if(m_caches.length > 0)
			{
				ret = m_caches.pop();
				ret.setTo(x, y);
			}
			else
			{
				ret = new FyPoint(x, y);
			}
			return ret;
		}
		
		public static function free(point: FyPoint):void
		{
			if(null != point)
			{
				m_caches.push(point);
			}
		}
	}
}