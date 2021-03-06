module.exports = function (nanorpc) {

  var express = require('express');
  var moment = require('moment');

  var router = express.Router();
  var Account = require('../models/account');

  /* GET home page. */
  router.get('/', function (req, res, next) {
    Account.find({
      'owner': { $exists: true, $ne: null },
      'lastVoted': {
        $gt: moment().subtract(1, 'hours').toDate()
      },
      'created': {
        $lt: moment().subtract(1, 'weeks').toDate()
      }
    })
    .where('votingweight').gt(0)
    .where('uptime').gte(95)
    .sort('-uptime')
    .populate('owner')
    .exec(function (err, accounts) {
      res.render('index', {
        loggedin: req.isAuthenticated(),
        moment: moment,
        accounts: accounts,
        nanorpc: nanorpc,
        variableRound: variableRound
      });
    });
  });

  /* GET home page. */
  router.get('/active', function (req, res, next) {
    Account.find()
    .where('votingweight').gte(133248289218203497353846153999000000)
    .sort('-votingweight')
    .populate('owner')
    .exec(function (err, accounts) {
      res.render('active', {
        loggedin: req.isAuthenticated(),
        title: 'Active Representatives',
        moment: moment,
        accounts: accounts,
        nanorpc: nanorpc,
        variableRound: variableRound,
        round: round,
        nodesOnlinePercent: round((nanorpc.getNodesOnlineRebroad() / accounts.length) * 100, 1)
      });
    });
  });

  router.get('/imprint', function (req, res, next) {
    res.render('imprint', {
      loggedin: req.isAuthenticated(),
      title: 'Imprint'
    });
  });

  function variableRound(value){
    if(value > 1){
      return round(value, 2);
    } else if(value > 0.1) {
      return round(value, 3);
    } else {
      return round(value, 4);
    }
  }

  function round(value, precision) {
    if (Number.isInteger(precision)) {
      var shift = Math.pow(10, precision);
      return Math.round(value * shift) / shift;
    } else {
      return Math.round(value);
    }
  } 

  return router;

}