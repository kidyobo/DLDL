#if UNITY_EDITOR

using System.Text;

namespace Uts
{
    // 生成代码的辅助字符串构建类
    public class CodeStringBuilder
    {
        private StringBuilder sb = null;
        private string indent = "";
        public CodeStringBuilder()
        {
            sb = new StringBuilder();
        }

        public void Indent()
        {
            this.indent += "\t";
        }

        public void Unindent()
        {
            if (indent == "") return;
            indent = indent.Substring(0, indent.Length - 1);
        }

        public void Append(string value)
        {
            sb.Append(value);
        }

        public void Append(char value)
        {
            sb.Append(value);
        }

        public void AppendLine(string value)
        {
            sb.AppendFormat("{0}{1}\n", indent, value);
        }

        public void AppendFormatLine(string format, params object[] args)
        {
            sb.Append(indent);
            sb.AppendFormat(format, args);
            sb.Append("\n");
        }

        public void AppendTry()
        {
            AppendLine("try {");
            Indent();
        }
        
        public void AppendCatch(bool isPropSetter)
        {
            Unindent();
            if (isPropSetter)
                AppendLine("} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}");
            else
                AppendLine("} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }");
        }

        public override string ToString()
        {
            return sb.ToString();
        }

        public void AppendLineAndIndent(string value)
        {
            AppendLine(value);
            Indent();
        }

        public void UnindentAndAppendLine(string value)
        {
            Unindent();
            AppendLine(value);
        }

        public void AppendFormatLineAndIndent(string format, params object[] args)
        {
            AppendFormatLine(format, args);
            Indent();
        }
    }
}

#endif //UNITY_EDITOR