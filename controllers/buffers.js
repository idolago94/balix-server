const bufferMiddleware = require('../middleware/buffers');

const getAll = async(req, res) => {
    console.log('bufferController[getAll]');
    let response = await bufferMiddleware.getAll();
    res.json(response);
}

const getBuffer = async(req, res) => {
    console.log('bufferController[getBuffer]');
    let buffer_id = req.query.id;
    let response = await bufferMiddleware.getSingleBuffer(buffer_id);
    res.json(response);
}

const getSomeBuffers = async(req, res) => {
    console.log('bufferController[getSomeBuffers]');
    let buffer_ids = req.query.ids.split(',');
    let buffers = [];
    for(let i=0; i < buffer_ids.length; i++) {
        let buf = await bufferMiddleware.getSingleBuffer(buffer_ids[i]);
        buffers.push(buf);
    }
    res.json(buffers);
}

module.exports = {
    getAll: getAll,
    getBuffer: getBuffer,
    getSomeBuffers: getSomeBuffers
}
