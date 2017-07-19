var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');

/* GET home page. */
router.get('/comments/:id?', function (req, res, next) {
  if (req.params.id) {
    Comment.getCommentById(req.params.id, function (err, response) {
      if (err) {
        return res.status(response.status).json(err);
      }

      return res.status(response.status).json(response.results);
    });
  } else {
    Comment.getAllComments(function (err, response) {
      if (err) {
        return res.status(response.status).json(err);
      }

      return res.status(response.status).json(response.results);
    })
  }
});

router.post('/comments', function (req, res, next) {
  Comment.addComment(req.body, function (err, response) {
    if (err) {
      return res.status(response.status).json(err);
    }

    return res.status(response.status).json(response.results);
  })
});

router.delete('/comments/:id', function (req, res, next) {
  Comment.deleteCommentById(req.params.id, function (err, response) {
    if (err) {
      return res.status(response.status).json(err);
    }

    return res.status(response.status).json(response.results);
  });
});

module.exports = router;
