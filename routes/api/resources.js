const express = require('express');
const mongoose = require('mongoose');
const Resource = mongoose.model('Resource')
const Comment = mongoose.model('Comment')
const User = mongoose.model('User')
const auth = require('../auth')

const router = express.Router();

//Preload resource object on routes with ':resource'
router.param('resource', (req, res, next, slug) => {
    Resource.findOne({slug: slug})
    .populate('resource')
    .then(function(resource) {
        if (!resource) { return res.sendSatus(404); }

        req.resource = resource;

        return next();
    }).catch(next);
})

router.param('comment', (req, res, next, id) => {
    Comment.findById(id).then(function(comment) {
        if(!comment) { return res.sendStatus(404); }

        req.comment = comment;

        return next();
    }).catch(next);
});

router.get('/', auth.optional, function(req, res, next) {
    let query = {};
    let limit = 20;
    let offset = 0;

    if(typeof req.query.limit !== 'undefined'){
        limit = req.query.limit;
    }

    if(typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    if(typeof req.query.tag !== 'undefined') {
        query.tagList = {"$in" : [req.query.tag]};
    }

    Promise.all([
        req.query.topic ? User.findOne({topic: req.query.topic}) : null,
        req.query.favorited ? User.findOne({resource: req.query.resource}) : null
    ]).then(function(results){
        let topic = results[0];
        let favoriter = results[1];

        if(topic){
            query.topic = topic._id;
        }

        if(favoriter){
            query._id = {$in: favoriter.favorites};
        } else if(req.query.favorited){
            query._id = {$in: []};
        }


        return Promise.all([
            Resource.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({createdAt: 'desc'})
                .populate('topic')
                .exec(),
            Resource.count(query).exec(),
            req.payload ? User.findById(req.payload.id) : null,
        ]).then(function(results) {
            let resources = results[0];
            let ResourceCount = results[1];
            let user = results[2];

            return res.json({
                resources: resources.map((article) => {
                    return resource.toJSONFor(user);
                }),
                resourcesCount: resourcesCount
            });
        });
    }).then(function(resource) {
            res.render('resources-index', { resource:resource })
    }).catch(next);
});


router.get('/feed', auth.required, (req, res, next) => {
    const limit = 20;
    const offset = 0;

    if(typeof req.query.limit !== 'undefined'){
        limit = req.query.limit;
    }

    if(typeof req.query.offset !== 'undefined'){
        offset = req.query.offset;
    }

    User.findById(req.payload.id).then((user) => {
        if (!user) { return res.sendStatus(401); }

    Promise.all([
        Resource.find({ topic: {$in: user.following}})
            .limit(Number(limit))
            .skip(Number(offset))
            .populate('topic')
            .exec(),
        Resource.count({ topic: {$in: user.following}})
    ]).then((results) => {
        const resources = results[0];
        const resourcesCount = results[1];

        return res.json({
            resources: resources.map((article) => {
                return resource.toJSONFor(user);
            }),
            resourcesCount: resourcesCount
            });
        }).catch(next);
    });
});

router.post('/', auth.required, (req, res, next) => {
    User.findById(req.payload.id).then((user) => {
        if(!user) {return res.sendstatus(401); }

        let resource = new Resource(req.body.resource);

        resource.topic = topic;

        return resource.save().then( function() {
            //instead of resource.author we doing resource.topic
            console.log(resource.topic);
            return res.json({resource: resource.toJSONFor(topic)});
        });
    }).catch(next);
});


// return a resource
router.get('/:resource', auth.optional, (req, res, next) => {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.resource.populate('topic').execPopulate()
    ]).then(function(results) {
        var topic = results[0];

        return res.json({resource: req.resource.toJSONFor(topic)});
    }).catch(next);
});

// update resource
router.put('/:resource', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.resource.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.resource.title !== 'undefined'){
        req.resource.title = req.body.resource.title;
      }

      if(typeof req.body.article.description !== 'undefined'){
        req.resource.description = req.body.resource.description;
      }

      if(typeof req.body.article.body !== 'undefined'){
        req.resource.body = req.body.resource.body;
      }

      if(typeof req.body.article.tagList !== 'undefined'){
        req.resource.tagList = req.body.article.tagList
      }

      req.resource.save().then(function(resource){
        return res.json({resource: resource.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete article
router.delete('/:resource', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.resource.author._id.toString() === req.payload.id.toString()){
      return req.resource.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// Favorite an article
router.post('/:resource/favorite', auth.required, function(req, res, next) {
  var resourceId = req.article._id;

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(articleId).then(function(){
      return req.article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// Unfavorite an article
router.delete('/:article/favorite', auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(resourceId).then(function(){
      return req.resource.updateFavoriteCount().then(function(resource){
        return res.json({resource: resource.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// return an article's comments
router.get('/:resource/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.resource.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(article) {
      return res.json({comment: req.resource.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// create a new comment
router.post('/:resource/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    var comment = new Comment(req.body.comment);
    comment.article = req.article;
    comment.author = user;

    return comment.save().then(function(){
      req.article.comments.push(comment);

      return req.article.save().then(function(article) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

router.delete('/:resource/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.title.toString() === req.payload.id.toString()){
    req.resource.comments.remove(req.comment._id);
    req.resource.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});


module.exports = router;
