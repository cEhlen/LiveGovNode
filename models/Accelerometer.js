var _ = require('underscore')
  , pg = require('pg')
  , config = require('../config.js');

function getWindowsForId (id, options, callback) {
  if(_.isFunction(options)) {
    // Check if we want to use the default options
    callback = options;
    options = { windows: 200 };
  } else if(!_.isObject(options)) {
    throw new TypeError("Bad arguments");
  }

  pg.connect(config.pgCon, function (err, client, done) {
    if(err) { callback(err); done(); return; }
    var query = "SELECT w,\
                        avg(x) AS avgX,\
                        min(x) AS minX,\
                        max(x) AS maxX,\
                        avg(y) AS avgY,\
                        min(y) AS minY,\
                        max(y) AS maxY,\
                        avg(z) AS avgZ,\
                        min(z) AS minZ,\
                        max(z) AS maxZ,\
                        min(ts) AS startTime,\
                        max(ts) AS endTime\
                    FROM (\
                      SELECT x, y, z, ts\
                      , NTILE($1) OVER (ORDER BY ts) AS w\
                      FROM accelerometer WHERE id=$2) A\
                    GROUP BY w\
                    ORDER BY w;";
    var values = [options.windows, id];
    client.query(query, values, function (err, result) {
      done();
      if(err) { callback(err); return; }

      var data = _.map(result.rows, function (e) {
        return {
          window: e.w,
          avgX: e.avgx,
          minX: e.minx,
          maxX: e.maxx,
          avgY: e.avgy,
          minY: e.miny,
          maxY: e.maxy,
          avgZ: e.avgz,
          minZ: e.minz,
          maxZ: e.maxz,
          startTime: e.starttime,
          endTime: e.endtime,
          midTime: new Date((e.endtime.getTime() + e.starttime.getTime()) / 2)
        };
      });
      callback(null, data);
    });
  });
}

function getCountForId (id, options, callback) {
  if(_.isFunction(options)) {
    // Check if we want to use the default options
    callback = options;
  } else if(!_.isObject(options)) {
    throw new TypeError("Bad arguments");
  }

  pg.connect(config.pgCon, function (err, client, done) {
    if(err) { callback(err); done(); return; }
    var query = 'SELECT COUNT(*) FROM accelerometer WHERE id=$1;';
    client.query(query, [id], function (err, result) {
      done();
      if(err) { callback(err); return; }
      callback(null, {count: result.rows[0].count});
    });
  });
}

module.exports = {
  getWindowsForId: getWindowsForId,
  getCountForId: getCountForId
};