using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Models
{
    public class UIControlId
    {
        [Required]
        public string Id { get; set; }
    }
}
