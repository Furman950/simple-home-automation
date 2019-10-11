using SimpleHomeAutomation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public interface IScheduledTask
    {
        List<ScheduledTask> GetAllScheduledTasks();
        ScheduledTask GetScheduledTask(string id);
        void CreateScheduledTask(ScheduledTask scheduleTask);
        void DeleteScheduledTask(string id);
        void UpdateScheduledTask(ScheduledTask scheduleTask);
    }
}
