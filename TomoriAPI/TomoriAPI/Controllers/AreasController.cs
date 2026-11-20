using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TomoriAPI.Data;

namespace TomoriAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly GochitamaContext _context;

        public AreasController(GochitamaContext context)
        {
            _context = context;
        }

        // 地域一覧を取得
        [HttpGet]
        public async Task<IActionResult> GetAreas()
        {
            var areas = await _context.Areas
                .AsNoTracking()
                .OrderBy(a => a.Id)
                .Select(a => new
                {
                    id = a.Id,
                    code = a.Code,
                    prefecture = a.Prefecture,
                    name = a.Name,
                    lat = a.Lat,
                    lng = a.Lng
                })
                .ToListAsync();

            return Ok(areas);
        }
    }
}