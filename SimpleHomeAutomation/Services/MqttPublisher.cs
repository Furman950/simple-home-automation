using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public class MqttPublisher : IMqttPublisher
    {
        private readonly MqttOptions _mqttOptions;
        private readonly IMqttFactory _mqttFactory;
        private IMqttClient _mqttClient;


        public MqttPublisher(IOptions<MqttOptions> mqttOptions)
        {
            _mqttOptions = mqttOptions.Value;
            _mqttFactory = new MqttFactory();

            Debug.WriteLine(mqttOptions.Value.Host);
            Debug.WriteLine(mqttOptions.Value.Port);
        }

        public async void SubscribeToServer()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(_mqttOptions.Host, _mqttOptions.Port)
                .Build();

            _mqttClient = _mqttFactory.CreateMqttClient();

            await _mqttClient.ConnectAsync(options, CancellationToken.None);

            _mqttClient.UseDisconnectedHandler(async e =>
           {
               Debug.WriteLine("### DISCONNECTED FROM SERVER ###");
               await Task.Delay(TimeSpan.FromSeconds(5));

               try
               {
                   await _mqttClient.ConnectAsync(options, CancellationToken.None);
               }
               catch
               {
                   Debug.WriteLine("### RECONNECTING FAILED ###");
               }
           });

        }

        public async void UnsubscribeFromServer()
        {
            await _mqttClient.DisconnectAsync();
        }

        public void PublishMessage(string message, string topic)
        {
            var mqttMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .Build();

            _mqttClient.PublishAsync(mqttMessage);
        }
    }
}
