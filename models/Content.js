const mongoose = require('mongoose');

const Content = mongoose.model('Content',
    {
        type: String, // 'post' / 'profile'
        user_id: String,
        contentType: String,
        url: String,
        cash: Number,
        hearts: Number,
        uploadDate: Date,
        lastUpdate: Date,
        entrance: Number || undefined,
        views: {type: Array, default: []},
        title: {type: String, default: ''}
    });

module.exports=Content;
