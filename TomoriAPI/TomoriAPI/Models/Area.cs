using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("area")]
[Index("Code", Name = "UQ_area_code", IsUnique = true)]
public partial class Area
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("code")]
    [StringLength(6)]
    [Unicode(false)]
    public string Code { get; set; } = null!;

    [Column("prefecture")]
    [StringLength(10)]
    public string Prefecture { get; set; } = null!;

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("lat", TypeName = "decimal(9, 6)")]
    public decimal Lat { get; set; }

    [Column("lng", TypeName = "decimal(9, 6)")]
    public decimal Lng { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("Area")]
    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    [InverseProperty("Area")]
    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    [InverseProperty("Area")]
    public virtual ICollection<Shop> Shops { get; set; } = new List<Shop>();
}
