using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleHomeAutomation.Models
{
    public class UIControl
    {
        [Required]
        public string Type { get; set; }

        [Required]
        public MQTTMessage MqttMessage { get; set; }

        [Required]
        public Dictionary<string, string> Attributes { get; set; }
    }
}
