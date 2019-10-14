using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Models
{
    public class JobInfo
    {

        [Required]
        public string Name { get; set; }

        [Required]
        public string Group { get; set; } = "Group1";
    }
}
