using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("phrase")]
public partial class Phrase
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("text")]
    [StringLength(50)]
    public string Text { get; set; } = null!;

    [InverseProperty("Phrase")]
    public virtual ICollection<Thank> Thanks { get; set; } = new List<Thank>();
}
