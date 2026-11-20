using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("shop")]
[Index("AreaId", Name = "IX_shop_area")]
[Index("Lat", "Lng", Name = "IX_shop_latlng")]
public partial class Shop
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("area_id")]
    public int AreaId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("kind")]
    [StringLength(10)]
    [Unicode(false)]
    public string Kind { get; set; } = null!;

    [Column("lat", TypeName = "decimal(9, 6)")]
    public decimal Lat { get; set; }

    [Column("lng", TypeName = "decimal(9, 6)")]
    public decimal Lng { get; set; }

    [Column("comment")]
    [StringLength(200)]
    public string? Comment { get; set; }

    [Column("qr_token")]
    [StringLength(64)]
    [Unicode(false)]
    public string? QrToken { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime UpdatedAt { get; set; }

    [Column("address")]
    [StringLength(200)]
    public string? Address { get; set; }

    [ForeignKey("AreaId")]
    [InverseProperty("Shops")]
    public virtual Area Area { get; set; } = null!;

    [InverseProperty("Shop")]
    public virtual ICollection<CourseStop> CourseStops { get; set; } = new List<CourseStop>();

    [InverseProperty("Shop")]
    public virtual ICollection<Thank> Thanks { get; set; } = new List<Thank>();

    [ForeignKey("ShopId")]
    [InverseProperty("Shops")]
    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();
}
