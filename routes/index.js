exports.hello = function (req, res) {
    res.render('hello', { title: 'Hello, World!' });
};

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};