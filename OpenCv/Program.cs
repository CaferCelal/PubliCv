using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OpenCv.DAL;
using OpenCv.Helper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(); // Adds support for API controllers and views
builder.Services.AddEndpointsApiExplorer(); // Required for API documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

// Register services for dependency injection
builder.Services.AddScoped<UserDal>(); // Scoped service for database access
builder.Services.AddSingleton<Helper>(); // Singleton service for helper methods
builder.Services.AddScoped<JWTTokenManagger>(); // Scoped service for JWT token management

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()   // Allow requests from any origin
            .AllowAnyHeader()            // Allow any header
            .AllowAnyMethod();           // Allow any HTTP method
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger only in Development environment
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = "swagger"; // Swagger UI accessible at /swagger
    });
}
else
{
    // Configure HSTS for non-development environments
    app.UseHsts(); // Adds HTTP Strict Transport Security
}

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS
app.UseStaticFiles(); // Serve static files from wwwroot
app.UseRouting(); // Enable routing
app.UseCors("AllowAll"); // Apply CORS policy
app.UseAuthorization(); // Enable authorization

// Map API controllers
app.MapControllers();

// Fallback to React's index.html for non-API routes (handles client-side routing)
app.MapFallbackToFile("index.html");

app.Run();
