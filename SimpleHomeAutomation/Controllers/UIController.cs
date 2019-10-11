using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UIController : ControllerBase
    {
        private readonly string jsonType = "application/json";
        private readonly string configPath;
        
        public UIController(IWebHostEnvironment webHostEnvironment)
        {
            configPath = webHostEnvironment.ContentRootPath + "\\config";
        }
        [HttpGet]
        [Route("get")]
        public IActionResult Get()
        {
            using (StreamReader file = new StreamReader(configPath + @"\ui.json"))
            {
                return Content(file.ReadToEnd(), jsonType);
            }
        }

        [HttpPost]
        [Route("save")]
        public IActionResult Save()
        {
            string testJson = "{ \"data\": \"this is the data!!!!!!!\"}";

            using (StreamWriter file = new StreamWriter(configPath + @"\ui.json"))
            {
                file.WriteLine(testJson);
            }

            return Ok();
        }
    }
}