using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TomoriAPI.Models;

namespace TomoriAPI.Data;

public partial class GochitamaContext : DbContext
{
    public GochitamaContext(DbContextOptions<GochitamaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseStop> CourseStops { get; set; }

    public virtual DbSet<Food> Foods { get; set; }

    public virtual DbSet<Phrase> Phrases { get; set; }

    public virtual DbSet<Shop> Shops { get; set; }

    public virtual DbSet<Thank> Thanks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Area>(entity =>
        {
            entity.Property(e => e.Code).IsFixedLength();
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Area).WithMany(p => p.Courses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_course_area");

            entity.HasOne(d => d.Food).WithMany(p => p.Courses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_course_food");
        });

        modelBuilder.Entity<CourseStop>(entity =>
        {
            entity.HasOne(d => d.Course).WithMany(p => p.CourseStops)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_course_stop_course");

            entity.HasOne(d => d.Shop).WithMany(p => p.CourseStops)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_course_stop_shop");
        });

        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasOne(d => d.Area).WithMany(p => p.Foods)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_food_area");
        });

        modelBuilder.Entity<Shop>(entity =>
        {
            entity.HasIndex(e => e.QrToken, "UX_shop_qr_token")
                .IsUnique()
                .HasFilter("([qr_token] IS NOT NULL)");

            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Area).WithMany(p => p.Shops)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_shop_area");

            entity.HasMany(d => d.Foods).WithMany(p => p.Shops)
                .UsingEntity<Dictionary<string, object>>(
                    "ShopFood",
                    r => r.HasOne<Food>().WithMany()
                        .HasForeignKey("FoodId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_shop_food_food"),
                    l => l.HasOne<Shop>().WithMany()
                        .HasForeignKey("ShopId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_shop_food_shop"),
                    j =>
                    {
                        j.HasKey("ShopId", "FoodId");
                        j.ToTable("shop_food");
                        j.IndexerProperty<int>("ShopId").HasColumnName("shop_id");
                        j.IndexerProperty<int>("FoodId").HasColumnName("food_id");
                    });
        });

        modelBuilder.Entity<Thank>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Food).WithMany(p => p.Thanks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_thanks_food");

            entity.HasOne(d => d.Phrase).WithMany(p => p.Thanks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_thanks_phrase");

            entity.HasOne(d => d.Shop).WithMany(p => p.Thanks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_thanks_shop");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
