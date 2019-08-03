//工厂函数，用于动态创建类

export class FacotoryUtils{

    static createClass<T>(cls: new() => any):T{
        return new cls();
    }
}