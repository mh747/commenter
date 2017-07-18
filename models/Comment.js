var db = require('../dbconnect.js');
var client = require('../redisconnect.js');

var Comment = {
  getAllComments: function (callback) {
    return db.query("SELECT * FROM comments", callback);
  },

  getCommentById: function (id, callback) {
    // check for cache first
    client.hgetall('comments:' + id, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      if (result) {
        console.log("Cache Hit");
        return callback(null, result);
      }

      // not found
      console.log("Cache Miss");
      db.query("SELECT * FROM comments WHERE id=?", [id], function (err, row) {
        if (err) {
          return callback(err, null);
        }

        client.hmset('comments:' + id, row[0], function (err, result) {
          if (err) {
            console.log('Error Adding To Cache Layer: ' + err);
          } else {
            console.log('Added Comment ' + id + ' To Cache Layer');
          }
        });

        return callback(null, row);
      });
    });
  },

  addComment: function(Comment, callback) {
    db.query("INSERT INTO comments (comment) VALUES (?)", [Comment.comment], function (err, result) {
      if (err) {
        return callback(err, null);
      }

      db.query("SELECT * FROM comments WHERE id=?", [result.insertId], function (err, row) {
        if (err) {
          return callback(err, null);
        }

        var comment = row[0];
        client.hmset('comments:' + comment.id, comment, function (err, result) {
          if (err) {
            console.log("Error Adding To Cache Layer: " + err);
          } else {
            console.log("Comment " + comment.id + " Added To Cache Layer");
          }
        });

        return callback(null, row);
      });
    });
  }
}

module.exports = Comment;