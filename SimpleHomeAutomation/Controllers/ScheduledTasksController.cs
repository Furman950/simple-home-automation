using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.Services;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduledTasksController : ControllerBase
    {
        private readonly IScheduledTask scheduleTaskService;
        public ScheduledTasksController(IScheduledTask scheduleTaskService)
        {
            this.scheduleTaskService = scheduleTaskService;
        }


        [HttpGet]
        [Route("getAll")]
        public async Task<List<List<ScheduledTask>>> GetAll()
        {
            return await scheduleTaskService.GetAllScheduledTasks();
        }

        [HttpGet]
        [Route("get")]
        public async Task<ScheduledTask> Get([FromBody] JobInfo jobInfo)
        {
            return await scheduleTaskService.GetScheduledTask(jobInfo.Name, jobInfo.Group);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] ScheduledTask scheduleTask)
        {
            await scheduleTaskService.CreateScheduledTask(scheduleTask);
            return Ok();
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> Delete([FromBody] JobInfo jobInfo)
        {
            await scheduleTaskService.DeleteScheduledTask(jobInfo.Name, jobInfo.Group);
            return Ok();
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update([FromBody] ScheduledTask scheduledTask)
        {
            await scheduleTaskService.UpdateScheduledTask(scheduledTask);
            return Ok();
        }
    }
}