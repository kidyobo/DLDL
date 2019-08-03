
//using UnityEngine;
//using UnityEngine.UI;
//using UnityEditor;
//using System.Collections.Generic;
//using System.IO;
//public class AltasConverter : EditorWindow
//{
//    public GameObject target = null;
//    List<Image> imageList = new List<Image>(1024);
//    bool compressed = true;
//    void OnGUI()
//    {
//        EditorGUIUtility.labelWidth = 84f;
//        GUILayout.Space(3f);

//        EditorStyleHelper.DrawHeader("Input", true);
//        EditorStyleHelper.BeginContents(false);
//        GUILayout.BeginHorizontal();
//        {
//            ComponentSelector.Draw<GameObject>("GameObejct", target, OnSelectObj, true, GUILayout.MinWidth(200f));
//        }
//        GUILayout.EndHorizontal();
//        EditorGUI.BeginDisabledGroup(target == null);
//        GUILayout.Label("contain " + this.imageList.Count + " images");
//        EditorGUI.EndDisabledGroup();
//        GUILayout.BeginHorizontal();
//        compressed = EditorGUILayout.Toggle("Compressed", compressed, GUILayout.Width(100f));
//        GUILayout.Label("Compress textures", GUILayout.MinWidth(70f));
//        GUILayout.EndHorizontal();
//        EditorStyleHelper.EndContents();

//        EditorGUI.BeginDisabledGroup(target == null);
//        GUILayout.BeginHorizontal();
//        GUILayout.Space(20f);
//        if (GUILayout.Button("Altas to sprites"))
//        {
//            Altas2Sprites();
//        }
//        GUILayout.Space(20f);
//        if (GUILayout.Button("Sprites to altas"))
//        {
//            Sprites2Altas();
//        }
//        GUILayout.Space(20f);
//        GUILayout.EndHorizontal();
//        EditorGUI.EndDisabledGroup();
//    }
//    void OnSelectObj(Object obj)
//    {
//        if (target != obj)
//        {
//            Selection.activeObject = obj;
//        }
//        target = obj as GameObject;
//        imageList.Clear();
//        if (target != null)
//        {
//            var images = target.GetComponentsInChildren<Image>(true);
//            foreach (Image image in images)
//            {
//                if (image.sprite != null)
//                {
//                    var path = AssetDatabase.GetAssetPath(image.sprite.texture);
//                    if (!path.StartsWith("Resources"))
//                    {
//                        imageList.Add(image);
//                    }
//                }
//            }
//        }
//    }

//    void Altas2Sprites()
//    {
//        HashSet<Sprite> sprites = new HashSet<Sprite>();
//        //将所有sprite提取
//        foreach (Image image in imageList)
//        {
//            if(image.sprite!=null)
//                sprites.Add(image.sprite);
//        }

//        bool link = true;
//        //输出所有新的texture
//        string basePath= "Assets/AltasConverterGenerate/altas/";
//        foreach (Sprite sprite in sprites)
//        {
//            if (AssetDatabase.GetAssetPath(sprite.texture).StartsWith(basePath))
//            {
//                Debug.Log("该文件已经链接成功，无需继续执行");
//                link = false;
//                break;
//            }

//            var tex = FFTools.GetNewTexture(sprite);
//            string fatherName = sprite.texture.name;
//            byte[] bytes = tex.EncodeToPNG();
//            //文件目录结构为图集名为目录名称
//            string filePath = basePath + fatherName + "/";
//            if (!Directory.Exists(filePath))
//            {
//                Directory.CreateDirectory(filePath);
//            }

//            string fileName = filePath + sprite.name + ".png";
//            System.IO.File.WriteAllBytes(fileName, bytes);
//            AssetDatabase.Refresh(ImportAssetOptions.Default);
//            //修改为Sprite
//            TextureImporter ti = AssetImporter.GetAtPath(fileName) as TextureImporter;
//            ti.textureFormat = compressed ? TextureImporterFormat.AutomaticCompressed : TextureImporterFormat.ARGB32;
//            ti.npotScale = TextureImporterNPOTScale.None;
//            ti.mipmapEnabled = false;
//            ti.textureType = TextureImporterType.Sprite;
//            ti.isReadable = true;
//            ti.spritePackingTag = fatherName;
//            ti.spriteImportMode = SpriteImportMode.Single;
//            ti.spritePivot = sprite.pivot;
//            ti.spriteBorder = sprite.border;
//            AssetDatabase.ImportAsset(fileName);
//        }
//        if (link)
//        {
//            //重新链接
//            foreach (Image image in imageList)
//            {
//                if (image.sprite != null)
//                {
//                    string fatherName = image.sprite.texture.name;
//                    string filePath = basePath + fatherName + "/";
//                    string fileName = filePath + image.sprite.name + ".png";
//                    image.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(fileName);
//                }
//            }
//        }
//        AssetDatabase.SaveAssets();
//        AssetDatabase.Refresh(ImportAssetOptions.Default);
//    }
//    void Sprites2Altas()
//    {
//        Debug.Log("本方法暂无实现");
//    }
//}



//using UnityEngine;
//using UnityEngine.UI;
//using UnityEditor;
//using System.Collections.Generic;
//using System.IO;
//public class AltasConverter : Editor
//{
//    static List<UGUIAltas> uguiAltasList = null;
//    static List<Image> imageList = null;
//    [MenuItem("FFTools/AltasConverter", false, 3)]
//    static void Convert()
//    {
//        SelectAssets();
//        Altas2Sprites();
//    }

//    static void SelectAssets()
//    {
//        uguiAltasList = new List<UGUIAltas>(1024);
//        imageList = new List<Image>(1024);
//        List<GameObject> objList = new List<GameObject>(100);
//        var files = Directory.GetFiles("Assets/AssetSources/ui", "*.prefab", SearchOption.AllDirectories);
//        foreach (string file in files)
//        {
//            string name = file.Replace('\\', '/');
//            var obj = AssetDatabase.LoadAssetAtPath<GameObject>(name);
//            if (obj != null)
//            {
//                objList.Add(obj);
//            }
//        }

//        foreach (var obj in objList)
//        {
//            var images = (obj as GameObject).GetComponentsInChildren<Image>(true);
//            foreach (Image image in images)
//            {
//                if (image.sprite != null)
//                {
//                    var path = AssetDatabase.GetAssetPath(image.sprite.texture);
//                    if (!path.StartsWith("Resources"))
//                    {
//                        imageList.Add(image);
//                    }
//                }
//            }

//            var uguiAltas = (obj as GameObject).GetComponentsInChildren<UGUIAltas>(true);
//            uguiAltasList.AddRange(uguiAltas);
//        }
//    }
//    static void Altas2Sprites()
//    {
//        HashSet<Sprite> sprites = new HashSet<Sprite>();
//        //������sprite��ȡ
//        foreach (Image image in imageList)
//        {
//            if (image.sprite != null)
//                sprites.Add(image.sprite);
//        }

//        foreach (UGUIAltas altas in uguiAltasList)
//        {
//            foreach (Sprite sprite in altas.sprites)
//            {
//                if (sprite != null)
//                {
//                    sprites.Add(sprite);
//                }
//            }
//        }

//        bool link = true;
//        //��������µ�texture
//        string basePath = "Assets/AltasConverterGenerate/altas/";
//        foreach (Sprite sprite in sprites)
//        {
//            if (AssetDatabase.GetAssetPath(sprite.texture).StartsWith(basePath))
//            {
//                Debug.Log("不能重复转换");
//                link = false;
//                break;
//            }

//            var tex = FFTools.GetNewTexture(sprite);
//            string fatherName = sprite.texture.name;
//            byte[] bytes = tex.EncodeToPNG();
//            tex.Apply();
//            //�ļ�Ŀ¼�ṹΪͼ����ΪĿ¼����
//            string filePath = basePath + fatherName + "/";
//            if (!Directory.Exists(filePath))
//            {
//                Directory.CreateDirectory(filePath);
//            }

//            string fileName = filePath + sprite.name + ".png";
//            System.IO.File.WriteAllBytes(fileName, bytes);
//            AssetDatabase.ImportAsset(fileName);
//            //�޸�ΪSprite
//            TextureImporter ti = AssetImporter.GetAtPath(fileName) as TextureImporter;
//            ti.textureFormat = TextureImporterFormat.AutomaticCompressed;
//            ti.npotScale = TextureImporterNPOTScale.None;
//            ti.mipmapEnabled = false;
//            ti.textureType = TextureImporterType.Sprite;
//            ti.isReadable = true;
//            ti.spritePackingTag = fatherName;
//            ti.spriteImportMode = SpriteImportMode.Single;
//            ti.spritePivot = sprite.pivot;
//            ti.spriteBorder = sprite.border;
//            AssetDatabase.ImportAsset(fileName);
//        }
//        //修改importer

//        if (link)
//        {
//            //��������
//            foreach (Image image in imageList)
//            {
//                if (image.sprite != null)
//                {
//                    string fatherName = image.sprite.texture.name;
//                    string filePath = basePath + fatherName + "/";
//                    string fileName = filePath + image.sprite.name + ".png";
//                    image.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(fileName);
//                }
//            }

//            foreach (UGUIAltas altas in uguiAltasList)
//            {
//                for (int i = 0, len = altas.sprites.Count; i < len; i++)
//                {
//                    var sprite = altas.sprites[i];
//                    if (sprite != null)
//                    {
//                        string fatherName = sprite.texture.name;
//                        string filePath = basePath + fatherName + "/";
//                        string fileName = filePath + sprite.name + ".png";
//                        altas.sprites[i] = AssetDatabase.LoadAssetAtPath<Sprite>(fileName);
//                    }
//                }
//            }
//        }
//        AssetDatabase.SaveAssets();
//        AssetDatabase.Refresh(ImportAssetOptions.Default);
//    }
//}