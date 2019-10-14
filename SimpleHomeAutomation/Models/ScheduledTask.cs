using SimpleHomeAutomation.Annotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleHomeAutomation.Models
{
    public class ScheduledTask
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Group { get; set; } = "Group1";

        [CronValidator(ErrorMessage = "Crons have to be in a list or one of the crons provided is invalid!")]
        public List<string> Crons { get; set; }

        [Required]
        public MQTTMessage mqttMessage { get; set; }
    }
}
