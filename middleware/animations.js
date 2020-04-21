const Animation = require('../models/Animation');

const getAll = async() => {
    console.log('AnimationMiddleware[getAll]');
    let response = await Animation.find();
    return response
}

const addAnimation = async(animationData) => {
    console.log('AnimationMiddleware[add]');
    let newAnimation = new Animation({
        url: animationData.json,
        name: animationData.name,
        uploadDate: new Date()
    });
    let response = await newAnimation.save();
    return response
}

const deleteAnimation = async(id) => {
    let response = await Animation.findByIdAndDelete(id);
    return response
}

const getById = async(id) => {
    let response = await Animation.findById(id);
    return response
}

module.exports = { getAll, addAnimation, deleteAnimation, getById }
