// 这个模块不能被import,是被cs层调用,目的是替换cs中的结构体
// 结构体的实现
module UnityEngine {
    class Vector2 {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        get normalized(): Vector2 {
            let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
            if (magnitude > 1E-05)
                return new Vector2(this.x / magnitude, this.y / magnitude);
            return Vector2.one;
        }

        Normalize() {
            let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
            if (magnitude > 1E-05) {
                this.x = this.x / magnitude;
                this.y = this.y / magnitude;
            }
            else {
                this.x = 1;
                this.y = 1;
            }
        }

        static get down(): Vector2 {
            return new Vector2(0, -1);
        }

        static get zero(): Vector2 {
            return new Vector2(0, 0);
        }

        static get one(): Vector2 {
            return new Vector2(1, 1);
        }

        Set(newX: number, newY: number) {
            this.x = newX;
            this.y = newY;
        }

        static Lerp(a: Vector2, b: Vector2, t: number): Vector2 {
            if (t < 0)
                t = 0;
            else if (t > 1)
                t = 1;
            return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
        }

        static MoveTowards(current: Vector2, target: Vector2, maxDistanceDelta: number): Vector2 {
            var dx = (target.x - current.x);
            var dy = (target.y - current.y);
            var magnitude = Math.sqrt(dx * dx + dy * dy);
            if (magnitude <= maxDistanceDelta || magnitude == 0) {
                return new Vector2(target.x, target.y);
            }
            else {
                var x = current.x + dx / magnitude * maxDistanceDelta;
                var y = current.y + dy / magnitude * maxDistanceDelta;
                return new Vector2(x, y);
            }
        }

        ToString(): string {
            return '(x:' + this.x + ',y:' + this.y + ')';
        }

        static Distance(a: Vector2, b: Vector2): number {
            var dx = (a.x - b.x);
            var dy = (a.y - b.y);
            return Math.sqrt(dx * dx + dy * dy);
        }

        static Dot(lhs: Vector2, rhs: Vector2): number {
            return lhs.x * rhs.x + lhs.y * rhs.y;
        }

        static Angle(from: Vector2, to: Vector2): number {
            let value = Vector2.Dot(from.normalized, to.normalized);
            if (value < -1) value = -1;
            else if (value > 1) value = 1;
            return value * 57.29578;
        }

        static op_Addition(a: Vector2, b: Vector2): Vector2 {
            return new Vector2(a.x + b.x, a.y + b.y);
        }

        static op_Subtraction(a: Vector2, b: Vector2): Vector2 {
            return new Vector2(a.x - b.x, a.y - b.y);
        }

        static op_Multiply(a, d): Vector2 {
            if (a instanceof Vector2)
                return new Vector2(a.x * d, a.y * d);
            else
                return new Vector2(d.x * a, d.y * a);
        }

        static op_Equality(lhs: Vector2, rhs: Vector2): boolean {
            return lhs.x == rhs.x && lhs.y == rhs.y;
        }

        static op_Inequality(lhs: Vector2, rhs: Vector2): boolean {
            return lhs.x != rhs.x || lhs.y != rhs.y;
        }

        static op_new(x: number, y: number) {
            return new Vector2(x, y);
        }

        static op_set(v: Vector2, x: number, y: number) {
            v.Set(x, y);
        }
    }
    if (!UnityEngine.Vector2) (UnityEngine.Vector2 as any) = Vector2;

    class Vector3 {
        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z: number) {
            this.Set(x, y, (z != null && z != undefined) ? z : 0);
        }
        Set(new_x: number, new_y: number, new_z: number) {
            this.x = new_x;
            this.y = new_y;
            this.z = new_z;
        }
        get normalized(): Vector3 {
            let magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            if (magnitude > 1E-05)
                return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
            return Vector3.one;
        }
        static get zero(): Vector3 {
            return new Vector3(0, 0, 0);
        }
        static get one(): Vector3 {
            return new Vector3(1, 1, 1);
        }
        static get up(): Vector3 {
            return new Vector3(0, 1, 0);
        }
        static get left(): Vector3 {
            return new Vector3(-1, 0, 0);
        }
        static Angle(from: Vector3, to: Vector3): number {
            let n = Vector3.Dot(from.normalized, to.normalized);
            if (n < -1) n = -1;
            else if (n > 1) n = 1;
            return Math.acos(n) * 57.29578;
        }
        static Distance(a: Vector3, b: Vector3): number {
            let vector = new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        }
        static op_Addition(a: Vector3, b: Vector3): Vector3 {
            return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
        }
        static op_Subtraction(a: Vector3, b: Vector3): Vector3 {
            return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
        }
        static op_Multiply(a, d): Vector3 {
            if (a instanceof Vector3)
                return new Vector3(a.x * d, a.y * d, a.z * d);
            else
                return new Vector3(d.x * a, d.y * a, d.z * a);
        }
        static Dot(lhs: Vector3, rhs: Vector3): number {
            return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
        }
        static op_new(x: number, y: number, z: number) {
            return new Vector3(x, y, z);
        }
        static op_set(v: Vector3, x: number, y: number, z: number) {
            v.Set(x, y, z);
        }
    }
    if (!UnityEngine.Vector3) (UnityEngine.Vector3 as any) = Vector3;
}
