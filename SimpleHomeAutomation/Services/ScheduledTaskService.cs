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

namespace SimpleHomeAutomation.Services
{
    public class ScheduledTaskService : IScheduledTask
    {
        #region Setup
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
        #endregion 

        public async Task CreateScheduledTask(ScheduledTask scheduleTask)
        {
            fileLogger.Log($"Creating a new Scheduled Task -> {scheduleTask.Name}");
            IJobDetail job = JobBuilder.Create<ScheduledTaskJob>()
                .WithIdentity(scheduleTask.Name, scheduleTask.Group)
                .UsingJobData(MESSAGE, scheduleTask.mqttMessage.Message)
                .UsingJobData(TOPIC, scheduleTask.mqttMessage.Topic)
                .Build();

            foreach(var cron in scheduleTask.Crons)
            {
                ITrigger trigger = TriggerBuilder.Create()
                   .WithIdentity(Guid.NewGuid().ToString(), scheduleTask.Group)
                   .StartNow()
                   .WithCronSchedule(cron)
                   .Build();

                await scheduler.ScheduleJob(job, trigger);
            }

        }

        public async Task DeleteScheduledTask(string name, string group)
        {
            var jobKey = new JobKey(name, group);
            IJobDetail jobDetail = await scheduler.GetJobDetail(jobKey);
            if (jobDetail is null)
                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, $"Job with Name: '{name}' and Group: '{group}' does not exist!");

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
            IJobDetail jobDetail = await scheduler.GetJobDetail(jobKey);
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
    }
}
