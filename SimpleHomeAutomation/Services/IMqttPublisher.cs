using MQTTnet.Client.Publishing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public interface IMqttPublisher
    {
        void PublishMessage(string message, string topic);
    }
}
