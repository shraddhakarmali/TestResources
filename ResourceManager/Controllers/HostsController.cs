using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ResourceManager.Models;
using System.Web.Http.Cors;

namespace ResourceManager.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HostsController : ApiController
    {
        private ResourcesEntities db = new ResourcesEntities();

        // GET: api/Hosts
        public List<Host> GetHosts()
        {
            db.Configuration.LazyLoadingEnabled = false;
            var user = User.Identity.Name;
            var hosts = db.Hosts.AsNoTracking()
                           .OrderBy(h => h.HostName)
                           .ToList();
            

            var requests = db.Requests
                            .Where(r => r.IsActive == true)
                            .ToList();
            var results = new List<Host>();
            foreach(var h in hosts)
            {
                results.Add(h);
                foreach(var r in requests.Where(r => string.Compare(r.HostName, h.HostName, true) == 0).ToList())
                {
                    h.Requests.Add(r);
                }
            }
            foreach (var host in results)
            {
                foreach(var req in host.Requests)
                {
                    if(string.Compare(req.UserName, user, true) == 0)
                    {
                        host.IsMyRequestPending = true;
                        break;
                    }
                }
            }
            return results;
        }

        // GET: api/Hosts/5
        [ResponseType(typeof(Host))]
        public IHttpActionResult GetHost(string id)
        {
            Host host = db.Hosts.Find(id);
            if (host == null)
            {
                return NotFound();
            }

            return Ok(host);
        }

        // PUT: api/Hosts/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutHost(string id, Host host)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != host.HostName)
            {
                return BadRequest();
            }

            db.Entry(host).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Hosts
        [ResponseType(typeof(Host))]
        public IHttpActionResult PostHost(Host host)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Hosts.Add(host);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (HostExists(host.HostName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = host.HostName }, host);
        }

        // DELETE: api/Hosts/5
        [ResponseType(typeof(Host))]
        public IHttpActionResult DeleteHost(string id)
        {
            Host host = db.Hosts.Find(id);
            if (host == null)
            {
                return NotFound();
            }

            db.Hosts.Remove(host);
            db.SaveChanges();

            return Ok(host);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool HostExists(string id)
        {
            return db.Hosts.Count(e => e.HostName == id) > 0;
        }
    }
}