using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using SimpleHomeAutomation.Exceptions;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SimpleHomeAutomation
{
    public class HttpStatusCodeExceptionMiddleware
    {
        private readonly RequestDelegate next;

        public HttpStatusCodeExceptionMiddleware(RequestDelegate next)
        {
            this.next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            } catch(HttpStatusCodeException ex)
            {
                if (context.Response.HasStarted)
                {
                    Debug.WriteLine("The response has already started, the http status code middleware will not be executed.");
                    throw;
                }

                context.Response.Clear();
                context.Response.StatusCode = ex.StatusCode;
                context.Response.ContentType = ex.ContentType;

                await context.Response.WriteAsync(ex.Message);

                return;
            }
        }
    }

    public static class HttpStatusCodeExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseHttpStatusCodeExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpStatusCodeExceptionMiddleware>();
        }
    }
}
