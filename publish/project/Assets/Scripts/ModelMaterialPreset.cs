using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class ModelMaterialPreset
{
    private static Dictionary<string, MaterialPreset> presets = new Dictionary<string, MaterialPreset>(128);
    public static void NewPreset(string name)
    {
        presets[name] = new MaterialPreset(name);
    }
    public static void DeletePreset(string name)
    {
        if (presets.ContainsKey(name))
        {
            presets.Remove(name);
        }
    }
    public static void UpdateMaterialByPreset(string name, Material material)
    {
        MaterialPreset preset;
        if (presets.TryGetValue(name, out preset))
        {
            preset.UpdateMaterial(material);
        }
    }
    public static void UpdateMaterialsByPreset(string name, Material[] materials)
    {
        for (int i = 0; i < materials.Length; i++)
        {
            Material material = materials[i];
            MaterialPreset preset;
            if (presets.TryGetValue(name, out preset))
            {
                preset.UpdateMaterial(material);
            }
        }
    }
    public static void SetPresetFloat(string name, string key, float value)
    {
        MaterialPreset preset;
        if (presets.TryGetValue(name, out preset))
        {
            preset.floatList.Add(new KeyValuePair<string, float>(key, value));
        }
    }
    public static void SetPresetColor(string name, string key, Color value)
    {
        MaterialPreset preset;
        if (presets.TryGetValue(name, out preset))
        {
            preset.colorList.Add(new KeyValuePair<string, Color>(key, value));
        }
    }
    public static void SetPresetVector(string name, string key, Vector4 value)
    {
        MaterialPreset preset;
        if (presets.TryGetValue(name, out preset))
        {
            preset.vectorList.Add(new KeyValuePair<string, Vector4>(key, value));
        }
    }
    public static void SetPresetTexture(string name, string key, Texture value)
    {
        MaterialPreset preset;
        if (presets.TryGetValue(name, out preset))
        {
            preset.textureList.Add(new KeyValuePair<string, Texture>(key, value));
        }
    }
    class MaterialPreset
    {
        public string name;
        public List<KeyValuePair<string, float>> floatList = new List<KeyValuePair<string, float>>();
        public List<KeyValuePair<string, Vector4>> vectorList = new List<KeyValuePair<string, Vector4>>();
        public List<KeyValuePair<string, Color>> colorList = new List<KeyValuePair<string, Color>>();
        public List<KeyValuePair<string, Texture>> textureList = new List<KeyValuePair<string, Texture>>();
        public MaterialPreset(string name)
        {
            this.name = name;
        }
        public void UpdateMaterial(Material material)
        {
            if (material.GetTag("preset", false) == this.name)
            {
                return;
            }
            for (int i = 0; i < floatList.Count; i++)
            {
                var pair = floatList[i];
                material.SetFloat(pair.Key, pair.Value);
            }
            for (int i = 0; i < vectorList.Count; i++)
            {
                var pair = vectorList[i];
                material.SetVector(pair.Key, pair.Value);
            }
            for (int i = 0; i < colorList.Count; i++)
            {
                var pair = colorList[i];
                material.SetColor(pair.Key, pair.Value);
            }
            for (int i = 0; i < textureList.Count; i++)
            {
                var pair = textureList[i];
                material.SetTexture(pair.Key, pair.Value);
            }
            material.SetOverrideTag("preset", this.name);
        }
    }
}