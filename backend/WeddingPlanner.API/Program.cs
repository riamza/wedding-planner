using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WeddingPlanner.API.Hubs;
using WeddingPlanner.Application.Interfaces;
using WeddingPlanner.Application.Services;
using WeddingPlanner.Domain.Entities;
using WeddingPlanner.Domain.Interfaces;
using WeddingPlanner.Infrastructure.Data;
using WeddingPlanner.Infrastructure.Repositories;
using WeddingPlanner.Infrastructure.Services;
using WeddingPlanner.API.Middleware;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load .env file from root
try
{
    var currentDir = Directory.GetCurrentDirectory();
    var envPath = Path.Combine(currentDir, ".env");
    
    // Traverse up to find .env if not in current directory (useful when running from Visual Studio / backend subfolder)
    while (!File.Exists(envPath))
    {
        var parent = Directory.GetParent(currentDir);
        if (parent == null) break;
        currentDir = parent.FullName;
        envPath = Path.Combine(currentDir, ".env");
    }

    if (File.Exists(envPath))
    {
        DotNetEnv.Env.Load(envPath);
    }
}
catch (Exception)
{
    // Ignore if not found, rely on environment variables directly
}

// Build connection string from env
var dbHost = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
var dbPort = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";
var dbName = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "weddingplanner";
var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
var dbPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "postgres";
var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Enable JWT authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
    };
});

builder.Services.AddAuthorization();

// Repositories
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IGuestRepository, GuestRepository>();
builder.Services.AddScoped<ITableRepository, TableRepository>();
builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IGiftRepository, GiftRepository>();
builder.Services.AddScoped<IPhotoRepository, PhotoRepository>();

// Services
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IGuestService, GuestService>();
builder.Services.AddScoped<ISeatingService, SeatingService>();
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IGiftService, GiftService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Cloudinary
var cloudinaryUrl = Environment.GetEnvironmentVariable("CLOUDINARY_URL");
var cloudinary = string.IsNullOrEmpty(cloudinaryUrl) 
    ? new CloudinaryDotNet.Cloudinary(new CloudinaryDotNet.Account("demo", "demo", "demo")) 
    : new CloudinaryDotNet.Cloudinary(cloudinaryUrl);
    
builder.Services.AddSingleton<ICloudinaryService>(sp => 
    new CloudinaryServiceImpl(cloudinary));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GalleryHub>("/hubs/gallery");

// Auto-create database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();
