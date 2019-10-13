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

            logger.Log("Publishing message from a scheduled task");
            mqttPublisher.PublishMessage("scheduledJob", "scheduledJobTopic");
        }
    }
}
