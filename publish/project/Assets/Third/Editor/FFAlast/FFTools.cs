using UnityEngine;
using System.Collections.Generic;
using UnityEditor;
using System.IO;

public class FFTools : Editor
{
    static public Rect ConvertToTexCoords(Rect rect, int width, int height)
    {
        Rect final = rect;

        if (width != 0f && height != 0f)
        {
            final.xMin = rect.xMin / width;
            final.xMax = rect.xMax / width;
            final.yMin = rect.yMin / height;
            final.yMax = rect.yMax / height;
        }
        return final;
    }
    //获取gameobject的层级
    static public string GetHierarchy(GameObject obj)
    {
        if (obj == null) return "";
        string path = obj.name;

        while (obj.transform.parent != null && obj.transform.parent.GetComponent<Animator>() == null)
        {
            obj = obj.transform.parent.gameObject;
            path = obj.name + "/" + path;
        }
        return path;
    }
    //获取一个sprite的meta文件
    static public SpriteMetaData GetSpriteMeta(Sprite sprite)
    {
        string path = AssetDatabase.GetAssetPath(sprite.texture.GetInstanceID());
        TextureImporter ti = AssetImporter.GetAtPath(path) as TextureImporter;
        if (ti.spriteImportMode == SpriteImportMode.Multiple)
        {
            for (int i = 0; i < ti.spritesheet.Length; i++)
            {
                if (ti.spritesheet[i].name == sprite.name)
                {
                    return ti.spritesheet[i];
                }
            }
        }
        else
        {
            SpriteMetaData meta = new SpriteMetaData();
            meta.rect = sprite.rect;
            meta.name = sprite.name;
            return meta;
        }
        return new SpriteMetaData();
    }
    //将一个texture设置为可读
    static public bool MakeTextureReadable(Texture2D tex)
    {
        string path = AssetDatabase.GetAssetPath(tex.GetInstanceID());
        if (string.IsNullOrEmpty(path)) return false;
        TextureImporter ti = AssetImporter.GetAtPath(path) as TextureImporter;
        if (ti == null) return false;

        TextureImporterSettings settings = new TextureImporterSettings();
        ti.ReadTextureSettings(settings);
        if (!settings.readable)
        {
            settings.readable = true;
            settings.npotScale = TextureImporterNPOTScale.None;
            settings.alphaIsTransparency = true;
            ti.SetTextureSettings(settings);
            AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate | ImportAssetOptions.ForceSynchronousImport);
        }
        return true;
    }
    //根据sprite创建texture2D对象
    public static Texture2D GetNewTexture(Sprite sprite)
    {
        //创建子Textures
        int width = Mathf.RoundToInt(sprite.textureRect.width);
        int height = Mathf.RoundToInt(sprite.textureRect.height);
        Texture2D targetTex = new Texture2D(width, height, TextureFormat.ARGB32, false);

        MakeTextureReadable(sprite.texture);

        Color[] colors = sprite.texture.GetPixels(Mathf.RoundToInt(sprite.textureRect.x), Mathf.RoundToInt(sprite.textureRect.y), Mathf.RoundToInt(sprite.textureRect.width), Mathf.RoundToInt(sprite.textureRect.height));
        targetTex.SetPixels(0, 0, width, height, colors);
        return targetTex;
    }

    static string[] files;
    static int index;
    [MenuItem("FFTools/修改地图配置")]
    static void ScaleAllModel()
    {
        files = Directory.GetFiles("ServerMapData", "*.rsc", SearchOption.AllDirectories);
        SceneEditor.instance.onEnerScene = oncontinue;
        index = 0;
        Debug.Log(files.Length);
        oncontinue();
    }
    static void oncontinue()
    {
        if (index == files.Length)
        {
            return;
        }
        SceneEditor.instance.SaveScene();
        var mapData = MapOutput.ReadMapData(files[index]);
        var id = Directory.GetParent(files[index]).Name;
        SceneEditor.instance.EnterScene(int.Parse(id), mapData);
        index++;
    }
}