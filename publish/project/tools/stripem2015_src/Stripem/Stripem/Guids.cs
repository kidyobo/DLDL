// Guids.cs
// MUST match guids.h
using System;

namespace Stripem
{
    static class GuidList
    {
        public const string guidStripemPkgString = "003a0f14-2226-41a9-8f63-dce243af9932";
        public const string guidStripemCmdSetString = "7626be0f-d60c-484e-9ff6-4884734525ad";

        public static readonly Guid guidStripemCmdSet = new Guid(guidStripemCmdSetString);
    };
}