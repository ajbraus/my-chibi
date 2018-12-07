const mongoose = require('mongoose');
const Resource = mongoose.model('Resource');
const router = require('express').Router();

router.get('/', function(req, res, next) {
    Resource.find().distinct('taglist').then( (tags) => {
        return res.json({tags: tags})
    }).catch(next);
});

module.exports = router;
