using SimpleHomeAutomation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleHomeAutomation.Services
{
    public interface IUiService
    {
        Task Save(List<UIControl> uIControls);
        Task<List<UIControl>> Get();
    }
}
