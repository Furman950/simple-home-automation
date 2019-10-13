using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Quartz;
using Quartz.Impl;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.QuartJobs;
using System.Linq;
using System.Threading.Tasks;
using Quartz.Impl.Matchers;

namespace SimpleHomeAutomation.Services
{
    public class ScheduledTaskService : IScheduledTask
    {

        private readonly IServiceProvider serviceProvider;
        private readonly ILogger fileLogger;
        private IScheduler scheduler;

        private const string MESSAGE = "message";
        private const string TOPIC = "topic";



        public ScheduledTaskService(IServiceProvider serviceProvider, ILogger fileLogger)
        {
            this.serviceProvider = serviceProvider;
            this.fileLogger = fileLogger;
        }
        public void StartScheduler()
        {
            NameValueCollection props = new NameValueCollection
            {
                {"quartz.serializer.type", "binary" }
            };
            StdSchedulerFactory factory = new StdSchedulerFactory(props);


            scheduler = factory.GetScheduler().Result;
            scheduler.JobFactory = new JobFactory(serviceProvider);
            scheduler.Start();
        }

        public async void StopScheduler()
        {
            if (scheduler is null)
            {
                return;
            }

            await scheduler.Shutdown();
        }
        public void CreateScheduledTask(ScheduledTask scheduleTask)
        {
            fileLogger.Log($"Creating a new Scheduled Task -> {scheduleTask.Name}");
            IJobDetail job = JobBuilder.Create<ScheduledTaskJob>()
                .WithIdentity(scheduleTask.Name, scheduleTask.Group)
                .UsingJobData(MESSAGE, scheduleTask.mqttMessage.Message)
                .UsingJobData(TOPIC, scheduleTask.mqttMessage.Topic)
                .Build();

            Action<string> action = cron =>
            {
                ITrigger trigger = TriggerBuilder.Create()
                   .WithIdentity(Guid.NewGuid().ToString(), scheduleTask.Group)
                   .StartNow()
                   .WithCronSchedule(cron)
                   .Build();

                scheduler.ScheduleJob(job, trigger);

            };

            scheduleTask.Crons.ForEach(action);
            
        }

        public void DeleteScheduledTask(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<List<ScheduledTask>>> GetAllScheduledTasks()
        {
            List<List<ScheduledTask>> listOfScheduledTasksList = new List<List<ScheduledTask>>();

            IReadOnlyCollection<string> groups = await scheduler.GetJobGroupNames();


            foreach (string group in groups)
            {
                var groupMatcher = GroupMatcher<JobKey>.GroupContains(group);
                var jobKeys = await scheduler.GetJobKeys(groupMatcher);

                var list = new List<ScheduledTask>();

                foreach (var jobKey in jobKeys)
                {
                    var detail = await scheduler.GetJobDetail(jobKey);
                    var triggers = await scheduler.GetTriggersOfJob(jobKey);

                    var triggerList = new List<string>();
                    
                    foreach (ICronTrigger trigger in triggers)
                    {
                        
                        triggerList.Add(trigger.CronExpressionString);
                    }

                    list.Add(new ScheduledTask
                    {
                        Name = jobKey.Name,
                        Group = group,
                        Crons = triggerList,
                        mqttMessage = new MQTTMessage
                        {
                            Message = detail.JobDataMap.GetString(MESSAGE),
                            Topic = detail.JobDataMap.GetString(TOPIC)
                        }

                    });
                }

                listOfScheduledTasksList.Add(list);
            }

            return listOfScheduledTasksList;

        }

        public ScheduledTask GetScheduledTask(string id)
        {
            throw new NotImplementedException();
        }

        public void UpdateScheduledTask(ScheduledTask scheduleTask)
        {
            throw new NotImplementedException();
        }
    }
}
