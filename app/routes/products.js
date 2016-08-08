var express = require('express');
var router = express.Router();

/* GET products. */
router.get('/list', function(req, res) {
  var db = req.db;
  var collection = db.get('products');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to addproduct. */

router.post('/addproduct', function(req, res) {
  var db = req.db;
  var collection = db.get('products').insert(req.body, function(err, result){
    res.send(
        (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* PUT to updateproduct. */
router.put('/updateproduct/:id', function(req, res) {
  var db = req.db
  var productToUpdate = req.params.id;
  var doc = { $set: req.body};
  db.collection('products').updateById(productToUpdate, doc ,function(err, result) {
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  });
});

// router.put('/updateproduct/:id', function(req, res) {
//     var db = req.db;
// var collection = db.get('products');
// var productToUpdate = req.params.id;
// collection.updateById({ '_id' : productToUpdate}, function(err) {
//     res.send((err === null) ? { msg: ''} : {msg: 'error: ' + err});
// });
// var productToUpdate = req.params.id;
// var doc = { $set: req.body};
// db.collection('products').updateById(productToUpdate, doc ,function(err, result) {
//     res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
// res.send((err === null) ? { msg: ''} : {msg: 'error: ' + err});
//     });
// });

/* DELETE to deleteproduct. */
router.delete('/deleteproduct/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('products');
  var productToDelete = req.params.id;
  collection.remove({ '_id' : productToDelete}, function(err) {
    res.send((err === null) ? { msg: ''} : {msg: 'error: ' + err});
  });
  // db.collection('products').removeById(productToDelete, function(err, result) {
  //     res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  // });
});

module.exports = router;