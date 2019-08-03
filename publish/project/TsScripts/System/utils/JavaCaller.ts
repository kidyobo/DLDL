export class JavaCaller {
    private static javaobjects: { [index: string]: UnityEngine.AndroidJavaObject } = {}
    static getJavaObject(className: string, staticField: string, staticMethod: string): UnityEngine.AndroidJavaObject {
        if (UnityEngine.Application.platform != UnityEngine.RuntimePlatform.Android) {
            return null;
        }

        let key = className + '.' + (staticField != null ? staticField : staticMethod);
        let javaobj = this.javaobjects[key];
        if (javaobj == null) {
            let javaclass = new UnityEngine.AndroidJavaClass(className);
            if (staticField != null && staticField != '') {
                javaobj = Game.DynCaller.Invoke(null, javaclass, "GetStatic", UnityEngine.AndroidJavaObject.GetType(), [staticField]) as UnityEngine.AndroidJavaObject;
            }
            else {
                javaobj = Game.DynCaller.JavaInvoke(null, javaclass, "CallStatic", UnityEngine.AndroidJavaObject.GetType(), staticMethod, []) as UnityEngine.AndroidJavaObject;
            }
            uts.log(javaobj); 
            javaclass.Dispose();
            this.javaobjects[key] = javaobj;
        }
        return javaobj;
    }
    
    static getJavaStaticValue(className: string, staticField: string): string {
        if (UnityEngine.Application.platform != UnityEngine.RuntimePlatform.Android) {
            return null;
        }
        let rt = '';
        let javaclass = new UnityEngine.AndroidJavaClass(className);
        rt = Game.DynCaller.Invoke(null, javaclass, "GetStatic", UnityEngine.Type.GetType("System.String"), [staticField]) as string;
        javaclass.Dispose();
        return rt;
    }

    static callRetInt(method: string, ...args): number {
        return Game.DynCaller.JavaInvoke(null, this.currentActivity, "Call", UnityEngine.Type.GetType("System.Int32"), method, args) as number;
    }
    static callRetString(method: string, ...args): string {
        return Game.DynCaller.JavaInvoke(null, this.currentActivity, "Call", UnityEngine.Type.GetType("System.String"), method, args) as string;
    }
    static callRetBoolean(method: string, ...args): boolean {
        return Game.DynCaller.JavaInvoke(null, this.currentActivity, "Call", UnityEngine.Type.GetType("System.Boolean"), method, args) as boolean;
    }

    static get currentActivity(): UnityEngine.AndroidJavaObject {
        return this.getJavaObject('com.unity3d.player.UnityPlayer', 'currentActivity', null);
    }

    static comCallRetInt(obj: UnityEngine.AndroidJavaObject, method: string, ...args): number {
        return Game.DynCaller.JavaInvoke(null, obj, "Call", UnityEngine.Type.GetType("System.Int32"), method, args) as number;
    }
    static comCallRetString(obj: UnityEngine.AndroidJavaObject, method: string, ...args): string {
        return Game.DynCaller.JavaInvoke(null, obj, "Call", UnityEngine.Type.GetType("System.String"), method, args) as string;
    }
    static comCallRetBoolean(obj: UnityEngine.AndroidJavaObject, method: string, ...args): boolean {
        return Game.DynCaller.JavaInvoke(null, obj, "Call", UnityEngine.Type.GetType("System.Boolean"), method, args) as boolean;
    }
    static comCallRetVoid(obj: UnityEngine.AndroidJavaObject, method: string, ...args) {
        Game.DynCaller.JavaInvoke(null, obj, "Call", UnityEngine.Type.GetType("System.Void"), method, args);
    }
}