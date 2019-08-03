using System;
using System.IO;
using System.Text;

namespace Uts
{
    public class InnerFunWrap
    {
        static string requireCode = @"
/** for amd, single js file*/
var define;
(function () {
  var mods_define = {};
  var _define = function(id, deps, factory) {
    mods_define[id] = {deps: deps, factory: factory};
    _define.used = true;
  };
  
  var mods = {};
  var _require = function(id) {
    var mod = mods[id];
    if (!mod) {
      mod = {exports:{}};
      mods[id] = mod;
      var def = mods_define[id];
      if (!def) {
        return mod.exports;
      }
      
      var deps_args = [_require, mod.exports];
      for ( var i=2, n=def.deps.length; i<n; i++ ) {
        var dep_id = def.deps[i];
        deps_args.push(_require(dep_id));
      }
      def.factory.apply(def.factory, deps_args);
      delete mods_define[id];
    }
    return mod.exports;
  };

  define = _define;
  define.require = _require
})();

/** for commonjs, muti js files*/
var require;
(function () {
  var modules = {};
  var pathstacks = [];
  
  var combine_path = function (basePath, curPath) {
      if (!basePath)
          return curPath;
      if (curPath.indexOf('.') != 0)
          return curPath;
      var curPaths = curPath.split('/');
      var fullPaths = basePath.split('/');
      fullPaths.pop(); // pop file name
      for (var i = 0; i<curPaths.length; i++) {
          var c = curPaths[i];
          if (c == '..')
              fullPaths.pop();
          else if (c != '.')
              fullPaths.push(curPaths[i]);
      }
      return fullPaths.join('/');
  };
  
  require= function (path) {
    var basePath = pathstacks[pathstacks.length - 1];
    var fullPath = combine_path(basePath, path);
    var mod = modules[fullPath.toLowerCase()];
    if (!mod) {
        pathstacks.push(fullPath);
        mod = modules[fullPath.toLowerCase()] = __csRequire(fullPath);
        mod.exports = {};
        mod.call(mod, mod, mod.exports);
        pathstacks.pop();
    }
    return mod.exports;
  };
})();
        ";

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr CsRequire_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                string path = Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
                return RequireScript(context, path);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr BugReport_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                string msg = Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
                BugReport.Report(msg);
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr IsCsObject_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                return Native.jvm_make_boolean(context, ObjectsMgr.ExistCsObject(Native.jvm_get_arg(args, 0)));
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr Format_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                if (argcnt == 0)
                    return IntPtr.Zero;
                string fmt = Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
                if (argcnt == 1)
                {
                    Native.jvm_make_string(context, fmt);
                }
                object[] objargs = new object[argcnt - 1];
                for (int i = 1; i < argcnt; i++)
                {
                    object a = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, i));
                    if (a == null)
                    {
                        if (Native.jvm_isobject(context, Native.jvm_get_arg(args, i))) a = "<ts:object>";
                        else a = "<null>";
                    }
                    objargs[i - 1] = a;
                }
                string s = String.Format(fmt, objargs);
                return Native.jvm_make_string(context, s);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr ReadAllText_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                string path = Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
                if (!File.Exists(path))
                {
                    return IntPtr.Zero;
                }
                return Native.jvm_make_string(context, File.ReadAllText(path));
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr WriteAllText_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                string path = Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
                string code = Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
                File.WriteAllText(path, code);
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr GetWorkSpace_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                return Native.jvm_make_string(context, Core.workspace);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr Bytes2lstr_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                byte[] bs = ToCsObjects.ToCsObject(context, Native.jvm_get_arg(args, 0)) as byte[];
                if (bs != null)
                {
                    return Native.jvm_make_lstring(context, bs, bs.Length);
                }
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr RegJsGlobalProperty_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                Native.jvm_set_global_property(Core.env.ptr, Native.jvm_tostring(context, Native.jvm_get_arg(args, 0)), Native.jvm_get_arg(args, 1));
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr ParseBjson_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                byte[] buff = ToCsObjects.ToCsObject(context, Native.jvm_get_arg(args, 0)) as byte[];
                return Native.jvm_bjson_parse(context, buff, buff.Length);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr GC_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                Native.jvm_mark_gc(context);
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr ImmGC_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                Native.jvm_immediate_gc(context);
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        static IntPtr Fin_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr expection)
        {
            try
            {
                return IntPtr.Zero;
            }
            catch (Exception e) { return Native.jvm_throwerr(context, expection, e.ToString()); }
        }


        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        public static IntPtr IsJscGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception)
        {
            try
            {
                return Native.jvm_make_boolean(context, true);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        public static IntPtr VersionGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception)
        {
            try
            {
                return Native.jvm_make_number(context, 1);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        public static IntPtr HasBJsonGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception)
        {
            try
            {
                bool has = false;
#if UNITY_ANDROID
                has = true;
#endif
                return Native.jvm_make_boolean(context, has);
            }
            catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
        public static IntPtr Backtrace_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception)
        {
            try
            {
#if UNITY_IOS
                return IntPtr.Zero;
#else 
                return Native.jvm_backtrace(context);
#endif

            }
            catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
        }

        static IntPtr RequireScript(IntPtr context, string path)
        {
            string script = Core.ReadScript(path);
            var builder = new StringBuilder();
            builder.Append("(function(module,exports){");
            builder.AppendLine(script);
            builder.Append("})");
            return Native.jvm_evalstring_s(Core.env.ptr, builder.ToString(), path);
        }
        
        static public void Register(IntPtr env)
        {
            Native.jvm_evalstring_s(env, requireCode, "require.inner");

            Native.jvm_reg_start(env);

            Native.jvm_reg_static_function(env, "__csRequire", CsRequire_S);
            Native.jvm_reg_static_function(env, "__bugReport", BugReport_S);
            Native.jvm_reg_static_function(env, "__is_cs_object", IsCsObject_S);
            Native.jvm_reg_static_function(env, "__format", Format_S);
            Native.jvm_reg_static_function(env, "__read_alltext", ReadAllText_S);
            Native.jvm_reg_static_function(env, "__write_alltext", WriteAllText_S);

            Native.jvm_reg_static_function(env, "__workSpace", GetWorkSpace_S);
            Native.jvm_reg_static_function(env, "__bytes2lstr", Bytes2lstr_S);
            Native.jvm_reg_static_function(env, "__reg_global", RegJsGlobalProperty_S);
            Native.jvm_reg_static_function(env, "__parse_bjson", ParseBjson_S);

            Native.jvm_reg_mod_start(env, "Duktape");
            Native.jvm_reg_static_function(env, "gc", GC_S);
            Native.jvm_reg_static_function(env, "immgc", ImmGC_S);
            Native.jvm_reg_static_function(env, "fin", Fin_S);
            Native.jvm_reg_static_function(env, "backtrace", Backtrace_S);

            Native.jvm_reg_static_property(env, "isJsc", IsJscGetter_S, null);
            Native.jvm_reg_static_property(env, "version", VersionGetter_S, null);
            Native.jvm_reg_static_property(env, "hasBJson", HasBJsonGetter_S, null);
            Native.jvm_reg_mod_end(env);

            Native.jvm_reg_end(env);
        }
    }
}
