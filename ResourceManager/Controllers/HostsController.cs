﻿using System;
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

namespace ResourceManager.Controllers
{
    public class HostsController : ApiController
    {
        private ResourcesEntities db = new ResourcesEntities();

        // GET: api/Hosts
        public List<Host> GetHosts()
        {
            var user = User.Identity.Name;
            var results = (from h in db.Hosts
                          from r in db.Requests
                          .Where(o => h.HostName == o.HostName && o.IsActive == true && o.ReturnTime == null)
                          .DefaultIfEmpty()
                          .OrderBy(o => h.HostName)
                          .OrderByDescending(o => o.RequestedOn)
                          select h ).Distinct().ToList();
            foreach(var host in results)
            {
                foreach(var req in host.Requests)
                {
                    if(string.Compare(req.UserName, user, true) == 0 && req.IsInProgress)
                    {
                        host.IsMyRequestPending = true;
                        break;
                    }
                }
            }
            var list = results.ToList();
            return list;
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