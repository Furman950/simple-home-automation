using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Quartz;
using Quartz.Impl;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.QuartJobs;

namespace SimpleHomeAutomation.Services
{
    public class ScheduledTaskService : IScheduledTask
    {

        private readonly IServiceProvider serviceProvider;
        private readonly ILogger fileLogger;
        private IScheduler scheduler;
        


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
                .WithIdentity("myTestJob", "group1")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("myTrigger", "group1")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInSeconds(3).RepeatForever())
                .Build();

            scheduler.ScheduleJob(job, trigger); 
        }

        public void DeleteScheduledTask(string id)
        {
            throw new NotImplementedException();
        }

        public List<ScheduledTask> GetAllScheduledTasks()
        {
            throw new NotImplementedException();
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
