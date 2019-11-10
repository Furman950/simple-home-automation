using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleHomeAutomation.Models
{
    public class ScheduledTaskKey
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Group { get; set; }
    }
}
