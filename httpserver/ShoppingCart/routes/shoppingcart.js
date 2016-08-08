var express = require('express');
var router = express.Router();

/* GET shopping cart items. */
router.get('/items', function(req, res) {
    var db = req.db;
    var collection = db.get('shoppingcartitems');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* DELETE */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('shoppingcartitems');
    var itemToDelete = req.params.id;
    collection.remove({ '_id' : itemToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* Insert */
router.post('/addtocart', function(req, res) {
    var db = req.db;
    var collection = db.get('shoppingcartitems');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;