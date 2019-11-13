using SimpleHomeAutomation.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public interface IScheduledTask
    {
        Task<Dictionary<string, List<ScheduledTask>>> GetAllScheduledTasks();
        Task<ScheduledTask> GetScheduledTask(string name, string group);
        Task CreateScheduledTask(ScheduledTask scheduleTask);
        Task CreateSimpleScheduledTask(ScheduledTask scheduledTask);
        Task DeleteScheduledTask(string name, string group);
        Task UpdateScheduledTask(ScheduledTask scheduleTask);
        Task ResumeScheduledTask(string name, string group);
        Task PauseScheduledTask(string name, string group);
        Task Persist();

        Task StartScheduler();
        Task StopScheduler();
    }
}
