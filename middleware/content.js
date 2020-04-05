const Content = require('../models/Content');
const bufferMiddleware = require('./buffers');
const generateUrl = require('../helpers/path');

const saveContent = async(user_id, file, type) => {
    console.log('contentMiddleware[saveContent]');
    // let savedBuffer = await bufferMiddleware.saveBuffer(file.base64);
    let newContent = new Content({
        type: type,
        user_id: user_id,
        contentType: file.mimetype,
        url: generateUrl(file.mimetype, file.path),
        cash: 0,
        hearts: 0,
        uploadDate: new Date(),
        lastUpdate: new Date(),
        entrance: file.entrance
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
    let response = await Content.findByIdAndUpdate(content_id, {...achievements, lastUpdate: new Date()});
    return response;
}

const getAllContents = async() => {
    console.log('contentMiddleware[getAllContents]');
    let response = await Content.find({});
    return response;
}

const getTopContents = async() => {
    let topResponse = await Content.find({type: 'post'}).sort({cash: -1, hearts: -1}).limit(1000);
    return topResponse;
}

module.exports = {
    saveContent: saveContent,
    getSingleContent: getSingleContent,
    getUserContent: getUserContent,
    updateContent: updateContent,
    getAllContents: getAllContents,
    getTopContents: getTopContents
}
