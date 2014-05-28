// get list of users
exports.userlist = function (req, res) {
    var collection = app.locals.db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
};
//check if login already busy
exports.checklogin = function (req, res) {
    var collection = app.locals.db.get('usercollection');
    collection.findOne({login: req.param('login')}, function (e, doc) {
        res.send(!doc ? 'true' : 'false');
    });
};

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