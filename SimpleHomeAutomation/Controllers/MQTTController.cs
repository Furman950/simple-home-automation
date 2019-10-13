using Microsoft.AspNetCore.Mvc;
using SimpleHomeAutomation.Models;
using SimpleHomeAutomation.Services;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MQTTController : ControllerBase
    {

        private readonly IMqttPublisher mqttPublisher;
        public MQTTController(IMqttPublisher mqttPublisher)
        {
            this.mqttPublisher = mqttPublisher;
        }

        [HttpPost]
        [Route("publish")]
        public async Task<IActionResult> Publish([FromBody] MQTTMessage mqttMessage)
        {
            await mqttPublisher.PublishMessage(mqttMessage.Message, mqttMessage.Topic);
            return Ok();
        }
    }
}