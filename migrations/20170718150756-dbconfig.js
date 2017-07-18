'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('comments', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    comment: { type: 'text', notNull: true },
    created: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  })
};

exports.down = function(db) {
  return db.dropTable('comments');
};

exports._meta = {
  "version": 1
};
