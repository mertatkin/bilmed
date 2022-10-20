using CadetTest.Entities;
using CadetTest.Helpers;
using CadetTest.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CadetTest.Services
{
    public interface IDataService
    {
        string GetRandomString(int stringLength);
        void InitConsents();
        List<Consent> GetRangeById(int id, int adet);
        Consent Delete(int id);
        Consent Edit(int id, ConsentEditRequest request);
        Consent Add(ConsentAddRequest request);
        int GetMaxId();
    }
    public class DataService : IDataService
    {
        private DataContext _context;
        private readonly AppSettings _appSettings;
        private readonly ILogger<UserService> _logger;
        private Random _random;

        public DataService(DataContext context, IOptions<AppSettings> appSettings, ILogger<UserService> logger)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _logger = logger;

            _random = new Random();
        }

        #region Public Methods

        public List<Consent> GetRangeById(int id, int adet)
        {
            var cevap = _context.Consents.Where(k => k.Id >= id).Take(adet).ToList();
            return cevap;
        }

        public Consent Delete(int id)
        {
            var cevap = _context.Consents.Where(k => k.Id == id).FirstOrDefault();
            if (cevap != null)
            {
                _context.Consents.Remove(cevap);
                _context.SaveChanges();
            }
            return cevap;
        }

        // Edit: api/Consents/5
        public Consent Edit(int id, ConsentEditRequest request)
        {
            var cevap = _context.Consents.Where(k => k.Id == id).FirstOrDefault();
            if (cevap != null)
            {
                cevap.Recipient = request.Recipient;
                cevap.RecipientType = request.RecipientType;
                cevap.Status = request.Status;
                cevap.Type = request.Type;
                _context.SaveChanges();
            }
            return cevap;
        }

        // Add Consent
        public Consent Add(ConsentAddRequest request)
        {
            var cevap = new Consent();
            cevap.Recipient = request.Recipient;
            cevap.RecipientType = request.RecipientType;
            cevap.Status = request.Status;
            cevap.Type = request.Type;
            cevap.Id = _context.Consents.Max(k => k.Id) + 1;
            _context.Consents.Add(cevap);
            _context.SaveChanges();
            return cevap;
        }

        // Get Max Id
        public int GetMaxId()
        {
            return _context.Consents.Max(k => k.Id);
        }

        #endregion


        public void InitConsents()
        {
            if (_context.Consents.Any()) return;

            for (int i = 1; i < _appSettings.ConsentCount; i++)
            {
                var consent = new Consent
                {
                    Recipient = $"{GetRandomString(10)}_{i}@ornek.com",
                    RecipientType = "EPOSTA",
                    Status = "ONAY",
                    Type = "EPOSTA"
                };

                _context.Consents.Add(consent);
            }
        }

        #region Private Methods

        public string GetRandomString(int stringLength)
        {
            var sb = new StringBuilder();
            int numGuidsToConcat = (((stringLength - 1) / 32) + 1);
            for (int i = 1; i <= numGuidsToConcat; i++)
            {
                sb.Append(Guid.NewGuid().ToString("N"));
            }

            return sb.ToString(0, stringLength);
        }
        #endregion
    }
}
