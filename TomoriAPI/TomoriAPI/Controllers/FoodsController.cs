
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TomoriAPI.Data;

namespace TomoriAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodsController : ControllerBase
    {
        private readonly GochitamaContext _context;

        public FoodsController(GochitamaContext context)
        {
            _context = context;
        }

        // 郷土料理一覧を取得
        [HttpGet]
        public async Task<IActionResult> GetFoods()
        {
            var foods = await _context.Foods
                .AsNoTracking()
                .OrderBy(f => f.Id)
                .Select(f => new
                {
                    id = f.Id,
                    areaId = f.AreaId,
                    name = f.Name,
                    origin = f.Origin,
                    source = f.Source
                })
                .ToListAsync();

            return Ok(foods);
        }

        // IDを指定して郷土料理を取得
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFood(int id)
        {
            var food = await _context.Foods
                .AsNoTracking()
                .Where(f => f.Id == id)
                .Select(f => new
                {
                    id = f.Id,
                    areaId = f.AreaId,
                    name = f.Name,
                    origin = f.Origin,
                    source = f.Source
                })
                .FirstOrDefaultAsync();

            if (food == null)
            {
                return NotFound();
            }

            return Ok(food);
        }
    }
}
