using Microsoft.AspNetCore.Mvc;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.Services;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MQTTController : ControllerBase
    {

        private readonly IMqttPublisher _mqttPublisher;
        public MQTTController(IMqttPublisher mqttPublisher)
        {
            _mqttPublisher = mqttPublisher;
        }

        [HttpPost]
        [Route("publish")]
        public IActionResult Publish([FromBody] MQTTMessage mqttMessage)
        {
            _mqttPublisher.PublishMessage(mqttMessage.Message, mqttMessage.Topic);
            return Ok();
        }
    }
}