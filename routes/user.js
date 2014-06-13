// get list of users
exports.userlist = function (req, res) {
    var collection = app.locals.db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
};
// check if login already busy
exports.checklogin = function (req, res) {
    var collection = app.locals.db.get('usercollection');
    collection.findOne({login: req.param('login')}, function (e, doc) {
        res.send(!doc ? 'true' : 'false');
    });
};
// adding user
exports.adduser = function (req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var birthday = req.body.birthday;
    var role = req.body.role;
    var collection = app.locals.db.get('usercollection');
    collection.insert({"login": login, "password": password, "email": email, "firstName": firstName,
        "lastName": lastName, "birthday": birthday, "role": role}, function (err, doc) {
        if (err) {
            res.send("There is an error adding to DB");
            console.log('error');
        } else {
            res.statusCode = 200;
            res.send('ok');
        }
    });
};
// deleting user
exports.delete = function (req, res) {
    var login = req.params.user_login;
    var collection = app.locals.db.get('usercollection');
    collection.remove({"login": login}, function (e, doc) {
        if (e) {
            console.log('deleting error');
        } else {
            console.log('deleted ' + login);
            res.statusCode = 200;
            res.send('ok');
        }
    });
};
// updating user
exports.update = function (req, res) {
    var user = new Object();
    user._id = req.body._id;
    user.login = req.body.login;
    user.password = req.body.password;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.birthday = req.body.birthday;
    user.role = req.body.role;
    var collection = app.locals.db.get('usercollection');
    collection.update({_id: user._id}, user, {upsert: false, multi: false}, function (e, doc) {
        if (e) {
            console.log('updating error');
        } else {
            res.statusCode = 200;
            res.send('ok');
        }
    });
};
//get user by login
exports.getuser = function (req, res) {
     var login = req.params.user_login;
     var collection = app.locals.db.get('usercollection');
     collection.findOne({"login": login}, function (e, doc) {
         if (e) {
            res.send('error');
         } else {
            res.statusCode = 200;
            res.json(doc);
                    }
     });
};