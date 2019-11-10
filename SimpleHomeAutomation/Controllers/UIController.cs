using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.Services;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UIController : ControllerBase
    {
        private readonly IUiService uiService;
        
        public UIController(IUiService uiService)
        {
            this.uiService = uiService;
        }

        [HttpGet]
        [Route("get")]
        public async Task<List<UIControl>> Get()
        {
            return await uiService.Get();
        }

        [HttpPost]
        [Route("save")]
        public async Task<IActionResult> Save([FromBody] UIControl uiControl)
        {
            var id = Guid.NewGuid().ToString();
            uiControl.Control.TryAdd("id", id);
            
            await uiService.Save(uiControl);
            return Ok(id);
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> Delete([FromBody] UIControlId uiControlId)
        {
            await uiService.Delete(uiControlId.Id);
            return Ok();
        }
    }
}