using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Disconnecting;
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

            try
            {
                await _mqttClient.ConnectAsync(options, CancellationToken.None);
            }
            catch
            {
                Debug.WriteLine("Failed to connect to mqtt broker");
            }
        }

        public async void UnsubscribeFromServer()
        {
            if (_mqttClient.IsConnected)
            {
                await _mqttClient.DisconnectAsync();
            }
        }

        public void PublishMessage(string message, string topic)
        {
            var mqttMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .Build();

            if (!_mqttClient.IsConnected)
                throw new HttpStatusCodeException(StatusCodes.Status500InternalServerError, "Cannot connect to MQTT broker(server). Usually means that the MQTT broker(server) is not running");

            _mqttClient.PublishAsync(mqttMessage);
        }
    }
}
