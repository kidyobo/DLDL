using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System.Text.RegularExpressions;
using UnityEngine.EventSystems;

namespace UnityEngine.UI
{
    [RequireComponent(typeof(InputField))]
    class LimitPhoneEmoij : MonoBehaviour
    {
        InputField input;
        void Start()
        {

            this.input = this.GetComponent<InputField>();
            input.onValidateInput = this.onValidateInput;
        }

        char onValidateInput(string text, int charIndex, char addedChar)
        {
            //输入的内容
            if (addedChar >= '\uD800' && addedChar <= '\uDFFF' || addedChar >= '\uDC00' && addedChar <= '\uDFFF')
            {
                return '�';
            }
            else
            {
                return addedChar;
            }
        }
    }
}
