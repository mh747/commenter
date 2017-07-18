var db = require('../dbconnect.js');

var Comment = {
  getAllComments: function (callback) {
    return db.query("SELECT * FROM comments", callback);
  },

  getCommentById: function (id, callback) {
    return db.query("SELECT * FROM comments WHERE id=?", [id], callback);
  },

  addComment: function(Comment, callback) {
    db.query("INSERT INTO comments (comment) VALUES (?)", [Comment.comment], function (err, result) {
      if (err) {
        return callback(err, null);
      }

      return db.query("SELECT * FROM comments WHERE id=?", [result.insertId], callback);
    });
  }
}

module.exports = Comment;