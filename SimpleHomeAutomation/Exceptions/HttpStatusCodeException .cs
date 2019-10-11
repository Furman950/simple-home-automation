using System;

namespace SimpleHomeAutomation.Exceptions
{
    public class HttpStatusCodeException  : Exception
    {
        public int StatusCode { get; set; } = 500;

        public string ContentType { get; set; } = @"text/plain";

        public HttpStatusCodeException (int statusCode)
        {
            this.StatusCode = statusCode;
        }

        public HttpStatusCodeException (int statusCode, string message) : base(message)
        {
            this.StatusCode = statusCode;
        }
    }
}
