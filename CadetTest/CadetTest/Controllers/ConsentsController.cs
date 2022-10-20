using CadetTest.Entities;
using CadetTest.Models;
using CadetTest.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CadetTest.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConsentsController : ControllerBase
    {
        private ILogger<ConsentsController> _logger;
        private AppSettings _appSettings;
        private IDataService _dataService;
        private readonly JsonSerializerSettings _jsonSettings;

        public ConsentsController(ILogger<ConsentsController> logger, IOptions<AppSettings> appSettings, IDataService dataService)
        {
            _logger = logger;
            _appSettings = appSettings.Value;
            _dataService = dataService;
            _jsonSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        }

        [HttpPost]
        public IActionResult Post(ConsentRequest request)
        {
            var cevap = _dataService.GetRangeById(request.StartId, request.Count);
            return Ok(cevap);
        }

        // Delete: api/Consents/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cevap = _dataService.Delete(id);
            return Ok(cevap);
        }

        // Edit: api/Consents/5
        [HttpPut("{id}")]
        public IActionResult Edit(int id, ConsentEditRequest request)
        {
            var cevap = _dataService.Edit(id, request);
            return Ok(cevap);
        }

        // Add Consent
        [HttpPost("Add")]
        public IActionResult Add(ConsentAddRequest request)
        {
            var cevap = _dataService.Add(request);
            return Ok(cevap);
        }

        // GetMaxId
        [HttpGet("GetMaxId")]
        public IActionResult GetMaxId()
        {
            var cevap = _dataService.GetMaxId();
            return Ok(cevap);
        }
        
    }
}
