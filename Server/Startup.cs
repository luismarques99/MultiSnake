using System;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using Server.Api.Data;
using Server.Api.Data.Users;
using Server.Api.Helpers;
using Server.Game;
using WebSocketManager;

namespace Server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public static SnakeHandler SnakeHandler { get; set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddWebSocketManager();

            services.AddCors();

            var apiConnectionString = Configuration.GetConnectionString("MultiSnakeAPI_Connection");
            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(apiConnectionString));

            services.AddControllers().AddNewtonsoftJson(serializer =>
                serializer.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddScoped<IUserRepository, SqlUserRepository>();

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            services.AddSwaggerGen(swagger =>
            {
                swagger.SwaggerDoc("v1", new OpenApiInfo {Title = "MultiSnake API", Version = "v1"});
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseWebSockets();
            app.MapWebSocketManager("/server", serviceProvider.GetService<SnakeHandler>());

            app.UseSwagger();
            app.UseSwaggerUI(swagger =>
            {
                swagger.SwaggerEndpoint("/swagger/v1/swagger.json", "MultiSnake API v1");
                swagger.RoutePrefix = string.Empty;
            });
            
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(policy => policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            SnakeHandler = serviceProvider.GetService<SnakeHandler>();
            GameManager.Instance.Initialize();
        }
    }
}