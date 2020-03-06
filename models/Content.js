const mongoose = require('mongoose');

const Content = mongoose.model('Content',
    {
        type: String, // 'post' / 'profile'
        user_id: String,
        contentType: String,
        buffer: Buffer,
        cash: Number,
        hearts: Number,
        uploadDate: Date,
        lastUpdate: Date
    });

module.exports=Content;
