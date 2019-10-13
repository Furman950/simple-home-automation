using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.Services;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduledTasksController : ControllerBase
    {
        private readonly IScheduledTask _scheduleTaskService;
        public ScheduledTasksController(IScheduledTask scheduleTaskService)
        {
            _scheduleTaskService = scheduleTaskService;
        }

        [HttpGet]
        public List<ScheduledTask> GetAll()
        {
            return _scheduleTaskService.GetAllScheduledTasks();
        }

        [HttpGet]
        public ScheduledTask Get(string id)
        {
            return _scheduleTaskService.GetScheduledTask(id);
        }

        [HttpPost]
        [Route("create")]
        public IActionResult Create(ScheduledTask scheduleTask)
        {
            _scheduleTaskService.CreateScheduledTask(scheduleTask);
            return Ok();
        }
    }
}