using Microsoft.AspNetCore.Hosting;
using SimpleHomeAutomation.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace SimpleHomeAutomation
{
    public class FileLogger : ILogger, IDisposable
    {
        private readonly string logFilePath;
        private readonly FileStream fileStream;
        
        public FileLogger(IWebHostEnvironment webHostEnvironment)
        {
            logFilePath = webHostEnvironment.ContentRootPath + "\\logs\\logs.txt";
            fileStream = new FileStream(logFilePath, FileMode.Append, FileAccess.Write,
                FileShare.Read, bufferSize: 4096, FileOptions.WriteThrough);
            //streamWriter = new StreamWriter(fileStream);
        }

        public void Dispose()
        {
            if (fileStream is null)
            {
                return;
            }

            fileStream.Dispose();
        }

        public async void Log(string text)
        {
            Debug.WriteLine("Should write to text");
            byte[] encodedText = Encoding.Unicode.GetBytes($"{DateTime.Now} - {text}\n");
            await fileStream.WriteAsync(encodedText, 0, encodedText.Length);
            await fileStream.FlushAsync();
        }
    }
}
