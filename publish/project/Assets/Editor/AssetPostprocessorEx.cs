using UnityEngine;
using System.Collections.Generic;
using UnityEditor;
using System.IO;
public class AssetPostprocessorEx : AssetPostprocessor
{
    static void OnPostprocessAllAssets(string[] importedAssets, string[] deletedAssets, string[] movedAssets, string[] movedFromAssetPaths)
    {
        for (int i = 0; i < movedAssets.Length; i++)
        {
            AssetDatabase.ImportAsset(movedAssets[i]);
        }
    }
    static void ProcessAsset(string assetPath, AssetImporter assetImporter)
    {
        var type = assetImporter.GetType();
        if (type == typeof(TextureImporter))
        {
            TextureImporter textureImporter = (TextureImporter)assetImporter;
            textureImporter.spritePackingTag = null;
            textureImporter.mipmapEnabled = false;
            var alpha = textureImporter.DoesSourceTextureHaveAlpha();
            textureImporter.alphaSource = alpha ? TextureImporterAlphaSource.FromInput : TextureImporterAlphaSource.None;
            if (assetPath.ToLower().Contains("rgba"))
            {
                textureImporter.textureCompression = TextureImporterCompression.Uncompressed;
            }
            else
            {
                textureImporter.textureCompression = TextureImporterCompression.Compressed;
            }
            var chekStr = "Assets/AssetSources/";
            if (assetPath.StartsWith(chekStr))
            {
                var rest = assetPath.Substring(chekStr.Length);
                if (rest.StartsWith("images/"))
                {
                    textureImporter.textureType = TextureImporterType.Default;
                    textureImporter.spriteImportMode = SpriteImportMode.None;
                }
                else if (rest.StartsWith("icon/"))
                {
                    textureImporter.textureType = TextureImporterType.Default;
                    textureImporter.spriteImportMode = SpriteImportMode.None;
                }
                else if (rest.StartsWith("map/"))
                {
                    textureImporter.textureType = TextureImporterType.Default;
                    textureImporter.spriteImportMode = SpriteImportMode.None;
                }
                else if (rest.StartsWith("ui/"))
                {
                    if (rest.StartsWith("ui/altas"))
                    {
                        textureImporter.textureType = TextureImporterType.Sprite;
                        textureImporter.spriteImportMode = SpriteImportMode.Single;
                        textureImporter.spritePackingTag = Directory.GetParent(assetPath).Name;
                        textureImporter.textureCompression = TextureImporterCompression.Compressed;
                    }
                    else
                    {
                        textureImporter.textureType = TextureImporterType.Default;
                        textureImporter.spriteImportMode = SpriteImportMode.None;
                    }
                }
            }
            if (textureImporter.textureCompression != TextureImporterCompression.Uncompressed)
            {
                var s = new TextureImporterPlatformSettings();
                s.name = "iPhone";
                s.maxTextureSize = 2048;
                s.overridden = true;
                s.format = TextureImporterFormat.ASTC_RGBA_4x4;
                textureImporter.SetPlatformTextureSettings(s);
            }
        }
        else if (type == typeof(ModelImporter))
        {
            ModelImporter import = (ModelImporter)assetImporter;
            import.resampleCurves = false;
            if (assetPath.Contains("readable"))
            {
                import.isReadable = true;
            }
            else
            {
                import.meshCompression = ModelImporterMeshCompression.Low;
            }
            if (import.animationType == ModelImporterAnimationType.None)
            {
                import.importAnimation = false;
            }
            else
            {
                import.importAnimation = true;
                import.animationType = ModelImporterAnimationType.Generic;
                import.animationCompression = ModelImporterAnimationCompression.Optimal;
                import.animationPositionError = 0f;
                import.animationRotationError = 0f;
                import.animationScaleError = 0f;
                import.optimizeGameObjects = true;
            }
        }
        else if (type == typeof(AudioImporter))
        {
            AudioImporter import = (AudioImporter)assetImporter;
            import.preloadAudioData = false;
            var setting = import.defaultSampleSettings;
            if (assetPath.StartsWith("Assets/AssetSources/sound/scene"))
            {
                setting.loadType = AudioClipLoadType.Streaming;
            }
            else
            {
                setting.loadType = AudioClipLoadType.CompressedInMemory;
            }

            import.defaultSampleSettings = setting;
        }
    }
    void OnPreprocessTexture()
    {
        ProcessAsset(assetPath, assetImporter);
    }
    void OnPreprocessModel()
    {
        ProcessAsset(assetPath, assetImporter);
    }
    void OnPreprocessAudio()
    {
        ProcessAsset(assetPath, assetImporter);
    }
}