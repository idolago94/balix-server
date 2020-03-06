const encode = require('base64-arraybuffer');

const getImageBuffer = (base64String) => {
    console.log('buffer.convert[getImageBuffer]');
    return Buffer.from(base64String, 'base64');
};

// const getImageBase64 = (buffer) => {
//     console.log('buffer.convert[getImageBase64]');
//     return new Promise((resolve) => {
//         let base64String = buffer.toString('base64');
//         resolve(base64String);
//     });
// };

module.exports = {
    getImageBuffer: getImageBuffer,
    // getImageBase64: getImageBase64
}
