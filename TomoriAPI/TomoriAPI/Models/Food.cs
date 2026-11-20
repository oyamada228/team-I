using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("food")]
[Index("AreaId", Name = "IX_food_area")]
public partial class Food
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("area_id")]
    public int AreaId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("origin")]
    [StringLength(400)]
    public string? Origin { get; set; }

    [Column("source")]
    [StringLength(200)]
    public string? Source { get; set; }

    [ForeignKey("AreaId")]
    [InverseProperty("Foods")]
    public virtual Area Area { get; set; } = null!;

    [InverseProperty("Food")]
    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    [InverseProperty("Food")]
    public virtual ICollection<Thank> Thanks { get; set; } = new List<Thank>();

    [ForeignKey("FoodId")]
    [InverseProperty("Foods")]
    public virtual ICollection<Shop> Shops { get; set; } = new List<Shop>();
}
