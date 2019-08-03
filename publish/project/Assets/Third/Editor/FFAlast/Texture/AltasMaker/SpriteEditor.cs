using UnityEngine;
using System.Collections.Generic;
using UnityEditor;
using System.IO;
public class SpriteEditor : Editor
{
    public static string selectedSprite = "";
    static public void RepaintSprites()
    {
        if (AtlasMaker.instance != null)
            AtlasMaker.instance.Repaint();
        if (SpriteSelector.instance != null)
            SpriteSelector.instance.Repaint();
    }
    static public void SelectSprite(string name)
    {
        var altas = AtlasMaker.instance != null ? AtlasMaker.instance.textureAltas : null;
        if (altas != null)
        {
            var altasPath = AssetDatabase.GetAssetPath(altas);
            SpriteEditor.selectedSprite = name;
            Sprite targetSprite = null;
            UnityEngine.Object[] objects = AssetDatabase.LoadAllAssetsAtPath(altasPath);
            foreach (UnityEngine.Object o in objects)
            {
                if (o.name == SpriteEditor.selectedSprite)
                {
                    targetSprite = o as Sprite;
                }
            }

            Selection.activeObject = targetSprite;
            RepaintSprites();
        }
    }
    public static Texture2D[] GetTextures(Texture2D texture, List<string> filterNames)
    {
        FFTools.MakeTextureReadable(texture);
        TextureImporter ti = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
        SpriteMetaData[] altasMetaList = ti.spritesheet;
        List<Texture2D> textureList = new List<Texture2D>();
        foreach (SpriteMetaData data in altasMetaList)
        {
            if (filterNames.Contains(data.name))
            {
                continue;
            }
            Texture2D tex = new Texture2D((int)data.rect.width, (int)data.rect.height);
            tex.name = data.name;
            var pxList = texture.GetPixels((int)data.rect.x, (int)data.rect.y, (int)data.rect.width, (int)data.rect.height);
            tex.SetPixels(pxList);
            textureList.Add(tex);
        }
        return textureList.ToArray();
    }
    public static Texture2D UpdateAltas(Texture2D targetTexture, Texture2D[] textureList, SpriteMetaData[] oldMetaList, int padding)
    {
        bool create = false;
        foreach (Texture2D texture in textureList)
        {
            FFTools.MakeTextureReadable(texture);
        }
        string fileName = null;
        if (targetTexture != null)
        {
            fileName = AssetDatabase.GetAssetPath(targetTexture);
        }
        else
        {
            targetTexture = new Texture2D(1, 1, TextureFormat.ARGB32, false);
            fileName = Path.GetDirectoryName(AssetDatabase.GetAssetPath(textureList[0]));
            fileName = EditorUtility.SaveFilePanelInProject("Save As",
    "New Sprite.png", "png", "Save atlas as...", fileName);
            create = true;
        }

        ImagePacker packer = new ImagePacker();
        Rect[] rects = packer.PackImage(targetTexture, textureList, true, false, 2048, 2048, padding);
        //Rect[] rects = targetTexture.PackTextures(textureList, padding, 2048, false);
        Dictionary<string, SpriteMetaData> oldMetaDic = new Dictionary<string, SpriteMetaData>();
        if (oldMetaList != null)
        {
            foreach (SpriteMetaData data in oldMetaList)
            {
                oldMetaDic[data.name] = data;
            }
        }

        SpriteMetaData[] spriteMetaList = new SpriteMetaData[rects.Length];

        for (int i = 0, length = rects.Length; i < length; i++)
        {
            var rect = rects[i];
            spriteMetaList[i].name = textureList[i].name;
            spriteMetaList[i].rect.position = new Vector2(rect.x * targetTexture.width, rect.y * targetTexture.height);
            spriteMetaList[i].rect.width = rect.width * targetTexture.width;
            spriteMetaList[i].rect.height = rect.height * targetTexture.height;
            SpriteMetaData oldData;
            if (oldMetaDic.TryGetValue(spriteMetaList[i].name, out oldData))
            {
                spriteMetaList[i].pivot = oldData.pivot;
                spriteMetaList[i].border = oldData.border;
                spriteMetaList[i].alignment = oldData.alignment;
            }
        }
        targetTexture.Apply();

        if (textureList.Length == 0)
        {
            AssetDatabase.DeleteAsset(fileName);
        }
        else
        {
            byte[] bytes = targetTexture.EncodeToPNG();
            System.IO.File.WriteAllBytes(fileName, bytes);
            if (create)
            {
                AssetDatabase.Refresh(ImportAssetOptions.Default);
            }

            //修改为Sprite
            TextureImporter ti = AssetImporter.GetAtPath(fileName) as TextureImporter;
            ti.npotScale = TextureImporterNPOTScale.None;
            ti.mipmapEnabled = false;
            ti.textureType = TextureImporterType.Sprite;
            ti.isReadable = true;
            ti.spriteImportMode = SpriteImportMode.Multiple;
            ti.spritesheet = spriteMetaList;

            AssetDatabase.ImportAsset(fileName);
        }
        return AssetDatabase.LoadAssetAtPath<Texture2D>(fileName);
    }
}