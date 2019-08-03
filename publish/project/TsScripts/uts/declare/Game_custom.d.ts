declare module Game {
    export class TcpClient {
        // default times = 1
        static setHandleTimesInFrame(times: number): void;
        static create(recvbufsize: number, sendbufsize: number, packheadsize: number, packmaxsize: number, recvtimeoutms: number, sendtimeoutms: number): TcpClient;
        static destroy(tc: TcpClient): void;
        static getError(): string;
        connect(url: string, port: number, timeoutms: number): number;
        send(data: any, size: number): number;
        close(): void;
        onConnect: (result: boolean, reason: number) => void;
        onDisConnect: (reason: number) => void;
        onReceived: (data: any, size: number) => void;
        onClose: () => void;
    }
    export class DataR {
        static init(bytes: string, packsize: number): number;
        static cmdId(buf, buflen: number): number;
        static unpack(buf, buflen: number, obj: {}): number;
        static pack(obj: {}): number;
        static packBuf(): any;
        static release(): void;
        static getError(): string;
    }
}


// 结构体的声明
declare module UnityEngine {
    export class Vector2 {
        constructor(x: number, y: number);
        x: number;
        y: number;
        // static readonly kEpsilon: number;
        readonly normalized: Vector2;
        // readonly magnitude: number;
        // readonly sqrMagnitude: number;
        static readonly zero: Vector2;
        static readonly one: Vector2;
        // static readonly up: Vector2;
        static readonly down: Vector2;
        // static readonly left: Vector2;
        // static readonly right: Vector2;
        Set(newX: number, newY: number): void;
        static Lerp(a: Vector2, b: Vector2, t: number): Vector2;
        // static LerpUnclamped(a: Vector2, b: Vector2, t: number): Vector2;
        static MoveTowards(current: Vector2, target: Vector2, maxDistanceDelta: number): Vector2;
        // static Scale(a: Vector2, b: Vector2): Vector2;
        // Scale(scale: Vector2): void;
        Normalize(): void;
        ToString(): string;
        // ToString(format: string): string;
        // GetHashCode(): number;
        // Equals(other: Object): boolean;
        // static Reflect(inDirection: Vector2, inNormal: Vector2): Vector2;
        static Dot(lhs: Vector2, rhs: Vector2): number;
        static Angle(from: Vector2, to: Vector2): number;
        static Distance(a: Vector2, b: Vector2): number;
        // static ClampMagnitude(vector: Vector2, maxLength: number): Vector2;
        // static SqrMagnitude(a: Vector2): number;
        // SqrMagnitude(): number;
        // static Min(lhs: Vector2, rhs: Vector2): Vector2;
        // static Max(lhs: Vector2, rhs: Vector2): Vector2;
        // static SmoothDamp(current: Vector2, target: Vector2, currentVelocity: Object, smoothTime: number, maxSpeed: number, deltaTime: number): Vector2;
        static op_Addition(a: Vector2, b: Vector2): Vector2;
        static op_Subtraction(a: Vector2, b: Vector2): Vector2;
        // static op_UnaryNegation(a: Vector2): Vector2;
        static op_Multiply(a: Vector2, d: number): Vector2;
        // static op_Multiply(d: number, a: Vector2): Vector2;
        // static op_Division(a: Vector2, d: number): Vector2;
        static op_Equality(lhs: Vector2, rhs: Vector2): boolean;
        static op_Inequality(lhs: Vector2, rhs: Vector2): boolean;
        // static op_Implicit(v: Vector3): Vector2;
        // static op_Implicit(v: Vector2): Vector3;
        // static GetType() : UnityEngine.Type;
    }
    export class Vector3 {
        constructor(x: number, y: number, z: number);
        constructor(x: number, y: number);
        // static readonly kEpsilon: number;
        x: number;
        y: number;
        z: number;
        readonly normalized: Vector3;
        // readonly magnitude: number;
        // readonly sqrMagnitude: number;
        static readonly zero: Vector3;
        static readonly one: Vector3;
        // static readonly forward: Vector3;
        // static readonly back: Vector3;
        static readonly up: Vector3;
        // static readonly down: Vector3;
        static readonly left: Vector3;
        // static readonly right: Vector3;
        // static Slerp(a: Vector3, b: Vector3, t: number): Vector3;
        // static SlerpUnclamped(a: Vector3, b: Vector3, t: number): Vector3;
        // static OrthoNormalize(normal: Object, tangent: Object): void;
        // static OrthoNormalize(normal: Object, tangent: Object, binormal: Object): void;
        // static RotateTowards(current: Vector3, target: Vector3, maxRadiansDelta: number, maxMagnitudeDelta: number): Vector3;
        // static Lerp(a: Vector3, b: Vector3, t: number): Vector3;
        // static LerpUnclamped(a: Vector3, b: Vector3, t: number): Vector3;
        // static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3;
        // static SmoothDamp(current: Vector3, target: Vector3, currentVelocity: Object, smoothTime: number, maxSpeed: number): Vector3;
        // static SmoothDamp(current: Vector3, target: Vector3, currentVelocity: Object, smoothTime: number): Vector3;
        // static SmoothDamp(current: Vector3, target: Vector3, currentVelocity: Object, smoothTime: number, maxSpeed: number, deltaTime: number): Vector3;
        Set(new_x: number, new_y: number, new_z: number): void;
        // static Scale(a: Vector3, b: Vector3): Vector3;
        // Scale(scale: Vector3): void;
        // static Cross(lhs: Vector3, rhs: Vector3): Vector3;
        // GetHashCode(): number;
        // Equals(other: Object): boolean;
        // static Reflect(inDirection: Vector3, inNormal: Vector3): Vector3;
        // static Normalize(value: Vector3): Vector3;
        // Normalize(): void;
        static Dot(lhs: Vector3, rhs: Vector3): number;
        // static Project(vector: Vector3, onNormal: Vector3): Vector3;
        // static ProjectOnPlane(vector: Vector3, planeNormal: Vector3): Vector3;
        static Angle(from: Vector3, to: Vector3): number;
        static Distance(a: Vector3, b: Vector3): number;
        // static ClampMagnitude(vector: Vector3, maxLength: number): Vector3;
        // static Magnitude(a: Vector3): number;
        // static SqrMagnitude(a: Vector3): number;
        // static Min(lhs: Vector3, rhs: Vector3): Vector3;
        // static Max(lhs: Vector3, rhs: Vector3): Vector3;
        static op_Addition(a: Vector3, b: Vector3): Vector3;
        static op_Subtraction(a: Vector3, b: Vector3): Vector3;
        // static op_UnaryNegation(a: Vector3): Vector3;
        static op_Multiply(a: Vector3, d: number): Vector3;
        static op_Multiply(d: number, a: Vector3): Vector3;
        // static op_Division(a: Vector3, d: number): Vector3;
        // static op_Equality(lhs: Vector3, rhs: Vector3): boolean;
        // static op_Inequality(lhs: Vector3, rhs: Vector3): boolean;
        // ToString(): string;
        // ToString(format: string): string;
        // static GetType() : UnityEngine.Type;
    }
}
