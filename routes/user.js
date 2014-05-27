// get list of users
exports.userlist = function (req, res) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userList', {
            "userlist": docs
        });
    });
};

// get new user page
exports.newuser = function (req, res) {
    res.render('newUser', {title: 'Add New User'});
};

exports.adduser = function (req, res) {
    var username = req.body.username;
    var email = req.body.useremail;
    var collection = db.get('usercollection');
    collection.insert({"username": username, "email": email}, function (err, doc) {
        if (err) {
            res.send("There is an error adding to DB");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("users");
            // And forward to success page
            res.redirect("users");
        }
    });
};
