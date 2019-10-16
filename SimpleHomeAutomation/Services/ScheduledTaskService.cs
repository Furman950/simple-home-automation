using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Quartz;
using Quartz.Impl;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.QuartJobs;
using System.Threading.Tasks;
using Quartz.Impl.Matchers;
using SimpleHomeAutomation.Exceptions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace SimpleHomeAutomation.Services
{
    public class ScheduledTaskService : IScheduledTask
    {
        #region Setup
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger logger;
        private readonly string filePath;
        private IScheduler scheduler;

        private const string MESSAGE = "message";
        private const string TOPIC = "topic";

        public ScheduledTaskService(IServiceProvider serviceProvider, ILogger logger, IWebHostEnvironment webHostEnvironment)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
            this.filePath = Path.Combine(webHostEnvironment.ContentRootPath, "config", "scheduledTasks.json");

            Directory.CreateDirectory(Path.Combine(webHostEnvironment.ContentRootPath, "config"));
            if (!File.Exists(this.filePath))
            {
                File.Create(this.filePath).Close();
            }
        }
        public async Task StartScheduler()
        {
            NameValueCollection props = new NameValueCollection
            {
                {"quartz.serializer.type", "binary" }
            };
            StdSchedulerFactory factory = new StdSchedulerFactory(props);


            scheduler = factory.GetScheduler().Result;
            scheduler.JobFactory = new JobFactory(serviceProvider);
            await scheduler.Start();
            await StartUpPersistedJobs();
        }

        private async Task StartUpPersistedJobs()
        {
            string json;

            using StreamReader reader = File.OpenText(this.filePath);
            json = reader.ReadToEnd();
            if (string.IsNullOrWhiteSpace(json))
            {
                logger.Log("No Scheduled Tasks found");
                return;
            }

            List<List<ScheduledTask>> scheduledTasksList = JsonConvert.DeserializeObject<List<List<ScheduledTask>>>(json);

            foreach (var list in scheduledTasksList)
            {
                foreach (var scheduledTask in list)
                {
                    await CreateScheduledTask(scheduledTask);
                }
            }
        }

        public async Task StopScheduler()
        {
            if (scheduler is null)
            {
                return;
            }

            await scheduler.Shutdown();
        }
        #endregion 

        public async Task CreateScheduledTask(ScheduledTask scheduleTask)
        {
            if (await JobExists(scheduleTask.Name, scheduleTask.Group))
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Job with Name: '{scheduleTask.Name}' and Group: '{scheduleTask.Group}' already exist!");
                
            logger.Log($"Creating Scheduled Task -> {scheduleTask.Name}");
            IJobDetail job = JobBuilder.Create<ScheduledTaskJob>()
                .WithIdentity(scheduleTask.Name, scheduleTask.Group)
                .UsingJobData(MESSAGE, scheduleTask.mqttMessage.Message)
                .UsingJobData(TOPIC, scheduleTask.mqttMessage.Topic)
                .Build();

            foreach (var cron in scheduleTask.Crons)
            {
                ITrigger trigger = TriggerBuilder.Create()
                   .WithIdentity(Guid.NewGuid().ToString(), scheduleTask.Group)
                   .StartNow()
                   .WithCronSchedule(cron)
                   .Build();

                logger.Log($"Scheduling job -> With Name: '{scheduleTask.Name}', Group: '{scheduleTask.Group}");
                await scheduler.ScheduleJob(job, trigger);
            }
        }

        public async Task DeleteScheduledTask(string name, string group)
        {
            bool jobExists = await JobExists(name, group);
            if (!jobExists)
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Job with Name: '{name}' and Group: '{group}' does not exist!");
            var jobKey = new JobKey(name, group);
            await scheduler.DeleteJob(jobKey);
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
                    var jobDetail = await scheduler.GetJobDetail(jobKey);
                    var triggers = await scheduler.GetTriggersOfJob(jobKey);

                    var cronsList = new List<string>();

                    foreach (ICronTrigger trigger in triggers)
                    {

                        cronsList.Add(trigger.CronExpressionString);
                    }

                    list.Add(new ScheduledTask
                    {
                        Name = jobKey.Name,
                        Group = group,
                        Crons = cronsList,
                        mqttMessage = new MQTTMessage
                        {
                            Message = jobDetail.JobDataMap.GetString(MESSAGE),
                            Topic = jobDetail.JobDataMap.GetString(TOPIC)
                        }

                    });
                }

                listOfScheduledTasksList.Add(list);
            }

            return listOfScheduledTasksList;

        }

        public async Task<ScheduledTask> GetScheduledTask(string name, string group)
        {
            JobKey jobKey = new JobKey(name, group);
            IJobDetail jobDetail = await scheduler.GetJobDetail(jobKey) ??
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Job with Name: '{name}' and Group: '{group}' does not exist!");

            var triggers = await scheduler.GetTriggersOfJob(jobKey);
            var cronsList = new List<string>();

            foreach (ICronTrigger trigger in triggers)
            {
                cronsList.Add(trigger.CronExpressionString);
            }

            return new ScheduledTask
            {
                Name = name,
                Group = group,
                Crons = cronsList,
                mqttMessage = new MQTTMessage
                {
                    Message = jobDetail.JobDataMap.GetString(MESSAGE),
                    Topic = jobDetail.JobDataMap.GetString(TOPIC)
                }
            };
        }

        public async Task UpdateScheduledTask(ScheduledTask scheduleTask)
        {
            await DeleteScheduledTask(scheduleTask.Name, scheduleTask.Group);
            await CreateScheduledTask(scheduleTask);
        }
        public async Task Persist()
        {
            logger.Log("Persisting Scheduled Tasks");
            List<List<ScheduledTask>> scheduledTasks = await GetAllScheduledTasks();
            string json = JsonConvert.SerializeObject(scheduledTasks);

            using StreamWriter writer = File.CreateText(this.filePath);
            await writer.WriteAsync(json);
        }

        public async Task<bool> JobExists(string name, string group)
        {
            return await scheduler.CheckExists(new JobKey(name, group));
        }
    }
}
