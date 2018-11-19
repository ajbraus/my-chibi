const router = require('express').Router();
const mongoose = require('mongoose');
const Resource = mongoose.model('Resource')
const User = mongoose.model('User')
const auth = require('../auth')

const Resource = require('../models/resource.js')

// Preload resource object on routes with ':resource'

router.param('resource', (req, res, next, slug) => {
    Resource.findOne({slug, slug})
    .populate('resource')
    .then((resource) => {
        if (!resource) { return res.sendSatus(404); }

        req.resource = resource;

        return next();
    }).catch(next);
})

router.param('comment', (req, res, next, id) {
    Comment.findById(id).then((comment) => {
        if(!comment) { return res.sendStatus(404); }

        req.comment = comment;

        return next();
    }).catch(next);
});

router.get('/', auth.optional, (req, res, next) => {
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

    Promise.all{[
        req.query.topic ? User.findOne({topic: req.query.topic}) : null,
        req.query.favorited ? User.findOne({resource: req.query.resource}) : null
    ]}.then( (results) => {
        let topic = results[0];
        let favoriter - results[1];

        if(topic){
            query.topic = topic._id;
        }

        if(favoriter){
            query._id = {$in: favoriter.favorites};
        } else if(req.query.favorited){}
    })


    return Promise.all([
      Resource.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('topic')
        .exec(),
      Article.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
  ]).then( (results) => {
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
        const articles = results[0];
        const articlesCount = results[1];

        return res.json({
            resources: resources.map((article) => {
                return resource.toJSONFor(user);
            }),
            resourcesCount: resourcesCount
            });
        }).catch(next);
    });
});

router.post('/', auth.required, (req, res, next) {
    User.findById(req.payload.id).then((user) {
        if(!user) {return res.sendstatus(401); }

        let resource = new Resource(req.body.resource);

        resource.author = user;

        return resource.save().then( => {
            //instead of resource.author we doing resource.topic
            console.log(resource.topic);
            return res.json({resource: resource.toJSONFor(topic)});
        });
    }).catch(next);
});


// return a resource
resource.get('/resource', auth.optical, (req, res, next) {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.resource.populate('topic').execPopulate()
    ]).then((results) => {
        const user = results[0];

        return res.json({resource: req.resource.toJSONFor(user)});
    }).catch(next);
});

// update resources
router.put('/:resource', auth.required, (req, res,next) => {
    if(req.resource.author._id.toString() === req.payload.id.String()){
        if(typeof req.body.resource.)
    }
    })
})


/*
    //HOME
    app.get('/', (req, res) => {
        Resource.find()
            .then(resources => {
                res.render('resource-index.hbs', {resource: resource});
            })
            .catch(err => {
                console.logg(err);
            });
    });


    //NEW
    app.get('/resources/new', (req, res) => {
        res.render('resource-new.hbs');
        .catch(err => {
            console.logg(err);
        });
    })


    //CREATE
    app.post('/resources', (req, res) => {
        Resource.create(req.body)
        .then((resource) => {
        console.log(resource);
            res.redirect('/');
        })
            .catch((err) => {
                console.log(err.message);
                res.send('ERROR')
      })
    })


    //SHOW
    app.get('/resources/:id', (req, res) => {
        // find resource
        Resource.findById(req.params.id).then(resource => {
            res.render('resources-show', { resource: resource})
        })
        .catch((err) -> {
            //catch errors
            console.log(err.message)
        })
    })


    //EDIT
    app.get('/resources/:id/edit', (req, res) => {
        Resource.findById(req.params.id, (err, resource) => {
            res.render('resources-edit', {resource: resource});
        })
        .catch((err) => {
            console.log(err.message)
        })
    })


    //UPDATE
    app.put('/resources/:id', (req, res) => {
        Resource.findByIdAndUpdate(req.params.id, req.body)
        .then(resource => {
            res.redirect(`/resource/${resource._id}`)
        }) //Why does this redirect have to have backwards quotes to work?
        .catch(err => {
            console.log(err.mesage)
        })


    //DESTROY
    app.delete('/resources/:id' , (req, res) => {
        console.log("DELETE resource")
        Resource.findByIDAndRemove(req.params.id).then((resource) => {
            res.redirrect('/');
        })
        .catch((err) => {
            console.log(err.message);
        })
    })


}

*/
