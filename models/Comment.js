var db = require('../dbconnect.js');
var client = require('../redisconnect.js');

var Comment = {
  getAllComments: function (callback) {
    var response = {};

    db.query("SELECT * FROM comments", function (err, rows) {
      if (err) {
        response.status = 500;
        return callback(err, response);
      }

      response.status = (rows.length === 0) ? 404 : 200;
      response.results = rows;
      return callback(null, response);
    });
  },

  getCommentById: function (id, callback) {
    var response = {};

    // check for cache first
    client.hgetall('comments:' + id, function (err, results) {
      if (err) {
        response.status = 500;
        return callback(err, response);
      }

      if (results) {
        console.log("Cache Hit");
        response.status = 200;
        response.results = results;
        return callback(null, response);
      }

      // not found
      console.log("Cache Miss");
      db.query("SELECT * FROM comments WHERE id=?", [id], function (err, rows) {
        if (err) {
          response.status = 500;
          return callback(err, response);
        }

        var numResults = rows.length;

        if (numResults > 0) {
          client.hmset('comments:' + id, rows[0], function (err, result) {
            if (err) {
              console.log('Error Adding To Cache Layer: ' + err);
            } else {
              console.log('Added Comment ' + id + ' To Cache Layer');
            }
          });
        }

        response.status = (numResults === 0) ? 404 : 200;
        response.results = rows;
        return callback(null, response);
      });
    });
  },

  addComment: function(Comment, callback) {
    var response = {};

    db.query("INSERT INTO comments (comment) VALUES (?)", [Comment.comment], function (err, result) {
      if (err) {
        response.status = 500;
        return callback(err, response);
      }

      db.query("SELECT * FROM comments WHERE id=?", [result.insertId], function (err, rows) {
        if (err) {
          response.status = 500;
          return callback(err, response);
        }

        var comment = rows[0];
        client.hmset('comments:' + comment.id, comment, function (err, result) {
          if (err) {
            console.log("Error Adding To Cache Layer: " + err);
          } else {
            console.log("Comment " + comment.id + " Added To Cache Layer");
          }
        });

        response.status = 201;
        response.results = rows;
        return callback(null, response);
      });
    });
  }
}

module.exports = Comment;