const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');

const ResourceSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    topic: String,
    url: String,
    title: String,
    description: String,
    favoritesCount: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    taglist: [{type: String }],
    //author: { type: mongoose.Schema.Types.ObjectID, ref: 'User'}
}, {timestamps: true});

ResourceSchema.plugin(uniqueValidator, {message: 'is already taken'});

ResourceSchema.pre('validate', (next) => {
    if(!this.slug) {
        this.slugify();
    }

    next();
});

ResourceSchema.methods.slugify = function() {
    this.slug = slug(this.title) + '_' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ResourceSchema.methods.updateFavoriteCount = function() {
    const resource = this;

    return User.count({favorites: {$in: [resource._id]}}).then( function(count){
        resource.favoritesCount = count;

        return resource.save();
    });
};

ResourceSchema.methods.toJSONFor = (user) => {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        taglist: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        //author: this.author.toProfileJSONFor(user)
    }
}

mongoose.model('Resource', ResourceSchema)
