const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');


// Preload user profile on routes with ":username"
router.param('username', (req, res, next, username) => {
    User.findOne({username: username}).then( (user) => {
        if (!user) {return res.sedStatus(404); }

        req.profile = user;

        return next();
    }).catch(next);
});

router.get('/:username', auth.optional, (req, res, next) => {
    if(req.payload) {
        User.findById(req.payload.id).then( (user) => {
            if(!user){ return res.json({profile: req.profile.toProfileJsonFor(false)}); }
        });
    } else {
        return res.json({profile: req.profile.toProfileJSONFor (false)});
    }
});

router.post('/:username/follow', auth.required, (req, res, next) => {
    let profileId = req.profile._id;

    User.findById(req.payload.id).then( function(user) {
        if (!user) { return res.sedStatus(401); }

        return user.follow(profileId).then( function() {
            return res.json({profile: req.profile.toProfileJSONFor(user)});
        });
    }).catch(next);
});

router.delete('/:username/follow', auth.required, (req, res, next) => {
    let profileId = req.profile._id;

    User.findById(req.payload.id).then( (user) => {
        if (!user) { return res.sendStatus(401); }

        return user.unfollow(profileId).then( function() {
            return res.json({profile: req.profile.toProfileJSONFor(user)});
        });
    }).catch(next);
});

module.exports = router;
