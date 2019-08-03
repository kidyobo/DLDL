using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
public delegate GameObject UITextDelegate(string name);
/// <summary>
/// 富文本扩展
/// </summary>
public class UIText : Text
{
    /// <summary>
    /// 是否需要重构图片
    /// </summary>
    [DonotWrap]
    public bool needRebuildTexture
    {
        private set;
        get;
    }
    private bool isBuilding = false;
    /// <summary>
    /// 是否需要重构文字
    /// </summary>
    [DonotWrap]
    public bool needRebuildText
    {
        private set;
        get;
    }
    /// <summary>
    /// 高度
    /// </summary>
    public override float preferredHeight
    {
        get
        {
            return height;
        }
    }
    /// <summary>
    /// 宽度
    /// </summary>
    public override float preferredWidth
    {
        get
        {
            return width;
        }
    }

    public float renderWidth
    {
        private set;
        get;
    }

    public float renderHeight
    {
        get
        {
            return height;
        }
    }
    /// <summary>
    /// 保存的所有图片集合
    /// </summary>
    List<LineObject> textures = new List<LineObject>();
    /// <summary>
    /// 保存的所有行数据
    /// </summary>
    List<List<LineObject>> lineList = new List<List<LineObject>>();
    /// <summary>
    /// 真实的高度
    /// </summary>
    float height;
    /// <summary>
    /// 真实的宽度
    /// </summary>
    float width;
    public UITextAltas altas = null;
    protected override void OnDisable()
    {
        base.OnDisable();
        if (!this.enabled)
        {
            var transform = this.transform;
            int count = transform.childCount - 1;
            for (int i = count; i >= 0; i--)
            {
                var go = transform.GetChild(i).gameObject;
#if UNITY_EDITOR
                if (Application.isPlaying)
                {
                    GameObject.Destroy(go);
                }
                else
                {
                    GameObject.DestroyImmediate(go);
                }
#else
                GameObject.Destroy(go);
#endif
            }
        }
    }

    protected override void OnPopulateMesh(VertexHelper toFill)
    {
        if (font == null)
        {
            return;
        }
        if (isBuilding)
        {
            needRebuildText = true;
            return;
        }

        isBuilding = true;
        ProcessText();
        if (needRebuildText == true)
        {
            ProcessText();
        }
        isBuilding = false;

        needRebuildTexture = true;
        this.Invoke("LateProcess", 0);

#if UNITY_EDITOR
        UnityEditor.EditorUtility.SetDirty(this);
#endif

        toFill.Clear();
        int count = lineList.Count;
        for (int i = 0; i < count; i++)
        {
            List<LineObject> line = lineList[i];
            int size = line.Count;
            for (int j = 0; j < size; j++)
            {
                LineObject obj = line[j];
                if (obj.font)
                {
                    toFill.AddUIVertexQuad(obj.verts);
                    if (obj.effects != null)
                    {
                        toFill.AddUIVertexQuad(obj.effects);
                    }
                }
            }
        }
    }

    public void ProcessText()
    {
        needRebuildText = false;
        lineList.Clear();
        textures.Clear();
        if (font == null)
        {
            return;
        }
        List<LineObject> lineData = new List<LineObject>();
        List<float> lineWidthData = new List<float>();

        var horizontalOverflow = this.horizontalOverflow;
        var verticalOverflow = this.verticalOverflow;
        float lineSpacing = this.lineSpacing;
        float lineOffset = 0;
        var rect = rectTransform.rect;
        float x = 0;
        float y = 0;
        var fontSize = this.fontSize;
        if (font.dynamic)
        {
            y = fontSize;
            lineSpacing = fontSize * lineSpacing;
        }
        else
        {
            y = font.fontSize;
            lineSpacing = font.lineHeight * lineSpacing;
        }
        List<Color> nextColorList = new List<Color>(5);
        var fontStyle = this.fontStyle;
        FontStyle style = fontStyle;
        bool endParse = false;
        int sub = 0;
        bool bold = false;
        bool italic = false;
        bool underline = false;
        bool strikethrough = false;
        bool ignoreColor = false;
        for (int i = 0, textLength = text.Length; i < textLength; i++)
        {
            char c = text[i];
            if (supportRichText && !endParse && ParseSymbol(text, ref i, color, ref nextColorList, ref endParse, ref sub, ref bold, ref italic, ref underline, ref strikethrough, ref ignoreColor))
            {
                --i;
                continue;
            }
            var nextColor = nextColorList.Count > 0 ? nextColorList[nextColorList.Count - 1] : color;
            if (c == '\n' || c == '\t')
            {
                y += lineOffset + lineSpacing;
                if (verticalOverflow == VerticalWrapMode.Truncate)
                {
                    if (y > rect.height)
                    {
                        y -= lineOffset + lineSpacing;
                        break;
                    }
                }
                lineList.Add(lineData);
                lineData = new List<LineObject>();
                lineWidthData.Add(x);
                x = 0;
                lineOffset = 0;
                continue;
            }
            GameObject symbol = null;
            if (!endParse && supportRichText) symbol = MatchSymbol(text, ref i, textLength);
            if (symbol != null)
            {
                RectTransform symbolRect = symbol.GetComponent<RectTransform>();
                float symbolWidth = symbolRect.rect.width;
                float symbolHeight = symbolRect.rect.height;
                if (horizontalOverflow == HorizontalWrapMode.Wrap)
                {
                    if (x > rect.width - symbolWidth)
                    {
                        y += lineOffset + lineSpacing;
                        if (verticalOverflow == VerticalWrapMode.Truncate)
                        {
                            if (y > rect.height)
                            {
                                y -= lineOffset + lineSpacing;
                                break;
                            }
                        }
                        lineList.Add(lineData);
                        lineData = new List<LineObject>();
                        lineWidthData.Add(x);
                        x = 0;
                        lineOffset = 0;
                    }
                }

                if (symbolHeight - fontSize > lineOffset)
                {
                    lineOffset = symbolHeight - fontSize;
                    for (int z = 0, length = lineData.Count; z < length; z++)
                    {
                        lineData[z].yOffset = lineOffset;
                    }
                }
                LineObject lineChild = new LineObject();
                lineChild.font = false;
                lineChild.index = i;
                lineChild.yOffset = lineOffset;
                lineChild.x = x;
                lineChild.y = y;
                lineChild.width = symbolWidth;
                lineChild.height = symbolHeight;
                lineChild.gameObject = symbol;
                lineData.Add(lineChild);
                x += symbolWidth;
            }
            else
            {
                if (bold && italic)
                {
                    style = FontStyle.BoldAndItalic;
                }
                else if (bold)
                {
                    if (fontStyle == FontStyle.Italic)
                    {
                        style = FontStyle.BoldAndItalic;
                    }
                    else
                    {
                        style = FontStyle.Bold;
                    }
                }
                else if (italic)
                {
                    if (fontStyle == FontStyle.Bold)
                    {
                        style = FontStyle.BoldAndItalic;
                    }
                    else
                    {
                        style = FontStyle.Italic;
                    }
                }
                else
                {
                    style = fontStyle;
                }
                CharacterInfo info;
                GetCharInfo(c, style, out info);
                if (horizontalOverflow == HorizontalWrapMode.Wrap)
                {
                    if (x > rect.width - info.advance)
                    {
                        y += lineOffset + lineSpacing;
                        if (verticalOverflow == VerticalWrapMode.Truncate)
                        {
                            if (y > rect.height)
                            {
                                y -= lineOffset + lineSpacing;
                                break;
                            }
                        }
                        lineList.Add(lineData);
                        lineData = new List<LineObject>();
                        lineWidthData.Add(x);
                        x = 0;
                        lineOffset = 0;
                    }
                }

                List<UIVertex> list = new List<UIVertex>();
                UIVertex v1 = UIVertex.simpleVert;
                v1.position = new Vector3(info.minX, info.minY, 0);
                v1.uv0 = info.uvBottomLeft;
                v1.color = nextColor;

                UIVertex v2 = UIVertex.simpleVert;
                v2.position = new Vector3(info.glyphWidth + info.minX, info.minY, 0);
                v2.uv0 = info.uvBottomRight;
                v2.color = nextColor;

                UIVertex v3 = UIVertex.simpleVert;
                v3.position = new Vector3(info.glyphWidth + info.minX, info.glyphHeight + info.minY, 0);
                v3.uv0 = info.uvTopRight;
                v3.color = nextColor;

                UIVertex v4 = UIVertex.simpleVert;
                v4.position = new Vector3(info.minX, info.glyphHeight + info.minY, 0);
                v4.uv0 = info.uvTopLeft;
                v4.color = nextColor;
                list.Add(v1);
                list.Add(v2);
                list.Add(v3);
                list.Add(v4);
                LineObject lineChild = new LineObject();
                lineChild.font = true;
                lineChild.index = i;
                lineChild.x = x;
                lineChild.y = y;
                lineChild.yOffset = lineOffset;
                lineChild.width = info.glyphWidth;
                lineChild.height = info.glyphHeight;
                lineChild.verts = list.ToArray();

                if (underline || strikethrough)
                {
                    CharacterInfo lineInfo;
                    if (underline)
                    {
                        GetCharInfo('_', style, out lineInfo);
                    }
                    else
                    {
                        GetCharInfo('-', style, out lineInfo);
                    }

                    Vector2 center = (lineInfo.uvBottomLeft + lineInfo.uvTopRight) / 2;
                    list = new List<UIVertex>();
                    v1 = UIVertex.simpleVert;
                    v1.position = new Vector3(lineInfo.minX, lineInfo.minY, 0);
                    v1.color = nextColor;
                    v1.uv0 = center;

                    v2 = UIVertex.simpleVert;
                    v2.position = new Vector3(info.advance + lineInfo.minX, lineInfo.minY, 0);
                    v2.color = nextColor;
                    v2.uv0 = center;

                    v3 = UIVertex.simpleVert;
                    v3.position = new Vector3(info.advance + lineInfo.minX, lineInfo.glyphHeight / 2 + lineInfo.minY, 0);
                    v3.color = nextColor;
                    v3.uv0 = center;

                    v4 = UIVertex.simpleVert;
                    v4.position = new Vector3(lineInfo.minX, lineInfo.glyphHeight / 2 + lineInfo.minY, 0);
                    v4.color = nextColor;
                    v4.uv0 = center;
                    list.Add(v1);
                    list.Add(v2);
                    list.Add(v3);
                    list.Add(v4);
                    lineChild.effects = list.ToArray();
                }
                lineData.Add(lineChild);
                x += info.advance;
            }
        }
        if (x > 0)
        {
            bool add = true;
            if (verticalOverflow == VerticalWrapMode.Truncate)
            {
                if (y + lineOffset > rect.height)
                {
                    add = false;
                }
            }
            if (add)
            {
                lineList.Add(lineData);
                lineWidthData.Add(x);
            }
        }
        if (horizontalOverflow == HorizontalWrapMode.Wrap)
        {
            width = rect.width;
        }
        else
        {
            width = x;
        }

        height = y + lineOffset;

        if (lineList.Count > 1)
        {
            renderWidth = width;
        }
        else
        {
            renderWidth = x;
        }
        //
        var alignment = (int)this.alignment;
        var alignH = alignment % 3;
        var alignV = alignment / 3;
        float drawX = rect.x;
        float drawY = rect.y + rect.height * (rectTransform.pivot.y * 2 - 1f);
        var offsetY = 0f;
        if (alignV == 0)
        {
            offsetY = 0;
        }
        else if (alignV == 1)
        {
            offsetY = (rect.height - height) / 2;
        }
        else
        {
            offsetY = rect.height - height;
        }
        int count = lineList.Count;
        for (int i = 0; i < count; i++)
        {
            List<LineObject> line = lineList[i];
            int size = line.Count;
            var width = lineWidthData[i];
            var offsetX = 0f;
            if (alignH == 0)
            {
                offsetX = 0;
            }
            else if (alignH == 1)
            {
                offsetX = (rect.width - width) / 2;
            }
            else
            {
                offsetX = rect.width - width;
            }
            for (int j = 0; j < size; j++)
            {
                LineObject obj = line[j];
                obj.x += drawX + offsetX;
                obj.y += drawY + offsetY + obj.yOffset;
                obj.y = -obj.y;
                if (obj.font)
                {
                    for (int z = 0, vertLength = obj.verts.Length; z < vertLength; z++)
                    {
                        obj.verts[z].position.y += obj.y;
                        obj.verts[z].position.x += obj.x;
                    }
                    if (obj.effects != null)
                    {
                        for (int z = 0, vertLength = obj.effects.Length; z < vertLength; z++)
                        {
                            obj.effects[z].position.y += obj.y;
                            obj.effects[z].position.x += obj.x;
                        }
                    }
                }
                else
                {
                    textures.Add(obj);
                }

            }
        }
    }
    void LateProcess()
    {
        if (!needRebuildTexture)
        {
            return;
        }
        needRebuildTexture = false;
        var transform = this.transform;
        int count = transform.childCount - 1;
        for (int i = count; i >= 0; i--)
        {
            var go = transform.GetChild(i).gameObject;
#if UNITY_EDITOR
            if (Application.isPlaying)
            {
                GameObject.Destroy(go);
            }
            else
            {
                GameObject.DestroyImmediate(go);
            }
#else
            GameObject.Destroy(go);
#endif
        }
        int texCount = textures.Count;
        for (int i = 0; i < texCount; i++)
        {
            LineObject tex = textures[i];
            GameObject go = GameObject.Instantiate(tex.gameObject);
            go.transform.SetParent(transform, false);
            go.transform.localPosition = new Vector3(tex.x, tex.y);
            go.SetActive(true);
        }
    }

    void GetCharInfo(char c, FontStyle style, out CharacterInfo info)
    {
        if (font.dynamic)
        {
            font.RequestCharactersInTexture(c + "", fontSize, style);
            font.GetCharacterInfo(c, out info, fontSize, style);
        }
        else
        {
            font.GetCharacterInfo(c, out info);
        }
    }

    /// <summary>
    /// 根据屏幕坐标获取位置
    /// </summary>
    /// <param name="pos">屏幕坐标</param>
    /// <returns>url</returns>
    public string GetUrlAtPosition(Vector2 pos)
    {
        if (string.IsNullOrEmpty(m_Text)) return null;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(rectTransform, pos, canvas.worldCamera, out pos);
        int characterIndex = GetExactCharacterIndex(pos);
        if (characterIndex != -1 && characterIndex < m_Text.Length)
        {
            int linkStart;

            // LastIndexOf() fails if the string happens to begin with the expected text
            if (m_Text[characterIndex] == '[' &&
                m_Text[characterIndex + 1] == 'u' &&
                m_Text[characterIndex + 2] == 'r' &&
                m_Text[characterIndex + 3] == 'l' &&
                m_Text[characterIndex + 4] == '=')
            {
                linkStart = characterIndex;
            }
            else linkStart = m_Text.LastIndexOf("[url=", characterIndex);

            if (linkStart == -1) return null;

            linkStart += 5;
            int linkEnd = m_Text.IndexOf("]", linkStart);
            if (linkEnd == -1) return null;

            int urlEnd = m_Text.IndexOf("[/url]", linkEnd);
            if (urlEnd == -1 || characterIndex <= urlEnd)
                return m_Text.Substring(linkStart, linkEnd - linkStart);
        }
        return null;
    }

    int GetExactCharacterIndex(Vector3 pos)
    {
        int count = lineList.Count;
        for (int i = 0; i < count; i++)
        {
            List<LineObject> line = lineList[i];
            int size = line.Count;
            for (int j = 0; j < size; j++)
            {
                LineObject obj = line[j];
                float x0 = obj.x;
                if (pos.x < x0) continue;
                float x1 = obj.x + obj.width;
                if (pos.x > x1) continue;
                float y0 = obj.y;
                if (pos.y < y0) continue;
                float y1 = obj.y + obj.height;
                if (pos.y > y1) continue;
                return obj.index;
            }
        }
        return -1;
    }

    GameObject MatchSymbol(string text, ref int offset, int textLength)
    {
        if (altas == null)
            return null;
        var matchNames = altas.GetMatchNames();
        int count = matchNames.Length;
        textLength -= offset;
        for (int i = 0; i < count; ++i)
        {
            string name = matchNames[i];
            int nameLength = name.Length;
            if (nameLength == 0 || textLength < nameLength) continue;
            bool match = true;
            for (int c = 0; c < nameLength; ++c)
            {
                if (text[offset + c] != name[c])
                {
                    match = false;
                    break;
                }
            }

            // Match found
            if (match)
            {
                offset += nameLength - 1;
                return altas.onMatch(name);
            }
        }
        return null;
    }
    static bool ParseSymbol(string text, ref int index, Color nomalColor,ref List<Color> nextColor, ref bool endParse,
ref int sub, ref bool bold, ref bool italic, ref bool underline, ref bool strike, ref bool ignoreColor)
    {
        int length = text.Length;

        if (index + 3 > length || text[index] != '[') return false;

        if (text[index + 2] == ']')
        {
            if (text[index + 1] == '-')
            {
                if (nextColor.Count > 0)
                {
                    nextColor.RemoveAt(nextColor.Count - 1);
                }
                index += 3;
                return true;
            }

            string sub3 = text.Substring(index, 3);

            switch (sub3)
            {
                case "[b]":
                    bold = true;
                    index += 3;
                    return true;

                case "[i]":
                    italic = true;
                    index += 3;
                    return true;

                case "[u]":
                    underline = true;
                    index += 3;
                    return true;

                case "[s]":
                    strike = true;
                    index += 3;
                    return true;

                case "[c]":
                    ignoreColor = true;
                    index += 3;
                    return true;
            }
        }

        if (index + 4 > length) return false;

        if (text[index + 3] == ']')
        {
            string sub4 = text.Substring(index, 4);

            switch (sub4)
            {
                case "[/b]":
                    bold = false;
                    index += 4;
                    return true;

                case "[/i]":
                    italic = false;
                    index += 4;
                    return true;

                case "[/u]":
                    underline = false;
                    index += 4;
                    return true;

                case "[/s]":
                    strike = false;
                    index += 4;
                    return true;

                case "[/c]":
                    ignoreColor = false;
                    index += 4;
                    return true;

                default:
                    {
                        char ch0 = text[index + 1];
                        char ch1 = text[index + 2];

                        if (IsHex(ch0) && IsHex(ch1))
                        {
                            //int a = (HexToDecimal(ch0) << 4) | HexToDecimal(ch1);
                            //mAlpha = a / 255f;
                            index += 4;
                            return true;
                        }
                    }
                    break;
            }
        }

        if (index + 5 > length) return false;

        if (text[index + 4] == ']')
        {
            string sub5 = text.Substring(index, 5);

            switch (sub5)
            {
                case "[sub]":
                    sub = 1;
                    index += 5;
                    return true;

                case "[sup]":
                    sub = 2;
                    index += 5;
                    return true;
                case "[end]":
                    endParse = true;
                    index += 5;
                    return true;
            }
        }

        if (index + 6 > length) return false;

        if (text[index + 5] == ']')
        {
            string sub6 = text.Substring(index, 6);

            switch (sub6)
            {
                case "[/sub]":
                    sub = 0;
                    index += 6;
                    return true;

                case "[/sup]":
                    sub = 0;
                    index += 6;
                    return true;

                case "[/url]":
                    index += 6;
                    return true;
            }
        }

        if (text[index + 1] == 'u' && text[index + 2] == 'r' && text[index + 3] == 'l' && text[index + 4] == '=')
        {
            int closingBracket = text.IndexOf(']', index + 4);

            if (closingBracket != -1)
            {
                index = closingBracket + 1;
                return true;
            }
            else
            {
                index = text.Length;
                return true;
            }
        }

        if (index + 8 > length) return false;

        if (text[index + 7] == ']')
        {
            Color c = ParseColor24(text, index + 1);

            if (EncodeColor24(c) != text.Substring(index + 1, 6).ToUpper())
                return false;
            c.a = nomalColor.a;
            nextColor.Add(c);
            index += 8;
            return true;
        }

        if (index + 10 > length) return false;
        if (text[index + 9] == ']')
        {
            Color c = ParseColor32(text, index + 1);
            if (EncodeColor32(c) != text.Substring(index + 1, 8).ToUpper())
                return false;

            nextColor.Add(c);
            index += 10;
            return true;
        }
        return false;
    }

    static bool IsHex(char ch)
    {
        return (ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') || (ch >= 'A' && ch <= 'F');
    }
    static string EncodeColor24(Color c)
    {
        int i = 0xFFFFFF & (ColorToInt(c) >> 8);
        return DecimalToHex24(i);
    }
    static string EncodeColor32(Color c)
    {
        int i = ColorToInt(c);
        return DecimalToHex32(i);
    }
    static Color ParseColor32(string text, int offset)
    {
        int r = (HexToDecimal(text[offset]) << 4) | HexToDecimal(text[offset + 1]);
        int g = (HexToDecimal(text[offset + 2]) << 4) | HexToDecimal(text[offset + 3]);
        int b = (HexToDecimal(text[offset + 4]) << 4) | HexToDecimal(text[offset + 5]);
        int a = (HexToDecimal(text[offset + 6]) << 4) | HexToDecimal(text[offset + 7]);
        float f = 1f / 255f;
        return new Color(f * r, f * g, f * b, f * a);
    }
    static Color ParseColor24(string text, int offset)
    {
        int r = (HexToDecimal(text[offset]) << 4) | HexToDecimal(text[offset + 1]);
        int g = (HexToDecimal(text[offset + 2]) << 4) | HexToDecimal(text[offset + 3]);
        int b = (HexToDecimal(text[offset + 4]) << 4) | HexToDecimal(text[offset + 5]);
        float f = 1f / 255f;
        return new Color(f * r, f * g, f * b);
    }
    static int ColorToInt(Color c)
    {
        int retVal = 0;
        retVal |= Mathf.RoundToInt(c.r * 255f) << 24;
        retVal |= Mathf.RoundToInt(c.g * 255f) << 16;
        retVal |= Mathf.RoundToInt(c.b * 255f) << 8;
        retVal |= Mathf.RoundToInt(c.a * 255f);
        return retVal;
    }
    static string DecimalToHex8(int num)
    {
        num &= 0xFF;
        return num.ToString("X2");
    }
    static string DecimalToHex24(int num)
    {
        num &= 0xFFFFFF;
        return num.ToString("X6");
    }
    static string DecimalToHex32(int num)
    {
        return num.ToString("X8");
    }
    static int HexToDecimal(char ch)
    {
        switch (ch)
        {
            case '0': return 0x0;
            case '1': return 0x1;
            case '2': return 0x2;
            case '3': return 0x3;
            case '4': return 0x4;
            case '5': return 0x5;
            case '6': return 0x6;
            case '7': return 0x7;
            case '8': return 0x8;
            case '9': return 0x9;
            case 'a':
            case 'A': return 0xA;
            case 'b':
            case 'B': return 0xB;
            case 'c':
            case 'C': return 0xC;
            case 'd':
            case 'D': return 0xD;
            case 'e':
            case 'E': return 0xE;
            case 'f':
            case 'F': return 0xF;
        }
        return 0xF;
    }
    /// <summary>
    /// 每行的单个数据
    /// </summary>
    class LineObject
    {
        public bool font;
        public int index;
        public float x;
        public float y;
        public float width;
        public float height;

        public float yOffset;

        //图片时显示对象
        public GameObject gameObject;

        //文字时显示对象
        public UIVertex[] verts;
        public UIVertex[] effects;
    }
}