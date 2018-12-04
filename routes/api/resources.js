const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Resource = mongoose.model('Resource')
const Comment = mongoose.model('Comment')
const User = mongoose.model('User')
const auth = require('../auth')

// const Resource = require('../models/resource.js')
// Preload resource object on routes with ':resource'

router.get('/', (req, res) => {
    res.render('resources-index.hbs');
 });
// router.param('resource', (req, res, next, slug) => {
//     Resource.findOne({slug: slug})
//     .populate('resource')
//     .then((resource) => {
//         if (!resource) { return res.sendSatus(404); }
//
//         req.resource = resource;
//
//         return next();
//     }).catch(next);
// })
//
// router.param('comment', (req, res, next, id) => {
//     Comment.findById(id).then((comment) => {
//         if(!comment) { return res.sendStatus(404); }
//
//         req.comment = comment;
//
//         return next();
//     }).catch(next);
// });
//
// router.get('/', auth.optional, (req, res, next) => {
//     let query = {};
//     let limit = 20;
//     let offset = 0;
//
//     if(typeof req.query.limit !== 'undefined'){
//         limit = req.query.limit;
//     }
//
//     if(typeof req.query.offset !== 'undefined') {
//         offset = req.query.offset;
//     }
//
//     if(typeof req.query.tag !== 'undefined') {
//         query.tagList = {"$in" : [req.query.tag]};
//     }
//
//     Promise.all([
//         req.query.topic ? User.findOne({topic: req.query.topic}) : null,
//         req.query.favorited ? User.findOne({resource: req.query.resource}) : null
//     ]).then(function(results){
//         let topic = results[0];
//         let favoriter = results[1];
//
//         if(topic){
//             query.topic = topic._id;
//         }
//
//         if(favoriter){
//             query._id = {$in: favoriter.favorites};
//         } else if(req.query.favorited){
//             query._id = {$in: []};
//         }
//
//
//         return Promise.all([
//             Resource.find(query)
//                 .limit(Number(limit))
//                 .skip(Number(offset))
//                 .sort({createdAt: 'desc'})
//                 .populate('topic')
//                 .exec(),
//             Resource.count(query).exec(),
//             req.payload ? User.findById(req.payload.id) : null,
//         ]).then(function(results) {
//             let resources = results[0];
//             let ResourceCount = results[1];
//             let user = results[2];
//
//             return res.json({
//                 resources: resources.map((article) => {
//                     return resource.toJSONFor(user);
//                 }),
//                 resourcesCount: resourcesCount
//             });
//         });
//     }).then(function(resource) {
//             res.render('resources-index', { resource:resource })
//     }).catch(next);
// });
//
//
// router.get('/feed', auth.required, (req, res, next) => {
//     const limit = 20;
//     const offset = 0;
//
//     if(typeof req.query.limit !== 'undefined'){
//         limit = req.query.limit;
//     }
//
//     if(typeof req.query.offset !== 'undefined'){
//         offset = req.query.offset;
//     }
//
//     User.findById(req.payload.id).then((user) => {
//         if (!user) { return res.sendStatus(401); }
//
//     Promise.all([
//         Resource.find({ topic: {$in: user.following}})
//             .limit(Number(limit))
//             .skip(Number(offset))
//             .populate('topic')
//             .exec(),
//         Resource.count({ topic: {$in: user.following}})
//     ]).then((results) => {
//         const articles = results[0];
//         const articlesCount = results[1];
//
//         return res.json({
//             resources: resources.map((article) => {
//                 return resource.toJSONFor(user);
//             }),
//             resourcesCount: resourcesCount
//             });
//         }).catch(next);
//     });
// });
//
// router.post('/', auth.required, (req, res, next) => {
//     User.findById(req.payload.id).then((user) => {
//         if(!user) {return res.sendstatus(401); }
//
//         let resource = new Resource(req.body.resource);
//
//         resource.topic = topic;
//
//         return resource.save().then( function() {
//             //instead of resource.author we doing resource.topic
//             console.log(resource.topic);
//             return res.json({resource: resource.toJSONFor(topic)});
//         });
//     }).catch(next);
// });
//
//
// // return a resource
// router.get('/:resource', auth.optional, (req, res, next) => {
//     Promise.all([
//         req.payload ? User.findById(req.payload.id) : null,
//         req.resource.populate('topic').execPopulate()
//     ]).then(function(results) {
//         var topic = results[0];
//
//         return res.json({resource: req.resource.toJSONFor(topic)});
//     }).catch(next);
// });

// update resources


module.exports = router;
