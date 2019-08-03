//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

/// <summary>
/// Atlas maker lets you create atlases from a bunch of small textures. It's an alternative to using the external Texture Packer.
/// </summary>

public class AtlasMaker : EditorWindow
{
    public static AtlasMaker instance = null;
    void OnEnable() { instance = this; }
    void OnDisable() { instance = null; }
    public Texture2D textureAltas = null;
    public SpriteMetaData[] altasMetaList = null;
    public int atlasPadding = 1;

    Vector2 mScroll = Vector2.zero;
    List<string> mDelNames = new List<string>();

    /// <summary>
    /// Refresh the window on selection.
    /// </summary>

    void OnSelectionChange() { mDelNames.Clear(); Repaint(); }

    /// <summary>
    /// Show a progress bar.
    /// </summary>

    static public void ShowProgress(float val)
    {
        EditorUtility.DisplayProgressBar("Updating", "Updating the atlas, please wait...", val);
    }
    void OnSelectAtlas(Object obj)
    {
        if (textureAltas != obj)
        {
            Selection.activeObject = obj;
        }
        textureAltas = obj as Texture2D;
        TextureImporter ti = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(obj)) as TextureImporter;
        if (ti != null && ti.spriteImportMode == SpriteImportMode.Multiple)
        {
            altasMetaList = ti.spritesheet;
        }
        else
        {
            textureAltas = null;
            altasMetaList = null;
            if (ti != null)
            {
                Debug.Log("请选择正确的图集，为sprite并且是multiple");
            }
        }
        SpriteEditor.RepaintSprites();
    }
    Dictionary<string, Texture2D> GetSelectedTextures()
    {
        Dictionary<string, Texture2D> textures = new Dictionary<string, Texture2D>();

        if (Selection.objects != null && Selection.objects.Length > 0)
        {
            Object[] objects = Selection.objects;

            foreach (Object o in objects)
            {
                Texture2D tex = o as Texture2D;
                TextureImporter ti = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(tex)) as TextureImporter;
                if (tex == null || tex.name == "Font Texture"||(ti != null && ti.spriteImportMode == SpriteImportMode.Multiple)) continue;
                if (textureAltas != tex)
                {
                    textures[tex.name] = tex;
                }
            }
        }
        return textures;
    }
    /// <summary>
    /// Draw the UI for this tool.
    /// </summary>

    void OnGUI()
    {
        bool update = false;
        bool replace = false;
        EditorGUIUtility.labelWidth = 84f;
        GUILayout.Space(3f);

        EditorStyleHelper.DrawHeader("Input", true);
        EditorStyleHelper.BeginContents(false);
        GUILayout.BeginHorizontal();
        {
            ComponentSelector.Draw<Texture2D>("Atlas", textureAltas, OnSelectAtlas, true, GUILayout.MinWidth(80f));

            EditorGUI.BeginDisabledGroup(textureAltas == null);
            if (GUILayout.Button("New", GUILayout.Width(40f)))
                textureAltas = null;
            EditorGUI.EndDisabledGroup();
        }
        GUILayout.EndHorizontal();

        if (textureAltas != null)
        {
            // Texture atlas information
            GUILayout.BeginHorizontal();
            {
                if (GUILayout.Button("Texture", GUILayout.Width(76f))) Selection.activeObject = textureAltas;
                GUILayout.Label(" " + textureAltas.width + "x" + textureAltas.height);
            }
            GUILayout.EndHorizontal();
        }
        GUILayout.BeginHorizontal();
        atlasPadding = Mathf.Clamp(EditorGUILayout.IntField("Padding", atlasPadding, GUILayout.Width(120f)), 0, 100);
        GUILayout.Label((atlasPadding <= 1 ? "pixel" : "pixels") + " between sprites");
        GUILayout.EndHorizontal();

        EditorStyleHelper.EndContents();

        Dictionary<string, Texture2D> textures = GetSelectedTextures();
        List<string> updateTextureNames = new List<string>();
        List<Texture2D> updateTextures = new List<Texture2D>();
        if (textureAltas != null)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Space(20f);
            if (GUILayout.Button("View Sprites"))
            {
                SpriteSelector.ShowSelected();
            }
            update = GUILayout.Button("Add/Update");
            GUILayout.Space(20f);
            GUILayout.EndHorizontal();
        }
        else
        {
            EditorGUILayout.HelpBox("You can create a new atlas by selecting one or more textures in the Project View window, then clicking \"Create\".", MessageType.Info);

            EditorGUI.BeginDisabledGroup(textures.Count == 0);
            GUILayout.BeginHorizontal();
            GUILayout.Space(20f);
            bool create = GUILayout.Button("Create");
            GUILayout.Space(20f);
            GUILayout.EndHorizontal();
            EditorGUI.EndDisabledGroup();

            if (create)
            {
                var texList = new Texture2D[textures.Count];
                int index = 0;
                foreach (KeyValuePair<string, Texture2D> pair in textures)
                {
                    texList[index] = pair.Value;
                    index++;
                }
                textureAltas = SpriteEditor.UpdateAltas(textureAltas, texList,altasMetaList, atlasPadding);
                OnSelectAtlas(textureAltas);
                UpdateMeta();
                SpriteEditor.RepaintSprites();
            }
        }

        string selection = null;
        EditorStyleHelper.DrawHeader("Sprites", true);
        {
            GUILayout.BeginHorizontal();
            GUILayout.Space(3f);
            GUILayout.BeginVertical();

            mScroll = GUILayout.BeginScrollView(mScroll);

            bool delete = false;
            int index = 0;
            if (altasMetaList != null)
            {
                foreach (SpriteMetaData sprite in altasMetaList)
                {
                    ++index;

                    GUILayout.Space(-1f);
                    bool highlight = SpriteEditor.selectedSprite == sprite.name;
                    GUI.backgroundColor = highlight ? Color.white : new Color(0.8f, 0.8f, 0.8f);
                    GUILayout.BeginHorizontal("AS TextArea", GUILayout.MinHeight(20f));
                    GUI.backgroundColor = Color.white;
                    GUILayout.Label(index.ToString(), GUILayout.Width(24f));

                    if (GUILayout.Button(sprite.name, "OL TextField", GUILayout.Height(20f)))
                        selection = sprite.name;
                    var has = textures.ContainsKey(sprite.name);
                    if (has)
                    {
                        GUI.color = Color.cyan;
                        GUILayout.Label("Update", GUILayout.Width(45f));
                        GUI.color = Color.white;
                        updateTextures.Add(textures[sprite.name]);
                        textures.Remove(sprite.name);
                        updateTextureNames.Add(sprite.name);
                    }
                    else
                    {
                        if (mDelNames.Contains(sprite.name))
                        {
                            GUI.backgroundColor = Color.red;

                            if (GUILayout.Button("Delete", GUILayout.Width(60f)))
                            {
                                delete = true;
                            }
                            GUI.backgroundColor = Color.green;
                            if (GUILayout.Button("X", GUILayout.Width(22f)))
                            {
                                mDelNames.Remove(sprite.name);
                                delete = false;
                            }
                            GUI.backgroundColor = Color.white;
                        }
                        else
                        {
                            // If we have not yet selected a sprite for deletion, show a small "X" button
                            if (GUILayout.Button("X", GUILayout.Width(22f))) mDelNames.Add(sprite.name);
                        }
                    }
                    GUILayout.EndHorizontal();
                }
            }

            foreach (KeyValuePair<string, Texture2D> pair in textures)
            {
                ++index;

                GUILayout.Space(-1f);
                GUI.backgroundColor = new Color(0.8f, 0.8f, 0.8f);
                GUILayout.BeginHorizontal("AS TextArea", GUILayout.MinHeight(20f));
                GUI.backgroundColor = Color.white;
                GUILayout.Label(index.ToString(), GUILayout.Width(24f));
                GUILayout.Button(pair.Key, "OL TextField", GUILayout.Height(20f));
                GUI.color = Color.green;
                GUILayout.Label("Add", GUILayout.Width(27f));
                GUI.color = Color.white;
                GUILayout.EndHorizontal();
            }


            GUILayout.EndScrollView();
            GUILayout.EndVertical();
            GUILayout.Space(3f);
            GUILayout.EndHorizontal();

            // If this sprite was marked for deletion, remove it from the atlas
            if (delete)
            {
                var texList = SpriteEditor.GetTextures(textureAltas, mDelNames);
                SpriteEditor.UpdateAltas(textureAltas, texList, altasMetaList, atlasPadding);
                mDelNames.Clear();
                UpdateMeta();
                SpriteEditor.RepaintSprites();
            }

            if (textureAltas != null && !string.IsNullOrEmpty(selection))
            {
                SpriteEditor.SelectSprite(selection);
            }
            else if (update || replace)
            {
                var texList = SpriteEditor.GetTextures(textureAltas, updateTextureNames);
                updateTextures.AddRange(texList);
                foreach (KeyValuePair<string, Texture2D> pair in textures)
                {
                    updateTextures.Add(pair.Value);
                }
                textureAltas = SpriteEditor.UpdateAltas(textureAltas, updateTextures.ToArray(), altasMetaList, atlasPadding);
                Selection.activeObject = textureAltas;
                UpdateMeta();
                SpriteEditor.RepaintSprites();
            }
        }

    }
    void UpdateMeta()
    {
        TextureImporter ti = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(textureAltas)) as TextureImporter;
        if (ti != null && ti.spriteImportMode == SpriteImportMode.Multiple)
        {
            altasMetaList = ti.spritesheet;
        }
    }
}