var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET Start 2nd page. */
router.get('/start', function(req, res) {
    res.render('start', { title: 'My first http server' });
});

module.exports = router;
