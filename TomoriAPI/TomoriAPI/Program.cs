
using Microsoft.EntityFrameworkCore;
using TomoriAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// SQL Serverとの接続設定
builder.Services.AddDbContext<GochitamaContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// APIの設定
builder.Services.AddControllers();

// CORS設定（開発中のフロントエンド接続用）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Swaggerの設定
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORSを有効にする
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
