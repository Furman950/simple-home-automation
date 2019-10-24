using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleHomeAutomation.Models
{
    public class UIControl
    {
        [Required]
        [JsonProperty(PropertyName = "component")]
        public string Component { get; set; }

        [Required]
        [JsonProperty(PropertyName = "data")]
        public Dictionary<string, string> Data { get; set; }
    }
}
