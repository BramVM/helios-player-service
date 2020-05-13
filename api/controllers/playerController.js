'use strict';
const inputMappers = require('../mappers/inputMappers');
const mongoose = require('mongoose'),
  Player = mongoose.model('Players');

mongoose.set('useFindAndModify', false);
  //playerRepository = require('../repositries/playerRepository');



exports.list_all_players = function(req, res) {
  Player.find({}, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};


exports.create_a_player = function(req, res) {
  var new_player = new Player(req.body);
  new_player.save(function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};

exports.read_active_player = function(req, res) {
  console.log('requested active player');
  Player.findOne({identityProviderId:req.user.sub}, function(err, player) {
    if (err){
      res.send(err);
    }
    if (player){
      console.log(player)
      res.setHeader('Content-Type', 'application/json')
      res.json(player);
    }
    else {
      // create the player
      var nuberOfPlayers = Player.count;
      if (nuberOfPlayers+1%8 === 1){
        
      }
      var new_player = new Player({
        identityProviderId:req.user.sub,
        email: req.user.email,
        position:{
          x: 8000,
          y: 8000
        },
        story:{
          step:0
        }
      });
      new_player.save(function(err, player) {
        if (err) {
          console.log(err)
          res.send(err);
        }
        res.setHeader('Content-Type', 'application/json')
        res.json(player);
      });
    }
  });
};

exports.update_a_player = async function(req, res) {
  const player = inputMappers.mapPlayer(req.body)
  Player.findOneAndUpdate({_id:req.params.playerId}, player, {new: true}, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};

exports.update_players = async function(req, res) {
  req.body.forEach(item => {
    const player = inputMappers.mapPlayer(item)
    Player.findOneAndUpdate({_id:player._id}, player, {new: true}, function(err, player) {
      if (err)
        res.send(err);
      res.setHeader('Content-Type', 'application/json')
      res.json(player);
    });
  });
};

// Player.remove({}).exec(function(){});
exports.delete_a_player = function(req, res) {
  Player.remove({
    _id: req.params.playerId
  }, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json({ message: 'Player successfully deleted' });
  });
};
