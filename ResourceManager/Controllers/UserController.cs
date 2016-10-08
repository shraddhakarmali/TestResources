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

namespace ResourceManager.Controllers
{
    public class UsersController : ApiController
    {
        // GET: api/User
        public string GetUser()
        {
            return User.Identity.Name;
        }
    }        
}