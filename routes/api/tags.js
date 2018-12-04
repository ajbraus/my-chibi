const router = require('express').Router();
const mongoose = require('mongoose');
const Resource = mongoose.model('Resource');

router.get('/', function(req, res, next) {
    Resource.find().distinct('taglist').then( (tags) => {
        return res.json({tags: tags})
    }).catch(next);
});

module.exports = router;
