const Content = require('../models/Content');
const bufferConvert = require('../helpers/buffer.convert');
const userMiddleware = require('./users');

const saveContent = async(user_id, file, type) => {
    console.log('contentMiddleware[saveContent]');
    // let user_upload = await userMiddleware.getUser(user_id);
    let newContent = new Content({
        type: type,
        user_id: user_id,
        contentType: file.contentType,
        buffer: bufferConvert.getImageBuffer(file.base64),
        cash: 0,
        hearts: 0,
        uploadDate: new Date(),
        lastUpdate: new Date()
    });
    let response = await newContent.save();
    return response;
};

const getSingleContent = async(content_id) => {
    console.log('contentMiddleware[getSingleContent]');
    return Content.findById(content_id);
};

const getUserContent = async(user_id) => {
    console.log('contentMiddleware[getUserContent]');
    let response = await Content.find({user_id: user_id, type: 'post'});
    return response;
}

const updateContent = async(content_id, achievements) => {
    console.log('contentMiddleware[updateContent]');
    let response = await Content.findByIdAndUpdate(content_id, {
        cash: achievements.cash,
        hearts: achievements.hearts,
        lastUpdate: new Date()
    });
    return response;
}

const getAllContents = async() => {
    console.log('contentMiddleware[getAllContents]');
    let response = await Content.find({});
    return response;
}

module.exports = {
    saveContent: saveContent,
    getSingleContent: getSingleContent,
    getUserContent: getUserContent,
    updateContent: updateContent,
    getAllContents: getAllContents
}
