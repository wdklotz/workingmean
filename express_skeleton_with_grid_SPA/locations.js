'use strict';
const base_dir   = __dirname;
const db         = base_dir+'/server/dbConnection/db/storage.sqlite';
const upload     = base_dir+'/uploads';
const store      = base_dir+'/public/UIGrid/store/data';

module.exports.base_dir = base_dir;
module.exports.db       = db;
module.exports.upload   = upload;
module.exports.store    = store;
