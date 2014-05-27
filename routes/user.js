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
