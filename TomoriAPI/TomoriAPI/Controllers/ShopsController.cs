
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TomoriAPI.Data;

namespace TomoriAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopsController : ControllerBase
    {
        private readonly GochitamaContext _context;

        public ShopsController(GochitamaContext context)
        {
            _context = context;
        }

        // 店舗一覧
        [HttpGet]
        public async Task<IActionResult> GetShops()
        {
            var shops = await _context.Shops
                .AsNoTracking()
                .OrderBy(s => s.Id)
                .Select(s => new
                {
                    id = s.Id,
                    areaId = s.AreaId,
                    name = s.Name,
                    address = s.Address,
                    kind = s.Kind,
                    lat = s.Lat,
                    lng = s.Lng,
                    comment = s.Comment,
                    foods = s.Foods.Select(f => f.Name).ToList()
                })
                .ToListAsync();

            return Ok(shops);
        }

        // 店舗詳細
        [HttpGet("{id}")]
        public async Task<IActionResult> GetShop(int id)
        {
            var shop = await _context.Shops
                .AsNoTracking()
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    id = s.Id,
                    areaId = s.AreaId,
                    name = s.Name,
                    address = s.Address,
                    kind = s.Kind,
                    lat = s.Lat,
                    lng = s.Lng,
                    comment = s.Comment,
                    foods = s.Foods.Select(f => f.Name).ToList()
                })
                .FirstOrDefaultAsync();

            if (shop == null)
            {
                return NotFound();
            }

            return Ok(shop);
        }
    }
}
