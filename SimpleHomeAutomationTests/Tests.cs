using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using SimpleHomeAutomation.Exceptions;
using SimpleHomeAutomation.Services;
using System.Threading.Tasks;

namespace SimpleHomeAutomationTests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public async Task PublishMessage_InvalidHost_ThrowsHttpStatusCodeException()
        {
            MqttOptions options = new MqttOptions { Host = "0.0.0.0", Port = 1883 };
            IOptions<MqttOptions> mqttOptions = Options.Create(options);
            
            MqttPublisher mqttPublisher = new MqttPublisher(mqttOptions, new ConsoleLogger());
            await mqttPublisher.SubscribeToServer();

            var exception = Assert.ThrowsAsync<HttpStatusCodeException>( () => mqttPublisher.PublishMessage("thisShouldFail", "this/should/fail"));

            Assert.That(exception.StatusCode, Is.EqualTo(StatusCodes.Status500InternalServerError));

        }
    }
}