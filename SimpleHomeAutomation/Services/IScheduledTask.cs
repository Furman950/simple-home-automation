﻿using SimpleHomeAutomation.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public interface IScheduledTask
    {
        Task<List<List<ScheduledTask>>> GetAllScheduledTasks();
        Task<ScheduledTask> GetScheduledTask(string name, string group);
        Task CreateScheduledTask(ScheduledTask scheduleTask);
        Task DeleteScheduledTask(string name, string group);
        Task UpdateScheduledTask(ScheduledTask scheduleTask);
        Task Persist();
    }
}
