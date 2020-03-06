
const toBase64 = (chunks, fileType) => {
    console.log('convertMiddleware[toBase64]');

    let fileData = [];
    for(let i=0; i<chunks.length;i++){
        fileData.push(chunks[i].data.toString('base64'));
    }
    let finalFile = 'data:' + fileType + ';base64,'
    + fileData.join('');
  return finalFile;
}

const toFileData = (file) => {
    console.log('convertMiddleware[toFileData]');

    let file_id;
    if(file.id) {
        file_id = file.id;
    } else {
        file_id = file.uri.slice('/');
        file_id = file_id[file_id.length-1];
        file_id = file_id.slice(0, file_id.indexOf('.'));
        file_id = `${file_id}-${new Date().getTime()}`;
    }
    return {
        id: file_id,
        contentType: (file.contentType) ? (file.contentType):(getImageType(file.uri)),
        uploadDate: new Date(),
        base64: file.base64,
        cash: 0,
        hearts: 0
    }
};

const getImageType = (fileName) => {
    console.log('convertMiddleware[getImageType]');
    return fileName.slice(fileName.indexOf('.')+1, fileName.length);
}

module.exports = {
    toBase64: toBase64,
    toFileData: toFileData
}
