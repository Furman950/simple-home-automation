using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using SimpleHomeAutomation.QuartJobs;
using SimpleHomeAutomation.Services;
using System.Diagnostics;

namespace SimpleHomeAutomation
{
    public class Startup
    {
        public MqttPublisher MqttPublisher { get; set; }
        public ScheduledTaskService ScheduledTaskService { get; set; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.Configure<MqttOptions>(Configuration.GetSection("MQTT"));

            services.AddSingleton<IScheduledTask, ScheduledTaskService>();
            services.AddTransient<ScheduledTaskJob>();
            services.AddSingleton<IMqttPublisher, MqttPublisher>();
            
            services.AddSingleton<ILogger, ConsoleLogger>();
            

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime appLifetime)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseHttpStatusCodeExceptionMiddleware();
            }
            else
            {
                app.UseHttpStatusCodeExceptionMiddleware();
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });


            appLifetime.ApplicationStarted.Register(() =>
            {
                
                ScheduledTaskService = app.ApplicationServices.GetService<IScheduledTask>() as ScheduledTaskService;
                ScheduledTaskService.StartScheduler();

                Debug.WriteLine("Application starting, subscribing to mqtt server");
                MqttPublisher = app.ApplicationServices.GetService<IMqttPublisher>() as MqttPublisher;
                MqttPublisher.SubscribeToServer();

                
            });

            appLifetime.ApplicationStopped.Register(() =>
            {
                Debug.WriteLine("Application stop, unsubscribing from mqtt server");
                ScheduledTaskService.StopScheduler();
                MqttPublisher.UnsubscribeFromServer();
                
            });
        }
    }
}
