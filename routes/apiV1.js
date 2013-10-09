var gps = require('../models/GPS.js')
  , meta = require('../models/Meta.js')
  , acc = require('../models/Accelerometer.js')
  , tag = require('../models/Tags.js')
  , _ = require('underscore');

function getAllIds(req, res) {
  meta.getAllIds(function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

/// @brief Returns the GPS values stored inside the database
function getGPS (req, res) {
  var options = {limit: 20};
  if(req.query.limit) {
    options.limit = parseInt(req.query.limit);
  } 
  gps.getById(req.params.id, options, function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

function getGPSCount (req, res) {
  gps.getCountForId(req.params.id, function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

function getAccWindow (req, res) {
  acc.getWindowsForId(req.params.id, function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

function getAccCount (req, res) {
  acc.getCountForId(req.params.id, function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

function getTags (req, res) {
  tag.getById(req.params.id, function (err, data) {
    if(err) { res.send(err); console.error(err); return; }
    return res.send(data);
  });
}

module.exports = {
  getGPS: getGPS,
  getGPSCount: getGPSCount,
  getAllIds: getAllIds,
  getAccWindow: getAccWindow,
  getAccCount: getAccCount,
  getTags: getTags
};