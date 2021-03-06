﻿using System;
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
            json = await reader.ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(json))
            {
                logger.Log("No Scheduled Tasks found");
                return;
            }

            Dictionary<string, List<ScheduledTask>> scheduledTaskMap = JsonConvert.DeserializeObject<Dictionary<string, List<ScheduledTask>>>(json);

            foreach (var scheduledTaskList in scheduledTaskMap.Values)
            {
                foreach (var scheduledTask in scheduledTaskList)
                {
                    if (scheduledTask.Crons.Count == 0)
                    {
                        await CreateSimpleScheduledTask(scheduledTask);
                    }
                    else
                    {
                        await CreateScheduledTask(scheduledTask);
                    }
                    
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

        public async Task CreateScheduledTask(ScheduledTask scheduledTask)
        {
            if (await JobExists(scheduledTask.Name, scheduledTask.Group))
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{scheduledTask.Name}' and Group: '{scheduledTask.Group}' already exist!");

            logger.Log($"Creating Scheduled Task -> {scheduledTask.Name}");
            IJobDetail job = JobBuilder.Create<ScheduledTaskJob>()
                .WithIdentity(scheduledTask.Name, scheduledTask.Group)
                .UsingJobData(MESSAGE, scheduledTask.mqttMessage.Message)
                .UsingJobData(TOPIC, scheduledTask.mqttMessage.Topic)
                .Build();

            foreach (var cron in scheduledTask.Crons)
            {
                ITrigger trigger = TriggerBuilder.Create()
                   .WithIdentity(Guid.NewGuid().ToString(), scheduledTask.Group)
                   .StartNow()
                   .WithCronSchedule(cron, x => x.WithMisfireHandlingInstructionDoNothing())
                   .Build();
                logger.Log($"Scheduling job -> With Name: '{scheduledTask.Name}', Group: '{scheduledTask.Group}");
                await scheduler.ScheduleJob(job, trigger);

                if (scheduledTask.Status == 0)
                    await PauseScheduledTask(scheduledTask.Name, scheduledTask.Group);
            }
        }

        public async Task CreateSimpleScheduledTask(ScheduledTask scheduledTask)
        {
            if (await JobExists(scheduledTask.Name, scheduledTask.Group))
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{scheduledTask.Name}' and Group: '{scheduledTask.Group}' already exist!");

            logger.Log($"Creating Simple Scheduled Task -> {scheduledTask.Name}");
            IJobDetail job = JobBuilder.Create<ScheduledTaskJob>()
                .WithIdentity(scheduledTask.Name, scheduledTask.Group)
                .UsingJobData(MESSAGE, scheduledTask.mqttMessage.Message)
                .UsingJobData(TOPIC, scheduledTask.mqttMessage.Topic)
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity(Guid.NewGuid().ToString(), scheduledTask.Group)
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(scheduledTask.Interval)
                    .WithMisfireHandlingInstructionIgnoreMisfires()
                    .RepeatForever())
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }

        public async Task DeleteScheduledTask(string name, string group)
        {
            bool jobExists = await JobExists(name, group);
            if (!jobExists)
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{name}' and Group: '{group}' does not exist!");
            var jobKey = new JobKey(name, group);
            await scheduler.DeleteJob(jobKey);
        }

        public async Task<Dictionary<string, List<ScheduledTask>>> GetAllScheduledTasks()
        {
            Dictionary<string, List<ScheduledTask>> map = new Dictionary<string, List<ScheduledTask>>();

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
                    int status = 0;
                    int simpleTriggerInterval = -1;

                    foreach (var trigger in triggers)
                    {
                        ISimpleTrigger simpleTrigger = trigger as ISimpleTrigger;
                        if (simpleTrigger != null)
                        {
                            simpleTriggerInterval = (int)simpleTrigger.RepeatInterval.TotalSeconds;
                            var triggerState = await scheduler.GetTriggerState(simpleTrigger.Key);
                            status = triggerState == TriggerState.Paused ? 0 : 1;
                        }
                        else
                        {
                            ITrigger triggerKey = trigger as ITrigger;
                            var triggerState = await scheduler.GetTriggerState(triggerKey.Key);
                            status = triggerState == TriggerState.Paused ? 0 : 1;


                            ICronTrigger cronTrigger = trigger as ICronTrigger;
                            cronsList.Add(cronTrigger.CronExpressionString);
                        }
                    }

                    list.Add(new ScheduledTask
                    {
                        Name = jobKey.Name,
                        Group = group,
                        Crons = cronsList,
                        Status = status,
                        Interval = simpleTriggerInterval,
                        mqttMessage = new MQTTMessage
                        {
                            Message = jobDetail.JobDataMap.GetString(MESSAGE),
                            Topic = jobDetail.JobDataMap.GetString(TOPIC)
                        }

                    });
                }
                map.Add(group, list);
            }

            return map;

        }

        public async Task<ScheduledTask> GetScheduledTask(string name, string group)
        {
            JobKey jobKey = new JobKey(name, group);
            IJobDetail jobDetail = await scheduler.GetJobDetail(jobKey) ??
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{name}' and Group: '{group}' does not exist!");

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

        public async Task ResumeScheduledTask(string name, string group)
        {
            bool jobExists = await JobExists(name, group);
            if (!jobExists)
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{name}' and Group: '{group}' does not exist!");


            JobKey jobKey = new JobKey(name, group);
            var triggers = await scheduler.GetTriggersOfJob(jobKey);

            foreach (var trigger in triggers)
            {
                await scheduler.ResumeTrigger(trigger.Key);
            }
        }

        public async Task PauseScheduledTask(string name, string group)
        {
            bool jobExists = await JobExists(name, group);
            if (!jobExists)
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Scheduled Task with Name: '{name}' and Group: '{group}' does not exist!");

            JobKey jobKey = new JobKey(name, group);

            var triggers = await scheduler.GetTriggersOfJob(jobKey);
            foreach (var trigger in triggers)
            {
                await scheduler.PauseTrigger(trigger.Key);
            }
        }
        public async Task Persist()
        {
            logger.Log("Persisting Scheduled Tasks");
            Dictionary<string, List<ScheduledTask>> scheduledTasks = await GetAllScheduledTasks();
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
