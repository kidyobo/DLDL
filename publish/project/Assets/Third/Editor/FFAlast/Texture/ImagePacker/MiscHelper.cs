using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public static class MiscHelper
{
    // stolen from http://en.wikipedia.org/wiki/Power_of_two#Algorithm_to_find_the_next-highest_power_of_two
    public static int FindNextPowerOfTwo(int k)
    {
        k--;
        for (int i = 1; i < sizeof(int) * 8; i <<= 1)
            k = k | k >> i;
        return k + 1;
    }

}