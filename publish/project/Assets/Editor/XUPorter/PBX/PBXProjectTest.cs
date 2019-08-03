using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace UnityEditor.XCodeEditor
{
	public class PBXProjectTest : PBXObject
	{
		protected string MAINGROUP_KEY = "mainGroup";
		
		public PBXProjectTest() : base() {
		}
		
		public PBXProjectTest( string guid, PBXDictionary dictionary ) : base( guid, dictionary ) {	
		}
		
		public string mainGroupID {
			get {
				return (string)_data[ MAINGROUP_KEY ];
			}
		}
	}
}
