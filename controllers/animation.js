const Animation = require('../models/Animation');
const animationMiddleware = require('../middleware/animations');

const getAll = async(req, res) => {
    console.log('AnimationController[getAll]');
    let response = await animationMiddleware.getAll();
    res.json(response);
}

const addAnimation = async(req, res) => {
    console.log('AnimationController[add]');
    let data = req.body;
    let newAnimation = await animationMiddleware.addAnimation(data);
    res.json(newAnimation);
}

const deleteAnimation = async(req, res) => {
    let animation_id = req.query.id;
    let response = await animationMiddleware.deleteAnimation(animation_id);
    res.json(response);
}

const getById = async(req, res) => {
    let animation_id = req.query.id;
    let response = await animationMiddleware.getById(animation_id);
    res.json(response);
}

module.exports = { getAll, addAnimation, deleteAnimation, getById }
