using System.Net.Http;
using System.Text.Encodings.Web;
using VantBlazor;
using VantBlazor.JsInterop;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddVantBlazor(this IServiceCollection services)
        {
            services.TryAddSingleton<HttpClient>();
            services.TryAddScoped<DomEventService>();
            services.TryAddScoped(sp => new HtmlRenderService(new HtmlRenderer(sp, sp.GetRequiredService<ILoggerFactory>(),
                        s => HtmlEncoder.Default.Encode(s)))
            );

            services.TryAddScoped<VantNotifyService>();

            return services;
        }
    }
}
