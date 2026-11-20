using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TomoriAPI.Models;

[Table("thanks")]
[Index("AnonId", "ShopId", "CreatedAt", Name = "IX_thanks_anon")]
[Index("FoodId", Name = "IX_thanks_food")]
[Index("ShopId", Name = "IX_thanks_shop")]
public partial class Thank
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("shop_id")]
    public int ShopId { get; set; }

    [Column("food_id")]
    public int FoodId { get; set; }

    [Column("phrase_id")]
    public int PhraseId { get; set; }

    [Column("comment")]
    [StringLength(100)]
    public string? Comment { get; set; }

    [Column("by_qr")]
    public bool ByQr { get; set; }

    [Column("anon_id")]
    [StringLength(64)]
    [Unicode(false)]
    public string AnonId { get; set; } = null!;

    [Column("created_at")]
    [Precision(0)]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("FoodId")]
    [InverseProperty("Thanks")]
    public virtual Food Food { get; set; } = null!;

    [ForeignKey("PhraseId")]
    [InverseProperty("Thanks")]
    public virtual Phrase Phrase { get; set; } = null!;

    [ForeignKey("ShopId")]
    [InverseProperty("Thanks")]
    public virtual Shop Shop { get; set; } = null!;
}
