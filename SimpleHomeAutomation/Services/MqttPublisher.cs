using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using SimpleHomeAutomation.Exceptions;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public class MqttPublisher : IMqttPublisher
    {
        private readonly MqttOptions mqttOptions;
        private readonly IMqttFactory mqttFactory;
        private readonly ILogger logger;
        private IMqttClient mqttClient;


        public MqttPublisher(IOptions<MqttOptions> mqttOptions, ILogger logger)
        {
            this.logger = logger;
            this.mqttOptions = mqttOptions.Value;
            mqttFactory = new MqttFactory();


            logger.Log(mqttOptions.Value.Host);
            logger.Log($"Port: {mqttOptions.Value.Port}");
        }

        public async void SubscribeToServer()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(mqttOptions.Host, mqttOptions.Port)
                .Build();

            mqttClient = mqttFactory.CreateMqttClient();

            mqttClient.UseDisconnectedHandler(async e =>
            {
                logger.Log("### DISCONNECTED FROM SERVER ###");
                await Task.Delay(TimeSpan.FromSeconds(5));

                try
                {
                    await mqttClient.ConnectAsync(options, CancellationToken.None);
                }
                catch
                {
                    logger.Log("### RECONNECTING FAILED ###");
                }
            });

            try
            {
                await mqttClient.ConnectAsync(options, CancellationToken.None);
            }
            catch
            {
                logger.Log("Failed to connect to mqtt broker");
            }
        }

        public async void UnsubscribeFromServer()
        {
            if (mqttClient.IsConnected)
            {
                await mqttClient.DisconnectAsync();
            }
        }

        public async Task PublishMessage(string message, string topic)
        {
            var mqttMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .Build();

            if (!mqttClient.IsConnected)
            {
                String errorMsg = "Cannot connect to MQTT broker(server). Usually means that the MQTT broker(server) is not running or IP address of the broker is incorrect";
                logger.Log(errorMsg);
                throw new HttpStatusCodeException(StatusCodes.Status500InternalServerError, errorMsg);
            }
                
             await mqttClient.PublishAsync(mqttMessage);
        }
    }
}
