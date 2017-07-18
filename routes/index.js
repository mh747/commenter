var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');

/* GET home page. */
router.get('/comments/:id?', function (req, res, next) {
  if (req.params.id) {
    Comment.getCommentById(req.params.id, function (err, row) {
      if (err) {
       return res.json(err);
      }

      return res.json(row);
    });
  } else {
    Comment.getAllComments(function (err, rows) {
      if (err) {
        return res.json(err);
      }

      return res.json(rows);
    })
  }
});

router.post('/comments', function (req, res, next) {
  Comment.addComment(req.body, function (err, row) {
    if (err) {
      return res.json(err);
    }

    return res.json(row);
  })
});

module.exports = router;
