using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[PrimaryKey("CourseId", "StopNo")]
[Table("course_stop")]
public partial class CourseStop
{
    [Key]
    [Column("course_id")]
    public int CourseId { get; set; }

    [Key]
    [Column("stop_no")]
    public int StopNo { get; set; }

    [Column("shop_id")]
    public int ShopId { get; set; }

    [ForeignKey("CourseId")]
    [InverseProperty("CourseStops")]
    public virtual Course Course { get; set; } = null!;

    [ForeignKey("ShopId")]
    [InverseProperty("CourseStops")]
    public virtual Shop Shop { get; set; } = null!;
}
