using Quartz;
using SimpleHomeAutomation.Services;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.QuartJobs
{
    public class ScheduledTaskJob : IJob
    {
        private readonly IMqttPublisher mqttPublisher;
        private readonly ILogger logger;
        public ScheduledTaskJob(IMqttPublisher mqttPublisher, ILogger logger)
        {
            this.mqttPublisher = mqttPublisher;
            this.logger = logger;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            if (mqttPublisher is null)
            {
                return;
            }

            IJobDetail job = context.JobDetail;
            string message = job.JobDataMap.GetString(nameof(message));
            string topic = job.JobDataMap.GetString(nameof(topic));
            string name = job.Key.Name;
            string group = job.Key.Group;
            
            
            await mqttPublisher.PublishMessage(message, topic);
            logger.Log($"Published message from Taks: {name} in Group: {group}");
        }
    }
}
