//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEditor;
using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Editor component used to display a list of sprites.
/// </summary>

public class SpriteSelector : ScriptableWizard
{
    static public SpriteSelector instance;

    void OnEnable() { instance = this; }
    void OnDisable() { instance = null; }
    string partialSprite = "";
    Vector2 mPos = Vector2.zero;
    System.Action<string> mCallback;
    float mClickTime = 0f;

    /// <summary>
    /// Draw the custom wizard.
    /// </summary>

    void OnGUI()
    {
        EditorStyleHelper.SetLabelWidth(80f);
        var textureAltas = AtlasMaker.instance == null ? null : AtlasMaker.instance.textureAltas;
        if (textureAltas == null)
        {
            GUILayout.Label("No Atlas selected.", "LODLevelNotifyText");
        }
        else
        {
            bool close = false;
            GUILayout.Label(textureAltas.name + " Sprites", "LODLevelNotifyText");
            EditorStyleHelper.DrawSeparator();

            GUILayout.BeginHorizontal();
            GUILayout.Space(84f);

            string before = partialSprite;
            string after = EditorGUILayout.TextField("", before, "SearchTextField");
            if (before != after) partialSprite = after;

            if (GUILayout.Button("", "SearchCancelButton", GUILayout.Width(18f)))
            {
                partialSprite = "";
                GUIUtility.keyboardControl = 0;
            }
            GUILayout.Space(84f);
            GUILayout.EndHorizontal();
            var altasMetaList = AtlasMaker.instance.altasMetaList;

            float size = 80f;
            float padded = size + 10f;
            int columns = Mathf.FloorToInt(Screen.width / padded);
            if (columns < 1) columns = 1;

            int offset = 0;
            Rect rect = new Rect(10f, 0, size, size);

            GUILayout.Space(10f);
            mPos = GUILayout.BeginScrollView(mPos);
            int rows = 1;

            while (offset < altasMetaList.Length)
            {
                GUILayout.BeginHorizontal();
                {
                    int col = 0;
                    rect.x = 10f;

                    for (; offset < altasMetaList.Length; ++offset)
                    {
                        SpriteMetaData sprite = altasMetaList[offset];
                        // Button comes first
                        if (GUI.Button(rect, ""))
                        {
                            if (Event.current.button == 0)
                            {
                                float delta = Time.realtimeSinceStartup - mClickTime;
                                mClickTime = Time.realtimeSinceStartup;

                                if (SpriteEditor.selectedSprite != sprite.name)
                                {
                                    if (mCallback != null) mCallback(sprite.name);
                                }
                                else if (delta < 0.5f) close = true;
                            }
                            else
                            {
                                FFContextMenu.AddItem("Delete", false, DeleteSprite, sprite.name);
                                FFContextMenu.Show();
                            }
                        }

                        if (Event.current.type == EventType.Repaint)
                        {
                            // On top of the button we have a checkboard grid
                            EditorStyleHelper.DrawTiledTexture(rect, EditorStyleHelper.backdropTexture);
                            Rect uv = FFTools.ConvertToTexCoords(sprite.rect,textureAltas.width,textureAltas.height);
                            // Calculate the texture's scale that's needed to display the sprite in the clipped area
                            float scaleX = rect.width / uv.width;
                            float scaleY = rect.height / uv.height;

                            // Stretch the sprite so that it will appear proper
                            float aspect = (scaleY / scaleX) / ((float)textureAltas.height / textureAltas.width);
                            Rect clipRect = rect;

                            if (aspect != 1f)
                            {
                                if (aspect < 1f)
                                {
                                    // The sprite is taller than it is wider
                                    float padding = size * (1f - aspect) * 0.5f;
                                    clipRect.xMin += padding;
                                    clipRect.xMax -= padding;
                                }
                                else
                                {
                                    // The sprite is wider than it is taller
                                    float padding = size * (1f - 1f / aspect) * 0.5f;
                                    clipRect.yMin += padding;
                                    clipRect.yMax -= padding;
                                }
                            }

                            GUI.DrawTextureWithTexCoords(clipRect, textureAltas, uv);

                            // Draw the selection
                            if (SpriteEditor.selectedSprite == sprite.name)
                            {
                                EditorStyleHelper.DrawOutline(rect, new Color(0.4f, 1f, 0f, 1f));
                            }
                        }

                        GUI.backgroundColor = new Color(1f, 1f, 1f, 0.5f);
                        GUI.contentColor = new Color(1f, 1f, 1f, 0.7f);
                        GUI.Label(new Rect(rect.x, rect.y + rect.height, rect.width, 32f), sprite.name, "ProgressBarBack");
                        GUI.contentColor = Color.white;
                        GUI.backgroundColor = Color.white;

                        if (++col >= columns)
                        {
                            ++offset;
                            break;
                        }
                        rect.x += padded;
                    }
                }
                GUILayout.EndHorizontal();
                GUILayout.Space(padded);
                rect.y += padded + 26;
                ++rows;
            }
            GUILayout.Space(rows * 26);
            GUILayout.EndScrollView();

            if (close) Close();
        }
    }

    /// <summary>
    /// Delete the sprite (context menu selection)
    /// </summary>

    void DeleteSprite(object obj)
    {
        if (AtlasMaker.instance==null) return;
        var texList = SpriteEditor.GetTextures(AtlasMaker.instance.textureAltas, new List<string> { (string)obj});
        SpriteEditor.UpdateAltas(AtlasMaker.instance.textureAltas, texList, AtlasMaker.instance.altasMetaList, AtlasMaker.instance.atlasPadding);
        SpriteEditor.RepaintSprites();
    }

    /// <summary>
    /// Show the sprite selection wizard.
    /// </summary>

    static public void ShowSelected()
    {
        Show(delegate (string sel) { SpriteEditor.SelectSprite(sel); });
    }

    /// <summary>
    /// Show the selection wizard.
    /// </summary>

    static public void Show(System.Action<string> callback)
    {
        if (instance != null)
        {
            instance.Close();
            instance = null;
        }

        SpriteSelector comp = ScriptableWizard.DisplayWizard<SpriteSelector>("Select a Sprite");
        comp.mCallback = callback;
    }
}
