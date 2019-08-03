using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using System.Collections.Generic;
using System.IO;
using System;
using System.Text.RegularExpressions;

public class UiOperationEditor : EditorWindow
{
    [MenuItem("UI整理/替换资源", false, 2)]
    static void ReplaceImage()
    {
        EditorWindow.GetWindow<UiOperationEditor>(false, "资源操作", true).Show();
    }

    private List<GameObject> objList = null;
    private UnityEngine.Object originalSprite;
    private UnityEngine.Object newSprite;
    private UnityEngine.Object originalTex;
    private UnityEngine.Object newTex;
    private SpriteScalerEditor spriteScaler = new SpriteScalerEditor();
    private UnityEngine.Object sprite;
    private Vector2 logScrollPos = Vector2.zero;
    private string log = "";

    private void OnGUI()
    {
        EditorGUILayout.BeginHorizontal();
        OnCurSelectLinkedImagesGUI();
        OnUnLinkedSpriteAndTextureGUI();
        OnLinkedSpriteUseRawImage();
        EditorGUILayout.EndHorizontal();
        GUILayout.Space(20);

        OnReplaceImageGUI();
        OnReplaceRawimageGUI();
        OnSpriteScalerGUI();
        OnLogGUI();
    }

    private void OnCurSelectLinkedImagesGUI()
    {
        if (GUILayout.Button("输出关联资源"))
        {
            Log("----------------------");
            var curSprite = GetSelectSprite();
            var curText = GetSelectTexture2D();
            Log(curSprite != null ? AssetDatabase.GetAssetPath(curSprite) : AssetDatabase.GetAssetPath(curText));

            var images = GetLinkImages(curSprite);
            foreach (var image in images)
            {
                Log("  " + GetHierarchy(image.gameObject));
            }

            var uguis = GetLinkUGUI(curSprite);
            foreach (var image in uguis)
            {
                Log("  " + GetHierarchy(image.gameObject));
            }

            var rawimages = GetLinkRawImages(curText);
            foreach (var image in rawimages)
            {
                Log("  " + GetHierarchy(image.gameObject));
            }
        }
    }

    private void OnUnLinkedSpriteAndTextureGUI()
    {
        if (GUILayout.Button("删除未用资源"))
        {
            Log("----------------------");
            var files = Builder.FileUtil.GetFiles(Path.Combine(Application.dataPath, "AssetSources\\ui"), @"(\.png|\.jpg|\.tga)$", RegexOptions.IgnoreCase);
            var delfiles = new List<string>();
            foreach (var fullfile in files)
            {
                var file = fullfile.Substring(fullfile.IndexOf("Assets"));
                var objects = AssetDatabase.LoadAllAssetRepresentationsAtPath(file);
                Sprite spt = objects.Length == 1 ? objects[0] as Sprite : null;
                var sptUsed = spt != null && LinkInImages(spt);

                var uguiUsed= spt != null && LinkInUGUI(spt);
                Texture2D tex = AssetDatabase.LoadAssetAtPath<Texture2D>(file);
                var texUsed = tex != null && LinkInRawImages(tex);
                if (!sptUsed && !texUsed&&!uguiUsed)
                {
                    delfiles.Add(file);
                    Log(file.Substring(file.IndexOf("ui")));
                }
            }
            foreach (var file in delfiles)
            {
                File.Delete(file);
            }
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }
    }

    private void OnLinkedSpriteUseRawImage()
    {
        if (GUILayout.Button("输出用RawImage使用Sprite"))
        {
            Log("----------------------");
            var files = Builder.FileUtil.GetFiles(Path.Combine(Application.dataPath, "AssetSources\\ui\\altas"), @"(\.png|\.jpg)$", RegexOptions.IgnoreCase);
            foreach (var fullfile in files)
            {
                var file = fullfile.Substring(fullfile.IndexOf("Assets"));
                Texture2D tex = AssetDatabase.LoadAssetAtPath<Texture2D>(file);
                var rawimages = GetLinkRawImages(tex);
                if (rawimages.Count > 0)
                {
                    Log(file.Substring(file.IndexOf("ui")));
                    foreach (var image in rawimages)
                    {
                        Log("  " + GetHierarchy(image.gameObject));
                    }
                }
            }
        }
    }

    private void OnReplaceImageGUI()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("将", GUILayout.Width(20f));
        originalSprite = EditorGUILayout.ObjectField(originalSprite, typeof(Sprite), false);
        EditorGUILayout.LabelField(" 替换为", GUILayout.Width(50f));
        newSprite = EditorGUILayout.ObjectField(newSprite, typeof(Sprite), false);
        if (GUILayout.Button("Sprite替换", GUILayout.Width(100f)))
        {
            Log("----------------------");
            Log(AssetDatabase.GetAssetPath(originalSprite));
            var images = GetLinkImages(originalSprite as Sprite);
            foreach (var image in images)
            {
                image.sprite = newSprite as Sprite;
                EditorUtility.SetDirty(GetPrefab(image.gameObject));
                Log("  " + GetHierarchy(image.gameObject));
            }
            AssetDatabase.SaveAssets();
        }
        EditorGUILayout.EndHorizontal();
        GUILayout.Space(20);
    }

    private void OnReplaceRawimageGUI()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("将", GUILayout.Width(20f));
        originalTex = EditorGUILayout.ObjectField(originalTex, typeof(Texture2D), false);
        EditorGUILayout.LabelField(" 替换为", GUILayout.Width(50f));
        newTex = EditorGUILayout.ObjectField(newTex, typeof(Texture2D), false);
        if (GUILayout.Button("RawImage替换", GUILayout.Width(100f)))
        {
            Log("----------------------");
            Log(AssetDatabase.GetAssetPath(originalTex));
            var images = GetLinkRawImages(originalTex as Texture2D);
            foreach (var image in images)
            {
                image.texture = newTex as Texture2D;
                EditorUtility.SetDirty(GetPrefab(image.gameObject));
                Log("  " + GetHierarchy(image.gameObject));
            }
            AssetDatabase.SaveAssets();
        }
        EditorGUILayout.EndHorizontal();
        GUILayout.Space(20);
    }

    private void OnSpriteScalerGUI()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("压缩图片", GUILayout.Width(60f));
        sprite = EditorGUILayout.ObjectField(sprite, typeof(Sprite), false, GUILayout.Width(200f));
        EditorGUILayout.EndHorizontal();
        spriteScaler.SetSprite(sprite as Sprite);
        spriteScaler.OnCustomGUI(onScaleOk);
        GUILayout.Space(20);
    }

    private void OnLogGUI()
    {
        logScrollPos = EditorGUILayout.BeginScrollView(logScrollPos, GUILayout.ExpandWidth(true), GUILayout.ExpandHeight(true));
        int pagecount = 5000;
        int count = (log.Length + pagecount - 1) / pagecount;
        for (int i = 0; i < count; i++)
        {
            int startpos = i * pagecount;
            int length = Mathf.Min(pagecount, log.Length - startpos);
            GUILayout.Label(this.log.Substring(startpos, length));
        }
        EditorGUILayout.EndScrollView();
    }

    private void onScaleOk()
    {
        var images = GetLinkImages(sprite as Sprite);
        Log("----------------------");
        string path = AssetDatabase.GetAssetPath(sprite);
        var importer = AssetImporter.GetAtPath(path) as TextureImporter;
        Log(path);
        foreach (var image in images)
        {
            if (importer.spriteBorder.SqrMagnitude() > 0 && image.type != Image.Type.Sliced)
            {
                image.type = Image.Type.Sliced;
                EditorUtility.SetDirty(GetPrefab(image.gameObject));
                Log("  set sliced:" + GetHierarchy(image.gameObject));
            }
        }
        AssetDatabase.SaveAssets();
        Log("压缩完成！");
    }

    private List<GameObject> LoadAllUIPrefabs()
    {
        if (objList == null)
        {
            objList = new List<GameObject>();
            var files = Directory.GetFiles("Assets/AssetSources/ui", "*.prefab", SearchOption.AllDirectories);
            foreach (string file in files)
            {
                string name = file.Replace('\\', '/');
                var obj = AssetDatabase.LoadAssetAtPath<GameObject>(name);
                if (obj != null)
                {
                    objList.Add(obj);
                }
            }
        }
        return objList;
    }
    private List<UGUIAltas> GetLinkUGUI(Sprite sprite, bool searchFirst = false)
    {
        List<GameObject> objList = LoadAllUIPrefabs();

        var imageList = new List<UGUIAltas>();
        foreach (var obj in objList)
        {
            var images = (obj as GameObject).GetComponentsInChildren<UGUIAltas>(true);
            foreach (UGUIAltas image in images)
            {
                if (image.sprites != null && image.sprites.Contains(sprite))
                {
                    imageList.Add(image);
                    if (searchFirst) return imageList;
                }
            }
        }
        return imageList;
    }
    private List<Image> GetLinkImages(Sprite sprite, bool searchFirst = false)
    {
        List<GameObject> objList = LoadAllUIPrefabs();

        var imageList = new List<Image>();
        foreach (var obj in objList)
        {
            var images = (obj as GameObject).GetComponentsInChildren<Image>(true);
            foreach (Image image in images)
            {
                if (image.sprite != null && image.sprite == sprite)
                {
                    imageList.Add(image);
                    if (searchFirst) return imageList;
                }
            }
        }
        return imageList;
    }

    private List<RawImage> GetLinkRawImages(Texture2D texture, bool searchFirst = false)
    {
        List<GameObject> objList = LoadAllUIPrefabs();

        var imageList = new List<RawImage>();
        foreach (var obj in objList)
        {
            var images = (obj as GameObject).GetComponentsInChildren<RawImage>(true);
            foreach (RawImage image in images)
            {
                if (image.texture != null && image.texture == texture)
                {
                    imageList.Add(image);
                    if (searchFirst) return imageList;
                }
            }
        }
        return imageList;
    }

    private bool LinkInUGUI(Sprite sprite)
    {
        return GetLinkUGUI(sprite, true).Count > 0;
    }

    private bool LinkInImages(Sprite sprite)
    {
        return GetLinkImages(sprite, true).Count > 0;
    }

    private bool LinkInRawImages(Texture2D texture)
    {
        return GetLinkRawImages(texture, true).Count > 0;
    }

    private GameObject GetPrefab(GameObject obj)
    {
        while (obj.transform.parent != null)
            obj = obj.transform.parent.gameObject;
        return obj;
    }

    private string GetHierarchy(GameObject obj)
    {
        if (obj == null) return "";
        string path = obj.name;

        while (obj.transform.parent != null)
        {
            obj = obj.transform.parent.gameObject;
            path = obj.name + "/" + path;
        }
        return path;
    }

    private Sprite GetSelectSprite()
    {
        System.Object[] selection = Selection.GetFiltered(typeof(Sprite), SelectionMode.Unfiltered);
        if (selection == null || selection.Length != 1)
        {
            var tex = GetSelectTexture2D();
            if (tex == null) return null;

            string path = AssetDatabase.GetAssetPath(tex);
            var texImporter = AssetImporter.GetAtPath(path) as TextureImporter;
            if (texImporter == null) return null;
            if (texImporter.textureType != TextureImporterType.Sprite) return null;

            var objects = AssetDatabase.LoadAllAssetRepresentationsAtPath(path);
            return objects.Length == 1 ? objects[0] as Sprite : null;
        }
        return selection[0] as Sprite;
    }

    private Texture2D GetSelectTexture2D()
    {
        System.Object[] selection = Selection.GetFiltered(typeof(Texture2D), SelectionMode.Unfiltered);
        if (selection == null || selection.Length != 1)
        {
            return null;
        }
        return selection[0] as Texture2D;
    }

    public void Log(string s)
    {
        log = log + s + "\n";
    }
}


public class SpriteScalerEditor
{
    private Sprite sprite = null;
    private TextureImporter importer = null;
    private EditCommander commander = null;
    private int dstWidth = 0;
    private int dstHeight = 0;

    public void SetSprite(Sprite sprite)
    {
        if (this.sprite == sprite)
            return;
        this.sprite = sprite;
        if (this.sprite == null)
            return;
        string path = AssetDatabase.GetAssetPath(this.sprite);
        importer = AssetImporter.GetAtPath(path) as TextureImporter;
        commander = new EditCommander(importer);
        dstWidth = dstHeight = 0;
    }

    public void OnCustomGUI(Action scaleok)
    {
        if (sprite == null)
            return;

        SetAxisSizeUI("   宽压缩为", ref dstWidth, widthRange);
        SetAxisSizeUI("   高压缩为", ref dstHeight, heightRange);

        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("压缩", GUILayout.MaxWidth(200)))
        {
            commander.Do();
            ScaleTex();
            scaleok();
        }
        GUILayout.Space(5);
        EditorGUI.BeginDisabledGroup(!commander.canUndo);
        if (GUILayout.Button("撤销", GUILayout.MaxWidth(50)))
        {
            commander.Undo();
        }
        EditorGUI.EndDisabledGroup();
        EditorGUILayout.EndHorizontal();
    }

    private void ScaleTex()
    {
        var srcSize = sprite.rect.size;
        var dstSize = new Vector2(dstWidth, dstHeight);
        if (srcSize == dstSize) return;

        try
        {
            bool isReadable = importer.isReadable;
            importer.isReadable = true;
            importer.SaveAndReimport();

            var tex = sprite.texture;
            Color[] texColors = tex.GetPixels(0, 0, (int)srcSize.x, (int)srcSize.y);
            Color[] scaleColors = TexScaler.Scale(texColors, srcSize, dstSize, importer.spriteBorder);

            TextureFormat fmt = tex.format;
            if (tex.format == TextureFormat.DXT1)
            {
                fmt = TextureFormat.RGB24;
            }
            else if (tex.format == TextureFormat.DXT5)
            {
                fmt = TextureFormat.ARGB32;
            }
            var scaleTex = new Texture2D((int)dstSize.x, (int)dstSize.y, fmt, false);
            scaleTex.SetPixels(scaleColors);
            scaleTex.Apply();

            byte[] bytes = scaleTex.EncodeToPNG();
            File.WriteAllBytes(importer.assetPath, bytes);

            importer.isReadable = isReadable;
            importer.SaveAndReimport();
        }
        finally
        {
        }
    }

    private void SetAxisSizeUI(string tile, ref int toAxisSize, Vector2 axisSizeRange)
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField(tile, GUILayout.Width(60));
        int.TryParse(EditorGUILayout.TextField(toAxisSize.ToString(), GUILayout.Width(80)), out toAxisSize);
        toAxisSize = (int)Mathf.Clamp(toAxisSize, axisSizeRange.x, axisSizeRange.y);
        EditorGUILayout.LabelField("(" + (int)axisSizeRange.x + "-" + (int)axisSizeRange.y + ")", GUILayout.Width(100));
        EditorGUILayout.EndHorizontal();
    }

    private Vector2 widthRange
    {
        get
        {
            var sb = importer.spriteBorder;
            return new Vector2(sb.x + sb.z + 4, sprite.rect.size.x);
        }
    }

    private Vector2 heightRange
    {
        get
        {
            var sb = importer.spriteBorder;
            return new Vector2(sb.w + sb.y + 4, sprite.rect.size.y);
        }
    }
}

class TexScaler
{
    public static Color[] Scale(Color[] src, Vector2 srcSize, Vector2 dstSize, Vector4 border)
    {
        int borderleft = (int)border.x;
        int borderright = (int)border.z;
        int bordertop = (int)border.y;
        int borderbottom = (int)border.w;

        int srcw = (int)srcSize.x;
        int srch = (int)srcSize.y;
        int dstw = (int)dstSize.x;
        int dsth = (int)dstSize.y;

        float scalew = (srcw - borderleft - borderright) / (float)(dstw - borderleft - borderright);
        float scaleh = (srch - bordertop - borderbottom) / (float)(dsth - bordertop - borderbottom);
        Color[] dst = new Color[dstw * dsth];
        for (int dsty = 0; dsty < dsth; dsty++)
        {
            int srcy = 0;
            if (dsty < bordertop)
            {
                srcy = dsty;
            }
            else if (dsty >= (dsth - borderbottom))
            {
                srcy = (int)(dsty - (dsth - borderbottom)) + (srch - borderbottom);
            }
            else
            {
                srcy = (int)(bordertop + (dsty - bordertop) * scaleh);
            }

            for (int dstx = 0; dstx < dstw; dstx++)
            {
                int srcx = 0;
                if (dstx < borderleft)
                {
                    srcx = dstx;
                }
                else if (dstx >= (dstw - borderright))
                {
                    srcx = (int)(dstx - (dstw - borderright)) + (srcw - borderright);
                }
                else
                {
                    srcx = (int)(borderleft + (dstx - borderleft) * scalew);
                }
                dst[dsty * dstw + dstx] = src[srcy * srcw + srcx];
            }
        }
        return dst;
    }
}

class EditCommander
{
    public bool canUndo { get; private set; }
    private const int steps = 32;
    private TextureImporter importer;
    private string ext = ".bak";
    public EditCommander(TextureImporter importer)
    {
        this.importer = importer;
        SetCanUndo();
    }
    public void Do()
    {
        string dir = cacheDir;
        if (!Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }
        if (File.Exists(backPath))
        {
            File.Delete(backPath);
        }

        for (int i = steps - 1; i >= 0; i--)
        {
            string srcpath = Path.Combine(dir, i + ext);
            string dstpath = Path.Combine(dir, (i + 1) + ext);
            if (File.Exists(srcpath))
            {
                File.Move(srcpath, dstpath);
            }
        }

        File.Copy(importer.assetPath, topPath, true);
        SetCanUndo();
    }
    public void Undo()
    {
        if (!File.Exists(topPath))
        {
            return;
        }
        File.Copy(topPath, importer.assetPath, true);
        File.Delete(topPath);
        string dir = cacheDir;
        for (int i = 0; i < steps; i++)
        {
            string srcpath = Path.Combine(dir, (i + 1) + ext);
            string dstath = Path.Combine(dir, i + ext);
            if (File.Exists(srcpath))
            {
                File.Move(srcpath, dstath);
            }
        }
        importer.SaveAndReimport();
        SetCanUndo();
    }
    private string cacheDir
    {
        get
        {
            string guid = AssetDatabase.AssetPathToGUID(importer.assetPath);
            return Path.Combine(Application.dataPath, "../Library/SpriteScale/" + guid + "/");
        }
    }
    private string topPath
    {
        get { return Path.Combine(cacheDir, "0" + ext); }
    }
    private string backPath
    {
        get { return Path.Combine(cacheDir, steps + ext); }
    }
    private void SetCanUndo()
    {
        canUndo = File.Exists(topPath);
    }


    [MenuItem("UI整理/选中路径")]
    static void OutputSelection()
    {
        UnityEngine.Object[] selectFiles = Selection.objects;
        List<string> filePaths = new List<string>();
        foreach (UnityEngine.Object f in selectFiles)
        {
            string filePath = AssetDatabase.GetAssetPath(f);
            filePaths.Add(filePath);
        }
        Debug.Log(string.Join("\n", filePaths.ToArray()));
    }
}