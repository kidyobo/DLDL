namespace UnityEditor.UI
{
    [CustomEditor(typeof(Game.UIGroupList), true)]
    public class GroupListEditor : ListEditor
    {
        protected override string[] GetCommonFieldPaths()
        {
            return new string[] { ListPropertyDefines.itemTempl.dataPath
                , ListPropertyDefines.itemSize.dataPath
                , ListPropertyDefines.spacing.dataPath
                , ListPropertyDefines.canScroll.dataPath
                , ListPropertyDefines.virtualSubList.dataPath };
        }
    }
}