using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using SimpleHomeAutomation.Services;
using System.Threading.Tasks;

namespace SimpleHomeAutomation
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            IWebHost webHost = CreateWebHostBuilder(args).Build();

            using (var scope = webHost.Services.CreateScope())
            {
                var scheduledTaskService = scope.ServiceProvider.GetService<IScheduledTask>();
                await scheduledTaskService.StartScheduler();

                var mqttPublisher = scope.ServiceProvider.GetService<IMqttPublisher>();
                await mqttPublisher.SubscribeToServer();
            }

            await webHost.RunAsync();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
