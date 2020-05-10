const mongoose = require('mongoose');

const Content = mongoose.model('Content',
    {
        type: String, // 'post' / 'profile'
        user_id: String,
        mimetype: String,
        url: String,
        cash: Number,
        hearts: Number,
        uploadDate: {type: Date, default: new Date()},
        lastUpdate: {type: Date, default: new Date()},
        entrance: Number || undefined,
        views: {type: Array, default: []},
        title: {type: String, default: ''},
        report: {type: Array, default: []}
    });

module.exports=Content;
