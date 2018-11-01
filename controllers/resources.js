const express = require('express')

const Resource = require('../models/resource.js')

module.exports = function(app) {

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
            res.render('reviews-show', { resource: resource})
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
