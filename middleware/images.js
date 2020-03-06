const fileMiddleware = require('./files');

const getImageData = async(image) => {
    console.log('imagesMiddleware[getImageData]');
    let fileData = await fileMiddleware.getFileData(image);
    return fileData;
}

module.exports = {
    getImageData: getImageData
}
