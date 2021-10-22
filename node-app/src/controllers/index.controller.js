const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    // res.send('hello world!');
    res.render('index');
};

indexCtrl.renderAbout = (req, res) => {
    // res.send('hello world!');
    res.render('about');
};

module.exports = indexCtrl
