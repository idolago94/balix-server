const Emoji = require('../models/Emoji');
const URL = require('../helpers/path');
const fs = require('fs');

const getAll = async(req, res) => {
    console.log('EmojiController[getAll]');
    let response = await Emoji.find();
    res.json(response);
}

const addEmoji = async(req, res) => {
    console.log('EmojiController[add]');
    let data = req.body;
    let newEmoji = new Emoji({
        url: URL.generateUrl('', req.file.path),
        name: data.name,
        value: data.value,
        uploadDate: new Date()
    });
    let response = await newEmoji.save();
    res.json(response);
}

const deleteEmoji = async(req, res) => {
    let emoji_id = req.query.id;
    let response = await Emoji.findByIdAndDelete(emoji_id);
    let path = URL.getPath(response.url);
    fs.unlinkSync(path);
    res.json(response);
}

const updateEmoji = async(req, res) => {
    let emoji_id = req.query.id;
    let update_field = req.body;
    console.log(update_field);
    let response = await Emoji.findByIdAndUpdate(emoji_id, update_field);
    res.json(response);
}

module.exports = { getAll, addEmoji, deleteEmoji, updateEmoji }
