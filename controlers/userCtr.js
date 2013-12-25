// Generated by CoffeeScript 1.6.1
(function() {
  var Response, check, crypto, userModel, utils;

  crypto = require('crypto');

  check = require('validator').check;

  utils = require('../utils');

  userModel = require('../models/usersModel');

  Response = require('../vo/Response').Response;

  exports.loginIndex = function(req, res) {
    return res.render("login");
  };

  exports.indexMobile = function(req, res) {
    if (utils.isLoginUser(req)) {
      return res.redirect('/m/write');
    } else {
      return res.redirect('/m/login');
    }
  };

  exports.loginIndexMobile = function(req, res) {
    if (utils.isLoginUser(req)) {
      return res.redirect('/m/write');
    } else {
      return res.render("mobile/login", {
        'title': "登录",
        layout: "mobile/layout.hbs"
      });
    }
  };

  exports.login = function(req, res) {
    var hashedPassword, password, userName;
    userName = req.body.userName;
    password = req.body.password;
    hashedPassword = crypto.createHash("sha1").update(password).digest('hex');
    return userModel.getAllUsersWithPassword(function(response) {
      var hasThisUser, id, key, property, userId, users, value, _ref, _ref1;
      if (response.state === 0) {
        return res.send(response);
      }
      users = response.data;
      userId = null;
	  // check the user is exist or not
      for (key in users) {
        value = users[key];
        _ref = key.split(":"), id = _ref[0], property = _ref[1];
        if (property === "user_name" && value === userName) {
          userId = id;
          break;
        }
      }
      if (!userId) {
        return res.send(new Response(1, "User not exist!", 0));
      }
	  // check the password
      hasThisUser = false;
      for (key in users) {
        value = users[key];
        _ref1 = key.split(":"), id = _ref1[0], property = _ref1[1];
        if (id === userId && property === "password" && value === hashedPassword) {
          userId = id;
          hasThisUser = true;
          break;
        }
      }
	  // check the admin flag
      if (!hasThisUser) {
        return res.send(new Response(1, "Invalid PASSCODE!", 0));
      }
      req.session.userId = userId;
      return userModel.getAdminIds(function(response) {
        var ids, _i, _len;
        if (response.state === 0) {
          return res.send(new Response(1, "success", 1));
        }
        ids = response.data;
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          id = ids[_i];
          if (id === userId) {
            req.session.isAdmin = 1;
            break;
          }
        }
		
		return userModel.hasSubordinate(userId, function(result) {
			if (result) {
				// OK, the user is a manager, the first page should be the 'showsubordinate' page
				return res.send(new Response(1, "success", 2));
			}
			// the user is a staff, the first page should be the 'write' page
			return res.send(new Response(1, "success", 1));
		});
      });
    });
  };

  exports.logout = function(req, res) {
    if (!utils.authenticateUser(req, res)) {
      return;
    }
    req.session.destroy();
    return res.redirect("/login");
  };

  exports.logoutMobileIndex = function(req, res) {
    if (!utils.authenticateUser(req, res)) {
      return;
    }
    req.session.destroy();
    return res.render("mobile/login", {
      'title': "登录",
      layout: "mobile/layout.hbs"
    });
  };

  exports.passwordIndex = function(req, res) {
    var userId;
    if (!utils.authenticateUser(req, res)) {
      return;
    }
    userId = req.session.userId;
    return userModel.hasSubordinate(userId, function(result) {
      var data;
      data = {
        hasSubordinate: result,
        isLoginUser: utils.isLoginUser(req),
        isAdmin: utils.isAdmin(req)
      };
      return res.render("password", data);
    });
  };

  exports.passwordMobileIndex = function(req, res) {
    var userId;
    if (!utils.authenticateUser(req, res)) {
      return;
    }
    userId = req.session.userId;
    return userModel.hasSubordinate(userId, function(result) {
      var data;
      data = {
        hasSubordinate: result,
        'title': "修改密码",
        layout: "mobile/layout.hbs"
      };
      console.log(data);
      return res.render("mobile/password", data);
    });
  };

  exports.changePassword = function(req, res) {
    var newPassword, oldPassword, userId;
    if (!utils.authenticateUser(req, res)) {
      return;
    }
    userId = req.session.userId;
    oldPassword = crypto.createHash("sha1").update(req.body.oldPassword).digest('hex');
    newPassword = crypto.createHash("sha1").update(req.body.newPassword).digest('hex');
    return userModel.changePassword(userId, newPassword, oldPassword, function(response) {
      return res.send(response);
    });
  };

  exports.createUser = function(req, res) {
    var departmentId, errorMessage, password, superiorId, userName;
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    userName = req.body.userName;
    password = req.body.password;
    departmentId = req.body.departmentId;
    superiorId = req.body.superiorId;
    try {
      check(userName, "字符长度为2-25").len(2, 25);
      check(password, "字符长度为2-25").len(2, 25);
    } catch (error) {
      errorMessage = error.message;
      return res.send(new Response(0, errorMessage));
    }
    return userModel.hasUser(userName, function(response) {
      var hashedPassword;
      if (response.state === 0 || response.data) {
        return res.send(response);
      }
      hashedPassword = crypto.createHash("sha1").update(password).digest('hex');
      return userModel.createUser(userName, hashedPassword, departmentId, superiorId, function(response) {
        return res.send(response);
      });
    });
  };

  exports.removeUser = function(req, res) {
    var userId;
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    userId = req.body.userId;
    return userModel.removeUser(userId, function(response) {
      return res.send(response);
    });
  };

  exports.updateUser = function(req, res) {
    var departmentId, hashedPassword, password, superiorId, userId, userName;
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    userId = req.body.userId;
    userName = req.body.userName;
    password = req.body.password;
    departmentId = req.body.departmentId;
    superiorId = req.body.superiorId;
    try {
      check(userName, "字符长度为2-25").len(2, 25);
      hashedPassword = null;
      if (password) {
        hashedPassword = crypto.createHash("sha1").update(password).digest('hex');
      }
      return userModel.updateUser(userId, userName, hashedPassword, departmentId, superiorId, function(response) {
        return res.send(response);
      });
    } catch (error) {
      return res.send(new Response(0, error.errorMessage));
    }
  };

  exports.getAllUsers = function(req, res) {
    return userModel.getAllUsers(function(response) {
      return res.send(response);
    });
  };

  exports.getAdmins = function(req, res) {
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    return userModel.getAdminIds(function(response) {
      return res.send(response);
    });
  };

  exports.setAdmin = function(req, res) {
    var userId;
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    userId = req.body.userId;
    return userModel.setAdmin(userId, function(response) {
      return res.send(response);
    });
  };

  exports.deleteAdmin = function(req, res) {
    var userId;
    if (!utils.authenticateAdmin(req, res)) {
      return;
    }
    userId = req.body.userId;
    return userModel.deleteAdmin(userId, function(response) {
      return res.send(response);
    });
  };

  exports.hasUser = function(req, res) {
    var userName;
    userName = req.body.userName;
    return userModel.hasUser(userName, function(response) {
      return res.send(response);
    });
  };

}).call(this);
