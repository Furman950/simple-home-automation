using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleHomeAutomation.Models
{
    public class UIControl
    {
        [Required]
        [JsonProperty(PropertyName="control")]
        public Dictionary<string, string> Control { get; set; }
    }
}
