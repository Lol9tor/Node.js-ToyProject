exports.hello = function (req, res) {
    res.sendfile('./public/pages/admin.html');
};

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};