using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("course")]
[Index("AreaId", Name = "IX_course_area")]
[Index("FoodId", Name = "IX_course_food")]
public partial class Course
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("area_id")]
    public int AreaId { get; set; }

    [Column("food_id")]
    public int FoodId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("description")]
    [StringLength(400)]
    public string? Description { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("AreaId")]
    [InverseProperty("Courses")]
    public virtual Area Area { get; set; } = null!;

    [InverseProperty("Course")]
    public virtual ICollection<CourseStop> CourseStops { get; set; } = new List<CourseStop>();

    [ForeignKey("FoodId")]
    [InverseProperty("Courses")]
    public virtual Food Food { get; set; } = null!;
}
