using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public async Task<Dictionary<string, List<ScheduledTask>>> GetAll()
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
            if (scheduleTask.Interval == 0)
                await scheduleTaskService.CreateScheduledTask(scheduleTask);
            else
                await scheduleTaskService.CreateSimpleScheduledTask(scheduleTask);

            await scheduleTaskService.Persist();
            return Ok();
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> Delete([FromBody] JobInfo jobInfo)
        {
            await scheduleTaskService.DeleteScheduledTask(jobInfo.Name, jobInfo.Group);
            await scheduleTaskService.Persist();
            return Ok();
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update([FromBody] ScheduledTask scheduledTask)
        {
            await scheduleTaskService.UpdateScheduledTask(scheduledTask);
            await scheduleTaskService.Persist();
            return Ok();
        }

        [HttpPut]
        [Route("resume")]
        public async Task<IActionResult> Resume([FromBody] ScheduledTaskKey key)
        {
            await scheduleTaskService.ResumeScheduledTask(key.Name, key.Group);
            await scheduleTaskService.Persist();
            return Ok();
        }

        [HttpPut]
        [Route("pause")]
        public async Task<IActionResult> Pause([FromBody] ScheduledTaskKey key)
        {
            await scheduleTaskService.PauseScheduledTask(key.Name, key.Group);
            await scheduleTaskService.Persist();
            return Ok();
        }

    }
}