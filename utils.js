// Generated by CoffeeScript 1.6.1
(function() {
  var Response, dbconfig, redis;

  redis = require("redis");

  Response = require('./vo/Response').Response;

  dbconfig = require('./config').db;

  exports.authenticateUser = function(req, res) {
    var path, result;
    result = this.isLoginUser(req);
    path = "/login";
    if (this.isMobileClient(req)) {
      path = "/m/login";
    }
    if (!result) {
      res.redirect(path);
    }
    return result;
  };

  exports.isMobileClient = function(req) {
    var urlArray;
    urlArray = req.path.split("/");
    return urlArray[1] === "m";
  };

  exports.isLoginUser = function(req) {
    var _ref;
    return ((_ref = req.session) != null ? _ref.userId : void 0) && true;
  };

  exports.authenticateAdmin = function(req, res) {
    var result;
    result = this.isAdmin(req);
    if (!result) {
      if (this.isLoginUser(req)) {
        res.redirect('/show');
      } else {
        res.redirect('/login');
      }
    }
    return result;
  };

  exports.isAdmin = function(req) {
	console.log('isLoginUser(req):' + this.isLoginUser(req));
	//console.log('req.session.isAdmin:' + req.session.isAdmin;
    return this.isLoginUser(req) && req.session.isAdmin === 1;
	//return true;
  }; 

  exports.showDBError = function(callback, client, message) {
    if (client == null) {
      client = null;
    }
    if (message == null) {
      message = 'Database error!';
    }
    if (client) {
      client.quit();
    }
    return callback(new Response(0, message));
  };
  
  exports.hasReport = function(req) {
	var _ref, userId;
	_ref = req.session;
	userId = _ref.userId;
	console.log('hasReport userId:' + userId);
	
	// get this week's title of the report
	dateStr = getDateStr(new Date());
	console.log('hasReport dateStr:' + dateStr);
	
	var client;
    client = this.createClient();
	
	
	
	return client.hgetall("userid:" + userId + ":reports", function(err, reply) {
        var users;
        if (err) {
		  console.log('hasReport: DB error!');
          return -1;
        }
		console.log('hasReport reply:' + reply);
		
		// parse the reports info
		var childOfKey, key, value;
		for (key in reply) {
		  value = reply[key];
          childOfKey = key.split(":");
		  console.log('0-hasReport value:' + childOfKey[0]);
  		  console.log('1-hasReport value:' + childOfKey[1]);
		  console.log('2-hasReport value:' + childOfKey[2]);
		  console.log('3-hasReport value:' + childOfKey[3]);
		  console.log('4-hasReport value:' + childOfKey[4]);
		  
          if (childOfKey[1] == "date") {
            console.log('hasReport value:' + value);
			if (value == dateStr) {
				console.log('hasReport return:' + true);
				return true;
			}
          }
		  
        }
		return false;
        // get all the user info
        //users = getUsersWithoutPassword(reply);
	});
	
	//check the report is exists or not
	

  };
  
  exports.createClient = function() {
    var client;
    client = redis.createClient(dbconfig.port, dbconfig.host);
    if (dbconfig.pass) {
      client.auth(dbconfig.pass, function(err) {
        if (err) {
          throw err;
        }
      });
    }
    client.on("error", function(err) {
      console.log(err);
      return client.end();
    });
    return client;
  };
  
  getDateStr = function(date) {
      var month, today, year, day;
	  var month_first, day_first, year_first; // for calc the first day and the last day of the week
	  var month_last, day_last, year_last;
	  
	  date = new Date();
      day = new Date();
	  day_new = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;
	  day = date.getDate();
      
	  //return "" + year + "-" + month + "-" + day;
	  
	  // calc the first day of the week
	  day_new.setDate(date.getDate() - date.getDay() + 1);
	  year_first = day_new.getFullYear();
      month_first = day_new.getMonth() + 1;
	  day_first = day_new.getDate();
	  //return "" + year_first + "-" + month_first + "-" + day_first;
	  
	  // calc the last day of the week
	  day_new.setDate(day_new.getDate() + 6);
	  year_last = day_new.getFullYear();
      month_last = day_new.getMonth() + 1;
	  day_last = day_new.getDate();
	  //return "" + year_last + "-" + month_last + "-" + day_last;
	  
	  return "" + year_first + "-" + month_first + "-" + day_first + " to " + year_last + "-" + month_last + "-" + day_last;
	   
    };
   
}).call(this);
