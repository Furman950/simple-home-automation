using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using SimpleHomeAutomation.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public class UIService : IUiService
    {
        private readonly string filePath;
        private readonly ILogger logger;
        public UIService(IWebHostEnvironment webHostEnvironment, ILogger logger)
        {
            this.logger = logger;
            Directory.CreateDirectory(Path.Combine(webHostEnvironment.ContentRootPath, "config"));
            filePath = Path.Combine(webHostEnvironment.ContentRootPath, "config", "ui.json");
            CreateFileIfNotExist();
        }

        public async Task<List<UIControl>> Get()
        {
            try
            {
                using StreamReader reader = File.OpenText(this.filePath);
                string json = await reader.ReadToEndAsync();
                return JsonConvert.DeserializeObject<List<UIControl>>(json);
            }
            catch (Exception e)
            {
                logger.Log(e.Message);
            }

            return new List<UIControl>();
        }

        public async Task Save(List<UIControl> uiControls)
        {
            CreateFileIfNotExist();
            try
            {
                using StreamWriter writer = File.CreateText(this.filePath);
                string json = JsonConvert.SerializeObject(uiControls);
                await writer.WriteAsync(json);
                logger.Log("Saved UI");
            }
            catch (Exception e)
            {
                logger.Log(e.Message);
            }

        }

        private void CreateFileIfNotExist()
        {
            if (!File.Exists(filePath))
            {
                File.Create(filePath).Close();
            }
        }
    }
}
