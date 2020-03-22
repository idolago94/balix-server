const Buffer = require('../models/Buffer');
const bufferConvert = require('../helpers/buffer.convert');

const saveBuffer = async(base64) => {
    console.log('bufferMiddleware[saveBuffer]');
    let newBuffer = new Buffer({
        data: bufferConvert.getImageBuffer(base64)
    });
    let response = await newBuffer.save();
    return response;
};

const getSingleBuffer = async(buffer_id) => {
    console.log('bufferMiddleware[getSingleBuffer]');
    return await Buffer.findById(buffer_id);
};

const getAll = async() => {
    console.log('bufferMiddleware[getAll]');
    return Buffer.find({});
}

module.exports = {
    getAll: getAll,
    saveBuffer: saveBuffer,
    getSingleBuffer: getSingleBuffer
}
