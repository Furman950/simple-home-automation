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
            List<UIControl> uiControls = null;
            try
            {
                using StreamReader reader = File.OpenText(this.filePath);
                string json = await reader.ReadToEndAsync();
                uiControls = JsonConvert.DeserializeObject<List<UIControl>>(json);
            }
            catch (Exception e)
            {
                logger.Log(e.Message);
            }

            return uiControls ?? new List<UIControl>();
        }

        public async Task Save(UIControl uiControl)
        {
            List<UIControl> currentUIControls = await Get();
            currentUIControls.Add(uiControl);
            try
            {
                using StreamWriter writer = File.CreateText(this.filePath);
                string json = JsonConvert.SerializeObject(currentUIControls);
                await writer.WriteAsync(json);
                logger.Log($"Saved UI - Added {uiControl}");
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
