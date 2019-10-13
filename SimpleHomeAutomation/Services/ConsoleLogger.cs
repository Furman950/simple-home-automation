using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public class ConsoleLogger : ILogger
    {
        public void Log(string text)
        {
            Debug.Write(text);
        }
    }
}
