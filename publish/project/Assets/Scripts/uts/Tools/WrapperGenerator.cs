#if UNITY_EDITOR

using UnityEditor;
using UnityEngine;
using System;
using Object = UnityEngine.Object;
using System.IO;
using System.Collections.Generic;
using System.Reflection;
using System.Text.RegularExpressions;

/*
 TypeInfo ： GetSimpleName, GetPureName, className, typeName, 都是啥意思，啥用途，模糊不清
 BindType  GetTsClassName 的位置放在哪里 -> TsDeclareHelper ?
 ParametersHelper,TypeHelper,TsDeclareHelper 三者关系相互调用在一直了，层次混乱
*/

namespace Uts
{
    public class SameCountParameters
    {
        public int paramCount;
        public List<MethodBase> methods = new List<MethodBase>();
    }

    public class Method
    {
        public string name;
        public bool isStatic;
        public List<SameCountParameters> groups = new List<SameCountParameters>();
    }

    // 将Property和Field合并处理的类
    public class PropertyField
    {
        public bool isStatic;
        public bool readOnly;
        public string name;
        public Type type;
        public PropertyField(bool isStatic, bool readOnly, string name, Type type)
        {
            this.isStatic = isStatic;
            this.readOnly = readOnly;
            this.name = name;
            this.type = type;
        }
    }

    // 通过反射获取要wrap的类的方法成员信息
    public class BindType
    {
        private static Dictionary<string, int> ignorePropertyList = new Dictionary<string, int>();

        public string tsModuleName { private set; get; }
        public Type type { private set; get; }
        public bool hasConstructor { private set; get; }
        public TypeHelper typeInfo { private set; get; }

        private class EmptyStruct { public EmptyStruct() { } };
        private const BindingFlags binding = BindingFlags.Public | BindingFlags.Static | BindingFlags.IgnoreCase | BindingFlags.DeclaredOnly | BindingFlags.Instance;
        private string alias = null;

        public BindType(string moduleName, Type type, string alias)
        {
            this.type = type;
            this.typeInfo = new TypeHelper(type, true);

            this.tsModuleName = moduleName;
            this.alias = alias;
            this.hasConstructor = GetConstructors().Length > 0 || typeInfo.isAgent;

            object[] checkCustom = type.GetCustomAttributes(true);
            for (int i = 0, customLength = checkCustom.Length; i < customLength; i++)
            {
                var atti = checkCustom[i];
                if (atti.GetType() == typeof(System.Reflection.DefaultMemberAttribute))
                {
                    ignorePropertyList[((System.Reflection.DefaultMemberAttribute)atti).MemberName] = 0;
                }
            }
        }

        public string GetTsClassName()
        {
            if (alias == null)
                return typeInfo.className;
            return alias;
        }

        public FieldInfo[] GetFields()
        {
            var members = type.GetFields(binding);
            List<FieldInfo> newList = new List<FieldInfo>(members.Length);

            foreach (var member in members)
            {
                if (!IsDeprecated(typeInfo.className, member))
                {
                    newList.Add(member);
                }
            }

            return newList.ToArray();
        }

        public PropertyInfo[] GetProperties()
        {
            var members = type.GetProperties(binding);
            List<PropertyInfo> newList = new List<PropertyInfo>(members.Length);
            foreach (var member in members)
            {
                if (!IsDeprecated(typeInfo.className, member))
                {
                    if (ignorePropertyList.ContainsKey(member.Name))
                    {
                        continue;
                    }
                    newList.Add(member);
                }
            }

            return newList.ToArray();
        }

        public MethodInfo[] GetMethods()
        {
            var members = type.GetMethods(binding);
            List<MethodInfo> newList = new List<MethodInfo>(members.Length);
            foreach (var member in members)
            {
                if (member.Name.Contains("_") && !member.Name.StartsWith("op_")) continue;
                if (!IsDeprecated(typeInfo.className, member) && !member.IsGenericMethod && !member.ContainsGenericParameters)
                {
                    newList.Add(member);
                }
            }
            return newList.ToArray();
        }

        public List<PropertyField> GetMergedProperties()
        {
            List<PropertyField> ps = new List<PropertyField>();
            FieldInfo[] fields = GetFields();
            foreach (FieldInfo field in fields)
                ps.Add(new PropertyField(field.IsStatic, field.IsLiteral || field.IsInitOnly, field.Name, field.FieldType));
            PropertyInfo[] properties = GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var method = property.GetGetMethod();
                ps.Add(new PropertyField(method.IsStatic, !property.CanWrite || property.GetSetMethod() == null, property.Name, property.PropertyType));
            }
            return ps;
        }

        // 对重载方法参数的合并处理
        public List<Method> GetMergedMethods()
        {
            List<Method> mergedmethods = new List<Method>();
            MethodInfo[] methods = GetMethods();
            foreach (var method in methods)
            {
                var findMethod = mergedmethods.Find((item) => item.name == method.Name && item.isStatic == method.IsStatic);
                if (findMethod == null)
                {
                    findMethod = new Method();
                    findMethod.name = method.Name;
                    findMethod.isStatic = method.IsStatic;
                    mergedmethods.Add(findMethod);
                }
                MergedMethod(findMethod, method);
            }
            return mergedmethods;
        }

        public Method GetMergedConstructor()
        {
            MethodBase[] ctors = GetConstructors();
            if (ctors.Length == 0 && hasConstructor) // 如果是结构体同时没有构造函数，需要手工添加一个
            {
                ctors = typeof(EmptyStruct).GetConstructors(binding);
            }
            Method mergedmethod = new Method();
            foreach (var method in ctors)
            {
                MergedMethod(mergedmethod, method);
            }
            return mergedmethod;
        }

        // 对重载方法参数的合并处理
        private void MergedMethod(Method mergedmethod, MethodBase method)
        {
            var parameters = method.GetParameters();
            var find = mergedmethod.groups.Find((item) => item.paramCount == parameters.Length);
            if (find == null)
            {
                find = new SameCountParameters();
                find.paramCount = parameters.Length;
                mergedmethod.groups.Add(find);
            }
            find.methods.Add(method);
        }

        public MethodBase[] GetConstructors()
        {
            var members = type.GetConstructors(binding);
            List<MethodBase> newList = new List<MethodBase>(members.Length);
            foreach (var member in members)
            {
                if (!IsDeprecated(typeInfo.className, member))
                {
                    newList.Add(member);
                }
            }
            return newList.ToArray();
        }

        static bool IsDeprecated(string className, MemberInfo info)
        {
            object[] checkCustom = info.GetCustomAttributes(false);
            for (int j = 0, customLength = checkCustom.Length; j < customLength; j++)
            {
                var obj = checkCustom[j];
                var type = obj.GetType();
                var typeStr = type.Name;
                if (typeStr == "ObsoleteAttribute")
                {
                    return true;
                }
                if (typeStr == "DonotWrapAttribute")
                {
                    return true;
                }
            }

            if (WrapFiles.memberFilter.Contains(className + "." + info.Name))
            {
                return true;
            }
            return false;
        }
    }

    public class TypeHelper
    {
        public static string currentTsModuleName;
        public static Dictionary<Type, string> enumTypeModules = new Dictionary<Type, string>();

        private static readonly Dictionary<string, string> simpleNames = new Dictionary<string, string>() {
            { "System.Int32", "int"}
            ,{ "System.UInt32", "uint" }
            ,{ "System.Int64", "long" }
            ,{ "System.UInt64", "ulong" }
            ,{ "System.Int16", "short" }
            ,{ "System.UInt16", "ushort" }
            ,{ "System.Decimal", "double" }
            ,{ "System.Double", "double" }
            ,{ "System.Single", "float" }
            ,{ "System.Char", "char" }
            ,{ "System.SByte", "sbyte" }
            ,{ "System.Byte", "byte" }
            ,{ "System.String", "string" }
            ,{ "System.Boolean", "bool" }
            ,{ "System.Void", "void" }
            ,{ "System.Object", "object" }
            ,{ "System.Collections.Generic.List", "List"}
        };
        private static readonly string[] numberTypes = new string[] { "int", "uint", "long", "ulong", "short", "ushort", "double", "float", "char", "sbyte", "byte" };
        private static Dictionary<string, bool> agents = new Dictionary<string, bool>();

        public Type type { private set; get; }
        public bool isNumber { private set; get; }
        public bool isBoolean { private set; get; }
        public bool isString { private set; get; }
        public bool isList { private set; get; }
        public bool isUnityEvent { private set; get; }
        public bool isDelegate { private set; get; }
        public bool isArray { private set; get; }
        public bool isEnum { private set; get; }
        public bool isAgent { private set; get; }
        public bool isBaseType { private set; get; }
        public bool isCustomStruct { private set; get; }
        public string customStruct { private set; get; }
        public string simpleName { private set; get; }
        public string className { private set; get; }
        public string typeName { private set; get; }
        public string[] genericArgs { private set; get; }
        public string[] genericArgNames { private set; get; }
        public string elementName { private set; get; }
        public string returnName { private set; get; }
        public TypeHelper(Type type, bool isBindType = false)
        {
            if (isBindType) AddBindType(type);

            this.type = type;
            className = type.Name;
            typeName = GetTypeName(type);
            simpleName = GetSimpleName(type);
            isNumber = Array.Find<string>(numberTypes, (a) => a == simpleName) != null;
            isString = simpleName == "string";
            isBoolean = simpleName == "bool";
            isBaseType = isNumber || isString || isBoolean;
            isList = simpleName.StartsWith("List<");
            isUnityEvent = type.IsSubclassOf(typeof(UnityEngine.Events.UnityEventBase));
            isDelegate = type.IsSubclassOf(typeof(Delegate));
            isArray = type.IsArray;
            isEnum = type.IsEnum;

            string _customStruct = "";
            isCustomStruct = WrapFiles.structObjects.TryGetValue(GetTypeName(type), out _customStruct);
            customStruct = _customStruct;

            isAgent = IsAgent(type);
            if (isArray) elementName = GetPureName(type.GetElementType());
            if (isList) elementName = GetPureName(type.GetGenericArguments()[0]);

            string _returnName = "";
            if (isDelegate)
                genericArgs = GetDelegateArguments(type, out _returnName);
            else
                genericArgs = GetGenericArguments(type);
            returnName = _returnName;
        }

        public Type ElementType
        {
            get
            {
                if (isArray) return type.GetElementType();
                else if (isList) return type.GetGenericArguments()[0];
                else return null;
            }
        }

        public string GetReturnTsDeclare()
        {
            if (isDelegate)
            {
                MethodInfo methodInfo = type.GetMethod("Invoke");
                return new ParametersHelper("", methodInfo.Name, methodInfo.GetParameters(), methodInfo.ReturnType).tsReturnsTypesDeclare;
            }
            else
            {
                return "void";
            }
        }

        public static bool IsAgent(Type type)
        {
            string typename = GetTypeName(type);
            return agents.ContainsKey(typename);
        }

        public static string GetTypeName(Type type)
        {
            return type.ToString().Replace("+", ".").Trim('&');
        }

        public static string GetBaseJsClassName(Type type)
        {
            var baseType = Array.Find<BindType>(WrapFiles.binds, a => a.type == type.BaseType);
            if (baseType == null) return "IntPtr.Zero";
            return baseType.typeInfo.className + "Wrap.jsClass";
        }

        private static void AddBindType(Type type)
        {
            string typename = GetTypeName(type);
            if (type.IsValueType && !WrapFiles.structObjects.ContainsKey(typename))
            {
                agents[typename] = true;
            }
        }

        private string GetSimpleName(Type type)
        {
            string typeName = GetTypeName(type);
            string simpleName;
            if (simpleNames.TryGetValue(typeName, out simpleName))
            {
                return simpleName;
            }

            if (type.IsEnum)
            {
                if (!TypeHelper.enumTypeModules.ContainsKey(type))
                {
                    string classModule = "";
                    if (type.FullName.Contains("+")) classModule = (new Regex(@"(\.?\w+)\+")).Match(type.FullName).Groups[1].Value;
                    if (classModule != "" && !classModule.StartsWith(".")) classModule = "." + classModule;
                    enumTypeModules[type] = currentTsModuleName + classModule;
                }
            }

            if (type.IsGenericType)
            {
                return GetGenericName(type);
            }
            else if (type.IsArray)
            {
                return GetSimpleName(type.GetElementType()) + "[]";
            }
            else if (IsAgent(type))
            {
                return "Agent<" + typeName + ">";
            }
            else
            {
                return typeName;
            }
        }

        private string GetPureName(Type type)
        {
            if (IsAgent(type)) return GetTypeName(type);
            else return GetSimpleName(type);
        }

        private string GetGenericName(Type type)
        {
            string[] args = GetGenericArguments(type);
            if (args.Length == 0) return type.FullName;

            string typeName = type.FullName;
            string pureTypeName = typeName.Substring(0, typeName.IndexOf('`'));
            string simpleName;
            if (!simpleNames.TryGetValue(pureTypeName, out simpleName)) simpleName = pureTypeName;
            return simpleName + "<" + string.Join(",", args) + ">";
        }

        private string[] GetGenericArguments(Type type)
        {
            Type[] args = type.GetGenericArguments();
            if (args.Length == 0) return new string[] { };
            string[] argNames = new string[args.Length];
            genericArgNames = new string[args.Length];
            for (int i = 0; i < args.Length; i++)
            {
                argNames[i] = GetPureName(args[i]);
                genericArgNames[i] = "arg" + i;
            }
            return argNames;
        }

        private string[] GetDelegateArguments(Type type, out string returnName)
        {
            MethodInfo methodInfo = type.GetMethod("Invoke");
            ParameterInfo[] parameters = methodInfo.GetParameters();
            string[] argNames = new string[parameters.Length];
            genericArgNames = new string[parameters.Length];
            for (int i = 0; i < parameters.Length; i++)
            {
                argNames[i] = GetPureName(parameters[i].ParameterType);
                genericArgNames[i] = parameters[i].Name;
            }
            returnName = GetSimpleName(methodInfo.ReturnType);
            return argNames;
        }
    }

    public class ParametersHelper
    {
        public bool multiResult { private set; get; } // 返回值为多个
        public string tsReturnsTypesDeclare { private set; get; } // for ts return declare
        public string toJsArrayReturns { private set; get; } // for MakeJsArray args
        public string csCallArgs { private set; get; } // for obj.call(arg1, arg2...)
        public string tsCallArgsDeclare { private set; get; } // for ust.d.ts: m(arg1:number, arg2:...) 
        public Dictionary<int, Type> refedCustomStructTypes { private set; get; } // 参数类型是自定义结构体，同时需要ref或out的  <index, type>

        public ParametersHelper(string curModule, string methodName, ParameterInfo[] parameters, Type returnType)
        {
            List<string> declareresults = new List<string>();
            List<string> jsArrayResults = new List<string>();
            refedCustomStructTypes = new Dictionary<int, Type>();
            string[] cscallargs = new string[parameters.Length];
            string[] declarecallargs = new string[parameters.Length];
            for (int i = 0; i < parameters.Length; i++)
            {
                var parameter = parameters[i];
                var typeInfo = new TypeHelper(parameter.ParameterType);
                string csarg = "p" + i;
                if (parameter.ParameterType.IsByRef)
                {
                    if (parameter.IsIn)
                    {
                        csarg = "in " + csarg;
                    }
                    else
                    {
                        if (typeInfo.isCustomStruct) refedCustomStructTypes[i] = parameter.ParameterType;

                        if (typeInfo.isBaseType)
                        {
                            declareresults.Add(TsDeclareHelper.GetClassName(curModule, parameter.ParameterType));
                            jsArrayResults.Add(csarg);
                        }

                        if (parameter.IsOut)
                        {
                            csarg = "out " + csarg;
                        }
                        else
                        {
                            csarg = "ref " + csarg;
                        }
                    }
                }

                if (typeInfo.isAgent)
                {
                    csarg += ".target";
                }

                if (isSingleOperator(methodName))
                    csarg = getOperator(methodName) + csarg;
                cscallargs[i] = csarg;
                declarecallargs[i] = parameter.Name + ": " + TsDeclareHelper.GetClassName(curModule, parameter.ParameterType);
            }

            tsReturnsTypesDeclare = TsDeclareHelper.GetClassName(curModule, returnType);

            multiResult = jsArrayResults.Count > 0;
            var returnTypeInfo = new TypeHelper(returnType);
            if (multiResult)
            {
                if (returnTypeInfo.simpleName != "void")
                {
                    jsArrayResults.Insert(0, "ret");
                    declareresults.Insert(0, TsDeclareHelper.GetClassName(curModule, returnType));
                }
                toJsArrayReturns = string.Join(", ", jsArrayResults.ToArray());
                tsReturnsTypesDeclare = "[" + string.Join(", ", declareresults.ToArray()) + "]";
            }
            csCallArgs = string.Join(getOperator(methodName), cscallargs);
            tsCallArgsDeclare = string.Join(", ", declarecallargs);
        }

        private bool isSingleOperator(string methodName)
        {
            return "op_UnaryNegation" == methodName;
        }

        private string getOperator(string methodName)
        {
            if (!methodName.StartsWith("op_")) return ", ";

            switch (methodName)
            {
                case "op_Addition": return "+";
                case "op_Subtraction": return "-";
                case "op_UnaryNegation": return "-";
                case "op_Multiply": return "*";
                case "op_Division": return "/";
                case "op_Equality": return "==";
                case "op_Inequality": return "!=";
                case "op_Implicit": return ",";
                default: return "";
            }
        }
    }

    public class TsDeclareHelper
    {
        public static string GetBaseClassName(BindType bindType)
        {
            var baseType = Array.Find<BindType>(WrapFiles.binds, a => a.type == bindType.type.BaseType);
            if (baseType == null) return "";
            if (baseType.tsModuleName == bindType.tsModuleName) return baseType.GetTsClassName();
            return baseType.tsModuleName + "." + baseType.GetTsClassName();
        }

        public static string GetClassName(string currentModule, Type type)
        {
            var typeinfo = new TypeHelper(type);
            string returnTypeName = null;
            Type elemType = type;
            if (typeinfo.isArray || typeinfo.isList)
                elemType = typeinfo.ElementType;

            var bindType = Array.Find<BindType>(WrapFiles.binds, a => a.type == elemType);
            if (bindType != null)
                returnTypeName = bindType.tsModuleName + "." + bindType.GetTsClassName();

            if (returnTypeName == null)
            {
                string enumModule;
                if (TypeHelper.enumTypeModules.TryGetValue(elemType, out enumModule))
                    returnTypeName = enumModule + "." + elemType.Name;
            }

            if (returnTypeName == null)
            {
                var elemTypeinfo = new TypeHelper(elemType);
                if (elemTypeinfo.isNumber) returnTypeName = "number";
                else if (elemTypeinfo.isString) returnTypeName = "string";
                else if (elemTypeinfo.isBoolean) returnTypeName = "boolean";
                else if (elemTypeinfo.simpleName == "void") returnTypeName = "void";
            }

            if (returnTypeName == null)
            {
                returnTypeName = "Object";
            }

            returnTypeName = returnTypeName.StartsWith(currentModule + ".") ? returnTypeName.Substring((currentModule + ".").Length) : returnTypeName;
            if (typeinfo.isArray || typeinfo.isList) returnTypeName = returnTypeName + "[]";
            if (typeinfo.isDelegate || typeinfo.isUnityEvent)
            {
                returnTypeName = "(" + GetArgsDeclare(typeinfo) + ")=>" + typeinfo.GetReturnTsDeclare();
            }
            return returnTypeName;
        }

        private static string GetArgsDeclare(TypeHelper typeinfo)
        {
            if (typeinfo.isDelegate)
            {
                MethodInfo methodInfo = typeinfo.type.GetMethod("Invoke");
                return new ParametersHelper("", methodInfo.Name, methodInfo.GetParameters(), methodInfo.ReturnType).tsCallArgsDeclare;
            }
            else if (typeinfo.isUnityEvent)
            {
                List<string> args = new List<string>();
                Type[] gargs = typeinfo.type.BaseType.GetGenericArguments();
                for (int i = 0; i < gargs.Length; i++)
                {
                    args.Add("arg" + i + ": " + GetClassName("", gargs[i]));
                }
                return string.Join(", ", args.ToArray());
            }
            return "";
        }
    }

    //
    // 代码混淆
    //
    public class CodeObfuscation
    {
        public static int randomSeed = 0;
        public static string HashName(string name)
        {
            if (randomSeed == 0)
                return name;

            string newname = name + "+" + randomSeed;
            return "m" + Tools.Md5(newname).Substring(0, 16);
        }

        // 生成指定长度的数组随机下标索引序列
        public static int[] RandomArrayIndexs(int count)
        {
            int[] randidxs = new int[count];
            for (int i = 0; i < randidxs.Length; i++) randidxs[i] = i;
            if (randomSeed == 0)
                return randidxs;

            System.Random rd = new System.Random(randomSeed);
            for (int i = randidxs.Length - 1; i > 0; i--)
            {
                int idx = rd.Next(i + 1);
                int tmp = randidxs[idx];
                randidxs[idx] = randidxs[i];
                randidxs[i] = tmp;
            }
            return randidxs;
        }
    }

    //
    // 生成器基础模板类
    //
    public class BaseGenerator
    {
        protected bool isPropertySetter;
        protected BindType bindType;
        protected Method method;
        protected CodeStringBuilder codeBuilder;
        public BaseGenerator(BindType bindType, Method method, CodeStringBuilder codeBuilder)
        {
            this.isPropertySetter = false;
            this.bindType = bindType;
            this.method = method;
            this.codeBuilder = codeBuilder;
        }

        public void Generate()
        {
            if (method != null && method.groups.Count == 0) return;

            // 生成函数定义，代码片段如下
            // [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
            // public static IntPtr setName_S(IntPtr context ...) {
            GenerateMethodDefine();
            codeBuilder.Indent();
            codeBuilder.AppendTry();

            // 生成cs的thisObj，代码片段如下
            // var obj = xxx;
            GenerateThisObject();

            // 主体部分的生成
            GenerateBody();

            codeBuilder.AppendCatch(isPropertySetter);
            codeBuilder.UnindentAndAppendLine("}");
            codeBuilder.AppendLine("");
        }

        // 由于方法的生成和属性的生成不同，把这个方法独立处理
        protected virtual void GenerateBody()
        {
            for (int i = 0, groupCnt = method.groups.Count; i < groupCnt; i++)
            {
                var group = method.groups[i];

                // 生成参数个数判断，代码片段如下
                // if (argcnt == x) {
                GenerateArgCountConditionStart(i, groupCnt, group.paramCount);

                // 生成cs的method需要的调用参数，代码片段如下
                // var p0 = xxx;
                // var p1 = xxx;
                bool specificType = group.methods.Count == 1; // 相同参数数量没有重载的函数，类型就是明确的啦
                if (group.methods.Count > 0)
                    GenerateParameters(group.methods[0].GetParameters(), specificType);

                for (int methodIdx = 0; methodIdx < group.methods.Count; methodIdx++)
                {
                    var method = group.methods[methodIdx];

                    // 生成函数参数类型对比，代码片段如下
                    // if (Uts.Core.CompareType(vp0, typeof(XXX)) && ... ) {
                    GenerateParameterTypeConditionStart(methodIdx, specificType, method.GetParameters());

                    // 对于参数个数相同的有重载的情况，代码片段如下
                    // var p0 = (type)vp0;
                    // var p1 = (type)vp1;
                    GenerateCastParametersInOneTypeCondition(method.GetParameters(), specificType);

                    // 生成函数调用代码，代码片段如下
                    // var ret = obj.xxx(p0, p1);  或者无参数返回 obj.xxx(p0, p1);
                    GenerateCsObjectCaller(method);

                    // 自定义结构体的out，ref 参数的处理，代码片段如下
                    // JsVector2.SetJsObject(context, args[2], p2);
                    GenerateOutCutsomStructParameters(method);

                    // 生成js的返回值，代码片段如下
                    // return MakeJsObjects.MakeJsObject(context, ret); 或者 return IntPtr.Zero; 或则 Native.jvm_make_string(context, ret); ... 
                    GenerateJsReturn(method);

                    bool lastCondition = methodIdx == group.methods.Count - 1;
                    GenerateParameterTypeConditionEnd(specificType, lastCondition, method.GetParameters());
                }

                GenerateArgCountConditionEnd(i, groupCnt, group.paramCount);
            }
        }

        protected virtual void GenerateMethodDefine() { }
        protected virtual void GenerateThisObject() { }
        protected virtual void GenerateCsObjectCaller(MethodBase method) { }
        protected virtual void GenerateOutCutsomStructParameters(MethodBase method) { }
        protected virtual void GenerateJsReturn(MethodBase method) { }
        protected virtual bool IsStatic { get { return false; } }

        protected string ThisObjName
        {
            get
            {
                if (IsStatic) return bindType.typeInfo.typeName;
                else if (bindType.typeInfo.isAgent) return "obj.target";
                else return "obj";
            }
        }

        protected void GenerateArgCountConditionStart(int methodidx, int methodcount, int paramcount)
        {
            if (methodcount == 1) return;

            if (methodidx == 0) codeBuilder.AppendFormatLine("if (argcnt == {0}) {{", paramcount);
            else codeBuilder.AppendFormatLine("}} else if (argcnt == {0}) {{", paramcount);
            codeBuilder.Indent();
        }

        protected void GenerateParameters(ParameterInfo[] parameters, bool specificType)
        {
            for (int i = 0; i < parameters.Length; i++)
            {
                if (specificType) // 对类型已经明确
                    codeBuilder.AppendFormatLine("var p{0} = {1};", i, getArgFromJsArg(parameters[i].ParameterType, "Native.jvm_get_arg(args, " + i + ")"));
                else// 对类型不明确，则获取可变的object，这个是对应参数数量相同，参数类型不同的重载方法的情况
                    // 后面的代码会通过参数类型对比，会再进行一次明确的类型转换： var p1 = typecast(vp1) ...
                    codeBuilder.AppendFormatLine("var vp{0} = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, {1}));", i, i);
            }
        }

        protected void GenerateParameterTypeConditionStart(int typeIdx, bool specificType, ParameterInfo[] parameters)
        {
            if (specificType) return;

            string[] compareArgs = new string[parameters.Length];
            for (int i = 0; i < parameters.Length; i++)
            {
                var typeInfo = new TypeHelper(parameters[i].ParameterType);
                compareArgs[i] = string.Format("Uts.Core.CompareType(vp{0}, typeof({1}))", i, typeInfo.isList ? typeInfo.genericArgs[0] + "[]" : typeInfo.simpleName);
            }
            if (typeIdx == 0) codeBuilder.AppendFormatLine("if ({0}) {{", string.Join(" && ", compareArgs));
            else codeBuilder.AppendFormatLine("}} else if ({0}) {{", string.Join(" && ", compareArgs));
            codeBuilder.Indent();
        }

        protected void GenerateCastParametersInOneTypeCondition(ParameterInfo[] parameters, bool specificType)
        {
            if (specificType) return;

            for (int i = 0; i < parameters.Length; i++)
            {
                var varName = "vp" + i;
                codeBuilder.AppendFormatLine("var p{0} = {1};", i, castType(parameters[i].ParameterType, true, varName));
            }
        }

        protected void GenerateParameterTypeConditionEnd(bool specificType, bool lastCondition, ParameterInfo[] parameters)
        {
            if (specificType) return;

            codeBuilder.Unindent();
            if (lastCondition) codeBuilder.AppendLine("} else { return Native.jvm_throwerr(context, exception, \"Parameter type mismatch\"); }");
        }

        protected void GenerateArgCountConditionEnd(int methodidx, int methodcount, int paramcount)
        {
            if (methodcount == 1) return;
            codeBuilder.Unindent();
            if (methodidx == methodcount - 1) codeBuilder.AppendLine("} else { return Native.jvm_throwerr(context, exception, \"Parameter count mismatch\"); }");
        }

        protected string jsValReturnCode(Type returnType, string retVarName, bool multiResult, string arrayArgs) //multi results
        {
            var typeInfo = new TypeHelper(returnType);
            if (multiResult) return "MakeJsObjects.MakeJsArray(context, " + arrayArgs + ")";
            else if (typeInfo.simpleName == "void") return "IntPtr.Zero";
            else if (typeInfo.isArray || typeInfo.isList) return "MakeJsObjects.MakeJsObject(context, " + retVarName + ")";
            else if (typeInfo.isNumber) return "Native.jvm_make_number(context, (double)(" + retVarName + "))";
            else if (typeInfo.isEnum) return "Native.jvm_make_number(context, (double)(" + retVarName + "))";
            else if (typeInfo.isString) return "Native.jvm_make_string(context, " + retVarName + ")";
            else if (typeInfo.isBoolean) return "Native.jvm_make_boolean(context, " + retVarName + ")";
            else if (typeInfo.isDelegate || typeInfo.isUnityEvent) return "MakeJsObjects.MakeJsObject(context, " + retVarName + ")";
            else if (typeInfo.isCustomStruct) return typeInfo.customStruct + ".ToJsObject(context, " + retVarName + ")";
            else if (!typeInfo.isAgent && typeInfo.simpleName == "object") return "MakeJsObjects.MakeVarJsObject(context, " + retVarName + ")";
            else if (typeInfo.isAgent) return "MakeJsObjects.MakeJsObjectForAgent<" + TypeHelper.GetTypeName(returnType) + ">(context, " + retVarName + ")";
            else return "MakeJsObjects.MakeJsObject(context, " + retVarName + ")";
        }

        protected string getArgFromJsArg(Type paramType, string jsArg)
        {
            var typeInfo = new TypeHelper(paramType);
            string varName = "";
            if (typeInfo.isCustomStruct)
                varName = typeInfo.customStruct + ".ToCsObject(context, " + jsArg + ")";
            else if (typeInfo.isNumber || typeInfo.isEnum)
                varName = "Native.jvm_tonumber(context, " + jsArg + ")";
            else if (typeInfo.isString)
                varName = "Native.jvm_tostring(context, " + jsArg + ")";
            else if (typeInfo.isBoolean)
                varName = "Native.jvm_toboolean(context, " + jsArg + ")";
            else if (typeInfo.isAgent)
                varName = "ToCsObjects.ToObject(context, " + jsArg + ")";
            else if (typeInfo.isDelegate)
            {
                List<string> vars = new List<string>(typeInfo.genericArgs);
                if (typeInfo.returnName != "void") vars.Add(typeInfo.returnName);
                vars.Add(typeInfo.simpleName);
                string delegateMethod = typeInfo.returnName != "void" ? "CreateDelegateRt" : "CreateDelegate";
                varName = string.Format("Uts.DelegateUtil.{0}<{1}>(context, {2})", delegateMethod, string.Join(", ", vars.ToArray()), jsArg);
            }
            else if (typeInfo.isUnityEvent)
            {
                var baseTypeInfo = new TypeHelper(paramType.BaseType);
                if (!baseTypeInfo.simpleName.StartsWith("UnityEngine.Events.UnityEvent")) Debug.LogError("Error: basetype is not UnityEngine.Events.UnityEvent");
                List<string> gargs = new List<string>(baseTypeInfo.genericArgs);
                gargs.Add(typeInfo.simpleName);
                varName = string.Format("Uts.DelegateUtil.CreateUnityEvent<{0}>(context, " + jsArg + ", new {1}())", string.Join(", ", gargs.ToArray()), typeInfo.simpleName);
            }
            else if (typeInfo.isArray)
                varName = "ToCsObjects.ToArray<" + typeInfo.elementName + ">(context, " + jsArg + ")";
            else if (typeInfo.isList)
                varName = "ToCsObjects.ToList<" + typeInfo.elementName + ">(context, " + jsArg + ")";
            else if (typeInfo.simpleName == "object")
                varName = "ToCsObjects.ToVarObject(context, " + jsArg + ")";
            else
                varName = "ToCsObjects.ToObject(context, " + jsArg + ")";
            return castType(paramType, false, varName);
        }

        protected string castType(Type paramType, bool srcIsVarType, string varName)
        {
            var typeInfo = new TypeHelper(paramType);
            if (srcIsVarType) // varName来自于vp1,vp2...： var vp1 = ToCsObjects.ToVarObject(...
            {
                if (typeInfo.isList)
                    return "ToCsObjects.ToList<" + typeInfo.elementName + ">(" + varName + ")";
                else if (typeInfo.isArray)
                    return "ToCsObjects.ToArray<" + typeInfo.elementName + ">(" + varName + ")";
            }

            if (typeInfo.isList || typeInfo.isArray || typeInfo.isUnityEvent || typeInfo.simpleName == "object")
                return varName; // 对于类型明确的不需要类型转换了

            if ((typeInfo.isNumber || typeInfo.isEnum) && typeInfo.simpleName != "double")
                varName = "(double)" + varName;
            return "(" + typeInfo.simpleName + ")" + varName;
        }

        protected string castReturnType(Type returnType, string retValue)
        {
            var typeInfo = new TypeHelper(returnType);
            if (typeInfo.isAgent)
                return "new Agent<" + TypeHelper.GetTypeName(returnType) + ">(" + retValue + ")";
            else
                return retValue;
        }
    }

    //
    // 构造函数生成器
    //
    public class ConstructorGenerator : BaseGenerator
    {
        public ConstructorGenerator(BindType bindType, Method method, CodeStringBuilder codeBuilder) : base(bindType, method, codeBuilder) { }

        protected override void GenerateMethodDefine()
        {
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]");
            codeBuilder.AppendLine("public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {");
        }

        protected override void GenerateCsObjectCaller(MethodBase method)
        {
            string callParameters = "(" + new ParametersHelper(bindType.tsModuleName, "ctor", method.GetParameters(), typeof(void)).csCallArgs + ")";
            if (bindType.typeInfo.isAgent) callParameters = string.Format("(new {0}{1})", bindType.typeInfo.typeName, callParameters);
            codeBuilder.AppendFormatLine("var obj = new {0}{1};", bindType.typeInfo.simpleName, callParameters);
        }

        protected override void GenerateJsReturn(MethodBase method)
        {
            codeBuilder.AppendLine("return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);");
        }
    }

    //
    // 普通成员函数生成器
    //
    public class MethodGenerator : BaseGenerator
    {
        public static string WrapName(Method method)
        {
            string name = method.name + (method.isStatic ? "_S" : "");
            return CodeObfuscation.HashName(name);
        }
        public MethodGenerator(BindType bindType, Method method, CodeStringBuilder codeBuilder) : base(bindType, method, codeBuilder) { }

        protected override void GenerateMethodDefine()
        {
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]");
            codeBuilder.AppendFormatLine("public static IntPtr {0}(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {{", WrapName(method));
        }

        protected override void GenerateThisObject()
        {
            if (!method.isStatic) codeBuilder.AppendFormatLine("var obj = (({0})ToCsObjects.ToCsObject(context, thisObj));", bindType.typeInfo.simpleName);
        }

        protected override void GenerateCsObjectCaller(MethodBase basemethod)
        {
            MethodInfo method = (MethodInfo)basemethod;
            var retName = TypeHelper.GetTypeName(method.ReturnType) != "System.Void" ? "var ret = " : "";

            var caller = ThisObjName + "." + method.Name;
            if (method.Name.StartsWith("op_")) caller = ""; // 操作符不需要方法名

            var parametersInfo = new ParametersHelper(bindType.tsModuleName, method.Name, method.GetParameters(), method.ReturnType);
            caller = caller + "(" + parametersInfo.csCallArgs + ")";
            caller = castReturnType(method.ReturnType, caller);
            codeBuilder.AppendLine(retName + caller + ";");
        }

        // 用在vector2/vector3/color...结构体
        protected override void GenerateOutCutsomStructParameters(MethodBase basemethod)
        {
            MethodInfo method = (MethodInfo)basemethod;
            var parametersInfo = new ParametersHelper(bindType.tsModuleName, method.Name, method.GetParameters(), method.ReturnType);
            foreach (var pair in parametersInfo.refedCustomStructTypes)
            {
                var typeInfo = new TypeHelper(pair.Value);
                codeBuilder.AppendFormatLine("{0}.SetJsObject(context, Native.jvm_get_arg(args, {1}), p{2});", typeInfo.customStruct, pair.Key, pair.Key);
            }
        }

        protected override void GenerateJsReturn(MethodBase method)
        {
            var parametersInfo = new ParametersHelper(bindType.tsModuleName, method.Name, method.GetParameters(), (method as MethodInfo).ReturnType);
            codeBuilder.AppendFormatLine("return {0};", jsValReturnCode((method as MethodInfo).ReturnType, "ret", parametersInfo.multiResult, parametersInfo.toJsArrayReturns));
        }

        protected override bool IsStatic { get { return method.isStatic; } }
    }

    //
    // 属性基础类生成器
    //
    public class PropertyGenerator : BaseGenerator
    {
        protected PropertyField propertyField;
        protected string wrapName;
        public PropertyGenerator(BindType bindType, PropertyField propertyField, string wrapName, CodeStringBuilder codeBuilder) : base(bindType, null, codeBuilder)
        {
            this.propertyField = propertyField;
            this.wrapName = wrapName;
        }

        protected override void GenerateMethodDefine()
        {
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]");
            codeBuilder.AppendFormatLine("public static IntPtr {0}(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {{", wrapName);
        }

        protected override void GenerateThisObject()
        {
            if (!propertyField.isStatic) codeBuilder.AppendFormatLine("var obj = (({0})ToCsObjects.ToCsObject(context, thisObj));", bindType.typeInfo.simpleName);
        }

        protected override bool IsStatic { get { return propertyField.isStatic; } }
    }

    //
    // 属性的getter生成器
    //
    public class PropertyGetterGenerator : PropertyGenerator
    {
        public static string WrapName(PropertyField propertyField)
        {
            string name = propertyField.name + "Getter" + (propertyField.isStatic ? "_S" : "");
            return CodeObfuscation.HashName(name);
        }
        public PropertyGetterGenerator(BindType bindType, PropertyField propertyField, CodeStringBuilder codeBuilder) : base(bindType, propertyField, WrapName(propertyField), codeBuilder)
        {
        }

        protected override void GenerateMethodDefine()
        {
            if (propertyField.isStatic) // 静态属性和方法的定义相同，由基类来处理
            {
                base.GenerateMethodDefine();
                return;
            }
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]");
            codeBuilder.AppendFormatLine("public static IntPtr {0}(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {{", wrapName);
        }

        protected override void GenerateBody()
        {
            var property = ThisObjName + "." + propertyField.name;
            property = castReturnType(propertyField.type, property);
            codeBuilder.AppendFormatLine("return {0};", jsValReturnCode(propertyField.type, property, false, null));
        }
    }

    //
    // 属性的setter生成器
    //
    public class PropertySetterGenerator : PropertyGenerator
    {
        public static string WrapName(PropertyField propertyField)
        {
            if (propertyField.readOnly) return "null";
            string name = propertyField.name + "Setter" + (propertyField.isStatic ? "_S" : "");
            return CodeObfuscation.HashName(name);
        }
        public PropertySetterGenerator(BindType bindType, PropertyField propertyField, CodeStringBuilder codeBuilder) : base(bindType, propertyField, WrapName(propertyField), codeBuilder)
        {
            this.isPropertySetter = !propertyField.isStatic;
        }

        protected override void GenerateMethodDefine()
        {
            if (propertyField.isStatic) // 静态属性和方法的定义相同，由基类来处理
            {
                base.GenerateMethodDefine();
                return;
            }
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]");
            codeBuilder.AppendFormatLine("public static bool {0}(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {{", wrapName);
        }

        protected override void GenerateBody()
        {
            var typeInfo = new TypeHelper(propertyField.type);
            var property = ThisObjName + "." + propertyField.name;
            var fromJsArg = getArgFromJsArg(propertyField.type, propertyField.isStatic ? "Native.jvm_get_arg(args, 0)" : "arg");
            if (typeInfo.isAgent) codeBuilder.AppendFormatLine("{0} = ({1}).target;", property, fromJsArg);
            else codeBuilder.AppendFormatLine("{0} = {1};", property, fromJsArg);
            codeBuilder.AppendLine(propertyField.isStatic ? "return IntPtr.Zero;" : "return true;");
        }
    }

    //
    // wrapper总入口类
    //
    public class WrapperGenerator
    {
        [MenuItem("Uts/Generate Wrap Files", false, 1)]
        public static void Wrapping()
        {
            Generate();
            Debug.Log("completed!");
        }

        [MenuItem("Uts/Clear Wrap Files", false, 1)]
        public static void Clear()
        {
            ClearWrapFiles();
            Debug.Log("completed!");
        }

        public static void Generate(int randomSeed = 0)
        {
            CodeObfuscation.randomSeed = randomSeed;

            // 删除已有的所有wrap.cs
            ClearWrapFiles();
            // 生成所有wrap文件
            GenerateAllWrapFiles();
            // 生成Registers.cs
            GenerateRegistersFile();
            // 生成TS的uts.d.ts
            GenerateTsDeclareFile();
        }

        private static void ClearWrapFiles()
        {
            if (!Directory.Exists(Config.wrapsPath)) Directory.CreateDirectory(Config.wrapsPath);
            var files = Directory.GetFiles(Config.wrapsPath, "*.cs");
            foreach (var f in files)
                File.Delete(f);
            // 写个空的Registers.cs，防止报错
            File.WriteAllText(Config.wrapsPath + "Registers.cs", "using System; namespace Uts { public class Registers { public static void Register(IntPtr env) { } } }");
        }

        private static void GenerateAllWrapFiles()
        {
            foreach (var bindType in WrapFiles.binds)
            {
                TypeHelper.currentTsModuleName = bindType.tsModuleName;
                if (WrapFiles.structObjects.ContainsKey(bindType.typeInfo.typeName)) continue;
                Generate(bindType);
            }
        }

        //生成某个cs对象的wrap文件
        private static void Generate(BindType bindType)
        {
            CodeStringBuilder codeBuilder = new CodeStringBuilder();
            codeBuilder.AppendLine("using System;");
            codeBuilder.AppendLine("using System.Collections.Generic;");
            codeBuilder.AppendLine("using UnityEngine;");
            codeBuilder.AppendLineAndIndent("namespace Uts {");
            codeBuilder.AppendLineAndIndent("public class " + bindType.typeInfo.className + "Wrap {");
            codeBuilder.AppendLine("public static IntPtr jsClass;");

            // 生成构造函数
            new ConstructorGenerator(bindType, bindType.GetMergedConstructor(), codeBuilder).Generate();

            // 生成成员函数
            GenerateMethods(bindType, codeBuilder);

            // 生成字段或属性
            GenerateProperties(bindType, codeBuilder);

            // 生成GetType方法
            GenerateGetTypeMethod(bindType, codeBuilder);

            // 生成Register方法
            GenerateRegisterMethod(bindType, codeBuilder);

            codeBuilder.UnindentAndAppendLine("}");
            codeBuilder.UnindentAndAppendLine("}");

            File.WriteAllText(Config.wrapsPath + bindType.typeInfo.className + "Wrap.cs", codeBuilder.ToString());
        }

        private static void GenerateMethods(BindType bindType, CodeStringBuilder codeBuilder)
        {
            List<Method> methods = bindType.GetMergedMethods();

            int[] randIdxs = CodeObfuscation.RandomArrayIndexs(methods.Count);
            for (int i = 0; i < randIdxs.Length; i++)
            {
                int methodIdx = randIdxs[i];
                new MethodGenerator(bindType, methods[methodIdx], codeBuilder).Generate();
            }
        }

        private static void GenerateProperties(BindType bindType, CodeStringBuilder codeBuilder)
        {
            List<PropertyField> properties = bindType.GetMergedProperties();
            int[] randIdxs = CodeObfuscation.RandomArrayIndexs(properties.Count);
            for (int i = 0; i < randIdxs.Length; i++)
            {
                int propertyIdx = randIdxs[i];
                new PropertyGetterGenerator(bindType, properties[propertyIdx], codeBuilder).Generate();
                if (!properties[propertyIdx].readOnly) new PropertySetterGenerator(bindType, properties[propertyIdx], codeBuilder).Generate();
            }
        }

        // 生成 GetType_S 方法
        private static void GenerateGetTypeMethod(BindType bindType, CodeStringBuilder codeBuilder)
        {
            if (bindType.type == typeof(Type)) return;
            codeBuilder.AppendLine("[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]");
            codeBuilder.AppendLineAndIndent("public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {");
            codeBuilder.AppendTry();
            codeBuilder.AppendFormatLine("Type csType = typeof({0});", bindType.typeInfo.typeName);
            codeBuilder.AppendLine("return MakeJsObjects.MakeJsObject(context, csType);");
            codeBuilder.AppendCatch(false);
            codeBuilder.UnindentAndAppendLine("}");
            codeBuilder.AppendLine("");
        }

        // 生成 Register 方法
        private static void GenerateRegisterMethod(BindType bindType, CodeStringBuilder codeBuilder)
        {
            codeBuilder.AppendLineAndIndent("static public void Register(IntPtr env) {");

            codeBuilder.AppendFormatLine("Native.jvm_reg_class_start(env);");

            // 属性注册
            List<PropertyField> properties = bindType.GetMergedProperties();
            foreach (var p in properties)
            {
                codeBuilder.AppendFormatLine("Native.jvm_reg_{0}property(env, \"{1}\", {2}, {3});", p.isStatic ? "static_" : "", p.name, PropertyGetterGenerator.WrapName(p), PropertySetterGenerator.WrapName(p));
            }

            // 方法注册
            List<Method> methods = bindType.GetMergedMethods();
            foreach (var m in methods)
            {
                codeBuilder.AppendFormatLine("Native.jvm_reg_{0}function(env, \"{1}\", {2});", m.isStatic ? "static_" : "", m.name, MethodGenerator.WrapName(m));
            }

            // GetType方法注册
            if (bindType.type != typeof(Type)) codeBuilder.AppendLine("Native.jvm_reg_static_function(env, \"GetType\", GetType_S);");


            codeBuilder.AppendFormatLine("jsClass = Native.jvm_reg_class_end(env, \"{0}\", {1}, {2}, ObjectsMgr.dtor);", bindType.GetTsClassName(), TypeHelper.GetBaseJsClassName(bindType.type), bindType.hasConstructor ? "ctor" : "null");

            // 注册当前type对应的jsClass
            codeBuilder.AppendFormatLine("RegHelper.RegisterJsClass(typeof({0}), jsClass);", bindType.typeInfo.typeName);

            codeBuilder.UnindentAndAppendLine("}");
        }

        // 生成Registers.cs
        private static void GenerateRegistersFile()
        {
            CodeStringBuilder codeBuilder = new CodeStringBuilder();
            codeBuilder.AppendLine("using System;");
            codeBuilder.AppendLineAndIndent("namespace Uts {");
            codeBuilder.AppendLineAndIndent("public class Registers {");
            codeBuilder.AppendLineAndIndent("public static void Register(IntPtr env) {");
            codeBuilder.AppendLine("Native.jvm_reg_start(env);");

            // 注册所有需要导出的类
            Dictionary<string, List<BindType>> clss = new Dictionary<string, List<BindType>>(); // pair(key:modulename, value:classList)
            foreach (var bindType in WrapFiles.binds)
            {
                if (WrapFiles.structObjects.ContainsKey(bindType.typeInfo.typeName)) continue;
                if (!clss.ContainsKey(bindType.tsModuleName)) clss[bindType.tsModuleName] = new List<BindType>();
                clss[bindType.tsModuleName].Add(bindType);
            }
            foreach (var pair in clss)
            {
                codeBuilder.AppendFormatLine("Native.jvm_reg_mod_start(env, \"{0}\");", pair.Key);
                foreach (var type in pair.Value)
                    codeBuilder.AppendFormatLine("{0}Wrap.Register(env);", type.typeInfo.className);
                codeBuilder.AppendLine("Native.jvm_reg_mod_end(env);");
            }

            // 注册所有用到的enum
            Dictionary<string, List<Type>> enums = new Dictionary<string, List<Type>>(); // pair(key:modulename, value:enumList)
            foreach (var pair in TypeHelper.enumTypeModules)
            {
                if (!enums.ContainsKey(pair.Value)) enums[pair.Value] = new List<Type>();
                enums[pair.Value].Add(pair.Key);
            }
            foreach (var pair in enums)
            {
                codeBuilder.AppendFormatLine("Native.jvm_reg_mod_start(env, \"{0}\");", pair.Key);
                foreach (var type in pair.Value)
                    codeBuilder.AppendFormatLine("RegHelper.RegisteEnum(env, typeof({0}));", TypeHelper.GetTypeName(type));
                codeBuilder.AppendLine("Native.jvm_reg_mod_end(env);");
            }

            codeBuilder.AppendLine("Native.jvm_reg_end(env);");
            codeBuilder.UnindentAndAppendLine("}");
            codeBuilder.UnindentAndAppendLine("}");
            codeBuilder.UnindentAndAppendLine("}");
            File.WriteAllText(Config.wrapsPath + "Registers.cs", codeBuilder.ToString());
        }

        //生成 uts.d.ts
        private static void GenerateTsDeclareFile()
        {
            CodeStringBuilder declareBuilder = new CodeStringBuilder();

            // enum的声明
            Dictionary<string, List<Type>> enums = new Dictionary<string, List<Type>>();
            foreach (var pair in TypeHelper.enumTypeModules)
            {
                if (!enums.ContainsKey(pair.Value)) enums[pair.Value] = new List<Type>();
                enums[pair.Value].Add(pair.Key);
            }
            foreach (var pair in enums)
            {
                declareBuilder.AppendFormatLineAndIndent("declare module {0} {{", pair.Key);
                foreach (var type in pair.Value)
                {
                    declareBuilder.AppendFormatLineAndIndent("export enum {0} {{", type.Name);
                    var members = type.GetFields(System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
                    foreach (var member in members)
                    {
                        declareBuilder.AppendFormatLine("{0}={1},", member.Name, (int)member.GetRawConstantValue());
                    }
                    declareBuilder.UnindentAndAppendLine("}");
                }
                declareBuilder.UnindentAndAppendLine("}");
            }

            // 类的声明
            Dictionary<string, List<BindType>> clss = new Dictionary<string, List<BindType>>();
            foreach (var bindType in WrapFiles.binds)
            {
                if (WrapFiles.structObjects.ContainsKey(bindType.typeInfo.typeName)) continue;
                if (!clss.ContainsKey(bindType.tsModuleName)) clss[bindType.tsModuleName] = new List<BindType>();
                clss[bindType.tsModuleName].Add(bindType);
            }
            foreach (var pair in clss)
            {
                declareBuilder.AppendFormatLineAndIndent("declare module {0} {{", pair.Key);
                foreach (var bindType in pair.Value)
                {
                    string baseClassName = TsDeclareHelper.GetBaseClassName(bindType);
                    if (baseClassName != "") baseClassName = "extends " + baseClassName;
                    declareBuilder.AppendFormatLineAndIndent("export class {0} {1} {{", bindType.GetTsClassName(), baseClassName);

                    // 构造函数声明
                    MethodBase[] ctors = bindType.GetConstructors();
                    foreach (var ctor in ctors)
                        declareBuilder.AppendFormatLine("constructor({0});", new ParametersHelper(pair.Key, "ctor", ctor.GetParameters(), typeof(void)).tsCallArgsDeclare);

                    // 属性声明
                    List<PropertyField> properties = bindType.GetMergedProperties();
                    foreach (var p in properties)
                        declareBuilder.AppendFormatLine("{0}{1}{2}: {3};", p.isStatic ? "static " : "", p.readOnly ? "readonly " : "", p.name, TsDeclareHelper.GetClassName(bindType.tsModuleName, p.type));

                    // 方法声明
                    MethodInfo[] methods = bindType.GetMethods();
                    foreach (var method in methods)
                    {
                        var parameterInfo = new ParametersHelper(pair.Key, method.Name, method.GetParameters(), method.ReturnType);
                        declareBuilder.AppendFormatLine("{0}{1}({2}): {3};", method.IsStatic ? "static " : "", method.Name, parameterInfo.tsCallArgsDeclare, parameterInfo.tsReturnsTypesDeclare);
                    }

                    // GetType方法声明
                    if (bindType.type != typeof(Type)) declareBuilder.AppendLine("static GetType() : UnityEngine.Type;");

                    declareBuilder.UnindentAndAppendLine("}");
                }
                declareBuilder.UnindentAndAppendLine("}");
            }

            File.WriteAllText(Config.utsDeclarePath + "uts.d.ts", declareBuilder.ToString());
        }
    }
}

#endif //UNITY_EDITOR
