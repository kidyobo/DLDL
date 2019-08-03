using UnityEngine;
using System.Collections;

namespace UnityEditor.XCodeEditor.Edit.Plist
{
    public interface IEditPlist
    {
        void Edit(XCPlist plist);
    }
}