using Microsoft.AspNetCore.Http;
using Quartz;
using SimpleHomeAutomation.Exceptions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace SimpleHomeAutomation.Annotations
{
    public class CronValidator : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            List<string> cronsList = value as List<string>;

            if (cronsList is null)
                return false;

            foreach(var cron in cronsList)
            {
                if (!CronExpression.IsValidExpression(cron))
                {
                    return false;
                }
            }

            return true;
        }
    }
}
