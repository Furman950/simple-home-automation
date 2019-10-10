using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MQTTnet.Client.Publishing;
using MQTTnet.Exceptions;
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
        [Route("Publish")]
        public async Task<IActionResult> Publish([FromBody] MQTTMessage mqttMessage)
        {
            Task<MqttClientPublishResult> publishingTask = null;
            try
            {
                publishingTask  = _mqttPublisher.PublishMessage(mqttMessage.Message, mqttMessage.Topic);
                publishingTask.Wait();
                if (publishingTask.Result.ReasonCode == MqttClientPublishReasonCode.Success)
                {
                    return Ok();
                }

            } catch(MqttCommunicationException ex) {
                Debug.WriteLine(ex.ToString());
                Debug.WriteLine(ex.Message);
            }

            return StatusCode(502, $"Failed to publish '{mqttMessage.Message}' on topic '${mqttMessage.Topic}': {publishingTask.Result.ReasonCode}");
        }
    }
}